"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button";
import { controlClasses, FormField } from "@/components/molecules/FormField";
import { fieldErrors, HONEYPOT, newsletterSchema, type FieldErrors, type FormResult, type NewsletterInput } from "@/lib/forms";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Newsletter sign-up: email, the language of the editions (defaults to the page's) and explicit
 * consent. Same validation as /api/newsletter.
 */
export function NewsletterForm() {
  const t = useTranslations("forms");
  const locale = useLocale();
  const id = useId();
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FieldErrors<NewsletterInput>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parsed = newsletterSchema.safeParse({
      email: String(data.get("email") ?? ""),
      language: String(data.get("language") ?? ""),
      consent: data.get("consent") === "on",
    });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus());
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...parsed.data, [HONEYPOT]: String(data.get(HONEYPOT) ?? "") }),
      });
      const result = (await response.json()) as FormResult;
      if (result.ok) return setStatus("sent");
      setFailure(result.error === "rate_limited" ? t("errorRate") : t("errorGeneric", { email: site.email }));
    } catch {
      setFailure(t("errorGeneric", { email: site.email }));
    }
    setStatus("error");
  }

  if (status === "sent") {
    return (
      <div role="status" className="grid gap-3">
        <p className="type-h2">{t("subscribedTitle")}</p>
        <p className="type-lead text-muted">{t("subscribedText")}</p>
      </div>
    );
  }

  return (
    <form ref={form} noValidate onSubmit={submit} className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <FormField id={`${id}-email`} label={t("email")} error={errors.email ? t(`errors.${errors.email}`) : undefined}>
          {(describedBy) => (
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              className={controlClasses}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={describedBy}
            />
          )}
        </FormField>
        <FormField id={`${id}-language`} label={t("language")}>
          {() => (
            <select id={`${id}-language`} name="language" defaultValue={locale} className={controlClasses}>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          )}
        </FormField>
      </div>

      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-${HONEYPOT}`}>Website</label>
        <input id={`${id}-${HONEYPOT}`} name={HONEYPOT} tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-2">
        <label className="flex items-start gap-3 type-body">
          <input
            name="consent"
            type="checkbox"
            className="mt-1.5 size-4 shrink-0 accent-[var(--s-accent)]"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
          />
          <span>{t("consentNewsletter")}</span>
        </label>
        {errors.consent && (
          <p id={`${id}-consent-error`} className="type-small">
            {t(`errors.${errors.consent}`)}
          </p>
        )}
      </div>

      <div aria-live="polite" className="grid gap-4">
        {status === "error" && <p className="type-body">{failure}</p>}
        <div>
          <Button type="submit" disabled={status === "sending"} arrow>
            {status === "sending" ? t("subscribing") : t("subscribe")}
          </Button>
        </div>
      </div>
    </form>
  );
}
