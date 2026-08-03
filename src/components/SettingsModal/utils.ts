export function formatBackupTimestamp(date: Date): string {
  const twoDigits = (value: number) => String(value).padStart(2, "0");

  const datePart = [
    date.getFullYear(),
    twoDigits(date.getMonth() + 1),
    twoDigits(date.getDate()),
  ].join("-");

  const timePart = [
    twoDigits(date.getHours()),
    twoDigits(date.getMinutes()),
    twoDigits(date.getSeconds()),
  ].join("-");

  return `${datePart}_${timePart}`;
}
