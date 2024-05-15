import z from "zod";

export const addDaySchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    manhour: z.number(),
    openhour: z.number(),
    closehour: z.number(),
    feast: z.boolean(),
  })
  .strict();

export const updateDayByDateSchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    day: z.object({
      feast: z.boolean(),
      manhour: z.number(),
      openhour: z.number(),
      closehour: z.number(),
    }),
  })
  .strict();
