import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseReaderProps {
  initialText?: string;
  initialWpm?: number;
  initialFontSize?: number;
}

export function useReader({ initialText = '', initialWpm = 300, initialFontSize = 48 }: UseReaderProps = {}) {
  const [text, setText] = useState<string>(initialText);
  const [words, setWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number>(initialWpm);
  const [fontSize, setFontSize] = useState<number>(initialFontSize);
  
  const timerRef = useRef<number | null>(null);

  // Parse text into words
  useEffect(() => {
    // Simple splitting by whitespace, filtering empty strings
    // We also want to preserve some punctuation attached to words for display
    const parsed = text.split(/\s+/).filter(w => w.length > 0);
    setWords(parsed);
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [text]);

  const togglePlay = useCallback(() => {
    if (words.length === 0) return;
    setIsPlaying(p => !p);
  }, [words.length]);

  const seek = useCallback((index: number) => {
    const target = Math.max(0, Math.min(index, words.length - 1));
    setCurrentIndex(target);
  }, [words.length]);

  // Playback timer logic
  useEffect(() => {
    if (isPlaying && currentIndex < words.length) {
      const msPerWord = (60 / wpm) * 1000;
      
      timerRef.current = window.setTimeout(() => {
        setCurrentIndex(prev => {
          if (prev >= words.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, msPerWord);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentIndex, words.length, wpm]);

  return {
    text,
    setText,
    words,
    currentIndex,
    isPlaying,
    setIsPlaying, // Exposed for external control (e.g. pausing on tab switch)
    togglePlay,
    seek,
    wpm,
    setWpm,
    fontSize,
    setFontSize
  };
}
