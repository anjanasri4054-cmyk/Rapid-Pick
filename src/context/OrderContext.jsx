import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getItem, setItem, KEYS, getDeviceInfo } from '@/lib/storage';
import { getNextToken } from '@/services/kitchenQueue';
import { applyCashback, deductWalletMoney } from '@/services/wallet';
import { pushNotification } from '@/services/notifications';
import { updateStreak } from '@/services/gamification';
import { toast } from 'sonner';

const OrderContext = createContext();

// Calculate order timer duration
function calcTimerDuration(items, queuePosition) {
    const baseTime = 10 * 60; // 10 min base
    const itemTime = items.reduce((s, i) => s + (i.quantity || 1) * 2 * 60, 0); // +2 min/item
    const queueTime = (queuePosition || 0) * 1.5 * 60; // +1.5 min per queue position
    return Math.round(baseTime + itemTime + queueTime);
}

export function OrderProvider({ children }) {
    const [orders, setOrders] = useState(() => getItem(KEYS.ORDERS) || []);
    const [arrivals, setArrivals] = useState([]);

    // Real-time sync: Poll localStorage every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            const fresh = getItem(KEYS.ORDERS) || [];
            setOrders(prev => {
                // Only update if data actually changed
                if (JSON.stringify(prev.map(o => o.id + o.status + o.updatedAt)) !==
                    JSON.stringify(fresh.map(o => o.id + o.status + o.updatedAt))) {
                    return fresh;
                }
                return prev;
            });
        }, 3000);

        // BroadcastChannel for same-device cross-tab sync
        let bc;
        try {
            bc = new BroadcastChannel('canteen_orders_sync');
            bc.onmessage = () => {
                const fresh = getItem(KEYS.ORDERS) || [];
                setOrders(fresh);
            };
        } catch (e) { }

        return () => {
            clearInterval(interval);
            if (bc) bc.close();
        };
    }, []);

    const broadcast = () => {
        try {
            const bc = new BroadcastChannel('canteen_orders_sync');
            bc.postMessage({ type: 'update', time: Date.now() });
            bc.close();
        } catch (e) { }
    };

    const placeOrder = (orderData) => {
        const allOrders = getItem(KEYS.ORDERS) || [];

        // Duplicate prevention
        const recentDup = allOrders.find(o =>
            o.userId === orderData.userId &&
            Date.now() - new Date(o.createdAt).getTime() < 30000 &&
            JSON.stringify(o.items.map(i => i.id).sort()) === JSON.stringify(orderData.items.map(i => i.id).sort())
        );
        if (recentDup) {
            toast.error('Duplicate order detected! Please wait a moment.');
            return null;
        }

        const tokenNumber = getNextToken();
        const queuePos = allOrders.filter(o => ['pending', 'preparing'].includes(o.status)).length;
        const timerDuration = calcTimerDuration(orderData.items, queuePos);
        const timerStartedAt = new Date().toISOString();
        const deviceInfo = getDeviceInfo();

        const newOrder = {
            id: 'ORD-' + Date.now().toString(36).toUpperCase(),
            ...orderData,
            tokenNumber,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            customerArrived: false,
            deviceInfo,
            timerStartedAt,
            timerDuration,
            queuePosition: queuePos + 1,
            earlyBonusGiven: false,
            timerExpiredCouponGiven: false,
        };

        // Handle wallet payment
        if (orderData.paymentMethod === 'wallet') {
            const result = deductWalletMoney(orderData.userId, orderData.finalAmount || orderData.totalAmount, `Order ${newOrder.id}`);
            if (!result.success) {
                toast.error('Insufficient wallet balance!');
                return null;
            }
        }

        allOrders.push(newOrder);
        setItem(KEYS.ORDERS, allOrders);
        setOrders([...allOrders]);

        // Save timer to separate key for persistence across refreshes
        const timers = getItem(KEYS.ORDER_TIMERS) || {};
        timers[newOrder.id] = { startedAt: timerStartedAt, duration: timerDuration };
        setItem(KEYS.ORDER_TIMERS, timers);

        // Cashback
        if (orderData.paymentMethod === 'wallet') {
            const cashback = applyCashback(orderData.userId, orderData.finalAmount || orderData.totalAmount);
            if (cashback > 0) pushNotification(orderData.userId, '💰 Cashback!', `₹${cashback} added to your wallet!`, 'success');
        }

        updateStreak(orderData.userId);
        pushNotification(orderData.userId, '✅ Order Placed!', `Token #${tokenNumber} — ${newOrder.id}`, 'success');
        toast.success(`Order placed! Token #${tokenNumber}`);
        broadcast();
        return newOrder;
    };

    const updateOrderStatus = (orderId, status) => {
        const allOrders = getItem(KEYS.ORDERS) || [];
        const idx = allOrders.findIndex(o => o.id === orderId);
        if (idx !== -1) {
            const order = allOrders[idx];
            allOrders[idx].status = status;
            allOrders[idx].updatedAt = new Date().toISOString();

            // Check if ready before timer expires → give bonus
            if (status === 'ready' && !order.earlyBonusGiven) {
                const timers = getItem(KEYS.ORDER_TIMERS) || {};
                const timer = timers[orderId];
                if (timer) {
                    const elapsed = (Date.now() - new Date(timer.startedAt).getTime()) / 1000;
                    if (elapsed < timer.duration) {
                        allOrders[idx].earlyBonusGiven = true;
                        pushNotification(order.userId, '🎉 EARLY! +50 bonus points!', `Your order was ready ahead of schedule!`, 'success');
                    }
                }
            }

            setItem(KEYS.ORDERS, allOrders);
            setOrders([...allOrders]);

            const statusMessages = {
                preparing: `🍳 Your order is being prepared!`,
                ready: `🔔 Token #${order.tokenNumber} is READY for pickup!`,
                completed: `✅ Order completed. Enjoy your meal!`,
            };
            if (statusMessages[status]) {
                pushNotification(order.userId, statusMessages[status], order.id, status === 'ready' ? 'success' : 'info');
            }
            toast.success(`Order ${orderId} → ${status.charAt(0).toUpperCase() + status.slice(1)}`);
            broadcast();
        }
    };

    const markArrived = (orderId) => {
        const allOrders = getItem(KEYS.ORDERS) || [];
        const idx = allOrders.findIndex(o => o.id === orderId);
        if (idx !== -1) {
            allOrders[idx].customerArrived = true;
            allOrders[idx].updatedAt = new Date().toISOString();
            setItem(KEYS.ORDERS, allOrders);
            setOrders([...allOrders]);
            setArrivals(prev => [...prev, orderId]);
            toast.success('Canteen has been notified of your arrival!');
            broadcast();
        }
    };

    const dismissArrival = (orderId) => setArrivals(prev => prev.filter(id => id !== orderId));

    const addReview = (orderId, rating, comment) => {
        const reviews = getItem(KEYS.REVIEWS) || [];
        reviews.push({ id: 'r-' + Date.now(), orderId, rating, comment, createdAt: new Date().toISOString() });
        setItem(KEYS.REVIEWS, reviews);
        const allOrders = getItem(KEYS.ORDERS) || [];
        const idx = allOrders.findIndex(o => o.id === orderId);
        if (idx !== -1) { allOrders[idx].reviewed = true; setItem(KEYS.ORDERS, allOrders); }
        toast.success('Thanks for your feedback!');
    };

    const getUserOrders = useCallback((userId) => {
        return orders.filter(o => o.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [orders]);

    const getActiveOrders = useCallback(() => {
        return orders.filter(o => o.status !== 'completed').sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }, [orders]);

    const getTodayOrders = useCallback(() => {
        const today = new Date().toDateString();
        return orders.filter(o => new Date(o.createdAt).toDateString() === today);
    }, [orders]);

    const getOrdersByDate = useCallback((dateStr) => {
        return orders.filter(o => new Date(o.createdAt).toDateString() === new Date(dateStr).toDateString());
    }, [orders]);

    return (
        <OrderContext.Provider value={{
            orders, placeOrder, updateOrderStatus, markArrived,
            getUserOrders, getActiveOrders, getTodayOrders, getOrdersByDate,
            arrivals, dismissArrival, addReview,
        }}>
            {children}
        </OrderContext.Provider>
    );
}

export const useOrders = () => useContext(OrderContext);