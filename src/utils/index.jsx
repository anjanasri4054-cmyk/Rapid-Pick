// src/utils/index.js
export function createPageUrl(pageName) {
    if (!pageName) return '/';
    return '/' + pageName.toLowerCase().replace(/\s+/g, '-');
}

// Bonus reusable utilities (you can expand later)
export function formatPrice(price) {
    return `₹${parseFloat(price).toFixed(2)}`;
}

export function generateUniqueId() {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}