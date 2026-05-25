import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, PartyPopper, AlertCircle } from 'lucide-react';
import { getItem, KEYS } from '../../lib/storage';

function getTimerState(order) {
    const timers = getItem(KEYS.ORDER_TIMERS) || {};
    const timer = timers[order.id];
    if (!timer && !order.timerStartedAt) return null;

    const startedAt = timer?.startedAt || order.timerStartedAt;
    const duration = timer?.duration || order.timerDuration || 600; // default 10 minutes
    const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
    const remaining = Math.max(0, duration - elapsed);

    return {
        remaining,
        duration,
        pct: Math.max(0, (remaining / duration) * 100)
    };
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
}

export default function OrderTimer({ order, compact = false }) {
    const [state, setState] = useState(() => getTimerState(order));

    useEffect(() => {
        if (['completed', 'ready', 'cancelled'].includes(order.status)) return;

        const interval = setInterval(() => {
            setState(getTimerState(order));
        }, 1000);

        return () => clearInterval(interval);
    }, [order.id, order.status]);

    if (!state) return null;

    const { remaining, pct } = state;
    const isReady = order.status === 'ready';
    const isUrgent = remaining <= 60 && remaining > 0;
    const isAlmost = remaining <= 300 && remaining > 60;
    const isExpired = remaining === 0 && !isReady;

    if (isReady) {
        return (
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`${compact ? 'p-3' : 'p-5'} rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white text-center`}
            >
                <PartyPopper className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} mx-auto mb-2`} />
                <p className="font-bold text-lg">READY FOR PICKUP 🎉</p>
            </motion.div>
        );
    }

    if (isExpired) {
        return (
            <motion.div
                animate={{ x: [-3, 3, -3, 3, 0] }}
                className={`${compact ? 'p-3' : 'p-5'} rounded-2xl bg-red-500/10 border border-red-400/30 text-center`}
            >
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-500" />
                <p className="font-semibold text-red-600 dark:text-red-400">Order is delayed</p>
            </motion.div>
        );
    }

    return (
        <div className="glass rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    {isUrgent ? <Zap className="text-red-500 animate-pulse" /> : <Clock className="text-primary" />}
                    <span className="font-medium text-sm">Ready in</span>
                </div>
                <motion.span
                    key={remaining}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`font-mono font-bold text-xl ${isUrgent ? 'text-red-500' : 'text-primary'}`}
                >
                    {formatTime(remaining)}
                </motion.span>
            </div>

            <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${isUrgent ? 'bg-red-500' : 'bg-primary'}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}