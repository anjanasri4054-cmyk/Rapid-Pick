import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Users } from 'lucide-react';
import { getItem, KEYS } from '../../lib/storage';

const CHEFS = ['Rajan', 'Priya', 'Suresh', 'Meena', 'Arjun'];

function getChefName(orderId) {
    const idx = orderId.charCodeAt(orderId.length - 1) % CHEFS.length;
    return CHEFS[idx];
}

function getQueuePos(order, orders) {
    const activeOrders = orders
        .filter(o => ['pending', 'preparing'].includes(o.status) && new Date(o.createdAt) <= new Date(order.createdAt))
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return activeOrders.findIndex(o => o.id === order.id) + 1;
}

function calcTotalSeconds(order, queuePos) {
    const base = 10 * 60;
    const itemTime = order.items.reduce((s, i) => s + (i.prepTime || 5) * 60, 0);
    const queueTime = Math.max(0, queuePos - 1) * 60;
    return base + itemTime + queueTime;
}

function FlipDigit({ value }) {
    return (
        <motion.span
            key={value}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-mono font-black tabular-nums inline-block"
        >
            {value}
        </motion.span>
    );
}

export default function PreparingStage({ order, allOrders }) {
    const [secondsLeft, setSecondsLeft] = useState(null);
    const chef = getChefName(order.id);
    const queuePos = getQueuePos(order, allOrders || []);

    const totalSecs = calcTotalSeconds(order, queuePos);
    const placedAt = new Date(order.createdAt).getTime();

    const compute = useCallback(() => {
        const elapsed = Math.floor((Date.now() - placedAt) / 1000);
        return Math.max(0, totalSecs - elapsed);
    }, [placedAt, totalSecs]);

    useEffect(() => {
        setSecondsLeft(compute());
        const iv = setInterval(() => setSecondsLeft(compute()), 1000);
        return () => clearInterval(iv);
    }, [compute]);

    if (secondsLeft === null) return null;

    const pct = Math.max(0, Math.min(100, ((totalSecs - secondsLeft) / totalSecs) * 100));
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    const mStr = String(mins).padStart(2, '0');
    const sStr = String(secs).padStart(2, '0');

    const readyAt = new Date(placedAt + totalSecs * 1000);
    const readyStr = readyAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Countdown */}
            <div className="glass rounded-3xl p-6 text-center border border-blue-400/30 bg-blue-50/30 dark:bg-blue-900/10">
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">Your order will be ready in</p>

                <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="flex gap-0.5 text-5xl md:text-7xl text-blue-700 dark:text-blue-300">
                        <AnimatePresence mode="popLayout">
                            <FlipDigit value={mStr[0]} />
                            <FlipDigit value={mStr[1]} />
                        </AnimatePresence>
                    </div>
                    <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-5xl md:text-7xl font-black text-blue-400 mb-1">:</motion.span>
                    <div className="flex gap-0.5 text-5xl md:text-7xl text-blue-700 dark:text-blue-300">
                        <AnimatePresence mode="popLayout">
                            <FlipDigit value={sStr[0]} />
                            <FlipDigit value={sStr[1]} />
                        </AnimatePresence>
                    </div>
                </div>

                <p className="text-xs text-muted-foreground mb-4">Ready by {readyStr}</p>

                <div className="relative h-4 bg-muted rounded-full overflow-hidden mx-auto max-w-xs">
                    <motion.div className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" animate={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">{Math.round(pct)}% done</p>
            </div>

            {/* Chef & Queue */}
            <div className="grid grid-cols-2 gap-3">
                <div className="glass rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <ChefHat className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground">Your Chef</p>
                        <p className="font-bold text-sm">{chef}</p>
                    </div>
                </div>
                <div className="glass rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground">Queue Position</p>
                        <p className="font-bold text-sm">#{queuePos} in line</p>
                    </div>
                </div>
            </div>
            {/* Animated cooking icons */}
            <div className="glass rounded-2xl p-4 flex items-center justify-center gap-6">
                {['🍳', '🔥', '♨️', '🍽️', '⏰'].map((emoji, i) => (
                    <motion.span
                        key={i}
                        className="text-2xl"
                        animate={{ y: [0, -8, 0], rotate: [0, i % 2 === 0 ? 10 : -10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
                    >
                        {emoji}
                    </motion.span>
                ))}
            </div>
        </motion.div>
    );
}