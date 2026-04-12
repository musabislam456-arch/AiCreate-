export const CORE_TOOLS = [
  {
    id: 'viral-hook-generator',
    title: 'Viral Hook Generator',
    description: 'Generate scroll-stopping hooks for your short-form videos.',
    icon: 'FishHook',
    category: 'Shorts & Reels',
    promptTemplate: 'Generate 5 highly engaging, viral hooks for a short-form video about: "{input}". The hooks should be designed to grab attention in the first 3 seconds. Make them punchy, intriguing, and tailored for TikTok/Reels/Shorts. Please provide the output in {language}.',
    supportsLanguage: true
  },
  {
    id: 'shorts-script-generator',
    title: 'YouTube Shorts Script',
    description: 'Write engaging 30-60 second scripts for YouTube Shorts.',
    icon: 'FileText',
    category: 'Shorts & Reels',
    promptTemplate: 'Write a highly engaging, fast-paced 60-second YouTube Shorts script about: "{input}". Include visual cues [in brackets], a strong hook, concise valuable body content, and a clear call to action at the end. Keep sentences short. Please provide the output in {language}.',
    supportsLanguage: true
  },
  {
    id: 'caption-generator',
    title: 'Caption Generator',
    description: 'Create engaging captions for Instagram and TikTok.',
    icon: 'Type',
    category: 'Social Media',
    promptTemplate: 'Write an engaging, trendy, and relatable caption for an Instagram/TikTok post about: "{input}". Include a hook, the main message, a call to action (like "save this" or "comment below"), and relevant emojis. Please provide the output in {language}.',
    supportsLanguage: true
  },
  {
    id: 'hashtag-generator',
    title: 'Smart Hashtag Generator',
    description: 'Find the best niche hashtags for maximum reach.',
    icon: 'Hash',
    category: 'SEO & Discovery',
    promptTemplate: 'Generate a strategic list of 30 hashtags for a social media post about: "{input}". Group them into: 1) Broad/Popular (10), 2) Niche/Specific (15), and 3) Trending/Community (5). Do not use banned hashtags. Please provide the output in {language}.',
    supportsLanguage: true
  },
  {
    id: 'video-idea-generator',
    title: 'Video Idea Generator',
    description: 'Never run out of content ideas for your channel.',
    icon: 'Lightbulb',
    category: 'Ideation',
    promptTemplate: 'Brainstorm 10 highly clickable and viral video ideas for a YouTube channel in the niche: "{input}". For each idea, provide a catchy title and a 1-sentence summary of the video concept. Please provide the output in {language}.',
    supportsLanguage: true
  },
  {
    id: 'seo-title-generator',
    title: 'SEO Title Generator',
    description: 'Generate high-CTR, search-optimized YouTube titles.',
    icon: 'Search',
    category: 'SEO & Discovery',
    promptTemplate: 'Generate 10 highly clickable, high-CTR YouTube titles for a video about: "{input}". The titles should evoke curiosity, urgency, or extreme value. Keep them under 60 characters for optimal display. Please provide the output in {language}.',
    supportsLanguage: true
  },
  {
    id: 'ai-rewrite-tool',
    title: 'AI Rewrite Tool',
    description: 'Rewrite your scripts or descriptions to be more engaging.',
    icon: 'PenTool',
    category: 'Writing',
    promptTemplate: 'Rewrite the following text to make it highly engaging, persuasive, and optimized for a social media audience. Improve the flow, fix any grammar issues, and make it sound natural and exciting: "{input}". Please provide the output in {language}.',
    supportsLanguage: true
  },
  {
    id: 'faceless-video-script',
    title: 'Faceless Video Script',
    description: 'Generate scripts perfectly formatted for faceless channels.',
    icon: 'Ghost',
    category: 'YouTube Long-form',
    promptTemplate: 'Write a script for a faceless YouTube video about: "{input}". Format it with two columns (or clear sections): "Visual/B-Roll" and "Voiceover". Ensure the pacing is good for a 5-8 minute video, with a strong intro and engaging storytelling. Please provide the output in {language}.',
    supportsLanguage: true
  },
  {
    id: 'bio-generator',
    title: 'Social Media Bio Generator',
    description: 'Create a professional, optimized bio for your profiles.',
    icon: 'UserCircle',
    category: 'Social Media',
    promptTemplate: 'Write 3 different options for a social media bio (Instagram/TikTok/Twitter) for a creator focused on: "{input}". Option 1: Professional & Clean. Option 2: Fun & Emoji-heavy. Option 3: Short & Punchy. Include a placeholder for a link. Please provide the output in {language}.',
    supportsLanguage: true
  },
  {
    id: 'comment-reply-generator',
    title: 'Comment Reply Generator',
    description: 'Generate smart, engaging replies to your audience.',
    icon: 'MessageSquare',
    category: 'Community',
    promptTemplate: 'Generate 3 different engaging and polite replies to the following comment from a viewer: "{input}". Option 1: Appreciative and warm. Option 2: Funny/Witty. Option 3: Asking a follow-up question to boost engagement. Please provide the output in {language}.',
    supportsLanguage: true
  },
  {
    id: 'thumbnail-generator',
    title: 'Free Thumbnail Generator',
    description: 'Generate custom, high-quality thumbnails for your videos instantly.',
    icon: 'ImagePlus',
    category: 'Design',
    promptTemplate: 'You are an expert YouTube thumbnail designer. The user wants a thumbnail for a video about: "{input}". Write 3 concise, highly descriptive image generation prompts (max 50 words each) that describe the visual elements, lighting, and style. The first prompt should be the main concept, and the next two should be alternative recommended concepts. Separate the 3 prompts exactly with the string "|||". DO NOT include text overlays in the prompt. Output ONLY the 3 prompts separated by "|||", nothing else.',
    supportsLanguage: false
  },
  {
    id: 'content-multiplier',
    title: 'Content Multiplier',
    description: 'Turn one YouTube script into TikToks, Twitter threads, LinkedIn posts, and Instagram carousels.',
    icon: 'Share2',
    category: 'Writing',
    promptTemplate: 'Act as an expert content repurposer. Take the following YouTube video script/concept and repurpose it into:\n1) 3 short, punchy TikTok/Shorts scripts.\n2) A 5-part engaging Twitter/X thread.\n3) A professional LinkedIn post.\n4) An Instagram carousel outline (slide by slide).\n\nScript: "{input}". Please provide the output in {language}.',
    supportsLanguage: true
  },
  {
    id: 'sponsorship-pitch',
    title: 'Sponsorship Pitch Generator',
    description: 'Generate professional cold-email pitches to secure brand deals.',
    icon: 'Briefcase',
    category: 'Monetization',
    promptTemplate: 'Write a highly professional and persuasive cold-email pitch to a brand for a YouTube sponsorship. Details: {input}. Include a catchy subject line, a brief introduction of the channel, why the audience aligns with the brand, 2 proposed integration ideas, and a call to action to discuss rates. Make it sound natural, not overly robotic. Please provide the output in {language}.',
    supportsLanguage: true
  },
  {
    id: 'retention-predictor',
    title: 'Retention Drop-off Predictor',
    description: 'AI analyzes your script to find boring parts and rewrites them to keep viewers hooked.',
    icon: 'TrendingDown',
    category: 'Analysis',
    promptTemplate: 'Act as a harsh YouTube retention expert. Analyze the following script for potential viewer drop-off points (boring sections, slow pacing, confusing parts).\n1) Quote the exact sentences that are weak.\n2) Explain WHY viewers will click away.\n3) Rewrite those specific sections to be highly engaging, fast-paced, and curiosity-driven.\n\nScript: "{input}". Please provide the output in {language}.',
    supportsLanguage: true
  },
  {
    id: 'broll-generator',
    title: 'B-Roll & Shot List Generator',
    description: 'Generate a complete, timestamped table of B-roll shots and sound effects for your script.',
    icon: 'Film',
    category: 'Production',
    promptTemplate: 'Act as a professional video director. Read the following script and generate a comprehensive Shot List and B-Roll guide. Format it as a clear markdown table with columns: "Spoken Line", "Suggested B-roll/Visuals", and "Suggested SFX/Text Pop-ups".\n\nScript: "{input}". Please provide the output in {language}.',
    supportsLanguage: true
  },
  {
    id: 'community-strategist',
    title: 'Community Tab Strategist',
    description: 'Generate 7 days of highly engaging Community Tab posts to boost channel activity.',
    icon: 'MessageCircle',
    category: 'Community',
    promptTemplate: 'Act as a YouTube audience engagement expert. Create a 7-day YouTube Community Tab content calendar for a channel about: "{input}". Include a mix of: 1) Engaging Polls (with options). 2) Behind-the-scenes teasers. 3) Questions to the audience. 4) GIF/Image ideas. Make them highly interactive to maximize likes and comments. Please provide the output in {language}.',
    supportsLanguage: true
  },
  {
    id: 'trend-adapter',
    title: 'Viral Trend Adapter',
    description: 'Adapt funny or viral trends to fit your specific educational or niche channel.',
    icon: 'TrendingUp',
    category: 'Ideation',
    promptTemplate: 'Act as a viral TikTok/Shorts strategist. The user wants to adapt a current trend for their specific niche. Details: {input}. Generate 5 unique, creative ways to use this trend/audio so it makes sense for their audience while remaining funny and engaging. Describe the visual action and the text on screen for each idea. Please provide the output in {language}.',
    supportsLanguage: true
  },
  {
    id: 'content-scheduler',
    title: 'Smart Content Scheduler',
    description: 'Generate a data-driven content schedule tailored to your niche and audience.',
    icon: 'CalendarDays',
    category: 'Strategy',
    promptTemplate: 'Act as an expert YouTube strategist and content planner. Create a highly optimized content schedule based on these details:\n{input}\n\nCRITICAL INSTRUCTIONS:\n1. If a URL is provided, use Google Search to analyze the channel/content to tailor the schedule.\n2. Provide a premium, structured schedule for the requested duration.\n3. For each planned upload, include: A highly clickable Title, a brief outline/detail of the content, and the BEST suggested time to upload based on the target country and audience.\n4. Make the strategy cohesive and designed for maximum growth.\n\nPlease provide the output in {language}.',
    supportsLanguage: true
  }
];

export const ADVANCED_TOOLS = [
  {
    id: 'thumbnail-ab-testing',
    title: 'Thumbnail A/B Testing',
    description: 'AI analyzes your thumbnails and predicts the best performer.',
    icon: 'Image',
    category: 'Advanced',
    supportsLanguage: true
  },
  {
    id: 'competitor-analysis',
    title: 'Competitor Analyzer',
    description: 'Analyze competitor content strategy and find content gaps.',
    icon: 'Target',
    category: 'Advanced',
    supportsLanguage: true
  },
  {
    id: 'channel-analyzer',
    title: 'Channel Analyzer',
    description: 'Analyze your channel stats or URL and get improvement suggestions.',
    icon: 'BarChart2',
    category: 'Advanced',
    supportsLanguage: true
  },
  {
    id: 'metadata-generator',
    title: 'Full Metadata Generator',
    description: 'Generate Title, Description, Tags, and Thumbnail ideas in one click.',
    icon: 'Layers',
    category: 'Advanced',
    supportsLanguage: true
  },
  {
    id: 'script-to-visuals',
    title: 'Script to Visuals',
    description: 'Turn your script into visual prompts with voiceover.',
    icon: 'Video',
    category: 'Advanced',
    supportsLanguage: true
  },
  {
    id: 'advanced-script-writer',
    title: 'Pro Script Writer',
    description: 'Generate highly engaging scripts with custom categories, types, and exact durations.',
    icon: 'PenTool',
    category: 'Advanced',
    supportsLanguage: true
  }
];
