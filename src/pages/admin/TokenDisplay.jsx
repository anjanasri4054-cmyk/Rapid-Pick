// src/pages/admin/TokenDisplay.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Hash, CheckCircle, Clock } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';

function speakToken(tokenNum) {
    if (!('speechSynthesis' in window)) {
        console.warn("Speech synthesis not supported");
        return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
        `Token number ${tokenNum}, please collect your order at the counter.`
    );
    utterance.rate = 0.95;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
}

export default function TokenDisplay() {
    const { orders } = useOrders();
    const [announced, setAnnounced] = useState(new Set());

    const readyOrders = orders
        .filter(o => o.status === 'ready' && o.tokenNumber)
        .sort((a, b) => a.tokenNumber - b.tokenNumber);

    const pendingOrders = orders
        .filter(o => ['pending', 'preparing'].includes(o.status) && o.tokenNumber)
        .sort((a, b) => a.tokenNumber - b.tokenNumber);

    // Auto announce new ready orders
    useEffect(() => {
        readyOrders.forEach(order => {
            if (!announced.has(order.id)) {
                speakToken(order.tokenNumber);
                setAnnounced(prev => new Set([...prev, order.id]));
            }
        });
    }, [readyOrders]);

    const nowServing = readyOrders[0];

    return (
        <div className="min-h-screen bg-gray-950 text-white font-mono">
            {/* Header */}
            <div className="bg-gray-900 border-b border-gray-800 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Hash className="w-7 h-7 text-orange-500" />
                    <h1 className="text-2xl font-bold tracking-widest">TOKEN DISPLAY</h1>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-8">
                {/* Now Serving Section */}
                <div className="mb-12">
                    <p className="text-gray-400 uppercase tracking-[3px] text-sm mb-4">NOW SERVING</p>
                    <AnimatePresence mode="wait">
                        {nowServing ? (
                            <motion.div
                                key={nowServing.tokenNumber}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-3xl p-12 text-center shadow-2xl"
                            >
                                <p className="text-emerald-100 tracking-widest text-sm mb-2">TOKEN NUMBER</p>
                                <p className="text-[9rem] font-bold leading-none text-white">
                                    {String(nowServing.tokenNumber).padStart(2, '0')}
                                </p>
                                <div className="flex items-center justify-center gap-3 mt-6">
                                    <CheckCircle className="w-7 h-7" />
                                    <p className="text-2xl font-medium">READY FOR PICKUP</p>
                                </div>
                                <button
                                    onClick={() => speakToken(nowServing.tokenNumber)}
                                    className="mt-8 flex items-center gap-3 mx-auto bg-white/20 hover:bg-white/30 px-8 py-4 rounded-2xl text-lg transition"
                                >
                                    <Volume2 className="w-6 h-6" /> Announce Again
                                </button>
                            </motion.div>
                        ) : (
                            <div className="bg-gray-900 rounded-3xl p-16 text-center">
                                <p className="text-8xl font-light text-gray-600 mb-4">--</p>
                                <p className="text-gray-500 text-xl">No orders ready yet</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Ready Orders */}
                    <div>
                        <p className="text-emerald-400 flex items-center gap-2 mb-4 text-sm uppercase tracking-widest">
                            <CheckCircle className="w-4 h-4" /> READY ({readyOrders.length})
                        </p>
                        <div className="space-y-3">
                            {readyOrders.map(order => (
                                <motion.div key={order.id} className="bg-green-950/50 border border-green-500/30 rounded-2xl p-5 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <span className="text-4xl font-bold text-emerald-400">
                                            {String(order.tokenNumber).padStart(2, '0')}
                                        </span>
                                        <div>
                                            <p className="font-medium">{order.userName}</p>
                                            <p className="text-xs text-gray-500">{order.timeSlot}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => speakToken(order.tokenNumber)} className="text-emerald-400 hover:text-white">
                                        <Volume2 className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Pending Queue */}
                    <div>
                        <p className="text-amber-400 flex items-center gap-2 mb-4 text-sm uppercase tracking-widest">
                            <Clock className="w-4 h-4" /> IN QUEUE ({pendingOrders.length})
                        </p>
                        <div className="space-y-3">
                            {pendingOrders.map((order, index) => (
                                <div key={order.id} className="bg-gray-900 rounded-2xl p-5 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <span className="text-3xl font-bold text-gray-500">
                                            {String(order.tokenNumber).padStart(2, '0')}
                                        </span>
                                        <div>
                                            <p className="text-gray-300">{order.userName}</p>
                                            <p className="text-xs text-gray-600">Position #{index + 1}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs uppercase px-4 py-1.5 rounded-full bg-gray-800">
                                        {order.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}