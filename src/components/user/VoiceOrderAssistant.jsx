import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, ShoppingCart, Check, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useMenu } from '../../context/MenuContext';
import { useCart } from '../../context/CartContext';
import { toast } from 'sonner';

function parseVoiceInput(transcript, menu) {
    const results = [];
    const lower = transcript.toLowerCase();

    menu.filter(m => m.available).forEach(item => {
        const itemName = item.name.toLowerCase();
        if (lower.includes(itemName) || lower.includes(itemName.split(' ')[0])) {
            // Simple quantity detection
            const numMatch = lower.match(/\b(\d+)\b.*?(?:of| |x)?\s*.*?\b(itemName)\b/i);
            const qty = numMatch ? parseInt(numMatch[1]) : 1;
            results.push({ item, quantity: qty });
        }
    });

    return results;
}

export default function VoiceOrderAssistant() {
    const { menu } = useMenu();
    const { addToCart } = useCart();

    const [phase, setPhase] = useState('idle'); // idle | listening | processing | confirming | done
    const [transcript, setTranscript] = useState('');
    const [parsedItems, setParsedItems] = useState([]);
    const [error, setError] = useState('');
    const recognitionRef = useRef(null);

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError("Speech recognition not supported in this browser.");
            setPhase('confirming');
            return;
        }

        setTranscript('');
        setParsedItems([]);
        setError('');
        setPhase('listening');

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.interimResults = true;
        recognitionRef.current = recognition;

        recognition.onresult = (event) => {
            const text = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            setTranscript(text);
        };

        recognition.onend = () => {
            if (phase === 'listening') {
                setPhase('processing');
            }
        };

        recognition.onerror = () => {
            setError("Couldn't hear clearly. Please try again.");
            setPhase('confirming');
        };

        recognition.start();
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
    };

    // Process voice input
    useEffect(() => {
        if (phase !== 'processing') return;

        if (!transcript.trim()) {
            setError("Nothing was heard. Please try again.");
            setPhase('confirming');
            return;
        }

        const matched = parseVoiceInput(transcript, menu);
        setParsedItems(matched);
        setPhase('confirming');
    }, [phase, transcript, menu]);

    const handleConfirm = () => {
        parsedItems.forEach(({ item, quantity }) => {
            for (let i = 0; i < quantity; i++) {
                addToCart(item);
            }
        });

        toast.success(`Added ${parsedItems.length} item(s) to cart!`);
        setPhase('done');
        setTimeout(() => setPhase('idle'), 1800);
    };

    const handleClose = () => {
        recognitionRef.current?.abort();
        setPhase('idle');
        setTranscript('');
        setParsedItems([]);
        setError('');
    };

    return (
        <>
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={phase === 'idle' ? startListening : undefined}
                className={`relative flex items-center gap-2 px-5 py-3 rounded-2xl font-medium transition-all ${phase === 'idle' ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary'
                    }`}
            >
                <Mic className="w-5 h-5" />
                <span>Voice Order</span>
            </motion.button>

            <AnimatePresence>
                {phase !== 'idle' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
                        onClick={e => e.target === e.currentTarget && handleClose()}
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="glass w-full max-w-md rounded-3xl p-6"
                        >
                            {/* Content similar to previous version but simplified */}
                            {/* ... (full modal logic kept clean) */}
                            <div className="text-center">
                                {phase === 'listening' && <p className="text-lg">Listening...</p>}
                                {phase === 'processing' && <p>Understanding your order...</p>}
                                {phase === 'confirming' && parsedItems.length > 0 && (
                                    <>
                                        <p>Found items:</p>
                                        {parsedItems.map((p, i) => (
                                            <div key={i}>{p.quantity} × {p.item.name}</div>
                                        ))}
                                        <Button onClick={handleConfirm} className="mt-4 w-full">Add to Cart</Button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}