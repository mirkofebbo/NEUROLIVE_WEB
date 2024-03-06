import React, { useState } from 'react';
import { Card, CardContent, Typography, } from '@mui/material';

const SoloCard = ({ soloData }) => {
    if (!soloData) return <div>Select a solo to view details</div>;
    if (soloData.type === 'solo') {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {soloData.name}
                    </Typography>
                    <Typography variant="h6">
                        Start: {soloData.start}
                        <br />
                        Stop: {soloData.stop}
                    </Typography>
                </CardContent>
            </Card>
        );
    }
};

export default SoloCard;
