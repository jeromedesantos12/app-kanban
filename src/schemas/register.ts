import { z } from "zod";

export const registerSchema = z
  .object({
    full_name: z.string().min(3, "Full name must be at least 3 characters."),
    email: z.string().email("Invalid email format."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    confirmPassword: z.string().min(1, "Confirming the password is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
