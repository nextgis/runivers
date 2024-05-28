import { BaseLayer } from './BaseLayer';

import type { App } from '../App';
import type { TimeLayer } from '../TimeMap/TimeGroup';
import type { TimeLayersGroupOptions } from '../TimeMap/TimeGroup';

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

  private _createTimeLayers(url: string, id: string): Promise<TimeLayer>[] {
    const sourceLayer = 'ngw:' + id;

    const layer = this.app.webMap.addLayer('MVT', {
      url,
      id,
      order: this.order,
      paint: {
        color: [
          'match',
          ['get', 'accuracy'],
          1,
          'green',
          2,
          'yellow',
          3,
          'red',
          'gray', // last item is default value
        ],
        opacity: 1,
        stroke: true,
        strokeColor: 'white',
        radius: 5,
      },
      type: 'point',
      sourceLayer,
    }) as Promise<TimeLayer>;

    return [
      layer,
      // label,
    ];
  }
}
