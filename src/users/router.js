import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createUserSchema, updateUserSchema } from "./schema.js";
import { protect, boss } from "../middleware/auth.js";

export function createUserRouter(storage) {
  const router = express.Router();

  /**
   * @swagger
   * tags:
   *   name: Users
   *   description: User management
   */

  /**
   * @swagger
   * /users/login:
   *   post:
   *     summary: Login a user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: User logged in successfully
   *       401:
   *         description: Invalid credentials
   */
  router.post("/login", async (req, res) => {
    try {
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

  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Create a new user
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *               name:
   *                 type: string
   *               positions:
   *                 type: array
   *                 items:
   *                   type: string
   *     responses:
   *       201:
   *         description: User created successfully
   *       400:
   *         description: Error creating user
   */
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
      const validatedUser = createUserSchema.parse({
        username,
        password,
        name,
        positions,
      });
      const newUser = await storage.saveUser(validatedUser);

      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });

  /**
   * @swagger
   * /users/{username}:
   *   get:
   *     summary: Get a user by username
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: username
   *         schema:
   *           type: string
   *         required: true
   *         description: The username to get
   *     responses:
   *       200:
   *         description: User retrieved successfully
   *       404:
   *         description: User not found
   */
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

  /**
   * @swagger
   * /users/{username}:
   *   put:
   *     summary: Update a user by username
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: username
   *         schema:
   *           type: string
   *         required: true
   *         description: The username to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               password:
   *                 type: string
   *               name:
   *                 type: string
   *               positions:
   *                 type: array
   *                 items:
   *                   type: string
   *     responses:
   *       200:
   *         description: User updated successfully
   *       400:
   *         description: Error updating user
   */
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
