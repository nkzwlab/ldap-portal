import { passwordSchema } from "@/lib/schemas";
import * as z from "zod";
export const schema = z
  .object({
    password: passwordSchema,
    newPassword: passwordSchema,
    newPasswordConfirmation: passwordSchema,
  })
  .superRefine(({ newPassword, newPasswordConfirmation }, ctx) => {
    if (newPassword !== newPasswordConfirmation) {
      ctx.addIssue({
        path: ["newPasswordConfirmation"],
        code: "custom",
        message: "New password and new password confirmation do not match",
      });
    }
  });
export type Schema = z.infer<typeof schema>;
