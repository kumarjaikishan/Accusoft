import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, lazy, Suspense, useState } from 'react';
import Navbar from './components/navbar/navbar';
import Sidebar from './components/sidebar/sidebar';
import Preloader from './preloader';
// import Photo from './pages/photos3';
import Photo from './pages/photoCloudinary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { setnarrow } from '../src/store/login';
import { userdata } from './store/api';
import ProtectedRoutes from './utils/protectedRoute';
import AdminRoute from './utils/adminRoute';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { lightTheme, darkTheme } from './themes';
import { ThemeProvider } from '@mui/material/styles';

import Login from './pages/login/login';
import Logout from './pages/logout';


const VoucherDetail = lazy(() => import('./pages/ledgerDetail'));
const Filehandle = lazy(() => import('./pages/filehandle/filehandle'));
const Datanalysis = lazy(() => import('./pages/dataanalysis'));
const Report = lazy(() => import('./pages/Report'));
const Admin_Dashboard = lazy(() => import('./pages/admin/admin_Dashboard'));
const Alluser = lazy(() => import('./pages/admin/alluser'));
const Officeexp = lazy(() => import('./pages/voucher'));
const Addexp = lazy(() => import('./pages/addexp/addexp'));
import SlowPage from './pages/serverTest/slow';
import SlowWorkerPage from './pages/serverTest/workerSlow';
import TipSender from './pages/admin/streamelement';
import Test from './pages/test';
import { Errorpage } from './pages/Errorpage';
import PasswordReset from './pages/password/password';
import Home from './pages/home';

function App() {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const log = useSelector((state) => state.login);
  let location = useLocation();


  useEffect(() => {
    console.log(import.meta.env.VITE_API_ADDRESS);
    const token = localStorage.getItem("token");
    token && dispatch(userdata());
  }, []);

  useEffect(() => {
    log.islogin && jwtcheck();
  }, [log?.islogin]);

  // Autoclose sidebar when screen size is below 600px
  const sidebarclose = () => {
    const width = window.innerWidth;
    width < 600 ? dispatch(setnarrow(true)) : null;
  };
  const [isDarkMode, setIsDarkMode] = useState(false);

  const tokenErrors = {
    "jwt expired": ['Session Expired', 'Your session has expired. Please log in again.'],
    "Invalid Token": ['Invalid Token', 'You need to log in again.']
  }

  // const jwtcheck = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const responsee = await fetch(`${import.meta.env.VITE_API_ADDRESS}jwtcheck`, {
  //       method: 'GET',
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     // console.log(responsee)
  //     const data = await responsee.json();
  //     console.log("jwt check", data);

  //     if (tokenErrors[data.message]) {
  //       const title = tokenErrors[data.message][0];
  //       const text = tokenErrors[data.message][1];

  //       swal({
  //         title,
  //         text,
  //         icon: 'warning',
  //         button: {
  //           text: 'OK',
  //         },
  //       }).then(() => {
  //         return navigate('/logout');
  //       });
  //     }
  //   } catch (error) {
  //     console.log("Token check:", error);
  //   }
  // }

  const jwtcheck = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found, redirecting to logout...");
        return navigate("/logout");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_ADDRESS}jwtcheck`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let data = await response.json();
      if (!response.ok) {
        console.error("JWT check failed:", data?.message);
        return navigate("/logout");
      }

      // let data;
      // try {
      //   data = await response.json();
      // } catch (err) {
      //   console.error("Failed to parse JWT check response:", err);
      //   return navigate("/logout");
      // }

      console.log("jwt check", data);

      const errorConfig = tokenErrors?.[data?.message];
      if (errorConfig) {
        const [title, text] = errorConfig;
        swal({
          title,
          text,
          icon: "warning",
          button: { text: "OK" },
        }).then(() => navigate("/logout"));
      }
    } catch (error) {
      console.error("Token check error:", error);
      navigate("/logout");
    }
  };

  return (
    <>
      <ToastContainer closeOnClick={true} pauseOnFocusLoss={true} autoClose={2000} />
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <div className={log.loader ? 'App loader' : 'App'}>
          <Navbar setIsDarkMode={setIsDarkMode} />
          <main className={log.narrow ? "main narrow" : "main"} onClick={sidebarclose}>
            {log.loader && <Preloader />}
            <AnimatePresence mode='wait'>
              <Suspense fallback={<Preloader />}>
                <Routes key={location.pathname} location={location}>
                  <Route element={<ProtectedRoutes />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/addexpense" element={<Addexp />} />
                    <Route path="/photo" element={<Photo />} />
                    <Route path="/print/:expId" element={<Officeexp />} />
                    <Route path="/datanalysis/ledgerDetail/:id" element={<VoucherDetail />} />
                    <Route path="/datanalysis" element={<Datanalysis />} />
                    <Route path="/report" element={<Report />} />

                    {/* admin path */}
                    <Route
                      path="/admin"
                      element={<AdminRoute />}
                    >
                      <Route path="dashboard" element={<Admin_Dashboard />} />
                      <Route path="tip" element={<TipSender />} />
                      <Route path="users" element={<Alluser />} />
                      <Route path="filehandle" element={<Filehandle />} />
                    </Route>
                  </Route>

                  <Route path="/resetpassword/:token" element={<PasswordReset />} />
                  <Route path="/slow" element={<SlowPage />} />
                  <Route path="/slowworker" element={<SlowWorkerPage />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route path="/test" element={<Test />} />
                  <Route path="*" element={<Errorpage />} />

                  {log.islogin ? (
                    <Route path="/login" element={<Navigate to="/" />} />
                  ) : (
                    <Route path="/login" element={<Login />} />
                  )}
                </Routes>
              </Suspense>
            </AnimatePresence>
          </main>
          <footer className={log.narrow ? "footer narrow" : "footer"}>
            <p>&copy;{new Date().getFullYear()} Accusoft. All rights reserved. Designed and developed by Jai Kishan</p>
          </footer>
          <Sidebar />
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
