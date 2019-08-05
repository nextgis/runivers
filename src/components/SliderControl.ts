import { EventEmitter } from 'events';
import './SliderControl.css';
import WebMap from '@nextgis/webmap';

import noUiSlider from 'nouislider';
import wNumb from 'wnumb';
import 'nouislider/distribute/nouislider.css';

import './Links/img/rewind_next.svg';
import './Links/img/rewind_previous.svg';

export interface SliderOptions {
  type: string;
  min: number;
  max: number;
  step: number;
  animationStep: number;
  value: number;
  animationDelay: number;

  stepReady?(nextValue: number, callback: (value: number) => void, previous?: boolean): void;
  filterPips?(value, type): -1 | 0 | 1 | 2; // -1 (no pip at all) 0 (no value) 1 (large value) 2 (small value)
}

const OPTIONS: SliderOptions = {
  type: 'range',
  min: 0,
  max: 100,
  step: 1,
  animationStep: 1,
  value: 50,
  animationDelay: 100,
  filterPips: (value, piptype) => {
    return piptype === 1 ? 1 : value % 100 ? (value % 10 ? -1 : 0) : 1;
  }
};

export class SliderControl {
  options: SliderOptions;
  emitter = new EventEmitter();
  map: WebMap;

  _animationStepInput: HTMLInputElement;
  _sliderContainer: HTMLElement;
  _slider: noUiSlider;
  private _container: HTMLElement;
  private _input: HTMLInputElement;
  private _animationStatus: boolean;
  private _playerControl: HTMLElement;
  // private _nextStepTimeoutId: number;

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
    element.className = 'mapboxgl-ctrl slider-control';
    // element.appendChild(this._createValueInput());
    element.appendChild(this._createSliderContainer());
    element.appendChild(this._createNavigationContainer());
    // element.appendChild(this._createPlayerContainer());
    // element.appendChild(this._createAnimationStepInput());
    // element.appendChild(this._createAnimationDelayInput());
    return element;
  }

  _createValueInput() {
    const self = this;
    const inputObj = this._createLabeledInput({
      type: 'number',
      // label: 'value',
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
      val = val <= 0 ? opt.animationStep : val > opt.max ? opt.max : val;
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
    const span = document.createElement('span');
    span.className = 'slider-control-range';
    const range = document.createElement('div');
    span.appendChild(range);
    // range.className = 'slider-control-range';
    // set input attributes
    // const allowed = ['min', 'max', 'value', 'step', 'type'];
    // for (let fry = 0; fry < allowed.length; fry++) {
    //   const option = this.options[allowed[fry]];
    //   if (option) {
    //     range.setAttribute(allowed[fry], option);
    //   }
    // }

    const { min, max, step } = this.options;
    const slider = noUiSlider.create(range, {
      range: {
        min,
        max
      },
      step,
      tooltips: [wNumb({ decimals: 0 })],
      start: [this.options.value],
      pips: {
        mode: 'steps',
        density: 3,
        filter: this.options.filterPips
      }
    });

    slider.on('change', (values, handle) => {
      this._onSliderClick(parseInt(values[0], 10));
    });
    const sliderElement = slider.target as HTMLElement;
    sliderElement.addEventListener(
      'click',
      () => {
        this.stopAnimation();
      },
      true
    );

    this._sliderContainer = span;
    this._slider = slider;
    return span;
  }

  _createPlayerContainer() {
    const player = document.createElement('div');
    player.className = 'slider-control-block slider-control-player';
    const playerControl = document.createElement('button');
    playerControl.className = 'player-button';
    // playerControl.innerHTML = this._getPlayerControlLabel();
    playerControl.onclick = () => {
      this._toggleAnimation();
    };
    player.appendChild(playerControl);
    this._playerControl = playerControl;
    return player;
  }

  _createPlayerButton() {
    const playerControl = document.createElement('button');
    playerControl.className = 'player-button';
    // playerControl.innerHTML = this._getPlayerControlLabel();
    playerControl.onclick = () => {
      this._toggleAnimation();
    };
    this._playerControl = playerControl;
    return playerControl;
  }

  _createNavigationContainer() {
    const playerSteps = document.createElement('div');
    playerSteps.className = 'slider-control-block slider-control-steps';

    const createStepBtn = (previous?: boolean) => {
      const btn = document.createElement('button');
      btn.className = 'slider-control-steps-btn'; // + (previous ? 'previous' : 'next');
      btn.innerHTML = `
        <img src="images/rewind_${previous ? 'previous' : 'next'}.svg" width="24" height="24"/>
      `;
      playerSteps.appendChild(btn);
      if (previous) {
        playerSteps.appendChild(this._createPlayerButton());
      }
      btn.onclick = () => {
        this._stepReady(
          step => {
            if (typeof step !== 'boolean') {
              this._nextStep(step);
            }
          },
          previous,
          this.options.step
        );
      };
      return btn;
    };
    createStepBtn(true);
    createStepBtn();
    // playerControl.innerHTML = this._getPlayerControlLabel();

    return playerSteps;
  }

  _createLabeledInput(opt) {
    opt = opt || {};

    const input = document.createElement('input');
    input.className = 'slider-control-input';
    if (opt.type) {
      input.setAttribute('type', opt.type);
    }
    if (opt.value) {
      input.value = opt.value;
    }

    const content = document.createElement(opt.label ? 'label' : 'div');
    content.className = 'slider-control-block';
    if (opt.label) {
      content.innerHTML = opt.label + ':';
    }
    content.appendChild(input);

    return {
      label: content,
      input
    };
  }

  startAnimathin() {
    this._toggleAnimation(true);
  }

  stopAnimation() {
    this._toggleAnimation(false);
  }

  _onSliderClick(value: number) {
    const isAnimation = this._animationStatus;
    if (this._animationStatus) {
      this.stopAnimation();
    }
    this._onChange(value);
    // if (isAnimation) {
    //   this.startAnimathin();
    // }
  }

  _onChange(value: number) {
    this._slider.set(value);
    if (this._input) {
      this._input.value = String(value);
    }
    this.emitter.emit('change', value);
  }

  // _getPlayerControlLabel() {
  //   return this._animationStatus ? 'stop' : 'start';
  // }

  _toggleAnimation(status?: boolean) {
    status = status !== undefined ? status : !this._animationStatus;
    this._animationStatus = status;
    // this._playerControl.innerHTML = this._getPlayerControlLabel();
    this._playerControl.classList[this._animationStatus ? 'add' : 'remove']('paused');
    if (status) {
      this._startAnimation();
    } else {
      this._stopAnimation();
    }
  }

  _startAnimation() {
    if (this._animationStatus) {
      const timerStart = new Date().getTime();
      this._stepReady((step: number) => {
        const isReady = typeof step !== 'boolean' && (step < this.options.max && step > this.options.min);
        if (isReady && this._animationStatus) {
          const stepDelay = new Date().getTime() - timerStart;
          let delay = this.options.animationDelay - stepDelay;
          delay = delay >= 0 ? delay : 0;
          // this._nextStepTimeoutId = setTimeout(() => {
          setTimeout(() => {
            if (this._animationStatus) {
              this._nextStep(step);
              this._startAnimation();
            }
          }, delay);
        } else {
          this.stopAnimation();
        }
      });
    } else {
      this.stopAnimation();
    }
  }

  _nextStep(step) {
    this._slider.set(step);
    this._onChange(step);
  }

  _stepReady(callback, previous?: boolean, stepLength?: number) {
    const nextValue = this._getNextValue(previous, stepLength);
    const inRange = this.options.value <= this.options.max && this.options.value >= this.options.min;
    if (nextValue && inRange) {
      this.options.value = nextValue;
      if (this.options.stepReady) {
        this.options.stepReady(nextValue, callback, previous);
      } else {
        callback(nextValue);
      }
    } else {
      callback(false);
    }
  }

  _getAllowedValue(value) {
    if (value <= this.options.min) {
      return this.options.min;
    } else if (value > this.options.max) {
      return this.options.max;
    }
    return value;
  }

  _getNextValue(previous?: boolean, stepLength?: number) {
    const current = parseInt(this._slider.get(), 10);
    const step = stepLength ? stepLength : this.options.animationStep;
    const next = previous ? current - step : current + step;
    return this._getAllowedValue(next);
  }

  _stopAnimation() {
    // clearTimeout(this._nextStepTimeoutId);
  }
}
