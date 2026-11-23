import type { z } from "zod";
import type { opportunitySchema } from "@/lib/content/schemas";

/** Openings at Altar (phase 2): added once the client approves each one and its application process. */
export const opportunities: z.input<typeof opportunitySchema>[] = [];
