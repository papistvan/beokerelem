import express from "express";
import { createWorkDayRouter } from "./workday/router.js";
import { errorHandler } from "./error-handling.js";
import { createUserRouter } from "./users/router.js";

export default function createApp({ userStorage, workdayStorage }) {
  const app = express();

  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("Hello, world!");
  });

  app.use("/users", createUserRouter(userStorage));

  app.use(
    "/workday",
    async (req, res, next) => {
      console.log("AUTH Middleware"); //TODO auth middleware
      next();
    },
    createWorkDayRouter(workdayStorage)
  );

  app.use(errorHandler);

  return app;
}
