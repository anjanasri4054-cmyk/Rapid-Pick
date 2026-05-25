import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, BookOpen, Clock, BarChart3, LogOut, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../shared/ThemeToggle';

const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/orders', icon: ClipboardList, label: 'Orders' },
    { path: '/admin/menu', icon: BookOpen, label: 'Menu' },
    { path: '/admin/slots', icon: Clock, label: 'Slots' },
    { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
    { path: '/admin/controls', icon: Zap, label: 'Controls' },
];

export default function AdminNav() {
    const { pathname } = useLocation();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <aside className="w-[240px] min-h-screen bg-card border-r border-border fixed left-0 top-0 flex flex-col z-50">
                {/* Logo Header */}
                <div className="p-5 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                            <ShieldCheck size={18} className="text-primary-foreground" />
                        </div>
                        <div>
                            <div className="font-bold text-lg tracking-tight">Rapid Pick</div>
                            <div className="text-[10px] text-muted-foreground -mt-1">Admin Panel</div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 flex flex-col gap-1">
                    {navItems.map(({ path, icon: Icon, label }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${pathname === path
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Icon size={18} />
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-3 border-t border-border flex flex-col gap-2">
                    <ThemeToggle />
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>
            {/* Mobile top bar */}
            <div className="md:hidden sticky top-0 z-50 glass border-b">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4 text-accent-foreground" />
                        </div>
                        <span className="font-bold text-sm">Admin</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <button onClick={handleLogout} className="p-2 text-destructive">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                {/* Mobile tabs */}
                <div className="flex overflow-x-auto px-2 pb-2 gap-1 scrollbar-hide">
                    {navItems.map(({ path, icon: Icon, label }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${pathname === path ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                }`}
                        >
                            <Icon className="w-3 h-3" />
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}