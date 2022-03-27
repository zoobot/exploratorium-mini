const { inspect } = require('util');
const logger = require('../logger');
const { config } = require('./config');
const { client } = require('./connect');

const featureFlag = {
 txtsOn: true, //Actually send the SMS through Twilio messaging if false, it will just log potential sms
 testingMagic: true, //for statusCallback live
 logStatus: false
}

function handleTextOut(req, res) {
  if (!req?.body) res.status(404).send({ Success: false });
  res.status(200).send({ Success: true })
  logger.verbose(`handleTextOut ${inspect(req, false, 10, true)}`);
  sendTxt(req?.body.to, req?.body.msg);
}

async function sendTxt(to, message) {
  const functionName = 'sendTxt';
  try {
    logger.verbose(`${functionName} ${to} ${config.fromPhone} ${message}`);
    const data = await setData(to, config.fromPhone, message);
 
    if (featureFlag.txtsOn === true) {
      const response = await client.messages.create(data)
        .then(messageResponse => messageResponse)
        .catch(error => {
          logger.error(`${functionName} error ${to}${message} ${inspect(error, false, 3, true)} CATCH ERROR`);
          return error;
        })
        .done();
      if (await response && response.includes('Error')) logger.error(`${functionName} CATCH ERROR ${response} CATCH ERROR`);
      return await response;
    }
    return;
  } catch (err) {
    logger.error(`${functionName} to: ${to} ${err} CATCH`);
    return false;
  }
 }

function setData(to, from, body) {
 return { to, body, from, 'messagingServiceSid': config.messagingServiceSid, statusCallback: config.statusCallback };
}

function status(req,res) {
  const function_name = 'status';
  if (!req) res.status(500).send({ Success: false });
  if (!req?.body) res.status(422).send({ Success: false }); 
  res.sendStatus(200);
  if (featureFlag.logStatus) logTwilioStatus(req.body);
  return; 
}

async function logTwilioStatus(reqBody) {
  const function_name = 'processTwilioStatus';
  try {
    const { MessageSid, status, To, From,  MessageStatus, ErrorCode } = reqBody || {};
    if (status === 'undelivered' || ErrorCode) {
      logger.verbose(`${function_name} undelivered || ${ErrorCode} - MessageSid: ${MessageSid} 
        To ${To} From: ${From} status ${status}  MessageStatus ${MessageStatus}`);
    }

    if (status !== 'sent') {
      logger.verbose(`${function_name} !sent - MessageSid: ${MessageSid} 
        To ${To} From: ${From} status ${status}  MessageStatus ${MessageStatus}`);
    }
    return;
  } catch(err) {
    logger.error(`${function_name} CATCH ${err}`);
    return err;
  }
}

module.exports = { status, handleTextOut };