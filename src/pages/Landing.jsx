// src/pages/Landing.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ShieldCheck, ChefHat, Sparkles, Star, Clock, Zap, ArrowRight } from 'lucide-react';
import ThemeToggle from '../components/shared/ThemeToggle';

const TYPING_TEXTS = [
    'Order before you walk...',
    'Ready when you arrive...',
    'Skip the queue, grab & go...',
    'Fresh food, zero wait...',
];
const FLOATING_EMOJIS = ['🍔', '🍛', '🍱', '☕', '🥗', '🍕', '🧆', '🌮', '🥘', '🍜', '🍩', '🥞'];

function FloatingEmoji({ emoji, style }) {
    return (
        <motion.div
            className="absolute text-3xl select-none pointer-events-none"
            style={style}
            animate={{
                y: [0, -18, 0],
                rotate: [-6, 6, -6],
                opacity: [0.18, 0.35, 0.18],
            }}
            transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 3,
            }}
        >
            {emoji}
        </motion.div>
    );
}
function TypingText() {
    const [index, setIndex] = useState(0);
    const [displayed, setDisplayed] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const target = TYPING_TEXTS[index];

        if (!isDeleting && displayed.length < target.length) {
            const timeout = setTimeout(() => {
                setDisplayed(target.slice(0, displayed.length + 1));
            }, 60);
            return () => clearTimeout(timeout);
        }

        if (!isDeleting && displayed.length === target.length) {
            const timeout = setTimeout(() => setIsDeleting(true), 1800);
            return () => clearTimeout(timeout);
        }

        if (isDeleting && displayed.length > 0) {
            const timeout = setTimeout(() => {
                setDisplayed(displayed.slice(0, -1));
            }, 35);
            return () => clearTimeout(timeout);
        }

        if (isDeleting && displayed.length === 0) {
            setIsDeleting(false);
            setIndex((prev) => (prev + 1) % TYPING_TEXTS.length);
        }
    }, [displayed, isDeleting, index]);

    return (
        <span className="text-primary">
            {displayed}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-0.5 h-5 bg-primary ml-1 align-middle"
            />
        </span>
    );
}
const STATS = [
    { icon: Star, value: '4.9★', label: 'Rating' },
    { icon: Clock, value: '<10m', label: 'Avg Wait' },
    { icon: Zap, value: '500+', label: 'Daily Orders' },
];
export default function Landing() {
    const floaters = FLOATING_EMOJIS.map((e, i) => ({
        emoji: e,
        style: {
            left: `${5 + (i * 8.2) % 90}%`,
            top: `${8 + (i * 13.7) % 80}%`,
        },
    }));

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden relative">

            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-[#1a0f00] dark:via-[#1c1000] dark:to-[#1a0a0a]" />
            <div className="absolute top-0 -z-10 right-0 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 -z-10 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

            {/* Floating emojis */}
            {floaters.map((f, i) => <FloatingEmoji key={i} {...f} />)}
            {/* Navbar */}
            <div className="relative z-10">
                <header className="flex items-center justify-between px-6 py-5 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                            <UtensilsCrossed size={24} className="text-white" />
                        </div>
                        <div>
                            <div className="font-bold text-2xl">CanteenGo</div>
                            <div className="text-xs text-muted-foreground -mt-1">Campus Foods</div>
                        </div>
                    </div>
                    <ThemeToggle />
                </header>

                {/* Hero Section */}
                <main className="flex-1 flex items-center justify-center px-6 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl text-center"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 text-sm font-medium text-primary mb-8"
                        >
                            <Sparkles size={16} /> Smart Ordering • Live Tracking
                        </motion.div>

                        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                            Skip the Queue,<br />
                            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                Grab & Go
                            </span>
                        </h1>

                        <p className="text-xl text-muted-foreground mb-8 min-h-[28px]">
                            <TypingText />
                        </p>

                        <p className="text-muted-foreground text-lg max-w-md mx-auto mb-12">
                            Pre-order • Get token • Walk in and collect.<br />
                            Zero waiting. Fresh food every time.
                        </p>
                        {/* Stats */}
                        <div className="flex justify-center gap-6 mb-10">
                            {STATS.map(({ icon: Icon, value, label }) => (
                                <div key={label} className="text-center">
                                    <div className="flex items-center justify-center gap-1 mb-0.5">
                                        <Icon className="w-3.5 h-3.5 text-primary" />
                                        <span className="font-bold text-sm">{value}</span>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground">{label}</span>
                                </div>
                            ))}
                        </div>
                        {/* Role Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                            <Link to="/user/login" className="group">
                                <motion.div
                                    whileHover={{ scale: 1.04, y: -8 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="bg-card border-2 border-border hover:border-primary/50 rounded-3xl p-8 h-full transition-all cursor-pointer"
                                >
                                    <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center text-4xl">
                                        🍔
                                    </div>
                                    <h3 className="font-bold text-xl mb-2">Student / User</h3>
                                    <p className="text-muted-foreground">Order food & track live</p>
                                </motion.div>
                            </Link>

                            <Link to="/kitchen/login" className="group">
                                <motion.div
                                    whileHover={{ scale: 1.04, y: -8 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="bg-card border-2 border-border hover:border-blue-500/50 rounded-3xl p-8 h-full transition-all cursor-pointer"
                                >
                                    <div className="w-16 h-16 mx-auto mb-6 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                                        <ChefHat size={36} className="text-blue-600" />
                                    </div>
                                    <h3 className="font-bold text-xl mb-2">Kitchen Staff</h3>
                                    <p className="text-muted-foreground">Manage orders & batches</p>
                                </motion.div>
                            </Link>

                            <Link to="/admin/login" className="group">
                                <motion.div
                                    whileHover={{ scale: 1.04, y: -8 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="bg-card border-2 border-border hover:border-accent/50 rounded-3xl p-8 h-full transition-all cursor-pointer"
                                >
                                    <div className="w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-2xl flex items-center justify-center">
                                        <ShieldCheck size={36} className="text-accent" />
                                    </div>
                                    <h3 className="font-bold text-xl mb-2">Admin Panel</h3>
                                    <p className="text-muted-foreground">Full canteen control</p>
                                </motion.div>
                            </Link>
                        </div>
                    </motion.div>
                </main>

                {/* Footer */}
                <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border">
                    © 2026 CanteenGo • All data stored locally in browser
                </footer>
            </div>
        </div>
    );
}