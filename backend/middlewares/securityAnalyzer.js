export default function analyzeSecurity(response, requestUrl) {
  const warnings = [];

  if (requestUrl.startsWith("http://")) {
    warnings.push(
      "⚠️Insecure HTTP used. Use HTTPS to protect data in transit."
    );
  }

  const headers = response.headers || {};

  if (!headers["strict-transport-security"]) {
    warnings.push("⚠️Missing Strict-Transport-Security header.");
  }

  if (!headers["content-security-policy"]) {
    warnings.push("⚠️Missing Content-Security-Policy header.");
  }

  if (!headers["access-control-allow-origin"]) {
    warnings.push("⚠️CORS headers missing (Access-Control-Allow-Origin).");
  }

  if (requestUrl.includes("token=")) {
    warnings.push(
      "⚠️Token detected in URL query string. Move it to Authorization header."
    );
  }

  return warnings;
}
