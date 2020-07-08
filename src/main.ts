// import 'reset-css';
import 'mapbox-gl/dist/mapbox-gl.css';
// polyfills
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { defined } from '@nextgis/utils';
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
import { YearStat } from './components/Panels/YearsStatPanelControl';

function prepareYearStat(): YearStat[] {
  const cacheByYear: { [year: string]: YearStat[] } = {};
  (yearsStat as YearStat[]).forEach((s) => {
    cacheByYear[s.year] = cacheByYear[s.year] || [];
    cacheByYear[s.year].push(s);
  });
  for (const s in cacheByYear) {
    const stat = cacheByYear[s];
    if (stat.length > 1) {
      stat.forEach((x, i) => {
        if (!defined(x.count)) {
          x.numb = i + 1;
        }
      });
    }
  }
  return yearsStat;
}

const app = new App({
  baseUrl: config.baseUrl,
  target: 'map',
  fromYear: 850,
  timeStops: [{ toYear: 1462, name: 'principalities' }],
  currentYear: 1462,
  animationDelay: 100,
  animationStep: 1,
  bounds: [2, 27, 203, 82],
  minZoom: 3,
  periods,
  yearsStat: prepareYearStat(),
  areaStat,
  principalities01,
  principalities02,
  version: version,
  // @ts-ignore
  lineColor: config.lineColor,
  // @ts-ignore
  lineColorLegend: config.lineColorLegend,
  // statusAliases: config.statusAliases,
});

// remove first and last slider pips
app.emitter.on('build', () => {
  const pips = document.getElementsByClassName('noUi-marker-large');
  if (pips.length) {
    const firstLast = [pips[0], pips[pips.length - 1]] as HTMLElement[];
    firstLast.forEach((x) => {
      x.style.display = 'none';
    });
  }
});

// for testing and debug
// @ts-ignore
window.app = app;
// @ts-ignore
window.version = version;
