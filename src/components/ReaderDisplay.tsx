import React, { useLayoutEffect, useRef, useState } from 'react';

interface ReaderDisplayProps {
  word: string;
  fontSize: number;
}

export const ReaderDisplay: React.FC<ReaderDisplayProps> = ({ word, fontSize }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    if (containerRef.current && textRef.current) {
      const containerWidth = containerRef.current.offsetWidth - 80; // Margin/Padding
      const textWidth = textRef.current.scrollWidth;

      if (textWidth > containerWidth && textWidth > 0) {
        setScale(containerWidth / textWidth);
      } else {
        setScale(1);
      }
    }
  }, [word, fontSize]); // Re-calculate when word or base fontSize changes

  return (
    <div 
      ref={containerRef}
      style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '100%',
        padding: '2rem',
        textAlign: 'center',
        overflow: 'hidden',
        background: 'transparent'
      }}
    >
      <div 
        ref={textRef}
        style={{ 
          fontSize: `${fontSize}px`, 
          fontWeight: 700,
          color: 'var(--text-color)',
          whiteSpace: 'nowrap',
          lineHeight: 1,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.1s ease-out, font-size 0.15s ease-out'
        }}
      >
        {word}
      </div>
    </div>
  );
};
