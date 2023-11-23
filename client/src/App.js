import React, { useState } from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import NavBar from './componants/utils/Navbar';
import HSWBA from './pages/HSWBA';
import DwPage from './pages/DwPage';
import HomePage from './pages/HomePage';
import Albane from './pages/Albane';
import Test from './pages/Test';

function App() {
  const [page, setPage] = useState('HomePage');

  return (
    <div>
      <NavBar setPage={setPage} />
      {page === 'HomePage' && <HomePage />}
      {page === 'HSWBA' && <HSWBA />}
      {page === 'DW' && <DwPage />}
      {page === 'Albane' && <Albane />}
      {page === 'Test' && <Test />}
    </div>
  );
}

export default App;
