import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const userdata = createAsyncThunk("userdata", async () => {
    const token = localStorage.getItem("token");
    // console.log("api calling");
    // dispatch(setloader(true));
    try {
        const res = await fetch(`http://localhost:5000/userdata`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        const data = await res.json();
        // console.log("from redux api", data);
        return data;
    } catch (error) {
        console.log(error);
    }
})


const userexplist = createSlice({
    name: "user",
    initialState: {
        explist: [],
        ledgerlist: [],
        user: [],
        loading: false,
        error: null,
        profilepic: "",
        apiadress: "http://localhost:5000",
    },
    reducers: {
        userlogout(state, action) {
            localStorage.clear();
            state.explist = [];
            state.ledgerlist = [];
            state.user = [];
        },
        profilepicupdtae(state, action) {
            state.profilepic = action.payload;
        },
        profiledetailupdtae(state, action) {
            state.user.name = action.payload.name;
            state.user.phone = action.payload.phone;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(userdata.pending, (state,) => {
            state.loading = true;
        })
        builder.addCase(userdata.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        builder.addCase(userdata.fulfilled, (state, action) => {
            state.loading = false;
            // console.log("fulfilled wala", action.payload.msg);
            state.explist = action.payload.explist;
            state.ledgerlist = action.payload.user.ledger;
            state.user = action.payload.user;
            state.profilepic = action.payload.user.imgsrc;
        })
    }
})
export const { userlogout, profilepicupdtae,profiledetailupdtae } = userexplist.actions;
export default userexplist.reducer;