import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  image: z
    .any()
    .refine(
      (file) => !file || file?.[0]?.size <= 2 * 1024 * 1024,
      "Ukuran gambar max 2MB"
    )
    .optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
