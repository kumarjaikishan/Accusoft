import React from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, CheckCircle2, HelpCircle, X } from "lucide-react";

/**
 * Modern, accessible confirmation & alert dialog replacing legacy sweetalert.
 * Returns a Promise that resolves to `true` on confirm, or `false`/`null` on cancel.
 */
const ConfirmModal = ({
  isOpen,
  title,
  text,
  icon = "warning",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = true,
  isAlert = false,
  onConfirm,
  onCancel,
}) => {
  const iconMap = {
    warning: <AlertTriangle className="w-12 h-12 text-amber-500" />,
    danger: <AlertTriangle className="w-12 h-12 text-rose-500" />,
    success: <CheckCircle2 className="w-12 h-12 text-emerald-500" />,
    info: <Info className="w-12 h-12 text-indigo-500" />,
    question: <HelpCircle className="w-12 h-12 text-blue-500" />,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 p-6 overflow-hidden z-10 text-center"
          >
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
            >
              <X size={18} />
            </button>

            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gray-50 dark:bg-slate-800/80 rounded-2xl">
                {iconMap[icon] || iconMap.warning}
              </div>
            </div>

            {title && (
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h3>
            )}

            {text && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                {text}
              </p>
            )}

            <div className="flex items-center justify-center gap-3">
              {!isAlert && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition active:scale-95"
                >
                  {cancelText}
                </button>
              )}

              <button
                type="button"
                onClick={onConfirm}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition shadow-sm active:scale-95 ${
                  isDanger
                    ? "bg-rose-600 hover:bg-rose-700 shadow-rose-500/20"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20"
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const confirmDialog = (options = {}) => {
  if (typeof options === "string") {
    options = { title: options };
  }

  const {
    title = "Are you sure?",
    text = "This action cannot be undone.",
    icon = "warning",
    buttons = true,
    dangerMode = true,
    button = null,
  } = options;

  let confirmText = "Confirm";
  let cancelText = "Cancel";
  let isAlert = false;

  if (Array.isArray(buttons)) {
    cancelText = buttons[0] || "Cancel";
    confirmText = buttons[1] || "Confirm";
  } else if (typeof buttons === "boolean" && !buttons) {
    isAlert = true;
    confirmText = button?.text || "OK";
  } else if (button && typeof button === "object") {
    isAlert = true;
    confirmText = button.text || "OK";
  }

  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    const cleanup = () => {
      setTimeout(() => {
        root.unmount();
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      }, 200);
    };

    const handleConfirm = () => {
      cleanup();
      resolve(true);
    };

    const handleCancel = () => {
      cleanup();
      resolve(false);
    };

    root.render(
      <ConfirmModal
        isOpen={true}
        title={title}
        text={text}
        icon={icon}
        confirmText={confirmText}
        cancelText={cancelText}
        isDanger={dangerMode}
        isAlert={isAlert}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );
  });
};

export default confirmDialog;
