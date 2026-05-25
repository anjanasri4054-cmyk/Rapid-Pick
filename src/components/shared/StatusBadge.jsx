import React from 'react';
import { Clock, ChefHat, CheckCircle, PackageCheck, XCircle } from 'lucide-react';

const statusConfig = {
    pending: {
        label: 'Pending',
        icon: Clock,
        className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    },
    preparing: {
        label: 'Preparing',
        icon: ChefHat,
        className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    },
    ready: {
        label: 'Ready for Pickup',
        icon: PackageCheck,
        className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    },
    completed: {
        label: 'Completed',
        icon: CheckCircle,
        className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
    },
    cancelled: {
        label: 'Cancelled',
        icon: XCircle,
        className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    }
};

export default function StatusBadge({ status = 'pending' }) {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
            <Icon size={14} />
            {config.label}
        </span>
    );
}
