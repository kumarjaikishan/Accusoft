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
      try {
        await request({
          url: 'logout',
          method: 'POST',
        });
      } catch (error) {
        // Suppress frontend notification for expected token timeout overlaps
      } finally {
        localStorage.removeItem("token");
        document.title = "AccuSoft";
        dispatch(userlogout());
        dispatch(setlogin(false));
        navigate('/login', { replace: true });
      }
    }
    performLogout();
  }, []);
}

export default Logout;