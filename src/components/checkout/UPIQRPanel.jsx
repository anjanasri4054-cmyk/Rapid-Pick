import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Copy, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';

const UPI_ID = 'canteen@okhdfcbank';
const QR_TTL = 120; // 2 minutes

// Generate a simple QR-like visual using CSS grid
function FakeQR({ value }) {
    // Deterministic pseudo-random pattern from string hash
    const hash = value.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) >>> 0, 0);
    const cells = Array.from({ length: 21 * 21 }, (_, i) => {
        const row = Math.floor(i / 21);
        const col = i % 21;
        // Fixed finder patterns in corners
        const inFinder =
            (row < 7 && col < 7) ||
            (row < 7 && col > 13) ||
            (row > 13 && col < 7);
        if (inFinder) {
            const r = row % 7; const c2 = col % 7;
            return r === 0 || r === 6 || c2 === 0 || c2 === 6 || (r >= 2 && r <= 4 && c2 >= 2 && c2 <= 4);
        }
        return ((hash >>> (i % 32)) & 1) === 1;
    });

    return (
        <div
            className="relative mx-auto"
            style={{ width: 168, height: 168, padding: 8, background: 'white', borderRadius: 12 }}
        >
            {/* Scanning animation */}
            <motion.div
                className="absolute left-2 right-2 h-0.5 bg-green-400/80 rounded-full z-10"
                style={{ top: 8 }}
                animate={{ top: [8, 160, 8] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(21, 1fr)', gap: 1 }}>
                {cells.map((filled, i) => (
                    <div key={i} style={{
                        width: '100%', aspectRatio: '1',
                        background: filled ? '#111' : '#fff',
                    }} />
                ))}
            </div>
        </div>
    );
}

export default function UPIQRPanel({ amount, orderId, onVerified }) {
    const [timeLeft, setTimeLeft] = useState(QR_TTL);
    const [txId, setTxId] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);
    const [expired, setExpired] = useState(false);
    const [refreshCount, setRefreshCount] = useState(0);

    useEffect(() => {
        setTimeLeft(QR_TTL);
        setExpired(false);
        const interval = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) { clearInterval(interval); setExpired(true); return 0; }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [refreshCount]);

    const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const secs = String(timeLeft % 60).padStart(2, '0');

    const upiLink = `upi://pay?pa=${UPI_ID}&pn=CanteenGo&am=${amount}&tn=${orderId}&cu=INR`;

    const handleVerify = async () => {
        if (!txId.trim()) { toast.error('Enter transaction ID'); return; }
        setVerifying(true);
        await new Promise(r => setTimeout(r, 1200));
        setVerifying(false);
        setVerified(true);
        toast.success('Payment verified! ✅');
        setTimeout(() => onVerified?.(), 800);
    };

    if (verified) {
        return (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-3 py-6">
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle2 className="w-9 h-9 text-white" />
                </div>
                <p className="font-bold text-green-600">Payment Verified!</p>
            </motion.div>
        );
    }

    return (
        <div className="space-y-4">
            {/* QR */}
            <div className="flex flex-col items-center gap-3">
                <AnimatePresence mode="wait">
                    {expired ? (
                        <motion.div key="exp" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="w-44 h-44 rounded-2xl bg-muted flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border">
                            <p className="text-muted-foreground text-sm font-semibold">QR Expired</p>
                            <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setRefreshCount(c => c + 1)}>
                                Refresh QR
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div key={`qr-${refreshCount}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            className="relative overflow-hidden rounded-2xl shadow-xl border-4 border-primary/20">
                            <FakeQR value={`${orderId}-${amount}-${refreshCount}`} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Timer */}
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-mono font-bold ${timeLeft < 30 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-muted text-muted-foreground'
                    }`}>
                    <span className={`w-2 h-2 rounded-full ${expired ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
                    {expired ? 'Expired' : `${mins}:${secs} remaining`}
                </div>
            </div>

            {/* UPI Info */}
            <div className="bg-muted/60 rounded-xl p-3 space-y-1.5 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">UPI ID</span>
                    <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold">{UPI_ID}</span>
                        <button onClick={() => { navigator.clipboard.writeText(UPI_ID); toast.success('UPI ID copied!'); }}
                            className="text-primary"><Copy className="w-3.5 h-3.5" /></button>
                    </div>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-bold text-primary">₹{amount}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Ref</span>
                    <span className="font-mono text-xs">{orderId}</span>
                </div>
            </div>

            {/* Pay buttons */}
            <div className="grid grid-cols-3 gap-2">
                {[
                    { name: 'PhonePe', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', emoji: '📱' },
                    { name: 'GPay', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', emoji: '🔵' },
                    { name: 'Paytm', color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400', emoji: '💳' },
                ].map(app => (
                    <a key={app.name} href={upiLink}
                        className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-semibold ${app.color}`}>
                        <span className="text-xl">{app.emoji}</span>
                        {app.name}
                    </a>
                ))}
            </div>

            {/* Transaction ID verification */}
            <div className="border-t pt-3">
                <p className="text-xs text-muted-foreground mb-2 font-medium">After paying, enter transaction ID:</p>
                <div className="flex gap-2">
                    <Input value={txId} onChange={e => setTxId(e.target.value)}
                        placeholder="e.g. 123456789012"
                        className="rounded-xl h-10 font-mono text-sm" />
                    <Button onClick={handleVerify} disabled={verifying || expired} className="rounded-xl h-10 shrink-0 px-4">
                        {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                    </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Or click "I've Paid" after scanning</p>
                <Button variant="outline" className="w-full mt-2 rounded-xl h-10 text-sm" onClick={() => {
                    if (!txId.trim()) { setTxId('MOCK' + Math.random().toString().slice(2, 10).toUpperCase()); }
                    handleVerify();
                }}>
                    ✅ I've Paid
                </Button>
            </div>
        </div>
    );
}