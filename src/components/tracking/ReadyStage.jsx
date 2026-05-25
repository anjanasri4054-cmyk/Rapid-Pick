import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, CheckCircle2, Share2, MapPin, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/context/OrderContext';
import { toast } from 'sonner';

const TOKEN_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

function SlotMachineChar({ char, delay }) {
    return (
        <motion.span
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay }}
            className="inline-block"
        >
            {char}
        </motion.span>
    );
}

// Simple QR grid mock (deterministic from string)
function QRMock({ data }) {
    const size = 12;
    const cells = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const hash = (data.charCodeAt((r * size + c) % data.length) * 31 + r * 7 + c * 13) % 100;
            const isCorner = (r < 3 && c < 3) || (r < 3 && c >= size - 3) || (r >= size - 3 && c < 3);
            cells.push({ r, c, fill: isCorner || hash < 45 });
        }
    }
    return (
        <div className="inline-grid gap-px" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
            {cells.map(({ r, c, fill }) => (
                <div
                    key={`${r}-${c}`}
                    className={`w-3 h-3 md:w-4 md:h-4 rounded-sm ${fill ? 'bg-foreground' : 'bg-background'}`}
                />
            ))}
        </div>
    );
}

export default function ReadyStage({ order }) {
    const { markArrived } = useOrders();
    const [copied, setCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(null);
    const [arrived, setArrived] = useState(order.customerArrived);

    const token = order.tokenNumber
        ? `#${String(order.tokenNumber).padStart(6, '0').toUpperCase()}`
        : order.digitalToken || '#------';

    // Expiry countdown
    useEffect(() => {
        const readyAt = order.readyAt ? new Date(order.readyAt).getTime() : Date.now();
        const expiry = readyAt + TOKEN_EXPIRY_MS;
        const update = () => {
            const rem = Math.max(0, Math.round((expiry - Date.now()) / 1000));
            setSecondsLeft(rem);
        };
        update();
        const iv = setInterval(update, 1000);
        return () => clearInterval(iv);
    }, [order.readyAt]);

    const copyToken = () => {
        navigator.clipboard.writeText(token).catch(() => { });
        setCopied(true);
        toast.success('Token copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const shareToken = () => {
        const text = `My canteen token: ${token} | Order: ${order.id}`;
        if (navigator.share) {
            navigator.share({ title: 'My Order Token', text }).catch(() => { });
        } else {
            navigator.clipboard.writeText(text).catch(() => { });
            toast.success('Share link copied!');
        }
    };

    const handleArrived = () => {
        markArrived(order.id);
        setArrived(true);
        toast.success('Canteen staff notified! 🎉');
    };

    const isExpiring = secondsLeft !== null && secondsLeft < 300;
    const isExpired = secondsLeft === 0;
    const minsLeft = secondsLeft !== null ? Math.floor(secondsLeft / 60) : 30;
    const secsLeft = secondsLeft !== null ? secondsLeft % 60 : 0;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Token display */}
            <div className={`glass rounded-3xl p-6 text-center border-2 ${isExpired ? 'border-red-400/50 bg-red-50/30 dark:bg-red-900/10' :
                    isExpiring ? 'border-red-300/50 bg-red-50/20 dark:bg-red-900/5' :
                        'border-green-400/40 bg-green-50/30 dark:bg-green-900/10'
                }`}>
                <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">
                    🎫 Your Digital Token
                </p>

                {/* Giant slot-machine token */}
                <div className={`font-black font-mono tracking-widest mb-2 overflow-hidden ${isExpiring ? 'text-red-500 dark:text-red-400' : 'text-green-700 dark:text-green-300'
                    }`} style={{ fontSize: 'clamp(2.5rem, 10vw, 5rem)' }}>
                    {token.split('').map((ch, i) => (
                        <SlotMachineChar key={i} char={ch} delay={i * 0.07} />
                    ))}
                </div>

                <p className="text-xs text-muted-foreground mb-1">Show this at the counter</p>

                {/* Expiry */}
                {!isExpired && secondsLeft !== null && (
                    <div className={`text-xs font-medium mb-4 ${isExpiring ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`}>
                        {isExpiring ? '⚠️ ' : ''}Expires in {String(minsLeft).padStart(2, '0')}:{String(secsLeft).padStart(2, '0')}
                        {isExpiring && ' — hurry!'}
                    </div>
                )}
                {isExpired && (
                    <div className="text-xs text-red-500 font-medium mb-4">⛔ Token expired — please contact the counter</div>
                )}

                {/* QR toggle */}
                <AnimatePresence>
                    {showQR && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-4"
                        >
                            <div className="inline-block p-3 bg-white rounded-2xl border mb-2">
                                <QRMock data={`${token}|${order.id}|${order.finalAmount || order.totalAmount}`} />
                            </div>
                            <p className="text-[10px] text-muted-foreground">Scan at counter</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Action buttons */}
                <div className="flex justify-center gap-2 flex-wrap">
                    <button onClick={copyToken}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors">
                        {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button onClick={shareToken}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-colors">
                        <Share2 className="w-3.5 h-3.5" /> Share
                    </button>
                    <button onClick={() => setShowQR(q => !q)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/10 text-purple-700 dark:text-purple-400 text-xs font-medium hover:bg-purple-500/20 transition-colors">
                        <QrCode className="w-3.5 h-3.5" /> {showQR ? 'Hide' : 'QR'}
                    </button>
                </div>
            </div>

            {/* Arrived button */}
            {!arrived ? (
                <Button
                    onClick={handleArrived}
                    className="w-full h-12 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg shadow-green-500/20"
                >
                    <MapPin className="w-4 h-4 mr-2" /> I'm at the Canteen
                </Button>
            ) : (
                <div className="w-full text-center text-sm text-green-600 font-medium bg-green-500/10 py-3 rounded-2xl border border-green-400/30">
                    ✅ Staff notified — they're getting your order!
                </div>
            )}

            {/* Mock directions */}
            <div className="glass rounded-2xl p-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">🗺️ Directions to Canteen</p>
                <div className="relative h-28 rounded-xl overflow-hidden bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 border border-border">
                    {/* Mock map */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg width="100%" height="100%" className="opacity-30">
                            <line x1="20%" y1="50%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="2" strokeDasharray="4" />
                            <line x1="50%" y1="50%" x2="50%" y2="80%" stroke="currentColor" strokeWidth="2" />
                            <line x1="50%" y1="80%" x2="80%" y2="80%" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <div className="absolute left-[18%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-200" />
                        <div className="absolute right-[18%] bottom-[18%] w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-200" />
                    </div>
                    <div className="absolute bottom-2 left-2 text-[10px] text-muted-foreground font-medium">📍 You → 🍽️ Canteen (~3 min walk)</div>
                </div>
            </div>
        </motion.div>
    );
}