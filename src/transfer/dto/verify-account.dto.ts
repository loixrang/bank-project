import z from "zod";
import { Banks } from "../../types/banks.js";

export const verifyAcountSchema = z.object({
  accountNumber: z.number(),
  bank: z.enum(Banks),
});

export type VerifyAccountDto = z.infer<typeof verifyAcountSchema>;
