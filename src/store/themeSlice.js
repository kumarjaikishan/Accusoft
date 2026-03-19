import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: localStorage.getItem("theme") || "light",
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            console.log("toggle trigger", state.mode)
            state.mode = state.mode === "light" ? "dark" : "light";
            localStorage.setItem("theme", state.mode);
        },
        setTheme: (state, action) => {
            console.log("set theme", action)
            state.mode = action.payload;
            localStorage.setItem("theme", state.mode);
        }
    }
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;