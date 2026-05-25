// src/pages/admin/AdminSlots.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { getItem, setItem, KEYS, initializeData } from '@/lib/storage';
import AdminNav from '../../components/admin/AdminNav';
import { toast } from 'sonner';

export default function AdminSlots() {
    const [slots, setSlots] = useState([]);
    const [filterHour, setFilterHour] = useState('all');

    // Load slots on mount
    useEffect(() => {
        let loadedSlots = getItem(KEYS.SLOTS);
        if (!loadedSlots || loadedSlots.length === 0) {
            initializeData(); // Ensure default slots are created
            loadedSlots = getItem(KEYS.SLOTS);
        }
        setSlots(loadedSlots || []);
    }, []);

    const toggleSlot = (idx) => {
        const updated = [...slots];
        updated[idx].isAvailable = !updated[idx].isAvailable;
        setItem(KEYS.SLOTS, updated);
        setSlots(updated);
        toast.success(updated[idx].isAvailable ? 'Slot enabled' : 'Slot disabled');
    };

    const updateCapacity = (idx, val) => {
        const updated = [...slots];
        updated[idx].maxOrders = Math.max(1, Number(val) || 1);
        setItem(KEYS.SLOTS, updated);
        setSlots(updated);
        toast.success('Capacity updated successfully');
    };

    const hourRanges = [
        { id: 'all', label: 'All Slots' },
        { id: '8', label: '8-10 AM' },
        { id: '10', label: '10-12 PM' },
        { id: '12', label: '12-2 PM' },
        { id: '14', label: '2-4 PM' },
        { id: '16', label: '4-6 PM' },
        { id: '18', label: '6-8 PM' },
        { id: '20', label: '8-9 PM' },
    ];

    const filteredSlots = filterHour === 'all'
        ? slots
        : slots.filter(s => {
            const hour = parseInt(s.slot.split(':')[0]);
            const filterH = parseInt(filterHour);
            return hour >= filterH && hour < filterH + 2;
        });

    return (
        <div className="min-h-screen bg-background">
            <AdminNav />
            <div className="md:ml-64 p-6">
                <h1 className="text-3xl font-bold mb-8">Time Slot Manager</h1>

                {/* Filter Buttons */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {hourRanges.map(range => (
                        <button
                            key={range.id}
                            onClick={() => setFilterHour(range.id)}
                            className={`px-5 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all ${filterHour === range.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted hover:bg-muted/80'
                                }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {filteredSlots.map((slot, idx) => {
                        const realIdx = slots.findIndex(s => s.slot === slot.slot);
                        return (
                            <motion.div
                                key={slot.slot}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.02 }}
                                className={`glass rounded-3xl p-6 border ${!slot.isAvailable ? 'opacity-60' : ''}`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-primary" />
                                        <span className="font-semibold text-lg">{slot.slot}</span>
                                    </div>
                                    <Switch
                                        checked={slot.isAvailable}
                                        onCheckedChange={() => toggleSlot(realIdx)}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Maximum Orders</p>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={slot.maxOrders}
                                            onChange={(e) => updateCapacity(realIdx, e.target.value)}
                                            className="text-center"
                                        />
                                    </div>

                                    <p className="text-sm text-muted-foreground text-center">
                                        {slot.currentOrders || 0} / {slot.maxOrders} booked
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}