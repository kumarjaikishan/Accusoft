import React from 'react'
import './explist.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';


const Explist = ({ exp, setisupdate, print, setinp, settoogle }) => {
  const edite = (val) => {
    setisupdate(true);
    settoogle(false)
    setinp({
      id: val._id,
      voucher: val.voucher,
      ledger: val.ledger,
      date: val.date,
      narration: val.narration,
      amount: val.amount
    })
  }
  const see = (val) => {
    setinp({
      voucher: val.voucher,
      ledger: val.ledger,
      date: val.date,
      narration: val.narration,
      amount: val.amount
    })
    // print();
  }
  return (
    <>
      <div className="list">
        <table>
          <thead>
            <tr>
              <th>Voucher No.</th>
              <th>Ledger</th>
              <th>Amount</th>
              <th>Narration</th>
              <th>date</th>
              <th>Edit</th>
              <th>Print</th>
            </tr>
          </thead>
          <tbody>
            {exp.map((val, ind) => {
              return <tr key={ind}>
                <td>{val.voucher}</td>
                <td>{val.ledger}</td>
                <td>{val.amount}</td>
                <td>{val.narration}</td>
                <td>{val.date}</td>
                <td onClick={() => edite(val)}><RemoveRedEyeIcon /></td>
                <td onClick={() => see(val)}><RemoveRedEyeIcon /></td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Explist