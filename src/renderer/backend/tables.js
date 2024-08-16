import { app } from "electron";
import path from "path";

export const createTables = () => {
  const db = require("better-sqlite3")(path.join(app.getPath("userData"), "master.db"));
  try {
    const itemsTable = `CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      charName TEXT,
      itemLocation TEXT,
      itemName TEXT,
      itemId INTEGER,
      itemCount INTEGER,
      itemSlots INTEGER,
      fileDate TEXT
    )`;

    const eqDirTable = `CREATE TABLE IF NOT EXISTS eqDir (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eqDir TEXT
      )`;

    const missingSpellsTable = `CREATE TABLE IF NOT EXISTS missingSpells (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        charName TEXT,
        spellName TEXT,
        level INTEGER
        )`;

    const yellowText = `CREATE TABLE IF NOT EXISTS yellowText (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        charName TEXT,
                        victim TEXT,
                        zone TEXT,
                        timeStamp TEXT
                        )`;

    const campOutTable = `CREATE TABLE IF NOT EXISTS campOut (
                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                          charName TEXT,
                          zone TEXT,
                          timeStamp TEXT
                          )`;

    db.exec(eqDirTable);
    db.exec(missingSpellsTable);
    db.exec(yellowText);
    db.exec(campOutTable);
    db.exec(itemsTable);

    console.log("TABLES CREATED");

    const eqDirExists = db.prepare("SELECT COUNT(*) AS count FROM eqDir").get();
    if (eqDirExists.count === 0) {
      const insertDefaultEqDir = `INSERT INTO eqDir (eqDir) VALUES (?)`;
      db.prepare(insertDefaultEqDir).run("");
      console.log("Default eqDir inserted: ");
    }
  } catch (err) {
    console.error("createTables error:", err);
    return err;
  } finally {
    console.log("closing create tables connection...");
    db.close();
  }
};
