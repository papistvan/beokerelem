import sqlite3 from "sqlite3";

export function setupScheduleDatabase(db) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS schedule (
        date DATE NOT NULL,
        username TEXT NOt NULL,
        accepted BOOLEAN DEFAULT NULL,
        PRIMARY KEY (date, username),
            FOREIGN KEY (username) REFERENCES users(username),
            FOREIGN KEY (date) REFERENCES dates(date)
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

export async function connectToScheduleSqlite(db) {
  return {
    applyForWorkDay: (schedule) => {
      return new Promise((resolve, reject) => {
        const { date, username } = schedule;
        db.run(
          "INSERT INTO schedule (date, username) VALUES (?, ?)",
          [date, username],
          function (err) {
            if (err) {
              if (err.code === "SQLITE_CONSTRAINT") {
                reject(new Error("Már jelentkeztl!"));
              }
              reject(err);
            }
            resolve();
          }
        );
      });
    },
    getScheduleByDate: (date) => {
      return new Promise((resolve, reject) => {
        db.all(
          "SELECT * FROM schedule WHERE date = ? ",
          [date],
          (err, rows) => {
            if (err) {
              reject(err);
            }
            if (!rows) {
              reject(new Error("Schedule not found."));
            }
            resolve(rows);
          }
        );
      });
    },
    getAvailableScheduleDays: (date) => {
      return new Promise((resolve, reject) => {
        // db.all(
        //   `
        //     SELECT date FROM schedule
        //     WHERE date <= DATE(?, '+7 days')
        //     ORDER BY date ASC;
        //     `,
        //   [date],
        //   (err, rows) => {
        //     if (err) {
        //       reject(err);
        //     }
        //     resolve(rows);
        //   }
        // );
        db.all("SELECT DISTINCT date FROM schedule", (err, rows) => {
          if (err) {
            console.error("Error fetching schedule days:", err);
            reject(err);
          }
          resolve(rows);
        });
      });
    },
    acceptApplication: ({ date, username }) => {
      return new Promise((resolve, reject) => {
        db.run(
          "UPDATE schedule SET accepted = 1 WHERE date = ? AND username = ?",
          [date, username],
          function (err) {
            if (err) {
              console.log("Error accepting application", err);
              return reject(err);
            }
            if (this.changes === 0) {
              console.log("No rows updated");
              return reject(new Error("No rows updated"));
            }
            resolve();
          }
        );
      });
    },
    getApplication: (username, date) => {
      return new Promise((resolve, reject) => {
        db.get(
          "SELECT * FROM schedule WHERE username = ? AND date = ?",
          [username, date],
          (err, row) => {
            if (err) {
              console.error("Error fetching application:", err);
              reject(err);
            } else {
              resolve(row);
            }
          }
        );
      });
    },
  };
}
