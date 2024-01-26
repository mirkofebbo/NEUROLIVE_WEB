import React from 'react';
import { Card, CardContent, Typography, List, ListItem, Grid } from '@mui/material';

const ParticipantCard = ({ overlappingData }) => {
    if (!overlappingData) return <div>Select a participant to view details</div>;
    console.log(overlappingData);

    const overlappingSongs = overlappingData.songs
    const overlappingSolos = overlappingData.solos;

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    Overlapping Events
                </Typography>
                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                    <Grid item xs={6}>
                        <Typography variant="h6">Solos</Typography>
                        <List>
                            {overlappingSolos.map((solo, index) => (
                                <ListItem key={index}>
                                    <Typography variant="body1">
                                        ID: {solo.id}, Ratings: {solo.ratings}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography variant="h6">Songs</Typography>
                        <List>
                            {overlappingSongs.map((song, index) => (
                                <ListItem key={index}>
                                    <Typography variant="body1">
                                        {song.name} by {song.artist}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default ParticipantCard;
