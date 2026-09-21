import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, RefreshCw, KeyRound, Sparkles } from 'lucide-react';
import { generateSecurePassword, calculatePasswordStrength } from '../../../utils/cryptoVault';
import { toast } from 'sonner';

const PasswordGenModal = ({ isOpen, onClose, onSelectPassword }) => {
    const [length, setLength] = useState(16);
    const [uppercase, setUppercase] = useState(true);
    const [lowercase, setLowercase] = useState(true);
    const [numbers, setNumbers] = useState(true);
    const [symbols, setSymbols] = useState(true);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [copied, setCopied] = useState(false);

    const handleGenerate = () => {
        const pass = generateSecurePassword({ length, uppercase, lowercase, numbers, symbols });
        setGeneratedPassword(pass);
        setCopied(false);
    };

    useEffect(() => {
        if (isOpen) {
            handleGenerate();
        }
    }, [isOpen, length, uppercase, lowercase, numbers, symbols]);

    const handleCopy = () => {
        if (!generatedPassword) return;
        navigator.clipboard.writeText(generatedPassword);
        setCopied(true);
        toast.success("Password copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleUse = () => {
        if (onSelectPassword && generatedPassword) {
            onSelectPassword(generatedPassword);
            onClose();
        }
    };

    const strength = calculatePasswordStrength(generatedPassword);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ duration: 0.2 }}
                    className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                <KeyRound className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Password Generator</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Cryptographically secure random password</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-5 space-y-5">
                        {/* Generated Password Box */}
                        <div className="p-3.5 bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-3">
                            <span className="font-mono text-base font-medium text-slate-800 dark:text-slate-100 tracking-wide break-all select-all">
                                {generatedPassword}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                    type="button"
                                    onClick={handleGenerate}
                                    title="Regenerate"
                                    className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    title="Copy Password"
                                    className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Strength Indicator */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500 dark:text-slate-400">Strength:</span>
                                <span className={`font-semibold ${strength.color}`}>{strength.label}</span>
                            </div>
                            <div className="grid grid-cols-4 gap-1.5 h-1.5">
                                {[1, 2, 3, 4].map((step) => (
                                    <div
                                        key={step}
                                        className={`rounded-full transition-all duration-300 ${
                                            strength.score >= step ? strength.bg : 'bg-slate-200 dark:bg-slate-800'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Length Slider */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs font-medium text-slate-700 dark:text-slate-300">
                                <span>Length</span>
                                <span className="font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold">
                                    {length}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="8"
                                max="48"
                                value={length}
                                onChange={(e) => setLength(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>

                        {/* Options Checkboxes */}
                        <div className="grid grid-cols-2 gap-2.5">
                            {[
                                { id: 'upper', label: 'Uppercase (A-Z)', checked: uppercase, setter: setUppercase },
                                { id: 'lower', label: 'Lowercase (a-z)', checked: lowercase, setter: setLowercase },
                                { id: 'num', label: 'Numbers (0-9)', checked: numbers, setter: setNumbers },
                                { id: 'sym', label: 'Symbols (!@#$)', checked: symbols, setter: setSymbols }
                            ].map((opt) => (
                                <label
                                    key={opt.id}
                                    className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={opt.checked}
                                        onChange={(e) => opt.setter(e.target.checked)}
                                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                                    />
                                    <span>{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        {onSelectPassword && (
                            <button
                                type="button"
                                onClick={handleUse}
                                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                Use This Password
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PasswordGenModal;
