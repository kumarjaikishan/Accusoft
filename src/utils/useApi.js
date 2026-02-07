// utils/useApi.js

import { useState } from "react";
import { toast } from "react-toastify";
import { json, useNavigate } from "react-router-dom";
import { apiClient } from "./apiClient";

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const request = async (config) => {
        let { url, method } = config

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
            setError(err.message);
            // console.log("apiUse error:", err.message);
            // console.log("apiUse error status:", err.status);

            if (err.isApiError) {
                toast.warn(err.message, { autoClose: 2500 });
            } else {
                toast.error(err.message || "Unexpected error occurred");
            }

            if (err.status == 403 || err.status == 405) {
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

const logger = (detail) => {
  const prev = JSON.parse(localStorage.getItem("apiLogs")) || [];

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



