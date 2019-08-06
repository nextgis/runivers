import { Panel, PanelOptions } from './PanelControl';
import './PeriodPanelControl.css';
import { formatArea } from '../../utils/utils';
import { AreaStat } from '../../interfaces';

/**
 * Information about the ruler in the time interval
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

const OPTIONS: PanelOptions = {
  headerText: 'Правители',
  addClass: 'period-panel'
};

export class PeriodPanelControl extends Panel {
  private period?: Period;
  private areaStat?: AreaStat;

  constructor(options?: PanelOptions) {
    super(Object.assign({}, OPTIONS, options));
  }

  hide() {
    super.hide();
    if (this.webMap) {
      const container = this.webMap.getContainer();
      if (container) {
        container.classList.remove('period-panel');
      }
    }
  }

  show() {
    super.show();
    if (!this.isHide && this.webMap) {
      const container = this.webMap.getContainer();
      if (container) {
        container.classList.add('period-panel');
      }
    }
  }

  updatePeriod(period: Period, areaStat?: AreaStat) {
    this.closeDialog();
    if (period) {
      const exist = this.period;
      const currentArea = this.areaStat && this.areaStat.area;
      const newArea = areaStat && areaStat.area;
      if (exist !== period || currentArea !== newArea) {
        this.updateBody(this._createPeriodBody(period, areaStat));
        this.period = period;
        this.areaStat = areaStat;
      }
    } else {
      this.updateBody('<div class="panel-body__period empty">В этом году изменений территории не было</div>');
      this.period = undefined;
    }
  }

  private _createPeriodBody(period: Period, areaStat?: AreaStat) {
    const element = document.createElement('div');
    element.className = 'panel-body__period';

    // Gov name
    const periodElement = document.createElement('div');

    let imageHtml = '';
    if (period.img_link) {
      imageHtml = `<div
        class="panel-body__period--image" style="background-image: url('${period.img_link}');">
      </div>`;
    }

    periodElement.innerHTML = `
      ${imageHtml ? imageHtml : ''}
      <div class="panel-body__period--name">${period.name}</div>
      <div class="panel-body__period--period">${period.years_from} – ${period.years_to} гг.</div>
      <div class="panel-body__period--description">${period.description}</div>
      ${
        areaStat
          ? `
      <div class="panel-body__period--description panel-body__period--area_wrap">
        Общая площадь: <span class="panel-body__period--area">
          ${formatArea(areaStat.area)}
        </span>
      </div>
      `
          : ''
      }
    `;
    element.appendChild(periodElement);

    const detailLink = period.detail_link && this.createRefButton(period.detail_link);

    if (detailLink) {
      element.appendChild(detailLink);
    }

    return element;
  }
}
