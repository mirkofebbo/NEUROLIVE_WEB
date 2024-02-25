import React, { useState } from 'react';
import { Typography, Grid } from '@mui/material';
import Timeline from '../componants/charts/TimelineChart';
import SpotifyData from '../componants/spotify/SpotifyData';
import SoloCard from '../componants/utils/SoloCard'
import ParticipantCard from '../componants/utils/ParticipantCar';
import HorizontalTree from '../componants/charts/TreeChart';

function HSWBA() {
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedDay, setSelectedDay] = useState("SAT");

  // In HSWBA component
  const handleNodeClick = (nodeData) => {
    console.log("Clicked node data:", nodeData);
    // Perform actions based on clicked node data
    // For example, update state with the clicked node data
    setSelectedNode(nodeData);
  };

  const handleSongSelect = (song) => {
    setSelectedSong(song);
  };

  const handleSelectedData = (selectedData) => {
    setSelectedData(selectedData);
  }
  const handleSelectedDay = (selectedDay) => {
    setSelectedDay(selectedDay);
    setSelectedData(null);
  }
  return (
    <>
      <Typography variant="h3">How Shall We Begin Again</Typography>
      <Grid container spacing={1}>
        {/* <Grid item xs={12} lg={8} xl={9}> */}
        <Timeline onSongSelect={handleSongSelect} onSoloSelect={handleSelectedData} onParticipantSelect={handleSelectedData} onDayChange={handleSelectedDay}/>
        {/* </Grid> */}
        <Grid item xs={12} lg={8}>
          {/* <ParticipantCard overlappingData={selectedParticipant} /> */}
          <HorizontalTree props={selectedData} onNodeClick={handleNodeClick} selectedDay ={selectedDay}/>
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
