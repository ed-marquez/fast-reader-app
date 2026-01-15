import React from 'react';
import { Play, Pause } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  wpm: number;
  setWpm: (wpm: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  isMobile?: boolean; // Optional prop for mobile responsiveness
}

export const Controls: React.FC<ControlsProps> = ({ 
  isPlaying, 
  onTogglePlay, 
  wpm, 
  setWpm, 
  fontSize, 
  setFontSize,
  isMobile = false
}) => {
  return (
    <div className="controls-container" style={{
      display: 'flex',
      flexDirection: 'row', // Always row now for the new mobile design
      gap: isMobile ? '1rem' : '2.5rem',
      alignItems: 'center',
      padding: isMobile ? '1rem 0' : '1.25rem 2rem', // Minimal padding on mobile
      background: isMobile ? 'transparent' : '#111', // Transparent on mobile
      borderTop: isMobile ? 'none' : '1px solid #333',
      width: isMobile ? 'auto' : '100%',
      justifyContent: 'center',
      userSelect: 'none',
      marginBottom: isMobile ? '20px' : '0'
    }}>
      
      {/* Mobile Order: [Speed] [Play] [Size] */}
      
      {/* Speed Slider - Left side on mobile */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        flexDirection: isMobile ? 'column-reverse' : 'row' // Label below on mobile? Or just hide label
      }}>
        {!isMobile && <label style={{ fontSize: '0.85rem', color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Speed</label>}
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <input 
            type="range" 
            min="100" 
            max="1000" 
            step="50" 
            value={wpm} 
            onChange={(e) => setWpm(Number(e.target.value))}
            style={{ 
              width: isMobile ? '80px' : '140px', 
              cursor: 'pointer',
              height: '24px' 
            }}
          />
          {isMobile && <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600, marginTop: '-4px' }}>{wpm}</span>}
        </div>

        {!isMobile && <span style={{ minWidth: '4ch', fontSize: '0.9rem', color: '#ccc', fontWeight: 600 }}>{wpm} <small style={{ fontWeight: 400, color: '#666' }}>WPM</small></span>}
      </div>

      {/* Play Button - Center */}
      <button 
        onClick={onTogglePlay} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          minWidth: isMobile ? '56px' : '110px', 
          height: isMobile ? '56px' : 'auto',
          borderRadius: isMobile ? '50%' : '4px',
          padding: isMobile ? '0' : '0.5rem 1rem',
          justifyContent: 'center',
          background: isPlaying ? 'rgba(255,255,255,0.05)' : 'var(--accent-color)',
          color: isPlaying ? '#fff' : '#fff',
          border: '1px solid ' + (isPlaying ? '#444' : 'var(--accent-color)'),
          boxShadow: isMobile ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
          flexShrink: 0
        }}
        title={isPlaying ? "Pause" : "Play"}
      >
        {isMobile ? (
          isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" style={{ marginLeft: '4px' }} />
        ) : (
          isPlaying ? <><Pause size={18}/> Pause</> : <><Play size={18}/> Play</>
        )}
      </button>

      {/* Font Size Slider - Right side on mobile */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        flexDirection: 'row'
      }}>
        {!isMobile && <span style={{ fontSize: '0.7rem', color: '#666', fontWeight: 500 }} aria-hidden="true">A</span>}
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input 
            type="range" 
            min="24" 
            max={isMobile ? 180 : 400} 
            step="2"
            value={fontSize} 
            onChange={(e) => setFontSize(Number(e.target.value))}
            style={{ 
              width: isMobile ? '80px' : '100px', 
              cursor: 'pointer',
              height: '24px' 
            }}
            title={`Font Size: ${fontSize}px`}
          />
          {isMobile && <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600, marginTop: '-4px' }}>{fontSize}px</span>}
        </div>

        {!isMobile && <span style={{ fontSize: '1.2rem', color: '#666', fontWeight: 700 }} aria-hidden="true">A</span>}
      </div>

    </div>
  );
};
