import EventEmitter from 'events';

var OPTIONS = {
  type: 'range',
  min: 0,
  max: 100,
  step: 1,
  animationStep: 1,
  value: 50,
  animationDelay: 100
}

export var SliderControl = function (options) {
  this.options = Object.assign({}, OPTIONS, options);
  this.options.animationStep = this.options.animationStep || this.options.step;
  this.emitter = new EventEmitter();
  this.map = null;
  this._container = null;
  this._range = null;
  this._animationStatus = false;
  this._playerControl = null;
  this._nextStepTimeoutId = null;
}

SliderControl.prototype.onAdd = function (map) {
  this.map = map;
  this._container = this._createContainer();
  return this._container;
}

SliderControl.prototype.onRemove = function () {

}

SliderControl.prototype._createContainer = function () {

  var element = document.createElement('DIV');
  element.className = 'mapboxgl-ctrl';

  element.appendChild(this._createPlayerContainer());
  element.appendChild(this._createSliderContainer());
  return element;
}

SliderControl.prototype._createSliderContainer = function () {
  var self = this;
  var range = document.createElement('INPUT');

  // set input attributes
  for (var o in this.options) {
    if (this.options.hasOwnProperty(o)) {
      range.setAttribute(o, this.options[o]);
    }
  }

  range.onchange = function () {
    self._onChange(range.value);
  }
  this._range = range;
  return range;
}

SliderControl.prototype._createPlayerContainer = function () {
  var self = this;
  var player = document.createElement('span');
  var playerControl = document.createElement('button');

  playerControl.innerHTML = this._getPlayerControlLabel();

  playerControl.onclick = function () {
    self._toggleAnimation();
  }

  // set input attributes

  player.appendChild(playerControl);
  this._playerControl = playerControl;
  return player;
}

SliderControl.prototype.stopAnimation = function () {
  this._toggleAnimation(false);
}

SliderControl.prototype._onChange = function (value) {
  this.emitter.emit('change', value);
}

SliderControl.prototype._getPlayerControlLabel = function () {
  return this._animationStatus ? 'stop' : 'start';
}


SliderControl.prototype._toggleAnimation = function (status) {
  status = status !== undefined ? status : !this._animationStatus;
  this._animationStatus = status;
  this._playerControl.innerHTML = this._getPlayerControlLabel();

  if (status) {
    this._startAnimation();
  } else {
    this._stopAnimation();
  }
}

SliderControl.prototype._startAnimation = function () {
  var self = this;
  this._nextStepReady(function (step) {
    var isReady = typeof step !== 'boolean';
    if (isReady && self._animationStatus) {
      self._nextStepTimeoutId  = setTimeout(function () {
        self._nextStep(step);
        self._startAnimation();
      }, self.options.animationDelay);
    } else {
      self.stopAnimation();
    }
  });
}

SliderControl.prototype._nextStep = function (step) {
  this._range.value = String(step);
  this._onChange(step);
}

SliderControl.prototype._nextStepReady = function (callback) {
  var nextValue = this._getNextValue();
  if (nextValue && (nextValue < this.options.max)) {
    if (this.options.nextStepReady) {
      this.options.nextStepReady(nextValue, callback);
    } else {
      callback(nextValue);
    }
  } else {
    callback(false);
  }
}

SliderControl.prototype._getNextValue = function () {
  var current = parseInt(this._range.value, 10);
  var next = current + this.options.step;
  return next > this.options.max ? this.options.max : next;
}

SliderControl.prototype._stopAnimation = function () {
  clearTimeout(this._nextStepTimeoutId);
}
