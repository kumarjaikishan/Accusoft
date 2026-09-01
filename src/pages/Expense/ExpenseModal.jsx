import React from 'react';
import { RefreshCcw, Save, RefreshCw } from 'lucide-react';

import { useSelector, useDispatch } from 'react-redux';
import { userdata } from '../../store/api';
import { toast } from '../../utils/toast';
import { useApi } from '../../utils/useApi';
import Modalbox from '../../components/custommodal/Modalbox';
import TextInput from '../../components/common/TextInput';
import AutocompleteSelect from '../../components/common/AutocompleteSelect';
import Button from '../../components/common/Button';

const ExpenseModalbox = ({ modal, disable, handlechange, fields, isupdate, sub, setmodal, setisupdate, reset, onSuccess }) => {
    const useralldetail = useSelector((state) => state.userexplist);
    const dispatch = useDispatch();
    const { request, loading } = useApi();

    // for updating data  
    const updatee = async (_id) => {
        let { ledger, date, amount, narration } = fields;
        const toastId = toast.loading("Updating voucher...");
        try {
            const res = await request({
                url: 'updateexp',
                method: 'POST',
                body: { _id, ledger, date, amount, narration: capitalize(narration) },
            });

            toast.update(toastId, { 
                render: res?.message || "Voucher Updated Successfully", 
                type: "success", 
                isLoading: false, 
                autoClose: 1300 
            });
            dispatch(userdata());
            if (onSuccess) onSuccess();
            reset();
            setisupdate(false);
            setmodal(false);

        } catch (error) {
            toast.update(toastId, { 
                render: error?.message || "Failed to update voucher", 
                type: "error", 
                isLoading: false, 
                autoClose: 3000 
            });
            console.error(error);
        }
    }

    const capitalize = (value) => {
        if (!value) return '';
        const words = value.split(' ');
        const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
        return capitalizedWords.join(' ');
    };

    const handleAmountChange = (e) => {
        const val = e.target.value;
        // Allow only numeric digits
        if (/^\d*$/.test(val)) {
            handlechange(e);
        }
    };

    const ledgerOptions = (useralldetail?.ledgerlist || []).map(item => ({
        value: item._id,
        label: item.ledger ? item.ledger.charAt(0).toUpperCase() + item.ledger.slice(1) : ''
    }));

    return (
        <Modalbox open={modal} onClose={() => setmodal(false)}>
            <div className="w-[500px] h-max rounded-[20px] overflow-hidden flex flex-col items-center max-sm:w-[96vw] bg-[var(--maincolor)]">
                <h1 className="w-full h-[50px] leading-[50px] text-[aliceblue] tracking-[2px] font-bold text-2xl text-center max-sm:text-[1.5em] max-sm:tracking-[1px] bg-[var(--maincolor)]">
                    {isupdate ? "Update Voucher" : "Add Voucher"}
                </h1>

                <div className="flex flex-col rounded-t-[30px] border-t border-white/20 pt-4 bg-surface items-center w-full px-6 pb-6 gap-3.5">
                    <AutocompleteSelect
                        label="Ledger"
                        name="ledger"
                        value={fields?.ledger || ''}
                        onChange={handlechange}
                        options={ledgerOptions}
                        placeholder="Type or search ledger..."
                        required
                    />

                    <TextInput
                        type="date"
                        label="Date"
                        name="date"
                        value={fields?.date || ''}
                        onChange={handlechange}
                        required
                    />

                    <TextInput
                        id="voucher-amount"
                        label="Amount"
                        name="amount"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={fields?.amount || ''}
                        onChange={handleAmountChange}
                        startAdornment={<span className="font-semibold text-slate-500">₹</span>}
                        placeholder="0"
                        required
                    />

                    <TextInput
                        multiline
                        rows={3.5}
                        id="voucher-narration"
                        label="Narration"
                        name="narration"
                        value={fields?.narration || ''}
                        onChange={handlechange}
                        placeholder="Enter description or details..."
                        inputClassName="min-h-[85px]"
                    />

                    <div className="w-full flex justify-between items-center gap-3 mt-3">
                        <Button
                            loading={loading}
                            onClick={isupdate ? () => updatee(fields._id) : sub}
                            icon={isupdate ? RefreshCw : Save}
                            className="flex-1"
                        >
                            {isupdate ? "Update" : "Submit"}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => {
                                setmodal(false);
                                setisupdate(false);
                                reset();
                            }}
                            icon={RefreshCcw}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </Modalbox>
    );
};

export default ExpenseModalbox;
