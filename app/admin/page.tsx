import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (user?.email && adminEmail && user.email.toLowerCase() === adminEmail) {
    redirect("/admin/dashboard");
  }
  redirect("/admin/login");
}
