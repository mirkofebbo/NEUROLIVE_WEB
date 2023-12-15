import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Theme from "./style/Theme";

import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
