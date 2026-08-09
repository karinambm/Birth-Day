import type { Birthday } from "@/types/birthday";

const MONTH_NAMES_FULL = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

const MONTH_NAMES_SHORT = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

export type BirthdayWithProximity = Birthday & { daysUntil: number };

const UPCOMING_WINDOW_DAYS = 14;

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function daysUntilNextBirthday(b: Birthday, today: Date): number {
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const thisYear = startOfToday.getFullYear();

  let candidate = new Date(thisYear, b.birthMonth - 1, Math.min(b.birthDay, daysInMonth(thisYear, b.birthMonth)));
  if (candidate < startOfToday) {
    const nextYear = thisYear + 1;
    candidate = new Date(
      nextYear,
      b.birthMonth - 1,
      Math.min(b.birthDay, daysInMonth(nextYear, b.birthMonth)),
    );
  }

  return Math.round((candidate.getTime() - startOfToday.getTime()) / 86_400_000);
}

export function withProximity(list: Birthday[], today: Date): BirthdayWithProximity[] {
  return list
    .map((b) => ({ ...b, daysUntil: daysUntilNextBirthday(b, today) }))
    .sort((a, b) => a.daysUntil - b.daysUntil);
}

export function groupByProximity(list: BirthdayWithProximity[]): {
  today: BirthdayWithProximity[];
  upcoming: BirthdayWithProximity[];
  later: BirthdayWithProximity[];
} {
  return {
    today: list.filter((b) => b.daysUntil === 0),
    upcoming: list.filter((b) => b.daysUntil > 0 && b.daysUntil <= UPCOMING_WINDOW_DAYS),
    later: list.filter((b) => b.daysUntil > UPCOMING_WINDOW_DAYS),
  };
}

export function daysUntilLabel(daysUntil: number): string {
  if (daysUntil === 0) return "Hoje";
  if (daysUntil === 1) return "Amanhã";
  return `Em ${daysUntil} dias`;
}

export function formatFullDate(b: Birthday): string {
  return `${b.birthDay} de ${MONTH_NAMES_FULL[b.birthMonth - 1]}`;
}

export function formatShortDate(b: Birthday): string {
  return `${b.birthDay} ${MONTH_NAMES_SHORT[b.birthMonth - 1]}`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
