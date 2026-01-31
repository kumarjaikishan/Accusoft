import { useApi } from "../utils/useApi";
import { useDispatch } from "react-redux";
import { setUserData } from "./api";

export const useUserApi = () => {
    const { request } = useApi();
    const dispatch = useDispatch();

    const userdatacall = async () => {
        // console.log("new hook ke pass")
        const res = await request({
            url: "userdata",
            method: "GET",
        });

        // console.log((res))
        dispatch(setUserData(res));
        return res;
    };

    const expenseadd = async (body) => {
        return request({
            url: "expense",
            method: "POST",
            body,
        });
    };

    return {
        userdatacall,
        expenseadd,
    };
};
