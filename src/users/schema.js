import z from "zod";

export const createUserSchema = z
  .object({
    username: z.string().min(1),
    password: z.string().min(1),
    name: z.string().min(1),
    positions: z.array(z.string()).min(1),
  })
  .strict();

export const updateUserSchema = z
  .object({
    password: z.string().min(1),
    name: z.string().min(1),
  })
  .strict();
