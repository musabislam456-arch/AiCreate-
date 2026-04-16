import { GoogleGenAI, Type } from '@google/genai';

// API Keys
const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
const openrouterKey = process.env.OPENROUTER_API_KEY || (import.meta as any).env?.VITE_OPENROUTER_API_KEY;
const groqKey = process.env.GROQ_API_KEY || (import.meta as any).env?.VITE_GROQ_API_KEY;
const githubToken = process.env.GITHUB_TOKEN || (import.meta as any).env?.VITE_GITHUB_TOKEN;

export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export type AIModel = 
  | 'Gemini' 
  | 'Nemotron' 
  | 'GLM-4.5' 
  | 'GPT-OSS-Free' 
  | 'GPT-OSS-Groq' 
  | 'Llama-3.1' 
  | 'Llama-3.3' 
  | 'Qwen-3' 
  | 'GPT-5' 
  | 'Grok-3' 
  | 'DeepSeek-V3' 
  | 'Auto';

const PROVIDER_CONFIG: Record<string, { provider: 'openrouter' | 'groq' | 'github' | 'gemini', model: string, reasoning?: boolean }> = {
  'Gemini': { provider: 'gemini', model: 'models/gemini-2.0-flash' },
  'Nemotron': { provider: 'openrouter', model: 'nvidia/nemotron-3-super-120b-a12b:free', reasoning: true },
  'GLM-4.5': { provider: 'openrouter', model: 'z-ai/glm-4.5-air:free' },
  'GPT-OSS-Free': { provider: 'openrouter', model: 'openai/gpt-oss-120b:free', reasoning: true },
  'GPT-OSS-Groq': { provider: 'groq', model: 'openai/gpt-oss-120b' },
  'Llama-3.1': { provider: 'groq', model: 'llama-3.1-8b-instant' },
  'Llama-3.3': { provider: 'groq', model: 'llama-3.3-70b-versatile' },
  'Qwen-3': { provider: 'groq', model: 'qwen/qwen3-32b' },
  'GPT-5': { provider: 'github', model: 'openai/gpt-5' },
  'Grok-3': { provider: 'github', model: 'xai/grok-3' },
  'DeepSeek-V3': { provider: 'github', model: 'deepseek/DeepSeek-V3-0324' },
};

function isModelAvailable(model: AIModel): boolean {
  if (model === 'Auto') return true;
  const config = PROVIDER_CONFIG[model];
  if (!config) return false;
  
  switch (config.provider) {
    case 'gemini': return !!apiKey;
    case 'openrouter': return !!openrouterKey;
    case 'groq': return !!groqKey;
    case 'github': return !!githubToken;
    default: return false;
  }
}

async function callExternalAI(prompt: string, config: { provider: string, model: string, reasoning?: boolean }): Promise<string> {
  let url = '';
  let headers: Record<string, string> = { 'Content-Type': 'application/json' };
  let body: any = {
    model: config.model,
    messages: [{ role: 'user', content: prompt }]
  };

  if (config.provider === 'openrouter') {
    if (!openrouterKey) throw new Error('OpenRouter API key is missing.');
    url = 'https://openrouter.ai/api/v1/chat/completions';
    headers['Authorization'] = `Bearer ${openrouterKey}`;
    if (config.reasoning) {
      body.reasoning = { enabled: true };
    }
  } else if (config.provider === 'groq') {
    if (!groqKey) throw new Error('Groq API key is missing.');
    url = 'https://api.groq.com/openai/v1/chat/completions';
    headers['Authorization'] = `Bearer ${groqKey}`;
  } else if (config.provider === 'github') {
    if (!githubToken) throw new Error('GitHub Token is missing.');
    url = 'https://models.github.ai/inference/chat/completions';
    headers['Authorization'] = `Bearer ${githubToken}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    const message = data.choices[0].message;
    
    let result = message.content || '';
    if (message.reasoning_details) {
      // If there's reasoning, we can prepend it or just return content. 
      // User example shows preserving it for next call, but for UI we usually want the content.
      // We'll just return the content for now.
    }
    
    return result;
  } catch (error: any) {
    console.error(`Error calling ${config.provider}:`, error);
    throw error;
  }
}

export async function generateAIResponse(prompt: string, selectedModel: AIModel = 'Nemotron', useSearch: boolean = false, answerMode: 'short' | 'detailed' = 'short'): Promise<string> {
  const modeInstruction = answerMode === 'short' 
    ? "IMPORTANT: Provide a quick, short, and concise answer. Do not be overly detailed."
    : "IMPORTANT: Provide a very long, detailed, and comprehensive answer. Explain thoroughly.";

  const enhancedPrompt = prompt + "\n\n" + modeInstruction;

  const modelsToTry: AIModel[] = [];
  
  if (selectedModel === 'Auto') {
    // Priority list for Auto mode
    const candidates: AIModel[] = ['Gemini', 'Nemotron', 'Llama-3.3', 'GPT-5'];
    for (const m of candidates) {
      if (isModelAvailable(m)) modelsToTry.push(m);
    }
    // If no keys are set, we push Gemini anyway to show the "missing key" error at the end
    if (modelsToTry.length === 0) modelsToTry.push('Gemini');
  } else {
    modelsToTry.push(selectedModel);
    // Add Gemini as a fallback if it's available and not the primary choice
    if (selectedModel !== 'Gemini' && isModelAvailable('Gemini')) {
      modelsToTry.push('Gemini');
    }
  }

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      if (model === 'Gemini') {
        if (!apiKey || !ai) throw new Error('Gemini API key is missing. Please add GEMINI_API_KEY to your environment.');
        
        const response = await ai.models.generateContent({
          model: 'models/gemini-2.0-flash',
          contents: [{ role: 'user', parts: [{ text: enhancedPrompt }] }],
        });
        return response.text || '';
      } else {
        const config = PROVIDER_CONFIG[model];
        if (!config) throw new Error(`Unknown model: ${model}`);
        
        // Check key before calling to provide a better error if this was the ONLY model requested
        if (!isModelAvailable(model)) {
          const providerName = config.provider.charAt(0).toUpperCase() + config.provider.slice(1);
          throw new Error(`${providerName} API key is missing for model ${model}.`);
        }

        return await callExternalAI(enhancedPrompt, config);
      }
    } catch (error: any) {
      // Only log as error if it's not the last model or if it's a real failure (not just missing key in Auto mode)
      if (modelsToTry.length > 1 && model !== modelsToTry[modelsToTry.length - 1]) {
        console.warn(`Model ${model} failed, trying fallback...`, error.message || error);
      } else {
        console.error(`Model ${model} failed:`, error);
      }
      lastError = error;
      continue;
    }
  }

  throw lastError || new Error('All AI models failed to respond. Please check your API keys.');
}

function formatGeminiError(error: any, fallbackMessage: string): Error {
  const msg = error?.message || String(error) || '';
  
  if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota') || msg.includes('429')) {
    return new Error('AI quota exceeded. Please wait a minute and try again (Free tier limit reached).');
  }
  
  if (msg.includes('API key not valid') || msg.includes('API_KEY_INVALID')) {
    return new Error('Invalid API key. Please check your Gemini API key configuration.');
  }

  try {
    const match = msg.match(/\{.*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (parsed.error?.message) {
        return new Error(`${fallbackMessage}: ${parsed.error.message}`);
      }
    }
  } catch (e) {}

  if (msg.length > 150) {
    return new Error(`${fallbackMessage}: ${msg.substring(0, 150)}...`);
  }

  return new Error(`${fallbackMessage}: ${msg || 'Unknown error'}`);
}

export async function generateContent(prompt: string, model: AIModel = 'Nemotron', answerMode: 'short' | 'detailed' = 'short') {
  try {
    return await generateAIResponse(prompt, model, false, answerMode);
  } catch (error: any) {
    console.error('Error generating content:', error);
    throw error;
  }
}

export async function generateContentWithSearch(prompt: string, model: AIModel = 'Nemotron', answerMode: 'short' | 'detailed' = 'short') {
  // If model is not Gemini/Auto, we use external AI (search is handled by prompt if needed, 
  // but Puter's search is removed, so we just rely on model knowledge or specific search tools if available)
  return await generateAIResponse(prompt, model, true, answerMode);
}

export async function analyzeThumbnails(images: { data: string, mimeType: string }[], context: string, model: AIModel = 'Nemotron') {
  // Vision tasks are currently only supported by Gemini in this app
  try {
    if (!apiKey || !ai) throw new Error('Gemini API key is missing.');
    const parts: any[] = images.map(img => ({
      inlineData: {
        data: img.data.split(',')[1], // Remove data:image/jpeg;base64, prefix
        mimeType: img.mimeType
      }
    }));
    
    parts.push({
      text: `Analyze these YouTube thumbnails for a video about: "${context}". 
      Evaluate them based on:
      1. Clarity and readability (especially on small screens)
      2. Emotional impact and curiosity gap
      3. Contrast and color theory
      4. Overall click-through rate (CTR) potential
      
      Rank them from best to worst, and provide specific reasons why the top one is the winner, and how the others could be improved.`
    });

    const response = await ai.models.generateContent({
      model: 'models/gemini-2.0-flash',
      contents: [{ role: 'user', parts }]
    });
    return response.text;
  } catch (error: any) {
    console.error('Error analyzing thumbnails:', error);
    // If it's a quota error, we can't really fallback to Puter for vision
    throw formatGeminiError(error, 'Failed to analyze thumbnails');
  }
}

function parseJSONResponse(text: string) {
  try {
    // Remove markdown code blocks if present
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (e) {
    console.error('Failed to parse JSON response:', text);
    throw new Error('Invalid JSON response from AI');
  }
}

export async function analyzeChannel(statsOrUrl: string, language: string = 'English', model: AIModel = 'Nemotron') {
  try {
    const isUrl = statsOrUrl.startsWith('http');
    const prompt = `Act as an expert YouTube data analyst. Analyze the following channel ${isUrl ? 'URL' : 'statistics/context'}.
    
    CRITICAL INSTRUCTIONS FOR ACCURACY:
    1. Search for the EXACT, CURRENT statistics for this channel using web search.
    2. Look for subscriber count, total video views, and recent upload performance.
    3. Provide a detailed, actionable growth plan based on their actual content style and niche.
    4. Return the response in JSON format.
    
    Format:
    {
      "channelName": "string",
      "totalSubscribers": "string",
      "totalViews": "string",
      "totalVideos": "string",
      "mostViewedVideo": { "title": "string", "url": "string" },
      "monetizationStatus": "Monetized" | "Not Monetized",
      "audienceInsights": {
        "topCountries": [
          { "country": "string", "percentage": number }
        ]
      },
      "similarChannels": [
        { "name": "string", "url": "string" }
      ],
      "historicalData": [
        { "month": "string", "subscribers": number, "views": number }
      ]
    }

    Language: ${language}
    Channel Info: ${statsOrUrl}`;

    // For Channel Analysis, we prefer models with search capabilities
    const preferredModel = model === 'Auto' ? 'Nemotron' : model;
    
    try {
      const resText = await generateAIResponse(prompt + "\nIMPORTANT: Return ONLY valid JSON. Use web search to find real data.", preferredModel, true);
      return parseJSONResponse(resText);
    } catch (e) {
      // Fallback to Gemini if search fails or other error
    if (apiKey && ai) {
        const response = await ai.models.generateContent({
          model: 'models/gemini-2.0-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          // @ts-ignore
          tools: isUrl ? [{ googleSearch: {} }] : undefined,
        });
        return parseJSONResponse(response.text || '{}');
      }
      throw e;
    }
  } catch (error: any) {
    console.error('Error analyzing channel:', error);
    throw error;
  }
}

export async function generateMetadata(topic: string, language: string = 'English', model: AIModel = 'Nemotron') {
  try {
    const prompt = `Generate a complete YouTube metadata package for a video about: "${topic}". 
    Return the response in JSON format.
    
    Format:
    {
      "titles": ["string"],
      "description": "string",
      "tags": ["string"],
      "keywords": ["string"],
      "thumbnailPrompts": ["string"]
    }
    
    Language: ${language}`;

    if (model === 'Gemini' || model === 'Auto') {
      try {
        if (!apiKey || !ai) throw new Error('Gemini API key is missing.');
        const response = await ai.models.generateContent({
          model: 'models/gemini-2.0-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: { responseMimeType: "application/json" }
        });
        return parseJSONResponse(response.text || '{}');
      } catch (e) {
        if (model === 'Gemini') throw e;
      }
    }

    const resText = await generateAIResponse(prompt + "\nIMPORTANT: Return ONLY valid JSON.", model);
    return parseJSONResponse(resText);
  } catch (error: any) {
    console.error('Error generating metadata:', error);
    throw error;
  }
}

export async function chatWithAssistant(message: string, history: {role: string, text: string}[], language: string = 'English', model: AIModel = 'Nemotron') {
  try {
    let fullMessage = `System Instruction: You are an expert YouTube and social media growth assistant. Provide highly actionable, strategic, and encouraging responses. Always respond in ${language}.\n\n`;
    
    if (history.length > 0) {
      const historyContext = history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n');
      fullMessage += `Previous conversation:\n${historyContext}\n\n`;
    }
    
    fullMessage += `User: ${message}`;

    return await generateAIResponse(fullMessage, model);
  } catch (error: any) {
    console.error('Error chatting with assistant:', error);
    throw error;
  }
}

export async function generateAdvancedScript(topic: string, category: string, types: string[], length: string, language: string, model: AIModel = 'Nemotron', format: 'Full' | 'Paragraph' = 'Full') {
  try {
    const prompt = format === 'Paragraph' 
      ? `Write a highly engaging video script about "${topic}" as a single, long, detailed paragraph.
         Category/Niche: ${category}
         Script Elements to include: ${types.join(', ')}
         Target Duration: ${length}
         Language: ${language}
         Do not use headings or timestamps. Just one continuous, engaging narrative paragraph.`
      : `Write a highly engaging video script about "${topic}".
         Category/Niche: ${category}
         Script Elements to include: ${types.join(', ')}
         Target Duration: ${length}
         Language: ${language}
         Format the output with clear headings (e.g., [Intro], [Body], [Outro]) and estimated timestamps (e.g., [0:00 - 0:15]).
         Make sure the pacing matches the target duration.
         This should be a complete, full-length script.`;
    
    return await generateAIResponse(prompt, model);
  } catch (error: any) {
    console.error('Error generating advanced script:', error);
    throw error;
  }
}

export async function generateScriptPart(
  topic: string, 
  category: string, 
  types: string[], 
  length: string, 
  language: string, 
  partNumber: number, 
  totalParts: number, 
  previousParts: string[], 
  model: AIModel = 'Nemotron'
) {
  try {
    const prompt = `Write Part ${partNumber} of ${totalParts} for a highly engaging video script about "${topic}".
    Category/Niche: ${category}
    Script Elements to include: ${types.join(', ')}
    Target Duration for this part: Approximately ${length}
    Language: ${language}
    
    ${previousParts.length > 0 ? `Previous parts for context to ensure continuity:\n${previousParts.join('\n\n')}` : 'This is the first part of the script.'}
    
    Format the output with clear headings and estimated timestamps.
    Make this part detailed, long, and engaging. Ensure it flows naturally from previous parts if any.`;
    
    return await generateAIResponse(prompt, model);
  } catch (error: any) {
    console.error(`Error generating script part ${partNumber}:`, error);
    throw error;
  }
}

export async function textToSpeech(text: string, voice: string = 'alloy', responseFormat: string = 'mp3') {
  // Puter removed. Using Web Speech API as fallback.
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
    return { play: () => window.speechSynthesis.speak(utterance) };
  } catch (error: any) {
    console.error('TTS Error:', error);
    throw new Error('Failed to play audio. Please try again.');
  }
}
export async function generateVisualPrompts(script: string, duration: string, promptLanguage: string = 'English', voiceoverLanguage: string = 'English', model: AIModel = 'Nemotron') {
  try {
    const prompt = `You are an expert video editor and director. Break down the following script into visual scenes. Each scene should be approximately ${duration} long.
      
      Format the output as a JSON array of objects, where each object has:
      - "voiceover": The exact text spoken in the scene, translated to ${voiceoverLanguage}.
      - "visualPrompt": A highly detailed prompt for an AI image/video generator (like Midjourney or Runway) describing what is seen on screen, written in ${promptLanguage}.
      
      Script:
      "${script}"
      
      IMPORTANT: Return ONLY a valid JSON array.`;

    if (model === 'Gemini' || model === 'Auto') {
      try {
        if (!apiKey || !ai) throw new Error('Gemini API key is missing.');
        const response = await ai.models.generateContent({
          model: 'models/gemini-2.0-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  voiceover: { type: Type.STRING },
                  visualPrompt: { type: Type.STRING }
                },
                required: ["voiceover", "visualPrompt"]
              }
            }
          }
        });
        return parseJSONResponse(response.text || '[]');
      } catch (e) {
        if (model === 'Gemini') throw e;
      }
    }

    const resText = await generateAIResponse(prompt, model);
    return parseJSONResponse(resText);
  } catch (error: any) {
    console.error('Error generating visual prompts:', error);
    throw error;
  }
}
