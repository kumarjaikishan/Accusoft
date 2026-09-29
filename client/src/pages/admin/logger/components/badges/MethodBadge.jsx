import React from 'react';

const COLORS = {
    GET: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    POST: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    PUT: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    DELETE: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    PATCH: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
};

const MethodBadge = ({ method }) => {
    const m = (method || 'GET').toUpperCase();
    const colorClass = COLORS[m] || 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30';
    return (
        <span className={`px-2 py-0.5 text-xs font-bold font-mono rounded border ${colorClass}`}>
            {m}
        </span>
    );
};

export default MethodBadge;
