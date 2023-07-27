import { passwordSchema } from "@/lib/schemas";
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
  .superRefine(({ password, passwordConfirmation }, ctx) => {
    if (password !== passwordConfirmation) {
      ctx.addIssue({
        path: ["passwordConfirmation"],
        code: "custom",
        message: "Password and password confirmation do not match",
      });
    }
  });

export type Schema = z.infer<typeof schema>;
