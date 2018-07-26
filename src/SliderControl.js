import EventEmitter from 'events';

var OPTIONS = {
  type: 'range',
  min: 0,
  max: 100,
  step: 1,
  value: 50
}

export var SliderControl = function (options) {
  this.options = Object.assign({}, OPTIONS, options);
  this.emitter = new EventEmitter();
  this.map = null;
  this._container = null;
}

SliderControl.prototype.onAdd = function (map) {
  this.map = map;
  this._container = this._createContainer();
  return this._container;
}

SliderControl.prototype.onRemove = function () {

}

SliderControl.prototype._createContainer = function () {
  var self = this;
  var element = document.createElement('DIV');
  element.className = 'mapboxgl-ctrl';
  var range = document.createElement('INPUT');

  for (var o in this.options) {
    if (this.options.hasOwnProperty(o)) {
      range.setAttribute(o, this.options[o]);
    }
  }

  range.onchange = function () {
    self.emitter.emit('change', range.value);
  }

  element.appendChild(range);
  return element;
}
