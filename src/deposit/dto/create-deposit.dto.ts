import z from "zod";

export const createDepositSchema = z.object({
  amount: z.number(),
});

export type CreateDepositDto = z.infer<typeof createDepositSchema>;
