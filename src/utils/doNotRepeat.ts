const _execute = {};

function _stop(name) {
  if (_execute[name]) {
    clearTimeout(_execute[name]);
  }
}

function _start(f, name, timer) {
  _execute[name] = setTimeout(f, timer);
}

export function doNotRepeat(name, func, timer) {
  timer = timer || 100;
  _stop(name);
  _start(func, name, timer);
}
