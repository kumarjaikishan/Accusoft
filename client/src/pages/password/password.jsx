import { useParams, useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { toast } from "../../utils/toast";
import { useApi } from "../../utils/useApi";
import TextInput from '../../components/common/TextInput';
import Button from '../../components/common/Button';

const PasswordReset = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const useralldetail = useSelector((state) => state.userexplist);
    const { request, loading: isloading } = useApi();
    const [inp, setinp] = useState({
        pass: '',
        cpass: ''
    });

    const handlechange = (e) => {
        let naam = e.target.name;
        let value = e.target.value;
        setinp({
            ...inp, [naam]: value
        });
    };

    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            const resuke = await request({
                url: `setpassword?token=${token}`,
                method: "POST",
                body: { password: inp.pass }
            });
            toast.success(resuke?.message || "Password reset successfully!", { autoClose: 1600 });
            navigate('/logout');
        } catch (error) {
            console.log(error);
        }
    };

    const isMismatch = inp.cpass.length > 0 && inp.pass !== inp.cpass;

    return (
        <div className="w-full h-[calc(100vh-var(--navheight))] bg-page grid place-items-center p-4">
            <div className="w-full max-w-sm rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="bg-[var(--maincolor)] px-5 py-3.5 text-white">
                    <h2 className="text-lg font-bold">Reset Password</h2>
                </div>

                <form onSubmit={handlesubmit} className="p-5 flex flex-col gap-4">
                    <TextInput
                        required
                        type="password"
                        name="pass"
                        label="New Password"
                        placeholder="Enter new password"
                        value={inp.pass}
                        onChange={handlechange}
                    />

                    <TextInput
                        required
                        type="password"
                        name="cpass"
                        label="Confirm Password"
                        placeholder="Re-enter new password"
                        value={inp.cpass}
                        onChange={handlechange}
                        error={isMismatch}
                        helperText={isMismatch ? "Passwords do not match" : ""}
                    />

                    <Button
                        type="submit"
                        loading={isloading}
                        disabled={isloading || isMismatch || !inp.pass.length}
                        icon={Save}
                        className="w-full mt-2"
                    >
                        Change Password
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default PasswordReset;