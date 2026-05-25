import { getItem, setItem, KEYS } from '../lib/storage';

const BADGE_RULES = [
    { id: 'early_bird', name: 'Early Bird 🌅', desc: 'Ordered before 9 AM' },
    { id: 'spicy_lover', name: 'Spicy Lover 🌶️', desc: 'Ordered spicy items 5 times' },
    { id: 'loyal', name: 'Regular 🎖️', desc: 'Placed 10+ orders' },
    { id: 'big_spender', name: 'Foodie 💰', desc: 'Spent ₹500+ total' },
    { id: 'streak_3', name: 'On Fire 🔥', desc: 'Ordered 3 days in a row' },
    { id: 'veg_hero', name: 'Veg Hero 🥗', desc: 'Ordered only veg items' },
    { id: 'night_owl', name: 'Night Owl 🦉', desc: 'Ordered after 8 PM' },
];

export function getUserBadges(userId) {
    const orders = (getItem(KEYS.ORDERS) || []).filter(o => o.userId === userId);
    const streak = getUserStreak(userId);

    return BADGE_RULES.filter(badge => {
        if (badge.id === 'streak_3') return streak >= 3;
        if (badge.id === 'early_bird') return orders.some(o => new Date(o.createdAt).getHours() < 9);
        if (badge.id === 'spicy_lover') return orders.filter(o =>
            o.items.some(i => (i.tags || []).includes('spicy'))
        ).length >= 5;
        if (badge.id === 'loyal') return orders.length >= 10;
        if (badge.id === 'big_spender') return orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) >= 500;
        if (badge.id === 'veg_hero') return orders.length > 3 && orders.every(o =>
            o.items.every(i => i.isVeg)
        );
        if (badge.id === 'night_owl') return orders.some(o => new Date(o.createdAt).getHours() >= 20);
        return false;
    });
}

export function getUserStreak(userId) {
    const streaks = getItem(KEYS.STREAKS) || {};
    return streaks[userId]?.current || 0;
}

export function updateStreak(userId) {
    const orders = (getItem(KEYS.ORDERS) || []).filter(o => o.userId === userId);
    let streaks = getItem(KEYS.STREAKS) || {};
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let current = streaks[userId] || { current: 0, lastDate: null };

    const orderedToday = orders.some(o => new Date(o.createdAt).toDateString() === today);

    if (orderedToday) {
        if (current.lastDate === yesterday) {
            current.current += 1;
        } else if (current.lastDate !== today) {
            current.current = 1;
        }
        current.lastDate = today;
    }

    streaks = { ...streaks, [userId]: current };
    setItem(KEYS.STREAKS, streaks);

    return current.current;
}

export function getLeaderboard() {
    const orders = getItem(KEYS.ORDERS) || [];
    const userMap = {};

    orders.forEach(order => {
        if (!userMap[order.userId]) {
            userMap[order.userId] = {
                userId: order.userId,
                userName: order.userName || 'Unknown',
                totalSpend: 0,
                totalOrders: 0
            };
        }
        userMap[order.userId].totalSpend += order.totalAmount || 0;
        userMap[order.userId].totalOrders += 1;
    });

    return Object.values(userMap)
        .sort((a, b) => b.totalSpend - a.totalSpend)
        .slice(0, 10);
}