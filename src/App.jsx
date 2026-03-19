import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Preloader from './preloader';
import Photo from './pages/photoCloudinary';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { setnarrow } from '../src/store/login';
import ProtectedRoutes from './utils/protectedRoute';
import AdminRoute from './utils/adminRoute';
import { AnimatePresence } from 'framer-motion';
import { lightTheme, darkTheme } from './themes';
import { ThemeProvider } from '@mui/material/styles';

import Login from './pages/login/login';
import Logout from './pages/logout';
import SlowPage from './pages/serverTest/slow';
import SlowWorkerPage from './pages/serverTest/workerSlow';
import TipSender from './pages/admin/streamelement';
import Test from './pages/test';
import { Errorpage } from './pages/Errorpage';
import PasswordReset from './pages/password/password';
import Home from './pages/homePage/home';
import { useUserApi } from './store/apicalls';

import Terms from './pages/others/Terms';
import Privacy from './pages/others/Policy';
import LandingLayout from './pages/landingPage/Landing';
import LandingBody from './pages/landingPage/LandingBody';
import InnerLayout from './utils/innerLayout';

const VoucherDetail = lazy(() => import('./pages/dataAnalysis/ledgerDetail'));
const Filehandle = lazy(() => import('./pages/filehandle/filehandle'));
const Datanalysis = lazy(() => import('./pages/dataAnalysis/dataanalysis'));
const Report = lazy(() => import('./pages/Report/Report'));
const Admin_Dashboard = lazy(() => import('./pages/admin/admin_Dashboard'));
const Logger = lazy(() => import('./pages/admin/logger'));
const Officeexp = lazy(() => import('./pages/voucher'));
const Addexp = lazy(() => import('./pages/addexp/addexp'));

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const log = useSelector((state) => state.login);
  const mode = useSelector((state) => state.theme.mode);

  // applying mode globally
  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  const { userdatacall } = useUserApi();

  // ✅ Layout detection
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.search]);

  // ✅ Fetch user if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      userdatacall();
    }
  }, []);

  // ✅ Auto close sidebar on mobile/tablet
  const sidebarclose = () => {
    if (window.innerWidth < 1024) {
      dispatch(setnarrow(true));
    }
  };

  return (
    <ThemeProvider theme={mode === "dark" ? darkTheme : lightTheme}>
      <AnimatePresence mode="wait">
        <Suspense fallback={<Preloader />}>
          <Routes location={location} key={location.pathname}>

            {/* 🔐 PROTECTED ROUTES */}
            <Route element={<InnerLayout log={log} sidebarclose={sidebarclose} />}>
              <Route element={<ProtectedRoutes />}>

                <Route path="/dashboard" element={<Home />} />
                <Route path="/expense" element={<Addexp />} />
                <Route path="/photo" element={<Photo />} />
                <Route path="/print/:expId" element={<Officeexp />} />
                <Route path="/data_analysis/ledgerDetail/:id" element={<VoucherDetail />} />
                <Route path="/data_analysis" element={<Datanalysis />} />
                <Route path="/report" element={<Report />} />

                {/* 🔐 ADMIN */}
                <Route path="/admin" element={<AdminRoute />}>
                  <Route path="dashboard" element={<Admin_Dashboard />} />
                  <Route path="logs" element={<Logger />} />
                  <Route path="tip" element={<TipSender />} />
                  <Route path="filehandle" element={<Filehandle />} />
                  <Route path="slow" element={<SlowPage />} />
                  <Route path="slowworker" element={<SlowWorkerPage />} />
                </Route>

              </Route>
            </Route>

            {/* PUBLIC ROUTES */}
            <Route path="/resetpassword/:token" element={<PasswordReset />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/login" element={log.islogin ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/test" element={<Test />} />
            <Route path="*" element={<Errorpage />} />

            <Route element={<LandingLayout />}>
              <Route path="/" element={<LandingBody />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
            </Route>
          </Routes>
        </Suspense>
      </AnimatePresence>
    </ThemeProvider>
  );
}

export default App;
