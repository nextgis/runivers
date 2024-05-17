import type { Feature } from 'geojson';
import type { GeoJSONSource } from 'maplibre-gl';

export default function getFeaturesInCluster(
  source: GeoJSONSource,
  feature: Feature,
  _features: Array<Feature> = [],
): Promise<Feature[]> {
  return new Promise((resolve) => {
    const props = feature.properties && feature.properties;
    if (props) {
      const isCluster = props.cluster;
      if (isCluster) {
        const clusterId =
          props.cluster_id !== undefined ? props.cluster_id : false;
        source.getClusterChildren(clusterId).then((features) => {
          const promises = [];
          if (features) {
            for (const x of features) {
              promises.push(getFeaturesInCluster(source, x, _features));
            }
          }
          Promise.all(promises).then(() => resolve(_features));
        });
      } else {
        _features.push(feature);
        resolve(_features);
      }
    }
  });
}
