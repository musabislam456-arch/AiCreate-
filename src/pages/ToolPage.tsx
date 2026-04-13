import { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { CORE_TOOLS } from '../lib/tools-data';
import { generateContent, generateContentWithSearch, textToSpeech, AIModel } from '../lib/gemini';
import { useAppStore } from '../lib/store';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2, Copy, CheckCircle2, MessageSquare, ArrowLeft, ImagePlus, Download, Share2, Briefcase, TrendingDown, Film, MessageCircle, TrendingUp, CalendarDays, RefreshCw, Cpu, Volume2, Wand2, Bot, Sparkles, Star } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';
import * as Icons from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { MicButton } from '../components/MicButton';
import { ModelSelector } from '../components/ModelSelector';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

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

  const ToolIcon = (Icons as any)[tool.icon] || Icons.Wand2;

  const getToolColor = () => {
    switch (tool.id) {
      case 'seo-title': return 'bg-blue-500/10 text-blue-500';
      case 'viral-hooks': return 'bg-red-500/10 text-red-500';
      case 'thumbnail-gen': return 'bg-purple-500/10 text-purple-500';
      case 'content-scheduler': return 'bg-emerald-500/10 text-emerald-500';
      default: return 'bg-primary/10 text-primary';
    }
  };

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
    
    addComment(commentText, 5);
    setCommentText('');
    toast.success('Comment added!');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <Helmet>
        <title>{tool.title} – Free AI Tools for YouTubers | CreatorAI</title>
        <meta name="description" content={tool.description} />
      </Helmet>
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8 -ml-4 text-muted-foreground hover:text-primary">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>
      
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
        <div className={cn("h-20 w-20 rounded-3xl flex items-center justify-center shadow-inner", getToolColor())}>
          <ToolIcon className="h-10 w-10" />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black tracking-tight">{tool.title}</h1>
            <Badge variant="outline" className="rounded-full border-primary/20 text-primary">{tool.category}</Badge>
          </div>
          <p className="text-muted-foreground text-xl max-w-2xl">{tool.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
        {/* Input Section */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-xl border-none bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary" />
                Configure Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {tool.supportsLanguage && (
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">Output Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="rounded-xl">
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

                <div className="space-y-2">
                  <Label className="text-sm font-bold">AI Engine</Label>
                  <ModelSelector value={selectedAIModel} onChange={setSelectedAIModel} />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                {/* Unique Interfaces per Tool */}
                {tool.id === 'seo-title-generator' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">Main Keyword</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="E.g., YouTube Algorithm 2026" 
                        value={extraInput1}
                        onChange={(e) => setExtraInput1(e.target.value)}
                        className="rounded-xl"
                      />
                      <MicButton onTranscript={(text) => setExtraInput1(prev => prev + (prev ? ' ' : '') + text)} />
                    </div>
                  </div>
                )}

                {tool.id === 'viral-hook-generator' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">Hook Tone</Label>
                    <Select value={extraInput1} onValueChange={setExtraInput1}>
                      <SelectTrigger className="rounded-xl">
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
                    <Label className="text-sm font-bold">Target Audience</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="E.g., Teenagers, Tech Enthusiasts..." 
                        value={extraInput1}
                        onChange={(e) => setExtraInput1(e.target.value)}
                        className="rounded-xl"
                      />
                      <MicButton onTranscript={(text) => setExtraInput1(prev => prev + (prev ? ' ' : '') + text)} />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-bold">
                    {tool.id === 'ai-rewrite-tool' ? 'Add your Script' : 
                     tool.id === 'caption-generator' ? 'Video/Image Description' :
                     tool.id === 'seo-title-generator' ? 'Video Context' :
                     tool.id === 'shorts-script-generator' ? 'Short Concept' :
                     tool.id === 'thumbnail-generator' ? 'Video Title / Topic' :
                     tool.id === 'sponsorship-pitch' ? 'Target Brand & Product' :
                     tool.id === 'trend-adapter' ? 'Describe the Trend or Audio' :
                     tool.id === 'content-scheduler' ? 'Channel Details & Audience Info' :
                     'Topic / Context'}
                  </Label>
                  <div className="relative">
                    <Textarea 
                      placeholder={
                        tool.id === 'ai-rewrite-tool' ? "Paste the script you want to rewrite..." :
                        tool.id === 'caption-generator' ? "Describe what happens in your video or image..." :
                        tool.id === 'thumbnail-generator' ? "E.g., How to build a custom PC in 2026..." :
                        "E.g., A video about 5 tips for beginner photographers..."
                      }
                      className="min-h-[180px] resize-none pb-10 rounded-xl"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <div className="absolute bottom-2 right-2">
                      <MicButton onTranscript={(text) => setInput(prev => prev + (prev ? ' ' : '') + text)} />
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20" 
                  size="lg" 
                  onClick={handleGenerate}
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Crafting Magic...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-5 w-5" />
                      Generate Now
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-7">
          <Card className="shadow-2xl border-none h-full flex flex-col bg-card/80 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-black">GENERATED RESULT</CardTitle>
                <CardDescription>Ready for your next viral post</CardDescription>
              </div>
              {output && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleCopy} className="rounded-full">
                    {isCopied ? <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRead} className="rounded-full">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Listen
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 pt-6">
              {isLoading ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <Bot className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold mb-2">AI is thinking...</p>
                    <p className="text-muted-foreground">Analyzing your input and generating the best content.</p>
                  </div>
                </div>
              ) : output ? (
                <div className="bg-muted/30 rounded-2xl p-6 h-full min-h-[400px] overflow-y-auto prose prose-lg dark:prose-invert max-w-none border border-border/50">
                  {tool.id === 'thumbnail-generator' && thumbnailUrl && (
                    <div className="mb-8 space-y-6">
                      <div className="relative group">
                        <img src={thumbnailUrl} alt="Generated Thumbnail" className="w-full rounded-2xl shadow-2xl border-4 border-white" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                           <Button 
                            variant="secondary"
                            onClick={async () => {
                              const response = await fetch(thumbnailUrl);
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = 'thumbnail.jpg';
                              a.click();
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" /> Download HD
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  <ReactMarkdown>{output}</ReactMarkdown>
                </div>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground border-4 border-dashed rounded-3xl p-12 text-center bg-muted/10">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                    <Sparkles className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-foreground">Ready to Create?</h3>
                  <p className="max-w-xs mx-auto">Fill in the details on the left and click generate to see the magic happen.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Community Section */}
      <div className="max-w-4xl mx-auto pt-12 border-t">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-black tracking-tight">USER REVIEWS</h2>
          </div>
          {user && (
            <Badge variant="secondary" className="px-4 py-1 rounded-full">
              {comments.length} Reviews
            </Badge>
          )}
        </div>

        {user ? (
          <Card className="mb-12 border-none shadow-lg bg-primary/5">
            <CardContent className="pt-6">
              <form onSubmit={handleAddComment} className="flex gap-6">
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea 
                    placeholder="How was your experience with this tool?" 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="min-h-[100px] rounded-xl border-none shadow-inner bg-background/50 focus-visible:ring-primary"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="lg" className="rounded-full px-8 font-bold" disabled={!commentText.trim()}>
                      Post Review
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-12 bg-muted/30 border-dashed border-2">
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground text-lg mb-4">Sign in to share your thoughts with the community.</p>
              <Button variant="outline" className="rounded-full px-8">Sign In Now</Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {comments.map((comment) => (
            <Card key={comment.id} className="bg-card border-none shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.userAvatar} />
                      <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-sm">{comment.userName}</p>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("w-3 h-3", i < (comment.rating || 5) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30")} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed italic">"{comment.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Internal Linking: Related Tools */}
      <div className="mt-24 pt-12 border-t">
        <h3 className="text-2xl font-bold mb-8">Related AI Tools for Creators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {CORE_TOOLS.filter(t => t.id !== tool.id).slice(0, 4).map(relatedTool => (
            <Link key={relatedTool.id} to={`/tool/${relatedTool.id}`} className="p-4 bg-muted rounded-xl hover:bg-primary/5 hover:border-primary border transition-all">
              <h4 className="font-bold text-sm mb-1">{relatedTool.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-1">{relatedTool.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

