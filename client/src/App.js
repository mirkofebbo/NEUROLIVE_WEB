import React, { useState } from 'react';
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
    <div>
      <CssBaseline />
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <NavBar setPage={setPage} />
          {page === 'HomePage' && <HomePage />}
          {page === 'HSWBA' && <HSWBA />}
          {page === 'DW' && <DW />}
          {page === 'Albane' && <Albane />}
          {page === 'Test' && <Test />}
        {/* <Footer></Footer> */}
      </Box>
    </div>
  );
}

export default App;