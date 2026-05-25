// src/pages/admin/AdminControls.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Power, Bell, Megaphone, Hash, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import AdminNav from '@/components/admin/AdminNav';
import { isOrderingEnabled, setKillSwitch, broadcastNotice, clearNotice, getEmergencyNotice } from '@/services/notifications';
import { getItem, KEYS } from '@/lib/storage';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function AdminControls() {
    const [ordering, setOrdering] = useState(isOrderingEnabled());
    const [noticeMsg, setNoticeMsg] = useState('');
    const [activeNotice, setActiveNotice] = useState(getEmergencyNotice());
    const [coupons, setCoupons] = useState(() => getItem(KEYS.COUPONS) || []);

    const toggleOrdering = (val) => {
        setKillSwitch(!val);
        setOrdering(val);
        toast.success(val ? '✅ Ordering resumed' : '🔴 Ordering paused');
    };

    const handleBroadcast = () => {
        if (!noticeMsg.trim()) return;
        broadcastNotice(noticeMsg);
        setActiveNotice(getEmergencyNotice());
        setNoticeMsg('');
        toast.success('Notice broadcasted successfully!');
    };

    const handleClearNotice = () => {
        clearNotice();
        setActiveNotice({ active: false, message: '' });
        toast.success('Emergency notice cleared');
    };

    return (
        <div className="min-h-screen bg-background">
            <AdminNav />
            <div className="md:ml-64 p-4 md:p-6 max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                    Admin Superpowers
                </h1>

                {/* Kill Switch */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`glass rounded-2xl p-6 mb-6 border ${!ordering ? 'border-red-400/40' : 'border-green-400/40'}`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${ordering ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                <Power className={`w-6 h-6 ${ordering ? 'text-green-600' : 'text-red-600'}`} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Live Kill Switch</h3>
                                <p className="text-sm text-muted-foreground">{ordering ? '🟢 Accepting orders' : '🔴 Orders paused'}</p>
                            </div>
                        </div>
                        <Switch checked={ordering} onCheckedChange={toggleOrdering} />
                    </div>
                    {!ordering && (
                        <div className="mt-4 bg-red-50 dark:bg-red-900/20 rounded-xl p-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <p className="text-xs text-red-600 dark:text-red-400">New orders are currently blocked for all users.</p>
                        </div>
                    )}
                </motion.div>

                {/* Emergency Broadcast */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-2xl p-6 mb-6"
                >
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Megaphone className="w-5 h-5" /> Emergency Broadcast
                    </h3>

                    {activeNotice.active && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-400/30 rounded-xl p-4 mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bell className="w-5 h-5 text-amber-600" />
                                <p className="text-sm">{activeNotice.message}</p>
                            </div>
                            <button onClick={handleClearNotice} className="text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Input
                            placeholder="e.g. Kitchen closes early today at 7 PM"
                            value={noticeMsg}
                            onChange={(e) => setNoticeMsg(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleBroadcast()}
                            className="rounded-xl"
                        />
                        <Button onClick={handleBroadcast} className="rounded-xl">Broadcast</Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                        {['Kitchen closing early', 'No non-veg today', 'Power outage — cash only', 'Menu updated'].map((text) => (
                            <button
                                key={text}
                                onClick={() => setNoticeMsg(text)}
                                className="text-xs px-3 py-1.5 bg-muted rounded-full hover:bg-muted/80 transition-colors"
                            >
                                {text}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Token Display Board */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="glass rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Hash className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold">Token Display Board</h3>
                                <p className="text-sm text-muted-foreground">Live board with voice announcements</p>
                            </div>
                        </div>
                        <Link to="/token-display">
                            <Button variant="outline" className="rounded-xl">Open Board</Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}