import React, { useState, useEffect } from 'react';
import { Typography, Container, FormControl, FormControlLabel, Checkbox, Button, Grid } from '@mui/material';
import { csv } from 'd3';
import DwChart from '../componants/charts/DwChart';

const DW = () => {
  const [data, setData] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [allParticipants, setAllParticipants] = useState([]);

  useEffect(() => {
    csv('/small_breathing.csv').then(parsedData => {
      const participants = Object.keys(parsedData[0]).filter(key => key !== 'index');
      setData(parsedData);
      setAllParticipants(participants);
      setSelectedParticipants(participants); // Set all participants as default
    });
  }, []);

  const handleParticipantChange = (event) => {
    if (event.target.checked) {
      setSelectedParticipants(prev => [...prev, event.target.name]);
    } else {
      setSelectedParticipants(prev => prev.filter(participant => participant !== event.target.name));
    }
  };

  const selectAll = () => {
    setSelectedParticipants(allParticipants);
  };

  const deselectAll = () => {
    setSelectedParticipants([]);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Detective Work
      </Typography>
      <Grid container spacing={1}>
        {allParticipants.map(participant => (
          <Grid item xs={1} key={participant}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedParticipants.includes(participant)}
                  onChange={handleParticipantChange}
                  name={participant}
                />
              }
              label={participant}
            />
          </Grid>
        ))}
      </Grid>
      <div style={{ marginTop: '10px' }}>
        <Button variant="contained" color="primary" onClick={selectAll}>
          Select All
        </Button>
        <Button variant="contained" color="secondary" onClick={deselectAll} style={{ marginLeft: '10px' }}>
          Deselect All
        </Button>
      </div>
      <DwChart data={data} selectedParticipants={selectedParticipants} />
    </>
  );
}

export default DW;
