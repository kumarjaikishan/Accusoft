import React, { useRef, useEffect } from 'react';

const OtpInput = ({ value = "", onChange, length = 6, disabled = false, autoFocus = true }) => {
    const inputRefs = useRef([]);

    useEffect(() => {
        if (autoFocus && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [autoFocus]);

    const digits = (value || "").padEnd(length, " ").slice(0, length).split("");

    const handleChange = (e, idx) => {
        const val = e.target.value;
        const lastChar = val.slice(-1);

        if (!/^[0-9]$/.test(lastChar) && lastChar !== "") return;

        const currentChars = value.split("");
        currentChars[idx] = lastChar;
        const nextValue = currentChars.join("").trim();
        onChange(nextValue);

        // Move to next box if character was entered
        if (lastChar && idx < length - 1) {
            inputRefs.current[idx + 1]?.focus();
        }
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === "Backspace") {
            if (!digits[idx] || digits[idx] === " ") {
                if (idx > 0) {
                    inputRefs.current[idx - 1]?.focus();
                }
            } else {
                const currentChars = value.split("");
                currentChars[idx] = "";
                onChange(currentChars.join("").trim());
            }
        } else if (e.key === "ArrowLeft" && idx > 0) {
            inputRefs.current[idx - 1]?.focus();
        } else if (e.key === "ArrowRight" && idx < length - 1) {
            inputRefs.current[idx + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain").replace(/[^0-9]/g, "").slice(0, length);
        if (pastedData) {
            onChange(pastedData);
            const targetIndex = Math.min(pastedData.length, length - 1);
            inputRefs.current[targetIndex]?.focus();
        }
    };

    return (
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            {Array.from({ length }).map((_, idx) => {
                const char = digits[idx] && digits[idx] !== " " ? digits[idx] : "";
                const isFilled = Boolean(char);
                return (
                    <input
                        key={idx}
                        ref={(el) => (inputRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={char}
                        disabled={disabled}
                        onChange={(e) => handleChange(e, idx)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        onPaste={handlePaste}
                        className={`w-10 h-12 sm:w-11 sm:h-13 text-center text-lg sm:text-xl font-black font-mono rounded-xl border transition-all duration-200 outline-none select-none ${
                            isFilled
                                ? "bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-xs"
                                : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                );
            })}
        </div>
    );
};

export default OtpInput;
