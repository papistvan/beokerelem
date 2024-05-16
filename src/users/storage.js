import sqlite3 from "sqlite3";
import bcrypt from "bcryptjs";

export function setupUserDatabase(db) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
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
    saveUser: async (user) => {
      const { username, name, password, positions } = user;
      const hashedPassword = await bcrypt.hash(password, 10);
      return new Promise((resolve, reject) => {
        db.run(
          "INSERT INTO users (username, name, password, positions) VALUES (?, ?, ?, ?)",
          [username, name, hashedPassword, JSON.stringify(positions)],
          function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
          }
        );
      });
    },
    getUserByUsername: (username) => {
      return new Promise((resolve, reject) => {
        db.get(
          "SELECT * FROM users WHERE username = ?",
          [username],
          (err, row) => {
            if (err) {
              console.error("Error fetching user:", err);
              reject(err);
            } else {
              resolve(row);
            }
          }
        );
      });
    },

    updateUserByUsername: (username, updates) => {
      const { name, positions } = updates;
      return new Promise((resolve, reject) => {
        db.run(
          "UPDATE users SET name = ?, positions = ? WHERE username = ?",
          [name, JSON.stringify(positions), username],
          function (err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    },
  };
}
