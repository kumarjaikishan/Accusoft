/**
 * High-performance, zero-dependency CSV download utility
 * Supports nested keys (e.g. 'ledger.ledger') and full UTF-8 BOM encoding for Microsoft Excel & Google Sheets.
 */
export const downloadCSV = (data = [], headers = [], filename = 'export.csv') => {
  if (!Array.isArray(data) || data.length === 0) return;

  const getNestedValue = (obj, key) => {
    if (!obj) return '';
    return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : ''), obj);
  };

  const cleanValue = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerRow = headers.map(h => `"${(h.label || h.key).replace(/"/g, '""')}"`).join(',');
  
  const dataRows = data.map(row => {
    return headers.map(h => cleanValue(getNestedValue(row, h.key))).join(',');
  });

  const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const safeFilename = filename.toLowerCase().endsWith('.csv') ? filename : `${filename}.csv`;
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', safeFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
