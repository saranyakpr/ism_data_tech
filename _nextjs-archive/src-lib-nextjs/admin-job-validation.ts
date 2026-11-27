import { z } from "zod";

const nonBlankText = (max: number) =>
  z.string().trim().min(1, "This field is required.").max(max);

const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Deadline must use YYYY-MM-DD format.")
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(parsed.valueOf()) &&
      parsed.toISOString().slice(0, 10) === value;
  }, "Deadline must be a valid calendar date.");

export const jobFieldsSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase, hyphen-separated slug."),
  title: nonBlankText(160),
  department: nonBlankText(120),
  location: nonBlankText(160),
  employment_type: z.enum([
    "full_time",
    "part_time",
    "contract",
    "internship",
  ]),
  work_mode: z.enum(["on_site", "remote", "hybrid"]),
  experience: nonBlankText(120),
  description: nonBlankText(10000),
  requirements: z.array(nonBlankText(500)).max(100),
  responsibilities: z.array(nonBlankText(500)).max(100),
  qualifications: z.array(nonBlankText(500)).max(100),
  deadline: dateOnly.nullable(),
});

export const createJobSchema = jobFieldsSchema
  .extend({
    state: z.enum(["draft", "published", "closed"]).default("draft"),
  })
  .strict()
  .refine(
    (job) =>
      job.state !== "published" ||
      job.deadline === null ||
      job.deadline >= new Date().toISOString().slice(0, 10),
    {
      message: "A job with a past deadline cannot be published.",
      path: ["deadline"],
    },
  );

export const updateJobSchema = jobFieldsSchema
  .extend({
    state: z.enum(["draft", "published", "closed"]),
  })
  .strict()
  .refine(
    (job) =>
      job.state !== "published" ||
      job.deadline === null ||
      job.deadline >= new Date().toISOString().slice(0, 10),
    {
      message: "A job with a past deadline cannot be published.",
      path: ["deadline"],
    },
  );
