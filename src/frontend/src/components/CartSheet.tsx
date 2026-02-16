import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/cart/useCart';
import { formatRupees } from '@/lib/currency';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { uiEvents } from '@/utils/uiEvents';

interface CartSheetProps {
  onCheckout: () => void;
}

export function CartSheet({ onCheckout }: CartSheetProps) {
  const { state, dispatch, subtotal, itemCount } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOpenCart = () => setOpen(true);
    uiEvents.on('open-cart', handleOpenCart);
    return () => uiEvents.off('open-cart', handleOpenCart);
  }, []);

  const handleCheckout = () => {
    setOpen(false);
    onCheckout();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full border-2">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground rounded-full border-2 border-background"
            >
              {itemCount}
            </Badge>
          )}
          <span className="sr-only">Shopping cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        className="w-full sm:max-w-lg flex flex-col rounded-l-3xl bg-background border-l-2 sheet-content-safe"
        style={{ zIndex: 100 }}
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl font-bold text-foreground">Your Cart</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {itemCount === 0 ? 'Your cart is empty' : `${itemCount} item${itemCount !== 1 ? 's' : ''} in cart`}
          </SheetDescription>
        </SheetHeader>

        {state.items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center space-y-3">
              <ShoppingCart className="h-20 w-20 mx-auto opacity-20" />
              <p className="text-lg">Add items from the menu to get started</p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-3 py-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex gap-3 bg-card border border-border p-4 rounded-2xl shadow-sm">
                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold leading-tight text-foreground">{item.name}</h4>
                      <p className="text-sm text-muted-foreground font-medium">
                        {formatRupees(item.price)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full border-2"
                        onClick={() => dispatch({ type: 'DECREMENT_ITEM', payload: item.id })}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-bold text-foreground">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full border-2"
                        onClick={() => dispatch({ type: 'INCREMENT_ITEM', payload: item.id })}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                        onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4 border-t-2 border-border">
              <div className="flex justify-between items-center text-xl font-bold">
                <span className="text-foreground">Subtotal</span>
                <span className="text-primary">{formatRupees(subtotal)}</span>
              </div>
              <Button 
                onClick={handleCheckout} 
                className="w-full rounded-full shadow-md hover:shadow-lg transition-shadow" 
                size="lg"
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                onClick={() => dispatch({ type: 'CLEAR_CART' })}
                className="w-full rounded-full border-2"
              >
                Clear Cart
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
