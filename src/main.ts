// import 'reset-css';

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

import './css/style.css';

// mapbox style and fonts from index.html <link>

const app = new App({
  baseUrl: config.baseUrl,
  target: 'map',
  // fromYear: 1462,
  currentYear: 1462,
  animationDelay: 100,
  animationStep: 1,
  bounds: [2, 27, 203, 82],
  periods: periods,
  yearsStat: yearsStat,
  areaStat: areaStat,
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
