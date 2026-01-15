import { useState } from 'react';
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

  const addTab = () => {
    const newId = Date.now().toString();
    setTabs([...tabs, { id: newId, name: `Article ${tabs.length + 1}`, text: '' }]);
    setActiveTabId(newId);
  };

  const removeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Don't delete last tab
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const updateTabText = (id: string, newText: string) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, text: newText } : t));
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
        overflowX: 'auto'
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
              justifyContent: 'space-between'
            }}
          >
            <span style={{ fontSize: '0.9rem' }}>{tab.name}</span>
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
        <button 
          onClick={addTab} 
          style={{ 
            background: 'transparent', 
            border: 'none', 
            padding: '0.5rem', 
            display: 'flex', 
            alignItems: 'center',
            color: '#888'
          }}
          title="New Tab"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, position: 'relative' }}>
        {tabs.map(tab => (
           <ReaderSession
             key={tab.id}
             isActive={activeTabId === tab.id}
             initialText={tab.text}
             onTextChange={(val) => updateTabText(tab.id, val)}
           />
        ))}
      </div>
    </div>
  );
}

export default App;
