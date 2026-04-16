import { AIModel } from '../lib/gemini';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sparkles, Zap, Brain, Cpu, ShieldCheck } from 'lucide-react';

interface ModelSelectorProps {
  value: AIModel;
  onChange: (value: AIModel) => void;
  className?: string;
}

export function ModelSelector({ value, onChange, className }: ModelSelectorProps) {
  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Cpu className="w-4 h-4 text-primary" />
        AI Engine
      </label>
      <Select value={value} onValueChange={(v) => onChange(v as AIModel)}>
        <SelectTrigger className="w-full bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
          <SelectValue placeholder="Select AI Model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Nemotron">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-green-500" />
              <span>Nemotron (OpenRouter - Free)</span>
            </div>
          </SelectItem>
          <SelectItem value="Auto">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Auto Mode (Smart Fallback)</span>
            </div>
          </SelectItem>
          <SelectItem value="Gemini">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Gemini 2.0 Flash</span>
            </div>
          </SelectItem>
          <SelectItem value="GLM-4.5">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              <span>GLM-4.5 (OpenRouter - Free)</span>
            </div>
          </SelectItem>
          <SelectItem value="GPT-OSS-Free">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-500" />
              <span>GPT-OSS 120B (Free)</span>
            </div>
          </SelectItem>
          <SelectItem value="GPT-OSS-Groq">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-500" />
              <span>GPT-OSS 120B (Groq)</span>
            </div>
          </SelectItem>
          <SelectItem value="Llama-3.3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-500" />
              <span>Llama 3.3 70B (Groq)</span>
            </div>
          </SelectItem>
          <SelectItem value="GPT-5">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-red-500" />
              <span>OpenAI GPT-5 (GitHub)</span>
            </div>
          </SelectItem>
          <SelectItem value="Grok-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-pink-500" />
              <span>xAI Grok 3 (GitHub)</span>
            </div>
          </SelectItem>
          <SelectItem value="DeepSeek-V3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-500" />
              <span>DeepSeek V3 (GitHub)</span>
            </div>
          </SelectItem>
          <SelectItem value="Qwen-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-lime-500" />
              <span>Qwen 3 (Groq)</span>
            </div>
          </SelectItem>
          <SelectItem value="Llama-3.1">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Llama 3.1 8B (Groq)</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
