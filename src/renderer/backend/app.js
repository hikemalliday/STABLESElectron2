import express from "express";
import cors from "cors";
import { createTables } from "./tables.js";
import { setEqDir } from "./dbMutations.js";
import { getEqDir, getCharNames } from "./dbQueries.js";
import { Items, MissingSpells, CampOut, YellowText } from "./models.js";
import { testEqDir, testLogsDir } from "./utils.js";

export const backend = () => {
  const app = express();
  const port = 3000;

  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get("/get_items", (req, res) => {
    try {
      const eqDir = getEqDir();
      const ItemsInstance = new Items(eqDir);
      const items = ItemsInstance.getItems(req.query);
      res.send(items);
    } catch (err) {
      console.error("/get_items error:", err);
      res.status(500).send("Error getting items");
    }
  });

  app.get("/get_eq_dir", (_, res) => {
    try {
      const eqDir = getEqDir();
      res.send(eqDir);
    } catch (err) {
      console.error("/get_eq_dir error:", err);
      res.status(500).send("Error fetching eqDir");
    }
  });

  app.patch("/set_eq_dir", (req, res) => {
    const eqDir = req.body["eqDir"];
    try {
      setEqDir(eqDir);
      res.status(200).end();
    } catch (err) {
      console.log("/set_eq_dir error:", err);
      res.status(400).end();
    }
  });

  app.get("/test_eq_dir", (_, res) => {
    const eqDir = getEqDir();
    try {
      const isDirValid = testEqDir(eqDir);
      if (isDirValid) {
        res.status(200).end();
        return;
      }
      res.status(400).end();
    } catch (err) {
      res.status(500).end();
    }
  });

  app.get("/test_logs_dir", (_, res) => {
    const eqDir = getEqDir();
    try {
      const isLogsDirValid = testLogsDir(eqDir);
      if (isLogsDirValid) {
        res.status(200).end();
        return;
      }
      res.status(400).end();
    } catch (err) {
      res.status(500).end();
    }
  });

  app.get("/get_char_names", (req, res) => {
    try {
      const activeView = req.query["activeView"];
      const charNames = getCharNames(activeView);
      res.send(charNames);
    } catch (err) {
      console.error("/get_char_names error: ", err);
    }
  });

  app.get("/get_missing_spells", (req, res) => {
    try {
      const eqDir = getEqDir();
      const SpellsInstance = new MissingSpells(eqDir);
      const missingSpells = SpellsInstance.getMissingSpells(req.query);
      res.send(missingSpells);
    } catch (err) {
      console.error("/get_missing_spells error: ", err);
    }
  });

  app.get("/get_yellow_text", (req, res) => {
    try {
      const eqDir = getEqDir();
      const YellowTextInstance = new YellowText(eqDir);
      const yellowTexts = YellowTextInstance.getYellowText(req.query);
      res.send(yellowTexts);
    } catch (err) {
      console.error("/get_yellow_text error: ", err);
    }
  });

  app.get("/get_camp_out", (req, res) => {
    try {
      const eqDir = getEqDir();
      const CampOutInstance = new CampOut(eqDir);
      const campOutResults = CampOutInstance.getCampOutLocations(req.query);
      res.send(campOutResults);
    } catch (err) {
      console.error("/get_camp_out error: ", err);
    }
  });

  app.get("/parse_items", (_, res) => {
    try {
      const eqDir = getEqDir();
      const ItemsInstance = new Items(eqDir);
      const isParseSuccessful = ItemsInstance.parseItems();
      if (isParseSuccessful) {
        res.status(200).end();
        return;
      } else {
        res.status(500).end();
      }
    } catch (err) {
      console.error("/parse_items_error", err);
      res.status(500).end();
    }
  });

  app.get("/parse_missing_spells", (_, res) => {
    try {
      const eqDir = getEqDir();
      const MissingSpellsInstance = new MissingSpells(eqDir);
      const isParseSuccessful = MissingSpellsInstance.parseMissingSpells();
      if (isParseSuccessful) {
        res.status(200).end();
        return;
      } else {
        res.status(500).end();
      }
    } catch (err) {
      console.error("/parse_missing_spells", err);
      res.status(500).end();
    }
  });

  app.get("/parse_yellow_text", async (_, res) => {
    try {
      const eqDir = getEqDir();
      const YellowTextInstance = new YellowText(eqDir);
      const isParseSuccessful = await YellowTextInstance.parseYellowText();
      if (isParseSuccessful) {
        res.status(200).end();
        return;
      } else {
        res.status(500).end();
      }
    } catch (err) {
      console.error("/parse_yellow_text", err);
      res.status(500).end();
    }
  });

  app.get("/parse_campout", async (_, res) => {
    try {
      const eqDir = getEqDir();
      const CampOutInstance = new CampOut(eqDir);
      const isParseSuccessful = await CampOutInstance.parseCampOutLocations();
      if (isParseSuccessful) {
        res.status(200).end();
        return;
      } else {
        res.status(500).end();
      }
    } catch (err) {
      console.error("/parse_campout", err);
      res.status(500).end();
    }
  });

  app.listen(port, async () => {
    console.log(`express app listening on port ${port}`);
    createTables();
  });
};
