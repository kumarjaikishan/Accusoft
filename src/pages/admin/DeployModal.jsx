import React, { useState, useEffect, useRef } from "react";
import { 
  Rocket, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Terminal, 
  Loader2, 
  Copy, 
  Check, 
  Server, 
  RefreshCw,
  GitBranch,
  ShieldAlert,
  Layers,
  Building2,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "../../utils/toast";

const DeployModal = ({ isOpen, onClose }) => {
  const [target, setTarget] = useState("accusoft"); // 'accusoft' | 'ems' | 'all'
  const [deploying, setDeploying] = useState(false);
  const [deployState, setDeployState] = useState(null);
  const [logs, setLogs] = useState("");
  const [copied, setCopied] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const terminalEndRef = useRef(null);

  // Auto-scroll logs terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Fetch initial status if modal opens
  useEffect(() => {
    if (isOpen) {
      fetchDeployStatus();
    }
  }, [isOpen]);

  const fetchDeployStatus = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}admin/deploy/status`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.state) {
          setDeployState(data.state);
          if (data.state.target) {
            setTarget(data.state.target);
          }
          if (data.state.output) {
            setLogs(data.state.output);
          }
        }
      }
    } catch (err) {
      console.log("Could not fetch deployment status:", err);
    }
  };

  // Poll server health after PM2 restart
  const pollServerHealth = async (retries = 15) => {
    setIsReconnecting(true);
    for (let i = 0; i < retries; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      try {
        const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}admin/deploy/status`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setIsReconnecting(false);
          setDeploying(false);
          if (data?.state) {
            setDeployState(data.state);
            setLogs(data.state.output || "Deployment completed successfully & server is back online!");
          }
          toast.success("Server restarted and back online!");
          return;
        }
      } catch (e) {
        // Still restarting...
      }
    }
    setIsReconnecting(false);
    setDeploying(false);
  };

  const handleStartDeploy = async () => {
    setDeploying(true);
    const targetLabel = target === "all" ? "ALL APPS (Accusoft & EMS)" : target.toUpperCase();
    setLogs(`🚀 Initiating deployment request for [${targetLabel}] to Oracle VPS...\n`);
    setDeployState({ status: "running", target });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}admin/deploy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ target }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setLogs((prev) => prev + `\n${data.output || data.message || "Deployment triggered successfully."}\n`);
        setDeployState(data.state || { status: "success", target });
        toast.success(data.message || `Deployment started for ${targetLabel}!`);
        
        // Check if status is still running or if server will restart
        setTimeout(() => {
          pollServerHealth();
        }, 3000);
      } else {
        setDeploying(false);
        setDeployState({ status: "failed", target });
        const errMsg = data.message || "Failed to trigger deployment";
        setLogs((prev) => prev + `\n❌ Error: ${errMsg}\n`);
        toast.error(errMsg);
      }
    } catch (err) {
      // Network drop often happens when PM2 restarts the server immediately
      setLogs((prev) => prev + `\n🔄 Server process restarting (PM2)... Checking reconnection...\n`);
      pollServerHealth();
    }
  };

  const handleCopyLogs = () => {
    if (!logs) return;
    navigator.clipboard.writeText(logs);
    setCopied(true);
    toast.success("Logs copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                Oracle VPS Multi-App Deployment
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Live
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Trigger git pull, build sync, npm install & PM2 reload for Accusoft & EMS
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={deploying}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto thin-scrollbar">
          
          {/* Target Application Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Select Target Application
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* Accusoft Card */}
              <button
                type="button"
                onClick={() => setTarget("accusoft")}
                disabled={deploying}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  target === "accusoft"
                    ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500/50 text-indigo-900 dark:text-indigo-200 shadow-xs ring-1 ring-indigo-500/30"
                    : "bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    Accusoft
                  </span>
                  {target === "accusoft" && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  /var/www/accusoft (PM2: 0)
                </p>
              </button>

              {/* EMS Card */}
              <button
                type="button"
                onClick={() => setTarget("ems")}
                disabled={deploying}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  target === "ems"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/50 text-emerald-900 dark:text-emerald-200 shadow-xs ring-1 ring-emerald-500/30"
                    : "bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                    EMS
                  </span>
                  {target === "ems" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  /var/www/ems (PM2: 1)
                </p>
              </button>

              {/* All Card */}
              <button
                type="button"
                onClick={() => setTarget("all")}
                disabled={deploying}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  target === "all"
                    ? "bg-purple-50 dark:bg-purple-950/40 border-purple-500/50 text-purple-900 dark:text-purple-200 shadow-xs ring-1 ring-purple-500/30"
                    : "bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-500" />
                    Deploy All
                  </span>
                  {target === "all" && <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Accusoft + EMS Sequence
                </p>
              </button>
            </div>
          </div>

          {/* Steps Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <GitBranch className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">1. Git Pull (Frontend & Client)</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Fetch latest code for {target.toUpperCase()}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <Server className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">2. Sync to /var/www</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Rsync build to {target === "ems" ? "/var/www/ems" : target === "all" ? "/var/www/accusoft & /ems" : "/var/www/accusoft"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <RefreshCw className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">3. Server & NPM Update</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Git pull server & install packages</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <Rocket className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">4. PM2 Process Restart</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  pm2 restart {target === "ems" ? "1 (ems)" : target === "all" ? "0 & 1" : "0 (accusoft)"}
                </p>
              </div>
            </div>
          </div>

          {/* Terminal Logs Output */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span>Execution Output</span>
                {deploying && (
                  <span className="flex items-center gap-1 text-[11px] text-indigo-500 font-medium ml-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {isReconnecting ? "Server Restarting..." : `Deploying ${target.toUpperCase()}...`}
                  </span>
                )}
                {!deploying && deployState?.status === "success" && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium ml-2">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                  </span>
                )}
              </div>

              {logs && (
                <button
                  type="button"
                  onClick={handleCopyLogs}
                  className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy Logs"}
                </button>
              )}
            </div>

            <div className="relative rounded-xl bg-slate-950 text-slate-200 p-3.5 font-mono text-[11px] sm:text-xs leading-relaxed max-h-56 overflow-y-auto border border-slate-800 shadow-inner">
              {logs ? (
                <pre className="whitespace-pre-wrap font-mono">{logs}</pre>
              ) : (
                <div className="text-slate-500 italic">
                  Select a target application above and press "Trigger Deployment" to execute.
                </div>
              )}
              <div ref={terminalEndRef} />
            </div>
          </div>

          {/* Warning Banner */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Production Execution:</span> This executes <code className="bg-amber-200/50 dark:bg-amber-900/50 px-1.5 py-0.5 rounded font-mono text-[11px] font-bold">deploy-{target === 'all' ? 'all' : target}.sh</code> directly on Oracle VPS.
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={fetchDeployStatus}
            disabled={deploying}
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Logs
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={deploying}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer disabled:opacity-50"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleStartDeploy}
              disabled={deploying}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] rounded-xl shadow-md shadow-indigo-500/20 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deploying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Deploying {target.toUpperCase()}...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Deploy {target === "all" ? "All Apps" : target.toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeployModal;
