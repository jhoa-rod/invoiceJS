export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function startOfWeek(input = new Date()) {
  const date = new Date(input);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + diff);
  return date;
}

export function endOfWeek(input = new Date()) {
  const date = startOfWeek(input);
  date.setDate(date.getDate() + 6);
  return date;
}

export function isSameDay(left, right) {
  return String(left).slice(0, 10) === String(right).slice(0, 10);
}

export function isWithinWeek(dateString, anchor = new Date()) {
  const date = new Date(dateString);
  const start = startOfWeek(anchor);
  const end = endOfWeek(anchor);
  return date >= start && date <= end;
}

export function isCurrentMonth(dateString, anchor = new Date()) {
  const date = new Date(dateString);
  return (
    date.getMonth() === anchor.getMonth() &&
    date.getFullYear() === anchor.getFullYear()
  );
}

export function isCurrentYear(dateString, anchor = new Date()) {
  return new Date(dateString).getFullYear() === anchor.getFullYear();
}

export function formatDate(dateString, language, options = {}) {
  return new Intl.DateTimeFormat(language === "es" ? "es-ES" : "en-US", {
    month: "short",
    day: "numeric",
    ...options,
  }).format(new Date(dateString));
}
