import express from "express";
import { addDaySchema, updateDayByDateSchema } from "./schema.js";
import { protect, boss } from "../middleware/auth.js";

export function createWorkDayRouter(storage) {
  const router = express.Router();

  /**
   * @swagger
   * tags:
   *   name: Workdays
   *   description: Workday management
   */

  /**
   * @swagger
   * /workdays/day:
   *   post:
   *     summary: Create a new workday
   *     tags: [Workdays]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               date:
   *                 type: string
   *               manhour:
   *                 type: number
   *               openhour:
   *                 type: number
   *               closehour:
   *                 type: number
   *               feast:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Workday created successfully
   *       400:
   *         description: Error creating workday
   */
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

  /**
   * @swagger
   * /workdays/days:
   *   get:
   *     summary: Get all workdays
   *     tags: [Workdays]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of all workdays
   */
  router.get("/days", [protect], async (req, res) => {
    const days = await storage.getAllDays();
    res.send(days);
  });

  /**
   * @swagger
   * /workdays/{date}:
   *   get:
   *     summary: Get available workdays from a specific date
   *     tags: [Workdays]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: date
   *         schema:
   *           type: string
   *         required: true
   *         description: The date to start the search from
   *     responses:
   *       200:
   *         description: List of available workdays
   *       404:
   *         description: No available workdays
   */
  router.get("/:date", [protect], async (req, res) => {
    const { date } = req.params;
    try {
      const days = await storage.getAvailableWorkDays(date);
      res.send(days);
    } catch (error) {
      res.status(404).send({ error: "Nincs elérhető munkanap!" });
    }
  });

  /**
   * @swagger
   * /workdays/day/{date}:
   *   get:
   *     summary: Get a workday by date
   *     tags: [Workdays]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: date
   *         schema:
   *           type: string
   *         required: true
   *         description: The date of the workday
   *     responses:
   *       200:
   *         description: Workday retrieved successfully
   *       404:
   *         description: Workday not found
   */
  router.get("/day/:date", [protect], async (req, res) => {
    try {
      const date = req.params.date;
      const day = await storage.getDayByDate(date);
      res.send(day);
    } catch (error) {
      res.status(404).send({ error: error.message });
    }
  });

  /**
   * @swagger
   * /workdays/day/{date}:
   *   delete:
   *     summary: Delete a workday by date
   *     tags: [Workdays]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: date
   *         schema:
   *           type: string
   *         required: true
   *         description: The date of the workday to delete
   *     responses:
   *       200:
   *         description: Workday deleted successfully
   *       404:
   *         description: Workday not found
   */
  router.delete("/day/:date", [protect, boss], async (req, res) => {
    try {
      const date = req.params.date;
      await storage.deleteDayByDate(date);
      res.send({ ok: true });
    } catch (error) {
      res.status(404).send({ error: error.message });
    }
  });

  /**
   * @swagger
   * /workdays/day/{date}:
   *   put:
   *     summary: Update a workday by date
   *     tags: [Workdays]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: date
   *         schema:
   *           type: string
   *         required: true
   *         description: The date of the workday to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               manhour:
   *                 type: number
   *               openhour:
   *                 type: number
   *               closehour:
   *                 type: number
   *               feast:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Workday updated successfully
   *       400:
   *         description: Error updating workday
   */
  router.put("/day/:date", [protect, boss], async (req, res) => {
    try {
      const { date } = req.params;
      const existingDay = await storage.getDayByDate(date).catch((err) => null);
      if (!existingDay) {
        throw new Error("Nem létezik ilyen nap!");
      }

      const { manhour, openhour, closehour, feast } = req.body;
      if (
        manhour === undefined ||
        openhour === undefined ||
        closehour === undefined ||
        feast === undefined
      ) {
        throw new Error("Minden mező kitöltése kötelező!");
      }
      console.log("ünnep", feast, typeof feast);
      const parsedData = {
        date,
        day: {
          manhour: Number(manhour),
          openhour: Number(openhour),
          closehour: Number(closehour),
          feast: feast ? true : false,
        },
      };
      console.log(parsedData);
      if (
        parsedData.day.manhour < 0 ||
        parsedData.day.openhour < 0 ||
        parsedData.day.closehour < 0
      ) {
        throw new Error("Pozitív számokat adj meg kérlek!");
      } else if (parsedData.day.openhour >= parsedData.day.closehour) {
        throw new Error("Nyitási óra kisebb kell legyen, mint zárási óra!");
      } else if (
        parsedData.day.manhour <=
        parsedData.day.closehour - parsedData.day.openhour
      ) {
        throw new Error(
          "A munkaórák száma nagyobb kell legyen, mint a nyitás és zárás között eltöltött idő!"
        );
      }

      const validatedData = updateDayByDateSchema.parse(parsedData);

      const {
        manhour: validManhour,
        openhour: validOpenhour,
        closehour: validClosehour,
        feast: validFeast,
      } = validatedData.day;

      await storage.updateDayByDate(date, {
        manhour: validManhour,
        openhour: validOpenhour,
        closehour: validClosehour,
        feast: validFeast,
      });
      res.send({ ok: true });
    } catch (error) {
      console.log(error.message);
      res.status(400).send({ error: error.message });
    }
  });

  return router;
}
