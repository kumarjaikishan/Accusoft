import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import './test.css';

const Test = () => {
  const [data, setdata] = useState([])
  useEffect(() => {
    // console.log(mappedLedgerData);
    setdata(mappedLedgerData);
  }, [])
  const expense = [
    {
      "_id": "653ca23682105a8a92bd3763",
      "userid": "657816fec52ee666fbea49b4",
      "ledger": "ration",
      "date": "2022-08-02",
      "amount": "114",
      "narration": "Rajma-64, Badam-30 & Shampoo-20"
    },
    {
      "_id": "653ca23682105a8a92bd3755",
      "userid": "63aa962f68dc4f69b0f23e5e",
      "ledger": "other",
      "date": "2022-08-19",
      "amount": "200",
      "narration": "To Anshu On Birthday"
    },
    {
      "_id": "653ca23682105a8a92bd376d",
      "userid": "63aa962f68dc4f69b0f23e5e",
      "ledger": "other",
      "date": "2022-08-05",
      "amount": "2200",
      "narration": "Cash Paid To Bibha"
    },
    {
      "_id": "653ca23682105a8a92bd376e",
      "userid": "657816fec52ee666fbea49b4",
      "ledger": "general",
      "date": "2022-08-29",
      "amount": "60",
      "narration": "For Sweets For Babies"
    },
    {
      "_id": "653ca23682105a8a92bd376f",
      "userid": "63aa962f68dc4f69b0f23e5e",
      "ledger": "other",
      "date": "2022-08-30",
      "amount": "230",
      "narration": "To Bibha For Expenses"
    },
    {
      "_id": "653ca23682105a8a92bd377f",
      "userid": "657816fec52ee666fbea49b4",
      "ledger": "refreshment",
      "date": "2022-09-11",
      "amount": "10",
      "narration": "Candies For Rajrappa Tour"
    },
    {
      "_id": "653ca23682105a8a92bd378a",
      "userid": "63aa962f68dc4f69b0f23e5e",
      "ledger": "other",
      "date": "2022-09-14",
      "amount": "400",
      "narration": "To Bibha For Expenses"
    },
    {
      "_id": "653ca23682105a8a92bd3792",
      "userid": "657816fec52ee666fbea49b4",
      "ledger": "other",
      "date": "2022-09-18",
      "amount": "60",
      "narration": "For 5 Piece Cheena For Babies"
    },
    {
      "_id": "653ca23682105a8a92bd37a1",
      "userid": "63aa962f68dc4f69b0f23e5e",
      "ledger": "other",
      "date": "2022-09-23",
      "amount": "449",
      "narration": "Pexpo 1000ml Flask For Mummy"
    },
    {
      "_id": "653ca23682105a8a92bd37b3",
      "userid": "657816fec52ee666fbea49b4",
      "ledger": "other",
      "date": "2022-10-11",
      "amount": "50",
      "narration": "Tempered Glass"
    },
    {
      "_id": "653ca23682105a8a92bd37c9",
      "userid": "63aa962f68dc4f69b0f23e5e",
      "ledger": "general",
      "date": "2022-10-21",
      "amount": "1152",
      "narration": "For Gas Cylinder Refill"
    },
    {
      "_id": "653ca23682105a8a92bd37cc",
      "userid": "657816fec52ee666fbea49b4",
      "ledger": "other",
      "date": "2022-10-22",
      "amount": "965",
      "narration": "Diwali Expense"
    },
    {
      "_id": "653ca23682105a8a92bd37d8",
      "userid": "63aa962f68dc4f69b0f23e5e",
      "ledger": "apparel",
      "date": "2022-11-01",
      "amount": "110",
      "narration": "Shoe-50, Mouja-40, Carry Bag-20"
    }
  ];

  const user = [
    {
      "_id": "63aa962f68dc4f69b0f23e5e",
      "name": "jai kishan",
      "email": "kumar.jaikishan0@gmail.com",
      "phone": 8210539367,
      "password": "Jai@4880",
      "date": "2022-12-27",
      "ledger": [],
      "__v": 0,
      "imgsrc": "http://res.cloudinary.com/dusxlxlvm/image/upload/v1702032985/efrpdooaa…",
      "isadmin": true
    },
    {
      "_id": "657816fec52ee666fbea49b4",
      "name": "test",
      "email": "test@gmail.com",
      "phone": 7484514585,
      "password": "$2b$10$7g7Q//Ze.sDEhIoq9pI6gOQdmMiDwkuBevT.leHfW7WC.LDA5/i5i",
      "date": "2022-12-17",
      "imgsrc": "http://res.cloudinary.com/dusxlxlvm/image/upload/v1703310589/v8y7wroew…",
      "ledger": [],
      "__v": 0,
      "isadmin": true
    }
  ]
  const userIdToNameMap = user.reduce((acc, user) => {
    // console.log("calling",user.name);
    acc[user._id] = user.name;
    console.log(acc);
    return acc;
  }, {});

  const mappedLedgerData = expense.map(entry => ({
    ...entry,
    username: userIdToNameMap[entry.userid], // Add the username property
  }));
  const hen = () => {
    // console.log(data);
  }
  return (
    <div className='test'>
      {
        data.map((val, ind) => {
          return (
            <div>
              <span>{val.username}</span>
              <span>{val.amount}</span>
              <span>{val.date}</span>
              <span>{val.ledger}</span>
            </div>
          )
        })
      }
    </div>
  );
};

export default Test;
