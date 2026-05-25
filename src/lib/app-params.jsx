// src/lib/app-params.js
export const appConfig = {
    appName: "CanteenGo",
    version: "1.0.0",
    defaultCurrency: "₹",
    appBaseUrl: import.meta.env.VITE_APP_BASE_URL || window.location.origin,
};