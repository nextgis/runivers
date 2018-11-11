import NgwConnector from '../../nextgisweb_frontend/packages/ngw-connector';
import config from '../../config.json';

var ngwUrl = config.baseUrl;

var connector = new NgwConnector({
  baseUrl: ngwUrl
});

export {connector};
