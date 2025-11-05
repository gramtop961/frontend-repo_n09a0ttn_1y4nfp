import { Moon, Sun, Rocket } from 'lucide-react';

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow">
            <Rocket size={18} />
          </div>
          <div>
            <h1 className="font-semibold leading-none">AI-Powered Chat Data Scientist</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Analyze, visualize, and predict — no code needed</p>
          </div>
        </div>

        <button
          onClick={onToggleTheme}
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
        </button>
      </div>
    </header>
  );
}
