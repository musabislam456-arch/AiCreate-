import { GoogleGenAI, Type } from '@google/genai';

// Support both AI Studio (process.env) and Vercel (import.meta.env)
const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn('GEMINI_API_KEY is missing. AI features will not work.');
}

export const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

// Puter.js integration
declare global {
  interface Window {
    puter: any;
  }
}

export type AIModel = 'Gemini' | 'ChatGPT' | 'Claude' | 'DeepSeek' | 'DeepSeek-Reasoner' | 'Grok' | 'Auto';

const MODEL_MAPPING: Record<string, string> = {
  'ChatGPT': 'openai/gpt-5.2-chat',
  'Claude': 'claude-sonnet-4.5',
  'DeepSeek': 'deepseek-v3.2',
  'DeepSeek-Reasoner': 'deepseek-reasoner',
  'Grok': 'grok-4-fast',
};

async function callPuter(prompt: string, model: string = 'openai/gpt-5.2-chat', useSearch: boolean = false): Promise<string> {
  if (!window.puter) {
    throw new Error('Puter.js not loaded. Please refresh the page.');
  }

  try {
    const options: any = {
      model: model,
      stream: true
    };

    if (useSearch) {
      options.tools = [{ type: "web_search" }];
    }

    // Puter.js ai.chat can sometimes fail if the model is not supported or quota is hit
    const response = await window.puter.ai.chat(prompt, options);

    if (!response) {
      throw new Error('No response from Puter AI');
    }

    let result = "";
    
    // Check if response is an async iterable (for streaming)
    if (Symbol.asyncIterator in Object(response)) {
      for await (const part of response) {
        // Handle both text and reasoning (for DeepSeek models)
        const text = part?.text || part?.choices?.[0]?.delta?.content || "";
        const reasoning = part?.reasoning || "";
        
        if (reasoning) {
          result += reasoning + "\n";
        }
        result += text;
      }
    } else {
      // Fallback for non-streaming response
      result = response.text || response.message?.content || response.choices?.[0]?.message?.content || String(response);
    }

    if (!result) {
      throw new Error('Puter AI returned an empty response');
    }

    return result;
  } catch (error: any) {
    console.error('Detailed Puter API Error:', error);
    
    // Extract more meaningful error message if possible
    let errorMessage = 'Unknown error';
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error?.message) {
      errorMessage = error.message;
    } else if (error?.error?.message) {
      errorMessage = error.error.message;
    } else if (typeof error === 'object') {
      try {
        errorMessage = JSON.stringify(error);
      } catch (e) {
        errorMessage = 'Complex error object (check console)';
      }
    }

    throw new Error(`Puter API Error: ${errorMessage}`);
  }
}

export async function generateAIResponse(prompt: string, selectedModel: AIModel = 'ChatGPT', useSearch: boolean = false): Promise<string> {
  // Ensure long and detailed responses unless ChatGPT is used (which should be short and fast as per user request)
  const isChatGPT = selectedModel === 'ChatGPT';
  const enhancedPrompt = isChatGPT 
    ? prompt + "\n\nIMPORTANT: Provide a quick, short, and fast response. Be concise but helpful."
    : prompt + "\n\nIMPORTANT: Provide a very long, detailed, and comprehensive response. Do not be brief.";

  const modelsToTry: AIModel[] = [];
  
  if (selectedModel === 'Auto') {
    modelsToTry.push('ChatGPT', 'Gemini', 'Claude', 'DeepSeek');
  } else {
    modelsToTry.push(selectedModel);
    // Add fallbacks if the primary choice fails
    if (selectedModel !== 'ChatGPT') modelsToTry.push('ChatGPT');
    if (selectedModel !== 'Gemini') modelsToTry.push('Gemini');
  }

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      if (model === 'Gemini') {
        if (!apiKey) throw new Error('Gemini API key is missing.');
        
        const response = await ai.models.generateContent({
          model: 'models/gemini-2.0-flash',
          contents: [{ role: 'user', parts: [{ text: enhancedPrompt }] }],
        });
        return response.text || '';
      } else {
        const puterModel = MODEL_MAPPING[model] || 'openai/gpt-5.2-chat';
        return await callPuter(enhancedPrompt, puterModel, useSearch);
      }
    } catch (error: any) {
      console.error(`Model ${model} failed:`, error);
      lastError = error;
      // Continue to next model in the list
      continue;
    }
  }

  // If we reach here, all tried models failed
  throw lastError || new Error('All AI models failed to respond. Please check your connection.');
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

export async function generateContent(prompt: string, model: AIModel = 'ChatGPT') {
  try {
    return await generateAIResponse(prompt, model);
  } catch (error: any) {
    console.error('Error generating content:', error);
    throw error;
  }
}

export async function generateContentWithSearch(prompt: string, model: AIModel = 'ChatGPT') {
  // If model is not Gemini/Auto, we use Puter's web search
  if (model !== 'Gemini' && model !== 'Auto') {
    return await generateAIResponse(prompt, model, true);
  }

  try {
    if (!apiKey) throw new Error('API key is missing.');
    const response = await ai.models.generateContent({
      model: 'models/gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      // @ts-ignore - tools might not be in the type definition but supported by API
      tools: [{ googleSearch: {} }],
    });
    return response.text || '';
  } catch (error: any) {
    return await generateAIResponse(prompt, model, true);
  }
}

export async function analyzeThumbnails(images: { data: string, mimeType: string }[], context: string, model: AIModel = 'ChatGPT') {
  // Vision tasks are currently only supported by Gemini in this app
  // If model is not Gemini/Auto, we fallback to Gemini anyway or error out
  // But for now, we'll try to use Gemini and fallback to a text-only analysis if needed?
  // Actually, Puter doesn't support vision easily in this simple way.
  // We'll keep Gemini for vision but use the routing for the text part if possible.
  
  try {
    if (!apiKey) throw new Error('API key is missing.');
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
      model: 'models/gemini-2.0-flash', // Use 2.0 flash for vision
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

export async function analyzeChannel(statsOrUrl: string, language: string = 'English', model: AIModel = 'ChatGPT') {
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
      "subscribers": "string",
      "totalViews": "string",
      "mostViewedVideo": "string",
      "topAudienceCountry": "string",
      "isMonetized": boolean,
      "youtubeRanking": "string",
      "similarChannels": ["string"],
      "growthPlan": "string",
      "historicalData": [{"month": "string", "subscribers": number, "views": number, "audienceRetention": number}]
    }

    Language: ${language}
    Channel Info: ${statsOrUrl}`;

    // For Channel Analysis, we prefer models with search capabilities
    const preferredModel = model === 'Auto' ? 'ChatGPT' : model;
    
    try {
      const resText = await generateAIResponse(prompt + "\nIMPORTANT: Return ONLY valid JSON. Use web search to find real data.", preferredModel, true);
      return parseJSONResponse(resText);
    } catch (e) {
      // Fallback to Gemini if search fails or other error
      if (apiKey) {
        const response = await ai.models.generateContent({
          model: 'models/gemini-2.0-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          // @ts-ignore
          tools: isUrl ? [{ googleSearch: {} }] : undefined,
          config: { responseMimeType: "application/json" }
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

export async function generateMetadata(topic: string, language: string = 'English', model: AIModel = 'ChatGPT') {
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
        if (!apiKey) throw new Error('API key is missing.');
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

export async function chatWithAssistant(message: string, history: {role: string, text: string}[], language: string = 'English', model: AIModel = 'ChatGPT') {
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

export async function generateAdvancedScript(topic: string, category: string, types: string[], length: string, language: string, model: AIModel = 'ChatGPT', format: 'Full' | 'Paragraph' = 'Full') {
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
  model: AIModel = 'ChatGPT'
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

export async function textToSpeech(text: string) {
  if (!window.puter) {
    throw new Error('Puter.js not loaded.');
  }
  try {
    // Puter.js txt2speech returns an HTMLAudioElement
    const audio = await window.puter.ai.txt2speech(text);
    if (audio && typeof audio.play === 'function') {
      audio.play();
      return audio;
    } else {
      throw new Error('Invalid audio object returned from Puter');
    }
  } catch (error: any) {
    console.error('TTS Error:', error);
    throw new Error('Failed to play audio. Please try again.');
  }
}
export async function generateVisualPrompts(script: string, duration: string, promptLanguage: string = 'English', voiceoverLanguage: string = 'English', model: AIModel = 'ChatGPT') {
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
        if (!apiKey) throw new Error('API key is missing.');
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
