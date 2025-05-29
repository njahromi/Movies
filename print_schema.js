const sqlite3 = require('sqlite3').verbose();
const path = require('path');

function printTablesAndSchema(dbPath) {
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      return console.error(`Error opening ${dbPath}:`, err.message);
    }
    console.log(`\nTables in ${dbPath}:`);
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
      if (err) {
        return console.error(err.message);
      }
      tables.forEach((tableObj) => {
        const table = tableObj.name;
        console.log(`\nSchema for table: ${table}`);
        db.all(`PRAGMA table_info(${table})`, [], (err, columns) => {
          if (err) {
            return console.error(err.message);
          }
          columns.forEach((col) => {
            console.log(`  ${col.name} (${col.type})`);
          });
        });
      });
      // Print sample rows for each table
      tables.forEach((tableObj) => {
        const table = tableObj.name;
        db.all(`SELECT * FROM ${table} LIMIT 5`, [], (err, rows) => {
          if (err) {
            console.error(`Error fetching rows from ${table}:`, err.message);
          } else {
            console.log(`\nSample rows from ${table} in ${dbPath}:`);
            console.log(rows);
          }
        });
      });
    });
  });
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
}

printTablesAndSchema(path.join(__dirname, 'db', 'movies.db'));
printTablesAndSchema(path.join(__dirname, 'db', 'ratings.db')); 