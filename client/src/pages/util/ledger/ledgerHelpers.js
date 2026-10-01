export const formatCurrency = (val) => {
    const num = Math.abs(Number(val) || 0);
    return '₹ ' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const capitalize = (value) => {
    if (!value || typeof value !== 'string') return '';
    return value
        .trim()
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};
