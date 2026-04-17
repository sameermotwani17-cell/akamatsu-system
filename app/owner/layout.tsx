import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isOwnerUser } from "@/lib/auth/owner";

export default async function OwnerLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user || !isOwnerUser(data.user)) {
    redirect("/admin");
  }

  return children;
}
