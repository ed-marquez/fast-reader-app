import React, { useEffect } from 'react';
import { useReader } from '../hooks/useReader';
import { Sidebar } from './Sidebar';
import { ReaderDisplay } from './ReaderDisplay';
import { Controls } from './Controls';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface ReaderSessionProps {
  initialText: string;
  onTextChange: (text: string) => void;
  isActive: boolean;
}

// We moved the layout inside here. 
// Actually, `Sidebar` needs to interact with `text`.
export const ReaderSession: React.FC<ReaderSessionProps> = ({ 
  initialText, 
  onTextChange,
  isActive 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  
  const { 
    text, 
    setText, 
    words, 
    currentIndex, 
    isPlaying, 
    setIsPlaying,
    togglePlay, 
    seek, 
    wpm, 
    setWpm, 
    fontSize, 
    setFontSize 
  } = useReader({ initialWpm: 300 });

  // Initialize text on mount
  useEffect(() => {
    if (initialText !== text) {
      setText(initialText);
    }
    // eslint-disable-next-line
  }, []); // Run once on mount

  // Sync text changes back to parent
  useEffect(() => {
    onTextChange(text);
  }, [text, onTextChange]);

  // Auto-pause if tab becomes inactive
  useEffect(() => {
    if (!isActive && isPlaying) {
      setIsPlaying(false);
    }
  }, [isActive, isPlaying, setIsPlaying]);

  const currentWord = words[currentIndex] || '';

  return (
    <div style={{ display: isActive ? 'flex' : 'none', width: '100%', height: '100%' }}>
      
      <Sidebar 
        isOpen={isSidebarOpen}
        text={text}
        onUpdateText={setText}
        words={words}
        currentIndex={currentIndex}
        onSeek={seek}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
         {/* Toggle Sidebar */}
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }}>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: '#666' }}
            title="Toggle Sidebar"
          >
            {isSidebarOpen ? <PanelLeftClose size={24} /> : <PanelLeftOpen size={24} />}
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {words.length > 0 ? (
            <ReaderDisplay word={currentWord} fontSize={fontSize} />
          ) : (
             <div style={{ color: '#666' }}>Paste text in sidebar to begin</div>
          )}
        </div>

        <Controls 
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          wpm={wpm}
          setWpm={setWpm}
          fontSize={fontSize}
          setFontSize={setFontSize}
        />
      </div>
    </div>
  );
};
