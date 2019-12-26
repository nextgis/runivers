import {
  TimeLayersGroupOptions,
  TimeLayer,
  TimeLayersGroup
} from '../TimeMap/TimeGroup';

import { App } from '../App';

export abstract class BaseLayer implements TimeLayersGroupOptions {
  name!: string;
  baseUrl!: string;
  manualOpacity?: boolean;
  filterIdField?: string;
  opacity = 1;
  simplification = 8;
  oldNgwMvtApi = false;

  constructor(protected app: App, options: Partial<TimeLayersGroupOptions>) {
    Object.assign(this, options);
  }

  get groupLayer(): TimeLayersGroup | false {
    return this.app.timeMap && this.app.timeMap.getTimeGroup(this.name);
  }

  abstract addLayers(url: string, id: string): Promise<TimeLayer>[];
}
