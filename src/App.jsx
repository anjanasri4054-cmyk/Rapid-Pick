// src/App.jsx
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { queryClientInstance } from '@/lib/query-client'
import { AuthProvider as Authentication } from './lib/AuthContext';
// Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MenuProvider } from './context/MenuContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { initializeData } from './lib/storage';


// Pages
import Landing from './pages/Landing';
import PageNotFound from './lib/PageNotFound';

// User Pages
import UserLogin from './pages/user/UserLogin';
import UserDashboard from './pages/user/UserDashboard';
import UserMenu from './pages/user/UserMenu';
import UserCart from './pages/user/UserCart';
import UserCheckout from './pages/user/UserCheckout';
import UserOrders from './pages/user/UserOrders';
import UserOrderTracking from './pages/user/UserOrderTracking';
import UserRewards from './pages/user/UserRewards';
import UserWallet from './pages/user/UserWallet';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenu from './pages/admin/AdminMenu';
import AdminOrders from './pages/admin/AdminOrders';
import AdminControls from './pages/admin/AdminControls';
import AdminSlots from './pages/admin/AdminSlots';
import AdminReports from '@/pages/admin/AdminReports';
// Kitchen Pages
import KitchenLogin from './pages/kitchen/KitchenLogin';
import KitchenDashboard from './pages/kitchen/KitchenDashboard';

// Token Display
import TokenDisplay from './pages/admin/TokenDisplay';
const queryClient = new QueryClient();
initializeData()

export default function App() {
  return (
    <Authentication>
      <ThemeProvider>
        <AuthProvider>
          <MenuProvider>
            <CartProvider>
              <OrderProvider>
                <QueryClientProvider client={queryClientInstance}>
                  <Router>
                    <Routes>
                      <Route path="/" element={<Landing />} />

                      {/* User routes */}
                      <Route path="/user/login" element={<UserLogin />} />
                      <Route path="/user/dashboard" element={<UserDashboard />} />
                      <Route path="/user/menu" element={<UserMenu />} />
                      <Route path="/user/cart" element={<UserCart />} />
                      <Route path="/user/orders" element={<UserOrders />} />
                      <Route path="/user/wallet" element={<UserWallet />} />
                      <Route path="/user/rewards" element={<UserRewards />} />
                      <Route path="/user/checkout" element={<UserCheckout />} />
                      <Route path="/user/track/:orderId" element={<UserOrderTracking />} />

                      {/* Admin routes */}
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />
                      <Route path="/admin/orders" element={<AdminOrders />} />
                      <Route path="/admin/menu" element={<AdminMenu />} />
                      <Route path="/admin/slots" element={<AdminSlots />} />
                      <Route path="/admin/reports" element={<AdminReports />} />
                      <Route path="/admin/controls" element={<AdminControls />} />
                      <Route path="/token-display" element={<TokenDisplay />} />

                      {/* Kitchen routes */}
                      <Route path="/kitchen/login" element={<KitchenLogin />} />
                      <Route path="/kitchen/dashboard" element={<KitchenDashboard />} />

                      <Route path="*" element={<PageNotFound />} />
                    </Routes>
                  </Router>
                  <Toaster />
                  <SonnerToaster position="top-center" richColors />
                </QueryClientProvider>
              </OrderProvider>
            </CartProvider>
          </MenuProvider>
        </AuthProvider>
      </ThemeProvider>
    </Authentication>
  );
}