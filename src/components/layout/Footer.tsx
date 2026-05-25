import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t py-8 md:py-12 bg-muted/30">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center space-y-4">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xl tracking-tight">CreatorAI</span>
        </div>
        <p className="text-sm text-muted-foreground max-w-md">
          Empowering creators with free AI tools to scale their organic reach.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-muted-foreground my-4">
          <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
          <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
          <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link to="/blog" className="hover:text-primary transition-colors">Creator Blog</Link>
        </div>

        <p className="text-xs text-muted-foreground mt-8 flex flex-col md:flex-row items-center justify-center gap-2">
          <span>&copy; {new Date().getFullYear()} CreatorAI by Musab Umair. All rights reserved.</span>
          <span className="hidden md:inline">•</span>
          <span>Initial Release: May 25, 2026</span>
        </p>
      </div>
    </footer>
  );
}
