import React, { useState, useEffect } from 'react';
import { Typography, Grid, Button, useMediaQuery, FormControl, Select, MenuItem, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DwTimelineChart from '../componants/charts/DwTimelineChart';
import DataLoader from '../componants/utils/DataLoader';

const fetchData = async (day, type, setData) => {
  const dataLoader = new DataLoader();
  const parsedData = await dataLoader.fetchCsvData('DW', day, type);
  return parsedData || []; 
};

const DW = () => {
  const [data, setData] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [allParticipants, setAllParticipants] = useState([]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchData('ALL', 'luminance');
      setData(fetchedData);
      if (fetchedData.length > 0) {
        const allowed = ['Dancer Acceleration Non-Windowed', 'Dancer Distance Non-Windowed', 'Sound Amplitude', 'Luminance Non-Windowed']
        const participants = Object.keys(fetchedData[0]).filter(key => allowed.includes(key));
        setAllParticipants(participants);
        setSelectedParticipants(participants);
      }
    };
    loadData();
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
      <Grid container spacing={2} >
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
          <Grid item style={{ width: "150px" }} md={2} >
            <Grid container spacing={1}>
              {allParticipants.map((participant, index) => (
                // <Grid item xs={6} key={participant}>
                  <Button
                    key={`${participant}-${index}`}
                    variant={isParticipantSelected(participant) ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleParticipantButtonClick(participant)}
                    fullWidth
                    style={{margin: "3px"}}
                  >
                    {participant}
                  </Button>
                // </Grid>
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
          {data.length === 0 ? (
            // Render loading animation when data is not loaded
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </div>
          ) : (
            // Render the chart once data is loaded
            <DwTimelineChart data={data} selectedParticipants={selectedParticipants} />
          )}
        </Grid>

      </Grid>
    </>
  );
}

export default DW;
