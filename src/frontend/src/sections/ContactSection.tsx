import { useState } from 'react';
import { Section } from '@/components/Section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Phone, Mail, Clock, CheckCircle2, Globe } from 'lucide-react';
import { siteContent } from '@/content/siteContent';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
    }, 1000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const hasWhatsApp = siteContent.contact.whatsappLink && siteContent.contact.whatsappLink.trim() !== '';

  return (
    <Section id="contact" className="bg-muted/30">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">Get In Touch</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions or want to make a reservation? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {siteContent.contact.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {siteContent.contact.phones.map((phone, index) => (
                        <p key={index}>
                          <a href={`tel:${phone}`} className="hover:text-primary transition-colors">
                            {phone}
                          </a>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {siteContent.contact.email}
                    </p>
                  </div>
                </div>
                {siteContent.contact.website && (
                  <div className="flex items-start space-x-4">
                    <Globe className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="font-medium">Website</p>
                      <a
                        href={siteContent.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {siteContent.contact.website}
                      </a>
                    </div>
                  </div>
                )}
                {hasWhatsApp && (
                  <div className="flex items-start space-x-4">
                    <img
                      src="/assets/generated/whatsapp-logo.dim_128x128.png"
                      alt="WhatsApp"
                      className="h-5 w-5 mt-1 shrink-0"
                    />
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <a
                        href={siteContent.contact.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                        aria-label="Contact us on WhatsApp"
                      >
                        Chat with us
                      </a>
                    </div>
                  </div>
                )}
                <div className="flex items-start space-x-4">
                  <Clock className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="font-medium">Hours</p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {siteContent.contact.hours.map((hour, index) => (
                        <p key={index}>{hour}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <Alert className="border-primary/50 bg-primary/5">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <AlertDescription className="ml-2">
                    Thank you for your message! We'll get back to you soon.
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Your name"
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      className={errors.message ? 'border-destructive' : ''}
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive">{errors.message}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  );
}
