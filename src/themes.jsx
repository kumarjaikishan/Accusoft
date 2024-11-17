// src/themes.jsx
import { createTheme } from '@mui/material/styles';

const PrimaryColor = '#0a3d62';
const customButtonPrimaryHoverColor = '#012336';
const customDarkButtonPrimaryColor = '#121212';
const customDarkButtonPrimaryHoverColor = '#012336';
// Light theme configuration
export const lightTheme = createTheme({
  palette: {
    primary: {
      main: PrimaryColor,
    },
  },
});

// Dark theme configuration
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFFFF',
    },
    background: {
      default: '#121212',
      paper: '#424242',
    },
  },
});
