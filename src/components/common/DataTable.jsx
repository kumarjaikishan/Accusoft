import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown, Loader2, Check, Minus } from 'lucide-react';

/**
 * Native, Lightweight & High-Performance DataTable Component
 * 100% drop-in replacement for `react-data-table-component`.
 * 
 * Features:
 * - Pure HTML5 Table with Tailwind CSS
 * - Client-side & Server-side Pagination
 * - Multi-column Sorting with Custom Sort Functions
 * - Checkbox Selection (Select All, Indeterminate, Row Select)
 * - Conditional Row Styles & Custom Header/Cell Styling
 * - Responsive Desktop & Mobile Pagination Layout
 * - Zero external library dependencies
 */
export const DataTable = ({
  columns = [],
  data = [],
  pagination = false,
  paginationServer = false,
  paginationTotalRows = 0,
  paginationPerPage = 10,
  paginationRowsPerPageOptions = [10, 20, 30, 50, 100],
  paginationDefaultPage = 1,
  onChangePage,
  onChangeRowsPerPage,
  onSort,
  sortServer = false,
  defaultSortFieldId,
  defaultSortAsc = true,
  selectableRows = false,
  onSelectedRowsChange,
  clearSelectedRows = false,
  selectedRows: controlledSelectedRows,
  progressPending = false,
  progressComponent,
  noDataComponent,
  customStyles,
  conditionalRowStyles = [],
  highlightOnHover = true,
  striped = false,
  dense = false,
  className = '',
  keyField = '_id',
  onRowClicked,
  pointerOnHover = false,
  customFooter,
}) => {
  // ── Pagination State ──
  const [currentPage, setCurrentPage] = useState(paginationDefaultPage);
  const [rowsPerPage, setRowsPerPage] = useState(paginationPerPage);

  useEffect(() => {
    setCurrentPage(paginationDefaultPage);
  }, [paginationDefaultPage]);

  // ── Sorting State ──
  const [sortColumn, setSortColumn] = useState(() => {
    if (defaultSortFieldId) {
      return columns.find((c, idx) => c.id === defaultSortFieldId || idx === defaultSortFieldId) || null;
    }
    return null;
  });
  const [sortDirection, setSortDirection] = useState(defaultSortAsc ? 'asc' : 'desc');

  // ── Row Selection State ──
  const [selectedRowKeys, setSelectedRowKeys] = useState(new Set());

  useEffect(() => {
    if (clearSelectedRows) {
      setSelectedRowKeys(new Set());
    }
  }, [clearSelectedRows]);

  useEffect(() => {
    if (controlledSelectedRows && Array.isArray(controlledSelectedRows)) {
      const keys = new Set(controlledSelectedRows.map((r, i) => r[keyField] || r.id || i));
      setSelectedRowKeys(keys);
    }
  }, [controlledSelectedRows, keyField]);

  // ── Sorting Logic ──
  const sortedData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    if (sortServer || !sortColumn) return data;

    const selector = sortColumn.selector;
    const sortFunction = sortColumn.sortFunction;

    return [...data].sort((a, b) => {
      if (typeof sortFunction === 'function') {
        const res = sortFunction(a, b);
        return sortDirection === 'asc' ? res : -res;
      }

      const idxA = data.indexOf(a);
      const idxB = data.indexOf(b);

      let valA = typeof selector === 'function' ? selector(a, idxA) : a[sortColumn.name];
      let valB = typeof selector === 'function' ? selector(b, idxB) : b[sortColumn.name];

      if (valA === undefined || valA === null || Number.isNaN(valA)) valA = '';
      if (valB === undefined || valB === null || Number.isNaN(valB)) valB = '';

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();

      if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
      if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection, sortServer]);

  // ── Pagination Calculation ──
  const totalItems = paginationServer ? (paginationTotalRows || data.length) : sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  const displayData = useMemo(() => {
    if (!pagination || paginationServer) return sortedData;
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, pagination, paginationServer, currentPage, rowsPerPage]);

  // ── Handlers ──
  const handleSort = (col) => {
    if (!col.sortable) return;

    let nextDirection = 'asc';
    if (sortColumn === col) {
      nextDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }

    setSortColumn(col);
    setSortDirection(nextDirection);

    if (onSort) {
      onSort(col, nextDirection);
    }
  };

  const handlePageChange = (page) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
    if (onChangePage) {
      onChangePage(validPage, totalItems);
    }
  };

  const handleRowsPerPageChange = (e) => {
    const newRows = Number(e.target.value);
    setRowsPerPage(newRows);
    setCurrentPage(1);
    if (onChangeRowsPerPage) {
      onChangeRowsPerPage(newRows, 1);
    }
  };

  const getRowKey = (row, index) => {
    if (row && row[keyField] !== undefined) return row[keyField];
    if (row && row.id !== undefined) return row.id;
    return index;
  };

  const handleSelectAll = (e) => {
    const nextKeys = new Set(selectedRowKeys);
    if (e.target.checked) {
      displayData.forEach((row, i) => nextKeys.add(getRowKey(row, i)));
    } else {
      displayData.forEach((row, i) => nextKeys.delete(getRowKey(row, i)));
    }
    setSelectedRowKeys(nextKeys);

    if (onSelectedRowsChange) {
      const selected = data.filter((row, i) => nextKeys.has(getRowKey(row, i)));
      onSelectedRowsChange({
        allSelected: nextKeys.size === data.length && data.length > 0,
        selectedCount: nextKeys.size,
        selectedRows: selected
      });
    }
  };

  const handleSelectRow = (row, index, e) => {
    e.stopPropagation();
    const key = getRowKey(row, index);
    const nextKeys = new Set(selectedRowKeys);

    if (nextKeys.has(key)) {
      nextKeys.delete(key);
    } else {
      nextKeys.add(key);
    }
    setSelectedRowKeys(nextKeys);

    if (onSelectedRowsChange) {
      const selected = data.filter((r, i) => nextKeys.has(getRowKey(r, i)));
      onSelectedRowsChange({
        allSelected: nextKeys.size === data.length && data.length > 0,
        selectedCount: nextKeys.size,
        selectedRows: selected
      });
    }
  };

  const isAllDisplayedSelected = displayData.length > 0 && displayData.every((r, i) => selectedRowKeys.has(getRowKey(r, i)));
  const isSomeDisplayedSelected = displayData.some((r, i) => selectedRowKeys.has(getRowKey(r, i))) && !isAllDisplayedSelected;

  const headRowStyle = customStyles?.headRow?.style || {};
  const headCellsStyle = customStyles?.headCells?.style || {};
  const rowStyle = customStyles?.rows?.style || {};
  const cellsStyle = customStyles?.cells?.style || {};
  const paginationStyle = customStyles?.pagination?.style || {};

  const customHeaderBg = headRowStyle.backgroundColor || headCellsStyle.backgroundColor || '#115e59';
  const customHeaderColor = headRowStyle.color || headCellsStyle.color || '#ffffff';

  return (
    <div className={`w-full bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden ${className}`}>
      {/* ── Table Container ── */}
      <div className="w-full overflow-x-auto min-h-[160px] relative">
        {progressPending ? (
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-10 p-8">
            {progressComponent ? (
              progressComponent
            ) : (
              <>
                <Loader2 className="animate-spin text-teal-700" size={32} />
                <span className="text-xs font-bold text-slate-500">Loading records...</span>
              </>
            )}
          </div>
        ) : null}

        <table className="w-full border-collapse text-left text-xs font-sans">
          <thead>
            <tr
              className="select-none transition-colors border-b border-slate-200 dark:border-slate-800"
              style={{
                backgroundColor: customHeaderBg,
                color: customHeaderColor,
                minHeight: headRowStyle.minHeight,
              }}
            >
              {selectableRows && (
                <th className="w-10 px-3 py-2.5 text-center">
                  <label className="relative inline-flex items-center justify-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isAllDisplayedSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeDisplayedSelected;
                      }}
                      onChange={handleSelectAll}
                      className="peer sr-only"
                    />
                    <div className="w-4 h-4 rounded-[5px] border border-white/50 group-hover:border-white bg-white/10 peer-checked:bg-teal-400 peer-checked:border-teal-400 peer-focus-visible:ring-2 peer-focus-visible:ring-teal-300 flex items-center justify-center transition-all duration-150 shadow-xs">
                      {isSomeDisplayedSelected ? (
                        <Minus size={11} strokeWidth={3.5} className="text-teal-950" />
                      ) : (
                        <Check
                          size={11}
                          strokeWidth={3.5}
                          className={`text-teal-950 transition-transform duration-150 ${
                            isAllDisplayedSelected ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                          }`}
                        />
                      )}
                    </div>
                  </label>
                </th>
              )}

              {columns.map((col, idx) => {
                const isSorted = sortColumn === col;
                const widthStyle = col.width ? { width: col.width, minWidth: col.width } : col.minWidth ? { minWidth: col.minWidth } : {};
                const alignClass = col.right ? 'text-right justify-end' : col.center ? 'text-center justify-center' : 'text-left justify-start';

                return (
                  <th
                    key={col.id || col.name || idx}
                    style={{
                      ...widthStyle,
                      paddingLeft: headCellsStyle.paddingLeft || '12px',
                      paddingRight: headCellsStyle.paddingRight || '12px',
                      fontWeight: headCellsStyle.fontWeight || '700',
                      fontSize: headCellsStyle.fontSize || '11px',
                    }}
                    className={`py-3 text-[11px] font-black uppercase tracking-wider ${
                      col.sortable ? 'cursor-pointer hover:opacity-90' : ''
                    }`}
                    onClick={() => col.sortable && handleSort(col)}
                  >
                    <div className={`flex items-center gap-1.5 ${alignClass}`}>
                      <span>{col.name}</span>
                      {col.sortable && (
                        <span className="shrink-0 opacity-80">
                          {isSorted ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp size={13} className="font-bold text-amber-300" />
                            ) : (
                              <ArrowDown size={13} className="font-bold text-amber-300" />
                            )
                          ) : (
                            <ArrowUpDown size={12} className="opacity-40 hover:opacity-100 transition" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-700/80 text-slate-800 dark:text-slate-200">
            {displayData.length === 0 && !progressPending ? (
              <tr>
                <td
                  colSpan={columns.length + (selectableRows ? 1 : 0)}
                  className="py-12 px-4 text-center text-slate-400 font-medium italic text-xs"
                >
                  {noDataComponent ? noDataComponent : 'There are no records to display'}
                </td>
              </tr>
            ) : (
              displayData.map((row, rowIdx) => {
                const rowKey = getRowKey(row, rowIdx);
                const isSelected = selectedRowKeys.has(rowKey);
                const absoluteIndex = pagination && !paginationServer ? (currentPage - 1) * rowsPerPage + rowIdx : rowIdx;

                let rowStyleOverride = {
                  color: rowStyle.color,
                };
                if (Array.isArray(conditionalRowStyles)) {
                  conditionalRowStyles.forEach((cond) => {
                    if (cond?.when && typeof cond.when === 'function' && cond.when(row)) {
                      if (cond.style) Object.assign(rowStyleOverride, cond.style);
                    }
                  });
                }

                return (
                  <tr
                    key={rowKey}
                    style={{
                      ...rowStyle,
                      ...rowStyleOverride,
                    }}
                    onClick={() => onRowClicked && onRowClicked(row)}
                    className={`transition-colors ${dense ? 'py-1' : 'py-2'} ${
                      isSelected ? 'bg-teal-50/60 dark:bg-teal-900/20' : striped && rowIdx % 2 === 1 ? 'bg-slate-50/50 dark:bg-slate-800/30' : 'bg-transparent'
                    } ${highlightOnHover ? 'hover:bg-slate-50 dark:hover:bg-slate-800/40' : ''} ${
                      pointerOnHover || onRowClicked ? 'cursor-pointer' : ''
                    }`}
                  >
                    {selectableRows && (
                      <td
                        style={{
                          paddingTop: cellsStyle.paddingTop,
                          paddingBottom: cellsStyle.paddingBottom,
                        }}
                        className="w-10 px-3 py-1.5 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <label className="relative inline-flex items-center justify-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(row, rowIdx, e)}
                            className="peer sr-only"
                          />
                          <div
                            className={`w-4 h-4 rounded-[5px] border flex items-center justify-center transition-all duration-150 shadow-xs ${
                              isSelected
                                ? 'bg-teal-600 border-teal-600 text-white shadow-teal-500/20'
                                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/80 group-hover:border-teal-500'
                            }`}
                          >
                            <Check
                              size={11}
                              strokeWidth={3.5}
                              className={`transition-transform duration-150 ${
                                isSelected ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                              }`}
                            />
                          </div>
                        </label>
                      </td>
                    )}

                    {columns.map((col, colIdx) => {
                      const alignClass = col.right ? 'text-right' : col.center ? 'text-center' : 'text-left';
                      const cellValue = typeof col.selector === 'function' ? col.selector(row, absoluteIndex) : row[col.name];

                      return (
                        <td
                          key={col.id || col.name || colIdx}
                          style={{
                            ...(col.width ? { width: col.width, minWidth: col.width } : col.minWidth ? { minWidth: col.minWidth } : {}),
                            paddingLeft: cellsStyle.paddingLeft || '12px',
                            paddingRight: cellsStyle.paddingRight || '12px',
                            paddingTop: cellsStyle.paddingTop,
                            paddingBottom: cellsStyle.paddingBottom,
                          }}
                          className={`${cellsStyle.paddingTop || cellsStyle.paddingBottom ? '' : 'py-3.5'} ${alignClass} text-xs ${col.className || ''}`}
                        >
                          {col.cell ? col.cell(row, absoluteIndex) : cellValue !== undefined && cellValue !== null ? cellValue : '—'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>

          {/* ── Optional Table Footer (Totals / Summary) ── */}
          {(customFooter || columns.some((col) => col.footer !== undefined)) && (
            <tfoot className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-bold">
              {customFooter ? (
                typeof customFooter === 'function' ? (
                  customFooter({ data, displayData, columns, selectableRows })
                ) : (
                  customFooter
                )
              ) : (
                <tr>
                  {selectableRows && <td className="w-10 px-3 py-2.5" />}
                  {columns.map((col, colIdx) => {
                    const alignClass = col.right ? 'text-right' : col.center ? 'text-center' : 'text-left';
                    const footerValue =
                      typeof col.footer === 'function'
                        ? col.footer({ data, displayData, column: col })
                        : col.footer;

                    return (
                      <td
                        key={`foot-${col.id || col.name || colIdx}`}
                        style={{
                          ...(col.width ? { width: col.width, minWidth: col.width } : col.minWidth ? { minWidth: col.minWidth } : {}),
                          paddingLeft: cellsStyle.paddingLeft || '12px',
                          paddingRight: cellsStyle.paddingRight || '12px',
                        }}
                        className={`py-2.5 ${alignClass} text-xs ${col.footerClassName || ''}`}
                      >
                        {footerValue !== undefined ? footerValue : ''}
                      </td>
                    );
                  })}
                </tr>
              )}
            </tfoot>
          )}
        </table>
      </div>

      {/* ── React-Data-Table Style Pagination Footer ── */}
      {pagination && (
        <div
          style={paginationStyle}
          className="px-3 sm:px-4 py-2.5 bg-white dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between sm:justify-end gap-2 sm:gap-6 text-xs text-slate-500 dark:text-slate-400 font-sans select-none min-h-[44px]"
        >
          {/* Mobile Navigation Icons: [|<] [<] on left */}
          <div className="flex sm:hidden items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1 || progressPending}
              onClick={() => handlePageChange(1)}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center"
              title="First Page"
            >
              <ChevronsLeft size={19} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              disabled={currentPage <= 1 || progressPending}
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center"
              title="Previous Page"
            >
              <ChevronLeft size={19} strokeWidth={1.8} />
            </button>
          </div>

          {/* Rows per page selector */}
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <span className="hidden sm:inline text-xs font-normal">Rows per page:</span>
            <div className="relative inline-flex items-center">
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="appearance-none bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 border-none outline-none py-1 pl-1 pr-4 text-xs font-normal text-slate-600 dark:text-slate-300 cursor-pointer focus:ring-0 focus:outline-none"
              >
                {paginationRowsPerPageOptions.map((opt) => (
                  <option key={opt} value={opt} className="dark:bg-slate-900">
                    {opt}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 text-[9px]">
                ▼
              </span>
            </div>
          </div>

          {/* Range: "1-3 of 3" (Desktop) */}
          <span className="hidden sm:inline text-slate-600 dark:text-slate-300 text-xs font-normal whitespace-nowrap">
            {totalItems > 0 ? (
              `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, totalItems)} of ${totalItems}`
            ) : (
              '0-0 of 0'
            )}
          </span>

          {/* Desktop Navigation Icons (|<  <  >  >|) */}
          <div className="hidden sm:flex items-center gap-1 text-slate-400 dark:text-slate-400">
            <button
              type="button"
              disabled={currentPage <= 1 || progressPending}
              onClick={() => handlePageChange(1)}
              className="p-1 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full disabled:opacity-20 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center"
              title="First Page"
            >
              <ChevronsLeft size={19} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              disabled={currentPage <= 1 || progressPending}
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-1 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full disabled:opacity-20 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center"
              title="Previous Page"
            >
              <ChevronLeft size={19} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages || progressPending}
              onClick={() => handlePageChange(currentPage + 1)}
              className="p-1 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full disabled:opacity-20 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center"
              title="Next Page"
            >
              <ChevronRight size={19} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages || progressPending}
              onClick={() => handlePageChange(totalPages)}
              className="p-1 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full disabled:opacity-20 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center"
              title="Last Page"
            >
              <ChevronsRight size={19} strokeWidth={1.8} />
            </button>
          </div>

          {/* Mobile Navigation Icons: [>] [>|] on right */}
          <div className="flex sm:hidden items-center gap-1">
            <button
              type="button"
              disabled={currentPage >= totalPages || progressPending}
              onClick={() => handlePageChange(currentPage + 1)}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center"
              title="Next Page"
            >
              <ChevronRight size={19} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages || progressPending}
              onClick={() => handlePageChange(totalPages)}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center"
              title="Last Page"
            >
              <ChevronsRight size={19} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
