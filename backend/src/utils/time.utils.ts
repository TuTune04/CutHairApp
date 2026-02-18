import type { TimeSlot } from "../types";

export function parseMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

export function formatMinutes(totalMinutes: number): TimeSlot {
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const hourText = String(hour).padStart(2, "0");
  const minuteText = String(minute).padStart(2, "0");
  return `${hourText}:${minuteText}` as TimeSlot;
}

export function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function compareDateTime(date: string, time: string): number {
  return new Date(`${date}T${time}:00`).getTime();
}
