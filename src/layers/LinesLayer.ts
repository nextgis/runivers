import { TimeLayer } from '../TimeMap/TimeGroup';
import { BaseLayer } from './BaseLayer';

import type { LineLayerSpecification } from 'maplibre-gl';

export interface LineTypePaint {
  width: number;
  color: string;
}

type LinePaint = LineLayerSpecification['paint'];

export class LinesLayer extends BaseLayer {
  // private _lineTypes: { [linetype: number]: LineTypePaint } = {
  //   1: { width: 2.06, color: 'rgba(132, 73, 58, 1.00)' },
  //   2: { width: 2.06, color: 'rgba(132, 73, 58, 0.50)' },
  //   3: { width: 3.26, color: 'rgba(132, 73, 58, 0.25)' },
  // };

  addLayers(url: string, id: string): Promise<TimeLayer>[] {
    const opacity = this.groupLayer ? this.groupLayer.opacity : 1;

    const paintLine: LinePaint = {
      ...this._getLinePaint(),
      'line-opacity': opacity,
      'line-width': 2,
    };
    const sourceLayer = 'ngw:' + id;

    const boundLayer = this.app.webMap.addLayer('MVT', {
      url,
      id,
      order: this.order,
      paint: paintLine,
      type: 'line',
      sourceLayer,
      nativePaint: true,
      visibility: true,
      // order: this.name === 'earl' ? 3 : 2
    }) as Promise<TimeLayer>;
    return [boundLayer];
  }

  private _getLineTypes() {
    const lineTypes: { [linetype: number]: LineTypePaint } = {};
    const { lineColorLegend } = this.app.options;
    const legend = lineColorLegend && lineColorLegend['lines'];
    if (legend && legend) {
      legend.forEach((x) => {
        const linksToLineColors = x[3];
        linksToLineColors.forEach((y) => {
          const paint = x[1];
          const status = x[3];
          status.forEach((z) => {
            const color = typeof paint === 'string' ? paint : paint.color;
            const width = (typeof paint !== 'string' && paint.width) || 1;
            lineTypes[Number(z)] = { color, width };
          });
        });
      });
    }
    return lineTypes;
  }

  // types of returned value, color, colorSpec changed to any / (number | string)[] because of Maplibre questionable update
  // more info: https://github.com/maplibre/maplibre-gl-js/issues/1380#issuecomment-1189041642
  private _getLinePaint(): any {
    const color: any = ['match', ['get', 'linetype']];
    const colorSpec: (number | string)[] = [];
    const lineTypes = this._getLineTypes();
    Object.entries(lineTypes).forEach(([linetype, value]) => {
      colorSpec.push(Number(linetype));
      colorSpec.push(value.color);
    });
    // default
    colorSpec.push('#000000');
    return { 'line-color': [...color, ...colorSpec] };
  }
}
