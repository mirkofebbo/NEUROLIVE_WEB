import React, { useRef, useEffect, useState } from 'react';
import { Typography, Grid, Box, Select, MenuItem, Card, CardContent, CardHeader, Divider, Tooltip } from '@mui/material';
import theme from '../../style/Theme'
import { SpotifyAuth } from './SpotifyAuth';
import { TrackSearch } from './TrackSearch';
import { AudioAnalysis } from './AudioAnalysis';
import { AudioFeatures } from './AudioFeatures';

import LineChart from './LineChart';

// const artist = 'Beyonce';
// const track = 'CUFF IT';
const analysisDef = {
  "bars": "The time intervals of the bars throughout the track. A bar (or measure) is a segment of time defined as a given number of beats.",
  "beats": "The time intervals of beats throughout the track. A beat is the basic time unit of a piece of music; for example, each tick of a metronome. Beats are typically multiples of tatums.",
  "sections": "Sections are defined by large variations in rhythm or timbre, e.g. chorus, verse, bridge, guitar solo, etc. Each section contains its own descriptions of tempo, key, mode, time_signature, and loudness.",
  "segments": "Each segment contains a roughly conisistent sound throughout its duration.",
  "tatums": "A tatum represents the lowest regular pulse train that a listener intuitively infers from the timing of perceived musical events (segments).",
  "danceability": "Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0 is least danceable and 100 is most danceable.",
  "energy": "Energy is a measure from 0 to 100 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy.",
  "liveness": "Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live.",
  "popularity": "The popularity of the track. The value will be between 0 and 100, with 100 being the most popular."
}
// Mapping of data types to the property to use for the y-axis
const yPropertyMap = {
  segments: 'confidence',
  bars: 'duration',
  beats: 'duration',
  sections: 'loudness',
  tatums: 'duration',
};

const SpotifyApi = ({ artist, track }) => {
  const cardRef = useRef(null);

  // Keep track of the selected data 
  const [selectedDataType, setSelectedDataType] = useState('segments');
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    setCardWidth(cardRef.current ? cardRef.current.offsetWidth : 0);
  }, [cardRef.current]);

  const handleChange = (event) => {
    setSelectedDataType(event.target.value);
  };

  const accessToken = SpotifyAuth();
  const trackData = TrackSearch({ accessToken, artist: artist, track: track });
  const audioAnalysis = AudioAnalysis({ accessToken, trackId: trackData?.id });
  const audioFeatures = AudioFeatures({ accessToken, trackId: trackData?.id });
  
  console.log('audioFeatures', audioFeatures)
  return (
    <Box>
      <Grid container spacing={2} direction='column'>
        <Grid item xs={1} sm={1} md={1}>
          <Card ref={cardRef} sx={{ width: 480, height: 450 }}>
            <CardHeader sx={{ m: 0 }} title="Spotify Audio Analysis" />
            <CardContent>
              <Grid container direction="row" alignItems="center" spacing={0}>
                <Grid item xs={5} sx={{ m: 1 }}>
                  <Typography variant='h4'>{track} </Typography>
                  <Typography variant='h4'>by</Typography>
                  <Typography variant='h4'>{artist}</Typography>
                </Grid>

                {audioFeatures && (
                  <Grid item xs={5} sx={{ m: 1 }}>
                    <Tooltip title={analysisDef.popularity} >
                      <Typography>Popularity: {trackData?.popularity}%</Typography>
                    </Tooltip>
                    <Tooltip title={analysisDef.danceability}>
                      <Typography>Danceability: {Math.ceil(audioFeatures?.danceability * 100)}%</Typography>
                    </Tooltip>
                    <Tooltip title={analysisDef.energy}>
                      <Typography>Energy: {Math.ceil(audioFeatures?.energy * 100)}%</Typography>
                    </Tooltip>
                    <Tooltip title={analysisDef.liveness}>
                      <Typography>Liveness: {Math.ceil(audioFeatures?.liveness * 100)}%</Typography>
                    </Tooltip>
                  </Grid>
                )}
              </Grid>
              <Divider sx={{ m: 1 }} />
              <Tooltip title={analysisDef[selectedDataType]}  placement="right">
                <Select value={selectedDataType} onChange={handleChange} sx={{ height: '30px', overflow: 'hidden' }}>
                  <MenuItem value='segments'>Segments</MenuItem>
                  <MenuItem value='bars'>Bars</MenuItem>
                  <MenuItem value='beats'>Beats</MenuItem>
                  <MenuItem value='sections'>Sections</MenuItem>
                  <MenuItem value='tatums'>Tatums</MenuItem>
                </Select>
              </Tooltip>

              {/* <AudioAnalysis selectedDataType={selectedDataType} /> */}
              {audioAnalysis && (
                <>
                  <LineChart
                    fontFamily={theme.typography.fontFamily}
                    width={cardWidth}
                    // rangeEnd = {100}
                    data={audioAnalysis[selectedDataType].map(item => ({
                      start: item.start,
                      y: item[yPropertyMap[selectedDataType]],
                    }))}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box >
  );
};

export default SpotifyApi;
