const express = require('express');
const logger = require('../logger');
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const { config } = require('./config');
const { handleTextOut, status } = require('./twilio-out-sms');
const { handleTextIn, handleCallIn } = require('./twilio-in-twiml-autoreply');
const { getImagesFromDb } = require('./db-images');
const { handleWebIn } = require('./web-in');
const port = 3003;
const host = process.argv[2] || config.host || 'localhost';


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

app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

const gib = config?.gibberishString;
// text and voice webhooks and sms status callback
app.post(`/smsin/${gib}`, handleTextIn);
app.post(`/callin/${gib}`, handleCallIn);
app.post(`/status/${gib}`, status);

// send sms out to phone
app.post(`/smsout/${gib}`, handleTextOut);

// send text, image url to frontend
app.get(`/newcalls/${gib}`, getImagesFromDb);
app.post(`/webin/${gib}`, handleWebIn);

const server = app.listen(port, () => logger.info(`listening at ${host}:${port}`));
module.exports = server; // for testing
