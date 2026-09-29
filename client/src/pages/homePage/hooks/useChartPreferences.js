import { useState, useCallback } from 'react';

const KEYS = {
    months: 'ShowChartMonth',
    type: 'ShowChartType',
    format: 'ShowChartAmountFormat',
    position: 'ShowChartAmountPosition',
};

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

/**
 * Consolidates all 4 chart preference localStorage reads/writes.
 * Replaces the scattered useState + localStorage.setItem patterns in home.jsx.
 */
export const useChartPreferences = () => {
    const [monthsToShow, setMonthsToShowState] = useState(() => {
        const stored = localStorage.getItem(KEYS.months);
        return stored ? Number(stored) : (isMobile() ? 6 : 12);
    });

    const [chartType, setChartTypeState] = useState(() => {
        const v = localStorage.getItem(KEYS.type);
        return v && ['bar', 'line'].includes(v) ? v : 'bar';
    });

    const [amountFormat, setAmountFormatState] = useState(() => {
        const v = localStorage.getItem(KEYS.format);
        return v && ['compact', 'full'].includes(v) ? v : 'compact';
    });

    const [amountPosition, setAmountPositionState] = useState(() => {
        const v = localStorage.getItem(KEYS.position);
        return v && ['top', 'inside'].includes(v) ? v : 'top';
    });

    const setMonthsToShow = useCallback((val) => {
        localStorage.setItem(KEYS.months, val);
        setMonthsToShowState(val);
    }, []);

    const setChartType = useCallback((val) => {
        localStorage.setItem(KEYS.type, val);
        setChartTypeState(val);
    }, []);

    const setAmountFormat = useCallback((val) => {
        localStorage.setItem(KEYS.format, val);
        setAmountFormatState(val);
    }, []);

    const setAmountPosition = useCallback((val) => {
        localStorage.setItem(KEYS.position, val);
        setAmountPositionState(val);
    }, []);

    return {
        monthsToShow, setMonthsToShow,
        chartType, setChartType,
        amountFormat, setAmountFormat,
        amountPosition, setAmountPosition,
    };
};
