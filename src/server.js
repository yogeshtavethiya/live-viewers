const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const viewers = {};

// Route to start tracking a website
app.post('/api/track', (req, res) => {
    console.log("Received track request:", req.body);
  const { websiteUrl } = req.body;
  if (!viewers[websiteUrl]) {
    viewers[websiteUrl] = { liveViewers: 0, recentMembers: [] };
  }
  res.json({ message: 'Tracking started', liveViewers: viewers[websiteUrl].liveViewers });
});

app.post('/api/activity', (req, res) => {
  const { websiteUrl, type } = req.body;
  
  if (type === 'enter') {
    viewers[websiteUrl].liveViewers += 1;
  } else if (type === 'leave') {
    viewers[websiteUrl].liveViewers -= 1;
  }
  
  res.json({ message: 'Activity updated', liveViewers: viewers[websiteUrl].liveViewers });
});

app.get('/api/viewers', (req, res) => {
  const { websiteUrl } = req.query;
  const liveViewers = viewers[websiteUrl] ? viewers[websiteUrl].liveViewers : 0;
  res.json({ liveViewers });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
