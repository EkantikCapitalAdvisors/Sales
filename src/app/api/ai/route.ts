import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Simple in-memory rate limiter: max 20 AI requests per minute per user
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

const SYSTEM_PROMPT = `You are an elite sales strategist and AI assistant for Ekantik Capital Advisors, a wealth management firm onboarding its first 25 Founding Members.

Context about the business:
- Ekantik Capital manages money through a quantitative, rules-based approach
- They have 3 key digital assets: Performance Dashboard (live equity curve, trade log), Freedom Calculator (financial independence projections), and EPIG Site (backtest data, 3-layer architecture)
- The sales pipeline has 6 stages: Warm Outreach → Discovery Call → Leave-Behind → Due Diligence → Strategy Presentation → Founding Close
- Founding Members get preferential fee structures vs Standard members
- The founder is Hiren Desai

Your role varies by request type:
1. PROSPECT_INSIGHTS: Analyze prospect data and provide a concise summary, deal health score (1-10), key risks, and recommended focus areas
2. SALES_COACH: Suggest specific next actions, talking points, and strategies based on the prospect's stage, temperature, and profile
3. DRAFT_MESSAGE: Write a personalized message (email, WhatsApp, or Telegram) that matches the channel's tone and the prospect's context
4. OBJECTION_RESPONSE: Craft a response to a specific objection using Ekantik's assets as proof points

Always be specific, actionable, and grounded in the prospect's actual data. Avoid generic advice.`;

export async function POST(request: NextRequest) {
  try {
    // 1. Verify user is authenticated
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Rate limit per user
    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        { error: "Too many AI requests. Please wait a minute." },
        { status: 429 }
      );
    }

    // 3. Check API key is configured
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "placeholder") {
      return NextResponse.json(
        { error: "Anthropic API key not configured. Add ANTHROPIC_API_KEY to .env.local" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { type, prospect, context } = body;

    if (!type) {
      return NextResponse.json({ error: "Missing 'type' field" }, { status: 400 });
    }

    let userPrompt = "";

    switch (type) {
      case "PROSPECT_INSIGHTS": {
        userPrompt = `Analyze this prospect and provide insights:

**Prospect:** ${prospect.firstName} ${prospect.lastName}
**Email:** ${prospect.email}
**Stage:** ${prospect.stage}
**Temperature:** ${prospect.temperature}
**Investable Capital:** $${Number(prospect.investableCapital).toLocaleString()}
**Estimated AUM:** ${prospect.estimatedAum ? `$${Number(prospect.estimatedAum).toLocaleString()}` : "Not set"}
**Source:** ${prospect.source}${prospect.sourceDetail ? ` (${prospect.sourceDetail})` : ""}
**Investment Experience:** ${prospect.investmentExperience || "Unknown"}
**Risk Tolerance:** ${prospect.riskTolerance || "Unknown"}
**Current Advisor:** ${prospect.currentAdvisor || "None"}
**Current Fee %:** ${prospect.currentFeePct || "Unknown"}
**10-Year Goal:** ${prospect.tenYearGoal || "Not discussed"}
**Target Monthly Income:** ${prospect.targetMonthlyIncome ? `$${Number(prospect.targetMonthlyIncome).toLocaleString()}` : "Not set"}
**Founding Status:** ${prospect.foundingVsStandard}
**Days in Current Stage:** ${prospect.daysInStage || "Unknown"}
**Next Follow-Up:** ${prospect.nextFollowUp || "Not scheduled"}
**Notes:** ${prospect.notes || "None"}
**Custom Plan Sent:** ${prospect.customPlanSent ? "Yes" : "No"}

${context?.activities ? `**Recent Activities:**\n${context.activities.map((a: { type: string; title: string; createdAt: string; notes?: string }) => `- ${a.type}: ${a.title} (${a.createdAt})${a.notes ? ` — ${a.notes}` : ""}`).join("\n")}` : "No activities logged yet."}

${context?.objections ? `**Active Objections:**\n${context.objections.map((o: { objectionText: string; status: string }) => `- "${o.objectionText}" (${o.status})`).join("\n")}` : ""}

Provide:
1. **Deal Health Score** (1-10 with brief justification)
2. **Key Risks** (2-3 bullet points)
3. **Strengths** (2-3 bullet points)
4. **Recommended Focus** (1-2 specific, actionable recommendations)`;
        break;
      }

      case "SALES_COACH": {
        userPrompt = `Provide coaching for this prospect:

**Prospect:** ${prospect.firstName} ${prospect.lastName}
**Stage:** ${prospect.stage}
**Temperature:** ${prospect.temperature}
**Investable Capital:** $${Number(prospect.investableCapital).toLocaleString()}
**Investment Experience:** ${prospect.investmentExperience || "Unknown"}
**Risk Tolerance:** ${prospect.riskTolerance || "Unknown"}
**Current Advisor:** ${prospect.currentAdvisor || "None"}
**Founding Status:** ${prospect.foundingVsStandard}
**Days in Current Stage:** ${prospect.daysInStage || "Unknown"}
**10-Year Goal:** ${prospect.tenYearGoal || "Not discussed"}
**Notes:** ${prospect.notes || "None"}

${context?.activities ? `**Recent Activities:**\n${context.activities.map((a: { type: string; title: string; createdAt: string }) => `- ${a.type}: ${a.title} (${a.createdAt})`).join("\n")}` : "No activities logged yet."}

${context?.linksSent ? `**Links Sent:** ${context.linksSent.map((l: { linkType: string }) => l.linkType).join(", ")}` : "No links sent yet."}

Provide:
1. **Next Best Action** (one specific action to take TODAY)
2. **Talking Points** (3 specific points tailored to this prospect)
3. **Stage Advancement Checklist** (what's needed to move to the next stage)
4. **Risk Mitigation** (if any concerns, how to address them)`;
        break;
      }

      case "DRAFT_MESSAGE": {
        const channel = context?.channel || "email";
        const purpose = context?.purpose || "follow-up";
        userPrompt = `Draft a ${channel} message for this prospect:

**Prospect:** ${prospect.firstName} ${prospect.lastName}
**Stage:** ${prospect.stage}
**Temperature:** ${prospect.temperature}
**Investable Capital:** $${Number(prospect.investableCapital).toLocaleString()}
**Investment Experience:** ${prospect.investmentExperience || "Unknown"}
**Founding Status:** ${prospect.foundingVsStandard}
**Purpose:** ${purpose}

${context?.previousMessages ? `**Previous Messages:**\n${context.previousMessages}` : ""}
${context?.customInstructions ? `**Special Instructions:** ${context.customInstructions}` : ""}

${channel === "email" ? `Write a professional but warm email. Include a subject line on the first line formatted as "Subject: ...". Sign off as Hiren Desai, Ekantik Capital Advisors.` : ""}
${channel === "whatsapp" ? `Write a concise WhatsApp message. Keep it under 300 characters. Casual but professional tone. Can use 1-2 relevant emojis.` : ""}
${channel === "telegram" ? `Write a Telegram message. Brief and friendly. Can use emojis sparingly.` : ""}

Write ONLY the message content, ready to send.`;
        break;
      }

      case "OBJECTION_RESPONSE": {
        const objection = context?.objection || "general concern";
        userPrompt = `A prospect has raised this objection: "${objection}"

**Prospect:** ${prospect.firstName} ${prospect.lastName}
**Stage:** ${prospect.stage}
**Investable Capital:** $${Number(prospect.investableCapital).toLocaleString()}
**Investment Experience:** ${prospect.investmentExperience || "Unknown"}
**Current Advisor:** ${prospect.currentAdvisor || "None"}

Provide:
1. **Empathetic Acknowledgment** (1 sentence)
2. **Response** (2-3 sentences using Ekantik's specific assets as proof points)
3. **Suggested Action** (what to do or send next)
4. **Follow-Up Question** (to keep the conversation moving)`;
        break;
      }

      default:
        return NextResponse.json({ error: `Unknown type: ${type}` }, { status: 400 });
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const content = message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ content, type });
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { error: "AI request failed" },
      { status: 500 }
    );
  }
}
