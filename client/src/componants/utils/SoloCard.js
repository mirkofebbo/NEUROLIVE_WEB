import React, { useState } from 'react';
import { Card, CardContent, Typography, } from '@mui/material';

const SoloCard = ({ solo }) => {
    const [selectedData, setSelectedData] = useState('bars');
    if (!solo) return <div>Select a solo to view details</div>;
    
    const handleChange = (event) => {
        setSelectedData(event.target.value);
    };
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    {solo.id}
                </Typography>
                <Typography variant="h6">
                    Rating: {solo.ratings}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default SoloCard;
