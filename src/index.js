import createApp from "./app.js";
import connectToSqlite from "./storage/connection.js";

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  process.exit(1);
});

connectToSqlite("schedule.db", (err, { userStorage, workdayStorage }) => {
  if (err) {
    console.error("Error occurred:", err);
    return;
  }

  const app = createApp({ userStorage, workdayStorage });

  app.listen(3000, () => {
    console.log("Service is listening on http://localhost:3000");
  });
});
