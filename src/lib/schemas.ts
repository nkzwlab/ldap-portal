import * as z from "zod";

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be 8 charatcers long or more" })
  .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: "Password must include at least 1 alphabet, number, and symbol",
  })
  .max(256, { message: "Password is too long" });
