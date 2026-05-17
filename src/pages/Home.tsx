import { Link } from 'react-router-dom';
import { CORE_TOOLS, ADVANCED_TOOLS } from '../lib/tools-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import * as Icons from 'lucide-react';
import { Button, buttonVariants } from '../components/ui/button';
import { useAppStore } from '../lib/store';
import { useState } from 'react';
import { Star, MessageSquare, User, Calendar, Plus, Sparkles, Zap, Shield, Globe, ArrowRight, Play, CheckCircle2, Send, X, ChevronRight, BarChart3, Video, Layout, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../components/SEO';
import { PenTool, ImagePlus, FileText } from 'lucide-react';

export function Home() {
  const { comments, addComment, user } = useAppStore();
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAllReviewsOpen, setIsAllReviewsOpen] = useState(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.length < 5) {
      toast.error('Comment must be at least 5 characters');
      return;
    }
    // They are automatically logged in now.
    if (user) {
      addComment(newComment, newRating);
      setNewComment('');
      setNewRating(5);
      setIsReviewModalOpen(false);
      toast.success('Review added successfully!');
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="AI Tools for Creators & Viral Content Generation"
        description="CreatorAI Musab is an advanced AI creator platform helping YouTubers, TikTok creators, influencers, and digital creators generate AI-powered scripts, captions, prompts, thumbnails, branding ideas, and viral content faster."
        keywords="best ai tools for youtubers, free ai tools, ai tools for creators, ai tools for video editing, ai thumbnail generator, ai script writer, youtube ai tools, ai creator tools, ai tools 2026, best free ai tools, ai productivity tools, youtube automation tools, ai content creation tools, ai editing tools, ai writing tools, ai image generator, ai creator platform"
        schema={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "name": "CreatorAI Musab",
              "url": "https://ai-create-pi.vercel.app",
              "logo": "https://ai-create-pi.vercel.app/favicon.svg"
            },
            {
              "@type": "WebSite",
              "name": "CreatorAI Musab",
              "url": "https://ai-create-pi.vercel.app",
              "description": "AI Tools for Creators & Content Generation"
            },
            {
              "@type": "SoftwareApplication",
              "name": "CreatorAI Musab Platform",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "All"
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is CreatorAI Musab?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "CreatorAI Musab is the best free AI creator platform tailored specifically for YouTubers, TikTok and Instagram creators. It provides a full suite of AI content generation tools."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Are AI creator tools free?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, our platform provides completely free AI tools for creators, equipping you with enterprise-grade content generation, script writing, and thumbnail ideas."
                  }
                }
              ]
            }
          ]
        }}
      />

      {/* Hero Section */}
      <section className="relative py-24 md:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(14,165,233,0.1),rgba(255,255,255,0))] pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge variant="secondary" className="mb-8 px-6 py-2 text-sm rounded-full bg-primary/10 text-primary border-primary/20 animate-bounce">
            🚀 The Ultimate Enterprise AI Toolkit
          </Badge>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 max-w-5xl mx-auto text-balance leading-[0.9]">
            Create Viral Content Faster <span className="text-primary">with AI</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto text-balance">
            CreatorAI Musab helps creators generate AI-powered scripts, prompts, captions, thumbnails, branding ideas, and viral content tools for YouTube, TikTok, Instagram, and social media.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button 
              size="lg" 
              className="rounded-full px-10 h-14 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
              onClick={() => scrollToSection('core-tools')}
            >
              Start Creating
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full px-10 h-14 text-lg font-bold hover:bg-primary/5 hover:scale-105 transition-transform"
              onClick={() => scrollToSection('advanced-tools')}
            >
              Explore AI Tools
            </Button>
          </div>
        </div>
      </section>

      {/* SEO Landing Pages Links */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="sr-only">Top Rated Free AI Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/youtube-title-generator" className="flex items-center p-4 bg-background rounded-xl border hover:border-primary transition-colors">
              <Search className="w-5 h-5 mr-3 text-primary" />
              <span className="font-semibold">YouTube Title Generator AI Free</span>
            </Link>
            <Link to="/ai-script-generator" className="flex items-center p-4 bg-background rounded-xl border hover:border-primary transition-colors">
              <FileText className="w-5 h-5 mr-3 text-primary" />
              <span className="font-semibold">AI Script Generator for YouTube</span>
            </Link>
            <Link to="/thumbnail-generator" className="flex items-center p-4 bg-background rounded-xl border hover:border-primary transition-colors">
              <ImagePlus className="w-5 h-5 mr-3 text-primary" />
              <span className="font-semibold">Free AI Thumbnail Generator</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Tools Section */}
      <section id="core-tools" className="py-24 container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">CORE AI TOOLS FOR CREATORS</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need for content ideation, YouTube SEO optimization, thumbnail generation, and viral hook creation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CORE_TOOLS.map((tool) => {
            const Icon = (Icons as any)[tool.icon] || Icons.Wand2;
            return (
              <Link key={tool.id} to={`/tool/${tool.id}`} className="group">
                <Card className="h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/50 bg-card/50 backdrop-blur-sm overflow-hidden border-border/50">
                  <CardHeader className="relative">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 group-hover:rotate-6">
                      <Icon className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-2xl font-bold mb-2">{tool.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-none">{tool.category}</Badge>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Advanced Tools Section */}
      <section id="advanced-tools" className="py-24 bg-muted/20 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">ADVANCED FEATURES</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Take your channel to the next level with deep analysis and A/B testing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {ADVANCED_TOOLS.map((tool) => {
              const Icon = (Icons as any)[tool.icon] || Icons.Wand2;
              return (
                <Link key={tool.id} to={`/advanced/${tool.id}`} className="group">
                  <Card className="h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/50 bg-background overflow-hidden border-border/50">
                    <CardHeader>
                      <div className="flex items-center space-x-6">
                        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 group-hover:-rotate-6">
                          <Icon className="h-8 w-8" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold mb-1">{tool.title}</CardTitle>
                          <Badge variant="default" className="bg-primary hover:bg-primary">Pro Feature (Free)</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-base leading-relaxed">{tool.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-24 container mx-auto px-4 border-t">
        <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
          <h2 className="text-4xl font-black mb-8 text-primary">The Ultimate AI Creator Platform for YouTubers, TikTokers, and Influencers</h2>
          
          <p className="lead">
            In the fast-paced, high-stakes digital landscape of 2026, staying ahead of social media algorithms is mission-critical for every content creator. Welcome to <strong>CreatorAI Musab</strong>, the web's undisputed <strong>best AI tools platform</strong> tailored to fuel your creative pipeline. From finding that viral spark for a YouTube video to generating engaging TikTok hooks, we deliver the world’s foremost <strong>free AI tools for YouTubers</strong> and visual artists.
          </p>

          <h3 className="text-3xl font-bold mt-12 mb-6">Why Use AI Tools for Content Creation in 2026?</h3>
          <p>
            An <strong>AI creator assistant</strong> does far more than save time—it acts as an intelligence amplifier. Leveraging state-of-the-art Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO), our platform equips video editors, digital freelancers, and creative entrepreneurs with the <strong>best AI tools for creators</strong> to maximize engagement. It’s no longer about guessing what your audience wants. Whether you need a top-tier <strong>AI script writer</strong> or an intuitive <strong>AI video editing tool</strong> concept planner, we integrate AI deeply into your content lifecycle.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 mb-16">
            <div>
              <h4 className="text-2xl font-bold mb-4 flex items-center">
                <Search className="w-6 h-6 mr-3 text-primary" /> Multi-Platform Script Writing
              </h4>
              <p className="text-base text-muted-foreground">
                Beat writer's block with our specialized <strong>AI script generator for YouTube</strong>. Generate captivating hooks, tight comedic timing, and actionable prompts that are tailored for high retention. Simply input your topic and watch the AI tools ideate viral outlines within seconds.
              </p>
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-4 flex items-center">
                <ImagePlus className="w-6 h-6 mr-3 text-primary" /> Click-Worthy Thumbnail Generation
              </h4>
              <p className="text-base text-muted-foreground">
                CTR is king. Our built-in <strong>free AI thumbnail generator</strong> concepts allow you to A/B test compelling visuals. Gain the competitive edge with advanced visual branding strategies that compel viewers to click your YouTube and Instagram Reels content immediately.
              </p>
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-4 flex items-center">
                <BarChart3 className="w-6 h-6 mr-3 text-primary" /> YouTube Automation & Analytics
              </h4>
              <p className="text-base text-muted-foreground">
                Tap into actionable, AI-driven data. With our integrated <strong>YouTube automation tools</strong>, quickly analyze competitor channels, find under-served topical niches, and pinpoint exactly what titles are grabbing the highest search volume right now.
              </p>
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-4 flex items-center">
                <Globe className="w-6 h-6 mr-3 text-primary" /> Social Media Prompt Engineering
              </h4>
              <p className="text-base text-muted-foreground">
                Maximize the ROI on every post. Our native <strong>AI prompt generator</strong> produces contextual, viral-ready system instructions for ChatGPT, Gemini, and Claude AI—helping you write engaging captions and community tabs instantly.
              </p>
            </div>
          </div>

          <hr className="my-16" />

          <h3 className="text-3xl font-bold mb-6">Frequently Asked Questions (FAQ)</h3>
          
          <div className="space-y-8">
            <div>
              <h4 className="text-xl font-bold mb-2">What is CreatorAI Musab?</h4>
              <p className="text-muted-foreground">
                CreatorAI Musab is an ultra-modern, fully optimized <strong>AI content creation platform</strong> tailored specifically for social media creators. Whether you are a YouTuber requiring AI script planners, a TikToker looking for viral hooks, or a video editor seeking an AI productivity companion, our <strong>AI creator platform</strong> has you covered.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-2">What are the best free AI tools for YouTubers?</h4>
              <p className="text-muted-foreground">
                As of 2026, the best free AI tools focus on retention and discoverability. Our platform gives you completely free access to a <strong>YouTube title generator AI</strong>, a high-converting <strong>AI script writer</strong>, competitor research tools, and deep <strong>AEO-optimized content generators</strong> that understand what the modern algorithm favors.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-2">How can an AI creator platform increase my organic reach?</h4>
              <p className="text-muted-foreground">
                Our suite of <strong>AI tools for video editing</strong> ideation and metadata generation implements <em>Semantic SEO</em> and <em>Generative Engine Optimization</em>. By structuring your YouTube descriptions, titles, and scripts using NLP (Natural Language Processing) optimized terminology, your videos are far more likely to appear in Google search snippets, ChatGPT answers, and Gemini AI suggestions.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-2">Is the AI thumbnail generator free?</h4>
              <p className="text-muted-foreground">
                Yes! Visual packaging is critical. Our <strong>AI thumbnail generator</strong> concepts are free to use. We help you brainstorm the exact imagery, contrast, and text placement necessary to stand out in a saturated digital feed—ensuring your YouTube CTR skyrockets.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
             <Button size="lg" className="rounded-full px-12 py-6 text-xl font-bold shadow-2xl" onClick={() => scrollToSection('core-tools')}>
              Supercharge My Channel With AI Today
            </Button>
          </div>
        </div>
      </section>
      <section className="py-24 container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">WHAT CREATORS SAY</h2>
            <p className="text-muted-foreground text-lg">Join thousands of creators using CreatorAI to grow.</p>
          </div>
          <div className="flex gap-4">
            <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
              <DialogTrigger render={
                <Button className="rounded-full px-8 h-12 font-bold">
                  <Plus className="w-5 h-5 mr-2" /> Write a Review
                </Button>
              } />
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Share your experience</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddReview} className="space-y-6 pt-4">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Rating</Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star 
                            className={cn(
                              "w-8 h-8",
                              star <= newRating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                            )} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="comment" className="text-base font-semibold">Your Comment</Label>
                    <Textarea 
                      id="comment" 
                      placeholder="How has CreatorAI helped you?" 
                      className="min-h-[120px] text-base"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 text-lg font-bold">Submit Review</Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="rounded-full px-8 h-12 font-bold" onClick={() => setIsAllReviewsOpen(true)}>
              See All Reviews
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {comments.slice(0, 2).map((comment) => (
            <Card key={comment.id} className="bg-muted/30 border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {comment.userAvatar ? (
                        <img src={comment.userAvatar} alt={comment.userName} className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{comment.userName}</p>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={cn(
                              "w-4 h-4",
                              i < comment.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                            )} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-lg leading-relaxed italic">"{comment.text}"</p>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* All Reviews Modal */}
        <Dialog open={isAllReviewsOpen} onOpenChange={setIsAllReviewsOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black tracking-tight">ALL REVIEWS</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-4 py-6 space-y-6">
              {comments.map((comment) => (
                <Card key={comment.id} className="bg-muted/30 border-none">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                          {comment.userAvatar ? (
                            <img src={comment.userAvatar} alt={comment.userName} className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-5 h-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold">{comment.userName}</p>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={cn(
                                  "w-3 h-3",
                                  i < comment.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                                )} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-base italic">"{comment.text}"</p>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
