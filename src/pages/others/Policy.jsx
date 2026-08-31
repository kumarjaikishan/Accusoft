import React from "react";
import { ShieldCheck, Lock, Eye, Server, RefreshCw, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
  const sections = [
    {
      icon: <Eye className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      title: "1. Information We Collect",
      text: "We collect minimal personal data essential to providing our expense management services. This includes your name, email address, password hash, profile avatar, and expense ledger records (amount, transaction dates, category designations, and receipt narrations) that you explicitly input into the platform."
    },
    {
      icon: <Server className="w-5 h-5 text-cyan-500" />,
      title: "2. How We Use Your Data",
      text: "Your data is used strictly to compute monthly spending summaries, render visual analytics, enforce budget alerts, and generate exportable CSV financial reports. We do not use your financial data for advertising, profiling, or monetization."
    },
    {
      icon: <Lock className="w-5 h-5 text-emerald-500" />,
      title: "3. Data Security & Storage",
      text: "We implement industry-standard cryptographic practices including salted hashing (bcrypt) for credentials, JWT authentication with stateless tokens, and TLS 1.3 encryption in transit across all endpoints."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-purple-500" />,
      title: "4. No Data Selling or Third-Party Sharing",
      text: "We respect user privacy unconditionally: Accusoft will NEVER sell, rent, or trade your personal or financial data to third-party brokers or advertisers. Data is only processed by essential cloud infrastructure providers solely for hosting."
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-amber-500" />,
      title: "5. Data Retention & User Rights",
      text: "Under applicable data protection regulations (including GDPR & DPDP compliance principles), you have the absolute right to view, rectify, export, or permanently purge your expense logs and user profile from our database at any time upon request."
    },
    {
      icon: <Mail className="w-5 h-5 text-rose-500" />,
      title: "6. Data Protection Contact",
      text: "For privacy inquiries, data export requests, or erasure notices, please contact our data privacy desk directly at: privacy@accusoft.app"
    }
  ];

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mb-4">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
              Legal & Privacy
            </span>
            <span className="text-xs text-slate-400 font-medium">Last updated: August 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Your trust is our highest priority. Learn how Accusoft collects, uses, and protects your personal and expense ledger data.
          </p>
        </div>

        {/* Content Cards */}
        <div className="space-y-4">
          {sections.map((sec, i) => (
            <div 
              key={i}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shrink-0">
                  {sec.icon}
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                  {sec.title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400 pl-11">
                {sec.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Privacy;