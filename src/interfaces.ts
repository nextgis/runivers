import { Marker } from 'mapbox-gl';
import { LngLatBoundsArray } from '@nextgis/webmap';
import { MapboxglMapAdapterOptions } from '@nextgis/mapboxgl-map-adapter';
import { Period } from './components/Panels/PeriodPanelControl';
import { YearStat } from './components/Panels/YearsStatPanelControl';
import { Principalities01 } from './data/Principalities01';
import { Principalities02 } from './data/Principalities02';

export interface AreaStat {
  year: number;
  area: number;
  plus?: number;
  minus?: number;
}

export interface TimeStop {
  toYear: number;
  name: string;
}

export interface AppOptions extends MapboxglMapAdapterOptions {
  baseUrl: string;
  target: string;
  fromYear?: number;
  currentYear?: number;
  animationStep?: number;
  animationDelay?: number;
  bounds?: LngLatBoundsArray;
  periods?: Period[];
  yearsStat?: YearStat[];
  areaStat?: AreaStat[];
  principalities01?: Principalities01[];
  principalities02?: Principalities02[];
  timeStops: TimeStop[];
  version?: string;
  lineColor?: Array<[number | string, string]>;
  /** self id, color, label, array of link to lineColor id */
  lineColorLegend?: Array<[number, string, string, number[]]>;
  statusAliases?: { [name: string]: string };
}

export interface HistoryLayerProperties {
  name: string;
  cat: number;
  fid: number;
  id: number;
  linecomnt: string;
  lwdate: string;
  lwdtappr: number;
  status: number;
  updtappr: number;
  updtrl: string;
  upperdat: string;
  Area: number;
}

export interface LayerMeta {
  name: string;
  from: number;
  to: number;
  id: number;
}

export interface PointMeta {
  name: string;
  year: number;
  month?: number;
  day?: number;
  id: number;
}

export interface PointProperties {
  areasum: number;
  count: number;
  ident: number;
  numb: number;
  row_number: number;
  status: number;
  year: number;

  // status: number; // 6
  // lwdate: string; // 1945-06-29,
  // lwdtappr: number; // 0,
  // srcdata: any;
  // upperdat: string; // 1946-06-29,
  // eventstart: string; // по договору СССР с Чехословакией Украинской ССР передана Закарпатская область,
  // cat: number; // 342,
  // fid: number; // 547,
  // updtrl: any;
  // linecomnt: string; // Передача СССР Кенигсберга,
  // updtappr: any;
  // name: any;
  // numb?: number;
}

export interface AppMarkerMem {
  marker: Marker;
  element: HTMLElement;
  properties: PointProperties;
}

export interface HistoryLayerResource {
  resource: {
    display_name: string;
    id: number;
  };
}

export interface GetFillColorOpt {
  lighten?: number;
  darken?: number;
}

export interface PopupContentField<T = any> {
  name?: string;
  field: T;
  getHtml?: (prop: any, props: any) => HTMLElement;
}

export interface GroupsMeta {
  name: string;
  layersMeta: LayerMeta[];
}

export interface LayersGroup {
  name: string;
  // resourceId: number;
  items: HistoryLayerResource[];
}

export type LayerMetaRecord = { [groupName: string]: LayerMeta };
export type LayerIdRecord = { [groupName: string]: string };
