import { app } from "electron";
import path from "path";

export const getEqDir = () => {
  const db = require("better-sqlite3")(path.join(app.getPath("userData"), "master.db"));
  try {
    const query = `SELECT eqDir FROM eqDir WHERE id = 1`;
    const row = db.prepare(query).get();
    return row.eqDir;
  } catch (err) {
    console.error("getEqDir error:", err);
    return err;
  } finally {
    db.close();
  }
};

export const getCharNames = (activeView) => {
  const db = require("better-sqlite3")(path.join(app.getPath("userData"), "master.db"));
  try {
    const query = `SELECT DISTINCT charName FROM ${activeView}`;
    const names = db.prepare(query).all();
    // Convert from array of objects to array of strings
    const namesArray = names.map((name) => name.charName);
    // Frontend need ALL as an option
    return ["ALL", ...namesArray];
  } catch (err) {
    console.error("getCharNames error:", err);
    return ["ALL"];
  } finally {
    db.close();
  }
};
