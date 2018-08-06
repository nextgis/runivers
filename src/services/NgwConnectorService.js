import { Ngw } from 'ngw-connector';
import config from '../../config.json';

var ngwUrl = config.baseUrl;

var connector = new Ngw({
  baseUrl: ngwUrl
});

export {connector};
