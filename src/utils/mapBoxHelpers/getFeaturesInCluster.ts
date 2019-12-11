import { GeoJSONSource, MapboxGeoJSONFeature } from 'mapbox-gl';
import { Feature } from 'geojson';

export default function getFeaturesInCluster(
  source: GeoJSONSource,
  feature: MapboxGeoJSONFeature | Feature,
  _features: Array<Feature | MapboxGeoJSONFeature> = []
): Feature[] {
  const props = feature.properties && feature.properties;
  if (props) {
    const isCluster = props.cluster;
    if (isCluster) {
      const clusterId =
        props.cluster_id !== undefined ? props.cluster_id : false;
      source.getClusterChildren(clusterId, (error, features) => {
        features.forEach(x => {
          getFeaturesInCluster(source, x, _features);
        });
      });
    } else {
      _features.push(feature);
    }
  }
  return _features;
}
