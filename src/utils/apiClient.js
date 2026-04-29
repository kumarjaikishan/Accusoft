const BASE_URL = import.meta.env.VITE_API_ADDRESS;
// const BASE_URL = "/api/";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach((p) => {
        if (error) p.reject(error);
        else p.resolve();
    });

    failedQueue = [];
};

const createApiError = (message, options = {}) => {
    const err = new Error(message || "Something went wrong. Please try again.");
    err.isApiError = true;
    err.status = options.status;
    err.payload = options.payload;
    err.code = options.code;
    return err;
};

const joinUrl = (baseUrl, path) => {
    if (!baseUrl) {
        throw createApiError("API server URL is not configured.", {
            code: "CONFIG_ERROR",
        });
    }

    const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    const endpoint = String(path || "").replace(/^\/+/, "");
    return base + endpoint;
};

const parseResponse = async (response) => {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        return response.json();
    }

    const text = await response.text();
    return text ? { message: text } : {};
};

const getResponseMessage = (data, fallback) => {
    if (typeof data?.message === "string" && data.message.trim()) return data.message;
    if (typeof data?.error === "string" && data.error.trim()) return data.error;
    return fallback;
};

const safeFetch = async (url, options) => {
    try {
        return await fetch(url, options);
    } catch (error) {
        throw createApiError("Server is unavailable", {
            code: "NETWORK_ERROR",
            payload: { originalMessage: error.message },
        });
    }
};

export const apiClient = async ({
    url,
    method = "GET",
    body = null,
}) => {
    let token = localStorage.getItem("token");
    const endpoint = String(url || "").replace(/^\/+/, "");
    const authEndpoints = ["login", "signup", "checkmail", "setpassword", "refresh", "logout"];
    const isAuthRequest = authEndpoints.includes(endpoint);

    const makeRequest = () =>
        safeFetch(joinUrl(BASE_URL, endpoint), {
            method,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
            },
            body: body ? JSON.stringify(body) : null,
        });

    let response = await makeRequest();

    // Access token expired. Skip refresh for login/signup style requests so
    // invalid credentials keep the backend's real message.
    if (response.status === 401 && token && !isAuthRequest) {
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => apiClient({ url, method, body }));
        }

        isRefreshing = true;

        try {
            const refreshRes = await safeFetch(joinUrl(BASE_URL, "refresh"), {
                method: "POST",
                credentials: "include",
            });

            if (!refreshRes.ok) {
                let refreshData = {};

                try {
                    refreshData = await parseResponse(refreshRes);
                } catch (error) {
                    refreshData = {};
                }

                throw createApiError(getResponseMessage(refreshData, "Session expired. Please log in again."), {
                    status: refreshRes.status,
                    payload: refreshData,
                    code: "AUTH_EXPIRED",
                });
            }

            const refreshData = await parseResponse(refreshRes);
            token = refreshData.accessToken;

            if (!token) {
                throw createApiError("Session refresh failed. Please log in again.", {
                    status: refreshRes.status,
                    payload: refreshData,
                    code: "AUTH_EXPIRED",
                });
            }

            localStorage.setItem("token", token);
            processQueue(null);

            return apiClient({ url, method, body });
        } catch (err) {
            processQueue(err);
            localStorage.removeItem("token");
            throw err;
        } finally {
            isRefreshing = false;
        }
    }

    let data = {};

    try {
        data = await parseResponse(response);
    } catch (error) {
        throw createApiError("Server returned an invalid response. Please try again.", {
            status: response.status,
            code: "INVALID_RESPONSE",
        });
    }

    if (!response.ok) {
        const isAuthFailure = response.status === 401 || response.status === 403;

        throw createApiError(getResponseMessage(data, "Request failed. Please try again."), {
            status: response.status,
            payload: data,
            code: isAuthFailure && !isAuthRequest ? "AUTH_EXPIRED" : "HTTP_ERROR",
        });
    }

    return data;
};
