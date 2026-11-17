import { clientIp, jsonError } from "@/lib/http";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";
import { contactSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = rateLimit(`contact:${clientIp(req)}`, 5, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);
  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("Check the name, email, and message", 400);
  if (parsed.data.website) return Response.json({ ok: true });
  const to = process.env.CONTACT_TO || process.env.EMAIL_FROM;
  if (!to) return jsonError("The contact form is not configured yet", 503);
  const result = await sendEmail({
    to,
    subject: `Message from ${parsed.data.name}`,
    text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
    html: `<p>From: ${escapeHtml(parsed.data.name)} &lt;${escapeHtml(parsed.data.email)}&gt;</p><p>${escapeHtml(parsed.data.message)}</p>`,
  });
  if (!result.ok) return jsonError(result.reason, 503);
  return Response.json({ ok: true });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
