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
  precision: '0' | '1' | 'П' | 'Н';
  comment?: string;
  fid: number;
  ruler?: string;
  date_from: string;
  date_to?: string;
  reason?: string;
  description_short?: string;
  description_long?: string;
}

const OPTIONS = { headerText: 'Изменения в территориальной целостности' };

export class YearsStatPanelControl extends Panel {

  yearStat: YearStat;

  constructor(options?) {
    super(Object.assign({}, OPTIONS, options));

  }

  updateYearStat(yearStat: YearStat) {
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

  private _createPeriodBody(yearStat: YearStat) {
    const element = document.createElement('div');
    element.className = 'panel-body__yearstat';
    // const gain = yearStat.territories_gained;
    // if (gain) {
    //   element.appendChild(this._createGainBlock(gain));
    // }
    // const lost = yearStat.territories_lost;
    // if (lost) {
    //   element.appendChild(this._createGainBlock(lost, true));
    // }

    const descrBlock = this._createDescriptionBlock(yearStat);
    if (descrBlock) {
      element.appendChild(descrBlock);
    }
    if (yearStat.description_long) {
      const ref = `
          https://www.google.ru/search?q=${yearStat.date_from}+изменение+в++территориальной+целостности+России
      `;
      element.appendChild(this.createRefButton(ref));
    }
    return element;
  }

  private _createDescriptionBlock(yearStat: YearStat): HTMLElement {
    if (yearStat.description_short) {
      const element = document.createElement('div');
      element.className = 'panel-body__yearstat--description';
      element.innerHTML = yearStat.description_short;
      return element;
    }
  }

  // private _createGainBlock(count, isLost?: boolean) {
  //   const element = document.createElement('div');
  //   element.className = 'panel-body__yearstat--gain ' + (isLost ? 'lost' :  'gained');
  //   element.innerHTML = (isLost ? '-' : '+') + count + ' кв.км.';
  //   return element;
  // }

}
