import React, { useState, useEffect } from 'react';
import { Typography, Grid, Button, useMediaQuery, FormControl, Select, MenuItem } from '@mui/material';
import { csv } from 'd3';
import DwChart from '../componants/charts/DwChart';
import { useTheme } from '@mui/material/styles';

const DW = () => {
  const [data, setData] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [allParticipants, setAllParticipants] = useState([]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    csv('/small_breathing.csv').then(parsedData => {
      const participants = Object.keys(parsedData[0]).filter(key => key !== 'index');
      setData(parsedData);
      setAllParticipants(participants);
      setSelectedParticipants(participants); // Set all participants as default
    });
  }, []);

  const handleParticipantChange = (event) => {
    setSelectedParticipants(event.target.value);
  };

  const handleParticipantButtonClick = (participant) => {
    setSelectedParticipants(prev => 
      prev.includes(participant)
      ? prev.filter(p => p !== participant)
      : [...prev, participant]
    );
  };

  const selectAll = () => {
    setSelectedParticipants(allParticipants);
  };

  const deselectAll = () => {
    setSelectedParticipants([]);
  };

  const isParticipantSelected = (participant) => {
    return selectedParticipants.includes(participant);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Detective Work
      </Typography>
      <Grid container spacing={2}>
        {/* Responsive participant selection */}
        {isSmallScreen ? (
          <FormControl fullWidth>
            <Select
              multiple
              value={selectedParticipants}
              onChange={handleParticipantChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {allParticipants.map((participant) => (
                <MenuItem key={participant} value={participant}>
                  {participant}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Grid item xs={12} md={4}>
            <Grid container spacing={1}>
              {allParticipants.map((participant, index) => (
                <Grid item xs={6} key={participant}>
                  <Button
                    variant={isParticipantSelected(participant) ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleParticipantButtonClick(participant)}
                    fullWidth
                  >
                    {participant}
                  </Button>
                </Grid>
              ))}
            </Grid>
            <div style={{ marginTop: '10px' }}>
              <Button variant="contained" color="primary" onClick={selectAll} fullWidth>
                Select All
              </Button>
              <Button variant="contained" color="secondary" onClick={deselectAll} style={{ marginLeft: '10px', marginTop: '10px' }} fullWidth>
                Deselect All
              </Button>
            </div>
          </Grid>
        )}

        {/* Chart column */}
        <Grid item xs={12} md={8}>
          <DwChart data={data} selectedParticipants={selectedParticipants} />
        </Grid>
      </Grid>
    </>
  );
}

export default DW;
