import { z } from "zod";

export interface SubjectData {
  _id: string;
  name: string;
  code: string;
  teacher: string[] | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const subjectFormSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .min(2, "Name must be at least 2 chars"),
  code: z
    .string({ error: "Code is required" })
    .min(2, "Code is required")
    .toUpperCase(),
  teacher: z.array(z.string()).optional(),
  isActive: z.boolean().optional().default(true),
});

export type SubjectFormValues = z.infer<typeof subjectFormSchema>;
