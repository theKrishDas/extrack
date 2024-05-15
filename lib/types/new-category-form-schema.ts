import { z } from "zod";

export const NewCategorySchema = z.object({
  name: z.string().toLowerCase(),
});
export type NewCategorySchemaType = z.infer<typeof NewCategorySchema>;
