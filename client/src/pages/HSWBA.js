import React, { useState } from 'react';
import { Typography, Grid } from '@mui/material';
import Timeline from '../componants/charts/TimelineChart';
import SpotifyData from '../componants/spotify/SpotifyData';
import SoloCard from '../componants/utils/SoloCard'
import ParticipantCard from '../componants/utils/ParticipantCar';
import HorizontalTree from '../componants/charts/TreeChart';

function HSWBA() {
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedSolo, setSelectedSolo] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  
  const handleSongSelect = (song) => {
    setSelectedSong(song);
  };

  const handleSongSolo = (solo) => {
    setSelectedSolo(solo);
  };

  const handleSelectedParticipant = (participant) => {
    setSelectedParticipant(participant);
  }

  const handleSelectedData = (selectedData) => {
    setSelectedData(selectedData);
  }
  console.log(selectedParticipant);
  return (
    <>
      <Typography variant="h3">How Shall We Begin Again</Typography>
      <Grid container spacing={1}>
        {/* <Grid item xs={12} lg={8} xl={9}> */}
        <Timeline onSongSelect={handleSelectedData} onSoloSelect={handleSelectedData} onParticipantSelect={handleSelectedData} />
        {/* </Grid> */}
        <Grid item xs={12} lg={4} xl={3}>
          {/* <ParticipantCard overlappingData={selectedParticipant} /> */}
          <HorizontalTree props={selectedData}/>
        </Grid>
        <Grid item xs={12} lg={4} xl={3}>
          {/* <SpotifyData song={selectedSong} /> */}
          {/* <SoloCard solo={selectedSolo}/> */}
        </Grid>

      </Grid>
    </>
  );
}

export default HSWBA;
