import React, { useEffect, useState } from 'react'
import './expprint.css';
import sig from '../../img/JAISIGN.png'
import img from '../../img/good-nature-logo.png'

const Expprint = ({led,exp,isupdate,setisupdate,inp,setinp,}) => {
        
        var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
        var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
        
        const inWords= (num)=> {
            
            if ((num = num.toString()).length > 9) return 'overflow';
            let  n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
            if (!n) return; var str = '';
            str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
            str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
            str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
            str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
            str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
            // return str;
            // console.log(str);
            document.querySelector("#textvalue").innerText = str;
        }
       
     const print = ()=>{
        window.print();
     }
      const handle = (e)=>{
            let name = e.target.name;
            let val = e.target.value;
            setinp({
                ...inp,[name]:val
            })
      }
      const update =async ()=>{
        setisupdate(false);
        const {id,voucher,ledger,date,narration,amount } = inp
        try{
            const res = await fetch('/offexpenseupdate', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id,voucher,ledger,date,narration,amount
                })
            })
            const datae = await res.json();
            console.log(datae);
        }catch{

        }
      }

     const sub=async()=>{
        const { voucher, ledger,date ,narration,amount} = inp;
        try{
            const res = await fetch('offexpense', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    voucher, ledger,date ,narration,amount
                })
            })
            const datae = await res.json();
            console.log(datae);
        }catch{

        }
     }

    return (
        <div className='expprint'>
            
            <div className="box">
                <div className="header">
                    <div className="logo">
                        <img src={img} alt="" />
                        <span>"हमारा सपना सबका हो घर अपना "</span>
                    </div>
                    <div className="heading">
                        <h1>Good Nature Projects Pvt Ltd.</h1>
                        <h6>1st floor, Vimla Market-3, Nala Road, Patel Nagar, Biharsharif, Nalanda, Bihar-803101</h6>
                        <h5>http://www.goodnatureprojects.com, e-mail-ops@goodnatureprojects.com</h5>
                    </div>
                </div>
                <div className="title">
                    <h3><u>Payment Voucher</u></h3>
                    <div>
                        <span className='quest'>Voucher No.</span>
                        <span className='ans vno'><input type="text" name="voucher" id="" value={inp.voucher} onChange={handle} /></span>
                    </div>
                    <div className='set'>
                        <span>
                            <span className='quest'>A/C Name</span>
                            <span className='ans lname'>
                                <select name="ledger" id="" value={inp.ledger} onChange={handle}>
                                   
                                    {
                                        led.map((val,ind)=>{
                                            return  <option key={ind} value={val}>{val}</option>
                                        })
                                    }
                                </select>

                            </span>
                            <span className='quest deb'>Debit</span>
                        </span>
                        <span>
                            <span className='quest qdat'>Date</span>
                            <span className='ans dat'><input type="date" name="date" id="" value={inp.date} onChange={handle} /></span>
                            
                        </span>
                    </div>
                </div>
                <div className="particular">
                    <div className="narr">
                        <input type="text" name='narration' value={inp.narration}   onChange={handle}/>
                    </div>
                    <div className="amount"> <input type="text" id='check' name='amount' value={inp.amount} onChange={handle} onKeyUp={()=>inWords(document.querySelector("#check").value)} /></div>
                    <div className="word">Amount</div>
                </div>
                <div className="inttoword" id='textvalue'>twenty five rupess</div>
                <div className="sign">
                    <div><u>Approver By</u></div>
                    <div>
                        <span><u>Accountant</u></span>
                        <img src={sig} alt="" />
                    </div>
                    <div><u>Receiver Signature</u></div>
                </div>
            </div>
            <div>
                {isupdate? <button onClick={()=> update()}>Update</button>: <button onClick={sub}>Submit</button> }
               
            </div>
        </div>
    )
}

export default Expprint