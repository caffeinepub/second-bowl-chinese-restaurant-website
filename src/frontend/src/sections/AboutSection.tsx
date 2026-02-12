import { Section } from '@/components/Section';
import { Gallery } from '@/components/Gallery';
import { siteContent } from '@/content/siteContent';

export function AboutSection() {
  return (
    <Section id="about">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">About Second Bowl</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {siteContent.about.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            {siteContent.about.story.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="space-y-6">
            {siteContent.about.approach.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="pt-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Gallery</h3>
          <Gallery images={siteContent.about.gallery} />
        </div>
      </div>
    </Section>
  );
}
