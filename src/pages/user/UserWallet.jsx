// src/pages/user/UserWallet.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getWallet, addWalletMoney } from '../../services/wallet';
import UserNav from '../../components/user/UserNav';
import { toast } from 'sonner';

const QUICK_AMOUNTS = [50, 100, 200, 500];

export default function UserWallet() {
    const { user } = useAuth();
    const [wallet, setWallet] = useState(() => getWallet(user?.id));
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddMoney = (value) => {
        const num = Number(value || amount);
        if (num < 10) {
            toast.error("Minimum amount is ₹10");
            return;
        }

        setLoading(true);
        setTimeout(() => {
            const updated = addWalletMoney(user.id, num, "Added via Wallet");
            setWallet(updated);
            setAmount('');
            setLoading(false);
            toast.success(`₹${num} added successfully!`);
        }, 700);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <UserNav />
            <div className="max-w-lg mx-auto px-4 pt-6">
                <h1 className="text-3xl font-bold mb-8">My Wallet</h1>

                {/* Balance Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-3xl p-8 mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Wallet size={28} />
                        <span className="opacity-90">Available Balance</span>
                    </div>
                    <p className="text-5xl font-bold">₹{wallet.balance}</p>
                    <p className="text-sm opacity-75 mt-1">5% cashback on every order</p>
                </motion.div>

                {/* Add Money */}
                <div className="bg-card border border-border rounded-3xl p-6 mb-8">
                    <h3 className="font-semibold mb-4">Add Money</h3>
                    <div className="flex flex-wrap gap-3 mb-6">
                        {QUICK_AMOUNTS.map(am => (
                            <button
                                key={am}
                                onClick={() => handleAddMoney(am)}
                                className="px-6 py-3 bg-muted hover:bg-primary hover:text-primary-foreground rounded-2xl font-medium transition"
                            >
                                ₹{am}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Custom amount"
                            className="flex-1 px-5 py-4 rounded-2xl border border-border bg-input"
                            min="10"
                        />
                        <button
                            onClick={() => handleAddMoney(amount)}
                            disabled={loading}
                            className="px-8 bg-primary text-primary-foreground rounded-2xl font-semibold disabled:opacity-70"
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* Transaction History */}
                <div>
                    <h3 className="font-semibold mb-4">Recent Transactions</h3>
                    {wallet.transactions?.length > 0 ? (
                        <div className="space-y-3">
                            {wallet.transactions.map(tx => (
                                <div key={tx.id} className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {tx.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-medium">{tx.description}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <p className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-12">No transactions yet</p>
                    )}
                </div>
            </div>
        </div>
    );
}