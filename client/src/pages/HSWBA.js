import React, { useState } from 'react';
import {Typography } from '@mui/material';
import Timeline from '../componants/charts/TimelineChart';
import SpotifyData from '../componants/spotify/SpotifyData';
import SoloCard from '../componants/utils/SoloCard'
import ParticipantCard from '../componants/utils/ParticipantCar';

function HSWBA() {
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedSolo, setSelectedSolo] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  const handleSongSelect = (song) => {
    setSelectedSong(song);
  };

  const handleSongSolo = (solo) => {
    setSelectedSolo(solo);
  };

  const handleSelectedParticipant = (participant) => {
    setSelectedParticipant(participant);
  }

  return (
    <>
      <Typography variant="h3">How Shall We Begin Again</Typography>
      {/* <Grid container spacing={1}>
        <Grid item xs={12} lg={8} xl={9}> */}
          <Timeline onSongSelect={handleSongSelect} onSoloSelect={handleSongSolo} onParticipantSelect={handleSelectedParticipant}/>
        {/* </Grid> */}
        {/* <Grid item xs={12} lg={4} xl={3}> */}
          <SpotifyData song={selectedSong} />
          <SoloCard solo={selectedSolo}/>
          <ParticipantCard overlappingData={selectedParticipant}/>
        {/* </Grid> */}
      {/* </Grid> */}
    </>
  );
}

export default HSWBA;
