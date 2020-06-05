import { numberWithSpaces, Clipboard } from '@nextgis/utils';

export function formatArea(area: number): string {
  return `${numberWithSpaces(Math.round(area))} км²`;
}

export function copyText(text: string): void {
  Clipboard.copy(text);
}
