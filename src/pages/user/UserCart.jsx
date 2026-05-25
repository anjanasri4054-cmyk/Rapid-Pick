// src/pages/user/UserCart.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import UserNav from '../../components/user/UserNav';

export default function UserCart() {
    const { items, removeFromCart, updateQuantity, totalAmount, totalItems } = useCart();
    const navigate = useNavigate();

    const gst = Math.round(totalAmount * 0.05);
    const finalTotal = totalAmount + gst;

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background pb-20">
                <UserNav />
                <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
                    <ShoppingBag size={80} className="text-muted-foreground mb-6 opacity-40" />
                    <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
                    <p className="text-muted-foreground mb-8">Add some delicious items from the menu</p>
                    <Link
                        to="/user/menu"
                        className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-semibold hover:bg-primary/90 transition"
                    >
                        Browse Menu
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <UserNav />
            <div className="max-w-2xl mx-auto px-4 pt-6">
                <h1 className="text-3xl font-bold mb-8">My Cart ({totalItems} items)</h1>

                <div className="space-y-4 mb-8">
                    {items.map(item => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-card border border-border rounded-3xl p-5 flex items-center gap-4"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-2xl"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-9 h-9 flex items-center justify-center border border-border rounded-xl hover:bg-muted"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="font-bold w-8 text-center">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-9 h-9 flex items-center justify-center bg-primary text-primary-foreground rounded-xl"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <div className="text-right min-w-[70px]">
                                <p className="font-bold text-lg text-primary">₹{item.price * item.quantity}</p>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-600 mt-1"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bill Summary */}
                <div className="bg-card border border-border rounded-3xl p-6 mb-8">
                    <div className="space-y-3">
                        <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal</span>
                            <span>₹{totalAmount}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>GST (5%)</span>
                            <span>₹{gst}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold border-t border-border pt-4">
                            <span>Total</span>
                            <span className="text-primary">₹{finalTotal}</span>
                        </div>
                    </div>
                </div>

                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/user/checkout')}
                    className="w-full py-4 bg-primary text-primary-foreground font-bold text-lg rounded-2xl hover:bg-primary/90 transition"
                >
                    Proceed to Checkout →
                </motion.button>
            </div>
        </div>
    );
}