export const formatCurrency = (val) => {
    const num = Math.abs(Number(val) || 0);
    return '₹ ' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
