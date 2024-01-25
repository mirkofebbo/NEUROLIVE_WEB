import React, { useState, useEffect } from 'react';
import { Typography, Grid, Button, useMediaQuery, FormControl, Select, MenuItem, CircularProgress, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DwTimelineChart from '../componants/charts/DwTimelineChart';
import DataLoader from '../componants/utils/DataLoader';
import YouTube from 'react-youtube';

const fetchData = async (day, type, setData) => {
  const dataLoader = new DataLoader();
  const parsedData = await dataLoader.fetchCsvData('DW', day, type);
  return parsedData || [];
};

const DW = () => {
  const [data, setData] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [allParticipants, setAllParticipants] = useState([]);
  const [player, setPlayer] = useState(0); // youtube player
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);

  // Video option
  const opts = {
    height: '410',
    width: '720',
  };
  const onReady = (event) => {
    setPlayer(event.target);
    setTimeout(() => {
      setVideoDuration(event.target.getDuration());
    }, 1000);
  };
  const onStateChange = () => {
    // Update video time every second
    const interval = setInterval(() => {
      if (player && player.getCurrentTime) {
        setVideoCurrentTime(player.getCurrentTime());
      }
    }, 1000);
    return () => clearInterval(interval);
  };
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
    <Box>
      <Typography variant="h2" style={{ marginBottom: '20px' }}>
        Detective Work
      </Typography>
      <Grid container spacing={3}>
        {/* Responsive participant selection */}
        {isSmallScreen ? (
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
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
          </Grid>
        ) : (
          <Grid item md={2} sx={{ border: 1 }}>
            <Grid container direction="column" >
              {allParticipants.map((participant, index) => (
                <Button
                  key={`${participant}-${index}`}
                  variant={isParticipantSelected(participant) ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => handleParticipantButtonClick(participant)}
                  sx={{ m: '0.5rem'}}
                >
                  {participant}
                </Button>
              ))}
              <Button variant="contained" color="primary" onClick={selectAll} sx={{ m: '0.5rem'}} >
                Select All
              </Button>
              <Button variant="contained" color="secondary" onClick={deselectAll} sx={{ m: '0.5rem'}} >
                Deselect All
              </Button>
            </Grid>
          </Grid>
        )}

        {/* Chart column */}
        <Grid item xs={12} md={10}>
          {data.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <YouTube videoId='L3snDjV3xQ4' opts={opts} onReady={onReady} onStateChange={onStateChange} />
              </div>
              <DwTimelineChart data={data} selectedParticipants={selectedParticipants} videoCurrentTime={videoCurrentTime} videoDuration={videoDuration} />
            </div>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default DW;
