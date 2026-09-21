import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingButton = ({
  children,
  loading = false,
  disabled = false,
  onClick,
  className = "",
  variant = 'primary',
  type = 'button',
  icon: Icon,
}) => {
  const baseStyles = "flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm active:scale-95 shadow-sm";
  
  const variants = {
    primary: "bg-[var(--maincolor)] text-white hover:opacity-90 shadow-indigo-500/20",
    outline: "border border-[var(--theme-border)] text-[var(--theme-content)] bg-transparent hover:bg-[var(--theme-border)]",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-red-500/20",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20",
    ghost: "bg-transparent text-[var(--theme-content)] hover:bg-slate-100 dark:hover:bg-slate-800"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        Icon && <Icon size={18} />
      )}
      <span>
        {loading ? (typeof children === 'string' && !children.toLowerCase().includes('load') ? 'Loading...' : children) : children}
      </span>
    </button>
  );
};

export default LoadingButton;
