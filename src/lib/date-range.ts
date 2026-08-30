// coteadmin/src/lib/date-range.ts
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

export function last30DaysRangeWIB() {
  const nowWIB = new Date(Date.now() + WIB_OFFSET_MS);
  const end = nowWIB.toISOString().slice(0, 10);

  const start = new Date(nowWIB);
  start.setDate(start.getDate() - 29);

  return { start: start.toISOString().slice(0, 10), end };
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

export type DatePreset = "today" | "this_week" | "this_month" | "last_30_days";

export const DATE_PRESET_OPTIONS: { value: DatePreset; label: string }[] = [
  { value: "today", label: "Hari Ini" },
  { value: "this_week", label: "Minggu Ini" },
  { value: "this_month", label: "Bulan Ini" },
  { value: "last_30_days", label: "30 Hari Terakhir" },
];

export function getDatePresetRange(preset: DatePreset) {
  const nowWIB = new Date(Date.now() + WIB_OFFSET_MS);
  const end = nowWIB.toISOString().slice(0, 10);
  const start = new Date(nowWIB);

  switch (preset) {
    case "today":
      break;
    case "this_week": {
      const day = start.getDay(); // 0=Minggu..6=Sabtu
      const diffToMonday = day === 0 ? 6 : day - 1;
      start.setDate(start.getDate() - diffToMonday);
      break;
    }
    case "this_month":
      start.setDate(1);
      break;
    case "last_30_days":
      start.setDate(start.getDate() - 29);
      break;
  }

  return { start: start.toISOString().slice(0, 10), end };
}
