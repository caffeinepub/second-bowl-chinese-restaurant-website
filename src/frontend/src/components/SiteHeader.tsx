import { useState } from 'react';
import { Menu, ShoppingBag, User, Phone, MapPin, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { CartSheet } from './CartSheet';
import { CheckoutSheet } from './CheckoutSheet';
import { OpeningHoursBadge } from './OpeningHoursBadge';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetCallerRole } from '@/hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { uiEvents } from '@/utils/uiEvents';
import { siteContent } from '@/content/siteContent';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Menu', href: '#menu' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
  { label: 'My Orders', href: '#orders' },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { clear, identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: role } = useGetCallerRole();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isAdmin = role === 'admin';

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleLoginClick = () => {
    uiEvents.emit('open-auth');
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/98 backdrop-blur-md supports-[backdrop-filter]:bg-background/95 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('#home')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <img
              src="/assets/generated/second-bowl-logo-from-menu.dim_512x512.png"
              alt="Second Bowl"
              className="h-10 w-10 object-contain"
            />
            <span className="font-bold text-xl hidden sm:inline text-foreground">Second Bowl</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                onClick={() => scrollToSection(link.href)}
                className="rounded-full font-semibold hover:bg-primary/10 hover:text-primary"
              >
                {link.label}
              </Button>
            ))}
            {isAdmin && (
              <Button
                variant="ghost"
                onClick={() => scrollToSection('#admin')}
                className="rounded-full font-semibold hover:bg-primary/10 hover:text-primary text-primary"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Button>
            )}
          </nav>

          {/* Opening Hours Badge - Desktop/Tablet */}
          <div className="hidden md:flex">
            <OpeningHoursBadge />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <CartSheet onCheckout={() => setCheckoutOpen(true)} />

            {/* User Profile / Login */}
            {isAuthenticated && userProfile ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full border-2 hidden md:flex">
                    <User className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 border-2" align="end">
                  <div className="space-y-3">
                    <div>
                      <p className="font-bold text-lg text-foreground">{userProfile.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Phone className="h-3 w-3" />
                        {userProfile.phone}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {userProfile.location}
                      </p>
                      {isAdmin && (
                        <p className="text-xs text-primary flex items-center gap-1 mt-2 font-semibold">
                          <Shield className="h-3 w-3" />
                          Administrator
                        </p>
                      )}
                    </div>
                    <Separator />
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full rounded-full border-2"
                    >
                      Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Button
                onClick={handleLoginClick}
                className="rounded-full hidden md:flex shadow-sm hover:shadow-md transition-shadow"
              >
                Login
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden rounded-full border-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] rounded-l-3xl bg-background border-l-2">
                <nav className="flex flex-col space-y-4 mt-8">
                  {/* Opening Hours - Mobile */}
                  <div className="bg-card border border-border p-4 rounded-2xl space-y-2 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>Opening Hours</span>
                    </div>
                    {siteContent.contact.hours.map((hour, index) => (
                      <p key={index} className="text-sm text-muted-foreground pl-6 font-medium">
                        {hour}
                      </p>
                    ))}
                  </div>

                  <Separator />

                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Button
                        variant="ghost"
                        onClick={() => scrollToSection(link.href)}
                        className="justify-start text-lg rounded-full font-semibold hover:bg-primary/10 hover:text-primary"
                      >
                        {link.label}
                      </Button>
                    </SheetClose>
                  ))}

                  {/* Admin Link - Mobile */}
                  {isAdmin && (
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        onClick={() => scrollToSection('#admin')}
                        className="justify-start text-lg rounded-full font-semibold hover:bg-primary/10 hover:text-primary text-primary"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Button>
                    </SheetClose>
                  )}

                  <Separator className="my-4" />
                  
                  {/* Login/Sign Up Item */}
                  {!isAuthenticated && (
                    <Button
                      onClick={() => {
                        setIsOpen(false);
                        handleLoginClick();
                      }}
                      className="w-full rounded-full justify-start text-lg shadow-sm"
                      variant="default"
                    >
                      Login / Sign Up
                    </Button>
                  )}

                  {isAuthenticated && userProfile ? (
                    <div className="space-y-4">
                      <div className="bg-card border border-border p-4 rounded-2xl space-y-2 shadow-sm">
                        <p className="font-bold text-lg text-foreground">{userProfile.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {userProfile.phone}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {userProfile.location}
                        </p>
                        {isAdmin && (
                          <p className="text-xs text-primary flex items-center gap-1 mt-2 font-semibold">
                            <Shield className="h-3 w-3" />
                            Administrator
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsOpen(false);
                          handleLogout();
                        }}
                        className="w-full rounded-full border-2"
                      >
                        Logout
                      </Button>
                    </div>
                  ) : null}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <CheckoutSheet open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </>
  );
}
