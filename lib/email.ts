import "server-only";
import { Resend } from "resend";

export async function sendEmail(input: { to: string; subject: string; text: string; html: string }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    return { ok: false as const, reason: "Email is not configured. Set RESEND_API_KEY and EMAIL_FROM." };
  }
  const resend = new Resend(key);
  const result = await resend.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });
  if (result.error) return { ok: false as const, reason: result.error.message };
  return { ok: true as const };
}
