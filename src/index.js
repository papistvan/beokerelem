import createApp from "./app.js";
import { dbConnection } from "./storage/connection.js";
import dotenv from "dotenv";

dotenv.config();

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  process.exit(1);
});

(async () => {
  const { userStorage, workdayStorage, scheduleStorage } = await dbConnection;

  const app = createApp({ userStorage, workdayStorage, scheduleStorage });

  app.listen(3000, () => {
    console.log("Service is listening on http://localhost:3000");
  });
})();
