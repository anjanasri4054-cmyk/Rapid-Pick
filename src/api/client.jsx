import { getItem, setItem, KEYS } from '../lib/storage';

// Simulated API delay (realistic feel)
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    // Auth
    async login(email, password) {
        await delay();
        const users = getItem(KEYS.USERS) || [];
        const found = users.find(u => u.email === email && u.password === password);

        if (!found) throw new Error('Invalid email or password');

        const { password: _pwd, ...safeUser } = found;
        setItem(KEYS.AUTH, safeUser);
        return safeUser;
    },

    async signup(userData) {
        await delay();
        const users = getItem(KEYS.USERS) || [];

        if (users.find(u => u.email === userData.email)) {
            throw new Error('Email already registered');
        }

        const newUser = {
            id: 'u-' + Date.now(),
            ...userData,
            role: 'user',
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        setItem(KEYS.USERS, users);

        const { password: _pwd, ...safeUser } = newUser;
        setItem(KEYS.AUTH, safeUser);
        return safeUser;
    },

    // Menu
    async getMenu() {
        await delay(300);
        return getItem(KEYS.MENU) || [];
    },

    async addMenuItem(item) {
        await delay();
        const items = getItem(KEYS.MENU) || [];
        const newItem = {
            id: 'm-' + Date.now(),
            available: true,
            ...item
        };
        items.push(newItem);
        setItem(KEYS.MENU, items);
        return newItem;
    },

    async updateMenuItem(id, data) {
        await delay();
        const items = getItem(KEYS.MENU) || [];
        const idx = items.findIndex(i => i.id === id);
        if (idx === -1) throw new Error('Item not found');

        items[idx] = { ...items[idx], ...data };
        setItem(KEYS.MENU, items);
        return items[idx];
    },

    async deleteMenuItem(id) {
        await delay();
        const items = (getItem(KEYS.MENU) || []).filter(i => i.id !== id);
        setItem(KEYS.MENU, items);
        return true;
    },

    // Orders
    async placeOrder(orderData) {
        await delay();
        const orders = getItem(KEYS.ORDERS) || [];
        const tokenNumber = getNextToken();

        const newOrder = {
            id: 'ORD-' + Date.now().toString(36).toUpperCase(),
            ...orderData,
            tokenNumber,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            customerArrived: false,
        };

        orders.push(newOrder);
        setItem(KEYS.ORDERS, orders);
        return newOrder;
    },

    async getOrders() {
        await delay(250);
        return getItem(KEYS.ORDERS) || [];
    },

    async updateOrderStatus(orderId, status) {
        await delay();
        const orders = getItem(KEYS.ORDERS) || [];
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            order.updatedAt = new Date().toISOString();
            setItem(KEYS.ORDERS, orders);
        }
        return order;
    },

    // Wallet
    async getWallet(userId) {
        await delay();
        const wallets = getItem(KEYS.WALLET) || {};
        return wallets[userId] || { balance: 100, transactions: [] };
    },

    async addWalletMoney(userId, amount, description = 'Added to wallet') {
        await delay();
        const wallets = getItem(KEYS.WALLET) || {};
        if (!wallets[userId]) {
            wallets[userId] = { balance: 0, transactions: [] };
        }

        wallets[userId].balance += amount;
        wallets[userId].transactions.unshift({
            id: 't-' + Date.now(),
            type: 'credit',
            amount,
            description,
            date: new Date().toISOString()
        });

        setItem(KEYS.WALLET, wallets);
        return wallets[userId];
    }
};

// Helper function
function getNextToken() {
    let current = getItem(KEYS.TOKEN_COUNTER) || 1;
    const next = current >= 99 ? 1 : current + 1;
    setItem(KEYS.TOKEN_COUNTER, next);
    return current;
}