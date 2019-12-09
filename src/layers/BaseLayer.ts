import Color from 'color';

import {
  TimeLayersGroupOptions,
  TimeLayer,
  TimeLayersGroup
} from '../TimeMap/TimeGroup';

import { App } from '../App';
import {
  GetFillColorOpt,
  HistoryLayerProperties,
  PopupContentField
} from '../interfaces';

import { formatArea, copyText } from '../utils/utils';
import { Principalities01 } from '../data/Principalities01';
import findYearInDateStr from '../utils/findYearInDateStr';

export class BaseLayer implements TimeLayersGroupOptions {
  name!: string;
  baseUrl!: string;
  manualOpacity?: boolean;
  filterIdField?: string;
  opacity = 1;
  simplification = 8;

  constructor(protected app: App, options: Partial<TimeLayersGroupOptions>) {
    Object.assign(this, options);
  }

  get groupLayer(): TimeLayersGroup | false {
    return this.app.timeMap && this.app.timeMap.getTimeGroup(this.name);
  }

  // for new NGW api
  // setUrl(opt: { baseUrl: string; resourceId: string }) {
  //   return (
  //     opt.baseUrl +
  //     '/api/component/feature_layer/mvt?x={x}&y={y}&z={z}&' +
  //     'resource=' +
  //     opt.resourceId +
  //     '&simplification=' +
  //     this.simplification
  //   );
  // }

  addLayers(url: string, id: string) {
    return this._createTimeLayers(url, id);
  }

  getFillColor(opt: GetFillColorOpt) {
    return this._getFillColor(opt);
  }

  createPopupContent(props: HistoryLayerProperties): HTMLElement | undefined {
    if (props && props.status && props.status < 6) {
      const fields: Array<{
        name?: string;
        field: keyof HistoryLayerProperties;
      }> = [
        // { name: 'Fid', field: 'fid' }
        // { field: 'name' }
        // { name: 'Наименование территории', field: 'name' },
        // { name: 'Дата возникновения', field: 'lwdate' },
        // { name: 'Дата исчезновения', field: 'updtrl' },
        // { name: 'Комментарий', field: 'linecomnt' },
      ];
      return this._createPropBlock(fields, props);
    }
  }

  private _getTimeGroup() {
    return this.app.timeMap.getTimeGroup(this.name);
  }

  private _createTimeLayers(
    url: string,
    id: string
  ): Array<Promise<TimeLayer>> {
    const timeGroup = this._getTimeGroup();
    if (timeGroup) {
      const paint = {
        'fill-opacity': timeGroup.opacity,
        'fill-opacity-transition': {
          duration: 0
        },
        // 'fill-outline-color': '#8b0000', // darkred
        // 'fill-outline-color': '#8b0000', // darkred
        'fill-color': this._getFillColor()
      };
      const selectedPaint = {
        ...paint,
        'fill-color': this._getFillColor({ darken: 0.5 })
      };
      const paintLine = {
        'line-opacity': timeGroup.opacity,
        'line-opacity-transition': {
          duration: 0
        },
        'line-width': 1,
        'line-color': this._getFillColor({ darken: 0.5 })
      };
      const sourceLayer = id;
      const fillLayer = this.app.webMap.addLayer('MVT', {
        url,
        id,
        paint,
        selectedPaint,
        selectable: true,
        type: 'fill',
        nativePaint: true,
        labelField: 'name',
        sourceLayer
      }) as Promise<TimeLayer>;
      const boundLayer = this.app.webMap.addLayer('MVT', {
        url,
        id: id + '-bound',
        name: id,
        paint: paintLine,
        type: 'line',
        sourceLayer,
        nativePaint: true
      }) as Promise<TimeLayer>;
      return [fillLayer, boundLayer];
    }
    return [];
  }

  private _getFillColor(opt: GetFillColorOpt = {}) {
    const { lineColorLegend, lineColor } = this.app.options;
    if (lineColor && lineColorLegend) {
      const meta: any = ['match', ['get', 'status']];
      // update lineColor by legend colors
      lineColorLegend.forEach(x => {
        const linksToLineColors = x[3];
        linksToLineColors.forEach(y => {
          const _lineColor = lineColor.find(z => z[0] === y);
          if (_lineColor) {
            _lineColor[1] = x[1];
          }
        });
      });

      const colors = lineColor.reduce<Array<string | number>>((a, b) => {
        const [param, color] = b;
        let c = Color(color);
        if (param) {
          a.push(param);
        }
        if (opt.darken) {
          c = c.darken(opt.darken);
        }
        a.push(c.hex());
        return a;
      }, []);
      return meta.concat(colors);
    }
  }

  private _formatDateStr(str: string): string {
    const formated = str
      .split('-')
      .reverse()
      .join('.');
    return formated;
  }

  private _createPropElement(html: string, addClass: string) {
    const propBlock = document.createElement('div');
    propBlock.className = 'popup__propertyblock';
    propBlock.innerHTML = `<div class="popup__property--value${
      addClass ? ' ' + addClass : ''
    }" >${html}</div >`;
    return propBlock;
  }

  private _findPrincipalities01(fid: number, year: number) {
    const princes = this.app.options.principalities01 || [];

    const prince = princes.find(x => {
      const upperdat = findYearInDateStr(x.upperdat);
      const lwdate = findYearInDateStr(x.lwdate);
      if (upperdat && lwdate) {
        return x.fid === fid && year <= upperdat && year >= lwdate;
      }
      return false;
    });

    return prince;
  }

  private _findPrincipalities02(fid: number, year: number) {
    const princes = this.app.options.principalities02 || [];

    const prince = princes.find(x => {
      const upperdat = findYearInDateStr(x.years_to);
      const lwdate = findYearInDateStr(x.years_from);
      if (upperdat && lwdate) {
        return fid === x.fid && year <= upperdat && year >= lwdate;
      }
      return false;
    });

    return prince;
  }

  private _createPropBlock(
    fields: Array<PopupContentField<keyof HistoryLayerProperties>>,
    props: HistoryLayerProperties,
    headerField = 'name'
  ) {
    const block = document.createElement('div');
    const _fields: PopupContentField[] = [...fields];
    const _props: Record<string, any> = { ...props };
    const timeStop = this.app.getTimeStop(this.app.timeMap.currentYear);
    if (timeStop === 'principalities') {
      this._addPrincipalitiesFields(_fields, _props);
    }

    if (_props[headerField]) {
      block.appendChild(
        this._createPropElement(
          `<h2>${_props[headerField]}
            <a class="feature-link">&#x1f517;</a>
          </h2>`,
          'prop header'
        )
      );
    }

    _fields.forEach(x => {
      const prop = _props[x.field];
      if (prop) {
        const propBlock = document.createElement('div');
        propBlock.className = 'popup__propertyblock';
        propBlock.innerHTML = '';
        if (prop) {
          const content = x.getHtml
            ? x.getHtml(prop, _props)
            : this._createPropElement(prop, '');
          block.appendChild(content);
        }
      }
    });

    if (props.status) {
      block.innerHTML += this._createPropStatusHtml(props);
    }
    const featureLink = block.getElementsByClassName(
      'feature-link'
    )[0] as HTMLElement;
    if (featureLink) {
      featureLink.addEventListener('click', () => {
        let url = document.location.origin + document.location.pathname;
        url += `?year=${this.app.timeMap.currentYear}&id=${props.fid}`;
        this.app.urlParams.set('id', String(props.fid));
        copyText(url);
      });
    }
    this._addPropShowDateClickEvent(block);
    return block;
  }

  private _addPrincipalitiesFields(
    fields: PopupContentField[],
    props: Record<string, any>
  ) {
    const addProp = (value: any, opt: PopupContentField) => {
      fields.push({ name: opt.field, ...opt });
      props[opt.field] = value;
    };
    const fid = props.fid;
    if (fid) {
      const prince02 = this._findPrincipalities02(
        fid,
        this.app.timeMap.currentYear
      );
      if (prince02) {
        addProp(prince02.ruler, { field: 'ruler' });
        // addProp(prince02.name, { field: 'name' });
      }
      const prince01 = this._findPrincipalities01(
        fid,
        this.app.timeMap.currentYear
      );
      if (prince01) {
        const getHtml = (
          prop: keyof Principalities01,
          props: Principalities01
        ) => {
          return this._createPropElement(
            `<a href="${props.desc_link}" target="_blank">${prop}</a>`,
            ''
          );
        };
        props.desc_link = prince01.desc_link;
        addProp(prince01.name, { field: 'name_prince', getHtml });
      }
    }
  }

  private _createPropStatusHtml(props: HistoryLayerProperties) {
    let str = '';
    const alias =
      this.app.options.statusAliases &&
      this.app.options.statusAliases[props.status];
    if (alias) {
      str += `
              <div class="popup__property--value status"><p>${alias}</p></div>
            `;
    }
    if (props.status > 0 && props.status < 6) {
      const lwdate = this._formatDateStr(props.lwdate);
      const updtrl = this._formatDateStr(props.updtrl || props.upperdat);
      if (lwdate && updtrl) {
        str += `
              <div class="popup__property--value dates">
                <span>
                  <span class="show-date">${lwdate}</span> -
                  <span class="show-date">${updtrl}</span>
                </span>
              </div>
            `;
      }
    }
    if (props.Area) {
      str += `
              <div class="popup__property--value area">
                <span>
                  ${formatArea(props.Area / 1000000)}
                </span>
              </div>
            `;
    }
    return str;
  }

  private _addPropShowDateClickEvent(block: HTMLElement) {
    const yearsLinks = block.querySelectorAll('.show-date');
    for (let fry = 0; fry < yearsLinks.length; fry++) {
      const link = yearsLinks[fry];
      link.addEventListener('click', () => {
        const year = findYearInDateStr(link.innerHTML);
        if (year) {
          this.app.timeMap.updateByYear(year);
          if (this.app.slider && this.app.slider._slider) {
            this.app.slider._slider.set(year);
          }
        }
      });
    }
  }
}
