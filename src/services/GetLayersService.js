import { connector } from './NgwConnectorService';
import config from '../../config.json';
import layers from '../data/layers.json';

export function getLayers(callback) {
  if (layers) {
    setTimeout(function () {callback(layers)}, 1000);
  } else {
    connector.makeQuery('/api/resource/?parent={id}', callback, {
      id: config.sourceGroupId
    });
  }
}
