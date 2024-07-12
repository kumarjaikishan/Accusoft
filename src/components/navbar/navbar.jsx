import React, { useEffect, useState } from 'react'
import './navbar.css';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setnarrow } from '../../store/login';
import LightModeIcon from '@mui/icons-material/LightMode';
import BedtimeIcon from '@mui/icons-material/Bedtime';

const Navbar = () => {
  const dispatch = useDispatch();
  const [darkmode, setdarkmode] = useState(true)
  const log = useSelector((state) => state.login);
  const useralldetail = useSelector((state) => state.userexplist);
  const defaultprofile = "https://res.cloudinary.com/dusxlxlvm/image/upload/v1699090690/just_yoljye.png"
  const fun = () => {
    if (log.narrow) {
      dispatch(setnarrow(false))
    } else {
      dispatch(setnarrow(true))
    }
  }
  useEffect(() => {
    let modee = localStorage.getItem('mode');
    if (modee == 'true') {
      setdarkmode(true)
      document.body.className = 'dark-theme';
    } else {
      setdarkmode(false)
      document.body.className = 'light-theme';
    }
  }, [])

  const handle = (e) => {
    if (e.target.checked) {
      setdarkmode(true)
      document.body.className = 'dark-theme';
      localStorage.setItem('mode', true)
    } else {
      document.body.className = 'light-theme';
      setdarkmode(false)
      localStorage.setItem('mode', false)
    }
  }

  return (
    <>
      <nav className={log.narrow ? "nav narrow" : "nav"}>
        <div className="cont">
          <span onClick={fun}><MenuIcon /></span>
          <span>{log.head} </span>
        </div>
        <span className='mode'>
          <input onChange={handle} id='checkbox' name='checkbox' checked={darkmode} type="checkbox" className="checkbox" />
          {darkmode == true ?
            <label htmlFor="checkbox"> <LightModeIcon /> Light </label> :
            <label htmlFor="checkbox"> <BedtimeIcon /> Dark </label>}
        </span>

        {log.islogin ? <div className="info">
          <NavLink to='/photo' > <div className="photo" ><img src={useralldetail.profilepic ? useralldetail.profilepic : defaultprofile} alt="Profile Pic" /> </div> </NavLink>
          <div className="userinfo">
            <span>{useralldetail?.user.name}</span>
            <span>{useralldetail.user.isadmin ? "Admin" : "User"}</span>
          </div>
        </div> : null}
      </nav>
    </>
  )
}

export default Navbar;