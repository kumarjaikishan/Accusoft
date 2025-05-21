import { toast } from 'react-toastify';


const apiWrapper = async ({ url, method = 'GET', body = null, dispatch, successAction,notsuccessAction, loaderAction, navigate }) => {
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
        console.log("apiwrapper response", responseData);
         
        if (response.status === 401 || response.status === 403) {
            toast.warn(responseData.message, { autoClose: 2100 });
            return navigate('/logout');
        }

        if (!response.ok) {
            return notsuccessAction(responseData);
        }

        return successAction(responseData);
    } catch (error) {
        console.error("ApiWrapper Error:", error);
        toast.error(error.message || 'An error occurred', { autoClose: 2300 });
    } finally {
        dispatch(loaderAction(false));
    }
};


export default apiWrapper;
