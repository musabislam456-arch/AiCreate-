import { SEO } from '../components/SEO';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Sparkles, Terminal, Shield, Award } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      <SEO 
        title="About Us | CreatorAI"
        description="Learn more about CreatorAI, a free AI-powered productivity suite for content creators, built by Musab Umair."
      />
      <div className="container mx-auto px-4 max-w-4xl py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 text-sm px-4 py-1" variant="secondary">Established: May 25, 2026</Badge>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">About CreatorAI</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our mission and how we empower everyday creators to scale their content using advanced machine learning.
          </p>
        </div>
        
        <div className="prose prose-lg dark:prose-invert max-w-none mb-16 space-y-6">
          <h2>Our Origin and Mission</h2>
          <p className="text-lg leading-relaxed">
            CreatorAI was founded on a simple premise: advanced artificial intelligence shouldn't only belong to massive media conglomerates or corporate agencies with multi-million dollar marketing budgets. 
          </p>
          <p>
            The modern digital landscape is shifting rapidly. In 2026, algorithmic pacing, search discovery, and retention physics dictate success. Independent YouTubers, TikTokers, scriptwriters, and digital publishers bear the heavy burden of constant production, often leading to creator burnout.
          </p>
          <p>
            To address this challenge, CreatorAI was built by <strong>Musab Umair</strong>. Musab, an experienced software engineer and content ecosystem strategist, set out to develop a robust, free, and completely web-native intelligence suite. The goal was to provide high-quality AI-powered tools that help creators design, draft, optimize, and organize their creative workflow seamlessly.
          </p>
        </div>

        <h2 className="text-3xl font-black tracking-tight mb-8">Core Pillars of CreatorAI</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Card className="border border-border/60 bg-muted/20">
            <CardContent className="p-6 flex gap-4">
              <Sparkles className="w-8 h-8 text-primary shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">Algorithmic Alignment</h3>
                <p className="text-sm text-muted-foreground">Every prompt, input parser, and AI template on our platform is customized to optimize metrics like CTR (Click-Through Rate) and AVD (Average View Duration).</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-muted/20">
            <CardContent className="p-6 flex gap-4">
              <Terminal className="w-8 h-8 text-primary shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">Open Ecosystem</h3>
                <p className="text-sm text-muted-foreground">We believe in making high-quality tools accessible without subscription paywalls or hidden credits, giving every creator an equal chance to compete globally.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-muted/20">
            <CardContent className="p-6 flex gap-4">
              <Shield className="w-8 h-8 text-primary shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">E-E-A-T and Search Authority</h3>
                <p className="text-sm text-muted-foreground">We build trustworthy utilities anchored in real-world SEO and semantic entities, conforming strictly to the highest search quality evaluator standards.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-muted/20">
            <CardContent className="p-6 flex gap-4">
              <Award className="w-8 h-8 text-primary shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">Built for Performance</h3>
                <p className="text-sm text-muted-foreground">Super-fast client performance, offline-ready state retention, and robust server-side processing mean minimal lag between brainstorming and posting.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-3xl font-black mb-6">Meet the Founder</h2>
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 mb-16">
          <p>
            Hi, I'm <strong>Musab Umair</strong>. I'm a software developer and content strategist who got tired of seeing new creators get priced out of the modern workflow. 
          </p>
          <p>
            I designed CreatorAI from the ground up to stand on values of transparency, high technical design, and utility. By prioritizing clean layouts, fast load times, and semantic code architectures, CreatorAI serves both search engines and human creators optimally. My goal isn't just to build another AI wrapper; it's to build a genuine, reliable workspace that you can use every single day.
          </p>
          <p>
            "Success in content creation shouldn't be limited by how many paid tools you can afford," states Musab. "It should be limited only by your imagination and consistency."
          </p>
          <p>
            If you ever need help, have a feature request, or just want to talk about the YouTube algorithm, you can reach me directly at <a href="mailto:themusabumairs@gmail.com">themusabumairs@gmail.com</a>.
          </p>
        </div>

        <h2 className="text-3xl font-black mb-6">AI Transparency Disclosure</h2>
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
          <p>
            We believe in honest technology. <strong>CreatorAI uses large language models (LLMs) and advanced machine learning APIs to provide intelligent suggestions.</strong> 
          </p>
          <p>
            While our tools generate highly optimized scripts, titles, and hooks, AI can occasionally hallucinate or generate generic content. We strictly advise all creators to use our tools as <em>assistants</em>, not replacements for human creativity. Always review, fact-check, and inject your own authentic voice into any generated content before publishing.
          </p>
        </div>

        <div className="mt-16 text-center border-t border-border/50 pt-10">
          <p className="text-muted-foreground mb-4">Want to reach out or suggest a custom tool addition?</p>
          <a href="mailto:support@creatorai.com" className="text-primary font-bold hover:underline">
            Contact Support &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
