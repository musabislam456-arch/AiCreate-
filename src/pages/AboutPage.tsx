import { SEO } from '../components/SEO';
import { Card, CardContent } from '../components/ui/card';

export function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      <SEO 
        title="About Us | CreatorAI"
        description="Learn more about the team behind CreatorAI and our mission to empower creators with free AI tools."
      />
      <div className="container mx-auto px-4 max-w-4xl py-20">
        <h1 className="text-5xl font-black mb-8">About CreatorAI</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <p className="lead">
            CreatorAI was built on a simple premise: advanced artificial intelligence shouldn't only belong to massive media companies and agencies with deep pockets.
          </p>
          <p>
            The creator economy is shifting, and the barrier to producing high-quality content is increasing. We saw independent YouTubers, TikTokers, and digital artists struggling to keep up with the pacing and algorithmic demands of modern platforms. 
          </p>
        </div>

        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
        <Card className="bg-primary/5 border-primary/20 mb-12">
          <CardContent className="p-8">
            <p className="text-xl italic font-medium m-0">
              "To democratize access to powerful generative tools, allowing individual creators to compete on a planetary scale without burning out."
            </p>
          </CardContent>
        </Card>

        <h2 className="text-3xl font-bold mb-6">Why We Built This</h2>
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <p>
            We are a team of former creators, video editors, and software engineers who experienced the burnout firsthand. Hours spent designing thumbnails, tweaking scripts to hit the 10-minute mark perfectly, and stressing over click-through rates.
          </p>
          <p>
            When generative AI began to emerge, we quickly realized its potential. However, most AI tools were generic—good for writing corporate emails, but terrible at writing a high-retention YouTube hook. That's why we built CreatorAI specifically for the creator workflow. Every prompt, model, and tool on this site is fine-tuned to understand the metrics that matter: CTR, AVD, and algorithmic alignment.
          </p>
        </div>

        <h2 className="text-3xl font-bold mb-6">Built for the Future</h2>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            As search engines evolve into Answer Engines and social feeds become entirely algorithm-driven, semantic structuring and massive A/B testing will become the standard. We are constantly updating CreatorAI to utilize the latest models so you never fall behind the algorithm.
          </p>
          <p>
            Whether you are making your first short film for class or running a network of automation channels, CreatorAI is your back-office team.
          </p>
        </div>
      </div>
    </div>
  );
}
