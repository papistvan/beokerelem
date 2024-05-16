import sqlite3 from "sqlite3";

export function setupWorkDayDatabase(db) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS dates (
        date DATE PRIMARY KEY,
        feast BOOLEAN NOT NULL DEFAULT 0,
        manhour INTEGER NOT NULL,
        openhour INTEGER NOT NULL,
        closehour INTEGER NOT NULL
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
        console.log("getDayByDate", date);
        db.get(
          "SELECT * FROM dates WHERE strftime('%Y-%m-%d', date) = ?",
          [date],
          (err, row) => {
            if (err) {
              reject(err);
            }
            if (!row) {
              reject(new Error("Day not found."));
            }
            resolve(row);
          }
        );
      });
    },
    getAllDays: () => {
      return new Promise((resolve, reject) => {
        db.all("SELECT * FROM dates", (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      });
    },
    deleteDayByDate: (date) => {
      return new Promise((resolve, reject) => {
        db.run("DELETE FROM dates WHERE date = ?", [date], function (err) {
          if (err) {
            reject(err);
          }
          resolve();
        });
      });
    },
    updateDayByDate: (date, day) => {
      return new Promise((resolve, reject) => {
        const { feast, manhour, openhour, closehour } = day;
        db.run(
          "UPDATE dates SET feast = ?, manhour = ?, openhour = ?, closehour = ? WHERE date = ?",
          [feast, manhour, openhour, closehour, date],
          function (err) {
            if (err) {
              reject(err);
            }
            resolve();
          }
        );
      });
    },
    getAvailableWorkDays: (date) => {
      return new Promise((resolve, reject) => {
        db.all(
          `
          SELECT * FROM dates 
          WHERE date >= DATE(?, '+7 days')
          ORDER BY date ASC;
          `,
          [date],
          (err, rows) => {
            if (err) {
              reject(err);
            }
            resolve(rows);
          }
        );
      });
    },
  };
}
