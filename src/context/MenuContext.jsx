import React, { createContext, useContext, useState } from 'react';
import { getItem, setItem, KEYS } from '../lib/storage';

const MenuContext = createContext();

export function MenuProvider({ children }) {
    const [menu, setMenu] = useState(() => getItem(KEYS.MENU) || []);

    const addItem = (item) => {
        const items = getItem(KEYS.MENU) || [];
        const newItem = { id: 'm-' + Date.now(), ...item, available: true };
        items.push(newItem);
        setItem(KEYS.MENU, items);
        setMenu([...items]);
    };

    const updateItem = (id, data) => {
        const items = getItem(KEYS.MENU) || [];
        const idx = items.findIndex(i => i.id === id);
        if (idx !== -1) {
            items[idx] = { ...items[idx], ...data };
            setItem(KEYS.MENU, items);
            setMenu([...items]);
        }
    };

    const deleteItem = (id) => {
        const items = (getItem(KEYS.MENU) || []).filter(i => i.id !== id);
        setItem(KEYS.MENU, items);
        setMenu(items);
    };

    const toggleAvailability = (id) => {
        const items = getItem(KEYS.MENU) || [];
        const idx = items.findIndex(i => i.id === id);
        if (idx !== -1) {
            items[idx].available = !items[idx].available;
            setItem(KEYS.MENU, items);
            setMenu([...items]);
        }
    };

    return (
        <MenuContext.Provider value={{
            menu,
            addItem,
            updateItem,
            deleteItem,
            toggleAvailability
        }}>
            {children}
        </MenuContext.Provider>
    );
}

export const useMenu = () => useContext(MenuContext);