// utils/useApi.js

import { useCallback, useState } from "react";
import { toast } from "./toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiClient } from "./apiClient";

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const isAdmin = useSelector((state) => state.userexplist?.user?.isadmin);
    const navigate = useNavigate();

    const request = useCallback(async (config) => {
        let { url, method } = config;
        const startTime = performance.now();

        try {
            setLoading(true);
            setError(null);

            const result = await apiClient(config);
            const endTime = performance.now();
            const durationMs = Number((endTime - startTime).toFixed(2));

            if (isAdmin) {
                const logDetail = {
                    id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                    endpoint: url,
                    method: (method || "GET").toUpperCase(),
                    durationMs,
                    time: `${durationMs} ms`,
                    status: 200,
                    success: true,
                    date: new Date().toISOString(),
                    date1: Date.now()
                };
                logger(logDetail);
            }

            setData(result);
            return result;

        } catch (err) {
            const endTime = performance.now();
            const durationMs = Number((endTime - startTime).toFixed(2));
            const message = err?.message || "Unexpected error occurred";
            setError(message);

            if (isAdmin) {
                const logDetail = {
                    id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                    endpoint: url,
                    method: (method || "GET").toUpperCase(),
                    durationMs,
                    time: `${durationMs} ms`,
                    status: err?.status || 500,
                    success: false,
                    error: message,
                    date: new Date().toISOString(),
                    date1: Date.now()
                };
                logger(logDetail);
            }
            console.log(err);

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
    }, [navigate, isAdmin]);

    return { request, loading, error, data };
};

const getBaseEndpoint = (urlStr) => {
    if (!urlStr) return "unknown";
    const cleaned = String(urlStr).replace(/^\/+/, "");
    return cleaned.split("?")[0] || cleaned;
};

const logger = (detail) => {
    let prev = [];

    try {
        prev = JSON.parse(localStorage.getItem("apiLogs")) || [];
    } catch (error) {
        prev = [];
    }

    const baseEndpoint = getBaseEndpoint(detail.endpoint);
    const key = `${baseEndpoint}_${detail.method}`;

    // Separate current API base endpoint logs and others
    const sameApi = prev.filter(log => {
        const logBase = getBaseEndpoint(log.endpoint);
        const logMethod = (log.method || "GET").toUpperCase();
        return `${logBase}_${logMethod}` === key;
    });

    const otherApis = prev.filter(log => {
        const logBase = getBaseEndpoint(log.endpoint);
        const logMethod = (log.method || "GET").toUpperCase();
        return `${logBase}_${logMethod}` !== key;
    });

    // Add new log and keep last 50 per API endpoint
    const updatedSameApi = [...sameApi, detail];
    const trimmedSameApi = updatedSameApi.slice(-50);

    const finalLogs = [...otherApis, ...trimmedSameApi];

    try {
        localStorage.setItem("apiLogs", JSON.stringify(finalLogs));
    } catch (e) {
        console.error("Failed to save apiLogs to localStorage", e);
    }
};
