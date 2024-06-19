import { BaseLayer } from './BaseLayer';

import type { App } from '../App';
import type { TimeLayer } from '../TimeMap/TimeGroup';
import type { TimeLayersGroupOptions } from '../TimeMap/TimeGroup';
import type { MvtAdapterOptions } from '@nextgis/webmap';
import type { Feature, Point } from 'geojson';
// import type { CirclePaint } from '@nextgis/paint';
import type { Map } from 'maplibre-gl';

interface HistoricalRecord {
  id: number;
  accuracy: number; // 3
  finishDate: string; // "01.01.1690"
  link: string; // "Стр. 25 в: Кочедамов В.И. Первые русские города Сибири. М.: Стройиздат, 1978. 190 с."
  lwdata: string; // "1690-01-01"
  name: string; // "Индинский острог"
  startDate: string; // "01.01.1670"
  updata: string; // "1670-01-01"
}

export class OstrogLayer extends BaseLayer {
  constructor(
    protected app: App,
    options: Partial<TimeLayersGroupOptions>,
  ) {
    super(app, options);

    this.app.webMap.onLoad().then(() => {
      this._registerMapboxImages();
    });
  }

  addLayers(url: string, id: string): Promise<TimeLayer>[] {
    return this._createTimeLayers(url, id);
  }

  createPopupContent(props: HistoricalRecord): HTMLElement | undefined {
    const block = document.createElement('div');

    const nameContainer = document.createElement('div');
    nameContainer.className = 'popup__propertyblock';
    const nameElement = document.createElement('div');
    nameElement.className = 'popup__property--value prop header';
    nameElement.innerHTML = `<h2>${props.name}</h2>`;
    nameContainer.appendChild(nameElement);
    block.appendChild(nameContainer);

    if (props.link) {
      const linkElement = document.createElement('div');
      linkElement.className = 'popup__property--value link';
      linkElement.innerHTML = `<b>Источник:</b> ${props.link}`;
      block.appendChild(linkElement);
    }

    return block;
  }

  private async _createColoredSquare(color: string, strokeColor = '#691812') {
    const size = 6;
    const strokeSize = 1;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = color;
      context.fillRect(
        strokeSize,
        strokeSize,
        size - 2 * strokeSize,
        size - 2 * strokeSize,
      );

      context.strokeStyle = strokeColor;
      context.lineWidth = strokeSize;
      context.strokeRect(
        strokeSize / 2,
        strokeSize / 2,
        size - strokeSize,
        size - strokeSize,
      );
    }
    return createImageBitmap(canvas);
  }

  private async _registerMapboxImages() {
    const map: Map | undefined = this.app.webMap.mapAdapter.map;
    if (map) {
      const accuracyList: [number, string][] = [
        [1, '#71514e'],
        [2, '#ce9c4a'],
        [3, '#ddd8a1'],
        [0, 'gray'],
      ];
      for (const [accuracy, color] of accuracyList) {
        const img = await this._createColoredSquare(color);
        if (img) {
          map.addImage(`square-icon-${accuracy}`, img);
        }
      }
    }
  }

  private _createTimeLayers(url: string, id: string): Promise<TimeLayer>[] {
    const sourceLayer = 'ngw:' + id;

    const options: MvtAdapterOptions<Feature<Point, HistoricalRecord>> = {
      url,
      id,
      order: this.order,

      nativePaint: true,
      nativeOptions: { type: 'symbol' },
      layout: {
        'icon-image': [
          'match',
          ['get', 'accuracy'],
          1,
          'square-icon-1',
          2,
          'square-icon-2',
          3,
          'square-icon-3',
          'square-icon-0', // last item is default value
        ],
        'icon-size': 1,
      },
      selectedLayout: {
        'icon-image': [
          'match',
          ['get', 'accuracy'],
          1,
          'square-icon-1',
          2,
          'square-icon-2',
          3,
          'square-icon-3',
          'square-icon-0', // last item is default value
        ],
        'icon-size': 2,
      },
      interactive: true,
      selectable: true,
      unselectOnClick: true,
      paint: {},
      selectedPaint: {},

      popup: true,
      popupOnSelect: true,
      popupOptions: {
        unselectOnClose: true,
        createPopupContent: ({ feature }) => {
          return this.createPopupContent(feature.properties);
        },
      },

      type: 'point',

      sourceLayer,
    };

    const layer = this.app.webMap.addLayer(
      'MVT',
      options,
    ) as Promise<TimeLayer>;

    return [
      layer,
      // label,
    ];
  }
}
