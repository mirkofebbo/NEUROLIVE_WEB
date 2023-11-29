import React, { useState, useEffect } from 'react';
import { Typography, Container, FormControl, FormControlLabel, Checkbox, Button, Grid } from '@mui/material';
import axios from 'axios';
import { csvParse } from 'd3';
import DwChart from '../componants/charts/DwChart';

const DW = () => {
  const [data, setData] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [allParticipants, setAllParticipants] = useState([]);

  const API_KEY = process.env.API_KEY;

  useEffect(() => {

    const config = {
      headers: {
        'api-key': API_KEY
      }
    };
    // Fetch data from your backend server
    axios.get('http://158.223.47.108:5000/data/dw/breathing/sat/small_breathing.csv', config)
      .then(response => {
        // Assuming the server returns the CSV file as a string
        const parsedData = csvParse(response.data);
        const participants = Object.keys(parsedData[0]).filter(key => key !== 'index');
        setData(parsedData);
        setAllParticipants(participants);
        setSelectedParticipants(participants); // Set all participants as default
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
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
      <video width="750" height="500" controls>
        <source src="http://localhost:5000/data/dw/video/sat/test.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <DwChart data={data} selectedParticipants={selectedParticipants} />
    </>
  );
}

export default DW;
