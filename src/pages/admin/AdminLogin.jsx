// src/pages/admin/AdminLogin.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Updated import
import { ShieldCheck } from 'lucide-react';
import ThemeToggle from '../../components/shared/ThemeToggle';

export default function AdminLogin() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: 'admin@canteen.com', password: 'admin123' });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const res = login(form.email, form.password);

        if (res.success && res.user?.role === 'admin') {
            navigate('/admin/dashboard');
        } else {
            setError('Invalid admin credentials');
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="absolute top-6 right-6">
                <ThemeToggle />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-card border border-border rounded-3xl p-10 shadow-xl"
            >
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                        <ShieldCheck size={28} className="text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Admin Login</h1>
                        <p className="text-sm text-muted-foreground">CanteenGo Control Panel</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="email"
                        placeholder="Admin Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />

                    {error && (
                        <p className="text-red-500 text-sm bg-red-50 dark:bg-red-950 p-3 rounded-2xl">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-2xl hover:bg-primary/90 transition"
                    >
                        Login as Admin
                    </button>
                </form>
            </motion.div>
        </div>
    );
}