export const setEqDir = (eqDir) => {
  const db = require("better-sqlite3")("./master.db");
  try {
    const preparedQuery = db.prepare(`UPDATE eqDir SET eqDir = ? WHERE id = 1`);
    preparedQuery.run(eqDir);
    console.log("eqDir set");
  } catch (err) {
    console.error("setEqDir error:", err);
  } finally {
    db.close();
  }
};

export const deleteTable = (tableName) => {
  const db = require("better-sqlite3")("./master.db");
  const stmt = db.prepare(`DELETE FROM ${tableName}`);
  try {
    stmt.run();
    console.log(`Table ${tableName} deleted`);
  } catch (err) {
    console.log(`Delete ${tableName} table error:`, err);
  } finally {
    db.close();
  }
};

export const bulkInsert = (tableName, dataArray) => {
  const db = require("better-sqlite3")("./master.db");
  const colNamesQuery = `PRAGMA table_info(${tableName})`;
  const colNames = db
    .prepare(colNamesQuery)
    .all()
    .map((col) => col.name);
  // remove 'id' string from colNames
  colNames.shift();
  let insertQueryString = `INSERT INTO ${tableName} (`;
  let placeHoldersString = ` VALUES (`;
  // dynmically create insert string
  for (let i = 0; i < colNames.length; i++) {
    const col = colNames[i];
    if (i === colNames.length - 1) {
      insertQueryString += `${col})`;
      placeHoldersString += `?)`;
    } else {
      insertQueryString += `${col}, `;
      placeHoldersString += `?, `;
    }
  }
  insertQueryString += placeHoldersString;

  const massInsert = db.transaction(() => {
    // Delete the table before inserting -- Everytime the app performs a parse, we never want old data.
    deleteTable(tableName);
    const stmt = db.prepare(insertQueryString);
    for (const row of dataArray) {
      if (row.length === colNames.length) {
        stmt.run(row);
      }
    }
  });

  try {
    massInsert();
    console.log(`mass insert for ${tableName} completed.`);
  } catch (err) {
    console.error(`bulkInsert error for ${tableName} error:`, err);
  } finally {
    db.close();
  }
};
