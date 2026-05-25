import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, RefreshCw, Share2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useOrders } from '../../context/OrderContext';
import { useCart } from '../../context/CartContext';
import { useMenu } from '../../context/MenuContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function Confetti() {
    const pieces = Array.from({ length: 40 }, (_, i) => i);
    const colors = ['#f97316', '#22c55e', '#3b82f6', '#a855f7', '#eab308', '#ec4899'];

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
            {pieces.map(i => {
                const color = colors[i % colors.length];
                const left = Math.random() * 100;
                const delay = Math.random() * 2;
                const dur = 2 + Math.random() * 2;
                return (
                    <motion.div
                        key={i}
                        style={{ left: `${left}%`, backgroundColor: color, top: '-10px', width: 8, height: 8 }}
                        className="absolute rounded-sm"
                        animate={{ y: ['0vh', '110vh'], rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)], opacity: [1, 1, 0] }}
                        transition={{ duration: dur, delay, ease: 'easeIn', repeat: 2, repeatDelay: 1 }}
                    />
                );
            })}
        </div>
    );
}

export default function CompletedStage({ order }) {
    const { addReview } = useOrders();
    const { addToCart } = useCart();
    const { menu } = useMenu();
    const navigate = useNavigate();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(order.reviewed || false);
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setShowConfetti(false), 6000);
        return () => clearTimeout(t);
    }, []);

    const handleReview = () => {
        if (!rating) {
            toast.error('Please select a rating');
            return;
        }
        addReview(order.id, rating, comment);
        setSubmitted(true);
        toast.success('Thanks for your feedback! 🌟');
    };

    const handleReorder = () => {
        order.items.forEach(item => {
            const menuItem = menu.find(m => m.id === item.id);
            if (menuItem?.available) addToCart(menuItem);
        });
        toast.success('Items added to cart!');
        navigate('/user/cart');
    };

    const shareText = `Just enjoyed ${order.items[0]?.name || 'delicious food'} from CanteenGo! 😋 #CanteenGo`;

    return (
        <>
            {showConfetti && <Confetti />}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                {/* Celebration Header */}
                <div className="glass rounded-3xl p-6 text-center border border-green-400/30 bg-green-50/30 dark:bg-green-900/10">
                    <motion.div animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }} transition={{ duration: 1, delay: 0.3 }} className="text-6xl mb-3">
                        🎉
                    </motion.div>
                    <h3 className="text-2xl font-black text-green-700 dark:text-green-300 mb-1">Order Completed!</h3>
                    <p className="text-sm text-muted-foreground">Enjoy your meal! Come back soon 😊</p>
                    {order.tokenNumber && (
                        <p className="text-xs text-muted-foreground mt-2">Token #{order.tokenNumber} · ₹{order.finalAmount || order.totalAmount} paid</p>
                    )}
                </div>

                {/* Rating Section */}
                {!submitted ? (
                    <div className="glass rounded-2xl p-5">
                        <p className="font-semibold text-sm mb-3 text-center">How was your order?</p>
                        <div className="flex justify-center gap-2 mb-3">
                            {[1, 2, 3, 4, 5].map(s => (
                                <motion.button key={s} whileTap={{ scale: 0.8 }} onClick={() => setRating(s)}>
                                    <Star className={`w-8 h-8 transition-colors ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'}`} />
                                </motion.button>
                            ))}
                        </div>
                        <textarea
                            placeholder="Tell us more... (optional)"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            className="w-full text-sm p-3 rounded-xl border border-border bg-muted/50 resize-none mb-3"
                            rows={2}
                        />
                        <Button onClick={handleReview} className="w-full rounded-xl">Submit Review ⭐</Button>
                    </div>
                ) : (
                    <div className="glass rounded-2xl p-4 text-center">
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">✅ Thanks for your review!</p>
                        <div className="flex justify-center gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} className={`w-5 h-5 ${s <= (order.rating || rating) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'}`} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <Button onClick={handleReorder} variant="outline" className="rounded-xl h-11">
                        <RefreshCw className="w-4 h-4 mr-2" /> Reorder
                    </Button>
                    <Button
                        onClick={() => {
                            navigator.clipboard.writeText(shareText);
                            toast.success('Link copied to share!');
                        }}
                        variant="outline"
                        className="rounded-xl h-11"
                    >
                        <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>
                </div>
            </motion.div>
        </>
    );
}