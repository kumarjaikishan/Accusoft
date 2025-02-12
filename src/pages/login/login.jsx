import React, { useEffect } from 'react'
import './login.css';
import { useState } from 'react';
import { MdOutlineGrass } from "react-icons/md";
import Signin from './signin';
import Signup from './signup';

const Login = () => {
    const [log, setlog] = useState(true);
   
    const fun = (val) => {
        setlog(val);
    }


    return (
        <>
            <div className="login">
            <div className="img">
                <img src="https://res.cloudinary.com/dusxlxlvm/image/upload/v1720778631/accusoft/assets/calc_wb_cwg7ig.svg" alt="" />
            </div>
                <div className="box">
                    <div className="logo">
                        <MdOutlineGrass className='company' />
                    </div>
                    <div className="want">
                        <span className={log ? "active" : null} onClick={() => fun(true)}>Login</span>
                        <span className={log ? null : "active"} onClick={() => fun(false)}>Register</span>
                    </div>
                    <div className="both" style={{ transform: log ? "translateX(0%)" : "translateX(-50%)" }}>
                        <Signin />
                        <Signup setlog={setlog} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login