import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import Sidebar from './components/Sidebar';
import StatCards from './components/dashboard/StatCards';
import MapComponent from './components/map/MapComponent';
import { api } from './services/api';
import type { IntelligenceRecord, DashboardStats } from './types';
import { Search, Filter, RefreshCcw, Bell, Database, Upload } from 'lucide-react';
import { format } from 'date-fns';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [records, setRecords] = useState<IntelligenceRecord[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ total: 0, osint: 0, humint: 0, imint: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const allRecords = await api.getRecords({ search: searchTerm, sourceType: sourceFilter });
      const statData = await api.getStats();
      setRecords(allRecords);
      setStats(statData.stats);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, sourceFilter]);

  return (
    <div className="flex bg-background min-h-screen text-slate-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              {activeTab === 'dashboard' ? 'Intelligence Dashboard' : 'Field Operations Map'}
            </h2>
            <p className="text-slate-500 text-sm font-medium">Real-time signal fusion from all sectors</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search database..."
                className="bg-surface border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-all w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="bg-surface border border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="">All Sources</option>
              <option value="OSINT">OSINT</option>
              <option value="HUMINT">HUMINT</option>
              <option value="IMINT">IMINT</option>
            </select>

            <button onClick={() => fetchData()} className="p-2 bg-surface border border-white/5 rounded-xl hover:bg-slate-800 transition-colors">
              <RefreshCcw className={`w-5 h-5 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <div className="h-8 w-px bg-white/5 mx-2" />

            <button className="relative p-2 bg-surface border border-white/5 rounded-xl text-slate-400">
              <Bell className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface" />
            </button>

            <div className="flex items-center gap-3 bg-surface p-1 pr-3 border border-white/5 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">JD</div>
              <span className="text-xs font-bold text-slate-300">Commander</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        {activeTab === 'dashboard' || activeTab === 'map' ? (
          <>
            <StatCards stats={stats} />
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-8">
                <MapComponent records={records} />
              </div>

              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                {/* Recent Activity */}
                <div className="bg-surface rounded-2xl border border-white/5 p-6 flex-1 overflow-hidden flex flex-col max-h-[calc(100vh-250px)]">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-white uppercase tracking-widest text-xs">Recent Intelligence</h3>
                    <Filter className="w-4 h-4 text-slate-500" />
                  </div>

                  <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    {records.slice(0, 8).map((record) => (
                      <div key={record._id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 hover:border-primary/50 transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${record.sourceType === 'OSINT' ? 'bg-osint/20 text-osint' :
                              record.sourceType === 'HUMINT' ? 'bg-humint/20 text-humint' : 'bg-imint/20 text-imint'
                            }`}>
                            {record.sourceType}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {format(new Date(record.timestamp), 'HH:mm')}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{record.title}</h4>
                        <p className="text-xs text-slate-500 truncate mt-1">{record.description}</p>
                        <div className="flex gap-2 mt-3">
                          {record.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[9px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ingestion Panel */}
                <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6">
                  <h3 className="font-bold text-primary uppercase tracking-widest text-xs mb-3">System Ingestion</h3>
                  <p className="text-xs text-slate-400 mb-4">Upload intelligence batches (CSV/JSON/XLSX) to synchronize with command center.</p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="w-full py-3 bg-primary text-black font-black text-xs uppercase rounded-xl hover:bg-primary-light transition-all shadow-lg shadow-primary/20"
                  >
                    Launch Ingest Tool
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : activeTab === 'upload' ? (
          <UploadView onSuccess={() => { setActiveTab('dashboard'); fetchData(); }} />
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
            <Database className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-bold">Data Management Panel</p>
            <p className="text-sm">Extended database tools coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}

const UploadView = ({ onSuccess }: { onSuccess: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      await api.uploadFile(file);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-surface p-8 rounded-2xl border border-white/5 shadow-2xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
          <Upload className="text-primary w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-white uppercase tracking-tight">Intelligence Ingestion</h3>
        <p className="text-slate-400 text-sm">Select a verified source file for processing</p>
      </div>

      <div
        className={clsx(
          "border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300",
          file ? "border-primary/50 bg-primary/5" : "border-white/10 hover:border-white/20 bg-slate-900/50"
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
        }}
      >
        <div className="flex flex-col items-center">
          <Database className={clsx("w-12 h-12 mb-4", file ? "text-primary" : "text-slate-600")} />
          {file ? (
            <div className="space-y-1">
              <p className="text-white font-bold">{file.name}</p>
              <p className="text-slate-500 text-xs">{(file.size / 1024).toFixed(2)} KB</p>
              <button
                onClick={() => setFile(null)}
                className="text-red-400 text-[10px] uppercase font-bold mt-2 hover:underline"
              >
                Change File
              </button>
            </div>
          ) : (
            <>
              <p className="text-slate-300 font-medium mb-1">Drag and drop mission file</p>
              <p className="text-slate-500 text-xs mb-4">Supports CSV, JSON, and XLSX formats</p>
              <label className="cursor-pointer px-6 py-2 bg-slate-800 border border-white/10 rounded-lg text-xs font-bold hover:bg-slate-700 transition-all">
                Browse Files
                <input type="file" className="hidden" accept=".csv,.json,.xlsx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>
            </>
          )}
        </div>
      </div>

      {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg">{error}</div>}

      <div className="mt-8 flex gap-4">
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="flex-1 py-3 bg-primary text-black font-black text-xs uppercase rounded-xl hover:shadow-lg disabled:opacity-50 transition-all font-mono"
        >
          {uploading ? 'Processing Signal...' : 'Confirm Ingestion'}
        </button>
      </div>

      <div className="mt-8 pt-8 border-t border-white/5">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Required Data Schema</h4>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[10px] font-mono text-slate-400">
          <div className="flex justify-between"><span>title:</span> <span className="text-slate-500 font-bold">string</span></div>
          <div className="flex justify-between"><span>latitude:</span> <span className="text-slate-500 font-bold">number</span></div>
          <div className="flex justify-between"><span>sourceType:</span> <span className="text-slate-500 font-bold">OSINT|HUMINT|IMINT</span></div>
          <div className="flex justify-between"><span>longitude:</span> <span className="text-slate-500 font-bold">number</span></div>
        </div>
      </div>
    </div>
  );
};

export default App;
