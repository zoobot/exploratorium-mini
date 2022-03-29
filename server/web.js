const { config } = require('./config');
const { saveTextToDb, getAllFromDb } = require('./db-sqliteb');
const { inspect } = require('util');
const logger = require('../logger');

async function handleWebIn(req, res){
  console.log(req.body)
  if (!req?.body) res.status(404).send({ Success: false });
  const { phone, message, timestamp, email } = req.body;
  await saveTextToDb(phone, message, timestamp, email);
  const response = await getAllFromDb(res);
  console.log('response in handleWebIn', response)
  res.status(200).send({ Success: true, response })
  return;
}

async function handleWebOut(req, res){
  console.log(req.body)
  if (!req?.body) res.status(404).send({ Success: false });
  const response = getAllFromDb();
  console.log('response out',response)
  res.status(200).send({ Success: true, response })
  return;
}

module.exports = { handleWebIn, handleWebOut };