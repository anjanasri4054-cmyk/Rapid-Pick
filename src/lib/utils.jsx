// src/lib/utils.jsx
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and tailwind-merge
 * Useful for conditional and dynamic Tailwind classes
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Utility to detect if app is running inside an iframe
export const isIframe = window.self !== window.top;