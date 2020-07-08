import { defined } from '@nextgis/utils';
import { Panel, PanelOptions } from './PanelControl';
import './YearsStatPanelControl.css';
import { formatArea } from '../../utils/utils';
import { AreaStat } from '../../interfaces';

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

const OPTIONS: PanelOptions = {
  headerText: 'Изменения в территориальном составе',
  addClass: 'stat-panel',
};

export class YearsStatPanelControl extends Panel {
  yearStat?: YearStat;
  yearStats?: YearStat[];
  areaStat?: AreaStat;

  constructor(options?: PanelOptions) {
    super({ ...OPTIONS, ...options });
  }

  hide(): void {
    super.hide();
    if (this.webMap) {
      const container = this.webMap.getContainer();
      if (container) {
        container.classList.remove('years-panel');
      }
    }
  }

  show(): void {
    super.show();
    if (!this.isHide && this.webMap) {
      const container = this.webMap.getContainer();
      if (container) {
        container.classList.add('years-panel');
      }
    }
  }

  updateYearStats(yearStats: YearStat[], areaStat?: AreaStat): void {
    this.yearStats = yearStats;
    this.areaStat = areaStat;
    this.updateYearStat(this.yearStats[0]);
  }

  updateYearStat(yearStat: YearStat): void {
    const exist = this.yearStat;
    const container = this.getContainer();
    if (container) {
      container.classList.remove('gain');
      container.classList.remove('lost');
    }
    if (yearStat) {
      if (exist !== yearStat) {
        // this.show();
        this.yearStat = yearStat;
        this.updateBody(this._createPeriodBody(yearStat));
      }
    } else {
      // this.hide();
      this.updateBody(
        '<div class="panel-body__period empty">В этом году изменений территории не было</div>'
      );
      this.yearStat = undefined;
    }
    this.emitter.emit('update', { yearStat: this.yearStat });
  }

  private _createPeriodBody(yearStat: YearStat) {
    const element = document.createElement('div');
    element.className = 'panel-body__yearstat';

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
      const container = this.getContainer();
      if (lost) {
        element.appendChild(this._createGainBlock(lost, true));
      }
      if (container) {
        container.classList.add(lost ? 'lost' : 'gain');
      }
    }

    if (this.yearStats && this.yearStats.length > 1) {
      element.appendChild(this._createStateSwitcher());
    }

    const descrBlock = this._createDescriptionBlock(yearStat);
    if (descrBlock) {
      element.appendChild(descrBlock);
    }
    const descrLong = yearStat.description_long;
    if (descrLong) {
      const template = document.createElement('div');
      template.className = 'panel-body__period--description';
      template.innerHTML = `${descrLong}`;

      const buttonWrap = document.createElement('div');

      buttonWrap.className = 'button-wrap';
      buttonWrap.appendChild(
        this.createControlButton(() => this.openDialog({ template }))
      );

      element.appendChild(buttonWrap);
    }

    return element;
  }

  private _createStateSwitcher(): HTMLElement {
    const sliderBlock = document.createElement('div');
    sliderBlock.className = 'panel-body__period--slider';
    const yearStats = this.yearStats;
    const yearStat = this.yearStat;

    if (yearStat && yearStats) {
      const numb = yearStat.numb;
      const count = defined(yearStat.count) ? yearStat.count : yearStats.length;
      if (count && numb && count > 1 && count >= numb) {
        const index = yearStats.indexOf(yearStat);
        const isFirst = index === 0;
        const length = yearStats.length;
        const isLast = index === length - 1;

        const createDirectionFlow = (
          previous?: boolean,
          isActive?: boolean
        ) => {
          const flow = document.createElement('a');
          flow.setAttribute('href', '#');
          // flow.className = '' +
          //   (previous ? 'back' : 'forward') +
          //   (isActive ? '' : ' hiden');
          flow.className =
            (previous ? `panel_slider prev` : `panel_slider next`) +
            (isActive ? '' : ' hidden');
          if (isActive) {
            flow.onclick = (e) => {
              e.preventDefault();
              const directStat = yearStats[previous ? index - 1 : index + 1];
              this.updateYearStat(directStat);
            };
          }
          return flow;
        };

        sliderBlock.appendChild(createDirectionFlow(true, !isFirst));

        const flowCounter = document.createElement('div');
        flowCounter.className = 'panel_slider-counter';

        flowCounter.innerHTML = `${numb} из ${count}`;
        sliderBlock.appendChild(flowCounter);
        sliderBlock.appendChild(createDirectionFlow(false, !isLast));
      }
    }
    return sliderBlock;
  }

  private _createDescriptionBlock(yearStat: YearStat): HTMLElement | undefined {
    const element = document.createElement('div');
    if (yearStat.description_short) {
      element.innerHTML = `<div class="panel-body__period--description">${yearStat.description_short}</div>`;
      return element;
    }
  }

  private _createGainBlock(count: number, isLost?: boolean) {
    const element = document.createElement('div');
    element.className =
      'panel-body__yearstat--gain ' + (isLost ? 'lost' : 'gained');
    element.innerHTML = (isLost ? '-' : '+') + formatArea(count);
    return element;
  }
}
