import z from "zod";

export const createTransferSchema = z.object({
  amount: z.number(),
  pin: z.number(),
  accId: z.string(),
});

export type CreateTransferDto = z.infer<typeof createTransferSchema>;
