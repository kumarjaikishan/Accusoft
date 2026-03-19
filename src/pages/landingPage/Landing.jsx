import React, { useState, useEffect } from 'react';
import { LandingFooter } from './LandingFooter';
import { LandingNav } from './LandingNav';
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../store/themeSlice';

// --- MAIN APP COMPONENT ---

const LandingLayout = () => {
    const dispatch = useDispatch()
    const mode = useSelector((state) => state.theme.mode);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeTab, setActiveTab] = useState('daily');
    const theme = mode;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggletheTheme = () => {
        dispatch(toggleTheme());
    };

    const ThemeStyles = {
        bg: theme === 'light' ? 'bg-slate-50' : 'bg-slate-950',
        text: theme === 'light' ? 'text-slate-900' : 'text-white',
        card: theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800',
        subtext: theme === 'light' ? 'text-slate-600' : 'text-slate-400'
    };

    return (
        <div className={`min-h-screen font-sans transition-colors duration-500 ${ThemeStyles.bg} ${ThemeStyles.text} overflow-x-hidden`}>
            <LandingNav theme={theme} toggleTheme={toggletheTheme} isScrolled={isScrolled} />

            <Outlet context={{ theme, ThemeStyles, activeTab, setActiveTab }} />

            <LandingFooter theme={theme} subtextClass={ThemeStyles.subtext} />
        </div>
    );
};

export default LandingLayout;