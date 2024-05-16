import express from "express";
import {} from "./schema.js";
import { protect, boss } from "../middleware/auth.js";

export function createScheduleRouter(storage, userStorage, workdayStorage) {
  const router = express.Router();

  router.post("/apply/:date", [protect], async (req, res) => {
    try {
      const date = req.params.date;
      const { username } = req.user;
      const findUser = await userStorage.getUserByUsername(username);
      if (!findUser) {
        throw new Error("Csak regisztrált felhasználók jelentkezhetnek!");
      }
      const findWorkday = await workdayStorage.getDayByDate(date);
      if (!findWorkday) {
        throw new Error("Nincs ilyen nap!");
      }
      await storage.applyForWorkDay({ date, username });
      res.send({ ok: true });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });

  router.get("/applications/:date", [protect, boss], async (req, res) => {
    try {
      const date = req.params.date;
      const applications = await storage.getScheduleByDate(date);
      res.send(applications);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });

  router.get("/applications/:date/:user", [protect], async (req, res) => {
    try {
      const application = await storage.getApplication(
        req.params.user,
        req.params.date
      );
      res.status(200).send(application);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });

  router.post("/accept/:date/:username", [protect, boss], async (req, res) => {
    try {
      const date = req.params.date;
      const username = req.params.username;
      console.log("Accepting application", date, username);
      await storage.acceptApplication({ date, username });
      res.send({ ok: true });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });

  router.get("/:date", [protect], async (req, res) => {
    try {
      const date = req.params.date;
      const days = await storage.getAvailableScheduleDays(date);
      res.send(days);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });

  return router;
}
