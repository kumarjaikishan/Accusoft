import React, { useState } from 'react';
import { Mail, Eye, EyeOff, Key, Phone, User, UserPlus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from '../../utils/toast';
import { confirmDialog } from '../../utils/confirm';
import { useForm } from '../../utils/useForm';
import { useApi } from '../../utils/useApi';
import LoadingButton from '../../components/LoadingButton';

const Signup = ({ setlog }) => {
    const dispatch = useDispatch();

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
            const res = await request({
                url: "signup",
                method: "POST",
                body: { name, email, phone, password }
            });

            if (res) {
                reset();
                await confirmDialog({
                    title: 'Account Created Successfully!',
                    text: 'Please check your email to verify your account before logging in. (Check Spam/Junk folder if not in inbox).',
                    icon: 'success',
                    button: { text: 'Proceed to Login' },
                });
                setlog(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const isPasswordMatch = fields.password && fields.cpassword && fields.password === fields.cpassword;
    const isPhoneValid = fields.phone && fields.phone.length === 10;

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
            <div className="pt-1.5">
                <LoadingButton
                    type="submit"
                    loading={loading}
                    icon={UserPlus}
                    className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                    Create Free Account
                </LoadingButton>
            </div>
        </form>
    );
};

export default Signup;