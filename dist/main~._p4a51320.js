(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main~._p"],{

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/*! exports provided: name, version, description, main, scripts, author, license, dependencies, devDependencies, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"name\":\"russia-history\",\"version\":\"4.0.2\",\"description\":\"\",\"main\":\"src/app.js\",\"scripts\":{\"start\":\"webpack-dev-server --progress --hot --open\",\"build\":\"webpack --progress\",\"watch\":\"rimraf ./dist && npm run build -- --watch\",\"dev\":\"rimraf ./dist && npm run build\",\"data\":\"node ./scripts/generator.js\",\"prod\":\"rimraf ./dist && npm run build -- --mode=production\",\"docker\":\"docker build -t registry.nextgis.com/runivers:latest . && docker push registry.nextgis.com/runivers:latest\"},\"author\":\"\",\"license\":\"ISC\",\"dependencies\":{\"@nextgis/dialog\":\"^0.32.0\",\"@nextgis/mapboxgl-map-adapter\":\"^0.32.0\",\"@nextgis/ngw-connector\":\"^0.32.0\",\"@nextgis/qms-kit\":\"^0.32.0\",\"@nextgis/url-runtime-params\":\"^0.32.0\",\"@nextgis/webmap\":\"^0.32.0\",\"@types/color\":\"^3.0.1\",\"@types/node\":\"^14.0.19\",\"@types/proj4\":\"^2.5.0\",\"color\":\"^3.1.2\",\"core-js\":\"^3.6.5\",\"dialog-polyfill\":\"^0.5.1\",\"mapbox-gl\":\"^1.11.1\",\"nouislider\":\"14.6.0\",\"proj4\":\"^2.6.2\",\"regenerator\":\"^0.14.5\",\"reset-css\":\"^5.0.1\",\"wnumb\":\"^1.2.0\"},\"devDependencies\":{\"@nextgis/eslint-config\":\"^0.32.0\",\"@types/geojson\":\"^7946.0.7\",\"@types/mapbox-gl\":\"^1.11.1\",\"@types/nouislider\":\"^9.0.7\",\"autoprefixer\":\"^9.8.4\",\"babel-loader\":\"^8.1.0\",\"copy-webpack-plugin\":\"^6.0.3\",\"css-loader\":\"^3.6.0\",\"csv-loader\":\"^3.0.3\",\"eslint\":\"^7.4.0\",\"eslint-loader\":\"^4.0.2\",\"favicons-webpack-plugin\":\"3.0.1\",\"file-loader\":\"^6.0.0\",\"html-webpack-plugin\":\"^4.3.0\",\"image-webpack-loader\":\"^6.0.0\",\"mini-css-extract-plugin\":\"^0.9.0\",\"minimist\":\"^1.2.5\",\"node-sass\":\"^4.14.1\",\"papaparse\":\"^5.2.0\",\"postcss-loader\":\"^3.0.0\",\"precss\":\"^4.0.0\",\"sass-loader\":\"^9.0.2\",\"style-loader\":\"^1.2.1\",\"ts-loader\":\"^7.0.5\",\"typescript\":\"^3.9.6\",\"url-loader\":\"^4.1.0\",\"webpack\":\"^4.43.0\",\"webpack-cli\":\"^3.3.12\",\"webpack-dev-server\":\"^3.11.0\"}}");

/***/ }),

/***/ "./src/App.css":
/*!*********************!*\
  !*** ./src/App.css ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/App.ts":
/*!********************!*\
  !*** ./src/App.ts ***!
  \********************/
/*! exports provided: App */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "App", function() { return App; });
/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./App.css */ "./src/App.css");
/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_App_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _nextgis_webmap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextgis/webmap */ "./nextgis_frontend/packages/webmap/src/index.ts");
/* harmony import */ var _nextgis_qms_kit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextgis/qms-kit */ "./nextgis_frontend/packages/qms-kit/src/index.ts");
/* harmony import */ var _nextgis_mapboxgl_map_adapter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nextgis/mapboxgl-map-adapter */ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/index.ts");
/* harmony import */ var _nextgis_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nextgis/utils */ "./nextgis_frontend/packages/utils/src/index.ts");
/* harmony import */ var _components_SliderControl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/SliderControl */ "./src/components/SliderControl.ts");
/* harmony import */ var _services_GetLayersService__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./services/GetLayersService */ "./src/services/GetLayersService.ts");
/* harmony import */ var _services_GetPointsService__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./services/GetPointsService */ "./src/services/GetPointsService.ts");
/* harmony import */ var _components_Links_Links__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/Links/Links */ "./src/components/Links/Links.ts");
/* harmony import */ var _controls_Controls__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./controls/Controls */ "./src/controls/Controls.ts");
/* harmony import */ var _TimeMap_TimeMap__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./TimeMap/TimeMap */ "./src/TimeMap/TimeMap.ts");
/* harmony import */ var _services_UrlParams__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./services/UrlParams */ "./src/services/UrlParams.ts");
/* harmony import */ var _layers_MarkerLayer__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./layers/MarkerLayer */ "./src/layers/MarkerLayer.ts");
/* harmony import */ var _layers_CitiesLayer__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./layers/CitiesLayer */ "./src/layers/CitiesLayer.ts");
/* harmony import */ var _layers_LinesLayer__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./layers/LinesLayer */ "./src/layers/LinesLayer.ts");
/* harmony import */ var _layers_BoundaryLayer__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./layers/BoundaryLayer */ "./src/layers/BoundaryLayer.ts");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

















var App = (function () {
    function App(options) {
        var _this = this;
        this.options = {
            target: '#app',
            style: {
                transition: {
                    duration: 0,
                    delay: 0,
                },
                glyphs: location.origin + location.pathname + 'font/{fontstack}/{range}.pbf',
            },
        };
        this.urlParams = _services_UrlParams__WEBPACK_IMPORTED_MODULE_12__["urlParams"];
        this.emitter = new events__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.statusLayers = {
            base: _layers_BoundaryLayer__WEBPACK_IMPORTED_MODULE_16__["BoundaryLayer"],
            cities: _layers_CitiesLayer__WEBPACK_IMPORTED_MODULE_14__["CitiesLayer"],
            lines: _layers_LinesLayer__WEBPACK_IMPORTED_MODULE_15__["LinesLayer"],
            status1: _layers_BoundaryLayer__WEBPACK_IMPORTED_MODULE_16__["BoundaryLayer"],
            status2: _layers_BoundaryLayer__WEBPACK_IMPORTED_MODULE_16__["BoundaryLayer"],
        };
        this.options = __assign(__assign({}, this.options), options);
        this._markers = new _layers_MarkerLayer__WEBPACK_IMPORTED_MODULE_13__["MarkerLayer"](this);
        var urlYear = this.urlParams.get('year');
        if (urlYear) {
            this.options.currentYear = parseInt(urlYear, 10);
        }
        var _a = this.options, fromYear = _a.fromYear, currentYear = _a.currentYear;
        if (fromYear && currentYear && currentYear < fromYear) {
            this.options.currentYear = fromYear;
        }
        this.updateDataByYear = Object(_nextgis_utils__WEBPACK_IMPORTED_MODULE_5__["debounce"])(function (year) { return _this._updateDataByYear(year); }, 300);
        this.createWebMap().then(function () {
            _this._buildApp();
        });
    }
    App.prototype.createWebMap = function () {
        return __awaiter(this, void 0, void 0, function () {
            var options, webMap;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = __assign({}, this.options);
                        webMap = new _nextgis_webmap__WEBPACK_IMPORTED_MODULE_2__["default"]({
                            mapAdapter: new _nextgis_mapboxgl_map_adapter__WEBPACK_IMPORTED_MODULE_4__["default"](),
                            starterKits: [new _nextgis_qms_kit__WEBPACK_IMPORTED_MODULE_3__["default"]()],
                        });
                        return [4, webMap.create(options)];
                    case 1:
                        _a.sent();
                        this.timeMap = new _TimeMap_TimeMap__WEBPACK_IMPORTED_MODULE_11__["TimeMap"](webMap, {
                            fromYear: this.options.fromYear,
                            getStatusLayer: function (config) { return _this._getStatusLayer(config); },
                            onStepReady: function (year) { return _this.updateDataByYear(year); },
                            onLayerUpdate: function (year) { return _this.updateDataByYear(year); },
                            onReset: function () { return _this.onReset(); },
                        });
                        this.timeMap.emitter.once('loading:finish', function () {
                            _this._setSelectedLayerFromUrl();
                        });
                        if (this.options.currentYear) {
                            this.timeMap.currentYear = this.options.currentYear;
                        }
                        webMap.addBaseLayer('QMS', {
                            id: 'baselayer',
                            qmsId: 2550,
                            visibility: true,
                        });
                        this.webMap = webMap;
                        return [2, webMap];
                }
            });
        });
    };
    App.prototype.onReset = function () {
        if (this._markers) {
            this.updateDataByYear(this.timeMap.currentYear);
        }
    };
    App.prototype.getTimeStop = function (year) {
        var stop = this.options.timeStops.find(function (x) { return year < x.toYear; });
        return stop ? stop.name : '';
    };
    App.prototype.updateLayersColor = function () {
    };
    App.prototype._updateDataByYear = function (year) {
        var pointId = this._markers._getPointIdByYear(year);
        this._markers.updatePoint(pointId);
        var areaStat = this._findAreaStatByYear(year);
        this._updatePeriodBlockByYear(year, areaStat);
        this._updateYearStatBlockByYear(year, areaStat);
        this.urlParams.set('year', String(year));
    };
    App.prototype._setSelectedLayerFromUrl = function () {
        var id = _services_UrlParams__WEBPACK_IMPORTED_MODULE_12__["urlParams"].get('id');
        if (id) {
            var group = this.timeMap.getTimeGroup('base');
            if (group) {
                group.select(id);
            }
        }
    };
    App.prototype._buildApp = function () {
        var _this = this;
        Object(_services_GetLayersService__WEBPACK_IMPORTED_MODULE_7__["getLayers"])(function (data) {
            _this.timeMap.buildTimeMap(data);
            _this.slider = _this._createSlider();
            _this._createHeader();
            _this._createAffiliatedLogos();
            _this.controls = new _controls_Controls__WEBPACK_IMPORTED_MODULE_10__["Controls"](_this);
            _this.controls.updateControls();
            _this.webMap.onMapLoad(function () {
                _this.timeMap.updateByYear(_this.timeMap.currentYear);
            });
            _this.emitter.emit('build');
            _this._addEventsListeners();
        });
        Object(_services_GetPointsService__WEBPACK_IMPORTED_MODULE_8__["getPoints"])().then(function (points) {
            _this._markers.setPoints(points);
        });
    };
    App.prototype._getStatusLayer = function (config) {
        var options = {
            name: config.name,
            baseUrl: this.options.baseUrl,
            opacity: config.opacity,
            manualOpacity: true,
            filterIdField: 'fid',
        };
        var StatusLayer = this
            .statusLayers[config.name];
        if (StatusLayer) {
            var statusLayer = new StatusLayer(this, options);
            return statusLayer;
        }
    };
    App.prototype._createSlider = function () {
        var _this = this;
        var stepReady = function (year, callback, previous) {
            _this.timeMap._stepReady(year, callback);
        };
        var slider = new _components_SliderControl__WEBPACK_IMPORTED_MODULE_6__["SliderControl"]({
            type: 'range',
            min: this.timeMap._minYear,
            max: this.timeMap._maxYear,
            step: 1,
            animationStep: this.options.animationStep || 1,
            value: this.timeMap.currentYear,
            animationDelay: this.options.animationDelay || 100,
            stepReady: stepReady,
        });
        slider.emitter.on('change', function (year) {
            if (year !== _this.timeMap.currentYear && year !== _this.timeMap.nextYear) {
                _this.timeMap.currentYear = year;
                _this.timeMap.updateByYear(year);
            }
        });
        var container = this.webMap.mapAdapter.getContainer();
        if (container) {
            container.appendChild(slider.onAdd(this.webMap));
        }
        return slider;
    };
    App.prototype._createHeader = function () {
        var header = document.createElement('div');
        header.className = 'font-effect-shadow-multiple app-header';
        var headerText = document.createElement('span');
        headerText.innerHTML = "\n      \u0413\u0440\u0430\u043D\u0438\u0446\u044B \u0420\u043E\u0441\u0441\u0438\u0438 " + this.timeMap._minYear + "-" + this.timeMap._maxYear + " \u0433\u0433.";
        header.appendChild(headerText);
        header.appendChild(Object(_components_Links_Links__WEBPACK_IMPORTED_MODULE_9__["getAboutProjectLink"])(this));
        var mapContainer = this.webMap.mapAdapter.getContainer();
        if (mapContainer) {
            mapContainer.appendChild(header);
        }
        return header;
    };
    App.prototype._createAffiliatedLogos = function () {
        var logos = document.createElement('div');
        logos.className = 'app-affiliated-logos';
        logos.appendChild(Object(_components_Links_Links__WEBPACK_IMPORTED_MODULE_9__["getAffiliatedLinks"])(this));
        var mapContainer = this.webMap.mapAdapter.getContainer();
        if (mapContainer) {
            mapContainer.appendChild(logos);
        }
        return logos;
    };
    App.prototype._updatePeriodBlockByYear = function (year, areaStat) {
        var period = this._findPeriodByYear(year);
        if (period && this.controls.periodsPanelControl) {
            this.controls.periodsPanelControl.updatePeriod(period, areaStat);
        }
    };
    App.prototype._findPeriodByYear = function (year) {
        var periods = this.options.periods || [];
        var period = periods.find(function (x) {
            var finded = year >= x.years_from;
            if (finded && x.years_to) {
                finded = year <= x.years_to;
            }
            return finded;
        });
        return period;
    };
    App.prototype._updateYearStatBlockByYear = function (year, areaStat) {
        if (this.controls.yearsStatPanelControl) {
            var yearStat = this._findYearStatsByYear(year);
            this.controls.yearsStatPanelControl.updateYearStats(yearStat, areaStat);
        }
    };
    App.prototype._findAreaStatByYear = function (year) {
        if (this.options.areaStat) {
            return this.options.areaStat.find(function (x) { return x.year === year; });
        }
    };
    App.prototype._findYearStatsByYear = function (year) {
        year = Number(year);
        var yearsStat = this.options.yearsStat || [];
        var yearStat = yearsStat.filter(function (x) {
            return year === x.year;
        });
        return yearStat;
    };
    App.prototype._addEventsListeners = function () {
        var _this = this;
        if (this.controls.yearsStatPanelControl) {
            this.controls.yearsStatPanelControl.emitter.on('update', function (_a) {
                var yearStat = _a.yearStat;
                _this._markers.updateActiveMarker(yearStat);
            });
        }
        this.webMap.emitter.on('preclick', function () {
            _this.timeMap.unselect();
        });
    };
    return App;
}());



/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvQXBwLmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvQXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQW1CO0FBR21CO0FBRVM7QUFDVDtBQUNzQjtBQUNsQjtBQUVpQjtBQUNIO0FBQ0E7QUFJdEI7QUFJYTtBQUNIO0FBR0s7QUFDRTtBQUNBO0FBQ0Y7QUFDTTtBQUV2RDtJQW9DRSxhQUFZLE9BQW1CO1FBQS9CLGlCQW9CQztRQXZERCxZQUFPLEdBQWU7WUFDcEIsTUFBTSxFQUFFLE1BQU07WUFDZCxLQUFLLEVBQUU7Z0JBQ0wsVUFBVSxFQUFFO29CQUNWLFFBQVEsRUFBRSxDQUFDO29CQUNYLEtBQUssRUFBRSxDQUFDO2lCQUNUO2dCQUNELE1BQU0sRUFDSixRQUFRLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxRQUFRLEdBQUcsOEJBQThCO2FBQ3ZFO1NBQ1ksQ0FBQztRQUtoQixjQUFTLEdBQUcsOERBQVMsQ0FBQztRQUV0QixZQUFPLEdBQUcsSUFBSSxtREFBWSxFQUFFLENBQUM7UUFNckIsaUJBQVksR0FFaEI7WUFDRixJQUFJLEVBQUUsb0VBQWE7WUFDbkIsTUFBTSxFQUFFLGdFQUFXO1lBQ25CLEtBQUssRUFBRSw4REFBVTtZQUNqQixPQUFPLEVBQUUsb0VBQWE7WUFDdEIsT0FBTyxFQUFFLG9FQUFhO1NBQ3ZCLENBQUM7UUFLQSxJQUFJLENBQUMsT0FBTyx5QkFBUSxJQUFJLENBQUMsT0FBTyxHQUFLLE9BQU8sQ0FBRSxDQUFDO1FBQy9DLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxnRUFBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFD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dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiIsImltcG9ydCAnLi9BcHAuY3NzJztcblxuaW1wb3J0IHsgTWFwIH0gZnJvbSAnbWFwYm94LWdsJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbmltcG9ydCBXZWJNYXAsIHsgVHlwZSB9IGZyb20gJ0BuZXh0Z2lzL3dlYm1hcCc7XG5pbXBvcnQgUW1zS2l0IGZyb20gJ0BuZXh0Z2lzL3Ftcy1raXQnO1xuaW1wb3J0IE1hcGJveGdsQWRhcHRlciBmcm9tICdAbmV4dGdpcy9tYXBib3hnbC1tYXAtYWRhcHRlcic7XG5pbXBvcnQgeyBkZWJvdW5jZSB9IGZyb20gJ0BuZXh0Z2lzL3V0aWxzJztcblxuaW1wb3J0IHsgU2xpZGVyQ29udHJvbCB9IGZyb20gJy4vY29tcG9uZW50cy9TbGlkZXJDb250cm9sJztcbmltcG9ydCB7IGdldExheWVycyB9IGZyb20gJy4vc2VydmljZXMvR2V0TGF5ZXJzU2VydmljZSc7XG5pbXBvcnQgeyBnZXRQb2ludHMgfSBmcm9tICcuL3NlcnZpY2VzL0dldFBvaW50c1NlcnZpY2UnO1xuaW1wb3J0IHtcbiAgZ2V0QWJvdXRQcm9qZWN0TGluayxcbiAgZ2V0QWZmaWxpYXRlZExpbmtzLFxufSBmcm9tICcuL2NvbXBvbmVudHMvTGlua3MvTGlua3MnO1xuXG5pbXBvcnQgeyBBcHBPcHRpb25zLCBBcmVhU3RhdCwgTGF5ZXJzR3JvdXAgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG5pbXBvcnQgeyBDb250cm9scyB9IGZyb20gJy4vY29udHJvbHMvQ29udHJvbHMnO1xuaW1wb3J0IHsgVGltZU1hcCB9IGZyb20gJy4vVGltZU1hcC9UaW1lTWFwJztcbmltcG9ydCB7IFRpbWVMYXllcnNHcm91cE9wdGlvbnMgfSBmcm9tICcuL1RpbWVNYXAvVGltZUdyb3VwJztcblxuaW1wb3J0IHsgdXJsUGFyYW1zIH0gZnJvbSAnLi9zZXJ2aWNlcy9VcmxQYXJhbXMnO1xuaW1wb3J0IHsgTWFya2VyTGF5ZXIgfSBmcm9tICcuL2xheWVycy9NYXJrZXJMYXllcic7XG5pbXBvcnQgeyBDaXRpZXNMYXllciB9IGZyb20gJy4vbGF5ZXJzL0NpdGllc0xheWVyJztcbmltcG9ydCB7IExpbmVzTGF5ZXIgfSBmcm9tICcuL2xheWVycy9MaW5lc0xheWVyJztcbmltcG9ydCB7IEJvdW5kYXJ5TGF5ZXIgfSBmcm9tICcuL2xheWVycy9Cb3VuZGFyeUxheWVyJztcblxuZXhwb3J0IGNsYXNzIEFwcCB7XG4gIG9wdGlvbnM6IEFwcE9wdGlvbnMgPSB7XG4gICAgdGFyZ2V0OiAnI2FwcCcsXG4gICAgc3R5bGU6IHtcbiAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgZHVyYXRpb246IDAsXG4gICAgICAgIGRlbGF5OiAwLFxuICAgICAgfSxcbiAgICAgIGdseXBoczpcbiAgICAgICAgbG9jYXRpb24ub3JpZ2luICsgbG9jYXRpb24ucGF0aG5hbWUgKyAnZm9udC97Zm9udHN0YWNrfS97cmFuZ2V9LnBiZicsXG4gICAgfSxcbiAgfSBhcyBBcHBPcHRpb25zO1xuICBjb250cm9scyE6IENvbnRyb2xzO1xuICBzbGlkZXIhOiBTbGlkZXJDb250cm9sO1xuICB3ZWJNYXAhOiBXZWJNYXA8TWFwLCBzdHJpbmdbXT47XG5cbiAgdXJsUGFyYW1zID0gdXJsUGFyYW1zO1xuXG4gIGVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgdGltZU1hcCE6IFRpbWVNYXA7XG5cbiAgdXBkYXRlRGF0YUJ5WWVhcjogKHllYXI6IG51bWJlcikgPT4gdm9pZDtcblxuICBwcml2YXRlIHN0YXR1c0xheWVyczoge1xuICAgIFtncm91cE5hbWU6IHN0cmluZ106IFR5cGU8VGltZUxheWVyc0dyb3VwT3B0aW9ucz47XG4gIH0gPSB7XG4gICAgYmFzZTogQm91bmRhcnlMYXllcixcbiAgICBjaXRpZXM6IENpdGllc0xheWVyLFxuICAgIGxpbmVzOiBMaW5lc0xheWVyLFxuICAgIHN0YXR1czE6IEJvdW5kYXJ5TGF5ZXIsXG4gICAgc3RhdHVzMjogQm91bmRhcnlMYXllcixcbiAgfTtcblxuICBwcml2YXRlIF9tYXJrZXJzOiBNYXJrZXJMYXllcjtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBBcHBPcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0geyAuLi50aGlzLm9wdGlvbnMsIC4uLm9wdGlvbnMgfTtcbiAgICB0aGlzLl9tYXJrZXJzID0gbmV3IE1hcmtlckxheWVyKHRoaXMpO1xuICAgIGNvbnN0IHVybFllYXIgPSB0aGlzLnVybFBhcmFtcy5nZXQoJ3llYXInKTtcbiAgICBpZiAodXJsWWVhcikge1xuICAgICAgdGhpcy5vcHRpb25zLmN1cnJlbnRZZWFyID0gcGFyc2VJbnQodXJsWWVhciwgMTApO1xuICAgIH1cblxuICAgIGNvbnN0IHsgZnJvbVllYXIsIGN1cnJlbnRZZWFyIH0gPSB0aGlzLm9wdGlvbnM7XG5cbiAgICBpZiAoZnJvbVllYXIgJiYgY3VycmVudFllYXIgJiYgY3VycmVudFllYXIgPCBmcm9tWWVhcikge1xuICAgICAgdGhpcy5vcHRpb25zLmN1cnJlbnRZZWFyID0gZnJvbVllYXI7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlRGF0YUJ5WWVhciA9IGRlYm91bmNlKFxuICAgICAgKHllYXI6IG51bWJlcikgPT4gdGhpcy5fdXBkYXRlRGF0YUJ5WWVhcih5ZWFyKSxcbiAgICAgIDMwMFxuICAgICk7XG4gICAgdGhpcy5jcmVhdGVXZWJNYXAoKS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuX2J1aWxkQXBwKCk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBjcmVhdGVXZWJNYXAoKTogUHJvbWlzZTxXZWJNYXA+IHtcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi50aGlzLm9wdGlvbnMgfTtcbiAgICBjb25zdCB3ZWJNYXAgPSBuZXcgV2ViTWFwKHtcbiAgICAgIG1hcEFkYXB0ZXI6IG5ldyBNYXBib3hnbEFkYXB0ZXIoKSxcbiAgICAgIHN0YXJ0ZXJLaXRzOiBbbmV3IFFtc0tpdCgpXSxcbiAgICB9KTtcbiAgICBhd2FpdCB3ZWJNYXAuY3JlYXRlKG9wdGlvbnMpO1xuICAgIHRoaXMudGltZU1hcCA9IG5ldyBUaW1lTWFwKHdlYk1hcCwge1xuICAgICAgZnJvbVllYXI6IHRoaXMub3B0aW9ucy5mcm9tWWVhcixcbiAgICAgIGdldFN0YXR1c0xheWVyOiAoY29uZmlnOiBMYXllcnNHcm91cCkgPT4gdGhpcy5fZ2V0U3RhdHVzTGF5ZXIoY29uZmlnKSxcbiAgICAgIG9uU3RlcFJlYWR5OiAoeWVhcjogbnVtYmVyKSA9PiB0aGlzLnVwZGF0ZURhdGFCeVllYXIoeWVhciksXG4gICAgICBvbkxheWVyVXBkYXRlOiAoeWVhcjogbnVtYmVyKSA9PiB0aGlzLnVwZGF0ZURhdGFCeVllYXIoeWVhciksXG4gICAgICBvblJlc2V0OiAoKSA9PiB0aGlzLm9uUmVzZXQoKSxcbiAgICB9KTtcbiAgICB0aGlzLnRpbWVNYXAuZW1pdHRlci5vbmNlKCdsb2FkaW5nOmZpbmlzaCcsICgpID0+IHtcbiAgICAgIHRoaXMuX3NldFNlbGVjdGVkTGF5ZXJGcm9tVXJsKCk7XG4gICAgfSk7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5jdXJyZW50WWVhcikge1xuICAgICAgdGhpcy50aW1lTWFwLmN1cnJlbnRZZWFyID0gdGhpcy5vcHRpb25zLmN1cnJlbnRZZWFyO1xuICAgIH1cbiAgICB3ZWJNYXAuYWRkQmFzZUxheWVyKCdRTVMnLCB7XG4gICAgICBpZDogJ2Jhc2VsYXllcicsXG4gICAgICBxbXNJZDogMjU1MCxcbiAgICAgIHZpc2liaWxpdHk6IHRydWUsXG4gICAgfSk7XG4gICAgdGhpcy53ZWJNYXAgPSB3ZWJNYXA7XG4gICAgcmV0dXJuIHdlYk1hcDtcbiAgfVxuXG4gIG9uUmVzZXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX21hcmtlcnMpIHtcbiAgICAgIHRoaXMudXBkYXRlRGF0YUJ5WWVhcih0aGlzLnRpbWVNYXAuY3VycmVudFllYXIpO1xuICAgIH1cbiAgfVxuXG4gIGdldFRpbWVTdG9wKHllYXI6IG51bWJlcik6IHN0cmluZyB7XG4gICAgY29uc3Qgc3RvcCA9IHRoaXMub3B0aW9ucy50aW1lU3RvcHMuZmluZCgoeCkgPT4geWVhciA8IHgudG9ZZWFyKTtcbiAgICByZXR1cm4gc3RvcCA/IHN0b3AubmFtZSA6ICcnO1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJzQ29sb3IoKTogdm9pZCB7XG4gICAgLy8gaWdub3JlXG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVEYXRhQnlZZWFyKHllYXI6IG51bWJlcikge1xuICAgIGNvbnN0IHBvaW50SWQgPSB0aGlzLl9tYXJrZXJzLl9nZXRQb2ludElkQnlZZWFyKHllYXIpO1xuXG4gICAgdGhpcy5fbWFya2Vycy51cGRhdGVQb2ludChwb2ludElkKTtcblxuICAgIGNvbnN0IGFyZWFTdGF0ID0gdGhpcy5fZmluZEFyZWFTdGF0QnlZZWFyKHllYXIpO1xuICAgIHRoaXMuX3VwZGF0ZVBlcmlvZEJsb2NrQnlZZWFyKHllYXIsIGFyZWFTdGF0KTtcbiAgICB0aGlzLl91cGRhdGVZZWFyU3RhdEJsb2NrQnlZZWFyKHllYXIsIGFyZWFTdGF0KTtcblxuICAgIHRoaXMudXJsUGFyYW1zLnNldCgneWVhcicsIFN0cmluZyh5ZWFyKSk7XG4gIH1cblxuICBwcml2YXRlIF9zZXRTZWxlY3RlZExheWVyRnJvbVVybCgpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhcmFtcy5nZXQoJ2lkJyk7XG4gICAgaWYgKGlkKSB7XG4gICAgICBjb25zdCBncm91cCA9IHRoaXMudGltZU1hcC5nZXRUaW1lR3JvdXAoJ2Jhc2UnKTtcbiAgICAgIGlmIChncm91cCkge1xuICAgICAgICBncm91cC5zZWxlY3QoaWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2J1aWxkQXBwKCkge1xuICAgIGdldExheWVycygoZGF0YSkgPT4ge1xuICAgICAgdGhpcy50aW1lTWFwLmJ1aWxkVGltZU1hcChkYXRhKTtcblxuICAgICAgdGhpcy5zbGlkZXIgPSB0aGlzLl9jcmVhdGVTbGlkZXIoKTtcblxuICAgICAgdGhpcy5fY3JlYXRlSGVhZGVyKCk7XG4gICAgICB0aGlzLl9jcmVhdGVBZmZpbGlhdGVkTG9nb3MoKTtcbiAgICAgIHRoaXMuY29udHJvbHMgPSBuZXcgQ29udHJvbHModGhpcyk7XG4gICAgICB0aGlzLmNvbnRyb2xzLnVwZGF0ZUNvbnRyb2xzKCk7XG5cbiAgICAgIHRoaXMud2ViTWFwLm9uTWFwTG9hZCgoKSA9PiB7XG4gICAgICAgIHRoaXMudGltZU1hcC51cGRhdGVCeVllYXIodGhpcy50aW1lTWFwLmN1cnJlbnRZZWFyKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2J1aWxkJyk7XG4gICAgICB0aGlzLl9hZGRFdmVudHNMaXN0ZW5lcnMoKTtcbiAgICB9KTtcbiAgICBnZXRQb2ludHMoKS50aGVuKChwb2ludHMpID0+IHtcbiAgICAgIHRoaXMuX21hcmtlcnMuc2V0UG9pbnRzKHBvaW50cyk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRTdGF0dXNMYXllcihjb25maWc6IExheWVyc0dyb3VwKSB7XG4gICAgY29uc3Qgb3B0aW9uczogUGFydGlhbDxUaW1lTGF5ZXJzR3JvdXBPcHRpb25zPiA9IHtcbiAgICAgIG5hbWU6IGNvbmZpZy5uYW1lLFxuICAgICAgYmFzZVVybDogdGhpcy5vcHRpb25zLmJhc2VVcmwsXG4gICAgICBvcGFjaXR5OiBjb25maWcub3BhY2l0eSxcbiAgICAgIG1hbnVhbE9wYWNpdHk6IHRydWUsXG4gICAgICBmaWx0ZXJJZEZpZWxkOiAnZmlkJyxcbiAgICB9O1xuICAgIGNvbnN0IFN0YXR1c0xheWVyOiBUeXBlPFRpbWVMYXllcnNHcm91cE9wdGlvbnM+IHwgdW5kZWZpbmVkID0gdGhpc1xuICAgICAgLnN0YXR1c0xheWVyc1tjb25maWcubmFtZV07XG4gICAgaWYgKFN0YXR1c0xheWVyKSB7XG4gICAgICBjb25zdCBzdGF0dXNMYXllciA9IG5ldyBTdGF0dXNMYXllcih0aGlzLCBvcHRpb25zKTtcbiAgICAgIHJldHVybiBzdGF0dXNMYXllcjtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVTbGlkZXIoKSB7XG4gICAgLy8gdXNlZCBmb3IgYW5pbWF0aW9uIHRvIHdhaXQgZnVsbCBsYXllciBsb2FkaW5nXG4gICAgY29uc3Qgc3RlcFJlYWR5ID0gKFxuICAgICAgeWVhcjogbnVtYmVyLFxuICAgICAgY2FsbGJhY2s6ICh2YWx1ZTogbnVtYmVyKSA9PiB2b2lkLFxuICAgICAgcHJldmlvdXM6IGJvb2xlYW5cbiAgICApID0+IHtcbiAgICAgIHRoaXMudGltZU1hcC5fc3RlcFJlYWR5KHllYXIsIGNhbGxiYWNrKTtcbiAgICB9O1xuICAgIGNvbnN0IHNsaWRlciA9IG5ldyBTbGlkZXJDb250cm9sKHtcbiAgICAgIHR5cGU6ICdyYW5nZScsXG4gICAgICBtaW46IHRoaXMudGltZU1hcC5fbWluWWVhcixcbiAgICAgIG1heDogdGhpcy50aW1lTWFwLl9tYXhZZWFyLFxuICAgICAgc3RlcDogMSxcbiAgICAgIGFuaW1hdGlvblN0ZXA6IHRoaXMub3B0aW9ucy5hbmltYXRpb25TdGVwIHx8IDEsXG4gICAgICB2YWx1ZTogdGhpcy50aW1lTWFwLmN1cnJlbnRZZWFyLFxuICAgICAgYW5pbWF0aW9uRGVsYXk6IHRoaXMub3B0aW9ucy5hbmltYXRpb25EZWxheSB8fCAxMDAsXG4gICAgICBzdGVwUmVhZHksXG4gICAgfSk7XG4gICAgc2xpZGVyLmVtaXR0ZXIub24oJ2NoYW5nZScsICh5ZWFyOiBudW1iZXIpID0+IHtcbiAgICAgIC8vIG1heSBiZSB1cGRhdGVkIGluIF9zdGVwUmVhZHkgbWV0aG9kXG4gICAgICBpZiAoeWVhciAhPT0gdGhpcy50aW1lTWFwLmN1cnJlbnRZZWFyICYmIHllYXIgIT09IHRoaXMudGltZU1hcC5uZXh0WWVhcikge1xuICAgICAgICB0aGlzLnRpbWVNYXAuY3VycmVudFllYXIgPSB5ZWFyO1xuICAgICAgICB0aGlzLnRpbWVNYXAudXBkYXRlQnlZZWFyKHllYXIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy53ZWJNYXAubWFwQWRhcHRlci5nZXRDb250YWluZXIoKTtcbiAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc2xpZGVyLm9uQWRkKHRoaXMud2ViTWFwKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNsaWRlcjtcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZUhlYWRlcigpIHtcbiAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBoZWFkZXIuY2xhc3NOYW1lID0gJ2ZvbnQtZWZmZWN0LXNoYWRvdy1tdWx0aXBsZSBhcHAtaGVhZGVyJztcbiAgICBjb25zdCBoZWFkZXJUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGhlYWRlclRleHQuaW5uZXJIVE1MID0gYFxuICAgICAg0JPRgNCw0L3QuNGG0Ysg0KDQvtGB0YHQuNC4ICR7dGhpcy50aW1lTWFwLl9taW5ZZWFyfS0ke3RoaXMudGltZU1hcC5fbWF4WWVhcn0g0LPQsy5gO1xuICAgIGhlYWRlci5hcHBlbmRDaGlsZChoZWFkZXJUZXh0KTtcbiAgICBoZWFkZXIuYXBwZW5kQ2hpbGQoZ2V0QWJvdXRQcm9qZWN0TGluayh0aGlzKSk7XG5cbiAgICBjb25zdCBtYXBDb250YWluZXIgPSB0aGlzLndlYk1hcC5tYXBBZGFwdGVyLmdldENvbnRhaW5lcigpO1xuICAgIGlmIChtYXBDb250YWluZXIpIHtcbiAgICAgIG1hcENvbnRhaW5lci5hcHBlbmRDaGlsZChoZWFkZXIpO1xuICAgIH1cblxuICAgIHJldHVybiBoZWFkZXI7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVBZmZpbGlhdGVkTG9nb3MoKSB7XG4gICAgY29uc3QgbG9nb3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBsb2dvcy5jbGFzc05hbWUgPSAnYXBwLWFmZmlsaWF0ZWQtbG9nb3MnO1xuXG4gICAgbG9nb3MuYXBwZW5kQ2hpbGQoZ2V0QWZmaWxpYXRlZExpbmtzKHRoaXMpKTtcblxuICAgIGNvbnN0IG1hcENvbnRhaW5lciA9IHRoaXMud2ViTWFwLm1hcEFkYXB0ZXIuZ2V0Q29udGFpbmVyKCk7XG4gICAgaWYgKG1hcENvbnRhaW5lcikge1xuICAgICAgbWFwQ29udGFpbmVyLmFwcGVuZENoaWxkKGxvZ29zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbG9nb3M7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVQZXJpb2RCbG9ja0J5WWVhcih5ZWFyOiBudW1iZXIsIGFyZWFTdGF0PzogQXJlYVN0YXQpIHtcbiAgICBjb25zdCBwZXJpb2QgPSB0aGlzLl9maW5kUGVyaW9kQnlZZWFyKHllYXIpO1xuICAgIGlmIChwZXJpb2QgJiYgdGhpcy5jb250cm9scy5wZXJpb2RzUGFuZWxDb250cm9sKSB7XG4gICAgICB0aGlzLmNvbnRyb2xzLnBlcmlvZHNQYW5lbENvbnRyb2wudXBkYXRlUGVyaW9kKHBlcmlvZCwgYXJlYVN0YXQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2ZpbmRQZXJpb2RCeVllYXIoeWVhcjogbnVtYmVyKSB7XG4gICAgY29uc3QgcGVyaW9kcyA9IHRoaXMub3B0aW9ucy5wZXJpb2RzIHx8IFtdO1xuICAgIGNvbnN0IHBlcmlvZCA9IHBlcmlvZHMuZmluZCgoeCkgPT4ge1xuICAgICAgbGV0IGZpbmRlZCA9IHllYXIgPj0geC55ZWFyc19mcm9tO1xuICAgICAgaWYgKGZpbmRlZCAmJiB4LnllYXJzX3RvKSB7XG4gICAgICAgIGZpbmRlZCA9IHllYXIgPD0geC55ZWFyc190bztcbiAgICAgIH1cbiAgICAgIHJldHVybiBmaW5kZWQ7XG4gICAgfSk7XG4gICAgcmV0dXJuIHBlcmlvZDtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVllYXJTdGF0QmxvY2tCeVllYXIoeWVhcjogbnVtYmVyLCBhcmVhU3RhdD86IEFyZWFTdGF0KSB7XG4gICAgaWYgKHRoaXMuY29udHJvbHMueWVhcnNTdGF0UGFuZWxDb250cm9sKSB7XG4gICAgICBjb25zdCB5ZWFyU3RhdCA9IHRoaXMuX2ZpbmRZZWFyU3RhdHNCeVllYXIoeWVhcik7XG4gICAgICB0aGlzLmNvbnRyb2xzLnllYXJzU3RhdFBhbmVsQ29udHJvbC51cGRhdGVZZWFyU3RhdHMoeWVhclN0YXQsIGFyZWFTdGF0KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9maW5kQXJlYVN0YXRCeVllYXIoeWVhcjogbnVtYmVyKTogQXJlYVN0YXQgfCB1bmRlZmluZWQge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuYXJlYVN0YXQpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuYXJlYVN0YXQuZmluZCgoeCkgPT4geC55ZWFyID09PSB5ZWFyKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9maW5kWWVhclN0YXRzQnlZZWFyKHllYXI6IG51bWJlcikge1xuICAgIHllYXIgPSBOdW1iZXIoeWVhcik7XG4gICAgY29uc3QgeWVhcnNTdGF0ID0gdGhpcy5vcHRpb25zLnllYXJzU3RhdCB8fCBbXTtcbiAgICBjb25zdCB5ZWFyU3RhdCA9IHllYXJzU3RhdC5maWx0ZXIoKHgpID0+IHtcbiAgICAgIHJldHVybiB5ZWFyID09PSB4LnllYXI7XG4gICAgfSk7XG5cbiAgICByZXR1cm4geWVhclN0YXQ7XG4gIH1cblxuICBwcml2YXRlIF9hZGRFdmVudHNMaXN0ZW5lcnMoKSB7XG4gICAgaWYgKHRoaXMuY29udHJvbHMueWVhcnNTdGF0UGFuZWxDb250cm9sKSB7XG4gICAgICB0aGlzLmNvbnRyb2xzLnllYXJzU3RhdFBhbmVsQ29udHJvbC5lbWl0dGVyLm9uKFxuICAgICAgICAndXBkYXRlJyxcbiAgICAgICAgKHsgeWVhclN0YXQgfSkgPT4ge1xuICAgICAgICAgIHRoaXMuX21hcmtlcnMudXBkYXRlQWN0aXZlTWFya2VyKHllYXJTdGF0KTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy53ZWJNYXAuZW1pdHRlci5vbigncHJlY2xpY2snLCAoKSA9PiB7XG4gICAgICB0aGlzLnRpbWVNYXAudW5zZWxlY3QoKTtcbiAgICB9KTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==