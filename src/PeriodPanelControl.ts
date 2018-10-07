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
  tech_number: number;
  number: number;
  name: string;
  years_life: string;
  years_from: number;
  years_to?: number;
  description?: string;
  detail_link?: string;
  img_link?: string;
}

const OPTIONS = { headerText: 'Правители' };


export class PeriodPanelControl extends Panel {

  period: Period;

  constructor(options?) {
    super(Object.assign({}, OPTIONS, options));
    this.period = null;
  }

  updatePeriod(period: Period) {
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


  _createPeriodBody(period: Period) {
    const element = document.createElement('div');
    element.className = 'panel-body__period';

    // Gov name
    const periodElement = document.createElement('div');

    let imageHtml: string;
    if (period.img_link) {
      imageHtml = `<div class="panel-body__period--image"><img src="${period.img_link}"></div>`;
    }

    periodElement.innerHTML = `
      ${imageHtml ? imageHtml : ''}
      <div class="panel-body__period--name">${period.name}</div>
      <div class="panel-body__period--period">${period.years_from} – ${period.years_to}</div>
    `;
    element.appendChild(periodElement);

    element.appendChild(this.createRefButton(`https://www.google.ru/search?q=${period.name.split(' ').join('+')}`));

    return element;
  }

}
