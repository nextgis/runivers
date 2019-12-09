export default function findYearInDateStr(dateStr: string): number | undefined {
  const datePattern = /(\d{4})/;
  const date = datePattern.exec(dateStr);
  if (date) {
    return Number(date[0]);
  }
}
