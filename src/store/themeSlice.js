import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: localStorage.getItem("theme") || "light",
    mainColor: localStorage.getItem("mainColor") || "#1e293b",
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
            localStorage.setItem("theme", state.mode);
        },
        setTheme: (state, action) => {
            state.mode = action.payload;
            localStorage.setItem("theme", state.mode);
        },
        setMainColor: (state, action) => {
            state.mainColor = action.payload;
            localStorage.setItem("mainColor", state.mainColor);
        }
    }
});

export const { toggleTheme, setTheme, setMainColor } = themeSlice.actions;
export default themeSlice.reducer;