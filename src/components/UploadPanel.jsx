import { useCallback, useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';

export default function UploadPanel({ fileMeta, preview, onFileMeta, onPreview }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChoose = useCallback(() => inputRef.current?.click(), []);

  const parseCsvPreview = async (file) => {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return { columns: [], rows: [] };
    const columns = lines[0].split(',').map((h) => h.trim());
    const rows = lines.slice(1, 6).map((l) => {
      const cells = l.split(',');
      const row = {};
      columns.forEach((c, i) => (row[c] = (cells[i] ?? '').trim()));
      return row;
    });
    return { columns, rows };
  };

  const handleFiles = async (files) => {
    const file = files?.[0];
    if (!file) return;
    setError('');
    setLoading(true);

    onFileMeta({ name: file.name, type: file.type || 'unknown', size: file.size });

    try {
      if (file.name.toLowerCase().endsWith('.csv')) {
        const p = await parseCsvPreview(file);
        onPreview(p);
      } else {
        // For Excel/Parquet, we don't parse on the client; show a helpful note
        onPreview({ columns: [], rows: [] });
        setError('Preview for Excel/Parquet will appear after backend processing.');
      }
    } catch (e) {
      console.error(e);
      setError('Failed to generate preview.');
      onPreview({ columns: [], rows: [] });
    } finally {
      setLoading(false);
    }
  };

  const onDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await handleFiles(e.dataTransfer.files);
  };

  const onChange = async (e) => {
    await handleFiles(e.target.files);
    e.target.value = '';
  };

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 text-center hover:border-indigo-400/70 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls,.parquet"
          className="hidden"
          onChange={onChange}
        />
        <div className="h-12 w-12 inline-flex items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-300">
          {loading ? <Loader2 className="animate-spin" /> : <Upload />}
        </div>
        <div>
          <p className="font-medium">Upload your dataset</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            CSV, Excel (.xlsx, .xls) or Parquet. Drag and drop, or
            <button onClick={onChoose} className="ml-1 text-indigo-600 hover:underline">browse</button>.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-amber-300/50 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 text-sm text-amber-800 dark:text-amber-200">
          {error}
        </div>
      )}

      {fileMeta && (
        <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-medium">{fileMeta.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{(fileMeta.size / 1024).toFixed(1)} KB</p>
            </div>
            <span className="text-xs rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-1 text-slate-600 dark:text-slate-300">
              {fileMeta.type || 'file'}
            </span>
          </div>

          <div className="px-4 py-3">
            {preview?.rows?.length ? (
              <div>
                <p className="text-sm mb-2 text-slate-600 dark:text-slate-300">Data preview (first {preview.rows.length} rows):</p>
                <div className="overflow-auto">
                  <table className="min-w-full border-separate border-spacing-0 text-sm">
                    <thead>
                      <tr>
                        {preview.columns.map((c) => (
                          <th key={c} className="sticky top-0 bg-slate-50 dark:bg-slate-800 text-left border-b border-slate-200 dark:border-slate-700 px-3 py-2 font-medium">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.rows.map((row, idx) => (
                        <tr key={idx} className="even:bg-slate-50/50 dark:even:bg-slate-900/40">
                          {preview.columns.map((c) => (
                            <td key={c} className="border-b border-slate-100 dark:border-slate-800 px-3 py-2 text-slate-700 dark:text-slate-200">
                              {String(row[c] ?? '')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                A quick profile and summary will appear here once the backend processes your file.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
