const _execute: Record<string, number> = {};

function _stop(name: string) {
  if (_execute[name]) {
    clearTimeout(_execute[name]);
  }
}

function _start(f: (...args: any[]) => void, name: string, timer: number) {
  _execute[name] = window.setTimeout(f, timer);
}

export function doNotRepeat(
  name: string,
  func: (...args: any[]) => void,
  timer: number
) {
  timer = timer || 100;
  _stop(name);
  _start(func, name, timer);
}
