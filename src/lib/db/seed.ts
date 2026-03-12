// Seed data for the CRM database

export const SEED_OBJECTIONS = [
  {
    objectionText: "Does this actually work?",
    primaryAsset: "Dashboard",
    resolutionConfidence: 95,
    suggestedResponse:
      "Send live dashboard — equity curve, trade log, edge math",
  },
  {
    objectionText: "Market crash protection?",
    primaryAsset: "Dashboard + Freedom",
    resolutionConfidence: 90,
    suggestedResponse:
      "Dashboard risk controls + EPIG backtest (2008: 0% vs S&P -37%)",
  },
  {
    objectionText: "Capital protection?",
    primaryAsset: "Dashboard + EPIG",
    resolutionConfidence: 88,
    suggestedResponse:
      "Broker-enforced limits + 3-layer architecture + circuit breakers",
  },
  {
    objectionText: "Different from advisor?",
    primaryAsset: "Freedom",
    resolutionConfidence: 85,
    suggestedResponse:
      "Founding vs Standard comparison ($259K+ difference over 10 years)",
  },
  {
    objectionText: "No long track record?",
    primaryAsset: "Dashboard",
    resolutionConfidence: 80,
    suggestedResponse:
      "Frame short record as transparency feature — every trade from day 1",
  },
  {
    objectionText: "Need to think about it",
    primaryAsset: "Dashboard",
    resolutionConfidence: 92,
    suggestedResponse:
      "Dashboard updates weekly — time compounds trust, not pressure",
  },
  {
    objectionText: "CPA/attorney review?",
    primaryAsset: "All Sites",
    resolutionConfidence: 88,
    suggestedResponse:
      "Welcome it — send structured 3-link package + offer CPA call",
  },
  {
    objectionText: "Just want cash flow?",
    primaryAsset: "Conversation",
    resolutionConfidence: 70,
    suggestedResponse:
      "Acknowledge standalone, frame value gap of full membership",
  },
];

export const SEED_CHECKLIST_SECTIONS = [
  {
    name: "Dashboard",
    sortOrder: 0,
    items: [
      "Dashboard site live at dashboard.ekantikcapital.com",
      "Equity curve chart rendering real data",
      "Trade log with full history",
      "Edge math calculations verified",
      "Risk controls documentation visible",
      "Mobile responsive design verified",
      "Performance metrics updating weekly",
    ],
  },
  {
    name: "Freedom Site",
    sortOrder: 1,
    items: [
      "Freedom site live at freedom.ekantikcapital.com",
      "Freedom calculator functioning with accurate projections",
      "Founding vs Standard comparison visible",
      "Fee structure clearly displayed",
      "10-year projection model accurate",
      "Mobile responsive design verified",
    ],
  },
  {
    name: "EPIG Site",
    sortOrder: 2,
    items: [
      "EPIG site live at epig.ekantikcapital.com",
      "Backtest data displayed accurately",
      "3-layer architecture explained",
      "Historical performance charts working",
      "Circuit breaker documentation visible",
      "Mobile responsive design verified",
    ],
  },
  {
    name: "Outreach Materials",
    sortOrder: 3,
    items: [
      "Email templates created and reviewed",
      "WhatsApp message templates approved",
      "Telegram bot configured and tested",
      "Founding member pitch deck finalized",
      "One-pager PDF ready for distribution",
      "CRM prospect list imported",
      "Follow-up cadence documented",
    ],
  },
];

export const SEED_MESSAGE_TEMPLATES = [
  {
    name: "Post-Discovery Follow-Up",
    channel: "email" as const,
    subject: "Great speaking with you, {{first_name}}",
    body: `Hi {{first_name}},

It was a pleasure speaking with you today. As discussed, I wanted to share two key resources:

1. **Live Performance Dashboard**: See our real-time equity curve, trade log, and risk metrics
2. **Financial Freedom Calculator**: Model your personalized path to financial independence

I'll follow up in a few days to answer any questions. In the meantime, feel free to explore at your own pace.

Best regards,
Hiren Desai
Ekantik Capital Advisors`,
    stageTrigger: "discovery" as const,
  },
  {
    name: "Dashboard Reminder",
    channel: "email" as const,
    subject: "Weekly Update: Dashboard refreshed with latest data",
    body: `Hi {{first_name}},

Just a quick note — our performance dashboard has been updated with this week's data. The equity curve and trade log now reflect all activity through Friday.

Worth a quick look when you have a moment.

Best,
Hiren`,
    stageTrigger: "diligence" as const,
  },
  {
    name: "Strategy Presentation Invite",
    channel: "email" as const,
    subject: "Your Custom Strategy Plan is Ready, {{first_name}}",
    body: `Hi {{first_name}},

I've prepared a customized strategy plan based on our conversations and your financial goals. I'd love to walk you through it.

Would you be available for a 45-minute call this week? You can book directly here: [Calendly Link]

Looking forward to it.

Best,
Hiren`,
    stageTrigger: "strategy" as const,
  },
  {
    name: "WhatsApp Check-In",
    channel: "whatsapp" as const,
    subject: null,
    body: `Hi {{first_name}}, this is Hiren from Ekantik Capital. Just checking in — have you had a chance to review the dashboard? Happy to answer any questions. 📊`,
    stageTrigger: "diligence" as const,
  },
  {
    name: "Telegram Welcome",
    channel: "telegram" as const,
    subject: null,
    body: `Welcome {{first_name}}! 🎉 You're now connected with Ekantik Capital. I'll share updates and insights here. Feel free to message anytime with questions.`,
    stageTrigger: "outreach" as const,
  },
];

export const SEED_SETTINGS = [
  { key: "founding_seat_cap", value: 25 },
  {
    key: "alert_thresholds",
    value: {
      pipelineSize: 10,
      pipelineValue: 5000000,
      seatsRemaining: 5,
      conversionRate: 15,
      avgDaysToClose: 60,
      hotProspectCount: 3,
      overdueFollowUps: 0,
      weeklyActivityVolume: 10,
    },
  },
  {
    key: "email_config",
    value: { fromName: "Hiren Desai", fromEmail: "hiren@ekantikcapital.com" },
  },
  { key: "whatsapp_config", value: { enabled: false } },
  { key: "telegram_config", value: { enabled: false } },
];
