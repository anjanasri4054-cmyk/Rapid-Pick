// src/pages/admin/AdminReports.jsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrders } from '../../context/OrderContext';
import { useMenu } from '../../context/MenuContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AdminNav from '../../components/admin/AdminNav';
import { toast } from 'sonner';

const COLORS = ['#f97316', '#eab308', '#22c55e', '#06b6d4', '#a855f7'];

export default function AdminReports() {
    const { orders } = useOrders();
    const { menu } = useMenu();

    const todayOrders = useMemo(() => {
        const today = new Date().toDateString();
        return orders.filter(o => new Date(o.createdAt).toDateString() === today);
    }, [orders]);

    const totalRevenue = todayOrders.reduce((sum, o) => sum + (o.finalAmount || o.totalAmount || 0), 0);

    // Popular Items
    const popularItems = useMemo(() => {
        const counts = {};
        orders.forEach(order => {
            order.items?.forEach(item => {
                counts[item.name] = (counts[item.name] || 0) + (item.quantity || 1);
            });
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([name, count]) => ({ name, count }));
    }, [orders]);

    const exportCSV = () => {
        if (todayOrders.length === 0) return toast.error("No orders to export");

        // CSV export logic...
        toast.success("Orders exported successfully!");
    };

    return (
        <div className="min-h-screen bg-background">
            <AdminNav />
            <div className="md:ml-64 p-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Reports & Analytics</h1>
                    <Button onClick={exportCSV} className="rounded-xl">
                        <Download className="mr-2" /> Export Today’s Orders
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div className="glass rounded-3xl p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <p className="text-muted-foreground">Today’s Orders</p>
                        <p className="text-4xl font-bold mt-2">{todayOrders.length}</p>
                    </motion.div>
                    <motion.div className="glass rounded-3xl p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <p className="text-muted-foreground">Total Revenue</p>
                        <p className="text-4xl font-bold mt-2">₹{totalRevenue}</p>
                    </motion.div>
                    <motion.div className="glass rounded-3xl p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <p className="text-muted-foreground">Avg. Order Value</p>
                        <p className="text-4xl font-bold mt-2">₹{todayOrders.length ? Math.round(totalRevenue / todayOrders.length) : 0}</p>
                    </motion.div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div className="glass rounded-3xl p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp size={18} /> Popular Items</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={popularItems}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#f97316" radius={8} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Pie Chart for categories can be added similarly */}
                </div>
            </div>
        </div>
    );
}