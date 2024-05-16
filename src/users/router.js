import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createUserSchema, updateUserSchema } from "./schema.js";
import { protect, boss } from "../middleware/auth.js";

export function createUserRouter(storage) {
  const router = express.Router();

  router.post("/login", async (req, res) => {
    try {
      console.log("Login request", req.body);
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).send({ message: "Invalid credentials" });
      }

      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid credentials" });
      }
      const token = jwt.sign(
        { username: user.username, name: user.name, positions: user.positions },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
        (err, token) => {
          if (err) {
            console.error("Error generating token:", err);
            return;
          }
          console.log("Token generated", token);
          res.json({
            token,
            user: {
              name: user.name,
              username: user.username,
              positions: user.positions,
            },
          });
        }
      );
    } catch (error) {
      res.status(500).json({ message: "Login failed", error: error.message });
    }
  });

  router.post("/", [protect, boss], async (req, res) => {
    try {
      const { username, password, name, positions } = req.body;
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        throw new Error("Ilyen felhasználónév már létezik!");
      }
      if (!username || !password || !name) {
        throw new Error("Minden mező kitöltése kötelező!");
      }
      if (positions.length === 0) {
        throw new Error("Legalább egy pozíciót válassz ki!");
      }
      console.log("New user created:", username, name, positions, password);
      const validatedUser = createUserSchema.parse({
        username,
        password,
        name,
        positions,
      });
      console.log("Validated user:", validatedUser);
      const newUser = await storage.saveUser(validatedUser);

      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error.message);
      res.status(400).send({ error: error.message });
    }
  });

  router.get("/:username", [protect], async (req, res) => {
    //TODO: lekérdezés a saját userre, + profil oldallal
    try {
      const username = req.params.username;
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      res.send(user);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

  router.put("/:username", [protect], async (req, res) => {
    //TODO: editálási lehetőség a saját userre, (jelszócsere, névcsere)
    try {
      const username = req.params.username;
      const userUpdates = updateUserSchema.parse(req.body);
      await storage.updateUserByUsername(username, userUpdates);
      res.send({ ok: true });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });

  return router;
}
