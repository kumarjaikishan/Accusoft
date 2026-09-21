import React, { useState, useEffect } from "react";
import { MessageSquare, Mail, User, Clock, Trash2, CheckCircle2, RefreshCw, Eye, Search, AlertCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { useApi } from "../../utils/useApi";
import { toast } from "../../utils/toast";
import { confirmDialog } from "../../utils/confirm";

const AdminContacts = () => {
  const { request, loading } = useApi();
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchContacts = async () => {
    try {
      const res = await request({ url: "admin/contacts", method: "GET" });
      setContacts(res?.contacts || []);
    } catch (error) {
      // Error handled by useApi
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await request({
        url: `admin/contacts/${id}`,
        method: "PUT",
        data: { status },
      });
      toast.success(`Message marked as ${status}`);
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status } : c))
      );
      if (selectedMessage?._id === id) {
        setSelectedMessage((prev) => ({ ...prev, status }));
      }
    } catch (error) {
      // Error handled by useApi
    }
  };

  const handleDelete = async (id) => {
    const confirm = await confirmDialog({
      title: "Delete message?",
      text: "This action cannot be undone.",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    });

    if (confirm) {
      try {
        await request({
          url: `admin/contacts/${id}`,
          method: "DELETE",
        });
        toast.success("Message deleted successfully");
        setContacts((prev) => prev.filter((c) => c._id !== id));
        if (selectedMessage?._id === id) {
          setSelectedMessage(null);
        }
      } catch (error) {
        // Error handled by useApi
      }
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.subject?.toLowerCase().includes(search.toLowerCase()) ||
      c.message?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const unreadCount = contacts.filter((c) => c.status === "unread").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1120] p-3 sm:p-5 space-y-4 font-sans text-slate-700 dark:text-slate-200"
    >
      {/* ---------- 1. HEADER BAR ---------- */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm backdrop-blur-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
              Admin Portal
            </span>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/50">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100 mt-0.5 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            User Inquiries & Messages
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            View messages submitted from the public contact page
          </p>
        </div>

        <button
          onClick={fetchContacts}
          disabled={loading}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* ---------- 2. SEARCH & STATUS FILTER TABS ---------- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-indigo-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 w-full sm:w-auto text-xs font-semibold">
          {[
            { id: "all", label: "All" },
            { id: "unread", label: "Unread" },
            { id: "read", label: "Read" },
            { id: "resolved", label: "Resolved" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`flex-1 sm:flex-none px-3 py-1 rounded-lg transition cursor-pointer text-[11px] ${
                statusFilter === tab.id
                  ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- 3. MESSAGES LIST & DETAIL VIEW ---------- */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Messages List (Span 2) */}
        <div className="lg:col-span-2 space-y-2">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((item) => (
              <div
                key={item._id}
                onClick={() => {
                  setSelectedMessage(item);
                  if (item.status === "unread") {
                    handleUpdateStatus(item._id, "read");
                  }
                }}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedMessage?._id === item._id
                    ? "bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-500/50 shadow-sm"
                    : "bg-white dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                        {item.name}
                      </span>
                      <span
                        className={`text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          item.status === "unread"
                            ? "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
                            : item.status === "resolved"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 truncate mt-0.5">
                      {item.subject}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {item.message}
                    </p>
                  </div>

                  <div className="text-[10px] text-slate-400 font-medium shrink-0 text-right">
                    {dayjs(item.createdAt).format("DD MMM, hh:mm A")}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No Inquiries Found</p>
              <p className="text-xs text-slate-400 mt-0.5">No contact requests matching the filter criteria</p>
            </div>
          )}
        </div>

        {/* Selected Message Reader Panel */}
        <div className="lg:col-span-1">
          {selectedMessage ? (
            <div className="sticky top-20 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase text-slate-400">Message Detail</span>
                <div className="flex items-center gap-1.5">
                  {selectedMessage.status !== "resolved" ? (
                    <button
                      onClick={() => handleUpdateStatus(selectedMessage._id, "resolved")}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 text-[11px] font-bold hover:bg-emerald-100 transition cursor-pointer"
                    >
                      Mark Resolved
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(selectedMessage._id, "read")}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[11px] font-bold hover:bg-slate-200 transition cursor-pointer"
                    >
                      Reopen
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedMessage._id)}
                    className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                    title="Delete Message"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                  {selectedMessage.subject}
                </h3>
                <div className="mt-2 space-y-1 text-xs">
                  <p className="text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-400">From:</span> {selectedMessage.name}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-400">Email:</span>{" "}
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    <span className="font-semibold">Received:</span>{" "}
                    {dayjs(selectedMessage.createdAt).format("DD MMMM YYYY, hh:mm A")}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>

              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                  selectedMessage.subject
                )}`}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm"
              >
                <Mail size={13} /> Reply via Email
              </a>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
              <Eye className="w-6 h-6 mx-auto mb-2 opacity-40" />
              Select a message on the left to read full contents and reply
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminContacts;
