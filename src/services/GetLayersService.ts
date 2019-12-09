import layers from '../data/layers.json';
import { LayersGroup } from '../interfaces';

export function getLayers(callback: (layers: LayersGroup[]) => void) {
  if (layers) {
    setTimeout(() => {
      callback(layers as LayersGroup[]);
    });
  }
}
