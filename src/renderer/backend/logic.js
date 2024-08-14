const fs = require("fs");
import { bulkInsert } from "./dbMutations";
import { spellsMaster } from "./spells/classSpellsMaster";

export class Items {
  constructor(eqDir) {
    this.eqDir = eqDir;
  }
  _getInventoryFilesArray() {
    try {
      const files = fs.readdirSync(this.eqDir);
      const regex = /^.*Inventory.txt$/;
      const filteredFiles = files.filter((file) => {
        return regex.test(file);
      });
      return filteredFiles.map((file) => {
        return `${this.eqDir}/${file}`;
      });
    } catch (err) {
      throw new Error(`Failed to read directory ${this.eqDir}: ${err.message}`);
    }
  }

  _processInventoryFiles(inventoryFilesArray) {
    const results = [];
    try {
      for (let i = 0; i < inventoryFilesArray.length; i++) {
        const path = inventoryFilesArray[i];
        const fileContents = fs.readFileSync(path, "utf-8");
        // Split file on new lines
        const lines = fileContents.split(/\r?\n/);
        // First line in inventory file is not needed / wanted
        lines.shift();
        // Turn each line into array
        const arrayOfArrays = lines.map((line) => {
          const charName = path
            .replace("-Inventory.txt", "")
            .replace(this.eqDir, "")
            .replace("/", "");
          const lineArray = line.split("\t");
          lineArray.unshift(charName);
          return lineArray;
        });
        results.push(arrayOfArrays);
      }
      return results.flat();
    } catch (err) {
      throw new Error(`processInventoryFiles error: ${err.message}`);
    }
  }

  /**
   * Wrapper for the above methods.
   * Parses all inventory files for a given directory, then deletes the items table, then performs a mass insert
   */

  parseItems() {
    try {
      const inventoryFilesArray = this._getInventoryFilesArray();
      if (inventoryFilesArray.length === 0 || inventoryFilesArray === undefined) {
        console.warn("Could not find inventory files.");
        return;
      }

      const processedInventoryFiles = this._processInventoryFiles(inventoryFilesArray);
      if (processedInventoryFiles.length === 0 || processedInventoryFiles.length === undefined) {
        console.log("Could not process inventory files.");
        return;
      }

      bulkInsert("items", processedInventoryFiles);
    } catch (err) {
      throw new Error(`parseItems error: ${err.message}`);
    }
  }

  getItems(params) {
    const db = require("better-sqlite3")("./master.db");
    const pageSize = params["pageSize"] || 100;
    const page = params["page"] || 0;
    const offset = page * pageSize;
    const itemName = params["itemName"] || "";
    const charName = params["charName"] || "All";

    let itemQueryParams = [`%${itemName}%`];
    let countQueryParams = [`%${itemName}%`];

    let baseQuery = `SELECT charName, itemName, itemLocation, itemId, itemCount FROM items WHERE itemName LIKE ?`;
    let paginationQuery = ` LIMIT ? OFFSET ?`;
    let countQuery = `SELECT COUNT(*) FROM items WHERE itemName LIKE ?`;

    if (charName !== "All" && charName !== "ALL" && charName !== "") {
      baseQuery += ` AND charName = ?`;
      countQuery += ` AND charName = ?`;
      itemQueryParams.push(charName);
      countQueryParams.push(charName);
    }

    itemQueryParams.push(pageSize);
    itemQueryParams.push(offset);

    const finalQuery = baseQuery + paginationQuery;
    try {
      const results = db.prepare(finalQuery).all(...itemQueryParams);
      const count = db.prepare(countQuery).get(...countQueryParams);

      const resultsObject = {
        count: count["COUNT(*)"],
        results,
      };
      return resultsObject;
    } catch (err) {
      throw new Error(`getItems error: ${err.message}`);
    } finally {
      db.close();
    }
  }
}

export class MissingSpells {
  constructor(eqDir) {
    this.eqDir = eqDir;
  }

  _getSpellsFileArray() {
    try {
      const path = fs.readdirSync(this.eqDir);
      const regex = /^.*-Spellbook\.txt$/;
      const spellFiles = path.filter((file) => regex.test(file));
      return spellFiles.map((file) => `${this.eqDir}/${file}`);
    } catch (err) {
      console.log("_getSpellsFileArray error block");
      throw new Error(`_getSpellsFileArray error: ${err.message}`);
    }
  }
  // return value: 2d array, each child array is a row: [charName, charLevel, spellName]
  _proceessSpellFiles(spellFiles) {
    const results = [];
    try {
      for (let i = 0; i < spellFiles.length; i++) {
        const path = spellFiles[i];
        // Remove carriage returns from parsed file
        const fileContents = fs.readFileSync(path, "utf-8").replace(/\r/g, "");
        // Split file on new lines
        const lines = fileContents.split("\n");
        // Turn each line into an array
        const linesToArrays = lines.map((line) => {
          const charName = path
            .replace("-Spellbook.txt", "")
            .replace(this.eqDir, "")
            .replace("/", "");

          const lineArray = line.split("\t");
          lineArray.unshift(charName);
          return lineArray;
        });
        results.push(linesToArrays);
      }
      return results.flat();
    } catch (err) {
      throw new Error(`_processSpellFiles error: ${err.message}`);
    }
  }

  // Return value: { charName: {charClass: string, charClassTally: Record<string, number>}}
  _determineCharClass(spellFiles) {
    const charMap = {};
    const charClassArray = [];
    for (const row of spellFiles) {
      const charName = row[0];
      const spellName = row[2];

      if (!charMap[charName])
        charMap[charName] = {
          charClass: null,
          charClassTally: {},
        };

      if (charMap[charName].charClass) {
        continue;
      }
      // Loop over each key in `spellsMaster`
      for (const charClassKey in spellsMaster) {
        if (spellName in spellsMaster[charClassKey]) {
          if (!charMap[charName].charClassTally[charClassKey]) {
            charMap[charName].charClassTally[charClassKey] = 1;
          } else {
            charMap[charName].charClassTally[charClassKey] += 1;
            // If we have 8 matches, set the charClass for a character and break out of the loop
            if (charMap[charName].charClassTally[charClassKey] >= 8) {
              charMap[charName].charClass = charClassKey;
              charClassArray.push([charName, charClassKey]);
              break;
            }
          }
        }
      }
    }
    // Return array, to match convention of returning arrays:
    return charClassArray;
  }
  // Return value: 2d array, each child array is a row [charName, charLevel, spellName]
  _determineMissingSpells(spellFiles, charClassArray) {
    const missingSpellsArray = [];
    for (const element of charClassArray) {
      const charName = element[0];
      const charClass = element[1];
      const classSpells = JSON.parse(JSON.stringify(spellsMaster[charClass]));
      for (const row of spellFiles) {
        const spellName = row[2];
        if (spellName in classSpells) {
          delete classSpells[spellName];
        }
      }

      // Push rows onto missingSpellsArray -- this way our 'bulkInsert' helper can perform the insert
      Object.entries(classSpells).forEach(([spellName, level]) => {
        missingSpellsArray.push([charName, spellName, level]);
      });
    }
    // Return array, to match convention of returning arrays:
    return missingSpellsArray;
  }

  parseMissingSpells() {
    try {
      const missingSpellsFilesArray = this._getSpellsFileArray();
      if (missingSpellsFilesArray.length === 0 || missingSpellsFilesArray === undefined) {
        console.warn("Could not find spells files.");
        return;
      }

      const processedSpellFiles = this._proceessSpellFiles(missingSpellsFilesArray);
      if (processedSpellFiles.length === 0 || processedSpellFiles === undefined) {
        console.warn("Could not process spells files.");
        return;
      }

      const charClassArray = this._determineCharClass(processedSpellFiles);
      const missingSpells = this._determineMissingSpells(processedSpellFiles, charClassArray);

      bulkInsert("missingSpells", missingSpells);
    } catch (err) {
      throw new Error(`parseMissingSpells error: ${err.message}`);
    }
  }

  getMissingSpells(params) {
    const db = require("better-sqlite3")("./master.db");
    const page = params["page"] || 1;
    const pageSize = params["pageSize"] || 25;
    const charName = params["charName"] || "ALL";

    const paramsArray = [];
    const countQueryParams = [];

    let baseQuery = `SELECT charName, spellName, level FROM missingSpells`;
    const filtersQuery = ` WHERE charName = ?`;
    let countQuery = `SELECT COUNT(*) FROM missingSpells`;
    const paginationQuery = ` LIMIT ? OFFSET ?`;

    if (charName !== "ALL") {
      baseQuery = baseQuery + filtersQuery;
      countQuery += filtersQuery;
      paramsArray.push(charName);
      countQueryParams.push(charName);
    }

    paramsArray.push(pageSize);
    paramsArray.push((page - 1) * pageSize);

    const finalQuery = baseQuery + paginationQuery;

    try {
      const results = db.prepare(finalQuery).all(...paramsArray);
      const count = db.prepare(countQuery).get(...countQueryParams);

      const resultsObject = {
        count: count["COUNT(*)"],
        results,
      };
      return resultsObject;
    } catch (err) {
      throw new Error(`getMissingSpells error: ${err.message}`);
    } finally {
      db.close();
    }
  }
}

export class CampOut {
  constructor(eqDir) {
    this.eqDir = eqDir;
  }

  _getLogFilesArray() {
    try {
      const path = fs.readdirSync(`${this.eqDir}/logs/`);
      const fileNameRegex = /^eqlog_.*_P1999PVP\.txt$/;
      const logFiles = path.filter((file) => fileNameRegex.test(file));
      return logFiles.map((file) => `${this.eqDir}/logs/${file}`);
    } catch (err) {
      throw new Error(`_getLogFilesArray error: ${err.message}`);
    }
  }

  async _processLogFiles(logFiles) {
    const eqDir = this.eqDir.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const filePathRegex = new RegExp(`^${eqDir}/logs/eqlog_(.*?)_P1999PVP\\.txt$`);
    const campOutRegex = /^\[(.*?)\] You have entered ([^.]+)/;
    const results = [];

    const processFile = (file) => {
      return new Promise((resolve, reject) => {
        const charNameMatch = file.match(filePathRegex);
        if (!charNameMatch) {
          console.error(`Filename does not match expected pattern: ${file}`);
          resolve();
          return;
        }

        const charName = charNameMatch[1];
        const readableStream = fs.createReadStream(file, {
          encoding: "utf8",
          highWaterMark: 50000,
        });

        let leftover = "";
        let matches = [];

        readableStream.on("data", (chunk) => {
          const lines = (leftover + chunk).split("\n");
          leftover = lines.pop();
          lines.forEach((line) => {
            line = line.trim();
            if (campOutRegex.test(line)) {
              const match = line.match(campOutRegex);
              if (match) {
                const timeStamp = match[1];
                const zone = match[2];
                matches.push([charName, zone, timeStamp]);
              }
            }
          });
        });

        readableStream.on("end", () => {
          if (leftover && campOutRegex.test(leftover)) {
            const match = leftover.match(campOutRegex);
            if (match) {
              const timeStamp = match[1];
              const zone = match[2];
              matches.push([charName, zone, timeStamp]);
            }
          }

          const row = matches.pop();
          results.push(row);
          resolve();
        });

        readableStream.on("error", (err) => {
          console.error(`Error reading file ${file}: ${err.message}`);
          reject(err);
        });
      });
    };

    const processAllFiles = async () => {
      for (const file of logFiles) await processFile(file);
      return results;
    };

    await processAllFiles();
    return results;
  }
  // Returns: 2d array of rows to insert
  async parseCampOutLocations() {
    try {
      const logFilesArray = this._getLogFilesArray();
      const rows = await this._processLogFiles(logFilesArray);
      bulkInsert("campOut", rows);
    } catch (err) {
      console.error(`parseCampOutLocation error: ${err.message}`);
    }
    const logFilesArray = this._getLogFilesArray();
    await this._processLogFiles(logFilesArray);
  }

  getCampOutLocations(params) {
    const db = require("better-sqlite3")("./master.db");
    const page = params["page"] || 1;
    const pageSize = params["pageSize"] || 25;
    const charName = params["charName"] || "ALL";

    const paramsArray = [];
    const countQueryParams = [];

    let baseQuery = `SELECT charName, zone, timeStamp FROM campOut`;
    const filtersQuery = ` WHERE charName = ?`;
    let countQuery = `SELECT COUNT(*) FROM campOut `;
    const paginationQuery = ` LIMIT ? OFFSET ?`;

    if (charName !== "ALL") {
      baseQuery = baseQuery + filtersQuery;
      countQuery += `WHERE charName = ?`;
      paramsArray.push(charName);
      countQueryParams.push(charName);
    }

    paramsArray.push(pageSize);
    paramsArray.push((page - 1) * pageSize);

    const finalQuery = baseQuery + paginationQuery;

    try {
      const results = db.prepare(finalQuery).all(...paramsArray);
      const count = db.prepare(countQuery).get(...countQueryParams);

      const resultsObject = {
        count: count["COUNT(*)"],
        results,
      };
      return resultsObject;
    } catch (err) {
      throw new Error(`getMissingSpells error: ${err.message}`);
    } finally {
      db.close();
    }
  }
}

export class YellowText {
  constructor(eqDir) {
    this.eqDir = eqDir;
  }

  _getLogFilesArray() {
    try {
      const path = fs.readdirSync(`${this.eqDir}/logs/`);
      const regex = /^eqlog_.*_P1999PVP\.txt$/;
      const logFiles = path.filter((file) => regex.test(file));
      return logFiles.map((file) => `${this.eqDir}/logs/${file}`);
    } catch (err) {
      throw new Error(`_getLogFilesArray error: ${err.message}`);
    }
  }

  async _processLogFiles(logFiles) {
    const eqDir = this.eqDir.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const filePathRegex = new RegExp(`^${eqDir}/logs/eqlog_(.*?)_P1999PVP\\.txt$`);
    const yellowTextRegex =
      /^\[(.*?)\] \[PvP\] (.*?) <.*?> has been defeated by (.*?) <.*?> in (.+)!$/;
    const results = [];

    const processFile = (file) => {
      return new Promise((resolve, reject) => {
        const charNameMatch = file.match(filePathRegex);
        if (!charNameMatch) {
          console.error(`Filename does not match expected pattern: ${file}`);
          resolve();
          return;
        }

        const charName = charNameMatch[1];
        const readableStream = fs.createReadStream(file, {
          encoding: "utf8",
          highWaterMark: 50000,
        });

        let leftover = "";
        let matches = [];

        readableStream.on("data", (chunk) => {
          const lines = (leftover + chunk).split("\n");
          leftover = lines.pop();
          lines.forEach((line) => {
            line = line.trim();
            if (yellowTextRegex.test(line)) {
              const match = line.match(yellowTextRegex);
              if (match) {
                const timeStamp = match[1];
                const victim = match[2];
                const killer = match[3];
                const zone = match[4];
                matches.push([killer, victim, zone, timeStamp]);
              }
            }
          });
        });

        readableStream.on("end", () => {
          if (leftover && yellowTextRegex.test(leftover)) {
            const match = leftover.match(yellowTextRegex);
            if (match) {
              const timeStamp = match[1];
              const zone = match[2];
              matches.push([charName, zone, timeStamp]);
            }
          }

          const row = matches.pop();
          if (row !== undefined) results.push(row);
          resolve();
        });

        readableStream.on("error", (err) => {
          console.error(`Error reading file ${file}: ${err.message}`);
          reject(err);
        });
      });
    };

    const processAllFiles = async () => {
      for (const file of logFiles) await processFile(file);
    };

    await processAllFiles();
    return results;
  }

  async parseYellowText() {
    try {
      const logFilesArray = this._getLogFilesArray();
      const rows = await this._processLogFiles(logFilesArray);
      bulkInsert("yellowText", rows);
    } catch (err) {
      console.error(`parseYellowText error: ${err.message}`);
    }
  }

  getYellowText(params) {
    const db = require("better-sqlite3")("./master.db");
    const page = params["page"] || 1;
    const pageSize = params["pageSize"] || 25;
    // save charName as 'killer', so we dont have to complicated frontend logic
    const charName = params["charName"] || "ALL";

    const paramsArray = [];
    const countQueryParams = [];

    let baseQuery = `SELECT charName, victim, zone, timeStamp FROM yellowText`;
    const filtersQuery = ` WHERE charName = ?`;
    let countQuery = `SELECT COUNT(*) FROM yellowText`;
    const paginationQuery = ` LIMIT ? OFFSET ?`;

    if (charName !== "ALL") {
      baseQuery = baseQuery + filtersQuery;
      countQuery += filtersQuery;
      paramsArray.push(charName);
      countQueryParams.push(charName);
    }

    paramsArray.push(pageSize);
    paramsArray.push((page - 1) * pageSize);

    const finalQuery = baseQuery + paginationQuery;

    try {
      const results = db.prepare(finalQuery).all(...paramsArray);
      const count = db.prepare(countQuery).get(...countQueryParams);

      const resultsObject = {
        count: count["COUNT(*)"],
        results,
      };
      return resultsObject;
    } catch (err) {
      throw new Error(`getYellowText error: ${err.message}`);
    } finally {
      db.close();
    }
  }
}
