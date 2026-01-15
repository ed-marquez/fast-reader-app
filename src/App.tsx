import { useState, useCallback } from 'react';
import { ReaderSession } from './components/ReaderSession';
import { Plus, X } from 'lucide-react';
import './index.css';

interface Tab {
  id: string;
  name: string;
  text: string;
}

function App() {
  const [tabs, setTabs] = useState<Tab[]>([{ id: '1', name: 'Article 1', text: '' }]);
  const [activeTabId, setActiveTabId] = useState<string>('1');
  const [editingTabId, setEditingTabId] = useState<string | null>(null);

  const addTab = () => {
    if (tabs.length >= 10) return;
    const newId = Date.now().toString();
    setTabs([...tabs, { id: newId, name: `Article ${tabs.length + 1}`, text: '' }]);
    setActiveTabId(newId);
  };

  const removeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Don't delete last tab
    
    const removedIndex = tabs.findIndex(t => t.id === id);
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);

    if (activeTabId === id) {
      const nextActiveIndex = Math.max(0, removedIndex - 1);
      setActiveTabId(newTabs[nextActiveIndex].id);
    }
  };

  const updateTabText = useCallback((id: string, newText: string) => {
    setTabs(prev => {
      const tab = prev.find(t => t.id === id);
      if (tab && tab.text === newText) return prev;
      return prev.map(t => t.id === id ? { ...t, text: newText } : t);
    });
  }, []);

  const updateTabName = (id: string, newName: string) => {
    const trimmedName = newName.trim();
    setTabs(prev => prev.map(t => t.id === id ? { ...t, name: trimmedName || 'Untitled' } : t));
    setEditingTabId(null);
  };

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Tab Bar */}
      <div style={{ 
        display: 'flex', 
        background: '#111', 
        borderBottom: '1px solid #333',
        padding: '0.5rem 1rem 0',
        gap: '0.5rem',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          flex: 1,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          alignItems: 'center'
        }}>
          {tabs.map(tab => (
            <div 
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              style={{
                padding: '0.6rem 1rem',
                background: activeTabId === tab.id ? '#222' : 'transparent',
                color: activeTabId === tab.id ? '#fff' : '#888',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: activeTabId === tab.id ? '1px solid #333' : '1px solid transparent',
                borderBottom: 'none',
                minWidth: '120px',
                maxWidth: '200px',
                justifyContent: 'space-between',
                flexShrink: 0
              }}
              title="Double-click to rename"
            >
              {editingTabId === tab.id ? (
                <input
                  autoFocus
                  defaultValue={tab.name}
                  maxLength={50}
                  onClick={(e) => e.stopPropagation()}
                  onBlur={(e) => updateTabName(tab.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') updateTabName(tab.id, e.currentTarget.value);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #fff',
                    color: '#fff',
                    maxWidth: '100px',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              ) : (
                <span 
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setEditingTabId(tab.id);
                  }}
                  style={{ 
                    fontSize: '0.9rem', 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis' 
                  }}
                >
                  {tab.name}
                </span>
              )}

              {tabs.length > 1 && (
                <X 
                  size={14} 
                  className="tab-close"
                  onClick={(e) => removeTab(e, tab.id)}
                  style={{ opacity: 0.6 }}
                />
              )}
            </div>
          ))}
          
          {tabs.length < 10 && (
            <button 
              onClick={addTab} 
              style={{ 
                background: 'transparent', 
                border: '1px solid #333', 
                borderRadius: '8px',
                padding: '0.4rem', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                color: '#888',
                flexShrink: 0,
                minWidth: '36px',
                height: '36px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: '1px'
              }}
              title="Add New Tab (Max 10)"
            >
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {tabs.map(tab => (
           activeTabId === tab.id && (
             <ReaderSession
               key={tab.id}
               isActive={true}
               initialText={tab.text}
               tabId={tab.id}
               onUpdateText={updateTabText}
             />
           )
        ))}
      </div>
    </div>
  );
}

export default App;
