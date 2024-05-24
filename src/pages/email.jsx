import React from 'react'
import { useState } from 'react';
import './dataanalysis.css';

const Email = () => {
   
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