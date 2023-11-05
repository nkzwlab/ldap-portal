import { passwordSchema } from "@/lib/schemas";
import { Shell, shells } from "@/lib/types";
import * as z from "zod";
export const schema = z.object({
  shell: z.custom<Shell>(
    (s) => (shells as any as string[]).includes(s as string),
    {
      message: "Invalid shell",
    }
  ),
});

export type Schema = z.infer<typeof schema>;
