export const speak = (text: string) => {
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.rate = 1.0;
  window.speechSynthesis.speak(utter);
};

export const speakText = async (text: string, options?: SpeechSynthesisUtteranceInit): Promise<void> => {
  return new Promise((resolve) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set default options
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Override with custom options
    if (options) {
      Object.assign(utterance, options);
    }
    
    utterance.onend = () => {
      resolve();
    };
    
    utterance.onerror = () => {
      resolve();
    };
    
    window.speechSynthesis.speak(utterance);
  });
};

export const stopSpeech = () => {
  window.speechSynthesis.cancel();
};

export const isSpeaking = (): boolean => {
  return window.speechSynthesis.speaking;
};