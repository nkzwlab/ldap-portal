import { passwordSchema } from "@/lib/schemas";
import { Shell, shells } from "@/lib/types";
import * as z from "zod";
export const schema = z.object({
  pubkeys: z.object({ value: z.string() }).array(),
});

export type Schema = z.infer<typeof schema>;
