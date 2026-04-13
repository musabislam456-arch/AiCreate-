import { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate, Link } from 'react-router-dom';
import { ADVANCED_TOOLS, CORE_TOOLS } from '../lib/tools-data';
import { analyzeThumbnails, analyzeChannel, generateMetadata, generateContent, generateVisualPrompts, generateAdvancedScript, generateScriptPart, textToSpeech, AIModel } from '../lib/gemini';
import { useAppStore } from '../lib/store';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2, Copy, CheckCircle2, Upload, X, Video, ArrowLeft, BarChart2, Users, Eye, Globe, DollarSign, Trophy, Cpu, Volume2, Plus, Bot } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';
import * as Icons from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { MicButton } from '../components/MicButton';
import { ModelSelector } from '../components/ModelSelector';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Hindi", 
  "Arabic", "Portuguese", "Urdu", "Mandarin", "Japanese", 
  "Russian", "Bengali", "Indonesian", "Korean", "Italian"
];

const SCRIPT_CATEGORIES = [
  "Technology", "Education", "Entertainment", "Gaming", 
  "Motivation", "News", "Business", "Storytelling"
];

const SCRIPT_STYLES = [
  "Engaging", "Curiosity Driven", "High Retention", "Suspense", 
  "Twist-Based", "Emotional", "Storytelling", "Educational", "Viral Style"
];

const SCRIPT_LENGTHS = [
  { label: "15 sec", value: "15s" },
  { label: "30 sec", value: "30s" },
  { label: "1 min", value: "1m" },
  { label: "2 min", value: "2m" },
  { label: "3 min", value: "3m" },
  { label: "4 min", value: "4m" },
  { label: "Custom", value: "custom" }
];

export function AdvancedToolPage() {
  const { id } = useParams<{ id: string }>();
  const tool = ADVANCED_TOOLS.find(t => t.id === id);
  const navigate = useNavigate();
  
  const { addHistory } = useAppStore();
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState(() => localStorage.getItem('creatorai_language') || 'English');
  const [selectedAIModel, setSelectedAIModel] = useState<AIModel>(() => (localStorage.getItem('creatorai_model') as AIModel) || 'ChatGPT');
  const [output, setOutput] = useState<any>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState<Record<string, boolean>>({});
  
  // Thumbnail specific state
  const [images, setImages] = useState<{ data: string, mimeType: string }[]>([]);

  // Script to Visuals state
  const [visualDuration, setVisualDuration] = useState('5s');
  const [customDuration, setCustomDuration] = useState('');
  const [promptLanguage, setPromptLanguage] = useState(() => localStorage.getItem('creatorai_prompt_lang') || 'English');
  const [voiceoverLanguage, setVoiceoverLanguage] = useState(() => localStorage.getItem('creatorai_voice_lang') || 'English');

  // Advanced Script Writer state
  const [scriptCategory, setScriptCategory] = useState(() => localStorage.getItem('creatorai_script_cat') || 'Gaming');
  const [customCategory, setCustomCategory] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(() => {
    const saved = localStorage.getItem('creatorai_script_types');
    return saved ? JSON.parse(saved) : [];
  });
  const [scriptLength, setScriptLength] = useState(() => localStorage.getItem('creatorai_script_len') || '1m');
  const [customLengthValue, setCustomLengthValue] = useState('');
  const [customLengthUnit, setCustomLengthUnit] = useState('Minutes');
  const [scriptFormat, setScriptFormat] = useState<'Full' | 'Paragraph'>('Full');

  // Sequential generation state
  const [generationMode, setGenerationMode] = useState<'Full' | 'Parts'>('Full');
  const [numParts, setNumParts] = useState('3');
  const [customParts, setCustomParts] = useState('');
  const [currentPart, setCurrentPart] = useState(0);
  const [generatedParts, setGeneratedParts] = useState<string[]>([]);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('creatorai_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('creatorai_model', selectedAIModel);
  }, [selectedAIModel]);

  useEffect(() => {
    localStorage.setItem('creatorai_prompt_lang', promptLanguage);
  }, [promptLanguage]);

  useEffect(() => {
    localStorage.setItem('creatorai_voice_lang', voiceoverLanguage);
  }, [voiceoverLanguage]);

  useEffect(() => {
    localStorage.setItem('creatorai_script_cat', scriptCategory);
  }, [scriptCategory]);

  useEffect(() => {
    localStorage.setItem('creatorai_script_types', JSON.stringify(selectedTypes));
  }, [selectedTypes]);

  useEffect(() => {
    localStorage.setItem('creatorai_script_len', scriptLength);
  }, [scriptLength]);

  if (!tool) {
    return <Navigate to="/" replace />;
  }

  const ToolIcon = (Icons as any)[tool.icon] || Icons.Wand2;

  const getToolColor = () => {
    switch (tool.id) {
      case 'advanced-script-writer': return 'bg-blue-500/10 text-blue-500';
      case 'channel-analyzer': return 'bg-red-500/10 text-red-500';
      case 'thumbnail-ab-testing': return 'bg-purple-500/10 text-purple-500';
      case 'competitor-analysis': return 'bg-orange-500/10 text-orange-500';
      case 'script-to-visuals': return 'bg-emerald-500/10 text-emerald-500';
      case 'metadata-generator': return 'bg-cyan-500/10 text-cyan-500';
      default: return 'bg-primary/10 text-primary';
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 3) {
      toast.error('You can only upload up to 3 thumbnails.');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, { 
          data: reader.result as string, 
          mimeType: file.type 
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleScriptStyle = (style: string) => {
    setSelectedTypes(prev => 
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const selectAllStyles = () => {
    if (selectedTypes.length === SCRIPT_STYLES.length) {
      setSelectedTypes([]);
    } else {
      setSelectedTypes([...SCRIPT_STYLES]);
    }
  };

  const handleGenerate = async () => {
    if (tool.id !== 'thumbnail-ab-testing' && !input.trim()) {
      toast.error('Please enter the required information.');
      return;
    }

    if (tool.id === 'thumbnail-ab-testing' && images.length < 2) {
      toast.error('Please upload at least 2 thumbnails for comparison.');
      return;
    }

    if (tool.id === 'advanced-script-writer') {
      if (selectedTypes.length === 0) {
        toast.error('Please select at least one script type.');
        return;
      }
      if (scriptLength === 'custom') {
        const val = parseInt(customLengthValue);
        if (isNaN(val) || val <= 0) {
          toast.error('Please enter a valid custom length.');
          return;
        }
        if (customLengthUnit === 'Hours' && val > 1) {
          toast.error('Maximum duration is 1 hour.');
          return;
        }
        if (customLengthUnit === 'Minutes' && val > 60) {
          toast.error('Maximum duration is 1 hour (60 minutes).');
          return;
        }
        if (customLengthUnit === 'Seconds' && val > 3600) {
          toast.error('Maximum duration is 1 hour (3600 seconds).');
          return;
        }
      }
    }

    setIsLoading(true);
    setOutput('');
    
    try {
      let result;
      if (tool.id === 'thumbnail-ab-testing') {
        result = await analyzeThumbnails(images, input, selectedAIModel);
      } else if (tool.id === 'channel-analyzer') {
        result = await analyzeChannel(input, language, selectedAIModel);
      } else if (tool.id === 'metadata-generator') {
        result = await generateMetadata(input, language, selectedAIModel);
      } else if (tool.id === 'competitor-analysis') {
        result = await generateContent(`Analyze the competitor strategy based on the following context: "${input}". Provide actionable insights on content gaps, thumbnail strategies, and pacing. Language: ${language}`, selectedAIModel);
      } else if (tool.id === 'script-to-visuals') {
        const duration = visualDuration === 'custom' ? customDuration : visualDuration;
        result = await generateVisualPrompts(input, duration, promptLanguage, voiceoverLanguage, selectedAIModel);
      } else if (tool.id === 'advanced-script-writer') {
        const category = scriptCategory === 'Custom' ? customCategory : scriptCategory;
        const length = scriptLength === 'custom' ? `${customLengthValue} ${customLengthUnit}` : scriptLength;
        
        if (generationMode === 'Parts') {
          const totalParts = numParts === 'custom' ? parseInt(customParts) : parseInt(numParts);
          const partResult = await generateScriptPart(input, category, selectedTypes, length, language, 1, totalParts, [], selectedAIModel);
          setGeneratedParts([partResult]);
          setCurrentPart(1);
          result = partResult;
        } else {
          result = await generateAdvancedScript(input, category, selectedTypes, length, language, selectedAIModel, scriptFormat);
          setGeneratedParts([result]);
          setCurrentPart(0);
        }
      }

      setOutput(result);
      addHistory(tool.id, input, typeof result === 'string' ? result : JSON.stringify(result));
      toast.success('Analysis complete!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate content.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPart = async () => {
    const totalParts = numParts === 'custom' ? parseInt(customParts) : parseInt(numParts);
    if (currentPart >= totalParts) return;

    setIsLoading(true);
    try {
      const category = scriptCategory === 'Custom' ? customCategory : scriptCategory;
      const length = scriptLength === 'custom' ? `${customLengthValue} ${customLengthUnit}` : scriptLength;
      
      const partResult = await generateScriptPart(
        input, 
        category, 
        selectedTypes, 
        length, 
        language, 
        currentPart + 1, 
        totalParts, 
        generatedParts, 
        selectedAIModel
      );
      
      const newParts = [...generatedParts, partResult];
      setGeneratedParts(newParts);
      setCurrentPart(currentPart + 1);
      setOutput(newParts.join('\n\n---\n\n'));
      toast.success(`Part ${currentPart + 1} generated!`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate next part.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleCopy = (text: string, key: string = 'main') => {
    navigator.clipboard.writeText(text);
    setIsCopied(prev => ({ ...prev, [key]: true }));
    toast.success('Copied to clipboard!');
    setTimeout(() => setIsCopied(prev => ({ ...prev, [key]: false })), 2000);
  };

  const handleRead = async (text: string) => {
    if (!text) return;
    try {
      toast.info('Loading audio...');
      await textToSpeech(text);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const renderMetadataOutput = () => {
    if (!output || typeof output !== 'object') return null;

    const sections = [
      { key: 'titles', title: 'SEO Titles', content: output.titles?.join('\n') },
      { key: 'description', title: 'Description', content: output.description },
      { key: 'tags', title: 'Tags', content: output.tags?.join(', ') },
      { key: 'keywords', title: 'Keywords', content: output.keywords?.join(', ') },
      { key: 'thumbnailPrompts', title: 'Thumbnail Prompts', content: output.thumbnailPrompts?.join('\n\n') },
    ];

    return (
      <div className="space-y-6">
        {sections.map((section) => section.content && (
          <div key={section.key} className="bg-muted/30 rounded-lg p-4 border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{section.title}</h3>
              <Button variant="ghost" size="sm" onClick={() => handleCopy(section.content, section.key)}>
                {isCopied[section.key] ? <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy
              </Button>
            </div>
            <div className="bg-background rounded p-3 text-sm whitespace-pre-wrap">
              {section.content}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderVisualsOutput = () => {
    if (!output || !Array.isArray(output)) return null;

    const copyAllPrompts = () => {
      const text = output.map((scene: any, i: number) => `Scene ${i + 1} Prompt:\n${scene.visualPrompt}`).join('\n\n');
      handleCopy(text, 'all-prompts');
    };

    const copyAll = () => {
      const text = output.map((scene: any, i: number) => `Scene ${i + 1}:\nVoiceover: ${scene.voiceover}\nPrompt: ${scene.visualPrompt}`).join('\n\n');
      handleCopy(text, 'all');
    };

    return (
      <div className="space-y-6">
        <div className="flex gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={copyAllPrompts}>
            {isCopied['all-prompts'] ? <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            Copy All Prompts
          </Button>
          <Button variant="default" size="sm" onClick={copyAll}>
            {isCopied['all'] ? <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            Copy All (Prompts + Voiceover)
          </Button>
        </div>

        {output.map((scene: any, index: number) => (
          <div key={index} className="bg-muted/30 rounded-lg p-4 border space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-semibold text-lg flex items-center">
                <Video className="w-4 h-4 mr-2 text-primary" />
                Scene {index + 1}
              </h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleCopy(scene.visualPrompt, `prompt-${index}`)}>
                  {isCopied[`prompt-${index}`] ? <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Prompt Only
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(`Voiceover: ${scene.voiceover}\nPrompt: ${scene.visualPrompt}`, `both-${index}`)}>
                  {isCopied[`both-${index}`] ? <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Both
                </Button>
              </div>
            </div>
            
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Voiceover</Label>
              <div className="bg-background rounded p-3 text-sm italic border-l-2 border-primary">
                "{scene.voiceover}"
              </div>
            </div>
            
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Visual Prompt</Label>
              <div className="bg-background rounded p-3 text-sm font-mono text-primary/90">
                {scene.visualPrompt}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderChannelAnalyzerOutput = () => {
    if (!output || typeof output !== 'object') return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">{output.channelName}</h2>
            <p className="text-sm text-muted-foreground mt-1">AI-Powered Channel Analysis & Estimates</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleCopy(JSON.stringify(output, null, 2))}>
              {isCopied['main'] ? <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Copy Data
            </Button>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-700 dark:text-yellow-400 p-3 rounded-md text-sm">
          <strong>Note:</strong> Statistics are gathered via AI web search and may be estimates. For exact real-time analytics, use YouTube Studio.
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="p-3 bg-blue-500/10 rounded-full mb-3">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Subscribers</p>
              <p className="font-bold text-2xl tracking-tight">{output.totalSubscribers}</p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/5 border-green-500/20">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="p-3 bg-green-500/10 rounded-full mb-3">
                <Eye className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Views</p>
              <p className="font-bold text-2xl tracking-tight">{output.totalViews}</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-500/5 border-purple-500/20">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="p-3 bg-purple-500/10 rounded-full mb-3">
                <Video className="h-6 w-6 text-purple-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Videos</p>
              <p className="font-bold text-2xl tracking-tight">{output.totalVideos}</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-500/5 border-yellow-500/20">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="p-3 bg-yellow-500/10 rounded-full mb-3">
                <DollarSign className="h-6 w-6 text-yellow-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Monetization</p>
              <p className="font-bold text-xl tracking-tight">{output.monetizationStatus}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-red-500/5 border-red-500/20">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-full">
              <Trophy className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Most Viewed Video</p>
              <a href={output.mostViewedVideo?.url} target="_blank" rel="noopener noreferrer" className="font-bold text-lg hover:underline text-primary">
                {output.mostViewedVideo?.title}
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-muted/30 rounded-lg p-4 border">
            <h3 className="font-semibold text-lg mb-4">Growth Trend (Subscribers & Views)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={output.historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(value)} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(value)} />
                  <Tooltip formatter={(value: number) => new Intl.NumberFormat('en-US').format(value)} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="subscribers" stroke="#3b82f6" strokeWidth={3} name="Subscribers" dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="views" stroke="#22c55e" strokeWidth={3} name="Views" dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 border flex flex-col">
            <h3 className="font-semibold text-lg mb-4">Audience Distribution (Top Countries)</h3>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Country</th>
                    <th className="px-4 py-3 rounded-tr-lg text-right">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {output.audienceInsights?.topCountries?.map((item: any, i: number) => (
                    <tr key={i} className="border-b border-border/50 last:border-0">
                      <td className="px-4 py-3 font-medium">{item.country}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${item.percentage}%` }}></div>
                          </div>
                          <span className="w-8">{item.percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-4 border">
          <h3 className="font-semibold text-lg mb-4">Similar Channels</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {output.similarChannels?.map((channel: any, i: number) => (
              <a key={i} href={channel.url} target="_blank" rel="noopener noreferrer" className="p-4 bg-background rounded-xl border hover:border-primary transition-colors flex items-center justify-between group">
                <span className="font-medium">{channel.name}</span>
                <Globe className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <Helmet>
        <title>{tool.title} – Advanced AI Tools for Creators | CreatorAI</title>
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
            <h1 className="text-4xl font-black tracking-tight uppercase">{tool.title}</h1>
            <Badge variant="default" className="rounded-full bg-primary text-primary-foreground">PRO FEATURE</Badge>
          </div>
          <p className="text-muted-foreground text-xl max-w-2xl">{tool.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-xl border-none bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {tool.supportsLanguage && tool.id !== 'script-to-visuals' && (
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
                {tool.id === 'script-to-visuals' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-bold">Prompt Language</Label>
                        <Select value={promptLanguage} onValueChange={setPromptLanguage}>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Prompt Language" />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map(lang => (
                              <SelectItem key={`p-${lang}`} value={lang}>{lang}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-bold">Voiceover Language</Label>
                        <Select value={voiceoverLanguage} onValueChange={setVoiceoverLanguage}>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Voiceover Language" />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map(lang => (
                              <SelectItem key={`v-${lang}`} value={lang}>{lang}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold">Visual Duration per Scene</Label>
                      <Select value={visualDuration} onValueChange={setVisualDuration}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select Duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3s">3 seconds</SelectItem>
                          <SelectItem value="4s">4 seconds</SelectItem>
                          <SelectItem value="5s">5 seconds</SelectItem>
                          <SelectItem value="6s">6 seconds</SelectItem>
                          <SelectItem value="8s">8 seconds</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {tool.id === 'advanced-script-writer' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold">Step 1: Category</Label>
                      <Select value={scriptCategory} onValueChange={setScriptCategory}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {SCRIPT_CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                          <SelectItem value="Custom">Custom Category</SelectItem>
                        </SelectContent>
                      </Select>
                      {scriptCategory === 'Custom' && (
                        <Input 
                          placeholder="Enter custom category..." 
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          className="mt-2 rounded-xl"
                        />
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-bold">Step 2: Script Style</Label>
                        <Button variant="ghost" size="sm" onClick={selectAllStyles} className="h-6 text-xs">
                          {selectedTypes.length === SCRIPT_STYLES.length ? 'Deselect All' : 'Select All'}
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {SCRIPT_STYLES.map(style => (
                          <div key={style} className="flex items-center space-x-2 bg-muted/30 p-2 rounded-lg border border-transparent hover:border-primary/20 transition-colors">
                            <Checkbox 
                              id={`style-${style}`} 
                              checked={selectedTypes.includes(style)}
                              onCheckedChange={() => toggleScriptStyle(style)}
                            />
                            <label htmlFor={`style-${style}`} className="text-xs font-medium leading-none cursor-pointer select-none flex-1">
                              {style}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-bold">Step 3: Script Length</Label>
                      <Select value={scriptLength} onValueChange={setScriptLength}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select Length" />
                        </SelectTrigger>
                        <SelectContent>
                          {SCRIPT_LENGTHS.map(len => (
                            <SelectItem key={len.value} value={len.value}>{len.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {scriptLength === 'custom' && (
                        <div className="flex gap-2 mt-2">
                          <Input 
                            type="number" 
                            placeholder="Value" 
                            value={customLengthValue}
                            onChange={(e) => setCustomLengthValue(e.target.value)}
                            className="rounded-xl"
                            min="1"
                          />
                          <Select value={customLengthUnit} onValueChange={setCustomLengthUnit}>
                            <SelectTrigger className="rounded-xl w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Seconds">Seconds</SelectItem>
                              <SelectItem value="Minutes">Minutes</SelectItem>
                              <SelectItem value="Hours">Hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {tool.id === 'thumbnail-ab-testing' && (
                  <div className="space-y-4">
                    <Label className="text-sm font-bold">Upload Thumbnails</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border-2 border-primary/20">
                          <img src={img.data} alt={`Upload ${idx + 1}`} className="object-cover w-full h-full" />
                          <button 
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {images.length < 3 && (
                        <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-primary/20 cursor-pointer hover:bg-primary/5 transition-colors">
                          <Upload className="w-6 h-6 text-primary mb-2" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Upload</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} multiple />
                        </label>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-bold">
                    {tool.id === 'thumbnail-ab-testing' ? 'Video Context / Title' : 
                     tool.id === 'channel-analyzer' ? 'Channel URL or Stats' :
                     tool.id === 'competitor-analysis' ? 'Competitor Channel URL or Niche' :
                     tool.id === 'script-to-visuals' ? 'Paste your Script' :
                     tool.id === 'advanced-script-writer' ? 'Video Topic / Details' :
                     'Topic / Context'}
                  </Label>
                  <div className="relative">
                    <Textarea 
                      placeholder="Provide details here..."
                      className="min-h-[150px] resize-none pb-10 rounded-xl"
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
                  disabled={isLoading || (!input.trim() && tool.id !== 'thumbnail-ab-testing')}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BarChart2 className="mr-2 h-5 w-5" />
                      Run Analysis
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
                <CardTitle className="text-2xl font-black">ANALYSIS REPORT</CardTitle>
                <CardDescription>AI-powered insights and recommendations</CardDescription>
              </div>
              {output && typeof output === 'string' && tool.id !== 'advanced-script-writer' && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleCopy(output)} className="rounded-full">
                    {isCopied['main'] ? <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleRead(output)} className="rounded-full">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Listen
                  </Button>
                </div>
              )}
              {output && typeof output === 'string' && tool.id === 'advanced-script-writer' && (
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleCopy(output.replace(/\[\d+:\d+(?:\s*-\s*\d+:\d+)?\]/g, '').replace(/\[.*?\]/g, '').trim(), 'only-script')} className="rounded-full">
                    {isCopied['only-script'] ? <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    Copy Only Script
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleCopy(output.replace(/\[\d+:\d+(?:\s*-\s*\d+:\d+)?\]/g, '').trim(), 'script-headings')} className="rounded-full">
                    {isCopied['script-headings'] ? <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    Copy with Headings
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleCopy(output, 'full')} className="rounded-full">
                    {isCopied['full'] ? <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    Copy Full (Timestamps)
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleRead(output)} className="rounded-full">
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
                    <p className="text-xl font-bold mb-2">AI is processing...</p>
                    <p className="text-muted-foreground">Deep analysis takes a few seconds. Please wait.</p>
                  </div>
                </div>
              ) : output ? (
                <div className="bg-muted/30 rounded-2xl p-6 h-full min-h-[400px] overflow-y-auto prose prose-lg dark:prose-invert max-w-none border border-border/50">
                  {tool.id === 'channel-analyzer' ? renderChannelAnalyzerOutput() :
                   tool.id === 'metadata-generator' ? renderMetadataOutput() :
                   tool.id === 'script-to-visuals' ? renderVisualsOutput() :
                   typeof output === 'string' ? <ReactMarkdown>{output}</ReactMarkdown> : 
                   <pre className="text-xs overflow-auto">{JSON.stringify(output, null, 2)}</pre>
                  }
                  
                  {tool.id === 'advanced-script-writer' && generationMode === 'Parts' && currentPart < (numParts === 'custom' ? parseInt(customParts) : parseInt(numParts)) && (
                    <div className="mt-8 pt-8 border-t flex justify-center">
                      <Button onClick={handleNextPart} disabled={isLoading} size="lg" className="rounded-full px-10 font-bold">
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                        Generate Part {currentPart + 1}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground border-4 border-dashed rounded-3xl p-12 text-center bg-muted/10">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                    <BarChart2 className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-foreground">Awaiting Analysis</h3>
                  <p className="max-w-xs mx-auto">Upload your data or provide context to receive a comprehensive AI report.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Internal Linking: Related Advanced Tools */}
      <div className="mt-24 pt-12 border-t">
        <h3 className="text-2xl font-bold mb-8">More Advanced AI Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {ADVANCED_TOOLS.filter(t => t.id !== tool.id).map(relatedTool => (
            <Link key={relatedTool.id} to={`/advanced/${relatedTool.id}`} className="p-4 bg-muted rounded-xl hover:bg-primary/5 hover:border-primary border transition-all">
              <h4 className="font-bold text-sm mb-1">{relatedTool.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-1">{relatedTool.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
