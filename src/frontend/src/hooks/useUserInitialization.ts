import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from './useInternetIdentity';
import { useActor } from './useActor';

/**
 * Hook that automatically initializes authenticated users by ensuring
 * they are registered in the backend system and refreshing relevant queries.
 * This runs once after successful Internet Identity login.
 */
export function useUserInitialization() {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const hasInitialized = useRef(false);

  useEffect(() => {
    const initializeUser = async () => {
      // Only run once per session when both identity and actor are available
      if (!identity || !actor || hasInitialized.current) {
        return;
      }

      try {
        // Mark as initialized before making calls to prevent duplicate runs
        hasInitialized.current = true;

        // Trigger a backend call that will auto-register the user
        // The backend's ensureUserRegistered function will handle registration
        await actor.getCallerUserProfile();

        // Refresh all relevant queries after initialization
        await queryClient.invalidateQueries({ queryKey: ['profile'] });
        await queryClient.invalidateQueries({ queryKey: ['orders'] });
      } catch (error) {
        console.error('User initialization error:', error);
        // Reset flag on error so it can retry
        hasInitialized.current = false;
      }
    };

    initializeUser();
  }, [identity, actor, queryClient]);

  // Reset initialization flag when user logs out
  useEffect(() => {
    if (!identity) {
      hasInitialized.current = false;
    }
  }, [identity]);
}
