// src/pages/user/UserRewards.jsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { getUserBadges, getUserStreak, getLeaderboard } from '../../services/gamification';
import UserNav from '../../components/user/UserNav';

const ALL_BADGES = [
    { id: 'early_bird', name: 'Early Bird 🌅', desc: 'Ordered before 9 AM' },
    { id: 'spicy_lover', name: 'Spicy Lover 🌶️', desc: '5+ spicy orders' },
    { id: 'loyal', name: 'Regular 🎖️', desc: '10+ total orders' },
    { id: 'big_spender', name: 'Foodie 💰', desc: 'Spent ₹500+' },
    { id: 'streak_3', name: 'On Fire 🔥', desc: '3-day streak' },
    { id: 'veg_hero', name: 'Veg Hero 🥗', desc: 'Only veg orders' },
    { id: 'night_owl', name: 'Night Owl 🦉', desc: 'Ordered after 8 PM' },
];

export default function UserRewards() {
    const { user } = useAuth();
    const { getUserOrders } = useOrders();

    const orders = getUserOrders(user?.id);
    const earnedBadges = useMemo(() => getUserBadges(user?.id), [orders]);
    const streak = getUserStreak(user?.id);
    const leaderboard = useMemo(() => getLeaderboard(), []);
    const totalSpend = orders.reduce((sum, o) => sum + (o.finalAmount || o.totalAmount || 0), 0);

    return (
        <div className="min-h-screen bg-background pb-20">
            <UserNav />
            <div className="max-w-lg mx-auto px-4 pt-6 space-y-8">
                <h1 className="text-3xl font-bold">Rewards & Achievements</h1>

                {/* Streak Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-3xl p-8"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="opacity-80 text-sm">Current Streak</p>
                            <p className="text-5xl font-bold">{streak} <span className="text-3xl">🔥</span></p>
                            <p className="text-sm opacity-80 mt-1">days in a row</p>
                        </div>
                        <Flame className="w-20 h-20 opacity-30" />
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Orders', value: orders.length },
                        { label: 'Spent', value: `₹${totalSpend}` },
                        { label: 'Badges', value: earnedBadges.length }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-card border border-border rounded-3xl p-5 text-center"
                        >
                            <p className="text-3xl font-bold">{stat.value}</p>
                            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Badges */}
                <div>
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Star className="text-amber-500" /> Your Badges
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {ALL_BADGES.map(badge => {
                            const unlocked = earnedBadges.some(b => b.id === badge.id);
                            return (
                                <div
                                    key={badge.id}
                                    className={`p-5 rounded-3xl border ${unlocked ? 'border-primary bg-primary/5' : 'border-border opacity-60'}`}
                                >
                                    <p className="text-3xl mb-2">{badge.name.split(' ').pop()}</p>
                                    <p className="font-semibold">{badge.name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{badge.desc}</p>
                                    {unlocked && <p className="text-primary text-xs font-bold mt-2">✓ UNLOCKED</p>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Leaderboard */}
                <div>
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Trophy className="text-amber-500" /> Leaderboard
                    </h3>
                    {leaderboard.length > 0 ? (
                        <div className="space-y-3">
                            {leaderboard.map((entry, idx) => (
                                <div key={entry.userId} className="bg-card border border-border rounded-2xl p-4 flex items-center">
                                    <div className="w-8 text-xl font-bold text-center">
                                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                                    </div>
                                    <div className="flex-1 ml-3">
                                        <p className="font-medium">{entry.userName}</p>
                                        <p className="text-xs text-muted-foreground">{entry.totalOrders} orders</p>
                                    </div>
                                    <p className="font-bold text-primary">₹{entry.totalSpend}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">No leaderboard data yet. Be the first!</p>
                    )}
                </div>
            </div>
        </div>
    );
}