import React, { useEffect, useRef } from 'react';
import { useReader } from '../hooks/useReader';
import { useIsMobile } from '../hooks/useIsMobile';
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
  const isMobile = useIsMobile();
  
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
  } = useReader({ initialText, initialWpm: 300 });

  const lastSyncedText = useRef(text);

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

  // Global keyboard listener for spacebar
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't toggle play if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, togglePlay]);

  // Auto-pause if tab becomes inactive
  useEffect(() => {
    if (!isActive && isPlaying) {
      setIsPlaying(false);
    }
  }, [isActive, isPlaying, setIsPlaying]);

  const currentWord = words[currentIndex] || '';

  return (
    <div style={{ 
      display: isActive ? 'flex' : 'none', 
      width: '100%', 
      height: '100%', 
      overflow: 'hidden',
      flexDirection: isMobile ? 'column' : 'row' 
    }}>
      
      {/* On mobile, we want Main (reading) ON TOP, Sidebar (library) ON BOTTOM.
          But in the DOM structure, we can keep them in order and use Flexbox `order` or just swap them conditionally.
          Swapping conditionally is cleaner for logic flow here. */}
      
      {!isMobile && (
        <Sidebar 
          isOpen={isSidebarOpen}
          text={text}
          onUpdateText={setText}
          words={words}
          currentIndex={currentIndex}
          onSeek={seek}
          isMobile={false}
        />
      )}

      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        minWidth: 0, 
        minHeight: 0,
        height: '100%',
        background: 'var(--bg-color)',
        // Mobile changes: we don't use 'order' anymore, we use DOM structure for cleaner stacking
        // On desktop, this is just the main pane.
      }}>
         {/* Toggle Sidebar Button - Position differently on mobile */}
        {!isMobile && (
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
              title="Expand Sidebar"
            >
               {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
          </div>
        )}

        <div 
          onClick={togglePlay}
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

        {/* Mobile: Sidebar is injected HERE, between Reader and Controls */}
        {/* But strictly speaking, if we want Sidebar to act as a collapsible pane that pushes content,
            and Controls to be pinned bottom, we should put Sidebar here. */}
        {isMobile && (
          <Sidebar 
            isOpen={isSidebarOpen}
            text={text}
            onUpdateText={setText}
            words={words}
            currentIndex={currentIndex}
            onSeek={seek}
            isMobile={true}
          />
        )}

        <div style={{ flexShrink: 0 }}>
          <Controls 
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            wpm={wpm}
            setWpm={setWpm}
            fontSize={fontSize}
            setFontSize={setFontSize}
            isMobile={isMobile}
          />
        </div>
      </main>

      {/* Desktop Sidebar (Left side) */}
      {/* Mobile Sidebar is removed from here */}
    </div>
  );
};
