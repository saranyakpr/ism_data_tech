import { sql } from "../config/database.js";

import {
  applicationParamsSchema,
  applicationStatusSchema,
} from "../config/application-validation.js";

export async function updateApplicationStatus(req, res) {
  const parsedParams = applicationParamsSchema.safeParse(req.params);

  if (!parsedParams.success) {
    return res.status(400).json({
      error: "Invalid application ID.",
    });
  }

  if (!req.is("application/json")) {
    return res.status(415).json({
      error: "Expected a JSON request.",
    });
  }

  const parsedBody = applicationStatusSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      error: "Invalid application status.",
    });
  }

  try {
    const updated = await sql`
      UPDATE applications
      SET status = ${parsedBody.data.status}
      WHERE id = ${parsedParams.data.id}
      RETURNING id, status, updated_at
    `;

    if (!updated[0]) {
      return res.status(404).json({
        error: "Application not found.",
      });
    }

    return res.json({
      application: updated[0],
    });
  } catch (error) {
    console.error(
      "Admin application update failed:",
      error instanceof Error ? error.message : "Unknown server error"
    );

    return res.status(503).json({
      error: "Unable to update application status.",
    });
  }
}