import EventEmitter from 'events';
import './SliderControl.css'

var OPTIONS = {
  type: 'range',
  min: 0,
  max: 100,
  step: 1,
  animationStep: 1,
  value: 50,
  animationDelay: 100
}

export class SliderControl {

  constructor(options) {
    this.options = Object.assign({}, OPTIONS, options);
    this.options.animationStep = this.options.animationStep || this.options.step;
    this.emitter = new EventEmitter();
    this.map = null;
    this._container = null;
    this._range = null;
    this._input = null;
    this._animationStepInput = null;
    this._animationStatus = false;
    this._playerControl = null;
    this._nextStepTimeoutId = null;
  }

  onAdd(map) {
    this.map = map;
    this._container = this._createContainer();
    return this._container;
  }

  onRemove() {
  }

  _createContainer() {
    var element = document.createElement('DIV');
    element.className = 'mapboxgl-ctrl';
    element.appendChild(this._createPlayerContainer());
    element.appendChild(this._createSliderContainer());
    element.appendChild(this._createValueInput());
    element.appendChild(this._createAnimationStepInput());
    element.appendChild(this._createAnimationDelayInput());
    return element;
  }

  _createValueInput() {
    var self = this;
    var inputObj = this._createLabeledInput({
      type: 'number',
      label: 'value',
      value: this.options.value
    });
    var input = inputObj.input;
    input.onchange = function () {
      self._onChange(self._getAllowedValue(input.value));
    };
    this._input = input;
    return inputObj.label;
  }

  _createAnimationStepInput() {
    var self = this;
    var inputObj = this._createLabeledInput({
      type: 'number',
      label: 'animation step',
      value: this.options.animationStep
    });
    var input = inputObj.input;
    input.onchange = function () {
      var value = input.value;
      value = value <= 0 ? self.options.animationStep :
        value > self.options.max ? self.options.max : value;
      input.value = value;
      self.options.animationStep = parseInt(value);
    };
    this._animationStepInput = input;
    return inputObj.label;
  }

  _createAnimationDelayInput() {
    var self = this;
    var inputObj = this._createLabeledInput({
      type: 'number',
      label: 'amimation delay',
      value: this.options.animationDelay
    });
    var input = inputObj.input;
    input.onchange = function () {
      var value = input.value;
      value = value <= 0 ? 1 : value;
      self.options.animationDelay = value;
    };
    return inputObj.label;
  }

  _createSliderContainer() {
    var self = this;
    var range = document.createElement('INPUT');
    range.className = 'slider-control-range';
    // set input attributes
    var allowed = ['min', 'max', 'value', 'step', 'type'];
    for (var fry = 0; fry < allowed.length; fry++) {
      var option = this.options[allowed[fry]];
      if (option) {
        range.setAttribute(allowed[fry], option);
      }
    }
    range.onchange = function () {
      self._onChange(range.value);
    };
    this._range = range;
    return range;
  }

  _createPlayerContainer() {
    var self = this;
    var player = document.createElement('SPAN');
    var playerControl = document.createElement('BUTTON');
    playerControl.innerHTML = this._getPlayerControlLabel();
    playerControl.onclick = function () {
      self._toggleAnimation();
    };
    player.appendChild(playerControl);
    this._playerControl = playerControl;
    return player;
  }

  _createLabeledInput(opt) {
    opt = opt || {};
    var label = document.createElement('LABEL');
    label.className = 'slider-control-block';
    label.innerHTML = opt.label + ':';
    var input = document.createElement('INPUT');
    input.className = 'slider-control-input';
    if (opt.type) {
      input.setAttribute('type', opt.type);
    }
    if (opt.value) {
      input.value = opt.value;
    }
    label.appendChild(input);
    return {
      label: label,
      input: input
    };
  }

  stopAnimation() {
    this._toggleAnimation(false);
  }

  _onChange(value) {
    this._range.value = value;
    this._input.value = value;
    this.emitter.emit('change', value);
  }

  _getPlayerControlLabel() {
    return this._animationStatus ? 'stop' : 'start';
  }

  _toggleAnimation(status) {
    status = status !== undefined ? status : !this._animationStatus;
    this._animationStatus = status;
    this._playerControl.innerHTML = this._getPlayerControlLabel();
    if (status) {
      this._startAnimation();
    }
    else {
      this._stopAnimation();
    }
  }

  _startAnimation() {
    var self = this;
    this._nextStepReady(function (step) {
      var isReady = typeof step !== 'boolean';
      if (isReady && self._animationStatus) {
        self._nextStepTimeoutId = setTimeout(function () {
          self._nextStep(step);
          self._startAnimation();
        }, self.options.animationDelay);
      }
      else {
        self.stopAnimation();
      }
    });
  }

  _nextStep(step) {
    this._range.value = String(step);
    this._onChange(step);
  }

  _nextStepReady(callback) {
    var nextValue = this._getNextValue();
    if (nextValue && (nextValue < this.options.max)) {
      if (this.options.nextStepReady) {
        this.options.nextStepReady(nextValue, callback);
      }
      else {
        callback(nextValue);
      }
    }
    else {
      callback(false);
    }
  }

  _getAllowedValue(value) {
    if (value < this.options.min) {
      return this.options.min;
    }
    else if (value > this.options.max) {
      return this.options.max;
    }
    return value;
  }

  _getNextValue() {
    var current = parseInt(this._range.value, 10);
    var next = current + this.options.animationStep;
    return this._getAllowedValue(next);
  }

  _stopAnimation() {
    clearTimeout(this._nextStepTimeoutId);
  }

}






















