import type { Feature } from 'geojson';
import type { GeoJSONSource, GeoJSONFeature } from 'maplibre-gl';

export default function getFeaturesInCluster(
  source: GeoJSONSource,
  feature: GeoJSONFeature | Feature,
  _features: Array<Feature | GeoJSONFeature> = [],
): Promise<Feature[]> {
  return new Promise((resolve) => {
    const props = feature.properties && feature.properties;
    if (props) {
      const isCluster = props.cluster;
      if (isCluster) {
        const clusterId =
          props.cluster_id !== undefined ? props.cluster_id : false;
        source.getClusterChildren(clusterId, (error, features) => {
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
