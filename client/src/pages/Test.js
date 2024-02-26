import React, { useState, useEffect } from 'react';
import BehaviorDataVisualization from '../componants/charts/Behavioural';

const App = () => {
  return (
    <div>
      <h1>Behavior Data Visualization</h1>
      <BehaviorDataVisualization day={'SAT'} />
    </div>
  );
};

export default App;
