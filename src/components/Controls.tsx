import React from 'react';
import { Play, Pause, ZoomIn, ZoomOut } from 'lucide-react';

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
      gap: '2rem',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: '#111',
      borderTop: '1px solid #333',
      width: '100%',
      justifyContent: 'center'
    }}>
      <button onClick={onTogglePlay} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '120px', justifyContent: 'center' }}>
        {isPlaying ? <><Pause size={20}/> Pause</> : <><Play size={20}/> Play</>}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <label style={{ fontSize: '0.9rem', color: '#888' }}>Speed (WPM)</label>
        <input 
          type="range" 
          min="60" 
          max="900" 
          step="10" 
          value={wpm} 
          onChange={(e) => setWpm(Number(e.target.value))}
          style={{ width: '150px' }}
        />
        <span style={{ minWidth: '3ch', textAlign: 'left' }}>{wpm}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button onClick={() => setFontSize(Math.max(12, fontSize - 4))} title="Zoom Out">
          <ZoomOut size={20} />
        </button>
        <button onClick={() => setFontSize(Math.min(200, fontSize + 4))} title="Zoom In">
          <ZoomIn size={20} />
        </button>
      </div>
    </div>
  );
};
