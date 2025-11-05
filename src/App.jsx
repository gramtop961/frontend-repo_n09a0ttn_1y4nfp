import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import UploadPanel from './components/UploadPanel.jsx';
import ChatPanel from './components/ChatPanel.jsx';

export default function App() {
  const [theme, setTheme] = useState('light');
  const [fileMeta, setFileMeta] = useState(null); // { name, type, size }
  const [preview, setPreview] = useState({ columns: [], rows: [] }); // first rows
  const [messages, setMessages] = useState([
    {
      id: 'sys-hello',
      role: 'assistant',
      content:
        "Welcome! Upload a dataset to get an instant summary, then ask questions like 'Show sales by region' or 'Forecast revenue next month.'",
    },
  ]);

  useEffect(() => {
    const stored = window.localStorage.getItem('theme');
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const backendUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || '', []);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMsg = { id: crypto.randomUUID(), role: 'user', content: text };
    setMessages((m) => [...m, userMsg]);

    // Placeholder assistant response to keep UI interactive until backend is wired.
    // We avoid calling non-existent endpoints here.
    const hint = backendUrl
      ? 'Analyzing with the connected AI agent...'
      : 'Backend not connected yet. Once connected, the AI will analyze your data, generate charts, and predictions here.';

    const assistantMsg = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content:
        (fileMeta ? '' : 'Tip: Upload a dataset to unlock data-aware answers. ') + hint,
    };
    setMessages((m) => [...m, assistantMsg]);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      <Header theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Hero />

        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 mt-8">
          <div className="lg:col-span-2">
            <UploadPanel
              fileMeta={fileMeta}
              preview={preview}
              onFileMeta={setFileMeta}
              onPreview={setPreview}
            />
          </div>
          <div className="lg:col-span-3">
            <ChatPanel
              backendConnected={Boolean(backendUrl)}
              messages={messages}
              onSend={handleSend}
              hasData={Boolean(fileMeta)}
            />
          </div>
        </section>
      </main>

      <footer className="mt-12 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>
          AI-Powered Chat Data Scientist — built for conversational data exploration, visualization, and predictions.
        </p>
      </footer>
    </div>
  );
}
