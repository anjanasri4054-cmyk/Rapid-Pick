// src/pages/user/UserOrders.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useCart } from '../../context/CartContext';
import { useMenu } from '../../context/MenuContext';
import UserNav from '../../components/user/UserNav';
import StatusBadge from '../../components/shared/StatusBadge';
import { ChevronDown, ChevronUp, Navigation, RefreshCw } from 'lucide-react';

function OrderCard({ order, onReorder }) {
    const [expanded, setExpanded] = React.useState(order.status !== 'completed');

    return (
        <motion.div
            layout
            className="bg-card border border-border rounded-3xl overflow-hidden"
        >
            <div
                onClick={() => setExpanded(!expanded)}
                className="p-5 flex items-center justify-between cursor-pointer"
            >
                <div>
                    <p className="font-semibold">Order #{order.id}</p>
                    {order.tokenNumber && <p className="text-primary font-bold">Token #{order.tokenNumber}</p>}
                    <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />
                    {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>

            {expanded && (
                <div className="px-5 pb-5 border-t border-border">
                    <div className="space-y-2 mb-5">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                                <span>{item.name} ×{item.quantity}</span>
                                <span>₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <Link
                            to={`/user/track/${order.id}`}
                            className="flex-1 bg-primary text-primary-foreground py-3 rounded-2xl font-medium flex items-center justify-center gap-2"
                        >
                            <Navigation size={18} /> Track Order
                        </Link>
                        {order.status === 'completed' && (
                            <button
                                onClick={() => onReorder(order)}
                                className="flex-1 border border-border py-3 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-muted"
                            >
                                <RefreshCw size={18} /> Reorder
                            </button>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
}

export default function UserOrders() {
    const { user } = useAuth();
    const { getUserOrders } = useOrders();
    const { addToCart } = useCart();
    const { menu } = useMenu();

    const orders = getUserOrders(user?.id);

    const handleReorder = (order) => {
        order.items.forEach(item => {
            const menuItem = menu.find(m => m.id === item.id);
            if (menuItem && menuItem.available) {
                for (let i = 0; i < item.quantity; i++) {
                    addToCart(menuItem);
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <UserNav />
            <div className="max-w-2xl mx-auto px-4 pt-6">
                <h1 className="text-3xl font-bold mb-8">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-6xl mb-4">📋</p>
                        <p className="text-xl font-medium">No orders yet</p>
                        <Link to="/user/menu" className="text-primary mt-4 inline-block">Browse Menu →</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <OrderCard key={order.id} order={order} onReorder={handleReorder} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}