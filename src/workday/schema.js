import z from "zod";

export const addDaySchema = z
  .object({
    date: z.string().min(1),
    feast: z.boolean(),
    manhour: z.number(),
    openhour: z.number(),
    closehour: z.number(),
  })
  .strict();

export const updateDayByDateSchema = z
  .object({
    date: z.string().min(1),
    day: z.object({
      feast: z.boolean(),
      manhour: z.number(),
      openhour: z.number(),
      closehour: z.number(),
    }),
  })
  .strict();
