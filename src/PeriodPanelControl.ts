import { Panel } from './PanelControl';
import './PeriodPanelControl.css';

/**
 * @typedef Period - information about Gov
 * @prop period
 * @prop start
 * @prop end
 * @prop description
 */
export interface Period {
  period: string;
  start: number;
  end: number;
  description: string;
}

const OPTIONS = { headerText: 'Правители' };


export class PeriodPanelControl extends Panel {

  period: Period;

  constructor(options?) {
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

    element.appendChild(this.createRefButton(`https://www.google.ru/search?q=${period.period.split(' ').join('+')}`));

    return element;
  }

}
