import { z } from "zod";

export const prospectFormSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(20).optional().or(z.literal("")),
  whatsappNumber: z.string().max(20).optional().or(z.literal("")),
  telegramUsername: z.string().max(100).optional().or(z.literal("")),
  mailingAddress: z.string().optional().or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
  spouseName: z.string().max(200).optional().or(z.literal("")),
  spouseEmail: z
    .string()
    .email("Invalid spouse email")
    .optional()
    .or(z.literal("")),
  investableCapital: z
    .string()
    .min(1, "Investable capital is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Must be a positive number",
    }),
  annualIncome: z.string().optional().or(z.literal("")),
  currentAdvisor: z.string().max(200).optional().or(z.literal("")),
  currentFeePct: z.string().optional().or(z.literal("")),
  investmentExperience: z
    .enum(["novice", "intermediate", "sophisticated"])
    .optional()
    .or(z.literal("")),
  riskTolerance: z
    .enum(["conservative", "moderate", "aggressive"])
    .optional()
    .or(z.literal("")),
  tenYearGoal: z.string().optional().or(z.literal("")),
  targetMonthlyIncome: z.string().optional().or(z.literal("")),
  source: z.enum(["referral", "linkedin", "personal", "other"]),
  sourceDetail: z.string().optional().or(z.literal("")),
  temperature: z.enum(["hot", "warm", "cold"]).default("warm"),
  foundingVsStandard: z
    .enum(["founding", "standard", "undecided"])
    .default("undecided"),
  estimatedAum: z.string().optional().or(z.literal("")),
  estimatedCloseDate: z.string().optional().or(z.literal("")),
  nextFollowUp: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export type ProspectFormData = z.infer<typeof prospectFormSchema>;

export const lostReasonSchema = z.object({
  lostReason: z.enum(["timing", "competitor", "not_ready", "price", "other"]),
  lostReasonDetail: z.string().optional(),
});
