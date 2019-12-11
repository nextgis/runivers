import { GeoJSONSource, MapboxGeoJSONFeature } from 'mapbox-gl';
import { Feature } from 'geojson';

export default function getFeaturesInCluster(
  source: GeoJSONSource,
  feature: MapboxGeoJSONFeature | Feature,
  _features: Array<Feature | MapboxGeoJSONFeature> = []
): Promise<Feature[]> {
  return new Promise(resolve => {
    const props = feature.properties && feature.properties;
    if (props) {
      const isCluster = props.cluster;
      if (isCluster) {
        const clusterId =
          props.cluster_id !== undefined ? props.cluster_id : false;
        source.getClusterChildren(clusterId, (error, features) => {
          const promises = [];
          for (const x of features) {
            promises.push(getFeaturesInCluster(source, x, _features));
          }
          Promise.all(promises).then(() => resolve());
        });
      } else {
        _features.push(feature);
        resolve(_features);
      }
    }
  });
}
