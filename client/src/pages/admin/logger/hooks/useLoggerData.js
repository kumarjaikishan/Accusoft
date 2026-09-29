import { useState, useMemo, useCallback } from 'react';

const getBaseEndpoint = (urlStr) => {
    if (!urlStr) return 'unknown';
    const cleaned = String(urlStr).replace(/^\/+/, '');
    return cleaned.split('?')[0] || cleaned;
};

export const useLoggerData = () => {
    const [rawLogs, setRawLogs] = useState([]);
    const [activeKey, setActiveKey] = useState('ALL');
    const [search, setSearch] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('ALL');

    const loadLogs = useCallback(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('apiLogs')) || [];
            const normalized = stored.map((item, idx) => {
                const ep = item.endpoint || 'unknown';
                const baseEp = getBaseEndpoint(ep);
                const meth = (item.method || 'GET').toUpperCase();
                const duration = item.durationMs !== undefined ? item.durationMs : parseFloat(item.time) || 0;
                const key = `${baseEp}_${meth}`;
                return {
                    ...item,
                    id: item.id || `log_${idx}_${item.date1 || Date.now()}`,
                    endpoint: ep,
                    baseEndpoint: baseEp,
                    method: meth,
                    durationMs: duration,
                    time: item.time || `${duration} ms`,
                    key,
                    timestamp: item.date1 || (item.date ? new Date(item.date).getTime() : Date.now()),
                };
            });
            setRawLogs(normalized);
        } catch (e) {
            console.error('Error loading apiLogs', e);
            setRawLogs([]);
        }
    }, []);

    const clearLogs = useCallback(() => {
        localStorage.removeItem('apiLogs');
        setRawLogs([]);
        setActiveKey('ALL');
    }, []);

    const groupedEndpoints = useMemo(() => {
        const groups = {};
        rawLogs.forEach((item) => {
            if (!groups[item.key]) {
                groups[item.key] = {
                    key: item.key,
                    endpoint: item.baseEndpoint || item.endpoint,
                    method: item.method,
                    count: 0,
                    totalDuration: 0,
                    logs: []
                };
            }
            groups[item.key].count += 1;
            groups[item.key].totalDuration += item.durationMs;
            groups[item.key].logs.push(item);
        });
        return Object.values(groups).map((g) => ({
            ...g,
            avgMs: Number((g.totalDuration / g.count).toFixed(2))
        }));
    }, [rawLogs]);

    const filteredGroupedEndpoints = useMemo(() =>
        groupedEndpoints.filter((g) => {
            const matchSearch = g.endpoint.toLowerCase().includes(search.toLowerCase());
            const matchMethod = selectedMethod === 'ALL' || g.method === selectedMethod;
            return matchSearch && matchMethod;
        }),
        [groupedEndpoints, search, selectedMethod]
    );

    const displayedLogs = useMemo(() => {
        let list = activeKey !== 'ALL' ? rawLogs.filter((l) => l.key === activeKey) : rawLogs;
        if (search.trim()) list = list.filter((l) => l.endpoint.toLowerCase().includes(search.toLowerCase()));
        if (selectedMethod !== 'ALL') list = list.filter((l) => l.method === selectedMethod);
        return list.slice().sort((a, b) => b.timestamp - a.timestamp);
    }, [rawLogs, activeKey, search, selectedMethod]);

    const stats = useMemo(() => {
        const totalCalls = rawLogs.length;
        if (totalCalls === 0) return { totalCalls: 0, avgMs: 0, minMs: 0, maxMs: 0, fastCount: 0 };
        const durations = rawLogs.map((l) => l.durationMs);
        const sum = durations.reduce((acc, curr) => acc + curr, 0);
        return {
            totalCalls,
            avgMs: Number((sum / totalCalls).toFixed(2)),
            minMs: Math.min(...durations),
            maxMs: Math.max(...durations),
            fastCount: rawLogs.filter((l) => l.durationMs <= 200).length,
        };
    }, [rawLogs]);

    const maxLogLatency = useMemo(() =>
        displayedLogs.length === 0 ? 100 : Math.max(...displayedLogs.map((l) => l.durationMs), 100),
        [displayedLogs]
    );

    return {
        rawLogs,
        loadLogs,
        clearLogs,
        activeKey,
        setActiveKey,
        search,
        setSearch,
        selectedMethod,
        setSelectedMethod,
        groupedEndpoints,
        filteredGroupedEndpoints,
        displayedLogs,
        stats,
        maxLogLatency,
    };
};
