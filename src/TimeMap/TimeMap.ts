import { Map } from 'mapbox-gl';

import StrictEventEmitter from 'strict-event-emitter-types';
import { EventEmitter } from 'events';

import WebMap, { MvtAdapterOptions, VectorLayerAdapter } from '@nextgis/webmap';

import { TimeLayersGroupOptions, TimeLayersGroup } from './TimeGroup';
import { LayerIdRecord } from '../interfaces';

type TLayer = string[];
export type TimeLayer = VectorLayerAdapter<Map, TLayer, MvtAdapterOptions>;

let EVENTS_IDS = 0;
let ORDER = 0;

interface Events {
  'loading:start': LayerIdRecord;
  'loading:finish': LayerIdRecord;
}

export interface TimeMapOptions {
  timeLayersGroups?: TimeLayersGroupOptions[];
}

export class TimeMap {
  emitter: StrictEventEmitter<EventEmitter, Events> = new EventEmitter();

  private readonly _timeLayersGroups: TimeLayersGroup[] = [];
  private _onGroupsLoadEvents: Record<number, (...args: any[]) => void> = [];

  constructor(
    private webMap: WebMap<Map, TLayer>,
    private options: TimeMapOptions = {}
  ) {}

  getTimeGroup(groupName = ''): TimeLayersGroup {
    const group = this._timeLayersGroups.find(
      x => x.name === groupName
    ) as TimeLayersGroup;
    return group;
  }

  getTimeGroups() {
    return this._timeLayersGroups;
  }

  addTimeGroup(options: TimeLayersGroupOptions) {
    const timeLayersGroup = new TimeLayersGroup(this.webMap, options);
    this._timeLayersGroups.push(timeLayersGroup);
  }

  updateLayer(
    layerId: string,
    groupName = ''
  ): Promise<TimeLayersGroup | undefined> {
    const group = this.getTimeGroup(groupName);
    if (group) {
      return group.updateLayer(layerId).then(() => group);
    }
    return Promise.resolve(undefined);
  }

  updateLayers(layerIdRecord: LayerIdRecord): Promise<void> {
    const promises: Promise<any>[] = [];
    this.emitter.emit('loading:start', layerIdRecord);
    Object.entries(layerIdRecord).forEach(([key, value]) => {
      const promise = this.updateLayer(value, key).then(x => {
        return () => {
          if (x) {
            x.showOnlyCurrentLayer();
          }
        };
      });
      promises.push(promise);
    });
    return Promise.all(promises).then(groups => {
      groups.forEach(x => x());
      this.reOrderGroupsLayers();
      this.emitter.emit('loading:finish', layerIdRecord);
    });
  }

  pushDataLoadEvent(event: (...args: any[]) => void): number {
    const id = EVENTS_IDS++;
    const promises = this._timeLayersGroups.map(x => {
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

  reOrderGroupsLayers() {
    this._timeLayersGroups.forEach(x => {
      x.forEachTimeLayer(x.currentLayerId, y => {
        // Fix to avoid moving the non-renewable layer down
        y.options.order = 1 + ORDER++ * 0.1;
        if (y.layer) {
          y.layer.forEach(z => {
            const map = this.webMap.mapAdapter.map;
            if (map) {
              map.moveLayer(z);
            }
          });
        }
      });
    });
  }
}
