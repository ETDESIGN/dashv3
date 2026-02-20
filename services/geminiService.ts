import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

// --- TEXT GENERATION ---
export const generateText = async (prompt: string, model: string = 'gemini-3-flash-preview') => {
  if (!process.env.API_KEY) throw new Error("API Key not found");
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
  });
  return response.text;
};

// --- TTS GENERATION ---
export const generateSpeech = async (text: string, voiceName: string = 'Kore') => {
  if (!process.env.API_KEY) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio data returned");
  return base64Audio;
};

// --- LIVE API HELPERS ---

// Audio Encoding/Decoding Utils
export const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

export const base64ToArrayBuffer = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const blobToPcm = async (blob: Blob): Promise<ArrayBuffer> => {
  return await blob.arrayBuffer();
};

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export const createPcmBlob = (data: Float32Array): { data: string; mimeType: string } => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = Math.max(-32768, Math.min(32767, data[i] * 32768));
    }
    
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
}

export class GeminiLiveClient {
  private ai: GoogleGenAI;
  private sessionPromise: Promise<any> | null = null;
  
  constructor() {
    if (!process.env.API_KEY) throw new Error("API Key not found");
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  connect(
    callbacks: {
      onopen?: () => void;
      onmessage?: (message: LiveServerMessage) => void;
      onclose?: (e: CloseEvent) => void;
      onerror?: (e: ErrorEvent) => void;
    },
    config?: any
  ) {
    this.sessionPromise = this.ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        systemInstruction: "You are the NB Studio AI Operations Assistant. Helpful, concise, and professional.",
        ...config
      }
    });
    return this.sessionPromise;
  }

  async sendRealtimeInput(data: { media: { data: string; mimeType: string } }) {
    if (this.sessionPromise) {
      const session = await this.sessionPromise;
      session.sendRealtimeInput(data);
    }
  }

  async disconnect() {
     this.sessionPromise = null;
  }
}