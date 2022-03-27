// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID at twilio.com/console
// Provision API Keys at twilio.com/console/runtime/api-keys
// and set the environment variables. See http://twil.io/secure
const { config } = require('./config.js');

const accountSid = config.accountSid || process.env.TWILIO_ACCOUNT_SID;
const apiKey = config.apiKey || process.env.TWILIO_API_KEY;
const apiSecret = config.apiSecret || process.env.TWILIO_API_SECRET;
const TwiMLAppSID = config.TwiMLAppSID;

// For sending sms
const client = require('twilio')(apiKey, apiSecret, { accountSid: accountSid });

// For receiving sms/voice and sending automated responses
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const MessagingResponse = require('twilio').twiml.MessagingResponse;

module.exports = { client, MessagingResponse, VoiceResponse };