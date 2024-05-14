import z from "zod";

export const createUserSchema = z
  .object({
    username: z.string().min(1),
    name: z.string().min(1),
    positions: z.array(z.string()),
  })
  .strict();

export const updateUserSchema = z
  .object({
    name: z.string().min(1).optional(),
    positions: z.array(z.string()).optional(),
  })
  .strict();
