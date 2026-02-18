export const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
export const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function isValidDateString(value: string): boolean {
  if (!dateRegex.test(value)) {
    return false;
  }
  const [yearText, monthText, dayText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
}
