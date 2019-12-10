import { LinePaint } from 'mapbox-gl';
import {
  TimeLayersGroupOptions,
  TimeLayer,
  TimeLayersGroup
} from '../TimeMap/TimeGroup';
import { App } from '../App';

export interface LineTypePaint {
  width: number;
  color: string;
}

export class LinesLayer implements TimeLayersGroupOptions {
  name!: string;
  baseUrl!: string;
  manualOpacity?: boolean;
  filterIdField?: string;
  opacity = 1;
  simplification = 8;

  private _lineTypes: { [linetype: number]: LineTypePaint } = {
    1: { width: 1.06, color: 'rgba(132, 73, 58, 1.00)' },
    2: { width: 1.06, color: 'rgba(132, 73, 58, 0.50)' },
    3: { width: 2.26, color: 'rgba(132, 73, 58, 0.25)' }
  };

  constructor(protected app: App, options: Partial<TimeLayersGroupOptions>) {
    Object.assign(this, options);
  }

  get groupLayer(): TimeLayersGroup | false {
    return this.app.timeMap && this.app.timeMap.getTimeGroup(this.name);
  }

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
    const opacity = this.groupLayer ? this.groupLayer.opacity : 1;

    const paintLine: LinePaint = {
      'line-opacity': opacity,
      'line-opacity-transition': {
        duration: 0
      },
      'line-width': 2,
      ...this._getLinePaint()
    };
    // const sourceLayer = 'ngw:' + id;
    const sourceLayer = id;

    const boundLayer = this.app.webMap.addLayer('MVT', {
      url,
      id,
      paint: paintLine,
      type: 'line',
      sourceLayer,
      nativePaint: true,
      visibility: true
      // order: this.name === 'earl' ? 3 : 2
    }) as Promise<TimeLayer>;
    return [boundLayer];
  }

  private _getLinePaint(): LinePaint {
    const color: LinePaint['line-color'] = ['match', ['get', 'linetype']];
    Object.entries(this._lineTypes).forEach(([linetype, value]) => {
      color.push(Number(linetype));
      color.push(value.color);
    });
    // default
    color.push('#000000');
    return { 'line-color': color };
  }
}
