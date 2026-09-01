import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from '../../utils/toast';
import { useSelector } from 'react-redux';
import TextInput from '../../components/common/TextInput';
import Button from '../../components/common/Button';

const SlowPage = () => {
    const useralldetail = useSelector((state) => state.userexplist);
    const [delay, setdelay] = useState(0);
    const [disable, setdisable] = useState(false);

    const handle = (e) => {
        setdelay(e.target.value);
    };

    const submit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            setdisable(true);
            const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}stillslow`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ delay }),
            });
            const data = await res.json();
            toast.success(data.message, { autoClose: 1500 });
            setdisable(false);
        } catch (error) {
            setdisable(false);
            console.log(error);
            toast.warn(error.message, { autoClose: 1500 });
        }
    };

    return (
        <div className="w-full h-[calc(100vh-var(--navheight))] gap-4 flex justify-center items-center flex-col p-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Slowdown the whole Server</h2>
            <form className="w-full max-w-[280px] gap-3 flex flex-col" onSubmit={submit}>
                <TextInput
                    label="Delay (In MilliSecond)"
                    required
                    type="tel"
                    onChange={handle}
                    name="delay"
                    value={delay}
                />
                <Button
                    type="submit"
                    loading={disable}
                    icon={Send}
                    className="w-full mt-1"
                >
                    Submit
                </Button>
            </form>
        </div>
    );
};

export default SlowPage;