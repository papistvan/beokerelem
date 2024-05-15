import express from "express";
import { addDaySchema, updateDayByDateSchema } from "./schema.js";
import { protect, boss } from "../middleware/auth.js";
import e from "express";

export function createWorkDayRouter(storage) {
  const router = express.Router();

  router.post("/day", [protect, boss], async (req, res) => {
    try {
      const { date, manhour, openhour, closehour, feast } = req.body;
      const existingDay = await storage.getDayByDate(date).catch((err) => null);
      if (existingDay) {
        throw new Error("A nap már létezik!");
      }
      console.log("ünnep", feast);
      if (
        !date ||
        manhour === undefined ||
        openhour === undefined ||
        closehour === undefined
      ) {
        throw new Error("Minden mező kitöltése kötelező!");
      }

      const parsedData = {
        date,
        manhour: Number(manhour),
        openhour: Number(openhour),
        closehour: Number(closehour),
        feast: feast,
      };

      if (
        parsedData.manhour < 0 ||
        parsedData.openhour < 0 ||
        parsedData.closehour < 0
      ) {
        throw new Error("Pozitív számokat adj meg kérlek!");
      } else if (parsedData.openhour >= parsedData.closehour) {
        throw new Error("Nyitási óra kisebb kell legyen, mint zárási óra!");
      } else if (
        parsedData.manhour <=
        parsedData.closehour - parsedData.openhour
      ) {
        throw new Error(
          "A munkaórák száma nagyobb kell legyen, mint a nyitás és zárás között eltöltött idő!"
        );
      }

      const day = addDaySchema.parse(parsedData);
      await storage.saveDay(day);
      res.send({ ok: true });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });

  router.get("/days", [protect], async (req, res) => {
    const days = await storage.getAllDays();
    res.send(days);
  });

  router.get("/:date", [protect], async (req, res) => {
    const { date } = req.params;
    try {
      const days = await storage.getAvailableWorkDays(date);
      res.send(days);
    } catch (error) {
      res.status(404).send({ error: "No available workdays!" });
    }
  });

  router.get("/day/:date", [protect], async (req, res) => {
    try {
      const date = req.params.date;
      const day = await storage.getDayByDate(date);
      res.send(day);
    } catch (error) {
      res.status(404).send({ error: error.message });
    }
  });

  router.delete("/day/:date", [protect, boss], async (req, res) => {
    try {
      const date = req.params.date;
      await storage.deleteDayByDate(date);
      res.send({ ok: true });
    } catch (error) {
      res.status(404).send({ error: error.message });
    }
  });

  router.put("/day/:date", [protect, boss], async (req, res) => {
    try {
      const date = req.params.date;
      const day = updateDayByDateSchema.parse(req.body);
      await storage.updateDayByDate(date, day);
      res.send({ ok: true });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });

  return router;
}
