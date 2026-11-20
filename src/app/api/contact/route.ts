import { Resend } from "resend";
import { contactSchema, HONEYPOT, type FormResult } from "@/lib/forms";
import { clientIp, escapeHtml, isProduction, json, rateLimited } from "@/lib/server-guard";
import { site } from "@/lib/site";

export const runtime = "nodejs";

const TOPIC_LABELS = { visit: "Visiting a gathering", team: "Joining a team", community: "Community support", other: "Something else" } as const;

/**
 * Contact form → email to the church (CONTACT_TO_EMAIL) via Resend, with reply-to set to the
 * visitor so a plain "Reply" answers them. Honeypot hits get a fake success; 5 messages per IP
 * per 10 minutes. Without Resend keys: simulated in development, 503 in production.
 */
export async function POST(request: Request) {
  const reply = (result: FormResult, status = 200) => json(result, status);
  if (rateLimited(`contact:${clientIp(request)}`, 5, 10 * 60_000)) return reply({ ok: false, error: "rate_limited" }, 429);

  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return reply({ ok: false, error: "invalid" }, 400);
  }
  if (typeof raw[HONEYPOT] === "string" && raw[HONEYPOT]) return reply({ ok: true });

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) return reply({ ok: false, error: "invalid" }, 400);
  const data = parsed.data;
  const locale = raw.locale === "es" ? "Spanish" : "English";

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) {
    if (isProduction()) return reply({ ok: false, error: "not_configured" }, 503);
    console.info("[contact:simulated]", { topic: data.topic, about: data.about, locale });
    return reply({ ok: true, simulated: true });
  }

  const rows: [string, string][] = [
    ["Topic", TOPIC_LABELS[data.topic]],
    ...(data.about ? ([["About", data.about]] as [string, string][]) : []),
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone || "(not given)"],
    ["Wrote in", locale],
  ];
  const text = [`New message from ${site.url}`, "", ...rows.map(([label, value]) => `${label}: ${value}`), "", "Message:", data.message].join("\n");
  const html = `<p>New message from <a href="${site.url}">${escapeHtml(site.url)}</a></p>
<table cellspacing="0" cellpadding="0">${rows
    .map(([label, value]) => `<tr><td style="padding:4px 16px 4px 0;color:#4b4943"><strong>${escapeHtml(label)}</strong></td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`)
    .join("")}</table>
<p><strong>Message</strong></p><p>${escapeHtml(data.message).replace(/\n/g, "<br/>")}</p>`;

  try {
    const { error } = await new Resend(key).emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `Website message: ${TOPIC_LABELS[data.topic]}${data.about ? ` (${data.about})` : ""} from ${data.name}`,
      text,
      html,
    });
    if (error) throw error;
    return reply({ ok: true });
  } catch (error) {
    console.error("[contact] Resend failed", error);
    return reply({ ok: false, error: "failed" }, 502);
  }
}
