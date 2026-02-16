import { Card } from '@/components/ui/card';
import { formatRupees } from '@/lib/currency';
import type { OrderItem } from '@/backend';

interface AdminOrderItemsListProps {
  items: OrderItem[];
}

export function AdminOrderItemsList({ items }: AdminOrderItemsListProps) {
  return (
    <div className="space-y-3">
      {items.map((orderItem, index) => (
        <Card key={index} className="admin-order-item-card bg-card border border-border rounded-2xl shadow-sm p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="admin-order-item-qty text-lg font-bold text-foreground">
                  {orderItem.quantity.toString()}×
                </span>
                <h4 className="font-semibold text-foreground leading-tight">{orderItem.item.name}</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatRupees(Number(orderItem.item.price))} each
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-foreground">
                {formatRupees(Number(orderItem.total))}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
