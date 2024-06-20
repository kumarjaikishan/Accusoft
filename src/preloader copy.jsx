import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import preloaderData from './assets/wallet.json';
import whitepreloaderData from './assets/walletwhite.json';
// import whitepreloaderData from './assets/walletwhite.lottie';

const Preloader = () => {
  const [pre,setpre]= useState('')
  useEffect(() => {
    let modee = localStorage.getItem('mode');
    if (modee=='true') {
      setpre(whitepreloaderData)
    }else{
      setpre(preloaderData)
    }
  }, [])

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: pre,
  };

  return (
    <div className='preloder'>
      <Lottie options={defaultOptions} height={250} width={250} />
    </div>
  );
};

export default Preloader;
