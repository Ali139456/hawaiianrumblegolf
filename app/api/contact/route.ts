import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { site } from "@/lib/site";

const resendKey = process.env.RESEND_API_KEY;
const contactTo = process.env.CONTACT_TO_EMAIL;
const contactFrom = process.env.CONTACT_FROM_EMAIL;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { name, email, phone, message } = body as Record<string, unknown>;
  const nameStr = typeof name === "string" ? name.trim() : "";
  const emailStr = typeof email === "string" ? email.trim() : "";
  const phoneStr = typeof phone === "string" ? phone.trim() : "";
  const messageStr = typeof message === "string" ? message.trim() : "";

  if (!nameStr || nameStr.length > 120) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!emailStr || !isValidEmail(emailStr)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  if (!messageStr || messageStr.length > 4000) {
    return NextResponse.json({ error: "Please enter a message (up to 4000 characters)." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  let saved = false;
  if (supabase) {
    const { error } = await supabase.from("contact_messages").insert({
      name: nameStr,
      email: emailStr,
      phone: phoneStr || null,
      message: messageStr,
    });
    if (!error) saved = true;
  }

  let emailed = false;
  if (resendKey && contactTo && contactFrom) {
    const resend = new Resend(resendKey);
    const { error } = await resend.emails.send({
      from: contactFrom,
      to: [contactTo],
      replyTo: emailStr,
      subject: `Website message from ${nameStr} — ${site.shortName}`,
      text: [
        `Name: ${nameStr}`,
        `Email: ${emailStr}`,
        phoneStr ? `Phone: ${phoneStr}` : "Phone: (not provided)",
        "",
        messageStr,
      ].join("\n"),
    });
    if (!error) emailed = true;
  }

  if (!saved && !emailed) {
    return NextResponse.json(
      {
        error:
          "Message could not be sent. Please call us or try again later.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, saved, emailed });
}
