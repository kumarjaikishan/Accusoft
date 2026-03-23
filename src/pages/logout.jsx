import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setlogin } from '../store/login';
import { userlogout } from '../store/api';
import { useApi } from '../utils/useApi';

const Logout = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const { request, loading } = useApi();

  useEffect(() => {
    async function performLogout() {
      // 1. Clear local state IMMEDIATELY for responsiveness
      localStorage.removeItem("token");
      document.title = "AccuSoft";
      dispatch(userlogout());
      dispatch(setlogin(false));

      // 2. Immediate navigation to login
      navigate('/login', { replace: true });

      // 3. Fire-and-forget backend logout call in the background
      try {
        await request({
          url: 'logout',
          method: 'POST',
        });
      } catch (error) {
        // Suppress errors as session is already cleared locally
      }
    }
    performLogout();
  }, [dispatch, navigate, request]);
}

export default Logout;