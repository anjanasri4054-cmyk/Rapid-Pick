import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Hash, ChevronRight } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';
import OrderETA from './OrderETA';
import OrderTimer from './OrderTimer';

export default function ActiveOrderCard({ order }) {
    const isActive = order.status !== 'completed' && order.status !== 'cancelled';

    return (
        <div className="space-y-3">
            <Link to={`/user/orders/${order.id}`}>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-2xl p-4 cursor-pointer hover:border-primary/30 transition-all group"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground">Active Order</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <p className="font-semibold text-sm">{order.id}</p>
                                {order.tokenNumber && (
                                    <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                        <Hash className="w-3 h-3" />#{order.tokenNumber}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {order.items.length} item{order.items.length > 1 ? 's' : ''} · ₹{order.finalAmount || order.totalAmount}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <StatusBadge status={order.status} />
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                    </div>
                </motion.div>
            </Link>

            {isActive && <OrderTimer order={order} />}
            {isActive && order.status !== 'ready' && <OrderETA order={order} />}
        </div>
    );
}