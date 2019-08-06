export function numberWithSpaces(x: number) {
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.join('.');
}

export function formatArea(area: number) {
  return `${numberWithSpaces(Math.round(area))} км²`;
}

export function onlyUnique<T = any>(value: T, index: number, self: T[]): boolean {
  return self.indexOf(value) === index;
}
