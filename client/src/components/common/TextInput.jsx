import React, { forwardRef } from 'react';

/**
 * Modern, Reusable Native Input Component
 * Clean Tailwind styling, dark mode support, prefix/suffix adornments, error states
 */
export const TextInput = forwardRef(({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  error,
  helperText,
  startAdornment,
  endAdornment,
  className = '',
  inputClassName = '',
  containerClassName = '',
  rows,
  multiline = false,
  inputMode,
  pattern,
  ...props
}, ref) => {
  const inputId = id || name;

  const baseInputStyles = `
    w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl font-medium
    bg-white dark:bg-slate-800/90
    text-slate-800 dark:text-slate-100
    border border-slate-200 dark:border-slate-700
    hover:border-slate-300 dark:hover:border-slate-600
    focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20
    placeholder:text-slate-400 dark:placeholder:text-slate-500
    disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed
    transition-all duration-150 outline-none
    ${error ? '!border-rose-500 !ring-rose-500/20' : ''}
    ${startAdornment ? 'pl-8' : ''}
    ${endAdornment ? 'pr-8' : ''}
    ${inputClassName}
  `;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-slate-700 dark:text-slate-300 select-none"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative w-full flex items-center">
        {startAdornment && (
          <div className="absolute left-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 text-xs sm:text-sm">
            {startAdornment}
          </div>
        )}

        {multiline ? (
          <textarea
            ref={ref}
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            rows={rows || 3}
            className={`${baseInputStyles} resize-none`}
            {...props}
          />
        ) : (
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            inputMode={inputMode}
            pattern={pattern}
            className={baseInputStyles}
            {...props}
          />
        )}

        {endAdornment && (
          <div className="absolute right-3 flex items-center text-slate-400 dark:text-slate-500 text-xs sm:text-sm">
            {endAdornment}
          </div>
        )}
      </div>

      {helperText && (
        <span className={`text-[11px] ${error ? 'text-rose-500 font-medium' : 'text-slate-400'}`}>
          {helperText}
        </span>
      )}
    </div>
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;
