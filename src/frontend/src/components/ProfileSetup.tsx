import { useState } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '@/hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MapPin, AlertCircle, RefreshCw } from 'lucide-react';

export function ProfileSetup() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched, isError, refetch } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [isCapturingLocation, setIsCapturingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null && !isError;
  const showInitializationError = isAuthenticated && !profileLoading && isError;

  const captureLocation = async () => {
    setIsCapturingLocation(true);
    setLocationError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;
      setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
    } catch (error: any) {
      console.error('Geolocation error:', error);
      let errorMessage = 'Unable to capture location. ';
      
      if (error.code === 1) {
        errorMessage += 'Location permission denied. Please enable location access in your browser settings.';
      } else if (error.code === 2) {
        errorMessage += 'Location unavailable. Please check your device settings.';
      } else if (error.code === 3) {
        errorMessage += 'Location request timed out. Please try again.';
      } else {
        errorMessage += 'Please enter your location manually or try again.';
      }
      
      setLocationError(errorMessage);
    } finally {
      setIsCapturingLocation(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!location.trim()) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        phone: phone.trim(),
        location: location.trim(),
      });
    } catch (error) {
      console.error('Profile save error:', error);
    }
  };

  const handleRetry = () => {
    refetch();
  };

  // Show initialization error dialog
  if (showInitializationError) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Initializing Your Account</DialogTitle>
            <DialogDescription>
              Please wait while we set up your account
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <Alert variant="destructive" className="rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your session is being initialized. This may take a moment.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleRetry}
              variant="outline"
              className="w-full rounded-full"
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={showProfileSetup} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Welcome to Second Bowl!</DialogTitle>
          <DialogDescription>
            Please complete your profile to continue ordering
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="rounded-xl"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03XX-XXXXXXX"
              className="rounded-xl"
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Current Location *</Label>
            <div className="flex gap-2">
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Latitude, Longitude or Address"
                className="flex-1 rounded-xl"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={captureLocation}
                disabled={isCapturingLocation}
                className="shrink-0 rounded-xl"
              >
                {isCapturingLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
            {locationError && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{locationError}</AlertDescription>
              </Alert>
            )}
            <p className="text-xs text-muted-foreground">
              Click the location icon to auto-capture or enter manually
            </p>
          </div>

          {saveProfile.isError && (
            <Alert variant="destructive" className="rounded-xl">
              <AlertDescription>
                Failed to save profile. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full rounded-full"
            size="lg"
            disabled={saveProfile.isPending}
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Complete Profile'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
