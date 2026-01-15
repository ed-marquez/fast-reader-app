import React from 'react';
import { Play, Pause } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  wpm: number;
  setWpm: (wpm: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({ 
  isPlaying, 
  onTogglePlay, 
  wpm, 
  setWpm, 
  fontSize, 
  setFontSize 
}) => {
  return (
    <div className="controls-container" style={{
      display: 'flex',
      gap: '2.5rem',
      alignItems: 'center',
      padding: '1.25rem 2rem',
      background: '#111',
      borderTop: '1px solid #333',
      width: '100%',
      justifyContent: 'center',
      userSelect: 'none'
    }}>
      <button 
        onClick={onTogglePlay} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          minWidth: '110px', 
          justifyContent: 'center',
          background: isPlaying ? 'rgba(255,255,255,0.05)' : 'var(--accent-color)',
          color: isPlaying ? '#fff' : '#fff',
          border: '1px solid ' + (isPlaying ? '#444' : 'var(--accent-color)')
        }}
      >
        {isPlaying ? <><Pause size={18}/> Pause</> : <><Play size={18}/> Play</>}
      </button>

      {/* Speed Slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <label style={{ fontSize: '0.85rem', color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Speed</label>
        <input 
          type="range" 
          min="100" 
          max="1000" 
          step="50" 
          value={wpm} 
          onChange={(e) => setWpm(Number(e.target.value))}
          style={{ width: '140px', cursor: 'pointer' }}
        />
        <span style={{ minWidth: '4ch', fontSize: '0.9rem', color: '#ccc', fontWeight: 600 }}>{wpm} <small style={{ fontWeight: 400, color: '#666' }}>WPM</small></span>
      </div>

      {/* Font Size Slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <span style={{ fontSize: '0.7rem', color: '#666', fontWeight: 500, userSelect: 'none' }} aria-hidden="true">A</span>
        <input 
          type="range" 
          min="24" 
          max="400" 
          step="2"
          value={fontSize} 
          onChange={(e) => setFontSize(Number(e.target.value))}
          style={{ width: '100px', cursor: 'pointer' }}
          title={`Font Size: ${fontSize}px`}
        />
        <span style={{ fontSize: '1.2rem', color: '#666', fontWeight: 700 }} aria-hidden="true">A</span>
      </div>
    </div>
  );
};
