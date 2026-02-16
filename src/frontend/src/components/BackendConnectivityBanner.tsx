import { useBackendConnectivity } from '@/hooks/useBackendConnectivity';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

export function BackendConnectivityBanner() {
  const { isReachable, isUnreachable, isChecking } = useBackendConnectivity();

  // Don't show anything while checking initially
  if (isChecking && !isUnreachable) {
    return null;
  }

  // Show error banner when unreachable
  if (isUnreachable) {
    return (
      <div className="fixed top-16 left-0 right-0 z-40 px-4 py-2">
        <Alert variant="destructive" className="max-w-4xl mx-auto shadow-lg">
          <WifiOff className="h-4 w-4" />
          <AlertDescription className="font-medium">
            Unable to connect to the backend service. Please check your internet connection or try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Optionally show a subtle success indicator (can be removed if too intrusive)
  // For now, we'll not show anything when connected to keep it non-intrusive
  return null;
}
