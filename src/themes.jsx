// src/themes.jsx
import { createTheme } from '@mui/material/styles';

const customButtonPrimaryColor = '#0a3d62';
const customButtonPrimaryHoverColor = '#012336';
const customDarkButtonPrimaryColor = '#121212';
const customDarkButtonPrimaryHoverColor = '#012336';
// Light theme configuration
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#fff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#000',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // Default button color override
          backgroundColor: customButtonPrimaryColor,
          '&:hover': {
            backgroundColor: customButtonPrimaryHoverColor, // Slightly darker shade for hover
          },
        },
      },
    },
  },
});

// Dark theme configuration
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#424242',
    },
    text: {
      primary: '#fff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // Default button color override
          // backgroundColor: customDarkButtonPrimaryColor,
          '&:hover': {
            backgroundColor: customDarkButtonPrimaryHoverColor, // Slightly darker shade for hover
          },
        },
      },
    },
  },
});
