// utils/useApi.js

import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { apiClient } from "./apiClient";

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const request = async (config) => {
        try {
            setLoading(true);
            setError(null);

            const result = await apiClient(config);
            // console.log("result useapi",result)

            setData(result);
            return result;

        } catch (err) {
            setError(err.message);
            if (err.isApiError) {
                toast.warn(err.message, { autoClose: 2500 });
            } else if (err.message == 'Token Refresh failed') {
                toast.warn("Session Expired");
            } else {
                toast.error(err.message || "Unexpected error occurred");
            }

            // console.log("apiUse error:", err.message);
            // console.log("apiUse error status:", err.status);

            if (err.status == 403) {
                setTimeout(() => {
                    navigate("/logout");
                }, 500);
            }
            if (err.message == 'Token Refresh failed') {
                setTimeout(() => {
                    navigate("/logout");
                }, 500);
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { request, loading, error, data };
};
