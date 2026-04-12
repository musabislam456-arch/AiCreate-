import { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { ADVANCED_TOOLS } from '../lib/tools-data';
import { analyzeThumbnails, analyzeChannel, generateMetadata, generateContent, generateVisualPrompts, generateAdvancedScript, generateScriptPart, textToSpeech, AIModel } from '../lib/gemini';
import { useAppStore } from '../lib/store';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2, Copy, CheckCircle2, Upload, X, Video, ArrowLeft, BarChart2, Users, Eye, Globe, DollarSign, Trophy, Cpu, Volume2 } from 'lucide-react';
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

const SCRIPT_TYPES = [
  "Engaging", "Curiosity", "Audience Retention", "Suspense", 
  "Twists", "Amazing", "Call to Action", "Emotional"
];

export function AdvancedToolPage() {
  const { id } = useParams<{ id: string }>();
  const tool = ADVANCED_TOOLS.find(t => t.id === id);
  const navigate = useNavigate();
  
  const { addHistory } = useAppStore();
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('English');
  const [selectedAIModel, setSelectedAIModel] = useState<AIModel>('ChatGPT');
  const [output, setOutput] = useState<any>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState<Record<string, boolean>>({});
  
  // Thumbnail specific state
  const [images, setImages] = useState<{ data: string, mimeType: string }[]>([]);

  // Script to Visuals state
  const [visualDuration, setVisualDuration] = useState('5s');
  const [customDuration, setCustomDuration] = useState('');
  const [promptLanguage, setPromptLanguage] = useState('English');
  const [voiceoverLanguage, setVoiceoverLanguage] = useState('English');

  // Advanced Script Writer state
  const [scriptCategory, setScriptCategory] = useState('Gaming');
  const [customCategory, setCustomCategory] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [scriptLength, setScriptLength] = useState('1min');
  const [customLengthValue, setCustomLengthValue] = useState('');
  const [customLengthUnit, setCustomLengthUnit] = useState('Minutes');
  const [scriptFormat, setScriptFormat] = useState<'Full' | 'Paragraph'>('Full');

  // Sequential generation state
  const [generationMode, setGenerationMode] = useState<'Full' | 'Parts'>('Full');
  const [numParts, setNumParts] = useState('3');
  const [customParts, setCustomParts] = useState('');
  const [currentPart, setCurrentPart] = useState(0);
  const [generatedParts, setGeneratedParts] = useState<string[]>([]);

  if (!tool) {
    return <Navigate to="/" replace />;
  }

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

  const toggleScriptType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const selectAllTypes = () => {
    if (selectedTypes.length === SCRIPT_TYPES.length) {
      setSelectedTypes([]);
    } else {
      setSelectedTypes([...SCRIPT_TYPES]);
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="p-3 bg-blue-500/10 rounded-full mb-3">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Subscribers</p>
              <p className="font-bold text-2xl tracking-tight">{output.subscribers}</p>
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
                <Globe className="h-6 w-6 text-purple-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Top Country</p>
              <p className="font-bold text-xl tracking-tight">{output.topAudienceCountry}</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-500/5 border-yellow-500/20">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="p-3 bg-yellow-500/10 rounded-full mb-3">
                <DollarSign className="h-6 w-6 text-yellow-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Monetized</p>
              <p className="font-bold text-xl tracking-tight">{output.isMonetized ? 'Yes' : 'No'}</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-500/5 border-orange-500/20">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="p-3 bg-orange-500/10 rounded-full mb-3">
                <Trophy className="h-6 w-6 text-orange-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Ranking</p>
              <p className="font-bold text-xl tracking-tight">{output.youtubeRanking}</p>
            </CardContent>
          </Card>
          <Card className="bg-red-500/5 border-red-500/20">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="p-3 bg-red-500/10 rounded-full mb-3">
                <Video className="h-6 w-6 text-red-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Top Video</p>
              <p className="font-bold text-sm line-clamp-2 px-2">{output.mostViewedVideo}</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted/30 rounded-lg p-4 border">
          <h3 className="font-semibold text-lg mb-4">Historical Data (Last 6 Months)</h3>
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

        <div className="bg-muted/30 rounded-lg p-4 border">
          <h3 className="font-semibold text-lg mb-4">Audience Retention Trend</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={output.historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Bar dataKey="audienceRetention" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Retention (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/30 rounded-lg p-4 border">
            <h3 className="font-semibold text-lg mb-2">Similar Channels</h3>
            <ul className="list-disc pl-5 space-y-1">
              {output.similarChannels?.map((channel: string, i: number) => (
                <li key={i} className="text-sm">{channel}</li>
              ))}
            </ul>
          </div>
          <div className="bg-muted/30 rounded-lg p-4 border">
            <h3 className="font-semibold text-lg mb-2">Growth Plan</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{output.growthPlan}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 -ml-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <div className="mb-8">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary mb-4">
          PRO Feature
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{tool.title}</h1>
        <p className="text-muted-foreground text-lg">{tool.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Input Section */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Provide the necessary context</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tool.supportsLanguage && tool.id !== 'script-to-visuals' && (
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


            {tool.id === 'script-to-visuals' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prompt Language</Label>
                    <Select value={promptLanguage} onValueChange={setPromptLanguage}>
                      <SelectTrigger>
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
                    <Label>Voiceover Language</Label>
                    <Select value={voiceoverLanguage} onValueChange={setVoiceoverLanguage}>
                      <SelectTrigger>
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
                  <Label>Visual Duration per Scene</Label>
                  <Select value={visualDuration} onValueChange={setVisualDuration}>
                    <SelectTrigger>
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
                  {visualDuration === 'custom' && (
                    <div className="flex gap-2 mt-2">
                      <Input 
                        placeholder="E.g., 10s or 2 minutes" 
                        value={customDuration}
                        onChange={(e) => setCustomDuration(e.target.value)}
                      />
                      <MicButton onTranscript={(text) => setCustomDuration(prev => prev + (prev ? ' ' : '') + text)} />
                    </div>
                  )}
                </div>
              </>
            )}

            {tool.id === 'advanced-script-writer' && (
              <>
                <div className="space-y-2">
                  <Label>Script Format</Label>
                  <Select value={scriptFormat} onValueChange={(v: any) => setScriptFormat(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full">Full Details (Headings, Visuals, Timestamps)</SelectItem>
                      <SelectItem value="Paragraph">Single Paragraph (Continuous Narrative)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Generation Mode</Label>
                  <Select value={generationMode} onValueChange={(v: any) => setGenerationMode(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full">Full Script (One Go)</SelectItem>
                      <SelectItem value="Parts">Sequential Parts (Step-by-Step)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {generationMode === 'Parts' && (
                  <div className="space-y-2">
                    <Label>Number of Parts</Label>
                    <Select value={numParts} onValueChange={setNumParts}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Parts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 Parts</SelectItem>
                        <SelectItem value="3">3 Parts</SelectItem>
                        <SelectItem value="4">4 Parts</SelectItem>
                        <SelectItem value="5">5 Parts</SelectItem>
                        <SelectItem value="6">6 Parts</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    {numParts === 'custom' && (
                      <Input 
                        type="number"
                        placeholder="Enter number of parts..." 
                        value={customParts}
                        onChange={(e) => setCustomParts(e.target.value)}
                        className="mt-2"
                        min="2"
                        max="10"
                      />
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={scriptCategory} onValueChange={setScriptCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gaming">Gaming</SelectItem>
                      <SelectItem value="Tech">Tech</SelectItem>
                      <SelectItem value="Vlogs">Vlogs</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {scriptCategory === 'Custom' && (
                    <div className="flex gap-2 mt-2">
                      <Input 
                        placeholder="Enter custom category..." 
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                      />
                      <MicButton onTranscript={(text) => setCustomCategory(prev => prev + (prev ? ' ' : '') + text)} />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Script Types</Label>
                    <Button variant="ghost" size="sm" onClick={selectAllTypes} className="h-6 text-xs">
                      {selectedTypes.length === SCRIPT_TYPES.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {SCRIPT_TYPES.map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`type-${type}`} 
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => toggleScriptType(type)}
                        />
                        <label htmlFor={`type-${type}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Script Length</Label>
                  <Select value={scriptLength} onValueChange={setScriptLength}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15sec">15 seconds</SelectItem>
                      <SelectItem value="30sec">30 seconds</SelectItem>
                      <SelectItem value="1min">1 minute</SelectItem>
                      <SelectItem value="2min">2 minutes</SelectItem>
                      <SelectItem value="3min">3 minutes</SelectItem>
                      <SelectItem value="4min">4 minutes</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {scriptLength === 'custom' && (
                    <div className="flex gap-2 mt-2">
                      <Input 
                        type="number"
                        placeholder="Value" 
                        value={customLengthValue}
                        onChange={(e) => setCustomLengthValue(e.target.value)}
                        className="flex-1"
                        min="1"
                      />
                      <Select value={customLengthUnit} onValueChange={setCustomLengthUnit}>
                        <SelectTrigger className="w-[120px]">
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
              </>
            )}

            {tool.id === 'thumbnail-ab-testing' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-md overflow-hidden border">
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
                    <label className="flex flex-col items-center justify-center aspect-video rounded-md border-2 border-dashed border-muted-foreground/25 cursor-pointer hover:bg-muted/50 transition-colors">
                      <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">Upload Image</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} multiple />
                    </label>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Upload 2-3 thumbnails to compare.</p>
              </div>
            )}

            <div className="space-y-2">
              <Label>
                {tool.id === 'thumbnail-ab-testing' ? 'Video Context / Title' : 
                 tool.id === 'channel-analyzer' ? 'Channel URL or Stats' :
                 tool.id === 'competitor-analysis' ? 'Competitor Channel URL or Niche' :
                 tool.id === 'script-to-visuals' ? 'Paste your Script' :
                 tool.id === 'advanced-script-writer' ? 'Video Topic / Details' :
                 'Topic / Context'}
              </Label>
              {tool.id === 'channel-analyzer' || tool.id === 'competitor-analysis' ? (
                <div className="flex gap-2">
                  <Input 
                    placeholder={tool.id === 'channel-analyzer' ? "https://youtube.com/@channel or paste stats..." : "https://youtube.com/@competitor or niche description..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <MicButton onTranscript={(text) => setInput(prev => prev + (prev ? ' ' : '') + text)} />
                </div>
              ) : (
                <div className="relative">
                  <Textarea 
                    placeholder={
                      tool.id === 'script-to-visuals' ? "Paste your full video script here..." : 
                      tool.id === 'advanced-script-writer' ? "E.g., A video explaining how black holes work..." :
                      "Provide details here..."
                    }
                    className="min-h-[150px] resize-none pb-10"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <div className="absolute bottom-2 right-2">
                    <MicButton onTranscript={(text) => setInput(prev => prev + (prev ? ' ' : '') + text)} />
                  </div>
                </div>
              )}
            </div>

            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleGenerate}
              disabled={isLoading || (!input.trim() && tool.id !== 'thumbnail-ab-testing')}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Run Analysis'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>Result</CardTitle>
              <CardDescription>AI Analysis & Insights</CardDescription>
            </div>
            {output && typeof output === 'string' && (
              <div className="flex space-x-2">
                {tool.id === 'advanced-script-writer' && (
                  <Button variant="outline" size="sm" onClick={() => {
                    const scriptOnly = output
                      .replace(/\[.*?\]/g, '') // Remove brackets and contents (visual cues, timestamps)
                      .replace(/^#+\s+.*$/gm, '') // Remove markdown headers
                      .replace(/\*\*.*?\*\*/g, (match) => match.replace(/\*\*/g, '')) // Remove bold markers but keep text
                      .replace(/\*/g, '') // Remove italics
                      .replace(/^(Visual|Voiceover|Audio|B-Roll).*?:/gim, '') // Remove column headers
                      .replace(/\d{1,2}:\d{2}(\s*-\s*\d{1,2}:\d{2})?/g, '') // Remove naked timestamps like 00:00
                      .replace(/^\s*[\r\n]/gm, '\n') // Remove extra empty lines
                      .trim();
                    handleCopy(scriptOnly, 'script-only');
                  }}>
                    {isCopied['script-only'] ? <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    Copy Script Only
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => handleCopy(output)}>
                  {isCopied['main'] ? <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {tool.id === 'advanced-script-writer' ? 'Copy with Headings & Timestamps' : 'Copy All'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleRead(typeof output === 'string' ? output : JSON.stringify(output))}>
                  <Volume2 className="h-4 w-4 mr-2" />
                  Read
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1">
            {output ? (
              <div className="space-y-4 h-full flex flex-col">
                {tool.id === 'metadata-generator' ? (
                  renderMetadataOutput()
                ) : tool.id === 'script-to-visuals' ? (
                  renderVisualsOutput()
                ) : tool.id === 'channel-analyzer' ? (
                  renderChannelAnalyzerOutput()
                ) : (
                  <div className="bg-muted/50 rounded-lg p-4 flex-1 min-h-[200px] overflow-y-auto prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{output}</ReactMarkdown>
                  </div>
                )}
                
                {tool.id === 'advanced-script-writer' && generationMode === 'Parts' && currentPart > 0 && currentPart < (numParts === 'custom' ? parseInt(customParts) : parseInt(numParts)) && (
                  <Button 
                    onClick={handleNextPart} 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary to-blue-600 hover:opacity-90"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Part {currentPart + 1}...
                      </>
                    ) : (
                      `Generate Part ${currentPart + 1}`
                    )}
                  </Button>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg p-4 text-center">
                Your analysis results will appear here.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
