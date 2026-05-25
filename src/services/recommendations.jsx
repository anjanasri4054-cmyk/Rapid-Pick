import { getItem, KEYS } from '../lib/storage';

export function getTimeCategory() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 15) return 'lunch';
    if (hour >= 15 && hour < 18) return 'snacks';
    return 'dinner';
}

export function getRecommendations(userId, menu = []) {
    const orders = getItem(KEYS.ORDERS) || [];
    const userOrders = orders.filter(o => o.userId === userId);
    const timeCategory = getTimeCategory();

    // User's past item frequency
    const itemFreq = {};
    userOrders.forEach(order => {
        order.items.forEach(item => {
            itemFreq[item.id] = (itemFreq[item.id] || 0) + (item.quantity || 1);
        });
    });

    // Recent popular items (last 1 hour)
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentFreq = {};
    orders
        .filter(o => new Date(o.createdAt).getTime() > oneHourAgo)
        .forEach(order => {
            order.items.forEach(item => {
                recentFreq[item.id] = (recentFreq[item.id] || 0) + (item.quantity || 1);
            });
        });

    const availableMenu = menu.filter(m => m.available !== false);

    const scored = availableMenu.map(item => {
        let score = 0;
        if (item.category === timeCategory) score += 30;
        score += (itemFreq[item.id] || 0) * 15;
        score += (recentFreq[item.id] || 0) * 10;
        score += (item.rating || 4) * 5;
        score += Math.random() * 5; // slight variety

        return { ...item, score };
    });

    scored.sort((a, b) => b.score - a.score);

    return {
        forYou: scored.slice(0, 4),
        timeBased: availableMenu.filter(m => m.category === timeCategory).slice(0, 4),
        trending: [...availableMenu]
            .sort((a, b) => (recentFreq[b.id] || 0) - (recentFreq[a.id] || 0))
            .slice(0, 4),
        peopleAlsoOrdered: scored.filter(m => itemFreq[m.id] > 0).slice(0, 3)
    };
}

export function getDynamicPrice(item) {
    const hour = new Date().getHours();
    const isPeak = (hour >= 12 && hour <= 14) || (hour >= 19 && hour <= 21);
    const isHappyHour = hour >= 14 && hour <= 17;

    if (isHappyHour) {
        return {
            price: Math.round(item.price * 0.85),
            label: 'Happy Hour -15%',
            type: 'discount'
        };
    }
    if (isPeak) {
        return {
            price: Math.round(item.price * 1.1),
            label: 'Peak Hour +10%',
            type: 'surge'
        };
    }

    return {
        price: item.price,
        label: null,
        type: 'normal'
    };
}