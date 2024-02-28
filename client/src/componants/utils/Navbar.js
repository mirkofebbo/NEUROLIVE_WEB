import React from 'react';
import { AppBar, Toolbar, Button, Typography, Box, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import BarChartIcon from '@mui/icons-material/BarChart';
import SearchIcon from '@mui/icons-material/Search';

const NavBar = ({ setPage }) => {
    const logoPath = process.env.PUBLIC_URL + '/logo/NEUROLIVE_logo.png';

    return (
        <AppBar position="static" color="primary">
            <Toolbar variant="dense">
                <IconButton color="inherit" onClick={() => setPage('HomePage')}>
                    <img src={logoPath} alt="NeuroLive" height="50" /> {/* Adjust height as needed */}
                </IconButton>
                <Box sx={{ '& button': { ml: 2 } }}>
                    <IconButton color="inherit" onClick={() => setPage('HomePage')}>
                        <HomeIcon />
                        <Typography variant="h6" sx={{ ml: 1 }}>Home</Typography>
                    </IconButton>
                    <IconButton color="inherit" onClick={() => setPage('DW')}>
                        <SearchIcon />
                        <Typography variant="h6" sx={{ ml: 1 }}>DW</Typography>
                    </IconButton>
                    <IconButton color="inherit" onClick={() => setPage('HSWBA')}>
                        <TransferWithinAStationIcon />
                        <Typography variant="h6" sx={{ ml: 1 }}>HSWBA</Typography>
                    </IconButton>
                    {/* <IconButton color="inherit" onClick={() => setPage('Albane')}>
                        <SearchIcon />
                        <Typography variant="h6" sx={{ ml: 1 }}>Albane</Typography>
                    </IconButton> */}
                    <IconButton color="inherit" onClick={() => setPage('Test')}>
                        <SearchIcon />
                        <Typography variant="h6" sx={{ ml: 1 }}>Test</Typography>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
