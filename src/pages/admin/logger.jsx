import React, { useEffect, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Clock,
  Trash2,
  RefreshCw,
  Download,
  Search,
  Zap,
  AlertCircle,
  CheckCircle2,
  Filter,
  Server,
  BarChart2,
  Play
} from 'lucide-react';
import { toast } from '../../utils/toast';
import { confirmDialog } from '../../utils/confirm';
import { useApi } from '../../utils/useApi';

dayjs.extend(relativeTime);

const MethodBadge = ({ method }) => {
  const m = (method || 'GET').toUpperCase();
  const colors = {
    GET: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    POST: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    PUT: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    DELETE: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    PATCH: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
  };
  const colorClass = colors[m] || 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30';

  return (
    <span className={`px-2 py-0.5 text-xs font-bold font-mono rounded border ${colorClass}`}>
      {m}
    </span>
  );
};

const LatencyBadge = ({ timeStr, durationMs }) => {
  const ms = durationMs !== undefined ? durationMs : parseFloat(timeStr) || 0;
  let bg = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';

  if (ms > 500) {
    bg = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
  } else if (ms > 200) {
    bg = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
  }

  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${bg} flex items-center gap-1`}>
      <Clock size={12} />
      {timeStr || `${ms} ms`}
    </span>
  );
};

const StatusBadge = ({ status = 200, success = true }) => {
  const isOk = success && status >= 200 && status < 300;
  const color = isOk
    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';

  return (
    <span className={`px-2 py-0.5 text-xs font-bold font-mono rounded border ${color} flex items-center gap-1`}>
      {isOk ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
      {status || (isOk ? 200 : 500)}
    </span>
  );
};

const Logger = () => {
  const [rawLogs, setRawLogs] = useState([]);
  const [activeKey, setActiveKey] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('ALL');
  const { request, loading: testLoading } = useApi();

  const getBaseEndpoint = (urlStr) => {
    if (!urlStr) return "unknown";
    const cleaned = String(urlStr).replace(/^\/+/, "");
    return cleaned.split("?")[0] || cleaned;
  };

  const loadLogs = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('apiLogs')) || [];
      // Normalize raw logs (grouping by base endpoint stripping query parameters)
      const normalized = stored.map((item, idx) => {
        const ep = item.endpoint || 'unknown';
        const baseEp = getBaseEndpoint(ep);
        const meth = (item.method || 'GET').toUpperCase();
        const duration = item.durationMs !== undefined ? item.durationMs : parseFloat(item.time) || 0;
        const key = `${baseEp}_${meth}`;
        return {
          ...item,
          id: item.id || `log_${idx}_${item.date1 || Date.now()}`,
          endpoint: ep,
          baseEndpoint: baseEp,
          method: meth,
          durationMs: duration,
          time: item.time || `${duration} ms`,
          key,
          timestamp: item.date1 || (item.date ? new Date(item.date).getTime() : Date.now()),
        };
      });
      setRawLogs(normalized);
    } catch (e) {
      console.error('Error loading apiLogs', e);
      setRawLogs([]);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  // Clear logs SAFELY without wiping localStorage tokens!
  const handleClearLogs = async () => {
    const confirm = await confirmDialog({
      title: 'Clear API Logs?',
      text: 'This will remove all recorded API performance logs from local storage.',
      icon: 'warning',
      buttons: ['Cancel', 'Clear All'],
      dangerMode: true,
    });

    if (confirm) {
      localStorage.removeItem('apiLogs');
      setRawLogs([]);
      setActiveKey('ALL');
      toast.success('API logs cleared successfully!');
    }
  };

  const handleExportJSON = () => {
    if (rawLogs.length === 0) {
      toast.info('No logs available to export');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(rawLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `accusoft_api_logs_${dayjs().format('YYYY-MM-DD_HH-mm')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Logs exported to JSON file');
  };

  // Run a quick dummy test request to populate logs if empty
  const handleRunTestCall = async () => {
    try {
      toast.info('Running diagnostic ping...');
      await request({ url: 'userdata', method: 'GET' });
      loadLogs();
      toast.success('Diagnostic call completed & logged!');
    } catch (e) {
      loadLogs();
    }
  };

  // Group logs by Base Endpoint + Method
  const groupedEndpoints = useMemo(() => {
    const groups = {};
    rawLogs.forEach((item) => {
      if (!groups[item.key]) {
        groups[item.key] = {
          key: item.key,
          endpoint: item.baseEndpoint || item.endpoint,
          method: item.method,
          count: 0,
          totalDuration: 0,
          logs: [],
        };
      }
      groups[item.key].count += 1;
      groups[item.key].totalDuration += item.durationMs;
      groups[item.key].logs.push(item);
    });

    return Object.values(groups).map((g) => ({
      ...g,
      avgMs: Number((g.totalDuration / g.count).toFixed(2)),
    }));
  }, [rawLogs]);

  // Filtered Endpoints sidebar list
  const filteredGroupedEndpoints = useMemo(() => {
    return groupedEndpoints.filter((g) => {
      const matchSearch = g.endpoint.toLowerCase().includes(search.toLowerCase());
      const matchMethod = selectedMethod === 'ALL' || g.method === selectedMethod;
      return matchSearch && matchMethod;
    });
  }, [groupedEndpoints, search, selectedMethod]);

  // Logs list to display
  const displayedLogs = useMemo(() => {
    let list = rawLogs;

    if (activeKey !== 'ALL') {
      list = list.filter((l) => l.key === activeKey);
    }

    if (search.trim()) {
      list = list.filter((l) => l.endpoint.toLowerCase().includes(search.toLowerCase()));
    }

    if (selectedMethod !== 'ALL') {
      list = list.filter((l) => l.method === selectedMethod);
    }

    // Sort descending by timestamp
    return list.slice().sort((a, b) => b.timestamp - a.timestamp);
  }, [rawLogs, activeKey, search, selectedMethod]);

  // Global Statistics
  const stats = useMemo(() => {
    const totalCalls = rawLogs.length;
    if (totalCalls === 0) {
      return { totalCalls: 0, avgMs: 0, minMs: 0, maxMs: 0, fastCount: 0 };
    }
    const durations = rawLogs.map((l) => l.durationMs);
    const sum = durations.reduce((acc, curr) => acc + curr, 0);
    const avgMs = Number((sum / totalCalls).toFixed(2));
    const minMs = Math.min(...durations);
    const maxMs = Math.max(...durations);
    const fastCount = rawLogs.filter((l) => l.durationMs <= 200).length;

    return { totalCalls, avgMs, minMs, maxMs, fastCount };
  }, [rawLogs]);

  const maxLogLatency = useMemo(() => {
    if (displayedLogs.length === 0) return 100;
    return Math.max(...displayedLogs.map((l) => l.durationMs), 100);
  }, [displayedLogs]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full p-2 md:p-6 space-y-6 text-gray-800 dark:text-gray-100 min-h-[calc(100vh-var(--navheight))]"
    >
      {/* ---------------- TITLE & TOP ACTIONS ---------------- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="text-indigo-600 dark:text-indigo-400" size={26} />
            <h1 className="text-2xl font-bold tracking-tight">API Performance Logs</h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time diagnostic metrics, request execution times, and endpoint telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleRunTestCall}
            disabled={testLoading}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 transition"
          >
            <Play size={14} className={testLoading ? 'animate-spin' : ''} />
            Ping Test API
          </button>
          <button
            onClick={loadLogs}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-gray-200 dark:border-white/10 transition"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <button
            onClick={handleExportJSON}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-gray-200 dark:border-white/10 transition"
          >
            <Download size={14} />
            Export
          </button>
          <button
            onClick={handleClearLogs}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800 transition"
          >
            <Trash2 size={14} />
            Reset Logs
          </button>
        </div>
      </div>

      {/* ---------------- STAT CARDS ---------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Calls</p>
            <h3 className="text-2xl font-extrabold mt-1">{stats.totalCalls}</h3>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Server size={22} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg Latency</p>
            <h3 className="text-2xl font-extrabold mt-1">{stats.avgMs} <span className="text-sm font-normal text-gray-500">ms</span></h3>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Zap size={22} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fastest Call</p>
            <h3 className="text-2xl font-extrabold mt-1">{stats.minMs} <span className="text-sm font-normal text-gray-500">ms</span></h3>
          </div>
          <div className="p-3 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 rounded-xl">
            <BarChart2 size={22} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fast Rate (&le;200ms)</p>
            <h3 className="text-2xl font-extrabold mt-1">
              {stats.totalCalls ? Math.round((stats.fastCount / stats.totalCalls) * 100) : 0}%
            </h3>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl">
            <Clock size={22} />
          </div>
        </div>
      </div>

      {/* ---------------- SEARCH & FILTER BAR ---------------- */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search endpoint path..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-2 flex items-center gap-1">
            <Filter size={13} /> Method:
          </span>
          {['ALL', 'GET', 'POST', 'PUT', 'DELETE'].map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMethod(m)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                selectedMethod === m
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* ---------------- MAIN DASHBOARD LAYOUT ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT SIDEBAR: ENDPOINTS SELECTOR */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-white/5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Endpoints</h3>
            <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold">
              {filteredGroupedEndpoints.length}
            </span>
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            <button
              onClick={() => setActiveKey('ALL')}
              className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                activeKey === 'ALL'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-gray-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Server size={16} />
                <span className="font-semibold text-sm">All Endpoints</span>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeKey === 'ALL' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {rawLogs.length}
              </span>
            </button>

            {filteredGroupedEndpoints.map((group) => {
              const isActive = activeKey === group.key;
              return (
                <button
                  key={group.key}
                  onClick={() => setActiveKey(group.key)}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between gap-2 ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-gray-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MethodBadge method={group.method} />
                      <span className="font-mono text-xs font-semibold truncate block" title={group.endpoint}>
                        /{group.endpoint}
                      </span>
                    </div>
                    <div className={`text-[11px] ${isActive ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      Avg: {group.avgMs} ms
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {group.count}
                  </span>
                </button>
              );
            })}

            {filteredGroupedEndpoints.length === 0 && (
              <p className="text-xs text-center py-6 text-gray-400">No matching endpoints found</p>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: LOG ENTRIES TIMELINE */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-white/5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Log Execution Timeline
              </h3>
              <p className="text-xs text-gray-400">
                {activeKey === 'ALL' ? 'Showing all endpoints' : `Filter: ${activeKey}`}
              </p>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {displayedLogs.length} entries
            </span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {displayedLogs.map((log) => {
                const percentage = Math.min(100, Math.max(5, (log.durationMs / maxLogLatency) * 100));

                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="p-3.5 rounded-xl border border-gray-100 dark:border-white/5 bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition shadow-2xs space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <MethodBadge method={log.method} />
                        <span className="font-mono text-sm font-bold text-gray-800 dark:text-gray-200">
                          /{log.endpoint}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusBadge status={log.status} success={log.success} />
                        <LatencyBadge timeStr={log.time} durationMs={log.durationMs} />
                      </div>
                    </div>

                    {/* Relative latency visualization bar */}
                    <div className="w-full bg-gray-200 dark:bg-slate-700/60 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          log.durationMs > 500
                            ? 'bg-rose-500'
                            : log.durationMs > 200
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{dayjs(log.timestamp).fromNow()}</span>
                      <span className="font-mono">{dayjs(log.timestamp).format('hh:mm:ss A · DD/MM/YYYY')}</span>
                    </div>

                    {log.error && (
                      <div className="text-xs p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-mono">
                        Error: {log.error}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {displayedLogs.length === 0 && (
              <div className="text-center py-12 space-y-3">
                <Activity size={48} className="mx-auto text-gray-300 dark:text-gray-600" />
                <h4 className="text-base font-semibold text-gray-600 dark:text-gray-300">No API logs recorded yet</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  API calls made using the application will automatically log their execution time and response status here.
                </p>
                <button
                  onClick={handleRunTestCall}
                  disabled={testLoading}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-md"
                >
                  Run Test API Call
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Logger;
