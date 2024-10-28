const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(bodyParser.json());

const viewers = {};

app.get('/generate-script', (req, res) => {
  const { websiteUrl } = req.query;

  if (!websiteUrl) {
    return res.status(400).send('Website URL is required');
  }

  const script = `
    <script>
      (function() {
        const ws = new WebSocket('ws://localhost:5001');
        const websiteUrl = '${websiteUrl}';

        ws.onopen = () => {
          ws.send(JSON.stringify({ type: 'track', websiteUrl }));
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "viewersUpdate" && data.websiteUrl === websiteUrl) {
            const popup = document.createElement("div");
            popup.style.position = "fixed";
            popup.style.bottom = "20px";
            popup.style.right = "20px";
            popup.style.padding = "10px 20px";
            popup.style.backgroundColor = "#333";
            popup.style.color = "#fff";
            popup.style.borderRadius = "5px";
            popup.style.zIndex = "1000";
            popup.style.display = "none";
            popup.textContent = data.viewers +  ' watching now';
            document.body.appendChild(popup);
            popup.style.display = "block";
          }
        };

        window.addEventListener('beforeunload', () => {
          ws.close();
        });
      })();
    </script>
  `;
  
  res.send(`${script}`);
});

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Received:', data);

    if (data.type === 'track') {
      const { websiteUrl } = data;

      if (!viewers[websiteUrl]) {
        viewers[websiteUrl] = { liveViewers: 1 }; 
      } else {
        viewers[websiteUrl].liveViewers += 1; 
      }

      ws.send(JSON.stringify({ type: 'trackingStarted', viewers: viewers[websiteUrl].liveViewers }));

      broadcastViewersUpdate(websiteUrl);

      ws.on('close', () => {
        viewers[websiteUrl].liveViewers -= 1;
        if (viewers[websiteUrl].liveViewers < 0) {
          viewers[websiteUrl].liveViewers = 0; 
        }
        broadcastViewersUpdate(websiteUrl);
      });
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

function broadcastViewersUpdate(websiteUrl) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'viewersUpdate',
        websiteUrl,
        viewers: viewers[websiteUrl].liveViewers,
      }));
    }
  });
}

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
