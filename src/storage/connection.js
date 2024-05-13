import sqlite3 from "sqlite3";
import { setupUserDatabase, connectToUserSqlite } from "../users/storage.js";
import {
  setupWorkDayDatabase,
  connectToWorkDaySqlite,
} from "../workday/storage.js";

export default function connectToSqlite(filepath, callback) {
  const db = new sqlite3.Database(filepath, async (err) => {
    if (err) {
      callback(err, null);
      return;
    }

    try {
      await setupWorkDayDatabase(db); // Set up tables for workday
      await setupUserDatabase(db); // Set up tables for users
      const userStorage = await connectToUserSqlite(db);
      const workdayStorage = await connectToWorkDaySqlite(db);
      callback(null, { userStorage, workdayStorage });
    } catch (dbErr) {
      callback(dbErr, null);
    }
  });
}
