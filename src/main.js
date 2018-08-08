import { App } from './App';
import config from '../config.json';
import { version } from '../package.json';

const app = new App({
  baseUrl: config.baseUrl,
  target: 'map',
  currentYear: 1301
});

// for testing and debug
app.version = version;
window.app = app;
