import './PanelControl.css';
import { WebMap } from '../../../nextgisweb_frontend/packages/webmap/src/entities/WebMap';
import { Dialog, DialogAdapterOptions } from '../../../nextgisweb_frontend/packages/dialog/lib/dialog';

export class Panel {

  options;

  map: WebMap;

  _header: HTMLElement;
  private _container: HTMLElement;
  private _body: HTMLElement;
  private _dialog: Dialog;

  constructor(options?) {
    this.options = Object.assign({}, this.options, options);
    this._container = null;
    this._header = null;
    this._body = null;
  }

  onAdd(map) {
    this.map = map;
    this._container = this._createContainer();
    return this._container;
  }

  onRemove() {
    // const parentNode = this._container && this._container.parentNode;
    // if (parentNode) {
    //   parentNode.removeChild(this._container);
    // }
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
    this._container.classList.add('panel-hide');
  }

  show() {
    this._container.classList.remove('panel-hide');
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
    const isSame = options && options.template &&
      this._dialog.options.template === options.template;
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

    element.appendChild(this._createHeader());
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
