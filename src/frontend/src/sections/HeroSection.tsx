import { Section } from '@/components/Section';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { siteContent } from '@/content/siteContent';

export function HeroSection() {
  const scrollToMenu = () => {
    const element = document.querySelector('#menu');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Section id="home" className="relative pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/generated/second-bowl-hero.dim_1920x1080.png"
          alt="Second Bowl Restaurant"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/assets/generated/second-bowl-logo.dim_512x512.png"
            alt="Second Bowl Logo"
            className="h-24 w-24 md:h-32 md:w-32 object-contain"
          />
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Second Bowl
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            {siteContent.hero.tagline}
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            onClick={scrollToMenu}
            className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            View Our Menu
          </Button>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 max-w-3xl mx-auto">
          {siteContent.hero.highlights.map((highlight, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">{highlight.icon}</div>
                <h3 className="font-semibold mb-1">{highlight.title}</h3>
                <p className="text-sm text-muted-foreground">{highlight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
