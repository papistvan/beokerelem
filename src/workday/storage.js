import sqlite3 from "sqlite3";

export function setupWorkDayDatabase(db) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS dates (
        date TEXT PRIMARY KEY,
        feast BOOLEAN,
        manhour INTEGER,
        openhour INTEGER,
        closehour INTEGER
      )
    `,
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

export async function connectToWorkDaySqlite(db) {
  return {
    saveDay: (day) => {
      return new Promise((resolve, reject) => {
        const { date, feast, manhour, openhour, closehour } = day;
        db.run(
          "INSERT INTO dates (date, feast, manhour, openhour, closehour) VALUES (?, ?, ?, ?, ?)",
          [date, feast, manhour, openhour, closehour],
          function (err) {
            if (err) {
              reject(err);
            }
            resolve();
          }
        );
      });
    },
    getDayByDate: (date) => {
      return new Promise((resolve, reject) => {
        db.get("SELECT * FROM dates WHERE date = ?", [date], (err, row) => {
          if (err) {
            reject(err);
          }
          if (!row) {
            reject(new Error("Day not found."));
          }
          resolve(row);
        });
      });
    },
  };
}
