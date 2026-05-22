import { SEO } from '../components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Mail, MapPin, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';

export function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      <SEO 
        title="Contact Us | CreatorAI"
        description="Get in touch with the CreatorAI team for support, business inquiries, or feedback."
      />
      <div className="container mx-auto px-4 max-w-4xl py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-6">Get In Touch</h1>
          <p className="text-xl text-muted-foreground">
            Have a question, need support, or want to discuss a partnership? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-muted/30 border-muted">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Mail className="w-6 h-6 mr-3 text-primary" /> Support Intakes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Our support team is available 24/7 to help you with any issues related to the AI tools on our platform.
              </p>
              <a href="mailto:support@creatorai.com">
                <Button variant="outline" className="w-full">support@creatorai.com</Button>
              </a>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-muted">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <MessageSquare className="w-6 h-6 mr-3 text-primary" /> Business & Press
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                For media inquiries, enterprise scaling, or integration partnerships, please reach out directly to management.
              </p>
              <a href="mailto:partners@creatorai.com">
                <Button variant="outline" className="w-full">partners@creatorai.com</Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
