import React from 'react';
import { getItem, setItem, KEYS } from '../lib/storage';

// Smart Payment & Wallet System

export function getWallet(userId) {
    const wallets = getItem(KEYS.WALLET) || {};

    return wallets[userId] || {
        balance: 100,
        transactions: []
    };
}

export function addWalletMoney(
    userId,
    amount,
    description = 'Added'
) {
    const wallets = getItem(KEYS.WALLET) || {};

    const wallet = wallets[userId] || {
        balance: 100,
        transactions: []
    };

    wallet.balance += amount;

    wallet.transactions.unshift({
        id: 't-' + Date.now(),
        type: 'credit',
        amount,
        description,
        date: new Date().toISOString()
    });

    wallets[userId] = wallet;

    setItem(KEYS.WALLET, wallets);

    return wallet;
}

export function deductWalletMoney(
    userId,
    amount,
    description = 'Order payment'
) {
    const wallets = getItem(KEYS.WALLET) || {};

    const wallet = wallets[userId] || {
        balance: 100,
        transactions: []
    };

    if (wallet.balance < amount) {
        return {
            success: false,
            wallet
        };
    }

    wallet.balance -= amount;

    wallet.transactions.unshift({
        id: 't-' + Date.now(),
        type: 'debit',
        amount,
        description,
        date: new Date().toISOString()
    });

    wallets[userId] = wallet;

    setItem(KEYS.WALLET, wallets);

    return {
        success: true,
        wallet
    };
}

export function applyCashback(userId, orderAmount) {
    const cashback = Math.floor(orderAmount * 0.05);

    if (cashback > 0) {
        addWalletMoney(
            userId,
            cashback,
            `Cashback on ₹${orderAmount} order`
        );
    }

    return cashback;
}

// Full coupon validation with all rules

export function applyCoupon(
    code,
    orderAmount,
    userId = null
) {
    const coupons = getItem(KEYS.COUPONS) || [];

    const coupon = coupons.find(
        c => c.code === code.toUpperCase()
    );

    if (!coupon) {
        return {
            success: false,
            message:
                '❌ Coupon not found. Check the code and try again.'
        };
    }

    if (!coupon.active) {
        return {
            success: false,
            message:
                '❌ This coupon has been deactivated.'
        };
    }

    if (coupon.uses >= coupon.maxUses) {
        return {
            success: false,
            message:
                '❌ This coupon has reached its usage limit.'
        };
    }

    if (orderAmount < coupon.minOrder) {
        return {
            success: false,
            message:
                `❌ Minimum order ₹${coupon.minOrder} required for this coupon.`
        };
    }

    // Time window check

    if (coupon.timeWindow) {
        const hour = new Date().getHours();

        if (
            hour < coupon.timeWindow.start ||
            hour >= coupon.timeWindow.end
        ) {
            return {
                success: false,
                message:
                    `❌ This coupon is only valid ${coupon.timeWindow.start}:00 - ${coupon.timeWindow.end}:00.`
            };
        }
    }

    // Day of week check

    if (coupon.daysOfWeek) {
        const day = new Date().getDay();

        if (!coupon.daysOfWeek.includes(day)) {
            return {
                success: false,
                message:
                    '❌ This coupon is only valid on weekends (Sat & Sun).'
            };
        }
    }

    let discount = 0;

    if (coupon.type === 'percent') {

        discount = Math.round(
            orderAmount * coupon.value / 100
        );

        if (coupon.maxDiscount) {
            discount = Math.min(
                discount,
                coupon.maxDiscount
            );
        }

    } else if (coupon.type === 'flat') {

        discount = Math.min(
            coupon.value,
            orderAmount
        );
    }

    // Mark coupon as used

    const idx = coupons.findIndex(
        c => c.code === code.toUpperCase()
    );

    coupons[idx].uses += 1;

    setItem(KEYS.COUPONS, coupons);

    return {
        success: true,
        discount,
        message:
            `✅ ${coupon.desc} — You saved ₹${discount}!`
    };
}

export function getPaymentMethods() {

    return [

        {
            id: 'wallet',
            label: 'Canteen Wallet',
            icon: '💳',
            desc: 'Instant • 5% cashback'
        },

        {
            id: 'upi',
            label: 'UPI',
            icon: '📱',
            desc: 'GPay / PhonePe / Paytm'
        },

        {
            id: 'cash',
            label: 'Cash',
            icon: '💵',
            desc: 'Pay at counter'
        }
    ];
}