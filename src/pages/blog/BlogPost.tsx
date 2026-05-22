import { useParams, Navigate, Link } from 'react-router-dom';
import { SEO } from '../../components/SEO';
import { BLOG_POSTS } from './BlogList';
import { Badge } from '../../components/ui/badge';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // Generate dynamic Article JSON-LD schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "image": post.image,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "CreatorAI Musab",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ai-create-pi.vercel.app/favicon.svg"
      }
    },
    "datePublished": post.date,
    "dateModified": post.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://ai-create-pi.vercel.app/blog/${post.slug}`
    }
  };

  return (
    <article className="flex flex-col min-h-screen pb-24">
      <SEO 
        title={post.title}
        description={post.description}
        ogType="article"
        ogImage={post.image}
        url={`https://ai-create-pi.vercel.app/blog/${post.slug}`}
        schema={articleSchema}
      />
      
      <div className="bg-muted/20 border-b">
        <div className="container mx-auto px-4 max-w-4xl py-12 lg:py-20">
          <Link to="/blog" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </Link>
          
          <div className="space-y-6">
            <Badge variant="secondary" className="px-3 py-1 text-sm bg-primary/10 text-primary">{post.category}</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-balance leading-tight">
              {post.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed text-balance">
              {post.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t font-medium text-muted-foreground">
              <span className="flex items-center"><User className="w-5 h-5 mr-2 text-primary/70"/> {post.author}</span>
              <span className="flex items-center"><Calendar className="w-5 h-5 mr-2 text-primary/70"/> {new Date(post.date).toLocaleDateString()}</span>
              <span className="flex items-center"><Clock className="w-5 h-5 mr-2 text-primary/70"/> {post.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl mt-12">
        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden mb-16 shadow-2xl">
          <img src={post.image} alt={post.title} className="w-full h-auto object-cover border" />
        </div>

        {/* Content Body */}
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl">
          <ReactMarkdown>{(post as any).content || ''}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
