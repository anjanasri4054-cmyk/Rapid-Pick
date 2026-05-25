// src/pages/user/UserDashboard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { getWallet } from '../../services/wallet';
import { Clock, ShoppingBag, Wallet, ArrowRight } from 'lucide-react';
import UserNav from '../../components/user/UserNav';
import StatusBadge from '../../components/shared/StatusBadge';

export default function UserDashboard() {
    const { user } = useAuth();
    const { getUserOrders } = useOrders();
    const navigate = useNavigate();

    const wallet = getWallet(user?.id);
    const myOrders = getUserOrders(user?.id);
    const activeOrders = myOrders.filter(o => o.status !== 'completed');
    const recentOrders = myOrders.slice(0, 3);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="min-h-screen bg-background pb-20">
            <UserNav />
            <div className="max-w-2xl mx-auto px-4 pt-6">
                {/* Greeting */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold">
                        {greeting}, {user?.name?.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-muted-foreground">What are you craving today?</p>
                </motion.div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card border border-border rounded-3xl p-6"
                    >
                        <Wallet className="w-6 h-6 text-primary mb-3" />
                        <p className="text-sm text-muted-foreground">Wallet Balance</p>
                        <p className="text-3xl font-bold text-primary">₹{wallet.balance}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-card border border-border rounded-3xl p-6"
                    >
                        <ShoppingBag className="w-6 h-6 text-accent mb-3" />
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                        <p className="text-3xl font-bold">{myOrders.length}</p>
                    </motion.div>
                </div>

                {/* Active Orders */}
                {activeOrders.length > 0 && (
                    <div className="mb-8">
                        <h2 className="font-semibold mb-4 flex items-center gap-2">
                            🔥 Active Orders
                        </h2>
                        {activeOrders.map(order => (
                            <motion.div
                                key={order.id}
                                onClick={() => navigate(`/user/track/${order.id}`)}
                                className="bg-card border border-primary/20 rounded-2xl p-5 mb-3 flex items-center justify-between cursor-pointer hover:border-primary/40 transition"
                            >
                                <div>
                                    <p className="font-medium">Token #{order.tokenNumber} • {order.id}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {order.items.length} items • ₹{order.finalAmount || order.totalAmount}
                                    </p>
                                </div>
                                <StatusBadge status={order.status} />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Quick Order CTA */}
                <Link
                    to="/user/menu"
                    className="block bg-gradient-to-r from-primary to-accent text-white rounded-3xl p-8 mb-8 hover:scale-[1.02] transition-transform"
                >
                    <p className="text-xl font-bold mb-2">Order Food Now 🍔</p>
                    <p className="opacity-90">Fresh &amp; hot food ready in minutes</p>
                    <div className="mt-6 inline-flex items-center gap-2 bg-white/20 px-5 py-2 rounded-2xl text-sm font-medium">
                        Browse Menu <ArrowRight size={16} />
                    </div>
                </Link>

                {/* Recent Orders */}
                {recentOrders.length > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold">Recent Orders</h2>
                            <Link to="/user/orders" className="text-primary text-sm font-medium">View All →</Link>
                        </div>
                        {recentOrders.map(order => (
                            <div key={order.id} className="bg-card border border-border rounded-2xl p-5 mb-3 flex justify-between">
                                <div>
                                    <p className="font-medium">#{order.id}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString()} • ₹{order.finalAmount || order.totalAmount}
                                    </p>
                                </div>
                                <StatusBadge status={order.status} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}