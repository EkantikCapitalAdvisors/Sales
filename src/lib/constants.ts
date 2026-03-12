// Pipeline stages in order
export const PIPELINE_STAGES = [
  { id: "outreach", label: "Warm Outreach", color: "#6B7280" },
  { id: "discovery", label: "Discovery Call", color: "#3B82F6" },
  { id: "leavebehind", label: "Leave-Behind", color: "#8B5CF6" },
  { id: "diligence", label: "Due Diligence", color: "#F59E0B" },
  { id: "strategy", label: "Strategy Presentation", color: "#10B981" },
  { id: "close", label: "Founding Close", color: "#C8A951" },
] as const;

export type StageId = (typeof PIPELINE_STAGES)[number]["id"];

export const INACTIVE_STAGES = ["lost", "paused"] as const;
export type InactiveStageId = (typeof INACTIVE_STAGES)[number];
export type AllStageId = StageId | InactiveStageId;

export const TEMPERATURE_OPTIONS = [
  { id: "hot", label: "Hot", color: "#EF4444" },
  { id: "warm", label: "Warm", color: "#F59E0B" },
  { id: "cold", label: "Cold", color: "#3B82F6" },
] as const;

export type Temperature = (typeof TEMPERATURE_OPTIONS)[number]["id"];

export const SOURCE_OPTIONS = [
  "referral",
  "linkedin",
  "personal",
  "other",
] as const;

export type Source = (typeof SOURCE_OPTIONS)[number];

export const INVESTMENT_EXPERIENCE_OPTIONS = [
  "novice",
  "intermediate",
  "sophisticated",
] as const;

export const RISK_TOLERANCE_OPTIONS = [
  "conservative",
  "moderate",
  "aggressive",
] as const;

export const FOUNDING_STATUS_OPTIONS = [
  "founding",
  "standard",
  "undecided",
] as const;

export const ACTIVITY_TYPES = [
  { id: "phone_call", label: "Phone Call", icon: "Phone" },
  { id: "email_sent", label: "Email Sent", icon: "Mail" },
  { id: "email_received", label: "Email Received", icon: "MailOpen" },
  { id: "link_sent", label: "Link Sent", icon: "Link" },
  { id: "link_viewed", label: "Link Viewed", icon: "Eye" },
  { id: "meeting_zoom", label: "Meeting (Zoom)", icon: "Video" },
  { id: "meeting_inperson", label: "Meeting (In-Person)", icon: "Handshake" },
  { id: "document_sent", label: "Document Sent", icon: "FileText" },
  { id: "note", label: "Note", icon: "StickyNote" },
  { id: "stage_change", label: "Stage Change", icon: "ArrowRight" },
  { id: "follow_up_set", label: "Follow-Up Set", icon: "Clock" },
  { id: "objection_logged", label: "Objection Logged", icon: "AlertTriangle" },
  { id: "message_sent", label: "Message Sent", icon: "Send" },
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number]["id"];

export const LINK_TYPES = ["dashboard", "freedom", "epig"] as const;
export type LinkType = (typeof LINK_TYPES)[number];

export const MESSAGE_CHANNELS = ["email", "whatsapp", "telegram"] as const;
export type MessageChannel = (typeof MESSAGE_CHANNELS)[number];

export const LOST_REASONS = [
  "timing",
  "competitor",
  "not_ready",
  "price",
  "other",
] as const;

// Brand colors
export const BRAND = {
  navy: "#1B2A4A",
  gold: "#C8A951",
  navyLight: "#2A3F6B",
  navyDark: "#0F1B33",
  goldLight: "#D4BA72",
  goldDark: "#A68B3C",
  white: "#FFFFFF",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray500: "#6B7280",
  gray700: "#374151",
  gray900: "#111827",
} as const;

// Default KPI alert thresholds
export const DEFAULT_THRESHOLDS = {
  pipelineSize: 10,
  pipelineValue: 5000000,
  seatsRemaining: 5,
  conversionRate: 15,
  avgDaysToClose: 60,
  hotProspectCount: 3,
  overdueFollowUps: 0,
  weeklyActivityVolume: 10,
} as const;

export const DEFAULT_SEAT_CAP = 25;

// Checklist workstreams
export const CHECKLIST_SECTIONS = [
  "Dashboard",
  "Freedom Site",
  "EPIG Site",
  "Outreach Materials",
] as const;
