import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status = 200, success = true }) => {
    const isOk = success && status >= 200 && status < 300;
    const color = isOk
        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';

    return (
        <span className={`px-2 py-0.5 text-xs font-bold font-mono rounded border ${color} flex items-center gap-1`}>
            {isOk ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
            {status || (isOk ? 200 : 500)}
        </span>
    );
};

export default StatusBadge;
