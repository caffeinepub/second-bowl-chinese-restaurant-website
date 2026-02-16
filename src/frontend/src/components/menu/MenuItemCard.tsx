import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { formatRupees } from '@/lib/currency';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { PriceVariant } from '@/data/menu';

interface MenuItemCardProps {
  name: string;
  description: string;
  price?: number;
  variants?: PriceVariant[];
  image?: string;
  onAddToCart: (selectedVariant?: PriceVariant) => void;
}

export function MenuItemCard({ name, description, price, variants, image, onAddToCart }: MenuItemCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<PriceVariant | undefined>(
    variants && variants.length > 0 ? variants[0] : undefined
  );

  const handleAddToCart = () => {
    if (variants && selectedVariant) {
      onAddToCart(selectedVariant);
    } else {
      onAddToCart();
    }
  };

  const displayPrice = variants && selectedVariant ? selectedVariant.price : price;

  return (
    <div className="relative group overflow-hidden rounded-2xl bg-muted/30 border-2 border-border hover:border-primary/30 transition-all duration-200 shadow-soft hover:shadow-soft-lg">
      {/* Image or placeholder */}
      <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl opacity-20">🍜</div>
          </div>
        )}
        
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Item name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h4 className="font-bold text-white text-sm leading-tight line-clamp-2">
            {name}
          </h4>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div className="text-xs text-muted-foreground line-clamp-1">
          {description}
        </div>

        {/* Variant selector */}
        {variants && variants.length > 0 && (
          <RadioGroup
            value={selectedVariant?.label}
            onValueChange={(value) => {
              const variant = variants.find((v) => v.label === value);
              if (variant) setSelectedVariant(variant);
            }}
            className="flex flex-wrap gap-2"
          >
            {variants.map((variant) => (
              <div key={variant.label} className="flex items-center">
                <RadioGroupItem
                  value={variant.label}
                  id={`${name}-${variant.label}`}
                  className="sr-only peer"
                />
                <Label
                  htmlFor={`${name}-${variant.label}`}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border-2 cursor-pointer transition-all peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary hover:border-primary/50"
                >
                  {variant.label} • {formatRupees(variant.price)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {/* Price and Add button */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="text-base font-bold text-primary">
            {displayPrice !== undefined ? formatRupees(displayPrice) : 'N/A'}
          </div>
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="shrink-0 rounded-full bg-primary hover:bg-primary/90 shadow-soft h-8 px-3"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
