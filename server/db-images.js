const { config } = require('./config');
const logger = require('../logger');
const MongoClient = require('mongodb').MongoClient;
const url = `mongodb://mongo:27017/${config.databaseName}`;

function getImagesFromDb(req, res) {
  if (!req?.params) res.status(404).send({ Success: false });
  res.status(200).send({ Success: true })
  logger.verbose(`getImagesFromDb ${inspect(req.params, false, 10, true)}`);
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(config.databaseName);
    dbo.collection(config.collectionName).findOne({}, function(err, result) {
      if (err) throw err;
      console.log(result.name);
      db.close();
    });
  });
}

function createDbAndCollection() {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(config.databaseName);
    dbo.createCollection(config.collectionName, function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });
}

function insertText(reqBody) {
  logger.info('reqBody',reqBody);
  createDbAndCollection();
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(config.databaseName);
    dbo.collection(config.collectionName).insertOne(insertData, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
}

module.exports = { createDbAndCollection, getImagesFromDb, insertText };