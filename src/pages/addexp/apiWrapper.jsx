// apiWrapper.js
import { toast } from 'react-toastify';

const apiWrapper = async (url, method = 'GET', body = null, dispatch, successAction, loaderAction) => {
    try {
        dispatch(loaderAction(true));
        const token = localStorage.getItem("token");
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: body ? JSON.stringify(body) : null,
        };

        const response = await fetch(url, options);
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.msg || 'Something went wrong');
            // toast.warn(responseData.msg, { autoClose: 2300 })
        }

        successAction(responseData);
        return responseData;
    } catch (error) {
        // You can dispatch an error action here if needed
        toast.warn(error.message, { autoClose: 2300 })
        console.log(error);
        dispatch(loaderAction(false));
        throw error; // Rethrow the error for the calling code to handle
    } finally {
        dispatch(loaderAction(false));
    }
};

export default apiWrapper;
