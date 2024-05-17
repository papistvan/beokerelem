import express from "express";
import { createWorkDayRouter } from "./workday/router.js";
import { createUserRouter } from "./users/router.js";
import { createScheduleRouter } from "./schedule/router.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { protect, boss } from "./middleware/auth.js";

export default function createApp({
  userStorage,
  workdayStorage,
  scheduleStorage,
}) {
  const app = express();

  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Beosztáskezelő API",
        version: "1.0.0",
        description:
          "Az api lehetőséget biztosít a beosztások kezelésére. Munkanapok felvétele, módosítása, törlése, lekérdezése. Felhasználók regisztrálása, bejelentkezése, kijelentkezése. A munkanapra való jelentkezésre, jelentkezés elfogadására, és az elfogadott jelentkezések lekérdezésére.",
      },
    },
    apis: ["./router.js", "./**/router.js"], // Path to the API docs
  };

  app.use(express.json());

  app.use(cors());

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/swagui", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  app.use("/users", createUserRouter(userStorage));

  app.use(
    "/workdays",
    async (req, res, next) => {
      next();
    },
    createWorkDayRouter(workdayStorage, protect, boss)
  );

  app.use(
    "/schedules",
    async (req, res, next) => {
      next();
    },
    createScheduleRouter(scheduleStorage, userStorage, workdayStorage)
  );

  return app;
}
