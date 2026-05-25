// src/pages/admin/AdminOrders.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOrders } from '../../context/OrderContext';
import AdminNav from '../../components/admin/AdminNav';
import StatusBadge from '../../components/shared/StatusBadge';

const STATUS_OPTIONS = ['pending', 'preparing', 'ready', 'completed'];

export default function AdminOrders() {
    const { orders, updateOrderStatus, getOrdersByDate } = useOrders();

    const [filter, setFilter] = useState('all');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const dateOrders = getOrdersByDate(selectedDate).sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    const filteredOrders = filter === 'all'
        ? dateOrders
        : dateOrders.filter(o => o.status === filter);

    const statusCounts = STATUS_OPTIONS.reduce((acc, status) => {
        acc[status] = dateOrders.filter(o => o.status === status).length;
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-background">
            <AdminNav />
            <div className="md:ml-64 p-6">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Orders Management</h1>
                    <input
                        type="date"
                        value={selectedDate}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 rounded-2xl border border-border bg-card"
                    />
                </div>

                {/* Status Filters */}
                <div className="flex gap-2 mb-8 flex-wrap">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                            }`}
                    >
                        All ({dateOrders.length})
                    </button>
                    {STATUS_OPTIONS.map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === status ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                }`}
                        >
                            {status} ({statusCounts[status]})
                        </button>
                    ))}
                </div>

                {/* Orders Table */}
                <div className="bg-card border border-border rounded-3xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                {['Order ID', 'Customer', 'Items', 'Total', 'Time', 'Status', 'Action'].map(header => (
                                    <th key={header} className="text-left p-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <motion.tr
                                    key={order.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="border-b border-border hover:bg-muted/50 transition-colors"
                                >
                                    <td className="p-6">
                                        <p className="font-mono font-medium">#{order.id}</p>
                                        {order.tokenNumber && (
                                            <p className="text-primary font-bold text-sm">Token #{order.tokenNumber}</p>
                                        )}
                                    </td>
                                    <td className="p-6">{order.userName}</td>
                                    <td className="p-6">
                                        {order.items?.slice(0, 2).map((item, i) => (
                                            <p key={i} className="text-sm text-muted-foreground">
                                                {item.name} ×{item.quantity}
                                            </p>
                                        ))}
                                        {order.items?.length > 2 && (
                                            <p className="text-xs text-muted-foreground">+{order.items.length - 2} more</p>
                                        )}
                                    </td>
                                    <td className="p-6 font-semibold">₹{order.finalAmount || order.totalAmount}</td>
                                    <td className="p-6 text-sm text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="p-6">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="p-6">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            className="px-4 py-2 rounded-xl border border-border bg-background text-sm cursor-pointer"
                                        >
                                            {STATUS_OPTIONS.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredOrders.length === 0 && (
                        <p className="p-20 text-center text-muted-foreground">No orders found for selected date</p>
                    )}
                </div>
            </div>
        </div>
    );
}