import * as z from "zod";

export const passwordSchema = z
  .string()
  .max(256, { message: "Password is too long" });

export const newPasswordSchema = z
  .string()
  .min(8, { message: "Password must be 8 charatcers long or more" })
  .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      "Password must include at least 1 upper and lower case alphabet, number, and symbol",
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
