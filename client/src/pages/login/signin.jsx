import React, { useEffect, useState } from 'react';
import { Mail, Eye, EyeOff, Key, LogIn, ArrowLeft, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { setloader, setlogin } from '../../store/login';
import { useDispatch } from 'react-redux';
import { useUserApi } from '../../store/apicalls';
import { toast } from '../../utils/toast';
import { useApi } from '../../utils/useApi';
import { useForm } from '../../utils/useForm';
import LoadingButton from '../../components/LoadingButton';
import OtpInput from '../../components/common/OtpInput';
import GoogleAuthButton from '../../components/GoogleAuthButton';

const Signin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userdatacall } = useUserApi();
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
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [btnclick, setbtnclick] = useState(false);

    // Modes: 'login' | 'verify_email_otp' | 'forgot_request' | 'forgot_otp_reset'
    const [authMode, setAuthMode] = useState('login');
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [pendingEmail, setPendingEmail] = useState('');
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        dispatch(setloader(loading));
    }, [loading, dispatch]);

    // Countdown timer for OTP resend
    useEffect(() => {
        let interval;
        if ((authMode === 'verify_email_otp' || authMode === 'forgot_otp_reset') && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [authMode, resendTimer]);

    const startTimer = () => {
        setResendTimer(60);
        setCanResend(false);
    };

    // 1. Standard Sign In
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setbtnclick(true);
        const { email, password } = fields;

        if (!email || !password) {
            toast.warn("Please enter both email and password.", { autoClose: 1800 });
            setbtnclick(false);
            return;
        }

        try {
            const res = await request({
                url: 'login',
                method: 'POST',
                body: { email, password },
            });

            // If account is unverified, prompt OTP
            if (res?.requiresVerification || res?.message?.includes('OTP sent')) {
                setbtnclick(false);
                setPendingEmail(res.email || email);
                setOtpCode('');
                setAuthMode('verify_email_otp');
                startTimer();
                toast.info("Verification code sent to your email!", { autoClose: 3000 });
                return;
            }

            toast.success(res.message || "Signed in successfully!", { autoClose: 1300 });
            setbtnclick(false);
            localStorage.setItem("token", res.token);
            userdatacall();
            navigate('/dashboard');
            dispatch(setlogin(true));

        } catch (error) {
            setbtnclick(false);
        }
    };

    // 2. Submit Verification OTP
    const handleVerifyOtpSubmit = async (e) => {
        e.preventDefault();
        if (otpCode.length !== 6) {
            return toast.warn("Please enter complete 6-digit OTP.", { autoClose: 1800 });
        }

        try {
            setbtnclick(true);
            const res = await request({
                url: 'verify-otp',
                method: 'POST',
                body: { email: pendingEmail, otp: otpCode }
            });
            setbtnclick(false);

            toast.success(res?.message || "Email verified successfully!", { autoClose: 1800 });
            if (res?.token) {
                localStorage.setItem("token", res.token);
                userdatacall();
                navigate('/dashboard');
                dispatch(setlogin(true));
            } else {
                setAuthMode('login');
            }
        } catch (error) {
            setbtnclick(false);
        }
    };

    // 3. Request Password Reset OTP
    const handleForgotRequest = async (e) => {
        e.preventDefault();
        const email = fields.email;
        if (!email) {
            return toast.warn("Please enter your registered email address.", { autoClose: 2000 });
        }

        try {
            setbtnclick(true);
            const data = await request({
                url: 'checkmail',
                method: 'POST',
                body: { email }
            });
            setbtnclick(false);

            setPendingEmail(email);
            setOtpCode('');
            setNewPassword('');
            setAuthMode('forgot_otp_reset');
            startTimer();
            toast.success(data?.message || "6-digit OTP code sent to your email!", { autoClose: 3000 });
        } catch (error) {
            setbtnclick(false);
        }
    };

    // 4. Submit Password Reset with OTP & New Password
    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();
        if (otpCode.length !== 6) {
            return toast.warn("Please enter complete 6-digit OTP code.", { autoClose: 1800 });
        }
        if (!newPassword || newPassword.length < 6) {
            return toast.warn("New password must be at least 6 characters.", { autoClose: 2000 });
        }

        try {
            setbtnclick(true);
            const data = await request({
                url: 'reset-password-otp',
                method: 'POST',
                body: {
                    email: pendingEmail,
                    otp: otpCode,
                    newPassword
                }
            });
            setbtnclick(false);

            toast.success(data?.message || "Password reset successfully! Please sign in.", { autoClose: 2500 });
            setAuthMode('login');
            setOtpCode('');
            setNewPassword('');
        } catch (error) {
            setbtnclick(false);
        }
    };

    // 5. Resend OTP handler
    const handleResend = async (type) => {
        if (!canResend) return;
        try {
            setbtnclick(true);
            const res = await request({
                url: 'resend-otp',
                method: 'POST',
                body: { email: pendingEmail, type }
            });
            setbtnclick(false);
            startTimer();
            toast.success(res?.message || "New OTP sent to your email!", { autoClose: 2500 });
        } catch (err) {
            setbtnclick(false);
        }
    };

    /* ================= RENDER MODES ================= */

    // MODE: Verify Email OTP
    if (authMode === 'verify_email_otp') {
        return (
            <form onSubmit={handleVerifyOtpSubmit} className="space-y-4 pt-1">
                <div className="text-center space-y-1">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60 mx-auto flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        Verify Your Email
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Enter the 6-digit code sent to <br />
                        <strong className="text-slate-700 dark:text-slate-200">{pendingEmail}</strong>
                    </p>
                </div>

                <div className="py-1">
                    <OtpInput value={otpCode} onChange={setOtpCode} length={6} autoFocus />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                    <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>

                    <button
                        type="button"
                        disabled={!canResend}
                        onClick={() => handleResend('verify_email')}
                        className={`font-semibold ${
                            canResend
                                ? "text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                                : "text-slate-400 dark:text-slate-600 cursor-not-allowed"
                        }`}
                    >
                        {canResend ? "Resend Code" : `Resend in ${resendTimer}s`}
                    </button>
                </div>

                <LoadingButton
                    type="submit"
                    loading={loading || btnclick}
                    icon={CheckCircle2}
                    className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                    Verify &amp; Enter Dashboard
                </LoadingButton>
            </form>
        );
    }

    // MODE: Forgot Password - Enter OTP & New Password
    if (authMode === 'forgot_otp_reset') {
        return (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-3 pt-1">
                <div className="text-center space-y-1">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60 mx-auto flex items-center justify-center">
                        <Key className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        Enter OTP &amp; Set New Password
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Code sent to <strong className="text-slate-700 dark:text-slate-200">{pendingEmail}</strong>
                    </p>
                </div>

                <div className="py-0.5">
                    <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1 text-center">
                        6-Digit Security Code
                    </label>
                    <OtpInput value={otpCode} onChange={setOtpCode} length={6} autoFocus />
                </div>

                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                        New Password
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                            <Key className="w-4 h-4" />
                        </div>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password (min 6 chars)"
                            className="block w-full pl-9 pr-9 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                    <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:text-slate-400"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                    </button>

                    <button
                        type="button"
                        disabled={!canResend}
                        onClick={() => handleResend('reset_password')}
                        className={`font-semibold ${
                            canResend
                                ? "text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                                : "text-slate-400 dark:text-slate-600 cursor-not-allowed"
                        }`}
                    >
                        {canResend ? "Resend Code" : `Resend in ${resendTimer}s`}
                    </button>
                </div>

                <LoadingButton
                    type="submit"
                    loading={loading || btnclick}
                    icon={CheckCircle2}
                    className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                    Update Password &amp; Sign In
                </LoadingButton>
            </form>
        );
    }

    // MODE: Forgot Password Request (Enter Email)
    if (authMode === 'forgot_request') {
        return (
            <form onSubmit={handleForgotRequest} className="space-y-3 pt-1">
                <div className="text-center space-y-1 mb-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        Reset Your Password
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Enter your email address and we'll send you a 6-digit OTP code.
                    </p>
                </div>

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
                            className="block w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                    <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        className="inline-flex items-center gap-1 font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                    </button>
                </div>

                <div className="pt-1">
                    <LoadingButton
                        type="submit"
                        loading={loading || btnclick}
                        icon={Key}
                        className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        Send 6-Digit OTP Code
                    </LoadingButton>
                </div>
            </form>
        );
    }

    // DEFAULT MODE: Standard Sign In
    return (
        <form onSubmit={handleLoginSubmit} className="space-y-3 pt-1">
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
            <div>
                <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        Password
                    </label>
                    <button
                        type="button"
                        onClick={() => setAuthMode('forgot_request')}
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

            {/* Action Button */}
            <div className="pt-1.5 space-y-2.5">
                <LoadingButton
                    type="submit"
                    loading={loading || btnclick}
                    icon={LogIn}
                    className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                    Sign In to Account
                </LoadingButton>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-2">
                    <div className="border-t border-slate-200 dark:border-slate-700/80 w-full" />
                    <span className="bg-white dark:bg-slate-900 px-2.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        or
                    </span>
                    <div className="border-t border-slate-200 dark:border-slate-700/80 w-full" />
                </div>

                {/* Google ID Token Sign In */}
                <GoogleAuthButton />
            </div>
        </form>
    );
};

export default Signin;
