const fs = require('node:fs');
const path = require('node:path')
const sqlite3 = require('sqlite3').verbose();
const { app } = require('electron')

const userDataPath = app.getPath('userData');
const myDocumentsPath = app.getPath('documents');
const dbPath = path.join(userDataPath, 'your_database.db');

const db = createDbIfNotExists(dbPath, myDocumentsPath)

function getSqlScript(script_name) {
  const script = fs.readFileSync(`${__dirname}/scripts/${script_name}.sql`).toString()
  return script
}

function createDbIfNotExists(dbPath, myDocumentsPath) {
  const creationScript = getSqlScript('create_database')
  let db;
  try {
    if (fs.existsSync(dbPath)) {
      console.log('Database already exists');
      db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);
      db.serialize(() => {
        db.run(creationScript);
      })
    } else {
      // Database file does not exist, create a new one
      db = new sqlite3.Database(dbPath, sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE);
      const initialValues = getSqlScript('initial_values').replace("#", myDocumentsPath)
      db.serialize(() => {
        db.run(creationScript);
        console.log('Database created');
        db.run(initialValues)
      })
    }
    return db

  } catch (error) {
    console.error(error)
  }
}

function getAppSettings() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM setting", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const settings = rows.reduce((accumulator, row) => {
          accumulator[row.description] = row.value
          return accumulator
        }, {})
        // console.log(settings);
        // console.log(app.getPath('userData'));
        resolve(settings);
      }
    });
  });
}

function getDefaultFolderSetting() {
  return getAppSettings()
    .then(appSettings => {
      const defaultFolderSetting = appSettings.default_folder
      // console.log(defaultFolderSetting);
      return defaultFolderSetting
    })
    .catch(err => {
      console.error('Error fetching app settings:', err);
    });

}

function setDefaultFolderSetting(newPath) {
  return new Promise((resolve, reject) => {
    db.run("UPDATE setting SET value = ? WHERE description = 'default_folder'", [newPath], (err) => {
      if (err) {
        console.error('Error setting default_folder setting:', err);
        reject(err);
      } else {
        resolve()
      }
    });
  });
}

function setCorrelativeIdSetting(newValue) {
  return new Promise((resolve, reject) => {
    db.run("UPDATE setting SET value = ? WHERE description = 'proposal_id'", [parseInt(newValue)], (err) => {
      if (err) {
        console.error('Error setting proposal_id setting:', err);
        reject(err);
      } else {
        resolve()
      }
    });
  });
}

module.exports = {
  db,
  getAppSettings,
  getDefaultFolderSetting,
  setDefaultFolderSetting,
  setCorrelativeIdSetting
}