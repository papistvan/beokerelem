import sqlite3 from "sqlite3";
import { setupUserDatabase, connectToUserSqlite } from "../users/storage.js";
import {
  setupWorkDayDatabase,
  connectToWorkDaySqlite,
} from "../workday/storage.js";
import {
  setupScheduleDatabase,
  connectToScheduleSqlite,
} from "../schedule/storage.js";

const dbPath = "schedule.db";

export const dbConnection = new Promise((resolve, reject) => {
  const db = new sqlite3.Database(dbPath, async (err) => {
    if (err) {
      reject("Database connection error: " + err.message);
      return;
    }
    try {
      await setupWorkDayDatabase(db);
      await setupUserDatabase(db);
      await setupScheduleDatabase(db);
      const scheduleStorage = await connectToScheduleSqlite(db);
      const userStorage = await connectToUserSqlite(db);
      const workdayStorage = await connectToWorkDaySqlite(db);
      resolve({ userStorage, workdayStorage, scheduleStorage });
    } catch (error) {
      reject("Database setup error: " + error.message);
    }
  });
});
