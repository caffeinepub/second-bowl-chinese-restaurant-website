import { Section } from '@/components/Section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { menuData } from '@/data/menu';

export function MenuSection() {
  return (
    <Section id="menu" className="bg-muted/30">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">Our Menu</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully crafted dishes, made with authentic recipes and the finest ingredients.
          </p>
        </div>

        <div className="space-y-12">
          {menuData.categories.map((category) => (
            <Card key={category.name} className="overflow-hidden">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="text-2xl md:text-3xl">{category.name}</CardTitle>
                {category.description && (
                  <p className="text-muted-foreground">{category.description}</p>
                )}
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <div className="space-y-6">
                  {category.items.map((item, index) => (
                    <div key={index}>
                      {index > 0 && <Separator className="my-6" />}
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-1">
                          <h4 className="font-semibold text-lg">{item.name}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        <div className="text-lg font-semibold text-primary whitespace-nowrap">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
