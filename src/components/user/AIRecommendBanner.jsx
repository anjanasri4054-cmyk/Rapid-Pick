import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CloudRain, Sun, Coffee, Utensils } from 'lucide-react';

function getWeatherSuggestion() {
    const h = new Date().getHours();
    const month = new Date().getMonth();

    if (month >= 6 && month <= 8) {
        return { icon: CloudRain, label: 'Rainy Day?', suggestion: 'Warm soup & hot chai recommended ☕', filter: 'lunch' };
    }
    if (month >= 3 && month <= 5) {
        return { icon: Sun, label: 'Summer Vibes', suggestion: 'Stay cool with light meals & cold drinks 🥤', filter: 'snacks' };
    }
    if (h < 11) {
        return { icon: Coffee, label: 'Morning Energy', suggestion: 'Start your day with a power breakfast ☀️', filter: 'breakfast' };
    }
    if (h < 15) {
        return { icon: Utensils, label: 'Lunch Time!', suggestion: 'Your lunch combos are ready 🍛', filter: 'lunch' };
    }
    return { icon: Sparkles, label: 'Evening Cravings', suggestion: 'Treat yourself to evening snacks 🔥', filter: 'snacks' };
}

export default function AIRecommendBanner({ lastOrder, onFilterClick }) {
    const weather = getWeatherSuggestion();
    const WeatherIcon = weather.icon;

    return (
        <div className="space-y-2 mb-4">
            <motion.button
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => onFilterClick?.(weather.filter)}
                className="w-full flex items-center gap-3 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-3 text-left hover:border-primary/40 transition-all"
            >
                <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                    <WeatherIcon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-primary">{weather.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{weather.suggestion}</p>
                </div>
                <span className="text-xs text-primary font-medium shrink-0">Show →</span>
            </motion.button>

            {lastOrder && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-3 bg-muted/60 rounded-2xl p-3"
                >
                    <Sparkles className="w-4 h-4 text-accent shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">Because you ordered {lastOrder}</span> — you might love today's specials too!
                    </p>
                </motion.div>
            )}
        </div>
    );
} 