import { App } from './App';
import { Panel } from './components/Panels/PanelControl';
import {
  getSocialLinksPanel,
  getSwitcherPanelControl,
  getHomeBtnControl,
} from './components/Links/Links';
import { ControlPositions } from '@nextgis/webmap';
import { LegendPanelControl } from './components/Panels/LegendPanelControl';
import { PeriodPanelControl } from './components/Panels/PeriodPanelControl';
import { YearsStatPanelControl } from './components/Panels/YearsStatPanelControl';
import { IControl } from 'mapbox-gl';

import './Controls.css';
import { TimeMapLoadingControl } from './TimeMap/TimeMapLoadingControl';

interface ScreenSize {
  height: number;
  width: number;
}

export class Controls {
  periodsPanelControl?: PeriodPanelControl;
  yearsStatPanelControl?: YearsStatPanelControl;
  legendPanel?: LegendPanelControl;

  private isMobile = false;

  private _socialLinksPanel?: Panel;
  private _switchersPanel?: Panel;
  private _homeBtnPanel: any | Promise<any>;
  private _zoomControl?: IControl;
  private _loadingControl?: TimeMapLoadingControl;

  private _attributions?: IControl;

  private _installedControls: any[] = [];

  private _mobileTogglePanels: Panel[] = [];
  private _openPanels: Panel[] = [];
  private _eventBindings: { [name: string]: (...args: any[]) => void } = {
    onMapClick: () => null,
  };

  private _mobSizeConst: ScreenSize = {
    height: 700,
    width: 650,
  };

  private _togglerEvents: Array<[Panel, () => void]> = [];

  constructor(public app: App) {
    this._eventBindings.onMapClick = () => this._onMapClick();

    this.checkMobile();
    this.initControls();
    this._updateTimeSlider();
    this._updateMapEvents();
    this._addEventsListeners();
  }

  updateControls() {
    this.removeControls();

    const mapContainer = this.app.webMap.getContainer();
    if (mapContainer) {
      if (this.isMobile) {
        this._hideAllPanels();
        mapContainer.classList.add('mobile');
        this._addMobileControls();
        this._addPanelToggleListeners();
      } else {
        this._mobileTogglePanels.forEach((x) => {
          if (this._openPanels.indexOf(x) !== -1) {
            x.show();
          }
        });
        this._removePanelToggleListener();
        mapContainer.classList.remove('mobile');
        this._addFullSizeControls();
      }
    }
  }

  removeControls() {
    this._installedControls.forEach((x) => {
      this.app.webMap.removeControl(x);
    });
    this._installedControls = [];
  }

  private async initControls() {
    this.periodsPanelControl = new PeriodPanelControl({
      webMap: this.app.webMap,
    });
    this.yearsStatPanelControl = new YearsStatPanelControl({
      webMap: this.app.webMap,
    });

    this.legendPanel = new LegendPanelControl({
      // colors: this.options.lineColor,
      colors: this.app.options.lineColorLegend,
    });

    this._socialLinksPanel = getSocialLinksPanel();
    this._switchersPanel = getSwitcherPanelControl(this);
    this._homeBtnPanel = getHomeBtnControl(this);
    this._zoomControl = this.app.webMap.getControl('ZOOM', {
      zoomInTitle: 'Приблизить',
      zoomOutTitle: 'Отдалить',
    });
    this._attributions = this.app.webMap.getControl('ATTRIBUTION');

    this._mobileTogglePanels = [
      this.periodsPanelControl,
      this.yearsStatPanelControl,
    ];
    if (this.legendPanel) {
      this._mobileTogglePanels.push(this.legendPanel);
      this.legendPanel.emitter.on('change', (colors) =>
        this.app.updateLayersColor()
      );
    }

    this._mobileTogglePanels.forEach((x) => x.show());
    this._loadingControl = new TimeMapLoadingControl(this.app.timeMap);
  }

  private async _addControl(
    control: any,
    position: ControlPositions,
    options?: any
  ) {
    const addedControl = await this.app.webMap.addControl(
      control,
      position,
      options
    );
    if (addedControl) {
      this._installedControls.push(addedControl);
    }
  }

  private async _addFullSizeControls() {
    await this._addControl(this.legendPanel, 'top-left');

    await this._addControl(this._switchersPanel, 'top-right');

    await this._addControl(this.periodsPanelControl, 'top-right');
    await this._addControl(this.yearsStatPanelControl, 'top-right');

    await this._addControl(this._attributions, 'bottom-left');
    await this._addControl(this._socialLinksPanel, 'bottom-left');
    await this._addControl(this._homeBtnPanel, 'bottom-left');
    await this._addControl(this._zoomControl, 'bottom-left');

    this._manualControlMove();
  }

  private async _addMobileControls() {
    await this._addControl(this._loadingControl, 'top-right');

    await this._addControl(this._switchersPanel, 'top-left');

    await this._addControl(this.legendPanel, 'bottom-right');
    await this._addControl(this.yearsStatPanelControl, 'bottom-right');
    await this._addControl(this.periodsPanelControl, 'bottom-right');

    await this._addControl(this._zoomControl, 'top-left');
    await this._addControl(this._homeBtnPanel, 'top-left');

    await this._addControl(this._attributions, 'bottom-left');
    await this._addControl(this._socialLinksPanel, 'bottom-left');

    this._manualControlMove();
  }

  private _manualControlMove() {
    const container = this.app.webMap.getContainer();
    if (container) {
      const attrContainer = container.querySelector(
        '.mapboxgl-ctrl.mapboxgl-ctrl-attrib'
      );
      if (attrContainer && attrContainer.parentNode) {
        attrContainer.parentNode.removeChild(attrContainer);
        container.appendChild(attrContainer);
      }
    }
  }

  private checkMobile() {
    this.isMobile =
      window.innerWidth <= this._mobSizeConst.width ||
      window.innerHeight <= this._mobSizeConst.height;
    return this.isMobile;
  }

  private _updateMapEvents() {
    if (this.isMobile) {
      this._addMapClickEvent();
    } else {
      this._removeMapClickEvent();
    }
  }

  private _updateTimeSlider() {
    // remove intermediate pips from slider on mobile
    const pipsNodes = document.querySelectorAll<HTMLElement>(
      '.noUi-marker.noUi-marker-horizontal.noUi-marker-normal'
    );
    let hideElements: HTMLElement[] = Array.from(pipsNodes);

    const labelNodes = document.querySelectorAll<HTMLElement>(
      '.noUi-value.noUi-value-horizontal.noUi-value-large'
    );
    // leave labels for minimum and maximum
    // no check for second and second last signature, admit that they are always
    hideElements = hideElements.concat([
      labelNodes[0 + 1],
      labelNodes[labelNodes.length - 2],
    ]);

    if (window.innerWidth <= this._mobSizeConst.width) {
      hideElements.forEach((x) => {
        x.style.visibility = 'hidden';
      });
    } else {
      hideElements.forEach((x) => {
        x.style.visibility = '';
      });
    }
  }

  private _onPanelToggle(panel: Panel) {
    this._removePanelToggleListener();
    const isHide = panel.isHide;
    this._hideAllPanels();
    if (!isHide) {
      panel.show();
    }
    this._addPanelToggleListeners();
  }

  private _addPanelToggleListeners() {
    this._removePanelToggleListener();
    this._togglerEvents = [];
    this._mobileTogglePanels.forEach((x) => {
      const toggler = () => this._onPanelToggle(x);
      this._togglerEvents.push([x, toggler]);
      x.emitter.on('toggle', toggler);
    });
  }

  private _removePanelToggleListener() {
    this._mobileTogglePanels.forEach((x) => {
      const mem = this._togglerEvents.find((y) => y[0] === x);
      if (mem) {
        x.emitter.removeListener('toggle', mem[1]);
      }
    });
  }

  private _onMapClick() {
    if (this.isMobile) {
      this._hideAllPanels();
    }
  }

  private _onWindowResize() {
    const isMobile = this.isMobile;
    this.checkMobile();
    if (isMobile !== this.isMobile) {
      this.updateControls();
    }
    this._updateTimeSlider();
    this._updateMapEvents();
  }

  private _addEventsListeners() {
    window.addEventListener('resize', () => this._onWindowResize(), false);
  }

  private _hideAllPanels() {
    this._openPanels = [];
    this._mobileTogglePanels.forEach((x) => {
      if (!x.isHide) {
        this._openPanels.push(x);
      }
      x.hide();
    });
  }

  private _addMapClickEvent() {
    this.app.webMap.emitter.on('click', this._eventBindings.onMapClick);
  }

  private _removeMapClickEvent() {
    this.app.webMap.emitter.removeListener(
      'click',
      this._eventBindings.onMapClick
    );
  }
}
