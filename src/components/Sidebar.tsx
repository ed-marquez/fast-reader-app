import React, { useState, useEffect } from 'react';
import { Edit2, BookOpen } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  words: string[];
  currentIndex: number;
  onSeek: (index: number) => void;
  onUpdateText: (text: string) => void;
  text: string;
  isMobile?: boolean; // Optional prop for mobile responsiveness
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  words, 
  currentIndex, 
  onSeek, 
  onUpdateText,
  text,
  isMobile = false
}) => {
  const [isEditing, setIsEditing] = useState(true);
  const [mobileHeight, setMobileHeight] = useState(40); // Percentage height on mobile
  const resizingRef = React.useRef(false);

  // Resize handler for mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!resizingRef.current) return;
      
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const windowHeight = window.innerHeight;
      
      // Calculate new height percentage (inverted because handle is at top)
      const newHeight = ((windowHeight - clientY) / windowHeight) * 100;
      
      // Clamp between 0% and 50% (Max 50% height as requested)
      if (newHeight >= 0 && newHeight <= 50) {
        setMobileHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      resizingRef.current = false;
      // Snap logic
      if (mobileHeight < 15) {
        setMobileHeight(10); // Collapsed state (enough for handle + maybe footer)
      }
    };

    if (isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }


    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isMobile]);

  // On mobile, we ignore isOpen strictly and use the height. 
  // However, we need to ensure it renderes.
  if (!isOpen && !isMobile) return null; 

  const isCollapsed = isMobile && mobileHeight <= 15;

  return (
    <div style={{
      width: isMobile ? '100%' : '350px',
      height: isMobile ? `${Math.max(mobileHeight, 10)}%` : '100%', // Ensure at least 10% (collapsed state) to show handle
      // Mobile positioning: Relative to flow now, appearing above Controls
      position: 'relative',
      // No bottom/left for relative flow
      zIndex: isMobile ? 20 : 'auto',
      background: 'var(--sidebar-bg)',
      borderRight: isMobile ? 'none' : '1px solid var(--border-color)',
      borderTop: isMobile ? '1px solid var(--border-color)' : 'none',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0, // IMPORTANT: Prevents it from shrinking below set height
      boxShadow: isMobile ? '0 -4px 12px rgba(0,0,0,0.3)' : 'none',
      transition: isMobile && !resizingRef.current ? 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
    }}>
      {/* Mobile Drag Handle */}
      {isMobile && (
        <div 
          onMouseDown={() => { resizingRef.current = true; }}
          onTouchStart={() => { resizingRef.current = true; }}
          style={{
            width: '100%',
            height: '44px', // Larger touch target for mobile (standard 44px)
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'row-resize',
            background: 'var(--sidebar-bg)',
            borderBottom: '1px solid var(--border-color)',
            touchAction: 'none', // Critical: prevents page scroll while dragging handle
            marginTop: '-10px', // Pull it up slightly if needed to overlap boundary
            flexShrink: 0
          }}
        >
          <div style={{
            width: '40px',
            height: '5px',
            borderRadius: '2.5px',
            background: '#555'
          }} />
        </div>
      )}

      <div style={{ 
        padding: '1rem', 
        borderBottom: '1px solid var(--border-color)',
        display: isCollapsed ? 'none' : 'flex', // Hide header when collapsed
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Library</h2>
        <button onClick={() => setIsEditing(!isEditing)} style={{ padding: '0.4rem' }} title={isEditing ? "Read View" : "Edit Text"}>
          {isEditing ? <BookOpen size={18} /> : <Edit2 size={18} />}
        </button>
      </div>

      <div style={{ 
        flex: 1, 
        overflow: 'hidden', // Lock parent, let children scroll
        display: isCollapsed ? 'none' : 'flex',
        flexDirection: 'column'
      }}>
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
              lineHeight: '1.6',
              padding: '1rem', // Moved padding here
              overflowY: 'auto', // Scroll here
              WebkitOverflowScrolling: 'touch' // Smooth scroll
            }}
          />
        ) : (
          <div style={{ 
            lineHeight: '1.8', 
            fontSize: '1rem',
            padding: '1rem', // Moved padding here
            height: '100%',
            overflowY: 'auto', // Scroll here
            WebkitOverflowScrolling: 'touch'
          }}>
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

      <div style={{ 
        padding: '0.75rem 1rem', 
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.8rem',
        color: '#666',
        display: 'flex',
        justifyContent: 'space-between',
        background: 'rgba(0,0,0,0.1)'
      }}>
        <span>{words.length.toLocaleString()} / 10,000 words</span>
        {words.length >= 10000 && <span style={{ color: '#ef4444', fontWeight: 600 }}>Limit reached</span>}
      </div>
    </div>
  );
};
