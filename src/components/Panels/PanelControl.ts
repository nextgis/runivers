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
  options: PanelOptions;

  webMap: WebMap;

  emitter = new EventEmitter();

  isHide: boolean;
  _header: HTMLElement;
  _blocked: boolean = false;

  private _container: HTMLElement;
  private _body: HTMLElement;
  private _dialog: Dialog;

  constructor(options?: PanelOptions) {
    this.options = { ...this.options, ...options };
    this.webMap = this.options.webMap;
    this._container = null;
    this._header = null;
    this._body = null;
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
    const parentNode = this._container && this._container.parentNode;
    if (parentNode) {
      parentNode.removeChild(this._container);
    }
  }

  updateBody(content) {
    this._cleanBody();
    if (typeof content === 'string') {
      this._body.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      this._body.appendChild(content);
    }
  }

  hide() {
    this.isHide = true;
    this._container.classList.add('panel-hide');
    this.emitter.emit('toggle', false);
  }

  show() {
    if (!this._blocked) {
      this.isHide = false;
      this._container.classList.remove('panel-hide');
      this.emitter.emit('toggle', true);
    }
  }

  block() {
    this._blocked = true;
  }

  unBlock() {
    this._blocked = false;
  }

  createControlButton(onclick, text = 'Подробнее') {
    const element = document.createElement('button');
    element.className = 'btn panel-button';
    element.innerHTML = text;
    element.onclick = onclick;
    return element;
  }

  createRefButton(url, text?) {
    return this.createControlButton(() => window.open(url, '_blank'), text);
  }

  openDialog(options?: DialogAdapterOptions) {
    if (!this._dialog) {
      this._dialog = new Dialog(options);
    }
    const isSame = options && options.template && this._dialog.options.template === options.template;
    if (!isSame) {
      this._dialog.updateContent(options.template);
    }
    this._dialog.show();
  }

  closeDialog() {
    if (this._dialog) {
      this._dialog.close();
    }
  }

  _cleanBody() {
    this._body.innerHTML = '';
  }

  _createContainer() {
    const element = document.createElement('div');
    element.className = 'mapboxgl-ctrl panel';
    if (this.options.addClass) {
      this.options.addClass.split(' ').forEach(x => element.classList.add(x));
    }
    if (this.options.headerText) {
      // element.appendChild(this._createHeader());
    }
    element.appendChild(this._createBody());

    return element;
  }

  _createHeader() {
    const element = document.createElement('div');
    element.className = 'panel-header';

    element.innerHTML = this.options.headerText;

    this._header = element;
    return element;
  }

  _createBody() {
    const element = document.createElement('div');
    element.className = 'panel-body';

    this._body = element;
    return element;
  }
}
