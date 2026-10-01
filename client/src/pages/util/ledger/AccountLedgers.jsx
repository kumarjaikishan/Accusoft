import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../../utils/useApi';
import { toast } from '../../../utils/toast';
import { confirmDialog } from '../../../utils/confirm';
import { Users, Plus } from 'lucide-react';

import LedgerMetricCards from './LedgerMetricCards';
import LedgerFilterBar from './LedgerFilterBar';
import LedgerTableView from './LedgerTableView';
import LedgerCardView from './LedgerCardView';
import LedgerFormModal from './LedgerFormModal';
import QuickEntryModal from './QuickEntryModal';

const AccountLedgers = () => {
    const navigate = useNavigate();
    const { request, loading } = useApi();

    const [ledgers, setLedgers] = useState([]);
    const [stats, setStats] = useState({
        totalPayable: 0,
        totalReceivable: 0,
        netPayable: 0,
        totalLedgers: 0
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
    const [balanceFilter, setBalanceFilter] = useState('ALL'); // 'ALL', 'PAYABLE', 'RECEIVABLE'
    const [sortBy, setSortBy] = useState('name_asc'); // 'name_asc', 'name_desc', 'balance_desc', 'balance_asc'

    // Form Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLedger, setEditingLedger] = useState(null);
    const [formData, setFormData] = useState({
        name: ''
    });

    // Quick transaction modal state
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [activeLedgerForEntry, setActiveLedgerForEntry] = useState(null);
    const [entryData, setEntryData] = useState({
        particular: '',
        type: 'CREDIT',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        voucherNo: '',
        paymentMode: 'CASH',
        notes: ''
    });

    // Fetch Ledgers
    const fetchLedgers = useCallback(async () => {
        try {
            const res = await request({ url: 'util/ledgers', method: 'GET' });
            if (res?.success) {
                setLedgers(res.ledgers || []);
                setStats(res.stats || { totalPayable: 0, totalReceivable: 0, netPayable: 0, totalLedgers: 0 });
            }
        } catch (error) {
            console.error('Error fetching ledgers:', error);
        }
    }, [request]);

    useEffect(() => {
        fetchLedgers();
    }, [fetchLedgers]);

    // Filter & Sort Ledgers
    const filteredLedgers = useMemo(() => {
        return ledgers
            .filter((led) => {
                const matchSearch = led.name?.toLowerCase().includes(searchQuery.toLowerCase());

                if (!matchSearch) return false;

                if (balanceFilter === 'PAYABLE') return led.netBalance > 0;
                if (balanceFilter === 'RECEIVABLE') return led.netBalance < 0;
                if (balanceFilter === 'ZERO') return led.netBalance === 0;

                return true;
            })
            .sort((a, b) => {
                if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
                if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
                if (sortBy === 'balance_desc') return Math.abs(b.netBalance) - Math.abs(a.netBalance);
                if (sortBy === 'balance_asc') return Math.abs(a.netBalance) - Math.abs(b.netBalance);
                return 0;
            });
    }, [ledgers, searchQuery, balanceFilter, sortBy]);

    // Handle Create/Update Ledger
    const handleSaveLedger = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('Please enter a ledger name');
            return;
        }

        try {
            if (editingLedger) {
                await request({
                    url: `util/ledgers/${editingLedger._id}`,
                    method: 'PUT',
                    data: { name: formData.name.trim() }
                });
                toast.success('Ledger updated successfully');
            } else {
                await request({
                    url: 'util/ledgers',
                    method: 'POST',
                    data: { name: formData.name.trim() }
                });
                toast.success('Ledger created successfully');
            }
            setIsModalOpen(false);
            setEditingLedger(null);
            fetchLedgers();
        } catch (error) {
            // Handled in useApi
        }
    };

    // Open Modal for Edit
    const handleEdit = useCallback((ledger, e) => {
        e?.stopPropagation();
        setEditingLedger(ledger);
        setFormData({
            name: ledger.name || ''
        });
        setIsModalOpen(true);
    }, []);

    // Delete Ledger
    const handleDelete = useCallback(async (ledger, e) => {
        e?.stopPropagation();
        const confirm = await confirmDialog({
            title: `Delete "${ledger.name}"?`,
            text: 'All entries and balance history associated with this ledger will be permanently deleted.',
            icon: 'warning',
            buttons: ['Cancel', 'Delete Ledger'],
            dangerMode: true
        });

        if (confirm) {
            try {
                await request({
                    url: `util/ledgers/${ledger._id}`,
                    method: 'DELETE'
                });
                toast.success('Ledger deleted');
                fetchLedgers();
            } catch (error) {
                // Handled in useApi
            }
        }
    }, [request, fetchLedgers]);

    // Open Quick Entry / Voucher
    const handleOpenEntryModal = useCallback((ledger, defaultType = 'CREDIT', e) => {
        e?.stopPropagation();
        setActiveLedgerForEntry(ledger);
        setEntryData({
            particular: '',
            type: defaultType,
            amount: '',
            date: new Date().toISOString().split('T')[0],
            voucherNo: '',
            paymentMode: 'CASH',
            notes: ''
        });
        setIsEntryModalOpen(true);
    }, []);

    const handleSaveEntry = async (e) => {
        e.preventDefault();
        if (!entryData.particular.trim() || !entryData.amount || Number(entryData.amount) <= 0) {
            toast.error('Please enter a valid particular and amount');
            return;
        }

        try {
            await request({
                url: 'util/ledgers/entry',
                method: 'POST',
                data: {
                    ledgerId: activeLedgerForEntry._id,
                    ...entryData
                }
            });
            toast.success('Transaction entry recorded');
            setIsEntryModalOpen(false);
            fetchLedgers();
        } catch (error) {
            // Handled in useApi
        }
    };

    const handleAddNew = () => {
        setEditingLedger(null);
        setFormData({
            name: ''
        });
        setIsModalOpen(true);
    };

    const handleRowOrCardClick = useCallback((ledgerId) => {
        navigate(`/util/ledger/${ledgerId}`);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1120] p-3 sm:p-5 lg:p-6 space-y-4 transition-colors duration-300 font-sans text-slate-700 dark:text-slate-200">
            {/* 3 Metric Summary Cards */}
            <LedgerMetricCards stats={stats} />

            {/* Controls Bar */}
            <LedgerFilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                viewMode={viewMode}
                setViewMode={setViewMode}
                balanceFilter={balanceFilter}
                setBalanceFilter={setBalanceFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onAddNew={handleAddNew}
            />

            {/* Results Counter */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-medium">
                <span>
                    Showing <strong className="text-slate-700 dark:text-slate-200">{filteredLedgers.length}</strong> of{' '}
                    {ledgers.length} ledgers
                </span>
            </div>

            {/* Main Content: Table or Cards View */}
            {loading && ledgers.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-3">
                    <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-slate-400">Loading ledgers...</p>
                </div>
            ) : filteredLedgers.length === 0 ? (
                <div className="py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center p-6">
                    <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                        <Users className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Ledgers Found</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                        {searchQuery ? 'No ledger matched your search query.' : 'Create your first account ledger to start tracking debits, credits, and balances.'}
                    </p>
                    <button
                        onClick={handleAddNew}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition cursor-pointer"
                    >
                        <Plus className="w-4 h-4" /> Add New Ledger
                    </button>
                </div>
            ) : viewMode === 'table' ? (
                <LedgerTableView
                    ledgers={filteredLedgers}
                    onRowClick={handleRowOrCardClick}
                    onQuickEntry={handleOpenEntryModal}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ) : (
                <LedgerCardView
                    ledgers={filteredLedgers}
                    onCardClick={handleRowOrCardClick}
                    onQuickEntry={handleOpenEntryModal}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {/* Modal: Add / Edit Ledger (Name only) */}
            <LedgerFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSaveLedger}
                editingLedger={editingLedger}
                formData={formData}
                setFormData={setFormData}
                loading={loading}
            />

            {/* Modal: Quick Entry / Voucher */}
            <QuickEntryModal
                isOpen={isEntryModalOpen}
                onClose={() => setIsEntryModalOpen(false)}
                onSubmit={handleSaveEntry}
                activeLedger={activeLedgerForEntry}
                entryData={entryData}
                setEntryData={setEntryData}
                loading={loading}
            />
        </div>
    );
};

export default AccountLedgers;
