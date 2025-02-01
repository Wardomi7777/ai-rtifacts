import { useState, useCallback } from 'react';

interface UseVoiceInputProps {
  onResult: (text: string) => void;
  onError?: (error: string) => void;
  language?: string;
}

export const useVoiceInput = ({ onResult, onError, language = 'en-US' }: UseVoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      onError?.('Speech recognition is not supported in this browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      onError?.(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [onResult, onError, language]);

  return {
    isListening,
    startListening
  };
};