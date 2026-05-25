import { Link } from "react-router-dom";
import { CORE_TOOLS, ADVANCED_TOOLS } from "../lib/tools-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import * as Icons from "lucide-react";
import { Button, buttonVariants } from "../components/ui/button";
import { useAppStore } from "../lib/store";
import { useState } from "react";
import {
  Star,
  MessageSquare,
  User,
  Calendar,
  Plus,
  Sparkles,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Play,
  CheckCircle2,
  Send,
  X,
  ChevronRight,
  BarChart3,
  Video,
  Layout,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "../components/SEO";
import { PenTool, ImagePlus, FileText } from "lucide-react";

export function Home() {
  const { comments, addComment, user } = useAppStore();
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAllReviewsOpen, setIsAllReviewsOpen] = useState(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.length < 5) {
      toast.error("Comment must be at least 5 characters");
      return;
    }
    // They are automatically logged in now.
    if (user) {
      addComment(newComment, newRating);
      setNewComment("");
      setNewRating(5);
      setIsReviewModalOpen(false);
      toast.success("Review added successfully!");
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Best Free AI Tools for YouTubers & Content Creators 2026 | CreatorAI"
        description="Supercharge your content workflow with CreatorAI. Access 100% free AI tools for YouTubers to write scripts, generate high-CTR titles, and design viral thumbnails."
        keywords="best ai tools, free ai tools, ai tools for creators, youtube ai tools, ai thumbnail generator, ai script writer, ai tools for video editing"
        schema={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: "CreatorAI Musab",
              url: "https://ai-create-pi.vercel.app",
              logo: "https://ai-create-pi.vercel.app/favicon.svg",
            },
            {
              "@type": "WebSite",
              name: "CreatorAI Musab",
              url: "https://ai-create-pi.vercel.app",
              description: "AI Tools for Creators & Content Generation",
            },
            {
              "@type": "SoftwareApplication",
              name: "CreatorAI Musab Platform",
              applicationCategory: "BusinessApplication",
              operatingSystem: "All",
            },
            {
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is CreatorAI Musab?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "CreatorAI Musab is the best free AI creator platform tailored specifically for YouTubers, TikTok and Instagram creators. It provides a full suite of AI content generation tools.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Are AI creator tools free?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, our platform provides completely free AI tools for creators, equipping you with enterprise-grade content generation, script writing, and thumbnail ideas.",
                  },
                },
              ],
            },
          ],
        }}
      />

      {/* Hero Section */}
      <section className="relative py-24 md:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(14,165,233,0.1),rgba(255,255,255,0))] pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge
            variant="secondary"
            className="mb-8 px-6 py-2 text-sm rounded-full bg-primary/10 text-primary border-primary/20 animate-bounce"
          >
            🚀 The Ultimate Enterprise AI Toolkit
          </Badge>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 max-w-5xl mx-auto text-balance leading-[0.9]">
            Best Free AI Tools{" "}
            <span className="text-primary">for YouTubers & Creators</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto text-balance">
            CreatorAI Musab helps creators generate AI-powered scripts, prompts,
            captions, thumbnails, branding ideas, and viral content tools for
            YouTube, TikTok, Instagram, and social media.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button
              size="lg"
              className="rounded-full px-10 h-14 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
              onClick={() => scrollToSection("core-tools")}
            >
              Start Creating
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-10 h-14 text-lg font-bold hover:bg-primary/5 hover:scale-105 transition-transform"
              onClick={() => scrollToSection("advanced-tools")}
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
            <Link
              to="/youtube-title-generator"
              className="flex items-center p-4 bg-background rounded-xl border hover:border-primary transition-colors"
            >
              <Search className="w-5 h-5 mr-3 text-primary" />
              <span className="font-semibold">
                YouTube Title Generator AI Free
              </span>
            </Link>
            <Link
              to="/ai-script-generator"
              className="flex items-center p-4 bg-background rounded-xl border hover:border-primary transition-colors"
            >
              <FileText className="w-5 h-5 mr-3 text-primary" />
              <span className="font-semibold">
                AI Script Generator for YouTube
              </span>
            </Link>
            <Link
              to="/thumbnail-generator"
              className="flex items-center p-4 bg-background rounded-xl border hover:border-primary transition-colors"
            >
              <ImagePlus className="w-5 h-5 mr-3 text-primary" />
              <span className="font-semibold">Free AI Thumbnail Generator</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Tools Section */}
      <section id="core-tools" className="py-24 container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            CORE AI TOOLS FOR CREATORS
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need for content ideation, YouTube SEO optimization,
            thumbnail generation, and viral hook creation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CORE_TOOLS.map((tool) => {
            const Icon = (Icons as any)[tool.icon] || Icons.Wand2;
            return (
              <Link key={tool.id} to={`/tools/${tool.id}`} className="group">
                <Card className="h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/50 bg-card/50 backdrop-blur-sm overflow-hidden border-border/50">
                  <CardHeader className="relative">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 group-hover:rotate-6">
                      <Icon className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-2xl font-bold mb-2">
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge
                      variant="secondary"
                      className="bg-primary/5 text-primary border-none"
                    >
                      {tool.category}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Advanced Tools Section */}
      <section
        id="advanced-tools"
        className="py-24 bg-muted/20 border-y border-border/50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              ADVANCED FEATURES
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Take your channel to the next level with deep analysis and A/B
              testing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {ADVANCED_TOOLS.map((tool) => {
              const Icon = (Icons as any)[tool.icon] || Icons.Wand2;
              return (
                <Link
                  key={tool.id}
                  to={`/advanced/${tool.id}`}
                  className="group"
                >
                  <Card className="h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/50 bg-background overflow-hidden border-border/50">
                    <CardHeader>
                      <div className="flex items-center space-x-6">
                        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 group-hover:-rotate-6">
                          <Icon className="h-8 w-8" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold mb-1">
                            {tool.title}
                          </CardTitle>
                          <Badge
                            variant="default"
                            className="bg-primary hover:bg-primary"
                          >
                            Pro Feature (Free)
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-base leading-relaxed">
                        {tool.description}
                      </p>
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
        <div className="max-w-5xl mx-auto prose prose-lg dark:prose-invert">
          <h2 className="text-4xl font-black mb-8 text-primary">
            Mastering Content Creation with the Best Free AI Tools in 2026
          </h2>

          <p className="lead border-l-4 border-primary pl-4 py-2 italic font-medium">
            In 2026, the creator economy is moving faster than ever. To scale a
            channel, you don't just need hard work; you need algorithmic
            alignment, rapid ideation, and semantic authority. That’s why using
            the <strong>best free AI tools for creators</strong> is no longer an
            optional luxury—it is a critical necessity.
          </p>

          <p>
            Welcome to CreatorAI, the ultimate hub for content creators looking
            to integrate <strong>AI tools for video editing</strong>,
            thumbnails, scripting, and analytics into their daily workflow.
            Whether you're a seasoned YouTuber, an aspiring TikTok influence, a
            busy digital freelancer, or a student stepping into visual arts, our
            suite of AI-driven utilities provides the exact generative
            capabilities you need to succeed. The barrier to entry has
            evaporated, but the barrier to viral success has increased. To stand
            out, you need precision, speed, and deep understanding of what
            algorithms actively promote.
          </p>

          <h2 className="text-3xl font-bold mt-16 mb-6">
            AI Tools for Video Editing & Production
          </h2>
          <p>
            While CreatorAI focuses extensively on pre-production and metadata
            generation, it's vital to recognize how these elements integrate
            seamlessly into your entire editing workflow. By utilizing our
            highly structured, NLP-friendly content outlines, your raw material
            imports flawlessly into modern{" "}
            <strong>AI video editing tools</strong>.
          </p>
          <p>
            When an editor uses AI to auto-cut silence, apply generative B-roll,
            or sync captions to audio, they still need a strong underlying
            narrative structure to retain the audience. That is where our
            platform excels. We bridge the gap between creative ideation and
            technical video editing by ensuring the core story beats are
            scientifically formulated to retain viewership. Your post-production
            time drops significantly because the foundational script generated
            by our AI is already optimized for pacing and engagement. Time saved
            in editing means more time developing your next big concept.
          </p>

          <h2 className="text-3xl font-bold mt-16 mb-6">
            Best AI Thumbnail Generators for Massive CTR
          </h2>
          <p>
            You can script, film, and edit the absolute greatest video in human
            history, but if nobody clicks on it, it effectively doesn’t exist.
            Understanding human psychology at scale is incredibly difficult;
            however, analyzing millions of click-through rates (CTR) across
            diverse niches is an area where artificial intelligence undeniably
            shines.
          </p>
          <p>
            The evolution of the <strong>AI thumbnail generator</strong> has
            changed how creators package their content. Our strategies and
            generative tools analyze critical factors: high color contrast,
            specific facial expression suggestions, eye-line tracking, and bold
            text placement. By leveraging an AI thumbnail ideator, you bypass
            hours of expensive brainstorming and immediately gain access to
            proven visual templates that dominate the YouTube recommended feed.
            Visual packaging is your storefront; we ensure it's irresistible.
          </p>

          <h2 className="text-3xl font-bold mt-16 mb-6">
            AI Script Writers for YouTube & TikTok Hooks
          </h2>
          <p>
            "What should I say?" This question causes more creator burnout than
            any other. Our <strong>AI script writer</strong> completely
            eliminates the blank-page syndrome. By analyzing billions of data
            points related to audience retention graphs, emotional peaks, and
            linguistic pacing, our AI constructs a narrative framework proven to
            hold human attention.
          </p>
          <p>
            From the critical first 3-second hook on a TikTok video to the
            mid-roll engagement spikes necessary for a 20-minute YouTube essay,
            our <strong>AI tools for YouTubers</strong> map out the anatomy of a
            viral hit before you even hit record. You simply enter a core
            premise, and the AI expands it into a fully-fledged, tonally
            appropriate script. Whether you operate a high-energy gaming channel
            or an educational tech review channel, the AI adapts its output to
            match your unique brand voice seamlessly.
          </p>

          <h2 className="text-3xl font-bold mt-16 mb-6">
            AI SEO Tools for Creators (Generative Engine Optimization)
          </h2>
          <p>
            Google Search has evolved from traditional blue links into AI
            Overviews. Discovery algorithms like ChatGPT, Google Gemini, and
            Perplexity AI are rapidly becoming the primary ways audiences find
            specialized content. How do you get your YouTube channel natively
            recommended by leading AI systems?
          </p>
          <p>
            You must use <strong>AI SEO tools</strong> focused on topical
            authority and semantic structuring. CreatorAI is built from the
            ground up to utilize Generative Engine Optimization (GEO) and Answer
            Engine Optimization (AEO). When an audience asks an AI, "What are
            the best video tutorials on fixing a leaky faucet?", the metadata
            generated by our platform guarantees that your video is structurally
            formatted to act as the primary citation. We ensure your titles,
            tags, and descriptions utilize Natural Language Processing (NLP)
            friendly terminology so your content ranks organically across both
            traditional search engines and next-generation AI chatbots.
          </p>

          <h2 className="text-3xl font-bold mt-16 mb-6">
            Free AI Productivity Tools & Workflow Automation
          </h2>
          <p>
            Consistency is the solitary metric that all search engines reliably
            reward. Yet, burnout remains the primary reason promising creators
            fail. By integrating our holistic{" "}
            <strong>AI creator platform</strong> into your lifestyle, you
            effectively hire a digital team of researchers and planners
            operating 24/7 at zero cost.
          </p>
          <p>
            Imagine a fully automated workflow: Start your Monday by generating
            10 viral video concepts using our{" "}
            <strong>YouTube Title Generator AI</strong>. On Tuesday, deploy our{" "}
            <strong>AI script generator</strong> to expand the best five
            concepts into comprehensive recording scripts. On Wednesday,
            generate your SEO tags, captions, and community posts in seconds.
            This is what true <strong>AI creator automation</strong> looks like
            today. It allows you to focus purely on performance and
            authenticity, leaving the exhaustive data-crunching to the
            algorithms.
          </p>

          <hr className="my-16 border-border/50" />

          <h2 className="text-3xl font-bold mb-8">
            Frequently Asked Questions (FAQ)
          </h2>

          <div className="space-y-8">
            <div className="bg-muted/30 p-6 rounded-2xl border border-border/50">
              <h3 className="text-xl font-bold mb-3">
                What are the absolute best free AI tools for YouTubers?
              </h3>
              <p className="text-muted-foreground m-0">
                The best free AI tools prioritize viewer retention and search
                discoverability. Our specific platform provides unrestricted
                access to a premium <strong>YouTube title generator AI</strong>,
                a high-converting <strong>AI script writer</strong>, advanced
                competitor research utilities, and deep AEO-optimized content
                generators. We provide the essential toolkit needed to scale
                organically in 2026.
              </p>
            </div>

            <div className="bg-muted/30 p-6 rounded-2xl border border-border/50">
              <h3 className="text-xl font-bold mb-3">
                How does an AI creator platform increase my organic reach?
              </h3>
              <p className="text-muted-foreground m-0">
                It increases reach by implementing <em>Semantic SEO</em>. By
                structuring your YouTube descriptions, titles, and scripts using
                NLP-optimized terminology, your videos are exponentially more
                likely to appear in Google search snippets, ChatGPT answers, and
                Gemini AI suggestions. Organic reach today demands semantic
                authority, which our tools automatically generate for you.
              </p>
            </div>

            <div className="bg-muted/30 p-6 rounded-2xl border border-border/50">
              <h3 className="text-xl font-bold mb-3">
                Is the AI thumbnail generator genuinely free to use?
              </h3>
              <p className="text-muted-foreground m-0">
                Yes! We firmly believe visual packaging should be accessible to
                everyone. Our <strong>AI thumbnail generator</strong> strategies
                and concept layouts are entirely free to use. We guide you in
                crafting imagery that commands attention and radically increases
                your Click-Through Rate (CTR) in crowded digital feeds.
              </p>
            </div>

            <div className="bg-muted/30 p-6 rounded-2xl border border-border/50">
              <h3 className="text-xl font-bold mb-3">
                Can an AI Script Writer guarantee my video will go viral?
              </h3>
              <p className="text-muted-foreground m-0">
                While no software can definitively guarantee virality, an{" "}
                <strong>AI script writer</strong> dramatically tilts the
                statistical odds in your favor. By mathematically mapping out
                the anatomy of past viral videos—from the hook to the
                call-to-action—it ensures your content structure is perfectly
                aligned with human psychology and algorithmic preferences. You
                deliver the performance; AI delivers the blueprint.
              </p>
            </div>

            <div className="bg-muted/30 p-6 rounded-2xl border border-border/50">
              <h3 className="text-xl font-bold mb-3">
                Are these YouTube automation tools scalable for agencies?
              </h3>
              <p className="text-muted-foreground m-0">
                Absolutely. If you operate multiple faceless channels, oversee a
                content agency, or manage brand accounts, our{" "}
                <strong>YouTube automation tools</strong> are built for massive
                scale. You can reliably generate hundreds of perfectly optimized
                titles, complex AI prompts, and robust channel descriptions
                rapidly without sacrificing quality or brand voice.
              </p>
            </div>
          </div>

          <hr className="my-16 border-border/50" />

          <h2 className="text-3xl font-bold mb-8">
            Explore More AI Tools for Creators in Our Blog
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16 not-prose">
            <Link
              to="/blog/best-ai-tools-youtubers-2026"
              className="group p-4 bg-muted/20 border rounded-xl hover:border-primary transition-colors flex items-center"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Video className="w-5 h-5" />
              </div>
              <span className="font-semibold group-hover:text-primary transition-colors">
                Best AI Tools for YouTubers
              </span>
            </Link>
            <Link
              to="/blog/free-ai-thumbnail-generators"
              className="group p-4 bg-muted/20 border rounded-xl hover:border-primary transition-colors flex items-center"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <ImagePlus className="w-5 h-5" />
              </div>
              <span className="font-semibold group-hover:text-primary transition-colors">
                Free AI Thumbnail Generators
              </span>
            </Link>
            <Link
              to="/blog/how-to-grow-youtube-channel-with-ai"
              className="group p-4 bg-muted/20 border rounded-xl hover:border-primary transition-colors flex items-center"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="font-semibold group-hover:text-primary transition-colors">
                Grow Your Channel with AI
              </span>
            </Link>
            <Link
              to="/blog/top-ai-video-editing-tools"
              className="group p-4 bg-muted/20 border rounded-xl hover:border-primary transition-colors flex items-center"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Layout className="w-5 h-5" />
              </div>
              <span className="font-semibold group-hover:text-primary transition-colors">
                Top AI Video Editing Tools
              </span>
            </Link>
            <Link
              to="/blog/ai-tools-for-students"
              className="group p-4 bg-muted/20 border rounded-xl hover:border-primary transition-colors flex items-center"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Globe className="w-5 h-5" />
              </div>
              <span className="font-semibold group-hover:text-primary transition-colors">
                AI Tools for Students
              </span>
            </Link>
            <Link
              to="/ai-script-generator"
              className="group p-4 bg-muted/20 border rounded-xl hover:border-primary transition-colors flex items-center"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-semibold group-hover:text-primary transition-colors">
                AI Script Generator
              </span>
            </Link>
          </div>

          <div className="text-center not-prose border-t pt-16 mt-8">
            <Button
              size="lg"
              className="rounded-full px-12 py-6 text-xl font-bold shadow-2xl hover:scale-105 transition-transform"
              onClick={() => scrollToSection("core-tools")}
            >
              Supercharge My Channel With AI Today
            </Button>
          </div>
        </div>
      </section>
      <section className="py-24 container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              WHAT CREATORS SAY
            </h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of creators using CreatorAI to grow.
            </p>
          </div>
          <div className="flex gap-4">
            <Dialog
              open={isReviewModalOpen}
              onOpenChange={setIsReviewModalOpen}
            >
              <DialogTrigger
                render={
                  <Button className="rounded-full px-8 h-12 font-bold">
                    <Plus className="w-5 h-5 mr-2" /> Write a Review
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Share your experience
                  </DialogTitle>
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
                              star <= newRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground",
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="comment"
                      className="text-base font-semibold"
                    >
                      Your Comment
                    </Label>
                    <Textarea
                      id="comment"
                      placeholder="How has CreatorAI helped you?"
                      className="min-h-[120px] text-base"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 text-lg font-bold"
                  >
                    Submit Review
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              className="rounded-full px-8 h-12 font-bold"
              onClick={() => setIsAllReviewsOpen(true)}
            >
              See All Reviews
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {(comments.length > 0
            ? comments.slice(0, 2)
            : [
                {
                  id: "fallback-1",
                  userName: "Alex Vance",
                  userAvatar:
                    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop",
                  rating: 5,
                  createdAt: Date.now() - 86400000 * 3,
                  text: "The YouTube Title Generator on CreatorAI completely changed my channel trajectory. My average CTR jumped from 4% to over 9% in two weeks. It's essentially free views.",
                  userId: "user1",
                },
                {
                  id: "fallback-2",
                  userName: "Sarah Jenkins",
                  userAvatar:
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
                  rating: 5,
                  createdAt: Date.now() - 86400000 * 5,
                  text: "I was spending hours agonizing over my shorts scripts to keep them under 60 seconds while still being engaging. This tool writes the perfect pacing in 5 seconds. Absolute lifesaver.",
                  userId: "user2",
                },
              ]
          ).map((comment) => (
            <Card
              key={comment.id}
              className="bg-muted/30 border-none shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {comment.userAvatar ? (
                        <img
                          src={comment.userAvatar}
                          alt={comment.userName}
                          className="h-full w-full object-cover"
                        />
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
                              i < comment.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/30",
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
                <p className="text-lg leading-relaxed italic">
                  "{comment.text}"
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* All Reviews Modal */}
        <Dialog open={isAllReviewsOpen} onOpenChange={setIsAllReviewsOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black tracking-tight">
                ALL REVIEWS
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-4 py-6 space-y-6">
              {comments.map((comment) => (
                <Card key={comment.id} className="bg-muted/30 border-none">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                          {comment.userAvatar ? (
                            <img
                              src={comment.userAvatar}
                              alt={comment.userName}
                              className="h-full w-full object-cover"
                            />
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
                                  i < comment.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground/30",
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
