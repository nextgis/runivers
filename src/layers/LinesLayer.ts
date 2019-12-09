import Color from 'color';
import {
  TimeLayersGroupOptions,
  TimeLayer,
  TimeLayersGroup
} from '../TimeMap/TimeGroup';
import { GetFillColorOpt } from 'src/interfaces';
import { App } from '../App';

export class LinesLayer implements TimeLayersGroupOptions {
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

    const paintLine: mapboxgl.LinePaint = {
      'line-opacity': opacity,
      'line-opacity-transition': {
        duration: 0
      },
      'line-width': 2,
      'line-color': '#697483'
    };
    if (this.name === 'earl') {
      paintLine['line-width'] = 1;
      paintLine['line-color'] = '#777';
    }
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

  getFillColor(opt: GetFillColorOpt = {} as GetFillColorOpt) {
    const colors: Record<string, string> = {
      king: 'red',
      duke: '#697483',
      earl: '#697483'
    };
    const color = colors[this.name] || 'orange';
    let c = Color(color);

    if (opt.darken) {
      c = c.darken(opt.darken);
    }
    return c.hex();
  }

  // createPopupContent(props: Record<string, any>) {
  //   const content = document.createElement('div');
  //   content.innerHTML = JSON.stringify(props, null, 2);
  //   return content;
  // }
}
