import React, { useState, useEffect } from 'react';
import { LandingFooter } from './LandingFooter';
import { LandingNav } from './LandingNav';
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../store/themeSlice';

// --- MAIN LANDING LAYOUT COMPONENT ---

const LandingLayout = () => {
    const dispatch = useDispatch();
    const mode = useSelector((state) => state.theme.mode);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeTab, setActiveTab] = useState('daily');
    const theme = mode;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggletheTheme = () => {
        dispatch(toggleTheme());
    };

    const ThemeStyles = {
        bg: theme === 'light' ? 'bg-slate-50/70' : 'bg-slate-950',
        text: theme === 'light' ? 'text-slate-900' : 'text-white',
        card: theme === 'light' ? 'bg-white border-slate-200/80 shadow-xs' : 'bg-slate-900/90 border-slate-800 shadow-xs',
        subtext: theme === 'light' ? 'text-slate-600' : 'text-slate-400'
    };

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${ThemeStyles.bg} ${ThemeStyles.text} overflow-x-hidden flex flex-col`}>
            <LandingNav theme={theme} toggleTheme={toggletheTheme} isScrolled={isScrolled} />

            <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Outlet context={{ theme, ThemeStyles, activeTab, setActiveTab }} />
            </div>

            <LandingFooter theme={theme} subtextClass={ThemeStyles.subtext} />
        </div>
    );
};

export default LandingLayout;