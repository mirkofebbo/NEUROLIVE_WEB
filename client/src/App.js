import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CssBaseline, Box, Container } from '@mui/material';

import NavBar from './componants/utils/Navbar';
import HSWBA from './pages/HSWBA';
import DW from './pages/DW';
import HomePage from './pages/HomePage';
import Albane from './pages/Albane';
import Test from './pages/Test';
import Footer from './componants/utils/Footer';

function App() {
  const [page, setPage] = useState('DwPage');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/NEUROLIVE_WEB/" element={<DW />} />
        <Route path="/NEUROLIVE_WEB/HSWBA" element={<HSWBA />} />
        <Route path="/NEUROLIVE_WEB/DW" element={<DW />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
