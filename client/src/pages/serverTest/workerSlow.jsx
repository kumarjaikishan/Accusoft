import React, { useState } from 'react';
import { 
  Zap, 
  Send, 
  Activity, 
  Cpu, 
  Timer, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw,
  Clock,
  ArrowRight,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { toast } from '../../utils/toast';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import TextInput from '../../components/common/TextInput';

const PRESETS = [
  { label: '500 ms', value: 500 },
  { label: '1.5 sec', value: 1500 },
  { label: '3.0 sec', value: 3000 },
  { label: '5.0 sec', value: 5000 },
  { label: '10.0 sec', value: 10000 },
];

const SlowWorkerPage = () => {
  const [delay, setDelay] = useState(1500);
  const [loading, setLoading] = useState(false);
  const [pinging, setPinging] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [pingResult, setPingResult] = useState(null);
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const token = localStorage.getItem('token');
    const startTime = performance.now();
    
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}slow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ delay: Number(delay) }),
      });
      
      const endTime = performance.now();
      const elapsed = Math.round(endTime - startTime);
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || `Worker finished task after ${delay}ms!`, { autoClose: 2000 });
        const record = {
          id: Date.now(),
          type: 'Worker Thread Offload',
          targetDelay: Number(delay),
          elapsed,
          status: 'Success (Non-blocking)',
          timestamp: new Date().toLocaleTimeString(),
        };
        setLastResult(record);
        setHistory((prev) => [record, ...prev.slice(0, 9)]);
      } else {
        toast.warn(data.message || 'Worker thread returned an error', { autoClose: 2500 });
      }
    } catch (error) {
      toast.warn(error.message || 'Connection error', { autoClose: 2500 });
    } finally {
      setLoading(false);
    }
  };

  const handlePing = async () => {
    const token = localStorage.getItem('token');
    const startTime = performance.now();
    try {
      setPinging(true);
      const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}homesummary`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const endTime = performance.now();
      const elapsed = Math.round(endTime - startTime);
      setPingResult({
        ok: res.ok,
        elapsed,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      setPingResult({
        ok: false,
        error: err.message,
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setPinging(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-var(--navheight))] p-3 sm:p-6 lg:p-8 flex flex-col items-center max-w-5xl mx-auto space-y-6 animate-fade-in">
      
      {/* 🧭 NAVIGATION TABS */}
      <div className="w-full flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Zap size={22} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100">
              Worker Threads Concurrency
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Multi-threaded asynchronous task offloading via Node.js Worker Threads
            </p>
          </div>
        </div>

        {/* Quick Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200/70 dark:border-slate-700/70 text-xs">
          <Link
            to="/admin/slow"
            className="px-3 py-1.5 rounded-xl font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition flex items-center gap-1.5"
          >
            <AlertTriangle size={13} className="text-rose-500" />
            Blocking Loop
          </Link>
          <Link
            to="/admin/slowworker"
            className="px-3 py-1.5 rounded-xl font-bold bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs flex items-center gap-1.5"
          >
            <Zap size={13} />
            Worker Thread
          </Link>
        </div>
      </div>

      {/* 📊 MAIN BENCHMARK GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        
        {/* CONTROL CARD */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-indigo-500" />
                <h2 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">
                  Offload Heavy Task to Worker
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                Multi-Core Async
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This endpoint (<code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-indigo-600">POST /api/slow</code>) creates a separate OS worker thread (<code className="text-cyan-600 dark:text-cyan-400 font-mono">worker_threads</code>) to compute the task off the main event loop.
            </p>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Preset Durations
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setDelay(p.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      Number(delay) === p.value
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs shadow-indigo-600/30'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200/70 dark:border-slate-700/70 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <TextInput
                label="Custom Delay (Milliseconds)"
                id="worker-delay"
                name="delay"
                type="number"
                min="0"
                max="30000"
                value={delay}
                onChange={(e) => setDelay(e.target.value)}
                required
                startAdornment={<Timer size={16} className="text-slate-400" />}
                helperText="Calculated on isolated background CPU thread"
              />

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  loading={loading}
                  icon={Send}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                >
                  {loading ? 'Worker Computing in Background...' : `Launch Worker (${delay}ms)`}
                </Button>
              </div>
            </form>
          </div>

          {/* Real-time Status Card */}
          {lastResult && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Worker Thread Finished
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Target: {lastResult.targetDelay}ms • Roundtrip: {lastResult.elapsed}ms
                  </p>
                </div>
              </div>
              <span className="text-xs font-black font-mono px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400">
                {lastResult.elapsed} ms
              </span>
            </div>
          )}
        </div>

        {/* SIDEBAR: LIVE PING CHECK & ARCHITECTURE INFO */}
        <div className="space-y-6 flex flex-col">
          
          {/* Real-time Concurrency Test Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Activity size={16} className="text-emerald-500" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Live Server Responsiveness
              </h3>
            </div>
            
            <p className="text-[11px] text-slate-400 leading-relaxed">
              While the worker thread is computing in the background, click below to verify that other API requests still resolve instantly in &lt;15ms!
            </p>

            <Button
              variant="outline"
              size="sm"
              loading={pinging}
              onClick={handlePing}
              icon={RefreshCw}
              className="w-full justify-center text-xs"
            >
              {pinging ? 'Measuring Latency...' : 'Ping Live API'}
            </Button>

            {pingResult && (
              <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                pingResult.ok 
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200/70 dark:border-emerald-800/70 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200/70 dark:border-rose-800/70 text-rose-700 dark:text-rose-300'
              }`}>
                <span className="font-medium flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  Zero Stalling
                </span>
                <span className="font-mono font-bold">
                  {pingResult.elapsed} ms
                </span>
              </div>
            )}
          </div>

          {/* Architecture Card */}
          <div className="bg-linear-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-5 shadow-sm space-y-3 border border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-300">
                Non-Blocking Concurrency
              </h3>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              By offloading heavy computation (e.g. data encryption, report generation, analytics) to Worker Threads, Node.js remains completely fluid for all users.
            </p>
            <div className="pt-1">
              <Link 
                to="/admin/slow"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 hover:text-cyan-200 transition"
              >
                Compare With Synchronous Blocking
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 📋 RECENT BENCHMARK HISTORY */}
      {history.length > 0 && (
        <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-slate-400" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Recent Benchmark Runs
              </h3>
            </div>
            <button
              onClick={() => setHistory([])}
              className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
            >
              Clear
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-2 font-semibold">Mode</th>
                  <th className="pb-2 font-semibold">Target Delay</th>
                  <th className="pb-2 font-semibold">Roundtrip Latency</th>
                  <th className="pb-2 font-semibold">Time</th>
                  <th className="pb-2 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.map((h) => (
                  <tr key={h.id} className="text-slate-700 dark:text-slate-200">
                    <td className="py-2.5 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      {h.type}
                    </td>
                    <td className="py-2.5 font-mono">{h.targetDelay} ms</td>
                    <td className="py-2.5 font-mono font-bold">{h.elapsed} ms</td>
                    <td className="py-2.5 text-slate-400">{h.timestamp}</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlowWorkerPage;