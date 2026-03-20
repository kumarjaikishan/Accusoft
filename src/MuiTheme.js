import { createTheme } from "@mui/material/styles";

const primarycolor = "#1E293B";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,

      primary: {
        main: mode === "dark" ? "#f1f5f9" : primarycolor,
      },

      // background: {
      //   default: mode === "dark" ? "#0f172a" : "#f8fafc",
      //   paper: mode === "dark" ? "#1e293b" : "#ffffff",
      // },

      // text: {
      //   primary: mode === "dark" ? "#e2e8f0" : "#0f172a",
      // },
    },

    // 🔥 FIX BUTTON VISIBILITY HERE
    // components: {
    //   MuiButton: {
    //     styleOverrides: {
    //       root: {
    //         textTransform: "none",
    //       },

    //       outlined: {
    //         // 👇 Fix border + text visibility
    //         borderColor: mode === "dark" ? "#94a3b8" : "#1e293b",
    //         color: mode === "dark" ? "#e2e8f0" : "#1e293b",

    //         "&:hover": {
    //           borderColor: mode === "dark" ? "#e2e8f0" : "#0f172a",
    //           backgroundColor:
    //             mode === "dark"
    //               ? "rgba(148,163,184,0.1)"
    //               : "rgba(30,41,59,0.05)",
    //         },
    //       },
    //     },
    //   },
    // },
  });