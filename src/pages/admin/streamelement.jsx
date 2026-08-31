import { useState } from 'react';
import { toast } from '../../utils/toast';
import { Send, Banknote, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const TipSender = () => {
    const [username, setUsername] = useState('Kishan');
    const [amount, setAmount] = useState('15');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjaXRhZGVsIiwiZXhwIjoxNzY3MjU5OTQ1LCJqdGkiOiJjYzdjMTljMS1hNDczLTRlZWYtOTg4NC1kZTMzN2ZjNTg1NWIiLCJjaGFubmVsIjoiNjRlOWUxM2JiYmQ4ZTc1MWY4YTE1N2M0Iiwicm9sZSI6Im93bmVyIiwiYXV0aFRva2VuIjoicl9yLXI4b2tfQTFQNkRudmtxaWdfeGRNRk9ORTBkaERXa3Z0R2lIQW5Ecmd2bVZZIiwidXNlciI6IjY0ZTllMTNiYmJkOGU3NTFmOGExNTdjMyIsInVzZXJfaWQiOiI2Zjg0ZmNlZC05NzEyLTQ0ZTEtOGYzNC03ZDIzOGJjZmI4YTgiLCJ1c2VyX3JvbGUiOiJjcmVhdG9yIiwicHJvdmlkZXIiOiJ5b3V0dWJlIiwicHJvdmlkZXJfaWQiOiJVQ3cwR1l3alBUUkhoTU5IYWdWNTFJbnciLCJjaGFubmVsX2lkIjoiOGViODhkZGItNTBjYy00ODIyLWIxZjgtN2I4MDNmZTU2NTgyIiwiY3JlYXRvcl9pZCI6ImQ2MTEwOGI3LTg5YzYtNDUxMS05OTE4LWY4OGRmNWRkOWI0YSJ9.i8V5R1yu0H0HUrLEpt6TkpYaUvvAiRyrO58LnAIw1UY';
    const CHANNEL_ID = '64e9e13bbbd8e751f8a157c4';

    const sendTip = async (e) => {
        e?.preventDefault();
        if (!username || !amount || Number(amount) <= 0) {
            toast.error("Please enter a valid username and amount.");
            return;
        }

        setLoading(true);
        setStatus('Dispatching live tip activity...');

        try {
            const payload = {
                type: 'tip',
                provider: 'youtube',
                data: {
                    amount: parseFloat(amount),
                    currency: 'INR',
                    username: username.trim(),
                    message: message.trim() || `Tip sent by ${username.trim()}`
                }
            };

            const response = await fetch(
                `https://api.streamelements.com/kappa/v2/activities/${CHANNEL_ID}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${JWT_TOKEN}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || "StreamElements API rejected the payload.");
            }

            setStatus("Tip sent successfully to StreamElements overlay!");
            toast.success("Tip alert dispatched live!", { autoClose: 2000 });

        } catch (error) {
            setStatus(`Failed: ${error.message || "Failed to send tip"}`);
            toast.error(error.message || "Failed to trigger StreamElements tip.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1120] p-4 sm:p-6 flex items-center justify-center font-sans text-slate-700 dark:text-slate-200"
        >
            <div className="w-full max-w-md bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm backdrop-blur-xl space-y-5">
                {/* Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                        <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                                Live Overlay
                            </span>
                        </div>
                        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-0.5">
                            StreamElements Tip Trigger
                        </h2>
                    </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Trigger test donations and onscreen live alerts directly on your connected StreamElements YouTube channel.
                </p>

                {/* Form Inputs */}
                <form onSubmit={sendTip} className="space-y-3.5">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Donator Username
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Kishan"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Tip Amount (INR ₹)
                        </label>
                        <input
                            type="number"
                            required
                            min="1"
                            placeholder="15"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-indigo-500 font-mono"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Alert Message (Optional)
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Keep up the great work!"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition cursor-pointer disabled:opacity-50 mt-2"
                    >
                        <Send size={14} /> {loading ? "Dispatching Alert..." : "Send Live Tip"}
                    </button>
                </form>

                {/* Status Notice */}
                {status && (
                    <div className={`p-3 rounded-xl text-xs font-medium border flex items-center gap-2 ${
                        status.includes("successfully")
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}>
                        {status.includes("successfully") ? <CheckCircle2 size={15} /> : <Sparkles size={15} />}
                        <span>{status}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default TipSender;
