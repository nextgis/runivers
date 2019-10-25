import { Map } from 'mapbox-gl';

import WebMap, { MvtAdapterOptions, VectorLayerAdapter } from '@nextgis/webmap';

import { TimeLayersGroupOptions, TimeLayersGroup } from './TimeGroup';

type TLayer = string[];
export type TimeLayer = VectorLayerAdapter<Map, TLayer, MvtAdapterOptions>;

let EVENTS_IDS = 0;

export interface TimeMapOptions {
  timeLayersGroups?: TimeLayersGroupOptions[];
}

export class TimeMap {
  private readonly _timeLayersGroups: TimeLayersGroup[] = [];
  private _onGroupsLoadEvents: Record<number, (...args: any[]) => void> = [];

  constructor(private webMap: WebMap<Map, TLayer>, private options: TimeMapOptions = {}) {}

  getTimeGroup(groupName = ''): TimeLayersGroup {
    const group = this._timeLayersGroups.find(x => x.name === groupName) as TimeLayersGroup;
    return group;
  }

  getTimeGroups() {
    return this._timeLayersGroups;
  }

  addTimeGroup(options: TimeLayersGroupOptions) {
    const timeLayersGroup = new TimeLayersGroup(this.webMap, options);
    this._timeLayersGroups.push(timeLayersGroup);
  }

  updateLayer(layerId: string, groupName = ''): Promise<TimeLayersGroup | undefined> {
    const group = this.getTimeGroup(groupName);
    if (group) {
      return group.updateLayer(layerId).then(() => group);
    }
    return Promise.resolve(undefined);
  }

  pushDataLoadEvent(event: (...args: any[]) => void): number {
    const id = EVENTS_IDS++;
    const promises = this._timeLayersGroups.map(x => {
      return new Promise((resolve, reject) => {
        x.pushDataLoadEvent(resolve);
      }).then(x => console.log(x));
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
}
