import * as z from "zod";

export const passwordSchema = z
  .string()
  .max(256, { message: "Password is too long" });

export const newPasswordSchema = z
  .string()
  .min(8, { message: "Password must be 8 charatcers long or more" })
  .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&,._-])[A-Za-z\d@$!%*?&,._-]+$/, {
    message: "Password must include at least 1 alphabet, number, and symbol",
  })
  .max(256, { message: "Password is too long" });

export const confirmPassword: z.SuperRefinement<{
  newPassword: string;
  newPasswordConfirmation: string;
}> = ({ newPassword, newPasswordConfirmation }, ctx) => {
  if (newPassword !== newPasswordConfirmation) {
    ctx.addIssue({
      path: ["newPasswordConfirmation"],
      code: "custom",
      message: "New password and new password confirmation do not match",
    });
  }
};
