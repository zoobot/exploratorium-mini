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
  return MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    // const existsDB = db.db.getMongo().getDBNames().indexOf(config.databaseName);
    var dbo = db.db(config.databaseName);
    const exists = dbo.listCollections({ name: config.collectionName }).hasNext()
    if (exists) return;
    
    return dbo.createCollection(config.collectionName, function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
      return;
    });
    
  });
}

function saveTextToDb(reqBody) {
  const insertData = {...reqBody, done: 0};
  createDbAndCollection();
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(config.databaseName);
    dbo.collection(config.collectionName).insertOne(insertData, function(err, res) {
      if (err) throw err;
      console.log(`Inserted ${reqBody.From}--${reqBody.Body} -- Done: ${insertData.done}`);
      db.close();
    });
  });
}

module.exports = { createDbAndCollection, getImagesFromDb, saveTextToDb };