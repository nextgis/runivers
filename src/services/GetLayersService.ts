// import { connector } from './NgwConnectorService';
// import config from '../../config.json';
import layers from '../data/layers.json';
import { HistoryLayerResource } from 'src/interfaces.js';

export function getLayers(callback: (l: HistoryLayerResource[]) => void) {
  const _layers = layers as HistoryLayerResource[];
  if (layers) {
    setTimeout(() => {
      callback(_layers);
    });
  } else {
    // connector.makeQuery('/api/resource/?parent={id}', callback, {
    //   id: config.sourceGroupId
    // });
  }
}
