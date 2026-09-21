import { toast as sonnerToast } from "sonner";

/**
 * Modern, lightweight toast adapter providing full backwards compatibility
 * with react-toastify API while powered by ultra-fast `sonner`.
 */
export const toast = {
  success: (message, options = {}) => {
    const duration = options.autoClose !== undefined ? options.autoClose : 3500;
    return sonnerToast.success(message, {
      id: options.toastId,
      duration,
    });
  },

  error: (message, options = {}) => {
    const duration = options.autoClose !== undefined ? options.autoClose : 5000;
    return sonnerToast.error(message, {
      id: options.toastId,
      duration,
    });
  },

  warn: (message, options = {}) => {
    const duration = options.autoClose !== undefined ? options.autoClose : 4000;
    return sonnerToast.warning(message, {
      id: options.toastId,
      duration,
    });
  },

  warning: (message, options = {}) => {
    const duration = options.autoClose !== undefined ? options.autoClose : 4000;
    return sonnerToast.warning(message, {
      id: options.toastId,
      duration,
    });
  },

  info: (message, options = {}) => {
    const duration = options.autoClose !== undefined ? options.autoClose : 3500;
    return sonnerToast.info(message, {
      id: options.toastId,
      duration,
    });
  },

  loading: (message, options = {}) => {
    return sonnerToast.loading(message, {
      id: options.toastId,
    });
  },

  /**
   * Updates an active toast (e.g. from loading state to success or error)
   */
  update: (toastId, { render, type = "success", isLoading, autoClose }) => {
    const duration = autoClose !== undefined ? autoClose : 2000;
    const message = render || "";

    if (isLoading) {
      sonnerToast.loading(message, { id: toastId });
      return toastId;
    }

    if (type === "success") {
      sonnerToast.success(message, { id: toastId, duration });
    } else if (type === "error") {
      sonnerToast.error(message, { id: toastId, duration });
    } else if (type === "warning" || type === "warn") {
      sonnerToast.warning(message, { id: toastId, duration });
    } else {
      sonnerToast(message, { id: toastId, duration });
    }

    return toastId;
  },

  dismiss: (toastId) => {
    sonnerToast.dismiss(toastId);
  },
};

export default toast;
