import layers from '../data/layers.json';

import type { LayersGroup } from '../interfaces';

export function getLayers(): Promise<LayersGroup[]> {
  return new Promise((resolve) => {
    if (layers) {
      resolve(layers as LayersGroup[]);
    }
  });
}
