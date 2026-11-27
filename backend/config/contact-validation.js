import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(160),
  company: z.string().trim().max(160).optional(),
  email: z.string().trim().email().max(254),
  phone: z
    .string()
    .trim()
    .refine(
      (value) => {
        const digits = value.replace(/\D/g, "");
        return digits.length >= 7 && digits.length <= 15;
      },
      "Please enter a valid phone number"
    ),
  country: z.string().trim().min(2).max(100),
  service: z.string().trim().min(1).max(160),
  requirements: z.string().trim().min(20).max(5000),
  timeline: z.string().trim().max(120).optional(),
  consent: z.literal(true),
});