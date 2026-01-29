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

  async function logout() {
    try {
      const res = await request({
        url: 'logout',
        method: 'POST',
      });
    } catch (error) {

    }
  }

  useEffect(() => {
    localStorage.clear("token");
    document.title = "AccuSoft";
    dispatch(userlogout());
    dispatch(setlogin(false));
    navigate('/login');
    logout()
  }, [])
}

export default Logout