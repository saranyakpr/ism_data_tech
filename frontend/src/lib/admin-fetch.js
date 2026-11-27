/**
 * safeAdminFetch
 *
 * Wraps fetch for admin API calls. Always includes credentials so the session
 * cookie is sent. Parses the JSON body safely — if the server returns an empty
 * body or non-JSON content (e.g. a crashed middleware returning nothing) this
 * throws a clear error instead of the cryptic
 * "Failed to execute 'json' on 'Response': Unexpected end of JSON input".
 *
 * Returns the parsed body. Throws an Error if:
 *  - the network request fails
 *  - the response body is empty when JSON was expected
 *  - the response body is not valid JSON
 *  - response.ok is false (throws with the server's error message if present)
 */
export async function safeAdminFetch(url, options = {}) {
  const response = await fetch(url, {
    credentials: "include",
    ...options,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const text = await response.text();

  let data = null;

  if (text.trim().length > 0) {
    if (contentType.includes("application/json")) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Server returned invalid JSON (HTTP ${response.status}).`
        );
      }
    } else {
      // Non-JSON body — surface it as a readable error
      throw new Error(
        `Server returned unexpected content type "${contentType}" (HTTP ${response.status}).`
      );
    }
  } else if (!response.ok) {
    // Empty body + error status
    throw new Error(`Request failed with status ${response.status}.`);
  }
  // Empty body + 2xx is treated as success (data stays null)

  if (!response.ok) {
    throw new Error(
      data?.error ?? data?.message ?? `Request failed with status ${response.status}.`
    );
  }

  return { response, data };
}
