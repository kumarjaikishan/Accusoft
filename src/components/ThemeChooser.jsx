import React, { useState } from 'react';
import { Palette, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { setMainColor } from '../store/themeSlice';

const ThemeChooser = () => {
    const dispatch = useDispatch();
    const mainColor = useSelector((state) => state.theme.mainColor);
    const [isOpen, setIsOpen] = useState(false);

    const presets = [
        '#1e293b', // Slate
        '#0a3d62', // Default Blue
        '#7c3aed', // Violet
        '#db2777', // Pink
        '#059669', // Emerald
        '#ea580c', // Orange
        '#2563eb', // Blue
        '#4f46e5', // Indigo
    ];

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-64"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Theme Color</h3>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-4 gap-3 mb-4">
                            {presets.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => dispatch(setMainColor(color))}
                                    className="w-full aspect-square rounded-full border-2 border-white dark:border-slate-700 shadow-sm relative overflow-hidden transition-transform hover:scale-110 cursor-pointer"
                                    style={{ backgroundColor: color }}
                                >
                                    {mainColor === color && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                            <Check size={14} className="text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Custom:</span>
                            <div className="relative flex-1 h-8">
                                <input
                                    type="color"
                                    value={mainColor}
                                    onChange={(e) => dispatch(setMainColor(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div
                                    className="w-full h-full rounded-lg border border-slate-200 dark:border-slate-600 shadow-inner"
                                    style={{ backgroundColor: mainColor }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[var(--maincolor)] transition-all cursor-pointer"
                style={{
                    boxShadow: isOpen ? `0 0 20px ${mainColor}44` : '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    borderColor: isOpen ? mainColor : 'transparent'
                }}
            >
                <Palette size={24} style={{ color: isOpen ? mainColor : 'inherit' }} />
            </motion.button>
        </div>
    );
};

export default ThemeChooser;
