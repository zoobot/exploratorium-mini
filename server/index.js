const express = require('express');
const logger = require('../logger');
const app = express();
const cors = require('cors');
const ws = require('ws');
const wsServer = new ws.Server({ noServer: true });
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const { config } = require('./config');
const { handleTextOut, status } = require('./twilio-out-sms');
const { handleTextIn, handleCallIn } = require('./twilio-in-twiml-autoreply');
const { handleWebIn, handleWebOut, handleGetImages } = require('./web');

const port = 3003;
const host = process.argv[2] || config.host || 'localhost';

if (host !== 'localhost') {
  const { motionSensor } = require('./motion-sensor');
  motionSensor(wsServer);
} else {
  const { motionSensorFake } = require('./motion-sensor');
  motionSensorFake(wsServer);
}

// this is for whitelisting hosts for cors
const whitelist = [
  config.host,
  'http://localhost:3003',
];

const options = {
  origin(origin, callback) {
    console.log('origin', origin)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(options));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
 });

 app.use((err, req, res, next) => {
  logger.error(err.stack)
  next(err)
});

app.use( (err, req, res, next) =>{
  res.status(500)
  res.render('error', { error: err })
}); 

// app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

const gib = config?.gibberishString;
// text and voice webhooks and sms status callback
app.post(`/smsin/${gib}`, (req, res) => {
  
  wsServer.on('connection', function connection(ws) {
    ws.send(JSON.stringify({
      phone: req.body.From, 
      body: req.body.Body,
      timestamp: req.body.Timestamp,
    }));
  });
  handleTextIn(req, res);
});

app.post(`/callin/${gib}`, handleCallIn);
app.post(`/status/${gib}`, status);

// send sms out to phone
app.post(`/smsout/${gib}`, handleTextOut);

// send text, image url to frontend
app.get(`/newcalls/${gib}`, handleWebOut);
app
  .post(`/webin/CBI1-Thrav2EDPAyAGo2Cg`, handleWebIn)
  .get(`/webin/CBI1-Thrav2EDPAyAGo2Cg`, handleWebOut);

app.get(`/images/CBI1-Thrav2EDPAyAGo2Cg`, handleGetImages);

const server = app.listen(port, () => logger.info(`listening at ${host}:${port}`));

wsServer.on('connection', socket => {
  socket.on('message', message => console.log(message));
});

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});

module.exports = {server, wsServer}; // for testing
