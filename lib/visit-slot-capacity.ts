import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type SlotUsage = {
  booked: number;
  capacity: number;
  remaining: number;
  full: boolean;
};

export function getVisitSlotCapacity(): number {
  const raw = process.env.VISIT_SLOT_MAX_PLAYERS?.trim();
  const n = raw ? Number.parseInt(raw, 10) : 100;
  return Number.isFinite(n) && n > 0 ? n : 100;
}

export function getVisitSlotHoldMinutes(): number {
  const raw = process.env.VISIT_SLOT_HOLD_MINUTES?.trim();
  const n = raw ? Number.parseInt(raw, 10) : 30;
  return Number.isFinite(n) && n > 0 ? n : 30;
}

export async function getVisitSlotUsage(
  visitDate: string,
  visitTime: string,
): Promise<SlotUsage | null> {
  const admin = getSupabaseAdmin();
  const capacity = getVisitSlotCapacity();
  if (!admin) {
    return { booked: 0, capacity, remaining: capacity, full: false };
  }

  await admin.rpc("visit_slot_release_expired_pending");

  const { data, error } = await admin.rpc("visit_slot_booked_count", {
    p_visit_date: visitDate,
    p_visit_time: visitTime,
  });

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[visit-slot-capacity] booked_count:", error.message);
    }
    return null;
  }

  const booked = typeof data === "number" ? data : Number(data ?? 0);
  const remaining = Math.max(0, capacity - booked);
  return {
    booked,
    capacity,
    remaining,
    full: remaining <= 0,
  };
}

export type ReserveSlotResult =
  | { ok: true }
  | { ok: false; reason: "full" | "unavailable"; booked: number; capacity: number };

export async function reserveVisitSlot(
  visitDate: string,
  visitTime: string,
  players: number,
  stripeSessionId: string,
): Promise<ReserveSlotResult> {
  const admin = getSupabaseAdmin();
  const capacity = getVisitSlotCapacity();
  if (!admin) {
    return { ok: true };
  }

  const { data, error } = await admin.rpc("visit_slot_try_reserve", {
    p_visit_date: visitDate,
    p_visit_time: visitTime,
    p_players: players,
    p_stripe_session_id: stripeSessionId,
    p_capacity: capacity,
    p_hold_minutes: getVisitSlotHoldMinutes(),
  });

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[visit-slot-capacity] reserve:", error.message);
    }
    return { ok: false, reason: "unavailable", booked: 0, capacity };
  }

  const row = data as { ok?: boolean; reason?: string; booked?: number; capacity?: number } | null;
  if (row?.ok) return { ok: true };
  return {
    ok: false,
    reason: row?.reason === "full" ? "full" : "unavailable",
    booked: row?.booked ?? capacity,
    capacity: row?.capacity ?? capacity,
  };
}

export async function confirmVisitSlotReservation(stripeSessionId: string) {
  const admin = getSupabaseAdmin();
  if (!admin) return;
  await admin
    .from("visit_slot_reservations")
    .update({ status: "confirmed", expires_at: null })
    .eq("stripe_session_id", stripeSessionId)
    .eq("status", "pending");
}

export async function cancelVisitSlotReservation(stripeSessionId: string) {
  const admin = getSupabaseAdmin();
  if (!admin) return;
  await admin
    .from("visit_slot_reservations")
    .update({ status: "cancelled", expires_at: null })
    .eq("stripe_session_id", stripeSessionId)
    .in("status", ["pending", "confirmed"]);
}
