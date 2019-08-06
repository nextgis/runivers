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

export function copyText(text: string) {
  const copyTextarea = document.createElement('textarea');
  copyTextarea.innerHTML = text;
  document.body.appendChild(copyTextarea);
  copyTextarea.focus();
  copyTextarea.select();

  try {
    const successful = document.execCommand('copy');
    const msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  } finally {
    document.body.removeChild(copyTextarea);
  }
}
