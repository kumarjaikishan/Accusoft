import React from 'react';
import { NavLink } from "react-router-dom";
import './Errorpage.css';

export const Errorpage = () => {
    return (
        <div className="errore">
            <div className="container">
                <h1>404 </h1>
                <h2>Page Not Found</h2>
                <p>Sorry, the page you are looking for does not exist. If you believe there's an issue, feel free to report it, and we'll look into it</p>
                <div className="btns">
                    <NavLink to="/" className='btn linke'>Return Home</NavLink>
                    {/* <NavLink to="/contact" className='btn linke'>Report Problem</NavLink> */}
                </div>
            </div>
        </div>
    );
};
