import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, COLOR_THEMES } from '../../context/ThemeContext';
import { Check, Palette } from 'lucide-react';

export default function ThemeSelector() {
    const { colorTheme, setColorTheme } = useTheme();
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-2 px-3 py-2 glass rounded-xl text-sm font-medium hover:bg-muted/50 transition-colors"
            >
                <Palette className="w-4 h-4 text-primary" />
                <span>Theme</span>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        className="absolute right-0 top-11 z-50 glass rounded-2xl p-3 w-52 shadow-xl border"
                        style={{ transformOrigin: 'top right' }}
                    >
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Choose Theme</p>
                        <div className="space-y-1">
                            {Object.values(COLOR_THEMES).map(theme => (
                                <button
                                    key={theme.id}
                                    onClick={() => { setColorTheme(theme.id); setOpen(false); }}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${colorTheme === theme.id ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted text-foreground'
                                        }`}
                                >
                                    <div className="text-left">
                                        <p className="font-medium">{theme.label}</p>
                                        <p className="text-[10px] text-muted-foreground">{theme.desc}</p>
                                    </div>
                                    {colorTheme === theme.id && <Check className="w-4 h-4 text-primary shrink-0" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
        </div>
    );
}