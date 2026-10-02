import React, { useState, useRef, useEffect, useMemo, forwardRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * Modern Selectable Dropdown Component (SelectInput)
 * Replaces standard HTML <select> with custom floating menu
 * matching table pagination rows selector with checkmark, dark mode & no-scrollbar.
 *
 * Props:
 * - label: optional top label
 * - name: input name
 * - value: current selected value
 * - onChange: callback({ target: { name, value } }) or (value)
 * - options: array of { label, value } or string/number primitives
 * - placeholder: default placeholder text
 * - disabled: boolean
 * - required: boolean
 * - error: boolean
 * - helperText: error/info string
 * - placement: 'bottom' | 'top' (default 'bottom')
 * - className: custom class for trigger button
 * - containerClassName: custom class for wrapper
 * - menuClassName: custom class for dropdown popover
 * - size: 'sm' | 'md' (default 'md')
 */
export const SelectInput = forwardRef(({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select option...',
  disabled = false,
  required = false,
  error,
  helperText,
  placement = 'bottom',
  className = '',
  containerClassName = '',
  menuClassName = '',
  size = 'md',
  children,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Normalize options from options array or <option> children
  const parsedOptions = useMemo(() => {
    if (Array.isArray(options) && options.length > 0) {
      return options.map((opt) => {
        if (typeof opt === 'object' && opt !== null) {
          return {
            value: opt.value !== undefined ? opt.value : opt._id,
            label: opt.label !== undefined ? opt.label : (opt.name || opt.ledger || String(opt.value)),
          };
        }
        return { value: opt, label: String(opt) };
      });
    }

    if (children) {
      const opts = [];
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.props) {
          opts.push({
            value: child.props.value,
            label: child.props.children || child.props.label || String(child.props.value),
          });
        }
      });
      return opts;
    }

    return [];
  }, [options, children]);

  // Find currently selected option
  const selectedOption = useMemo(() => {
    return parsedOptions.find((opt) => String(opt.value) === String(value));
  }, [parsedOptions, value]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Selection handler
  const handleSelect = (optionVal) => {
    if (disabled) return;
    setIsOpen(false);
    if (onChange) {
      onChange({
        target: {
          name,
          value: optionVal,
        },
      });
    }
  };

  const isSmall = size === 'sm';

  return (
    <div
      ref={wrapperRef}
      className={`relative flex flex-col gap-1.5 ${containerClassName}`}
    >
      {label && (
        <label
          htmlFor={id || name}
          className="text-xs font-semibold text-slate-700 dark:text-slate-300 select-none flex items-center justify-between"
        >
          <span>
            {label} {required && <span className="text-rose-500">*</span>}
          </span>
        </label>
      )}

      <div className="relative w-full">
        <button
          ref={ref}
          type="button"
          id={id || name}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={`
            w-full flex items-center justify-between gap-2 text-left font-medium
            rounded-xl border transition-all duration-150 outline-none cursor-pointer select-none
            ${isSmall ? 'h-8 px-2.5 text-xs' : 'h-[42px] px-3.5 text-xs sm:text-sm'}
            bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100
            border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600
            ${isOpen ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/20 shadow-sm' : 'shadow-xs'}
            ${error ? 'border-rose-500! ring-rose-500/20!' : ''}
            ${disabled ? 'opacity-50 bg-slate-100 dark:bg-slate-800/50 cursor-not-allowed' : ''}
            ${className}
          `}
          {...props}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : (placeholder || 'Select...')}
          </span>
          <ChevronDown
            size={isSmall ? 13 : 15}
            className={`text-slate-400 dark:text-slate-500 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-indigo-500 dark:text-indigo-400' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu Overlay */}
        {isOpen && (
          <div
            className={`
              absolute left-0 right-0 z-[100] min-w-full max-h-60 overflow-y-auto no-scrollbar
              bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750
              rounded-xl shadow-2xl shadow-slate-900/20 dark:shadow-black/60 py-1
              backdrop-blur-md animate-in fade-in zoom-in-95 duration-100
              [scrollbar-width:none] [-ms-overflow-style:none]
              ${placement === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'}
              ${menuClassName}
            `}
          >
            {parsedOptions.length === 0 ? (
              <div className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500 italic text-center">
                No options available
              </div>
            ) : (
              parsedOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`
                      w-full px-3 py-2 text-xs text-left flex items-center justify-between gap-2 font-medium cursor-pointer transition-colors
                      ${
                        isSelected
                          ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                      }
                    `}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <Check size={13} strokeWidth={2.5} className="text-teal-600 dark:text-teal-400 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
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

SelectInput.displayName = 'SelectInput';

export default SelectInput;
