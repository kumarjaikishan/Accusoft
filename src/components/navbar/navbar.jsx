import React, { useEffect, useState } from 'react'
import './navbar.css';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setnarrow } from '../../store/login';
import { IoMenu } from "react-icons/io5";
import { MdLightMode } from "react-icons/md";
import { MdBedtime } from "react-icons/md";

const Navbar = ({setIsDarkMode}) => {
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
      setIsDarkMode(true)
      setdarkmode(true)
      document.body.className = 'dark-theme';
    } else {
      setIsDarkMode(false)
      setdarkmode(false)
      document.body.className = 'light-theme';
    }
  }, [])

  const handle = (e) => {
    if (e.target.checked) {
      setdarkmode(true)
      setIsDarkMode(true)
      document.body.className = 'dark-theme';
      localStorage.setItem('mode', true)
    } else {
      document.body.className = 'light-theme';
      setdarkmode(false)
      setIsDarkMode(false)
      localStorage.setItem('mode', false)
    }
  }



  return (
    <>
      <nav className={log.narrow ? "nav narrow" : "nav"}>
        <div className="cont">
          <IoMenu onClick={fun} className='navicon' title='menu' />
          <span>{log.head} </span>
        </div>
        <span className='mode'>
          <input onChange={handle} id='checkbox' name='checkbox' checked={darkmode} type="checkbox" className="checkbox" />
          {darkmode == true ?
            <label htmlFor="checkbox"> <MdLightMode /> Light </label> :
            <label htmlFor="checkbox"> <MdBedtime /> Dark </label>}
        </span>

        {log.islogin ?
          <div className="info">
            <div className="userinfo">
              <div>{useralldetail?.user?.name} </div>
              {/* <div>{useralldetail?.user?.isadmin ? "Admin" : "User"}</div> */}
            </div>
            <NavLink to='/photo' > <div className="photo" ><img src={useralldetail.profilepic ? useralldetail.profilepic : defaultprofile} alt="Profile Pic" /> </div> </NavLink>
          </div> : null}
      </nav>
    </>
  )
}

export default Navbar;