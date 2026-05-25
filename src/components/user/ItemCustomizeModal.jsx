import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Flame, Leaf, AlertTriangle, Info } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useCart } from '../../context/CartContext';
import { toast } from 'sonner';

const SPICE_LABELS = ['Mild 😊', 'Low 🌶', 'Medium 🌶🌶', 'Hot 🔥', 'Extra Hot 🔥🔥'];

const TOPPINGS = [
    { id: 't1', label: 'Extra Cheese', price: 20 },
    { id: 't2', label: 'Onions', price: 0 },
    { id: 't3', label: 'Sauces', price: 10 },
    { id: 't4', label: 'Extra Masala', price: 5 },
    { id: 't5', label: 'No Coriander', price: 0 },
    { id: 't6', label: 'Less Oil', price: 0 },
];

const ALLERGENS = { nuts: '🥜 Nuts', dairy: '🥛 Dairy', gluten: '🌾 Gluten', eggs: '🥚 Eggs' };

function getCalories(item) {
    const base = { breakfast: 280, lunch: 480, dinner: 520, snacks: 200 };
    return (base[item.category] || 300) + Math.floor(item.price * 1.2);
}

export default function ItemCustomizeModal({ item, onClose }) {
    const { addToCart } = useCart();
    const [spice, setSpice] = useState(2);
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [note, setNote] = useState('');
    const [qty, setQty] = useState(1);

    const toggleTopping = (id) => {
        setSelectedToppings(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const extraCost = selectedToppings.reduce((sum, id) => {
        const topping = TOPPINGS.find(t => t.id === id);
        return sum + (topping?.price || 0);
    }, 0);

    const totalPrice = (item.price + extraCost) * qty;
    const calories = getCalories(item);
    const itemAllergens = item.tags?.filter(t => ALLERGENS[t]) || [];

    const handleAdd = () => {
        for (let i = 0; i < qty; i++) {
            addToCart({
                ...item,
                price: item.price + extraCost,
                customNote: note,
                spiceLevel: spice,
                toppings: selectedToppings.map(id => TOPPINGS.find(t => t.id === id)?.label).filter(Boolean),
            });
        }
        toast.success(`${qty}× ${item.name} added to cart!`);
        onClose();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4"
                onClick={e => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 60, opacity: 0 }}
                    className="bg-card w-full max-w-md rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
                >
                    {/* Header Image */}
                    <div className="relative h-48 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white">
                            <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-3 left-4 text-white">
                            <h2 className="font-bold text-xl">{item.name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}>
                                    {item.isVeg ? '🌿 VEG' : '🍖 NON-VEG'}
                                </span>
                                <span className="text-xs opacity-80">~{calories} kcal</span>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-1 p-4 space-y-5">
                        {/* Allergens */}
                        {itemAllergens.length > 0 && (
                            <div className="flex gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
                                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-700 dark:text-amber-400">
                                    Contains: {itemAllergens.map(a => ALLERGENS[a]).join(', ')}
                                </p>
                            </div>
                        )}

                        {/* Spice Level */}
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                                <Flame className="w-3 h-3" /> Spice Level
                            </p>
                            <div className="flex gap-2">
                                {SPICE_LABELS.map((label, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSpice(i)}
                                        className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${spice === i ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Toppings */}
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Add-ons</p>
                            <div className="grid grid-cols-2 gap-2">
                                {TOPPINGS.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => toggleTopping(t.id)}
                                        className={`flex justify-between items-center px-3 py-2 rounded-xl text-xs font-medium border transition-all ${selectedToppings.includes(t.id)
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border hover:bg-muted'
                                            }`}
                                    >
                                        <span>{t.label}</span>
                                        <span>{t.price > 0 ? `+₹${t.price}` : 'Free'}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Note */}
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Special Instructions</p>
                            <textarea
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                placeholder="No onions, extra spicy..."
                                className="w-full h-20 text-sm p-3 rounded-xl border border-border bg-muted/50 resize-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center active:bg-muted/70">
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-bold text-xl w-6 text-center">{qty}</span>
                                <button onClick={() => setQty(q => q + 1)} className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center active:bg-primary/90">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">Total</p>
                                <p className="font-bold text-2xl">₹{totalPrice}</p>
                            </div>
                        </div>

                        <Button onClick={handleAdd} className="w-full h-12 rounded-2xl text-base font-semibold">
                            Add {qty} to Cart • ₹{totalPrice}
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}