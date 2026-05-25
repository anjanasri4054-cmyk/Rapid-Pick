import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useLocalAuth } from '../context/AuthContext';

const DefaultFallback = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
    </div>
);

export default function ProtectedRoute({
    fallback = <DefaultFallback />,
    unauthenticatedElement = <Navigate to="/user/login" replace />,
    allowedRoles = ['user', 'admin', 'kitchen']
}) {
    const { user, isAdmin, isKitchen, loading } = useLocalAuth();

    // Show loading while checking auth
    if (loading) {
        return fallback;
    }

    // Not logged in
    if (!user) {
        return unauthenticatedElement;
    }

    // Role check (if restricted)
    const userRole = user.role || 'user';
    const hasPermission = allowedRoles.includes(userRole);

    if (!hasPermission) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}