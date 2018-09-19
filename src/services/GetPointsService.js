import { connector } from './NgwConnectorService';
import config from '../../config.json';


export function getPoints(callback) {
  // if (points) {
    // setTimeout(function () {callback(points)});
  // } else {
  connector.makeQuery('/api/resource/?parent={id}', callback, {
    id: config.pointsGroupId
  });
  // }
}
