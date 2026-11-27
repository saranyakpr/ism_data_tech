import { z } from "zod";

export const applicationParamsSchema = z.object({
  id: z.string().uuid(),
});

export const applicationStatusSchema = z
  .object({
    status: z.enum([
      "new",
      "under_review",
      "shortlisted",
      "interview_scheduled",
      "selected",
      "rejected",
    ]),
  })
  .strict();