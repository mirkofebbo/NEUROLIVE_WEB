import React, { useState } from 'react';
import { Card, CardContent, Typography, Select, MenuItem } from '@mui/material';

const ParticipantCard = ({ participantData }) => {

    if (!participantData) return <div>Select a Participant to view details</div>;
    if (participantData.type === "participant") {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {participantData.name}
                    </Typography>
                    <Typography variant="h6">
                        Start: {participantData.start}
                        <br/>
                        Stop: {participantData.stop}
                    </Typography>
                    <Typography variant="body1">
                    comment:  {participantData.comment}<br />
                    pupil: {participantData.pupil} <br />
                    eeg: {participantData.eeg} <br />
                    </Typography>

                </CardContent>
            </Card>
        );
    }
};

export default ParticipantCard;
