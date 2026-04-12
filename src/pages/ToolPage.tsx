import { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { CORE_TOOLS } from '../lib/tools-data';
import { generateContent, generateContentWithSearch, textToSpeech, AIModel } from '../lib/gemini';
import { useAppStore } from '../lib/store';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2, Copy, CheckCircle2, MessageSquare, ArrowLeft, ImagePlus, Download, Share2, Briefcase, TrendingDown, Film, MessageCircle, TrendingUp, CalendarDays, RefreshCw, Cpu, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { MicButton } from '../components/MicButton';
import { ModelSelector } from '../components/ModelSelector';

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Hindi", 
  "Arabic", "Portuguese", "Urdu", "Mandarin", "Japanese", 
  "Russian", "Bengali", "Indonesian", "Korean", "Italian"
];

export function ToolPage() {
  const { id } = useParams<{ id: string }>();
  const tool = CORE_TOOLS.find(t => t.id === id);
  const navigate = useNavigate();
  
  const { user, comments, addComment, addHistory } = useAppStore();
  const [input, setInput] = useState('');
  const [extraInput1, setExtraInput1] = useState('');
  const [extraInput2, setExtraInput2] = useState('');
  const [language, setLanguage] = useState('English');
  const [selectedAIModel, setSelectedAIModel] = useState<AIModel>('Auto');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  // Thumbnail Generator specific states
  const [progress, setProgress] = useState(0);
  const [resolution, setResolution] = useState('1920x1080');
  const [aiModel, setAiModel] = useState('flux');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailPrompt, setThumbnailPrompt] = useState('');
  const [recommendedUrls, setRecommendedUrls] = useState<string[]>([]);
  const [recommendedPrompts, setRecommendedPrompts] = useState<string[]>([]);

  // Content Scheduler specific states
  const [scheduleCategory, setScheduleCategory] = useState('Gaming');
  const [customScheduleCategory, setCustomScheduleCategory] = useState('');
  const [scheduleCountry, setScheduleCountry] = useState('United States');
  const [scheduleUrl, setScheduleUrl] = useState('');
  const [scheduleDuration, setScheduleDuration] = useState('1 Week');
  const [customDurationValue, setCustomDurationValue] = useState('14');
  const [customDurationUnit, setCustomDurationUnit] = useState('Days');

  if (!tool) {
    return <Navigate to="/" replace />;
  }

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error('Please fill in the required fields.');
      return;
    }

    setIsLoading(true);
    setOutput('');
    setThumbnailUrl('');
    setProgress(0);
    
    try {
      let finalInput = input;
      if (tool.id === 'seo-title-generator') finalInput = `Keyword: ${extraInput1}\nContext: ${input}`;
      if (tool.id === 'viral-hook-generator') finalInput = `Topic: ${input}\nTone: ${extraInput1 || 'Engaging'}`;
      if (tool.id === 'shorts-script-generator') finalInput = `Concept: ${input}\nTarget Audience: ${extraInput1}`;
      if (tool.id === 'ai-rewrite-tool') finalInput = `Original Script: ${input}\nGoal: ${extraInput1 || 'More engaging'}`;
      if (tool.id === 'thumbnail-generator') finalInput = `Video Title/Topic: ${input}\nStyle: ${extraInput1 || 'Cinematic'}`;
      if (tool.id === 'sponsorship-pitch') finalInput = `Channel/Niche: ${extraInput1}\nAudience Size: ${extraInput2}\nTarget Brand: ${input}`;
      if (tool.id === 'trend-adapter') finalInput = `Channel Niche: ${extraInput1}\nTrend/Audio: ${input}`;
      if (tool.id === 'content-scheduler') {
        const finalCategory = scheduleCategory === 'Custom' ? customScheduleCategory : scheduleCategory;
        const finalDuration = scheduleDuration === 'Custom' ? `${customDurationValue} ${customDurationUnit}` : scheduleDuration;
        finalInput = `Category: ${finalCategory}\nTarget Country: ${scheduleCountry}\nDuration: ${finalDuration}\nChannel URL: ${scheduleUrl || 'None provided'}\nChannel Details & Audience: ${input}`;
      }

      let prompt = tool.promptTemplate.replace('{input}', finalInput);
      if (tool.supportsLanguage) {
        prompt = prompt.replace('{language}', language);
      }
      
      let result;
      if (tool.id === 'content-scheduler') {
        result = await generateContentWithSearch(prompt, selectedAIModel);
      } else {
        result = await generateContent(prompt, selectedAIModel);
      }
      
      if (tool.id === 'thumbnail-generator') {
        const prompts = result.split('|||').map(p => p.trim()).filter(p => p);
        const mainPrompt = prompts[0] || result;
        const altPrompts = prompts.slice(1, 3);
        
        setThumbnailPrompt(mainPrompt);
        setRecommendedPrompts(altPrompts);
        
        const [width, height] = resolution.split('x');
        
        const createImageUrl = (p: string) => {
          const seed = Math.floor(Math.random() * 1000000);
          const actualModel = aiModel === 'anima-banna' ? 'animagine' : aiModel;
          return `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=${width}&height=${height}&nologo=true&model=${actualModel}&seed=${seed}`;
        };

        const mainUrl = createImageUrl(mainPrompt);
        const altUrls = altPrompts.map(p => createImageUrl(p));
        
        // Simulate progress while image loads
        let currentProgress = 0;
        const progressInterval = setInterval(() => {
          currentProgress += 5;
          if (currentProgress <= 90) {
            setProgress(currentProgress);
          }
        }, 300);

        const loadImageWithRetry = async (url: string, retries = 3) => {
          for (let i = 0; i < retries; i++) {
            try {
              await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(true);
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = url;
              });
              return url;
            } catch (err) {
              if (i === retries - 1) {
                console.warn('Image load failed after retries:', url);
                return url; // Return anyway so it shows broken image instead of crashing the whole app
              }
              await new Promise(r => setTimeout(r, 1000));
            }
          }
          return url;
        };

        // Preload main image
        await loadImageWithRetry(mainUrl);
        
        clearInterval(progressInterval);
        setProgress(100);

        setThumbnailUrl(mainUrl);
        setRecommendedUrls(altUrls);
        
        result = `### Generated Thumbnail\n\n**Main Prompt Used:** ${mainPrompt}`;
      }
      
      setOutput(result);
      addHistory(tool.id, finalInput, result);
      toast.success('Content generated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate content.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setIsCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRead = async () => {
    if (!output) return;
    try {
      toast.info('Loading audio...');
      await textToSpeech(output);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    addComment(commentText);
    setCommentText('');
    toast.success('Comment added!');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 -ml-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{tool.title}</h1>
        <p className="text-muted-foreground text-lg">{tool.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Input Section */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>What is your content about?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tool.supportsLanguage && (
                <div className="space-y-2">
                  <Label>Output Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map(lang => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <ModelSelector value={selectedAIModel} onChange={setSelectedAIModel} />
            </div>

            {/* Unique Interfaces per Tool */}
            {tool.id === 'seo-title-generator' && (
              <div className="space-y-2">
                <Label>Main Keyword</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="E.g., YouTube Algorithm 2026" 
                    value={extraInput1}
                    onChange={(e) => setExtraInput1(e.target.value)}
                  />
                  <MicButton onTranscript={(text) => setExtraInput1(prev => prev + (prev ? ' ' : '') + text)} />
                </div>
              </div>
            )}

            {tool.id === 'viral-hook-generator' && (
              <div className="space-y-2">
                <Label>Hook Tone</Label>
                <Select value={extraInput1} onValueChange={setExtraInput1}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Funny">Funny</SelectItem>
                    <SelectItem value="Shocking">Shocking</SelectItem>
                    <SelectItem value="Educational">Educational</SelectItem>
                    <SelectItem value="Story-driven">Story-driven</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {tool.id === 'shorts-script-generator' && (
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="E.g., Teenagers, Tech Enthusiasts, Beginners..." 
                    value={extraInput1}
                    onChange={(e) => setExtraInput1(e.target.value)}
                  />
                  <MicButton onTranscript={(text) => setExtraInput1(prev => prev + (prev ? ' ' : '') + text)} />
                </div>
              </div>
            )}

            {tool.id === 'ai-rewrite-tool' && (
              <div className="space-y-2">
                <Label>Rewrite Goal</Label>
                <Select value={extraInput1} onValueChange={setExtraInput1}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="More engaging">More engaging</SelectItem>
                    <SelectItem value="Shorter and punchier">Shorter and punchier</SelectItem>
                    <SelectItem value="Funnier">Funnier</SelectItem>
                    <SelectItem value="More professional">More professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {tool.id === 'thumbnail-generator' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 space-y-0">
                <div className="space-y-2">
                  <Label>Thumbnail Style</Label>
                  <Select value={extraInput1} onValueChange={setExtraInput1}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cinematic">Cinematic</SelectItem>
                      <SelectItem value="Cartoon/Anime">Cartoon/Anime</SelectItem>
                      <SelectItem value="Minimalist">Minimalist</SelectItem>
                      <SelectItem value="Hyper-realistic">Hyper-realistic</SelectItem>
                      <SelectItem value="Neon/Cyberpunk">Neon/Cyberpunk</SelectItem>
                      <SelectItem value="3D Render">3D Render</SelectItem>
                      <SelectItem value="Vlogging">Vlogging</SelectItem>
                      <SelectItem value="Gaming">Gaming</SelectItem>
                      <SelectItem value="Tech Review">Tech Review</SelectItem>
                      <SelectItem value="Reaction">Reaction</SelectItem>
                      <SelectItem value="Watercolor">Watercolor</SelectItem>
                      <SelectItem value="Sketch">Sketch</SelectItem>
                      <SelectItem value="Podcast">Podcast</SelectItem>
                      <SelectItem value="Tutorial">Tutorial</SelectItem>
                      <SelectItem value="Crypto/Finance">Crypto/Finance</SelectItem>
                      <SelectItem value="Fitness">Fitness</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Food/Cooking">Food/Cooking</SelectItem>
                      <SelectItem value="ASMR">ASMR</SelectItem>
                      <SelectItem value="Storytime">Storytime</SelectItem>
                      <SelectItem value="Beauty/Makeup">Beauty/Makeup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>AI Model</Label>
                  <Select value={aiModel} onValueChange={setAiModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flux">Flux (High Quality)</SelectItem>
                      <SelectItem value="anima-banna">Anima-Banna (Anime)</SelectItem>
                      <SelectItem value="turbo">Turbo (Fast)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Resolution / Quality</Label>
                  <Select value={resolution} onValueChange={setResolution}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Resolution" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1280x720">720p (HD)</SelectItem>
                      <SelectItem value="1920x1080">1080p (FHD)</SelectItem>
                      <SelectItem value="3840x2160">4K (UHD)</SelectItem>
                      <SelectItem value="7680x4320">8K (Max Quality)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {tool.id === 'sponsorship-pitch' && (
              <>
                <div className="space-y-2">
                  <Label>Channel Name & Niche</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="E.g., TechReviewer (Consumer Tech)" 
                      value={extraInput1}
                      onChange={(e) => setExtraInput1(e.target.value)}
                    />
                    <MicButton onTranscript={(text) => setExtraInput1(prev => prev + (prev ? ' ' : '') + text)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Audience Size / Avg Views</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="E.g., 50k subs, 10k avg views" 
                      value={extraInput2}
                      onChange={(e) => setExtraInput2(e.target.value)}
                    />
                    <MicButton onTranscript={(text) => setExtraInput2(prev => prev + (prev ? ' ' : '') + text)} />
                  </div>
                </div>
              </>
            )}

            {tool.id === 'trend-adapter' && (
              <div className="space-y-2">
                <Label>Your Channel Niche</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="E.g., Personal Finance for Beginners" 
                    value={extraInput1}
                    onChange={(e) => setExtraInput1(e.target.value)}
                  />
                  <MicButton onTranscript={(text) => setExtraInput1(prev => prev + (prev ? ' ' : '') + text)} />
                </div>
              </div>
            )}

            {tool.id === 'content-scheduler' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Channel Category</Label>
                    <Select value={scheduleCategory} onValueChange={setScheduleCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gaming">Gaming</SelectItem>
                        <SelectItem value="Tech & Gadgets">Tech & Gadgets</SelectItem>
                        <SelectItem value="Vlogging & Lifestyle">Vlogging & Lifestyle</SelectItem>
                        <SelectItem value="Education & How-to">Education & How-to</SelectItem>
                        <SelectItem value="Finance & Crypto">Finance & Crypto</SelectItem>
                        <SelectItem value="Fitness & Health">Fitness & Health</SelectItem>
                        <SelectItem value="Beauty & Fashion">Beauty & Fashion</SelectItem>
                        <SelectItem value="Entertainment & Comedy">Entertainment & Comedy</SelectItem>
                        <SelectItem value="Food & Cooking">Food & Cooking</SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Custom">Custom (Type your own)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {scheduleCategory === 'Custom' && (
                    <div className="space-y-2">
                      <Label>Custom Category</Label>
                      <Input 
                        placeholder="E.g., Woodworking, ASMR..." 
                        value={customScheduleCategory}
                        onChange={(e) => setCustomScheduleCategory(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Target Country / Audience Location</Label>
                    <Select value={scheduleCountry} onValueChange={setScheduleCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="Global / Worldwide">Global / Worldwide</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Schedule Duration</Label>
                    <Select value={scheduleDuration} onValueChange={setScheduleDuration}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3 Days">3 Days</SelectItem>
                        <SelectItem value="4 Days">4 Days</SelectItem>
                        <SelectItem value="5 Days">5 Days</SelectItem>
                        <SelectItem value="6 Days">6 Days</SelectItem>
                        <SelectItem value="1 Week">1 Week</SelectItem>
                        <SelectItem value="1 Month">1 Month</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {scheduleDuration === 'Custom' && (
                    <div className="space-y-2">
                      <Label>Custom Duration (Max 1 Month)</Label>
                      <div className="flex gap-2">
                        <Input 
                          type="number"
                          min="1"
                          max="31"
                          value={customDurationValue}
                          onChange={(e) => setCustomDurationValue(e.target.value)}
                          className="w-20"
                        />
                        <Select value={customDurationUnit} onValueChange={setCustomDurationUnit}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Days">Days</SelectItem>
                            <SelectItem value="Weeks">Weeks</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Channel URL (Optional - For AI Analysis)</Label>
                  <Input 
                    placeholder="https://youtube.com/@yourchannel" 
                    value={scheduleUrl}
                    onChange={(e) => setScheduleUrl(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>
                {tool.id === 'ai-rewrite-tool' ? 'Add your Script' : 
                 tool.id === 'caption-generator' ? 'Video/Image Description' :
                 tool.id === 'seo-title-generator' ? 'Video Context' :
                 tool.id === 'shorts-script-generator' ? 'Short Concept' :
                 tool.id === 'thumbnail-generator' ? 'Video Title / Topic' :
                 tool.id === 'sponsorship-pitch' ? 'Target Brand & Product' :
                 tool.id === 'trend-adapter' ? 'Describe the Trend or Audio' :
                 tool.id === 'content-scheduler' ? 'Channel Details & Audience Info' :
                 tool.id === 'content-multiplier' || tool.id === 'retention-predictor' || tool.id === 'broll-generator' ? 'Paste your Script' :
                 'Topic / Context'}
              </Label>
              <div className="relative">
                <Textarea 
                  placeholder={
                    tool.id === 'ai-rewrite-tool' ? "Paste the script you want to rewrite..." :
                    tool.id === 'caption-generator' ? "Describe what happens in your video or image..." :
                    tool.id === 'thumbnail-generator' ? "E.g., How to build a custom PC in 2026..." :
                    tool.id === 'sponsorship-pitch' ? "E.g., NordVPN, promoting their new threat protection feature..." :
                    tool.id === 'trend-adapter' ? "E.g., The 'Of course I'm a...' trend..." :
                    tool.id === 'content-scheduler' ? "Describe your channel, past videos, target audience, and goals..." :
                    tool.id === 'content-multiplier' || tool.id === 'retention-predictor' || tool.id === 'broll-generator' ? "Paste your full video script here..." :
                    "E.g., A video about 5 tips for beginner photographers..."
                  }
                  className="min-h-[200px] resize-none pb-10"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <div className="absolute bottom-2 right-2">
                  <MicButton onTranscript={(text) => setInput(prev => prev + (prev ? ' ' : '') + text)} />
                </div>
              </div>
            </div>

            {tool.id === 'caption-generator' && (
              <div className="space-y-2">
                <Label>Upload Video/Image (Optional Context)</Label>
                <Input type="file" accept="video/*,image/*" />
                <p className="text-xs text-muted-foreground">Upload media to help you remember the context.</p>
              </div>
            )}

            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleGenerate}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Content'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>Result</CardTitle>
              <CardDescription>Your AI-generated content</CardDescription>
            </div>
            {output && (
              <div className="flex space-x-2">
                {tool.id === 'content-scheduler' && (
                  <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Reschedule
                  </Button>
                )}
                {tool.id === 'shorts-script-generator' && (
                  <Button variant="outline" size="sm" onClick={() => {
                    const scriptOnly = output
                      .replace(/\[.*?\]/g, '') // Remove brackets and contents (visual cues, timestamps)
                      .replace(/^#+\s+.*$/gm, '') // Remove markdown headers
                      .replace(/\*\*.*?\*\*/g, (match) => match.replace(/\*\*/g, '')) // Remove bold markers but keep text
                      .replace(/\*/g, '') // Remove italics
                      .replace(/^(Visual|Voiceover|Audio|B-Roll).*?:/gim, '') // Remove column headers
                      .replace(/^\s*[\r\n]/gm, '\n') // Remove extra empty lines
                      .trim();
                    navigator.clipboard.writeText(scriptOnly);
                    toast.success('Script only copied!');
                  }}>
                    Copy Script Only
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {isCopied ? <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {tool.id === 'caption-generator' ? 'Ready to Copy' : 'Copy All'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleRead}>
                  <Volume2 className="h-4 w-4 mr-2" />
                  Read
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1">
            {isLoading && tool.id === 'thumbnail-generator' ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center space-y-6">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle className="text-muted stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                    <circle 
                      className="text-primary stroke-current transition-all duration-300 ease-in-out" 
                      strokeWidth="8" 
                      strokeLinecap="round" 
                      cx="50" cy="50" r="40" 
                      fill="transparent" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={251.2 - (251.2 * progress) / 100}
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">{progress}%</div>
                </div>
                <p className="text-muted-foreground animate-pulse">Generating your masterpiece...</p>
              </div>
            ) : output ? (
              <div className="bg-muted/50 rounded-lg p-4 h-full min-h-[200px] overflow-y-auto prose prose-sm dark:prose-invert max-w-none">
                {tool.id === 'thumbnail-generator' && thumbnailUrl && (
                  <div className="mb-6 space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold border-b pb-2">Main Thumbnail</h3>
                      <img src={thumbnailUrl} alt="Generated Thumbnail" className="w-full rounded-lg shadow-md" />
                      
                      <div className="flex flex-col sm:flex-row items-center gap-4 bg-background p-4 rounded-lg border">
                        <Button 
                          className="w-full" 
                          onClick={async () => {
                            try {
                              const response = await fetch(thumbnailUrl);
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.style.display = 'none';
                              a.href = url;
                              a.download = `thumbnail-${resolution}.jpg`;
                              document.body.appendChild(a);
                              a.click();
                              window.URL.revokeObjectURL(url);
                              toast.success('Download started!');
                            } catch (err) {
                              toast.error('Failed to download image. Try right-clicking to save.');
                            }
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Main Thumbnail
                        </Button>
                      </div>
                    </div>

                    {recommendedUrls.length > 0 && (
                      <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-xl font-bold">Recommended Alternatives</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {recommendedUrls.map((url, idx) => (
                            <div key={idx} className="space-y-3 bg-muted/30 p-3 rounded-lg border">
                              <img src={url} alt={`Recommended ${idx + 1}`} className="w-full rounded-lg shadow-sm border" />
                              <p className="text-xs text-muted-foreground line-clamp-3 italic">"{recommendedPrompts[idx]}"</p>
                              <Button 
                                variant="secondary" 
                                size="sm" 
                                className="w-full"
                                onClick={async () => {
                                  try {
                                    const response = await fetch(url);
                                    const blob = await response.blob();
                                    const downloadUrl = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.style.display = 'none';
                                    a.href = downloadUrl;
                                    a.download = `alt-thumbnail-${idx + 1}.jpg`;
                                    document.body.appendChild(a);
                                    a.click();
                                    window.URL.revokeObjectURL(downloadUrl);
                                  } catch (err) {
                                    toast.error('Failed to download image.');
                                  }
                                }}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download Alt {idx + 1}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            ) : (
              <div className="h-full min-h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg p-4 text-center">
                Your generated content will appear here.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comments Section */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center space-x-2 mb-6">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Community Reviews</h2>
        </div>

        {user ? (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleAddComment} className="flex gap-4">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Input 
                    placeholder="Share your experience with this tool..." 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" disabled={!commentText.trim()}>Post Review</Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 bg-muted/30">
            <CardContent className="pt-6 text-center text-muted-foreground">
              Please sign in to leave a review or comment.
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="bg-card">
              <CardContent className="p-4 flex gap-4">
                <Avatar>
                  <AvatarImage src={comment.userAvatar} />
                  <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-sm">{comment.userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90">{comment.text}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
