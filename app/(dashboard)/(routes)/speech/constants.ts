import * as z from "zod";

export const formSchema = z.object({
  text: z.string(),
});