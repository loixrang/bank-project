import z from "zod";

export const createWithdrawSchema = z.object({
  amount: z.number(),
  pin: z.number()
})

export type CreateWithdrawDto = z.infer<typeof createWithdrawSchema>
