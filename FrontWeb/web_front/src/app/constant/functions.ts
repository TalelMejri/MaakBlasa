export function isDateInRange(date: Date | null): boolean {
  if (!date) return false;
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 3);
  today.setHours(0, 0, 0, 0);
  maxDate.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return date >= today && date <= maxDate;
}



