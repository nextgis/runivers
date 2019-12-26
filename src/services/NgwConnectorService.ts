import NgwConnector from '@nextgis/ngw-connector';
// @ts-ignore
import config from '../../config';

const ngwUrl = config.baseUrl;

const connector = new NgwConnector({
  baseUrl: ngwUrl
});

export { connector };
