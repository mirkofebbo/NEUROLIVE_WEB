import React, { useState, useEffect } from 'react';
import RatingsBarChart from '../componants/charts/Behavioural';

const App = () => {
  return (
    <div>
      <h1>Behavior Data Visualization</h1>
      <RatingsBarChart day={'SAT'} section={'connection'} />
    </div>
  );
};

export default App;
