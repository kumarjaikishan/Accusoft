import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const TipSender = () => {
    const [username, setUsername] = useState('Kishan');
    const [amount, setAmount] = useState('15');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjaXRhZGVsIiwiZXhwIjoxNzY3MTU3MzQ1LCJqdGkiOiJiZjk4ZGU1OS00MmZiLTRlZjUtODRiYS01NzYyNjJmYTkyMGUiLCJjaGFubmVsIjoiNjRlOWQ3MDhiYmQ4ZTc1MWY4YTE1Nzc4Iiwicm9sZSI6Im93bmVyIiwiYXV0aFRva2VuIjoiTGVtZE91dkU5cDlFdHpoWmxNY0d5TkZkemVGTGJLUEo1QWtHQzl4aTNLVlhaMDhTIiwidXNlciI6IjY0ZTlkNzA4YmJkOGU3NTFmOGExNTc3NyIsInVzZXJfaWQiOiI2Mzc0ODFhMi1lZmJiLTQ2YjEtYTc3OS04MmZhNTk0YmQxYjciLCJ1c2VyX3JvbGUiOiJjcmVhdG9yIiwicHJvdmlkZXIiOiJ5b3V0dWJlIiwicHJvdmlkZXJfaWQiOiJVQzdVWllleEludWk5YU8tNVUyV2RBRlEiLCJjaGFubmVsX2lkIjoiNzRiODQ1ZWYtNmExYy00Y2ExLWI0YmQtNWI3Njc1MzM5YTdhIiwiY3JlYXRvcl9pZCI6IjA1MjYwMzAwLTA1NTAtNGJiZC05YzdlLTJkZjMyOWFlZWJjZSJ9.1KhOIJgsHKtZ_xZ4IP8e5JdVOhtgH6M7L2SaQjR3fw4';
    const CHANNEL_ID = '64e9d708bbd8e751f8a15778';

    const sendTip = async () => {
        setStatus('Sending...');

        try {
            const payload = {
                type: 'superchat', // tip , superchat
                provider: 'youtube',
                // isMock:true,
                data: {
                    amount: parseFloat(amount),
                    currency: 'INR',
                    username: username,
                    message: message || `Tip sent by ${username}`
                }
            };

            // const response = await axios.post(`https://api.streamelements.com/kappa/v2/activities/${CHANNEL_ID}/mock`, payload, {
            const response = await axios.post(`https://api.streamelements.com/kappa/v2/activities/${CHANNEL_ID}`, payload, {
                    headers: {
                        Authorization: `Bearer ${JWT_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setStatus('✅ Tip sent successfully!');
            toast.success('Tip sent successfully!', { autoClose: 1500 });
        } catch (error) {
            console.error(error);
            setStatus(`❌ ${error.response?.data?.message || 'Failed to send tip'}`);
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
        padding: '2rem',
        border: '1px solid #ddd',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        fontFamily: 'Arial, sans-serif'
    };

    return (
        <div style={containerStyle}>
            <h2 style={{ marginBottom: '1.5rem' }}>💸 Send a Tip</h2>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={inputStyle}
            />

            <input
                type="number"
                placeholder="Amount (e.g. 10)"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                style={inputStyle}
            />

            <input
                type="text"
                placeholder="Message (optional)"
                value={message}
                onChange={e => setMessage(e.target.value)}
                style={inputStyle}
            />

            <button onClick={sendTip} style={buttonStyle}>Send Tip</button>

            <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#555' }}>{status}</p>
        </div>
    );
};

export default TipSender;
