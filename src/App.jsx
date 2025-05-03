import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Sidebar from './components/sidebar/sidebar';
import Home from './pages/home';
import Preloader from './preloader';
import Addexp from './pages/addexp/addexp1';
import { useEffect, lazy, Suspense, useState } from 'react';
import Login from './pages/login/login';
import Logout from './pages/logout';
import Filehandle from './pages/filehandle/filehandle';
// import Photo from './pages/photos3';
import Photo from './pages/photoCloudinary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { setnarrow } from '../src/store/login';
import Officeexp from './pages/voucher';
import Test from './pages/test';
import { userdata } from './store/api';
import { Errorpage } from './pages/Errorpage';
import PasswordReset from './pages/password/password';
import ProtectedRoutes from './utils/protectedRoute';
import AdminRoute from './utils/adminRoute';
import SlowPage from './pages/serverTest/slow';
import SlowWorkerPage from './pages/serverTest/workerSlow';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { lightTheme, darkTheme } from './themes';
import { ThemeProvider } from '@mui/material/styles';

const Datanalysis = lazy(() => import('./pages/dataanalysis'));
const Report = lazy(() => import('./pages/Report'));
const Admin_Dashboard = lazy(() => import('./pages/admin/admin_Dashboard'));
const Alluser = lazy(() => import('./pages/admin/alluser'));

function App() {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const log = useSelector((state) => state.login);
  let location = useLocation();
  console.log(import.meta.env.VITE_API_ADDRESS);

  useEffect(() => {
    const token = localStorage.getItem("token");
    token && dispatch(userdata());
  }, []);

  useEffect(() => {
    log.islogin && jwtcheck();
  }, [log.islogin]);

  // Autoclose sidebar when screen size is below 600px
  const sidebarclose = () => {
    const width = window.innerWidth;
    width < 600 ? dispatch(setnarrow(true)) : null;
  };
  const [isDarkMode, setIsDarkMode] = useState(false);

  const jwtcheck = async () => {
    try {
      const token = localStorage.getItem('token');
      const responsee = await fetch(`${import.meta.env.VITE_API_ADDRESS}jwtcheck`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(responsee)
      const data = await responsee.json();
      console.log("jwt check", data);

      if (data.message === 'jwt expired') {
        swal({
          title: 'Session Expired',
          text: 'Your session has expired. Please log in again.',
          icon: 'warning',
          button: {
            text: 'OK',
          },
        }).then(() => {
          return navigate('/logout');
        });
      }
      if (data.message === 'Invalid Token') {
        swal({
          title: 'Invalid Token',
          text: 'You need to log in again.',
          icon: 'warning',
          button: {
            text: 'OK',
          },
        }).then(() => {
          return navigate('/logout');
        });
      }
    } catch (error) {
      console.log("Token check:", error);
    }
  }

  return (
    <>
      <ToastContainer closeOnClick={true} pauseOnFocusLoss={true} />
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <div className={log.loader ? 'App loader' : 'App'}>
          <Navbar setIsDarkMode={setIsDarkMode} />
          <main className={log.narrow ? "main narrow" : "main"} onClick={sidebarclose}>
            {log.loader && <Preloader />}
            <AnimatePresence mode='wait'>
              <Routes key={location.pathname} location={location}>
                <Route element={<ProtectedRoutes />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/addexpense" element={<Addexp />} />
                  <Route path="/photo" element={<Photo />} />
                  <Route path="/print/:expId" element={<Officeexp />} />

                  {/* Lazy loaded routes inside Suspense with proper structure */}
                  <Route
                    path="/datanalysis"
                    element={
                      <Suspense fallback={<Preloader />}>
                        <Datanalysis />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/report"
                    element={
                      <Suspense fallback={<Preloader />}>
                        <Report />
                      </Suspense>
                    } />
                </Route>

                <Route
                  path="/admin"
                  element={
                    <Suspense fallback={<Preloader />}>
                      <AdminRoute />
                    </Suspense>
                  }
                >
                  <Route path="dashboard" element={<Admin_Dashboard />} />
                  <Route path="users" element={<Alluser />} />
                  <Route path="filehandle" element={<Filehandle />} />
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
