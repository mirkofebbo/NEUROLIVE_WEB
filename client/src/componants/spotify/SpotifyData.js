import React, { useState } from 'react';
import { Card, CardContent, Typography, Select, MenuItem } from '@mui/material';
import LineChart from '../charts/LineChart';

const SpotifyData = ({ song }) => {
    const [selectedData, setSelectedData] = useState('bars');
    if (!song) return <div>Select a song to view details</div>;
    const handleChange = (event) => {
        setSelectedData(event.target.value);
    };
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    {song.name}
                </Typography>
                <Typography variant="h6">
                    by: {song.artist}
                </Typography>
                <Typography variant="body1">
                    liveness: {Math.ceil(song.liveness * 100)}% <br />
                    danceability: {Math.ceil(song.danceability * 100)}% <br />
                    energy: {Math.ceil(song.energy * 100)}% <br />
                </Typography>
                <Select value={selectedData} onChange={handleChange}>
                    <MenuItem value="bars">Bars</MenuItem>
                    <MenuItem value="beats">Beats</MenuItem>
                    <MenuItem value="sections">Sections</MenuItem>
                    <MenuItem value="segments">Segments</MenuItem>
                    <MenuItem value="tatums">Tatums</MenuItem>
                </Select>
                <LineChart data={song[selectedData]} width={400} />
            </CardContent>
        </Card>
    );
};

export default SpotifyData;
