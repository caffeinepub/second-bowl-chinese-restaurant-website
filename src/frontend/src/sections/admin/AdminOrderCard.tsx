import { Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRupees } from '@/lib/currency';
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

interface AdminOrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
}

export function AdminOrderCard({ order, onViewDetails }: AdminOrderCardProps) {
  return (
    <Card className="admin-order-card bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 space-y-3">
        {/* Header: Order # and Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-2">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">Order #{order.id.toString()}</h3>
              <p className="text-sm text-muted-foreground">{order.shippingAddress.name}</p>
            </div>
          </div>
          <Badge className={`${statusColors[order.status]} border-0 font-semibold shrink-0`}>
            {statusLabels[order.status]}
          </Badge>
        </div>

        {/* Meta: Items count and Total */}
        <div className="admin-order-card-meta flex items-center justify-between pt-2 border-t border-border/50">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{order.items.length}</span> item{order.items.length !== 1 ? 's' : ''}
          </div>
          <div className="admin-order-total text-xl font-bold text-primary">
            {formatRupees(Number(order.totalAmount))}
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onViewDetails(order)}
          className="admin-pill-action w-full rounded-full shadow-sm hover:shadow-md transition-shadow"
          size="sm"
        >
          View Details
        </Button>
      </div>
    </Card>
  );
}
