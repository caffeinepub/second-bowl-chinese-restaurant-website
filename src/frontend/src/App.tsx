import { useState, useEffect } from 'react';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { HeroSection } from './sections/HeroSection';
import { MenuSection } from './sections/MenuSection';
import { AboutSection } from './sections/AboutSection';
import { ContactSection } from './sections/ContactSection';
import { MyOrdersSection } from './sections/MyOrdersSection';
import { AdminOrdersSection } from './sections/AdminOrdersSection';
import { CartProvider } from './cart/CartContext';
import { ProfileSetup } from './components/ProfileSetup';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AuthSheet } from './components/AuthSheet';
import { BackendConnectivityBanner } from './components/BackendConnectivityBanner';
import { Toaster } from '@/components/ui/sonner';
import { uiEvents } from '@/utils/uiEvents';
import { useUserInitialization } from '@/hooks/useUserInitialization';

function App() {
  const [authSheetOpen, setAuthSheetOpen] = useState(false);

  // Initialize authenticated users automatically
  useUserInitialization();

  useEffect(() => {
    const handleOpenAuth = () => setAuthSheetOpen(true);
    uiEvents.on('open-auth', handleOpenAuth);
    return () => uiEvents.off('open-auth', handleOpenAuth);
  }, []);

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <BackendConnectivityBanner />
        <main className="flex-1 pb-mobile-nav">
          <HeroSection />
          <MenuSection />
          <AboutSection />
          <ContactSection />
          <MyOrdersSection />
          <AdminOrdersSection />
        </main>
        <SiteFooter />
        <MobileBottomNav />
        <ProfileSetup />
        <AuthSheet open={authSheetOpen} onOpenChange={setAuthSheetOpen} />
        <Toaster />
      </div>
    </CartProvider>
  );
}

export default App;
