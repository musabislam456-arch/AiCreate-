import fs from 'fs';

const filePath = 'src/lib/tools-data.ts';
let code = fs.readFileSync(filePath, 'utf-8');

const seoData = {
  'viral-hook-generator': {
    metaTitle: 'Viral Hook Generator AI Free | CreatorAI',
    metaDescription: 'Generate scroll-stopping, 3-second viral hooks for TikTok, YouTube Shorts, and Reels instantly for free.',
    seoContent: 'Our Free AI Viral Hook Generator is trained on thousands of viral shorts. The first 3 seconds are critical for viewer retention. Use this tool to grab attention immediately and improve your retention graphs.'
  },
  'shorts-script-generator': {
    metaTitle: 'YouTube Shorts Script Generator AI | CreatorAI',
    metaDescription: 'Write engaging 30-60 second YouTube Shorts and TikTok scripts with AI. Optimized for high audience retention.',
    seoContent: 'The YouTube Shorts Script Generator AI writes fast-paced, high value content for your audience. With clear visual cues and precise pacing, scripting for short-form has never been easier.'
  },
  'caption-generator': {
    metaTitle: 'Instagram & TikTok Caption Generator AI | CreatorAI',
    metaDescription: 'Create trendy, relatable captions for Instagram and TikTok with optimized hashtags and call-to-actions.',
    seoContent: 'Maximize your reach on social media. Our Caption Generator AI understands modern slang, knows how to drive comments, and structures your captions to include effective CTAs and hashtags.'
  },
  'hashtag-generator': {
    metaTitle: 'Smart Hashtag Generator for Instagram & TikTok | CreatorAI',
    metaDescription: 'Find the best niche, popular, and trending hashtags for your posts to maximize algorithmic discovery.',
    seoContent: 'Using the right hashtags can multiply your views. The Smart Hashtag Generator analyzes your topic to group hashtags into broad, niche, and trending categories, avoiding shadowbans.'
  },
  'video-idea-generator': {
    metaTitle: 'YouTube Video Idea Generator AI | CreatorAI',
    metaDescription: 'Never run out of content ideas. Generate unlimited, highly clickable video ideas for your specific niche.',
    seoContent: 'Struggling with what to film next? The Video Idea Generator brainstorms 10 highly viral video concepts based on proven YouTube formulas. Perfect for when you have creator block.'
  },
  'seo-title-generator': {
    metaTitle: 'YouTube Title Generator AI Free | Keyword Optimized | CreatorAI',
    metaDescription: 'Generate high-CTR, click-worthy YouTube titles that rank in search. 100% free AI title generator.',
    seoContent: 'A good thumbnail means nothing without a clickable title. Our YouTube Title Generator AI crafts titles that combine emotional triggers, curiosity, and high-search-volume keywords.'
  },
  'ai-rewrite-tool': {
    metaTitle: 'AI Script & Text Rewrite Tool for Creators | CreatorAI',
    metaDescription: 'Rewrite and optimize your YouTube scripts, descriptions, and posts to be more engaging and persuasive.',
    seoContent: 'Have a script that feels a bit boring? The AI Rewrite Tool enhances your phrasing to be more persuasive, improves your flow, and adds natural hooks to keep viewers watching.'
  },
  'faceless-video-script': {
    metaTitle: 'Faceless YouTube Video Script Generator | CreatorAI',
    metaDescription: 'Generate high-quality scripts for cash cow and faceless channels with B-roll visual cues included.',
    seoContent: 'Building a faceless YouTube channel requires tight scripting. This Faceless Video Script Generator provides voiceover text right alongside B-roll suggestions for easy editing.'
  },
  'bio-generator': {
    metaTitle: 'Social Media Bio Generator | Instagram & TikTok | CreatorAI',
    metaDescription: 'Generate a professional, optimized bio for Instagram, TikTok, and Twitter to convert profile visits.',
    seoContent: 'Your bio is your digital elevator pitch. Use the Social Media Bio Generator to create options ranging from highly professional to fun and emoji-heavy, maximizing your follower conversion rate.'
  },
  'comment-reply-generator': {
    metaTitle: 'YouTube Comment Reply Generator AI | CreatorAI',
    metaDescription: 'Reply to your YouTube comments 10x faster with AI-generated witty, appreciative, and engaging replies.',
    seoContent: 'Audience engagement is a key metric for YouTube growth. The Comment Reply Generator saves you hours by drafting perfect, human-like responses to your community, boosting viewer loyalty.'
  }
};

for (const [id, seo] of Object.entries(seoData)) {
  const metaAppends = `,\n    metaTitle: '${seo.metaTitle}',\n    metaDescription: '${seo.metaDescription}',\n    seoContent: '${seo.seoContent}'`;
  
  // Find the object with that id
  const regex = new RegExp(`(id:\\s*'${id}'[\\s\\S]*?supportsLanguage:\\s*(true|false))`);
  code = code.replace(regex, `$1${metaAppends}`);
}

fs.writeFileSync(filePath, code);
console.log('Updated tools-data.ts!');