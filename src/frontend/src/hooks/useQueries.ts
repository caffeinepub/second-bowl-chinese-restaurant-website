import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Order, OrderItem, Address, UserProfile, OrderStatus, UserRole } from '@/backend';

// Query keys
const orderKeys = {
  all: ['orders'] as const,
  list: () => [...orderKeys.all, 'list'] as const,
  detail: (id: bigint | null) => [...orderKeys.all, 'detail', id?.toString()] as const,
  admin: {
    all: () => [...orderKeys.all, 'admin'] as const,
    list: () => [...orderKeys.admin.all(), 'list'] as const,
    detail: (id: bigint | null) => [...orderKeys.admin.all(), 'detail', id?.toString()] as const,
  },
};

const profileKeys = {
  caller: ['profile', 'caller'] as const,
};

const adminKeys = {
  role: ['admin', 'role'] as const,
};

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const query = useQuery<UserProfile | null>({
    queryKey: profileKeys.caller,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  // Return custom state that properly reflects actor and auth dependency
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && isAuthenticated && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      if (!isAuthenticated) throw new Error('Authentication required');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.caller });
    },
  });
}

// List all orders for the current user
export function useListOrders() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<Order[]>({
    queryKey: orderKeys.list(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!isAuthenticated) throw new Error('Authentication required');
      return actor.listOrders();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });
}

// Get a specific order by ID
export function useGetOrder(orderId: bigint | null) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<Order | null>({
    queryKey: orderKeys.detail(orderId),
    queryFn: async () => {
      if (!actor || !orderId) return null;
      if (!isAuthenticated) throw new Error('Authentication required');
      return actor.getOrder(orderId);
    },
    enabled: !!actor && !isFetching && orderId !== null && isAuthenticated,
  });
}

// Create a new order
export function useCreateOrder() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  return useMutation({
    mutationFn: async ({
      items,
      billingAddress,
      shippingAddress,
    }: {
      items: OrderItem[];
      billingAddress: Address;
      shippingAddress: Address;
    }) => {
      if (!actor) throw new Error('Actor not available');
      if (!isAuthenticated) throw new Error('Authentication required');
      return actor.createOrder(items, billingAddress, shippingAddress);
    },
    onSuccess: () => {
      // Invalidate and refetch orders list after successful creation
      queryClient.invalidateQueries({ queryKey: orderKeys.list() });
    },
  });
}

// Cancel an order
export function useCancelOrder() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  return useMutation({
    mutationFn: async (orderId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      if (!isAuthenticated) throw new Error('Authentication required');
      return actor.cancelOrder(orderId);
    },
    onSuccess: (data) => {
      // Invalidate both list and the specific order detail
      queryClient.invalidateQueries({ queryKey: orderKeys.list() });
      if (data) {
        queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.id) });
      }
    },
  });
}

// ADMIN QUERIES

// Get caller's role
export function useGetCallerRole() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<UserRole>({
    queryKey: adminKeys.role,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerRole();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

// Get all orders (admin only)
export function useGetAllOrders() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const { data: role } = useGetCallerRole();
  const isAuthenticated = !!identity;
  const isAdmin = role === 'admin';

  return useQuery<Order[]>({
    queryKey: orderKeys.admin.list(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching && isAuthenticated && isAdmin,
    retry: 1,
  });
}

// Get order by ID (admin only, no ownership check)
export function useGetOrderById(orderId: bigint | null) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const { data: role } = useGetCallerRole();
  const isAuthenticated = !!identity;
  const isAdmin = role === 'admin';

  return useQuery<Order | null>({
    queryKey: orderKeys.admin.detail(orderId),
    queryFn: async () => {
      if (!actor || !orderId) return null;
      return actor.getOrderById(orderId);
    },
    enabled: !!actor && !isFetching && orderId !== null && isAuthenticated && isAdmin,
  });
}

// Update order status (admin only)
export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: bigint; status: OrderStatus }) => {
      if (!actor) throw new Error('Actor not available');
      if (!isAuthenticated) throw new Error('Authentication required');
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: (data) => {
      // Invalidate admin orders list and specific order detail
      queryClient.invalidateQueries({ queryKey: orderKeys.admin.list() });
      if (data) {
        queryClient.invalidateQueries({ queryKey: orderKeys.admin.detail(data.id) });
      }
    },
  });
}
