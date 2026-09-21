import React, { useEffect, useState } from 'react'
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
        <div className='w-full h-full flex items-center flex-col'>

            <div className="w-[80%] print:w-[98%] h-[420px] mt-[20px] relative border-[2px] border-black">
                <div className="relative w-full h-[90px] flex justify-between border-b border-black before:absolute before:top-[2px] before:left-0 before:w-full before:h-full before:border-b before:border-black">
                    <div className="px-[8px] flex flex-col justify-center items-center h-full">
                        {/* <img className="w-[130px]" src={img} alt="" /> */}
                        <span className="text-[10px]">"हमारा सपना सबका हो घर अपना "</span>
                    </div>
                    <div className="flex flex-col items-center w-[70%] justify-between px-[10px] py-[5px]">
                        <h1>Good Nature Projects Pvt Ltd.</h1>
                        <h6 className="text-[8px]">1st floor, Vimla Market-3, Nala Road, Patel Nagar, Biharsharif, Nalanda, Bihar-803101</h6>
                        <h5 className="text-[10px]">http://www.goodnatureprojects.com, e-mail-ops@goodnatureprojects.com</h5>
                    </div>
                </div>
                <div className="relative w-full h-[110px] flex flex-col border-b border-black">
                    <h3 className="text-center"><u>Payment Voucher</u></h3>
                    <div>
                        <span className='inline-block bg-gray-500 text-black w-[110px] font-semibold py-[2px] pl-[5px]'>Voucher No.</span>
                        <span className='bg-[#302b2b] inline-block text-center text-white py-[2px] border border-white w-[260.5px]'>{inp._id}</span>
                    </div>
                    <div className='flex justify-between p-0'>
                        <span>
                            <span className='inline-block bg-gray-500 text-black w-[110px] font-semibold py-[2px] pl-[5px]'>Ledger</span>
                            <span className='bg-[#302b2b] inline-block text-center text-white py-[2px] border border-white w-[200px]'>{inp?.ledger?.ledger}   </span>
                            <span className='inline-block bg-gray-500 w-[110px] font-semibold py-[2px] pl-[5px] max-w-[60px] text-white print:max-w-[53px]'>Debit</span>
                        </span>
                        <span>
                            <span className='inline-block bg-gray-500 w-[110px] font-semibold py-[2px] pl-[5px] max-w-[50px] text-white'>Date</span>
                            <span className='bg-[#302b2b] inline-block text-center text-white py-[2px] border border-white w-[145px]'>{inp.date}</span>
                        </span>
                    </div>
                </div>
                <div className="relative w-full h-[100px] flex items-center pl-[5px] justify-between">
                    <div className="w-[calc(100%-132px)]">
                        {inp.narration}
                    </div>
                    <div className="w-[130px] font-bold leading-[100px] text-center border-l border-black" onChange={() => inWords(inp.amount)}> {inp.amount}.00  </div>
                    <div className="absolute top-[-12px] -translate-y-1/2 right-[25px] text-[1.2em] font-semibold">Amount</div>
                </div>
                <div className="h-[25px] text-right pr-[20px] border-b border-t border-black font-semibold capitalize" id='textvalue'>twenty five rupess</div>
                <div className="relative w-full h-[90px] py-[5px] px-[20px] flex justify-between">
                    <div><u>Approver By</u></div>
                    <div className="flex flex-col items-center">
                        <span><u>Accountant</u></span>
                        {/* <img className="w-[200px]" src={sig} alt="" /> */}
                    </div>
                    <div><u>Receiver Signature</u></div>
                </div>
            </div>
        </div>
    )
}

export default Expprint