import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: localStorage.getItem("theme") || "light",
    mainColor: localStorage.getItem("mainColor") || "#1e293b",
};

const themeSlice = createSlice({
    name: "theme",
    initialState: {
        ...initialState,
        isRotated: false,
    },
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
        },
        toggleRotation: (state) => {
            state.isRotated = !state.isRotated;
        },
        setRotation: (state, action) => {
            state.isRotated = action.payload;
        }
    }
});

export const { toggleTheme, setTheme, setMainColor, toggleRotation, setRotation } = themeSlice.actions;
export default themeSlice.reducer;