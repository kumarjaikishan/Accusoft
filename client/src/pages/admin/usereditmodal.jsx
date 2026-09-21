import React, { useEffect } from 'react';
import { RefreshCcw, Save } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { toast } from '../../utils/toast';
import { useApi } from '../../utils/useApi';
import Modalbox from '../../components/custommodal/Modalbox';
import TextInput from '../../components/common/TextInput';
import SelectInput from '../../components/common/SelectInput';
import Button from '../../components/common/Button';

const Useredit = ({ inp, setinp, modal, setmodal, handler, fetche }) => {
    const dispatch = useDispatch();
    const { request, loading } = useApi();

    useEffect(() => {
        dispatch(setloader(loading));
    }, [loading, dispatch]);

    const handleChange = (e) => {
        if (handler) {
            handler(e);
        } else if (setinp) {
            const { name, value } = e.target;
            const parsedVal = value === "true" ? true : value === "false" ? false : value;
            setinp((prev) => ({ ...prev, [name]: parsedVal }));
        }
    };

    const editdetail = async () => {
        const id = inp.id || inp._id;
        const { name, phone, email, admin, isadmin, verified, isverified } = inp;
        const finalAdmin = admin !== undefined ? admin : isadmin;
        const finalVerified = verified !== undefined ? verified : isverified;

        try {
            const res = await request({
                url: 'adminuserupdate',
                method: 'POST',
                body: { id, name, phone, email, admin: finalAdmin, verified: finalVerified },
            });
            toast.success(res?.message || "User updated successfully", { autoClose: 1300 });
            fetche();
            setmodal(false);
        } catch (error) {
            console.error(error);
        }
    };

    const currentAdmin = inp?.admin !== undefined ? inp.admin : (inp?.isadmin || false);
    const currentVerified = inp?.verified !== undefined ? inp.verified : (inp?.isverified || false);

    return (
        <Modalbox open={modal} onClose={() => setmodal(false)}>
            <div className="w-[460px] max-sm:w-[94vw] rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col">
                <div className="bg-[var(--maincolor)] px-5 py-3.5 text-white">
                    <h2 className="text-lg font-bold">Edit User Details</h2>
                </div>

                <div className="p-5 flex flex-col gap-3.5">
                    <TextInput
                        id="name"
                        label="Full Name"
                        name="name"
                        value={inp.name || ''}
                        onChange={handleChange}
                        placeholder="User name"
                        required
                    />

                    <TextInput
                        id="phone"
                        label="Phone"
                        name="phone"
                        type="tel"
                        value={inp.phone || ''}
                        onChange={handleChange}
                        placeholder="Phone number"
                    />

                    <TextInput
                        disabled
                        id="email"
                        label="Email Address"
                        name="email"
                        value={inp?.email || ''}
                    />

                    <SelectInput
                        id="type-select"
                        label="Role / Type"
                        name="admin"
                        value={String(currentAdmin)}
                        onChange={handleChange}
                        options={[
                            { value: "false", label: "User" },
                            { value: "true", label: "Admin" },
                        ]}
                    />

                    <SelectInput
                        id="verified-select"
                        label="Verification Status"
                        name="verified"
                        value={String(currentVerified)}
                        onChange={handleChange}
                        options={[
                            { value: "true", label: "Verified" },
                            { value: "false", label: "Unverified" },
                        ]}
                    />

                    <div className="flex justify-between items-center gap-3 mt-3">
                        <Button
                            loading={loading}
                            onClick={editdetail}
                            icon={Save}
                            className="flex-1"
                        >
                            Save Changes
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => setmodal(false)}
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

export default Useredit;