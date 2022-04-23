const { config } = require('./config');
const { MessagingResponse, VoiceResponse } = require('./connect');
const { saveTextToDb } = require('./db-sqliteb');
const { inspect } = require('util');
const logger = require('../logger');


function handleTextIn(req, res){
  if (!req?.body?.Body.length) res.status(404).send({ Success: false });
  const { From, Body, Timestamp } = req.body;
  const msgNospaces = Body.replace(/\s/g, '-');
  const returnAutoText = `${config.outgoingMessageSMS}${msgNospaces}`;
  const twiml = new MessagingResponse();
  twiml.message(returnAutoText);
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
  saveTextToDb(From, Body, Timestamp);
  return;
}

function handleCallIn(req, res){
  if (!req?.body) res.status(404).send({ Success: false });
  const twiml = new VoiceResponse();  
  twiml.say({ voice: 'alice' }, config.outgoingMessag);
  logger.verbose(`handleCallIn ${inspect(req.body.Body, false, 10, true)}`);
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  
  twiml.record({
      timeout: 10,
      transcribe: true
  });
  const isThisVoice = twiml.toString()
  logger.verbose(`handleCallIn isThisVoice ${inspect(isThisVoice, false, 10, true)}`);
  res.end(isThisVoice);
  return;


  // client.transcriptions('TRXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
  //     .fetch()
  //     .then(transcription => console.log(transcription.dateCreated));

}

module.exports = { handleTextIn, handleCallIn };