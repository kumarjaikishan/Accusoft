import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, RefreshCcw } from 'lucide-react';
import ModalCard from '../../../components/custommodal/ModalCard';
import DatePicker from '../../../components/common/DatePicker';
import TextInput from '../../../components/common/TextInput';
import Button from '../../../components/common/Button';

const QuickEntryModal = ({ isOpen, onClose, onSubmit, activeLedger, entryData, setEntryData, loading = false }) => {
    // Local state for dual amounts (Debit Amount vs Credit Amount)
    const [debitAmount, setDebitAmount] = useState('');
    const [creditAmount, setCreditAmount] = useState('');

    useEffect(() => {
        if (isOpen && entryData) {
            if (entryData.type === 'DEBIT') {
                setDebitAmount(entryData.amount ? String(entryData.amount) : '');
                setCreditAmount('');
            } else {
                setCreditAmount(entryData.amount ? String(entryData.amount) : '');
                setDebitAmount('');
            }
        }
    }, [isOpen, entryData]);

    if (!activeLedger) return null;

    const handleDebitChange = (e) => {
        const val = e.target.value;
        // Allow only numeric digits
        if (/^\d*$/.test(val)) {
            setDebitAmount(val);
            if (val && Number(val) > 0) {
                setCreditAmount('');
                setEntryData((prev) => ({
                    ...prev,
                    type: 'DEBIT',
                    amount: val
                }));
            } else if (!val) {
                setEntryData((prev) => ({
                    ...prev,
                    amount: ''
                }));
            }
        }
    };

    const handleCreditChange = (e) => {
        const val = e.target.value;
        // Allow only numeric digits
        if (/^\d*$/.test(val)) {
            setCreditAmount(val);
            if (val && Number(val) > 0) {
                setDebitAmount('');
                setEntryData((prev) => ({
                    ...prev,
                    type: 'CREDIT',
                    amount: val
                }));
            } else if (!val) {
                setEntryData((prev) => ({
                    ...prev,
                    amount: ''
                }));
            }
        }
    };

    return (
        <ModalCard
            open={isOpen}
            onClose={onClose}
            title={entryData._id ? 'Update Entry' : 'Add Transaction Entry'}
            width="500px"
        >
            <form
                onSubmit={onSubmit}
                className="flex flex-col pt-4 items-center w-full px-6 pb-6 gap-3.5 relative"
            >
                    {/* Transaction Date */}
                    <div className="w-full">
                        <DatePicker
                            label="Transaction Date"
                            name="date"
                            value={entryData.date}
                            onChange={(e) => setEntryData((prev) => ({ ...prev, date: e.target.value }))}
                            required
                        />
                    </div>

                    {/* Particular / Description */}
                    <div className="w-full">
                        <TextInput
                            label="Particular / Description"
                            name="particular"
                            required
                            placeholder="Enter transaction details or notes..."
                            value={entryData.particular}
                            onChange={(e) => setEntryData((prev) => ({ ...prev, particular: e.target.value }))}
                        />
                    </div>

                    {/* Dual Amount Inputs with type="tel", pattern="[0-9]*", and inputMode="numeric" for mobile numeric keypad */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                        <div>
                            <TextInput
                                label="Debit Amount"
                                name="debitAmount"
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="0"
                                startAdornment={<span className="font-semibold text-rose-500">₹</span>}
                                inputClassName="!text-rose-600 dark:!text-rose-400 font-bold"
                                value={debitAmount}
                                onChange={handleDebitChange}
                            />
                        </div>

                        <div>
                            <TextInput
                                label="Credit Amount"
                                name="creditAmount"
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="0"
                                startAdornment={<span className="font-semibold text-emerald-600">₹</span>}
                                inputClassName="!text-emerald-700 dark:!text-emerald-400 font-bold"
                                value={creditAmount}
                                onChange={handleCreditChange}
                            />
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="w-full flex justify-between items-center gap-3 mt-3">
                        <Button
                            type="submit"
                            loading={loading}
                            icon={entryData._id ? RefreshCw : Save}
                            className="flex-1 text-white hover:opacity-90 shadow-md transition-all duration-200"
                        >
                            {entryData._id ? 'Update' : 'Save Entry'}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={onClose}
                            icon={RefreshCcw}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
        </ModalCard>
    );
};

export default React.memo(QuickEntryModal);
