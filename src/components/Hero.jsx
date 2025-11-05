import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative mt-8 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">
        <div className="p-8 sm:p-12 flex flex-col justify-center gap-4">
          <span className="inline-flex w-fit rounded-full border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur px-3 py-1 text-xs text-slate-600 dark:text-slate-300">Conversational Analytics</span>
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight">Chat with your data. Get insights, charts, and forecasts instantly.</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-prose">
            Upload a dataset and ask questions in plain English. The AI interprets your intent, explores the data, builds visualizations, and can run quick predictive models.
          </p>
          <ul className="text-sm text-slate-600 dark:text-slate-300 grid grid-cols-2 gap-2 mt-2">
            <li>• Upload CSV/Excel/Parquet</li>
            <li>• Summaries & profiling</li>
            <li>• Interactive charts</li>
            <li>• Forecasts & regression</li>
          </ul>
        </div>
        <div className="relative">
          <Spline
            scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode"
            style={{ width: '100%', height: '100%' }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent dark:from-slate-950/40" />
        </div>
      </div>
    </section>
  );
}
