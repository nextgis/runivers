import config from '../../config.json';

import { connector } from './NgwConnectorService';

import type { ResourceItem } from '@nextgis/ngw-connector';
import type { FeatureCollection, MultiPoint } from 'geojson';
import type { PointProperties } from 'src/interfaces';

export function getPoints(): Promise<ResourceItem[]> {
  return connector.makeQuery('/api/resource/?parent={id}', {
    id: config.pointsGroupId,
  });
}

export function getPointGeojson(
  id: string,
): Promise<FeatureCollection<MultiPoint, PointProperties>> {
  return connector.makeQuery('/api/resource/{id}/geojson', {
    id,
  });
}
