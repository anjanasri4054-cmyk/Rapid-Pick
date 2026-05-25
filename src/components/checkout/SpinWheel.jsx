import React, { useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Button } from '../../components/ui/button';

const PRIZES = [
    { label: '5% OFF', code: 'SPIN5', color: '#f97316', discount: 5 },
    { label: '10% OFF', code: 'SPIN10', color: '#8b5cf6', discount: 10 },
    { label: '₹20 OFF', code: 'SPIN20FLAT', color: '#ec4899', discount: 20 },
    { label: 'TRY AGAIN', code: null, color: '#6b7280', discount: 0 },
    { label: '15% OFF', code: 'SPIN15', color: '#10b981', discount: 15 },
    { label: '₹10 OFF', code: 'SPIN10FLAT', color: '#f59e0b', discount: 10 },
    { label: '20% OFF', code: 'SPIN20', color: '#ef4444', discount: 20 },
    { label: 'TRY AGAIN', code: null, color: '#6b7280', discount: 0 },
];

const SEG = 360 / PRIZES.length;

export default function SpinWheel({ onWin }) {
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [spins, setSpins] = useState(0);
    const controls = useAnimation();
    const totalRotation = useRef(0);

    const spin = async () => {
        if (spinning || spins >= 2) return;

        setSpinning(true);
        setResult(null);

        const winIdx = Math.floor(Math.random() * PRIZES.length);
        const extraSpins = 5 + Math.random() * 3;
        const targetAngle = 360 * extraSpins + (360 - winIdx * SEG - SEG / 2);

        totalRotation.current += targetAngle;

        await controls.start({
            rotate: totalRotation.current,
            transition: { duration: 4, ease: [0.17, 0.67, 0.12, 1] },
        });

        setResult(PRIZES[winIdx]);
        setSpinning(false);
        setSpins(s => s + 1);

        if (PRIZES[winIdx].code) {
            onWin?.(PRIZES[winIdx]);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6">
            {/* Wheel Container */}
            <div className="relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[22px] border-l-transparent border-r-transparent border-b-foreground" />
                </div>

                <motion.div animate={controls} style={{ transformOrigin: '50% 50%' }}>
                    <svg width="240" height="240" viewBox="0 0 240 240">
                        {PRIZES.map((prize, i) => {
                            const angle = i * SEG;
                            const start = (angle - 90) * (Math.PI / 180);
                            const end = ((i + 1) * SEG - 90) * (Math.PI / 180);
                            const x1 = 120 + 95 * Math.cos(start);
                            const y1 = 120 + 95 * Math.sin(start);
                            const x2 = 120 + 95 * Math.cos(end);
                            const y2 = 120 + 95 * Math.sin(end);
                            const midAngle = (start + end) / 2;
                            const tx = 120 + 55 * Math.cos(midAngle);
                            const ty = 120 + 55 * Math.sin(midAngle);
                            const rot = angle + SEG / 2 - 90;

                            return (
                                <g key={i}>
                                    <path
                                        d={`M 120 120 L ${x1} ${y1} A 95 95 0 0 1 ${x2} ${y2} Z`}
                                        fill={prize.color}
                                        stroke="#fff"
                                        strokeWidth="3"
                                    />
                                    <text
                                        x={tx} y={ty}
                                        fill="white"
                                        fontSize="10"
                                        fontWeight="700"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        transform={`rotate(${rot}, ${tx}, ${ty})`}
                                    >
                                        {prize.label}
                                    </text>
                                </g>
                            );
                        })}
                        <circle cx="120" cy="120" r="22" fill="white" stroke="#e5e7eb" strokeWidth="6" />
                        <text x="120" y="120" textAnchor="middle" dominantBaseline="middle" fontSize="22">🎰</text>
                    </svg>
                </motion.div>
            </div>

            {result && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                    {result.code ? (
                        <div className="bg-green-50 dark:bg-green-900/30 border border-green-300 rounded-2xl p-5">
                            <p className="text-3xl font-bold text-green-600">🎉 {result.label}</p>
                            <p className="font-mono text-lg font-semibold mt-1">{result.code}</p>
                        </div>
                    ) : (
                        <p className="text-muted-foreground font-medium">Better luck next time!</p>
                    )}
                </motion.div>
            )}

            <Button onClick={spin} disabled={spinning || spins >= 2} className="rounded-2xl px-10 h-12 font-semibold text-base">
                {spinning ? '🎰 Spinning...' : spins >= 2 ? 'No spins left' : '🎰 Spin the Wheel'}
            </Button>
            {spins > 0 && spins < 2 && <p className="text-xs text-muted-foreground">1 spin left</p>}
        </div>
    );
}