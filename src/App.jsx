import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import loadere from '../src/img/loader.png'
import Sidebar from './components/sidebar/sidebar';
import Home from './pages/home2';
import Addexp from './pages/addexp/addexp';
import Datanalysis from './pages/dataanalysis';
import { useState,useEffect} from 'react';
import Login from './pages/login/login';
import Logout from './pages/logout';
import Report from './pages/Report';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Photo from './pages/photo';
import Admin from './pages/Admin';
import { useSelector, useDispatch } from 'react-redux';
import { setnarrow } from '../src/store/login';
import Officeexp from './pages/officeexp';
import Test from './pages/test';
import { userdata } from './store/api'

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    token &&  dispatch(userdata());
  }, [])

  const log = useSelector((state) => state.login);

  // autocolse sidebar when screensize below 600px
  const sidebarclose = () => {
    const width = window.innerWidth;
    // console.log(width)
    width < 600 ? dispatch(setnarrow(true)) : null;
  }


  return (
    <>
      <ToastContainer closeOnClick={true} pauseOnFocusLoss={true} />
      <div className="App" >
        <Navbar />
        <div className={log.narrow ? "main narrow" : "main"} onClick={sidebarclose}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/addexpense" element={<Addexp />} />
            <Route path="/datanalysis" element={<Datanalysis />} />
            <Route path="/report" element={<Report />} />
            <Route path="/photo" element={<Photo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/print" element={<Officeexp />} />
            <Route path="/test" element={<Test />} />
            {/* <Route path="/test" element={<Test />} /> */}
          </Routes>
          <div style={{ display: log.loader ? "flex" : "none" }} className="loader"><img src={loadere} alt="" /></div>
        </div>
        <Sidebar />
      </div>
    </>
  );
}

export default App;
