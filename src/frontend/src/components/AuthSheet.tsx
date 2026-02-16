import { useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Mail, Lock, ExternalLink, AlertCircle } from 'lucide-react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { siteContent } from '@/content/siteContent';

interface AuthSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthSheet({ open, onOpenChange }: AuthSheetProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  const isLoginError = loginStatus === 'loginError';

  // Close sheet automatically after successful login
  useEffect(() => {
    if (isAuthenticated && open) {
      onOpenChange(false);
    }
  }, [isAuthenticated, open, onOpenChange]);

  const handleLogin = () => {
    // login() returns void, so we just call it
    // The sheet will stay open until identity is available
    login();
  };

  const handleLogout = () => {
    // clear() returns void
    clear();
    queryClient.clear();
    onOpenChange(false);
  };

  const websiteUrl = siteContent.contact.website;
  const privacyUrl = websiteUrl ? `${websiteUrl}/privacy` : undefined;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[95vh] rounded-t-3xl p-0 overflow-y-auto">
        {/* Hero Image with Curved Bottom */}
        <div className="relative h-48 overflow-hidden">
          <div className="auth-hero-curve">
            <img
              src="/assets/generated/login-hero-food.dim_1200x600.png"
              alt="Delicious food"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-8 space-y-6">
          <SheetHeader className="text-center space-y-2">
            <SheetTitle className="text-4xl font-bold tracking-tight">
              {isAuthenticated ? 'ACCOUNT' : 'LOGIN'}
            </SheetTitle>
            <SheetDescription className="text-base">
              {isAuthenticated
                ? 'Manage your account settings'
                : 'Sign in with Internet Identity to place orders'}
            </SheetDescription>
          </SheetHeader>

          {!isAuthenticated ? (
            <>
              {/* Decorative Input Fields */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-muted/30 rounded-2xl px-4 py-4 border border-border/50">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Email</span>
                </div>

                <div className="flex items-center gap-3 bg-muted/30 rounded-2xl px-4 py-4 border border-border/50">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Password</span>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button className="text-sm text-muted-foreground hover:text-foreground underline transition-colors">
                  Forgot Password ?
                </button>
              </div>

              {/* Login Error Alert */}
              {isLoginError && (
                <Alert variant="destructive" className="rounded-2xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Login failed. Please try again or check your Internet Identity settings.
                  </AlertDescription>
                </Alert>
              )}

              {/* Login Button */}
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full h-14 rounded-2xl text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoggingIn ? (
                  'Logging in...'
                ) : (
                  <>
                    LOGIN <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              <Separator className="my-6" />

              {/* Authentication Required Notice */}
              <div className="bg-muted/20 rounded-2xl p-6 text-center space-y-3">
                <h3 className="text-xl font-bold">Authentication Required</h3>
                <p className="text-sm text-muted-foreground">
                  Sign in with Internet Identity to place orders and track your order history
                </p>
              </div>

              {/* Optional Website Link */}
              {websiteUrl && (
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl h-12"
                    onClick={() => window.open(websiteUrl, '_blank', 'noopener,noreferrer')}
                  >
                    Visit Our Website
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>

                  {privacyUrl && (
                    <button
                      onClick={() => window.open(privacyUrl, '_blank', 'noopener,noreferrer')}
                      className="w-full text-sm text-muted-foreground hover:text-foreground underline transition-colors"
                    >
                      Privacy Policy
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Authenticated State */}
              <div className="space-y-4">
                <div className="bg-muted/20 rounded-2xl p-6 text-center space-y-3">
                  <p className="text-lg">You are currently logged in</p>
                  <p className="text-sm text-muted-foreground">
                    Access your orders and profile from the menu
                  </p>
                </div>

                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full h-14 rounded-2xl text-lg font-semibold"
                >
                  Logout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
