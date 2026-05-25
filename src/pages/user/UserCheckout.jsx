import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Clock, Tag, CreditCard, ShoppingBag, Wallet, Smartphone, Banknote, AlertCircle, Loader2, CheckCircle2, ArrowLeft, Gift, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import { getItem, KEYS } from '@/lib/storage';
import { applyCoupon, getWallet } from '@/services/wallet';
import { getDynamicPrice } from '@/services/recommendations';
import { isOrderingEnabled } from '@/services/notifications';
import UserNav from '@/components/user/UserNav';
import UPIQRPanel from '@/components/checkout/UPIQRPanel';
import SpinWheel from '@/components/checkout/SpinWheel';
import { toast } from 'sonner';

const STEPS = [
    { id: 1, label: 'Review', icon: ShoppingBag },
    { id: 2, label: 'Slot', icon: Clock },
    { id: 3, label: 'Payment', icon: CreditCard },
    { id: 4, label: 'Coupon', icon: Tag },
    { id: 5, label: 'Confirm', icon: Check },
];

const ALL_COUPONS = [
    { code: 'WELCOME20', desc: '20% off on first order' },
    { code: 'SAVE50', desc: '₹50 off on orders ₹299+' },
    { code: 'LUNCH30', desc: '30% off (12 PM - 2 PM)' },
    { code: 'HAPPYHOUR', desc: '15% off (4 PM - 6 PM)' },
    { code: 'STUDENT10', desc: '10% off for students' },
    { code: 'WEEKEND25', desc: '25% off on weekends' },
    { code: 'FLAT30', desc: '₹30 off above ₹100' },
    { code: 'REFER50', desc: '₹50 off - referral reward' },
    { code: 'BIRTHDAY', desc: '25% birthday discount' },
    { code: 'FREESHIP', desc: 'Free packaging' },
];

const PAYMENT_METHODS = [
    { id: 'wallet', label: 'Canteen Wallet', icon: Wallet, desc: 'Instant, cashback 5%' },
    { id: 'upi', label: 'UPI / QR Pay', icon: Smartphone, desc: 'PhonePe, GPay, Paytm' },
    { id: 'cash', label: 'Cash on Pickup', icon: Banknote, desc: 'Keep exact change' },
];

function StepIndicator({ current }) {
    return (
        <div className="flex items-center justify-center gap-1 mb-6">
            {STEPS.map((step, i) => {
                const done = current > step.id;
                const active = current === step.id;
                return (
                    <React.Fragment key={step.id}>
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300 ${done ? 'bg-green-500 text-white' : active ? 'bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30' : 'bg-muted text-muted-foreground'
                            }`}>
                            {done ? <Check className="w-4 h-4" /> : step.id}
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`flex-1 h-0.5 max-w-[28px] rounded transition-all duration-500 ${done ? 'bg-green-500' : 'bg-muted'}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

function getAvailableSlots() {
    const slots = getItem(KEYS.SLOTS) || [];
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    return slots.filter(s => {
        const [h, m] = s.slot.split(':').map(Number);
        return s.isAvailable && (h * 60 + m) >= cur + 15 && s.currentOrders < s.maxOrders;
    }).slice(0, 16);
}

export default function UserCheckout() {
    const { items, clearCart, maxPrepTime } = useCart();
    const { placeOrder } = useOrders();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('wallet');
    const [couponCode, setCouponCode] = useState('');
    const [couponResult, setCouponResult] = useState(null);
    const [couponShake, setCouponShake] = useState(false);
    const [instructions, setInstructions] = useState('');
    const [placing, setPlacing] = useState(false);
    const [placed, setPlaced] = useState(false);
    const [placedOrder, setPlacedOrder] = useState(null);

    const [logoTaps, setLogoTaps] = useState(0);
    const [upiVerified, setUpiVerified] = useState(false);
    const wallet = getWallet(user?.id);
    const availableSlots = useMemo(() => getAvailableSlots(), []);
    const dynamicItems = items.map(i => ({ ...i, dynamic: getDynamicPrice(i) }));
    const subtotal = dynamicItems.reduce((s, i) => s + i.dynamic.price * i.quantity, 0);
    const gst = Math.round(subtotal * 0.05);
    const discount = couponResult?.discount || 0;
    const finalAmount = Math.max(0, subtotal + gst - discount);
    const tempOrderId = useMemo(() => 'ORD' + Date.now().toString(36).toUpperCase(), []);

    const handleLogoTap = () => {
        const next = logoTaps + 1;
        setLogoTaps(next);
        if (next >= 5) {
            setCouponCode('SECRET25');
            setCouponResult(null);
            toast.success('🤫 Secret coupon unlocked: SECRET25!');
            setLogoTaps(0);
        }
    };

    useEffect(() => {
        if (items.length === 0 && !placed) navigate('/user/cart');
    }, [items.length, placed, navigate]);

    const applyCouponCode = () => {
        if (!couponCode.trim()) return;
        const res = applyCoupon(couponCode.toUpperCase(), subtotal, user?.id);
        setCouponResult(res);
        if (res.success) {
            toast.success(res.message);
        } else {
            setCouponShake(true);
            setTimeout(() => setCouponShake(false), 600);
            toast.error(res.message);
        }
    };

    const removeCoupon = () => {
        setCouponCode('');
        setCouponResult(null);
    };

    const handlePlaceOrder = async () => {
        if (!isOrderingEnabled()) { toast.error('Ordering is paused'); return; }
        if (paymentMethod === 'wallet' && wallet.balance < finalAmount) {
            toast.error('Insufficient wallet balance'); return;
        }
        setPlacing(true);
        await new Promise(r => setTimeout(r, 1000));
        const order = placeOrder({
            userId: user.id, userName: user.name, userEmail: user.email,
            items: items.map(i => ({ id: i.id, name: i.name, price: getDynamicPrice(i).price, quantity: i.quantity, prepTime: i.prepTime, isVeg: i.isVeg })),
            totalAmount: subtotal, discount, gst, finalAmount,
            timeSlot: selectedSlot, specialInstructions: instructions,
            estimatedReadyTime: maxPrepTime, paymentMethod,
            coupon: couponResult?.success ? couponCode : null,
        });
        setPlacing(false);
        if (order) {
            setPlacedOrder(order);
            setPlaced(true);
            clearCart();
            setTimeout(() => navigate(`/user/track/${order.id}`), 2000);
        }
    };

    if (placed) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-2xl shadow-green-500/30">
                        <CheckCircle2 className="w-14 h-14 text-white" />
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
                    <h2 className="text-2xl font-bold mb-1">Order Placed! 🎉</h2>
                    {placedOrder?.tokenNumber && (
                        <p className="text-4xl font-black text-primary mb-2">Token #{placedOrder.tokenNumber}</p>
                    )}
                    <p className="text-muted-foreground text-sm">Redirecting to order tracking...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24 md:pb-6">
            <UserNav />
            <div className="max-w-lg mx-auto px-4 py-6">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/user/cart')}
                        className="p-2 rounded-xl hover:bg-muted transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h1 className="text-xl font-bold cursor-pointer select-none" onClick={handleLogoTap}>
                        Checkout {logoTaps > 0 && logoTaps < 5 ? <span className="text-xs text-primary">({5 - logoTaps} more)</span> : ''}
                    </h1>
                    {discount > 0 && (
                        <span className="ml-auto text-xs font-semibold text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
                            💚 Saving ₹{discount}
                        </span>
                    )}
                </div>

                <StepIndicator current={step} />

                <AnimatePresence mode="wait">
                    {/* STEP 1: Review */}
                    {step === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                            <h2 className="font-bold mb-4 text-lg">Review Your Order</h2>
                            <div className="space-y-3 mb-5">
                                {dynamicItems.map(item => (
                                    <div key={item.id} className="glass rounded-2xl p-3 flex items-center gap-3">
                                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">₹{item.dynamic.price} × {item.quantity}</p>
                                            <p className="text-[10px] text-muted-foreground">~{item.prepTime} min</p>
                                        </div>
                                        <p className="font-bold text-sm text-primary">₹{item.dynamic.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="glass rounded-2xl p-4 space-y-2 text-sm mb-4">
                                <div className="flex justify-between text-muted-foreground"><span>Subtotal ({items.length} items)</span><span>₹{subtotal}</span></div>
                                <div className="flex justify-between text-muted-foreground"><span>GST (5%)</span><span>₹{gst}</span></div>
                                <div className="flex justify-between font-bold text-base border-t pt-2 mt-1"><span>Payable</span><span className="text-primary">₹{subtotal + gst}</span></div>
                            </div>
                            <div className="mb-4">
                                <label className="text-sm font-medium mb-1 block">Special instructions</label>
                                <textarea className="w-full bg-muted rounded-xl p-3 text-sm resize-none border border-border" rows={2}
                                    placeholder="Less spicy, no onions, extra sauce..." value={instructions} onChange={e => setInstructions(e.target.value)} />
                            </div>
                            <Button className="w-full h-12 rounded-xl font-semibold" onClick={() => setStep(2)}>
                                Continue <ChevronRight className="w-4 h-4" />
                            </Button>
                        </motion.div>
                    )}

                    {/* STEP 2: Time Slot */}
                    {step === 2 && (
                        <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                            <h2 className="font-bold mb-1 text-lg">Pick Pickup Time</h2>
                            <p className="text-sm text-muted-foreground mb-4">Choose when you'll arrive at the canteen</p>
                            {availableSlots.length > 0 ? (
                                <div className="grid grid-cols-4 gap-2 mb-6">
                                    {availableSlots.map(s => (
                                        <button key={s.slot} onClick={() => setSelectedSlot(s.slot)}
                                            className={`py-3 rounded-xl text-sm font-medium transition-all ${selectedSlot === s.slot
                                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105'
                                                : 'bg-muted text-muted-foreground hover:bg-muted/70'
                                                }`}>
                                            {s.slot}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground mb-6 p-4 glass rounded-xl text-center">No slots available right now</p>
                            )}
                            {selectedSlot && (
                                <div className="flex items-center gap-2 bg-green-500/10 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-sm font-medium mb-4">
                                    <Check className="w-4 h-4" /> Pickup at {selectedSlot}
                                </div>
                            )}
                            <Button className="w-full h-12 rounded-xl font-semibold" disabled={!selectedSlot} onClick={() => setStep(3)}>
                                Continue <ChevronRight className="w-4 h-4" />
                            </Button>
                        </motion.div>
                    )}

                    {/* STEP 3: Payment */}
                    {step === 3 && (
                        <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                            <h2 className="font-bold mb-4 text-lg">Payment Method</h2>
                            <div className="space-y-3 mb-4">
                                {PAYMENT_METHODS.map(m => {
                                    const Icon = m.icon;
                                    return (
                                        <button key={m.id} onClick={() => { setPaymentMethod(m.id); setUpiVerified(false); }}
                                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${paymentMethod === m.id ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-muted/30 hover:border-primary/30'
                                                }`}>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === m.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm">{m.label}</p>
                                                <p className="text-xs text-muted-foreground">{m.desc}</p>
                                                {m.id === 'wallet' && <p className="text-xs text-primary font-medium mt-0.5">Balance: ₹{wallet.balance}</p>}
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${paymentMethod === m.id ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                                                {paymentMethod === m.id && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* UPI QR Panel */}
                            <AnimatePresence>
                                {paymentMethod === 'upi' && (
                                    <motion.div key="upi-qr" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                        className="glass rounded-2xl p-4 mb-4 overflow-hidden">
                                        <UPIQRPanel amount={subtotal + gst} orderId={tempOrderId} onVerified={() => setUpiVerified(true)} />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {paymentMethod === 'wallet' && wallet.balance < (subtotal + gst) && (
                                <div className="flex items-center gap-2 text-amber-600 text-xs bg-amber-500/10 p-3 rounded-xl mb-4">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Insufficient balance. Top up or choose another method.
                                </div>
                            )}
                            <Button className="w-full h-12 rounded-xl font-semibold"
                                disabled={paymentMethod === 'upi' && !upiVerified}
                                onClick={() => setStep(4)}>
                                {paymentMethod === 'upi' && !upiVerified ? 'Verify Payment to Continue' : <>Continue <ChevronRight className="w-4 h-4" /></>}
                            </Button>
                        </motion.div>
                    )}

                    {/* STEP 4: Coupon */}
                    {step === 4 && (
                        <motion.div key="s4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                            <h2 className="font-bold mb-4 text-lg">Apply Coupon</h2>

                            {/* Applied coupon banner */}
                            {couponResult?.success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center justify-between bg-green-500/10 border border-green-500/30 px-4 py-3 rounded-xl mb-4"
                                >
                                    <div className="flex items-center gap-2">
                                        <Gift className="w-4 h-4 text-green-600" />
                                        <div>
                                            <p className="text-sm font-bold text-green-700 dark:text-green-400">Coupon Applied! 🎉</p>
                                            <p className="text-xs text-green-600">You saved ₹{discount}</p>
                                        </div>
                                    </div>
                                    <button onClick={removeCoupon}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
                                </motion.div>
                            )}

                            {/* Input */}
                            <motion.div
                                animate={couponShake ? { x: [-8, 8, -8, 8, 0] } : {}}
                                transition={{ duration: 0.4 }}
                                className="flex gap-2 mb-3"
                            >
                                <Input placeholder="Enter coupon code" className="rounded-xl h-11 uppercase tracking-widest font-mono"
                                    value={couponCode} onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponResult(null); }} />
                                <Button onClick={applyCouponCode} variant="outline" className="rounded-xl h-11 shrink-0 font-semibold">Apply</Button>
                            </motion.div>

                            {couponResult && !couponResult.success && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="text-xs font-medium text-destructive mb-3 bg-destructive/10 px-3 py-2 rounded-lg">
                                    {couponResult.message}
                                </motion.p>
                            )}

                            {/* Spin the Wheel */}
                            <details className="mb-4">
                                <summary className="cursor-pointer text-sm font-semibold text-primary py-2 px-3 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors select-none">
                                    🎰 Spin the Wheel for a bonus coupon!
                                </summary>
                                <div className="mt-3 pb-2">
                                    <SpinWheel onWin={(prize) => {
                                        setCouponCode(prize.code);
                                        setCouponResult(null);
                                        toast.success(`🎉 Won ${prize.label}! Code: ${prize.code}`);
                                    }} />
                                </div>
                            </details>

                            {/* Coupon grid */}
                            <p className="text-xs text-muted-foreground font-medium mb-2">Available coupons:</p>
                            <div className="grid grid-cols-1 gap-2 mb-6 max-h-44 overflow-y-auto">
                                {ALL_COUPONS.map(c => (
                                    <button key={c.code} onClick={() => { setCouponCode(c.code); setCouponResult(null); }}
                                        className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all text-left ${couponCode === c.code ? 'bg-primary/10 border border-primary/30' : 'bg-muted/60 hover:bg-muted'
                                            }`}>
                                        <div>
                                            <span className="font-mono font-bold text-primary text-sm">{c.code}</span>
                                            <p className="text-xs text-muted-foreground">{c.desc}</p>
                                        </div>
                                        <span className="text-xs text-primary font-medium">Use →</span>
                                    </button>
                                ))}
                            </div>
                            <Button className="w-full h-12 rounded-xl font-semibold" onClick={() => setStep(5)}>
                                {couponResult?.success ? '✓ Coupon Applied — Continue' : 'Skip & Continue'} <ChevronRight className="w-4 h-4" />
                            </Button>
                        </motion.div>
                    )}

                    {/* STEP 5: Confirm */}
                    {step === 5 && (
                        <motion.div key="s5" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                            <h2 className="font-bold mb-4 text-lg">Confirm Order</h2>
                            <div className="glass rounded-2xl p-4 space-y-3 mb-5 text-sm">
                                <div className="flex justify-between text-muted-foreground"><span>Items ({items.length})</span><span>₹{subtotal}</span></div>
                                <div className="flex justify-between text-muted-foreground"><span>GST (5%)</span><span>₹{gst}</span></div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600 font-medium">
                                        <span>🎉 Coupon ({couponCode})</span><span>−₹{discount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-lg border-t pt-2">
                                    <span>Total</span>
                                    <span className="text-primary">₹{finalAmount}</span>
                                </div>
                                <div className="pt-1 border-t space-y-1.5 text-xs text-muted-foreground">
                                    <div className="flex justify-between"><span>Payment</span><span className="capitalize font-medium">{paymentMethod}</span></div>
                                    <div className="flex justify-between"><span>Pickup slot</span><span className="font-medium">{selectedSlot}</span></div>
                                    <div className="flex justify-between"><span>Est. prep time</span><span className="font-medium">~{maxPrepTime} min</span></div>
                                    {paymentMethod === 'wallet' && (
                                        <div className="flex justify-between text-blue-500"><span>Cashback (5%)</span><span>+₹{Math.floor(finalAmount * 0.05)}</span></div>
                                    )}
                                </div>
                            </div>
                            <Button onClick={handlePlaceOrder} disabled={placing}
                                className="w-full h-14 rounded-2xl text-base font-bold bg-gradient-to-r from-primary to-accent hover:opacity-90 border-0 shadow-xl shadow-primary/20">
                                {placing ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" /> Placing Order...
                                    </span>
                                ) : `🚀 Place Order · ₹${finalAmount}`}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}