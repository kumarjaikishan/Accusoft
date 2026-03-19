import { useState } from 'react';
import { toast } from 'react-toastify';
import { useApi } from '../../utils/useApi';

const TipSender = () => {
    const [username, setUsername] = useState('Kishan');
    const [amount, setAmount] = useState('15');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjaXRhZGVsIiwiZXhwIjoxNzY3MjU5OTQ1LCJqdGkiOiJjYzdjMTljMS1hNDczLTRlZWYtOTg4NC1kZTMzN2ZjNTg1NWIiLCJjaGFubmVsIjoiNjRlOWUxM2JiYmQ4ZTc1MWY4YTE1N2M0Iiwicm9sZSI6Im93bmVyIiwiYXV0aFRva2VuIjoicl9yLXI4b2tfQTFQNkRudmtxaWdfeGRNRk9ORTBkaERXa3Z0R2lIQW5Ecmd2bVZZIiwidXNlciI6IjY0ZTllMTNiYmJkOGU3NTFmOGExNTdjMyIsInVzZXJfaWQiOiI2Zjg0ZmNlZC05NzEyLTQ0ZTEtOGYzNC03ZDIzOGJjZmI4YTgiLCJ1c2VyX3JvbGUiOiJjcmVhdG9yIiwicHJvdmlkZXIiOiJ5b3V0dWJlIiwicHJvdmlkZXJfaWQiOiJVQ3cwR1l3alBUUkhoTU5IYWdWNTFJbnciLCJjaGFubmVsX2lkIjoiOGViODhkZGItNTBjYy00ODIyLWIxZjgtN2I4MDNmZTU2NTgyIiwiY3JlYXRvcl9pZCI6ImQ2MTEwOGI3LTg5YzYtNDUxMS05OTE4LWY4OGRmNWRkOWI0YSJ9.i8V5R1yu0H0HUrLEpt6TkpYaUvvAiRyrO58LnAIw1UY';
    const CHANNEL_ID = '64e9e13bbbd8e751f8a157c4';

    const { request, loading, data } = useApi();

    const sendTip = async () => {
        setStatus('Sending...');

        try {
            const payload = {
                type: 'tip', // tip , superchat
                provider: 'youtube',
                // isMock:true,
                data: {
                    amount: parseFloat(amount),
                    currency: 'INR',
                    username: username,
                    message: message || `Tip sent by ${username}`
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
                throw new Error(data?.message || "Failed to send tip");
            }

            setStatus("✅ Tip sent successfully!");
            toast.success("Tip sent successfully!", { autoClose: 1500 });

        } catch (error) {
            console.error(error);
            setStatus(`❌ ${error.message || "Failed to send tip"}`);
        }
    };

    const inputStyle = {
        padding: '10px',
        marginBottom: '1rem',
        width: '100%',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '8px'
    };

    const buttonStyle = {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer'
    };

    const containerStyle = {
        maxWidth: '400px',
        margin: '2rem auto',
    };

    return (
        <div style={containerStyle} className="bg-white dark:bg-slate-900 p-8 border border-gray-200 dark:border-white/5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-none font-sans mt-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">💸 Send a Tip</h2>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full text-base p-3 mb-4 border border-gray-300 dark:border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-gray-100 transition-all"
            />

            <input
                type="number"
                placeholder="Amount (e.g. 10)"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full text-base p-3 mb-4 border border-gray-300 dark:border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-gray-100 transition-all"
            />

            <input
                type="text"
                placeholder="Message (optional)"
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full text-base p-3 mb-4 border border-gray-300 dark:border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-gray-100 transition-all"
            />

            <button onClick={sendTip} className="px-6 py-3 text-base bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-lg cursor-pointer transition-all w-full font-medium">Send Tip</button>

            <p className="mt-4 italic text-sm text-gray-500 dark:text-gray-400 text-center">{status}</p>
        </div>
    );
};

export default TipSender;
