const DOCUMENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "connect-src 'self' https://challenges.cloudflare.com",
  "font-src 'self' data:",
  "form-action 'self'",
  "frame-src https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob:",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "upgrade-insecure-requests",
].join("; ");

export function withSecurityHeaders(
  response: Response,
  request: Request,
): Response {
  const headers = new Headers(response.headers);
  headers.set("x-content-type-options", "nosniff");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  headers.set(
    "permissions-policy",
    "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
  );
  headers.set("cross-origin-opener-policy", "same-origin");
  headers.set("x-frame-options", "DENY");

  if (new URL(request.url).protocol === "https:") {
    headers.set(
      "strict-transport-security",
      "max-age=31536000; includeSubDomains",
    );
  }

  const contentType = headers.get("content-type") ?? "";
  if (/^text\/html\b/i.test(contentType)) {
    headers.set("content-security-policy", DOCUMENT_SECURITY_POLICY);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
