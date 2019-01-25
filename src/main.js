// import 'reset-css';
import { App } from './App';
import config from '../config.json';
import { version } from '../package.json';
import periods from './data/periods.csv';
import yearsStat from './data/years_stat.csv';
import areaStat from './data/area_stat.csv';

import './css/style.css';

// mapbox style and fonts from index.html <link>

const app = new App({
  baseUrl: (location.protocol) + '//' + config.baseUrl,
  target: 'map',
  fromYear: 1462,
  currentYear: 1300,
  animationDelay: 100,
  animationStep: 1,
  bounds: [2, 27, 203, 82],
  periods: periods,
  yearsStat: yearsStat,
  areaStat: areaStat,
  version: version,
  lineColor: config.lineColor,
  lineColorLegend: config.lineColorLegend,
  statusAliases: config.statusAliases
});

// remove first and last slider pips
app.emitter.on('build', function () {
  const pips = document.getElementsByClassName('noUi-marker-large');
  if (pips.length) {
    const firstLast = [pips[0], pips[pips.length - 1]];
    firstLast.forEach(function(x) {
      x.style.display = 'none';
    });
  }
});

// for testing and debug
window.app = app;
window.version = version;
