import { createTheme } from '@mui/material/styles';

export default createTheme({
  palette: {
    primary: {
      main: '#2c3e50',
    },
    secondary: {
      main: '#3498db',
    },
    error: {
      main: '#e74c3c',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #e8e8e8',
        },
        indicator: {
          backgroundColor: '#2c3e50',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          '&.Mui-selected': {
            color: '#2c3e50',
          },
        },
      },
    },
  },
});