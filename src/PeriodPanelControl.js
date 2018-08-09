import { Panel } from './PanelControl';
import './PeriodPanelControl.css';

/**
 * @typedef {Object} Period - information about Gov
 * @prop {string} period
 * @prop {number} start
 * @prop {number} end
 * @prop {string} description
 */

const OPTIONS = { headerText: 'Правители' };


export class PeriodPanelControl extends Panel {

  constructor(options) {
    super(Object.assign({}, OPTIONS, options));
    /** @type {Period} */
    this.period = null;
  }

  /**
   *
   * @param {Period} period
   */
  updatePeriod(period) {
    const exist = this.period;
    if (period) {
      if (exist !== period) {
        this.updateBody(this._createPeriodBody(period));
        this.period = period;
      }
    } else {
      this.updateBody('<div class="panel-body__period empty">Данные не предоставленны</div>');
      this.period = null;
    }
  }

  /**
   *
   * @param {Period} period
   */
  _createPeriodBody(period) {
    const element = document.createElement('div');
    element.className = 'panel-body__period';

    // Gov name
    const periodElement = document.createElement('div');
    periodElement.className = 'panel-body__period--period';
    periodElement.innerHTML = period.period;
    element.appendChild(periodElement);

    element.appendChild(this.createRefButton(`https://www.google.ru/search?q=${period.period.split(' ').join('+')}`))

    return element;
  }

}
