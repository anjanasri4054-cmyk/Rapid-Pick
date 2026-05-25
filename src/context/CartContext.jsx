import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);

    // Optional: Persist cart in localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) setItems(JSON.parse(savedCart));
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (menuItem) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === menuItem.id);
            if (existing) {
                return prev.map(i =>
                    i.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...menuItem, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const updateQuantity = (id, qty) => {
        if (qty <= 0) {
            removeFromCart(id);
            return;
        }
        setItems(prev => prev.map(i =>
            i.id === id ? { ...i, quantity: qty } : i
        ));
    };

    const clearCart = () => setItems([]);

    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const maxPrepTime = items.length > 0 ? Math.max(...items.map(i => i.prepTime || 10)) : 0;

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalAmount,
            totalItems,
            maxPrepTime
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);