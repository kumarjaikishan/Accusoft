import React, { useEffect } from 'react'
import { RefreshCcw, Save } from 'lucide-react';

import { useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { toast } from '../../utils/toast';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import LoadingButton from '../../components/LoadingButton';

import { useApi } from '../../utils/useApi';

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
            setinp((prev) => ({ ...prev, [name]: value }));
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
        <div className="modal" style={{ display: modal ? "block" : "none" }}>
            <div className="box">
                <h1 className="text-white">User Detail</h1>
                <span className="wrapper">
                    <TextField sx={{ width: '90%', mt: 3, mb: 1 }} id="name" label="Name"
                        name="name" value={inp.name || ''} type="text" onChange={handleChange}
                        variant="outlined" />
                    <TextField sx={{ width: '90%', mt: 1, mb: 1 }} id="phone" label="Phone" name="phone"
                        onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault(); } }}
                        type="tel" value={inp.phone || ''}
                        onChange={handleChange}
                        variant="outlined" />

                    <TextField disabled sx={{ width: '90%', mt: 1, mb: 1 }} id="email" label="Email"
                        name="email" value={inp?.email || ''} type="text"
                        variant="outlined" />

                    <FormControl className='caps' sx={{ width: '90%', mt: 1, mb: 1 }}>
                        <InputLabel id="type-label">Type</InputLabel>
                        <Select
                            name="admin"
                            labelId="type-label"
                            onChange={handleChange}
                            value={currentAdmin}
                            id="type-select"
                            label="Type"
                        >
                            <MenuItem className='caps' value={false}>User</MenuItem>
                            <MenuItem className='caps' value={true}>Admin</MenuItem>
                        </Select>
                    </FormControl>
                    
                    <FormControl className='caps' sx={{ width: '90%', mt: 1, mb: 2 }}>
                        <InputLabel id="verified-label">Verified</InputLabel>
                        <Select
                            name="verified"
                            labelId="verified-label"
                            onChange={handleChange}
                            value={currentVerified}
                            id="verified-select"
                            label="Verified"
                        >
                            <MenuItem className='caps' value={true}>Verified</MenuItem>
                            <MenuItem className='caps' value={false}>Unverified</MenuItem>
                        </Select>
                    </FormControl>

                    <div className='flex justify-around w-full gap-2 px-4'>
                        <LoadingButton
                            loading={loading}
                            onClick={editdetail}
                            icon={Save}
                            className="w-1/2"
                        >
                            Submit
                        </LoadingButton>
                        <Button
                            onClick={() => setmodal(false)}
                            className='w-1/2 bg-gray-200 dark:bg-slate-700 text-slate-800 dark:text-gray-100' 
                            variant="outlined" 
                            startIcon={<RefreshCcw size={18} />}
                        >
                            Cancel
                        </Button>
                    </div>
                </span>
            </div>
        </div>
    )
}

export default Useredit;