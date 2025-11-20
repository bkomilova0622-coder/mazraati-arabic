import { GoogleGenAI, Modality } from "@google/genai";

// Singleton audio context
let audioContext: AudioContext | null = null;
const audioCache: Map<string, AudioBuffer> = new Map();

// Initialize AudioContext lazily on user interaction to comply with browser autoplay policies
export const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 24000, // Gemini TTS typical sample rate
    });
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

// Helper to decode Base64 string to Uint8Array
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to decode PCM/Audio data
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  // The API returns raw PCM or encoded audio.
  // If using 'gemini-2.5-flash-preview-tts', it returns raw audio data usually.
  // However, standard browser decodeAudioData is safer if the format is somewhat standard or if we construct a WAV header.
  // But Gemini 2.5 Flash TTS example uses manual decoding for raw PCM if strictly PCM is sent.
  // The "Generate Speech" example in documentation implies `decodeAudioData` usage on the context
  // which expects a file format (mp3/wav) OR raw buffers if manually handled.
  // For simple usage with this specific model, let's assume we need to create an AudioBuffer from raw samples
  // if the output is raw PCM.
  
  // HOWEVER, the official example code provided in the system prompt uses `decodeAudioData` 
  // on the context with the *decoded string*. This implies the API returns a file format structure 
  // or the example assumes `decodeAudioData` can handle the stream format. 
  //
  // Let's try strict browser decoding first (safest for MP3/WAV wrapped data).
  // If that fails, we fall back to raw PCM decoding.

  try {
    // copy buffer because decodeAudioData detaches it
    const bufferCopy = data.buffer.slice(0);
    return await ctx.decodeAudioData(bufferCopy);
  } catch (e) {
    console.warn("Browser decodeAudioData failed, attempting manual PCM decode...", e);
    // Fallback to manual PCM 16-bit decoding
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
  }
}

export const speakArabic = async (text: string): Promise<void> => {
  const ctx = initAudioContext();
  
  // Check cache first
  if (audioCache.has(text)) {
    playBuffer(ctx, audioCache.get(text)!);
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // 'Kore' is a good standard voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error("No audio data received from Gemini.");
    }

    const audioBytes = decodeBase64(base64Audio);
    const audioBuffer = await decodeAudioData(audioBytes, ctx, 24000, 1);

    // Cache it
    audioCache.set(text, audioBuffer);

    playBuffer(ctx, audioBuffer);

  } catch (error) {
    console.error("Error generating speech:", error);
    // Fallback to browser TTS if API fails
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    window.speechSynthesis.speak(utterance);
  }
};

function playBuffer(ctx: AudioContext, buffer: AudioBuffer) {
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start();
}
