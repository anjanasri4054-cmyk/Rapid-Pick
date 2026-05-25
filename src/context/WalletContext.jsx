import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getWallet, addWalletMoney } from '../services/wallet';
import { useAuth } from './AuthContext';

const WalletContext = createContext();

export function WalletProvider({ children }) {
    const { user } = useAuth();
    const [wallet, setWallet] = useState({ balance: 0, transactions: [] });

    const refreshWallet = useCallback(() => {
        if (user) {
            setWallet(getWallet(user.id));
        }
    }, [user]);

    useEffect(() => {
        refreshWallet();
    }, [refreshWallet]);

    const addMoney = (amount) => {
        if (!user) return;
        const updated = addWalletMoney(user.id, amount, 'Added via app');
        setWallet(updated);
    };

    return (
        <WalletContext.Provider value={{
            wallet,
            refresh: refreshWallet,
            addMoney
        }}>
            {children}
        </WalletContext.Provider>
    );
}

export const useWallet = () => useContext(WalletContext);