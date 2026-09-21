import React, { useState, useEffect, useRef } from "react";
import { 
  Rocket, 
  CheckCircle2, 
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
  Sparkles,
  Gamepad2,
  Briefcase,
  GraduationCap,
  Globe,
  Flame
} from "lucide-react";
import { toast } from "../../utils/toast";
import { useApi } from "../../utils/useApi";
import Modalbox from "../../components/custommodal/Modalbox";

// Configured list of projects matching the VPS shell scripts in /home/ubuntu/scripts/:
// key matches `/home/ubuntu/scripts/<key>.sh`
const DEPLOY_PROJECTS = [
  {
    key: "accusoft",
    name: "Accusoft",
    desc: "Expense Management System",
    path: "/var/www/accusoft",
    script: "accusoft.sh",
    icon: Sparkles,
    color: "indigo"
  },
  {
    key: "ems",
    name: "EMS",
    desc: "Employee Management System",
    path: "/var/www/ems",
    script: "ems.sh",
    icon: Building2,
    color: "emerald"
  },
  {
    key: "goodnature_ems",
    name: "Goodnature EMS",
    desc: "Employee Attendance & Payroll",
    path: "/var/www/goodnatureoffice",
    script: "goodnature_ems.sh",
    icon: Building2,
    color: "emerald"
  },
  {
    key: "battlefiesta",
    name: "BattleFiesta",
    desc: "Gaming & Tournament Platform",
    path: "/var/www/battlefiesta",
    script: "battlefiesta.sh",
    icon: Gamepad2,
    color: "purple"
  },
  {
    key: "office",
    name: "Office Portal",
    desc: "Internal Management & ERP",
    path: "/var/www/office",
    script: "office.sh",
    icon: Briefcase,
    color: "amber"
  },
  {
    key: "riseown",
    name: "Riseown",
    desc: "Production Platform",
    path: "/var/www/riseown",
    script: "riseown.sh",
    icon: Flame,
    color: "rose"
  },
  {
    key: "studynotes",
    name: "StudyNotes",
    desc: "Student Education & Notes Hub",
    path: "/var/www/studynotes",
    script: "studynotes.sh",
    icon: GraduationCap,
    color: "blue"
  },
  {
    key: "portfolio",
    name: "Portfolio",
    desc: "Personal Developer Showcase",
    path: "/var/www/portfolio",
    script: "portfolio.sh",
    icon: Globe,
    color: "teal"
  },
  {
    key: "all",
    name: "Deploy All",
    desc: "Sequential Batch Deployment",
    path: "All Web Services",
    script: "deploy-all.sh",
    icon: Layers,
    color: "violet"
  }
];

const DeployModal = ({ isOpen, onClose }) => {
  const [target, setTarget] = useState("accusoft");
  const [deploying, setDeploying] = useState(false);
  const [deployState, setDeployState] = useState(null);
  const [logs, setLogs] = useState("");
  const [copied, setCopied] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const terminalEndRef = useRef(null);

  // Use centralized project API hook with automatic token refresh
  const { request } = useApi();

  const selectedProject = DEPLOY_PROJECTS.find((p) => p.key === target) || DEPLOY_PROJECTS[0];

  // Auto-scroll logs terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const handleStartDeploy = async () => {
    setDeploying(true);
    const targetLabel = selectedProject.name;
    const initialLog = `🚀 Initiating deployment for [${targetLabel}] (bash /home/ubuntu/scripts/${selectedProject.script})...\n⏳ Running script on server...\n`;
    setLogs(initialLog);
    setDeployState({ status: "running", target });

    try {
      const data = await request({
        url: `admin/deploy/${target}`,
        method: "POST",
        body: { target },
      });

      if (data && (data.success || data.logs || data.output)) {
        const responseLogs = data.output || data.logs || data.message || `✅ Deployed ${targetLabel} successfully!`;
        setLogs((prev) => prev + `\n${responseLogs}\n`);
        setDeployState({ status: "success", target });
        toast.success(data.message || `Deployed ${targetLabel} successfully!`);
      } else {
        setDeployState({ status: "failed", target });
        const errMsg = data?.message || "Failed to execute deployment script";
        setLogs((prev) => prev + `\n❌ Error: ${errMsg}\n${data?.logs || ''}\n`);
        toast.error(errMsg);
      }
    } catch (err) {
      setDeployState({ status: "failed", target });
      const errMsg = err?.response?.data?.message || err?.message || "Server connection error during deployment";
      setLogs((prev) => prev + `\n❌ Deployment Error: ${errMsg}\n`);
      toast.error(errMsg);
    } finally {
      setDeploying(false);
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
    <Modalbox open={isOpen} onClose={onClose}>
      <div className="w-[780px] max-w-[94vw] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                Oracle VPS Project Deployment
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Live
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Execute Git pull, Rsync build, NPM install & PM2 reload directly on Oracle VPS
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
        <div className="p-5 space-y-4 overflow-y-auto thin-scrollbar flex-1">
          
          {/* Target Project Selector Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Select Target Project ({DEPLOY_PROJECTS.length} Available)
              </label>
              <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200/50 dark:border-indigo-800/50 font-bold">
                Script: /home/ubuntu/scripts/{selectedProject.script}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DEPLOY_PROJECTS.map((proj) => {
                const IconComponent = proj.icon;
                const isSelected = target === proj.key;

                return (
                  <button
                    key={proj.key}
                    type="button"
                    onClick={() => setTarget(proj.key)}
                    disabled={deploying}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-950 dark:text-indigo-200 shadow-sm ring-1 ring-indigo-500/40"
                        : "bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold flex items-center gap-1.5 truncate">
                        <IconComponent className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                        {proj.name}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {proj.path}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Steps Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <GitBranch className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">1. Git Pull Repository</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Fetch latest branch code for {selectedProject.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <Server className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">2. Sync to Web Root</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Rsync static frontend build to {selectedProject.path}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <RefreshCw className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">3. NPM Dependencies</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Install/update server packages with npm i</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <Rocket className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">4. PM2 Process Restart</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Restart PM2 microservice without downtime
                </p>
              </div>
            </div>
          </div>

          {/* Terminal Logs Output */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span>Execution Output Logs</span>
                {deploying && (
                  <span className="flex items-center gap-1 text-[11px] text-indigo-500 font-medium ml-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {isReconnecting ? "Server Restarting..." : `Deploying ${selectedProject.name}...`}
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

            <div className="relative rounded-xl bg-slate-950 text-slate-200 p-3.5 font-mono text-[11px] sm:text-xs leading-relaxed max-h-60 overflow-y-auto border border-slate-800 shadow-inner">
              {logs ? (
                <div className="space-y-0.5">
                  {logs
                    .replace(/\u001b\[[0-9;]*[a-zA-Z]/g, "")
                    .replace(/\[\d+m/g, "")
                    .split("\n")
                    .map((line, idx) => {
                      let colorClass = "text-slate-300";
                      if (line.includes("✅") || line.includes("✓") || line.includes("successfully")) {
                        colorClass = "text-emerald-400 font-semibold";
                      } else if (line.includes("🚀") || line.includes("📦") || line.includes("🌐") || line.includes("⚙️") || line.includes("🔄")) {
                        colorClass = "text-indigo-300 font-medium";
                      } else if (line.includes("❌") || line.includes("Error") || line.includes("STDERR") || line.includes("failed")) {
                        colorClass = "text-rose-400 font-semibold";
                      } else if (line.includes("⚠️") || line.includes("warning")) {
                        colorClass = "text-amber-400";
                      } else if (line.startsWith("Target Script:") || line.startsWith("===")) {
                        colorClass = "text-slate-500";
                      }

                      return (
                        <div key={idx} className={`${colorClass} whitespace-pre-wrap break-all`}>
                          {line}
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-slate-500 italic">
                  Select a project above and click &quot;Deploy {selectedProject.name}&quot; to run /home/ubuntu/scripts/{selectedProject.script}.
                </div>
              )}
              <div ref={terminalEndRef} />
            </div>
          </div>

          {/* Execution Path Card */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Production Script Path:</span> Executes <code className="bg-amber-200/50 dark:bg-amber-900/50 px-1.5 py-0.5 rounded font-mono text-[11px] font-bold">/home/ubuntu/scripts/{selectedProject.script}</code> on Oracle Linux VPS.
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => setLogs("")}
            disabled={deploying}
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Clear Terminal
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
                  <span>Deploying {selectedProject.name}...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Deploy {selectedProject.name}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modalbox>
  );
};

export default DeployModal;
