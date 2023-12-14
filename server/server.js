const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();  

// Use Environment Variables for Sensitive Data 
const PORT = process.env.PORT || 5000;
const ALLOWED_DOMAIN = process.env.ALLOWED_DOMAIN;
const API_KEY = process.env.API_KEY;

// Restrict CORS Policy
const corsOptions = {
  origin: ALLOWED_DOMAIN,
  optionsSuccessStatus: 200
};
app.use(cors());

// Serve static files
app.use('/data', express.static(path.join(__dirname, 'data')));

function validateApiKey(req, res, next) {
  const apiKey = req.headers['api-key'];
  if (apiKey && apiKey === API_KEY) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
}

app.use(validateApiKey);

function resolveFilePath(req) {
  const { project, dataType, day, userId } = req.params;
  const basePath = path.join(__dirname, 'data'); // Adjust 'data' to your data directory

  let filePath = path.join(basePath, project, dataType, day, userId);
  if (fs.existsSync(filePath)) {
    return filePath;
  } else {
    return null;
  }
}


app.get('/data/:project/:dataType/:day/:userId', (req, res) => {
  try {
    const filePath = resolveFilePath(req);
    console.log(filePath)
    if (filePath) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('File not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
