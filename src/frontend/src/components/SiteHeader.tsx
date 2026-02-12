import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Menu', href: '#menu' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <button
          onClick={() => scrollToSection('#home')}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <img
            src="/assets/generated/second-bowl-logo.dim_512x512.png"
            alt="Second Bowl Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-xl font-bold tracking-tight">Second Bowl</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-6 mt-8">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="/assets/generated/second-bowl-logo.dim_512x512.png"
                  alt="Second Bowl Logo"
                  className="h-12 w-12 object-contain"
                />
                <span className="text-2xl font-bold">Second Bowl</span>
              </div>
              {navLinks.map((link) => (
                <SheetClose asChild key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-left text-lg font-medium transition-colors hover:text-primary py-2"
                  >
                    {link.label}
                  </button>
                </SheetClose>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
