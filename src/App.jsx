import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Preloader from './preloader';
import { useSelector, useDispatch } from 'react-redux';
import { setnarrow } from './store/login';
import ProtectedRoutes from './utils/protectedRoute';
import AdminRoute from './utils/adminRoute';
import { AnimatePresence } from 'framer-motion';
import { useUserApi } from './store/apicalls';

// 🚀 CORE LAZY LOADED ROUTE CHUNKS (Optimized so only visited pages load)
const LandingLayout = lazy(() => import('./pages/landingPage/Landing'));
const LandingBody = lazy(() => import('./pages/landingPage/LandingBody'));
const InnerLayout = lazy(() => import('./utils/innerLayout'));

// Authentication & Core User Pages
const Login = lazy(() => import('./pages/login/login'));
const Logout = lazy(() => import('./pages/logout'));
const PasswordReset = lazy(() => import('./pages/password/password'));
const Home = lazy(() => import('./pages/homePage/home'));
const Expense = lazy(() => import('./pages/Expense/Expense'));
const Datanalysis = lazy(() => import('./pages/dataAnalysis/dataanalysis'));
const VoucherDetail = lazy(() => import('./pages/dataAnalysis/ledgerDetail'));
const Report = lazy(() => import('./pages/Report/Report'));
const Photo = lazy(() => import('./pages/photoCloudinary'));
const Officeexp = lazy(() => import('./pages/voucher'));

// Compliance & Informational Pages
const Terms = lazy(() => import('./pages/others/Terms'));
const Privacy = lazy(() => import('./pages/others/Policy'));
const Contact = lazy(() => import('./pages/others/Contact'));
const About = lazy(() => import('./pages/others/About'));
const Errorpage = lazy(() => import('./pages/Errorpage').then(m => ({ default: m.Errorpage })));
const Test = lazy(() => import('./pages/test'));

// 🛡️ ADMIN ONLY PAGES (Zero initial bundle cost for normal users)
const Admin_Dashboard = lazy(() => import('./pages/admin/admin_Dashboard'));
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts'));
const Logger = lazy(() => import('./pages/admin/logger'));
const TipSender = lazy(() => import('./pages/admin/streamelement'));
const Filehandle = lazy(() => import('./pages/filehandle/filehandle'));
const SlowPage = lazy(() => import('./pages/serverTest/slow'));
const SlowWorkerPage = lazy(() => import('./pages/serverTest/workerSlow'));

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const log = useSelector((state) => state.login);
  const mode = useSelector((state) => state.theme.mode);
  const mainColor = useSelector((state) => state.theme.mainColor);

  // Apply mode and mainColor globally
  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    if (mainColor) {
      document.documentElement.style.setProperty("--maincolor", mainColor);
    }
  }, [mode, mainColor]);

  const { userdatacall } = useUserApi();

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.search]);

  // Fetch user profile if active session token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      userdatacall();
    }
  }, []);

  // Auto close sidebar on mobile/tablet
  const sidebarclose = () => {
    if (window.innerWidth < 1024) {
      dispatch(setnarrow(true));
    }
  };

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<Preloader />}>
        <Routes location={location} key={location.pathname}>

          {/* 🔐 AUTHENTICATED USER ROUTES */}
          <Route element={<InnerLayout sidebarclose={sidebarclose} />}>
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/expense" element={<Expense />} />
              <Route path="/photo" element={<Photo />} />
              <Route path="/voucher" element={<Officeexp />} />
              <Route path="/data_analysis/ledgerDetail/:id" element={<VoucherDetail />} />
              <Route path="/data_analysis" element={<Datanalysis />} />
              <Route path="/report" element={<Report />} />

              {/* 🛡️ ADMIN ONLY ROUTES (Isolated lazy chunk) */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<Admin_Dashboard />} />
                <Route path="dashboard" element={<Admin_Dashboard />} />
                <Route path="contacts" element={<AdminContacts />} />
                <Route path="logs" element={<Logger />} />
                <Route path="tip" element={<TipSender />} />
                <Route path="filehandle" element={<Filehandle />} />
                <Route path="slow" element={<SlowPage />} />
                <Route path="slowworker" element={<SlowWorkerPage />} />
              </Route>
            </Route>
          </Route>

          {/* 🌐 PUBLIC / MARKETING / COMPLIANCE ROUTES */}
          <Route path="/setpassword/:token" element={<PasswordReset />} />
          <Route path="/resetpassword/:token" element={<PasswordReset />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/login" element={log.islogin ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/test" element={<Test />} />
          <Route path="*" element={<Errorpage />} />

          <Route element={<LandingLayout />}>
            <Route path="/" element={<LandingBody />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default App;
