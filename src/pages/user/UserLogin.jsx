import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UtensilsCrossed, ArrowLeft, Eye, EyeOff, UserPlus, LogIn, Phone, Mail, User, Lock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import ThemeToggle from '../../components/shared/ThemeToggle';

export default function UserLogin() {
    const [mode, setMode] = useState('login'); // 'login' | 'signup'
    const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(r => setTimeout(r, 400));
        if (mode === 'login') {
            const ok = login(form.email, form.password);
            if (ok) navigate('/user/dashboard');
        } else {
            const ok = signup({ name: form.name, email: form.email, mobile: form.mobile, password: form.password });
            if (ok) navigate('/user/dashboard');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-[#1a0f00] dark:via-[#1c1000] dark:to-[#1a0a0a]" />
            <div className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-sm">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <UtensilsCrossed className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold">Rapid Pick</span>
                    </div>
                    <ThemeToggle />
                </div>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-3xl p-6 shadow-2xl"
                >
                    {/* Tabs */}
                    <div className="flex gap-1 bg-muted rounded-2xl p-1 mb-6">
                        {[{ id: 'login', label: 'Login', icon: LogIn }, { id: 'signup', label: 'Sign Up', icon: UserPlus }].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setMode(id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all ${mode === id ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5" /> {label}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.form
                            key={mode}
                            initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            {mode === 'signup' && (
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input placeholder="Full Name" className="pl-10 rounded-xl h-11" value={form.name}
                                        onChange={e => update('name', e.target.value)} required />
                                </div>
                            )}
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input type="email" placeholder="Email address" className="pl-10 rounded-xl h-11" value={form.email}
                                    onChange={e => update('email', e.target.value)} required />
                            </div>
                            {mode === 'signup' && (
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input placeholder="Mobile number" className="pl-10 rounded-xl h-11" value={form.mobile}
                                        onChange={e => update('mobile', e.target.value)} />
                                </div>
                            )}
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input type={showPass ? 'text' : 'password'} placeholder="Password" className="pl-10 pr-10 rounded-xl h-11"
                                    value={form.password} onChange={e => update('password', e.target.value)} required />
                                <button type="button" onClick={() => setShowPass(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            <Button type="submit" disabled={loading}
                                className="w-full h-11 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 border-0">
                                {loading ? (
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                ) : mode === 'login' ? 'Login to Order' : 'Create Account'}
                            </Button>
                        </motion.form>
                    </AnimatePresence>

                    {/* Demo creds */}
                    <div className="mt-4 p-3 bg-muted/60 rounded-xl">
                        <p className="text-[10px] text-muted-foreground text-center font-medium mb-1">Demo credentials</p>
                        <p className="text-[10px] text-center text-muted-foreground">user@demo.com · demo123</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}