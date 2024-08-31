import React, { useEffect, useState } from 'react';
import './voucher.css';
import Expprint from './office exp/expprint';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setloader } from '../store/login';

const Voucher = () => {
    const [led, setled] = useState([]);
    const [exp, setexp] = useState([]);
    const { expId } = useParams();
    const dispatch = useDispatch();
    const useralldetail = useSelector((state) => state.userexplist);
    useEffect(() => {
        expfetchen();
    }, [])

    const expfetchen = async () => {
        dispatch(setloader(true));
        try {
            const token = localStorage.getItem("token");
            const result = await fetch(`${useralldetail.apiadress}/expdetail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    expId
                })
            })
            const data = await result.json();
            console.log(data);
            if (result.ok) {
                setexp(data.data)
            } else {
                toast.warn("error occurred", { autoClose: 1300 })
            }
            dispatch(setloader(false));
        } catch (error) {
            toast.warn("Sopmething went wrong", { autoClose: 1300 })
            console.log(error);
            dispatch(setloader(false));
        }
    }

    const print = () => {
        setTimeout(() => {
            window.print()
        }, 10);

    }
    return (
        <>
            <div className='office'>
                <Expprint inp={exp}/>
            </div>

        </>
    )
}

export default Voucher;