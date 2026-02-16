import { useState } from 'react';
import { Section } from '@/components/Section';
import { menuData } from '@/data/menu';
import { CategoryPill } from '@/components/menu/CategoryPill';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { useCart } from '@/cart/useCart';
import { toast } from 'sonner';
import type { PriceVariant } from '@/data/menu';

export function MenuSection() {
  const [selectedCategory, setSelectedCategory] = useState(menuData.categories[0].name);
  const { dispatch } = useCart();

  const currentCategory = menuData.categories.find((cat) => cat.name === selectedCategory);

  const handleAddToCart = (itemName: string, itemDescription: string, price: number, variant?: PriceVariant) => {
    const displayName = variant ? `${itemName} (${variant.label})` : itemName;
    const finalPrice = variant ? variant.price : price;
    
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: variant ? `${itemName}-${variant.label}` : itemName,
        name: displayName,
        price: finalPrice,
      },
    });
    toast.success(`Added ${displayName} to cart`);
  };

  return (
    <Section id="menu" className="bg-background">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">Our Menu</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our authentic Chinese dishes, crafted with traditional recipes and fresh ingredients
          </p>
        </div>

        {/* Category selector */}
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide-horizontal">
            {menuData.categories.map((category) => (
              <CategoryPill
                key={category.name}
                name={category.name}
                thumbnail={category.thumbnail}
                isSelected={selectedCategory === category.name}
                onClick={() => setSelectedCategory(category.name)}
              />
            ))}
          </div>
        </div>

        {/* Menu items grid */}
        {currentCategory && (
          <div className="space-y-4">
            {currentCategory.description && (
              <p className="text-sm text-muted-foreground text-center italic">
                {currentCategory.description}
              </p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {currentCategory.items.map((item) => (
                <MenuItemCard
                  key={item.name}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  variants={item.variants}
                  image={item.image}
                  onAddToCart={(selectedVariant) =>
                    handleAddToCart(item.name, item.description, item.price || 0, selectedVariant)
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
