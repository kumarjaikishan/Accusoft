const BASE_URL = import.meta.env.VITE_API_ADDRESS;
// const BASE_URL = "/api/";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach(p => {
        if (error) p.reject(error);
        else p.resolve();
    });

    failedQueue = [];
};

export const apiClient = async ({
    url,
    method = "GET",
    body = null,
}) => {

    let token = localStorage.getItem("token");

    const makeRequest = () =>
        fetch(BASE_URL + url, {
            method,
            credentials: "include", // ⭐ IMPORTANT — sends refresh cookie
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
            },
            body: body ? JSON.stringify(body) : null,
        });

    let response = await makeRequest();

    // 🔁 Access token expired
    if (response.status === 401) {

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => apiClient({ url, method, body }));
        }

        isRefreshing = true;

        try {
            // 🔐 refresh token comes ONLY from cookie
            console.log("retrying for refresh token")
            const refreshRes = await fetch(BASE_URL + "refresh", {
                method: "POST",
                credentials: "include" // ⭐ sends cookie
            });

            if (!refreshRes.ok) throw new Error("Token Refresh failed");

            const refreshData = await refreshRes.json();

            // backend returns: { accessToken }
            token = refreshData.accessToken;

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

    const data = await response.json();

    if (!response.ok) {
        const err = new Error(data.message || "Request failed");
        err.isApiError = true;
        err.status = response.status;
        err.payload = data;
        throw err;
    }

    // ✅ success response
    return data;
};
