import React from 'react'
import './navbar.css';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { setnarrow } from '../../store/login';

const Navbar = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
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
 
  return (
    <>
      <div className={log.narrow ? "nav narrow" : "nav"}>
        <div className="cont">
          <span onClick={fun}><MenuIcon /></span>
          <span>{log.head} </span>
        </div>
        {token ? <div className="info">
        <NavLink to='/photo' > <div className="photo" ><img src={ useralldetail.profilepic ? useralldetail.profilepic : defaultprofile} alt="Profile Pic" /> </div> </NavLink>
          <div className="userinfo">
            <span>{useralldetail.user && useralldetail.user.name } </span>
            <span>{useralldetail.user.isadmin ? "Admin":"Normal"}</span>
          </div>
        </div> : null}
      </div>
    </>
  )
}

export default Navbar;