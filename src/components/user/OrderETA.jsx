import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';

export default function OrderETA({ order }) {
    if (!order?.estimatedReadyTime) return null;

    const readyTime = new Date(order.estimatedReadyTime);
    const now = new Date();
    const minutesLeft = Math.max(0, Math.ceil((readyTime - now) / 60000));

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-4 flex items-center gap-4 border border-blue-400/30 bg-blue-50/30 dark:bg-blue-900/10"
        >
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>

            <div className="flex-1">
                <p className="text-sm font-semibold">Estimated Ready Time</p>
                <p className="text-xs text-muted-foreground">
                    {readyTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>

            <div className="text-right">
                <motion.span
                    key={minutesLeft}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="font-mono text-2xl font-bold text-blue-600 dark:text-blue-400"
                >
                    {minutesLeft}
                </motion.span>
                <span className="text-xs text-blue-600/70 dark:text-blue-400/70 block -mt-1">min</span>
            </div>

            {minutesLeft <= 10 && (
                <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
            )}
        </motion.div>
    );
}