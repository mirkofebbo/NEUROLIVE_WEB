import React, { useState } from 'react';
import { Typography, Grid, Container } from '@mui/material';
import Timeline from '../componants/charts/TimelineChart';
import SpotifyData from '../componants/spotify/SpotifyData';
import SoloCard from '../componants/utils/SoloCard'
import ParticipantCard from '../componants/utils/ParticipantCard';
import HorizontalTree from '../componants/charts/TreeChart';

function HSWBA() {

  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedSolo, setSelectedSolo] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedDay, setSelectedDay] = useState("SAT");
  
  // SONG
  const handleSongSelect = (song) => {
    setSelectedSong(song);
    setSelectedData(song);
  };
  // PARTICIPANT
  const handleParticipantSelect = (participant) => {
    setSelectedParticipant(participant);
    setSelectedData(participant);
  };
  // SOLO
  const handleSoloSelect = (solo) => {
    setSelectedSolo(solo);
    setSelectedData(solo);
  };
  const handleSelectedData = (selectedData) => {
    setSelectedData(selectedData);
  }
  // DAY
  const handleSelectedDay = (selectedDay) => {
    setSelectedDay(selectedDay);
    setSelectedData(null);
    setSelectedSong(null);
    setSelectedParticipant(null);
    setSelectedSolo(null);
  }
  return (
    <>
      <Typography variant="h3">How Shall We Begin Again</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Timeline
            onSongClick={handleSongSelect}
            onSoloClick={handleSoloSelect}
            onParticipantClick={handleParticipantSelect}
            onDayChange={handleSelectedDay} />
        </Grid>
        <Grid item xs={12} lg={6}>
                    {/* <ParticipantCard overlappingData={selectedParticipant} /> */}
          <HorizontalTree props={selectedData}
            onParticipantClick={setSelectedParticipant}
            onSoloClick={setSelectedSolo}
            onSongClick={setSelectedSong}
            selectedDay={selectedDay} />
        </Grid>
        <Grid item xs={12} lg={2}>
          {selectedSolo && <SoloCard soloData={selectedSolo} />}
          {selectedParticipant && <ParticipantCard participantData={selectedParticipant} />}
        </Grid>
        <Grid item xs={12} lg={4}>
          {selectedSong && <SpotifyData song={selectedSong} />}
        </Grid>
      </Grid>
    </>
  );
}

export default HSWBA;
