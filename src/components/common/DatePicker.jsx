import React, { useState, useRef, useEffect, forwardRef, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';

/**
 * Modern Custom DatePicker Component
 * Pure React + Tailwind CSS + Lucide Icons + Framer Motion (Zero 3rd party date picker libraries).
 * Supports month/year navigation, quick jump selector, "Today"/"Yesterday" shortcuts, and dark mode.
 */
export const DatePicker = forwardRef(({
  label,
  id,
  name = 'date',
  value, // format: "YYYY-MM-DD"
  onChange,
  placeholder = 'Select date...',
  disabled = false,
  required = false,
  error,
  helperText,
  className = '',
  containerClassName = '',
  minDate,
  maxDate,
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState('days'); // 'days' | 'months'
  const wrapperRef = useRef(null);

  // Parse current selected date or fallback to today
  const selectedDate = useMemo(() => {
    if (!value) return null;
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : null;
  }, [value]);

  // Current calendar viewing month & year
  const [viewDate, setViewDate] = useState(() => selectedDate || dayjs());

  // Keep viewDate in sync when value changes externally
  useEffect(() => {
    if (selectedDate) {
      setViewDate(selectedDate);
    }
  }, [value]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setViewMode('days');
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

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setViewMode('days');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Navigation handlers
  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setViewDate((prev) => prev.subtract(1, 'month'));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setViewDate((prev) => prev.add(1, 'month'));
  };

  const handlePrevYear = (e) => {
    e.stopPropagation();
    setViewDate((prev) => prev.subtract(1, 'year'));
  };

  const handleNextYear = (e) => {
    e.stopPropagation();
    setViewDate((prev) => prev.add(1, 'year'));
  };

  // Date selection
  const handleSelectDate = (dateObj) => {
    const formatted = dateObj.format('YYYY-MM-DD');
    if (onChange) {
      onChange({
        target: {
          name,
          value: formatted,
        },
      });
    }
    setIsOpen(false);
    setViewMode('days');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onChange) {
      onChange({
        target: {
          name,
          value: '',
        },
      });
    }
  };

  // Quick preset shortcuts
  const selectToday = (e) => {
    e.stopPropagation();
    handleSelectDate(dayjs());
  };

  const selectYesterday = (e) => {
    e.stopPropagation();
    handleSelectDate(dayjs().subtract(1, 'day'));
  };

  // Generate calendar days grid
  const calendarDays = useMemo(() => {
    const startOfMonth = viewDate.startOf('month');
    const endOfMonth = viewDate.endOf('month');
    const startDayOfWeek = startOfMonth.day(); // 0 (Sun) to 6 (Sat)
    const daysInMonth = viewDate.daysInMonth();

    const days = [];

    // Previous month padding days
    const prevMonth = viewDate.subtract(1, 'month');
    const prevMonthDays = prevMonth.daysInMonth();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonth.date(prevMonthDays - i);
      days.push({
        date: day,
        isCurrentMonth: false,
        isToday: day.isSame(dayjs(), 'day'),
        isSelected: selectedDate ? day.isSame(selectedDate, 'day') : false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const day = viewDate.date(d);
      days.push({
        date: day,
        isCurrentMonth: true,
        isToday: day.isSame(dayjs(), 'day'),
        isSelected: selectedDate ? day.isSame(selectedDate, 'day') : false,
      });
    }

    // Next month padding days to complete 35 or 42 grid cells
    const remaining = (7 - (days.length % 7)) % 7;
    const nextMonth = viewDate.add(1, 'month');
    for (let d = 1; d <= remaining; d++) {
      const day = nextMonth.date(d);
      days.push({
        date: day,
        isCurrentMonth: false,
        isToday: day.isSame(dayjs(), 'day'),
        isSelected: selectedDate ? day.isSame(selectedDate, 'day') : false,
      });
    }

    return days;
  }, [viewDate, selectedDate]);

  const monthsList = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const displayFormattedDate = selectedDate ? selectedDate.format('DD MMM, YYYY') : '';

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
          {selectedDate && (
            <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-normal">
              {selectedDate.format('YYYY-MM-DD')}
            </span>
          )}
        </label>
      )}

      {/* Input Trigger */}
      <div
        id={id || name}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`
          w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl font-medium
          bg-white dark:bg-slate-800/90
          text-slate-800 dark:text-slate-100
          border border-slate-200 dark:border-slate-700
          hover:border-slate-300 dark:hover:border-slate-600
          cursor-pointer select-none flex items-center justify-between gap-2
          transition-all duration-150 outline-none
          ${isOpen ? 'border-[var(--maincolor,#6366f1)] ring-2 ring-[var(--maincolor,#6366f1)]/20' : ''}
          ${error ? '!border-rose-500 !ring-rose-500/20' : ''}
          ${disabled ? 'opacity-50 bg-slate-100 dark:bg-slate-800/50 cursor-not-allowed' : ''}
          ${className}
        `}
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <CalendarIcon size={16} className="text-[var(--maincolor,#6366f1)] shrink-0" />
          {displayFormattedDate ? (
            <span className="truncate font-semibold text-slate-800 dark:text-slate-100">
              {displayFormattedDate}
            </span>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 truncate">
              {placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {displayFormattedDate && !disabled && !required && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-md transition"
              title="Clear date"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Popover Calendar */}
      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="
              absolute top-[calc(100%+6px)] left-0 sm:left-auto right-0 sm:right-auto
              w-full sm:w-[320px] min-w-[280px] max-w-[calc(100vw-32px)]
              bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800
              rounded-2xl shadow-2xl z-50 p-3 sm:p-3.5 select-none font-sans touch-manipulation
            "
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between gap-1 pb-2.5 sm:pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevYear}
                  title="Previous Year"
                  className="p-1.5 sm:p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-90 transition cursor-pointer"
                >
                  <ChevronsLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  title="Previous Month"
                  className="p-1.5 sm:p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-90 transition cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
              </div>

              {/* Month / Year button toggle */}
              <button
                type="button"
                onClick={() => setViewMode((prev) => (prev === 'days' ? 'months' : 'days'))}
                className="px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-[var(--maincolor)]/10 hover:text-[var(--maincolor)] rounded-lg transition"
              >
                {viewDate.format('MMMM YYYY')}
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleNextMonth}
                  title="Next Month"
                  className="p-1.5 sm:p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-90 transition cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleNextYear}
                  title="Next Year"
                  className="p-1.5 sm:p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-90 transition cursor-pointer"
                >
                  <ChevronsRight size={16} />
                </button>
              </div>
            </div>

            {/* View Mode: Days Grid */}
            {viewMode === 'days' && (
              <>
                {/* Days of week */}
                <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
                  {daysOfWeek.map((day, idx) => (
                    <span
                      key={day}
                      className={`text-[11px] font-bold ${
                        idx === 0 || idx === 6
                          ? 'text-rose-500/80 dark:text-rose-400/80'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {day}
                    </span>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((item, idx) => {
                    const isSelected = item.isSelected;
                    const isCurrent = item.isCurrentMonth;
                    const isToday = item.isToday;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectDate(item.date)}
                        className={`
                          h-8.5 sm:h-8 text-xs font-semibold rounded-xl flex items-center justify-center relative transition-all duration-150 cursor-pointer active:scale-95 touch-manipulation
                          ${
                            isSelected
                              ? 'bg-[var(--maincolor,#4f46e5)] text-white font-black shadow-md shadow-[var(--maincolor)]/30 scale-105'
                              : isToday
                              ? 'bg-[var(--maincolor)]/10 text-[var(--maincolor)] font-bold border border-[var(--maincolor)]/30'
                              : isCurrent
                              ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700'
                              : 'text-slate-300 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                          }
                        `}
                      >
                        {item.date.date()}
                        {isToday && !isSelected && (
                          <span className="absolute bottom-1 w-1 h-1 bg-[var(--maincolor)] rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* View Mode: Month Picker */}
            {viewMode === 'months' && (
              <div className="grid grid-cols-3 gap-2 py-2">
                {monthsList.map((m, idx) => {
                  const isCurrentMonth = viewDate.month() === idx;
                  const isThisMonth = dayjs().month() === idx && dayjs().year() === viewDate.year();

                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setViewDate((prev) => prev.month(idx));
                        setViewMode('days');
                      }}
                      className={`
                        py-2 text-xs font-bold rounded-xl transition cursor-pointer active:scale-95 touch-manipulation
                        ${
                          isCurrentMonth
                            ? 'bg-[var(--maincolor,#4f46e5)] text-white shadow-sm'
                            : isThisMonth
                            ? 'bg-[var(--maincolor)]/10 text-[var(--maincolor)] border border-[var(--maincolor)]/30'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }
                      `}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Quick Shortcuts Footer */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={selectYesterday}
                  className="px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 font-semibold transition flex items-center gap-1 text-[11px] cursor-pointer touch-manipulation"
                >
                  <RotateCcw size={12} className="text-slate-400" />
                  Yesterday
                </button>
                <button
                  type="button"
                  onClick={selectToday}
                  className="px-2.5 py-1 rounded-lg bg-[var(--maincolor)]/10 text-[var(--maincolor)] hover:bg-[var(--maincolor)]/20 active:scale-95 font-bold transition text-[11px] cursor-pointer touch-manipulation"
                >
                  Today
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setViewMode('days');
                }}
                className="px-2 py-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 active:scale-95 text-[11px] font-medium cursor-pointer touch-manipulation"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {helperText && (
        <span className={`text-[11px] ${error ? 'text-rose-500 font-medium' : 'text-slate-400'}`}>
          {helperText}
        </span>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
