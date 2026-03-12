import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { interpolateTemplate } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();
  const { prospectIds, body: messageBody } = body;

  if (!prospectIds?.length || !messageBody) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const { data: prospects } = await supabase
    .from("prospects")
    .select("*")
    .in("id", prospectIds);

  if (!prospects?.length) {
    return NextResponse.json({ error: "No prospects found" }, { status: 404 });
  }

  const results = [];
  for (const prospect of prospects) {
    if (!prospect.whatsapp_number) continue;

    const vars = {
      first_name: prospect.first_name,
      last_name: prospect.last_name,
      capital_level: Number(prospect.investable_capital).toLocaleString(),
      stage: prospect.stage,
    };

    const personalizedBody = interpolateTemplate(messageBody, vars);

    // Store message record
    const { data: msg } = await supabase
      .from("messages_sent")
      .insert({
        prospect_id: prospect.id,
        channel: "whatsapp",
        body: personalizedBody,
        status: "queued",
      })
      .select()
      .single();

    // Log activity
    await supabase.from("activities").insert({
      prospect_id: prospect.id,
      type: "message_sent",
      title: `WhatsApp message queued`,
      notes: personalizedBody.substring(0, 200),
      metadata: { channel: "whatsapp", messageId: msg?.id },
    });

    // Send via Twilio if configured
    if (
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_ACCOUNT_SID !== "placeholder"
    ) {
      try {
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;
        const res = await fetch(twilioUrl, {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
            ).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            From: process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886",
            To: `whatsapp:${prospect.whatsapp_number}`,
            Body: personalizedBody,
          }),
        });

        if (res.ok && msg) {
          await supabase
            .from("messages_sent")
            .update({ status: "sent", sent_at: new Date().toISOString() })
            .eq("id", msg.id);
        }
      } catch {
        if (msg) {
          await supabase
            .from("messages_sent")
            .update({
              status: "failed",
              error_message: "WhatsApp send failed",
            })
            .eq("id", msg.id);
        }
      }
    }

    results.push({ prospectId: prospect.id, status: "queued" });
  }

  return NextResponse.json({ sentCount: results.length, results });
}
