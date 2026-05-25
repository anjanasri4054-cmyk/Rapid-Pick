// Real-Time Kitchen Load Balancer & Queue System
import { getItem, setItem, KEYS } from '@/lib/storage';

export function getKitchenLoad() {
    const activeOrders = (getItem(KEYS.ORDERS) || []).filter(o => o.status === 'preparing');
    const totalLoad = activeOrders.reduce((sum, order) => {
        return sum + order.items.reduce((s, item) => s + (item.prepTime || 10) * (item.complexity || 1) * item.quantity, 0);
    }, 0);
    return totalLoad;
}

export function calculateQueuePosition(orderId) {
    const orders = getItem(KEYS.ORDERS) || [];
    const active = orders.filter(o => ['pending', 'preparing'].includes(o.status));
    active.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const pos = active.findIndex(o => o.id === orderId);
    return pos === -1 ? 0 : pos + 1;
}

export function calculateEstimatedWait(order) {
    const queuePos = calculateQueuePosition(order.id);
    const itemLoad = order.items.reduce((s, i) => s + (i.prepTime || 10), 0);
    // Base: queue position × avg 3 min + item prep time
    return Math.max(5, queuePos * 3 + itemLoad);
}

export function getNextToken() {
    const current = getItem(KEYS.TOKEN_COUNTER) || 1;
    const next = current >= 99 ? 1 : current + 1;
    setItem(KEYS.TOKEN_COUNTER, next);
    return current;
}

export function getCurrentServingToken() {
    const orders = getItem(KEYS.ORDERS) || [];
    const readyOrders = orders
        .filter(o => o.status === 'ready' && o.tokenNumber)
        .sort((a, b) => a.tokenNumber - b.tokenNumber);
    return readyOrders[0]?.tokenNumber || null;
}

export function batchSimilarOrders(orders) {
    // Group orders by overlapping items for batch cooking
    const batches = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            if (!batches[item.id]) batches[item.id] = { itemName: item.name, totalQty: 0, orderIds: [] };
            batches[item.id].totalQty += item.quantity;
            if (!batches[item.id].orderIds.includes(order.id)) {
                batches[item.id].orderIds.push(order.id);
            }
        });
    });
    return Object.values(batches).filter(b => b.totalQty > 1).sort((a, b) => b.totalQty - a.totalQty);
}