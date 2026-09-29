import React from 'react';
import { Clock } from 'lucide-react';

const LatencyBadge = ({ timeStr, durationMs }) => {
    const ms = durationMs !== undefined ? durationMs : parseFloat(timeStr) || 0;
    let bg = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    if (ms > 500) bg = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    else if (ms > 200) bg = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';

    return (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${bg} flex items-center gap-1`}>
            <Clock size={12} />
            {timeStr || `${ms} ms`}
        </span>
    );
};

export default LatencyBadge;
