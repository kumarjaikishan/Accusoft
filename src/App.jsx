import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Sidebar from './components/sidebar/sidebar';
import Home from './pages/home';
import Preloader from './preloader';
import Addexp from './pages/addexp/addexp';
import { useEffect, lazy, Suspense } from 'react';
import Login from './pages/login/login';
import Logout from './pages/logout';
import Filehandle from './pages/filehandle/filehandle';
import Photo from './pages/photos3';
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

const Datanalysis = lazy(() => import('./pages/dataanalysis'));
const Report = lazy(() => import('./pages/Report'));
const Admin_Dashboard = lazy(() => import('./pages/admin/admin_Dashboard'));
const Alluser = lazy(() => import('./pages/admin/alluser'));

function App() {
  const dispatch = useDispatch();
  const log = useSelector((state) => state.login);
  let location = useLocation();
  console.log(import.meta.env.VITE_API_ADDRESS);

  useEffect(() => {
    const token = localStorage.getItem("token");
    token && dispatch(userdata());
  }, []);

  // Autoclose sidebar when screen size is below 600px
  const sidebarclose = () => {
    const width = window.innerWidth;
    width < 600 ? dispatch(setnarrow(true)) : null;
  };


  return (
    <>
      <ToastContainer closeOnClick={true} pauseOnFocusLoss={true} />
      <div className={log.loader ? 'App loader' : 'App'}>
        <Navbar />
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
          <p>&copy; 2024 Accusoft. All rights reserved. Designed and developed by Jai Kishan</p>
        </footer>
        <Sidebar />
      </div>
    </>
  );
}

export default App;
