const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
// Check if the database file already exists
function createDbIfNotExists(dbPath) {
  let db; 
  if (fs.existsSync(dbPath)) {
    console.log('Database already exists');
    db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);
    db.serialize(() => {
      db.run("CREATE TABLE IF NOT EXISTS setting (description TEXT, value TEXT)");
    })
  } else {
    // Database file does not exist, create a new one
    db = new sqlite3.Database(dbPath, sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE);
    db.serialize(() => {
      db.run("CREATE TABLE setting (description TEXT, value TEXT)");
      console.log('Database created');
      db.run(`INSERT INTO setting (description, value) VALUES ('default_folder', '')`)      
    })
  }

  return db
}

function getAppSettings(db) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM setting", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = { createDbIfNotExists, getAppSettings }