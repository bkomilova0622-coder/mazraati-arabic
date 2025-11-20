/**
 * Service to handle Text-to-Speech using browser native API.
 * Previously used Gemini API, now fully offline/static.
 */

export const speakArabic = (text: string): void => {
  if (!window.speechSynthesis) {
    console.warn('Browser does not support speech synthesis');
    return;
  }

  // Cancel any ongoing speech to avoid queuing
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA'; // Arabic
  utterance.rate = 0.9; // Slightly slower for educational purposes
  
  // Attempt to find an Arabic voice
  const voices = window.speechSynthesis.getVoices();
  const arabicVoice = voices.find(v => v.lang.includes('ar'));
  if (arabicVoice) {
    utterance.voice = arabicVoice;
  }

  window.speechSynthesis.speak(utterance);
};
