import { toast } from "react-toastify";

const apiWrapper2 = async ({
  url,
  method = "GET",
  body = null,
  dispatch,
  successAction,
  notsuccessAction,
  loaderAction,
  navigate
}) => {
  try {
    dispatch?.(loaderAction(true));

    let token = localStorage.getItem("accessToken");

    const makeRequest = async () =>
      fetch(url, {
        method,
        credentials: "include", // IMPORTANT
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: body ? JSON.stringify(body) : null
      });

    let response = await makeRequest();
    let responseData = await response.json();

    // 🔥 Access token expired
    if (response.status === 401) {

      const refresh = await fetch(
        `${import.meta.env.VITE_API_ADDRESS}refresh-token`,
        {
          method: "POST",
          credentials: "include"
        }
      );

      if (!refresh.ok) {
        toast.warn("Session expired");
        navigate("/logout");
        return;
      }

      const refreshData = await refresh.json();

      token = refreshData.accessToken;
      localStorage.setItem("accessToken", token);

      // retry original API
      response = await makeRequest();
      responseData = await response.json();
    }

    if (!response.ok) {
      notsuccessAction?.(responseData);
      return;
    }

    return successAction?.(responseData);

  } catch (error) {
    console.error("ApiWrapper Error:", error);
    toast.error(error.message || "Something went wrong");

  } finally {
    dispatch?.(loaderAction(false));
  }
};

export default apiWrapper2;
