import StrictEventEmitter from 'strict-event-emitter-types';
import { EventEmitter } from 'events';

import { TimeLayersGroup } from './TimeGroup';

import type { Map } from 'maplibre-gl';
import type {
  WebMap,
  MvtAdapterOptions,
  VectorLayerAdapter,
} from '@nextgis/webmap';
import type { TimeLayersGroupOptions } from './TimeGroup';
import type {
  LayerMetaRecord,
  LayerIdRecord,
  LayersGroup,
  GroupsMeta,
  LayerMeta,
} from '../interfaces';

type TLayer = string[];
export type TimeLayer = VectorLayerAdapter<Map, TLayer, MvtAdapterOptions>;

export interface TimeGroupDefinition {
  timeGroup: TimeLayersGroup;
  timeLayer: TimeLayer;
}

let EVENTS_IDS = 0;
// const ORDER = 0;

export interface LoadingLayerFinishEvent {
  layerId: string | false;
  layer: TimeLayersGroup;
}

interface Events {
  'loading:start': LayerIdRecord;
  'loading:finish': LayerIdRecord | false;
  'loading-layer:finish': LoadingLayerFinishEvent;
}

export interface TimeMapOptions {
  timeLayersGroups?: TimeLayersGroupOptions[];
  fromYear?: number;
  toYear?: number;
  getStatusLayer: (config: LayersGroup) => TimeLayersGroupOptions | undefined;
  onLayerUpdate?: (year: number) => void;
  onStepReady?: (year: number) => void;
  onReset?: () => void;
}

export class TimeMap {
  emitter: StrictEventEmitter<EventEmitter, Events> = new EventEmitter();
  currentYear!: number;
  nextYear?: number;
  _minYear = 0;
  _maxYear = 0;
  private readonly _timeLayersGroups: TimeLayersGroup[] = [];
  private _onGroupsLoadEvents: Record<number, (...args: any[]) => void> = [];
  private _groupsConfig: Record<string, GroupsMeta> = {};
  private _loadLayerPromises: {
    [layerName: string]: { id: string; promise: Promise<any> };
  } = {};

  constructor(
    private webMap: WebMap<Map, TLayer>,
    private options: TimeMapOptions = {} as TimeMapOptions,
  ) {}

  getTimeGroup(groupName = ''): TimeLayersGroup {
    const group = this._timeLayersGroups.find(
      (x) => x.name === groupName,
    ) as TimeLayersGroup;
    return group;
  }

  getTimeGroupByAdapterId(id: string): TimeGroupDefinition | undefined {
    return this._getTimeGroupBy((timeLayer) => timeLayer.id === id);
  }

  getTimeGroupByLayerId(id: string): TimeGroupDefinition | undefined {
    return this._getTimeGroupBy((timeLayer) => !!timeLayer.layer?.includes(id));
  }

  getTimeGroups(): TimeLayersGroup[] {
    return this._timeLayersGroups;
  }

  addTimeGroup(options: TimeLayersGroupOptions): void {
    const timeLayersGroup = new TimeLayersGroup(this.webMap, options);
    this._timeLayersGroups.push(timeLayersGroup);
  }

  updateByYear(year: number, previous?: boolean): void {
    const layersId = this._getLayerIdsByYear(year, previous);
    if (layersId) {
      this.updateLayers(layersId);
    }
    if (this.options.onLayerUpdate) {
      this.options.onLayerUpdate(year);
    }
  }

  updateLayer(
    layerId: string | false,
    groupName = '',
  ): Promise<TimeLayersGroup | undefined> {
    const group = this.getTimeGroup(groupName);
    if (group) {
      if (layerId) {
        return group.updateLayer(layerId).then(() => group);
      } else {
        group.clean();
        return Promise.resolve(undefined);
      }
    }
    return Promise.resolve(undefined);
  }

  async updateLayers(layerIdRecord: LayerIdRecord): Promise<void> {
    const updateLayersPromise = await this.getUpdateLayersPromise(
      layerIdRecord,
    );
    return this.finishLoading(updateLayersPromise, layerIdRecord);
  }

  resetLoading(): void {
    this._timeLayersGroups.forEach((x) => {
      if (x.beforeLayerId) {
        x.currentLayerId = x.beforeLayerId;
        x.hideNotCurrentLayers();
        x.beforeLayerId = undefined;
      }
    });
    if (this.options.onReset) {
      this.options.onReset();
    }
    this._loadLayerPromises = {};
    this.emitter.emit('loading:finish', false);
  }

  finishLoading(groups: (() => void)[], layerIdRecord: LayerIdRecord): void {
    const layerIdRecordList = Object.keys(layerIdRecord);

    this._timeLayersGroups.forEach((x) => {
      x.beforeLayerId = undefined;
      if (!layerIdRecordList.includes(x.name)) {
        if (x.currentLayerId) {
          x.hideLayer(x.currentLayerId);
        }
      }
    });
    groups.forEach((x: () => void) => x());
    this._loadLayerPromises = {};
    this.emitter.emit('loading:finish', layerIdRecord);
  }

  getUpdateLayersPromise(layerIdRecord: LayerIdRecord): Promise<any[]> {
    const promises: Promise<any>[] = [];
    this.emitter.emit('loading:start', layerIdRecord);
    const layerIdRecordList = Object.keys(layerIdRecord);
    layerIdRecordList.forEach((key) => {
      const value = layerIdRecord[key];
      const exist = this._loadLayerPromises[key];
      if (exist && exist.promise) {
        promises.push(exist.promise);
      } else {
        const promise = this.updateLayer(value, key).then((x) => {
          delete this._loadLayerPromises[key];
          return () => {
            if (x) {
              x.showOnlyCurrentLayer();
              this.emitter.emit('loading-layer:finish', {
                layerId: value,
                layer: x,
              });
            }
          };
        });
        promises.push(promise);
      }
    });
    return Promise.all(promises);
  }

  pushDataLoadEvent(event: (...args: any[]) => void): number {
    const id = EVENTS_IDS++;
    const promises = this._timeLayersGroups.map((x) => {
      return new Promise((resolve, reject) => {
        x.pushDataLoadEvent(resolve);
      });
    });
    this._onGroupsLoadEvents[id] = event;
    Promise.all(promises).then(() => {
      const _event = this._onGroupsLoadEvents[id];
      if (_event) {
        _event();
      }
    });
    return id;
  }

  unselect(opt: { exclude?: string[] } = {}): void {
    this._timeLayersGroups.forEach((x) => {
      const include = opt.exclude ? opt.exclude.indexOf(x.name) === -1 : true;
      if (include && x.currentLayerId) {
        x.forEachTimeLayer(x.currentLayerId, (y: VectorLayerAdapter) => {
          if (y.unselect && y.selected) {
            y.unselect();
          }
        });
      }
    });
  }

  buildTimeMap(data: LayersGroup[]): void {
    this._groupsConfig = this._processGroupsMeta(data);
    this._addTimeLayersGroups(data);
    if (!this.currentYear && this._minYear) {
      this.currentYear = this._minYear;
    }
    Object.values(this._groupsConfig).forEach((x) => {
      x.layersMeta.sort((a, b) => (a.from < b.from ? -1 : 1));
    });
  }

  _addTimeLayersGroups(config: LayersGroup[]): void {
    config.forEach((x) => {
      const statusLayer = this.options.getStatusLayer(x);
      if (statusLayer) {
        this.addTimeGroup(statusLayer);
      }
    });
  }

  async _stepReady(
    year: number,
    callback: (year: number, nextCb?: () => void, stopCb?: () => void) => void,
    previous?: boolean,
  ): Promise<void> {
    let nextLayers: LayerMetaRecord = this._getLayersByYear(year, previous);
    if (!nextLayers) {
      nextLayers = this._getNextLayers(year, previous);
    }

    if (nextLayers) {
      let updateLayersPromise: any[] | undefined;
      let layerIdRecord: LayerIdRecord | undefined;
      const y = year;
      this.nextYear = y;
      const next = () => {
        const finish = () => {
          this.nextYear = undefined;
          this.currentYear = y;
          if (updateLayersPromise && layerIdRecord) {
            this.finishLoading(updateLayersPromise, layerIdRecord);
          }
          if (this.options.onStepReady) {
            this.options.onStepReady(y);
          }
        };
        const resetLoading = () => {
          this.nextYear = undefined;
          this.resetLoading();
        };
        callback(
          y,
          () => finish(),
          () => resetLoading(),
        );
      };
      const noChange = Object.entries(nextLayers).every(([groupName, x]) => {
        const timeGroup = this.getTimeGroup(groupName);
        if (timeGroup) {
          const newId = x && x.id;
          return timeGroup.currentLayerId === String(newId);
        }
        return true;
      });
      if (noChange) {
        next();
      } else {
        layerIdRecord = this._layerMetaToIdRecord(nextLayers);
        updateLayersPromise = await this.getUpdateLayersPromise(layerIdRecord);
        next();
      }
    } else {
      if (this._minYear && this._maxYear) {
        callback(previous ? this._minYear : this._maxYear);
      }
    }
  }

  private _getTimeGroupBy(
    fun: (timeLayer: TimeLayer) => boolean,
  ): TimeGroupDefinition | undefined {
    for (let fry = 0; fry < this._timeLayersGroups.length; fry++) {
      const layerGroup = this._timeLayersGroups[fry];
      const timeLayer = layerGroup.getTimeLayer();
      if (timeLayer) {
        for (let f = 0; f < timeLayer.length; f++) {
          const layer = timeLayer[f];
          if (layer && fun(layer)) {
            return { timeGroup: layerGroup, timeLayer: layer };
          }
        }
      }
    }
  }

  private _getLayersByYear(year: number, previous?: boolean): LayerMetaRecord {
    const layersMeta: LayerMetaRecord = {};
    this.getTimeGroups().forEach((x) => {
      const groupConfig = this._groupsConfig[x.name];
      const layers = groupConfig.layersMeta.filter(
        // if range from 900 to 901, event may be only in 900
        (d) => year >= d.from && year <= d.to,
      );
      layersMeta[x.name] = layers.length
        ? previous
          ? layers[0]
          : layers[layers.length - 1]
        : false;
    });
    return layersMeta;
  }

  private _getLayerIdsByYear(year: number, previous?: boolean): LayerIdRecord {
    const filteredLayers = this._getLayersByYear(year, previous);
    return this._layerMetaToIdRecord(filteredLayers);
  }

  private _layerMetaToIdRecord(metaRecord: LayerMetaRecord): LayerIdRecord {
    const layersId: LayerIdRecord = {};
    Object.entries(metaRecord).forEach(([key, value]) => {
      if (value) {
        layersId[key] = String(value.id);
      } else {
        layersId[key] = false;
      }
    });
    return layersId;
  }

  // get next or previous territory changed layer
  private _getNextLayers(year: number, previous?: boolean): LayerMetaRecord {
    const layersMetaInYear = this._getLayersByYear(year);
    const filteredLayers: LayerMetaRecord = {};
    for (const l in layersMetaInYear) {
      const layerMeta = layersMetaInYear[l];
      let nextLayer: LayerMeta | undefined;
      const config = this._groupsConfig[l];
      if (layerMeta) {
        const currentLayerId = this.getTimeGroup(config.name).currentLayerId;
        if (String(layerMeta.id) === currentLayerId) {
          const index = config.layersMeta.indexOf(layerMeta);
          if (index !== -1) {
            nextLayer = config.layersMeta[previous ? index - 1 : index + 1];
          }
        } else {
          layerMeta;
        }
      } else {
        // if no layer for this year find nearest
        if (previous) {
          nextLayer = config.layersMeta
            .slice()
            .reverse()
            .find((d) => d.to <= year);
        } else {
          nextLayer = config.layersMeta.find((d) => d.from >= year);
        }
      }
      if (nextLayer) {
        filteredLayers[l] = nextLayer;
      }
    }
    return filteredLayers;
  }

  private _processGroupsMeta(
    layersGroup: LayersGroup[],
  ): Record<string, GroupsMeta> {
    const groupsMeta: Record<string, GroupsMeta> = {};
    layersGroup.forEach((group) => {
      const layersMeta: LayerMeta[] = [];
      group.items.forEach(({ resource }) => {
        const name = resource.display_name;
        // const _match = name.match('from_(\\d{3,4})_to_(\\d{3,4}).*$');
        const _match = name.match('(\\d{3,4})_(to_)?(\\d{3,4}).*$');
        if (_match) {
          const [from, to] = [_match[1], _match[3]].map((x) => Number(x));
          const allowedYear =
            (this.options.fromYear && from < this.options.fromYear) ||
            (this.options.toYear && to > this.options.toYear)
              ? false
              : true;
          if (allowedYear) {
            this._minYear =
              (this._minYear > from ? from : this._minYear) || from;
            this._maxYear = (this._maxYear < to ? to : this._maxYear) || to;
            layersMeta.push({ name, from, to, id: resource.id });
          }
        }
      });
      groupsMeta[group.name] = { layersMeta: layersMeta, name: group.name };
    });
    return groupsMeta;
  }
}
