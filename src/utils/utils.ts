export function numberWithSpaces(x) {
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.join('.');
}

export function formatArea(area) {
  return `${numberWithSpaces(Math.round(area))} км²`;
}

export function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
