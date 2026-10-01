import React, { useState, useEffect } from "react";
import { ShieldAlert, X, Check, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useApi } from "../utils/useApi";
import { updateCookieConsentStatus } from "../store/api";

const CONSENT_STORAGE_KEY = "accusoft_user_privacy_preference";

const PrivacyBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const user = useSelector((state) => state.userexplist?.user);
  const dispatch = useDispatch();
  const { request } = useApi();

  // 1. Sync from User DB profile across devices
  useEffect(() => {
    // If the authenticated user has already accepted or chosen essential in DB
    const dbConsentStatus = user?.cookieConsent?.status;
    if (dbConsentStatus && dbConsentStatus !== 'none') {
      localStorage.setItem(CONSENT_STORAGE_KEY, dbConsentStatus);
      setIsVisible(false);
      return;
    }

    // Otherwise check local device storage
    const localConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!localConsent) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // 2. Save consent locally + sync to DB if logged in
  const recordConsent = async (status) => {
    localStorage.setItem(CONSENT_STORAGE_KEY, status);
    dispatch(updateCookieConsentStatus(status));
    setIsVisible(false);

    const token = localStorage.getItem("token");
    if (token) {
      try {
        await request({
          url: "cookieconsent",
          method: "POST",
          data: { status }
        });
      } catch (err) {
        console.warn("Could not sync privacy preference to DB:", err?.message || err);
      }
    }
  };

  const handleAccept = () => recordConsent("accepted");
  const handleDecline = () => recordConsent("essential_only");

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Privacy & Terms Notice"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 pointer-events-auto transition-all duration-300 transform translate-y-0 opacity-100"
    >
      <div className="p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-900/10 dark:shadow-black/50 text-slate-800 dark:text-slate-100 flex flex-col gap-3">
        
        {/* Header & Icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Privacy & Data Notice
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                DPDP & GDPR Compliant
              </span>
            </div>
          </div>

          <button
            onClick={handleDecline}
            aria-label="Close Notice"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          We use strictly essential session data and local storage to keep you securely logged in, remember your theme, and manage your encrypted ledger. We never sell your personal data.
        </p>

        {/* Actions & Links */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
          <div className="flex items-center gap-2 text-xs">
            <Link
              to="/privacy"
              onClick={() => setIsVisible(false)}
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Privacy Policy
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              to="/terms"
              onClick={() => setIsVisible(false)}
              className="font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:underline"
            >
              Terms
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDecline}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 transition-colors"
            >
              Essential Only
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-xs flex items-center justify-center gap-1 transition-all"
            >
              <Check className="w-3.5 h-3.5" /> Got it
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
};

export default PrivacyBanner;
