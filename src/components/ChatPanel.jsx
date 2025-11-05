import { useEffect, useMemo, useRef, useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

function MessageBubble({ role, content }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-sm'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-sm'
        }`}
      >
        {content}
      </div>
    </div>
  );
}

export default function ChatPanel({ backendConnected, messages, onSend, hasData }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const placeholder = useMemo(() => {
    if (!hasData) return "Upload a dataset to ask data-aware questions (e.g., 'Total sales by region').";
    return "Ask a question, e.g., 'Show revenue trend by month' or 'Forecast next quarter'.";
  }, [hasData]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const submit = async () => {
    if (!text.trim()) return;
    try {
      setLoading(true);
      await onSend(text);
      setText('');
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="h-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <p className="font-medium">Conversational Analysis</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {backendConnected ? 'AI engine connected' : 'Waiting for backend connection'}
          </p>
        </div>
        {!backendConnected && (
          <span className="text-xs rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-200 px-2 py-1">
            Demo mode
          </span>
        )}
      </div>

      <div className="flex-1 space-y-3 overflow-auto p-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} content={m.content} />
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs text-slate-600 dark:text-slate-300">
              <Loader2 className="animate-spin" size={14} />
              Thinking...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            rows={2}
            placeholder={placeholder}
            className="flex-1 resize-none rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <button
            onClick={submit}
            disabled={!text.trim()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          Pro tip: Ask for charts (bar, line, scatter, pie) or summaries (missing values, types). Try "Predict revenue for next month".
        </div>
      </div>
    </div>
  );
}
