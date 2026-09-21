import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

/**
 * AutocompleteSelect Component
 * Allows user to type to filter/search AND click to select a ledger from a dropdown.
 * Supports keyboard navigation, click outside, clear selection, and dark mode.
 */
export const AutocompleteSelect = forwardRef(({
  label,
  id,
  name = 'ledger',
  value,
  onChange,
  options = [],
  placeholder = 'Type or select ledger...',
  disabled = false,
  required = false,
  error,
  helperText,
  className = '',
  containerClassName = '',
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Find the currently selected option object
  const selectedOption = options.find((opt) => opt.value === value || opt._id === value);

  // Sync display text when value changes
  useEffect(() => {
    if (selectedOption) {
      setSearchTerm(selectedOption.label || selectedOption.ledger || '');
    } else if (!value) {
      setSearchTerm('');
    }
  }, [value, selectedOption]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        // Reset search term back to selected option label if user didn't pick anything
        if (selectedOption) {
          setSearchTerm(selectedOption.label || selectedOption.ledger || '');
        } else {
          setSearchTerm('');
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedOption]);

  // Filter options based on user input
  const filteredOptions = options.filter((opt) => {
    const text = (opt.label || opt.ledger || '').toLowerCase();
    return text.includes(searchTerm.toLowerCase().trim());
  });

  const handleSelect = (opt) => {
    const optVal = opt.value || opt._id;
    const optLabel = opt.label || opt.ledger;
    setSearchTerm(optLabel);
    setIsOpen(false);
    if (onChange) {
      onChange({
        target: {
          name,
          value: optVal,
        },
      });
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSearchTerm('');
    if (onChange) {
      onChange({
        target: {
          name,
          value: '',
        },
      });
    }
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className={`w-full flex flex-col gap-1.5 relative ${containerClassName}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="text-xs font-semibold text-slate-700 dark:text-slate-300 select-none flex items-center justify-between"
        >
          <span>
            {label} {required && <span className="text-rose-500">*</span>}
          </span>
          {isOpen && (
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-normal">
              {filteredOptions.length} matching
            </span>
          )}
        </label>
      )}

      <div className="relative w-full flex items-center">
        <input
          ref={inputRef}
          id={id || name}
          name={name}
          type="text"
          value={searchTerm}
          disabled={disabled}
          autoComplete="off"
          placeholder={placeholder}
          onClick={() => setIsOpen(true)}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
            // If user types, clear raw value until an option matches or is selected
            if (value && e.target.value !== selectedOption?.label) {
              const exactMatch = options.find(
                (opt) => (opt.label || opt.ledger).toLowerCase() === e.target.value.toLowerCase().trim()
              );
              if (exactMatch && onChange) {
                onChange({ target: { name, value: exactMatch.value || exactMatch._id } });
              }
            }
          }}
          className={`
            w-full px-3.5 py-2.5 pr-14 text-xs sm:text-sm rounded-xl font-medium
            bg-white dark:bg-slate-800/90
            text-slate-800 dark:text-slate-100
            border border-slate-200 dark:border-slate-700
            hover:border-slate-300 dark:hover:border-slate-600
            focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed
            transition-all duration-150 outline-none
            ${error ? '!border-rose-500 !ring-rose-500/20' : ''}
            ${className}
          `}
        />

        {/* Action icons */}
        <div className="absolute right-2.5 flex items-center gap-1">
          {searchTerm && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              title="Clear selection"
            >
              <X size={14} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
            className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"
          >
            <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full max-h-56 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 py-1.5 scrollbar-thin">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => {
              const optVal = opt.value || opt._id;
              const optLabel = opt.label || opt.ledger;
              const isSelected = value === optVal;

              return (
                <div
                  key={String(optVal)}
                  onClick={() => handleSelect(opt)}
                  className={`
                    px-3.5 py-2 text-xs sm:text-sm font-medium flex items-center justify-between cursor-pointer transition-colors
                    ${isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                    }
                  `}
                >
                  <span className="capitalize">{optLabel}</span>
                  {isSelected && <Check size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />}
                </div>
              );
            })
          ) : (
            <div className="px-3.5 py-3 text-center text-xs text-slate-400 dark:text-slate-500">
              No matching ledgers found
            </div>
          )}
        </div>
      )}

      {helperText && (
        <span className={`text-[11px] ${error ? 'text-rose-500 font-medium' : 'text-slate-400'}`}>
          {helperText}
        </span>
      )}
    </div>
  );
});

AutocompleteSelect.displayName = 'AutocompleteSelect';

export default AutocompleteSelect;
