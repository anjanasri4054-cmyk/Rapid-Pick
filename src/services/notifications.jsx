// Notification & Broadcast System
import { getItem, setItem, KEYS } from '@/lib/storage';

export function pushNotification(userId, title, body, type = 'info') {
    const all = getItem(KEYS.NOTIFICATIONS) || [];
    all.unshift({ id: 'n-' + Date.now(), userId, title, body, type, read: false, createdAt: new Date().toISOString() });
    setItem(KEYS.NOTIFICATIONS, all.slice(0, 50)); // keep last 50
}

export function getUserNotifications(userId) {
    return (getItem(KEYS.NOTIFICATIONS) || []).filter(n => n.userId === userId || n.userId === 'all');
}

export function markAllRead(userId) {
    const all = getItem(KEYS.NOTIFICATIONS) || [];
    const updated = all.map(n => (n.userId === userId || n.userId === 'all') ? { ...n, read: true } : n);
    setItem(KEYS.NOTIFICATIONS, updated);
}

export function broadcastNotice(message) {
    setItem(KEYS.EMERGENCY_NOTICE, { message, active: true, createdAt: new Date().toISOString() });
    pushNotification('all', '📢 Notice', message, 'warning');
}

export function clearNotice() {
    setItem(KEYS.EMERGENCY_NOTICE, { message: '', active: false });
}

export function getEmergencyNotice() {
    return getItem(KEYS.EMERGENCY_NOTICE) || { active: false, message: '' };
}

export function isOrderingEnabled() {
    return !getItem(KEYS.KILL_SWITCH);
}

export function setKillSwitch(value) {
    setItem(KEYS.KILL_SWITCH, value);
    if (value) pushNotification('all', '🔴 Ordering Paused', 'The canteen has temporarily paused new orders.', 'error');
    else pushNotification('all', '🟢 Ordering Resumed', 'The canteen is now accepting orders again!', 'success');
}