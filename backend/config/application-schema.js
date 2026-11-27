import { z } from "zod";

export const applicationSchema = z.object({
  jobId: z.string().uuid(),
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(20),
  location: z.string().trim().min(2).max(150),
  experience: z.string().trim().max(100).optional().default(""),
  education: z.string().trim().min(2).max(150),
  skills: z.string().trim().min(2).max(1000),
  linkedin: z.string().trim().optional().default(""),
  portfolio: z.string().trim().optional().default(""),
  coverLetter: z.string().trim().max(5000).optional().default(""),
  consent: z.literal(true),
  resume: z.string().optional(),
  resumeData: z.string().optional(),
  resumeName: z.string().min(1).max(180),
  resumeType: z.string().optional(),
});