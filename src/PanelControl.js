import './PanelControl.css';

export class Panel {

  constructor(options) {
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

  createControlButton(text, onclick) {
    const element = document.createElement('button');
    element.className = 'panel-button';
    element.innerHTML = text;
    element.onclick = onclick
    return element;
  }

  createRefButton(url, text = 'Подробнее') {
    return this.createControlButton(text, () => window.open(url, '_blank'));
  }

  _cleanBody() {
    this._body.innerHTML = '';
  }

  _createContainer() {
    var element = document.createElement('div');
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
