import { connector } from './NgwConnectorService';
import config from '../../config.json';


export function getPoints() {
  // if (points) {
  // setTimeout(function () {callback(points)});
  // } else {
  return connector.makeQuery('/api/resource/?parent={id}', {
    id: config.pointsGroupId
  });
  // }
}

export function getPointGeojson(id) {
  return connector.makeQuery('/api/resource/{id}/geojson', {
    id: id
  });
}
