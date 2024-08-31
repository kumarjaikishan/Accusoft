import React, { useEffect, useState } from 'react'
import './expprint.css';
// import sig from '../../img/JAISIGN.png'
// import img from '../../img/good-nature-logo.png'

const Expprint = ({ inp }) => {
    useEffect(() => {
        inp?.amount && inWords(inp.amount)
    }, [inp])

    var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    const inWords = (num) => {

        if ((num = num.toString()).length > 9) return 'overflow';
        let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
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

    const print = () => {
        window.print();
    }

    return (
        <div className='expprint'>

            <div className="box">
                <div className="header">
                    <div className="logo">
                        {/* <img src={img} alt="" /> */}
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
                        <span className='ans vno'>{inp._id}</span>
                    </div>
                    <div className='set'>
                        <span>
                            <span className='quest'>Ledger</span>
                            <span className='ans lname'>{inp?.ledger?.ledger}   </span>
                            <span className='quest deb'>Debit</span>
                        </span>
                        <span>
                            <span className='quest qdat'>Date</span>
                            <span className='ans dat'>{inp.date}</span>
                        </span>
                    </div>
                </div>
                <div className="particular">
                    <div className="narr">
                        {inp.narration}
                    </div>
                    <div className="amount" onChange={() => inWords(inp.amount)}> {inp.amount}.00  </div>
                    <div className="word">Amount</div>
                </div>
                <div className="inttoword" id='textvalue'>twenty five rupess</div>
                <div className="sign">
                    <div><u>Approver By</u></div>
                    <div>
                        <span><u>Accountant</u></span>
                        {/* <img src={sig} alt="" /> */}
                    </div>
                    <div><u>Receiver Signature</u></div>
                </div>
            </div>
        </div>
    )
}

export default Expprint