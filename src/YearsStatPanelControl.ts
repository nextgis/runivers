import { Panel } from './PanelControl';
import './YearsStatPanelControl.css';

/**
 * @typedef {Object} YearStat - information about changes in territorial integrity
 * @prop {number} year
 * @prop {number} territories_gained
 * @prop {number} territories_lost
 * @prop {string} period
 */
export interface YearStat {
  year: number;
  territories_gained: number;
  territories_lost: number;
  period: string;
}

const OPTIONS = { headerText: 'Изменения в территориальной целостности' };

export class YearsStatPanelControl extends Panel {

  yearStat: YearStat;

  constructor(options?) {
    super(Object.assign({}, OPTIONS, options));

  }

  /**
   *
   * @param {YearStat} yearStat
   */
  updateYearStat(yearStat) {
    const exist = this.yearStat;
    if (yearStat) {
      if (exist !== yearStat) {
        this.updateBody(this._createPeriodBody(yearStat));
        this.yearStat = yearStat;
      }
    } else {
      this.updateBody('<div class="panel-body__period empty">Данные не предоставленны</div>');
      this.yearStat = null;
    }
  }

  /**
   *
   * @param {YearStat} yearStat
   */
  _createPeriodBody(yearStat) {
    const element = document.createElement('div');
    element.className = 'panel-body__yearstat';
    const gain = yearStat.territories_gained;
    if (gain) {
      element.appendChild(this._createGainBlock(gain));
    }
    const lost = yearStat.territories_lost;
    if (lost) {
      element.appendChild(this._createGainBlock(lost, true));
    }
    const ref = `https://www.google.ru/search?q=${yearStat.year}+изменение+в++территориальной+целостности+России`;
    element.appendChild(this.createRefButton(ref));

    return element;
  }

  _createGainBlock(count, isLost?: boolean) {
    const element = document.createElement('div');
    element.className = 'panel-body__yearstat--gain ' + (isLost ? 'lost' :  'gained');
    element.innerHTML = (isLost ? '-' : '+') + count + ' кв.км.';
    return element;

  }

}
