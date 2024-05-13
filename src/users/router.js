import express from 'express';
import { createUserSchema, updateUserSchema } from './schema.js';

export function createUserRouter(storage) {
  const router = express.Router();

  router.post('/', async (req, res) => {
    try {
      const user = createUserSchema.parse(req.body);
      await storage.saveUser(user);
      res.status(201).send({ ok: true, user });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUserById(id);
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
      res.send(user);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const userUpdates = updateUserSchema.parse(req.body);
      await storage.updateUserById(req.params.id, userUpdates);
      res.send({ ok: true });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });

  return router;
}
