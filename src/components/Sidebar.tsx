import React, { useState } from 'react';
import { Edit2, BookOpen } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  words: string[];
  currentIndex: number;
  onSeek: (index: number) => void;
  onUpdateText: (text: string) => void;
  text: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  words, 
  currentIndex, 
  onSeek, 
  onUpdateText,
  text
}) => {
  const [isEditing, setIsEditing] = useState(true);

  if (!isOpen) return null;

  return (
    <div style={{
      width: '350px',
      height: '100%',
      background: 'var(--sidebar-bg)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        padding: '1rem', 
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Library</h2>
        <button onClick={() => setIsEditing(!isEditing)} style={{ padding: '0.4rem' }} title={isEditing ? "Read View" : "Edit Text"}>
          {isEditing ? <BookOpen size={18} /> : <Edit2 size={18} />}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {isEditing ? (
          <textarea
            value={text}
            onChange={(e) => onUpdateText(e.target.value)}
            placeholder="Paste your text here..."
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
              color: 'var(--text-color)',
              border: 'none',
              resize: 'none',
              outline: 'none',
              fontSize: '1rem',
              lineHeight: '1.6'
            }}
          />
        ) : (
          <div style={{ lineHeight: '1.8', fontSize: '1rem' }}>
            {words.map((word, i) => (
              <span
                key={i}
                onClick={() => onSeek(i)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: i === currentIndex ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
                  color: i === currentIndex ? '#3b82f6' : 'inherit',
                  borderRadius: '2px',
                  padding: '0 2px',
                  transition: 'background-color 0.1s'
                }}
              >
                {word}{' '}
              </span>
            ))}
            {words.length === 0 && <span style={{ color: '#666' }}>No text content. Switch to edit mode to add text.</span>}
          </div>
        )}
      </div>
    </div>
  );
};
