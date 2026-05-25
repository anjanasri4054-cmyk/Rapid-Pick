import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';

export default function LiveSyncIndicator() {
    const [connected, setConnected] = useState(true);
    const [lastSync, setLastSync] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setLastSync(new Date());
            setConnected(navigator.onLine);
        }, 3000);

        const handleOnline = () => setConnected(true);
        const handleOffline = () => setConnected(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            clearInterval(interval);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border text-xs font-medium">
            <motion.div
                className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}
                animate={{ scale: connected ? [1, 1.4, 1] : 1 }}
                transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className={connected ? 'text-green-600 dark:text-green-400' : 'text-red-500'}>
                {connected ? 'Live • Connected' : 'Offline'}
            </span>
            <span className="text-muted-foreground hidden sm:inline">
                • Synced {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
    );
}