import './PanelControl.css';
import WebMap from '@nextgis/webmap';
import Dialog, { DialogAdapterOptions } from '@nextgis/dialog';
import { EventEmitter } from 'events';

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

  getContainer() {
    return this._container;
  }

  onAdd(map: WebMap) {
    this.webMap = map;
    return this._container;
  }

  onRemove() {
    if (this._container) {
      const parentNode = this._container.parentNode;
      if (parentNode) {
        parentNode.removeChild(this._container);
      }
    }
  }

  updateBody(content: HTMLElement | string) {
    this._cleanBody();
    if (this._body) {
      if (typeof content === 'string') {
        this._body.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        this._body.appendChild(content);
      }
    }
  }

  hide() {
    this.isHide = true;
    if (this._container) {
      this._container.classList.add('panel-hide');
    }
    this.emitter.emit('toggle', false);
  }

  show() {
    if (!this._blocked) {
      this.isHide = false;
      if (this._container) {
        this._container.classList.remove('panel-hide');
      }
      this.emitter.emit('toggle', true);
    }
  }

  block() {
    this._blocked = true;
  }

  unBlock() {
    this._blocked = false;
  }

  createControlButton(onclick: () => void, text = 'Подробнее') {
    const element = document.createElement('button');
    element.className = 'btn panel-button';
    element.innerHTML = text;
    element.onclick = onclick;
    return element;
  }

  createRefButton(url: string, text?: string) {
    return this.createControlButton(() => window.open(url, '_blank'), text);
  }

  openDialog(options?: DialogAdapterOptions) {
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

  closeDialog() {
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
    element.className = 'mapboxgl-ctrl panel';
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
