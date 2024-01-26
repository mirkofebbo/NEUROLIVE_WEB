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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const videoSize = isMobile ? { width: 450, height: 250 } : { width: 710, height: 400 };

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
      <Typography variant="h2" style={{ marginBottom: '10px'}}>
        Detective Work
      </Typography>
      <div style={{ margin: 'auto', position: 'center', width: `${videoSize.width}px`, height: `${videoSize.height}px` }}>
        <YouTube
          videoId='L3snDjV3xQ4'
          onReady={onReady}
          onStateChange={onStateChange}
          opts={{
            width: videoSize.width,
            height: videoSize.height,
            playerVars: {
              autoplay: 0,
            },
          }}
        />
      </div>
      <Box m="auto" display="flex" justifyContent="center">
        {isMobile ? (
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
            <Button variant="contained" color="primary" onClick={selectAll} sx={{ m: '0.1rem' }} >
                  Select All
                </Button>
                <Button variant="contained" color="secondary" onClick={deselectAll} sx={{ m: '0.1rem' }} >
                  Deselect All
                </Button>
          </FormControl>

        ) : (
          <div>
            {allParticipants.map((participant, index) => (
              <Button
                key={`${participant}-${index}`}
                variant={isParticipantSelected(participant) ? "contained" : "outlined"}
                color="primary"
                onClick={() => handleParticipantButtonClick(participant)}
                sx={{ m: '0.1rem' }}
              >
                {participant}
              </Button>
            ))}
            <Button variant="contained" color="primary" onClick={selectAll} sx={{ m: '0.1rem' }} >
              Select All
            </Button>
            <Button variant="contained" color="secondary" onClick={deselectAll} sx={{ m: '0.1rem' }} >
              Deselect All
            </Button>
          </div>
        )}

      </Box>
      <DwTimelineChart
        data={data}
        selectedParticipants={selectedParticipants}
        videoCurrentTime={videoCurrentTime}
        videoDuration={videoDuration}
      />
    </Box>
  );
}

export default DW;