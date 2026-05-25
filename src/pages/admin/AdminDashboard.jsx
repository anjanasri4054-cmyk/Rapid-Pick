import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ShoppingBag, IndianRupee, Clock, CheckCircle, ChevronRight,
    AlertCircle, Power, Hash, Zap, TrendingUp, Users, Star, Calendar,
    Monitor, BarChart2
} from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import AdminNav from '@/components/admin/AdminNav';
import StatusBadge from '@/components/shared/StatusBadge';
import LiveSyncIndicator from '@/components/admin/LiveSyncIndicator';
import { isOrderingEnabled } from '@/services/notifications';
import { getCurrentServingToken } from '@/services/kitchenQueue';
import { batchSimilarOrders, getKitchenLoad } from '@/services/kitchenQueue';
import { getItem, KEYS } from '@/lib/storage';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function StatCard({ icon: Icon, label, value, sub, color, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="glass rounded-2xl p-5"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-muted-foreground font-medium">{label}</p>
                    <p className="text-2xl font-bold mt-0.5">{value}</p>
                    {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
                </div>
                <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
            </div>
        </motion.div>
    );
}

function KitchenLoadGauge({ load }) {
    const pct = Math.min(100, Math.round(load / 3));
    const color = pct < 40 ? '#22c55e' : pct < 70 ? '#f59e0b' : '#ef4444';
    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: color, width: `${pct}%` }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8 }}
                />
            </div>
            <span className="text-xs font-bold w-10 text-right" style={{ color }}>{pct}%</span>
        </div>
    );
}

function buildWeeklyData(orders) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now);
        d.setDate(now.getDate() - (6 - i));
        const dayStr = d.toDateString();
        const dayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === dayStr);
        return {
            day: days[d.getDay()],
            orders: dayOrders.length,
            revenue: dayOrders.reduce((s, o) => s + (o.finalAmount || o.totalAmount || 0), 0),
        };
    });
}

function buildHourlyData(orders) {
    return Array.from({ length: 13 }, (_, i) => {
        const h = 8 + i;
        const hOrders = orders.filter(o => new Date(o.createdAt).getHours() === h);
        return {
            hour: `${h}:00`,
            orders: hOrders.length,
            revenue: hOrders.reduce((s, o) => s + (o.finalAmount || o.totalAmount || 0), 0),
        };
    });
}

export default function AdminDashboard() {
    const { getTodayOrders, arrivals, dismissArrival, orders, getActiveOrders, getOrdersByDate } = useOrders();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [chartMode, setChartMode] = useState('weekly');

    const isToday = selectedDate === new Date().toISOString().split('T')[0];
    const viewOrders = isToday ? getTodayOrders() : getOrdersByDate(selectedDate);
    const todayOrders = getTodayOrders();

    const revenue = viewOrders.reduce((s, o) => s + (o.finalAmount || o.totalAmount || 0), 0);
    const active = viewOrders.filter(o => ['pending', 'preparing'].includes(o.status)).length;
    const completed = viewOrders.filter(o => o.status === 'completed').length;
    const orderingOn = isOrderingEnabled();
    const servingToken = getCurrentServingToken();
    const kitchenLoad = getKitchenLoad();
    const activeOrders = getActiveOrders();
    const batches = batchSimilarOrders(activeOrders.filter(o => ['pending', 'preparing'].includes(o.status)));
    const arrivedOrders = orders.filter(o => o.customerArrived && o.status !== 'completed');
    const allUsers = getItem(KEYS.USERS) || [];
    const regularUsers = allUsers.filter(u => u.role === 'user').length;

    const weeklyData = useMemo(() => buildWeeklyData(orders), [orders.length]);
    const hourlyData = useMemo(() => buildHourlyData(viewOrders), [viewOrders.length, selectedDate]);

    // Device breakdown
    const deviceBreakdown = useMemo(() => {
        const counts = {};
        viewOrders.forEach(o => {
            const dev = (o.deviceInfo || 'Unknown').split('|')[1]?.trim() || 'Unknown';
            counts[dev] = (counts[dev] || 0) + 1;
        });
        return Object.entries(counts).map(([k, v]) => ({ device: k, count: v }));
    }, [viewOrders.length, selectedDate]);

    // Popular items
    const itemCounts = {};
    viewOrders.forEach(o => o.items?.forEach(i => {
        itemCounts[i.name] = (itemCounts[i.name] || 0) + i.quantity;
    }));
    const popular = Object.entries(itemCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Peak hour prediction
    const peakHour = hourlyData.reduce((max, h) => h.orders > max.orders ? h : max, { hour: '--', orders: 0 });

    return (
        <div className="min-h-screen">
            <AdminNav />
            <div className="md:ml-64 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {isToday ? 'Dashboard — Today' : `Dashboard — ${new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {isToday ? new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Historical view'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <LiveSyncIndicator />
                        {/* Date picker */}
                        <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-xl border">
                            <Calendar className="w-4 h-4 text-primary" />
                            <input
                                type="date"
                                value={selectedDate}
                                max={new Date().toISOString().split('T')[0]}
                                onChange={e => setSelectedDate(e.target.value)}
                                className="bg-transparent text-sm font-medium border-none outline-none w-32"
                            />
                        </div>
                        {servingToken && (
                            <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-xl text-sm font-bold">
                                <Hash className="w-4 h-4" /> Serving #{servingToken}
                            </div>
                        )}
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium ${orderingOn ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            }`}>
                            <Power className="w-4 h-4" />
                            {orderingOn ? 'Orders Open' : 'Orders Paused'}
                        </div>
                    </div>
                </div>

                {/* Batch suggestion */}
                {batches.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="glass rounded-2xl p-4 mb-5 border-blue-400/20 flex items-center gap-3 bg-blue-500/5">
                        <Zap className="w-5 h-5 text-blue-500 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold">Smart Batch Suggestion</p>
                            <p className="text-xs text-muted-foreground">
                                {batches.slice(0, 2).map(b => `${b.itemName} ×${b.totalQty}`).join(' · ')} — cook together to save time
                            </p>
                        </div>
                        <Link to="/kitchen/dashboard" className="ml-auto text-xs text-primary font-medium shrink-0">Kitchen →</Link>
                    </motion.div>
                )}

                {/* Arrival alerts */}
                {arrivedOrders.length > 0 && (
                    <div className="mb-5 space-y-2">
                        {arrivedOrders.map(order => (
                            <motion.div key={order.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-green-600 shrink-0" />
                                    <div>
                                        <p className="font-semibold text-sm text-green-800 dark:text-green-300">{order.userName} arrived for {order.id}</p>
                                        <p className="text-xs text-green-600 dark:text-green-400">Customer is at the canteen</p>
                                    </div>
                                </div>
                                <button onClick={() => dismissArrival(order.id)} className="text-xs text-green-600 hover:text-green-800 font-medium ml-3">Dismiss</button>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Stats grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard icon={ShoppingBag} label={isToday ? "Today's Orders" : "Orders"} value={viewOrders.length} color="bg-primary" delay={0} />
                    <StatCard icon={IndianRupee} label={isToday ? "Revenue Today" : "Revenue"} value={`₹${revenue}`} color="bg-green-500" delay={0.05} />
                    <StatCard icon={Clock} label="Active Orders" value={active} sub={`${batches.length} batchable`} color="bg-amber-500" delay={0.1} />
                    <StatCard icon={Users} label="Total Users" value={regularUsers} color="bg-blue-500" delay={0.15} />
                </div>

                {/* Peak Hour + Avg info */}
                {isToday && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                        <div className="glass rounded-2xl p-4">
                            <p className="text-xs text-muted-foreground mb-1">Peak Hour Today</p>
                            <p className="font-bold text-lg">{peakHour.hour}</p>
                            <p className="text-xs text-muted-foreground">{peakHour.orders} orders</p>
                        </div>
                        <div className="glass rounded-2xl p-4">
                            <p className="text-xs text-muted-foreground mb-1">Avg Order Value</p>
                            <p className="font-bold text-lg">₹{viewOrders.length ? Math.round(revenue / viewOrders.length) : 0}</p>
                            <p className="text-xs text-muted-foreground">per order</p>
                        </div>
                        <div className="glass rounded-2xl p-4">
                            <p className="text-xs text-muted-foreground mb-1">Active Queue</p>
                            <p className="font-bold text-lg">{active} orders</p>
                            <p className="text-xs text-muted-foreground">{completed} completed</p>
                        </div>
                    </div>
                )}

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        className="lg:col-span-2 glass rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-primary" />
                                {chartMode === 'weekly' ? 'Last 7 Days Revenue' : "Today's Hourly Orders"}
                            </h3>
                            <div className="flex gap-1">
                                {['weekly', 'hourly'].map(m => (
                                    <button key={m} onClick={() => setChartMode(m)}
                                        className={`px-2 py-1 rounded-lg text-xs font-medium transition-all capitalize ${chartMode === m ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={160}>
                            <BarChart data={chartMode === 'weekly' ? weeklyData : hourlyData} barSize={20}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                                <XAxis dataKey={chartMode === 'weekly' ? 'day' : 'hour'} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
                                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                    formatter={(v, n) => [chartMode === 'weekly' ? `₹${v}` : v, chartMode === 'weekly' ? 'Revenue' : 'Orders']} />
                                <Bar dataKey={chartMode === 'weekly' ? 'revenue' : 'orders'} fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Right panel */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="space-y-4">
                        {/* Kitchen load */}
                        <div className="glass rounded-2xl p-4">
                            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Kitchen Load</p>
                            <KitchenLoadGauge load={kitchenLoad} />
                            <p className="text-xs text-muted-foreground mt-1.5">
                                {kitchenLoad === 0 ? 'Kitchen is free' : kitchenLoad < 60 ? 'Manageable load' : kitchenLoad < 120 ? 'Moderate load' : 'High load — delay likely'}
                            </p>
                        </div>

                        {/* Device breakdown */}
                        {deviceBreakdown.length > 0 && (
                            <div className="glass rounded-2xl p-4">
                                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider flex items-center gap-1">
                                    <Monitor className="w-3 h-3" /> Devices
                                </p>
                                <div className="space-y-1.5">
                                    {deviceBreakdown.map(({ device, count }) => (
                                        <div key={device} className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">{device}</span>
                                            <span className="font-bold">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Today quick stats */}
                        {!deviceBreakdown.length && (
                            <div className="glass rounded-2xl p-4">
                                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Summary</p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-muted-foreground">Completed</span><span className="font-semibold text-green-600">{completed}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Active</span><span className="font-semibold text-amber-600">{active}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Avg order</span><span className="font-semibold">₹{viewOrders.length ? Math.round(revenue / viewOrders.length) : 0}</span></div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Bottom: Popular + Recent orders */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {popular.length > 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass rounded-2xl">
                            <div className="p-4 border-b flex items-center gap-2">
                                <Star className="w-4 h-4 text-amber-400" />
                                <h3 className="font-bold text-sm">{isToday ? 'Popular Today' : 'Popular Items'}</h3>
                            </div>
                            <div className="divide-y">
                                {popular.map(([name, count], i) => (
                                    <div key={name} className="flex items-center justify-between px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-muted-foreground w-4">#{i + 1}</span>
                                            <p className="text-sm font-medium truncate max-w-[110px]">{name}</p>
                                        </div>
                                        <span className="text-xs font-bold text-primary">{count}× ordered</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Recent orders */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                        className={`glass rounded-2xl ${popular.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-bold text-sm">{isToday ? 'Recent Orders' : 'Orders on this Date'}</h3>
                            <Link to="/admin/orders" className="text-xs text-primary font-medium flex items-center gap-1">
                                View All <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="divide-y">
                            {viewOrders.slice(0, 6).map(order => (
                                <div key={order.id} className="p-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                    <div>
                                        <p className="font-semibold text-sm">{order.id}</p>
                                        <p className="text-xs text-muted-foreground">{order.userName} · {order.items?.length || 0} items</p>
                                        {order.deviceInfo && <p className="text-[10px] text-muted-foreground">{order.deviceInfo}</p>}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-sm">₹{order.finalAmount || order.totalAmount}</span>
                                        <StatusBadge status={order.status} />
                                    </div>
                                </div>
                            ))}
                            {viewOrders.length === 0 && (
                                <p className="p-8 text-center text-muted-foreground text-sm">
                                    {isToday ? 'No orders today yet' : 'No orders on this date'}
                                </p>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}