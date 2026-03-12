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
    if (!prospect.telegram_username) continue;

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
        channel: "telegram",
        body: personalizedBody,
        status: "queued",
      })
      .select()
      .single();

    // Log activity
    await supabase.from("activities").insert({
      prospect_id: prospect.id,
      type: "message_sent",
      title: `Telegram message queued`,
      notes: personalizedBody.substring(0, 200),
      metadata: { channel: "telegram", messageId: msg?.id },
    });

    // Send via Telegram Bot API if configured
    if (
      process.env.TELEGRAM_BOT_TOKEN &&
      process.env.TELEGRAM_BOT_TOKEN !== "placeholder"
    ) {
      try {
        // Note: Telegram requires chat_id, not username.
        // The chat_id must be stored when user starts conversation with bot.
        const telegramMetadata = prospect.metadata as Record<string, string> | null;
        const chatId = telegramMetadata?.telegram_chat_id;
        if (chatId) {
          const res = await fetch(
            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: chatId,
                text: personalizedBody,
                parse_mode: "Markdown",
              }),
            }
          );

          if (res.ok && msg) {
            await supabase
              .from("messages_sent")
              .update({ status: "sent", sent_at: new Date().toISOString() })
              .eq("id", msg.id);
          }
        }
      } catch {
        if (msg) {
          await supabase
            .from("messages_sent")
            .update({
              status: "failed",
              error_message: "Telegram send failed",
            })
            .eq("id", msg.id);
        }
      }
    }

    results.push({ prospectId: prospect.id, status: "queued" });
  }

  return NextResponse.json({ sentCount: results.length, results });
}
