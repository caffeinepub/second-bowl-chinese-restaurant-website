import { Button } from '@/components/ui/button';

export function HeroSection() {
  const scrollToMenu = () => {
    const menuSection = document.querySelector('#menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'url(/assets/generated/ricebowl-dark-texture-bg.dim_1920x1080.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center space-y-8">
        {/* Logo in frosted glass container */}
        <div className="inline-block bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
          <img
            src="/assets/generated/second-bowl-logo-from-menu.dim_512x512.png"
            alt="Second Bowl"
            className="h-32 w-32 md:h-40 md:w-40 object-contain mx-auto"
          />
        </div>

        {/* Tagline */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Authentic Chinese Cuisine
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            Crafted with Passion and Tradition
          </p>
        </div>

        {/* CTA Button */}
        <Button
          size="lg"
          onClick={scrollToMenu}
          className="rounded-full text-lg px-8 py-6 bg-red-600 hover:bg-red-700 text-white shadow-lg focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          Explore Our Menu
        </Button>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-3">🥢</div>
            <h3 className="font-bold text-white text-lg mb-2">Authentic Flavors</h3>
            <p className="text-white/80 text-sm">Traditional recipes passed down through generations</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-3">🍜</div>
            <h3 className="font-bold text-white text-lg mb-2">Fresh Ingredients</h3>
            <p className="text-white/80 text-sm">Locally sourced, prepared daily with care</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-3">🏮</div>
            <h3 className="font-bold text-white text-lg mb-2">Warm Atmosphere</h3>
            <p className="text-white/80 text-sm">Dine-in and takeout available</p>
          </div>
        </div>
      </div>
    </section>
  );
}
