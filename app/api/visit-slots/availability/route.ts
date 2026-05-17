import { NextResponse } from "next/server";
import {
  buildVisitTimeSlots,
  slotAllowedOnDate,
} from "@/lib/visit-time-slots";
import { getVisitSlotCapacity, getVisitSlotUsage } from "@/lib/visit-slot-capacity";

function todayIsoLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const visitDate = searchParams.get("date")?.trim() ?? "";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(visitDate)) {
    return NextResponse.json({ error: "Invalid date." }, { status: 400 });
  }

  const minIso = todayIsoLocal();
  const visitT = new Date(`${visitDate}T12:00:00`).getTime();
  const minT = new Date(`${minIso}T12:00:00`).getTime();
  if (Number.isNaN(visitT) || visitT < minT) {
    return NextResponse.json({ error: "Date must be today or later." }, { status: 400 });
  }

  const capacity = getVisitSlotCapacity();
  const slots = buildVisitTimeSlots().filter((s) => slotAllowedOnDate(s, visitDate));

  const usageList = await Promise.all(
    slots.map(async (slot) => {
      const usage = await getVisitSlotUsage(visitDate, slot.value);
      const booked = usage?.booked ?? 0;
      const remaining = usage?.remaining ?? capacity;
      const full = usage?.full ?? false;
      return {
        value: slot.value,
        label: slot.label,
        booked,
        capacity,
        remaining,
        full,
      };
    }),
  );

  return NextResponse.json({ visitDate, capacity, slots: usageList });
}
