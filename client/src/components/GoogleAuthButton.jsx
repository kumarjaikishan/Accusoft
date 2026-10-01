import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setlogin } from "../store/login";
import { useUserApi } from "../store/apicalls";
import { useApi } from "../utils/useApi";
import { toast } from "../utils/toast";

const GOOGLE_CLIENT_ID = 
  import.meta.env.VITE_GOOGLE_CLIENT_ID || 
  import.meta.env.VITE_API_GOOGLE_CLIENTID || 
  "536083845357-ig5oric84aiqa1m37de0quvktj3v3lv2.apps.googleusercontent.com";

const GoogleAuthButton = ({ text = "Continue with Google" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userdatacall } = useUserApi();
  const { request } = useApi();
  const googleBtnRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Handle the credential JWT response returned by Google
  const handleCredentialResponse = async (response) => {
    if (!response?.credential) {
      return toast.error("Google authentication failed. No token received.");
    }

    try {
      setLoading(true);
      const res = await request({
        url: "auth/google",
        method: "POST",
        body: { credential: response.credential }
      });
      setLoading(false);

      if (res?.token) {
        localStorage.setItem("token", res.token);
        toast.success(res?.message || "Signed in with Google successfully!", { autoClose: 1500 });
        userdatacall();
        navigate("/dashboard");
        dispatch(setlogin(true));
      }
    } catch (err) {
      setLoading(false);
      console.error("[GoogleAuthButton Error]:", err);
    }
  };

  useEffect(() => {
    const initializeGoogleGSI = () => {
      if (window.google?.accounts?.id && googleBtnRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          // Render Google's official brand popup button
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: "outline",
            size: "large",
            type: "standard",
            shape: "rectangular",
            text: "continue_with",
            logo_alignment: "left",
            width: googleBtnRef.current.offsetWidth || 340,
          });
        } catch (e) {
          console.warn("Google GSI initialization error:", e);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initializeGoogleGSI();
    } else {
      const timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(timer);
          initializeGoogleGSI();
        }
      }, 200);
      return () => clearInterval(timer);
    }
  }, []);

  // Custom click fallback that triggers Google's native popup
  const handleCustomClick = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      toast.info("Connecting to Google Services...", { autoClose: 2000 });
    }
  };

  return (
    <div className="w-full relative">
      {/* Hidden container where Google SDK renders the secure button */}
      <div 
        ref={googleBtnRef} 
        className="w-full flex justify-center overflow-hidden rounded-xl"
        style={{ minHeight: "40px" }}
      />

      {loading && (
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs flex items-center justify-center rounded-xl z-20">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default GoogleAuthButton;
