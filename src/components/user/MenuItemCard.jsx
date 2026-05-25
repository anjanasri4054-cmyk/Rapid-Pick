import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, Leaf, Flame, Users, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import ItemCustomizeModal from './ItemCustomizeModal';

function getCalories(item) {
    const base = { breakfast: 280, lunch: 480, dinner: 520, snacks: 200 };
    return (base[item.category] || 300) + Math.floor(item.price * 1.2);
}

export default function MenuItemCard({ item }) {
    const { addToCart } = useCart();
    const [showModal, setShowModal] = useState(false);

    const calories = getCalories(item);

    return (
        <>
            <motion.div
                whileHover={{ y: -4 }}
                className="glass rounded-2xl overflow-hidden group cursor-pointer"
                onClick={() => item.available && setShowModal(true)}
            >
                <div className="relative h-44 overflow-hidden">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    {/* Badges */}
                    <div className={`absolute top-3 left-3 text-[10px] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 ${item.isVeg ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {item.isVeg ? '🌿 VEG' : '🍖 NON-VEG'}
                    </div>

                    {!item.available && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <span className="text-white font-bold">Out of Stock</span>
                        </div>
                    )}
                </div>

                <div className="p-3.5">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold leading-tight text-sm flex-1 pr-2">{item.name}</h3>
                        <div className="flex items-center text-amber-500 text-xs font-medium">
                            <Star className="w-3.5 h-3.5 fill-current" /> {item.rating || '4.5'}
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{item.description}</p>

                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.prepTime || 12} min</span>
                        <span>🔥 {calories} kcal</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">₹{item.price}</span>
                        <div className="text-primary text-xs font-semibold flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-xl">
                            Customize <ChevronRight className="w-3 h-3" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {showModal && <ItemCustomizeModal item={item} onClose={() => setShowModal(false)} />}
        </>
    );
}