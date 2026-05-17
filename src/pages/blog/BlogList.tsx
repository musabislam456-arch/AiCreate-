import { SEO } from '../../components/SEO';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';

export const BLOG_POSTS = [
  {
    id: 'best-ai-tools-youtubers-2026',
    slug: 'best-ai-tools-youtubers-2026',
    title: 'Top 10 Best Free AI Tools for YouTubers in 2026 (Ranked)',
    description: 'Discover the ultimate AI creator platforms and free AI tools that top YouTubers use to automate scripts, generate thumbnails, and maximize CTR.',
    date: '2026-05-18',
    author: 'CreatorMusab Team',
    readTime: '6 min read',
    category: 'YouTube SEO',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: 'ai-script-writer-viral-hooks',
    slug: 'ai-script-writer-viral-hooks',
    title: 'How to Write Viral TikTok Hooks Using an AI Script Generator',
    description: 'Learn the exact prompts and workflow to generate scroll-stopping TikTok and Instagram Reel scripts using our free AI creator assistant tools.',
    date: '2026-05-15',
    author: 'SEO Content Editor',
    readTime: '4 min read',
    category: 'Content Strategy',
    image: 'https://images.unsplash.com/photo-1616469829581-73993eb8ceaf?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: 'youtube-automation-ai-2026',
    slug: 'youtube-automation-ai-2026',
    title: 'The Complete Guide to YouTube Automation with AI Tools',
    description: 'A deep dive into building a faceless YouTube automation channel exclusively using free AI video editing and script writing tools in 2026.',
    date: '2026-05-10',
    author: 'Video Optimization Specialist',
    readTime: '8 min read',
    category: 'Automation',
    image: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: 'how-to-grow-youtube-channel-with-ai',
    slug: 'how-to-grow-youtube-channel-with-ai',
    title: 'How to Grow a YouTube Channel Fast with AI Tools',
    description: 'A complete step-by-step masterclass on implementing a full AI creator workflow from ideation to AEO tracking.',
    date: '2026-05-18',
    author: 'Growth Specialist',
    readTime: '15 min read',
    category: 'Strategy',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: 'top-ai-video-editing-tools',
    slug: 'top-ai-video-editing-tools',
    title: 'Top AI Video Editing Tools for Content Creators',
    description: 'Learn which AI video editors speed up production without sacrificing visual quality or retention rates.',
    date: '2026-05-18',
    author: 'Video Optimization Specialist',
    readTime: '7 min read',
    category: 'Video Editing',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: 'ai-tools-for-students',
    slug: 'ai-tools-for-students',
    title: '5 Life-Saving AI Tools for Students and Creators',
    description: 'Whether you are editing your first video project or studying visual arts, these free AI tools are essential.',
    date: '2026-05-17',
    author: 'Education Lead',
    readTime: '5 min read',
    category: 'Productivity',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: 'free-ai-thumbnail-generators',
    slug: 'free-ai-thumbnail-generators',
    title: 'The Best Free AI Thumbnail Generators Ranked',
    description: 'We test out the leading AI image models to see which one creates the highest CTR thumbnail designs.',
    date: '2026-05-16',
    author: 'SEO Content Editor',
    readTime: '9 min read',
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop'
  },
];

export function BlogList() {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      <SEO 
        title="Creator Blog | AI Tools, Tips & Strategies for YouTubers"
        description="Read the latest strategies, guides, and tutorials on how to grow your YouTube channel and social media presence using the best AI creator tools."
        keywords="ai tools blog, youtube automation guides, how to use ai script writers, ai video editing tips, creatorai blog"
        url="https://ai-create-pi.vercel.app/blog"
      />

      <section className="bg-muted/30 py-20 border-b">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <Badge className="mb-6 px-4 py-1.5" variant="secondary">Creator Intelligence Hub</Badge>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 text-balance">
            Master the Algorithm <br className="hidden md:block"/> with AI Automation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Actionable strategies, deep-dive tutorials, and the exact workflows top creators use to scale their channels using modern AI tools.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 max-w-5xl mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map(post => (
            <Link to={`/blog/${post.slug}`} key={post.id} className="group flex">
              <Card className="h-full w-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden border-border/50">
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <Badge className="absolute top-4 left-4 z-20 bg-primary/90 text-primary-foreground backdrop-blur-md">
                    {post.category}
                  </Badge>
                </div>
                <CardHeader className="flex-1 pb-4">
                  <div className="flex items-center text-xs text-muted-foreground mb-3 space-x-4">
                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> {new Date(post.date).toLocaleDateString()}</span>
                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {post.readTime}</span>
                  </div>
                  <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 mt-3 text-sm">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-0 pb-6 flex items-center text-sm font-semibold text-primary">
                  Read Article <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
