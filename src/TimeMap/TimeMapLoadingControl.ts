import type { TimeMap } from '../TimeMap/TimeMap';
import type { MapControl } from '@nextgis/webmap';

export class TimeMapLoadingControl implements MapControl {
  private _container?: HTMLElement;

  private __onLoadingStart: () => void;
  private __onLoadingStop: () => void;

  constructor(private timeMap: TimeMap) {
    this.__onLoadingStart = () => {
      this._onLoadingStart();
    };
    this.__onLoadingStop = () => {
      this._onLoadingStop();
    };
  }

  onAdd(): HTMLElement {
    const container = document.createElement('div');
    this._container = container;
    if (this.timeMap) {
      this.timeMap.emitter.on('loading:start', this.__onLoadingStart);
      this.timeMap.emitter.on('loading:finish', this.__onLoadingStop);
    }
    return container;
  }

  onRemove(): void {
    if (this.timeMap) {
      this.timeMap.emitter.off('loading:start', this.__onLoadingStart);
      this.timeMap.emitter.off('loading:finish', this.__onLoadingStop);
    }
    if (this._container) {
      const parent = this._container.parentNode;
      if (parent) {
        parent.removeChild(this._container);
      }
    }
  }

  private _onLoadingStart() {
    if (this._container) {
      this._container.innerHTML = 'Loading...';
    }
  }

  private _onLoadingStop() {
    if (this._container) {
      this._container.innerHTML = '';
    }
  }
}
