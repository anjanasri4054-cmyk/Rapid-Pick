import React, { createContext, useContext, useEffect, useState } from 'react';
import { getItem, setItem, KEYS } from '@/lib/storage';

const ThemeContext = createContext();

// Color theme definitions
export const COLOR_THEMES = {
    orange: {
        id: 'orange',
        label: '🍊 Orange',
        desc: 'Warm, appetizing',
        primary: '24 90% 50%',
        accent: '16 80% 55%',
        background: '30 30% 97%',
        darkBackground: '20 15% 8%',
    },
    mint: {
        id: 'mint',
        label: '🌿 Mint Green',
        desc: 'Fresh, healthy',
        primary: '152 60% 40%',
        accent: '140 55% 45%',
        background: '140 20% 97%',
        darkBackground: '152 15% 8%',
    },
    purple: {
        id: 'purple',
        label: '💜 Purple',
        desc: 'Royal, premium',
        primary: '270 70% 55%',
        accent: '280 65% 60%',
        background: '270 20% 97%',
        darkBackground: '270 15% 8%',
    },
    blue: {
        id: 'blue',
        label: '💙 Ocean Blue',
        desc: 'Calm, trustworthy',
        primary: '210 80% 50%',
        accent: '200 75% 55%',
        background: '210 20% 97%',
        darkBackground: '210 15% 8%',
    },
    pink: {
        id: 'pink',
        label: '🌸 Pink',
        desc: 'Sweet, playful',
        primary: '340 75% 55%',
        accent: '320 70% 60%',
        background: '340 20% 97%',
        darkBackground: '340 15% 8%',
    },
    dark: {
        id: 'dark',
        label: '🖤 Dark Mode',
        desc: 'Modern, battery saving',
        primary: '24 90% 50%',
        accent: '16 80% 55%',
        background: '20 15% 8%',
        darkBackground: '20 15% 5%',
    },
};

function applyColorTheme(themeId, isDark) {
    const theme = COLOR_THEMES[themeId] || COLOR_THEMES.orange;
    const root = document.documentElement;

    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--ring', theme.primary);

    const forceDark = themeId === 'dark';
    if (forceDark || isDark) {
        root.classList.add('dark');
        root.style.setProperty('--background', theme.darkBackground);
    } else {
        root.classList.remove('dark');
        root.style.setProperty('--background', theme.background);
    }
}

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(() => getItem(KEYS.THEME) === 'dark');
    const [colorTheme, setColorThemeState] = useState(() => getItem(KEYS.COLOR_THEME) || 'orange');

    useEffect(() => {
        applyColorTheme(colorTheme, isDark);
    }, [isDark, colorTheme]);

    const toggleTheme = () => {
        setIsDark(p => {
            const next = !p;
            setItem(KEYS.THEME, next ? 'dark' : 'light');
            return next;
        });
    };

    const setColorTheme = (themeId) => {
        setColorThemeState(themeId);
        setItem(KEYS.COLOR_THEME, themeId);
        if (themeId === 'dark') {
            setIsDark(true);
            setItem(KEYS.THEME, 'dark');
        }
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme, colorTheme, setColorTheme, themes: COLOR_THEMES }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);