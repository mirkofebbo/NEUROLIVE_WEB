import React, { useState } from 'react';
import RatingsBarChart from '../componants/charts/Behavioural';
import { Select, MenuItem, Tooltip, Card, CardContent } from '@mui/material';

const App = () => {
  const [selectedDay, setSelectedDay] = useState('SAT');
  const [selectedSection, setSelectedSection] = useState('connection');

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
  };

  return (
    <div>
      <h1> How Shall We Begin Again Behavior Data</h1>
      <Card>
        <CardContent>
          <Tooltip title='Day Selection' placement="right">
            <Select
              value={selectedDay}
              onChange={handleDayChange}
              sx={{ height: '30px', overflow: 'hidden', marginRight: '10px' }}
            >
              <MenuItem value='SAT'>SATURDAY</MenuItem>
              <MenuItem value='SUN'>SUNDAY</MenuItem>
            </Select>
          </Tooltip>
          <Tooltip title='Section Selection' placement="right">
            <Select
              value={selectedSection}
              onChange={handleSectionChange}
              sx={{ height: '30px', overflow: 'hidden' }}
            >
              <MenuItem value='connection'>Connection</MenuItem>
              <MenuItem value='familiarity'>Familiarity</MenuItem>
              <MenuItem value='focus'>Focus</MenuItem>
              {/* Add more sections as needed */}
            </Select>
          </Tooltip>
        </CardContent>
      </Card>
      <RatingsBarChart day={selectedDay} section={selectedSection} />
    </div>
  );
};

export default App;
