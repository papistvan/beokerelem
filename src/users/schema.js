import z from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1),
  kind: z.array(z.string()),
  positions: z.array(z.string())
}).strict();

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  kind: z.array(z.string()).optional(),
  positions: z.array(z.string()).optional()
}).strict();
