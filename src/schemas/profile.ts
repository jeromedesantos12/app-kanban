import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().min(3, "Full Name must be at least 3 characters."),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
