import React, { useState, useEffect } from 'react';
import { Mail, Eye, EyeOff, Key, Phone, User, UserPlus, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setlogin } from '../../store/login';
import { useUserApi } from '../../store/apicalls';
import { toast } from '../../utils/toast';
import { useForm } from '../../utils/useForm';
import { useApi } from '../../utils/useApi';
import LoadingButton from '../../components/LoadingButton';
import OtpInput from '../../components/common/OtpInput';
import GoogleAuthButton from '../../components/GoogleAuthButton';

const Signup = ({ setlog }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userdatacall } = useUserApi();

    const init = {
        name: "",
        email: "",
        phone: "",
        password: "",
        cpassword: "",
        ledger: ["general", "other"]
    };
    const { fields, handlechange, reset } = useForm(init);
    const { request, loading } = useApi();
    const [showPassword, setShowPassword] = useState(false);
    const [btnclick, setbtnclick] = useState(false);

    // Modes: 'form' | 'verify_otp'
    const [isOtpMode, setIsOtpMode] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [pendingEmail, setPendingEmail] = useState('');
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        let interval;
        if (isOtpMode && resendTimer > 0) {
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
    }, [isOtpMode, resendTimer]);

    const startTimer = () => {
        setResendTimer(60);
        setCanResend(false);
    };

    const submit = async (e) => {
        e.preventDefault();
        const { name, email, phone, password, cpassword } = fields;
        
        if (!name || !email || !phone || !password) {
            return toast.warn("Please complete all required fields.", { autoClose: 1800 });
        }
        if (password !== cpassword) {
            return toast.warn("Passwords do not match.", { autoClose: 1800 });
        }
        if (phone.length !== 10) {
            return toast.warn("Phone number must be exactly 10 digits.", { autoClose: 1800 });
        }

        try {
            setbtnclick(true);
            const res = await request({
                url: "signup",
                method: "POST",
                body: { name, email, phone, password }
            });
            setbtnclick(false);

            if (res) {
                setPendingEmail(email);
                setIsOtpMode(true);
                startTimer();
                toast.success("Account created! 6-digit OTP sent to your email.", { autoClose: 3500 });
            }
        } catch (error) {
            setbtnclick(false);
            console.error(error);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otpCode.length !== 6) {
            return toast.warn("Please enter complete 6-digit OTP code.", { autoClose: 1800 });
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
                setlog(true);
            }
        } catch (err) {
            setbtnclick(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;
        try {
            setbtnclick(true);
            const res = await request({
                url: 'resend-otp',
                method: 'POST',
                body: { email: pendingEmail, type: 'verify_email' }
            });
            setbtnclick(false);
            startTimer();
            toast.success(res?.message || "New OTP code sent to your email!", { autoClose: 2500 });
        } catch (err) {
            setbtnclick(false);
        }
    };

    const isPasswordMatch = fields.password && fields.cpassword && fields.password === fields.cpassword;
    const isPhoneValid = fields.phone && fields.phone.length === 10;

    // MODE: Verify Registration OTP
    if (isOtpMode) {
        return (
            <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1">
                <div className="text-center space-y-1">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60 mx-auto flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        Enter Verification Code
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        We sent a 6-digit code to <br />
                        <strong className="text-slate-700 dark:text-slate-200">{pendingEmail}</strong>
                    </p>
                </div>

                <div className="py-1">
                    <OtpInput value={otpCode} onChange={setOtpCode} length={6} autoFocus />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                    <button
                        type="button"
                        onClick={() => setIsOtpMode(false)}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>

                    <button
                        type="button"
                        disabled={!canResend}
                        onClick={handleResend}
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
                    Verify &amp; Activate Account
                </LoadingButton>
            </form>
        );
    }

    // DEFAULT MODE: Sign Up Form
    return (
        <form onSubmit={submit} className="space-y-2.5 pt-0.5">
            {/* Full Name */}
            <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-0.5">
                    Full Name
                </label>
                <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                        <User className="w-3.5 h-3.5" />
                    </div>
                    <input
                        type="text"
                        name="name"
                        required
                        value={fields.name}
                        onChange={handlechange}
                        placeholder="John Doe"
                        className="block w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                </div>
            </div>

            {/* Email Address */}
            <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-0.5">
                    Email Address
                </label>
                <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                        <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                        type="email"
                        name="email"
                        required
                        value={fields.email}
                        onChange={handlechange}
                        placeholder="you@example.com"
                        className="block w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                </div>
            </div>

            {/* Phone Number */}
            <div>
                <div className="flex items-center justify-between mb-0.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        Phone (10 Digits)
                    </label>
                    {fields.phone && (
                        <span className={`text-[10px] font-semibold ${isPhoneValid ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {isPhoneValid ? 'Valid' : `${fields.phone.length}/10`}
                        </span>
                    )}
                </div>
                <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                        <Phone className="w-3.5 h-3.5" />
                    </div>
                    <input
                        type="tel"
                        name="phone"
                        maxLength={10}
                        required
                        value={fields.phone}
                        onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                            }
                        }}
                        onChange={handlechange}
                        placeholder="9876543210"
                        className={`block w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                            fields.phone && !isPhoneValid 
                                ? 'border-amber-500 focus:ring-amber-500' 
                                : 'border-slate-200 dark:border-slate-700/80 focus:ring-indigo-500'
                        }`}
                    />
                </div>
            </div>

            {/* Password & Confirm Password in 2 Columns */}
            <div className="grid grid-cols-2 gap-2">
                {/* Password */}
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-0.5">
                        Password
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                            <Key className="w-3.5 h-3.5" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            value={fields.password}
                            onChange={handlechange}
                            placeholder="••••••"
                            className="block w-full pl-8 pr-7 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-0.5">
                        Confirm
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                            <Key className="w-3.5 h-3.5" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="cpassword"
                            required
                            value={fields.cpassword}
                            onChange={handlechange}
                            placeholder="••••••"
                            className={`block w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                                fields.cpassword && !isPasswordMatch
                                    ? 'border-rose-500 focus:ring-rose-500'
                                    : fields.cpassword && isPasswordMatch
                                    ? 'border-emerald-500 focus:ring-emerald-500'
                                    : 'border-slate-200 dark:border-slate-700/80 focus:ring-indigo-500'
                            }`}
                        />
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="pt-1.5 space-y-2.5">
                <LoadingButton
                    type="submit"
                    loading={loading || btnclick}
                    icon={UserPlus}
                    className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                    Create Free Account
                </LoadingButton>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-1.5">
                    <div className="border-t border-slate-200 dark:border-slate-700/80 w-full" />
                    <span className="bg-white dark:bg-slate-900 px-2.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        or
                    </span>
                    <div className="border-t border-slate-200 dark:border-slate-700/80 w-full" />
                </div>

                {/* Google Sign Up */}
                <GoogleAuthButton text="Sign up with Google" />
            </div>
        </form>
    );
};

export default Signup;