import React, { useEffect, useState } from 'react';
import './officeexp.css';
import Expprint from './office exp/expprint';
import Explist from './office exp/explist';
const Officeexp = () => {
    const [toogle, settoogle] = useState(false);
    const [led, setled] = useState([]);
    const [exp, setexp] = useState([]);
    const [lastvoucher, setlastvoucher] = useState("");
    useEffect(() => {
        fetche();
        expfetch();

    }, [])
    const datee = () => {
        let date = new Date()
        let result = date.toISOString().split('T')[0]
        return result;
    }
   
    const [inp, setinp] = useState({
        id: "",
        voucher: "",
        ledger: "General",
        date: datee(),
        narration: "",
        amount: ""
    })
    
    const [isupdate, setisupdate] = useState(false);
    const fetche = async () => {
        const result = await fetch('/offledger', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await result.json();
        let ledgerdetal = await data.data[0].ledger
        setled(ledgerdetal);
    }
    const expfetch = async () => {
        const result = await fetch('/offexpfetch', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await result.json();
        let explist = await data.data
        console.log(explist)
        setexp(explist);
        let voun =(explist.slice(-1)[0].voucher + 1)
        console.log(voun)
        // setlastvoucher(voun)
        setinp({...inp,voucher: voun})
    }
    const print = () => {
        settoogle(false);
        setTimeout(() => {
            window.print()
        }, 10);

    }
    return (
        <>
            <div className='office'>
                <div>
                    <span className={toogle ? "btn inactive" : "btn"} onClick={() => settoogle(false)}>Voucher</span>
                    <span className={toogle ? "btn" : "btn inactive"} onClick={() => settoogle(true)}>Previous</span>
                </div>
                {
                    toogle ? <Explist settoogle={settoogle} print={print} setinp={setinp} exp={exp} setisupdate={setisupdate} /> : <Expprint inp={inp} setinp={setinp} setisupdate={setisupdate} isupdate={isupdate} led={led} exp={exp} />
                }

            </div>

        </>
    )
}

export default Officeexp