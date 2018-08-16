import EventEmitter from 'events';
import './SliderControl.css';
import { WebMap } from '../nextgisweb_frontend/packages/webmap';

export interface SliderOptions {
  type: string;
  min: number;
  max: number;
  step: number;
  animationStep: number;
  value: number;
  animationDelay: number;

  nextStepReady?(nextValue: number, callback: (value: number) => void): void;
}

const OPTIONS: SliderOptions = {
  type: 'range',
  min: 0,
  max: 100,
  step: 1,
  animationStep: 1,
  value: 50,
  animationDelay: 100
};

export class SliderControl {

  options: SliderOptions;
  emitter = new EventEmitter();
  map: WebMap;

  private _container: HTMLElement;
  private _range: HTMLInputElement;
  private _input: HTMLInputElement;
  private _animationStepInput: HTMLInputElement;
  private _animationStatus: HTMLInputElement;
  private _playerControl: HTMLElement;
  private _nextStepTimeoutId: number;

  constructor(options) {
    this.options = Object.assign({}, OPTIONS, options);
    this.options.animationStep = this.options.animationStep || this.options.step;
  }

  onAdd(map) {
    this.map = map;
    this._container = this._createContainer();
    return this._container;
  }

  onRemove() {
    // ignore
  }

  _createContainer() {
    const element = document.createElement('div');
    element.className = 'mapboxgl-ctrl';
    element.appendChild(this._createPlayerContainer());
    element.appendChild(this._createSliderContainer());
    element.appendChild(this._createValueInput());
    element.appendChild(this._createAnimationStepInput());
    element.appendChild(this._createAnimationDelayInput());
    return element;
  }

  _createValueInput() {
    const self = this;
    const inputObj = this._createLabeledInput({
      type: 'number',
      label: 'value',
      value: this.options.value
    });
    const input = inputObj.input;
    input.onchange = function() {
      self._onChange(self._getAllowedValue(input.value));
    };
    this._input = input;
    return inputObj.label;
  }

  _createAnimationStepInput() {
    const inputObj = this._createLabeledInput({
      type: 'number',
      label: 'animation step',
      value: this.options.animationStep
    });
    const input = inputObj.input;
    const opt = this.options;

    input.onchange = () => {
      let val = Number(input.value);
      val = val <= 0 ? opt.animationStep :
      val > opt.max ? opt.max : val;
      input.value = String(val);
      opt.animationStep = val;
    };
    this._animationStepInput = input;
    return inputObj.label;
  }

  _createAnimationDelayInput() {

    const inputObj = this._createLabeledInput({
      type: 'number',
      label: 'amimation delay',
      value: this.options.animationDelay
    });
    const input = inputObj.input;
    input.onchange = () => {
      let value = Number(input.value);
      value = value <= 0 ? 1 : value;
      this.options.animationDelay = value;
    };
    return inputObj.label;
  }

  _createSliderContainer() {
    const range = document.createElement('input');
    range.className = 'slider-control-range';
    // set input attributes
    const allowed = ['min', 'max', 'value', 'step', 'type'];
    for (let fry = 0; fry < allowed.length; fry++) {
      const option = this.options[allowed[fry]];
      if (option) {
        range.setAttribute(allowed[fry], option);
      }
    }
    range.onchange = () => {
      this._onChange(range.value);
    };
    this._range = range;
    return range;
  }

  _createPlayerContainer() {
    const player = document.createElement('span');
    const playerControl = document.createElement('BUTTON');
    playerControl.innerHTML = this._getPlayerControlLabel();
    playerControl.onclick = () => {
      this._toggleAnimation();
    };
    player.appendChild(playerControl);
    this._playerControl = playerControl;
    return player;
  }

  _createLabeledInput(opt) {
    opt = opt || {};
    const label = document.createElement('LABEL');
    label.className = 'slider-control-block';
    label.innerHTML = opt.label + ':';
    const input = document.createElement('input');
    input.className = 'slider-control-input';
    if (opt.type) {
      input.setAttribute('type', opt.type);
    }
    if (opt.value) {
      input.value = opt.value;
    }
    label.appendChild(input);
    return {
      label,
      input
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

  _toggleAnimation(status?) {
    status = status !== undefined ? status : !this._animationStatus;
    this._animationStatus = status;
    this._playerControl.innerHTML = this._getPlayerControlLabel();
    if (status) {
      this._startAnimation();
    } else {
      this._stopAnimation();
    }
  }

  _startAnimation() {
    this._nextStepReady((step) => {
      const isReady = typeof step !== 'boolean';
      if (isReady && this._animationStatus) {
        this._nextStepTimeoutId = setTimeout(() => {
          this._nextStep(step);
          this._startAnimation();
        }, this.options.animationDelay);
      } else {
        this.stopAnimation();
      }
    });
  }

  _nextStep(step) {
    this._range.value = String(step);
    this._onChange(step);
  }

  _nextStepReady(callback) {
    const nextValue = this._getNextValue();
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

  _getAllowedValue(value) {
    if (value < this.options.min) {
      return this.options.min;
    } else if (value > this.options.max) {
      return this.options.max;
    }
    return value;
  }

  _getNextValue() {
    const current = parseInt(this._range.value, 10);
    const next = current + this.options.animationStep;
    return this._getAllowedValue(next);
  }

  _stopAnimation() {
    clearTimeout(this._nextStepTimeoutId);
  }

}






















