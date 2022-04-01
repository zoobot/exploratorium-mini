const { config } = require('./config');
const { saveTextToDb, getAllFromDb } = require('./db-sqliteb');
const { inspect } = require('util');
const logger = require('../logger');

const fs = require('fs');

function handleGetImages(req, res) {
  if (!req) res.status(404).send({ Success: false });

  console.log(`getImages ${inspect(req.params, false, 10, true)}`);
  const imageList = fs.readdirSync(config.imageFolder);
  console.log('imageList', imageList)
  res.status(200).send({ Success: true, Images: imageList })
  return;
}

async function handleWebIn(req, res){
  console.log(req.body)
  if (!req?.body) res.status(404).send({ Success: false });
  const { phone, message, timestamp, email } = req.body;
  await saveTextToDb(phone, message, timestamp, email);
  const response = await getAllFromDb(res);
  // console.log('response in handleWebIn', response)
  res.status(200).send({ Success: true, response })
  return;
}

async function handleWebOut(req, res){
  console.log(req.body)
  if (!req?.body) res.status(404).send({ Success: false });
  const response = getAllFromDb();
  // console.log('response out',response)
  res.status(200).send({ Success: true, response })
  return;
}


module.exports = { handleWebIn, handleWebOut, handleGetImages };