import { useState, useMemo } from 'react';
import { Section } from '@/components/Section';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerRole, useGetAllOrders, useUpdateOrderStatus, useGetCallerUserProfile } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Search, Package, AlertCircle, Loader2, RefreshCw, ShieldAlert, LogIn } from 'lucide-react';
import { formatRupees } from '@/lib/currency';
import { toast } from 'sonner';
import { uiEvents } from '@/utils/uiEvents';
import { AdminOrderCard } from './admin/AdminOrderCard';
import { AdminOrderItemsList } from './admin/AdminOrderItemsList';
import type { Order, OrderStatus } from '@/backend';

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export function AdminOrdersSection() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: role, isLoading: roleLoading } = useGetCallerRole();
  const { data: orders, isLoading: ordersLoading, error: ordersError, refetch } = useGetAllOrders();
  const updateStatusMutation = useUpdateOrderStatus();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isAdmin = role === 'admin';

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    
    let filtered = orders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Search by order ID
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toString().includes(query) ||
        order.customer.toString().toLowerCase().includes(query) ||
        order.shippingAddress.name.toLowerCase().includes(query)
      );
    }

    // Sort by creation date (newest first)
    return filtered.sort((a, b) => Number(b.createdAt - a.createdAt));
  }, [orders, statusFilter, searchQuery]);

  const handleStatusUpdate = async (orderId: bigint, newStatus: OrderStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ orderId, status: newStatus });
      toast.success('Order status updated successfully');
      
      // Update selected order if it's the one being updated
      if (selectedOrder && selectedOrder.id === orderId) {
        const updatedOrder = orders?.find(o => o.id === orderId);
        if (updatedOrder) {
          setSelectedOrder(updatedOrder);
        }
      }
    } catch (error: any) {
      console.error('Failed to update order status:', error);
      toast.error(error.message || 'Failed to update order status');
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Anonymous user - show sign in required
  if (!isAuthenticated) {
    return (
      <Section id="admin" className="bg-muted/30">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 shadow-soft-lg">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-primary/10 p-6">
                  <LogIn className="h-12 w-12 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Sign In Required</h2>
                <p className="text-muted-foreground">
                  You must be signed in to access the Admin Panel.
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => uiEvents.emit('open-auth')}
                className="rounded-full shadow-sm hover:shadow-md transition-shadow"
              >
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </Section>
    );
  }

  // Loading role check
  if (roleLoading) {
    return (
      <Section id="admin" className="bg-muted/30">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 shadow-soft-lg">
            <CardContent className="pt-12 pb-12 text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Checking permissions...</p>
            </CardContent>
          </Card>
        </div>
      </Section>
    );
  }

  // Non-admin user - show access denied
  if (!isAdmin) {
    return (
      <Section id="admin" className="bg-muted/30">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 shadow-soft-lg border-destructive/20">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-destructive/10 p-6">
                  <ShieldAlert className="h-12 w-12 text-destructive" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
                <p className="text-muted-foreground">
                  You do not have permission to access the Admin Panel.
                </p>
                {userProfile && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Signed in as: <span className="font-semibold">{userProfile.name}</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    );
  }

  // Admin user - show admin panel
  return (
    <Section id="admin" className="admin-section">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-lg text-muted-foreground">Manage all customer orders</p>
        </div>

        {/* Filters and Search */}
        <Card className="border-2 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Orders Management
            </CardTitle>
            <CardDescription>
              Search, filter, and update order statuses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Order ID, Customer, or Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-full border-2"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}>
                <SelectTrigger className="w-full sm:w-[200px] rounded-full border-2">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredOrders.length}</span> of{' '}
                <span className="font-semibold text-foreground">{orders?.length || 0}</span> orders
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refetch()}
                disabled={ordersLoading}
                className="rounded-full"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${ordersLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {ordersError && (
          <Alert variant="destructive" className="border-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Failed to load orders. Please try again.</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="ml-4 rounded-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {ordersLoading && (
          <Card className="border-2">
            <CardContent className="pt-12 pb-12 text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Loading orders...</p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!ordersLoading && !ordersError && filteredOrders.length === 0 && (
          <Card className="border-2">
            <CardContent className="pt-12 pb-12 text-center space-y-4">
              <Package className="h-12 w-12 text-muted-foreground mx-auto" />
              <div className="space-y-2">
                <p className="text-lg font-semibold text-foreground">No orders found</p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Orders will appear here once customers place them'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Orders Card List */}
        {!ordersLoading && !ordersError && filteredOrders.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => (
              <AdminOrderCard
                key={order.id.toString()}
                order={order}
                onViewDetails={handleViewOrder}
              />
            ))}
          </div>
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Order Details</DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?.id.toString()} • {selectedOrder && formatDate(selectedOrder.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6">
                {/* Status Update */}
                <Card className="border-2 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Update Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">Current Status:</span>
                      <Badge className={`${statusColors[selectedOrder.status]} border-0 font-semibold`}>
                        {statusLabels[selectedOrder.status]}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((status) => (
                        <Button
                          key={status}
                          variant={selectedOrder.status === status ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                          disabled={updateStatusMutation.isPending || selectedOrder.status === status}
                          className="rounded-full"
                        >
                          {updateStatusMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : null}
                          {statusLabels[status]}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Information */}
                <Card className="border-2 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedOrder.shippingAddress.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedOrder.shippingAddress.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Principal ID</p>
                      <p className="font-mono text-xs break-all">{selectedOrder.customer.toString()}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card className="border-2 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <p className="font-medium">{selectedOrder.shippingAddress.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress.street}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}
                    </p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress.country}</p>
                    <p className="text-sm text-muted-foreground mt-2">Phone: {selectedOrder.shippingAddress.phone}</p>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card className="border-2 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AdminOrderItemsList items={selectedOrder.items} />
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card className="admin-order-summary border-2 rounded-2xl bg-primary/5">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Items ({selectedOrder.items.length})</span>
                      <span className="font-medium text-foreground">
                        {formatRupees(Number(selectedOrder.totalAmount))}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span className="text-foreground">Total Amount</span>
                      <span className="text-primary">{formatRupees(Number(selectedOrder.totalAmount))}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </Section>
  );
}
