import React from 'react';
import {AppBar, Toolbar, Box, Container, Typography, Grid } from '@mui/material';

const Footer = () => {
    // Use the process.env.PUBLIC_URL to get the correct path
    const logoPath = process.env.PUBLIC_URL + '/logo/';
    const logo_height =  "40";
    
    return (
        <Box component="footer" sx={{ bgcolor: 'primary', py: 6 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <img src={logoPath + 'NEUROLIVE_logo.png'} alt="MPIEA Logo" height={logo_height} />
                    </Grid>
                    <Grid item>
                        <img src={logoPath + 'SDS_logo.png'} alt="MPIEA Logo" height={logo_height} />
                    </Grid>
                    <Grid item>
                        <img src={logoPath + 'ERC-FLAG_EU_logo.jpg'} alt="ERC Flag EU Logo" height={logo_height} />
                    </Grid>
                    <Grid item>
                        <img src={logoPath + 'GOLD_logo.jpg'} alt="Gold Logo" height={logo_height} />
                    </Grid>
                    <Grid item>
                        <img src={logoPath + 'MPIEA_logo.png'} alt="MPIEA Logo" height={logo_height} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary" align="center">
                            This research project has received funding from the European Research Council (ERC) under the European Union’s Horizon 2020 research and innovation programme (grant agreement No. 864420 - Neurolive)
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                            {'© '}
                            {new Date().getFullYear()}
                            {' Mirko Febbo. All rights reserved.'}
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Footer;
