import { confirmPassword, passwordSchema } from "@/lib/schemas";
import * as z from "zod";
export const schema = z
  .object({
    loginName: z
      .string()
      .min(1, { message: "Login name is required" })
      .regex(/^[0-9A-Za-z_-]+$/, "Login name contains invalid character"),
    password: passwordSchema,
    passwordConfirmation: passwordSchema,
  })
  .superRefine(({ password, passwordConfirmation }, ctx) =>
    confirmPassword(
      { newPassword: password, newPasswordConfirmation: passwordConfirmation },
      ctx
    )
  );

export type Schema = z.infer<typeof schema>;
