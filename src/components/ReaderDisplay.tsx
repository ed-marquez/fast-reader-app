import React from 'react';

interface ReaderDisplayProps {
  word: string;
  fontSize: number;
}

export const ReaderDisplay: React.FC<ReaderDisplayProps> = ({ word, fontSize }) => {
  return (
    <div 
      style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <div 
        style={{ 
          fontSize: `${fontSize}px`, 
          fontWeight: 700,
          color: 'var(--text-color)',
          textAlign: 'center'
        }}
      >
        {/* Simple optical alignment center often helps, but standard center is fine */}
        {word}
      </div>
    </div>
  );
};
