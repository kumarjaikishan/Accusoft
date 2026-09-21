import { createTheme } from "@mui/material/styles";

export const getTheme = (mode, mainColor) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mainColor || "#0a3d62",
      },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                }
            }
        }
    }
  });