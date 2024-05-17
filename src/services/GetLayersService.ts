import layers from '../data/layers.json';

import type { LayersGroup } from '../interfaces';

export function getLayers(callback: (layers: LayersGroup[]) => void): void {
  if (layers) {
    setTimeout(() => {
      callback(layers as LayersGroup[]);
    });
  }
}
