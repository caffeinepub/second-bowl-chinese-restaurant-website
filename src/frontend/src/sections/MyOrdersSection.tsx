import { useState } from 'react';
import { Section } from '@/components/Section';
import { useListOrders, useGetOrder } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Loader2, Package, Clock, CheckCircle2, XCircle, Truck, LogIn, AlertCircle, RefreshCw } from 'lucide-react';
import { formatRupees } from '@/lib/currency';
import { uiEvents } from '@/utils/uiEvents';
import type { Order, OrderStatus } from '@/backend';

function getStatusIcon(status: OrderStatus) {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'processing':
      return <Package className="h-4 w-4" />;
    case 'shipped':
      return <Truck className="h-4 w-4" />;
    case 'delivered':
      return <CheckCircle2 className="h-4 w-4" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
}

function getStatusVariant(status: OrderStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'pending':
      return 'secondary';
    case 'processing':
      return 'default';
    case 'shipped':
      return 'default';
    case 'delivered':
      return 'outline';
    case 'cancelled':
      return 'destructive';
    default:
      return 'default';
  }
}

function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function MyOrdersSection() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: orders, isLoading, isError, error, refetch } = useListOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<bigint | null>(null);
  const { data: selectedOrder } = useGetOrder(selectedOrderId);

  const handleSignIn = () => {
    uiEvents.emit('open-auth');
  };

  const handleRetry = () => {
    refetch();
  };

  // Sort orders by createdAt descending (most recent first)
  const sortedOrders = orders
    ? [...orders].sort((a, b) => Number(b.createdAt - a.createdAt))
    : [];

  // Check if error is authorization-related
  const isAuthError = error?.message?.includes('Unauthorized') || error?.message?.includes('Authentication required');

  return (
    <Section id="orders" className="bg-background">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">My Orders</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            View your order history and track your current orders
          </p>
        </div>

        {/* Show sign-in required message for anonymous users */}
        {!isAuthenticated && (
          <Card className="border-2">
            <CardContent className="py-12 text-center space-y-4">
              <LogIn className="h-16 w-16 mx-auto opacity-20" />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Sign in required</h3>
                <p className="text-muted-foreground">
                  Please sign in to view your order history
                </p>
              </div>
              <Button onClick={handleSignIn} size="lg" className="rounded-full">
                Sign In
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Show loading/error/orders only for authenticated users */}
        {isAuthenticated && (
          <>
            {isLoading && (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}

            {isError && (
              <Card>
                <CardContent className="py-12 text-center space-y-4">
                  <Alert variant="destructive" className="max-w-md mx-auto">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {isAuthError
                        ? 'Your session is being initialized. Please wait a moment and try again.'
                        : 'Failed to load orders. Please try again.'}
                    </AlertDescription>
                  </Alert>
                  <Button onClick={handleRetry} variant="outline" size="lg" className="rounded-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry
                  </Button>
                </CardContent>
              </Card>
            )}

            {!isLoading && !isError && sortedOrders.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center space-y-4">
                  <Package className="h-16 w-16 mx-auto opacity-20" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">No orders yet</h3>
                    <p className="text-muted-foreground">
                      Start by adding items to your cart from our menu
                    </p>
                  </div>
                  <Button onClick={() => document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' })}>
                    Browse Menu
                  </Button>
                </CardContent>
              </Card>
            )}

            {!isLoading && !isError && sortedOrders.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {sortedOrders.map((order) => (
                  <Card key={order.id.toString()} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">Order #{order.id.toString()}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <Badge variant={getStatusVariant(order.status)} className="capitalize">
                          <span className="mr-1">{getStatusIcon(order.status)}</span>
                          {order.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total</span>
                          <span className="text-lg font-bold text-primary">
                            {formatRupees(Number(order.totalAmount))}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setSelectedOrderId(order.id)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrderId} onOpenChange={(open) => !open && setSelectedOrderId(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                Order #{selectedOrderId?.toString()} • {selectedOrder && formatDate(selectedOrder.createdAt)}
              </DialogDescription>
            </DialogHeader>

            {selectedOrder && (
              <ScrollArea className="max-h-[70vh] pr-4">
                <div className="space-y-6">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant={getStatusVariant(selectedOrder.status)} className="capitalize">
                      <span className="mr-1">{getStatusIcon(selectedOrder.status)}</span>
                      {selectedOrder.status}
                    </Badge>
                  </div>

                  <Separator />

                  {/* Items */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Order Items</h3>
                    {selectedOrder.items.map((orderItem, idx) => (
                      <div key={idx} className="flex justify-between items-start py-2">
                        <div className="flex-1">
                          <p className="font-medium">{orderItem.item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {orderItem.quantity.toString()}
                          </p>
                        </div>
                        <p className="font-semibold">{formatRupees(Number(orderItem.total))}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary">{formatRupees(Number(selectedOrder.totalAmount))}</span>
                  </div>

                  <Separator />

                  {/* Addresses */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Billing Address</h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{selectedOrder.billingAddress.name}</p>
                        <p>{selectedOrder.billingAddress.street}</p>
                        <p>
                          {selectedOrder.billingAddress.city}, {selectedOrder.billingAddress.state}{' '}
                          {selectedOrder.billingAddress.zip}
                        </p>
                        <p>{selectedOrder.billingAddress.country}</p>
                        <p>Phone: {selectedOrder.billingAddress.phone}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold">Shipping Address</h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{selectedOrder.shippingAddress.name}</p>
                        <p>{selectedOrder.shippingAddress.street}</p>
                        <p>
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
                          {selectedOrder.shippingAddress.zip}
                        </p>
                        <p>{selectedOrder.shippingAddress.country}</p>
                        <p>Phone: {selectedOrder.shippingAddress.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Section>
  );
}
