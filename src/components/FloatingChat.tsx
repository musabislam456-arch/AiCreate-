import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, Maximize2, Minimize2, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { chatWithAssistant, AIModel } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';
import { MicButton } from './MicButton';
import { ModelSelector } from './ModelSelector';
import { cn } from '../lib/utils';

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Hindi", 
  "Arabic", "Portuguese", "Urdu", "Mandarin", "Japanese", 
  "Russian", "Bengali", "Indonesian", "Korean", "Italian"
];

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Hi! I am your Creator AI Assistant. How can I help you grow your channel today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('English');
  const [selectedAIModel, setSelectedAIModel] = useState<AIModel>('Auto');
  const [answerMode, setAnswerMode] = useState<'short' | 'detailed'>(() => (localStorage.getItem('creatorai_answer_mode') as 'short' | 'detailed') || 'short');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('creatorai_answer_mode', answerMode);
  }, [answerMode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatWithAssistant(userMessage, messages, language, selectedAIModel, answerMode);
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'assistant', text: `Sorry, I encountered an error: ${error?.message || 'Please try again.'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', text: 'Chat cleared. How can I help you now?' }]);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          size="icon-lg" 
          className="rounded-full shadow-xl h-14 w-14 bg-primary hover:bg-primary/90"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "fixed z-50 transition-all duration-300 ease-in-out",
      isFullscreen 
        ? "inset-0 bg-background" 
        : "bottom-6 right-6 w-[350px] h-[500px]"
    )}>
      <Card className={cn(
        "flex flex-col shadow-2xl border-primary/20 h-full",
        isFullscreen ? "rounded-none border-none" : ""
      )}>
        <CardHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0 bg-primary/5">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-primary" />
            <CardTitle className={cn("font-semibold", isFullscreen ? "text-xl" : "text-base")}>
              Creator Assistant
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="h-7 w-[80px] text-[10px] px-2">
                <SelectValue placeholder="Lang" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={answerMode} onValueChange={(v) => setAnswerMode(v as 'short' | 'detailed')}>
              <SelectTrigger className="h-7 w-[80px] text-[10px] px-2">
                <SelectValue placeholder="Length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedAIModel} onValueChange={(v) => setSelectedAIModel(v as AIModel)}>
              <SelectTrigger className="h-7 w-[80px] text-[10px] px-2">
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Auto">Auto</SelectItem>
                <SelectItem value="Nemotron">Nemotron 120B</SelectItem>
                <SelectItem value="Gemini">Gemini 2.0 Flash</SelectItem>
                <SelectItem value="GLM-4.5">GLM-4.5</SelectItem>
                <SelectItem value="GPT-OSS-Free">GPT-OSS 120B (1)</SelectItem>
                <SelectItem value="GPT-OSS-Groq">GPT-OSS 120B (2)</SelectItem>
                <SelectItem value="Llama-3.3">Llama 3.3 70B</SelectItem>
                <SelectItem value="GPT-5">GPT-5</SelectItem>
                <SelectItem value="Grok-3">Grok 3</SelectItem>
                <SelectItem value="DeepSeek-V3">DeepSeek V3</SelectItem>
                <SelectItem value="Qwen-3">Qwen 3 32B</SelectItem>
                <SelectItem value="Llama-3.1">Llama 3.1 8B</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="ghost" size="icon-sm" onClick={() => setIsFullscreen(!isFullscreen)} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}>
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            
            <Button variant="ghost" size="icon-sm" onClick={clearChat} title="Clear Chat">
              <Trash2 className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="icon-sm" onClick={() => { setIsOpen(false); setIsFullscreen(false); }}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
          <div className={cn(
            "flex-1 p-4 overflow-y-auto",
            isFullscreen ? "max-w-4xl mx-auto w-full" : ""
          )} ref={scrollRef}>
            <div className="space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className={cn(
                  "flex",
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}>
                  <div 
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-muted prose prose-sm dark:prose-invert rounded-tl-none'
                    )}
                  >
                    {msg.role === 'user' ? msg.text : <ReactMarkdown>{msg.text}</ReactMarkdown>}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center space-x-2 shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={cn(
            "p-4 border-t bg-background",
            isFullscreen ? "pb-8" : ""
          )}>
            <div className={cn(
              "flex items-center space-x-2",
              isFullscreen ? "max-w-4xl mx-auto w-full" : ""
            )}>
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex-1 flex items-center space-x-2 bg-muted rounded-full px-4 py-1"
              >
                <Input 
                  placeholder="Ask me anything..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <MicButton onTranscript={(text) => setInput(prev => prev + (prev ? ' ' : '') + text)} />
                <Button type="submit" size="icon" variant="ghost" disabled={isLoading || !input.trim()} className="text-primary hover:text-primary/80 hover:bg-transparent">
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
