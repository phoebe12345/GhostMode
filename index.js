const express = require('express')
const path = require('path')
const cors = require('cors');

const port = process.env.PORT || 5006

const messages = [
  {author:'one', message:"hello000000", timestamp: 0},
  {author:'two', message:"hello hello", timestamp: 2},
  {author:'three', message:"how are you", timestamp: 3},
]
const app = express()
app.use(cors());
app.use(express.json());

// Serve the static files from the React build folder
app.use(express.static(path.join(__dirname, 'build')));

// Serve the React app's index.html for any non-API route
app.get('/', (__, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.get('/read', (req, res) => {
  const timestamp = req.query.timestamp;

  if (!timestamp) {
      return res.status(400).json({ error: 'Timestamp is required' });
  }
  const last_index=messages.length - 1
  res.json({
      message: 'Data read successfully',
      timestamp: messages[last_index].timestamp,
      data: messages
  });
});

app.post('/send', (req, res) => {
  console.log('Received message:', req.body);

  if (!req.body || !req.body.inputString) {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }

  const inputString = req.body.inputString.trim();

  if (inputString.length === 0) {
    return res.status(400).json({ error: 'Message cannot be only spaces' });
  }

  // Create a new message object
  const newMessage = {
    author: 'User', 
    message: inputString,
    timestamp: Date.now() 
  };

  messages.push(newMessage);

  console.log('Message added:', newMessage);
  
  res.json({
    message: 'Message sent successfully',
    newMessage,
    allMessages: messages
  });
});


const server = app.listen(port, () => {
  console.log(`Listening on ${port}`)
})

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: gracefully shutting down')
  if (server) {
    server.close(() => {
      console.log('HTTP server closed')
    })
  }
})
