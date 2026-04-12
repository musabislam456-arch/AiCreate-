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
          <SelectItem value="ChatGPT">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-green-500" />
              <span>ChatGPT (Default - Fast)</span>
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
              <span>Gemini (High Quality)</span>
            </div>
          </SelectItem>
          <SelectItem value="Claude">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>Claude</span>
            </div>
          </SelectItem>
          <SelectItem value="DeepSeek">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-500" />
              <span>DeepSeek</span>
            </div>
          </SelectItem>
          <SelectItem value="DeepSeek-Reasoner">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-500" />
              <span>DeepSeek Reasoner</span>
            </div>
          </SelectItem>
          <SelectItem value="Grok">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-500" />
              <span>Grok</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
