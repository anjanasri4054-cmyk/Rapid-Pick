// src/pages/kitchen/KitchenLogin.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { ChefHat } from 'lucide-react';
import ThemeToggle from '../../components/shared/ThemeToggle';

export default function KitchenLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [form, setForm] = useState({ email: 'kitchen@canteen.com', password: 'kitchen123' });
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const ok = login(email, password);
        if (ok) navigate('/kitchen/dashboard');
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
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                        <ChefHat size={32} className="text-white" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center mb-2">Kitchen Login</h1>
                <p className="text-center text-muted-foreground mb-8">CanteenGo Kitchen Station</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <Label>Email</Label>
                        <input
                            type="email"
                            placeholder="Staff Email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl border border-border bg-input"
                            required
                        />
                    </div>
                    <div>
                        <Label>Password</Label>

                        <input
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl border border-border bg-input"
                            required
                        />
                    </div>



                    <button
                        type="submit"
                        className="w-full py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition"
                    >
                        Login to Kitchen Panel
                    </button>
                </form>
            </motion.div>
        </div>
    );
}