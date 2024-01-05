import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import './dataanalysis.css';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const Email = () => {
    let navigate = useNavigate();
    const log = useSelector((state) => state.login);
    useEffect(() => {
        if (!log.islogin) {
            toast.warn("You Are not Logged In", { autoClose: 1300 });
            return navigate('/login');
        }
    }, [])

    const [inp, setinp] = useState('')
    const handle = (e) => {
        setinp(e.target.value)
    }
    const submit = () => {
        console.log(inp);
    }
    return (
        <>
            <div className="email" >
                <input onChange={handle} type="text" value={inp} />
                <br />
                <button onClick={submit}>Submit</button>
            </div>
        </>
    )
}

export default Email;