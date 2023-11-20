import {
  confirmPassword,
  newPasswordSchema,
  passwordSchema,
} from "@/lib/schemas";
import * as z from "zod";
export const schema = z
  .object({
    password: passwordSchema,
    newPassword: newPasswordSchema,
    newPasswordConfirmation: newPasswordSchema,
  })
  .superRefine(confirmPassword);
export type Schema = z.infer<typeof schema>;
