import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';

const Preloader = () => {
  const [pre, setpre] = useState('');
  const url = 'https://res.cloudinary.com/dusxlxlvm/raw/upload/v1718885399/accusoft/assets/preloader/wallet_iuwpoz.json'
  const whiteurl = 'https://res.cloudinary.com/dusxlxlvm/raw/upload/v1718885399/accusoft/assets/preloader/walletwhite_wcfo1j.json'
  useEffect(() => {
    let modee = localStorage.getItem('mode');
    if (modee == 'true') {
      fetch(whiteurl)
        .then(response => response.json())
        .then(data => setpre(data))
        .catch(error => console.error('Error fetching animation:', error));
    } else {
      fetch(url)
        .then(response => response.json())
        .then(data => setpre(data))
        .catch(error => console.error('Error fetching animation:', error));
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
