import express from "express";
import { addDaySchema, updateDayByDateSchema } from "./schema.js";

export function createWorkDayRouter(storage) {
  const router = express.Router();

  router.post("/day", async (req, res) => {
    try {
      const day = addDaySchema.parse(req.body);
      await storage.saveDay(day);
      res.send({ ok: true });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });

  router.get("/day/:date", async (req, res) => {
    try {
      const date = req.params.date;
      const day = await storage.getDayByDate(date);
      res.send(day);
    } catch (error) {
      res.status(404).send({ error: error.message });
    }
  });

  router.get("/days", async (req, res) => {
    const days = await storage.getAllDays();
    res.send(days);
  });

  router.delete("/day/:date", async (req, res) => {
    try {
      const date = req.params.date;
      await storage.deleteDayByDate(date);
      res.send({ ok: true });
    } catch (error) {
      res.status(404).send({ error: error.message });
    }
  });

  router.put("/day/:date", async (req, res) => {
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
