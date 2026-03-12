import { z } from "zod";

export const activityFormSchema = z.object({
  type: z.enum([
    "phone_call",
    "email_sent",
    "email_received",
    "link_sent",
    "link_viewed",
    "meeting_zoom",
    "meeting_inperson",
    "document_sent",
    "note",
    "stage_change",
    "follow_up_set",
    "objection_logged",
    "message_sent",
  ]),
  title: z.string().min(1, "Title is required").max(500),
  notes: z.string().optional(),
  durationMinutes: z.number().optional(),
  outcome: z.string().max(200).optional(),
  complianceFlag: z.boolean().default(false),
});

export type ActivityFormData = z.infer<typeof activityFormSchema>;
