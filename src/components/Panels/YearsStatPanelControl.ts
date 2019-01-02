import { Panel } from './PanelControl';
import './YearsStatPanelControl.css';
import { AreaStat } from '../../App';
import { formatArea } from '../../utils/utils';

/**
 * @typedef {Object} YearStat - information about changes in territorial integrity
 * @prop {number} year
 * @prop {number} territories_gained
 * @prop {number} territories_lost
 * @prop {string} period
 */
export interface YearStat {
  // precision: '0' | '1' | 'П' | 'Н';
  // comment?: string;
  // fid: number;
  // ruler?: string;
  // date_from: string;
  // date_to?: string;
  // reason?: string;
  year: number;
  description_short?: string;
  description_long?: string;
  numb?: number;
  count?: number;
}

const OPTIONS = {
  headerText: 'Изменения в территориальном составе',
  addClass: 'stat-panel'
};

export class YearsStatPanelControl extends Panel {

  yearStat: YearStat;

  yearStats: YearStat[];
  areaStat: AreaStat;

  constructor(options?) {
    super(Object.assign({}, OPTIONS, options));

  }

  updateYearStats(yearStats: YearStat[], areaStat?: AreaStat) {
    this.yearStats = yearStats;
    this.areaStat = areaStat;
    this.updateYearStat(this.yearStats[0]);
  }

  updateYearStat(yearStat: YearStat) {
    const exist = this.yearStat;
    if (yearStat) {
      if (exist !== yearStat) {
        this.show();
        this.yearStat = yearStat;
        this.updateBody(this._createPeriodBody(yearStat));
      }
    } else {
      this.hide();
      this.updateBody('<div class="panel-body__period empty">Данные не предоставленны</div>');
      this.yearStat = null;
    }
  }

  private _createPeriodBody(yearStat: YearStat) {
    const element = document.createElement('div');
    element.className = 'panel-body__yearstat';

    const sliderBlock = document.createElement('div');
    sliderBlock.className = 'panel-body__period--slider';
    sliderBlock.innerHTML = `
      <a href='#' class='panel_slider prev'></a>
      <div class='panel_slider-counter'>1 из 2</div>
      <a href='#' class='panel_slider next'></a>
    `;
    element.appendChild(sliderBlock);

    const yearBlock = document.createElement('div');
    yearBlock.className = 'panel-body__period--year';
    yearBlock.innerHTML = `${yearStat.year} г.`;
    element.appendChild(yearBlock);

    if (this.areaStat) {
      const gain = this.areaStat.plus;
      if (gain) {
        element.appendChild(this._createGainBlock(gain));
      }
      const lost = this.areaStat.minus;
      if (lost) {
        element.appendChild(this._createGainBlock(lost, true));
      }
      if (this.yearStats.length > 1) {
        element.appendChild(this._createStateSwitcher());
      }
    }

    const descrBlock = this._createDescriptionBlock(yearStat);
    if (descrBlock) {
      element.appendChild(descrBlock);
      element.appendChild(this.createControlButton(() => console.log('test')));
    }
    const descrLong = yearStat.description_long;
    if (descrLong) {

      const template = document.createElement('div');
      template.innerHTML = `
        <div class="panel-body__period--description">${descrLong}</div>
      `;
      element.appendChild(this.createControlButton(() => this.openDialog({ template })));

    }

    return element;
  }

  private _createStateSwitcher(): Node {
    const block = document.createElement('div');
    block.className = 'state-switcher';
    const yearStat = this.yearStat;
    const index = this.yearStats.indexOf(yearStat);
    const isFirst = index === 0;
    const length = this.yearStats.length;
    const isLast = index === length - 1;

    const createDirectionFlow = (previous?: boolean, isActive?: boolean) => {
      const flow = document.createElement('div');
      flow.className = 'state-switcher__flow state-switcher__flow--' +
        (previous ? 'back' : 'forward') +
        (isActive ? '' : ' hiden');
      flow.innerHTML = previous ? '<<' : '>>';
      if (isActive) {
        flow.onclick = (e) => {
          e.preventDefault();
          const directStat = this.yearStats[previous ? index - 1 : index + 1];
          this.updateYearStat(directStat);
        };
      }
      return flow;
    };

    block.appendChild(createDirectionFlow(true, !isFirst));

    const flowCounter = document.createElement('div');
    flowCounter.className = 'state-switcher__flow state-switcher__flow--counter';
    flowCounter.innerHTML = `<b>${yearStat.numb}</b> <small>/ ${yearStat.count}</small>`;
    block.appendChild(flowCounter);

    block.appendChild(createDirectionFlow(false, !isLast));

    return block;
  }

  private _createDescriptionBlock(yearStat: YearStat): HTMLElement {
    const element = document.createElement('div');
    if (yearStat.description_short) {
      element.innerHTML = `<div class="panel-body__period--description">${yearStat.description_short}</div>`;
      return element;
    }
  }

  private _createGainBlock(count, isLost?: boolean) {
    const element = document.createElement('div');
    element.className = 'panel-body__yearstat--gain ' + (isLost ? 'lost' : 'gained');
    element.innerHTML = (isLost ? '-' : '+') + formatArea(count);
    return element;
  }

}
