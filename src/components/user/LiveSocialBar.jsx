import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, TrendingUp, Zap } from 'lucide-react';

const FOOD_EMOJIS = ['🍛', '🍜', '🥘', '🍱', '🥗', '🫓', '🍔', '🧆'];

export default function LiveSocialBar({ orderCount = 0 }) {
    const [liveCount, setLiveCount] = useState(12);
    const [recentOrder, setRecentOrder] = useState(null);

    const MOCK_NAMES = ['Arjun', 'Priya', 'Rohit', 'Sneha', 'Karan', 'Ananya'];
    const MOCK_FOODS = ['Biryani', 'Masala Dosa', 'Veg Thali', 'Paneer Roll', 'Filter Coffee'];

    useEffect(() => {
        // Live user count fluctuation
        const countInterval = setInterval(() => {
            setLiveCount(prev => Math.max(5, prev + (Math.random() > 0.5 ? 1 : -1)));
        }, 8000);

        // Random recent orders
        const orderInterval = setInterval(() => {
            setRecentOrder({
                name: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
                food: MOCK_FOODS[Math.floor(Math.random() * MOCK_FOODS.length)],
                emoji: FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)],
            });

            setTimeout(() => setRecentOrder(null), 3800);
        }, 6500);

        return () => {
            clearInterval(countInterval);
            clearInterval(orderInterval);
        };
    }, []);

    return (
        <div className="flex flex-wrap items-center gap-3 mb-5">
            {/* Live Users */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-3.5 py-1.5 rounded-full text-xs font-semibold text-green-700 dark:text-green-400"
            >
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <Users className="w-3.5 h-3.5" />
                {liveCount} ordering now
            </motion.div>

            {/* Today's Orders */}
            {orderCount > 0 && (
                <div className="flex items-center gap-1.5 bg-primary/10 px-3.5 py-1.5 rounded-full text-xs font-semibold text-primary">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {orderCount} orders today
                </div>
            )}

            {/* Recent Order Notification */}
            <AnimatePresence>
                {recentOrder && (
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3.5 py-1.5 rounded-full text-xs font-medium text-amber-700 dark:text-amber-400"
                    >
                        <Zap className="w-3.5 h-3.5" />
                        {recentOrder.name} just ordered {recentOrder.emoji} {recentOrder.food}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}