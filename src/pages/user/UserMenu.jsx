// src/pages/user/UserMenu.jsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Leaf, X } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import { useCart } from '../../context/CartContext';
import UserNav from '../../components/user/UserNav';

const CATEGORIES = [
    { id: 'all', label: 'All', icon: '🍽️' },
    { id: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { id: 'lunch', label: 'Lunch', icon: '☀️' },
    { id: 'snacks', label: 'Snacks', icon: '🍟' },
    { id: 'dinner', label: 'Dinner', icon: '🌙' },
    { id: 'beverages', label: 'Beverages', icon: '☕' },
];

function MenuCard({ item }) {
    const { addToCart } = useCart();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-card border border-border rounded-3xl overflow-hidden hover:shadow-lg transition"
        >
            <div className="relative h-40">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className={`absolute top-3 left-3 w-5 h-5 rounded-full border-2 border-white ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                {!item.available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-bold">Out of Stock</span>
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-lg leading-tight mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>

                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">₹{item.price}</span>
                    <button
                        onClick={() => item.available && addToCart(item)}
                        disabled={!item.available}
                        className="px-5 py-2 bg-primary text-primary-foreground rounded-2xl font-medium disabled:bg-muted disabled:text-muted-foreground"
                    >
                        + Add
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default function UserMenu() {
    const { menu } = useMenu();
    const [activeCategory, setActiveCategory] = useState('all');
    const [search, setSearch] = useState('');
    const [vegOnly, setVegOnly] = useState(false);

    const filteredMenu = useMemo(() => {
        let result = [...menu];

        if (activeCategory !== 'all') {
            result = result.filter(item => item.category === activeCategory);
        }
        if (search) {
            result = result.filter(item =>
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (vegOnly) {
            result = result.filter(item => item.isVeg);
        }

        return result;
    }, [menu, activeCategory, search, vegOnly]);

    return (
        <div className="min-h-screen bg-background pb-20">
            <UserNav />
            <div className="max-w-5xl mx-auto px-4 pt-6">
                <h1 className="text-3xl font-bold mb-6">Our Menu</h1>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Search dishes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 bg-card border border-border rounded-3xl focus:outline-none"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Categories */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap font-medium transition-all ${activeCategory === cat.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted hover:bg-muted/80'
                                }`}
                        >
                            <span>{cat.icon}</span> {cat.label}
                        </button>
                    ))}
                </div>

                {/* Veg Filter */}
                <button
                    onClick={() => setVegOnly(!vegOnly)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-2xl mb-8 text-sm font-medium ${vegOnly ? 'bg-green-100 text-green-700 dark:bg-green-900' : 'bg-muted'}`}
                >
                    <Leaf size={18} /> Veg Only {vegOnly && '✓'}
                </button>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredMenu.map(item => (
                            <MenuCard key={item.id} item={item} />
                        ))}
                    </AnimatePresence>
                </div>

                {filteredMenu.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-6xl mb-4">😕</p>
                        <p className="text-xl font-medium">No items found</p>
                    </div>
                )}
            </div>
        </div>
    );
}