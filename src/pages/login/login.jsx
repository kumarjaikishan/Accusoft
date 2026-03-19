import React, { useEffect } from 'react'
import { Leaf } from 'lucide-react';

import { useState } from 'react';

import Signin from './signin';
import Signup from './signup';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/navbar';

const Login = () => {
    const [log, setlog] = useState(true);
    let navigate = useNavigate();
    const logindata = useSelector((state) => state.login);

    useEffect(() => {
        if (logindata.islogin) {
            navigate('/dashboard'); // or '/dashboard' if that's your route
        }
    }, [logindata.islogin, navigate]);

    const fun = (val) => {
        setlog(val);
    }

    return (
        <>
            <Navbar />
            <div className="w-full min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 
dark:from-[#0f172a] dark:via-[#020617] dark:to-[#020617] p-4">
                <div className="rounded-[20px] relative w-full max-w-md min-h-[520px] max-sm:min-h-max bg-white 
dark:bg-slate-900/60 
dark:backdrop-blur-xl 
dark:border-white/10 shadow-2xl dark:shadow-none border border-gray-200 dark:border-white/5 dark:text-gray-100 overflow-hidden flex flex-col justify-start py-6">
                    <div className="w-full relative h-[70px] text-center flex justify-center mb-2 max-sm:hidden shrink-0">
                        <Leaf size={50} className="text-[6rem] text-[var(--maincolor)] dark:text-slate-100" />
                    </div>
                    <div className="w-[85%] mx-auto relative h-[50px] px-2 text-center mt-2 flex bg-gray-100 dark:bg-slate-900 rounded-[50px] p-1 shrink-0">
                        <span className={`flex-1 inline-flex items-center justify-center cursor-pointer h-full rounded-[50px] text-[1.1em] font-semibold transition-all ${log ? "text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"}`} style={log ? { background: "var(--maincolor)" } : {}} onClick={() => fun(true)}>Login</span>
                        <span className={`flex-1 inline-flex items-center justify-center cursor-pointer h-full rounded-[50px] text-[1.1em] font-semibold transition-all ${!log ? "text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"}`} style={!log ? { background: "var(--maincolor)" } : {}} onClick={() => fun(false)}>Register</span>
                    </div>
                    <div className="h-[370px] w-[200%] transition-transform duration-[600ms] relative flex max-sm:h-max max-sm:pb-[20px]" style={{ transform: log ? "translateX(0%)" : "translateX(-50%)" }}>
                        <Signin />
                        <Signup setlog={setlog} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
