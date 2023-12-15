import React, { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import Timeline from '../componants/charts/TimelineChart';
import SpotifyData from '../componants/spotify/SpotifyData';

function HSWBA() {
  const [selectedSong, setSelectedSong] = useState(null);
  const handleSongSelect = (song) => {
    setSelectedSong(song);
  };
  return (
    <>
      <Typography variant="h3">How Shall We Begin Again</Typography>
      {/* <Grid container spacing={1}>
        <Grid item xs={12} lg={8} xl={9}> */}
          <Timeline onSongSelect={handleSongSelect} />
        {/* </Grid> */}
        {/* <Grid item xs={12} lg={4} xl={3}> */}
          <SpotifyData song={selectedSong} />
        {/* </Grid> */}
      {/* </Grid> */}
    </>
  );
}

export default HSWBA;
