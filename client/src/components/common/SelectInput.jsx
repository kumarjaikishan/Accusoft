import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Modern, Reusable Native Select Component
 * Clean Tailwind styling, dark mode support, options array or children
 */
export const SelectInput = forwardRef(({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder,
  disabled = false,
  required = false,
  error,
  helperText,
  className = '',
  containerClassName = '',
  children,
  ...props
}, ref) => {
  const selectId = id || name;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold text-slate-700 dark:text-slate-300 select-none"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative w-full flex items-center">
        <select
          ref={ref}
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            w-full appearance-none px-3.5 py-2.5 pr-9 text-xs sm:text-sm rounded-xl font-medium
            bg-white dark:bg-slate-800/90
            text-slate-800 dark:text-slate-100
            border border-slate-200 dark:border-slate-700
            hover:border-slate-300 dark:hover:border-slate-600
            focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20
            disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed
            transition-all duration-150 outline-none cursor-pointer
            ${error ? '!border-rose-500 !ring-rose-500/20' : ''}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.length > 0
            ? options.map((opt) => {
                const optVal = typeof opt === 'object' ? opt.value : opt;
                const optLabel = typeof opt === 'object' ? opt.label : opt;
                return (
                  <option key={String(optVal)} value={optVal} className="dark:bg-slate-900">
                    {optLabel}
                  </option>
                );
              })
            : children}
        </select>

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 text-slate-400 dark:text-slate-500"
        />
      </div>

      {helperText && (
        <span className={`text-[11px] ${error ? 'text-rose-500 font-medium' : 'text-slate-400'}`}>
          {helperText}
        </span>
      )}
    </div>
  );
});

SelectInput.displayName = 'SelectInput';

export default SelectInput;
