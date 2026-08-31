import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const userdata = createAsyncThunk("userdata", async () => {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}userdata`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        const data = await res.json();
        // console.log("from redux api", data);

        if (!res.ok && data.message == 'jwt expired') {
            // toast.warn('Session expired. Please log in again.', { autoClose: 1700 });
        }
        return data;
    } catch (error) {
        console.log(error);
    }
})


const userexplist = createSlice({
    name: "user",
    initialState: {
        // explist was removed from here on purpose: /userdata used to ship
        // the user's *entire* expense history on every login, which every
        // page (Expense table, dashboard, home, report, ledger detail) then
        // filtered client-side. Each of those screens now fetches exactly
        // the slice of data it needs from its own endpoint instead. This
        // slice only holds the small, genuinely global stuff: profile +
        // ledger list.
        ledgerlist: [],
        user: {},
        loading: false,
        error: null,
        profilepic: "",
        apiadress: "https://backend-exp-man.vercel.app/api",
    },
    reducers: {
         setUserData(state, action) {
            state.ledgerlist = action.payload.ledger;
            state.user = action.payload.user;
            state.profilepic = action.payload.user?.imgsrc;
        },
        userlogout(state, action) {
            localStorage.removeItem("token");
            state.ledgerlist = [];
            state.user = {};
        },
        profilepicupdtae(state, action) {
            state.profilepic = action.payload;
        },
        profiledetailupdtae(state, action) {
            state.user.name = action.payload.name;
            state.user.phone = action.payload.phone;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(userdata.pending, (state,) => {
            state.loading = true;
        })
        builder.addCase(userdata.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error
        })
        builder.addCase(userdata.fulfilled, (state, action) => {
            state.loading = false;
            // console.log("fulfilled wala", action.payload.msg);
            state.ledgerlist = action.payload.ledger;
            state.user = action.payload.user;
            state.profilepic = action.payload.user?.imgsrc;
        })
    }
})
export const { userlogout, profilepicupdtae, profiledetailupdtae,setUserData } = userexplist.actions;
export default userexplist.reducer;
