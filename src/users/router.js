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
        }
      );
      res.json({ token, user });
    } catch (error) {
      res.status(500).json({ message: "Login failed", error: error.message });
    }
  });

  // User Registration Endpoint
  router.post("/", [protect, boss], async (req, res) => {
    try {
      const newUser = await storage.saveUser(createUserSchema.parse(req.body));
      res.status(201).json(newUser);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Registration failed", error: error.message });
    }
  });

  router.get("/:username", [protect], async (req, res) => {
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
