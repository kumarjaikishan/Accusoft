import React from 'react';
import { Save, RefreshCw, Link2 } from 'lucide-react';
import ModalCard from '../../../components/custommodal/ModalCard';
import TextInput from '../../../components/common/TextInput';
import Button from '../../../components/common/Button';
import { SelectInput } from '../../../components/common/SelectInput';

const LedgerFormModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    editingLedger, 
    formData, 
    setFormData, 
    expenseLedgers = [], 
    loading = false 
}) => {
    const expenseLedgerOptions = [
        { label: 'None (Do not link to expense)', value: '' },
        ...(expenseLedgers || []).map((item) => ({
            label: item.ledger ? item.ledger.charAt(0).toUpperCase() + item.ledger.slice(1) : '',
            value: item._id
        }))
    ];

    return (
        <ModalCard
            open={isOpen}
            onClose={onClose}
            title={editingLedger ? 'Edit Account Ledger' : 'Create Account Ledger'}
            width="480px"
        >
            <form
                onSubmit={onSubmit}
                className="flex flex-col pt-5 items-center w-full px-5 sm:px-6 pb-6 gap-4"
            >
                {/* Ledger Name Input */}
                <div className="w-full">
                    <TextInput
                        label="Ledger Name"
                        name="name"
                        required
                        placeholder="e.g. Deepak Kumar, Acme Corp, Milk Vendor"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                {/* Link to Main Expense Ledger Dropdown */}
                <div className="w-full">
                    <SelectInput
                        label="Link to Main Expense Ledger (Optional)"
                        name="linkedExpenseLedger"
                        value={formData.linkedExpenseLedger || ''}
                        onChange={(e) => setFormData({ ...formData, linkedExpenseLedger: e.target.value })}
                        options={expenseLedgerOptions}
                        placeholder="Select expense ledger to link..."
                        helperText="Debit payments made here will automatically log into this expense ledger"
                    />
                </div>

                {/* Auto-Sync Informational Banner */}
                {formData.linkedExpenseLedger && (
                    <div className="w-full p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs flex items-start gap-2.5 transition-all animate-fade-in">
                        <Link2 className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400" />
                        <p className="leading-relaxed text-[11.5px]">
                            <strong>Auto-Sync Enabled:</strong> Any <strong>Debit</strong> transaction (payment to vendor/shopkeeper) recorded in this ledger will automatically create a matching expense entry in your main <strong>Expense</strong> tracker under the linked category.
                        </p>
                    </div>
                )}

                {/* Action buttons */}
                <div className="w-full flex justify-between items-center gap-3 mt-2">
                    <Button
                        type="submit"
                        loading={loading}
                        icon={editingLedger ? RefreshCw : Save}
                        className="flex-1 text-white shadow-md cursor-pointer"
                    >
                        {editingLedger ? 'Update Ledger' : 'Save Ledger'}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 cursor-pointer"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </ModalCard>
    );
};

export default React.memo(LedgerFormModal);
