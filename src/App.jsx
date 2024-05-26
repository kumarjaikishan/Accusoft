import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Sidebar from './components/sidebar/sidebar';
import Home from './pages/home';
import Preloader from './preloader';
import Addexp from './pages/addexp/addexp';
import Datanalysis from './pages/dataanalysis';
import { useEffect } from 'react';
import Login from './pages/login/login';
import Logout from './pages/logout';
import Report from './pages/Report';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Photo from './pages/photo';
import { useSelector, useDispatch } from 'react-redux';
import { setnarrow } from '../src/store/login';
import Officeexp from './pages/officeexp';
import Test from './pages/test';
import { userdata } from './store/api'
import { Errorpage } from './pages/Errorpage';
import Allexpense from './pages/admin/Allexpenses';
import Alluser from './pages/admin/alluser';
import PasswordReset from './pages/password/password';
import Admin_Dashboard from './pages/admin/admin_Dashboard';
import ProtectedRoutes from './utils/protectedRoute';
import AdminRoute from './utils/adminRoute';
import SlowPage from './pages/serverTest/slow';
import SlowWorkerPage from './pages/serverTest/workerSlow';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    token && dispatch(userdata());
  }, [])

  const log = useSelector((state) => state.login);

  // autocolse sidebar when screensize below 600px
  const sidebarclose = () => {
    const width = window.innerWidth;
    width < 600 ? dispatch(setnarrow(true)) : null;
  }


  return (
    <>
      <ToastContainer closeOnClick={true} pauseOnFocusLoss={true} />
      <div className={log.loader ? 'App loader' : 'App'} >
        <Navbar />
        <div className={log.narrow ? "main narrow" : "main"} onClick={sidebarclose}>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<Home />} />
              <Route path="/addexpense" element={<Addexp />} />
              <Route path="/datanalysis" element={<Datanalysis />} />
              <Route path="/report" element={<Report />} />
              <Route path="/photo" element={<Photo />} />
              <Route path="/resetpassword/:token" element={<PasswordReset />} />
              <Route path="/print" element={<Officeexp />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin" >
                <Route path="dashboard" element={<Admin_Dashboard />} />
                <Route path="users" element={<Alluser />} />
                <Route path="expense" element={<Allexpense />} />
              </Route>
            </Route>


            <Route path="/slow" element={<SlowPage />} />
            <Route path="/slowworker" element={<SlowWorkerPage />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/test" element={<Test />} />
            <Route path="*" element={<Errorpage />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          {/* <div style={{ display: log.loader ? "flex" : "none" }} className="loader"><img src={loadere} alt="" /></div> */}
          {log.loader && <Preloader />}
          <footer></footer>
        </div>
        <Sidebar />
      </div>
    </>
  );
}

export default App;
