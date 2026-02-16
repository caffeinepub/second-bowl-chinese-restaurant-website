import { Heart } from 'lucide-react';
import { siteContent } from '@/content/siteContent';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'second-bowl'
  );

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const hasWhatsApp = siteContent.contact.whatsappLink && siteContent.contact.whatsappLink.trim() !== '';

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/assets/generated/second-bowl-logo-from-menu.dim_512x512.png"
                alt="Second Bowl"
                className="h-12 w-12 object-contain"
              />
              <div>
                <h3 className="font-bold text-lg">Second Bowl</h3>
                <p className="text-sm text-muted-foreground">Chinese Cuisine</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Authentic Chinese cuisine crafted with passion and tradition.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => scrollToSection('#home')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('#menu')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('#about')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('#contact')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Visit Us */}
          <div className="space-y-4">
            <h4 className="font-semibold">Visit Us</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{siteContent.contact.address}</p>
              <div className="space-y-1">
                {siteContent.contact.phones.map((phone, index) => (
                  <p key={index}>
                    <a href={`tel:${phone}`} className="hover:text-primary transition-colors">
                      {phone}
                    </a>
                  </p>
                ))}
              </div>
              <p>{siteContent.contact.email}</p>
              {hasWhatsApp && (
                <div className="flex items-center space-x-2 pt-2">
                  <a
                    href={siteContent.contact.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 hover:opacity-80 transition-opacity"
                    aria-label="Contact us on WhatsApp"
                  >
                    <img
                      src="/assets/generated/whatsapp-logo.dim_128x128.png"
                      alt="WhatsApp"
                      className="h-6 w-6"
                    />
                    <span className="text-primary hover:underline">Chat with us</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} Second Bowl. All rights reserved.
          </p>
          <p className="mt-2 flex items-center justify-center gap-1">
            Built with <Heart className="h-4 w-4 text-primary fill-primary" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
