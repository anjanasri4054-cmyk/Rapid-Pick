import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, ClipboardList, ShoppingCart, LogOut, UtensilsCrossed, Trophy, Wallet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import ThemeToggle from '../../components/shared/ThemeToggle';
import ThemeSelector from '../../components/user/ThemeSelector';
import { motion } from 'framer-motion';

const navItems = [
    { path: '/user/dashboard', icon: Home, label: 'Home' },
    { path: '/user/menu', icon: Search, label: 'Menu' },
    { path: '/user/orders', icon: ClipboardList, label: 'Orders' },
    { path: '/user/cart', icon: ShoppingCart, label: 'Cart' },
    { path: '/user/rewards', icon: Trophy, label: 'Rewards' },
    { path: '/user/wallet', icon: Wallet, label: 'Wallet' },
];

export default function UserNav() {
    const { pathname } = useLocation();
    const { logout } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            {/* Desktop top nav */}
            <nav className="hidden md:flex items-center justify-between px-6 py-3 glass border-b sticky top-0 z-50">
                <Link to="/user/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <UtensilsCrossed className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-lg">Rapid Pick</span>
                </Link>

                <div className="flex items-center gap-1">
                    {navItems.map(({ path, icon: Icon, label }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${pathname === path ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                            {label === 'Cart' && totalItems > 0 && (
                                <span className="bg-accent text-accent-foreground text-xs px-1.5 py-0.5 rounded-full font-bold">{totalItems}</span>
                            )}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <ThemeSelector />
                    <ThemeToggle />
                    <Link to="/user/wallet" className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
                        <Wallet className="w-5 h-5" />
                    </Link>
                    <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            {/* Mobile bottom nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t px-2 py-1 safe-area-bottom">
                <div className="flex justify-around">
                    {navItems.slice(0, 5).map(({ path, icon: Icon, label }) => {
                        const isActive = pathname === path;
                        return (
                            <Link key={path} to={path} className="flex flex-col items-center py-2 px-3 relative">
                                <motion.div whileTap={{ scale: 0.9 }}>
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                                </motion.div>
                                <span className={`text-[10px] mt-0.5 ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>{label}</span>
                                {label === 'Cart' && totalItems > 0 && (
                                    <span className="absolute -top-0.5 right-1 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Mobile top bar */}
            <div className="md:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-50 glass border-b">
                <Link to="/user/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <UtensilsCrossed className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="font-bold">CanteenGo</span>
                </Link>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </>
    );
}