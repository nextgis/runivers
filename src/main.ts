// import 'reset-css';
import 'mapbox-gl/dist/mapbox-gl.css';
// polyfills
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { App } from './App';
import config from '../config.json';
import { version } from '../package.json';
// @ts-ignore
import periods from './data/periods.csv';
// @ts-ignore
import yearsStat from './data/years_stat.csv';
// @ts-ignore
import areaStat from './data/area_stat.csv';
// @ts-ignore
import principalities01 from './data/principalities_01.csv';
// @ts-ignore
import principalities02 from './data/principalities_02.csv';

import './css/style.css';

const app = new App({
  baseUrl: config.baseUrl,
  target: 'map',
  // fromYear: 1462,
  timeStops: [{ toYear: 1462, name: 'principalities' }],
  currentYear: 1462,
  animationDelay: 100,
  animationStep: 1,
  bounds: [2, 27, 203, 82],
  periods,
  yearsStat,
  areaStat,
  principalities01,
  principalities02,
  version: version,
  // @ts-ignore
  lineColor: config.lineColor,
  // @ts-ignore
  lineColorLegend: config.lineColorLegend,
  statusAliases: config.statusAliases
});

// remove first and last slider pips
app.emitter.on('build', () => {
  const pips = document.getElementsByClassName('noUi-marker-large');
  if (pips.length) {
    const firstLast = [pips[0], pips[pips.length - 1]] as HTMLElement[];
    firstLast.forEach(x => {
      x.style.display = 'none';
    });
  }
});

// for testing and debug
// @ts-ignore
window.app = app;
// @ts-ignore
window.version = version;
