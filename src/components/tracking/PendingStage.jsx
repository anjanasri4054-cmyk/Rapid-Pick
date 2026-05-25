import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useOrders } from '../../context/OrderContext';
import { toast } from 'sonner';

export default function PendingStage({ order }) {
    const { updateOrderStatus } = useOrders();
    const [canCancel, setCanCancel] = useState(true);
    const [secondsLeft, setSecondsLeft] = useState(120);

    useEffect(() => {
        const placed = new Date(order.createdAt).getTime();
        const deadline = placed + 120000;

        const update = () => {
            const rem = Math.max(0, Math.round((deadline - Date.now()) / 1000));
            setSecondsLeft(rem);
            setCanCancel(rem > 0);
        };

        update();
        const iv = setInterval(update, 1000);
        return () => clearInterval(iv);
    }, [order.createdAt]);

    const handleCancel = () => {
        updateOrderStatus(order.id, 'cancelled');
        toast.success('Order cancelled successfully');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-6 text-center border border-amber-400/30 bg-amber-50/30 dark:bg-amber-900/10"
        >
            <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"
            >
                <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </motion.div>

            <h3 className="font-bold text-lg text-amber-800 dark:text-amber-300 mb-1">Awaiting Kitchen Confirmation</h3>
            <p className="text-sm text-muted-foreground mb-4">The kitchen will confirm your order shortly</p>

            <div className="flex justify-center gap-2 mb-5">
                {[0, 1, 2].map(i => (
                    <motion.div
                        key={i}
                        className="w-2.5 h-2.5 rounded-full bg-amber-400"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4 }}
                    />
                ))}
            </div>

            {canCancel ? (
                <div>
                    <p className="text-xs text-muted-foreground mb-3">
                        Cancel available for <span className="font-bold text-amber-600 dark:text-amber-400">{secondsLeft}s</span>
                    </p>
                    <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                        <X className="w-3.5 h-3.5 mr-1.5" /> Cancel Order
                    </Button>
                </div>
            ) : (
                <p className="text-xs text-muted-foreground italic">Cancel window has expired</p>
            )}
        </motion.div>
    );
}