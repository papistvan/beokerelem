import sqlite3 from "sqlite3";

export function setupUserDatabase(db) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        kind TEXT NOT NULL,
        positions TEXT NOT NULL
      )
    `,
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export async function connectToUserSqlite(db) {
  return {
    saveUser: (user) => {
      const { name, kind, positions } = user;
      return new Promise((resolve, reject) => {
        db.run(
          "INSERT INTO users (name, kind, positions) VALUES (?, ?, ?)",
          [name, JSON.stringify(kind), JSON.stringify(positions)],
          function (err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    },
    getUserById: (id) => {
      return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    },
    updateUserById: (id, updates) => {
      const { name, kind, positions } = updates;
      return new Promise((resolve, reject) => {
        db.run(
          "UPDATE users SET name = ?, kind = ?, positions = ? WHERE id = ?",
          [name, JSON.stringify(kind), JSON.stringify(positions), id],
          function (err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    },
  };
}
