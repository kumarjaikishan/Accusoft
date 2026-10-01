import { createSlice } from "@reduxjs/toolkit";

const islogin = createSlice({
    name:"login",
    initialState:{
        islogin:false,
        head:"LogIn",
        narrow:false,
        loader:false,
        activeLedgerName: "",
    },
    reducers:{
        setlogin(state, action){
           state.islogin = action.payload;
        },
        header(state, action){
           state.head = action.payload;
        },
        setnarrow(state, action){
           state.narrow = action.payload;
        },
        setloader(state, action){
           state.loader = action.payload;
        },
        setActiveLedgerName(state, action){
           state.activeLedgerName = action.payload;
        }
    }

})
export const {setlogin,header,setnarrow,setloader,setActiveLedgerName}= islogin.actions;
export default islogin.reducer;