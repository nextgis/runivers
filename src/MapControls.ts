import { App } from './App';
import { Panel } from './components/Panels/PanelControl';
import { getBottomLinksPanel, getTopLinksPanel, getBottomLeftLinksPanel, getTopLeftLinksPanel, getAboutProjectLink } from './components/Links/Links';
import { ControlPositions } from 'nextgisweb_frontend/packages/webmap/src';
import { LegendPanelControl } from './components/Panels/LegendPanelControl';

export class MapControl {

  private legendPanel: Panel;
  private _bottomLink: Panel;
  private _bottomLeftLink: Panel;
  private _topLink: Panel;
  private _topLeftLink: Panel;

  private _installedControls: any[] = [];

  constructor(private app: App) {
    this._addEventsListeners();
  }

  addControls() {
    this._addFullSizeControls();
  }

  removeControls() {
    this._installedControls.forEach((x) => {
      this.app.webMap.removeControl(x);
    });
  }

  private _addControl(control: any, position: ControlPositions) {
    const addedControl = this.app.webMap.addControl(control, position);
    if (addedControl) {
      this._installedControls.push(addedControl);
    }
  }

  private _addFullSizeControls() {

    this.legendPanel = new LegendPanelControl({
      // colors: this.options.lineColor,
      colors: this.app.options.lineColorLegend,
    });

    // this.legendPanel.emitter.on('change', (colors) => this.app._updateLayersColor());

    this._addControl(this.legendPanel, 'top-left');
    this._addControl('ZOOM', 'top-left');

    this._bottomLink = getBottomLinksPanel();
    this._bottomLeftLink = getBottomLeftLinksPanel();
    this._topLink = getTopLinksPanel(this.app);
    this._topLeftLink = getTopLeftLinksPanel(this.app);

    this._addControl(this._topLink, 'top-right');
    this._addControl(this._topLeftLink, 'top-left');

    this._addControl(this.app.periodsPanelControl, 'top-right');
    this._addControl(this.app.yearsStatPanelControl, 'top-right');

    // this.webMap.addControl(this._bottomLeftLink, 'bottom-left');
    this._addControl(this._bottomLink, 'bottom-left');
  }

  private _addEventsListeners() {
    // window size change
  }
}
