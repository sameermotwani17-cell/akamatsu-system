import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const authClient = await createClient();
  const { data: authData } = await authClient.auth.getUser();
  if (!authData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  return NextResponse.json({
    status: "skeleton",
    message: "Payment intent route is a placeholder for provider integration.",
    nextSteps: [
      "Validate order and amount",
      "Create provider payment intent",
      "Store provider reference",
      "Return client secret/token to frontend",
    ],
    payload: body,
  });
}
