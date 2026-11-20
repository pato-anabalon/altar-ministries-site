import { Resend } from "resend";
import { HONEYPOT, newsletterSchema, type FormResult } from "@/lib/forms";
import { clientIp, escapeHtml, isProduction, json, rateLimited } from "@/lib/server-guard";
import { site } from "@/lib/site";

export const runtime = "nodejs";

/**
 * Newsletter sign-up. The newsletter platform is still undecided (docs/PENDIENTES.md), so:
 * - with RESEND_NEWSLETTER_SEGMENT_EN / _ES set, the visitor becomes a Resend contact in the
 *   segment for the language they chose (one edition per language);
 * - otherwise the church is emailed the sign-up so no subscriber is lost.
 * Same guards as the contact form.
 */
export async function POST(request: Request) {
  const reply = (result: FormResult, status = 200) => json(result, status);
  if (rateLimited(`newsletter:${clientIp(request)}`, 5, 10 * 60_000)) return reply({ ok: false, error: "rate_limited" }, 429);

  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return reply({ ok: false, error: "invalid" }, 400);
  }
  if (typeof raw[HONEYPOT] === "string" && raw[HONEYPOT]) return reply({ ok: true });

  const parsed = newsletterSchema.safeParse(raw);
  if (!parsed.success) return reply({ ok: false, error: "invalid" }, 400);
  const { email, language } = parsed.data;

  const key = process.env.RESEND_API_KEY;
  const segment = language === "es" ? process.env.RESEND_NEWSLETTER_SEGMENT_ES : process.env.RESEND_NEWSLETTER_SEGMENT_EN;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || (!segment && (!to || !from))) {
    if (isProduction()) return reply({ ok: false, error: "not_configured" }, 503);
    console.info("[newsletter:simulated]", { language });
    return reply({ ok: true, simulated: true });
  }

  try {
    const resend = new Resend(key);
    if (segment) {
      const { error } = await resend.contacts.create({ email, unsubscribed: false, segments: [{ id: segment }] });
      if (error) throw error;
    } else {
      const languageName = language === "es" ? "Spanish" : "English";
      const { error } = await resend.emails.send({
        from: from!,
        to: to!,
        replyTo: email,
        subject: `Newsletter sign-up (${languageName})`,
        text: `New newsletter sign-up from ${site.url}\n\nEmail: ${email}\nLanguage: ${languageName}\nConsent: given on the website form`,
        html: `<p>New newsletter sign-up from ${escapeHtml(site.url)}</p><p><strong>Email:</strong> ${escapeHtml(email)}<br/><strong>Language:</strong> ${languageName}<br/><strong>Consent:</strong> given on the website form</p>`,
      });
      if (error) throw error;
    }
    return reply({ ok: true });
  } catch (error) {
    console.error("[newsletter] Resend failed", error);
    return reply({ ok: false, error: "failed" }, 502);
  }
}
