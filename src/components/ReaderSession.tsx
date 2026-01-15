import React, { useEffect, useRef } from 'react';
import { useReader } from '../hooks/useReader';
import { Sidebar } from './Sidebar';
import { ReaderDisplay } from './ReaderDisplay';
import { Controls } from './Controls';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface ReaderSessionProps {
  initialText: string;
  tabId: string;
  onUpdateText: (id: string, text: string) => void;
  isActive: boolean;
}

export const ReaderSession: React.FC<ReaderSessionProps> = ({ 
  initialText, 
  tabId,
  onUpdateText,
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

  const lastSyncedText = useRef(initialText);

  // Sync text with initialText if it changes from outside
  useEffect(() => {
    // Only update if the incoming initialText is different from what we hold
    if (initialText !== undefined && initialText !== text) {
      setText(initialText);
      lastSyncedText.current = initialText;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialText]); 

  // Sync text changes back to parent
  useEffect(() => {
    if (text !== lastSyncedText.current) {
      onUpdateText(tabId, text);
      lastSyncedText.current = text;
    }
  }, [text, tabId, onUpdateText]);

  // Auto-pause if tab becomes inactive
  useEffect(() => {
    if (!isActive && isPlaying) {
      setIsPlaying(false);
    }
  }, [isActive, isPlaying, setIsPlaying]);

  const currentWord = words[currentIndex] || '';

  if (!isActive) return null;

  return (
    <div style={{ 
      display: 'flex', 
      width: '100%', 
      height: '100%', 
      overflow: 'hidden',
      flexDirection: 'row' 
    }}>
      
      <Sidebar 
        isOpen={isSidebarOpen}
        text={text}
        onUpdateText={setText}
        words={words}
        currentIndex={currentIndex}
        onSeek={seek}
      />

      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        minWidth: 0, // Critical for flex items to prevent overflow
        height: '100%',
        background: 'var(--bg-color)'
      }}>
         {/* Toggle Sidebar Button */}
        <div style={{ 
          position: 'absolute', 
          top: '0.75rem', 
          left: '0.75rem', 
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            style={{ 
              padding: '0.5rem', 
              background: 'rgba(255,255,255,0.05)', 
              borderRadius: '4px',
              border: '1px solid var(--border-color)',
              color: '#888',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>
        </div>

        <div 
          onClick={togglePlay}
          onKeyDown={(e) => {
            if (e.code === 'Space') {
              e.preventDefault();
              togglePlay();
            }
          }}
          tabIndex={0}
          style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: 0, // Critical for nested flex
            cursor: 'pointer',
            outline: 'none'
          }}
          title="Click or press Space to Play/Pause"
        >
          {words.length > 0 ? (
            <ReaderDisplay word={currentWord} fontSize={fontSize} />
          ) : (
            <div style={{ color: '#666', fontSize: '1.2rem' }}>
              Paste text in the sidebar to start reading
            </div>
          )}
        </div>

        <div style={{ flexShrink: 0 }}>
          <Controls 
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            wpm={wpm}
            setWpm={setWpm}
            fontSize={fontSize}
            setFontSize={setFontSize}
          />
        </div>
      </main>
    </div>
  );
};
