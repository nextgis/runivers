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

export function getPointGeojson(id, callback) {
  connector.makeQuery('/api/resource/{id}/geojson', callback, {
    id: id
  });
}
