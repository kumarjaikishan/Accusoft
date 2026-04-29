// utils/useApi.js

import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { apiClient } from "./apiClient";

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const request = useCallback(async (config) => {
        let { url, method } = config;

        try {
            setLoading(true);
            setError(null);

            let start = performance.now();
            const result = await apiClient(config);
            let end = performance.now();

            const logDetail = {
                endpoint: url,
                method: method || "GET",
                time: (end - start).toFixed(2) + ' ms',
                date: new Date(),
                date1: Date.now()
            }
            logger(logDetail)
            // console.log("result useapi",result)

            setData(result);
            return result;

        } catch (err) {
            const message = err?.message || "Unexpected error occurred";
            setError(message);
            console.log(err);
            // console.log("apiUse error:", err.message);
            // console.log("apiUse error status:", err.status);

            const currentPath = window.location.pathname;
            const isLogoutPage = currentPath === "/logout";
            const msg = (err?.message || "").toLowerCase();
            const isSessionFailure =
                err?.code === "AUTH_EXPIRED" ||
                msg.includes("jwt expired") ||
                msg.includes("session expired") ||
                msg.includes("unauthorized");
            const toastId = isSessionFailure ? "auth-toast" : `api-${err?.code || err?.status || "error"}`;
            const toastOptions = { autoClose: 2500, toastId };

            if (!isLogoutPage) {
                if (err?.code === "NETWORK_ERROR" || err?.code === "CONFIG_ERROR" || err?.code === "INVALID_RESPONSE") {
                    toast.error(message, toastOptions);
                } else if (err?.isApiError) {
                    toast.warn(message, toastOptions);
                } else {
                    toast.error(message, toastOptions);
                }
            }

            if (isSessionFailure && currentPath !== "/logout" && currentPath !== "/login") {
                navigate("/logout", { replace: true });
            }

            throw err;
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    return { request, loading, error, data };
};

const logger = (detail) => {
    let prev = [];

    try {
        prev = JSON.parse(localStorage.getItem("apiLogs")) || [];
    } catch (error) {
        prev = [];
    }

    const key = `${detail.method}_${detail.endpoint}`;

    // Separate current API logs and others
    const sameApi = prev.filter(
        log => `${log.method}_${log.endpoint}` === key
    );

    const otherApis = prev.filter(
        log => `${log.method}_${log.endpoint}` !== key
    );

    // Add new log
    const updatedSameApi = [...sameApi, detail];

    // Keep only last 10
    const trimmedSameApi = updatedSameApi.slice(-10);

    const finalLogs = [...otherApis, ...trimmedSameApi];

    localStorage.setItem("apiLogs", JSON.stringify(finalLogs));
};


const logger2 = (detail) => {
    const prev = JSON.parse(localStorage.getItem("apiLogs")) || [];

    const updated = [...prev, detail];

    localStorage.setItem("apiLogs", JSON.stringify(updated));
};



