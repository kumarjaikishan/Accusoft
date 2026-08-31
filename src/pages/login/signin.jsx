import React, { useEffect, useState } from 'react';
import { Mail, Eye, EyeOff, Key, LogIn } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { setloader, setlogin } from '../../store/login';
import { useDispatch } from 'react-redux';
import { userdata } from '../../store/api';
import { toast } from '../../utils/toast';
import { confirmDialog } from '../../utils/confirm';
import { useApi } from '../../utils/useApi';
import { useForm } from '../../utils/useForm';
import LoadingButton from '../../components/LoadingButton';

const Signin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const init = {
        email: "",
        password: ""
    };

    useEffect(() => {
        dispatch(setloader(false));
    }, [dispatch]);

    const { fields, handlechange } = useForm(init);
    const { request, loading } = useApi();
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotMode, setIsForgotMode] = useState(false);
    const [btnclick, setbtnclick] = useState(false);

    useEffect(() => {
        dispatch(setloader(loading));
    }, [loading, dispatch]);

    const submit = async (e) => {
        e.preventDefault();
        setbtnclick(true);
        const { email, password } = fields;

        if (!email || !password) {
            toast.warn("Please provide both email and password.", { autoClose: 1800 });
            setbtnclick(false);
            return;
        }

        try {
            const res = await request({
                url: 'login',
                method: 'POST',
                body: { email, password },
            });

            if (res?.message === 'Email sent, check your inbox') {
                setbtnclick(false);
                toast.warn("Kindly Verify Email First", { autoClose: 3300 });

                return confirmDialog({
                    title: 'Kindly Verify Email First',
                    text: 'Please verify your email first to proceed. Check your spam/junk folder if you don’t see the email.',
                    icon: 'warning',
                    button: { text: 'OK' },
                });
            }

            toast.success(res.message || "Signed in successfully!", { autoClose: 1300 });
            setbtnclick(false);
            localStorage.setItem("token", res.token);
            dispatch(userdata());
            navigate('/dashboard');
            dispatch(setlogin(true));

        } catch (error) {
            setbtnclick(false);
        }
    };

    const handleForgotPassword = async () => {
        const email = fields.email;
        if (!email) {
            return toast.warn("Please enter your registered email address first.", { autoClose: 2100 });
        }

        try {
            setbtnclick(true);
            const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}checkmail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            setbtnclick(false);

            if (!res.ok) {
                return toast.warn(data.message || "Failed to send reset link", { autoClose: 2100 });
            }

            setIsForgotMode(false);
            toast.success(data.message || "Password reset link sent to your email!", { autoClose: 2500 });
        } catch (error) {
            toast.warn(error.message, { autoClose: 2100 });
            setbtnclick(false);
            console.error(error);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-3 pt-1">
            {/* Email Field */}
            <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Email Address
                </label>
                <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                        <Mail className="w-4 h-4" />
                    </div>
                    <input
                        type="email"
                        name="email"
                        required
                        value={fields.email}
                        onChange={handlechange}
                        placeholder="you@example.com"
                        className="block w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                </div>
            </div>

            {/* Password Field */}
            {!isForgotMode && (
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                            Password
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsForgotMode(true)}
                            className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                        >
                            Forgot password?
                        </button>
                    </div>
                    <div className="relative rounded-xl shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                            <Key className="w-4 h-4" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            value={fields.password}
                            onChange={handlechange}
                            placeholder="••••••••"
                            className="block w-full pl-9 pr-9 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            )}

            {/* Forgot Mode Helper */}
            {isForgotMode && (
                <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        We will send a reset link to your email.
                    </span>
                    <button
                        type="button"
                        onClick={() => setIsForgotMode(false)}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                        Back to Login
                    </button>
                </div>
            )}

            {/* Action Button */}
            <div className="pt-1.5">
                {!isForgotMode ? (
                    <LoadingButton
                        type="submit"
                        loading={loading || btnclick}
                        icon={LogIn}
                        className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        Sign In to Account
                    </LoadingButton>
                ) : (
                    <LoadingButton
                        type="button"
                        loading={btnclick}
                        onClick={handleForgotPassword}
                        icon={Key}
                        className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        Send Reset Link
                    </LoadingButton>
                )}
            </div>
        </form>
    );
};

export default Signin;
