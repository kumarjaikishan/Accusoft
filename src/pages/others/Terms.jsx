import React from "react";
import { Scale, CheckSquare, AlertTriangle, FileText, Ban, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
  const sections = [
    {
      icon: <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      title: "1. Acceptance of Terms",
      text: "By accessing or using Accusoft, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, please do not use the application."
    },
    {
      icon: <FileText className="w-5 h-5 text-cyan-500" />,
      title: "2. Description of Service",
      text: "Accusoft provides digital expense tracking, categorization, ledger analytics, receipt records, and financial summary reporting tools designed for personal, team, and organizational ledger management."
    },
    {
      icon: <Ban className="w-5 h-5 text-rose-500" />,
      title: "3. User Responsibilities & Acceptable Use",
      text: "You are responsible for safeguarding your login credentials and ensuring all expense entries adhere to applicable local laws. You agree not to upload malicious scripts, attempt unauthorized database access, or misuse the infrastructure."
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      title: "4. No Financial or Tax Advice",
      text: "Accusoft is an organizational tracking tool and does not provide formal accounting, tax, or legal advice. Calculations, budget forecasting, and analytics are provided for informational convenience only."
    },
    {
      icon: <Scale className="w-5 h-5 text-emerald-500" />,
      title: "5. Limitation of Liability",
      text: "To the maximum extent permitted by law, Accusoft and its developers shall not be liable for indirect, incidental, or consequential damages resulting from data loss, downtime, or business interruption."
    },
    {
      icon: <Mail className="w-5 h-5 text-indigo-500" />,
      title: "6. Questions & Legal Notices",
      text: "For questions regarding these Terms or legal matters, please reach out to: legal@accusoft.app"
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
              Terms of Service
            </span>
            <span className="text-xs text-slate-400 font-medium">Last updated: August 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            Terms & Conditions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Please read these terms carefully before accessing or using the Accusoft expense management platform.
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

export default Terms;