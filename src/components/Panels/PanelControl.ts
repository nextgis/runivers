import './PanelControl.css';
import { EventEmitter } from 'events';

import Dialog from '@nextgis/dialog';

import type { DialogAdapterOptions } from '@nextgis/dialog';
import type { WebMap } from '@nextgis/webmap';

export interface PanelOptions {
  headerText?: string;
  addClass?: string;
  webMap?: WebMap;
}

export class Panel {
  emitter = new EventEmitter();

  isHide = false;
  _blocked = false;

  protected webMap?: WebMap;
  protected _header?: HTMLElement;
  private _container?: HTMLElement;
  private _body?: HTMLElement;
  private _dialog!: Dialog;

  constructor(protected options: PanelOptions = {}) {
    this.webMap = this.options.webMap;
    this._container = this._createContainer();
  }

  getContainer(): HTMLElement | undefined {
    return this._container;
  }

  onAdd(map: WebMap): HTMLElement | undefined {
    this.webMap = map;
    return this._container;
  }

  onRemove(): void {
    if (this._container) {
      const parentNode = this._container.parentNode;
      if (parentNode) {
        parentNode.removeChild(this._container);
      }
    }
  }

  updateBody(content: HTMLElement | string): void {
    this._cleanBody();
    if (this._body) {
      if (typeof content === 'string') {
        this._body.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        this._body.appendChild(content);
      }
    }
  }

  hide(): void {
    this.isHide = true;
    if (this._container) {
      this._container.classList.add('panel-hide');
    }
    this.emitter.emit('toggle', false);
  }

  show(): void {
    if (!this._blocked) {
      this.isHide = false;
      if (this._container) {
        this._container.classList.remove('panel-hide');
      }
      this.emitter.emit('toggle', true);
    }
  }

  block(): void {
    this._blocked = true;
  }

  unBlock(): void {
    this._blocked = false;
  }

  createControlButton(onclick: () => void, text = 'Подробнее'): HTMLElement {
    const element = document.createElement('button');
    element.className = 'btn panel-button';
    element.innerHTML = text;
    element.onclick = onclick;
    return element;
  }

  createRefButton(url: string, text?: string): HTMLElement {
    return this.createControlButton(() => window.open(url, '_blank'), text);
  }

  openDialog(options?: DialogAdapterOptions): void {
    if (!this._dialog) {
      this._dialog = new Dialog(options);
    }
    const template = options && options.template;
    if (template) {
      const isSame = this._dialog.options.template === template;
      if (!isSame) {
        this._dialog.updateContent(template);
      }
    }
    this._dialog.show();
  }

  closeDialog(): void {
    if (this._dialog) {
      this._dialog.close();
    }
  }

  private _cleanBody() {
    if (this._body) {
      this._body.innerHTML = '';
    }
  }

  private _createContainer() {
    const element = document.createElement('div');
    element.className = 'maplibregl-ctrl panel';
    if (this.options.addClass) {
      this.options.addClass.split(' ').forEach((x) => element.classList.add(x));
    }
    if (this.options.headerText) {
      // element.appendChild(this._createHeader());
    }
    element.appendChild(this._createBody());

    return element;
  }

  private _createHeader() {
    const element = document.createElement('div');
    element.className = 'panel-header';
    if (this.options.headerText) {
      element.innerHTML = this.options.headerText;
    }

    this._header = element;
    return element;
  }

  private _createBody() {
    const element = document.createElement('div');
    element.className = 'panel-body';

    this._body = element;
    return element;
  }
}
