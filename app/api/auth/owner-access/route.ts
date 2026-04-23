import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isOwnerUser } from "@/lib/auth/owner";

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json({ authenticated: false, owner: false });
  }

  return NextResponse.json({
    authenticated: true,
    owner: isOwnerUser(data.user),
  });
}