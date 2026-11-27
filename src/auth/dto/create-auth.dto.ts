import z from "zod";

export const loginSchema = z.object({
  name: z.coerce.string(),
  pin: z.number(),
});

export type LoginDto = z.infer<typeof loginSchema>;
