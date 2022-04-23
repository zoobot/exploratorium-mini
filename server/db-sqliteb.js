const path = require('path');
const sqlite3 = require('better-sqlite3');

const { inspect, promisify } = require('util');

const { config } = require('./config');
const logger = require('../logger');
const options = { verbose: console.log }

const db = new sqlite3(config.databaseName, options);
initTables(db)

function cleanupData() {
  // empty all data from db tables
  db.clean_db = async function() {
    await db.run(`DELETE FROM ${config.tableName}`);
    db.run("vacuum");
  }
}

async function saveTextToDb(phone, message, timestamp, email) {
  try {
   const query = `INSERT OR REPLACE INTO ${config.tableName} 
     (phone, message, timestamp, email, done) 
     VALUES (?, ?, ?, ?, ?);`;
   const stmt =  db.prepare(query);
   const response = stmt.run(phone, message, timestamp, email, 0);
   return response;
  } catch (err) {
    console.error(`Error: ${inspect(err, false, 3, true)}`);
    return err;
  }
}

async function getAllFromDb() {
  try {
   const query = `SELECT * FROM ${config.tableName}`;
   const stmt =  db.prepare(query);
   const response = stmt.all();
   return response;
  } catch (err) {
    console.error(`Error: ${inspect(err, false, 3, true)}`);
    return err;
  }
}

async function getOneFromDb(message) {
  try {
    const query = `SELECT * FROM ${config.tableName} WHERE message = ?`;
    const response = await db.get(query, message);
    return response;
  } catch (err) {
    console.error(`Error: ${inspect(err, false, 3, true)}`);
    return err;
  }
}

async function initTables(db) {
  const query = `CREATE TABLE IF NOT EXISTS ${config.tableName} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT,
    message TEXT UNIQUE NOT NULL,
    timestamp TEXT,
    email TEXT,
    url TEXT,
    done INTEGER
  )`;
  await db.exec(query)
  return;
}

async function initDb() {
 await initTables(db)
 return db;
}

module.exports = { saveTextToDb, getAllFromDb, getOneFromDb, initDb };