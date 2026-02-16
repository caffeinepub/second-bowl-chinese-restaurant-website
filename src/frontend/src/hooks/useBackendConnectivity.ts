import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useBackendConnectivity() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<string>({
    queryKey: ['backend-connectivity'],
    queryFn: async () => {
      if (!actor) throw new Error('Backend actor not initialized');
      return actor.connectivityCheck();
    },
    enabled: !!actor && !actorFetching,
    retry: 3,
    retryDelay: 1000,
    refetchInterval: 30000, // Check every 30 seconds
    staleTime: 20000,
  });

  return {
    isReachable: query.isSuccess,
    isUnreachable: query.isError,
    isChecking: query.isLoading || actorFetching,
    error: query.error,
  };
}
