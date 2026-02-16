import { useState } from 'react';
import { useCart } from '@/cart/useCart';
import { useCreateOrder } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { mapCartItemsToOrderItems, createAddress } from '@/lib/orderMapping';
import { formatRupees } from '@/lib/currency';
import { siteContent } from '@/content/siteContent';
import { uiEvents } from '@/utils/uiEvents';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, Loader2, LogIn } from 'lucide-react';

interface CheckoutSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FulfillmentType = 'pickup' | 'delivery';

export function CheckoutSheet({ open, onOpenChange }: CheckoutSheetProps) {
  const { state, dispatch, subtotal } = useCart();
  const { identity } = useInternetIdentity();
  const createOrder = useCreateOrder();
  const isAuthenticated = !!identity;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('pickup');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateField, setStateField] = useState('');
  const [zip, setZip] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderId, setOrderId] = useState<bigint | null>(null);

  const handleSignIn = () => {
    onOpenChange(false);
    uiEvents.emit('open-auth');
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!fulfillmentType) newErrors.fulfillmentType = 'Please select pickup or delivery';

    if (fulfillmentType === 'delivery') {
      if (!street.trim()) newErrors.street = 'Street address is required';
      if (!city.trim()) newErrors.city = 'City is required';
      if (!stateField.trim()) newErrors.state = 'State is required';
      if (!zip.trim()) newErrors.zip = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      handleSignIn();
      return;
    }

    if (!validateForm()) return;

    const orderItems = mapCartItemsToOrderItems(state.items);

    // For pickup, use restaurant address; for delivery, use customer address
    const billingAddress = createAddress(
      name,
      phone,
      fulfillmentType === 'delivery' ? street : siteContent.contact.address,
      fulfillmentType === 'delivery' ? city : 'Lahore',
      fulfillmentType === 'delivery' ? stateField : 'Punjab',
      fulfillmentType === 'delivery' ? zip : '53720',
      'Pakistan'
    );

    const shippingAddress =
      fulfillmentType === 'delivery'
        ? billingAddress
        : createAddress(name, phone, siteContent.contact.address, 'Lahore', 'Punjab', '53720', 'Pakistan');

    try {
      const order = await createOrder.mutateAsync({
        items: orderItems,
        billingAddress,
        shippingAddress,
      });

      setOrderId(order.id);
      // Clear cart after successful order
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Order creation failed:', error);
    }
  };

  const handleClose = () => {
    if (orderId) {
      // Reset form on close after successful order
      setName('');
      setPhone('');
      setFulfillmentType('pickup');
      setStreet('');
      setCity('');
      setStateField('');
      setZip('');
      setNote('');
      setOrderId(null);
      setErrors({});
    }
    onOpenChange(false);
  };

  // Show sign-in required message for anonymous users
  if (!isAuthenticated) {
    return (
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent className="w-full sm:max-w-lg rounded-l-3xl bg-background border-l-2 sheet-content-safe">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-foreground">Sign In Required</SheetTitle>
            <SheetDescription className="text-muted-foreground">Please sign in to place an order</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="bg-primary/15 rounded-full p-6 border-2 border-primary/30">
              <LogIn className="h-20 w-20 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-foreground">Sign in to continue</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                You need to be signed in to place orders. Sign in now to complete your checkout.
              </p>
            </div>
            <Button onClick={handleSignIn} className="mt-4 rounded-full shadow-md" size="lg">
              Sign In
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  if (orderId) {
    return (
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent className="w-full sm:max-w-lg rounded-l-3xl bg-background border-l-2 sheet-content-safe">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-foreground">Order Confirmed!</SheetTitle>
            <SheetDescription className="text-muted-foreground">Your order has been successfully placed</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="bg-success/15 rounded-full p-6 border-2 border-success/30">
              <CheckCircle2 className="h-20 w-20 text-success" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-foreground">Thank you for your order!</h3>
              <p className="text-muted-foreground font-semibold">Order #{orderId.toString()}</p>
              <p className="text-sm text-muted-foreground max-w-sm">
                {fulfillmentType === 'delivery'
                  ? 'Your order will be delivered to the address provided.'
                  : 'Your order will be ready for pickup soon. We will contact you when it is ready.'}
              </p>
            </div>
            <Button onClick={handleClose} className="mt-4 rounded-full shadow-md" size="lg">
              Continue Shopping
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col rounded-l-3xl bg-background border-l-2 sheet-content-safe">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl font-bold text-foreground">Checkout</SheetTitle>
          <SheetDescription className="text-muted-foreground">Complete your order details</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {/* Order Summary */}
            <div className="space-y-3 bg-card border border-border p-4 rounded-2xl shadow-sm">
              <h3 className="font-bold text-lg text-foreground">Order Summary</h3>
              <div className="space-y-2 text-sm">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-muted-foreground font-medium">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-bold text-foreground">{formatRupees(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span className="text-foreground">Total</span>
                <span className="text-primary">{formatRupees(subtotal)}</span>
              </div>
            </div>

            <Separator />

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-foreground">Customer Information</h3>
              <div className="space-y-2">
                <Label htmlFor="name" className="font-semibold">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="rounded-xl border-2"
                />
                {errors.name && <p className="text-sm text-destructive font-medium">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-semibold">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03XX-XXXXXXX"
                  className="rounded-xl border-2"
                />
                {errors.phone && <p className="text-sm text-destructive font-medium">{errors.phone}</p>}
              </div>
            </div>

            <Separator />

            {/* Fulfillment Type */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-foreground">Fulfillment Type</h3>
              <div className="space-y-2">
                <Label htmlFor="fulfillmentType" className="font-semibold">Select Option *</Label>
                <Select value={fulfillmentType} onValueChange={(value) => setFulfillmentType(value as FulfillmentType)}>
                  <SelectTrigger id="fulfillmentType" className="rounded-xl border-2">
                    <SelectValue placeholder="Select fulfillment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pickup">Pickup</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                  </SelectContent>
                </Select>
                {errors.fulfillmentType && (
                  <p className="text-sm text-destructive font-medium">{errors.fulfillmentType}</p>
                )}
              </div>
            </div>

            {/* Delivery Address (conditional) */}
            {fulfillmentType === 'delivery' && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-foreground">Delivery Address</h3>
                  <div className="space-y-2">
                    <Label htmlFor="street" className="font-semibold">Street Address *</Label>
                    <Input
                      id="street"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Street address"
                      className="rounded-xl border-2"
                    />
                    {errors.street && <p className="text-sm text-destructive font-medium">{errors.street}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="font-semibold">City *</Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="rounded-xl border-2"
                      />
                      {errors.city && <p className="text-sm text-destructive font-medium">{errors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="font-semibold">State *</Label>
                      <Input
                        id="state"
                        value={stateField}
                        onChange={(e) => setStateField(e.target.value)}
                        placeholder="State"
                        className="rounded-xl border-2"
                      />
                      {errors.state && <p className="text-sm text-destructive font-medium">{errors.state}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip" className="font-semibold">ZIP Code *</Label>
                    <Input
                      id="zip"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="ZIP code"
                      className="rounded-xl border-2"
                    />
                    {errors.zip && <p className="text-sm text-destructive font-medium">{errors.zip}</p>}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Order Notes */}
            <div className="space-y-2">
              <Label htmlFor="note" className="font-semibold">Order Notes (Optional)</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any special instructions for your order"
                className="rounded-xl border-2 min-h-[80px]"
              />
            </div>

            {createOrder.isError && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertDescription>
                  Failed to create order. Please try again or contact support.
                </AlertDescription>
              </Alert>
            )}
          </form>
        </ScrollArea>

        <div className="pt-4 border-t">
          <Button
            onClick={handleSubmit}
            disabled={createOrder.isPending}
            className="w-full rounded-full shadow-md"
            size="lg"
          >
            {createOrder.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Place Order - ${formatRupees(subtotal)}`
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
