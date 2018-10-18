export class Toggler {

  private _container: HTMLElement;
  private _status: boolean = true;

  constructor(public options: {
    status?: boolean,
    title?: string,
    titleOff?: string,
    className?: string,
    toggleAction?: (status: boolean) => void
  }) {
    this._status = this.options.status !== undefined ? this.options.status : this._status;
    this._container = this._createContainer();
    this._updateContainer();
  }

  getContainer() {
    return this._container;
  }

  toggle(status: boolean = !this._status) {
    this._status = status;
    this._updateContainer();
  }

  private _createContainer() {
    const block = document.createElement('div');
    block.className = 'panel__toggler';
    if (this.options.className) {
      this.options.className.split(' ').forEach((x) => block.classList.add(x));
    }
    if (this.options.toggleAction) {
      block.addEventListener('click', () => {
        this.toggle();
        this.options.toggleAction(this._status);
      });
    }
    return block;
  }

  private _updateContainer() {
    this._container.title = this._status ? this.options.title : this.options.titleOff;
    if (this._status) {
      this._container.classList.add('active');
    } else {
      this._container.classList.remove('active');
    }
  }

}
