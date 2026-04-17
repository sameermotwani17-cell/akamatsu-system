import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const rawBody = await req.text();

  // Provider signature verification should happen here before processing.
  return NextResponse.json({
    status: "skeleton",
    message: "Webhook received. Implement provider signature verification and event handling.",
    receivedLength: rawBody.length,
  });
}
