const { config } = require('./config');
const { saveTextToDb, getAllFromDb } = require('./db-sqliteb');
const { inspect } = require('util');
const logger = require('../logger');
const fs = require('fs');

const randomIndex = (imageLength) => Math.floor(Math.random() * imageLength);

function getRandomArray(imageArray) {
  const imageLength = imageArray.length;
  const randoArr = imageArray.map((image) => imageArray[randomIndex(imageLength)]);
  const slicedArr = randoArr.slice(0, 2);
  return slicedArr;
}

function handleGetImages(req, res) { 
  if (!req) res.status(404).send({ Success: false });
  const imageArray = fs.readdirSync(config.imageFolder)
    .filter(file => file.endsWith('.png'));
  const randoArray = getRandomArray(imageArray);
  res.status(200).send({ Success: true, images: randoArray })
  return;
}

async function handleWebIn(req, res){
  if (!req?.body) res.status(404).send({ Success: false });
  const { phone, message, timestamp, email } = req.body;
  await saveTextToDb(phone, message, timestamp, email);
  const response = await getAllFromDb(res);
  res.status(200).send({ Success: true, response })
  return;
}

async function handleWebOut(req, res){
  if (!req?.body) res.status(404).send({ Success: false });
  const response = getAllFromDb();
  res.status(200).send({ Success: true, response })
  return;
}

module.exports = { handleWebIn, handleWebOut, handleGetImages };