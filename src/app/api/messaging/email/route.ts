import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { interpolateTemplate } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();
  const { prospectIds, subject, body: messageBody } = body;

  if (!prospectIds?.length || !messageBody) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Fetch prospects
  const { data: prospects } = await supabase
    .from("prospects")
    .select("*")
    .in("id", prospectIds);

  if (!prospects?.length) {
    return NextResponse.json({ error: "No prospects found" }, { status: 404 });
  }

  const results = [];
  for (const prospect of prospects) {
    const vars = {
      first_name: prospect.first_name,
      last_name: prospect.last_name,
      capital_level: Number(prospect.investable_capital).toLocaleString(),
      stage: prospect.stage,
    };

    const personalizedBody = interpolateTemplate(messageBody, vars);
    const personalizedSubject = subject
      ? interpolateTemplate(subject, vars)
      : undefined;

    // Store message record
    const { data: msg } = await supabase
      .from("messages_sent")
      .insert({
        prospect_id: prospect.id,
        channel: "email",
        subject: personalizedSubject,
        body: personalizedBody,
        status: "queued",
      })
      .select()
      .single();

    // Log activity
    await supabase.from("activities").insert({
      prospect_id: prospect.id,
      type: "message_sent",
      title: `Email queued: ${personalizedSubject || "No subject"}`,
      notes: personalizedBody.substring(0, 200),
      metadata: { channel: "email", messageId: msg?.id },
    });

    // Send via Resend API if configured
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "placeholder") {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || "noreply@ekantikcapital.com",
            to: prospect.email,
            subject: personalizedSubject || "Message from Ekantik Capital",
            text: personalizedBody,
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
              error_message: "Email send failed",
            })
            .eq("id", msg.id);
        }
      }
    }

    results.push({ prospectId: prospect.id, status: "queued" });
  }

  return NextResponse.json({ sentCount: results.length, results });
}
