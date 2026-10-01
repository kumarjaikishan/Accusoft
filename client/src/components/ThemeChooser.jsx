import React, { useState } from 'react';
import { Palette, X, Check } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setMainColor } from '../store/themeSlice';

const ThemeChooser = () => {
    const dispatch = useDispatch();
    const mainColor = useSelector((state) => state.theme.mainColor);
    const [isOpen, setIsOpen] = useState(false);

    // Curated rich, luxury & premium palette (with Slate & Cool Gray preserved)
    const presets = [
        { name: 'Classic Slate', color: '#1e293b' },
        { name: 'Cool Gray / Charcoal', color: '#334155' },
        { name: 'Obsidian Midnight', color: '#0f172a' },
        { name: 'Royal Sapphire', color: '#0a3d62' },
        { name: 'Deep Emerald / Forest', color: '#064e3b' },
        { name: 'Imperial Amethyst', color: '#4c1d95' },
        { name: 'Rich Burgundy / Wine', color: '#881337' },
        { name: 'Warm Bronze / Amber', color: '#78350f' },
        { name: 'Oceanic Teal', color: '#0f766e' },
        { name: 'Nordic Indigo', color: '#312e81' },
        { name: 'Noble Plum', color: '#701a75' },
        { name: 'Dark Spruce', color: '#14532d' },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-9999">
            {isOpen && (
                <div
                    className="mb-4 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-64 transition-all animate-in zoom-in-95 fade-in duration-150"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm">Theme Color</h3>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2.5 mb-4">
                        {presets.map((item) => (
                            <button
                                key={item.color}
                                onClick={() => dispatch(setMainColor(item.color))}
                                title={item.name}
                                className="w-full aspect-square rounded-xl border-2 border-white/80 dark:border-slate-700 shadow-sm relative overflow-hidden transition-all hover:scale-110 cursor-pointer"
                                style={{ backgroundColor: item.color }}
                            >
                                {mainColor?.toLowerCase() === item.color.toLowerCase() && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <Check size={16} className="text-white drop-shadow" />
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
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-(--maincolor) hover:scale-105 active:scale-95 transition-all cursor-pointer"
                style={{
                    boxShadow: isOpen ? `0 0 20px ${mainColor}44` : '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    borderColor: isOpen ? mainColor : 'transparent'
                }}
            >
                <Palette size={24} style={{ color: isOpen ? mainColor : 'inherit' }} />
            </button>
        </div>
    );
};

export default ThemeChooser;
