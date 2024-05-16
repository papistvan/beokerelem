import express from "express";
import { protect, boss } from "../middleware/auth.js";

export function createScheduleRouter(storage, userStorage, workdayStorage) {
  const router = express.Router();

  /**
   * @swagger
   * tags:
   *   name: Schedules
   *   description: Schedule management
   */

  /**
   * @swagger
   * /schedules/apply/{date}:
   *   post:
   *     summary: Apply for a workday
   *     tags: [Schedules]
   *     parameters:
   *       - in: path
   *         name: date
   *         schema:
   *           type: string
   *         required: true
   *         description: The date to apply for
   *     responses:
   *       200:
   *         description: Application successful
   *       400:
   *         description: Application failed
   */
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

  /**
   * @swagger
   * /schedules/applications/{date}:
   *   get:
   *     summary: Get applications for a specific date
   *     tags: [Schedules]
   *     parameters:
   *       - in: path
   *         name: date
   *         schema:
   *           type: string
   *         required: true
   *         description: The date to get applications for
   *     responses:
   *       200:
   *         description: List of applications
   *       400:
   *         description: Error fetching applications
   */
  router.get("/applications/:date", [protect, boss], async (req, res) => {
    try {
      const date = req.params.date;
      const applications = await storage.getScheduleByDate(date);
      res.send(applications);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });

  /**
   * @swagger
   * /schedules/applications/{date}/{user}:
   *   get:
   *     summary: Get application status for a specific date and user
   *     tags: [Schedules]
   *     parameters:
   *       - in: path
   *         name: date
   *         schema:
   *           type: string
   *         required: true
   *         description: The date of the application
   *       - in: path
   *         name: user
   *         schema:
   *           type: string
   *         required: true
   *         description: The username of the applicant
   *     responses:
   *       200:
   *         description: Application status
   *       400:
   *         description: Error fetching application status
   */
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

  /**
   * @swagger
   * /schedules/accept/{date}/{username}:
   *   post:
   *     summary: Accept an application for a specific date
   *     tags: [Schedules]
   *     parameters:
   *       - in: path
   *         name: date
   *         schema:
   *           type: string
   *         required: true
   *         description: The date of the application
   *       - in: path
   *         name: username
   *         schema:
   *           type: string
   *         required: true
   *         description: The username of the applicant
   *     responses:
   *       200:
   *         description: Application accepted
   *       400:
   *         description: Error accepting application
   */
  router.post("/accept/:date/:username", [protect, boss], async (req, res) => {
    try {
      const date = req.params.date;
      const username = req.params.username;
      await storage.acceptApplication({ date, username });
      res.send({ ok: true });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });

  /**
   * @swagger
   * /schedules/{date}:
   *   get:
   *     summary: Get available schedule days from a specific date
   *     tags: [Schedules]
   *     parameters:
   *       - in: path
   *         name: date
   *         schema:
   *           type: string
   *         required: true
   *         description: The date to start the search from
   *     responses:
   *       200:
   *         description: List of available schedule days
   *       400:
   *         description: Error fetching schedule days
   */
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
