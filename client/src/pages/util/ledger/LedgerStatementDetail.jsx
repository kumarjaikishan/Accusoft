import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../../utils/useApi';
import { toast } from '../../../utils/toast';
import { confirmDialog } from '../../../utils/confirm';
import { downloadCSV } from '../../../utils/csvExport';
import dayjs from 'dayjs';

import StatementHeader from './StatementHeader';
import StatementMetricCards from './StatementMetricCards';
import StatementFilterBar from './StatementFilterBar';
import StatementTable from './StatementTable';
import QuickEntryModal from './QuickEntryModal';

const LedgerStatementDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { request, loading } = useApi();

    const [ledger, setLedger] = useState(null);
    const [entries, setEntries] = useState([]);
    const [summary, setSummary] = useState({
        totalCredit: 0,
        totalDebit: 0,
        netBalance: 0,
        balanceStatus: 'PAYABLE',
        transactionCount: 0
    });

    // Filters
    const [selectedYear, setSelectedYear] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    // Pagination
    const [pageSize, setPageSize] = useState(15);
    const [currentPage, setCurrentPage] = useState(1);

    // Entry Modal
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [entryData, setEntryData] = useState({
        particular: '',
        type: 'CREDIT',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        voucherNo: '',
        paymentMode: 'CASH',
        notes: ''
    });

    // Fetch Statement Data
    const fetchStatement = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (selectedYear !== 'all') params.append('year', selectedYear);
            if (selectedMonth !== 'all') params.append('month', selectedMonth);
            if (fromDate) params.append('fromDate', fromDate);
            if (toDate) params.append('toDate', toDate);

            const res = await request({
                url: `util/ledgers/${id}/statement?${params.toString()}`,
                method: 'GET'
            });

            if (res?.success) {
                setLedger(res.ledger);
                setEntries(res.entries || []);
                setSummary(res.summary || {});
            }
        } catch (error) {
            console.error('Error fetching statement:', error);
        }
    }, [id, selectedYear, selectedMonth, fromDate, toDate, request]);

    useEffect(() => {
        if (id) fetchStatement();
    }, [id, fetchStatement]);

    // Handle CSV Export
    const handleExportCSV = useCallback(() => {
        if (!entries.length) {
            toast.error('No records to export');
            return;
        }

        const exportData = entries.map((item, index) => ({
            sNo: index + 1,
            date: dayjs(item.date).format('DD MMM, YYYY'),
            particular: item.particular,
            credit: item.type === 'CREDIT' ? item.amount : '',
            debit: item.type === 'DEBIT' ? item.amount : '',
            runningBalance: item.runningBalance,
            paymentMode: item.paymentMode,
            voucherNo: item.voucherNo || ''
        }));

        downloadCSV(
            exportData,
            [
                { label: 'S.No', key: 'sNo' },
                { label: 'Date', key: 'date' },
                { label: 'Particular', key: 'particular' },
                { label: 'Credit (₹)', key: 'credit' },
                { label: 'Debit (₹)', key: 'debit' },
                { label: 'Balance (₹)', key: 'runningBalance' },
                { label: 'Mode', key: 'paymentMode' },
                { label: 'Voucher No', key: 'voucherNo' }
            ],
            `${ledger?.name || 'Ledger'}-Statement-${dayjs().format('YYYY-MM-DD')}`
        );
    }, [entries, ledger]);

    const handlePrint = useCallback(() => {
        window.print();
    }, []);

    // Add / Edit Entry
    const handleOpenModal = useCallback((entry = null, defaultType = 'CREDIT') => {
        if (entry) {
            setEditingEntry(entry);
            setEntryData({
                particular: entry.particular,
                type: entry.type,
                amount: entry.amount,
                date: dayjs(entry.date).format('YYYY-MM-DD'),
                voucherNo: entry.voucherNo || '',
                paymentMode: entry.paymentMode || 'CASH',
                notes: entry.notes || ''
            });
        } else {
            setEditingEntry(null);
            setEntryData({
                particular: '',
                type: defaultType,
                amount: '',
                date: new Date().toISOString().split('T')[0],
                voucherNo: '',
                paymentMode: 'CASH',
                notes: ''
            });
        }
        setIsEntryModalOpen(true);
    }, []);

    const handleSaveEntry = async (e) => {
        e.preventDefault();
        if (!entryData.particular.trim() || !entryData.amount || Number(entryData.amount) <= 0) {
            toast.error('Please provide particular and valid amount');
            return;
        }

        try {
            if (editingEntry) {
                await request({
                    url: `util/ledgers/entry/${editingEntry._id}`,
                    method: 'PUT',
                    data: entryData
                });
                toast.success('Entry updated');
            } else {
                await request({
                    url: 'util/ledgers/entry',
                    method: 'POST',
                    data: {
                        ledgerId: id,
                        ...entryData
                    }
                });
                toast.success('Entry recorded');
            }
            setIsEntryModalOpen(false);
            setEditingEntry(null);
            fetchStatement();
        } catch (error) {
            // Handled in useApi
        }
    };

    const handleDeleteEntry = useCallback(async (entryId) => {
        const confirm = await confirmDialog({
            title: 'Delete Transaction Entry?',
            text: 'This will recalculate all subsequent running balances.',
            icon: 'warning',
            buttons: ['Cancel', 'Delete Entry'],
            dangerMode: true
        });

        if (confirm) {
            try {
                await request({
                    url: `util/ledgers/entry/${entryId}`,
                    method: 'DELETE'
                });
                toast.success('Entry deleted');
                fetchStatement();
            } catch (error) {
                // Handled in useApi
            }
        }
    }, [request, fetchStatement]);

    const handleClearFilters = useCallback(() => {
        setSelectedYear('all');
        setSelectedMonth('all');
        setFromDate('');
        setToDate('');
    }, []);

    // Paginated entries
    const paginatedEntries = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return entries.slice(start, start + pageSize);
    }, [entries, currentPage, pageSize]);

    const totalPages = Math.ceil(entries.length / pageSize) || 1;

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1120] p-3 sm:p-5 lg:p-6 space-y-5 transition-colors duration-300 font-sans text-slate-700 dark:text-slate-200">
            {/* Top Header Card */}
            <StatementHeader
                ledger={ledger}
                entriesCount={entries.length}
                onBack={() => navigate('/util/ledger')}
                onAddEntry={() => handleOpenModal(null, 'CREDIT')}
                onExportCSV={handleExportCSV}
                onPrint={handlePrint}
            />

            {/* 3 Metric Cards */}
            <StatementMetricCards summary={summary} />

            {/* Filter Bar */}
            <StatementFilterBar
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
                onClearFilters={handleClearFilters}
                recordsCount={entries.length}
            />

            {/* Statement Table with running balances */}
            <StatementTable
                ledger={ledger}
                entries={entries}
                paginatedEntries={paginatedEntries}
                currentPage={currentPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                onEditEntry={handleOpenModal}
                onDeleteEntry={handleDeleteEntry}
            />

            {/* Modal: Add / Edit Transaction Entry */}
            <QuickEntryModal
                isOpen={isEntryModalOpen}
                onClose={() => setIsEntryModalOpen(false)}
                onSubmit={handleSaveEntry}
                activeLedger={ledger}
                entryData={entryData}
                setEntryData={setEntryData}
                loading={loading}
            />
        </div>
    );
};

export default LedgerStatementDetail;
