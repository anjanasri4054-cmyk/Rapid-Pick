import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Clock, Zap, LogOut, Bell, CheckCircle, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { batchSimilarOrders, calculateEstimatedWait } from '@/services/kitchenQueue';
import StatusBadge from '@/components/shared/StatusBadge';
import { toast } from 'sonner';

function KitchenOrderCard({ order, onUpdateStatus }) {
    const wait = calculateEstimatedWait(order);
    const canPrepare = order.status === 'pending';
    const canReady = order.status === 'preparing';

    return (
        <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className={`glass rounded-2xl overflow-hidden ${order.status === 'preparing' ? 'border-blue-400/40' : 'border-amber-400/40'}`}>
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-primary" />
                            <p className="font-bold text-lg text-primary">Token #{order.tokenNumber}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{order.id}</p>
                    </div>
                    <div className="text-right">
                        <StatusBadge status={order.status} />
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> ~{wait} min wait
                        </p>
                    </div>
                </div>

                <div className="space-y-1.5 mb-4">
                    {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className="text-sm font-medium">{item.name}</span>
                            </div>
                            <span className="font-bold text-sm text-primary">×{item.quantity}</span>
                        </div>
                    ))}
                </div>

                {order.specialInstructions && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl px-3 py-2 mb-3 text-xs text-amber-700 dark:text-amber-400">
                        📝 {order.specialInstructions}
                    </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>Pickup: {order.timeSlot}</span>
                    <span className="font-medium">{order.customerArrived ? '🟢 Customer here' : '⏳ Not arrived'}</span>
                </div>

                <div className="flex gap-2">
                    {canPrepare && (
                        <Button onClick={() => onUpdateStatus(order.id, 'preparing')}
                            className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                            <ChefHat className="w-4 h-4 mr-1" /> Start Cooking
                        </Button>
                    )}
                    {canReady && (
                        <Button onClick={() => onUpdateStatus(order.id, 'ready')}
                            className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white">
                            <Bell className="w-4 h-4 mr-1" /> Mark Ready
                        </Button>
                    )}
                    {order.status === 'ready' && (
                        <Button onClick={() => onUpdateStatus(order.id, 'completed')}
                            className="flex-1 rounded-xl bg-slate-600 hover:bg-slate-700 text-white">
                            <CheckCircle className="w-4 h-4 mr-1" /> Complete
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default function KitchenDashboard() {
    const { orders, updateOrderStatus, getActiveOrders } = useOrders();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');

    const activeOrders = getActiveOrders();
    const batches = batchSimilarOrders(activeOrders.filter(o => ['pending', 'preparing'].includes(o.status)));

    const filtered = activeOrders.filter(o => filter === 'all' ? true : o.status === filter);

    const counts = {
        pending: activeOrders.filter(o => o.status === 'pending').length,
        preparing: activeOrders.filter(o => o.status === 'preparing').length,
        ready: activeOrders.filter(o => o.status === 'ready').length,
    };

    const handleLogout = () => { logout(); navigate('/'); };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-50 glass border-b">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                            <ChefHat className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Kitchen Station</p>
                            <p className="text-[10px] text-muted-foreground">{user?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-muted-foreground">Live</span>
                        </div>
                        <button onClick={handleLogout} className="p-2 text-muted-foreground">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="flex border-t">
                    {[
                        { key: 'all', label: 'All', count: activeOrders.length, color: 'text-foreground' },
                        { key: 'pending', label: 'Pending', count: counts.pending, color: 'text-amber-500' },
                        { key: 'preparing', label: 'Cooking', count: counts.preparing, color: 'text-blue-500' },
                        { key: 'ready', label: 'Ready', count: counts.ready, color: 'text-green-500' },
                    ].map(tab => (
                        <button key={tab.key} onClick={() => setFilter(tab.key)}
                            className={`flex-1 py-2.5 text-xs font-medium border-b-2 transition-all ${filter === tab.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>
                            <span className={`font-bold text-base block ${tab.color}`}>{tab.count}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4">
                {/* Smart batch suggestions */}
                {batches.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="glass rounded-2xl p-4 mb-4 border-blue-400/30">
                        <h3 className="font-bold text-sm flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-blue-500" /> Smart Batch Cooking
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {batches.slice(0, 4).map(b => (
                                <div key={b.itemName} className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-xs font-medium">
                                    {b.itemName} ×{b.totalQty} ({b.orderIds.length} orders)
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {filtered.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <ChefHat className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No {filter === 'all' ? 'active' : filter} orders</p>
                        <p className="text-sm">Waiting for new orders...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence>
                            {filtered.map(order => (
                                <KitchenOrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}