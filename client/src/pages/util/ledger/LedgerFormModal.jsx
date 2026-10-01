import React from 'react';
import { Save, RefreshCw } from 'lucide-react';
import ModalCard from '../../../components/custommodal/ModalCard';
import TextInput from '../../../components/common/TextInput';
import Button from '../../../components/common/Button';

const LedgerFormModal = ({ isOpen, onClose, onSubmit, editingLedger, formData, setFormData, loading = false }) => {
    return (
        <ModalCard
            open={isOpen}
            onClose={onClose}
            title={editingLedger ? 'Edit Account Ledger' : 'Create Account Ledger'}
            width="450px"
        >
            <form
                onSubmit={onSubmit}
                className="flex flex-col pt-5 items-center w-full px-5 sm:px-6 pb-6 gap-4"
            >
                <div className="w-full">
                    <TextInput
                        label="Ledger Name"
                        name="name"
                        required
                        placeholder="e.g. Deepak Kumar, Acme Corp, Salary Account"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                {/* Action buttons */}
                <div className="w-full flex justify-between items-center gap-3 mt-2">
                    <Button
                        type="submit"
                        loading={loading}
                        icon={editingLedger ? RefreshCw : Save}
                        className="flex-1 text-white shadow-md"
                    >
                        {editingLedger ? 'Update Ledger' : 'Save Ledger'}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </ModalCard>
    );
};

export default React.memo(LedgerFormModal);
