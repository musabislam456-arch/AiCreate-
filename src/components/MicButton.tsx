import { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface MicButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function MicButton({ onTranscript, className }: MicButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          toast.error('Microphone access denied. Please allow microphone permissions.');
        } else if (event.error === 'no-speech') {
          // Ignore no-speech errors as they are common
        } else {
          toast.error(`Mic error: ${event.error}`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [onTranscript]);

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!recognition) {
      toast.error('Speech recognition not supported.');
      return;
    }
    
    if (isListening) {
      try {
        recognition.stop();
      } catch (err) {
        console.error('Error stopping recognition:', err);
      }
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
        toast.info('Listening...');
      } catch (err) {
        console.error('Error starting recognition:', err);
        // If it's already started, just update state
        setIsListening(true);
      }
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={`shrink-0 ${isListening ? 'bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600 animate-pulse' : 'text-muted-foreground'} ${className || ''}`}
      onClick={toggleListening}
      title={isListening ? "Stop listening" : "Start speaking"}
    >
      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </Button>
  );
}
