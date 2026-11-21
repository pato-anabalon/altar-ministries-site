import { useState, type FormEvent } from "react";
import type { FieldErrors } from "@/lib/forms";

/**
 * Inline errors that appear on submit and then follow the visitor's corrections: a field already
 * flagged is re-checked on every change, so its message updates (e.g. "required" → "invalid email")
 * and disappears as soon as the value is valid. Untouched fields stay quiet until the next submit.
 * Spread `onChange` on the <form>; change events bubble from every control.
 */
export function useFormErrors<T>(validate: (form: HTMLFormElement) => FieldErrors<T>) {
  const [errors, setErrors] = useState<FieldErrors<T>>({});

  function onChange(event: FormEvent<HTMLFormElement>) {
    const field = (event.target as HTMLInputElement).name as keyof T;
    if (!field || !errors[field]) return;
    const next = validate(event.currentTarget)[field];
    if (next === errors[field]) return;
    setErrors((current) => {
      const updated = { ...current };
      if (next) updated[field] = next;
      else delete updated[field];
      return updated;
    });
  }

  return { errors, setErrors, onChange };
}
