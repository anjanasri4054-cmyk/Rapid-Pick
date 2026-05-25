// src/pages/user/UserOrderTracking.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ChefHat, PackageCheck, Sparkles } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import UserNav from '../../components/user/UserNav';
import StatusBadge from '../../components/shared/StatusBadge';

const STAGES = [
    { key: 'pending', icon: Clock, label: 'Confirmed' },
    { key: 'preparing', icon: ChefHat, label: 'Preparing' },
    { key: 'ready', icon: PackageCheck, label: 'Ready' },
    { key: 'completed', icon: Sparkles, label: 'Completed' },
];

export default function UserOrderTracking() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { orders } = useOrders();

    const order = orders.find(o => o.id === orderId);

    useEffect(() => {
        if (!order) navigate('/user/orders');
    }, [order, navigate]);

    if (!order) return null;

    const currentIndex = STAGES.findIndex(s => s.key === order.status);

    return (
        <div className="min-h-screen bg-background pb-20">
            <UserNav />
            <div className="max-w-lg mx-auto px-4 pt-6">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/user/orders" className="p-3 border border-border rounded-2xl">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Order Tracking</h1>
                        <p className="text-sm text-muted-foreground">#{order.id}</p>
                    </div>
                </div>

                <StatusBadge status={order.status} className="mb-6" />

                {/* Progress Timeline */}
                <div className="bg-card border border-border rounded-3xl p-8 mb-8">
                    <div className="flex justify-between relative">
                        {STAGES.map((stage, i) => {
                            const isDone = i <= currentIndex;
                            const isActive = i === currentIndex;
                            const Icon = stage.icon;
                            return (
                                <div key={stage.key} className="flex flex-col items-center z-10">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDone ? 'bg-green-500' : isActive ? 'bg-primary' : 'bg-muted'}`}>
                                        <Icon size={24} className={isDone || isActive ? "text-white" : ""} />
                                    </div>
                                    <p className={`text-xs mt-3 font-medium ${isDone || isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {stage.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Status Message */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-3xl p-8 text-center mb-8"
                >
                    {order.status === 'ready' && order.tokenNumber && (
                        <div className="text-6xl font-black text-primary mb-4">
                            #{order.tokenNumber}
                        </div>
                    )}
                    <p className="text-xl font-semibold">Your order is {order.status}</p>
                </motion.div>

                {/* Items Summary */}
                <div className="bg-card border border-border rounded-3xl p-6">
                    <h3 className="font-semibold mb-4">Ordered Items</h3>
                    {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between py-2 border-b border-border last:border-0">
                            <span>{item.name} × {item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                        </div>
                    ))}
                    <div className="flex justify-between font-bold mt-4 pt-4 border-t border-border">
                        <span>Total</span>
                        <span>₹{order.finalAmount || order.totalAmount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}