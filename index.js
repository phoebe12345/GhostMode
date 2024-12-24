const express = require('express')
const path = require('path')

const port = process.env.PORT || 5006

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('pages/index')
})

app.get('/read', (req, res) => {
  const timestamp = req.query.timestamp;

  if (!timestamp) {
      return res.status(400).json({ error: 'Timestamp is required' });
  }

  res.json({
      message: 'Data read successfully',
      timestamp: timestamp + 2,
      data: [1, 2, 3], // Example data
  });
});

app.post('/send', (req, res) => {
  console.log('im heree', req.body)

  if(!req.body){
    return res.status(400).json({error: 'message cannot be empty'});
  }
  const inputString = req.body.inputString;
  if(!inputString){
    return res.status(400).json({error: 'inputString does not exist'});
  }
  const trimmed = inputString.trim();
  
  if(trimmed.length == 0){
    return res.status(400).json({error: 'message cannot be spaces'});
  }

  console.log('hhhh',req.body, trimmed);
  res.json({ receivedString: trimmed });
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
