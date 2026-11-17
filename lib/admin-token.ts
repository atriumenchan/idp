const PAYLOAD = "halden-admin-v1";

function hex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function adminSessionToken(secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(PAYLOAD));
  return hex(signature);
}

export async function adminSessionMatches(token: string | undefined, secret: string | undefined) {
  if (!token || !secret) return false;
  const expected = await adminSessionToken(secret);
  if (token.length !== expected.length) return false;
  let diff = 0;
  for (let index = 0; index < token.length; index += 1) {
    diff |= token.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  return diff === 0;
}

export const ADMIN_COOKIE = "halden_admin";
