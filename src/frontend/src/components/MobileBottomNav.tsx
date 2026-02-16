import { Home, MapPin, User, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/cart/useCart';
import { uiEvents } from '@/utils/uiEvents';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

export function MobileBottomNav() {
  const { itemCount } = useCart();
  const { identity } = useInternetIdentity();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProfileClick = () => {
    if (!identity) {
      uiEvents.emit('open-auth');
    } else {
      scrollToSection('#orders');
    }
  };

  const handleCartClick = () => {
    uiEvents.emit('open-cart');
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 md:hidden border-t-2 border-border"
      style={{
        zIndex: 40,
        backgroundImage: 'url(/assets/generated/ricebowl-bottom-nav-bg.dim_1200x200.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="mobile-nav-overlay">
        <div className="container flex items-center justify-around h-16 px-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-primary/20 hover:text-primary text-white"
            onClick={() => scrollToSection('#home')}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs font-semibold">Home</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-primary/20 hover:text-primary text-white"
            onClick={() => scrollToSection('#menu')}
          >
            <MapPin className="h-5 w-5" />
            <span className="text-xs font-semibold">Menu</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-primary/20 hover:text-primary text-white"
            onClick={handleProfileClick}
          >
            <User className="h-5 w-5" />
            <span className="text-xs font-semibold">Profile</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-primary/20 hover:text-primary text-white relative"
            onClick={handleCartClick}
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge
                  className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground border border-background"
                >
                  {itemCount}
                </Badge>
              )}
            </div>
            <span className="text-xs font-semibold">Cart</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
