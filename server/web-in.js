const { config } = require('./config');
const { saveTextToDb } = require('./db-images');
const { inspect } = require('util');
const logger = require('../logger');

function handleWebIn(req, res){
  console.log(req.body)
  if (!req?.body) res.status(404).send({ Success: false });
  res.status(200).send({ Success: true })
  saveTextToDb(req.body);
  return;
}

module.exports = { handleWebIn };