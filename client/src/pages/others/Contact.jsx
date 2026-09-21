import React, { useState, useEffect } from "react";
import { Mail, MessageSquare, Send, Globe, CheckCircle2, ArrowLeft, Trash2, Check, RefreshCw, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "../../utils/toast";
import { useApi } from "../../utils/useApi";

const Contact = () => {
  const { request, loading } = useApi();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await request({
        url: "contact",
        method: "POST",
        data: formData,
      });
      setSubmitted(true);
      toast.success("Thank you! Your message has been sent to the admin.");
    } catch (error) {
      // useApi handles error toast
    }
  };

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
              Get in Touch
            </span>
            <span className="text-xs text-slate-400 font-medium">Direct Inquiries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            Contact Support & Inquiries
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Have questions about expense tracking, feature feedback, or need assistance? Leave a message below and our team will review it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Left Column: Info Cards */}
          <div className="space-y-4 md:col-span-1">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 w-fit">
                <Mail size={18} />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Email Desk</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">General queries & support:</p>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">support@accusoft.app</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
              <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 w-fit">
                <Globe size={18} />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Developer Portfolio</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Created by Jai Kishan</p>
              <a 
                href="https://portfolio.battlefiesta.in/" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline block truncate"
              >
                portfolio.battlefiesta.in →
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Message Delivered!</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Thank you for reaching out. Your inquiry has been saved and forwarded to the administrator.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-4 px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Your Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Question regarding monthly reports"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition cursor-pointer disabled:opacity-50"
                >
                  <Send size={14} /> {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
