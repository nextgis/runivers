(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main~._src_T"],{

/***/ "./src/TimeMap/TimeGroup.ts":
/*!**********************************!*\
  !*** ./src/TimeMap/TimeGroup.ts ***!
  \**********************************/
/*! exports provided: TimeLayersGroup */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TimeLayersGroup", function() { return TimeLayersGroup; });
/* harmony import */ var mapbox_gl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mapbox-gl */ "./node_modules/mapbox-gl/dist/mapbox-gl.js");
/* harmony import */ var mapbox_gl__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mapbox_gl__WEBPACK_IMPORTED_MODULE_0__);
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
var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

var TimeLayersGroup = (function () {
    function TimeLayersGroup(webMap, options) {
        var _this = this;
        var _a, _b;
        this.webMap = webMap;
        this.options = options;
        this.opacity = 0.8;
        this.pointFitMaxZoom = 7;
        this.polygonFitMaxZoom = 12;
        this._visible = true;
        this._timeLayers = {};
        this._layersLoaded = {};
        this._onDataLoadEvents = [];
        this._onLayerClickMem = {};
        this.name = this.options.name;
        this._visible = (_a = this.options.visible) !== null && _a !== void 0 ? _a : true;
        options.order = (_b = options.order) !== null && _b !== void 0 ? _b : this.webMap.reserveOrder();
        this.order = options.order;
        if (options.opacity !== undefined) {
            this.opacity = options.opacity;
        }
        if (this._isWaitDataLoadedGroup()) {
            webMap.mapAdapter.emitter.on('data-loaded', function (data) { return _this._onData(data); });
            webMap.mapAdapter.emitter.on('data-error', function (data) { return _this._onData(data); });
        }
    }
    TimeLayersGroup.prototype.hide = function () {
        var _this = this;
        if (this._visible) {
            Object.keys(this._timeLayers).forEach(function (x) { return _this._hideLayer(x); });
            this._visible = false;
        }
    };
    TimeLayersGroup.prototype.show = function () {
        if (!this._visible && this.currentLayerId) {
            this._visible = true;
            this._showLayer(this.currentLayerId);
        }
    };
    TimeLayersGroup.prototype.updateLayer = function (layerId) {
        this.beforeLayerId = this.currentLayerId;
        this.currentLayerId = layerId;
        return this.switchLayer(this.beforeLayerId || '', layerId);
    };
    TimeLayersGroup.prototype.updateLayersColor = function () {
        var map = this.webMap.mapAdapter.map;
        if (map) {
            if (this.options.getFillColor) {
                var fillColorDarken = this.options.getFillColor({ darken: 0.5 });
                var fillColor = this.options.getFillColor();
                for (var l in this._layersLoaded) {
                    if (l.indexOf('-bound') !== -1) {
                        map.setPaintProperty(l, 'line-color', fillColorDarken);
                    }
                    else {
                        map.setPaintProperty(l, 'fill-color', fillColor);
                    }
                }
            }
        }
    };
    TimeLayersGroup.prototype.pushDataLoadEvent = function (event) {
        this._onDataLoadEvents.push(event);
    };
    TimeLayersGroup.prototype.fitToFilter = function (filter, timeLayer) {
        var map = this.webMap.mapAdapter.map;
        if (map && typeof timeLayer.source === 'string') {
            var isNgwGeoJson = timeLayer.source.startsWith('ngw:');
            var features = [];
            if (isNgwGeoJson) {
                var source = map.getSource(timeLayer.source);
                var featureCollection = source._data;
                var filterIdField_1 = this.options.filterIdField || 'id';
                features = featureCollection.features.filter(function (x) {
                    var ids = [].concat(filter[2]);
                    return (x.properties && ids.indexOf(x.properties[filterIdField_1]) !== -1);
                });
            }
            else {
                var sourceLayer = 'ngw:' + (timeLayer.options.name || timeLayer.id);
                var source = timeLayer.source;
                features = map.querySourceFeatures(source, {
                    filter: filter,
                    sourceLayer: sourceLayer,
                });
            }
            if (features && features.length) {
                this._fitToFeatures(features);
                return features;
            }
        }
    };
    TimeLayersGroup.prototype.showOnlyCurrentLayer = function () {
        this.hideNotCurrentLayers();
        this.makeOpacity();
    };
    TimeLayersGroup.prototype.clean = function () {
        this._removePopup();
        this._cleanDataLoadEvents();
        if (this.currentLayerId) {
            this._removeLayerListeners(this.currentLayerId);
            this._hideLayer(this.currentLayerId);
        }
        this.currentLayerId = undefined;
    };
    TimeLayersGroup.prototype.switchLayer = function (fromId, toId) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this._removePopup();
            _this._cleanDataLoadEvents();
            if (toId && fromId !== toId) {
                _this.pushDataLoadEvent(resolve);
                _this._showLayer(toId)
                    .then(function (id_) {
                    if (id_ === _this.currentLayerId) {
                        _this._addLayerListeners(id_);
                        if (fromId) {
                            _this._removeLayerListeners(fromId);
                            _this._setLayerOpacity(id_, 0);
                        }
                        if (!_this._isWaitDataLoadedGroup()) {
                            _this._onSourceIsLoaded();
                        }
                    }
                    else {
                        reject("Not current id");
                    }
                })
                    .catch(function (er) {
                    reject(er);
                });
            }
            else {
                resolve();
            }
        });
        return promise.then(function () {
            return toId;
        });
    };
    TimeLayersGroup.prototype.hideLayer = function (layerId) {
        this._hideLayer(layerId);
    };
    TimeLayersGroup.prototype.getTimeLayer = function (layerId) {
        layerId = layerId !== undefined ? layerId : this.currentLayerId;
        if (layerId) {
            return this._timeLayers[layerId];
        }
    };
    TimeLayersGroup.prototype.forEachTimeLayer = function (layerId, fun) {
        var timeLayer = this._timeLayers[layerId];
        if (timeLayer) {
            timeLayer.forEach(function (x) { return fun(x); });
        }
    };
    TimeLayersGroup.prototype.selectLayerFeature = function (feature, adapterId) {
        var prop = feature.properties;
        if (prop && this.options.filterIdField) {
            var filterIdField = this.options.filterIdField;
            var fid = prop[filterIdField];
            var adapter = this._getWebMapLayer(adapterId);
            if (adapter && adapter.select) {
                adapter.select([[filterIdField, 'eq', Number(fid)]]);
            }
        }
    };
    TimeLayersGroup.prototype.select = function (fids, id, fit) {
        if (fit === void 0) { fit = false; }
        id = id !== null && id !== void 0 ? id : this.currentLayerId;
        if (id) {
            var ids_1 = fids.split(',').map(function (x) { return Number(x); });
            var layers = this._timeLayers[id];
            var filterIdField_2 = this.options.filterIdField;
            var mapLayers_2 = [];
            layers.forEach(function (x) {
                var mapLayer = x && x.layer && x.layer[0];
                if (ids_1 && mapLayer && filterIdField_2) {
                    if (x && x.select) {
                        x.select([[filterIdField_2, 'in', ids_1]]);
                        mapLayers_2.push(x);
                    }
                }
            });
            if (fit) {
                for (var _i = 0, mapLayers_1 = mapLayers_2; _i < mapLayers_1.length; _i++) {
                    var timeLayer = mapLayers_1[_i];
                    var features = this.fitToFilter(__spreadArrays(['in', filterIdField_2], ids_1), timeLayer);
                    if (features && features.length) {
                        return features;
                    }
                }
            }
        }
    };
    TimeLayersGroup.prototype.setFilter = function (filter) {
        if (filter && filter.length) {
            this._filter = filter;
        }
        else {
            this._filter = undefined;
        }
        if (this.options.setFilter) {
            this.options.setFilter(this._filter || [], this.currentLayerId);
        }
        else {
            this._updateFilter();
        }
    };
    TimeLayersGroup.prototype.hideNotCurrentLayers = function () {
        var _this = this;
        Object.keys(this._timeLayers).forEach(function (id) {
            if (id !== _this.currentLayerId) {
                _this._hideLayer(id);
            }
        });
    };
    TimeLayersGroup.prototype._cleanDataLoadEvents = function () {
        this._onDataLoadEvents = [];
    };
    TimeLayersGroup.prototype.makeOpacity = function () {
        if (this.currentLayerId) {
            this._setLayerOpacity(this.currentLayerId, this.opacity);
        }
    };
    TimeLayersGroup.prototype._getWebMapLayerId = function (id) {
        return String(id);
    };
    TimeLayersGroup.prototype._getWebMapLayer = function (id) {
        return this.webMap.getLayer(this._getWebMapLayerId(id));
    };
    TimeLayersGroup.prototype._isWaitDataLoadedGroup = function () {
        return this.options.dataLoaded !== undefined
            ? this.options.dataLoaded
            : true;
    };
    TimeLayersGroup.prototype._setLayerOpacity = function (id, value) {
        var _this = this;
        var dataLoaded = this._isWaitDataLoadedGroup();
        this.forEachTimeLayer(id, function (dataLayerId) {
            if (dataLoaded) {
                return _this.webMap.setLayerOpacity(dataLayerId, value);
            }
            else {
                if (value === 0) {
                    return _this.webMap.hideLayer(dataLayerId);
                }
                else {
                    return _this.webMap.showLayer(dataLayerId);
                }
            }
        });
    };
    TimeLayersGroup.prototype._removePopup = function () {
        if (this._popup) {
            this._popup.remove();
            this._popup = undefined;
        }
    };
    TimeLayersGroup.prototype._isCurrentDataLayer = function (layerId) {
        var currentLayers = this.currentLayerId !== undefined &&
            this._timeLayers[this.currentLayerId];
        return currentLayers
            ? currentLayers.some(function (x) {
                return (x.id === layerId ||
                    x.options.name === layerId ||
                    (x.layer && x.layer.some(function (y) { return y === layerId; })));
            })
            : false;
    };
    TimeLayersGroup.prototype._getLayerIdFromSource = function (target) {
        if (this._timeLayers[target]) {
            return target;
        }
        for (var t in this._timeLayers) {
            var timeLayerList = this._timeLayers[t];
            var adapter = timeLayerList.find(function (x) {
                return ((x.source && x.source === target) ||
                    (x.options && x.options.url && x.options.url === target));
            });
            if (adapter) {
                return adapter.id;
            }
        }
    };
    TimeLayersGroup.prototype._onData = function (data) {
        var layerId = this._getLayerIdFromSource(data.target);
        if (layerId) {
            var loadedYet = this._layersLoaded[layerId];
            var isCurrentLayer = this._isCurrentDataLayer(layerId);
            var isHistoryLayer = this._isHistoryLayer(layerId);
            if (!loadedYet && isHistoryLayer && isCurrentLayer) {
                this._layersLoaded[layerId] = true;
                this._onSourceIsLoaded();
            }
        }
    };
    TimeLayersGroup.prototype._onLayerClick = function (e, layerId, adapterId) {
        var _a;
        var map = this.webMap.mapAdapter.map;
        var point = e.point;
        var width = 5;
        var height = 5;
        if (map) {
            var features = map.queryRenderedFeatures([
                [point.x - width / 2, point.y - height / 2],
                [point.x + width / 2, point.y + height / 2],
            ], { layers: [layerId] });
            var feature = features[0];
            var prop = feature.properties;
            if (this.options.createPopupContent) {
                var html = this.options.createPopupContent(prop);
                if (html) {
                    this._removePopup();
                    this._popup = new mapbox_gl__WEBPACK_IMPORTED_MODULE_0__["Popup"]()
                        .setLngLat(e.lngLat)
                        .setDOMContent(html)
                        .addTo(map);
                }
            }
            var selectOnLayerClick = (_a = this.options.selectOnLayerClick) !== null && _a !== void 0 ? _a : true;
            if (selectOnLayerClick) {
                this.selectLayerFeature(feature, adapterId);
            }
        }
    };
    TimeLayersGroup.prototype._removeLayerListeners = function (layerId) {
        var map = this.webMap.mapAdapter.map;
        var memEvents = this._onLayerClickMem[layerId];
        if (memEvents && map) {
            for (var ev in memEvents) {
                var memEvent = memEvents[ev];
                if (memEvent) {
                    map.off(ev, memEvent);
                }
            }
        }
        this._removePopup();
    };
    TimeLayersGroup.prototype._addLayerListeners = function (id) {
        var _this = this;
        var map = this.webMap.mapAdapter.map;
        if (map) {
            this._forEachDataLayer(id, function (layerId) {
                var layerClickBind = function (ev) {
                    return _this._onLayerClick(ev, layerId, id);
                };
                var layerMouseEnterBind = function () {
                    return (map.getCanvas().style.cursor = 'pointer');
                };
                var layerMouseLeaveBind = function () { return (map.getCanvas().style.cursor = ''); };
                map.on('click', layerId, layerClickBind);
                map.on('mouseenter', layerId, layerMouseEnterBind);
                map.on('mouseleave', layerId, layerMouseLeaveBind);
                _this._onLayerClickMem[layerId] = _this._onLayerClickMem[layerId] || {};
                _this._onLayerClickMem[layerId].click = layerClickBind;
                _this._onLayerClickMem[layerId].mouseenter = layerClickBind;
                _this._onLayerClickMem[layerId].mouseleave = layerClickBind;
            });
        }
    };
    TimeLayersGroup.prototype._isHistoryLayer = function (layerId) {
        return !this.webMap.isBaseLayer(layerId);
    };
    TimeLayersGroup.prototype._isAllDataLayerLoaded = function (layer) {
        var _this = this;
        if (this._isWaitDataLoadedGroup()) {
            var timeLayer = this._timeLayers[layer];
            if (timeLayer) {
                return timeLayer.every(function (x) {
                    return (x.id === layer ||
                        x.options.name === layer ||
                        (x.layer && x.layer.some(function (y) { return _this._layersLoaded[y]; })));
                });
            }
        }
        else {
            return true;
        }
    };
    TimeLayersGroup.prototype._forEachDataLayer = function (layerId, fun) {
        this.forEachTimeLayer(layerId, function (timeLayer) { return timeLayer.layer && timeLayer.layer.forEach(function (y) { return fun(y); }); });
    };
    TimeLayersGroup.prototype._onSourceIsLoaded = function () {
        if (this.currentLayerId &&
            this._isAllDataLayerLoaded(this.currentLayerId)) {
            if (!this.options.manualOpacity) {
                this.showOnlyCurrentLayer();
            }
            this._executeDataLoadEvents();
        }
    };
    TimeLayersGroup.prototype._executeDataLoadEvents = function () {
        for (var fry = 0; fry < this._onDataLoadEvents.length; fry++) {
            var event_1 = this._onDataLoadEvents[fry];
            event_1();
        }
        this._onDataLoadEvents = [];
    };
    TimeLayersGroup.prototype._addLayer = function (url, id) {
        return __awaiter(this, void 0, void 0, function () {
            var layers, _i, layers_1, l, layer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.options.addLayers(url, id)];
                    case 1:
                        layers = _a.sent();
                        this._timeLayers[id] = [];
                        _i = 0, layers_1 = layers;
                        _a.label = 2;
                    case 2:
                        if (!(_i < layers_1.length)) return [3, 5];
                        l = layers_1[_i];
                        return [4, l];
                    case 3:
                        layer = _a.sent();
                        this._timeLayers[id].push(layer);
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3, 2];
                    case 5: return [2, this._timeLayers[id]];
                }
            });
        });
    };
    TimeLayersGroup.prototype._toggleLayer = function (id, status) {
        var _this = this;
        this._forEachDataLayer(id, function (l) {
            _this._layersLoaded[l] = false;
        });
        this._layersLoaded[id] = false;
        if (status) {
            this._showLayer(id);
        }
        else {
            this.forEachTimeLayer(id, function (l) {
                _this.webMap.removeLayer(l);
            });
            this._timeLayers[id] = [];
        }
    };
    TimeLayersGroup.prototype._hideLayer = function (layerId) {
        this._toggleLayer(layerId, false);
    };
    TimeLayersGroup.prototype._showLayer = function (id) {
        var _this = this;
        if (this._visible) {
            var toggle_1 = function () {
                _this.forEachTimeLayer(id, function (l) { return _this.webMap.toggleLayer(l, true); });
                return id;
            };
            var exist = this._getWebMapLayer(id);
            if (!exist) {
                var url = this.options.setUrl
                    ? this.options.setUrl({
                        baseUrl: this.options.baseUrl,
                        resourceId: id,
                    })
                    : this.options.oldNgwMvtApi
                        ? this.options.baseUrl + '/api/resource/' + id + '/{z}/{x}/{y}.mvt'
                        : this.newNgwMvtUrl({
                            baseUrl: this.options.baseUrl,
                            resourceId: id,
                        });
                return this._addLayer(url, id).then(function () {
                    return toggle_1();
                });
            }
            else {
                return Promise.resolve(toggle_1());
            }
        }
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                _this._executeDataLoadEvents();
                resolve(id);
            }, 0);
        });
    };
    TimeLayersGroup.prototype.newNgwMvtUrl = function (opt) {
        return (opt.baseUrl +
            '/api/component/feature_layer/mvt?x={x}&y={y}&z={z}&' +
            'resource=' +
            opt.resourceId);
    };
    TimeLayersGroup.prototype._fitToFeatures = function (features) {
        var bounds = new mapbox_gl__WEBPACK_IMPORTED_MODULE_0__["LngLatBounds"]();
        var types = [];
        var extendCoords = function (coords) {
            if (coords.length === 2) {
                try {
                    bounds.extend(coords);
                }
                catch (er) {
                }
            }
            else {
                coords.forEach(function (c) {
                    extendCoords(c);
                });
            }
        };
        features.forEach(function (feature) {
            var geometry = feature.geometry;
            extendCoords(geometry.coordinates);
            types.push(feature.geometry.type);
        });
        if (this.webMap.mapAdapter.map) {
            var onlyPoint = types.every(function (x) { return x === 'Point'; });
            this.webMap.mapAdapter.map.fitBounds(bounds, {
                padding: 20,
                maxZoom: onlyPoint ? this.pointFitMaxZoom : this.polygonFitMaxZoom,
            });
        }
    };
    TimeLayersGroup.prototype._updateFilter = function () {
        var _this = this;
        if (this.currentLayerId) {
            var layers = this._timeLayers[this.currentLayerId];
            var filterIdField_3 = this.options.filterIdField;
            layers.forEach(function (x) {
                if (filterIdField_3) {
                    if (x && x.propertiesFilter) {
                        x.propertiesFilter(_this._filter || []);
                    }
                }
            });
        }
    };
    return TimeLayersGroup;
}());



/***/ }),

/***/ "./src/TimeMap/TimeMap.ts":
/*!********************************!*\
  !*** ./src/TimeMap/TimeMap.ts ***!
  \********************************/
/*! exports provided: TimeMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TimeMap", function() { return TimeMap; });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _TimeGroup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TimeGroup */ "./src/TimeMap/TimeGroup.ts");
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


var EVENTS_IDS = 0;
var TimeMap = (function () {
    function TimeMap(webMap, options) {
        if (options === void 0) { options = {}; }
        this.webMap = webMap;
        this.options = options;
        this.emitter = new events__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this._minYear = 0;
        this._maxYear = 0;
        this._timeLayersGroups = [];
        this._onGroupsLoadEvents = [];
        this._groupsConfig = {};
        this._loadLayerPromises = {};
    }
    TimeMap.prototype.getTimeGroup = function (groupName) {
        if (groupName === void 0) { groupName = ''; }
        var group = this._timeLayersGroups.find(function (x) { return x.name === groupName; });
        return group;
    };
    TimeMap.prototype.getTimeGroupByAdapterId = function (id) {
        return this._getTimeGroupBy(function (timeLayer) { return timeLayer.id === id; });
    };
    TimeMap.prototype.getTimeGroupByLayerId = function (id) {
        return this._getTimeGroupBy(function (timeLayer) { var _a; return !!((_a = timeLayer.layer) === null || _a === void 0 ? void 0 : _a.includes(id)); });
    };
    TimeMap.prototype.getTimeGroups = function () {
        return this._timeLayersGroups;
    };
    TimeMap.prototype.addTimeGroup = function (options) {
        var timeLayersGroup = new _TimeGroup__WEBPACK_IMPORTED_MODULE_1__["TimeLayersGroup"](this.webMap, options);
        this._timeLayersGroups.push(timeLayersGroup);
    };
    TimeMap.prototype.updateByYear = function (year, previous) {
        var layersId = this._getLayerIdsByYear(year, previous);
        if (layersId) {
            this.updateLayers(layersId);
        }
        if (this.options.onLayerUpdate) {
            this.options.onLayerUpdate(year);
        }
    };
    TimeMap.prototype.updateLayer = function (layerId, groupName) {
        if (groupName === void 0) { groupName = ''; }
        var group = this.getTimeGroup(groupName);
        if (group) {
            if (layerId) {
                return group.updateLayer(layerId).then(function () { return group; });
            }
            else {
                group.clean();
                return Promise.resolve(undefined);
            }
        }
        return Promise.resolve(undefined);
    };
    TimeMap.prototype.updateLayers = function (layerIdRecord) {
        return __awaiter(this, void 0, void 0, function () {
            var updateLayersPromise;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getUpdateLayersPromise(layerIdRecord)];
                    case 1:
                        updateLayersPromise = _a.sent();
                        return [2, this.finishLoading(updateLayersPromise, layerIdRecord)];
                }
            });
        });
    };
    TimeMap.prototype.resetLoading = function () {
        this._timeLayersGroups.forEach(function (x) {
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
    };
    TimeMap.prototype.finishLoading = function (groups, layerIdRecord) {
        var layerIdRecordList = Object.keys(layerIdRecord);
        this._timeLayersGroups.forEach(function (x) {
            x.beforeLayerId = undefined;
            if (!layerIdRecordList.includes(x.name)) {
                if (x.currentLayerId) {
                    x.hideLayer(x.currentLayerId);
                }
            }
        });
        groups.forEach(function (x) { return x(); });
        this._loadLayerPromises = {};
        this.emitter.emit('loading:finish', layerIdRecord);
    };
    TimeMap.prototype.getUpdateLayersPromise = function (layerIdRecord) {
        var _this = this;
        var promises = [];
        this.emitter.emit('loading:start', layerIdRecord);
        var layerIdRecordList = Object.keys(layerIdRecord);
        layerIdRecordList.forEach(function (key) {
            var value = layerIdRecord[key];
            var exist = _this._loadLayerPromises[key];
            if (exist && exist.promise) {
                promises.push(exist.promise);
            }
            else {
                var promise = _this.updateLayer(value, key).then(function (x) {
                    delete _this._loadLayerPromises[key];
                    return function () {
                        if (x) {
                            x.showOnlyCurrentLayer();
                            _this.emitter.emit('loading-layer:finish', {
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
    };
    TimeMap.prototype.pushDataLoadEvent = function (event) {
        var _this = this;
        var id = EVENTS_IDS++;
        var promises = this._timeLayersGroups.map(function (x) {
            return new Promise(function (resolve, reject) {
                x.pushDataLoadEvent(resolve);
            });
        });
        this._onGroupsLoadEvents[id] = event;
        Promise.all(promises).then(function () {
            var _event = _this._onGroupsLoadEvents[id];
            if (_event) {
                _event();
            }
        });
        return id;
    };
    TimeMap.prototype.unselect = function (opt) {
        if (opt === void 0) { opt = {}; }
        this._timeLayersGroups.forEach(function (x) {
            var include = opt.exclude ? opt.exclude.indexOf(x.name) === -1 : true;
            if (include && x.currentLayerId) {
                x.forEachTimeLayer(x.currentLayerId, function (y) {
                    if (y.unselect && y.selected) {
                        y.unselect();
                    }
                });
            }
        });
    };
    TimeMap.prototype.buildTimeMap = function (data) {
        this._groupsConfig = this._processGroupsMeta(data);
        this._addTimeLayersGroups(data);
        if (!this.currentYear && this._minYear) {
            this.currentYear = this._minYear;
        }
        Object.values(this._groupsConfig).forEach(function (x) {
            x.layersMeta.sort(function (a, b) { return (a.from < b.from ? -1 : 1); });
        });
    };
    TimeMap.prototype._addTimeLayersGroups = function (config) {
        var _this = this;
        config.forEach(function (x) {
            var statusLayer = _this.options.getStatusLayer(x);
            if (statusLayer) {
                _this.addTimeGroup(statusLayer);
            }
        });
    };
    TimeMap.prototype._stepReady = function (year, callback, previous) {
        return __awaiter(this, void 0, void 0, function () {
            var nextLayers, updateLayersPromise_1, layerIdRecord_1, y_1, next, noChange;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nextLayers = this._getLayersByYear(year, previous);
                        if (!nextLayers) {
                            nextLayers = this._getNextLayers(year, previous);
                        }
                        if (!nextLayers) return [3, 4];
                        y_1 = year;
                        this.nextYear = y_1;
                        next = function () {
                            var finish = function () {
                                _this.nextYear = undefined;
                                _this.currentYear = y_1;
                                if (updateLayersPromise_1 && layerIdRecord_1) {
                                    _this.finishLoading(updateLayersPromise_1, layerIdRecord_1);
                                }
                                if (_this.options.onStepReady) {
                                    _this.options.onStepReady(y_1);
                                }
                            };
                            var resetLoading = function () {
                                _this.nextYear = undefined;
                                _this.resetLoading();
                            };
                            callback(y_1, function () { return finish(); }, function () { return resetLoading(); });
                        };
                        noChange = Object.entries(nextLayers).every(function (_a) {
                            var groupName = _a[0], x = _a[1];
                            var timeGroup = _this.getTimeGroup(groupName);
                            if (timeGroup) {
                                var newId = x && x.id;
                                return timeGroup.currentLayerId === String(newId);
                            }
                            return true;
                        });
                        if (!noChange) return [3, 1];
                        next();
                        return [3, 3];
                    case 1:
                        layerIdRecord_1 = this._layerMetaToIdRecord(nextLayers);
                        return [4, this.getUpdateLayersPromise(layerIdRecord_1)];
                    case 2:
                        updateLayersPromise_1 = _a.sent();
                        next();
                        _a.label = 3;
                    case 3: return [3, 5];
                    case 4:
                        if (this._minYear && this._maxYear) {
                            callback(previous ? this._minYear : this._maxYear);
                        }
                        _a.label = 5;
                    case 5: return [2];
                }
            });
        });
    };
    TimeMap.prototype._getTimeGroupBy = function (fun) {
        for (var fry = 0; fry < this._timeLayersGroups.length; fry++) {
            var layerGroup = this._timeLayersGroups[fry];
            var timeLayer = layerGroup.getTimeLayer();
            if (timeLayer) {
                for (var f = 0; f < timeLayer.length; f++) {
                    var layer = timeLayer[f];
                    if (layer && fun(layer)) {
                        return { timeGroup: layerGroup, timeLayer: layer };
                    }
                }
            }
        }
    };
    TimeMap.prototype._getLayersByYear = function (year, previous) {
        var _this = this;
        var layersMeta = {};
        this.getTimeGroups().forEach(function (x) {
            var groupConfig = _this._groupsConfig[x.name];
            var layers = groupConfig.layersMeta.filter(function (d) { return year >= d.from && year <= d.to; });
            layersMeta[x.name] = layers.length
                ? previous
                    ? layers[0]
                    : layers[layers.length - 1]
                : false;
        });
        return layersMeta;
    };
    TimeMap.prototype._getLayerIdsByYear = function (year, previous) {
        var filteredLayers = this._getLayersByYear(year, previous);
        return this._layerMetaToIdRecord(filteredLayers);
    };
    TimeMap.prototype._layerMetaToIdRecord = function (metaRecord) {
        var layersId = {};
        Object.entries(metaRecord).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            if (value) {
                layersId[key] = String(value.id);
            }
            else {
                layersId[key] = false;
            }
        });
        return layersId;
    };
    TimeMap.prototype._getNextLayers = function (year, previous) {
        var layersMetaInYear = this._getLayersByYear(year);
        var filteredLayers = {};
        for (var l in layersMetaInYear) {
            var layerMeta = layersMetaInYear[l];
            var nextLayer = void 0;
            var config = this._groupsConfig[l];
            if (layerMeta) {
                var currentLayerId = this.getTimeGroup(config.name).currentLayerId;
                if (String(layerMeta.id) === currentLayerId) {
                    var index = config.layersMeta.indexOf(layerMeta);
                    if (index !== -1) {
                        nextLayer = config.layersMeta[previous ? index - 1 : index + 1];
                    }
                }
                else {
                    layerMeta;
                }
            }
            else {
                if (previous) {
                    nextLayer = config.layersMeta
                        .slice()
                        .reverse()
                        .find(function (d) { return d.to <= year; });
                }
                else {
                    nextLayer = config.layersMeta.find(function (d) { return d.from >= year; });
                }
            }
            if (nextLayer) {
                filteredLayers[l] = nextLayer;
            }
        }
        return filteredLayers;
    };
    TimeMap.prototype._processGroupsMeta = function (layersGroup) {
        var _this = this;
        var groupsMeta = {};
        layersGroup.forEach(function (group) {
            var layersMeta = [];
            group.items.forEach(function (_a) {
                var resource = _a.resource;
                var name = resource.display_name;
                var _match = name.match('(\\d{3,4})_(to_)?(\\d{3,4}).*$');
                if (_match) {
                    var _b = [_match[1], _match[3]].map(function (x) { return Number(x); }), from = _b[0], to = _b[1];
                    var allowedYear = (_this.options.fromYear && from < _this.options.fromYear) ||
                        (_this.options.toYear && to > _this.options.toYear)
                        ? false
                        : true;
                    if (allowedYear) {
                        _this._minYear =
                            (_this._minYear > from ? from : _this._minYear) || from;
                        _this._maxYear = (_this._maxYear < to ? to : _this._maxYear) || to;
                        layersMeta.push({ name: name, from: from, to: to, id: resource.id });
                    }
                }
            });
            groupsMeta[group.name] = { layersMeta: layersMeta, name: group.name };
        });
        return groupsMeta;
    };
    return TimeMap;
}());



/***/ }),

/***/ "./src/TimeMap/TimeMapLoadingControl.ts":
/*!**********************************************!*\
  !*** ./src/TimeMap/TimeMapLoadingControl.ts ***!
  \**********************************************/
/*! exports provided: TimeMapLoadingControl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TimeMapLoadingControl", function() { return TimeMapLoadingControl; });
var TimeMapLoadingControl = (function () {
    function TimeMapLoadingControl(timeMap) {
        var _this = this;
        this.timeMap = timeMap;
        this.__onLoadingStart = function () { return _this._onLoadingStart(); };
        this.__onLoadingStop = function () { return _this._onLoadingStop(); };
    }
    TimeMapLoadingControl.prototype.onAdd = function () {
        var container = document.createElement('div');
        this._container = container;
        if (this.timeMap) {
            this.timeMap.emitter.on('loading:start', this.__onLoadingStart);
            this.timeMap.emitter.on('loading:finish', this.__onLoadingStop);
        }
        return container;
    };
    TimeMapLoadingControl.prototype.onRemove = function () {
        if (this.timeMap) {
            this.timeMap.emitter.off('loading:start', this.__onLoadingStart);
            this.timeMap.emitter.off('loading:finish', this.__onLoadingStop);
        }
        if (this._container) {
            var parent_1 = this._container.parentNode;
            if (parent_1) {
                parent_1.removeChild(this._container);
            }
        }
    };
    TimeMapLoadingControl.prototype._onLoadingStart = function () {
        if (this._container) {
            this._container.innerHTML = 'Loading...';
        }
    };
    TimeMapLoadingControl.prototype._onLoadingStop = function () {
        if (this._container) {
            this._container.innerHTML = '';
        }
    };
    return TimeMapLoadingControl;
}());



/***/ }),

/***/ "./src/components/Links/Links.scss":
/*!*****************************************!*\
  !*** ./src/components/Links/Links.scss ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/components/Links/Links.ts":
/*!***************************************!*\
  !*** ./src/components/Links/Links.ts ***!
  \***************************************/
/*! exports provided: getSwitcherPanelControl, getSocialLinksPanel, openAboutDialog, getAboutProjectLink, openSettingsDialog, getAffiliatedLinks, getAffiliatedPanel, getHomeBtnControl, getTimelineButton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSwitcherPanelControl", function() { return getSwitcherPanelControl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSocialLinksPanel", function() { return getSocialLinksPanel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openAboutDialog", function() { return openAboutDialog; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAboutProjectLink", function() { return getAboutProjectLink; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openSettingsDialog", function() { return openSettingsDialog; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAffiliatedLinks", function() { return getAffiliatedLinks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAffiliatedPanel", function() { return getAffiliatedPanel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getHomeBtnControl", function() { return getHomeBtnControl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTimelineButton", function() { return getTimelineButton; });
/* harmony import */ var _Links_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Links.scss */ "./src/components/Links/Links.scss");
/* harmony import */ var _Links_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Links_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _img_nextgis_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./img/nextgis.png */ "./src/components/Links/img/nextgis.png");
/* harmony import */ var _nextgis_dialog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextgis/dialog */ "./nextgis_frontend/packages/dialog/src/index.ts");
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../package.json */ "./package.json");
var _package_json__WEBPACK_IMPORTED_MODULE_3___namespace = /*#__PURE__*/__webpack_require__.t(/*! ../../../package.json */ "./package.json", 1);
/* harmony import */ var _Panels_PanelControl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Panels/PanelControl */ "./src/components/Panels/PanelControl.ts");
/* harmony import */ var _Toggler__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Toggler */ "./src/components/Links/Toggler.ts");
/* harmony import */ var _aboutRu__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./aboutRu */ "./src/components/Links/aboutRu.ts");
/* harmony import */ var _aboutEn__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./aboutEn */ "./src/components/Links/aboutEn.ts");








function getBaseLayerToggler(controls) {
    var baseLayer = 'baselayer';
    var baseLayerToggler = new _Toggler__WEBPACK_IMPORTED_MODULE_5__["Toggler"]({
        className: 'baselayer__toggler',
        title: 'Скрыть подложку',
        titleOff: 'Показать подложку',
        toggleAction: function (status) {
            if (status) {
                controls.app.webMap.showLayer(baseLayer);
            }
            else {
                controls.app.webMap.hideLayer(baseLayer);
            }
        },
    });
    return baseLayerToggler;
}
function openDialog(options) {
    var dialog = new _nextgis_dialog__WEBPACK_IMPORTED_MODULE_2__["default"](options);
    var isSame = options && options.template && dialog.options.template === options.template;
    if (!isSame) {
        dialog.updateContent(options.template);
    }
    dialog.show();
    return dialog;
}
function getYearsToggler(controls) {
    var yearsStatPanelControl = controls.yearsStatPanelControl;
    if (yearsStatPanelControl) {
        var yearsToggler_1 = new _Toggler__WEBPACK_IMPORTED_MODULE_5__["Toggler"]({
            className: 'years__toggler',
            title: 'Скрыть панель изменения в территориальном составе',
            titleOff: 'Показать панель изменения в территориальном составе',
            toggleAction: function (status) {
                if (status) {
                    yearsStatPanelControl._blocked = false;
                    yearsStatPanelControl.show();
                }
                else {
                    yearsStatPanelControl.hide();
                    yearsStatPanelControl._blocked = true;
                }
            },
        });
        yearsStatPanelControl.emitter.on('toggle', function (status) {
            yearsToggler_1.toggle(status);
        });
        return yearsToggler_1;
    }
}
function getPeriodToggler(controls) {
    var periodsPanelControl = controls.periodsPanelControl;
    if (periodsPanelControl) {
        var periodToggler_1 = new _Toggler__WEBPACK_IMPORTED_MODULE_5__["Toggler"]({
            className: 'period__toggler',
            title: 'Скрыть панель правителей',
            titleOff: 'Показать панель правителей',
            toggleAction: function (status) {
                if (status) {
                    periodsPanelControl.show();
                }
                else {
                    periodsPanelControl.hide();
                }
            },
        });
        periodsPanelControl.emitter.on('toggle', function (status) {
            periodToggler_1.toggle(status);
        });
        return periodToggler_1;
    }
}
function getLegendToggler(controls) {
    var legendPanel = controls.legendPanel;
    if (legendPanel) {
        var legendToggler_1 = new _Toggler__WEBPACK_IMPORTED_MODULE_5__["Toggler"]({
            className: 'legend__toggler',
            title: 'Скрыть легенду',
            titleOff: 'Показать легенду',
            toggleAction: function (status) {
                if (status) {
                    legendPanel.show();
                }
                else {
                    legendPanel.hide();
                }
            },
        });
        legendPanel.emitter.on('toggle', function (status) {
            legendToggler_1.toggle(status);
        });
        return legendToggler_1;
    }
}
function getSwitcherPanelControl(controls) {
    var block = document.createElement('div');
    block.className = 'switcher-panel-control';
    var toggles = [
        getLegendToggler(controls),
        getPeriodToggler(controls),
        getYearsToggler(controls),
        getBaseLayerToggler(controls),
    ];
    toggles.forEach(function (t) { return t && block.appendChild(t.getContainer()); });
    var panel = new _Panels_PanelControl__WEBPACK_IMPORTED_MODULE_4__["Panel"]({
        addClass: 'panel-links',
    });
    panel.updateBody(block);
    return panel;
}
function getSocialLinksPanel() {
    var block = document.createElement('div');
    block.innerHTML = "\n    <div class=\"social-links\">\n      <a href=\"http://twitter.com/runivers\" class=\"social__logo twitter\"></a>\n      <a href=\"http://www.facebook.com/Runiverse.ru\" class=\"social__logo facebook\"></a>\n      <a href=\"http://vk.com/public35690973\" class=\"social__logo vkontakte\"></a>\n    </div>\n  ";
    var panel = new _Panels_PanelControl__WEBPACK_IMPORTED_MODULE_4__["Panel"]({
        addClass: 'panel-links',
    });
    panel.updateBody(block);
    return panel;
}
function getAboutBlock(block) {
    return "\n    <P LANG=\"en-GB\" CLASS=\"western\" ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n      <SPAN LANG=\"ru-RU\">" + block + "</SPAN>\n    </P>";
}
function openAboutDialog(app, language) {
    if (language === void 0) { language = 'ru'; }
    var attrs = app.webMap.getAttributions({
        onlyVisible: false,
        onlyBaselayer: true,
    });
    var templates = {
        ru: _aboutRu__WEBPACK_IMPORTED_MODULE_6__["aboutShortRu"],
        en: _aboutEn__WEBPACK_IMPORTED_MODULE_7__["aboutShortEn"],
    };
    var template = templates[language];
    if (attrs.length) {
        var str_1 = language === 'ru'
            ? 'Использована картографическая подложка: '
            : 'The basemap used: ';
        attrs.forEach(function (x) {
            str_1 += x;
        });
        template += getAboutBlock(str_1);
    }
    var html = document.createElement('div');
    html.innerHTML = template;
    var languageSwitcher = html.getElementsByClassName('switch-about-language-btn')[0];
    if (languageSwitcher) {
        languageSwitcher.onclick = function () {
            _nextgis_dialog__WEBPACK_IMPORTED_MODULE_2__["default"].clean();
            openAboutDialog(app, languageSwitcher.name);
        };
    }
    openDialog({ template: html });
}
function getAboutProjectLink(app) {
    var block = document.createElement('a');
    block.className = 'about_icon';
    block.setAttribute('href', '#');
    block.innerHTML = "i";
    block.onclick = function () {
        openAboutDialog(app, 'ru');
    };
    return block;
}
function openSettingsDialog(app) {
    var template = document.createElement('div');
    var header = document.createElement('div');
    header.className = 'settings-dialog__header';
    header.innerHTML = "\n    <h2>\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438</h2>\n  ";
    template.appendChild(header);
    var s = app.slider;
    var settings = [
        { name: 'animationDelay', label: 'Задержка анимации, мс', type: 'number' },
        { name: 'step', label: 'Шаг изменения года', type: 'number' },
        {
            name: 'animationStep',
            label: 'Шаг изменения года (анимация)',
            type: 'number',
        },
    ];
    settings.forEach(function (x) {
        var id = x.name + '-' + Math.round(Math.random() * 10000);
        var inputBlock = document.createElement('label');
        inputBlock.className = 'settings-dialog__input-block';
        inputBlock.innerHTML = "<div class=\"settings-dialog__input-block--label\">" + x.label + ": </div>\n      <input class=\"" + id + "\" class=type=" + x.type + " value=" + s.options[x.name] + ">\n      </input>\n    ";
        var input = inputBlock.getElementsByClassName(id)[0];
        input.addEventListener('input', function () {
            var value = x.type === 'number' ? parseInt(input.value, 10) : input.value;
            Object.defineProperty(s.options, x.name, { value: value, enumerable: true });
        });
        template.appendChild(inputBlock);
    });
    var legend = app.controls.legendPanel &&
        app.controls.legendPanel.createLegendBlock(true);
    if (legend) {
        template.appendChild(legend);
    }
    var readMore = document.createElement('div');
    readMore.className = 'settings-dialog__read-more';
    readMore.innerHTML = "\n    \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0442\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u0440\u0435\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438 \u043F\u0440\u043E\u0435\u043A\u0442\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E \u043F\u043E\n    <a href=\"http://nextgis.ru/blog/runivers/\" target=\"_blank\">\u0441\u0441\u044B\u043B\u043A\u0435</a>.\n    <div>v." + _package_json__WEBPACK_IMPORTED_MODULE_3__.version + "</div>\n  ";
    template.appendChild(readMore);
    openDialog({ template: template });
}
function getAffiliatedLinks(app) {
    var block = document.createElement('div');
    block.innerHTML = "\n  <a href=\"https://www.runivers.ru\"\n    title=\"\u042D\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u0430\u044F  \u044D\u043D\u0446\u0438\u043A\u043B\u043E\u043F\u0435\u0434\u0438\u044F \u0438 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430 \u0420\u0443\u043D\u0438\u0432\u0435\u0440\u0441\"\n    class=\"affiliated-logo runiver__logo__min\" target=\"_blank\"\n  ></a>\n  <a href=\"https://histgeo.ru/laboratory.html\"\n    class=\"affiliated-logo laboratory__logo__min\" target=\"_blank\"\n    title=\"\u041B\u0430\u0431\u043E\u0440\u0430\u0442\u043E\u0440\u0438\u044F \u0438\u0441\u0442\u043E\u0440\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u0433\u0435\u043E\u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0438\"\n  ></a>\n  <a href=\"https://www.transneft.ru\"\n    class=\"affiliated-logo transneft__logo__min\" target=\"_blank\"\n    title=\"\u041F\u0410\u041E \u00AB\u0422\u0440\u0430\u043D\u0441\u043D\u0435\u0444\u0442\u044C\u00BB\"\n  ></a>\n  <a href=\"https://nextgis.ru\"\n    class=\"affiliated-logo nextgis__logo__min\" target=\"_blank\"\n    title=\"\u0420\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0430 \u0413\u0418\u0421 \u0438 \u043F\u0440\u043E\u0435\u043A\u0442\u044B\"\n  ></a>\n  <a href=\"#\" class=\"affiliated-logo settings__logo__min\" target=\"_blank\" title=\"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438\"></a>\n  ";
    var settings = block.getElementsByClassName('settings__logo__min')[0];
    if (settings) {
        settings.onclick = function (e) {
            e.preventDefault();
            openSettingsDialog(app);
        };
    }
    return block;
}
function getAffiliatedPanel(controls) {
    var block = getAffiliatedLinks(controls.app);
    var panel = new _Panels_PanelControl__WEBPACK_IMPORTED_MODULE_4__["Panel"]({
        addClass: 'panel-links',
    });
    panel.updateBody(block);
    return panel;
}
function getHomeBtnControl(control) {
    var _control = control.app.webMap.createButtonControl({
        addClass: 'mapboxgl-ctrl-icon mapboxgl-ctrl-home',
        onClick: function () {
            return control.app.options.bounds &&
                control.app.webMap.fitBounds(control.app.options.bounds);
        },
    });
    return _control;
}
function getTimelineButton() {
    var link = document.createElement('a');
    link.className = 'panel__toggler graph_logo';
    link.setAttribute('href', 'https://www.runivers.ru/granitsy-rossii/charts/index.php');
    link.setAttribute('title', 'График изменения территории России');
    link.setAttribute('target', '_blank');
    return link;
}


/***/ }),

/***/ "./src/components/Links/Toggler.ts":
/*!*****************************************!*\
  !*** ./src/components/Links/Toggler.ts ***!
  \*****************************************/
/*! exports provided: Toggler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Toggler", function() { return Toggler; });
var Toggler = (function () {
    function Toggler(options) {
        this.options = options;
        this._status = true;
        this._status =
            this.options.status !== undefined ? this.options.status : this._status;
        this._container = this._createContainer();
        this._updateContainer();
    }
    Toggler.prototype.getContainer = function () {
        return this._container;
    };
    Toggler.prototype.toggle = function (status) {
        if (status === void 0) { status = !this._status; }
        this._status = status;
        this._updateContainer();
    };
    Toggler.prototype._createContainer = function () {
        var _this = this;
        var block = document.createElement('div');
        block.className = 'panel__toggler';
        if (this.options.className) {
            this.options.className.split(' ').forEach(function (x) { return block.classList.add(x); });
        }
        var toggleAction = this.options.toggleAction;
        if (toggleAction) {
            block.addEventListener('click', function () {
                _this.toggle();
                toggleAction(_this._status);
            });
        }
        return block;
    };
    Toggler.prototype._updateContainer = function () {
        var title = this._status ? this.options.title : this.options.titleOff;
        if (title) {
            this._container.title = title;
            if (this._status) {
                this._container.classList.add('active');
            }
            else {
                this._container.classList.remove('active');
            }
        }
    };
    return Toggler;
}());



/***/ }),

/***/ "./src/components/Links/aboutEn.ts":
/*!*****************************************!*\
  !*** ./src/components/Links/aboutEn.ts ***!
  \*****************************************/
/*! exports provided: aboutShortEn */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "aboutShortEn", function() { return aboutShortEn; });
var aboutShortEn = "\n<div style=\"margin-top: 40px;\"></div>\n<div class=\"partner_logos\">\n<a href=\"https://www.runivers.ru\" target=\"_blank\"><img src=\"images/Runivers-Logo-color.svg\" /></a>\n<a href=\"https://www.transneft.ru\" target=\"_blank\"><img src=\"images/Transneft_logo1.png\" /></a>\n<a href=\"https://histgeo.ru/laboratory.html\" target=\"_blank\"><img src=\"images/geolab.png\" /></a>\n<a href=\"https://nextgis.com\" target=\"_blank\"><img src=\"images/nextgis.png\" /></a>\n</div>\n<div style=\"margin-top: 40px;\"></div>\n<P LANG=\"en-GB\" CLASS=\"western\" ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n<h2>Russia\u2019s Borders from 1462 through 2018\u2019 Project</h2></P>\n<P LANG=\"en-GB\" CLASS=\"western\" ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n\n<SPAN LANG=\"en-EN\"><a href=\"https://www.runivers.ru\" target=\"_blank\">Runivers</a>\n\npresents \u2018Russia\u2019s Borders from 1462 through 2018\u2019 \u2013\na project designed in collaboration with the\n<a href=\"https://histgeo.ru/laboratory.html\" target=\"_blank\">\nLaboratory of Historical Geomatics</a> at the Institute of World History\nof the Russian Academy of Sciences (RAS) and\n<a href=\"http://nextgis.com\" target=\"_blank\">NextGIS Ltd.</a>\n</SPAN></P>\n\n<P LANG=\"en-GB\" CLASS=\"western\" ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n<SPAN LANG=\"en-EN\">\nThis cartographic project contains geographical information on the political borders\nof the contemporary Russian Federation and its predecessor states.\nAn opportunity to select any year in the 1462 to 2018 time bracket is a crucial option of this map.\nTo choose the needed year, the users either click at the needed point on the timeline (at the bottom of the map)\nor launch its step-by-step automatic rewinding or else use the + or \u2013\nicons to the right of the timeline, thus moving one year backwards or forwards.\n</SPAN></P>\n\n<P LANG=\"en-GB\" CLASS=\"western\" ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n<A NAME=\"OLE_LINK210\"></A><A NAME=\"OLE_LINK209\"></A>\n<SPAN LANG=\"en-EN\">\nThe realization that the forms of a political status of lands are multiple and that,\non the other hand, this diversity should be reduced to a limited number of versions for\ndepiction on the map has prompted us to single out seven different statuses of the territory\nof today\u2019s Russia and its predecessors.\n</SPAN></P>\n<P LANG=\"en-GB\" CLASS=\"western\" ALIGN=JUSTIFY STYLE=\"margin-bottom: 0in\">\n<SPAN LANG=\"en-EN\">\n1) The mainland of the state.\n</SPAN></P>\n<P LANG=\"en-GB\" CLASS=\"western\" ALIGN=JUSTIFY STYLE=\"margin-bottom: 0in\">\n<SPAN LANG=\"en-EN\">\n2) A territory under protectorate, vassal allegiance or in the sphere of influence.\n</SPAN></P>\n<P LANG=\"en-EN\" CLASS=\"western\" ALIGN=JUSTIFY STYLE=\"margin-bottom: 0in\">\n3) A leased territory.\n</P>\n<P LANG=\"en-GB\" CLASS=\"western\" ALIGN=JUSTIFY STYLE=\"margin-bottom: 0in\">\n<SPAN LANG=\"en-EN\">\n4) A territory in joint possession.\n</SPAN></P>\n<P LANG=\"en-GB\" CLASS=\"western\" ALIGN=JUSTIFY STYLE=\"margin-bottom: 0in\">\n<SPAN LANG=\"en-EN\">\n5) A litigious territory.\n</SPAN></P>\n<P LANG=\"en-GB\" CLASS=\"western\" ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n\n<P LANG=\"en-GB\" CLASS=\"western\" ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n<A NAME=\"OLE_LINK222\"></A><A NAME=\"OLE_LINK221\"></A>\n<SPAN LANG=\"en-EN\">\nChanges in the configuration of the border in relevant years are shown in separate polygons as: 6.\nthe newly acquired territories or, 7. lost territories.\nThese polygons have the tokens, the numbers on which correspond to positions in the list of\nterritorial changes found in the info bar.\nTerritorial changes occurred in different months of the year \u2013 sometimes in the first half of the year,\nand sometime in the second half, and that is why the polygons with statuses 6 and 7 sometimes stay on\nand get over to the year that followed a specified event.\n</SPAN></P>\n<P LANG=\"en-GB\" CLASS=\"western\" ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n<SPAN LANG=\"en-EN\">\nThe differentiation is reflected in popup windows,\nwhich the users can bring up by clicking at any object inside the political borders.\nThe polygons are filled with four colors. One color shows the mainland of the state and the newly\nincorporated lands (statuses 1 and 6); the second color marks the lands that have a certain degree\nof dependence on the state (status 2); the third color brings out the leased and litigious areas or\nthe lands governed jointly with other countries (statuses 3 and 5).\nThe lost territories (status 7) are marked with the fourth color but owing to certain technology\npeculiarities of the current algorithm of geometrical arrangements formation some of the lost territories\nare not displayed on the map with the aid of separate polygons. A click at any polygon will call up\nthe information on the chronological range, in which a territorial entity existed, and on its size (in sq. km).\n</SPAN></P>\n\n<P LANG=\"en-GB\" CLASS=\"western\" ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n<SPAN LANG=\"en-EN\">\nPlaced in the center of each polygon is a token that helps the users find an appropriate\nlocation on a small-scale map. A click at the token will retrieve the data on the event\nthat resulted in the formation of the specific territorial entity.\n</SPAN></P>\n<P LANG=\"en-GB\" CLASS=\"western\" ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n<SPAN LANG=\"en-EN\">\nThree button icons are available in the upper right-hand corner of the map.\nThe first one switches the contemporary basemap off, while two others make it\npossible to handle the presentation of two data units of the map.\nThe first unit shows the name, title/ official position and the years in office of the person\nwho ruled the territory in the year chosen by the user. It also contains a reference to a special page\nat the website that offers detailed information. The lower data unit provides information\non the territorial changes in the selected year, as well as on an approximate size of the lands\nthat were incorporated into the nation or, vice versa, were lost.\n</SPAN></P>\n<P LANG=\"en-GB\" CLASS=\"western\" ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n<SPAN LANG=\"en-EN\">\n\u2018The Borders of the Duchy of Muscovy/ Czardom of Russia/ Russian Empire/ USSR/\nRussian Federation from 1462 through 2018\u2019 web GIS rests on the concept of a dynamic map.\nAs regards the technical implementation, this concept embodies an original solution developed at the\n<a href=\"https://histgeo.ru/laboratory.html\" target=\"_blank\">Laboratory of Historical Geomatics</a>\nof the RAS Institute of World History in cooperation with\n<a href=\"http://nextgis.com\" target=\"_blank\">NextGIS Ltd.</a>\n</SPAN></P>\n\n<P LANG=\"en-GB\" CLASS=\"western\" ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n<SPAN LANG=\"en-EN\">\nPractical applicability of this project for research purposes makes it stand out among other projects of this kind.\nThe dynamic maps displaying the past changes of state borders most typically have an educational\nfocus and historians do not have a chance to amend them after expert debates.\nConversely, the dynamic map released now is open for future amendments and is called upon\nto serve as an instrumental cartographic aid for the scholars of history who use GIS technologies\nto attain specified research objectives.\n\n\n<P LANG=\"en-GB\" CLASS=\"western\" ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n<SPAN LANG=\"en-EN\">\nTechnical implementation  <a href=\"http://nextgis.com/blog/runivers/\" target=\"_blank\">description</a>.\n</SPAN></P>\n";


/***/ }),

/***/ "./src/components/Links/aboutRu.ts":
/*!*****************************************!*\
  !*** ./src/components/Links/aboutRu.ts ***!
  \*****************************************/
/*! exports provided: aboutShortRu */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "aboutShortRu", function() { return aboutShortRu; });
var aboutShortRu = "\n<div style=\"margin-top: 40px;\"></div>\n<div class=\"partner_logos\">\n<a href=\"https://www.runivers.ru\" target=\"_blank\"><img src=\"images/Runivers-Logo-color.svg\" /></a>\n<a href=\"https://www.transneft.ru\" target=\"_blank\"><img src=\"images/Transneft_logo1.png\" /></a>\n<a href=\"https://histgeo.ru/laboratory.html\" target=\"_blank\"><img src=\"images/geolab.png\" /></a>\n<a href=\"https://nextgis.ru\" target=\"_blank\"><img src=\"images/nextgis.png\" /></a>\n</div>\n\n<div style=\"margin-top: 20px;\"></div>\n\n<div class=\"switch-about-language\">\n<a class=\"switch-about-language-btn\" name=\"en\" href=\"#\" style=\"font-size: 1.2rem; font-weight: bold;\">\nEnglish version\n</a>\n</div>\n\n<div style=\"margin-top: 20px;\"></div>\n<P ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n<h2>\u041E \u043F\u0440\u043E\u0435\u043A\u0442\u0435 \u0413\u0440\u0430\u043D\u0438\u0446\u044B \u0420\u043E\u0441\u0441\u0438\u0438 850-2018 \u0433\u0433.</h2></P>\n\n<P ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n<a href=\"https://www.runivers.ru\" target=\"_blank\">\u00AB\u0420\u0443\u043D\u0438\u0432\u0435\u0440\u0441\u00BB</a> \u0441\u043E\u0432\u043C\u0435\u0441\u0442\u043D\u043E \u0441 <a href=\"https://histgeo.ru/laboratory.html\" target=\"_blank\">\u041B\u0430\u0431\u043E\u0440\u0430\u0442\u043E\u0440\u0438\u0435\u0439 \u0438\u0441\u0442\u043E\u0440\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u0433\u0435\u043E\u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0438</a> \u0418\u043D\u0441\u0442\u0438\u0442\u0443\u0442\u0430 \u0432\u0441\u0435\u043E\u0431\u0449\u0435\u0439 \u0438\u0441\u0442\u043E\u0440\u0438\u0438 \u0420\u0410\u041D \u0438 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0435\u0439 <a href=\"http://nextgis.ru/\" target=\"_blank\">NextGIS</a> \u0440\u0430\u0441\u0448\u0438\u0440\u044F\u0435\u0442 \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0439 \u0440\u0430\u043D\u0435\u0435 \u043F\u0440\u043E\u0435\u043A\u0442 \u00AB\u0413\u0440\u0430\u043D\u0438\u0446\u044B \u0420\u043E\u0441\u0441\u0438\u0438 1462\u20132018 \u0433\u0433.\u00BB \u0437\u0430 \u0441\u0447\u0435\u0442 \u0443\u0432\u0435\u043B\u0438\u0447\u0435\u043D\u0438\u044F \u0445\u0440\u043E\u043D\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u043E\u0433\u043E \u043E\u0445\u0432\u0430\u0442\u0430 \u0438 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u043D\u043E\u0432\u044B\u0445 \u0441\u043B\u043E\u0435\u0432. \u0422\u0435\u043F\u0435\u0440\u044C \u0434\u0430\u043D\u043D\u044B\u0439 \u043F\u0440\u043E\u0435\u043A\u0442 \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u00AB\u0413\u0440\u0430\u043D\u0438\u0446\u044B \u0420\u0443\u0441\u0438, \u0420\u043E\u0441\u0441\u0438\u0438, \u0421\u0421\u0421\u0420 \u0438 \u0420\u0424 850\u20132018 \u0433\u0433.\u00BB.\n</P>\n<P ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n\u042D\u0442\u043E\u0442 \u043A\u0430\u0440\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u043F\u0440\u043E\u0435\u043A\u0442 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u0442 \u0433\u0435\u043E\u0434\u0430\u043D\u043D\u044B\u0435 \u043E \u043F\u043E\u043B\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0445 \u0433\u0440\u0430\u043D\u0438\u0446\u0430\u0445 \u0441\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E\u0439 \u0420\u043E\u0441\u0441\u0438\u0438 \u0438 \u0435\u0435 \u043F\u0440\u0435\u0434\u0448\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u0438\u043A\u043E\u0432. \u0412\u0430\u0436\u043D\u0435\u0439\u0448\u0435\u0439 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C\u044E, \u043A\u043E\u0442\u043E\u0440\u0443\u044E \u043F\u0440\u0435\u0434\u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442 \u0434\u0430\u043D\u043D\u0430\u044F \u043A\u0430\u0440\u0442\u0430, \u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0432\u044B\u0431\u043E\u0440 \u043B\u044E\u0431\u043E\u0433\u043E \u0433\u043E\u0434\u0430 \u0432 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0435 \u043A\u0430\u0440\u0442\u044B. \u0413\u043E\u0434 \u043C\u043E\u0436\u043D\u043E \u0432\u044B\u0431\u0440\u0430\u0442\u044C, \u043A\u043B\u0438\u043A\u043D\u0443\u0432 \u043C\u044B\u0448\u043A\u043E\u0439 \u0432 \u043D\u0443\u0436\u043D\u043E\u043C \u043C\u0435\u0441\u0442\u0435 \u043B\u0435\u043D\u0442\u044B \u0432\u0440\u0435\u043C\u0435\u043D\u0438 (\u0432 \u043D\u0438\u0436\u043D\u0435\u0439 \u0447\u0430\u0441\u0442\u0438 \u043A\u0430\u0440\u0442\u044B), \u043B\u0438\u0431\u043E \u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0432 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0443\u044E \u043F\u0440\u043E\u043A\u0440\u0443\u0442\u043A\u0443 \u043B\u0435\u043D\u0442\u044B \u0432\u0440\u0435\u043C\u0435\u043D\u0438 \u0441 \u0448\u0430\u0433\u043E\u043C \u0432 \u043E\u0434\u0438\u043D \u0433\u043E\u0434, \u043B\u0438\u0431\u043E, \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u044F \u0438\u043A\u043E\u043D\u043A\u0438 + \u0438 \u2013 \u0441\u043F\u0440\u0430\u0432\u0430 \u043E\u0442 \u043B\u0435\u043D\u0442\u044B \u0432\u0440\u0435\u043C\u0435\u043D\u0438, \u0441\u0434\u0432\u0438\u0433\u0430\u0442\u044C\u0441\u044F \u043D\u0430 \u043E\u0434\u0438\u043D \u0433\u043E\u0434 \u0432\u043B\u0435\u0432\u043E \u0438\u043B\u0438 \u0432\u043F\u0440\u0430\u0432\u043E.\n</P>\n\n<P ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n\u041F\u043E\u043D\u044F\u0442\u043D\u043E, \u0447\u0442\u043E \u043D\u0430\u0447\u0430\u043B\u044C\u043D\u0430\u044F \u0434\u0430\u0442\u0430 \u0437\u0430\u044F\u0432\u043B\u0435\u043D\u043D\u043E\u0433\u043E \u0445\u0440\u043E\u043D\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u043E\u0433\u043E \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0430 \u0441\u043E\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u043E \u0443\u0441\u043B\u043E\u0432\u043D\u0430. \u041E\u043D\u0430 \u043F\u0440\u0438\u0437\u0432\u0430\u043D\u0430 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0440\u0430\u0441\u0441\u0435\u043B\u0435\u043D\u0438\u0435 \u0441\u043B\u0430\u0432\u044F\u043D\u0441\u043A\u0438\u0445 \u043F\u043B\u0435\u043C\u0435\u043D \u0432 \u0412\u043E\u0441\u0442\u043E\u0447\u043D\u043E\u0439 \u0415\u0432\u0440\u043E\u043F\u0435 \u043D\u0430\u043A\u0430\u043D\u0443\u043D\u0435 \u0441\u043E\u0431\u044B\u0442\u0438\u0439, \u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0445 \u043A\u0430\u043A \u00AB\u043F\u0440\u0438\u0437\u0432\u0430\u043D\u0438\u0435 \u0420\u044E\u0440\u0438\u043A\u0430\u00BB. \u0411\u043E\u043B\u0435\u0435 \u0440\u0430\u043D\u043D\u044F\u044F \u00AB\u043D\u0438\u0436\u043D\u044F\u044F\u00BB \u0433\u0440\u0430\u043D\u0438\u0446\u0430 \u043F\u043E\u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043B\u0430 \u0431\u044B \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0433\u043E \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439 \u0432 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u044F\u0445, \u0437\u0430\u043D\u044F\u0442\u044B\u0445 \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u044B\u043C\u0438 \u0432\u043E\u0441\u0442\u043E\u0447\u043D\u043E\u0441\u043B\u0430\u0432\u044F\u043D\u0441\u043A\u0438\u043C\u0438 \u044D\u0442\u043D\u0438\u0447\u0435\u0441\u043A\u0438\u043C\u0438 \u0433\u0440\u0443\u043F\u043F\u0430\u043C\u0438, \u0447\u0442\u043E \u0441 \u0442\u0440\u0443\u0434\u043E\u043C \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u043C\u043E \u0434\u0430\u0436\u0435 \u043F\u043E \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0430\u043C \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0445 \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u0439. \u0422\u0430\u043A\u0438\u043C \u043E\u0431\u0440\u0430\u0437\u043E\u043C, \u043D\u043E\u0432\u044B\u0435 \u0441\u043B\u043E\u0438 \u043F\u043E\u043B\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0445 \u0433\u0440\u0430\u043D\u0438\u0446 \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u044E\u0442 \u043E\u0445\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u0438\u0437\u043E\u0432\u0430\u0442\u044C \u0440\u0443\u0441\u0441\u043A\u0443\u044E \u0438\u0441\u0442\u043E\u0440\u0438\u044E \u0434\u043E 1462 \u0433.\n</P>\n<P ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n\u0414\u043B\u044F \u043F\u0435\u0440\u0432\u043E\u0433\u043E \u043F\u0435\u0440\u0438\u043E\u0434\u0430 \u0440\u0443\u0441\u0441\u043A\u043E\u0439 \u0438\u0441\u0442\u043E\u0440\u0438\u0438 \u044D\u0442\u043E \u0441\u0434\u0435\u043B\u0430\u043D\u043E \u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u0443\u0442\u0435\u043C \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F \u0432\u043D\u0435\u0448\u043D\u0438\u0445 \u0433\u0440\u0430\u043D\u0438\u0446 \u0433\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0441\u0442\u0438, \u043D\u043E \u0438 \u0433\u0440\u0430\u043D\u0438\u0446 \u0432\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u0438\u0445, \u043F\u0440\u0438\u043D\u0430\u0434\u043B\u0435\u0436\u0430\u0449\u0438\u0445, \u0443\u0441\u043B\u043E\u0432\u043D\u043E \u0433\u043E\u0432\u043E\u0440\u044F, \u043A \u00AB\u0432\u0435\u0440\u0445\u043D\u0435\u043C\u0443\u00BB \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043D\u043E\u043C\u0443 \u0443\u0440\u043E\u0432\u043D\u044E. \u041F\u0440\u0438 \u0432\u0441\u0435\u0439 \u0443\u0441\u043B\u043E\u0432\u043D\u043E\u0441\u0442\u0438 \u0441\u0430\u043C\u043E\u0433\u043E \u043F\u043E\u043D\u044F\u0442\u0438\u044F \u00AB\u043A\u043D\u044F\u0436\u0435\u0441\u0442\u0432\u043E\u00BB \u0434\u043B\u044F \u043F\u0435\u0440\u0432\u043E\u0439 \u043F\u043E\u043B\u043E\u0432\u0438\u043D\u044B \u0432\u043E\u0441\u0442\u043E\u0447\u043D\u043E\u0435\u0432\u0440\u043E\u043F\u0435\u0439\u0441\u043A\u043E\u0439 \u043F\u043E\u043B\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u0438\u0441\u0442\u043E\u0440\u0438\u0438, \u043E \u0447\u0435\u043C \u043F\u0438\u0448\u0443\u0442 \u0441\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0435 \u0438\u0441\u0442\u043E\u0440\u0438\u043A\u0438 (<a href=\"https://runivers.ru/include/doc/rusland/main_text_detail.php\">https://runivers.ru/include/doc/rusland/main_text_detail.php</a>), \u0444\u043E\u0440\u043C\u0430\u0442 \u0434\u0438\u043D\u0430\u043C\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u043A\u0430\u0440\u0442\u044B \u0432\u044B\u043D\u0443\u0436\u0434\u0430\u0435\u0442 \u043A \u0442\u043E\u043C\u0443, \u0447\u0442\u043E\u0431\u044B \u0443\u043F\u0440\u043E\u0441\u0442\u0438\u0442\u044C \u0438\u0441\u0442\u043E\u0440\u0438\u0447\u0435\u0441\u043A\u0443\u044E \u0440\u0435\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u0438 \u043F\u0440\u0438\u0434\u0430\u0442\u044C \u043F\u043E\u043B\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u043C\u0443 \u043B\u0430\u043D\u0434\u0448\u0430\u0444\u0442\u0443 \u00AB\u043E\u0441\u044F\u0437\u0430\u0435\u043C\u044B\u0435\u00BB \u043A\u043E\u043D\u0442\u0443\u0440\u044B \u0432 \u0432\u0438\u0434\u0435 \u043D\u0430\u0431\u043E\u0440\u0430 \u043F\u043E\u043B\u0438\u0433\u043E\u043D\u043E\u0432.\n</P>\n<P ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n\u041A \u00AB\u0432\u0435\u0440\u0445\u043D\u0435\u043C\u0443\u00BB \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043D\u043E\u043C\u0443 \u0443\u0440\u043E\u0432\u043D\u044E \u043E\u0442\u043D\u0435\u0441\u0435\u043D\u044B \u043A\u043D\u044F\u0436\u0435\u0441\u0442\u0432\u0430, \u043E\u0431\u043B\u0430\u0434\u0430\u0432\u0448\u0438\u0435 \u0441\u0430\u043C\u043E\u0441\u0442\u043E\u044F\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C\u044E, \u043D\u043E \u0432\u0445\u043E\u0434\u0438\u0432\u0448\u0438\u0435 \u0432 \u0442\u0443 \u0438\u043B\u0438 \u0438\u043D\u0443\u044E \u043F\u043E\u043B\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u0443\u044E \u0441\u0438\u0441\u0442\u0435\u043C\u0443 (\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440, \u0412\u0435\u043B\u0438\u043A\u043E\u0433\u043E \u043A\u043D\u044F\u0436\u0435\u0441\u0442\u0432\u0430 \u0412\u043B\u0430\u0434\u0438\u043C\u0438\u0440\u0441\u043A\u043E\u0433\u043E). \u0423\u0434\u0435\u043B\u044C\u043D\u044B\u0435 \u043A\u043D\u044F\u0436\u0435\u0441\u0442\u0432\u0430 \u043E\u0442\u043D\u043E\u0441\u044F\u0442\u0441\u044F \u043A \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0430\u043B\u044C\u043D\u044B\u043C \u0435\u0434\u0438\u043D\u0438\u0446\u0430\u043C \u0443\u0440\u043E\u0432\u043D\u0435\u043C \u043D\u0438\u0436\u0435, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u043D\u0430 \u043A\u0430\u0440\u0442\u0435 \u043D\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u043B\u0438\u0441\u044C.\n</P>\n<P ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n\u041F\u043E\u043D\u0438\u043C\u0430\u044F, \u0447\u0442\u043E, \u0441 \u043E\u0434\u043D\u043E\u0439 \u0441\u0442\u043E\u0440\u043E\u043D\u044B, \u0444\u043E\u0440\u043C\u044B \u043F\u043E\u043B\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0433\u043E \u0441\u0442\u0430\u0442\u0443\u0441\u0430 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0439 \u043C\u043D\u043E\u0433\u043E\u043E\u0431\u0440\u0430\u0437\u043D\u044B \u0438 \u0447\u0442\u043E, \u0441 \u0434\u0440\u0443\u0433\u043E\u0439 \u0441\u0442\u043E\u0440\u043E\u043D\u044B, \u044D\u0442\u043E \u043C\u043D\u043E\u0433\u043E\u043E\u0431\u0440\u0430\u0437\u0438\u0435 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0441\u0432\u0435\u0441\u0442\u0438 \u043A \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u043D\u043E\u043C\u0443 \u0447\u0438\u0441\u043B\u0443 \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u043E\u0432 \u043F\u0440\u0438 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0438 \u043D\u0430 \u043A\u0430\u0440\u0442\u0435, \u043C\u044B \u0432\u044B\u0434\u0435\u043B\u0438\u043B\u0438 \u0432\u0441\u0435\u0433\u043E \u0432\u043E\u0441\u0435\u043C\u044C \u0440\u0430\u0437\u043B\u0438\u0447\u043D\u044B\u0445 \u0441\u0442\u0430\u0442\u0443\u0441\u043E\u0432 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0438 \u0420\u043E\u0441\u0441\u0438\u0438 \u0438\u043B\u0438 \u0435\u0435 \u043F\u0440\u0435\u0434\u0448\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u0438\u043A\u043E\u0432:</br>\n</P>\n<P ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n1) \u041E\u0441\u043D\u043E\u0432\u043D\u0430\u044F \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u044F \u0433\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u0430.</br>\n2) \u0422\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u044F \u043F\u043E\u0434 \u043F\u0440\u043E\u0442\u0435\u043A\u0442\u043E\u0440\u0430\u0442\u043E\u043C, \u0432 \u0432\u0430\u0441\u0441\u0430\u043B\u044C\u043D\u043E\u0439 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u0438\u043B\u0438 \u0432 \u0441\u0444\u0435\u0440\u0435 \u0432\u043B\u0438\u044F\u043D\u0438\u044F.</br>\n3) \u0410\u0440\u0435\u043D\u0434\u043E\u0432\u0430\u043D\u043D\u0430\u044F \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u044F.</br>\n4) \u0422\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u044F \u0432 \u0441\u043E\u0432\u043C\u0435\u0441\u0442\u043D\u043E\u043C \u0432\u043B\u0430\u0434\u0435\u043D\u0438\u0438.</br>\n5) \u0421\u043F\u043E\u0440\u043D\u0430\u044F \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u044F.</br>\n</P>\n<P ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n\u041A\u0440\u043E\u043C\u0435 \u0442\u043E\u0433\u043E, \u0432 \u0433\u043E\u0434 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u0438 \u0433\u0440\u0430\u043D\u0438\u0446\u044B \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0439 \u0443\u0447\u0430\u0441\u0442\u043E\u043A \u043F\u043E\u043A\u0430\u0437\u0430\u043D \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u044B\u043C \u043F\u043E\u043B\u0438\u0433\u043E\u043D\u043E\u043C: \u043A\u0430\u043A \u041D\u043E\u0432\u0430\u044F \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u044F (6) \u0438\u043B\u0438, \u043D\u0430\u043F\u0440\u043E\u0442\u0438\u0432, \u043A\u0430\u043A \u0423\u0442\u0440\u0430\u0447\u0435\u043D\u043D\u0430\u044F \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u044F (7). \u042D\u0442\u0438 \u043F\u043E\u043B\u0438\u0433\u043E\u043D\u044B \u0442\u0430\u043A\u0436\u0435 \u0441\u043D\u0430\u0431\u0436\u0435\u043D\u044B \u043C\u0430\u0440\u043A\u0435\u0440\u0430\u043C\u0438, \u0446\u0438\u0444\u0440\u0430 \u043D\u0430 \u043A\u043E\u0442\u043E\u0440\u044B\u0445 \u043E\u0431\u043E\u0437\u043D\u0430\u0447\u0430\u0435\u0442 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044E\u0449\u0443\u044E \u043F\u043E\u0437\u0438\u0446\u0438\u044E \u0432 \u0441\u043F\u0438\u0441\u043A\u0435 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0430\u043B\u044C\u043D\u044B\u0445 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u043E\u043D\u043D\u043E\u0439 \u043F\u0430\u043D\u0435\u043B\u0438. \u0412 \u0441\u0432\u044F\u0437\u0438 \u0441 \u0442\u0435\u043C, \u0447\u0442\u043E \u043D\u0435\u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0438 \u0438\u043C\u0435\u043B\u0438 \u043C\u0435\u0441\u0442\u043E \u0432 \u0440\u0430\u0437\u043D\u044B\u0435 \u043C\u0435\u0441\u044F\u0446\u044B \u0433\u043E\u0434\u0430, \u0438\u043D\u043E\u0433\u0434\u0430 \u043F\u043E\u043B\u0438\u0433\u043E\u043D\u044B \u0441\u043E \u0441\u0442\u0430\u0442\u0443\u0441\u0430\u043C\u0438 6 \u0438 7 \u0437\u0430\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u044E\u0442\u0441\u044F \u043D\u0430 \u043A\u0430\u0440\u0442\u0435 \u0438 \u0432 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u043C \u043F\u043E\u0441\u043B\u0435 \u0441\u043E\u0431\u044B\u0442\u0438\u044F \u0433\u043E\u0434\u0443.\n</P>\n<P ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n8) \u0414\u043B\u044F \u043F\u0435\u0440\u0438\u043E\u0434\u0430 \u0434\u043E 1462 \u0433. \u2014 \u0441\u0430\u043C\u043E\u0441\u0442\u043E\u044F\u0442\u0435\u043B\u044C\u043D\u0430\u044F \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u044F (\u043A\u043D\u044F\u0436\u0435\u0441\u0442\u0432\u043E \u0438 \u0442.\u043F.), \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u044F\u044E\u0449\u0430\u044F \u0432\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u0438\u0435 \u0433\u0440\u0430\u043D\u0438\u0446\u044B \u043A\u0430\u0440\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u043E\u0433\u043E \u0440\u0435\u0433\u0438\u043E\u043D\u0430 (\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440, \u0422\u0432\u0435\u0440\u0441\u043A\u043E\u0435 \u043A\u043D\u044F\u0436\u0435\u0441\u0442\u0432\u043E \u0434\u043E 1382 \u0433. \u0432\u043D\u0443\u0442\u0440\u0438 \u0412\u0435\u043B\u0438\u043A\u043E\u0433\u043E \u043A\u043D\u044F\u0436\u0435\u0441\u0442\u0432\u0430 \u0412\u043B\u0430\u0434\u0438\u043C\u0438\u0440\u0441\u043A\u043E\u0433\u043E).\n</P>\n<P ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n\u042D\u0442\u0430 \u0434\u0438\u0444\u0444\u0435\u0440\u0435\u043D\u0446\u0438\u0430\u0446\u0438\u044F \u043E\u0442\u0440\u0430\u0436\u0435\u043D\u0430 \u0432\u043E \u0432\u0441\u043F\u043B\u044B\u0432\u0430\u044E\u0449\u0435\u043C \u043E\u043A\u043D\u0435, \u0432\u044B\u0437\u044B\u0432\u0430\u0435\u043C\u043E\u043C \u043F\u043E \u043A\u043B\u0438\u043A\u0443 \u043C\u044B\u0448\u0438 \u043D\u0430 \u043B\u044E\u0431\u043E\u043C \u043E\u0431\u044A\u0435\u043A\u0442\u0435 \u0432\u043D\u0443\u0442\u0440\u0438 \u043F\u043E\u043B\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0445 \u0433\u0440\u0430\u043D\u0438\u0446. \u0421\u043B\u0435\u0434\u0443\u0435\u0442 \u043F\u043E\u043C\u043D\u0438\u0442\u044C, \u0447\u0442\u043E \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u044B, \u043E\u0442\u043D\u043E\u0441\u044F\u0449\u0438\u0435\u0441\u044F \u043A \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u044F\u043C \u0441\u0442\u0430\u0442\u0443\u0441\u0430 1\u20135, \u043F\u043E \u043A\u043B\u0438\u043A\u0443 \u043C\u044B\u0448\u0438 \u043F\u043E\u044F\u0432\u044F\u0442\u0441\u044F \u043B\u0438\u0448\u044C \u0432 \u0442\u043E\u043C \u0441\u043B\u0443\u0447\u0430\u0435, \u0435\u0441\u043B\u0438 \u0432 \u043C\u0435\u0441\u0442\u0435 \u043A\u043B\u0438\u043A\u0430 \u043D\u0430 \u043A\u0430\u0440\u0442\u0435 \u043D\u0435 \u043F\u043E\u043C\u0435\u0449\u0435\u043D\u0430 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u044F \u0441\u043E \u0441\u0442\u0430\u0442\u0443\u0441\u043E\u043C 8. \u0417\u0430\u043B\u0438\u0432\u043A\u0430 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0445 \u043F\u043E\u043B\u0438\u0433\u043E\u043D\u043E\u0432 \u043F\u0435\u0440\u0435\u0434\u0430\u043D\u0430 \u043F\u044F\u0442\u044C\u044E \u0446\u0432\u0435\u0442\u0430\u043C\u0438: \u043E\u0434\u043D\u0438\u043C \u0446\u0432\u0435\u0442\u043E\u043C \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u043D\u0430\u044F \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u044F \u0433\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u0430 \u0438 \u0432\u043D\u043E\u0432\u044C \u043F\u0440\u0438\u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u043D\u044B\u0435 \u0437\u0435\u043C\u043B\u0438 (\u0441\u0442\u0430\u0442\u0443\u0441\u044B 1 \u0438 6), \u0434\u0440\u0443\u0433\u0438\u043C \u0446\u0432\u0435\u0442\u043E\u043C \u2013 \u0437\u0435\u043C\u043B\u0438, \u043D\u0430\u0445\u043E\u0434\u044F\u0449\u0438\u0435\u0441\u044F \u0432 \u043D\u0435\u043A\u043E\u0442\u043E\u0440\u043E\u0439 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u043D\u0435\u0433\u043E (\u0441\u0442\u0430\u0442\u0443\u0441 2), \u0442\u0440\u0435\u0442\u044C\u0438\u043C \u2013 \u0437\u0435\u043C\u043B\u0438 \u0430\u0440\u0435\u043D\u0434\u043E\u0432\u0430\u043D\u043D\u044B\u0435, \u0441\u043F\u043E\u0440\u043D\u044B\u0435 \u0438 \u043D\u0430\u0445\u043E\u0434\u044F\u0449\u0438\u0435\u0441\u044F \u043F\u043E\u0434 \u0441\u043E\u0432\u043C\u0435\u0441\u0442\u043D\u044B\u043C \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435\u043C \u0441 \u0434\u0440\u0443\u0433\u0438\u043C\u0438 \u0433\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u0430\u043C\u0438 (\u0441\u0442\u0430\u0442\u0443\u0441\u044B 3\u20135). \u0423\u0442\u0440\u0430\u0447\u0435\u043D\u043D\u044B\u0435 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0438 \u043E\u0431\u043E\u0437\u043D\u0430\u0447\u0435\u043D\u044B \u0447\u0435\u0442\u0432\u0435\u0440\u0442\u044B\u043C \u0446\u0432\u0435\u0442\u043E\u043C (\u0441\u0442\u0430\u0442\u0443\u0441 7), \u043E\u0434\u043D\u0430\u043A\u043E \u0432 \u0441\u0438\u043B\u0443 \u0440\u044F\u0434\u0430 \u0442\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u0438\u0445 \u043E\u0441\u043E\u0431\u0435\u043D\u043D\u043E\u0441\u0442\u0435\u0439 \u0442\u0435\u043A\u0443\u0449\u0435\u0433\u043E \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C\u0430 \u043F\u043E\u0441\u0442\u0440\u043E\u0435\u043D\u0438\u044F \u0433\u0435\u043E\u043C\u0435\u0442\u0440\u0438\u0439 \u043D\u0435 \u0432\u0441\u0435 \u0443\u0442\u0440\u0430\u0447\u0435\u043D\u043D\u044B\u0435 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0438 \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u044B \u043D\u0430 \u043A\u0430\u0440\u0442\u0435 \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u044B\u043C \u043F\u043E\u043B\u0438\u0433\u043E\u043D\u043E\u043C.\n</P>\n<P ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n\u0412 \u0446\u0435\u043D\u0442\u0440\u0435 \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u043F\u043E\u043B\u0438\u0433\u043E\u043D\u0430, \u0434\u0435\u043C\u043E\u043D\u0441\u0442\u0440\u0438\u0440\u0443\u044E\u0449\u0435\u0433\u043E \u043F\u0440\u0438\u0440\u0430\u0449\u0435\u043D\u0438\u0435 \u0438\u043B\u0438 \u043F\u043E\u0442\u0435\u0440\u044E \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0438, \u043F\u043E\u043C\u0435\u0449\u0435\u043D \u043C\u0430\u0440\u043A\u0435\u0440, \u043F\u043E\u043C\u043E\u0433\u0430\u044E\u0449\u0438\u0439 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044E \u0431\u044B\u0441\u0442\u0440\u043E \u043D\u0430\u0439\u0442\u0438 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u0435 \u043C\u0435\u0441\u0442\u043E \u043D\u0430 \u043C\u0435\u043B\u043A\u043E\u043C\u0430\u0441\u0448\u0442\u0430\u0431\u043D\u043E\u0439 \u043A\u0430\u0440\u0442\u0435. \u041F\u043E \u043A\u043B\u0438\u043A\u0443 \u043D\u0430 \u043C\u0430\u0440\u043A\u0435\u0440 \u0432\u044B\u0434\u0430\u0435\u0442\u0441\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E \u0441\u043E\u0431\u044B\u0442\u0438\u0438, \u043F\u0440\u0438\u0432\u0435\u0434\u0448\u0435\u043C \u043A \u043F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u044E \u0434\u0430\u043D\u043D\u043E\u0433\u043E \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u044F.\n</P>\n<P ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n\u041F\u044F\u0442\u044B\u0439 \u0446\u0432\u0435\u0442 \u2014 \u0434\u043B\u044F \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0439 \u0441 \u0432\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u0438\u043C\u0438 \u0433\u0440\u0430\u043D\u0438\u0446\u0430\u043C\u0438. \u041F\u043E \u043A\u043B\u0438\u043A\u0443 \u043D\u0430 \u043B\u044E\u0431\u043E\u0439 \u043F\u043E\u043B\u0438\u0433\u043E\u043D \u043C\u043E\u0436\u043D\u043E \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 \u043E \u0445\u0440\u043E\u043D\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u043E\u043C \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D\u0435, \u0432 \u043A\u043E\u0442\u043E\u0440\u043E\u043C \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u043E\u0432\u0430\u043B\u043E \u0434\u0430\u043D\u043D\u043E\u0435 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0430\u043B\u044C\u043D\u043E\u0435 \u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u0435, \u0438 \u0435\u0433\u043E \u043F\u043B\u043E\u0449\u0430\u0434\u0438 (\u0432 \u043A\u0432\u0430\u0434\u0440\u0430\u0442\u043D\u044B\u0445 \u043A\u0438\u043B\u043E\u043C\u0435\u0442\u0440\u0430\u0445).\n</P>\n<P ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n\u041C\u043D\u043E\u0433\u0438\u0435 \u043F\u043E\u043B\u0438\u0433\u043E\u043D\u044B, \u043E\u0442\u043D\u043E\u0441\u0438\u043C\u044B\u0435 \u043A \u0441\u0442\u0430\u0442\u0443\u0441\u0443 2, \u043E\u0442\u043C\u0435\u0447\u0435\u043D\u044B \u0432\u043E \u0432\u0441\u043F\u043B\u044B\u0432\u0430\u044E\u0449\u0435\u043C \u043E\u043A\u043D\u0435 \u043A\u0430\u043A \u0437\u043E\u043D\u0430 \u0434\u0440\u0435\u0432\u043D\u0435\u0440\u0443\u0441\u0441\u043A\u043E\u0439 \u043A\u043E\u043B\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438. \u042D\u0442\u0430 \u0444\u043E\u0440\u043C\u0443\u043B\u0438\u0440\u043E\u0432\u043A\u0430 \u043F\u043E\u0434\u0440\u0430\u0437\u0443\u043C\u0435\u0432\u0430\u0435\u0442 \u0432 \u043E\u0441\u043D\u043E\u0432\u043D\u043E\u043C \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u044B\u0435 \u0437\u043E\u043D\u044B \u043C\u0435\u0436\u0434\u0443 \u043E\u0441\u043D\u043E\u0432\u043D\u044B\u043C \u043D\u0430\u0441\u0435\u043B\u0435\u043D\u0438\u0435\u043C \u0433\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u0430 \u0438 \u043D\u0430\u0441\u0435\u043B\u0435\u043D\u0438\u0435\u043C, \u043B\u0438\u0448\u044C \u0432\u043E\u0432\u043B\u0435\u043A\u0430\u0435\u043C\u044B\u043C \u0432 \u043E\u0442\u043D\u043E\u0448\u0435\u043D\u0438\u044F \u0441 \u043D\u0438\u043C. \u041F\u043E\u0441\u0442\u0435\u043F\u0435\u043D\u043D\u043E\u0435 \u043F\u0440\u043E\u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435 \u0434\u0440\u0435\u0432\u043D\u0435\u0440\u0443\u0441\u0441\u043A\u043E\u0433\u043E \u0437\u0435\u043C\u043B\u0435\u0434\u0435\u043B\u044C\u0447\u0435\u0441\u043A\u043E\u0433\u043E \u043D\u0430\u0441\u0435\u043B\u0435\u043D\u0438\u044F \u043D\u0430 \u0432\u043E\u0441\u0442\u043E\u043A \u0438 \u044E\u0433\u043E-\u0432\u043E\u0441\u0442\u043E\u043A \u0432 \u043A\u043E\u043D\u0435\u0447\u043D\u043E\u043C \u0438\u0442\u043E\u0433\u0435 \u043F\u0440\u0438\u0432\u043E\u0434\u0438\u043B\u043E \u043A \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044E \u043E\u0441\u0432\u043E\u0435\u043D\u043D\u043E\u0439 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0438 \u0432 \u043E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u043A\u043E\u043D\u0442\u0443\u0440 \u0433\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u0430, \u043D\u043E \u043F\u0440\u043E\u0446\u0435\u0441\u0441 \u044D\u0442\u043E\u0442 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u043E\u0434\u043D\u043E\u0437\u043D\u0430\u0447\u043D\u043E \u0437\u0430\u0444\u0438\u043A\u0441\u0438\u0440\u043E\u0432\u0430\u043D \u0432 \u043F\u0440\u043E\u0441\u0442\u0440\u0430\u043D\u0441\u0442\u0432\u0435 \u0438 \u0432\u0440\u0435\u043C\u0435\u043D\u0438.\n</P>\n<P ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n\u0411\u043E\u043B\u0435\u0435 \u043F\u043E\u0434\u0440\u043E\u0431\u043D\u043E\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0439, \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044B\u0445 \u043D\u0430 \u043A\u0430\u0440\u0442\u0435, \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E \u043F\u043E \u0441\u0441\u044B\u043B\u043A\u0435 \u0438\u0437 \u043E\u043A\u043D\u0430, \u0432\u0441\u043F\u043B\u044B\u0432\u0430\u044E\u0449\u0435\u0433\u043E \u043F\u043E \u043A\u043B\u0438\u043A\u0443 \u043C\u044B\u0448\u043A\u0438 \u043D\u0430 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u0439 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0438, \u043A\u043E\u0442\u043E\u0440\u0430\u044F \u0432\u0435\u0434\u0435\u0442 \u043D\u0430 \u0441\u0430\u0439\u0442 \u00AB\u0420\u0443\u043D\u0438\u0432\u0435\u0440\u0441\u00BB.\n</P>\n<P ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n\u041A\u0440\u043E\u043C\u0435 \u0442\u043E\u0433\u043E, \u0432 \u043D\u043E\u0432\u043E\u0439 \u0432\u0435\u0440\u0441\u0438\u0438 \u043F\u0440\u043E\u0435\u043A\u0442 \u0434\u043E\u043F\u043E\u043B\u043D\u0435\u043D \u0440\u044F\u0434\u043E\u043C \u0441\u043B\u043E\u0435\u0432. \u0421\u043B\u043E\u0439 \u0433\u043E\u0440\u043E\u0434\u043E\u0432 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u043D\u0430 \u043A\u0430\u0440\u0442\u0435 \u0440\u0430\u0441\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0441\u0442\u043E\u043B\u0438\u0446 \u0438 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043D\u044B\u0445 \u0446\u0435\u043D\u0442\u0440\u043E\u0432 \u00AB\u0432\u0435\u0440\u0445\u043D\u0435\u0433\u043E \u0443\u0440\u043E\u0432\u043D\u044F\u00BB, \u0440\u0430\u0441\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u043D\u044B\u0445 \u043F\u043E \u0441\u0442\u0430\u0442\u0443\u0441\u0443 \u043D\u0430 \u043E\u0434\u043D\u0443 \u0441\u0442\u0443\u043F\u0435\u043D\u044C\u043A\u0443 \u043D\u0438\u0436\u0435 \u0441\u0442\u043E\u043B\u0438\u0446. \u0412 \u043D\u0430\u0448\u0438 \u0437\u0430\u0434\u0430\u0447\u0438 \u043D\u0435 \u0432\u0445\u043E\u0434\u0438\u043B\u043E \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0432\u0441\u0435\u0445 \u0433\u043E\u0440\u043E\u0434\u043E\u0432 \u0438\u043B\u0438 \u0445\u043E\u0442\u044F \u0431\u044B \u0433\u043E\u0440\u043E\u0434\u043E\u0432 \u043D\u0438\u0436\u043D\u0438\u0445 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043D\u044B\u0445 \u0443\u0440\u043E\u0432\u043D\u0435\u0439, \u0430 \u0434\u0430\u0442\u044B \u0438\u0445 \u043F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u044F \u0438 \u0438\u0441\u0447\u0435\u0437\u043D\u043E\u0432\u0435\u043D\u0438\u044F \u043D\u0430 \u043A\u0430\u0440\u0442\u0435 \u043D\u0435 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u044E\u0442 \u0441 \u0434\u0430\u0442\u0430\u043C\u0438 \u043F\u0435\u0440\u0432\u043E\u0433\u043E \u0438 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0433\u043E \u0443\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u0439. \u0425\u0440\u043E\u043D\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0440\u0430\u043C\u043A\u0438 \u0445\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u0438\u0437\u0443\u044E\u0442 \u043B\u0438\u0448\u044C \u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E\u0439 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B, \u043A\u043E\u0433\u0434\u0430 \u0433\u043E\u0440\u043E\u0434 \u0441\u043B\u0443\u0436\u0438\u043B \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043D\u044B\u043C \u0446\u0435\u043D\u0442\u0440\u043E\u043C \u00AB\u0432\u0435\u0440\u0445\u043D\u0435\u0433\u043E \u0443\u0440\u043E\u0432\u043D\u044F\u00BB. \u041F\u043E\u044D\u0442\u043E\u043C\u0443 \u0431\u043E\u043B\u044C\u0448\u0438\u043D\u0441\u0442\u0432\u043E \u0443\u0435\u0437\u0434\u043E\u0432 XVII \u0432. \u0441 \u043A\u0430\u0440\u0442\u044B \u0438\u0441\u0447\u0435\u0437\u0430\u044E\u0442 \u0432 \u043D\u0430\u0447\u0430\u043B\u0435 XVIII \u0432., \u043A\u043E\u0433\u0434\u0430 \u043D\u0430 \u0441\u043C\u0435\u043D\u0443 \u0443\u0435\u0437\u0434\u0430\u043C \u043A\u0430\u043A \u043E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u0435\u0434\u0438\u043D\u0438\u0446\u0435 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043D\u043E\u0433\u043E \u0434\u0435\u043B\u0435\u043D\u0438\u044F \u043F\u0440\u0438\u0445\u043E\u0434\u044F\u0442 \u0433\u0443\u0431\u0435\u0440\u043D\u0438\u0438. \u041F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u043D\u0430 \u043A\u0430\u0440\u0442\u0435 \u043D\u043E\u0432\u044B\u0445 \u0433\u043E\u0440\u043E\u0434\u043E\u0432 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u043D\u043E \u043F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u044E \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u0433\u043E \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043D\u043E\u0433\u043E \u043E\u043A\u0440\u0443\u0433\u0430 \u043D\u0430 \u00AB\u0432\u0435\u0440\u0445\u043D\u0435\u043C \u0443\u0440\u043E\u0432\u043D\u0435\u00BB \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043D\u043E\u0439 \u0441\u0435\u0442\u043A\u0438.\n</P>\n<P ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n\u0415\u0449\u0435 \u043E\u0434\u0438\u043D \u0441\u043B\u043E\u0439, \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0439 \u043D\u0430 \u043A\u0430\u0440\u0442\u0443, \u0432 \u043F\u043E\u043B\u043D\u043E\u043C \u0441\u043C\u044B\u0441\u043B\u0435 \u044D\u043A\u0441\u043F\u0435\u0440\u0438\u043C\u0435\u043D\u0442\u0430\u043B\u044C\u043D\u044B\u0439. \u041E\u043D \u043F\u0440\u0438\u0437\u0432\u0430\u043D \u043E\u0445\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u0438\u0437\u043E\u0432\u0430\u0442\u044C \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u044B\u0439 \u0443\u0447\u0430\u0441\u0442\u043E\u043A \u0433\u0440\u0430\u043D\u0438\u0446\u044B \u043F\u043E \u0441\u0442\u0435\u043F\u0435\u043D\u0438 \u0443\u0441\u043B\u043E\u0432\u043D\u043E\u0441\u0442\u0438. \u0414\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u0441\u0435\u0439\u0447\u0430\u0441 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F \u0442\u0440\u0438 \u0442\u0438\u043F\u0430 \u043B\u0438\u043D\u0438\u0439. \u041D\u0430\u0438\u0431\u043E\u043B\u0435\u0435 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u043D\u043E \u0443\u0447\u0430\u0441\u0442\u043A\u0438 \u0433\u0440\u0430\u043D\u0438\u0446 \u043B\u043E\u043A\u0430\u043B\u0438\u0437\u0443\u044E\u0442\u0441\u044F \u043F\u043E \u0438\u0441\u0442\u043E\u0440\u0438\u0447\u0435\u0441\u043A\u0438\u043C \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u043C, \u043A\u0430\u0440\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0447\u0435\u0441\u043A\u0438\u043C \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u0430\u043C XVIII\u2014XXI \u0432. \u0438\u043B\u0438 \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0435 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0445 \u0438\u0441\u0442\u043E\u0440\u0438\u043A\u043E-\u0433\u0435\u043E\u0433\u0440\u0430\u0444\u0438\u0447\u0435\u0441\u043A\u0438\u0445 \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u0439, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u043D\u0430 \u044D\u0442\u0438 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u044B \u0438 \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u044B \u043E\u043F\u0438\u0440\u0430\u044E\u0442\u0441\u044F (\u043F\u0435\u0440\u0432\u044B\u0439 \u0442\u0438\u043F \u043B\u0438\u043D\u0438\u0439). \u041C\u043D\u043E\u0436\u0435\u0441\u0442\u0432\u043E \u0433\u0440\u0430\u043D\u0438\u0446 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u043E\u0432\u0430\u043B\u043E \u043D\u0430 \u043C\u0435\u0441\u0442\u043D\u043E\u0441\u0442\u0438 \u0445\u043E\u0442\u044F \u0431\u044B \u043D\u0430 \u0443\u0440\u043E\u0432\u043D\u0435 \u043E\u0431\u0449\u0438\u0445 \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0438\u0439 \u0441\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u0438\u043A\u043E\u0432, \u043E\u0434\u043D\u0430\u043A\u043E \u043F\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044E \u0438\u0441\u0442\u043E\u0440\u0438\u0447\u0435\u0441\u043A\u0438\u0445 \u0441\u0432\u0438\u0434\u0435\u0442\u0435\u043B\u044C\u0441\u0442\u0432 \u043F\u043E\u043A\u0430 \u0447\u0442\u043E \u043D\u0435 \u043C\u043E\u0433\u0443\u0442 \u0431\u044B\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0440\u043E\u0432\u0430\u043D\u044B \u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u043D\u043E (\u0432\u0442\u043E\u0440\u043E\u0439 \u0442\u0438\u043F \u043B\u0438\u043D\u0438\u0439). \u041D\u0430\u043A\u043E\u043D\u0435\u0446, \u0437\u043D\u0430\u0447\u0438\u0442\u0435\u043B\u044C\u043D\u0430\u044F \u0447\u0430\u0441\u0442\u044C \u0433\u0440\u0430\u043D\u0438\u0446 (\u0434\u043B\u044F \u0434\u043E\u043C\u043E\u043D\u0433\u043E\u043B\u044C\u0441\u043A\u043E\u0439 \u0420\u0443\u0441\u0438 \u043F\u0440\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u0432\u0441\u0435) \u0432\u043E \u0432\u0441\u0435\u0445 \u043E\u0442\u043D\u043E\u0448\u0435\u043D\u0438\u044F\u0445 \u0430\u0431\u0441\u0442\u0440\u0430\u043A\u0442\u043D\u0430 \u2014 \u0433\u0440\u0430\u043D\u0438\u0446\u044B \u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u043D\u0435 \u043C\u043E\u0433\u0443\u0442 \u0431\u044B\u0442\u044C \u0441\u043A\u043E\u043B\u044C-\u043D\u0438\u0431\u0443\u0434\u044C \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u043D\u043E \u043E\u0431\u043E\u0437\u043D\u0430\u0447\u0435\u043D\u044B \u0432 \u043D\u0430\u0441\u0442\u043E\u044F\u0449\u0435\u0435 \u0432\u0440\u0435\u043C\u044F, \u043D\u043E \u0438 \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u043E\u0432\u0430\u043B\u0438 \u043D\u0438 \u0432 \u0438\u0441\u0442\u043E\u0440\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u0440\u0435\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438, \u043D\u0438 \u0432 \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0438\u044F\u0445 \u0441\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u0438\u043A\u043E\u0432 \u2014 \u043D\u0430\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u044D\u0442\u043E \u043C\u043E\u0436\u043D\u043E \u043F\u0440\u0435\u0434\u043F\u043E\u043B\u0430\u0433\u0430\u0442\u044C \u0438\u0441\u0445\u043E\u0434\u044F \u0438\u0437 \u043D\u0430\u0448\u0438\u0445 \u0430\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u044B\u0445 \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0438\u0439 \u043E \u043F\u0440\u043E\u0448\u043B\u043E\u043C.\n</P>\n<P ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n\u0412 \u043F\u0440\u0430\u0432\u043E\u043C \u0432\u0435\u0440\u0445\u043D\u0435\u043C \u0443\u0433\u043B\u0443 \u043A\u0430\u0440\u0442\u044B \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B \u0442\u0440\u0438 \u0438\u043A\u043E\u043D\u043A\u0438-\u043A\u043D\u043E\u043F\u043A\u0438. \u041F\u0435\u0440\u0432\u0430\u044F \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u043E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0441\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u0443\u044E \u043A\u0430\u0440\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0447\u0435\u0441\u043A\u0443\u044E \u043F\u043E\u0434\u043B\u043E\u0436\u043A\u0443, \u0434\u0432\u0435 \u0434\u0440\u0443\u0433\u0438\u0435 \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u044E\u0442 \u0443\u043F\u0440\u0430\u0432\u043B\u044F\u0442\u044C \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435\u043C \u0434\u0432\u0443\u0445 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0445 \u0431\u043B\u043E\u043A\u043E\u0432 \u043A\u0430\u0440\u0442\u044B. \u0412 \u043F\u0435\u0440\u0432\u043E\u043C \u0438\u0437 \u043D\u0438\u0445 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F \u0438\u043C\u044F \u043F\u0440\u0430\u0432\u0438\u0442\u0435\u043B\u044F \u043D\u0430 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u044B\u0439 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u043C \u0433\u043E\u0434, \u0435\u0433\u043E \u0442\u0438\u0442\u0443\u043B \u0438\u043B\u0438 \u0434\u043E\u043B\u0436\u043D\u043E\u0441\u0442\u044C, \u0433\u043E\u0434\u044B \u043D\u0430\u0445\u043E\u0436\u0434\u0435\u043D\u0438\u044F \u0443 \u0432\u043B\u0430\u0441\u0442\u0438 \u0441 \u043E\u0442\u0441\u044B\u043B\u043A\u043E\u0439 \u043D\u0430 \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u0443\u044E \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 \u0441\u0430\u0439\u0442\u0430 \u0441 \u0431\u043E\u043B\u0435\u0435 \u043F\u043E\u0434\u0440\u043E\u0431\u043D\u044B\u043C\u0438 \u0441\u0432\u0435\u0434\u0435\u043D\u0438\u044F\u043C\u0438. \u0412 \u043D\u0438\u0436\u043D\u0435\u043C \u0431\u043B\u043E\u043A\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u044B \u0438\u043C\u0435\u0432\u0448\u0438\u0435 \u043C\u0435\u0441\u0442\u043E \u0432 \u0434\u0430\u043D\u043D\u043E\u043C \u0433\u043E\u0434\u0443 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0430\u043B\u044C\u043D\u044B\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0438 \u043F\u0440\u0438\u0432\u0435\u0434\u0435\u043D\u0430 \u043F\u0440\u0438\u0431\u043B\u0438\u0437\u0438\u0442\u0435\u043B\u044C\u043D\u0430\u044F \u043F\u043B\u043E\u0449\u0430\u0434\u044C \u0443\u0447\u0430\u0441\u0442\u043A\u043E\u0432, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0434\u043E\u0431\u0430\u0432\u0438\u043B\u0438\u0441\u044C \u043A \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0438 \u0433\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u0430 \u0438, \u043D\u0430\u043E\u0431\u043E\u0440\u043E\u0442, \u043E\u043A\u0430\u0437\u0430\u043B\u0438\u0441\u044C \u0443\u0442\u0440\u0430\u0447\u0435\u043D\u044B.\n</P>\n<P ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n\u041F\u0440\u0438 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0438 \u0432\u0435\u0431-\u0413\u0418\u0421 \u00AB\u0413\u0440\u0430\u043D\u0438\u0446\u044B \u0420\u0443\u0441\u0438, \u0420\u043E\u0441\u0441\u0438\u0438, \u0421\u0421\u0421\u0420 \u0438 \u0420\u0424 850\u20132018 \u0433\u0433.\u00BB \u0440\u0435\u0430\u043B\u0438\u0437\u043E\u0432\u0430\u043D\u0430 \u043A\u043E\u043D\u0446\u0435\u043F\u0446\u0438\u044F \u0434\u0438\u043D\u0430\u043C\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u043A\u0430\u0440\u0442\u044B. \u0421 \u0442\u043E\u0447\u043A\u0438 \u0437\u0440\u0435\u043D\u0438\u044F \u0442\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u0440\u0435\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438 \u043F\u0440\u043E\u0435\u043A\u0442\u0430 \u044D\u0442\u0430 \u043A\u043E\u043D\u0446\u0435\u043F\u0446\u0438\u044F \u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u043E\u0440\u0438\u0433\u0438\u043D\u0430\u043B\u044C\u043D\u044B\u043C \u0440\u0435\u0448\u0435\u043D\u0438\u0435\u043C, \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0430\u043D\u043D\u044B\u043C <a href=\"https://histgeo.ru/laboratory.html\" target=\"_blank\">\u041B\u0430\u0431\u043E\u0440\u0430\u0442\u043E\u0440\u0438\u0435\u0439 \u0438\u0441\u0442\u043E\u0440\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u0433\u0435\u043E\u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0438</a> \u0418\u043D\u0441\u0442\u0438\u0442\u0443\u0442\u0430 \u0432\u0441\u0435\u043E\u0431\u0449\u0435\u0439 \u0438\u0441\u0442\u043E\u0440\u0438\u0438 \u0420\u0410\u041D \u0441\u043E\u0432\u043C\u0435\u0441\u0442\u043D\u043E \u0441 <a href=\"http://nextgis.ru/\" target=\"_blank\">NextGIS</a>. \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 <a href=\"http://nextgis.ru/blog/runivers/\" target=\"_blank\">\u0442\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u0440\u0435\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438</a> \u043F\u0440\u043E\u0435\u043A\u0442\u0430.\n</P>\n<P ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n\u041F\u0440\u0438\u043A\u043B\u0430\u0434\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0434\u0430\u043D\u043D\u043E\u0433\u043E \u043F\u0440\u043E\u0435\u043A\u0442\u0430 \u0434\u043B\u044F \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u044F \u0432 \u043D\u0430\u0443\u0447\u043D\u044B\u0445 \u0446\u0435\u043B\u044F\u0445 \u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u043E\u0442\u043B\u0438\u0447\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0439 \u0435\u0433\u043E \u0447\u0435\u0440\u0442\u043E\u0439. \u041F\u043E\u0434\u043E\u0431\u043D\u044B\u0435 \u0434\u0438\u043D\u0430\u043C\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u043A\u0430\u0440\u0442\u044B, \u0434\u0435\u043C\u043E\u043D\u0441\u0442\u0440\u0438\u0440\u0443\u044E\u0449\u0438\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0433\u0440\u0430\u043D\u0438\u0446 \u0432 \u043F\u0440\u043E\u0448\u043B\u043E\u043C, \u0438\u043C\u0435\u044E\u0442 \u0432 \u043E\u0441\u043D\u043E\u0432\u043D\u043E\u043C \u00AB\u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439\u00BB \u0443\u043A\u043B\u043E\u043D \u0438 \u043D\u0435 \u043F\u0440\u0435\u0434\u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u044B \u0434\u043B\u044F \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442\u043E\u0432-\u0438\u0441\u0442\u043E\u0440\u0438\u043A\u043E\u0432. \u041D\u043E \u043F\u0443\u0431\u043B\u0438\u043A\u0443\u0435\u043C\u0430\u044F \u0434\u0438\u043D\u0430\u043C\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043A\u0430\u0440\u0442\u0430 \u043E\u0442\u043A\u0440\u044B\u0442\u0430 \u0434\u043B\u044F \u043F\u043E\u0441\u0442\u043E\u044F\u043D\u043D\u043E\u0439 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u0438\u0440\u043E\u0432\u043A\u0438 \u0438 \u043F\u0440\u0438\u0437\u0432\u0430\u043D\u0430 \u0432 \u0434\u0430\u043B\u044C\u043D\u0435\u0439\u0448\u0435\u043C \u0441\u0442\u0430\u0442\u044C \u043D\u0435\u043A\u043E\u0439 \u043A\u0430\u0440\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u043F\u043E\u0434\u043E\u0441\u043D\u043E\u0432\u043E\u0439 \u0434\u043B\u044F \u0438\u0441\u0442\u043E\u0440\u0438\u043A\u0430, \u043F\u0440\u0438\u043C\u0435\u043D\u044F\u044E\u0449\u0435\u0433\u043E \u0413\u0418\u0421-\u0442\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0438\u0438 \u0434\u043B\u044F \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u044B\u0445 \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0445 \u0437\u0430\u0434\u0430\u0447.\n</P>\n<P ALIGN=JUSTIFY STYLE=\"margin-bottom: 0.17in\">\n\u041E \u0434\u043E\u043F\u0443\u0449\u0435\u043D\u0438\u044F\u0445, \u043E\u0441\u043E\u0431\u0435\u043D\u043D\u043E\u0441\u0442\u044F\u0445 \u043C\u0435\u0442\u043E\u0434\u0438\u043A\u0438 \u0438 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u044F\u0445 \u043F\u0440\u0438\u043C\u0435\u043D\u044F\u0432\u0448\u0435\u0439\u0441\u044F \u043C\u0435\u0442\u043E\u0434\u0438\u043A\u0438, \u0442\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u0438\u0445 \u043E\u0441\u043E\u0431\u0435\u043D\u043D\u043E\u0441\u0442\u044F\u0445 \u043F\u0440\u043E\u0435\u043A\u0442\u0430 \u0438 \u043F\u0435\u0440\u0441\u043F\u0435\u043A\u0442\u0438\u0432\u0430\u0445 \u0435\u0433\u043E \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044F \u0441\u043C. <a href=\"https://www.runivers.ru/granitsy-rossii/about/about_detailed/index.php\" target=\"_blank\">\u041F\u041E\u0414\u0420\u041E\u0411\u041D\u0415\u0415 .\n</P>\n";


/***/ }),

/***/ "./src/components/Links/img/nextgis.png":
/*!**********************************************!*\
  !*** ./src/components/Links/img/nextgis.png ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "images/nextgis.png");

/***/ }),

/***/ "./src/components/Links/img/rewind_next.svg":
/*!**************************************************!*\
  !*** ./src/components/Links/img/rewind_next.svg ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "images/rewind_next.svg");

/***/ }),

/***/ "./src/components/Links/img/rewind_previous.svg":
/*!******************************************************!*\
  !*** ./src/components/Links/img/rewind_previous.svg ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "images/rewind_previous.svg");

/***/ }),

/***/ "./src/components/Panels/LegendPanelControl.css":
/*!******************************************************!*\
  !*** ./src/components/Panels/LegendPanelControl.css ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/components/Panels/LegendPanelControl.ts":
/*!*****************************************************!*\
  !*** ./src/components/Panels/LegendPanelControl.ts ***!
  \*****************************************************/
/*! exports provided: LegendPanelControl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LegendPanelControl", function() { return LegendPanelControl; });
/* harmony import */ var color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! color */ "./node_modules/color/index.js");
/* harmony import */ var color__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(color__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _PanelControl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PanelControl */ "./src/components/Panels/PanelControl.ts");
/* harmony import */ var _LegendPanelControl_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./LegendPanelControl.css */ "./src/components/Panels/LegendPanelControl.css");
/* harmony import */ var _LegendPanelControl_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_LegendPanelControl_css__WEBPACK_IMPORTED_MODULE_2__);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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



var OPTIONS = {
    addClass: 'legend-panel',
};
var LegendPanelControl = (function (_super) {
    __extends(LegendPanelControl, _super);
    function LegendPanelControl(options) {
        var _this = _super.call(this, __assign(__assign({}, OPTIONS), options)) || this;
        _this.options = options;
        _this._createLegendBody();
        _this._addEventsListener();
        return _this;
    }
    LegendPanelControl.prototype.createLegendBlock = function (interactive) {
        var _this = this;
        if (interactive === void 0) { interactive = false; }
        var element = document.createElement('div');
        element.className = 'panel-body__legend';
        var colors = this.options.colors;
        if (colors) {
            Object.values(colors).forEach(function (x) {
                x.forEach(function (c) {
                    element.appendChild(_this._createLegendItem(c, interactive));
                });
            });
        }
        return element;
    };
    LegendPanelControl.prototype._createLegendBody = function () {
        var element = this.createLegendBlock();
        var buttonBlock = document.createElement('div');
        buttonBlock.className = 'panel-body__legend--button';
        buttonBlock.innerHTML = "\n    <div><a\n      href=\"https://www.runivers.ru/granitsy-rossii/charts/index.php\"\n      target='_blank'\n      class=\"btn panel-button\">\u0413\u0420\u0410\u0424\u0418\u041A \u0418\u0417\u041C\u0415\u041D\u0415\u041D\u0418\u042F \u0422\u0415\u0420\u0420\u0418\u0422\u041E\u0420\u0418\u0418\n    </a></div>\n    <div><a\n      href=\"https://runivers.ru/doc/rusland/zemli-i-knyazhestva/\"\n      target='_blank'\n      class=\"btn panel-button\">\u0421\u0445\u0435\u043C\u0430 \u0437\u0435\u043C\u0435\u043B\u044C \u0438 \u043A\u043D\u044F\u0436\u0435\u0441\u0442\u0432 <div class=\"link-button subtitle\">\u0441\u0440\u0435\u0434\u043D\u0435\u0432\u0435\u043A\u043E\u0432\u043E\u0439 \u0420\u0443\u0441\u0438</div>\n    </a></div>\n    ";
        element.appendChild(buttonBlock);
        this.updateBody(element);
        return element;
    };
    LegendPanelControl.prototype._createLegendItem = function (c, interactive) {
        if (interactive === void 0) { interactive = false; }
        var block = document.createElement('div');
        block.className = 'panel-body__legend--block';
        var id = c[0], paint = c[1], text = c[2];
        var color = typeof paint === 'string' ? paint : paint.color;
        var type = (typeof paint !== 'string' && paint.type) || 'fill';
        if (interactive) {
            this._createInteractiveBlock(block, id, color, text);
        }
        else {
            var _color = new color__WEBPACK_IMPORTED_MODULE_0___default.a(color);
            var colorSymbol = document.createElement('div');
            colorSymbol.className = 'panel-body__legend--color ' + type;
            colorSymbol.style.backgroundColor = String(_color.fade(0.3));
            colorSymbol.style.border = '2px solid ' + _color.darken(0.5);
            block.appendChild(colorSymbol);
            var nameBlock = document.createElement('div');
            nameBlock.className = 'panel-body__legend--name';
            nameBlock.innerHTML = "" + text;
            block.appendChild(nameBlock);
        }
        return block;
    };
    LegendPanelControl.prototype._createInteractiveBlock = function (block, id, color, text) {
        var _this = this;
        var colorInput = document.createElement('input');
        colorInput.setAttribute('type', 'color');
        colorInput.className = 'editable-legend__color-input';
        colorInput.value = color;
        block.appendChild(colorInput);
        var getName = function (value) {
            return " - " + text + " (" + value + ")";
        };
        var nameBlock = document.createElement('span');
        nameBlock.className = 'panel-body__legend--name';
        nameBlock.innerHTML = getName(color);
        var allColors = this.options.colors;
        colorInput.onchange = function () {
            if (allColors) {
                var colors_1 = [];
                Object.values(allColors).forEach(function (x) {
                    return x.forEach(function (y) { return colors_1.push(y); });
                });
                var changedColor = colors_1.find(function (x) { return x[0] === id; });
                if (changedColor) {
                    changedColor[1] = colorInput.value;
                    nameBlock.innerHTML = getName(colorInput.value);
                    _this.emitter.emit('change', _this.options.colors);
                }
            }
        };
        block.appendChild(nameBlock);
    };
    LegendPanelControl.prototype._addEventsListener = function () {
        var _this = this;
        this.emitter.on('change', function () {
            _this._createLegendBody();
        });
    };
    return LegendPanelControl;
}(_PanelControl__WEBPACK_IMPORTED_MODULE_1__["Panel"]));



/***/ }),

/***/ "./src/components/Panels/PanelControl.css":
/*!************************************************!*\
  !*** ./src/components/Panels/PanelControl.css ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/components/Panels/PanelControl.ts":
/*!***********************************************!*\
  !*** ./src/components/Panels/PanelControl.ts ***!
  \***********************************************/
/*! exports provided: Panel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Panel", function() { return Panel; });
/* harmony import */ var _PanelControl_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PanelControl.css */ "./src/components/Panels/PanelControl.css");
/* harmony import */ var _PanelControl_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_PanelControl_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nextgis_dialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextgis/dialog */ "./nextgis_frontend/packages/dialog/src/index.ts");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_2__);



var Panel = (function () {
    function Panel(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        this.emitter = new events__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
        this.isHide = false;
        this._blocked = false;
        this.webMap = this.options.webMap;
        this._container = this._createContainer();
    }
    Panel.prototype.getContainer = function () {
        return this._container;
    };
    Panel.prototype.onAdd = function (map) {
        this.webMap = map;
        return this._container;
    };
    Panel.prototype.onRemove = function () {
        if (this._container) {
            var parentNode = this._container.parentNode;
            if (parentNode) {
                parentNode.removeChild(this._container);
            }
        }
    };
    Panel.prototype.updateBody = function (content) {
        this._cleanBody();
        if (this._body) {
            if (typeof content === 'string') {
                this._body.innerHTML = content;
            }
            else if (content instanceof HTMLElement) {
                this._body.appendChild(content);
            }
        }
    };
    Panel.prototype.hide = function () {
        this.isHide = true;
        if (this._container) {
            this._container.classList.add('panel-hide');
        }
        this.emitter.emit('toggle', false);
    };
    Panel.prototype.show = function () {
        if (!this._blocked) {
            this.isHide = false;
            if (this._container) {
                this._container.classList.remove('panel-hide');
            }
            this.emitter.emit('toggle', true);
        }
    };
    Panel.prototype.block = function () {
        this._blocked = true;
    };
    Panel.prototype.unBlock = function () {
        this._blocked = false;
    };
    Panel.prototype.createControlButton = function (onclick, text) {
        if (text === void 0) { text = 'Подробнее'; }
        var element = document.createElement('button');
        element.className = 'btn panel-button';
        element.innerHTML = text;
        element.onclick = onclick;
        return element;
    };
    Panel.prototype.createRefButton = function (url, text) {
        return this.createControlButton(function () { return window.open(url, '_blank'); }, text);
    };
    Panel.prototype.openDialog = function (options) {
        if (!this._dialog) {
            this._dialog = new _nextgis_dialog__WEBPACK_IMPORTED_MODULE_1__["default"](options);
        }
        var template = options && options.template;
        if (template) {
            var isSame = this._dialog.options.template === template;
            if (!isSame) {
                this._dialog.updateContent(template);
            }
        }
        this._dialog.show();
    };
    Panel.prototype.closeDialog = function () {
        if (this._dialog) {
            this._dialog.close();
        }
    };
    Panel.prototype._cleanBody = function () {
        if (this._body) {
            this._body.innerHTML = '';
        }
    };
    Panel.prototype._createContainer = function () {
        var element = document.createElement('div');
        element.className = 'mapboxgl-ctrl panel';
        if (this.options.addClass) {
            this.options.addClass.split(' ').forEach(function (x) { return element.classList.add(x); });
        }
        if (this.options.headerText) {
        }
        element.appendChild(this._createBody());
        return element;
    };
    Panel.prototype._createHeader = function () {
        var element = document.createElement('div');
        element.className = 'panel-header';
        if (this.options.headerText) {
            element.innerHTML = this.options.headerText;
        }
        this._header = element;
        return element;
    };
    Panel.prototype._createBody = function () {
        var element = document.createElement('div');
        element.className = 'panel-body';
        this._body = element;
        return element;
    };
    return Panel;
}());



/***/ }),

/***/ "./src/components/Panels/PeriodPanelControl.css":
/*!******************************************************!*\
  !*** ./src/components/Panels/PeriodPanelControl.css ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/components/Panels/PeriodPanelControl.ts":
/*!*****************************************************!*\
  !*** ./src/components/Panels/PeriodPanelControl.ts ***!
  \*****************************************************/
/*! exports provided: PeriodPanelControl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PeriodPanelControl", function() { return PeriodPanelControl; });
/* harmony import */ var _PanelControl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PanelControl */ "./src/components/Panels/PanelControl.ts");
/* harmony import */ var _PeriodPanelControl_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PeriodPanelControl.css */ "./src/components/Panels/PeriodPanelControl.css");
/* harmony import */ var _PeriodPanelControl_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_PeriodPanelControl_css__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var OPTIONS = {
    headerText: 'Правители',
    addClass: 'period-panel',
};
var PeriodPanelControl = (function (_super) {
    __extends(PeriodPanelControl, _super);
    function PeriodPanelControl(options) {
        return _super.call(this, Object.assign({}, OPTIONS, options)) || this;
    }
    PeriodPanelControl.prototype.hide = function () {
        _super.prototype.hide.call(this);
        if (this.webMap) {
            var container = this.webMap.getContainer();
            if (container) {
                container.classList.remove('period-panel');
            }
        }
    };
    PeriodPanelControl.prototype.show = function () {
        _super.prototype.show.call(this);
        if (!this.isHide && this.webMap) {
            var container = this.webMap.getContainer();
            if (container) {
                container.classList.add('period-panel');
            }
        }
    };
    PeriodPanelControl.prototype.updatePeriod = function (period, areaStat) {
        this.closeDialog();
        if (period) {
            var exist = this.period;
            var currentArea = this.areaStat && this.areaStat.area;
            var newArea = areaStat && areaStat.area;
            if (exist !== period || currentArea !== newArea) {
                this.updateBody(this._createPeriodBody(period, areaStat));
                this.period = period;
                this.areaStat = areaStat;
            }
        }
        else {
            this.updateBody('<div class="panel-body__period empty">В этом году изменений территории не было</div>');
            this.period = undefined;
        }
    };
    PeriodPanelControl.prototype._createPeriodBody = function (period, areaStat) {
        var element = document.createElement('div');
        element.className = 'panel-body__period';
        var periodElement = document.createElement('div');
        var imageHtml = '';
        if (period.img_link) {
            imageHtml = "<div\n        class=\"panel-body__period--image\" style=\"background-image: url('" + period.img_link + "');\">\n      </div>";
        }
        periodElement.innerHTML = "\n      " + (imageHtml ? imageHtml : '') + "\n      <div class=\"panel-body__period--name\">" + period.name + "</div>\n      <div class=\"panel-body__period--period\">" + period.years_from + " \u2013 " + period.years_to + " \u0433\u0433.</div>\n      <div class=\"panel-body__period--description\">" + period.description + "</div>\n      " + (areaStat
            ? "\n      <div class=\"panel-body__period--description panel-body__period--area_wrap\">\n        \u041E\u0431\u0449\u0430\u044F \u043F\u043B\u043E\u0449\u0430\u0434\u044C: <span class=\"panel-body__period--area\">\n          " + Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["formatArea"])(areaStat.area) + "\n        </span>\n      </div>\n      "
            : '') + "\n    ";
        element.appendChild(periodElement);
        var detailLink = period.detail_link && this.createRefButton(period.detail_link);
        if (detailLink) {
            element.appendChild(detailLink);
        }
        return element;
    };
    return PeriodPanelControl;
}(_PanelControl__WEBPACK_IMPORTED_MODULE_0__["Panel"]));



/***/ }),

/***/ "./src/components/Panels/YearsStatPanelControl.css":
/*!*********************************************************!*\
  !*** ./src/components/Panels/YearsStatPanelControl.css ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/components/Panels/YearsStatPanelControl.ts":
/*!********************************************************!*\
  !*** ./src/components/Panels/YearsStatPanelControl.ts ***!
  \********************************************************/
/*! exports provided: YearsStatPanelControl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "YearsStatPanelControl", function() { return YearsStatPanelControl; });
/* harmony import */ var _nextgis_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextgis/utils */ "./nextgis_frontend/packages/utils/src/index.ts");
/* harmony import */ var _PanelControl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PanelControl */ "./src/components/Panels/PanelControl.ts");
/* harmony import */ var _YearsStatPanelControl_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./YearsStatPanelControl.css */ "./src/components/Panels/YearsStatPanelControl.css");
/* harmony import */ var _YearsStatPanelControl_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_YearsStatPanelControl_css__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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




var OPTIONS = {
    headerText: 'Изменения в территориальном составе',
    addClass: 'stat-panel',
};
var YearsStatPanelControl = (function (_super) {
    __extends(YearsStatPanelControl, _super);
    function YearsStatPanelControl(options) {
        return _super.call(this, __assign(__assign({}, OPTIONS), options)) || this;
    }
    YearsStatPanelControl.prototype.hide = function () {
        _super.prototype.hide.call(this);
        if (this.webMap) {
            var container = this.webMap.getContainer();
            if (container) {
                container.classList.remove('years-panel');
            }
        }
    };
    YearsStatPanelControl.prototype.show = function () {
        _super.prototype.show.call(this);
        if (!this.isHide && this.webMap) {
            var container = this.webMap.getContainer();
            if (container) {
                container.classList.add('years-panel');
            }
        }
    };
    YearsStatPanelControl.prototype.updateYearStats = function (yearStats, areaStat) {
        this.yearStats = yearStats;
        this.areaStat = areaStat;
        this.updateYearStat(this.yearStats[0]);
    };
    YearsStatPanelControl.prototype.updateYearStat = function (yearStat) {
        var exist = this.yearStat;
        var container = this.getContainer();
        if (container) {
            container.classList.remove('gain');
            container.classList.remove('lost');
        }
        if (yearStat) {
            if (exist !== yearStat) {
                this.yearStat = yearStat;
                this.updateBody(this._createPeriodBody(yearStat));
            }
        }
        else {
            this.updateBody('<div class="panel-body__period empty">В этом году изменений территории не было</div>');
            this.yearStat = undefined;
        }
        this.emitter.emit('update', { yearStat: this.yearStat });
    };
    YearsStatPanelControl.prototype._createPeriodBody = function (yearStat) {
        var _this = this;
        var element = document.createElement('div');
        element.className = 'panel-body__yearstat';
        var yearBlock = document.createElement('div');
        yearBlock.className = 'panel-body__period--year';
        yearBlock.innerHTML = yearStat.year + " \u0433.";
        element.appendChild(yearBlock);
        if (this.areaStat) {
            var gain = this.areaStat.plus;
            if (gain) {
                element.appendChild(this._createGainBlock(gain));
            }
            var lost = this.areaStat.minus;
            var container = this.getContainer();
            if (lost) {
                element.appendChild(this._createGainBlock(lost, true));
            }
            if (container) {
                container.classList.add(lost ? 'lost' : 'gain');
            }
        }
        if (this.yearStats && this.yearStats.length > 1) {
            element.appendChild(this._createStateSwitcher());
        }
        var descrBlock = this._createDescriptionBlock(yearStat);
        if (descrBlock) {
            element.appendChild(descrBlock);
        }
        var descrLong = yearStat.description_long;
        if (descrLong) {
            var template_1 = document.createElement('div');
            template_1.className = 'panel-body__period--description';
            template_1.innerHTML = "" + descrLong;
            var buttonWrap = document.createElement('div');
            buttonWrap.className = 'button-wrap';
            buttonWrap.appendChild(this.createControlButton(function () { return _this.openDialog({ template: template_1 }); }));
            element.appendChild(buttonWrap);
        }
        return element;
    };
    YearsStatPanelControl.prototype._createStateSwitcher = function () {
        var _this = this;
        var sliderBlock = document.createElement('div');
        sliderBlock.className = 'panel-body__period--slider';
        var yearStats = this.yearStats;
        var yearStat = this.yearStat;
        if (yearStat && yearStats) {
            var numb = yearStat.numb;
            var count = Object(_nextgis_utils__WEBPACK_IMPORTED_MODULE_0__["defined"])(yearStat.count) ? yearStat.count : yearStats.length;
            if (count && numb && count > 1 && count >= numb) {
                var index_1 = yearStats.indexOf(yearStat);
                var isFirst = index_1 === 0;
                var length_1 = yearStats.length;
                var isLast = index_1 === length_1 - 1;
                var createDirectionFlow = function (previous, isActive) {
                    var flow = document.createElement('a');
                    flow.setAttribute('href', '#');
                    flow.className =
                        (previous ? "panel_slider prev" : "panel_slider next") +
                            (isActive ? '' : ' hidden');
                    if (isActive) {
                        flow.onclick = function (e) {
                            e.preventDefault();
                            var directStat = yearStats[previous ? index_1 - 1 : index_1 + 1];
                            _this.updateYearStat(directStat);
                        };
                    }
                    return flow;
                };
                sliderBlock.appendChild(createDirectionFlow(true, !isFirst));
                var flowCounter = document.createElement('div');
                flowCounter.className = 'panel_slider-counter';
                flowCounter.innerHTML = numb + " \u0438\u0437 " + count;
                sliderBlock.appendChild(flowCounter);
                sliderBlock.appendChild(createDirectionFlow(false, !isLast));
            }
        }
        return sliderBlock;
    };
    YearsStatPanelControl.prototype._createDescriptionBlock = function (yearStat) {
        var element = document.createElement('div');
        if (yearStat.description_short) {
            element.innerHTML = "<div class=\"panel-body__period--description\">" + yearStat.description_short + "</div>";
            return element;
        }
    };
    YearsStatPanelControl.prototype._createGainBlock = function (count, isLost) {
        var element = document.createElement('div');
        element.className =
            'panel-body__yearstat--gain ' + (isLost ? 'lost' : 'gained');
        element.innerHTML = (isLost ? '-' : '+') + Object(_utils_utils__WEBPACK_IMPORTED_MODULE_3__["formatArea"])(count);
        return element;
    };
    return YearsStatPanelControl;
}(_PanelControl__WEBPACK_IMPORTED_MODULE_1__["Panel"]));



/***/ }),

/***/ "./src/components/SliderControl.css":
/*!******************************************!*\
  !*** ./src/components/SliderControl.css ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/components/SliderControl.ts":
/*!*****************************************!*\
  !*** ./src/components/SliderControl.ts ***!
  \*****************************************/
/*! exports provided: SliderControl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SliderControl", function() { return SliderControl; });
/* harmony import */ var _SliderControl_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SliderControl.css */ "./src/components/SliderControl.css");
/* harmony import */ var _SliderControl_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_SliderControl_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var nouislider_distribute_nouislider_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! nouislider/distribute/nouislider.css */ "./node_modules/nouislider/distribute/nouislider.css");
/* harmony import */ var nouislider_distribute_nouislider_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(nouislider_distribute_nouislider_css__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var nouislider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! nouislider */ "./node_modules/nouislider/distribute/nouislider.js");
/* harmony import */ var nouislider__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(nouislider__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var wnumb__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! wnumb */ "./node_modules/wnumb/wNumb.js");
/* harmony import */ var wnumb__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(wnumb__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _Links_img_rewind_next_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Links/img/rewind_next.svg */ "./src/components/Links/img/rewind_next.svg");
/* harmony import */ var _Links_img_rewind_previous_svg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Links/img/rewind_previous.svg */ "./src/components/Links/img/rewind_previous.svg");







var OPTIONS = {
    type: 'range',
    min: 0,
    max: 100,
    step: 1,
    animationStep: 1,
    value: 50,
    animationDelay: 100,
    filterPips: function (value, piptype) {
        return piptype === 1 ? 1 : value % 100 ? (value % 10 ? -1 : 0) : 1;
    },
};
var SliderControl = (function () {
    function SliderControl(options) {
        this.options = options;
        this.emitter = new events__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
        this.options = Object.assign({}, OPTIONS, options);
        this.options.animationStep =
            this.options.animationStep || this.options.step;
    }
    SliderControl.prototype.onAdd = function (map) {
        this.map = map;
        this._container = this._createContainer();
        return this._container;
    };
    SliderControl.prototype.onRemove = function () {
    };
    SliderControl.prototype._createContainer = function () {
        var element = document.createElement('div');
        element.className = 'mapboxgl-ctrl slider-control';
        element.appendChild(this._createSliderContainer());
        var playerControl = this.options.playerControl !== undefined
            ? this.options.playerControl
            : true;
        if (playerControl) {
            element.appendChild(this._createNavigationContainer());
        }
        return element;
    };
    SliderControl.prototype._createValueInput = function () {
        var _this = this;
        var inputObj = this._createLabeledInput({
            type: 'number',
            value: this.options.value,
        });
        var input = inputObj.input;
        input.onchange = function () {
            _this._onChange(_this._getAllowedValue(Number(input.value)));
        };
        this._input = input;
        return inputObj.label;
    };
    SliderControl.prototype._createAnimationStepInput = function () {
        var inputObj = this._createLabeledInput({
            type: 'number',
            label: 'animation step',
            value: this.options.animationStep,
        });
        var input = inputObj.input;
        var opt = this.options;
        input.onchange = function () {
            var val = Number(input.value);
            val = val <= 0 ? opt.animationStep : val > opt.max ? opt.max : val;
            input.value = String(val);
            opt.animationStep = val;
        };
        this._animationStepInput = input;
        return inputObj.label;
    };
    SliderControl.prototype._createAnimationDelayInput = function () {
        var _this = this;
        var inputObj = this._createLabeledInput({
            type: 'number',
            label: 'amimation delay',
            value: this.options.animationDelay,
        });
        var input = inputObj.input;
        input.onchange = function () {
            var value = Number(input.value);
            value = value <= 0 ? 1 : value;
            _this.options.animationDelay = value;
        };
        return inputObj.label;
    };
    SliderControl.prototype._createSliderContainer = function () {
        var _this = this;
        var span = document.createElement('span');
        span.className = 'slider-control-range';
        var range = document.createElement('div');
        span.appendChild(range);
        var _a = this.options, min = _a.min, max = _a.max, step = _a.step;
        var slider = nouislider__WEBPACK_IMPORTED_MODULE_3___default.a.create(range, {
            range: {
                min: min,
                max: max,
            },
            step: step,
            tooltips: [wnumb__WEBPACK_IMPORTED_MODULE_4___default()({ decimals: 0 })],
            start: [this.options.value],
            pips: this.options.pips !== undefined
                ? this.options.pips
                : {
                    mode: 'steps',
                    density: 3,
                    filter: this.options.filterPips,
                },
        });
        slider.on('change', function (values, handle) {
            _this._onSliderClick(parseInt(values[0], 10));
        });
        var sliderElement = slider.target;
        sliderElement.addEventListener('click', function () {
            _this.stopAnimation();
        }, true);
        this._sliderContainer = span;
        this._slider = slider;
        return span;
    };
    SliderControl.prototype._createPlayerContainer = function () {
        var _this = this;
        var player = document.createElement('div');
        player.className = 'slider-control-block slider-control-player';
        var playerControl = document.createElement('button');
        playerControl.className = 'player-button';
        playerControl.onclick = function () {
            _this._toggleAnimation();
        };
        player.appendChild(playerControl);
        this._playerControl = playerControl;
        return player;
    };
    SliderControl.prototype._createPlayerButton = function () {
        var _this = this;
        var playerControl = document.createElement('button');
        playerControl.className = 'player-button';
        playerControl.onclick = function () {
            _this._toggleAnimation();
        };
        this._playerControl = playerControl;
        return playerControl;
    };
    SliderControl.prototype._createNavigationContainer = function () {
        var _this = this;
        var playerSteps = document.createElement('div');
        playerSteps.className = 'slider-control-block slider-control-steps';
        var createStepBtn = function (previous) {
            var btn = document.createElement('button');
            btn.className = 'slider-control-steps-btn';
            btn.innerHTML = "\n        <img src=\"images/rewind_" + (previous ? 'previous' : 'next') + ".svg\" width=\"24\" height=\"24\"/>\n      ";
            playerSteps.appendChild(btn);
            if (previous) {
                playerSteps.appendChild(_this._createPlayerButton());
            }
            btn.onclick = function () {
                if (!_this._animationStatus) {
                    _this._stepReady(function (step, nextCb, stopCb) {
                        if (typeof step !== 'boolean') {
                            if (nextCb) {
                                nextCb();
                            }
                            _this._nextStep(step);
                        }
                        else {
                            if (stopCb) {
                                stopCb();
                            }
                        }
                    }, previous, _this.options.step);
                }
            };
            return btn;
        };
        this._playerControlPrevBtn = createStepBtn(true);
        this._playerControlNextBtn = createStepBtn();
        return playerSteps;
    };
    SliderControl.prototype._createLabeledInput = function (opt) {
        opt = opt || {};
        var input = document.createElement('input');
        input.className = 'slider-control-input';
        if (opt.type) {
            input.setAttribute('type', opt.type);
        }
        if (opt.value) {
            input.value = opt.value;
        }
        var content = document.createElement(opt.label ? 'label' : 'div');
        content.className = 'slider-control-block';
        if (opt.label) {
            content.innerHTML = opt.label + ':';
        }
        content.appendChild(input);
        return {
            label: content,
            input: input,
        };
    };
    SliderControl.prototype.startAnimathin = function () {
        this._toggleAnimation(true);
    };
    SliderControl.prototype.stopAnimation = function () {
        this._toggleAnimation(false);
    };
    SliderControl.prototype._onSliderClick = function (value) {
        var isAnimation = this._animationStatus;
        if (isAnimation) {
            this.stopAnimation();
        }
        this._onChange(value);
    };
    SliderControl.prototype._onChange = function (value) {
        if (this._slider) {
            this._slider.set(value);
        }
        if (this._input) {
            this._input.value = String(value);
        }
        this.emitter.emit('change', value);
    };
    SliderControl.prototype._toggleAnimation = function (status) {
        status = status !== undefined ? status : !this._animationStatus;
        this._animationStatus = status;
        if (this._playerControl) {
            this._playerControl.classList[this._animationStatus ? 'add' : 'remove']('paused');
        }
        if (status) {
            this._startAnimation();
            this.emitter.emit('animationStarted');
        }
        else {
            this._stopAnimation();
        }
    };
    SliderControl.prototype._startAnimation = function () {
        var _this = this;
        if (this._animationStatus) {
            this._disableControlBtn();
            var timerStart_1 = new Date().getTime();
            this._stepReady(function (step, nextCb, stopCb) {
                var isReady = typeof step !== 'boolean' &&
                    step < _this.options.max &&
                    step > _this.options.min;
                if (isReady && _this._animationStatus) {
                    var stepDelay = new Date().getTime() - timerStart_1;
                    var delay = _this.options.animationDelay - stepDelay;
                    delay = delay >= 0 ? delay : 0;
                    setTimeout(function () {
                        if (_this._animationStatus) {
                            if (nextCb) {
                                nextCb();
                            }
                            _this._nextStep(step);
                            _this._startAnimation();
                        }
                        else {
                            _this.emitter.emit('animationStopped');
                            if (stopCb) {
                                stopCb();
                            }
                        }
                    }, delay);
                }
                else {
                    _this.emitter.emit('animationStopped');
                    if (stopCb) {
                        stopCb();
                    }
                    _this.stopAnimation();
                }
            });
        }
        else {
            this.stopAnimation();
        }
    };
    SliderControl.prototype._nextStep = function (step) {
        if (this._slider) {
            this._slider.set(step);
        }
        this._onChange(step);
    };
    SliderControl.prototype._stepReady = function (callback, previous, stepLength) {
        var nextValue = this._getNextValue(previous, stepLength);
        var inRange = this.options.value <= this.options.max &&
            this.options.value >= this.options.min;
        if (nextValue && inRange) {
            this.options.value = nextValue;
            if (this.options.stepReady) {
                this.options.stepReady(nextValue, callback, previous);
            }
            else {
                callback(nextValue);
            }
        }
        else {
            callback(false);
        }
    };
    SliderControl.prototype._getAllowedValue = function (value) {
        if (value <= this.options.min) {
            return this.options.min;
        }
        else if (value > this.options.max) {
            return this.options.max;
        }
        return value;
    };
    SliderControl.prototype._getNextValue = function (previous, stepLength) {
        if (this._slider) {
            var val = this._slider.get();
            if (typeof val === 'string') {
                var current = parseInt(val, 10);
                var step = stepLength ? stepLength : this.options.animationStep;
                var next = previous ? current - step : current + step;
                return this._getAllowedValue(next);
            }
        }
    };
    SliderControl.prototype._stopAnimation = function () {
        this._enableControlBtn();
    };
    SliderControl.prototype._disableControlBtn = function () {
        [this._playerControlNextBtn, this._playerControlPrevBtn].forEach(function (x) {
            if (x) {
                x.classList.add('disables');
                x.setAttribute('disabled', 'true');
            }
        });
    };
    SliderControl.prototype._enableControlBtn = function () {
        [this._playerControlNextBtn, this._playerControlPrevBtn].forEach(function (x) {
            if (x) {
                x.classList.remove('disables');
                x.removeAttribute('disabled');
            }
        });
    };
    return SliderControl;
}());



/***/ }),

/***/ "./src/controls/Controls.css":
/*!***********************************!*\
  !*** ./src/controls/Controls.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/controls/Controls.ts":
/*!**********************************!*\
  !*** ./src/controls/Controls.ts ***!
  \**********************************/
/*! exports provided: Controls */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Controls", function() { return Controls; });
/* harmony import */ var _components_Links_Links__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/Links/Links */ "./src/components/Links/Links.ts");
/* harmony import */ var _components_Panels_LegendPanelControl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/Panels/LegendPanelControl */ "./src/components/Panels/LegendPanelControl.ts");
/* harmony import */ var _components_Panels_PeriodPanelControl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/Panels/PeriodPanelControl */ "./src/components/Panels/PeriodPanelControl.ts");
/* harmony import */ var _components_Panels_YearsStatPanelControl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/Panels/YearsStatPanelControl */ "./src/components/Panels/YearsStatPanelControl.ts");
/* harmony import */ var _Controls_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Controls.css */ "./src/controls/Controls.css");
/* harmony import */ var _Controls_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_Controls_css__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _TimeMap_TimeMapLoadingControl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../TimeMap/TimeMapLoadingControl */ "./src/TimeMap/TimeMapLoadingControl.ts");
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






var Controls = (function () {
    function Controls(app) {
        var _this = this;
        this.app = app;
        this.isMobile = false;
        this._installedControls = [];
        this._mobileTogglePanels = [];
        this._openPanels = [];
        this._eventBindings = {
            onMapClick: function () { return null; },
        };
        this._mobSizeConst = {
            height: 700,
            width: 650,
        };
        this._togglerEvents = [];
        this._eventBindings.onMapClick = function () { return _this._onMapClick(); };
        this.checkMobile();
        this.initControls();
        this._updateTimeSlider();
        this._updateMapEvents();
        this._addEventsListeners();
    }
    Controls.prototype.updateControls = function () {
        var _this = this;
        this.removeControls();
        var mapContainer = this.app.webMap.getContainer();
        if (mapContainer) {
            if (this.isMobile) {
                this._hideAllPanels();
                mapContainer.classList.add('mobile');
                this._addMobileControls();
                this._addPanelToggleListeners();
            }
            else {
                this._mobileTogglePanels.forEach(function (x) {
                    if (_this._openPanels.indexOf(x) !== -1) {
                        x.show();
                    }
                });
                this._removePanelToggleListener();
                mapContainer.classList.remove('mobile');
                this._addFullSizeControls();
            }
        }
    };
    Controls.prototype.removeControls = function () {
        var _this = this;
        this._installedControls.forEach(function (x) {
            _this.app.webMap.removeControl(x);
        });
        this._installedControls = [];
    };
    Controls.prototype.initControls = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.periodsPanelControl = new _components_Panels_PeriodPanelControl__WEBPACK_IMPORTED_MODULE_2__["PeriodPanelControl"]({
                    webMap: this.app.webMap,
                });
                this.yearsStatPanelControl = new _components_Panels_YearsStatPanelControl__WEBPACK_IMPORTED_MODULE_3__["YearsStatPanelControl"]({
                    webMap: this.app.webMap,
                });
                this.legendPanel = new _components_Panels_LegendPanelControl__WEBPACK_IMPORTED_MODULE_1__["LegendPanelControl"]({
                    colors: this.app.options.lineColorLegend,
                });
                this._socialLinksPanel = Object(_components_Links_Links__WEBPACK_IMPORTED_MODULE_0__["getSocialLinksPanel"])();
                this._switchersPanel = Object(_components_Links_Links__WEBPACK_IMPORTED_MODULE_0__["getSwitcherPanelControl"])(this);
                this._homeBtnPanel = Object(_components_Links_Links__WEBPACK_IMPORTED_MODULE_0__["getHomeBtnControl"])(this);
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
                    this.legendPanel.emitter.on('change', function (colors) {
                        return _this.app.updateLayersColor();
                    });
                }
                this._mobileTogglePanels.forEach(function (x) { return x.show(); });
                this._loadingControl = new _TimeMap_TimeMapLoadingControl__WEBPACK_IMPORTED_MODULE_5__["TimeMapLoadingControl"](this.app.timeMap);
                return [2];
            });
        });
    };
    Controls.prototype._addControl = function (control, position, options) {
        return __awaiter(this, void 0, void 0, function () {
            var addedControl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.app.webMap.addControl(control, position, options)];
                    case 1:
                        addedControl = _a.sent();
                        if (addedControl) {
                            this._installedControls.push(addedControl);
                        }
                        return [2];
                }
            });
        });
    };
    Controls.prototype._addFullSizeControls = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._addControl(this.legendPanel, 'top-left')];
                    case 1:
                        _a.sent();
                        return [4, this._addControl(this._switchersPanel, 'top-right')];
                    case 2:
                        _a.sent();
                        return [4, this._addControl(this.periodsPanelControl, 'top-right')];
                    case 3:
                        _a.sent();
                        return [4, this._addControl(this.yearsStatPanelControl, 'top-right')];
                    case 4:
                        _a.sent();
                        return [4, this._addControl(this._attributions, 'bottom-left')];
                    case 5:
                        _a.sent();
                        return [4, this._addControl(this._socialLinksPanel, 'bottom-left')];
                    case 6:
                        _a.sent();
                        return [4, this._addControl(this._homeBtnPanel, 'bottom-left')];
                    case 7:
                        _a.sent();
                        return [4, this._addControl(this._zoomControl, 'bottom-left')];
                    case 8:
                        _a.sent();
                        return [4, this._addControl(this._loadingControl, 'bottom-right')];
                    case 9:
                        _a.sent();
                        this._manualControlMove();
                        return [2];
                }
            });
        });
    };
    Controls.prototype._addMobileControls = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._addControl(this._switchersPanel, 'top-left')];
                    case 1:
                        _a.sent();
                        return [4, this._addControl(this.legendPanel, 'bottom-right')];
                    case 2:
                        _a.sent();
                        return [4, this._addControl(this.yearsStatPanelControl, 'bottom-right')];
                    case 3:
                        _a.sent();
                        return [4, this._addControl(this.periodsPanelControl, 'bottom-right')];
                    case 4:
                        _a.sent();
                        return [4, this._addControl(this._zoomControl, 'top-left')];
                    case 5:
                        _a.sent();
                        return [4, this._addControl(this._homeBtnPanel, 'top-left')];
                    case 6:
                        _a.sent();
                        return [4, this._addControl(this._attributions, 'bottom-left')];
                    case 7:
                        _a.sent();
                        return [4, this._addControl(this._socialLinksPanel, 'bottom-left')];
                    case 8:
                        _a.sent();
                        this._manualControlMove();
                        return [2];
                }
            });
        });
    };
    Controls.prototype._manualControlMove = function () {
        var container = this.app.webMap.getContainer();
        if (container) {
            var attrContainer = container.querySelector('.mapboxgl-ctrl.mapboxgl-ctrl-attrib');
            if (attrContainer && attrContainer.parentNode) {
                attrContainer.parentNode.removeChild(attrContainer);
                container.appendChild(attrContainer);
            }
        }
    };
    Controls.prototype.checkMobile = function () {
        this.isMobile =
            window.innerWidth <= this._mobSizeConst.width ||
                window.innerHeight <= this._mobSizeConst.height;
        return this.isMobile;
    };
    Controls.prototype._updateMapEvents = function () {
        if (this.isMobile) {
            this._addMapClickEvent();
        }
        else {
            this._removeMapClickEvent();
        }
    };
    Controls.prototype._updateTimeSlider = function () {
        var pipsNodes = document.querySelectorAll('.noUi-marker.noUi-marker-horizontal.noUi-marker-normal');
        var hideElements = Array.from(pipsNodes);
        var labelNodes = document.querySelectorAll('.noUi-value.noUi-value-horizontal.noUi-value-large');
        hideElements = hideElements.concat([
            labelNodes[0 + 1],
            labelNodes[labelNodes.length - 2],
        ]);
        if (window.innerWidth <= this._mobSizeConst.width) {
            hideElements.forEach(function (x) {
                x.style.visibility = 'hidden';
            });
        }
        else {
            hideElements.forEach(function (x) {
                x.style.visibility = '';
            });
        }
    };
    Controls.prototype._onPanelToggle = function (panel) {
        this._removePanelToggleListener();
        var isHide = panel.isHide;
        this._hideAllPanels();
        if (!isHide) {
            panel.show();
        }
        this._addPanelToggleListeners();
    };
    Controls.prototype._addPanelToggleListeners = function () {
        var _this = this;
        this._removePanelToggleListener();
        this._togglerEvents = [];
        this._mobileTogglePanels.forEach(function (x) {
            var toggler = function () { return _this._onPanelToggle(x); };
            _this._togglerEvents.push([x, toggler]);
            x.emitter.on('toggle', toggler);
        });
    };
    Controls.prototype._removePanelToggleListener = function () {
        var _this = this;
        this._mobileTogglePanels.forEach(function (x) {
            var mem = _this._togglerEvents.find(function (y) { return y[0] === x; });
            if (mem) {
                x.emitter.removeListener('toggle', mem[1]);
            }
        });
    };
    Controls.prototype._onMapClick = function () {
        if (this.isMobile) {
            this._hideAllPanels();
        }
    };
    Controls.prototype._onWindowResize = function () {
        var isMobile = this.isMobile;
        this.checkMobile();
        if (isMobile !== this.isMobile) {
            this.updateControls();
        }
        this._updateTimeSlider();
        this._updateMapEvents();
    };
    Controls.prototype._addEventsListeners = function () {
        var _this = this;
        window.addEventListener('resize', function () { return _this._onWindowResize(); }, false);
    };
    Controls.prototype._hideAllPanels = function () {
        var _this = this;
        this._openPanels = [];
        this._mobileTogglePanels.forEach(function (x) {
            if (!x.isHide) {
                _this._openPanels.push(x);
            }
            x.hide();
        });
    };
    Controls.prototype._addMapClickEvent = function () {
        this.app.webMap.emitter.on('click', this._eventBindings.onMapClick);
    };
    Controls.prototype._removeMapClickEvent = function () {
        this.app.webMap.emitter.removeListener('click', this._eventBindings.onMapClick);
    };
    return Controls;
}());



/***/ }),

/***/ "./src/css/style.css":
/*!***************************!*\
  !*** ./src/css/style.css ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvVGltZU1hcC9UaW1lR3JvdXAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1RpbWVNYXAvVGltZU1hcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvVGltZU1hcC9UaW1lTWFwTG9hZGluZ0NvbnRyb2wudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvTGlua3MvTGlua3Muc2Nzcz80NWRiIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL0xpbmtzL0xpbmtzLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL0xpbmtzL1RvZ2dsZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvTGlua3MvYWJvdXRFbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9MaW5rcy9hYm91dFJ1LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL0xpbmtzL2ltZy9uZXh0Z2lzLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9MaW5rcy9pbWcvcmV3aW5kX25leHQuc3ZnIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL0xpbmtzL2ltZy9yZXdpbmRfcHJldmlvdXMuc3ZnIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1BhbmVscy9MZWdlbmRQYW5lbENvbnRyb2wuY3NzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1BhbmVscy9MZWdlbmRQYW5lbENvbnRyb2wudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvUGFuZWxzL1BhbmVsQ29udHJvbC5jc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvUGFuZWxzL1BhbmVsQ29udHJvbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9QYW5lbHMvUGVyaW9kUGFuZWxDb250cm9sLmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9QYW5lbHMvUGVyaW9kUGFuZWxDb250cm9sLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1BhbmVscy9ZZWFyc1N0YXRQYW5lbENvbnRyb2wuY3NzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1BhbmVscy9ZZWFyc1N0YXRQYW5lbENvbnRyb2wudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvU2xpZGVyQ29udHJvbC5jc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvU2xpZGVyQ29udHJvbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udHJvbHMvQ29udHJvbHMuY3NzIiwid2VicGFjazovLy8uL3NyYy9jb250cm9scy9Db250cm9scy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY3NzL3N0eWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPbUI7QUFtQ25CO0lBcUJFLHlCQUNVLE1BQTJCLEVBQzVCLE9BQStCO1FBRnhDLGlCQWdCQzs7UUFmUyxXQUFNLEdBQU4sTUFBTSxDQUFxQjtRQUM1QixZQUFPLEdBQVAsT0FBTyxDQUF3QjtRQW5CeEMsWUFBTyxHQUFHLEdBQUcsQ0FBQztRQUVkLG9CQUFlLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLHNCQUFpQixHQUFHLEVBQUUsQ0FBQztRQUdmLGFBQVEsR0FBRyxJQUFJLENBQUM7UUFFaEIsZ0JBQVcsR0FBdUMsRUFBRSxDQUFDO1FBQ3JELGtCQUFhLEdBQW1DLEVBQUUsQ0FBQztRQUNuRCxzQkFBaUIsR0FBc0IsRUFBRSxDQUFDO1FBQzFDLHFCQUFnQixHQUlwQixFQUFFLENBQUM7UUFNTCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQzlCLElBQUksQ0FBQyxRQUFRLFNBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLG1DQUFJLElBQUksQ0FBQztRQUU3QyxPQUFPLENBQUMsS0FBSyxTQUFHLE9B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O0lBQ0gsZUFBQztBQUFELENBQUM7Ozs7Ozs7Ozs7Ozs7QUM5U0QsdUMiLCJmaWxlIjoibWFpbn4uX3NyY19UNGE1MTMyMC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIE1hcCxcbiAgUG9wdXAsXG4gIE1hcE1vdXNlRXZlbnQsXG4gIEV2ZW50RGF0YSxcbiAgTG5nTGF0Qm91bmRzLFxuICBHZW9KU09OU291cmNlLFxufSBmcm9tICdtYXBib3gtZ2wnO1xuXG5pbXBvcnQgV2ViTWFwLCB7XG4gIE12dEFkYXB0ZXJPcHRpb25zLFxuICBWZWN0b3JMYXllckFkYXB0ZXIsXG4gIFByb3BlcnRpZXNGaWx0ZXIsXG59IGZyb20gJ0BuZXh0Z2lzL3dlYm1hcCc7XG5pbXBvcnQgeyBGZWF0dXJlLCBGZWF0dXJlQ29sbGVjdGlvbiwgUG9pbnQsIFBvbHlnb24gfSBmcm9tICdnZW9qc29uJztcblxudHlwZSBVc2VkTWFwRXZlbnRzID0gJ2NsaWNrJyB8ICdtb3VzZWVudGVyJyB8ICdtb3VzZWxlYXZlJztcbnR5cGUgVExheWVyID0gc3RyaW5nW107XG5leHBvcnQgdHlwZSBUaW1lTGF5ZXIgPSBWZWN0b3JMYXllckFkYXB0ZXI8TWFwLCBUTGF5ZXIsIE12dEFkYXB0ZXJPcHRpb25zPjtcblxuZXhwb3J0IGludGVyZmFjZSBUaW1lTGF5ZXJzR3JvdXBPcHRpb25zIHtcbiAgbmFtZTogc3RyaW5nO1xuICBiYXNlVXJsOiBzdHJpbmc7XG4gIGZpbHRlcklkRmllbGQ/OiBzdHJpbmc7XG4gIG1hbnVhbE9wYWNpdHk/OiBib29sZWFuO1xuICBvcGFjaXR5PzogbnVtYmVyO1xuICBvcmRlcj86IG51bWJlcjtcbiAgZGF0YUxvYWRlZD86IGJvb2xlYW47XG4gIHZpc2libGU/OiBib29sZWFuO1xuICBzZWxlY3RPbkxheWVyQ2xpY2s/OiBib29sZWFuO1xuICBvbGROZ3dNdnRBcGk/OiBib29sZWFuO1xuICBhZGRMYXllcnM6IChcbiAgICB1cmw6IHN0cmluZyxcbiAgICBpZDogc3RyaW5nXG4gICkgPT4gUHJvbWlzZTxUaW1lTGF5ZXI+W10gfCBQcm9taXNlPFByb21pc2U8VGltZUxheWVyPltdPjtcbiAgc2V0VXJsPzogKG9wdDogeyBiYXNlVXJsOiBzdHJpbmc7IHJlc291cmNlSWQ6IHN0cmluZyB9KSA9PiBzdHJpbmc7XG4gIGdldEZpbGxDb2xvcj86ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55O1xuICBjcmVhdGVQb3B1cENvbnRlbnQ/OiAocHJvcHM6IGFueSkgPT4gSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XG4gIHNldEZpbHRlcj86IChwcm9wZXJ0aWVzOiBQcm9wZXJ0aWVzRmlsdGVyLCBpZD86IG51bWJlciB8IHN0cmluZykgPT4gdm9pZDtcbiAgcmVtb3ZlRmlsdGVyPzogKGlkPzogbnVtYmVyIHwgc3RyaW5nKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgVGltZUxheWVyc0dyb3VwIHtcbiAgbmFtZTogc3RyaW5nO1xuICBjdXJyZW50TGF5ZXJJZD86IHN0cmluZztcbiAgYmVmb3JlTGF5ZXJJZD86IHN0cmluZztcbiAgb3BhY2l0eSA9IDAuODtcbiAgb3JkZXI/OiBudW1iZXI7XG4gIHBvaW50Rml0TWF4Wm9vbSA9IDc7XG4gIHBvbHlnb25GaXRNYXhab29tID0gMTI7XG5cbiAgcHJpdmF0ZSBfZmlsdGVyPzogUHJvcGVydGllc0ZpbHRlcjtcbiAgcHJpdmF0ZSBfdmlzaWJsZSA9IHRydWU7XG4gIHByaXZhdGUgX3BvcHVwPzogUG9wdXA7XG4gIHByaXZhdGUgX3RpbWVMYXllcnM6IHsgW2xheWVySWQ6IHN0cmluZ106IFRpbWVMYXllcltdIH0gPSB7fTtcbiAgcHJpdmF0ZSBfbGF5ZXJzTG9hZGVkOiB7IFtsYXllcklkOiBzdHJpbmddOiBib29sZWFuIH0gPSB7fTtcbiAgcHJpdmF0ZSBfb25EYXRhTG9hZEV2ZW50czogQXJyYXk8KCkgPT4gdm9pZD4gPSBbXTtcbiAgcHJpdmF0ZSBfb25MYXllckNsaWNrTWVtOiB7XG4gICAgW2xheWVySWQ6IHN0cmluZ106IHtcbiAgICAgIFtldiBpbiBVc2VkTWFwRXZlbnRzXT86IChldjogTWFwTW91c2VFdmVudCAmIEV2ZW50RGF0YSkgPT4gdm9pZDtcbiAgICB9O1xuICB9ID0ge307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSB3ZWJNYXA6IFdlYk1hcDxNYXAsIFRMYXllcj4sXG4gICAgcHVibGljIG9wdGlvbnM6IFRpbWVMYXllcnNHcm91cE9wdGlvbnNcbiAgKSB7XG4gICAgdGhpcy5uYW1lID0gdGhpcy5vcHRpb25zLm5hbWU7XG4gICAgdGhpcy5fdmlzaWJsZSA9IHRoaXMub3B0aW9ucy52aXNpYmxlID8/IHRydWU7XG5cbiAgICBvcHRpb25zLm9yZGVyID0gb3B0aW9ucy5vcmRlciA/PyB0aGlzLndlYk1hcC5yZXNlcnZlT3JkZXIoKTtcbiAgICB0aGlzLm9yZGVyID0gb3B0aW9ucy5vcmRlcjtcbiAgICBpZiAob3B0aW9ucy5vcGFjaXR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMub3BhY2l0eSA9IG9wdGlvbnMub3BhY2l0eTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2lzV2FpdERhdGFMb2FkZWRHcm91cCgpKSB7XG4gICAgICB3ZWJNYXAubWFwQWRhcHRlci5lbWl0dGVyLm9uKCdkYXRhLWxvYWRlZCcsIChkYXRhKSA9PiB0aGlzLl9vbkRhdGEoZGF0YSkpO1xuICAgICAgd2ViTWFwLm1hcEFkYXB0ZXIuZW1pdHRlci5vbignZGF0YS1lcnJvcicsIChkYXRhKSA9PiB0aGlzLl9vbkRhdGEoZGF0YSkpO1xuICAgIH1cbiAgfVxuXG4gIGhpZGUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3Zpc2libGUpIHtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3RpbWVMYXllcnMpLmZvckVhY2goKHgpID0+IHRoaXMuX2hpZGVMYXllcih4KSk7XG4gICAgICB0aGlzLl92aXNpYmxlID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgc2hvdygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX3Zpc2libGUgJiYgdGhpcy5jdXJyZW50TGF5ZXJJZCkge1xuICAgICAgdGhpcy5fdmlzaWJsZSA9IHRydWU7XG4gICAgICB0aGlzLl9zaG93TGF5ZXIodGhpcy5jdXJyZW50TGF5ZXJJZCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlTGF5ZXIobGF5ZXJJZDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICB0aGlzLmJlZm9yZUxheWVySWQgPSB0aGlzLmN1cnJlbnRMYXllcklkO1xuICAgIHRoaXMuY3VycmVudExheWVySWQgPSBsYXllcklkO1xuICAgIHJldHVybiB0aGlzLnN3aXRjaExheWVyKHRoaXMuYmVmb3JlTGF5ZXJJZCB8fCAnJywgbGF5ZXJJZCk7XG4gIH1cblxuICB1cGRhdGVMYXllcnNDb2xvcigpOiB2b2lkIHtcbiAgICBjb25zdCBtYXAgPSB0aGlzLndlYk1hcC5tYXBBZGFwdGVyLm1hcDtcbiAgICBpZiAobWFwKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmdldEZpbGxDb2xvcikge1xuICAgICAgICBjb25zdCBmaWxsQ29sb3JEYXJrZW4gPSB0aGlzLm9wdGlvbnMuZ2V0RmlsbENvbG9yKHsgZGFya2VuOiAwLjUgfSk7XG4gICAgICAgIGNvbnN0IGZpbGxDb2xvciA9IHRoaXMub3B0aW9ucy5nZXRGaWxsQ29sb3IoKTtcbiAgICAgICAgZm9yIChjb25zdCBsIGluIHRoaXMuX2xheWVyc0xvYWRlZCkge1xuICAgICAgICAgIGlmIChsLmluZGV4T2YoJy1ib3VuZCcpICE9PSAtMSkge1xuICAgICAgICAgICAgbWFwLnNldFBhaW50UHJvcGVydHkobCwgJ2xpbmUtY29sb3InLCBmaWxsQ29sb3JEYXJrZW4pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtYXAuc2V0UGFpbnRQcm9wZXJ0eShsLCAnZmlsbC1jb2xvcicsIGZpbGxDb2xvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVzaERhdGFMb2FkRXZlbnQoZXZlbnQ6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX29uRGF0YUxvYWRFdmVudHMucHVzaChldmVudCk7XG4gIH1cblxuICBmaXRUb0ZpbHRlcihmaWx0ZXI6IGFueVtdLCB0aW1lTGF5ZXI6IFRpbWVMYXllcik6IEZlYXR1cmVbXSB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgbWFwID0gdGhpcy53ZWJNYXAubWFwQWRhcHRlci5tYXA7XG4gICAgaWYgKG1hcCAmJiB0eXBlb2YgdGltZUxheWVyLnNvdXJjZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IGlzTmd3R2VvSnNvbiA9IHRpbWVMYXllci5zb3VyY2Uuc3RhcnRzV2l0aCgnbmd3OicpO1xuICAgICAgbGV0IGZlYXR1cmVzOiBGZWF0dXJlW10gPSBbXTtcbiAgICAgIGlmIChpc05nd0dlb0pzb24pIHtcbiAgICAgICAgLy8gY29uc3QgbGF5ZXJzID0gdGltZUxheWVyLmdldExheWVycygpO1xuICAgICAgICAvLyBmZWF0dXJlcyA9IGxheWVycy5tYXAoeCA9PiB4LmZlYXR1cmUpIGFzIEZlYXR1cmVbXTtcbiAgICAgICAgY29uc3Qgc291cmNlID0gbWFwLmdldFNvdXJjZSh0aW1lTGF5ZXIuc291cmNlKSBhcyBHZW9KU09OU291cmNlO1xuICAgICAgICBjb25zdCBmZWF0dXJlQ29sbGVjdGlvbjogRmVhdHVyZUNvbGxlY3Rpb24gPVxuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICBzb3VyY2UuX2RhdGEgYXMgRmVhdHVyZUNvbGxlY3Rpb247XG4gICAgICAgIGNvbnN0IGZpbHRlcklkRmllbGQgPSB0aGlzLm9wdGlvbnMuZmlsdGVySWRGaWVsZCB8fCAnaWQnO1xuICAgICAgICBmZWF0dXJlcyA9IGZlYXR1cmVDb2xsZWN0aW9uLmZlYXR1cmVzLmZpbHRlcigoeCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlkczogbnVtYmVyW10gPSBbXS5jb25jYXQoZmlsdGVyWzJdKTtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgeC5wcm9wZXJ0aWVzICYmIGlkcy5pbmRleE9mKHgucHJvcGVydGllc1tmaWx0ZXJJZEZpZWxkXSkgIT09IC0xXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGZlYXR1cmVzID0gbWFwLnF1ZXJ5U291cmNlRmVhdHVyZXModGltZUxheWVyLnNvdXJjZSwge1xuICAgICAgICAvLyAgIGZpbHRlclxuICAgICAgICAvLyB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHNvdXJjZUxheWVyOiBzdHJpbmcgfCB1bmRlZmluZWQgPVxuICAgICAgICAgICduZ3c6JyArICh0aW1lTGF5ZXIub3B0aW9ucy5uYW1lIHx8IHRpbWVMYXllci5pZCk7XG4gICAgICAgIGNvbnN0IHNvdXJjZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gdGltZUxheWVyLnNvdXJjZTtcbiAgICAgICAgZmVhdHVyZXMgPSBtYXAucXVlcnlTb3VyY2VGZWF0dXJlcyhzb3VyY2UsIHtcbiAgICAgICAgICBmaWx0ZXIsXG4gICAgICAgICAgc291cmNlTGF5ZXIsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGZlYXR1cmVzICYmIGZlYXR1cmVzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9maXRUb0ZlYXR1cmVzKGZlYXR1cmVzKTtcbiAgICAgICAgcmV0dXJuIGZlYXR1cmVzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNob3dPbmx5Q3VycmVudExheWVyKCk6IHZvaWQge1xuICAgIHRoaXMuaGlkZU5vdEN1cnJlbnRMYXllcnMoKTtcbiAgICB0aGlzLm1ha2VPcGFjaXR5KCk7XG4gIH1cblxuICBjbGVhbigpOiB2b2lkIHtcbiAgICB0aGlzLl9yZW1vdmVQb3B1cCgpO1xuICAgIHRoaXMuX2NsZWFuRGF0YUxvYWRFdmVudHMoKTtcbiAgICBpZiAodGhpcy5jdXJyZW50TGF5ZXJJZCkge1xuICAgICAgdGhpcy5fcmVtb3ZlTGF5ZXJMaXN0ZW5lcnModGhpcy5jdXJyZW50TGF5ZXJJZCk7XG4gICAgICB0aGlzLl9oaWRlTGF5ZXIodGhpcy5jdXJyZW50TGF5ZXJJZCk7XG4gICAgfVxuICAgIHRoaXMuY3VycmVudExheWVySWQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBzd2l0Y2hMYXllcihmcm9tSWQ6IHN0cmluZywgdG9JZDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5fcmVtb3ZlUG9wdXAoKTtcbiAgICAgIHRoaXMuX2NsZWFuRGF0YUxvYWRFdmVudHMoKTtcbiAgICAgIGlmICh0b0lkICYmIGZyb21JZCAhPT0gdG9JZCkge1xuICAgICAgICB0aGlzLnB1c2hEYXRhTG9hZEV2ZW50KHJlc29sdmUpO1xuICAgICAgICB0aGlzLl9zaG93TGF5ZXIodG9JZClcbiAgICAgICAgICAudGhlbigoaWRfKSA9PiB7XG4gICAgICAgICAgICBpZiAoaWRfID09PSB0aGlzLmN1cnJlbnRMYXllcklkKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2FkZExheWVyTGlzdGVuZXJzKGlkXyk7XG4gICAgICAgICAgICAgIC8vIGRvIG5vdCBoaWRlIHVubG9hZGVkIGxheWVyIGlmIGl0IGZpcnN0XG4gICAgICAgICAgICAgIGlmIChmcm9tSWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVMYXllckxpc3RlbmVycyhmcm9tSWQpO1xuICAgICAgICAgICAgICAgIC8vIG5vdCBhbGwgdGlsZXMgZm9yIHRoaXMgbGF5ZXIgaXMgbG9hZGVkLCBoaWRlIHVudGlsIGZ1bGwgbG9hZGluZ1xuICAgICAgICAgICAgICAgIHRoaXMuX3NldExheWVyT3BhY2l0eShpZF8sIDApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmICghdGhpcy5faXNXYWl0RGF0YUxvYWRlZEdyb3VwKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vblNvdXJjZUlzTG9hZGVkKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlamVjdChgTm90IGN1cnJlbnQgaWRgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaCgoZXIpID0+IHtcbiAgICAgICAgICAgIHJlamVjdChlcik7XG4gICAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdG9JZDtcbiAgICB9KTtcbiAgfVxuXG4gIGhpZGVMYXllcihsYXllcklkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl9oaWRlTGF5ZXIobGF5ZXJJZCk7XG4gIH1cblxuICBnZXRUaW1lTGF5ZXIobGF5ZXJJZD86IHN0cmluZyk6IFRpbWVMYXllcltdIHwgdW5kZWZpbmVkIHtcbiAgICBsYXllcklkID0gbGF5ZXJJZCAhPT0gdW5kZWZpbmVkID8gbGF5ZXJJZCA6IHRoaXMuY3VycmVudExheWVySWQ7XG4gICAgaWYgKGxheWVySWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl90aW1lTGF5ZXJzW2xheWVySWRdO1xuICAgIH1cbiAgfVxuXG4gIGZvckVhY2hUaW1lTGF5ZXIobGF5ZXJJZDogc3RyaW5nLCBmdW46ICh0aW1lTGF5ZXI6IFRpbWVMYXllcikgPT4gdm9pZCk6IHZvaWQge1xuICAgIGNvbnN0IHRpbWVMYXllciA9IHRoaXMuX3RpbWVMYXllcnNbbGF5ZXJJZF07XG4gICAgaWYgKHRpbWVMYXllcikge1xuICAgICAgdGltZUxheWVyLmZvckVhY2goKHgpID0+IGZ1bih4KSk7XG4gICAgfVxuICB9XG5cbiAgc2VsZWN0TGF5ZXJGZWF0dXJlKGZlYXR1cmU6IEZlYXR1cmUsIGFkYXB0ZXJJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgcHJvcCA9IGZlYXR1cmUucHJvcGVydGllcztcbiAgICBpZiAocHJvcCAmJiB0aGlzLm9wdGlvbnMuZmlsdGVySWRGaWVsZCkge1xuICAgICAgY29uc3QgZmlsdGVySWRGaWVsZCA9IHRoaXMub3B0aW9ucy5maWx0ZXJJZEZpZWxkO1xuICAgICAgY29uc3QgZmlkID0gcHJvcFtmaWx0ZXJJZEZpZWxkXTtcbiAgICAgIGNvbnN0IGFkYXB0ZXIgPSB0aGlzLl9nZXRXZWJNYXBMYXllcihhZGFwdGVySWQpO1xuICAgICAgaWYgKGFkYXB0ZXIgJiYgYWRhcHRlci5zZWxlY3QpIHtcbiAgICAgICAgYWRhcHRlci5zZWxlY3QoW1tmaWx0ZXJJZEZpZWxkLCAnZXEnLCBOdW1iZXIoZmlkKV1dKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZWxlY3QoZmlkczogc3RyaW5nLCBpZD86IHN0cmluZywgZml0ID0gZmFsc2UpOiBGZWF0dXJlW10gfCB1bmRlZmluZWQge1xuICAgIGlkID0gaWQgPz8gdGhpcy5jdXJyZW50TGF5ZXJJZDtcblxuICAgIGlmIChpZCkge1xuICAgICAgY29uc3QgaWRzOiBudW1iZXJbXSA9IGZpZHMuc3BsaXQoJywnKS5tYXAoKHgpID0+IE51bWJlcih4KSk7XG4gICAgICBjb25zdCBsYXllcnMgPSB0aGlzLl90aW1lTGF5ZXJzW2lkXTtcbiAgICAgIGNvbnN0IGZpbHRlcklkRmllbGQgPSB0aGlzLm9wdGlvbnMuZmlsdGVySWRGaWVsZDtcbiAgICAgIGNvbnN0IG1hcExheWVyczogVGltZUxheWVyW10gPSBbXTtcbiAgICAgIGxheWVycy5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcExheWVyID0geCAmJiB4LmxheWVyICYmIHgubGF5ZXJbMF07XG4gICAgICAgIGlmIChpZHMgJiYgbWFwTGF5ZXIgJiYgZmlsdGVySWRGaWVsZCkge1xuICAgICAgICAgIGlmICh4ICYmIHguc2VsZWN0KSB7XG4gICAgICAgICAgICB4LnNlbGVjdChbW2ZpbHRlcklkRmllbGQsICdpbicsIGlkc11dKTtcbiAgICAgICAgICAgIG1hcExheWVycy5wdXNoKHgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAoZml0KSB7XG4gICAgICAgIGZvciAoY29uc3QgdGltZUxheWVyIG9mIG1hcExheWVycykge1xuICAgICAgICAgIGNvbnN0IGZlYXR1cmVzID0gdGhpcy5maXRUb0ZpbHRlcihcbiAgICAgICAgICAgIFsnaW4nLCBmaWx0ZXJJZEZpZWxkLCAuLi5pZHNdLFxuICAgICAgICAgICAgdGltZUxheWVyXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoZmVhdHVyZXMgJiYgZmVhdHVyZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmVhdHVyZXM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0RmlsdGVyKGZpbHRlcjogUHJvcGVydGllc0ZpbHRlcik6IHZvaWQge1xuICAgIGlmIChmaWx0ZXIgJiYgZmlsdGVyLmxlbmd0aCkge1xuICAgICAgdGhpcy5fZmlsdGVyID0gZmlsdGVyO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9maWx0ZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2V0RmlsdGVyKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuc2V0RmlsdGVyKHRoaXMuX2ZpbHRlciB8fCBbXSwgdGhpcy5jdXJyZW50TGF5ZXJJZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3VwZGF0ZUZpbHRlcigpO1xuICAgIH1cbiAgfVxuXG4gIGhpZGVOb3RDdXJyZW50TGF5ZXJzKCk6IHZvaWQge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuX3RpbWVMYXllcnMpLmZvckVhY2goKGlkKSA9PiB7XG4gICAgICBpZiAoaWQgIT09IHRoaXMuY3VycmVudExheWVySWQpIHtcbiAgICAgICAgdGhpcy5faGlkZUxheWVyKGlkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2NsZWFuRGF0YUxvYWRFdmVudHMoKSB7XG4gICAgdGhpcy5fb25EYXRhTG9hZEV2ZW50cyA9IFtdO1xuICB9XG5cbiAgcHJpdmF0ZSBtYWtlT3BhY2l0eSgpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50TGF5ZXJJZCkge1xuICAgICAgdGhpcy5fc2V0TGF5ZXJPcGFjaXR5KHRoaXMuY3VycmVudExheWVySWQsIHRoaXMub3BhY2l0eSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0V2ViTWFwTGF5ZXJJZChpZD86IHN0cmluZykge1xuICAgIHJldHVybiBTdHJpbmcoaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0V2ViTWFwTGF5ZXIoaWQ6IHN0cmluZyk6IFZlY3RvckxheWVyQWRhcHRlciB7XG4gICAgcmV0dXJuIHRoaXMud2ViTWFwLmdldExheWVyKFxuICAgICAgdGhpcy5fZ2V0V2ViTWFwTGF5ZXJJZChpZClcbiAgICApIGFzIFZlY3RvckxheWVyQWRhcHRlcjtcbiAgfVxuXG4gIHByaXZhdGUgX2lzV2FpdERhdGFMb2FkZWRHcm91cCgpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmRhdGFMb2FkZWQgIT09IHVuZGVmaW5lZFxuICAgICAgPyB0aGlzLm9wdGlvbnMuZGF0YUxvYWRlZFxuICAgICAgOiB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0TGF5ZXJPcGFjaXR5KGlkOiBzdHJpbmcsIHZhbHVlOiBudW1iZXIpIHtcbiAgICBjb25zdCBkYXRhTG9hZGVkID0gdGhpcy5faXNXYWl0RGF0YUxvYWRlZEdyb3VwKCk7XG4gICAgdGhpcy5mb3JFYWNoVGltZUxheWVyKGlkLCAoZGF0YUxheWVySWQpID0+IHtcbiAgICAgIGlmIChkYXRhTG9hZGVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndlYk1hcC5zZXRMYXllck9wYWNpdHkoZGF0YUxheWVySWQsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLndlYk1hcC5oaWRlTGF5ZXIoZGF0YUxheWVySWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLndlYk1hcC5zaG93TGF5ZXIoZGF0YUxheWVySWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9yZW1vdmVQb3B1cCgpIHtcbiAgICBpZiAodGhpcy5fcG9wdXApIHtcbiAgICAgIHRoaXMuX3BvcHVwLnJlbW92ZSgpO1xuICAgICAgdGhpcy5fcG9wdXAgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfaXNDdXJyZW50RGF0YUxheWVyKGxheWVySWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGN1cnJlbnRMYXllcnMgPVxuICAgICAgdGhpcy5jdXJyZW50TGF5ZXJJZCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICB0aGlzLl90aW1lTGF5ZXJzW3RoaXMuY3VycmVudExheWVySWRdO1xuICAgIHJldHVybiBjdXJyZW50TGF5ZXJzXG4gICAgICA/IGN1cnJlbnRMYXllcnMuc29tZSgoeCkgPT4ge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB4LmlkID09PSBsYXllcklkIHx8XG4gICAgICAgICAgICB4Lm9wdGlvbnMubmFtZSA9PT0gbGF5ZXJJZCB8fFxuICAgICAgICAgICAgKHgubGF5ZXIgJiYgeC5sYXllci5zb21lKCh5KSA9PiB5ID09PSBsYXllcklkKSlcbiAgICAgICAgICApO1xuICAgICAgICB9KVxuICAgICAgOiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldExheWVySWRGcm9tU291cmNlKHRhcmdldDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuX3RpbWVMYXllcnNbdGFyZ2V0XSkge1xuICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG4gICAgZm9yIChjb25zdCB0IGluIHRoaXMuX3RpbWVMYXllcnMpIHtcbiAgICAgIGNvbnN0IHRpbWVMYXllckxpc3QgPSB0aGlzLl90aW1lTGF5ZXJzW3RdO1xuICAgICAgY29uc3QgYWRhcHRlciA9IHRpbWVMYXllckxpc3QuZmluZCgoeCkgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICh4LnNvdXJjZSAmJiB4LnNvdXJjZSA9PT0gdGFyZ2V0KSB8fFxuICAgICAgICAgICh4Lm9wdGlvbnMgJiYgeC5vcHRpb25zLnVybCAmJiB4Lm9wdGlvbnMudXJsID09PSB0YXJnZXQpXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICAgIGlmIChhZGFwdGVyKSB7XG4gICAgICAgIHJldHVybiBhZGFwdGVyLmlkO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX29uRGF0YShkYXRhOiB7IHRhcmdldDogc3RyaW5nIH0pIHtcbiAgICBjb25zdCBsYXllcklkID0gdGhpcy5fZ2V0TGF5ZXJJZEZyb21Tb3VyY2UoZGF0YS50YXJnZXQpO1xuICAgIGlmIChsYXllcklkKSB7XG4gICAgICBjb25zdCBsb2FkZWRZZXQgPSB0aGlzLl9sYXllcnNMb2FkZWRbbGF5ZXJJZF07XG4gICAgICBjb25zdCBpc0N1cnJlbnRMYXllciA9IHRoaXMuX2lzQ3VycmVudERhdGFMYXllcihsYXllcklkKTtcbiAgICAgIGNvbnN0IGlzSGlzdG9yeUxheWVyID0gdGhpcy5faXNIaXN0b3J5TGF5ZXIobGF5ZXJJZCk7XG4gICAgICBpZiAoIWxvYWRlZFlldCAmJiBpc0hpc3RvcnlMYXllciAmJiBpc0N1cnJlbnRMYXllcikge1xuICAgICAgICB0aGlzLl9sYXllcnNMb2FkZWRbbGF5ZXJJZF0gPSB0cnVlO1xuICAgICAgICB0aGlzLl9vblNvdXJjZUlzTG9hZGVkKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfb25MYXllckNsaWNrKFxuICAgIGU6IE1hcE1vdXNlRXZlbnQgJiBFdmVudERhdGEsXG4gICAgbGF5ZXJJZDogc3RyaW5nLFxuICAgIGFkYXB0ZXJJZDogc3RyaW5nXG4gICkge1xuICAgIGNvbnN0IG1hcCA9IHRoaXMud2ViTWFwLm1hcEFkYXB0ZXIubWFwO1xuICAgIGNvbnN0IHBvaW50ID0gZS5wb2ludDtcbiAgICBjb25zdCB3aWR0aCA9IDU7XG4gICAgY29uc3QgaGVpZ2h0ID0gNTtcbiAgICAvLyBGaW5kIGFsbCBmZWF0dXJlcyB3aXRoaW4gYSBib3VuZGluZyBib3ggYXJvdW5kIGEgcG9pbnRcbiAgICBpZiAobWFwKSB7XG4gICAgICBjb25zdCBmZWF0dXJlcyA9IG1hcC5xdWVyeVJlbmRlcmVkRmVhdHVyZXMoXG4gICAgICAgIFtcbiAgICAgICAgICBbcG9pbnQueCAtIHdpZHRoIC8gMiwgcG9pbnQueSAtIGhlaWdodCAvIDJdLFxuICAgICAgICAgIFtwb2ludC54ICsgd2lkdGggLyAyLCBwb2ludC55ICsgaGVpZ2h0IC8gMl0sXG4gICAgICAgIF0sXG4gICAgICAgIHsgbGF5ZXJzOiBbbGF5ZXJJZF0gfVxuICAgICAgKTtcbiAgICAgIGNvbnN0IGZlYXR1cmUgPSBmZWF0dXJlc1swXTtcbiAgICAgIGNvbnN0IHByb3AgPSBmZWF0dXJlLnByb3BlcnRpZXM7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNyZWF0ZVBvcHVwQ29udGVudCkge1xuICAgICAgICBjb25zdCBodG1sID0gdGhpcy5vcHRpb25zLmNyZWF0ZVBvcHVwQ29udGVudChwcm9wKTtcbiAgICAgICAgaWYgKGh0bWwpIHtcbiAgICAgICAgICB0aGlzLl9yZW1vdmVQb3B1cCgpO1xuICAgICAgICAgIHRoaXMuX3BvcHVwID0gbmV3IFBvcHVwKClcbiAgICAgICAgICAgIC5zZXRMbmdMYXQoZS5sbmdMYXQpXG4gICAgICAgICAgICAuc2V0RE9NQ29udGVudChodG1sKVxuICAgICAgICAgICAgLmFkZFRvKG1hcCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHNlbGVjdE9uTGF5ZXJDbGljayA9IHRoaXMub3B0aW9ucy5zZWxlY3RPbkxheWVyQ2xpY2sgPz8gdHJ1ZTtcbiAgICAgIGlmIChzZWxlY3RPbkxheWVyQ2xpY2spIHtcbiAgICAgICAgdGhpcy5zZWxlY3RMYXllckZlYXR1cmUoZmVhdHVyZSwgYWRhcHRlcklkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9yZW1vdmVMYXllckxpc3RlbmVycyhsYXllcklkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBtYXAgPSB0aGlzLndlYk1hcC5tYXBBZGFwdGVyLm1hcDtcbiAgICAvLyBtYXAub2ZmKCdjbGljaycsIGxheWVySWQpO1xuXG4gICAgY29uc3QgbWVtRXZlbnRzID0gdGhpcy5fb25MYXllckNsaWNrTWVtW2xheWVySWRdO1xuICAgIGlmIChtZW1FdmVudHMgJiYgbWFwKSB7XG4gICAgICBmb3IgKGNvbnN0IGV2IGluIG1lbUV2ZW50cykge1xuICAgICAgICBjb25zdCBtZW1FdmVudCA9IG1lbUV2ZW50c1tldiBhcyBVc2VkTWFwRXZlbnRzXTtcbiAgICAgICAgaWYgKG1lbUV2ZW50KSB7XG4gICAgICAgICAgbWFwLm9mZihldiwgbWVtRXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX3JlbW92ZVBvcHVwKCk7XG4gIH1cblxuICBwcml2YXRlIF9hZGRMYXllckxpc3RlbmVycyhpZDogc3RyaW5nKSB7XG4gICAgY29uc3QgbWFwID0gdGhpcy53ZWJNYXAubWFwQWRhcHRlci5tYXA7XG4gICAgaWYgKG1hcCkge1xuICAgICAgdGhpcy5fZm9yRWFjaERhdGFMYXllcihpZCwgKGxheWVySWQpID0+IHtcbiAgICAgICAgY29uc3QgbGF5ZXJDbGlja0JpbmQgPSAoZXY6IE1hcE1vdXNlRXZlbnQgJiBFdmVudERhdGEpID0+XG4gICAgICAgICAgdGhpcy5fb25MYXllckNsaWNrKGV2LCBsYXllcklkLCBpZCk7XG4gICAgICAgIGNvbnN0IGxheWVyTW91c2VFbnRlckJpbmQgPSAoKSA9PlxuICAgICAgICAgIChtYXAuZ2V0Q2FudmFzKCkuc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInKTtcbiAgICAgICAgY29uc3QgbGF5ZXJNb3VzZUxlYXZlQmluZCA9ICgpID0+IChtYXAuZ2V0Q2FudmFzKCkuc3R5bGUuY3Vyc29yID0gJycpO1xuXG4gICAgICAgIG1hcC5vbignY2xpY2snLCBsYXllcklkLCBsYXllckNsaWNrQmluZCk7XG4gICAgICAgIC8vIENoYW5nZSB0aGUgY3Vyc29yIHRvIGEgcG9pbnRlciB3aGVuIHRoZSBtb3VzZSBpcyBvdmVyIHRoZSBwbGFjZXMgbGF5ZXIuXG4gICAgICAgIG1hcC5vbignbW91c2VlbnRlcicsIGxheWVySWQsIGxheWVyTW91c2VFbnRlckJpbmQpO1xuICAgICAgICAvLyBDaGFuZ2UgaXQgYmFjayB0byBhIHBvaW50ZXIgd2hlbiBpdCBsZWF2ZXMuXG4gICAgICAgIG1hcC5vbignbW91c2VsZWF2ZScsIGxheWVySWQsIGxheWVyTW91c2VMZWF2ZUJpbmQpO1xuXG4gICAgICAgIHRoaXMuX29uTGF5ZXJDbGlja01lbVtsYXllcklkXSA9IHRoaXMuX29uTGF5ZXJDbGlja01lbVtsYXllcklkXSB8fCB7fTtcblxuICAgICAgICB0aGlzLl9vbkxheWVyQ2xpY2tNZW1bbGF5ZXJJZF0uY2xpY2sgPSBsYXllckNsaWNrQmluZDtcbiAgICAgICAgdGhpcy5fb25MYXllckNsaWNrTWVtW2xheWVySWRdLm1vdXNlZW50ZXIgPSBsYXllckNsaWNrQmluZDtcbiAgICAgICAgdGhpcy5fb25MYXllckNsaWNrTWVtW2xheWVySWRdLm1vdXNlbGVhdmUgPSBsYXllckNsaWNrQmluZDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2lzSGlzdG9yeUxheWVyKGxheWVySWQ6IHN0cmluZykge1xuICAgIHJldHVybiAhdGhpcy53ZWJNYXAuaXNCYXNlTGF5ZXIobGF5ZXJJZCk7XG4gIH1cblxuICBwcml2YXRlIF9pc0FsbERhdGFMYXllckxvYWRlZChsYXllcjogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuX2lzV2FpdERhdGFMb2FkZWRHcm91cCgpKSB7XG4gICAgICBjb25zdCB0aW1lTGF5ZXIgPSB0aGlzLl90aW1lTGF5ZXJzW2xheWVyXTtcbiAgICAgIGlmICh0aW1lTGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuIHRpbWVMYXllci5ldmVyeSgoeCkgPT4ge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB4LmlkID09PSBsYXllciB8fFxuICAgICAgICAgICAgeC5vcHRpb25zLm5hbWUgPT09IGxheWVyIHx8XG4gICAgICAgICAgICAoeC5sYXllciAmJiB4LmxheWVyLnNvbWUoKHkpID0+IHRoaXMuX2xheWVyc0xvYWRlZFt5XSkpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2ZvckVhY2hEYXRhTGF5ZXIoXG4gICAgbGF5ZXJJZDogc3RyaW5nLFxuICAgIGZ1bjogKGRhdGFMYXllcklkOiBzdHJpbmcpID0+IHZvaWRcbiAgKSB7XG4gICAgdGhpcy5mb3JFYWNoVGltZUxheWVyKFxuICAgICAgbGF5ZXJJZCxcbiAgICAgICh0aW1lTGF5ZXIpID0+IHRpbWVMYXllci5sYXllciAmJiB0aW1lTGF5ZXIubGF5ZXIuZm9yRWFjaCgoeSkgPT4gZnVuKHkpKVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIF9vblNvdXJjZUlzTG9hZGVkKCkge1xuICAgIGlmIChcbiAgICAgIHRoaXMuY3VycmVudExheWVySWQgJiZcbiAgICAgIHRoaXMuX2lzQWxsRGF0YUxheWVyTG9hZGVkKHRoaXMuY3VycmVudExheWVySWQpXG4gICAgKSB7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5tYW51YWxPcGFjaXR5KSB7XG4gICAgICAgIHRoaXMuc2hvd09ubHlDdXJyZW50TGF5ZXIoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2V4ZWN1dGVEYXRhTG9hZEV2ZW50cygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2V4ZWN1dGVEYXRhTG9hZEV2ZW50cygpIHtcbiAgICBmb3IgKGxldCBmcnkgPSAwOyBmcnkgPCB0aGlzLl9vbkRhdGFMb2FkRXZlbnRzLmxlbmd0aDsgZnJ5KyspIHtcbiAgICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5fb25EYXRhTG9hZEV2ZW50c1tmcnldO1xuICAgICAgZXZlbnQoKTtcbiAgICB9XG4gICAgdGhpcy5fb25EYXRhTG9hZEV2ZW50cyA9IFtdO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBfYWRkTGF5ZXIodXJsOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBQcm9taXNlPFRpbWVMYXllcltdPiB7XG4gICAgY29uc3QgbGF5ZXJzID0gYXdhaXQgdGhpcy5vcHRpb25zLmFkZExheWVycyh1cmwsIGlkKTtcbiAgICB0aGlzLl90aW1lTGF5ZXJzW2lkXSA9IFtdO1xuICAgIGZvciAoY29uc3QgbCBvZiBsYXllcnMpIHtcbiAgICAgIGNvbnN0IGxheWVyID0gYXdhaXQgbDtcbiAgICAgIHRoaXMuX3RpbWVMYXllcnNbaWRdLnB1c2gobGF5ZXIpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdGltZUxheWVyc1tpZF07XG4gIH1cblxuICBwcml2YXRlIF90b2dnbGVMYXllcihpZDogc3RyaW5nLCBzdGF0dXM6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9mb3JFYWNoRGF0YUxheWVyKGlkLCAobCkgPT4ge1xuICAgICAgdGhpcy5fbGF5ZXJzTG9hZGVkW2xdID0gZmFsc2U7XG4gICAgfSk7XG4gICAgdGhpcy5fbGF5ZXJzTG9hZGVkW2lkXSA9IGZhbHNlO1xuICAgIGlmIChzdGF0dXMpIHtcbiAgICAgIHRoaXMuX3Nob3dMYXllcihpZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZm9yRWFjaFRpbWVMYXllcihpZCwgKGwpID0+IHtcbiAgICAgICAgdGhpcy53ZWJNYXAucmVtb3ZlTGF5ZXIobCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3RpbWVMYXllcnNbaWRdID0gW107XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfaGlkZUxheWVyKGxheWVySWQ6IHN0cmluZykge1xuICAgIHRoaXMuX3RvZ2dsZUxheWVyKGxheWVySWQsIGZhbHNlKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Nob3dMYXllcihpZDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBpZiAodGhpcy5fdmlzaWJsZSkge1xuICAgICAgY29uc3QgdG9nZ2xlID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmZvckVhY2hUaW1lTGF5ZXIoaWQsIChsKSA9PiB0aGlzLndlYk1hcC50b2dnbGVMYXllcihsLCB0cnVlKSk7XG4gICAgICAgIHJldHVybiBpZDtcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGV4aXN0ID0gdGhpcy5fZ2V0V2ViTWFwTGF5ZXIoaWQpO1xuICAgICAgaWYgKCFleGlzdCkge1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLm9wdGlvbnMuc2V0VXJsXG4gICAgICAgICAgPyB0aGlzLm9wdGlvbnMuc2V0VXJsKHtcbiAgICAgICAgICAgICAgYmFzZVVybDogdGhpcy5vcHRpb25zLmJhc2VVcmwsXG4gICAgICAgICAgICAgIHJlc291cmNlSWQ6IGlkLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICA6IHRoaXMub3B0aW9ucy5vbGROZ3dNdnRBcGlcbiAgICAgICAgICA/IHRoaXMub3B0aW9ucy5iYXNlVXJsICsgJy9hcGkvcmVzb3VyY2UvJyArIGlkICsgJy97en0ve3h9L3t5fS5tdnQnXG4gICAgICAgICAgOiB0aGlzLm5ld05nd012dFVybCh7XG4gICAgICAgICAgICAgIGJhc2VVcmw6IHRoaXMub3B0aW9ucy5iYXNlVXJsLFxuICAgICAgICAgICAgICByZXNvdXJjZUlkOiBpZCxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRMYXllcih1cmwsIGlkKS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdG9nZ2xlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0b2dnbGUoKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5fZXhlY3V0ZURhdGFMb2FkRXZlbnRzKCk7XG4gICAgICAgIHJlc29sdmUoaWQpO1xuICAgICAgfSwgMCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG5ld05nd012dFVybChvcHQ6IHsgYmFzZVVybDogc3RyaW5nOyByZXNvdXJjZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiAoXG4gICAgICBvcHQuYmFzZVVybCArXG4gICAgICAnL2FwaS9jb21wb25lbnQvZmVhdHVyZV9sYXllci9tdnQ/eD17eH0meT17eX0mej17en0mJyArXG4gICAgICAncmVzb3VyY2U9JyArXG4gICAgICBvcHQucmVzb3VyY2VJZFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIF9maXRUb0ZlYXR1cmVzKGZlYXR1cmVzOiBGZWF0dXJlW10pIHtcbiAgICBjb25zdCBib3VuZHMgPSBuZXcgTG5nTGF0Qm91bmRzKCk7XG4gICAgY29uc3QgdHlwZXM6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3QgZXh0ZW5kQ29vcmRzID0gKGNvb3JkczogYW55W10pID0+IHtcbiAgICAgIGlmIChjb29yZHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIGJvdW5kcy5leHRlbmQoY29vcmRzKTtcbiAgICAgICAgfSBjYXRjaCAoZXIpIHtcbiAgICAgICAgICAvLyBpZ25vcmVcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29vcmRzLmZvckVhY2goKGMpID0+IHtcbiAgICAgICAgICBleHRlbmRDb29yZHMoYyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmZWF0dXJlcy5mb3JFYWNoKChmZWF0dXJlKSA9PiB7XG4gICAgICBjb25zdCBnZW9tZXRyeTogUG9seWdvbiB8IFBvaW50ID0gZmVhdHVyZS5nZW9tZXRyeSBhcyBQb2x5Z29uIHwgUG9pbnQ7XG4gICAgICBleHRlbmRDb29yZHMoZ2VvbWV0cnkuY29vcmRpbmF0ZXMpO1xuICAgICAgdHlwZXMucHVzaChmZWF0dXJlLmdlb21ldHJ5LnR5cGUpO1xuICAgIH0pO1xuICAgIGlmICh0aGlzLndlYk1hcC5tYXBBZGFwdGVyLm1hcCkge1xuICAgICAgY29uc3Qgb25seVBvaW50ID0gdHlwZXMuZXZlcnkoKHgpID0+IHggPT09ICdQb2ludCcpO1xuICAgICAgdGhpcy53ZWJNYXAubWFwQWRhcHRlci5tYXAuZml0Qm91bmRzKGJvdW5kcywge1xuICAgICAgICBwYWRkaW5nOiAyMCxcbiAgICAgICAgbWF4Wm9vbTogb25seVBvaW50ID8gdGhpcy5wb2ludEZpdE1heFpvb20gOiB0aGlzLnBvbHlnb25GaXRNYXhab29tLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlRmlsdGVyKCkge1xuICAgIGlmICh0aGlzLmN1cnJlbnRMYXllcklkKSB7XG4gICAgICBjb25zdCBsYXllcnMgPSB0aGlzLl90aW1lTGF5ZXJzW3RoaXMuY3VycmVudExheWVySWRdO1xuICAgICAgY29uc3QgZmlsdGVySWRGaWVsZCA9IHRoaXMub3B0aW9ucy5maWx0ZXJJZEZpZWxkO1xuICAgICAgbGF5ZXJzLmZvckVhY2goKHgpID0+IHtcbiAgICAgICAgaWYgKGZpbHRlcklkRmllbGQpIHtcbiAgICAgICAgICBpZiAoeCAmJiB4LnByb3BlcnRpZXNGaWx0ZXIpIHtcbiAgICAgICAgICAgIHgucHJvcGVydGllc0ZpbHRlcih0aGlzLl9maWx0ZXIgfHwgW10pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBNYXAgfSBmcm9tICdtYXBib3gtZ2wnO1xuXG5pbXBvcnQgU3RyaWN0RXZlbnRFbWl0dGVyIGZyb20gJ3N0cmljdC1ldmVudC1lbWl0dGVyLXR5cGVzJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbmltcG9ydCBXZWJNYXAsIHsgTXZ0QWRhcHRlck9wdGlvbnMsIFZlY3RvckxheWVyQWRhcHRlciB9IGZyb20gJ0BuZXh0Z2lzL3dlYm1hcCc7XG5cbmltcG9ydCB7IFRpbWVMYXllcnNHcm91cE9wdGlvbnMsIFRpbWVMYXllcnNHcm91cCB9IGZyb20gJy4vVGltZUdyb3VwJztcbmltcG9ydCB7XG4gIExheWVySWRSZWNvcmQsXG4gIEdyb3Vwc01ldGEsXG4gIExheWVyc0dyb3VwLFxuICBMYXllck1ldGFSZWNvcmQsXG4gIExheWVyTWV0YSxcbn0gZnJvbSAnLi4vaW50ZXJmYWNlcyc7XG5cbnR5cGUgVExheWVyID0gc3RyaW5nW107XG5leHBvcnQgdHlwZSBUaW1lTGF5ZXIgPSBWZWN0b3JMYXllckFkYXB0ZXI8TWFwLCBUTGF5ZXIsIE12dEFkYXB0ZXJPcHRpb25zPjtcblxuZXhwb3J0IGludGVyZmFjZSBUaW1lR3JvdXBEZWZpbml0aW9uIHtcbiAgdGltZUdyb3VwOiBUaW1lTGF5ZXJzR3JvdXA7XG4gIHRpbWVMYXllcjogVGltZUxheWVyO1xufVxuXG5sZXQgRVZFTlRTX0lEUyA9IDA7XG4vLyBjb25zdCBPUkRFUiA9IDA7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTG9hZGluZ0xheWVyRmluaXNoRXZlbnQge1xuICBsYXllcklkOiBzdHJpbmcgfCBmYWxzZTtcbiAgbGF5ZXI6IFRpbWVMYXllcnNHcm91cDtcbn1cblxuaW50ZXJmYWNlIEV2ZW50cyB7XG4gICdsb2FkaW5nOnN0YXJ0JzogTGF5ZXJJZFJlY29yZDtcbiAgJ2xvYWRpbmc6ZmluaXNoJzogTGF5ZXJJZFJlY29yZCB8IGZhbHNlO1xuICAnbG9hZGluZy1sYXllcjpmaW5pc2gnOiBMb2FkaW5nTGF5ZXJGaW5pc2hFdmVudDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUaW1lTWFwT3B0aW9ucyB7XG4gIHRpbWVMYXllcnNHcm91cHM/OiBUaW1lTGF5ZXJzR3JvdXBPcHRpb25zW107XG4gIGZyb21ZZWFyPzogbnVtYmVyO1xuICB0b1llYXI/OiBudW1iZXI7XG4gIGdldFN0YXR1c0xheWVyOiAoY29uZmlnOiBMYXllcnNHcm91cCkgPT4gVGltZUxheWVyc0dyb3VwT3B0aW9ucyB8IHVuZGVmaW5lZDtcbiAgb25MYXllclVwZGF0ZT86ICh5ZWFyOiBudW1iZXIpID0+IHZvaWQ7XG4gIG9uU3RlcFJlYWR5PzogKHllYXI6IG51bWJlcikgPT4gdm9pZDtcbiAgb25SZXNldD86ICgpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBUaW1lTWFwIHtcbiAgZW1pdHRlcjogU3RyaWN0RXZlbnRFbWl0dGVyPEV2ZW50RW1pdHRlciwgRXZlbnRzPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgY3VycmVudFllYXIhOiBudW1iZXI7XG4gIG5leHRZZWFyPzogbnVtYmVyO1xuICBfbWluWWVhciA9IDA7XG4gIF9tYXhZZWFyID0gMDtcbiAgcHJpdmF0ZSByZWFkb25seSBfdGltZUxheWVyc0dyb3VwczogVGltZUxheWVyc0dyb3VwW10gPSBbXTtcbiAgcHJpdmF0ZSBfb25Hcm91cHNMb2FkRXZlbnRzOiBSZWNvcmQ8bnVtYmVyLCAoLi4uYXJnczogYW55W10pID0+IHZvaWQ+ID0gW107XG4gIHByaXZhdGUgX2dyb3Vwc0NvbmZpZzogUmVjb3JkPHN0cmluZywgR3JvdXBzTWV0YT4gPSB7fTtcbiAgcHJpdmF0ZSBfbG9hZExheWVyUHJvbWlzZXM6IHtcbiAgICBbbGF5ZXJOYW1lOiBzdHJpbmddOiB7IGlkOiBzdHJpbmc7IHByb21pc2U6IFByb21pc2U8YW55PiB9O1xuICB9ID0ge307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSB3ZWJNYXA6IFdlYk1hcDxNYXAsIFRMYXllcj4sXG4gICAgcHJpdmF0ZSBvcHRpb25zOiBUaW1lTWFwT3B0aW9ucyA9IHt9IGFzIFRpbWVNYXBPcHRpb25zXG4gICkge31cblxuICBnZXRUaW1lR3JvdXAoZ3JvdXBOYW1lID0gJycpOiBUaW1lTGF5ZXJzR3JvdXAge1xuICAgIGNvbnN0IGdyb3VwID0gdGhpcy5fdGltZUxheWVyc0dyb3Vwcy5maW5kKFxuICAgICAgKHgpID0+IHgubmFtZSA9PT0gZ3JvdXBOYW1lXG4gICAgKSBhcyBUaW1lTGF5ZXJzR3JvdXA7XG4gICAgcmV0dXJuIGdyb3VwO1xuICB9XG5cbiAgZ2V0VGltZUdyb3VwQnlBZGFwdGVySWQoaWQ6IHN0cmluZyk6IFRpbWVHcm91cERlZmluaXRpb24gfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9nZXRUaW1lR3JvdXBCeSgodGltZUxheWVyKSA9PiB0aW1lTGF5ZXIuaWQgPT09IGlkKTtcbiAgfVxuXG4gIGdldFRpbWVHcm91cEJ5TGF5ZXJJZChpZDogc3RyaW5nKTogVGltZUdyb3VwRGVmaW5pdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX2dldFRpbWVHcm91cEJ5KCh0aW1lTGF5ZXIpID0+ICEhdGltZUxheWVyLmxheWVyPy5pbmNsdWRlcyhpZCkpO1xuICB9XG5cbiAgZ2V0VGltZUdyb3VwcygpOiBUaW1lTGF5ZXJzR3JvdXBbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3RpbWVMYXllcnNHcm91cHM7XG4gIH1cblxuICBhZGRUaW1lR3JvdXAob3B0aW9uczogVGltZUxheWVyc0dyb3VwT3B0aW9ucyk6IHZvaWQge1xuICAgIGNvbnN0IHRpbWVMYXllcnNHcm91cCA9IG5ldyBUaW1lTGF5ZXJzR3JvdXAodGhpcy53ZWJNYXAsIG9wdGlvbnMpO1xuICAgIHRoaXMuX3RpbWVMYXllcnNHcm91cHMucHVzaCh0aW1lTGF5ZXJzR3JvdXApO1xuICB9XG5cbiAgdXBkYXRlQnlZZWFyKHllYXI6IG51bWJlciwgcHJldmlvdXM/OiBib29sZWFuKTogdm9pZCB7XG4gICAgY29uc3QgbGF5ZXJzSWQgPSB0aGlzLl9nZXRMYXllcklkc0J5WWVhcih5ZWFyLCBwcmV2aW91cyk7XG4gICAgaWYgKGxheWVyc0lkKSB7XG4gICAgICB0aGlzLnVwZGF0ZUxheWVycyhsYXllcnNJZCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdGlvbnMub25MYXllclVwZGF0ZSkge1xuICAgICAgdGhpcy5vcHRpb25zLm9uTGF5ZXJVcGRhdGUoeWVhcik7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlTGF5ZXIoXG4gICAgbGF5ZXJJZDogc3RyaW5nIHwgZmFsc2UsXG4gICAgZ3JvdXBOYW1lID0gJydcbiAgKTogUHJvbWlzZTxUaW1lTGF5ZXJzR3JvdXAgfCB1bmRlZmluZWQ+IHtcbiAgICBjb25zdCBncm91cCA9IHRoaXMuZ2V0VGltZUdyb3VwKGdyb3VwTmFtZSk7XG4gICAgaWYgKGdyb3VwKSB7XG4gICAgICBpZiAobGF5ZXJJZCkge1xuICAgICAgICByZXR1cm4gZ3JvdXAudXBkYXRlTGF5ZXIobGF5ZXJJZCkudGhlbigoKSA9PiBncm91cCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBncm91cC5jbGVhbigpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVuZGVmaW5lZCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodW5kZWZpbmVkKTtcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZUxheWVycyhsYXllcklkUmVjb3JkOiBMYXllcklkUmVjb3JkKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgdXBkYXRlTGF5ZXJzUHJvbWlzZSA9IGF3YWl0IHRoaXMuZ2V0VXBkYXRlTGF5ZXJzUHJvbWlzZShcbiAgICAgIGxheWVySWRSZWNvcmRcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmZpbmlzaExvYWRpbmcodXBkYXRlTGF5ZXJzUHJvbWlzZSwgbGF5ZXJJZFJlY29yZCk7XG4gIH1cblxuICByZXNldExvYWRpbmcoKTogdm9pZCB7XG4gICAgdGhpcy5fdGltZUxheWVyc0dyb3Vwcy5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICBpZiAoeC5iZWZvcmVMYXllcklkKSB7XG4gICAgICAgIHguY3VycmVudExheWVySWQgPSB4LmJlZm9yZUxheWVySWQ7XG4gICAgICAgIHguaGlkZU5vdEN1cnJlbnRMYXllcnMoKTtcbiAgICAgICAgeC5iZWZvcmVMYXllcklkID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICh0aGlzLm9wdGlvbnMub25SZXNldCkge1xuICAgICAgdGhpcy5vcHRpb25zLm9uUmVzZXQoKTtcbiAgICB9XG4gICAgdGhpcy5fbG9hZExheWVyUHJvbWlzZXMgPSB7fTtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnbG9hZGluZzpmaW5pc2gnLCBmYWxzZSk7XG4gIH1cblxuICBmaW5pc2hMb2FkaW5nKGdyb3VwczogKCgpID0+IHZvaWQpW10sIGxheWVySWRSZWNvcmQ6IExheWVySWRSZWNvcmQpOiB2b2lkIHtcbiAgICBjb25zdCBsYXllcklkUmVjb3JkTGlzdCA9IE9iamVjdC5rZXlzKGxheWVySWRSZWNvcmQpO1xuXG4gICAgdGhpcy5fdGltZUxheWVyc0dyb3Vwcy5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICB4LmJlZm9yZUxheWVySWQgPSB1bmRlZmluZWQ7XG4gICAgICBpZiAoIWxheWVySWRSZWNvcmRMaXN0LmluY2x1ZGVzKHgubmFtZSkpIHtcbiAgICAgICAgaWYgKHguY3VycmVudExheWVySWQpIHtcbiAgICAgICAgICB4LmhpZGVMYXllcih4LmN1cnJlbnRMYXllcklkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGdyb3Vwcy5mb3JFYWNoKCh4OiAoKSA9PiB2b2lkKSA9PiB4KCkpO1xuICAgIHRoaXMuX2xvYWRMYXllclByb21pc2VzID0ge307XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2xvYWRpbmc6ZmluaXNoJywgbGF5ZXJJZFJlY29yZCk7XG4gIH1cblxuICBnZXRVcGRhdGVMYXllcnNQcm9taXNlKGxheWVySWRSZWNvcmQ6IExheWVySWRSZWNvcmQpOiBQcm9taXNlPGFueVtdPiB7XG4gICAgY29uc3QgcHJvbWlzZXM6IFByb21pc2U8YW55PltdID0gW107XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2xvYWRpbmc6c3RhcnQnLCBsYXllcklkUmVjb3JkKTtcbiAgICBjb25zdCBsYXllcklkUmVjb3JkTGlzdCA9IE9iamVjdC5rZXlzKGxheWVySWRSZWNvcmQpO1xuICAgIGxheWVySWRSZWNvcmRMaXN0LmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBsYXllcklkUmVjb3JkW2tleV07XG4gICAgICBjb25zdCBleGlzdCA9IHRoaXMuX2xvYWRMYXllclByb21pc2VzW2tleV07XG4gICAgICBpZiAoZXhpc3QgJiYgZXhpc3QucHJvbWlzZSkge1xuICAgICAgICBwcm9taXNlcy5wdXNoKGV4aXN0LnByb21pc2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcHJvbWlzZSA9IHRoaXMudXBkYXRlTGF5ZXIodmFsdWUsIGtleSkudGhlbigoeCkgPT4ge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9sb2FkTGF5ZXJQcm9taXNlc1trZXldO1xuICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoeCkge1xuICAgICAgICAgICAgICB4LnNob3dPbmx5Q3VycmVudExheWVyKCk7XG4gICAgICAgICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdsb2FkaW5nLWxheWVyOmZpbmlzaCcsIHtcbiAgICAgICAgICAgICAgICBsYXllcklkOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICBsYXllcjogeCxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHByb21pc2VzLnB1c2gocHJvbWlzZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgfVxuXG4gIHB1c2hEYXRhTG9hZEV2ZW50KGV2ZW50OiAoLi4uYXJnczogYW55W10pID0+IHZvaWQpOiBudW1iZXIge1xuICAgIGNvbnN0IGlkID0gRVZFTlRTX0lEUysrO1xuICAgIGNvbnN0IHByb21pc2VzID0gdGhpcy5fdGltZUxheWVyc0dyb3Vwcy5tYXAoKHgpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHgucHVzaERhdGFMb2FkRXZlbnQocmVzb2x2ZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICB0aGlzLl9vbkdyb3Vwc0xvYWRFdmVudHNbaWRdID0gZXZlbnQ7XG4gICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4ge1xuICAgICAgY29uc3QgX2V2ZW50ID0gdGhpcy5fb25Hcm91cHNMb2FkRXZlbnRzW2lkXTtcbiAgICAgIGlmIChfZXZlbnQpIHtcbiAgICAgICAgX2V2ZW50KCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG5cbiAgdW5zZWxlY3Qob3B0OiB7IGV4Y2x1ZGU/OiBzdHJpbmdbXSB9ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLl90aW1lTGF5ZXJzR3JvdXBzLmZvckVhY2goKHgpID0+IHtcbiAgICAgIGNvbnN0IGluY2x1ZGUgPSBvcHQuZXhjbHVkZSA/IG9wdC5leGNsdWRlLmluZGV4T2YoeC5uYW1lKSA9PT0gLTEgOiB0cnVlO1xuICAgICAgaWYgKGluY2x1ZGUgJiYgeC5jdXJyZW50TGF5ZXJJZCkge1xuICAgICAgICB4LmZvckVhY2hUaW1lTGF5ZXIoeC5jdXJyZW50TGF5ZXJJZCwgKHk6IFZlY3RvckxheWVyQWRhcHRlcikgPT4ge1xuICAgICAgICAgIGlmICh5LnVuc2VsZWN0ICYmIHkuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHkudW5zZWxlY3QoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYnVpbGRUaW1lTWFwKGRhdGE6IExheWVyc0dyb3VwW10pOiB2b2lkIHtcbiAgICB0aGlzLl9ncm91cHNDb25maWcgPSB0aGlzLl9wcm9jZXNzR3JvdXBzTWV0YShkYXRhKTtcbiAgICB0aGlzLl9hZGRUaW1lTGF5ZXJzR3JvdXBzKGRhdGEpO1xuICAgIGlmICghdGhpcy5jdXJyZW50WWVhciAmJiB0aGlzLl9taW5ZZWFyKSB7XG4gICAgICB0aGlzLmN1cnJlbnRZZWFyID0gdGhpcy5fbWluWWVhcjtcbiAgICB9XG4gICAgT2JqZWN0LnZhbHVlcyh0aGlzLl9ncm91cHNDb25maWcpLmZvckVhY2goKHgpID0+IHtcbiAgICAgIHgubGF5ZXJzTWV0YS5zb3J0KChhLCBiKSA9PiAoYS5mcm9tIDwgYi5mcm9tID8gLTEgOiAxKSk7XG4gICAgfSk7XG4gIH1cblxuICBfYWRkVGltZUxheWVyc0dyb3Vwcyhjb25maWc6IExheWVyc0dyb3VwW10pOiB2b2lkIHtcbiAgICBjb25maWcuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgY29uc3Qgc3RhdHVzTGF5ZXIgPSB0aGlzLm9wdGlvbnMuZ2V0U3RhdHVzTGF5ZXIoeCk7XG4gICAgICBpZiAoc3RhdHVzTGF5ZXIpIHtcbiAgICAgICAgdGhpcy5hZGRUaW1lR3JvdXAoc3RhdHVzTGF5ZXIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgX3N0ZXBSZWFkeShcbiAgICB5ZWFyOiBudW1iZXIsXG4gICAgY2FsbGJhY2s6ICh5ZWFyOiBudW1iZXIsIG5leHRDYj86ICgpID0+IHZvaWQsIHN0b3BDYj86ICgpID0+IHZvaWQpID0+IHZvaWQsXG4gICAgcHJldmlvdXM/OiBib29sZWFuXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxldCBuZXh0TGF5ZXJzOiBMYXllck1ldGFSZWNvcmQgPSB0aGlzLl9nZXRMYXllcnNCeVllYXIoeWVhciwgcHJldmlvdXMpO1xuICAgIGlmICghbmV4dExheWVycykge1xuICAgICAgbmV4dExheWVycyA9IHRoaXMuX2dldE5leHRMYXllcnMoeWVhciwgcHJldmlvdXMpO1xuICAgIH1cblxuICAgIGlmIChuZXh0TGF5ZXJzKSB7XG4gICAgICBsZXQgdXBkYXRlTGF5ZXJzUHJvbWlzZTogYW55W10gfCB1bmRlZmluZWQ7XG4gICAgICBsZXQgbGF5ZXJJZFJlY29yZDogTGF5ZXJJZFJlY29yZCB8IHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IHkgPSB5ZWFyO1xuICAgICAgdGhpcy5uZXh0WWVhciA9IHk7XG4gICAgICBjb25zdCBuZXh0ID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBmaW5pc2ggPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5uZXh0WWVhciA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRZZWFyID0geTtcbiAgICAgICAgICBpZiAodXBkYXRlTGF5ZXJzUHJvbWlzZSAmJiBsYXllcklkUmVjb3JkKSB7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaExvYWRpbmcodXBkYXRlTGF5ZXJzUHJvbWlzZSwgbGF5ZXJJZFJlY29yZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMub25TdGVwUmVhZHkpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5vblN0ZXBSZWFkeSh5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHJlc2V0TG9hZGluZyA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLm5leHRZZWFyID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHRoaXMucmVzZXRMb2FkaW5nKCk7XG4gICAgICAgIH07XG4gICAgICAgIGNhbGxiYWNrKFxuICAgICAgICAgIHksXG4gICAgICAgICAgKCkgPT4gZmluaXNoKCksXG4gICAgICAgICAgKCkgPT4gcmVzZXRMb2FkaW5nKClcbiAgICAgICAgKTtcbiAgICAgIH07XG4gICAgICBjb25zdCBub0NoYW5nZSA9IE9iamVjdC5lbnRyaWVzKG5leHRMYXllcnMpLmV2ZXJ5KChbZ3JvdXBOYW1lLCB4XSkgPT4ge1xuICAgICAgICBjb25zdCB0aW1lR3JvdXAgPSB0aGlzLmdldFRpbWVHcm91cChncm91cE5hbWUpO1xuICAgICAgICBpZiAodGltZUdyb3VwKSB7XG4gICAgICAgICAgY29uc3QgbmV3SWQgPSB4ICYmIHguaWQ7XG4gICAgICAgICAgcmV0dXJuIHRpbWVHcm91cC5jdXJyZW50TGF5ZXJJZCA9PT0gU3RyaW5nKG5ld0lkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0pO1xuICAgICAgaWYgKG5vQ2hhbmdlKSB7XG4gICAgICAgIG5leHQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxheWVySWRSZWNvcmQgPSB0aGlzLl9sYXllck1ldGFUb0lkUmVjb3JkKG5leHRMYXllcnMpO1xuICAgICAgICB1cGRhdGVMYXllcnNQcm9taXNlID0gYXdhaXQgdGhpcy5nZXRVcGRhdGVMYXllcnNQcm9taXNlKGxheWVySWRSZWNvcmQpO1xuICAgICAgICBuZXh0KCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLl9taW5ZZWFyICYmIHRoaXMuX21heFllYXIpIHtcbiAgICAgICAgY2FsbGJhY2socHJldmlvdXMgPyB0aGlzLl9taW5ZZWFyIDogdGhpcy5fbWF4WWVhcik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0VGltZUdyb3VwQnkoXG4gICAgZnVuOiAodGltZUxheWVyOiBUaW1lTGF5ZXIpID0+IGJvb2xlYW5cbiAgKTogVGltZUdyb3VwRGVmaW5pdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgZm9yIChsZXQgZnJ5ID0gMDsgZnJ5IDwgdGhpcy5fdGltZUxheWVyc0dyb3Vwcy5sZW5ndGg7IGZyeSsrKSB7XG4gICAgICBjb25zdCBsYXllckdyb3VwID0gdGhpcy5fdGltZUxheWVyc0dyb3Vwc1tmcnldO1xuICAgICAgY29uc3QgdGltZUxheWVyID0gbGF5ZXJHcm91cC5nZXRUaW1lTGF5ZXIoKTtcbiAgICAgIGlmICh0aW1lTGF5ZXIpIHtcbiAgICAgICAgZm9yIChsZXQgZiA9IDA7IGYgPCB0aW1lTGF5ZXIubGVuZ3RoOyBmKyspIHtcbiAgICAgICAgICBjb25zdCBsYXllciA9IHRpbWVMYXllcltmXTtcbiAgICAgICAgICBpZiAobGF5ZXIgJiYgZnVuKGxheWVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgdGltZUdyb3VwOiBsYXllckdyb3VwLCB0aW1lTGF5ZXI6IGxheWVyIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0TGF5ZXJzQnlZZWFyKHllYXI6IG51bWJlciwgcHJldmlvdXM/OiBib29sZWFuKTogTGF5ZXJNZXRhUmVjb3JkIHtcbiAgICBjb25zdCBsYXllcnNNZXRhOiBMYXllck1ldGFSZWNvcmQgPSB7fTtcbiAgICB0aGlzLmdldFRpbWVHcm91cHMoKS5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICBjb25zdCBncm91cENvbmZpZyA9IHRoaXMuX2dyb3Vwc0NvbmZpZ1t4Lm5hbWVdO1xuICAgICAgY29uc3QgbGF5ZXJzID0gZ3JvdXBDb25maWcubGF5ZXJzTWV0YS5maWx0ZXIoXG4gICAgICAgIC8vIGlmIHJhbmdlIGZyb20gOTAwIHRvIDkwMSwgZXZlbnQgbWF5IGJlIG9ubHkgaW4gOTAwXG4gICAgICAgIChkKSA9PiB5ZWFyID49IGQuZnJvbSAmJiB5ZWFyIDw9IGQudG9cbiAgICAgICk7XG4gICAgICBsYXllcnNNZXRhW3gubmFtZV0gPSBsYXllcnMubGVuZ3RoXG4gICAgICAgID8gcHJldmlvdXNcbiAgICAgICAgICA/IGxheWVyc1swXVxuICAgICAgICAgIDogbGF5ZXJzW2xheWVycy5sZW5ndGggLSAxXVxuICAgICAgICA6IGZhbHNlO1xuICAgIH0pO1xuICAgIHJldHVybiBsYXllcnNNZXRhO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0TGF5ZXJJZHNCeVllYXIoeWVhcjogbnVtYmVyLCBwcmV2aW91cz86IGJvb2xlYW4pOiBMYXllcklkUmVjb3JkIHtcbiAgICBjb25zdCBmaWx0ZXJlZExheWVycyA9IHRoaXMuX2dldExheWVyc0J5WWVhcih5ZWFyLCBwcmV2aW91cyk7XG4gICAgcmV0dXJuIHRoaXMuX2xheWVyTWV0YVRvSWRSZWNvcmQoZmlsdGVyZWRMYXllcnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBfbGF5ZXJNZXRhVG9JZFJlY29yZChtZXRhUmVjb3JkOiBMYXllck1ldGFSZWNvcmQpOiBMYXllcklkUmVjb3JkIHtcbiAgICBjb25zdCBsYXllcnNJZDogTGF5ZXJJZFJlY29yZCA9IHt9O1xuICAgIE9iamVjdC5lbnRyaWVzKG1ldGFSZWNvcmQpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIGxheWVyc0lkW2tleV0gPSBTdHJpbmcodmFsdWUuaWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGF5ZXJzSWRba2V5XSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBsYXllcnNJZDtcbiAgfVxuXG4gIC8vIGdldCBuZXh0IG9yIHByZXZpb3VzIHRlcnJpdG9yeSBjaGFuZ2VkIGxheWVyXG4gIHByaXZhdGUgX2dldE5leHRMYXllcnMoeWVhcjogbnVtYmVyLCBwcmV2aW91cz86IGJvb2xlYW4pOiBMYXllck1ldGFSZWNvcmQge1xuICAgIGNvbnN0IGxheWVyc01ldGFJblllYXIgPSB0aGlzLl9nZXRMYXllcnNCeVllYXIoeWVhcik7XG4gICAgY29uc3QgZmlsdGVyZWRMYXllcnM6IExheWVyTWV0YVJlY29yZCA9IHt9O1xuICAgIGZvciAoY29uc3QgbCBpbiBsYXllcnNNZXRhSW5ZZWFyKSB7XG4gICAgICBjb25zdCBsYXllck1ldGEgPSBsYXllcnNNZXRhSW5ZZWFyW2xdO1xuICAgICAgbGV0IG5leHRMYXllcjogTGF5ZXJNZXRhIHwgdW5kZWZpbmVkO1xuICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5fZ3JvdXBzQ29uZmlnW2xdO1xuICAgICAgaWYgKGxheWVyTWV0YSkge1xuICAgICAgICBjb25zdCBjdXJyZW50TGF5ZXJJZCA9IHRoaXMuZ2V0VGltZUdyb3VwKGNvbmZpZy5uYW1lKS5jdXJyZW50TGF5ZXJJZDtcbiAgICAgICAgaWYgKFN0cmluZyhsYXllck1ldGEuaWQpID09PSBjdXJyZW50TGF5ZXJJZCkge1xuICAgICAgICAgIGNvbnN0IGluZGV4ID0gY29uZmlnLmxheWVyc01ldGEuaW5kZXhPZihsYXllck1ldGEpO1xuICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIG5leHRMYXllciA9IGNvbmZpZy5sYXllcnNNZXRhW3ByZXZpb3VzID8gaW5kZXggLSAxIDogaW5kZXggKyAxXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGF5ZXJNZXRhO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiBubyBsYXllciBmb3IgdGhpcyB5ZWFyIGZpbmQgbmVhcmVzdFxuICAgICAgICBpZiAocHJldmlvdXMpIHtcbiAgICAgICAgICBuZXh0TGF5ZXIgPSBjb25maWcubGF5ZXJzTWV0YVxuICAgICAgICAgICAgLnNsaWNlKClcbiAgICAgICAgICAgIC5yZXZlcnNlKClcbiAgICAgICAgICAgIC5maW5kKChkKSA9PiBkLnRvIDw9IHllYXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5leHRMYXllciA9IGNvbmZpZy5sYXllcnNNZXRhLmZpbmQoKGQpID0+IGQuZnJvbSA+PSB5ZWFyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG5leHRMYXllcikge1xuICAgICAgICBmaWx0ZXJlZExheWVyc1tsXSA9IG5leHRMYXllcjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZpbHRlcmVkTGF5ZXJzO1xuICB9XG5cbiAgcHJpdmF0ZSBfcHJvY2Vzc0dyb3Vwc01ldGEoXG4gICAgbGF5ZXJzR3JvdXA6IExheWVyc0dyb3VwW11cbiAgKTogUmVjb3JkPHN0cmluZywgR3JvdXBzTWV0YT4ge1xuICAgIGNvbnN0IGdyb3Vwc01ldGE6IFJlY29yZDxzdHJpbmcsIEdyb3Vwc01ldGE+ID0ge307XG4gICAgbGF5ZXJzR3JvdXAuZm9yRWFjaCgoZ3JvdXApID0+IHtcbiAgICAgIGNvbnN0IGxheWVyc01ldGE6IExheWVyTWV0YVtdID0gW107XG4gICAgICBncm91cC5pdGVtcy5mb3JFYWNoKCh7IHJlc291cmNlIH0pID0+IHtcbiAgICAgICAgY29uc3QgbmFtZSA9IHJlc291cmNlLmRpc3BsYXlfbmFtZTtcbiAgICAgICAgLy8gY29uc3QgX21hdGNoID0gbmFtZS5tYXRjaCgnZnJvbV8oXFxcXGR7Myw0fSlfdG9fKFxcXFxkezMsNH0pLiokJyk7XG4gICAgICAgIGNvbnN0IF9tYXRjaCA9IG5hbWUubWF0Y2goJyhcXFxcZHszLDR9KV8odG9fKT8oXFxcXGR7Myw0fSkuKiQnKTtcbiAgICAgICAgaWYgKF9tYXRjaCkge1xuICAgICAgICAgIGNvbnN0IFtmcm9tLCB0b10gPSBbX21hdGNoWzFdLCBfbWF0Y2hbM11dLm1hcCgoeCkgPT4gTnVtYmVyKHgpKTtcbiAgICAgICAgICBjb25zdCBhbGxvd2VkWWVhciA9XG4gICAgICAgICAgICAodGhpcy5vcHRpb25zLmZyb21ZZWFyICYmIGZyb20gPCB0aGlzLm9wdGlvbnMuZnJvbVllYXIpIHx8XG4gICAgICAgICAgICAodGhpcy5vcHRpb25zLnRvWWVhciAmJiB0byA+IHRoaXMub3B0aW9ucy50b1llYXIpXG4gICAgICAgICAgICAgID8gZmFsc2VcbiAgICAgICAgICAgICAgOiB0cnVlO1xuICAgICAgICAgIGlmIChhbGxvd2VkWWVhcikge1xuICAgICAgICAgICAgdGhpcy5fbWluWWVhciA9XG4gICAgICAgICAgICAgICh0aGlzLl9taW5ZZWFyID4gZnJvbSA/IGZyb20gOiB0aGlzLl9taW5ZZWFyKSB8fCBmcm9tO1xuICAgICAgICAgICAgdGhpcy5fbWF4WWVhciA9ICh0aGlzLl9tYXhZZWFyIDwgdG8gPyB0byA6IHRoaXMuX21heFllYXIpIHx8IHRvO1xuICAgICAgICAgICAgbGF5ZXJzTWV0YS5wdXNoKHsgbmFtZSwgZnJvbSwgdG8sIGlkOiByZXNvdXJjZS5pZCB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgZ3JvdXBzTWV0YVtncm91cC5uYW1lXSA9IHsgbGF5ZXJzTWV0YTogbGF5ZXJzTWV0YSwgbmFtZTogZ3JvdXAubmFtZSB9O1xuICAgIH0pO1xuICAgIHJldHVybiBncm91cHNNZXRhO1xuICB9XG59XG4iLCJpbXBvcnQgeyBNYXBDb250cm9sIH0gZnJvbSAnQG5leHRnaXMvd2VibWFwJztcbmltcG9ydCB7IFRpbWVNYXAgfSBmcm9tICcuLi9UaW1lTWFwL1RpbWVNYXAnO1xuXG5leHBvcnQgY2xhc3MgVGltZU1hcExvYWRpbmdDb250cm9sIGltcGxlbWVudHMgTWFwQ29udHJvbCB7XG4gIHByaXZhdGUgX2NvbnRhaW5lcj86IEhUTUxFbGVtZW50O1xuXG4gIHByaXZhdGUgX19vbkxvYWRpbmdTdGFydDogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBfX29uTG9hZGluZ1N0b3A6ICgpID0+IHZvaWQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSB0aW1lTWFwOiBUaW1lTWFwKSB7XG4gICAgdGhpcy5fX29uTG9hZGluZ1N0YXJ0ID0gKCkgPT4gdGhpcy5fb25Mb2FkaW5nU3RhcnQoKTtcbiAgICB0aGlzLl9fb25Mb2FkaW5nU3RvcCA9ICgpID0+IHRoaXMuX29uTG9hZGluZ1N0b3AoKTtcbiAgfVxuXG4gIG9uQWRkKCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLl9jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgaWYgKHRoaXMudGltZU1hcCkge1xuICAgICAgdGhpcy50aW1lTWFwLmVtaXR0ZXIub24oJ2xvYWRpbmc6c3RhcnQnLCB0aGlzLl9fb25Mb2FkaW5nU3RhcnQpO1xuICAgICAgdGhpcy50aW1lTWFwLmVtaXR0ZXIub24oJ2xvYWRpbmc6ZmluaXNoJywgdGhpcy5fX29uTG9hZGluZ1N0b3ApO1xuICAgIH1cbiAgICByZXR1cm4gY29udGFpbmVyO1xuICB9XG5cbiAgb25SZW1vdmUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudGltZU1hcCkge1xuICAgICAgdGhpcy50aW1lTWFwLmVtaXR0ZXIub2ZmKCdsb2FkaW5nOnN0YXJ0JywgdGhpcy5fX29uTG9hZGluZ1N0YXJ0KTtcbiAgICAgIHRoaXMudGltZU1hcC5lbWl0dGVyLm9mZignbG9hZGluZzpmaW5pc2gnLCB0aGlzLl9fb25Mb2FkaW5nU3RvcCk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb250YWluZXIpIHtcbiAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX2NvbnRhaW5lci5wYXJlbnROb2RlO1xuICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQodGhpcy5fY29udGFpbmVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9vbkxvYWRpbmdTdGFydCgpIHtcbiAgICBpZiAodGhpcy5fY29udGFpbmVyKSB7XG4gICAgICB0aGlzLl9jb250YWluZXIuaW5uZXJIVE1MID0gJ0xvYWRpbmcuLi4nO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX29uTG9hZGluZ1N0b3AoKSB7XG4gICAgaWYgKHRoaXMuX2NvbnRhaW5lcikge1xuICAgICAgdGhpcy5fY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIH1cbiAgfVxufVxuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiaW1wb3J0ICcuL0xpbmtzLnNjc3MnO1xuaW1wb3J0ICcuL2ltZy9uZXh0Z2lzLnBuZyc7XG5cbmltcG9ydCB7IENvbnRyb2wgfSBmcm9tICdtYXBib3gtZ2wnO1xuaW1wb3J0IERpYWxvZywgeyBEaWFsb2dBZGFwdGVyT3B0aW9ucyB9IGZyb20gJ0BuZXh0Z2lzL2RpYWxvZyc7XG5pbXBvcnQgcGtnIGZyb20gJy4uLy4uLy4uL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgeyBDb250cm9scyB9IGZyb20gJy4uLy4uL2NvbnRyb2xzL0NvbnRyb2xzJztcblxuaW1wb3J0IHsgQXBwIH0gZnJvbSAnLi4vLi4vQXBwJztcbmltcG9ydCB7IFBhbmVsIH0gZnJvbSAnLi4vUGFuZWxzL1BhbmVsQ29udHJvbCc7XG5pbXBvcnQgeyBTbGlkZXJPcHRpb25zIH0gZnJvbSAnLi4vU2xpZGVyQ29udHJvbCc7XG5pbXBvcnQgeyBUb2dnbGVyIH0gZnJvbSAnLi9Ub2dnbGVyJztcbmltcG9ydCB7IGFib3V0U2hvcnRSdSB9IGZyb20gJy4vYWJvdXRSdSc7XG5pbXBvcnQgeyBhYm91dFNob3J0RW4gfSBmcm9tICcuL2Fib3V0RW4nO1xuXG5mdW5jdGlvbiBnZXRCYXNlTGF5ZXJUb2dnbGVyKGNvbnRyb2xzOiBDb250cm9scykge1xuICBjb25zdCBiYXNlTGF5ZXIgPSAnYmFzZWxheWVyJztcbiAgY29uc3QgYmFzZUxheWVyVG9nZ2xlciA9IG5ldyBUb2dnbGVyKHtcbiAgICBjbGFzc05hbWU6ICdiYXNlbGF5ZXJfX3RvZ2dsZXInLFxuICAgIHRpdGxlOiAn0KHQutGA0YvRgtGMINC/0L7QtNC70L7QttC60YMnLFxuICAgIHRpdGxlT2ZmOiAn0J/QvtC60LDQt9Cw0YLRjCDQv9C+0LTQu9C+0LbQutGDJyxcbiAgICB0b2dnbGVBY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgIGlmIChzdGF0dXMpIHtcbiAgICAgICAgY29udHJvbHMuYXBwLndlYk1hcC5zaG93TGF5ZXIoYmFzZUxheWVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRyb2xzLmFwcC53ZWJNYXAuaGlkZUxheWVyKGJhc2VMYXllcik7XG4gICAgICB9XG4gICAgfSxcbiAgfSk7XG4gIHJldHVybiBiYXNlTGF5ZXJUb2dnbGVyO1xufVxuXG5mdW5jdGlvbiBvcGVuRGlhbG9nKG9wdGlvbnM6IERpYWxvZ0FkYXB0ZXJPcHRpb25zKSB7XG4gIGNvbnN0IGRpYWxvZyA9IG5ldyBEaWFsb2cob3B0aW9ucyk7XG5cbiAgY29uc3QgaXNTYW1lID1cbiAgICBvcHRpb25zICYmIG9wdGlvbnMudGVtcGxhdGUgJiYgZGlhbG9nLm9wdGlvbnMudGVtcGxhdGUgPT09IG9wdGlvbnMudGVtcGxhdGU7XG4gIGlmICghaXNTYW1lKSB7XG4gICAgZGlhbG9nLnVwZGF0ZUNvbnRlbnQob3B0aW9ucy50ZW1wbGF0ZSk7XG4gIH1cbiAgZGlhbG9nLnNob3coKTtcbiAgcmV0dXJuIGRpYWxvZztcbn1cblxuaW50ZXJmYWNlIFNsaWRlclNldHRpbmdzIHtcbiAgbmFtZToga2V5b2YgU2xpZGVyT3B0aW9ucztcbiAgbGFiZWw6IHN0cmluZztcbiAgdHlwZTogJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGdldFllYXJzVG9nZ2xlcihjb250cm9sczogQ29udHJvbHMpIHtcbiAgY29uc3QgeWVhcnNTdGF0UGFuZWxDb250cm9sID0gY29udHJvbHMueWVhcnNTdGF0UGFuZWxDb250cm9sO1xuICBpZiAoeWVhcnNTdGF0UGFuZWxDb250cm9sKSB7XG4gICAgY29uc3QgeWVhcnNUb2dnbGVyID0gbmV3IFRvZ2dsZXIoe1xuICAgICAgY2xhc3NOYW1lOiAneWVhcnNfX3RvZ2dsZXInLFxuICAgICAgdGl0bGU6ICfQodC60YDRi9GC0Ywg0L/QsNC90LXQu9GMINC40LfQvNC10L3QtdC90LjRjyDQsiDRgtC10YDRgNC40YLQvtGA0LjQsNC70YzQvdC+0Lwg0YHQvtGB0YLQsNCy0LUnLFxuICAgICAgdGl0bGVPZmY6ICfQn9C+0LrQsNC30LDRgtGMINC/0LDQvdC10LvRjCDQuNC30LzQtdC90LXQvdC40Y8g0LIg0YLQtdGA0YDQuNGC0L7RgNC40LDQu9GM0L3QvtC8INGB0L7RgdGC0LDQstC1JyxcbiAgICAgIHRvZ2dsZUFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgICBpZiAoc3RhdHVzKSB7XG4gICAgICAgICAgeWVhcnNTdGF0UGFuZWxDb250cm9sLl9ibG9ja2VkID0gZmFsc2U7XG4gICAgICAgICAgeWVhcnNTdGF0UGFuZWxDb250cm9sLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB5ZWFyc1N0YXRQYW5lbENvbnRyb2wuaGlkZSgpO1xuICAgICAgICAgIHllYXJzU3RhdFBhbmVsQ29udHJvbC5fYmxvY2tlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gICAgeWVhcnNTdGF0UGFuZWxDb250cm9sLmVtaXR0ZXIub24oJ3RvZ2dsZScsIChzdGF0dXMpID0+IHtcbiAgICAgIHllYXJzVG9nZ2xlci50b2dnbGUoc3RhdHVzKTtcbiAgICB9KTtcbiAgICByZXR1cm4geWVhcnNUb2dnbGVyO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFBlcmlvZFRvZ2dsZXIoY29udHJvbHM6IENvbnRyb2xzKSB7XG4gIGNvbnN0IHBlcmlvZHNQYW5lbENvbnRyb2wgPSBjb250cm9scy5wZXJpb2RzUGFuZWxDb250cm9sO1xuICBpZiAocGVyaW9kc1BhbmVsQ29udHJvbCkge1xuICAgIGNvbnN0IHBlcmlvZFRvZ2dsZXIgPSBuZXcgVG9nZ2xlcih7XG4gICAgICBjbGFzc05hbWU6ICdwZXJpb2RfX3RvZ2dsZXInLFxuICAgICAgdGl0bGU6ICfQodC60YDRi9GC0Ywg0L/QsNC90LXQu9GMINC/0YDQsNCy0LjRgtC10LvQtdC5JyxcbiAgICAgIHRpdGxlT2ZmOiAn0J/QvtC60LDQt9Cw0YLRjCDQv9Cw0L3QtdC70Ywg0L/RgNCw0LLQuNGC0LXQu9C10LknLFxuICAgICAgdG9nZ2xlQWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICAgIGlmIChzdGF0dXMpIHtcbiAgICAgICAgICBwZXJpb2RzUGFuZWxDb250cm9sLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZXJpb2RzUGFuZWxDb250cm9sLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHBlcmlvZHNQYW5lbENvbnRyb2wuZW1pdHRlci5vbigndG9nZ2xlJywgKHN0YXR1cykgPT4ge1xuICAgICAgcGVyaW9kVG9nZ2xlci50b2dnbGUoc3RhdHVzKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcGVyaW9kVG9nZ2xlcjtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRMZWdlbmRUb2dnbGVyKGNvbnRyb2xzOiBDb250cm9scykge1xuICBjb25zdCBsZWdlbmRQYW5lbCA9IGNvbnRyb2xzLmxlZ2VuZFBhbmVsO1xuICBpZiAobGVnZW5kUGFuZWwpIHtcbiAgICBjb25zdCBsZWdlbmRUb2dnbGVyID0gbmV3IFRvZ2dsZXIoe1xuICAgICAgY2xhc3NOYW1lOiAnbGVnZW5kX190b2dnbGVyJyxcbiAgICAgIHRpdGxlOiAn0KHQutGA0YvRgtGMINC70LXQs9C10L3QtNGDJyxcbiAgICAgIHRpdGxlT2ZmOiAn0J/QvtC60LDQt9Cw0YLRjCDQu9C10LPQtdC90LTRgycsXG4gICAgICB0b2dnbGVBY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgICAgaWYgKHN0YXR1cykge1xuICAgICAgICAgIGxlZ2VuZFBhbmVsLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsZWdlbmRQYW5lbC5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBsZWdlbmRQYW5lbC5lbWl0dGVyLm9uKCd0b2dnbGUnLCAoc3RhdHVzKSA9PiB7XG4gICAgICBsZWdlbmRUb2dnbGVyLnRvZ2dsZShzdGF0dXMpO1xuICAgIH0pO1xuICAgIHJldHVybiBsZWdlbmRUb2dnbGVyO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTd2l0Y2hlclBhbmVsQ29udHJvbChjb250cm9sczogQ29udHJvbHMpOiBQYW5lbCB7XG4gIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGJsb2NrLmNsYXNzTmFtZSA9ICdzd2l0Y2hlci1wYW5lbC1jb250cm9sJztcblxuICBjb25zdCB0b2dnbGVzOiBBcnJheTxUb2dnbGVyIHwgdW5kZWZpbmVkPiA9IFtcbiAgICBnZXRMZWdlbmRUb2dnbGVyKGNvbnRyb2xzKSxcbiAgICBnZXRQZXJpb2RUb2dnbGVyKGNvbnRyb2xzKSxcbiAgICBnZXRZZWFyc1RvZ2dsZXIoY29udHJvbHMpLFxuICAgIGdldEJhc2VMYXllclRvZ2dsZXIoY29udHJvbHMpLFxuICBdO1xuXG4gIHRvZ2dsZXMuZm9yRWFjaCgodCkgPT4gdCAmJiBibG9jay5hcHBlbmRDaGlsZCh0LmdldENvbnRhaW5lcigpKSk7XG5cbiAgY29uc3QgcGFuZWwgPSBuZXcgUGFuZWwoe1xuICAgIGFkZENsYXNzOiAncGFuZWwtbGlua3MnLFxuICB9KTtcbiAgcGFuZWwudXBkYXRlQm9keShibG9jayk7XG4gIHJldHVybiBwYW5lbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNvY2lhbExpbmtzUGFuZWwoKTogUGFuZWwge1xuICBjb25zdCBibG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBibG9jay5pbm5lckhUTUwgPSBgXG4gICAgPGRpdiBjbGFzcz1cInNvY2lhbC1saW5rc1wiPlxuICAgICAgPGEgaHJlZj1cImh0dHA6Ly90d2l0dGVyLmNvbS9ydW5pdmVyc1wiIGNsYXNzPVwic29jaWFsX19sb2dvIHR3aXR0ZXJcIj48L2E+XG4gICAgICA8YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vUnVuaXZlcnNlLnJ1XCIgY2xhc3M9XCJzb2NpYWxfX2xvZ28gZmFjZWJvb2tcIj48L2E+XG4gICAgICA8YSBocmVmPVwiaHR0cDovL3ZrLmNvbS9wdWJsaWMzNTY5MDk3M1wiIGNsYXNzPVwic29jaWFsX19sb2dvIHZrb250YWt0ZVwiPjwvYT5cbiAgICA8L2Rpdj5cbiAgYDtcbiAgLy8gPGEgaHJlZj1cImh0dHA6Ly9ydW5pdmVycy5saXZlam91cm5hbC5jb20vXCIgY2xhc3M9XCJzb2NpYWxfX2xvZ28gbGl2ZWpvdXJuYWxcIj48L2E+XG5cbiAgY29uc3QgcGFuZWwgPSBuZXcgUGFuZWwoe1xuICAgIGFkZENsYXNzOiAncGFuZWwtbGlua3MnLFxuICB9KTtcbiAgcGFuZWwudXBkYXRlQm9keShibG9jayk7XG4gIHJldHVybiBwYW5lbDtcbn1cblxuZnVuY3Rpb24gZ2V0QWJvdXRCbG9jayhibG9jazogc3RyaW5nKSB7XG4gIHJldHVybiBgXG4gICAgPFAgTEFORz1cImVuLUdCXCIgQ0xBU1M9XCJ3ZXN0ZXJuXCIgQUxJR049SlVTVElGWSBTVFlMRT1cIm1hcmdpbi1ib3R0b206IDAuMTdpblwiPlxuICAgICAgPFNQQU4gTEFORz1cInJ1LVJVXCI+JHtibG9ja308L1NQQU4+XG4gICAgPC9QPmA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuQWJvdXREaWFsb2coYXBwOiBBcHAsIGxhbmd1YWdlID0gJ3J1Jyk6IHZvaWQge1xuICBjb25zdCBhdHRycyA9IGFwcC53ZWJNYXAuZ2V0QXR0cmlidXRpb25zKHtcbiAgICBvbmx5VmlzaWJsZTogZmFsc2UsXG4gICAgb25seUJhc2VsYXllcjogdHJ1ZSxcbiAgfSk7XG4gIGNvbnN0IHRlbXBsYXRlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICBydTogYWJvdXRTaG9ydFJ1LFxuICAgIGVuOiBhYm91dFNob3J0RW4sXG4gIH07XG4gIGxldCB0ZW1wbGF0ZSA9IHRlbXBsYXRlc1tsYW5ndWFnZV07XG4gIGlmIChhdHRycy5sZW5ndGgpIHtcbiAgICBsZXQgc3RyID1cbiAgICAgIGxhbmd1YWdlID09PSAncnUnXG4gICAgICAgID8gJ9CY0YHQv9C+0LvRjNC30L7QstCw0L3QsCDQutCw0YDRgtC+0LPRgNCw0YTQuNGH0LXRgdC60LDRjyDQv9C+0LTQu9C+0LbQutCwOiAnXG4gICAgICAgIDogJ1RoZSBiYXNlbWFwIHVzZWQ6ICc7XG4gICAgYXR0cnMuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgc3RyICs9IHg7XG4gICAgfSk7XG4gICAgdGVtcGxhdGUgKz0gZ2V0QWJvdXRCbG9jayhzdHIpO1xuICB9XG4gIGNvbnN0IGh0bWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgaHRtbC5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcbiAgY29uc3QgbGFuZ3VhZ2VTd2l0Y2hlciA9IGh0bWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcbiAgICAnc3dpdGNoLWFib3V0LWxhbmd1YWdlLWJ0bidcbiAgKVswXSBhcyBIVE1MQW5jaG9yRWxlbWVudDtcbiAgaWYgKGxhbmd1YWdlU3dpdGNoZXIpIHtcbiAgICBsYW5ndWFnZVN3aXRjaGVyLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICBEaWFsb2cuY2xlYW4oKTtcbiAgICAgIG9wZW5BYm91dERpYWxvZyhhcHAsIGxhbmd1YWdlU3dpdGNoZXIubmFtZSk7XG4gICAgfTtcbiAgfVxuICBvcGVuRGlhbG9nKHsgdGVtcGxhdGU6IGh0bWwgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBYm91dFByb2plY3RMaW5rKGFwcDogQXBwKTogSFRNTEVsZW1lbnQge1xuICBjb25zdCBibG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgYmxvY2suY2xhc3NOYW1lID0gJ2Fib3V0X2ljb24nO1xuICBibG9jay5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIycpO1xuICBibG9jay5pbm5lckhUTUwgPSBgaWA7XG4gIGJsb2NrLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgb3BlbkFib3V0RGlhbG9nKGFwcCwgJ3J1Jyk7XG4gIH07XG5cbiAgcmV0dXJuIGJsb2NrO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3BlblNldHRpbmdzRGlhbG9nKGFwcDogQXBwKTogdm9pZCB7XG4gIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgLy8gbGluayB0byBibG9nXG4gIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBoZWFkZXIuY2xhc3NOYW1lID0gJ3NldHRpbmdzLWRpYWxvZ19faGVhZGVyJztcbiAgaGVhZGVyLmlubmVySFRNTCA9IGBcbiAgICA8aDI+0J3QsNGB0YLRgNC+0LnQutC4PC9oMj5cbiAgYDtcbiAgdGVtcGxhdGUuYXBwZW5kQ2hpbGQoaGVhZGVyKTtcblxuICAvLyBzZXR0aW5ncyBpbnB1dFxuICBjb25zdCBzID0gYXBwLnNsaWRlcjtcbiAgY29uc3Qgc2V0dGluZ3M6IFNsaWRlclNldHRpbmdzW10gPSBbXG4gICAgeyBuYW1lOiAnYW5pbWF0aW9uRGVsYXknLCBsYWJlbDogJ9CX0LDQtNC10YDQttC60LAg0LDQvdC40LzQsNGG0LjQuCwg0LzRgScsIHR5cGU6ICdudW1iZXInIH0sXG4gICAgeyBuYW1lOiAnc3RlcCcsIGxhYmVsOiAn0KjQsNCzINC40LfQvNC10L3QtdC90LjRjyDQs9C+0LTQsCcsIHR5cGU6ICdudW1iZXInIH0sXG4gICAge1xuICAgICAgbmFtZTogJ2FuaW1hdGlvblN0ZXAnLFxuICAgICAgbGFiZWw6ICfQqNCw0LMg0LjQt9C80LXQvdC10L3QuNGPINCz0L7QtNCwICjQsNC90LjQvNCw0YbQuNGPKScsXG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICB9LFxuICBdO1xuXG4gIHNldHRpbmdzLmZvckVhY2goKHgpID0+IHtcbiAgICBjb25zdCBpZCA9IHgubmFtZSArICctJyArIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDEwMDAwKTtcbiAgICBjb25zdCBpbnB1dEJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICBpbnB1dEJsb2NrLmNsYXNzTmFtZSA9ICdzZXR0aW5ncy1kaWFsb2dfX2lucHV0LWJsb2NrJztcbiAgICBpbnB1dEJsb2NrLmlubmVySFRNTCA9IGA8ZGl2IGNsYXNzPVwic2V0dGluZ3MtZGlhbG9nX19pbnB1dC1ibG9jay0tbGFiZWxcIj4ke1xuICAgICAgeC5sYWJlbFxuICAgIH06IDwvZGl2PlxuICAgICAgPGlucHV0IGNsYXNzPVwiJHtpZH1cIiBjbGFzcz10eXBlPSR7eC50eXBlfSB2YWx1ZT0ke3Mub3B0aW9uc1t4Lm5hbWVdfT5cbiAgICAgIDwvaW5wdXQ+XG4gICAgYDtcbiAgICBjb25zdCBpbnB1dCA9IGlucHV0QmxvY2suZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShpZClbMF0gYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID1cbiAgICAgICAgeC50eXBlID09PSAnbnVtYmVyJyA/IHBhcnNlSW50KGlucHV0LnZhbHVlLCAxMCkgOiBpbnB1dC52YWx1ZTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzLm9wdGlvbnMsIHgubmFtZSwgeyB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSB9KTtcbiAgICB9KTtcblxuICAgIHRlbXBsYXRlLmFwcGVuZENoaWxkKGlucHV0QmxvY2spO1xuICB9KTtcblxuICAvLyBlZGl0YWJsZSBsZWdlbmRcbiAgY29uc3QgbGVnZW5kID1cbiAgICBhcHAuY29udHJvbHMubGVnZW5kUGFuZWwgJiZcbiAgICBhcHAuY29udHJvbHMubGVnZW5kUGFuZWwuY3JlYXRlTGVnZW5kQmxvY2sodHJ1ZSk7XG4gIGlmIChsZWdlbmQpIHtcbiAgICB0ZW1wbGF0ZS5hcHBlbmRDaGlsZChsZWdlbmQpO1xuICB9XG5cbiAgLy8gbGluayB0byBibG9nXG4gIGNvbnN0IHJlYWRNb3JlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHJlYWRNb3JlLmNsYXNzTmFtZSA9ICdzZXR0aW5ncy1kaWFsb2dfX3JlYWQtbW9yZSc7XG4gIHJlYWRNb3JlLmlubmVySFRNTCA9IGBcbiAgICDQntC/0LjRgdCw0L3QuNC1INGC0LXRhdC90LjRh9C10YHQutC+0Lkg0YDQtdCw0LvQuNC30LDRhtC40Lgg0L/RgNC+0LXQutGC0LAg0LTQvtGB0YLRg9C/0L3QviDQv9C+XG4gICAgPGEgaHJlZj1cImh0dHA6Ly9uZXh0Z2lzLnJ1L2Jsb2cvcnVuaXZlcnMvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+0YHRgdGL0LvQutC1PC9hPi5cbiAgICA8ZGl2PnYuJHtwa2cudmVyc2lvbn08L2Rpdj5cbiAgYDtcbiAgdGVtcGxhdGUuYXBwZW5kQ2hpbGQocmVhZE1vcmUpO1xuXG4gIG9wZW5EaWFsb2coeyB0ZW1wbGF0ZSB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFmZmlsaWF0ZWRMaW5rcyhhcHA6IEFwcCk6IEhUTUxFbGVtZW50IHtcbiAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgYmxvY2suaW5uZXJIVE1MID0gYFxuICA8YSBocmVmPVwiaHR0cHM6Ly93d3cucnVuaXZlcnMucnVcIlxuICAgIHRpdGxlPVwi0K3Qu9C10LrRgtGA0L7QvdC90LDRjyAg0Y3QvdGG0LjQutC70L7Qv9C10LTQuNGPINC4INCx0LjQsdC70LjQvtGC0LXQutCwINCg0YPQvdC40LLQtdGA0YFcIlxuICAgIGNsYXNzPVwiYWZmaWxpYXRlZC1sb2dvIHJ1bml2ZXJfX2xvZ29fX21pblwiIHRhcmdldD1cIl9ibGFua1wiXG4gID48L2E+XG4gIDxhIGhyZWY9XCJodHRwczovL2hpc3RnZW8ucnUvbGFib3JhdG9yeS5odG1sXCJcbiAgICBjbGFzcz1cImFmZmlsaWF0ZWQtbG9nbyBsYWJvcmF0b3J5X19sb2dvX19taW5cIiB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgIHRpdGxlPVwi0JvQsNCx0L7RgNCw0YLQvtGA0LjRjyDQuNGB0YLQvtGA0LjRh9C10YHQutC+0Lkg0LPQtdC+0LjQvdGE0L7RgNC80LDRgtC40LrQuFwiXG4gID48L2E+XG4gIDxhIGhyZWY9XCJodHRwczovL3d3dy50cmFuc25lZnQucnVcIlxuICAgIGNsYXNzPVwiYWZmaWxpYXRlZC1sb2dvIHRyYW5zbmVmdF9fbG9nb19fbWluXCIgdGFyZ2V0PVwiX2JsYW5rXCJcbiAgICB0aXRsZT1cItCf0JDQniDCq9Ci0YDQsNC90YHQvdC10YTRgtGMwrtcIlxuICA+PC9hPlxuICA8YSBocmVmPVwiaHR0cHM6Ly9uZXh0Z2lzLnJ1XCJcbiAgICBjbGFzcz1cImFmZmlsaWF0ZWQtbG9nbyBuZXh0Z2lzX19sb2dvX19taW5cIiB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgIHRpdGxlPVwi0KDQsNC30YDQsNCx0L7RgtC60LAg0JPQmNChINC4INC/0YDQvtC10LrRgtGLXCJcbiAgPjwvYT5cbiAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cImFmZmlsaWF0ZWQtbG9nbyBzZXR0aW5nc19fbG9nb19fbWluXCIgdGFyZ2V0PVwiX2JsYW5rXCIgdGl0bGU9XCLQndCw0YHRgtGA0L7QudC60LhcIj48L2E+XG4gIGA7XG5cbiAgY29uc3Qgc2V0dGluZ3MgPSBibG9jay5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFxuICAgICdzZXR0aW5nc19fbG9nb19fbWluJ1xuICApWzBdIGFzIEhUTUxFbGVtZW50O1xuICBpZiAoc2V0dGluZ3MpIHtcbiAgICBzZXR0aW5ncy5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIG9wZW5TZXR0aW5nc0RpYWxvZyhhcHApO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGJsb2NrO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWZmaWxpYXRlZFBhbmVsKGNvbnRyb2xzOiBDb250cm9scyk6IFBhbmVsIHtcbiAgY29uc3QgYmxvY2sgPSBnZXRBZmZpbGlhdGVkTGlua3MoY29udHJvbHMuYXBwKTtcblxuICBjb25zdCBwYW5lbCA9IG5ldyBQYW5lbCh7XG4gICAgYWRkQ2xhc3M6ICdwYW5lbC1saW5rcycsXG4gIH0pO1xuICBwYW5lbC51cGRhdGVCb2R5KGJsb2NrKTtcbiAgcmV0dXJuIHBhbmVsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SG9tZUJ0bkNvbnRyb2woY29udHJvbDogQ29udHJvbHMpOiBQcm9taXNlPENvbnRyb2w+IHtcbiAgY29uc3QgX2NvbnRyb2wgPSBjb250cm9sLmFwcC53ZWJNYXAuY3JlYXRlQnV0dG9uQ29udHJvbCh7XG4gICAgYWRkQ2xhc3M6ICdtYXBib3hnbC1jdHJsLWljb24gbWFwYm94Z2wtY3RybC1ob21lJyxcbiAgICBvbkNsaWNrOiAoKSA9PlxuICAgICAgY29udHJvbC5hcHAub3B0aW9ucy5ib3VuZHMgJiZcbiAgICAgIGNvbnRyb2wuYXBwLndlYk1hcC5maXRCb3VuZHMoY29udHJvbC5hcHAub3B0aW9ucy5ib3VuZHMpLFxuICB9KTtcblxuICByZXR1cm4gX2NvbnRyb2w7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUaW1lbGluZUJ1dHRvbigpOiBIVE1MRWxlbWVudCB7XG4gIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gIGxpbmsuY2xhc3NOYW1lID0gJ3BhbmVsX190b2dnbGVyIGdyYXBoX2xvZ28nO1xuICBsaW5rLnNldEF0dHJpYnV0ZShcbiAgICAnaHJlZicsXG4gICAgJ2h0dHBzOi8vd3d3LnJ1bml2ZXJzLnJ1L2dyYW5pdHN5LXJvc3NpaS9jaGFydHMvaW5kZXgucGhwJ1xuICApO1xuICBsaW5rLnNldEF0dHJpYnV0ZSgndGl0bGUnLCAn0JPRgNCw0YTQuNC6INC40LfQvNC10L3QtdC90LjRjyDRgtC10YDRgNC40YLQvtGA0LjQuCDQoNC+0YHRgdC40LgnKTtcbiAgbGluay5zZXRBdHRyaWJ1dGUoJ3RhcmdldCcsICdfYmxhbmsnKTtcbiAgcmV0dXJuIGxpbms7XG59XG4iLCJleHBvcnQgY2xhc3MgVG9nZ2xlciB7XG4gIHByaXZhdGUgX2NvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgX3N0YXR1cyA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIG9wdGlvbnM6IHtcbiAgICAgIHN0YXR1cz86IGJvb2xlYW47XG4gICAgICB0aXRsZT86IHN0cmluZztcbiAgICAgIHRpdGxlT2ZmPzogc3RyaW5nO1xuICAgICAgY2xhc3NOYW1lPzogc3RyaW5nO1xuICAgICAgdG9nZ2xlQWN0aW9uPzogKHN0YXR1czogYm9vbGVhbikgPT4gdm9pZDtcbiAgICB9XG4gICkge1xuICAgIHRoaXMuX3N0YXR1cyA9XG4gICAgICB0aGlzLm9wdGlvbnMuc3RhdHVzICE9PSB1bmRlZmluZWQgPyB0aGlzLm9wdGlvbnMuc3RhdHVzIDogdGhpcy5fc3RhdHVzO1xuICAgIHRoaXMuX2NvbnRhaW5lciA9IHRoaXMuX2NyZWF0ZUNvbnRhaW5lcigpO1xuICAgIHRoaXMuX3VwZGF0ZUNvbnRhaW5lcigpO1xuICB9XG5cbiAgZ2V0Q29udGFpbmVyKCk6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5fY29udGFpbmVyO1xuICB9XG5cbiAgdG9nZ2xlKHN0YXR1cyA9ICF0aGlzLl9zdGF0dXMpOiB2b2lkIHtcbiAgICB0aGlzLl9zdGF0dXMgPSBzdGF0dXM7XG4gICAgdGhpcy5fdXBkYXRlQ29udGFpbmVyKCk7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVDb250YWluZXIoKSB7XG4gICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBibG9jay5jbGFzc05hbWUgPSAncGFuZWxfX3RvZ2dsZXInO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY2xhc3NOYW1lKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuY2xhc3NOYW1lLnNwbGl0KCcgJykuZm9yRWFjaCgoeCkgPT4gYmxvY2suY2xhc3NMaXN0LmFkZCh4KSk7XG4gICAgfVxuICAgIGNvbnN0IHRvZ2dsZUFjdGlvbiA9IHRoaXMub3B0aW9ucy50b2dnbGVBY3Rpb247XG4gICAgaWYgKHRvZ2dsZUFjdGlvbikge1xuICAgICAgYmxvY2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIHRoaXMudG9nZ2xlKCk7XG4gICAgICAgIHRvZ2dsZUFjdGlvbih0aGlzLl9zdGF0dXMpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBibG9jaztcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZUNvbnRhaW5lcigpIHtcbiAgICBjb25zdCB0aXRsZSA9IHRoaXMuX3N0YXR1cyA/IHRoaXMub3B0aW9ucy50aXRsZSA6IHRoaXMub3B0aW9ucy50aXRsZU9mZjtcbiAgICBpZiAodGl0bGUpIHtcbiAgICAgIHRoaXMuX2NvbnRhaW5lci50aXRsZSA9IHRpdGxlO1xuICAgICAgaWYgKHRoaXMuX3N0YXR1cykge1xuICAgICAgICB0aGlzLl9jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJleHBvcnQgY29uc3QgYWJvdXRTaG9ydEVuID0gYFxuPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6IDQwcHg7XCI+PC9kaXY+XG48ZGl2IGNsYXNzPVwicGFydG5lcl9sb2dvc1wiPlxuPGEgaHJlZj1cImh0dHBzOi8vd3d3LnJ1bml2ZXJzLnJ1XCIgdGFyZ2V0PVwiX2JsYW5rXCI+PGltZyBzcmM9XCJpbWFnZXMvUnVuaXZlcnMtTG9nby1jb2xvci5zdmdcIiAvPjwvYT5cbjxhIGhyZWY9XCJodHRwczovL3d3dy50cmFuc25lZnQucnVcIiB0YXJnZXQ9XCJfYmxhbmtcIj48aW1nIHNyYz1cImltYWdlcy9UcmFuc25lZnRfbG9nbzEucG5nXCIgLz48L2E+XG48YSBocmVmPVwiaHR0cHM6Ly9oaXN0Z2VvLnJ1L2xhYm9yYXRvcnkuaHRtbFwiIHRhcmdldD1cIl9ibGFua1wiPjxpbWcgc3JjPVwiaW1hZ2VzL2dlb2xhYi5wbmdcIiAvPjwvYT5cbjxhIGhyZWY9XCJodHRwczovL25leHRnaXMuY29tXCIgdGFyZ2V0PVwiX2JsYW5rXCI+PGltZyBzcmM9XCJpbWFnZXMvbmV4dGdpcy5wbmdcIiAvPjwvYT5cbjwvZGl2PlxuPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6IDQwcHg7XCI+PC9kaXY+XG48UCBMQU5HPVwiZW4tR0JcIiBDTEFTUz1cIndlc3Rlcm5cIiBBTElHTj1KVVNUSUZZIFNUWUxFPVwibWFyZ2luLWJvdHRvbTogMC4xN2luXCI+XG48aDI+UnVzc2lh4oCZcyBCb3JkZXJzIGZyb20gMTQ2MiB0aHJvdWdoIDIwMTjigJkgUHJvamVjdDwvaDI+PC9QPlxuPFAgTEFORz1cImVuLUdCXCIgQ0xBU1M9XCJ3ZXN0ZXJuXCIgQUxJR049SlVTVElGWSBTVFlMRT1cIm1hcmdpbi1ib3R0b206IDAuMTdpblwiPlxuXG48U1BBTiBMQU5HPVwiZW4tRU5cIj48YSBocmVmPVwiaHR0cHM6Ly93d3cucnVuaXZlcnMucnVcIiB0YXJnZXQ9XCJfYmxhbmtcIj5SdW5pdmVyczwvYT5cblxucHJlc2VudHMg4oCYUnVzc2lh4oCZcyBCb3JkZXJzIGZyb20gMTQ2MiB0aHJvdWdoIDIwMTjigJkg4oCTXG5hIHByb2plY3QgZGVzaWduZWQgaW4gY29sbGFib3JhdGlvbiB3aXRoIHRoZVxuPGEgaHJlZj1cImh0dHBzOi8vaGlzdGdlby5ydS9sYWJvcmF0b3J5Lmh0bWxcIiB0YXJnZXQ9XCJfYmxhbmtcIj5cbkxhYm9yYXRvcnkgb2YgSGlzdG9yaWNhbCBHZW9tYXRpY3M8L2E+IGF0IHRoZSBJbnN0aXR1dGUgb2YgV29ybGQgSGlzdG9yeVxub2YgdGhlIFJ1c3NpYW4gQWNhZGVteSBvZiBTY2llbmNlcyAoUkFTKSBhbmRcbjxhIGhyZWY9XCJodHRwOi8vbmV4dGdpcy5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIj5OZXh0R0lTIEx0ZC48L2E+XG48L1NQQU4+PC9QPlxuXG48UCBMQU5HPVwiZW4tR0JcIiBDTEFTUz1cIndlc3Rlcm5cIiBBTElHTj1KVVNUSUZZIFNUWUxFPVwibWFyZ2luLWJvdHRvbTogMC4xN2luXCI+XG48U1BBTiBMQU5HPVwiZW4tRU5cIj5cblRoaXMgY2FydG9ncmFwaGljIHByb2plY3QgY29udGFpbnMgZ2VvZ3JhcGhpY2FsIGluZm9ybWF0aW9uIG9uIHRoZSBwb2xpdGljYWwgYm9yZGVyc1xub2YgdGhlIGNvbnRlbXBvcmFyeSBSdXNzaWFuIEZlZGVyYXRpb24gYW5kIGl0cyBwcmVkZWNlc3NvciBzdGF0ZXMuXG5BbiBvcHBvcnR1bml0eSB0byBzZWxlY3QgYW55IHllYXIgaW4gdGhlIDE0NjIgdG8gMjAxOCB0aW1lIGJyYWNrZXQgaXMgYSBjcnVjaWFsIG9wdGlvbiBvZiB0aGlzIG1hcC5cblRvIGNob29zZSB0aGUgbmVlZGVkIHllYXIsIHRoZSB1c2VycyBlaXRoZXIgY2xpY2sgYXQgdGhlIG5lZWRlZCBwb2ludCBvbiB0aGUgdGltZWxpbmUgKGF0IHRoZSBib3R0b20gb2YgdGhlIG1hcClcbm9yIGxhdW5jaCBpdHMgc3RlcC1ieS1zdGVwIGF1dG9tYXRpYyByZXdpbmRpbmcgb3IgZWxzZSB1c2UgdGhlICsgb3Ig4oCTXG5pY29ucyB0byB0aGUgcmlnaHQgb2YgdGhlIHRpbWVsaW5lLCB0aHVzIG1vdmluZyBvbmUgeWVhciBiYWNrd2FyZHMgb3IgZm9yd2FyZHMuXG48L1NQQU4+PC9QPlxuXG48UCBMQU5HPVwiZW4tR0JcIiBDTEFTUz1cIndlc3Rlcm5cIiBBTElHTj1KVVNUSUZZIFNUWUxFPVwibWFyZ2luLWJvdHRvbTogMC4xN2luXCI+XG48QSBOQU1FPVwiT0xFX0xJTksyMTBcIj48L0E+PEEgTkFNRT1cIk9MRV9MSU5LMjA5XCI+PC9BPlxuPFNQQU4gTEFORz1cImVuLUVOXCI+XG5UaGUgcmVhbGl6YXRpb24gdGhhdCB0aGUgZm9ybXMgb2YgYSBwb2xpdGljYWwgc3RhdHVzIG9mIGxhbmRzIGFyZSBtdWx0aXBsZSBhbmQgdGhhdCxcbm9uIHRoZSBvdGhlciBoYW5kLCB0aGlzIGRpdmVyc2l0eSBzaG91bGQgYmUgcmVkdWNlZCB0byBhIGxpbWl0ZWQgbnVtYmVyIG9mIHZlcnNpb25zIGZvclxuZGVwaWN0aW9uIG9uIHRoZSBtYXAgaGFzIHByb21wdGVkIHVzIHRvIHNpbmdsZSBvdXQgc2V2ZW4gZGlmZmVyZW50IHN0YXR1c2VzIG9mIHRoZSB0ZXJyaXRvcnlcbm9mIHRvZGF54oCZcyBSdXNzaWEgYW5kIGl0cyBwcmVkZWNlc3NvcnMuXG48L1NQQU4+PC9QPlxuPFAgTEFORz1cImVuLUdCXCIgQ0xBU1M9XCJ3ZXN0ZXJuXCIgQUxJR049SlVTVElGWSBTVFlMRT1cIm1hcmdpbi1ib3R0b206IDBpblwiPlxuPFNQQU4gTEFORz1cImVuLUVOXCI+XG4xKSBUaGUgbWFpbmxhbmQgb2YgdGhlIHN0YXRlLlxuPC9TUEFOPjwvUD5cbjxQIExBTkc9XCJlbi1HQlwiIENMQVNTPVwid2VzdGVyblwiIEFMSUdOPUpVU1RJRlkgU1RZTEU9XCJtYXJnaW4tYm90dG9tOiAwaW5cIj5cbjxTUEFOIExBTkc9XCJlbi1FTlwiPlxuMikgQSB0ZXJyaXRvcnkgdW5kZXIgcHJvdGVjdG9yYXRlLCB2YXNzYWwgYWxsZWdpYW5jZSBvciBpbiB0aGUgc3BoZXJlIG9mIGluZmx1ZW5jZS5cbjwvU1BBTj48L1A+XG48UCBMQU5HPVwiZW4tRU5cIiBDTEFTUz1cIndlc3Rlcm5cIiBBTElHTj1KVVNUSUZZIFNUWUxFPVwibWFyZ2luLWJvdHRvbTogMGluXCI+XG4zKSBBIGxlYXNlZCB0ZXJyaXRvcnkuXG48L1A+XG48UCBMQU5HPVwiZW4tR0JcIiBDTEFTUz1cIndlc3Rlcm5cIiBBTElHTj1KVVNUSUZZIFNUWUxFPVwibWFyZ2luLWJvdHRvbTogMGluXCI+XG48U1BBTiBMQU5HPVwiZW4tRU5cIj5cbjQpIEEgdGVycml0b3J5IGluIGpvaW50IHBvc3Nlc3Npb24uXG48L1NQQU4+PC9QPlxuPFAgTEFORz1cImVuLUdCXCIgQ0xBU1M9XCJ3ZXN0ZXJuXCIgQUxJR049SlVTVElGWSBTVFlMRT1cIm1hcmdpbi1ib3R0b206IDBpblwiPlxuPFNQQU4gTEFORz1cImVuLUVOXCI+XG41KSBBIGxpdGlnaW91cyB0ZXJyaXRvcnkuXG48L1NQQU4+PC9QPlxuPFAgTEFORz1cImVuLUdCXCIgQ0xBU1M9XCJ3ZXN0ZXJuXCIgQUxJR049SlVTVElGWSBTVFlMRT1cIm1hcmdpbi1ib3R0b206IDAuMTdpblwiPlxuXG48UCBMQU5HPVwiZW4tR0JcIiBDTEFTUz1cIndlc3Rlcm5cIiBBTElHTj1KVVNUSUZZIFNUWUxFPVwibWFyZ2luLWJvdHRvbTogMC4xN2luXCI+XG48QSBOQU1FPVwiT0xFX0xJTksyMjJcIj48L0E+PEEgTkFNRT1cIk9MRV9MSU5LMjIxXCI+PC9BPlxuPFNQQU4gTEFORz1cImVuLUVOXCI+XG5DaGFuZ2VzIGluIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSBib3JkZXIgaW4gcmVsZXZhbnQgeWVhcnMgYXJlIHNob3duIGluIHNlcGFyYXRlIHBvbHlnb25zIGFzOiA2LlxudGhlIG5ld2x5IGFjcXVpcmVkIHRlcnJpdG9yaWVzIG9yLCA3LiBsb3N0IHRlcnJpdG9yaWVzLlxuVGhlc2UgcG9seWdvbnMgaGF2ZSB0aGUgdG9rZW5zLCB0aGUgbnVtYmVycyBvbiB3aGljaCBjb3JyZXNwb25kIHRvIHBvc2l0aW9ucyBpbiB0aGUgbGlzdCBvZlxudGVycml0b3JpYWwgY2hhbmdlcyBmb3VuZCBpbiB0aGUgaW5mbyBiYXIuXG5UZXJyaXRvcmlhbCBjaGFuZ2VzIG9jY3VycmVkIGluIGRpZmZlcmVudCBtb250aHMgb2YgdGhlIHllYXIg4oCTIHNvbWV0aW1lcyBpbiB0aGUgZmlyc3QgaGFsZiBvZiB0aGUgeWVhcixcbmFuZCBzb21ldGltZSBpbiB0aGUgc2Vjb25kIGhhbGYsIGFuZCB0aGF0IGlzIHdoeSB0aGUgcG9seWdvbnMgd2l0aCBzdGF0dXNlcyA2IGFuZCA3IHNvbWV0aW1lcyBzdGF5IG9uXG5hbmQgZ2V0IG92ZXIgdG8gdGhlIHllYXIgdGhhdCBmb2xsb3dlZCBhIHNwZWNpZmllZCBldmVudC5cbjwvU1BBTj48L1A+XG48UCBMQU5HPVwiZW4tR0JcIiBDTEFTUz1cIndlc3Rlcm5cIiBBTElHTj1KVVNUSUZZIFNUWUxFPVwibWFyZ2luLWJvdHRvbTogMC4xN2luXCI+XG48U1BBTiBMQU5HPVwiZW4tRU5cIj5cblRoZSBkaWZmZXJlbnRpYXRpb24gaXMgcmVmbGVjdGVkIGluIHBvcHVwIHdpbmRvd3MsXG53aGljaCB0aGUgdXNlcnMgY2FuIGJyaW5nIHVwIGJ5IGNsaWNraW5nIGF0IGFueSBvYmplY3QgaW5zaWRlIHRoZSBwb2xpdGljYWwgYm9yZGVycy5cblRoZSBwb2x5Z29ucyBhcmUgZmlsbGVkIHdpdGggZm91ciBjb2xvcnMuIE9uZSBjb2xvciBzaG93cyB0aGUgbWFpbmxhbmQgb2YgdGhlIHN0YXRlIGFuZCB0aGUgbmV3bHlcbmluY29ycG9yYXRlZCBsYW5kcyAoc3RhdHVzZXMgMSBhbmQgNik7IHRoZSBzZWNvbmQgY29sb3IgbWFya3MgdGhlIGxhbmRzIHRoYXQgaGF2ZSBhIGNlcnRhaW4gZGVncmVlXG5vZiBkZXBlbmRlbmNlIG9uIHRoZSBzdGF0ZSAoc3RhdHVzIDIpOyB0aGUgdGhpcmQgY29sb3IgYnJpbmdzIG91dCB0aGUgbGVhc2VkIGFuZCBsaXRpZ2lvdXMgYXJlYXMgb3JcbnRoZSBsYW5kcyBnb3Zlcm5lZCBqb2ludGx5IHdpdGggb3RoZXIgY291bnRyaWVzIChzdGF0dXNlcyAzIGFuZCA1KS5cblRoZSBsb3N0IHRlcnJpdG9yaWVzIChzdGF0dXMgNykgYXJlIG1hcmtlZCB3aXRoIHRoZSBmb3VydGggY29sb3IgYnV0IG93aW5nIHRvIGNlcnRhaW4gdGVjaG5vbG9neVxucGVjdWxpYXJpdGllcyBvZiB0aGUgY3VycmVudCBhbGdvcml0aG0gb2YgZ2VvbWV0cmljYWwgYXJyYW5nZW1lbnRzIGZvcm1hdGlvbiBzb21lIG9mIHRoZSBsb3N0IHRlcnJpdG9yaWVzXG5hcmUgbm90IGRpc3BsYXllZCBvbiB0aGUgbWFwIHdpdGggdGhlIGFpZCBvZiBzZXBhcmF0ZSBwb2x5Z29ucy4gQSBjbGljayBhdCBhbnkgcG9seWdvbiB3aWxsIGNhbGwgdXBcbnRoZSBpbmZvcm1hdGlvbiBvbiB0aGUgY2hyb25vbG9naWNhbCByYW5nZSwgaW4gd2hpY2ggYSB0ZXJyaXRvcmlhbCBlbnRpdHkgZXhpc3RlZCwgYW5kIG9uIGl0cyBzaXplIChpbiBzcS4ga20pLlxuPC9TUEFOPjwvUD5cblxuPFAgTEFORz1cImVuLUdCXCIgQ0xBU1M9XCJ3ZXN0ZXJuXCIgQUxJR049SlVTVElGWSBTVFlMRT1cIm1hcmdpbi1ib3R0b206IDAuMTdpblwiPlxuPFNQQU4gTEFORz1cImVuLUVOXCI+XG5QbGFjZWQgaW4gdGhlIGNlbnRlciBvZiBlYWNoIHBvbHlnb24gaXMgYSB0b2tlbiB0aGF0IGhlbHBzIHRoZSB1c2VycyBmaW5kIGFuIGFwcHJvcHJpYXRlXG5sb2NhdGlvbiBvbiBhIHNtYWxsLXNjYWxlIG1hcC4gQSBjbGljayBhdCB0aGUgdG9rZW4gd2lsbCByZXRyaWV2ZSB0aGUgZGF0YSBvbiB0aGUgZXZlbnRcbnRoYXQgcmVzdWx0ZWQgaW4gdGhlIGZvcm1hdGlvbiBvZiB0aGUgc3BlY2lmaWMgdGVycml0b3JpYWwgZW50aXR5LlxuPC9TUEFOPjwvUD5cbjxQIExBTkc9XCJlbi1HQlwiIENMQVNTPVwid2VzdGVyblwiIEFMSUdOPUpVU1RJRlkgU1RZTEU9XCJtYXJnaW4tYm90dG9tOiAwLjE3aW5cIj5cbjxTUEFOIExBTkc9XCJlbi1FTlwiPlxuVGhyZWUgYnV0dG9uIGljb25zIGFyZSBhdmFpbGFibGUgaW4gdGhlIHVwcGVyIHJpZ2h0LWhhbmQgY29ybmVyIG9mIHRoZSBtYXAuXG5UaGUgZmlyc3Qgb25lIHN3aXRjaGVzIHRoZSBjb250ZW1wb3JhcnkgYmFzZW1hcCBvZmYsIHdoaWxlIHR3byBvdGhlcnMgbWFrZSBpdFxucG9zc2libGUgdG8gaGFuZGxlIHRoZSBwcmVzZW50YXRpb24gb2YgdHdvIGRhdGEgdW5pdHMgb2YgdGhlIG1hcC5cblRoZSBmaXJzdCB1bml0IHNob3dzIHRoZSBuYW1lLCB0aXRsZS8gb2ZmaWNpYWwgcG9zaXRpb24gYW5kIHRoZSB5ZWFycyBpbiBvZmZpY2Ugb2YgdGhlIHBlcnNvblxud2hvIHJ1bGVkIHRoZSB0ZXJyaXRvcnkgaW4gdGhlIHllYXIgY2hvc2VuIGJ5IHRoZSB1c2VyLiBJdCBhbHNvIGNvbnRhaW5zIGEgcmVmZXJlbmNlIHRvIGEgc3BlY2lhbCBwYWdlXG5hdCB0aGUgd2Vic2l0ZSB0aGF0IG9mZmVycyBkZXRhaWxlZCBpbmZvcm1hdGlvbi4gVGhlIGxvd2VyIGRhdGEgdW5pdCBwcm92aWRlcyBpbmZvcm1hdGlvblxub24gdGhlIHRlcnJpdG9yaWFsIGNoYW5nZXMgaW4gdGhlIHNlbGVjdGVkIHllYXIsIGFzIHdlbGwgYXMgb24gYW4gYXBwcm94aW1hdGUgc2l6ZSBvZiB0aGUgbGFuZHNcbnRoYXQgd2VyZSBpbmNvcnBvcmF0ZWQgaW50byB0aGUgbmF0aW9uIG9yLCB2aWNlIHZlcnNhLCB3ZXJlIGxvc3QuXG48L1NQQU4+PC9QPlxuPFAgTEFORz1cImVuLUdCXCIgQ0xBU1M9XCJ3ZXN0ZXJuXCIgQUxJR049SlVTVElGWSBTVFlMRT1cIm1hcmdpbi1ib3R0b206IDAuMTdpblwiPlxuPFNQQU4gTEFORz1cImVuLUVOXCI+XG7igJhUaGUgQm9yZGVycyBvZiB0aGUgRHVjaHkgb2YgTXVzY292eS8gQ3phcmRvbSBvZiBSdXNzaWEvIFJ1c3NpYW4gRW1waXJlLyBVU1NSL1xuUnVzc2lhbiBGZWRlcmF0aW9uIGZyb20gMTQ2MiB0aHJvdWdoIDIwMTjigJkgd2ViIEdJUyByZXN0cyBvbiB0aGUgY29uY2VwdCBvZiBhIGR5bmFtaWMgbWFwLlxuQXMgcmVnYXJkcyB0aGUgdGVjaG5pY2FsIGltcGxlbWVudGF0aW9uLCB0aGlzIGNvbmNlcHQgZW1ib2RpZXMgYW4gb3JpZ2luYWwgc29sdXRpb24gZGV2ZWxvcGVkIGF0IHRoZVxuPGEgaHJlZj1cImh0dHBzOi8vaGlzdGdlby5ydS9sYWJvcmF0b3J5Lmh0bWxcIiB0YXJnZXQ9XCJfYmxhbmtcIj5MYWJvcmF0b3J5IG9mIEhpc3RvcmljYWwgR2VvbWF0aWNzPC9hPlxub2YgdGhlIFJBUyBJbnN0aXR1dGUgb2YgV29ybGQgSGlzdG9yeSBpbiBjb29wZXJhdGlvbiB3aXRoXG48YSBocmVmPVwiaHR0cDovL25leHRnaXMuY29tXCIgdGFyZ2V0PVwiX2JsYW5rXCI+TmV4dEdJUyBMdGQuPC9hPlxuPC9TUEFOPjwvUD5cblxuPFAgTEFORz1cImVuLUdCXCIgQ0xBU1M9XCJ3ZXN0ZXJuXCIgQUxJR049SlVTVElGWSBTVFlMRT1cIm1hcmdpbi1ib3R0b206IDAuMTdpblwiPlxuPFNQQU4gTEFORz1cImVuLUVOXCI+XG5QcmFjdGljYWwgYXBwbGljYWJpbGl0eSBvZiB0aGlzIHByb2plY3QgZm9yIHJlc2VhcmNoIHB1cnBvc2VzIG1ha2VzIGl0IHN0YW5kIG91dCBhbW9uZyBvdGhlciBwcm9qZWN0cyBvZiB0aGlzIGtpbmQuXG5UaGUgZHluYW1pYyBtYXBzIGRpc3BsYXlpbmcgdGhlIHBhc3QgY2hhbmdlcyBvZiBzdGF0ZSBib3JkZXJzIG1vc3QgdHlwaWNhbGx5IGhhdmUgYW4gZWR1Y2F0aW9uYWxcbmZvY3VzIGFuZCBoaXN0b3JpYW5zIGRvIG5vdCBoYXZlIGEgY2hhbmNlIHRvIGFtZW5kIHRoZW0gYWZ0ZXIgZXhwZXJ0IGRlYmF0ZXMuXG5Db252ZXJzZWx5LCB0aGUgZHluYW1pYyBtYXAgcmVsZWFzZWQgbm93IGlzIG9wZW4gZm9yIGZ1dHVyZSBhbWVuZG1lbnRzIGFuZCBpcyBjYWxsZWQgdXBvblxudG8gc2VydmUgYXMgYW4gaW5zdHJ1bWVudGFsIGNhcnRvZ3JhcGhpYyBhaWQgZm9yIHRoZSBzY2hvbGFycyBvZiBoaXN0b3J5IHdobyB1c2UgR0lTIHRlY2hub2xvZ2llc1xudG8gYXR0YWluIHNwZWNpZmllZCByZXNlYXJjaCBvYmplY3RpdmVzLlxuXG5cbjxQIExBTkc9XCJlbi1HQlwiIENMQVNTPVwid2VzdGVyblwiIEFMSUdOPUpVU1RJRlkgU1RZTEU9XCJtYXJnaW4tYm90dG9tOiAwLjE3aW5cIj5cbjxTUEFOIExBTkc9XCJlbi1FTlwiPlxuVGVjaG5pY2FsIGltcGxlbWVudGF0aW9uICA8YSBocmVmPVwiaHR0cDovL25leHRnaXMuY29tL2Jsb2cvcnVuaXZlcnMvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+ZGVzY3JpcHRpb248L2E+LlxuPC9TUEFOPjwvUD5cbmA7XG4iLCJleHBvcnQgY29uc3QgYWJvdXRTaG9ydFJ1ID0gYFxuPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6IDQwcHg7XCI+PC9kaXY+XG48ZGl2IGNsYXNzPVwicGFydG5lcl9sb2dvc1wiPlxuPGEgaHJlZj1cImh0dHBzOi8vd3d3LnJ1bml2ZXJzLnJ1XCIgdGFyZ2V0PVwiX2JsYW5rXCI+PGltZyBzcmM9XCJpbWFnZXMvUnVuaXZlcnMtTG9nby1jb2xvci5zdmdcIiAvPjwvYT5cbjxhIGhyZWY9XCJodHRwczovL3d3dy50cmFuc25lZnQucnVcIiB0YXJnZXQ9XCJfYmxhbmtcIj48aW1nIHNyYz1cImltYWdlcy9UcmFuc25lZnRfbG9nbzEucG5nXCIgLz48L2E+XG48YSBocmVmPVwiaHR0cHM6Ly9oaXN0Z2VvLnJ1L2xhYm9yYXRvcnkuaHRtbFwiIHRhcmdldD1cIl9ibGFua1wiPjxpbWcgc3JjPVwiaW1hZ2VzL2dlb2xhYi5wbmdcIiAvPjwvYT5cbjxhIGhyZWY9XCJodHRwczovL25leHRnaXMucnVcIiB0YXJnZXQ9XCJfYmxhbmtcIj48aW1nIHNyYz1cImltYWdlcy9uZXh0Z2lzLnBuZ1wiIC8+PC9hPlxuPC9kaXY+XG5cbjxkaXYgc3R5bGU9XCJtYXJnaW4tdG9wOiAyMHB4O1wiPjwvZGl2PlxuXG48ZGl2IGNsYXNzPVwic3dpdGNoLWFib3V0LWxhbmd1YWdlXCI+XG48YSBjbGFzcz1cInN3aXRjaC1hYm91dC1sYW5ndWFnZS1idG5cIiBuYW1lPVwiZW5cIiBocmVmPVwiI1wiIHN0eWxlPVwiZm9udC1zaXplOiAxLjJyZW07IGZvbnQtd2VpZ2h0OiBib2xkO1wiPlxuRW5nbGlzaCB2ZXJzaW9uXG48L2E+XG48L2Rpdj5cblxuPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6IDIwcHg7XCI+PC9kaXY+XG48UCBBTElHTj1KVVNUSUZZIFNUWUxFPVwibWFyZ2luLWJvdHRvbTogMC4xN2luXCI+XG48aDI+0J4g0L/RgNC+0LXQutGC0LUg0JPRgNCw0L3QuNGG0Ysg0KDQvtGB0YHQuNC4IDg1MC0yMDE4INCz0LMuPC9oMj48L1A+XG5cbjxQIEFMSUdOPUpVU1RJRlkgU1RZTEU9XCJtYXJnaW4tYm90dG9tOiAwLjE3aW5cIj5cbjxhIGhyZWY9XCJodHRwczovL3d3dy5ydW5pdmVycy5ydVwiIHRhcmdldD1cIl9ibGFua1wiPsKr0KDRg9C90LjQstC10YDRgcK7PC9hPiDRgdC+0LLQvNC10YHRgtC90L4g0YEgPGEgaHJlZj1cImh0dHBzOi8vaGlzdGdlby5ydS9sYWJvcmF0b3J5Lmh0bWxcIiB0YXJnZXQ9XCJfYmxhbmtcIj7Qm9Cw0LHQvtGA0LDRgtC+0YDQuNC10Lkg0LjRgdGC0L7RgNC40YfQtdGB0LrQvtC5INCz0LXQvtC40L3RhNC+0YDQvNCw0YLQuNC60Lg8L2E+INCY0L3RgdGC0LjRgtGD0YLQsCDQstGB0LXQvtCx0YnQtdC5INC40YHRgtC+0YDQuNC4INCg0JDQnSDQuCDQutC+0LzQv9Cw0L3QuNC10LkgPGEgaHJlZj1cImh0dHA6Ly9uZXh0Z2lzLnJ1L1wiIHRhcmdldD1cIl9ibGFua1wiPk5leHRHSVM8L2E+INGA0LDRgdGI0LjRgNGP0LXRgiDQv9GA0LXQtNGB0YLQsNCy0LvQtdC90L3Ri9C5INGA0LDQvdC10LUg0L/RgNC+0LXQutGCIMKr0JPRgNCw0L3QuNGG0Ysg0KDQvtGB0YHQuNC4IDE0NjLigJMyMDE4INCz0LMuwrsg0LfQsCDRgdGH0LXRgiDRg9Cy0LXQu9C40YfQtdC90LjRjyDRhdGA0L7QvdC+0LvQvtCz0LjRh9C10YHQutC+0LPQviDQvtGF0LLQsNGC0LAg0Lgg0LTQvtCx0LDQstC70LXQvdC40Y8g0L3QvtCy0YvRhSDRgdC70L7QtdCyLiDQotC10L/QtdGA0Ywg0LTQsNC90L3Ri9C5INC/0YDQvtC10LrRgiDQv9C+0LvRg9GH0LDQtdGCINC90LDQt9Cy0LDQvdC40LUgwqvQk9GA0LDQvdC40YbRiyDQoNGD0YHQuCwg0KDQvtGB0YHQuNC4LCDQodCh0KHQoCDQuCDQoNCkIDg1MOKAkzIwMTgg0LPQsy7Cuy5cbjwvUD5cbjxQIEFMSUdOPUpVU1RJRlkgU1RZTEU9XCJtYXJnaW4tYm90dG9tOiAwLjE3aW5cIj5cbtCt0YLQvtGCINC60LDRgNGC0L7Qs9GA0LDRhNC40YfQtdGB0LrQuNC5INC/0YDQvtC10LrRgiDRgdC+0LTQtdGA0LbQuNGCINCz0LXQvtC00LDQvdC90YvQtSDQviDQv9C+0LvQuNGC0LjRh9C10YHQutC40YUg0LPRgNCw0L3QuNGG0LDRhSDRgdC+0LLRgNC10LzQtdC90L3QvtC5INCg0L7RgdGB0LjQuCDQuCDQtdC1INC/0YDQtdC00YjQtdGB0YLQstC10L3QvdC40LrQvtCyLiDQktCw0LbQvdC10LnRiNC10Lkg0LLQvtC30LzQvtC20L3QvtGB0YLRjNGOLCDQutC+0YLQvtGA0YPRjiDQv9GA0LXQtNC+0YHRgtCw0LLQu9GP0LXRgiDQtNCw0L3QvdCw0Y8g0LrQsNGA0YLQsCwg0Y/QstC70Y/QtdGC0YHRjyDQstGL0LHQvtGAINC70Y7QsdC+0LPQviDQs9C+0LTQsCDQsiDQuNC90YLQtdGA0LLQsNC70LUg0LrQsNGA0YLRiy4g0JPQvtC0INC80L7QttC90L4g0LLRi9Cx0YDQsNGC0YwsINC60LvQuNC60L3Rg9CyINC80YvRiNC60L7QuSDQsiDQvdGD0LbQvdC+0Lwg0LzQtdGB0YLQtSDQu9C10L3RgtGLINCy0YDQtdC80LXQvdC4ICjQsiDQvdC40LbQvdC10Lkg0YfQsNGB0YLQuCDQutCw0YDRgtGLKSwg0LvQuNCx0L4g0LfQsNC/0YPRgdGC0LjQsiDQsNCy0YLQvtC80LDRgtC40YfQtdGB0LrRg9GOINC/0YDQvtC60YDRg9GC0LrRgyDQu9C10L3RgtGLINCy0YDQtdC80LXQvdC4INGBINGI0LDQs9C+0Lwg0LIg0L7QtNC40L0g0LPQvtC0LCDQu9C40LHQviwg0LjRgdC/0L7Qu9GM0LfRg9GPINC40LrQvtC90LrQuCArINC4IOKAkyDRgdC/0YDQsNCy0LAg0L7RgiDQu9C10L3RgtGLINCy0YDQtdC80LXQvdC4LCDRgdC00LLQuNCz0LDRgtGM0YHRjyDQvdCwINC+0LTQuNC9INCz0L7QtCDQstC70LXQstC+INC40LvQuCDQstC/0YDQsNCy0L4uXG48L1A+XG5cbjxQIEFMSUdOPUpVU1RJRlkgU1RZTEU9XCJtYXJnaW4tYm90dG9tOiAwLjE3aW5cIj5cbtCf0L7QvdGP0YLQvdC+LCDRh9GC0L4g0L3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwINC30LDRj9Cy0LvQtdC90L3QvtCz0L4g0YXRgNC+0L3QvtC70L7Qs9C40YfQtdGB0LrQvtCz0L4g0LjQvdGC0LXRgNCy0LDQu9CwINGB0L7QstC10YDRiNC10L3QvdC+INGD0YHQu9C+0LLQvdCwLiDQntC90LAg0L/RgNC40LfQstCw0L3QsCDQv9C+0LrQsNC30LDRgtGMINGA0LDRgdGB0LXQu9C10L3QuNC1INGB0LvQsNCy0Y/QvdGB0LrQuNGFINC/0LvQtdC80LXQvSDQsiDQktC+0YHRgtC+0YfQvdC+0Lkg0JXQstGA0L7Qv9C1INC90LDQutCw0L3Rg9C90LUg0YHQvtCx0YvRgtC40LksINC40LfQstC10YHRgtC90YvRhSDQutCw0LogwqvQv9GA0LjQt9Cy0LDQvdC40LUg0KDRjtGA0LjQutCwwrsuINCR0L7Qu9C10LUg0YDQsNC90L3Rj9GPIMKr0L3QuNC20L3Rj9GPwrsg0LPRgNCw0L3QuNGG0LAg0L/QvtGC0YDQtdCx0L7QstCw0LvQsCDQsdGLINC00L7Qv9C+0LvQvdC40YLQtdC70YzQvdC+0LPQviDQvtGC0L7QsdGA0LDQttC10L3QuNGPINC40LfQvNC10L3QtdC90LjQuSDQsiDRgtC10YDRgNC40YLQvtGA0LjRj9GFLCDQt9Cw0L3Rj9GC0YvRhSDQvtGC0LTQtdC70YzQvdGL0LzQuCDQstC+0YHRgtC+0YfQvdC+0YHQu9Cw0LLRj9C90YHQutC40LzQuCDRjdGC0L3QuNGH0LXRgdC60LjQvNC4INCz0YDRg9C/0L/QsNC80LgsINGH0YLQviDRgSDRgtGA0YPQtNC+0Lwg0LLRi9C/0L7Qu9C90LjQvNC+INC00LDQttC1INC/0L4g0YDQtdC30YPQu9GM0YLQsNGC0LDQvCDRgdC/0LXRhtC40LDQu9GM0L3Ri9GFINC40YHRgdC70LXQtNC+0LLQsNC90LjQuS4g0KLQsNC60LjQvCDQvtCx0YDQsNC30L7QvCwg0L3QvtCy0YvQtSDRgdC70L7QuCDQv9C+0LvQuNGC0LjRh9C10YHQutC40YUg0LPRgNCw0L3QuNGGINC/0L7Qt9Cy0L7Qu9GP0Y7RgiDQvtGF0LDRgNCw0LrRgtC10YDQuNC30L7QstCw0YLRjCDRgNGD0YHRgdC60YPRjiDQuNGB0YLQvtGA0LjRjiDQtNC+IDE0NjIg0LMuXG48L1A+XG48UCBBTElHTj1KVVNUSUZZIFNUWUxFPVwibWFyZ2luLWJvdHRvbTogMC4xN2luXCI+XG7QlNC70Y8g0L/QtdGA0LLQvtCz0L4g0L/QtdGA0LjQvtC00LAg0YDRg9GB0YHQutC+0Lkg0LjRgdGC0L7RgNC40Lgg0Y3RgtC+INGB0LTQtdC70LDQvdC+INC90LUg0YLQvtC70YzQutC+INC/0YPRgtC10Lwg0L7RgtC+0LHRgNCw0LbQtdC90LjRjyDQstC90LXRiNC90LjRhSDQs9GA0LDQvdC40YYg0LPQvtGB0YPQtNCw0YDRgdGC0LLQtdC90L3QvtGB0YLQuCwg0L3QviDQuCDQs9GA0LDQvdC40YYg0LLQvdGD0YLRgNC10L3QvdC40YUsINC/0YDQuNC90LDQtNC70LXQttCw0YnQuNGFLCDRg9GB0LvQvtCy0L3QviDQs9C+0LLQvtGA0Y8sINC6IMKr0LLQtdGA0YXQvdC10LzRg8K7INCw0LTQvNC40L3QuNGB0YLRgNCw0YLQuNCy0L3QvtC80YMg0YPRgNC+0LLQvdGOLiDQn9GA0Lgg0LLRgdC10Lkg0YPRgdC70L7QstC90L7RgdGC0Lgg0YHQsNC80L7Qs9C+INC/0L7QvdGP0YLQuNGPIMKr0LrQvdGP0LbQtdGB0YLQstC+wrsg0LTQu9GPINC/0LXRgNCy0L7QuSDQv9C+0LvQvtCy0LjQvdGLINCy0L7RgdGC0L7Rh9C90L7QtdCy0YDQvtC/0LXQudGB0LrQvtC5INC/0L7Qu9C40YLQuNGH0LXRgdC60L7QuSDQuNGB0YLQvtGA0LjQuCwg0L4g0YfQtdC8INC/0LjRiNGD0YIg0YHQvtCy0YDQtdC80LXQvdC90YvQtSDQuNGB0YLQvtGA0LjQutC4ICg8YSBocmVmPVwiaHR0cHM6Ly9ydW5pdmVycy5ydS9pbmNsdWRlL2RvYy9ydXNsYW5kL21haW5fdGV4dF9kZXRhaWwucGhwXCI+aHR0cHM6Ly9ydW5pdmVycy5ydS9pbmNsdWRlL2RvYy9ydXNsYW5kL21haW5fdGV4dF9kZXRhaWwucGhwPC9hPiksINGE0L7RgNC80LDRgiDQtNC40L3QsNC80LjRh9C10YHQutC+0Lkg0LrQsNGA0YLRiyDQstGL0L3Rg9C20LTQsNC10YIg0Log0YLQvtC80YMsINGH0YLQvtCx0Ysg0YPQv9GA0L7RgdGC0LjRgtGMINC40YHRgtC+0YDQuNGH0LXRgdC60YPRjiDRgNC10LDQu9GM0L3QvtGB0YLRjCDQuCDQv9GA0LjQtNCw0YLRjCDQv9C+0LvQuNGC0LjRh9C10YHQutC+0LzRgyDQu9Cw0L3QtNGI0LDRhNGC0YMgwqvQvtGB0Y/Qt9Cw0LXQvNGL0LXCuyDQutC+0L3RgtGD0YDRiyDQsiDQstC40LTQtSDQvdCw0LHQvtGA0LAg0L/QvtC70LjQs9C+0L3QvtCyLlxuPC9QPlxuPFAgQUxJR049SlVTVElGWSBTVFlMRT1cIm1hcmdpbi1ib3R0b206IDAuMTdpblwiPlxu0JogwqvQstC10YDRhdC90LXQvNGDwrsg0LDQtNC80LjQvdC40YHRgtGA0LDRgtC40LLQvdC+0LzRgyDRg9GA0L7QstC90Y4g0L7RgtC90LXRgdC10L3RiyDQutC90Y/QttC10YHRgtCy0LAsINC+0LHQu9Cw0LTQsNCy0YjQuNC1INGB0LDQvNC+0YHRgtC+0Y/RgtC10LvRjNC90L7RgdGC0YzRjiwg0L3QviDQstGF0L7QtNC40LLRiNC40LUg0LIg0YLRgyDQuNC70Lgg0LjQvdGD0Y4g0L/QvtC70LjRgtC40YfQtdGB0LrRg9GOINGB0LjRgdGC0LXQvNGDICjQvdCw0L/RgNC40LzQtdGALCDQktC10LvQuNC60L7Qs9C+INC60L3Rj9C20LXRgdGC0LLQsCDQktC70LDQtNC40LzQuNGA0YHQutC+0LPQvikuINCj0LTQtdC70YzQvdGL0LUg0LrQvdGP0LbQtdGB0YLQstCwINC+0YLQvdC+0YHRj9GC0YHRjyDQuiDRgtC10YDRgNC40YLQvtGA0LjQsNC70YzQvdGL0Lwg0LXQtNC40L3QuNGG0LDQvCDRg9GA0L7QstC90LXQvCDQvdC40LbQtSwg0L/QvtGN0YLQvtC80YMg0L3QsCDQutCw0YDRgtC1INC90LUg0L7RgtC+0LHRgNCw0LbQsNC70LjRgdGMLlxuPC9QPlxuPFAgQUxJR049SlVTVElGWSBTVFlMRT1cIm1hcmdpbi1ib3R0b206IDAuMTdpblwiPlxu0J/QvtC90LjQvNCw0Y8sINGH0YLQviwg0YEg0L7QtNC90L7QuSDRgdGC0L7RgNC+0L3Riywg0YTQvtGA0LzRiyDQv9C+0LvQuNGC0LjRh9C10YHQutC+0LPQviDRgdGC0LDRgtGD0YHQsCDRgtC10YDRgNC40YLQvtGA0LjQuSDQvNC90L7Qs9C+0L7QsdGA0LDQt9C90Ysg0Lgg0YfRgtC+LCDRgSDQtNGA0YPQs9C+0Lkg0YHRgtC+0YDQvtC90YssINGN0YLQviDQvNC90L7Qs9C+0L7QsdGA0LDQt9C40LUg0L3QtdC+0LHRhdC+0LTQuNC80L4g0YHQstC10YHRgtC4INC6INC+0LPRgNCw0L3QuNGH0LXQvdC90L7QvNGDINGH0LjRgdC70YMg0LLQsNGA0LjQsNC90YLQvtCyINC/0YDQuCDQvtGC0L7QsdGA0LDQttC10L3QuNC4INC90LAg0LrQsNGA0YLQtSwg0LzRiyDQstGL0LTQtdC70LjQu9C4INCy0YHQtdCz0L4g0LLQvtGB0LXQvNGMINGA0LDQt9C70LjRh9C90YvRhSDRgdGC0LDRgtGD0YHQvtCyINGC0LXRgNGA0LjRgtC+0YDQuNC4INCg0L7RgdGB0LjQuCDQuNC70Lgg0LXQtSDQv9GA0LXQtNGI0LXRgdGC0LLQtdC90L3QuNC60L7Qsjo8L2JyPlxuPC9QPlxuPFAgQUxJR049SlVTVElGWSBTVFlMRT1cIm1hcmdpbi1ib3R0b206IDAuMTdpblwiPlxuMSkg0J7RgdC90L7QstC90LDRjyDRgtC10YDRgNC40YLQvtGA0LjRjyDQs9C+0YHRg9C00LDRgNGB0YLQstCwLjwvYnI+XG4yKSDQotC10YDRgNC40YLQvtGA0LjRjyDQv9C+0LQg0L/RgNC+0YLQtdC60YLQvtGA0LDRgtC+0LwsINCyINCy0LDRgdGB0LDQu9GM0L3QvtC5INC30LDQstC40YHQuNC80L7RgdGC0Lgg0LjQu9C4INCyINGB0YTQtdGA0LUg0LLQu9C40Y/QvdC40Y8uPC9icj5cbjMpINCQ0YDQtdC90LTQvtCy0LDQvdC90LDRjyDRgtC10YDRgNC40YLQvtGA0LjRjy48L2JyPlxuNCkg0KLQtdGA0YDQuNGC0L7RgNC40Y8g0LIg0YHQvtCy0LzQtdGB0YLQvdC+0Lwg0LLQu9Cw0LTQtdC90LjQuC48L2JyPlxuNSkg0KHQv9C+0YDQvdCw0Y8g0YLQtdGA0YDQuNGC0L7RgNC40Y8uPC9icj5cbjwvUD5cbjxQIEFMSUdOPUpVU1RJRlkgU1RZTEU9XCJtYXJnaW4tYm90dG9tOiAwLjE3aW5cIj5cbtCa0YDQvtC80LUg0YLQvtCz0L4sINCyINCz0L7QtCDQuNC30LzQtdC90LXQvdC40Y8g0LrQvtC90YTQuNCz0YPRgNCw0YbQuNC4INCz0YDQsNC90LjRhtGLINGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LjQuSDRg9GH0LDRgdGC0L7QuiDQv9C+0LrQsNC30LDQvSDQvtGC0LTQtdC70YzQvdGL0Lwg0L/QvtC70LjQs9C+0L3QvtC8OiDQutCw0Log0J3QvtCy0LDRjyDRgtC10YDRgNC40YLQvtGA0LjRjyAoNikg0LjQu9C4LCDQvdCw0L/RgNC+0YLQuNCyLCDQutCw0Log0KPRgtGA0LDRh9C10L3QvdCw0Y8g0YLQtdGA0YDQuNGC0L7RgNC40Y8gKDcpLiDQrdGC0Lgg0L/QvtC70LjQs9C+0L3RiyDRgtCw0LrQttC1INGB0L3QsNCx0LbQtdC90Ysg0LzQsNGA0LrQtdGA0LDQvNC4LCDRhtC40YTRgNCwINC90LAg0LrQvtGC0L7RgNGL0YUg0L7QsdC+0LfQvdCw0YfQsNC10YIg0YHQvtC+0YLQstC10YLRgdGC0LLRg9GO0YnRg9GOINC/0L7Qt9C40YbQuNGOINCyINGB0L/QuNGB0LrQtSDRgtC10YDRgNC40YLQvtGA0LjQsNC70YzQvdGL0YUg0LjQt9C80LXQvdC10L3QuNC5INC40L3RhNC+0YDQvNCw0YbQuNC+0L3QvdC+0Lkg0L/QsNC90LXQu9C4LiDQkiDRgdCy0Y/Qt9C4INGBINGC0LXQvCwg0YfRgtC+INC90LXQutC+0YLQvtGA0YvQtSDQuNC30LzQtdC90LXQvdC40Y8g0YLQtdGA0YDQuNGC0L7RgNC40Lgg0LjQvNC10LvQuCDQvNC10YHRgtC+INCyINGA0LDQt9C90YvQtSDQvNC10YHRj9GG0Ysg0LPQvtC00LAsINC40L3QvtCz0LTQsCDQv9C+0LvQuNCz0L7QvdGLINGB0L4g0YHRgtCw0YLRg9GB0LDQvNC4IDYg0LggNyDQt9Cw0LTQtdGA0LbQuNCy0LDRjtGC0YHRjyDQvdCwINC60LDRgNGC0LUg0Lgg0LIg0YHQu9C10LTRg9GO0YnQtdC8INC/0L7RgdC70LUg0YHQvtCx0YvRgtC40Y8g0LPQvtC00YMuXG48L1A+XG48UCBBTElHTj1KVVNUSUZZIFNUWUxFPVwibWFyZ2luLWJvdHRvbTogMC4xN2luXCI+XG44KSDQlNC70Y8g0L/QtdGA0LjQvtC00LAg0LTQviAxNDYyINCzLiDigJQg0YHQsNC80L7RgdGC0L7Rj9GC0LXQu9GM0L3QsNGPINGC0LXRgNGA0LjRgtC+0YDQuNGPICjQutC90Y/QttC10YHRgtCy0L4g0Lgg0YIu0L8uKSwg0L7Qv9GA0LXQtNC10LvRj9GO0YnQsNGPINCy0L3Rg9GC0YDQtdC90L3QuNC1INCz0YDQsNC90LjRhtGLINC60LDRgNGC0L7Qs9GA0LDRhNC40YDQvtCy0LDQvdC90L7Qs9C+INGA0LXQs9C40L7QvdCwICjQvdCw0L/RgNC40LzQtdGALCDQotCy0LXRgNGB0LrQvtC1INC60L3Rj9C20LXRgdGC0LLQviDQtNC+IDEzODIg0LMuINCy0L3Rg9GC0YDQuCDQktC10LvQuNC60L7Qs9C+INC60L3Rj9C20LXRgdGC0LLQsCDQktC70LDQtNC40LzQuNGA0YHQutC+0LPQvikuXG48L1A+XG48UCBBTElHTj1KVVNUSUZZIFNUWUxFPVwibWFyZ2luLWJvdHRvbTogMC4xN2luXCI+XG7QrdGC0LAg0LTQuNGE0YTQtdGA0LXQvdGG0LjQsNGG0LjRjyDQvtGC0YDQsNC20LXQvdCwINCy0L4g0LLRgdC/0LvRi9Cy0LDRjtGJ0LXQvCDQvtC60L3QtSwg0LLRi9C30YvQstCw0LXQvNC+0Lwg0L/QviDQutC70LjQutGDINC80YvRiNC4INC90LAg0LvRjtCx0L7QvCDQvtCx0YrQtdC60YLQtSDQstC90YPRgtGA0Lgg0L/QvtC70LjRgtC40YfQtdGB0LrQuNGFINCz0YDQsNC90LjRhi4g0KHQu9C10LTRg9C10YIg0L/QvtC80L3QuNGC0YwsINGH0YLQviDQsNGC0YDQuNCx0YPRgtGLLCDQvtGC0L3QvtGB0Y/RidC40LXRgdGPINC6INGC0LXRgNGA0LjRgtC+0YDQuNGP0Lwg0YHRgtCw0YLRg9GB0LAgMeKAkzUsINC/0L4g0LrQu9C40LrRgyDQvNGL0YjQuCDQv9C+0Y/QstGP0YLRgdGPINC70LjRiNGMINCyINGC0L7QvCDRgdC70YPRh9Cw0LUsINC10YHQu9C4INCyINC80LXRgdGC0LUg0LrQu9C40LrQsCDQvdCwINC60LDRgNGC0LUg0L3QtSDQv9C+0LzQtdGJ0LXQvdCwINGC0LXRgNGA0LjRgtC+0YDQuNGPINGB0L4g0YHRgtCw0YLRg9GB0L7QvCA4LiDQl9Cw0LvQuNCy0LrQsCDRgdC+0L7RgtCy0LXRgtGB0YLQstGD0Y7RidC40YUg0L/QvtC70LjQs9C+0L3QvtCyINC/0LXRgNC10LTQsNC90LAg0L/Rj9GC0YzRjiDRhtCy0LXRgtCw0LzQuDog0L7QtNC90LjQvCDRhtCy0LXRgtC+0Lwg0L/QvtC60LDQt9Cw0L3QsCDQvtGB0L3QvtCy0L3QsNGPINGC0LXRgNGA0LjRgtC+0YDQuNGPINCz0L7RgdGD0LTQsNGA0YHRgtCy0LAg0Lgg0LLQvdC+0LLRjCDQv9GA0LjRgdC+0LXQtNC40L3QtdC90L3Ri9C1INC30LXQvNC70LggKNGB0YLQsNGC0YPRgdGLIDEg0LggNiksINC00YDRg9Cz0LjQvCDRhtCy0LXRgtC+0Lwg4oCTINC30LXQvNC70LgsINC90LDRhdC+0LTRj9GJ0LjQtdGB0Y8g0LIg0L3QtdC60L7RgtC+0YDQvtC5INC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiDQvdC10LPQviAo0YHRgtCw0YLRg9GBIDIpLCDRgtGA0LXRgtGM0LjQvCDigJMg0LfQtdC80LvQuCDQsNGA0LXQvdC00L7QstCw0L3QvdGL0LUsINGB0L/QvtGA0L3Ri9C1INC4INC90LDRhdC+0LTRj9GJ0LjQtdGB0Y8g0L/QvtC0INGB0L7QstC80LXRgdGC0L3Ri9C8INGD0L/RgNCw0LLQu9C10L3QuNC10Lwg0YEg0LTRgNGD0LPQuNC80Lgg0LPQvtGB0YPQtNCw0YDRgdGC0LLQsNC80LggKNGB0YLQsNGC0YPRgdGLIDPigJM1KS4g0KPRgtGA0LDRh9C10L3QvdGL0LUg0YLQtdGA0YDQuNGC0L7RgNC40Lgg0L7QsdC+0LfQvdCw0YfQtdC90Ysg0YfQtdGC0LLQtdGA0YLRi9C8INGG0LLQtdGC0L7QvCAo0YHRgtCw0YLRg9GBIDcpLCDQvtC00L3QsNC60L4g0LIg0YHQuNC70YMg0YDRj9C00LAg0YLQtdGF0L3QuNGH0LXRgdC60LjRhSDQvtGB0L7QsdC10L3QvdC+0YHRgtC10Lkg0YLQtdC60YPRidC10LPQviDQsNC70LPQvtGA0LjRgtC80LAg0L/QvtGB0YLRgNC+0LXQvdC40Y8g0LPQtdC+0LzQtdGC0YDQuNC5INC90LUg0LLRgdC1INGD0YLRgNCw0YfQtdC90L3Ri9C1INGC0LXRgNGA0LjRgtC+0YDQuNC4INC/0L7QutCw0LfQsNC90Ysg0L3QsCDQutCw0YDRgtC1INC+0YLQtNC10LvRjNC90YvQvCDQv9C+0LvQuNCz0L7QvdC+0LwuXG48L1A+XG48UCBBTElHTj1KVVNUSUZZIFNUWUxFPVwibWFyZ2luLWJvdHRvbTogMC4xN2luXCI+XG7QkiDRhtC10L3RgtGA0LUg0LrQsNC20LTQvtCz0L4g0L/QvtC70LjQs9C+0L3QsCwg0LTQtdC80L7QvdGB0YLRgNC40YDRg9GO0YnQtdCz0L4g0L/RgNC40YDQsNGJ0LXQvdC40LUg0LjQu9C4INC/0L7RgtC10YDRjiDRgtC10YDRgNC40YLQvtGA0LjQuCwg0L/QvtC80LXRidC10L0g0LzQsNGA0LrQtdGALCDQv9C+0LzQvtCz0LDRjtGJ0LjQuSDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y4g0LHRi9GB0YLRgNC+INC90LDQudGC0Lgg0YHQvtC+0YLQstC10YLRgdGC0LLRg9GO0YnQtdC1INC80LXRgdGC0L4g0L3QsCDQvNC10LvQutC+0LzQsNGB0YjRgtCw0LHQvdC+0Lkg0LrQsNGA0YLQtS4g0J/QviDQutC70LjQutGDINC90LAg0LzQsNGA0LrQtdGAINCy0YvQtNCw0LXRgtGB0Y8g0LjQvdGE0L7RgNC80LDRhtC40Y8g0L4g0YHQvtCx0YvRgtC40LgsINC/0YDQuNCy0LXQtNGI0LXQvCDQuiDQv9C+0Y/QstC70LXQvdC40Y4g0LTQsNC90L3QvtCz0L4g0YLQtdGA0YDQuNGC0L7RgNC40LDQu9GM0L3QvtCz0L4g0L7QsdGA0LDQt9C+0LLQsNC90LjRjy5cbjwvUD5cbjxQIEFMSUdOPUpVU1RJRlkgU1RZTEU9XCJtYXJnaW4tYm90dG9tOiAwLjE3aW5cIj5cbtCf0Y/RgtGL0Lkg0YbQstC10YIg4oCUINC00LvRjyDRgtC10YDRgNC40YLQvtGA0LjQuSDRgSDQstC90YPRgtGA0LXQvdC90LjQvNC4INCz0YDQsNC90LjRhtCw0LzQuC4g0J/QviDQutC70LjQutGDINC90LAg0LvRjtCx0L7QuSDQv9C+0LvQuNCz0L7QvSDQvNC+0LbQvdC+INC/0L7Qu9GD0YfQuNGC0Ywg0LTQsNC90L3Ri9C1INC+INGF0YDQvtC90L7Qu9C+0LPQuNGH0LXRgdC60L7QvCDQtNC40LDQv9Cw0LfQvtC90LUsINCyINC60L7RgtC+0YDQvtC8INGB0YPRidC10YHRgtCy0L7QstCw0LvQviDQtNCw0L3QvdC+0LUg0YLQtdGA0YDQuNGC0L7RgNC40LDQu9GM0L3QvtC1INC+0LHRgNCw0LfQvtCy0LDQvdC40LUsINC4INC10LPQviDQv9C70L7RidCw0LTQuCAo0LIg0LrQstCw0LTRgNCw0YLQvdGL0YUg0LrQuNC70L7QvNC10YLRgNCw0YUpLlxuPC9QPlxuPFAgQUxJR049SlVTVElGWSBTVFlMRT1cIm1hcmdpbi1ib3R0b206IDAuMTdpblwiPlxu0JzQvdC+0LPQuNC1INC/0L7Qu9C40LPQvtC90YssINC+0YLQvdC+0YHQuNC80YvQtSDQuiDRgdGC0LDRgtGD0YHRgyAyLCDQvtGC0LzQtdGH0LXQvdGLINCy0L4g0LLRgdC/0LvRi9Cy0LDRjtGJ0LXQvCDQvtC60L3QtSDQutCw0Log0LfQvtC90LAg0LTRgNC10LLQvdC10YDRg9GB0YHQutC+0Lkg0LrQvtC70L7QvdC40LfQsNGG0LjQuC4g0K3RgtCwINGE0L7RgNC80YPQu9C40YDQvtCy0LrQsCDQv9C+0LTRgNCw0LfRg9C80LXQstCw0LXRgiDQsiDQvtGB0L3QvtCy0L3QvtC8INC60L7QvdGC0LDQutGC0L3Ri9C1INC30L7QvdGLINC80LXQttC00YMg0L7RgdC90L7QstC90YvQvCDQvdCw0YHQtdC70LXQvdC40LXQvCDQs9C+0YHRg9C00LDRgNGB0YLQstCwINC4INC90LDRgdC10LvQtdC90LjQtdC8LCDQu9C40YjRjCDQstC+0LLQu9C10LrQsNC10LzRi9C8INCyINC+0YLQvdC+0YjQtdC90LjRjyDRgSDQvdC40LwuINCf0L7RgdGC0LXQv9C10L3QvdC+0LUg0L/RgNC+0LTQstC40LbQtdC90LjQtSDQtNGA0LXQstC90LXRgNGD0YHRgdC60L7Qs9C+INC30LXQvNC70LXQtNC10LvRjNGH0LXRgdC60L7Qs9C+INC90LDRgdC10LvQtdC90LjRjyDQvdCwINCy0L7RgdGC0L7QuiDQuCDRjtCz0L4t0LLQvtGB0YLQvtC6INCyINC60L7QvdC10YfQvdC+0Lwg0LjRgtC+0LPQtSDQv9GA0LjQstC+0LTQuNC70L4g0Log0LLQutC70Y7Rh9C10L3QuNGOINC+0YHQstC+0LXQvdC90L7QuSDRgtC10YDRgNC40YLQvtGA0LjQuCDQsiDQvtGB0L3QvtCy0L3QvtC5INC60L7QvdGC0YPRgCDQs9C+0YHRg9C00LDRgNGB0YLQstCwLCDQvdC+INC/0YDQvtGG0LXRgdGBINGN0YLQvtGCINC90LUg0LzQvtC20LXRgiDQsdGL0YLRjCDQvtC00L3QvtC30L3QsNGH0L3QviDQt9Cw0YTQuNC60YHQuNGA0L7QstCw0L0g0LIg0L/RgNC+0YHRgtGA0LDQvdGB0YLQstC1INC4INCy0YDQtdC80LXQvdC4LlxuPC9QPlxuPFAgQUxJR049SlVTVElGWSBTVFlMRT1cIm1hcmdpbi1ib3R0b206IDAuMTdpblwiPlxu0JHQvtC70LXQtSDQv9C+0LTRgNC+0LHQvdC+0LUg0L7Qv9C40YHQsNC90LjQtSDRgtC10YDRgNC40YLQvtGA0LjQuSwg0L7RgtC+0LHRgNCw0LbQtdC90L3Ri9GFINC90LAg0LrQsNGA0YLQtSwg0LTQvtGB0YLRg9C/0L3QviDQv9C+INGB0YHRi9C70LrQtSDQuNC3INC+0LrQvdCwLCDQstGB0L/Qu9GL0LLQsNGO0YnQtdCz0L4g0L/QviDQutC70LjQutGDINC80YvRiNC60Lgg0L3QsCDRgdC+0L7RgtCy0LXRgtGB0YLQstGD0Y7RidC10Lkg0YLQtdGA0YDQuNGC0L7RgNC40LgsINC60L7RgtC+0YDQsNGPINCy0LXQtNC10YIg0L3QsCDRgdCw0LnRgiDCq9Cg0YPQvdC40LLQtdGA0YHCuy5cbjwvUD5cbjxQIEFMSUdOPUpVU1RJRlkgU1RZTEU9XCJtYXJnaW4tYm90dG9tOiAwLjE3aW5cIj5cbtCa0YDQvtC80LUg0YLQvtCz0L4sINCyINC90L7QstC+0Lkg0LLQtdGA0YHQuNC4INC/0YDQvtC10LrRgiDQtNC+0L/QvtC70L3QtdC9INGA0Y/QtNC+0Lwg0YHQu9C+0LXQsi4g0KHQu9C+0Lkg0LPQvtGA0L7QtNC+0LIg0L/QvtC60LDQt9GL0LLQsNC10YIg0L3QsCDQutCw0YDRgtC1INGA0LDRgdC/0L7Qu9C+0LbQtdC90LjQtSDRgdGC0L7Qu9C40YYg0Lgg0LDQtNC80LjQvdC40YHRgtGA0LDRgtC40LLQvdGL0YUg0YbQtdC90YLRgNC+0LIgwqvQstC10YDRhdC90LXQs9C+INGD0YDQvtCy0L3Rj8K7LCDRgNCw0YHQv9C+0LvQvtC20LXQvdC90YvRhSDQv9C+INGB0YLQsNGC0YPRgdGDINC90LAg0L7QtNC90YMg0YHRgtGD0L/QtdC90YzQutGDINC90LjQttC1INGB0YLQvtC70LjRhi4g0JIg0L3QsNGI0Lgg0LfQsNC00LDRh9C4INC90LUg0LLRhdC+0LTQuNC70L4g0L7RgtC+0LHRgNCw0LbQtdC90LjQtSDQstGB0LXRhSDQs9C+0YDQvtC00L7QsiDQuNC70Lgg0YXQvtGC0Y8g0LHRiyDQs9C+0YDQvtC00L7QsiDQvdC40LbQvdC40YUg0LDQtNC80LjQvdC40YHRgtGA0LDRgtC40LLQvdGL0YUg0YPRgNC+0LLQvdC10LksINCwINC00LDRgtGLINC40YUg0L/QvtGP0LLQu9C10L3QuNGPINC4INC40YHRh9C10LfQvdC+0LLQtdC90LjRjyDQvdCwINC60LDRgNGC0LUg0L3QtSDRgdC+0LLQv9Cw0LTQsNGO0YIg0YEg0LTQsNGC0LDQvNC4INC/0LXRgNCy0L7Qs9C+INC4INC/0L7RgdC70LXQtNC90LXQs9C+INGD0L/QvtC80LjQvdCw0L3QuNC5LiDQpdGA0L7QvdC+0LvQvtCz0LjRh9C10YHQutC40LUg0YDQsNC80LrQuCDRhdCw0YDQsNC60YLQtdGA0LjQt9GD0Y7RgiDQu9C40YjRjCDQstGA0LXQvNC10L3QvdC+0Lkg0LjQvdGC0LXRgNCy0LDQuywg0LrQvtCz0LTQsCDQs9C+0YDQvtC0INGB0LvRg9C20LjQuyDQsNC00LzQuNC90LjRgdGC0YDQsNGC0LjQstC90YvQvCDRhtC10L3RgtGA0L7QvCDCq9Cy0LXRgNGF0L3QtdCz0L4g0YPRgNC+0LLQvdGPwrsuINCf0L7RjdGC0L7QvNGDINCx0L7Qu9GM0YjQuNC90YHRgtCy0L4g0YPQtdC30LTQvtCyIFhWSUkg0LIuINGBINC60LDRgNGC0Ysg0LjRgdGH0LXQt9Cw0Y7RgiDQsiDQvdCw0YfQsNC70LUgWFZJSUkg0LIuLCDQutC+0LPQtNCwINC90LAg0YHQvNC10L3RgyDRg9C10LfQtNCw0Lwg0LrQsNC6INC+0YHQvdC+0LLQvdC+0Lkg0LXQtNC40L3QuNGG0LUg0LDQtNC80LjQvdC40YHRgtGA0LDRgtC40LLQvdC+0LPQviDQtNC10LvQtdC90LjRjyDQv9GA0LjRhdC+0LTRj9GCINCz0YPQsdC10YDQvdC40LguINCf0L7Rj9Cy0LvQtdC90LjQtSDQvdCwINC60LDRgNGC0LUg0L3QvtCy0YvRhSDQs9C+0YDQvtC00L7QsiDRgdC40L3RhdGA0L7QvdC90L4g0L/QvtGP0LLQu9C10L3QuNGOINGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LXQs9C+INCw0LTQvNC40L3QuNGB0YLRgNCw0YLQuNCy0L3QvtCz0L4g0L7QutGA0YPQs9CwINC90LAgwqvQstC10YDRhdC90LXQvCDRg9GA0L7QstC90LXCuyDQsNC00LzQuNC90LjRgdGC0YDQsNGC0LjQstC90L7QuSDRgdC10YLQutC4LlxuPC9QPlxuPFAgQUxJR049SlVTVElGWSBTVFlMRT1cIm1hcmdpbi1ib3R0b206IDAuMTdpblwiPlxu0JXRidC1INC+0LTQuNC9INGB0LvQvtC5LCDQtNC+0LHQsNCy0LvQtdC90L3Ri9C5INC90LAg0LrQsNGA0YLRgywg0LIg0L/QvtC70L3QvtC8INGB0LzRi9GB0LvQtSDRjdC60YHQv9C10YDQuNC80LXQvdGC0LDQu9GM0L3Ri9C5LiDQntC9INC/0YDQuNC30LLQsNC9INC+0YXQsNGA0LDQutGC0LXRgNC40LfQvtCy0LDRgtGMINC60L7QvdC60YDQtdGC0L3Ri9C5INGD0YfQsNGB0YLQvtC6INCz0YDQsNC90LjRhtGLINC/0L4g0YHRgtC10L/QtdC90Lgg0YPRgdC70L7QstC90L7RgdGC0LguINCU0LvRjyDRjdGC0L7Qs9C+INGB0LXQudGH0LDRgSDQuNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8g0YLRgNC4INGC0LjQv9CwINC70LjQvdC40LkuINCd0LDQuNCx0L7Qu9C10LUg0L7Qv9GA0LXQtNC10LvQtdC90L3QviDRg9GH0LDRgdGC0LrQuCDQs9GA0LDQvdC40YYg0LvQvtC60LDQu9C40LfRg9GO0YLRgdGPINC/0L4g0LjRgdGC0L7RgNC40YfQtdGB0LrQuNC8INC00L7QutGD0LzQtdC90YLQsNC8LCDQutCw0YDRgtC+0LPRgNCw0YTQuNGH0LXRgdC60LjQvCDQvNCw0YLQtdGA0LjQsNC70LDQvCBYVklJSeKAlFhYSSDQsi4g0LjQu9C4INC90LAg0L7RgdC90L7QstC1INGB0L/QtdGG0LjQsNC70YzQvdGL0YUg0LjRgdGC0L7RgNC40LrQvi3Qs9C10L7Qs9GA0LDRhNC40YfQtdGB0LrQuNGFINC40YHRgdC70LXQtNC+0LLQsNC90LjQuSwg0LrQvtGC0L7RgNGL0LUg0L3QsCDRjdGC0Lgg0LTQvtC60YPQvNC10L3RgtGLINC4INC80LDRgtC10YDQuNCw0LvRiyDQvtC/0LjRgNCw0Y7RgtGB0Y8gKNC/0LXRgNCy0YvQuSDRgtC40L8g0LvQuNC90LjQuSkuINCc0L3QvtC20LXRgdGC0LLQviDQs9GA0LDQvdC40YYg0YHRg9GJ0LXRgdGC0LLQvtCy0LDQu9C+INC90LAg0LzQtdGB0YLQvdC+0YHRgtC4INGF0L7RgtGPINCx0Ysg0L3QsCDRg9GA0L7QstC90LUg0L7QsdGJ0LjRhSDQv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjQuSDRgdC+0LLRgNC10LzQtdC90L3QuNC60L7Qsiwg0L7QtNC90LDQutC+INC/0L4g0YHQvtGB0YLQvtGP0L3QuNGOINC40YHRgtC+0YDQuNGH0LXRgdC60LjRhSDRgdCy0LjQtNC10YLQtdC70YzRgdGC0LIg0L/QvtC60LAg0YfRgtC+INC90LUg0LzQvtCz0YPRgiDQsdGL0YLRjCDQutCw0YDRgtC+0LPRgNCw0YTQuNGA0L7QstCw0L3RiyDQtNC+0YHRgtCw0YLQvtGH0L3QviDQvtC/0YDQtdC00LXQu9C10L3QvdC+ICjQstGC0L7RgNC+0Lkg0YLQuNC/INC70LjQvdC40LkpLiDQndCw0LrQvtC90LXRhiwg0LfQvdCw0YfQuNGC0LXQu9GM0L3QsNGPINGH0LDRgdGC0Ywg0LPRgNCw0L3QuNGGICjQtNC70Y8g0LTQvtC80L7QvdCz0L7Qu9GM0YHQutC+0Lkg0KDRg9GB0Lgg0L/RgNCw0LrRgtC40YfQtdGB0LrQuCDQstGB0LUpINCy0L4g0LLRgdC10YUg0L7RgtC90L7RiNC10L3QuNGP0YUg0LDQsdGB0YLRgNCw0LrRgtC90LAg4oCUINCz0YDQsNC90LjRhtGLINC90LUg0YLQvtC70YzQutC+INC90LUg0LzQvtCz0YPRgiDQsdGL0YLRjCDRgdC60L7Qu9GMLdC90LjQsdGD0LTRjCDQvtC/0YDQtdC00LXQu9C10L3QvdC+INC+0LHQvtC30L3QsNGH0LXQvdGLINCyINC90LDRgdGC0L7Rj9GJ0LXQtSDQstGA0LXQvNGPLCDQvdC+INC4INC90LUg0YHRg9GJ0LXRgdGC0LLQvtCy0LDQu9C4INC90Lgg0LIg0LjRgdGC0L7RgNC40YfQtdGB0LrQvtC5INGA0LXQsNC70YzQvdC+0YHRgtC4LCDQvdC4INCyINC/0YDQtdC00YHRgtCw0LLQu9C10L3QuNGP0YUg0YHQvtCy0YDQtdC80LXQvdC90LjQutC+0LIg4oCUINC90LDRgdC60L7Qu9GM0LrQviDRjdGC0L4g0LzQvtC20L3QviDQv9GA0LXQtNC/0L7Qu9Cw0LPQsNGC0Ywg0LjRgdGF0L7QtNGPINC40Lcg0L3QsNGI0LjRhSDQsNC60YLRg9Cw0LvRjNC90YvRhSDQv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjQuSDQviDQv9GA0L7RiNC70L7QvC5cbjwvUD5cbjxQIEFMSUdOPUpVU1RJRlkgU1RZTEU9XCJtYXJnaW4tYm90dG9tOiAwLjE3aW5cIj5cbtCSINC/0YDQsNCy0L7QvCDQstC10YDRhdC90LXQvCDRg9Cz0LvRgyDQutCw0YDRgtGLINC00L7RgdGC0YPQv9C90Ysg0YLRgNC4INC40LrQvtC90LrQuC3QutC90L7Qv9C60LguINCf0LXRgNCy0LDRjyDQv9C+0LfQstC+0LvRj9C10YIg0L7RgtC60LvRjtGH0LjRgtGMINGB0L7QstGA0LXQvNC10L3QvdGD0Y4g0LrQsNGA0YLQvtCz0YDQsNGE0LjRh9C10YHQutGD0Y4g0L/QvtC00LvQvtC20LrRgywg0LTQstC1INC00YDRg9Cz0LjQtSDQv9C+0LfQstC+0LvRj9GO0YIg0YPQv9GA0LDQstC70Y/RgtGMINC+0YLQvtCx0YDQsNC20LXQvdC40LXQvCDQtNCy0YPRhSDQuNC90YTQvtGA0LzQsNGG0LjQvtC90L3Ri9GFINCx0LvQvtC60L7QsiDQutCw0YDRgtGLLiDQkiDQv9C10YDQstC+0Lwg0LjQtyDQvdC40YUg0L7RgtC+0LHRgNCw0LbQsNC10YLRgdGPINC40LzRjyDQv9GA0LDQstC40YLQtdC70Y8g0L3QsCDQuNC30LHRgNCw0L3QvdGL0Lkg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C10Lwg0LPQvtC0LCDQtdCz0L4g0YLQuNGC0YPQuyDQuNC70Lgg0LTQvtC70LbQvdC+0YHRgtGMLCDQs9C+0LTRiyDQvdCw0YXQvtC20LTQtdC90LjRjyDRgyDQstC70LDRgdGC0Lgg0YEg0L7RgtGB0YvQu9C60L7QuSDQvdCwINC+0YLQtNC10LvRjNC90YPRjiDRgdGC0YDQsNC90LjRhtGDINGB0LDQudGC0LAg0YEg0LHQvtC70LXQtSDQv9C+0LTRgNC+0LHQvdGL0LzQuCDRgdCy0LXQtNC10L3QuNGP0LzQuC4g0JIg0L3QuNC20L3QtdC8INCx0LvQvtC60LUg0YPQutCw0LfQsNC90Ysg0LjQvNC10LLRiNC40LUg0LzQtdGB0YLQviDQsiDQtNCw0L3QvdC+0Lwg0LPQvtC00YMg0YLQtdGA0YDQuNGC0L7RgNC40LDQu9GM0L3Ri9C1INC40LfQvNC10L3QtdC90LjRjyDQuCDQv9GA0LjQstC10LTQtdC90LAg0L/RgNC40LHQu9C40LfQuNGC0LXQu9GM0L3QsNGPINC/0LvQvtGJ0LDQtNGMINGD0YfQsNGB0YLQutC+0LIsINC60L7RgtC+0YDRi9C1INC00L7QsdCw0LLQuNC70LjRgdGMINC6INGC0LXRgNGA0LjRgtC+0YDQuNC4INCz0L7RgdGD0LTQsNGA0YHRgtCy0LAg0LgsINC90LDQvtCx0L7RgNC+0YIsINC+0LrQsNC30LDQu9C40YHRjCDRg9GC0YDQsNGH0LXQvdGLLlxuPC9QPlxuPFAgQUxJR049SlVTVElGWSBTVFlMRT1cIm1hcmdpbi1ib3R0b206IDAuMTdpblwiPlxu0J/RgNC4INGB0L7Qt9C00LDQvdC40Lgg0LLQtdCxLdCT0JjQoSDCq9CT0YDQsNC90LjRhtGLINCg0YPRgdC4LCDQoNC+0YHRgdC40LgsINCh0KHQodCgINC4INCg0KQgODUw4oCTMjAxOCDQs9CzLsK7INGA0LXQsNC70LjQt9C+0LLQsNC90LAg0LrQvtC90YbQtdC/0YbQuNGPINC00LjQvdCw0LzQuNGH0LXRgdC60L7QuSDQutCw0YDRgtGLLiDQoSDRgtC+0YfQutC4INC30YDQtdC90LjRjyDRgtC10YXQvdC40YfQtdGB0LrQvtC5INGA0LXQsNC70LjQt9Cw0YbQuNC4INC/0YDQvtC10LrRgtCwINGN0YLQsCDQutC+0L3RhtC10L/RhtC40Y8g0Y/QstC70Y/QtdGC0YHRjyDQvtGA0LjQs9C40L3QsNC70YzQvdGL0Lwg0YDQtdGI0LXQvdC40LXQvCwg0YDQsNC30YDQsNCx0L7RgtCw0L3QvdGL0LwgPGEgaHJlZj1cImh0dHBzOi8vaGlzdGdlby5ydS9sYWJvcmF0b3J5Lmh0bWxcIiB0YXJnZXQ9XCJfYmxhbmtcIj7Qm9Cw0LHQvtGA0LDRgtC+0YDQuNC10Lkg0LjRgdGC0L7RgNC40YfQtdGB0LrQvtC5INCz0LXQvtC40L3RhNC+0YDQvNCw0YLQuNC60Lg8L2E+INCY0L3RgdGC0LjRgtGD0YLQsCDQstGB0LXQvtCx0YnQtdC5INC40YHRgtC+0YDQuNC4INCg0JDQnSDRgdC+0LLQvNC10YHRgtC90L4g0YEgPGEgaHJlZj1cImh0dHA6Ly9uZXh0Z2lzLnJ1L1wiIHRhcmdldD1cIl9ibGFua1wiPk5leHRHSVM8L2E+LiDQntC/0LjRgdCw0L3QuNC1IDxhIGhyZWY9XCJodHRwOi8vbmV4dGdpcy5ydS9ibG9nL3J1bml2ZXJzL1wiIHRhcmdldD1cIl9ibGFua1wiPtGC0LXRhdC90LjRh9C10YHQutC+0Lkg0YDQtdCw0LvQuNC30LDRhtC40Lg8L2E+INC/0YDQvtC10LrRgtCwLlxuPC9QPlxuPFAgQUxJR049SlVTVElGWSBTVFlMRT1cIm1hcmdpbi1ib3R0b206IDAuMTdpblwiPlxu0J/RgNC40LrQu9Cw0LTQvdC+0LUg0LfQvdCw0YfQtdC90LjQtSDQtNCw0L3QvdC+0LPQviDQv9GA0L7QtdC60YLQsCDQtNC70Y8g0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y8g0LIg0L3QsNGD0YfQvdGL0YUg0YbQtdC70Y/RhSDRj9Cy0LvRj9C10YLRgdGPINC+0YLQu9C40YfQuNGC0LXQu9GM0L3QvtC5INC10LPQviDRh9C10YDRgtC+0LkuINCf0L7QtNC+0LHQvdGL0LUg0LTQuNC90LDQvNC40YfQtdGB0LrQuNC1INC60LDRgNGC0YssINC00LXQvNC+0L3RgdGC0YDQuNGA0YPRjtGJ0LjQtSDQuNC30LzQtdC90LXQvdC40Y8g0LPRgNCw0L3QuNGGINCyINC/0YDQvtGI0LvQvtC8LCDQuNC80LXRjtGCINCyINC+0YHQvdC+0LLQvdC+0LwgwqvQvtCx0YDQsNC30L7QstCw0YLQtdC70YzQvdGL0LnCuyDRg9C60LvQvtC9INC4INC90LUg0L/RgNC10LTQvdCw0LfQvdCw0YfQtdC90Ysg0LTQu9GPINGB0L/QtdGG0LjQsNC70LjRgdGC0L7Qsi3QuNGB0YLQvtGA0LjQutC+0LIuINCd0L4g0L/Rg9Cx0LvQuNC60YPQtdC80LDRjyDQtNC40L3QsNC80LjRh9C10YHQutCw0Y8g0LrQsNGA0YLQsCDQvtGC0LrRgNGL0YLQsCDQtNC70Y8g0L/QvtGB0YLQvtGP0L3QvdC+0Lkg0LrQvtGA0YDQtdC60YLQuNGA0L7QstC60Lgg0Lgg0L/RgNC40LfQstCw0L3QsCDQsiDQtNCw0LvRjNC90LXQudGI0LXQvCDRgdGC0LDRgtGMINC90LXQutC+0Lkg0LrQsNGA0YLQvtCz0YDQsNGE0LjRh9C10YHQutC+0Lkg0L/QvtC00L7RgdC90L7QstC+0Lkg0LTQu9GPINC40YHRgtC+0YDQuNC60LAsINC/0YDQuNC80LXQvdGP0Y7RidC10LPQviDQk9CY0KEt0YLQtdGF0L3QvtC70L7Qs9C40Lgg0LTQu9GPINGA0LXRiNC10L3QuNGPINC60L7QvdC60YDQtdGC0L3Ri9GFINC40YHRgdC70LXQtNC+0LLQsNGC0LXQu9GM0YHQutC40YUg0LfQsNC00LDRhy5cbjwvUD5cbjxQIEFMSUdOPUpVU1RJRlkgU1RZTEU9XCJtYXJnaW4tYm90dG9tOiAwLjE3aW5cIj5cbtCeINC00L7Qv9GD0YnQtdC90LjRj9GFLCDQvtGB0L7QsdC10L3QvdC+0YHRgtGP0YUg0LzQtdGC0L7QtNC40LrQuCDQuCDQvtCz0YDQsNC90LjRh9C10L3QuNGP0YUg0L/RgNC40LzQtdC90Y/QstGI0LXQudGB0Y8g0LzQtdGC0L7QtNC40LrQuCwg0YLQtdGF0L3QuNGH0LXRgdC60LjRhSDQvtGB0L7QsdC10L3QvdC+0YHRgtGP0YUg0L/RgNC+0LXQutGC0LAg0Lgg0L/QtdGA0YHQv9C10LrRgtC40LLQsNGFINC10LPQviDRgNCw0LfQstC40YLQuNGPINGB0LwuIDxhIGhyZWY9XCJodHRwczovL3d3dy5ydW5pdmVycy5ydS9ncmFuaXRzeS1yb3NzaWkvYWJvdXQvYWJvdXRfZGV0YWlsZWQvaW5kZXgucGhwXCIgdGFyZ2V0PVwiX2JsYW5rXCI+0J/QntCU0KDQntCR0J3QldCVIC5cbjwvUD5cbmA7XG4iLCJleHBvcnQgZGVmYXVsdCBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiaW1hZ2VzL25leHRnaXMucG5nXCI7IiwiZXhwb3J0IGRlZmF1bHQgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImltYWdlcy9yZXdpbmRfbmV4dC5zdmdcIjsiLCJleHBvcnQgZGVmYXVsdCBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiaW1hZ2VzL3Jld2luZF9wcmV2aW91cy5zdmdcIjsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCJpbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InO1xuaW1wb3J0IHsgUGFuZWwsIFBhbmVsT3B0aW9ucyB9IGZyb20gJy4vUGFuZWxDb250cm9sJztcbmltcG9ydCAnLi9MZWdlbmRQYW5lbENvbnRyb2wuY3NzJztcbmltcG9ydCB7IExlZ2VuZENvbG9yLCBMZWdlbmRDb2xvckl0ZW0gfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzJztcbmV4cG9ydCBpbnRlcmZhY2UgTGVnZW5kUGFuZWxPcHRpb25zIGV4dGVuZHMgUGFuZWxPcHRpb25zIHtcbiAgY29sb3JzPzogTGVnZW5kQ29sb3I7XG59XG5cbmNvbnN0IE9QVElPTlM6IExlZ2VuZFBhbmVsT3B0aW9ucyA9IHtcbiAgYWRkQ2xhc3M6ICdsZWdlbmQtcGFuZWwnLFxufTtcblxuZXhwb3J0IGNsYXNzIExlZ2VuZFBhbmVsQ29udHJvbCBleHRlbmRzIFBhbmVsIHtcbiAgY29uc3RydWN0b3IocHVibGljIG9wdGlvbnM6IExlZ2VuZFBhbmVsT3B0aW9ucykge1xuICAgIHN1cGVyKHsgLi4uT1BUSU9OUywgLi4ub3B0aW9ucyB9KTtcbiAgICB0aGlzLl9jcmVhdGVMZWdlbmRCb2R5KCk7XG5cbiAgICB0aGlzLl9hZGRFdmVudHNMaXN0ZW5lcigpO1xuICB9XG5cbiAgY3JlYXRlTGVnZW5kQmxvY2soaW50ZXJhY3RpdmUgPSBmYWxzZSk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZWxlbWVudC5jbGFzc05hbWUgPSAncGFuZWwtYm9keV9fbGVnZW5kJztcbiAgICBjb25zdCBjb2xvcnMgPSB0aGlzLm9wdGlvbnMuY29sb3JzO1xuICAgIGlmIChjb2xvcnMpIHtcbiAgICAgIE9iamVjdC52YWx1ZXMoY29sb3JzKS5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICAgIHguZm9yRWFjaCgoYykgPT4ge1xuICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5fY3JlYXRlTGVnZW5kSXRlbShjLCBpbnRlcmFjdGl2ZSkpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlTGVnZW5kQm9keSgpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5jcmVhdGVMZWdlbmRCbG9jaygpO1xuICAgIGNvbnN0IGJ1dHRvbkJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYnV0dG9uQmxvY2suY2xhc3NOYW1lID0gJ3BhbmVsLWJvZHlfX2xlZ2VuZC0tYnV0dG9uJztcbiAgICBidXR0b25CbG9jay5pbm5lckhUTUwgPSBgXG4gICAgPGRpdj48YVxuICAgICAgaHJlZj1cImh0dHBzOi8vd3d3LnJ1bml2ZXJzLnJ1L2dyYW5pdHN5LXJvc3NpaS9jaGFydHMvaW5kZXgucGhwXCJcbiAgICAgIHRhcmdldD0nX2JsYW5rJ1xuICAgICAgY2xhc3M9XCJidG4gcGFuZWwtYnV0dG9uXCI+0JPQoNCQ0KTQmNCaINCY0JfQnNCV0J3QldCd0JjQryDQotCV0KDQoNCY0KLQntCg0JjQmFxuICAgIDwvYT48L2Rpdj5cbiAgICA8ZGl2PjxhXG4gICAgICBocmVmPVwiaHR0cHM6Ly9ydW5pdmVycy5ydS9kb2MvcnVzbGFuZC96ZW1saS1pLWtueWF6aGVzdHZhL1wiXG4gICAgICB0YXJnZXQ9J19ibGFuaydcbiAgICAgIGNsYXNzPVwiYnRuIHBhbmVsLWJ1dHRvblwiPtCh0YXQtdC80LAg0LfQtdC80LXQu9GMINC4INC60L3Rj9C20LXRgdGC0LIgPGRpdiBjbGFzcz1cImxpbmstYnV0dG9uIHN1YnRpdGxlXCI+0YHRgNC10LTQvdC10LLQtdC60L7QstC+0Lkg0KDRg9GB0Lg8L2Rpdj5cbiAgICA8L2E+PC9kaXY+XG4gICAgYDtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGJ1dHRvbkJsb2NrKTtcbiAgICB0aGlzLnVwZGF0ZUJvZHkoZWxlbWVudCk7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVMZWdlbmRJdGVtKGM6IExlZ2VuZENvbG9ySXRlbSwgaW50ZXJhY3RpdmUgPSBmYWxzZSkge1xuICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYmxvY2suY2xhc3NOYW1lID0gJ3BhbmVsLWJvZHlfX2xlZ2VuZC0tYmxvY2snO1xuXG4gICAgY29uc3QgW2lkLCBwYWludCwgdGV4dF0gPSBjO1xuICAgIGNvbnN0IGNvbG9yID0gdHlwZW9mIHBhaW50ID09PSAnc3RyaW5nJyA/IHBhaW50IDogcGFpbnQuY29sb3I7XG4gICAgY29uc3QgdHlwZSA9ICh0eXBlb2YgcGFpbnQgIT09ICdzdHJpbmcnICYmIHBhaW50LnR5cGUpIHx8ICdmaWxsJztcbiAgICBpZiAoaW50ZXJhY3RpdmUpIHtcbiAgICAgIHRoaXMuX2NyZWF0ZUludGVyYWN0aXZlQmxvY2soYmxvY2ssIGlkLCBjb2xvciwgdGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IF9jb2xvciA9IG5ldyBDb2xvcihjb2xvcik7XG5cbiAgICAgIGNvbnN0IGNvbG9yU3ltYm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBjb2xvclN5bWJvbC5jbGFzc05hbWUgPSAncGFuZWwtYm9keV9fbGVnZW5kLS1jb2xvciAnICsgdHlwZTtcbiAgICAgIGNvbG9yU3ltYm9sLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFN0cmluZyhfY29sb3IuZmFkZSgwLjMpKTtcblxuICAgICAgY29sb3JTeW1ib2wuc3R5bGUuYm9yZGVyID0gJzJweCBzb2xpZCAnICsgX2NvbG9yLmRhcmtlbigwLjUpO1xuXG4gICAgICBibG9jay5hcHBlbmRDaGlsZChjb2xvclN5bWJvbCk7XG5cbiAgICAgIGNvbnN0IG5hbWVCbG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgbmFtZUJsb2NrLmNsYXNzTmFtZSA9ICdwYW5lbC1ib2R5X19sZWdlbmQtLW5hbWUnO1xuICAgICAgbmFtZUJsb2NrLmlubmVySFRNTCA9IGAke3RleHR9YDtcbiAgICAgIGJsb2NrLmFwcGVuZENoaWxkKG5hbWVCbG9jayk7XG4gICAgfVxuICAgIHJldHVybiBibG9jaztcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZUludGVyYWN0aXZlQmxvY2soXG4gICAgYmxvY2s6IEhUTUxFbGVtZW50LFxuICAgIGlkOiBudW1iZXIsXG4gICAgY29sb3I6IHN0cmluZyxcbiAgICB0ZXh0OiBzdHJpbmdcbiAgKSB7XG4gICAgY29uc3QgY29sb3JJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgY29sb3JJbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnY29sb3InKTtcbiAgICBjb2xvcklucHV0LmNsYXNzTmFtZSA9ICdlZGl0YWJsZS1sZWdlbmRfX2NvbG9yLWlucHV0JztcbiAgICBjb2xvcklucHV0LnZhbHVlID0gY29sb3I7XG4gICAgYmxvY2suYXBwZW5kQ2hpbGQoY29sb3JJbnB1dCk7XG4gICAgY29uc3QgZ2V0TmFtZSA9ICh2YWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgICByZXR1cm4gYCAtICR7dGV4dH0gKCR7dmFsdWV9KWA7XG4gICAgfTtcblxuICAgIGNvbnN0IG5hbWVCbG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBuYW1lQmxvY2suY2xhc3NOYW1lID0gJ3BhbmVsLWJvZHlfX2xlZ2VuZC0tbmFtZSc7XG4gICAgbmFtZUJsb2NrLmlubmVySFRNTCA9IGdldE5hbWUoY29sb3IpO1xuICAgIGNvbnN0IGFsbENvbG9ycyA9IHRoaXMub3B0aW9ucy5jb2xvcnM7XG4gICAgY29sb3JJbnB1dC5vbmNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGlmIChhbGxDb2xvcnMpIHtcbiAgICAgICAgY29uc3QgY29sb3JzOiBMZWdlbmRDb2xvckl0ZW1bXSA9IFtdO1xuICAgICAgICBPYmplY3QudmFsdWVzKGFsbENvbG9ycykuZm9yRWFjaCgoeCkgPT5cbiAgICAgICAgICB4LmZvckVhY2goKHkpID0+IGNvbG9ycy5wdXNoKHkpKVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBjaGFuZ2VkQ29sb3IgPSBjb2xvcnMuZmluZCgoeCkgPT4geFswXSA9PT0gaWQpO1xuICAgICAgICBpZiAoY2hhbmdlZENvbG9yKSB7XG4gICAgICAgICAgY2hhbmdlZENvbG9yWzFdID0gY29sb3JJbnB1dC52YWx1ZTtcbiAgICAgICAgICBuYW1lQmxvY2suaW5uZXJIVE1MID0gZ2V0TmFtZShjb2xvcklucHV0LnZhbHVlKTtcbiAgICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnY2hhbmdlJywgdGhpcy5vcHRpb25zLmNvbG9ycyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYmxvY2suYXBwZW5kQ2hpbGQobmFtZUJsb2NrKTtcbiAgfVxuXG4gIHByaXZhdGUgX2FkZEV2ZW50c0xpc3RlbmVyKCkge1xuICAgIHRoaXMuZW1pdHRlci5vbignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgdGhpcy5fY3JlYXRlTGVnZW5kQm9keSgpO1xuICAgIH0pO1xuICB9XG59XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCJpbXBvcnQgJy4vUGFuZWxDb250cm9sLmNzcyc7XG5pbXBvcnQgV2ViTWFwIGZyb20gJ0BuZXh0Z2lzL3dlYm1hcCc7XG5pbXBvcnQgRGlhbG9nLCB7IERpYWxvZ0FkYXB0ZXJPcHRpb25zIH0gZnJvbSAnQG5leHRnaXMvZGlhbG9nJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGFuZWxPcHRpb25zIHtcbiAgaGVhZGVyVGV4dD86IHN0cmluZztcbiAgYWRkQ2xhc3M/OiBzdHJpbmc7XG4gIHdlYk1hcD86IFdlYk1hcDtcbn1cblxuZXhwb3J0IGNsYXNzIFBhbmVsIHtcbiAgZW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBpc0hpZGUgPSBmYWxzZTtcbiAgX2Jsb2NrZWQgPSBmYWxzZTtcblxuICBwcm90ZWN0ZWQgd2ViTWFwPzogV2ViTWFwO1xuICBwcm90ZWN0ZWQgX2hlYWRlcj86IEhUTUxFbGVtZW50O1xuICBwcml2YXRlIF9jb250YWluZXI/OiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBfYm9keT86IEhUTUxFbGVtZW50O1xuICBwcml2YXRlIF9kaWFsb2chOiBEaWFsb2c7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIG9wdGlvbnM6IFBhbmVsT3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy53ZWJNYXAgPSB0aGlzLm9wdGlvbnMud2ViTWFwO1xuICAgIHRoaXMuX2NvbnRhaW5lciA9IHRoaXMuX2NyZWF0ZUNvbnRhaW5lcigpO1xuICB9XG5cbiAgZ2V0Q29udGFpbmVyKCk6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fY29udGFpbmVyO1xuICB9XG5cbiAgb25BZGQobWFwOiBXZWJNYXApOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZCB7XG4gICAgdGhpcy53ZWJNYXAgPSBtYXA7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRhaW5lcjtcbiAgfVxuXG4gIG9uUmVtb3ZlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9jb250YWluZXIpIHtcbiAgICAgIGNvbnN0IHBhcmVudE5vZGUgPSB0aGlzLl9jb250YWluZXIucGFyZW50Tm9kZTtcbiAgICAgIGlmIChwYXJlbnROb2RlKSB7XG4gICAgICAgIHBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5fY29udGFpbmVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1cGRhdGVCb2R5KGNvbnRlbnQ6IEhUTUxFbGVtZW50IHwgc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fY2xlYW5Cb2R5KCk7XG4gICAgaWYgKHRoaXMuX2JvZHkpIHtcbiAgICAgIGlmICh0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5fYm9keS5pbm5lckhUTUwgPSBjb250ZW50O1xuICAgICAgfSBlbHNlIGlmIChjb250ZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5fYm9keS5hcHBlbmRDaGlsZChjb250ZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoaWRlKCk6IHZvaWQge1xuICAgIHRoaXMuaXNIaWRlID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5fY29udGFpbmVyKSB7XG4gICAgICB0aGlzLl9jb250YWluZXIuY2xhc3NMaXN0LmFkZCgncGFuZWwtaGlkZScpO1xuICAgIH1cbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgndG9nZ2xlJywgZmFsc2UpO1xuICB9XG5cbiAgc2hvdygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2Jsb2NrZWQpIHtcbiAgICAgIHRoaXMuaXNIaWRlID0gZmFsc2U7XG4gICAgICBpZiAodGhpcy5fY29udGFpbmVyKSB7XG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdwYW5lbC1oaWRlJyk7XG4gICAgICB9XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgndG9nZ2xlJywgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgYmxvY2soKTogdm9pZCB7XG4gICAgdGhpcy5fYmxvY2tlZCA9IHRydWU7XG4gIH1cblxuICB1bkJsb2NrKCk6IHZvaWQge1xuICAgIHRoaXMuX2Jsb2NrZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGNyZWF0ZUNvbnRyb2xCdXR0b24ob25jbGljazogKCkgPT4gdm9pZCwgdGV4dCA9ICfQn9C+0LTRgNC+0LHQvdC10LUnKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBlbGVtZW50LmNsYXNzTmFtZSA9ICdidG4gcGFuZWwtYnV0dG9uJztcbiAgICBlbGVtZW50LmlubmVySFRNTCA9IHRleHQ7XG4gICAgZWxlbWVudC5vbmNsaWNrID0gb25jbGljaztcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIGNyZWF0ZVJlZkJ1dHRvbih1cmw6IHN0cmluZywgdGV4dD86IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5jcmVhdGVDb250cm9sQnV0dG9uKCgpID0+IHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycpLCB0ZXh0KTtcbiAgfVxuXG4gIG9wZW5EaWFsb2cob3B0aW9ucz86IERpYWxvZ0FkYXB0ZXJPcHRpb25zKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9kaWFsb2cpIHtcbiAgICAgIHRoaXMuX2RpYWxvZyA9IG5ldyBEaWFsb2cob3B0aW9ucyk7XG4gICAgfVxuICAgIGNvbnN0IHRlbXBsYXRlID0gb3B0aW9ucyAmJiBvcHRpb25zLnRlbXBsYXRlO1xuICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgY29uc3QgaXNTYW1lID0gdGhpcy5fZGlhbG9nLm9wdGlvbnMudGVtcGxhdGUgPT09IHRlbXBsYXRlO1xuICAgICAgaWYgKCFpc1NhbWUpIHtcbiAgICAgICAgdGhpcy5fZGlhbG9nLnVwZGF0ZUNvbnRlbnQodGVtcGxhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9kaWFsb2cuc2hvdygpO1xuICB9XG5cbiAgY2xvc2VEaWFsb2coKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2RpYWxvZykge1xuICAgICAgdGhpcy5fZGlhbG9nLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY2xlYW5Cb2R5KCkge1xuICAgIGlmICh0aGlzLl9ib2R5KSB7XG4gICAgICB0aGlzLl9ib2R5LmlubmVySFRNTCA9ICcnO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZUNvbnRhaW5lcigpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZWxlbWVudC5jbGFzc05hbWUgPSAnbWFwYm94Z2wtY3RybCBwYW5lbCc7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5hZGRDbGFzcykge1xuICAgICAgdGhpcy5vcHRpb25zLmFkZENsYXNzLnNwbGl0KCcgJykuZm9yRWFjaCgoeCkgPT4gZWxlbWVudC5jbGFzc0xpc3QuYWRkKHgpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0aW9ucy5oZWFkZXJUZXh0KSB7XG4gICAgICAvLyBlbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuX2NyZWF0ZUhlYWRlcigpKTtcbiAgICB9XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9jcmVhdGVCb2R5KCkpO1xuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVIZWFkZXIoKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gJ3BhbmVsLWhlYWRlcic7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5oZWFkZXJUZXh0KSB7XG4gICAgICBlbGVtZW50LmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5oZWFkZXJUZXh0O1xuICAgIH1cblxuICAgIHRoaXMuX2hlYWRlciA9IGVsZW1lbnQ7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVCb2R5KCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlbGVtZW50LmNsYXNzTmFtZSA9ICdwYW5lbC1ib2R5JztcblxuICAgIHRoaXMuX2JvZHkgPSBlbGVtZW50O1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG59XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCJpbXBvcnQgeyBQYW5lbCwgUGFuZWxPcHRpb25zIH0gZnJvbSAnLi9QYW5lbENvbnRyb2wnO1xuaW1wb3J0ICcuL1BlcmlvZFBhbmVsQ29udHJvbC5jc3MnO1xuaW1wb3J0IHsgZm9ybWF0QXJlYSB9IGZyb20gJy4uLy4uL3V0aWxzL3V0aWxzJztcbmltcG9ydCB7IEFyZWFTdGF0IH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcyc7XG5cbi8qKlxuICogSW5mb3JtYXRpb24gYWJvdXQgdGhlIHJ1bGVyIGluIHRoZSB0aW1lIGludGVydmFsXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUGVyaW9kIHtcbiAgdGVjaF9udW1iZXI6IG51bWJlcjtcbiAgbnVtYmVyOiBudW1iZXI7XG4gIG5hbWU6IHN0cmluZztcbiAgeWVhcnNfbGlmZTogc3RyaW5nO1xuICB5ZWFyc19mcm9tOiBudW1iZXI7XG4gIHllYXJzX3RvPzogbnVtYmVyO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgZGV0YWlsX2xpbms/OiBzdHJpbmc7XG4gIGltZ19saW5rPzogc3RyaW5nO1xufVxuXG5jb25zdCBPUFRJT05TOiBQYW5lbE9wdGlvbnMgPSB7XG4gIGhlYWRlclRleHQ6ICfQn9GA0LDQstC40YLQtdC70LgnLFxuICBhZGRDbGFzczogJ3BlcmlvZC1wYW5lbCcsXG59O1xuXG5leHBvcnQgY2xhc3MgUGVyaW9kUGFuZWxDb250cm9sIGV4dGVuZHMgUGFuZWwge1xuICBwcml2YXRlIHBlcmlvZD86IFBlcmlvZDtcbiAgcHJpdmF0ZSBhcmVhU3RhdD86IEFyZWFTdGF0O1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBQYW5lbE9wdGlvbnMpIHtcbiAgICBzdXBlcihPYmplY3QuYXNzaWduKHt9LCBPUFRJT05TLCBvcHRpb25zKSk7XG4gIH1cblxuICBoaWRlKCk6IHZvaWQge1xuICAgIHN1cGVyLmhpZGUoKTtcbiAgICBpZiAodGhpcy53ZWJNYXApIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMud2ViTWFwLmdldENvbnRhaW5lcigpO1xuICAgICAgaWYgKGNvbnRhaW5lcikge1xuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgncGVyaW9kLXBhbmVsJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2hvdygpOiB2b2lkIHtcbiAgICBzdXBlci5zaG93KCk7XG4gICAgaWYgKCF0aGlzLmlzSGlkZSAmJiB0aGlzLndlYk1hcCkge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy53ZWJNYXAuZ2V0Q29udGFpbmVyKCk7XG4gICAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdwZXJpb2QtcGFuZWwnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1cGRhdGVQZXJpb2QocGVyaW9kOiBQZXJpb2QsIGFyZWFTdGF0PzogQXJlYVN0YXQpOiB2b2lkIHtcbiAgICB0aGlzLmNsb3NlRGlhbG9nKCk7XG4gICAgaWYgKHBlcmlvZCkge1xuICAgICAgY29uc3QgZXhpc3QgPSB0aGlzLnBlcmlvZDtcbiAgICAgIGNvbnN0IGN1cnJlbnRBcmVhID0gdGhpcy5hcmVhU3RhdCAmJiB0aGlzLmFyZWFTdGF0LmFyZWE7XG4gICAgICBjb25zdCBuZXdBcmVhID0gYXJlYVN0YXQgJiYgYXJlYVN0YXQuYXJlYTtcbiAgICAgIGlmIChleGlzdCAhPT0gcGVyaW9kIHx8IGN1cnJlbnRBcmVhICE9PSBuZXdBcmVhKSB7XG4gICAgICAgIHRoaXMudXBkYXRlQm9keSh0aGlzLl9jcmVhdGVQZXJpb2RCb2R5KHBlcmlvZCwgYXJlYVN0YXQpKTtcbiAgICAgICAgdGhpcy5wZXJpb2QgPSBwZXJpb2Q7XG4gICAgICAgIHRoaXMuYXJlYVN0YXQgPSBhcmVhU3RhdDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cGRhdGVCb2R5KFxuICAgICAgICAnPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlfX3BlcmlvZCBlbXB0eVwiPtCSINGN0YLQvtC8INCz0L7QtNGDINC40LfQvNC10L3QtdC90LjQuSDRgtC10YDRgNC40YLQvtGA0LjQuCDQvdC1INCx0YvQu9C+PC9kaXY+J1xuICAgICAgKTtcbiAgICAgIHRoaXMucGVyaW9kID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZVBlcmlvZEJvZHkocGVyaW9kOiBQZXJpb2QsIGFyZWFTdGF0PzogQXJlYVN0YXQpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZWxlbWVudC5jbGFzc05hbWUgPSAncGFuZWwtYm9keV9fcGVyaW9kJztcblxuICAgIC8vIEdvdiBuYW1lXG4gICAgY29uc3QgcGVyaW9kRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgbGV0IGltYWdlSHRtbCA9ICcnO1xuICAgIGlmIChwZXJpb2QuaW1nX2xpbmspIHtcbiAgICAgIGltYWdlSHRtbCA9IGA8ZGl2XG4gICAgICAgIGNsYXNzPVwicGFuZWwtYm9keV9fcGVyaW9kLS1pbWFnZVwiIHN0eWxlPVwiYmFja2dyb3VuZC1pbWFnZTogdXJsKCcke3BlcmlvZC5pbWdfbGlua30nKTtcIj5cbiAgICAgIDwvZGl2PmA7XG4gICAgfVxuXG4gICAgcGVyaW9kRWxlbWVudC5pbm5lckhUTUwgPSBgXG4gICAgICAke2ltYWdlSHRtbCA/IGltYWdlSHRtbCA6ICcnfVxuICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlfX3BlcmlvZC0tbmFtZVwiPiR7cGVyaW9kLm5hbWV9PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keV9fcGVyaW9kLS1wZXJpb2RcIj4ke3BlcmlvZC55ZWFyc19mcm9tfSDigJMgJHtcbiAgICAgIHBlcmlvZC55ZWFyc190b1xuICAgIH0g0LPQsy48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5X19wZXJpb2QtLWRlc2NyaXB0aW9uXCI+JHtwZXJpb2QuZGVzY3JpcHRpb259PC9kaXY+XG4gICAgICAke1xuICAgICAgICBhcmVhU3RhdFxuICAgICAgICAgID8gYFxuICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlfX3BlcmlvZC0tZGVzY3JpcHRpb24gcGFuZWwtYm9keV9fcGVyaW9kLS1hcmVhX3dyYXBcIj5cbiAgICAgICAg0J7QsdGJ0LDRjyDQv9C70L7RidCw0LTRjDogPHNwYW4gY2xhc3M9XCJwYW5lbC1ib2R5X19wZXJpb2QtLWFyZWFcIj5cbiAgICAgICAgICAke2Zvcm1hdEFyZWEoYXJlYVN0YXQuYXJlYSl9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAgYFxuICAgICAgICAgIDogJydcbiAgICAgIH1cbiAgICBgO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQocGVyaW9kRWxlbWVudCk7XG5cbiAgICBjb25zdCBkZXRhaWxMaW5rID1cbiAgICAgIHBlcmlvZC5kZXRhaWxfbGluayAmJiB0aGlzLmNyZWF0ZVJlZkJ1dHRvbihwZXJpb2QuZGV0YWlsX2xpbmspO1xuXG4gICAgaWYgKGRldGFpbExpbmspIHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZGV0YWlsTGluayk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cbn1cbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiIsImltcG9ydCB7IGRlZmluZWQgfSBmcm9tICdAbmV4dGdpcy91dGlscyc7XG5pbXBvcnQgeyBQYW5lbCwgUGFuZWxPcHRpb25zIH0gZnJvbSAnLi9QYW5lbENvbnRyb2wnO1xuaW1wb3J0ICcuL1llYXJzU3RhdFBhbmVsQ29udHJvbC5jc3MnO1xuaW1wb3J0IHsgZm9ybWF0QXJlYSB9IGZyb20gJy4uLy4uL3V0aWxzL3V0aWxzJztcbmltcG9ydCB7IEFyZWFTdGF0IH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcyc7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gWWVhclN0YXQgLSBpbmZvcm1hdGlvbiBhYm91dCBjaGFuZ2VzIGluIHRlcnJpdG9yaWFsIGludGVncml0eVxuICogQHByb3Age251bWJlcn0geWVhclxuICogQHByb3Age251bWJlcn0gdGVycml0b3JpZXNfZ2FpbmVkXG4gKiBAcHJvcCB7bnVtYmVyfSB0ZXJyaXRvcmllc19sb3N0XG4gKiBAcHJvcCB7c3RyaW5nfSBwZXJpb2RcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBZZWFyU3RhdCB7XG4gIC8vIHByZWNpc2lvbjogJzAnIHwgJzEnIHwgJ9CfJyB8ICfQnSc7XG4gIC8vIGNvbW1lbnQ/OiBzdHJpbmc7XG4gIC8vIGZpZDogbnVtYmVyO1xuICAvLyBydWxlcj86IHN0cmluZztcbiAgLy8gZGF0ZV9mcm9tOiBzdHJpbmc7XG4gIC8vIGRhdGVfdG8/OiBzdHJpbmc7XG4gIC8vIHJlYXNvbj86IHN0cmluZztcbiAgeWVhcjogbnVtYmVyO1xuICBkZXNjcmlwdGlvbl9zaG9ydD86IHN0cmluZztcbiAgZGVzY3JpcHRpb25fbG9uZz86IHN0cmluZztcbiAgbnVtYj86IG51bWJlcjtcbiAgY291bnQ/OiBudW1iZXI7XG59XG5cbmNvbnN0IE9QVElPTlM6IFBhbmVsT3B0aW9ucyA9IHtcbiAgaGVhZGVyVGV4dDogJ9CY0LfQvNC10L3QtdC90LjRjyDQsiDRgtC10YDRgNC40YLQvtGA0LjQsNC70YzQvdC+0Lwg0YHQvtGB0YLQsNCy0LUnLFxuICBhZGRDbGFzczogJ3N0YXQtcGFuZWwnLFxufTtcblxuZXhwb3J0IGNsYXNzIFllYXJzU3RhdFBhbmVsQ29udHJvbCBleHRlbmRzIFBhbmVsIHtcbiAgeWVhclN0YXQ/OiBZZWFyU3RhdDtcbiAgeWVhclN0YXRzPzogWWVhclN0YXRbXTtcbiAgYXJlYVN0YXQ/OiBBcmVhU3RhdDtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zPzogUGFuZWxPcHRpb25zKSB7XG4gICAgc3VwZXIoeyAuLi5PUFRJT05TLCAuLi5vcHRpb25zIH0pO1xuICB9XG5cbiAgaGlkZSgpOiB2b2lkIHtcbiAgICBzdXBlci5oaWRlKCk7XG4gICAgaWYgKHRoaXMud2ViTWFwKSB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLndlYk1hcC5nZXRDb250YWluZXIoKTtcbiAgICAgIGlmIChjb250YWluZXIpIHtcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3llYXJzLXBhbmVsJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2hvdygpOiB2b2lkIHtcbiAgICBzdXBlci5zaG93KCk7XG4gICAgaWYgKCF0aGlzLmlzSGlkZSAmJiB0aGlzLndlYk1hcCkge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy53ZWJNYXAuZ2V0Q29udGFpbmVyKCk7XG4gICAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd5ZWFycy1wYW5lbCcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVllYXJTdGF0cyh5ZWFyU3RhdHM6IFllYXJTdGF0W10sIGFyZWFTdGF0PzogQXJlYVN0YXQpOiB2b2lkIHtcbiAgICB0aGlzLnllYXJTdGF0cyA9IHllYXJTdGF0cztcbiAgICB0aGlzLmFyZWFTdGF0ID0gYXJlYVN0YXQ7XG4gICAgdGhpcy51cGRhdGVZZWFyU3RhdCh0aGlzLnllYXJTdGF0c1swXSk7XG4gIH1cblxuICB1cGRhdGVZZWFyU3RhdCh5ZWFyU3RhdDogWWVhclN0YXQpOiB2b2lkIHtcbiAgICBjb25zdCBleGlzdCA9IHRoaXMueWVhclN0YXQ7XG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5nZXRDb250YWluZXIoKTtcbiAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICBjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnZ2FpbicpO1xuICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2xvc3QnKTtcbiAgICB9XG4gICAgaWYgKHllYXJTdGF0KSB7XG4gICAgICBpZiAoZXhpc3QgIT09IHllYXJTdGF0KSB7XG4gICAgICAgIC8vIHRoaXMuc2hvdygpO1xuICAgICAgICB0aGlzLnllYXJTdGF0ID0geWVhclN0YXQ7XG4gICAgICAgIHRoaXMudXBkYXRlQm9keSh0aGlzLl9jcmVhdGVQZXJpb2RCb2R5KHllYXJTdGF0KSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHRoaXMuaGlkZSgpO1xuICAgICAgdGhpcy51cGRhdGVCb2R5KFxuICAgICAgICAnPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlfX3BlcmlvZCBlbXB0eVwiPtCSINGN0YLQvtC8INCz0L7QtNGDINC40LfQvNC10L3QtdC90LjQuSDRgtC10YDRgNC40YLQvtGA0LjQuCDQvdC1INCx0YvQu9C+PC9kaXY+J1xuICAgICAgKTtcbiAgICAgIHRoaXMueWVhclN0YXQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCd1cGRhdGUnLCB7IHllYXJTdGF0OiB0aGlzLnllYXJTdGF0IH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlUGVyaW9kQm9keSh5ZWFyU3RhdDogWWVhclN0YXQpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZWxlbWVudC5jbGFzc05hbWUgPSAncGFuZWwtYm9keV9feWVhcnN0YXQnO1xuXG4gICAgY29uc3QgeWVhckJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgeWVhckJsb2NrLmNsYXNzTmFtZSA9ICdwYW5lbC1ib2R5X19wZXJpb2QtLXllYXInO1xuICAgIHllYXJCbG9jay5pbm5lckhUTUwgPSBgJHt5ZWFyU3RhdC55ZWFyfSDQsy5gO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoeWVhckJsb2NrKTtcblxuICAgIGlmICh0aGlzLmFyZWFTdGF0KSB7XG4gICAgICBjb25zdCBnYWluID0gdGhpcy5hcmVhU3RhdC5wbHVzO1xuICAgICAgaWYgKGdhaW4pIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9jcmVhdGVHYWluQmxvY2soZ2FpbikpO1xuICAgICAgfVxuICAgICAgY29uc3QgbG9zdCA9IHRoaXMuYXJlYVN0YXQubWludXM7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmdldENvbnRhaW5lcigpO1xuICAgICAgaWYgKGxvc3QpIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9jcmVhdGVHYWluQmxvY2sobG9zdCwgdHJ1ZSkpO1xuICAgICAgfVxuICAgICAgaWYgKGNvbnRhaW5lcikge1xuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChsb3N0ID8gJ2xvc3QnIDogJ2dhaW4nKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy55ZWFyU3RhdHMgJiYgdGhpcy55ZWFyU3RhdHMubGVuZ3RoID4gMSkge1xuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9jcmVhdGVTdGF0ZVN3aXRjaGVyKCkpO1xuICAgIH1cblxuICAgIGNvbnN0IGRlc2NyQmxvY2sgPSB0aGlzLl9jcmVhdGVEZXNjcmlwdGlvbkJsb2NrKHllYXJTdGF0KTtcbiAgICBpZiAoZGVzY3JCbG9jaykge1xuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChkZXNjckJsb2NrKTtcbiAgICB9XG4gICAgY29uc3QgZGVzY3JMb25nID0geWVhclN0YXQuZGVzY3JpcHRpb25fbG9uZztcbiAgICBpZiAoZGVzY3JMb25nKSB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGVtcGxhdGUuY2xhc3NOYW1lID0gJ3BhbmVsLWJvZHlfX3BlcmlvZC0tZGVzY3JpcHRpb24nO1xuICAgICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gYCR7ZGVzY3JMb25nfWA7XG5cbiAgICAgIGNvbnN0IGJ1dHRvbldyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgYnV0dG9uV3JhcC5jbGFzc05hbWUgPSAnYnV0dG9uLXdyYXAnO1xuICAgICAgYnV0dG9uV3JhcC5hcHBlbmRDaGlsZChcbiAgICAgICAgdGhpcy5jcmVhdGVDb250cm9sQnV0dG9uKCgpID0+IHRoaXMub3BlbkRpYWxvZyh7IHRlbXBsYXRlIH0pKVxuICAgICAgKTtcblxuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChidXR0b25XcmFwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZVN0YXRlU3dpdGNoZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IHNsaWRlckJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgc2xpZGVyQmxvY2suY2xhc3NOYW1lID0gJ3BhbmVsLWJvZHlfX3BlcmlvZC0tc2xpZGVyJztcbiAgICBjb25zdCB5ZWFyU3RhdHMgPSB0aGlzLnllYXJTdGF0cztcbiAgICBjb25zdCB5ZWFyU3RhdCA9IHRoaXMueWVhclN0YXQ7XG5cbiAgICBpZiAoeWVhclN0YXQgJiYgeWVhclN0YXRzKSB7XG4gICAgICBjb25zdCBudW1iID0geWVhclN0YXQubnVtYjtcbiAgICAgIGNvbnN0IGNvdW50ID0gZGVmaW5lZCh5ZWFyU3RhdC5jb3VudCkgPyB5ZWFyU3RhdC5jb3VudCA6IHllYXJTdGF0cy5sZW5ndGg7XG4gICAgICBpZiAoY291bnQgJiYgbnVtYiAmJiBjb3VudCA+IDEgJiYgY291bnQgPj0gbnVtYikge1xuICAgICAgICBjb25zdCBpbmRleCA9IHllYXJTdGF0cy5pbmRleE9mKHllYXJTdGF0KTtcbiAgICAgICAgY29uc3QgaXNGaXJzdCA9IGluZGV4ID09PSAwO1xuICAgICAgICBjb25zdCBsZW5ndGggPSB5ZWFyU3RhdHMubGVuZ3RoO1xuICAgICAgICBjb25zdCBpc0xhc3QgPSBpbmRleCA9PT0gbGVuZ3RoIC0gMTtcblxuICAgICAgICBjb25zdCBjcmVhdGVEaXJlY3Rpb25GbG93ID0gKFxuICAgICAgICAgIHByZXZpb3VzPzogYm9vbGVhbixcbiAgICAgICAgICBpc0FjdGl2ZT86IGJvb2xlYW5cbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgY29uc3QgZmxvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgICBmbG93LnNldEF0dHJpYnV0ZSgnaHJlZicsICcjJyk7XG4gICAgICAgICAgLy8gZmxvdy5jbGFzc05hbWUgPSAnJyArXG4gICAgICAgICAgLy8gICAocHJldmlvdXMgPyAnYmFjaycgOiAnZm9yd2FyZCcpICtcbiAgICAgICAgICAvLyAgIChpc0FjdGl2ZSA/ICcnIDogJyBoaWRlbicpO1xuICAgICAgICAgIGZsb3cuY2xhc3NOYW1lID1cbiAgICAgICAgICAgIChwcmV2aW91cyA/IGBwYW5lbF9zbGlkZXIgcHJldmAgOiBgcGFuZWxfc2xpZGVyIG5leHRgKSArXG4gICAgICAgICAgICAoaXNBY3RpdmUgPyAnJyA6ICcgaGlkZGVuJyk7XG4gICAgICAgICAgaWYgKGlzQWN0aXZlKSB7XG4gICAgICAgICAgICBmbG93Lm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIGNvbnN0IGRpcmVjdFN0YXQgPSB5ZWFyU3RhdHNbcHJldmlvdXMgPyBpbmRleCAtIDEgOiBpbmRleCArIDFdO1xuICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVllYXJTdGF0KGRpcmVjdFN0YXQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZsb3c7XG4gICAgICAgIH07XG5cbiAgICAgICAgc2xpZGVyQmxvY2suYXBwZW5kQ2hpbGQoY3JlYXRlRGlyZWN0aW9uRmxvdyh0cnVlLCAhaXNGaXJzdCkpO1xuXG4gICAgICAgIGNvbnN0IGZsb3dDb3VudGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGZsb3dDb3VudGVyLmNsYXNzTmFtZSA9ICdwYW5lbF9zbGlkZXItY291bnRlcic7XG5cbiAgICAgICAgZmxvd0NvdW50ZXIuaW5uZXJIVE1MID0gYCR7bnVtYn0g0LjQtyAke2NvdW50fWA7XG4gICAgICAgIHNsaWRlckJsb2NrLmFwcGVuZENoaWxkKGZsb3dDb3VudGVyKTtcbiAgICAgICAgc2xpZGVyQmxvY2suYXBwZW5kQ2hpbGQoY3JlYXRlRGlyZWN0aW9uRmxvdyhmYWxzZSwgIWlzTGFzdCkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc2xpZGVyQmxvY2s7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVEZXNjcmlwdGlvbkJsb2NrKHllYXJTdGF0OiBZZWFyU3RhdCk6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaWYgKHllYXJTdGF0LmRlc2NyaXB0aW9uX3Nob3J0KSB7XG4gICAgICBlbGVtZW50LmlubmVySFRNTCA9IGA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keV9fcGVyaW9kLS1kZXNjcmlwdGlvblwiPiR7eWVhclN0YXQuZGVzY3JpcHRpb25fc2hvcnR9PC9kaXY+YDtcbiAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZUdhaW5CbG9jayhjb3VudDogbnVtYmVyLCBpc0xvc3Q/OiBib29sZWFuKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsZW1lbnQuY2xhc3NOYW1lID1cbiAgICAgICdwYW5lbC1ib2R5X195ZWFyc3RhdC0tZ2FpbiAnICsgKGlzTG9zdCA/ICdsb3N0JyA6ICdnYWluZWQnKTtcbiAgICBlbGVtZW50LmlubmVySFRNTCA9IChpc0xvc3QgPyAnLScgOiAnKycpICsgZm9ybWF0QXJlYShjb3VudCk7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cbn1cbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiIsImltcG9ydCAnLi9TbGlkZXJDb250cm9sLmNzcyc7XG5pbXBvcnQgJ25vdWlzbGlkZXIvZGlzdHJpYnV0ZS9ub3Vpc2xpZGVyLmNzcyc7XG5cbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgV2ViTWFwIGZyb20gJ0BuZXh0Z2lzL3dlYm1hcCc7XG5cbmltcG9ydCBub1VpU2xpZGVyLCB7IFBpcHNPcHRpb25zIH0gZnJvbSAnbm91aXNsaWRlcic7XG4vLyBAdHMtaWdub3JlXG5pbXBvcnQgd051bWIgZnJvbSAnd251bWInO1xuXG5pbXBvcnQgJy4vTGlua3MvaW1nL3Jld2luZF9uZXh0LnN2Zyc7XG5pbXBvcnQgJy4vTGlua3MvaW1nL3Jld2luZF9wcmV2aW91cy5zdmcnO1xuXG50eXBlIFNsaWRlclZhbHVlID0gbnVtYmVyIHwgQXJyYXk8bnVtYmVyIHwgbnVsbD47XG5cbmludGVyZmFjZSBMYWJlbElucHV0RWxlbWVudE9wdGlvbnMge1xuICBsYWJlbDogSFRNTERpdkVsZW1lbnQgfCBIVE1MTGFiZWxFbGVtZW50O1xuICBpbnB1dDogSFRNTElucHV0RWxlbWVudDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTbGlkZXJPcHRpb25zIHtcbiAgdHlwZTogc3RyaW5nO1xuICBtaW46IG51bWJlcjtcbiAgbWF4OiBudW1iZXI7XG4gIHN0ZXA6IG51bWJlcjtcbiAgYW5pbWF0aW9uU3RlcDogbnVtYmVyO1xuICB2YWx1ZTogbnVtYmVyO1xuICBhbmltYXRpb25EZWxheTogbnVtYmVyO1xuICBwbGF5ZXJDb250cm9sPzogYm9vbGVhbjtcbiAgcGlwcz86IFBpcHNPcHRpb25zO1xuXG4gIHN0ZXBSZWFkeT8oXG4gICAgbmV4dFZhbHVlOiBudW1iZXIsXG4gICAgY2FsbGJhY2s6ICh2YWx1ZTogbnVtYmVyKSA9PiB2b2lkLFxuICAgIHByZXZpb3VzPzogYm9vbGVhblxuICApOiB2b2lkO1xuICBmaWx0ZXJQaXBzPyh2YWx1ZTogYW55LCB0eXBlOiBudW1iZXIpOiAtMSB8IDAgfCAxIHwgMjsgLy8gLTEgKG5vIHBpcCBhdCBhbGwpIDAgKG5vIHZhbHVlKSAxIChsYXJnZSB2YWx1ZSkgMiAoc21hbGwgdmFsdWUpXG59XG5cbmNvbnN0IE9QVElPTlM6IFNsaWRlck9wdGlvbnMgPSB7XG4gIHR5cGU6ICdyYW5nZScsXG4gIG1pbjogMCxcbiAgbWF4OiAxMDAsXG4gIHN0ZXA6IDEsXG4gIGFuaW1hdGlvblN0ZXA6IDEsXG4gIHZhbHVlOiA1MCxcbiAgYW5pbWF0aW9uRGVsYXk6IDEwMCxcbiAgZmlsdGVyUGlwczogKHZhbHVlLCBwaXB0eXBlKSA9PiB7XG4gICAgcmV0dXJuIHBpcHR5cGUgPT09IDEgPyAxIDogdmFsdWUgJSAxMDAgPyAodmFsdWUgJSAxMCA/IC0xIDogMCkgOiAxO1xuICB9LFxufTtcblxuZXhwb3J0IGNsYXNzIFNsaWRlckNvbnRyb2wge1xuICBlbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBtYXA/OiBXZWJNYXA7XG5cbiAgX2FuaW1hdGlvblN0ZXBJbnB1dD86IEhUTUxJbnB1dEVsZW1lbnQ7XG4gIF9zbGlkZXJDb250YWluZXI/OiBIVE1MRWxlbWVudDtcbiAgX3NsaWRlcj86IG5vVWlTbGlkZXIubm9VaVNsaWRlcjtcbiAgcHJvdGVjdGVkIF9wbGF5ZXJDb250cm9sPzogSFRNTEVsZW1lbnQ7XG4gIHByb3RlY3RlZCBfcGxheWVyQ29udHJvbFByZXZCdG4/OiBIVE1MRWxlbWVudDtcbiAgcHJvdGVjdGVkIF9wbGF5ZXJDb250cm9sTmV4dEJ0bj86IEhUTUxFbGVtZW50O1xuICBwcml2YXRlIF9jb250YWluZXI/OiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBfaW5wdXQ/OiBIVE1MSW5wdXRFbGVtZW50O1xuICBwcml2YXRlIF9hbmltYXRpb25TdGF0dXM/OiBib29sZWFuO1xuICAvLyBwcml2YXRlIF9uZXh0U3RlcFRpbWVvdXRJZDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBvcHRpb25zOiBTbGlkZXJPcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgT1BUSU9OUywgb3B0aW9ucyk7XG4gICAgdGhpcy5vcHRpb25zLmFuaW1hdGlvblN0ZXAgPVxuICAgICAgdGhpcy5vcHRpb25zLmFuaW1hdGlvblN0ZXAgfHwgdGhpcy5vcHRpb25zLnN0ZXA7XG4gIH1cblxuICBvbkFkZChtYXA6IFdlYk1hcCk6IEhUTUxFbGVtZW50IHtcbiAgICB0aGlzLm1hcCA9IG1hcDtcbiAgICB0aGlzLl9jb250YWluZXIgPSB0aGlzLl9jcmVhdGVDb250YWluZXIoKTtcbiAgICByZXR1cm4gdGhpcy5fY29udGFpbmVyO1xuICB9XG5cbiAgb25SZW1vdmUoKTogdm9pZCB7XG4gICAgLy8gaWdub3JlXG4gIH1cblxuICBfY3JlYXRlQ29udGFpbmVyKCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZWxlbWVudC5jbGFzc05hbWUgPSAnbWFwYm94Z2wtY3RybCBzbGlkZXItY29udHJvbCc7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9jcmVhdGVTbGlkZXJDb250YWluZXIoKSk7XG5cbiAgICBjb25zdCBwbGF5ZXJDb250cm9sID1cbiAgICAgIHRoaXMub3B0aW9ucy5wbGF5ZXJDb250cm9sICE9PSB1bmRlZmluZWRcbiAgICAgICAgPyB0aGlzLm9wdGlvbnMucGxheWVyQ29udHJvbFxuICAgICAgICA6IHRydWU7XG4gICAgaWYgKHBsYXllckNvbnRyb2wpIHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5fY3JlYXRlTmF2aWdhdGlvbkNvbnRhaW5lcigpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIF9jcmVhdGVWYWx1ZUlucHV0KCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBpbnB1dE9iaiA9IHRoaXMuX2NyZWF0ZUxhYmVsZWRJbnB1dCh7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIC8vIGxhYmVsOiAndmFsdWUnLFxuICAgICAgdmFsdWU6IHRoaXMub3B0aW9ucy52YWx1ZSxcbiAgICB9KTtcbiAgICBjb25zdCBpbnB1dCA9IGlucHV0T2JqLmlucHV0O1xuICAgIGlucHV0Lm9uY2hhbmdlID0gKCkgPT4ge1xuICAgICAgdGhpcy5fb25DaGFuZ2UodGhpcy5fZ2V0QWxsb3dlZFZhbHVlKE51bWJlcihpbnB1dC52YWx1ZSkpKTtcbiAgICB9O1xuICAgIHRoaXMuX2lucHV0ID0gaW5wdXQ7XG4gICAgcmV0dXJuIGlucHV0T2JqLmxhYmVsO1xuICB9XG5cbiAgX2NyZWF0ZUFuaW1hdGlvblN0ZXBJbnB1dCgpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgaW5wdXRPYmogPSB0aGlzLl9jcmVhdGVMYWJlbGVkSW5wdXQoe1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBsYWJlbDogJ2FuaW1hdGlvbiBzdGVwJyxcbiAgICAgIHZhbHVlOiB0aGlzLm9wdGlvbnMuYW5pbWF0aW9uU3RlcCxcbiAgICB9KTtcbiAgICBjb25zdCBpbnB1dCA9IGlucHV0T2JqLmlucHV0O1xuICAgIGNvbnN0IG9wdCA9IHRoaXMub3B0aW9ucztcblxuICAgIGlucHV0Lm9uY2hhbmdlID0gKCkgPT4ge1xuICAgICAgbGV0IHZhbCA9IE51bWJlcihpbnB1dC52YWx1ZSk7XG4gICAgICB2YWwgPSB2YWwgPD0gMCA/IG9wdC5hbmltYXRpb25TdGVwIDogdmFsID4gb3B0Lm1heCA/IG9wdC5tYXggOiB2YWw7XG4gICAgICBpbnB1dC52YWx1ZSA9IFN0cmluZyh2YWwpO1xuICAgICAgb3B0LmFuaW1hdGlvblN0ZXAgPSB2YWw7XG4gICAgfTtcbiAgICB0aGlzLl9hbmltYXRpb25TdGVwSW5wdXQgPSBpbnB1dDtcbiAgICByZXR1cm4gaW5wdXRPYmoubGFiZWw7XG4gIH1cblxuICBfY3JlYXRlQW5pbWF0aW9uRGVsYXlJbnB1dCgpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgaW5wdXRPYmogPSB0aGlzLl9jcmVhdGVMYWJlbGVkSW5wdXQoe1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBsYWJlbDogJ2FtaW1hdGlvbiBkZWxheScsXG4gICAgICB2YWx1ZTogdGhpcy5vcHRpb25zLmFuaW1hdGlvbkRlbGF5LFxuICAgIH0pO1xuICAgIGNvbnN0IGlucHV0ID0gaW5wdXRPYmouaW5wdXQ7XG4gICAgaW5wdXQub25jaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBsZXQgdmFsdWUgPSBOdW1iZXIoaW5wdXQudmFsdWUpO1xuICAgICAgdmFsdWUgPSB2YWx1ZSA8PSAwID8gMSA6IHZhbHVlO1xuICAgICAgdGhpcy5vcHRpb25zLmFuaW1hdGlvbkRlbGF5ID0gdmFsdWU7XG4gICAgfTtcbiAgICByZXR1cm4gaW5wdXRPYmoubGFiZWw7XG4gIH1cblxuICBfY3JlYXRlU2xpZGVyQ29udGFpbmVyKCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHNwYW4uY2xhc3NOYW1lID0gJ3NsaWRlci1jb250cm9sLXJhbmdlJztcbiAgICBjb25zdCByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHNwYW4uYXBwZW5kQ2hpbGQocmFuZ2UpO1xuICAgIC8vIHJhbmdlLmNsYXNzTmFtZSA9ICdzbGlkZXItY29udHJvbC1yYW5nZSc7XG4gICAgLy8gc2V0IGlucHV0IGF0dHJpYnV0ZXNcbiAgICAvLyBjb25zdCBhbGxvd2VkID0gWydtaW4nLCAnbWF4JywgJ3ZhbHVlJywgJ3N0ZXAnLCAndHlwZSddO1xuICAgIC8vIGZvciAobGV0IGZyeSA9IDA7IGZyeSA8IGFsbG93ZWQubGVuZ3RoOyBmcnkrKykge1xuICAgIC8vICAgY29uc3Qgb3B0aW9uID0gdGhpcy5vcHRpb25zW2FsbG93ZWRbZnJ5XV07XG4gICAgLy8gICBpZiAob3B0aW9uKSB7XG4gICAgLy8gICAgIHJhbmdlLnNldEF0dHJpYnV0ZShhbGxvd2VkW2ZyeV0sIG9wdGlvbik7XG4gICAgLy8gICB9XG4gICAgLy8gfVxuXG4gICAgY29uc3QgeyBtaW4sIG1heCwgc3RlcCB9ID0gdGhpcy5vcHRpb25zO1xuICAgIGNvbnN0IHNsaWRlciA9IG5vVWlTbGlkZXIuY3JlYXRlKHJhbmdlLCB7XG4gICAgICByYW5nZToge1xuICAgICAgICBtaW4sXG4gICAgICAgIG1heCxcbiAgICAgIH0sXG4gICAgICBzdGVwLFxuICAgICAgdG9vbHRpcHM6IFt3TnVtYih7IGRlY2ltYWxzOiAwIH0pXSxcbiAgICAgIHN0YXJ0OiBbdGhpcy5vcHRpb25zLnZhbHVlXSxcbiAgICAgIHBpcHM6XG4gICAgICAgIHRoaXMub3B0aW9ucy5waXBzICE9PSB1bmRlZmluZWRcbiAgICAgICAgICA/IHRoaXMub3B0aW9ucy5waXBzXG4gICAgICAgICAgOiB7XG4gICAgICAgICAgICAgIG1vZGU6ICdzdGVwcycsXG4gICAgICAgICAgICAgIGRlbnNpdHk6IDMsXG4gICAgICAgICAgICAgIGZpbHRlcjogdGhpcy5vcHRpb25zLmZpbHRlclBpcHMsXG4gICAgICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgc2xpZGVyLm9uKCdjaGFuZ2UnLCAodmFsdWVzLCBoYW5kbGUpID0+IHtcbiAgICAgIHRoaXMuX29uU2xpZGVyQ2xpY2socGFyc2VJbnQodmFsdWVzWzBdLCAxMCkpO1xuICAgIH0pO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBzbGlkZXJFbGVtZW50ID0gc2xpZGVyLnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICBzbGlkZXJFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnY2xpY2snLFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLnN0b3BBbmltYXRpb24oKTtcbiAgICAgIH0sXG4gICAgICB0cnVlXG4gICAgKTtcblxuICAgIHRoaXMuX3NsaWRlckNvbnRhaW5lciA9IHNwYW47XG4gICAgdGhpcy5fc2xpZGVyID0gc2xpZGVyO1xuICAgIHJldHVybiBzcGFuO1xuICB9XG5cbiAgX2NyZWF0ZVBsYXllckNvbnRhaW5lcigpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgcGxheWVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGxheWVyLmNsYXNzTmFtZSA9ICdzbGlkZXItY29udHJvbC1ibG9jayBzbGlkZXItY29udHJvbC1wbGF5ZXInO1xuICAgIGNvbnN0IHBsYXllckNvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBwbGF5ZXJDb250cm9sLmNsYXNzTmFtZSA9ICdwbGF5ZXItYnV0dG9uJztcbiAgICAvLyBwbGF5ZXJDb250cm9sLmlubmVySFRNTCA9IHRoaXMuX2dldFBsYXllckNvbnRyb2xMYWJlbCgpO1xuICAgIHBsYXllckNvbnRyb2wub25jbGljayA9ICgpID0+IHtcbiAgICAgIHRoaXMuX3RvZ2dsZUFuaW1hdGlvbigpO1xuICAgIH07XG4gICAgcGxheWVyLmFwcGVuZENoaWxkKHBsYXllckNvbnRyb2wpO1xuICAgIHRoaXMuX3BsYXllckNvbnRyb2wgPSBwbGF5ZXJDb250cm9sO1xuICAgIHJldHVybiBwbGF5ZXI7XG4gIH1cblxuICBfY3JlYXRlUGxheWVyQnV0dG9uKCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBwbGF5ZXJDb250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgcGxheWVyQ29udHJvbC5jbGFzc05hbWUgPSAncGxheWVyLWJ1dHRvbic7XG4gICAgLy8gcGxheWVyQ29udHJvbC5pbm5lckhUTUwgPSB0aGlzLl9nZXRQbGF5ZXJDb250cm9sTGFiZWwoKTtcbiAgICBwbGF5ZXJDb250cm9sLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICB0aGlzLl90b2dnbGVBbmltYXRpb24oKTtcbiAgICB9O1xuICAgIHRoaXMuX3BsYXllckNvbnRyb2wgPSBwbGF5ZXJDb250cm9sO1xuICAgIHJldHVybiBwbGF5ZXJDb250cm9sO1xuICB9XG5cbiAgX2NyZWF0ZU5hdmlnYXRpb25Db250YWluZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IHBsYXllclN0ZXBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGxheWVyU3RlcHMuY2xhc3NOYW1lID0gJ3NsaWRlci1jb250cm9sLWJsb2NrIHNsaWRlci1jb250cm9sLXN0ZXBzJztcblxuICAgIGNvbnN0IGNyZWF0ZVN0ZXBCdG4gPSAocHJldmlvdXM/OiBib29sZWFuKSA9PiB7XG4gICAgICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGJ0bi5jbGFzc05hbWUgPSAnc2xpZGVyLWNvbnRyb2wtc3RlcHMtYnRuJzsgLy8gKyAocHJldmlvdXMgPyAncHJldmlvdXMnIDogJ25leHQnKTtcbiAgICAgIGJ0bi5pbm5lckhUTUwgPSBgXG4gICAgICAgIDxpbWcgc3JjPVwiaW1hZ2VzL3Jld2luZF8ke1xuICAgICAgICAgIHByZXZpb3VzID8gJ3ByZXZpb3VzJyA6ICduZXh0J1xuICAgICAgICB9LnN2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiLz5cbiAgICAgIGA7XG4gICAgICBwbGF5ZXJTdGVwcy5hcHBlbmRDaGlsZChidG4pO1xuICAgICAgaWYgKHByZXZpb3VzKSB7XG4gICAgICAgIHBsYXllclN0ZXBzLmFwcGVuZENoaWxkKHRoaXMuX2NyZWF0ZVBsYXllckJ1dHRvbigpKTtcbiAgICAgIH1cbiAgICAgIGJ0bi5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuX2FuaW1hdGlvblN0YXR1cykge1xuICAgICAgICAgIHRoaXMuX3N0ZXBSZWFkeShcbiAgICAgICAgICAgIChzdGVwLCBuZXh0Q2IsIHN0b3BDYikgPT4ge1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIHN0ZXAgIT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgICAgIGlmIChuZXh0Q2IpIHtcbiAgICAgICAgICAgICAgICAgIG5leHRDYigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9uZXh0U3RlcChzdGVwKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RvcENiKSB7XG4gICAgICAgICAgICAgICAgICBzdG9wQ2IoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcmV2aW91cyxcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zdGVwXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiBidG47XG4gICAgfTtcbiAgICB0aGlzLl9wbGF5ZXJDb250cm9sUHJldkJ0biA9IGNyZWF0ZVN0ZXBCdG4odHJ1ZSk7XG4gICAgdGhpcy5fcGxheWVyQ29udHJvbE5leHRCdG4gPSBjcmVhdGVTdGVwQnRuKCk7XG4gICAgLy8gcGxheWVyQ29udHJvbC5pbm5lckhUTUwgPSB0aGlzLl9nZXRQbGF5ZXJDb250cm9sTGFiZWwoKTtcblxuICAgIHJldHVybiBwbGF5ZXJTdGVwcztcbiAgfVxuXG4gIF9jcmVhdGVMYWJlbGVkSW5wdXQob3B0OiB7XG4gICAgdHlwZTogc3RyaW5nO1xuICAgIHZhbHVlOiBhbnk7XG4gICAgbGFiZWw/OiBzdHJpbmc7XG4gIH0pOiBMYWJlbElucHV0RWxlbWVudE9wdGlvbnMge1xuICAgIG9wdCA9IG9wdCB8fCB7fTtcblxuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBpbnB1dC5jbGFzc05hbWUgPSAnc2xpZGVyLWNvbnRyb2wtaW5wdXQnO1xuICAgIGlmIChvcHQudHlwZSkge1xuICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgb3B0LnR5cGUpO1xuICAgIH1cbiAgICBpZiAob3B0LnZhbHVlKSB7XG4gICAgICBpbnB1dC52YWx1ZSA9IG9wdC52YWx1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChvcHQubGFiZWwgPyAnbGFiZWwnIDogJ2RpdicpO1xuICAgIGNvbnRlbnQuY2xhc3NOYW1lID0gJ3NsaWRlci1jb250cm9sLWJsb2NrJztcbiAgICBpZiAob3B0LmxhYmVsKSB7XG4gICAgICBjb250ZW50LmlubmVySFRNTCA9IG9wdC5sYWJlbCArICc6JztcbiAgICB9XG4gICAgY29udGVudC5hcHBlbmRDaGlsZChpbnB1dCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IGNvbnRlbnQsXG4gICAgICBpbnB1dCxcbiAgICB9O1xuICB9XG5cbiAgc3RhcnRBbmltYXRoaW4oKTogdm9pZCB7XG4gICAgdGhpcy5fdG9nZ2xlQW5pbWF0aW9uKHRydWUpO1xuICB9XG5cbiAgc3RvcEFuaW1hdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLl90b2dnbGVBbmltYXRpb24oZmFsc2UpO1xuICB9XG5cbiAgX29uU2xpZGVyQ2xpY2sodmFsdWU6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGlzQW5pbWF0aW9uID0gdGhpcy5fYW5pbWF0aW9uU3RhdHVzO1xuICAgIGlmIChpc0FuaW1hdGlvbikge1xuICAgICAgdGhpcy5zdG9wQW5pbWF0aW9uKCk7XG4gICAgfVxuICAgIHRoaXMuX29uQ2hhbmdlKHZhbHVlKTtcbiAgICAvLyBpZiAoaXNBbmltYXRpb24pIHtcbiAgICAvLyAgIHRoaXMuc3RhcnRBbmltYXRoaW4oKTtcbiAgICAvLyB9XG4gIH1cblxuICBfb25DaGFuZ2UodmFsdWU6IFNsaWRlclZhbHVlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3NsaWRlcikge1xuICAgICAgdGhpcy5fc2xpZGVyLnNldCh2YWx1ZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9pbnB1dCkge1xuICAgICAgdGhpcy5faW5wdXQudmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuICAgIH1cbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnY2hhbmdlJywgdmFsdWUpO1xuICB9XG5cbiAgLy8gX2dldFBsYXllckNvbnRyb2xMYWJlbCgpIHtcbiAgLy8gICByZXR1cm4gdGhpcy5fYW5pbWF0aW9uU3RhdHVzID8gJ3N0b3AnIDogJ3N0YXJ0JztcbiAgLy8gfVxuXG4gIF90b2dnbGVBbmltYXRpb24oc3RhdHVzPzogYm9vbGVhbik6IHZvaWQge1xuICAgIHN0YXR1cyA9IHN0YXR1cyAhPT0gdW5kZWZpbmVkID8gc3RhdHVzIDogIXRoaXMuX2FuaW1hdGlvblN0YXR1cztcbiAgICB0aGlzLl9hbmltYXRpb25TdGF0dXMgPSBzdGF0dXM7XG4gICAgLy8gdGhpcy5fcGxheWVyQ29udHJvbC5pbm5lckhUTUwgPSB0aGlzLl9nZXRQbGF5ZXJDb250cm9sTGFiZWwoKTtcbiAgICBpZiAodGhpcy5fcGxheWVyQ29udHJvbCkge1xuICAgICAgdGhpcy5fcGxheWVyQ29udHJvbC5jbGFzc0xpc3RbdGhpcy5fYW5pbWF0aW9uU3RhdHVzID8gJ2FkZCcgOiAncmVtb3ZlJ10oXG4gICAgICAgICdwYXVzZWQnXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChzdGF0dXMpIHtcbiAgICAgIHRoaXMuX3N0YXJ0QW5pbWF0aW9uKCk7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnYW5pbWF0aW9uU3RhcnRlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zdG9wQW5pbWF0aW9uKCk7XG4gICAgICAvLyB0aGlzLmVtaXR0ZXIuZW1pdCgnYW5pbWF0aW9uU3RvcHBlZCcpO1xuICAgIH1cbiAgfVxuXG4gIF9zdGFydEFuaW1hdGlvbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fYW5pbWF0aW9uU3RhdHVzKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlQ29udHJvbEJ0bigpO1xuICAgICAgY29uc3QgdGltZXJTdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgdGhpcy5fc3RlcFJlYWR5KFxuICAgICAgICAoc3RlcDogbnVtYmVyIHwgYm9vbGVhbiwgbmV4dENiPzogKCkgPT4gdm9pZCwgc3RvcENiPzogKCkgPT4gdm9pZCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlzUmVhZHkgPVxuICAgICAgICAgICAgdHlwZW9mIHN0ZXAgIT09ICdib29sZWFuJyAmJlxuICAgICAgICAgICAgc3RlcCA8IHRoaXMub3B0aW9ucy5tYXggJiZcbiAgICAgICAgICAgIHN0ZXAgPiB0aGlzLm9wdGlvbnMubWluO1xuICAgICAgICAgIGlmIChpc1JlYWR5ICYmIHRoaXMuX2FuaW1hdGlvblN0YXR1cykge1xuICAgICAgICAgICAgY29uc3Qgc3RlcERlbGF5ID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSB0aW1lclN0YXJ0O1xuICAgICAgICAgICAgbGV0IGRlbGF5ID0gdGhpcy5vcHRpb25zLmFuaW1hdGlvbkRlbGF5IC0gc3RlcERlbGF5O1xuICAgICAgICAgICAgZGVsYXkgPSBkZWxheSA+PSAwID8gZGVsYXkgOiAwO1xuICAgICAgICAgICAgLy8gdGhpcy5fbmV4dFN0ZXBUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICBpZiAodGhpcy5fYW5pbWF0aW9uU3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5leHRDYikge1xuICAgICAgICAgICAgICAgICAgbmV4dENiKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX25leHRTdGVwKHN0ZXAgYXMgbnVtYmVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGFydEFuaW1hdGlvbigpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdhbmltYXRpb25TdG9wcGVkJyk7XG4gICAgICAgICAgICAgICAgaWYgKHN0b3BDYikge1xuICAgICAgICAgICAgICAgICAgc3RvcENiKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBkZWxheSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdhbmltYXRpb25TdG9wcGVkJyk7XG4gICAgICAgICAgICBpZiAoc3RvcENiKSB7XG4gICAgICAgICAgICAgIHN0b3BDYigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdG9wQW5pbWF0aW9uKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0b3BBbmltYXRpb24oKTtcbiAgICB9XG4gIH1cblxuICBfbmV4dFN0ZXAoc3RlcDogU2xpZGVyVmFsdWUpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fc2xpZGVyKSB7XG4gICAgICB0aGlzLl9zbGlkZXIuc2V0KHN0ZXApO1xuICAgIH1cbiAgICB0aGlzLl9vbkNoYW5nZShzdGVwKTtcbiAgfVxuXG4gIF9zdGVwUmVhZHkoXG4gICAgY2FsbGJhY2s6IChcbiAgICAgIHN0ZXA6IG51bWJlciB8IGJvb2xlYW4sXG4gICAgICBuZXh0Q2I/OiAoKSA9PiB2b2lkLFxuICAgICAgc3RvcENiPzogKCkgPT4gdm9pZFxuICAgICkgPT4gdm9pZCxcbiAgICBwcmV2aW91cz86IGJvb2xlYW4sXG4gICAgc3RlcExlbmd0aD86IG51bWJlclxuICApOiB2b2lkIHtcbiAgICBjb25zdCBuZXh0VmFsdWUgPSB0aGlzLl9nZXROZXh0VmFsdWUocHJldmlvdXMsIHN0ZXBMZW5ndGgpO1xuICAgIGNvbnN0IGluUmFuZ2UgPVxuICAgICAgdGhpcy5vcHRpb25zLnZhbHVlIDw9IHRoaXMub3B0aW9ucy5tYXggJiZcbiAgICAgIHRoaXMub3B0aW9ucy52YWx1ZSA+PSB0aGlzLm9wdGlvbnMubWluO1xuICAgIGlmIChuZXh0VmFsdWUgJiYgaW5SYW5nZSkge1xuICAgICAgdGhpcy5vcHRpb25zLnZhbHVlID0gbmV4dFZhbHVlO1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5zdGVwUmVhZHkpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnN0ZXBSZWFkeShuZXh0VmFsdWUsIGNhbGxiYWNrLCBwcmV2aW91cyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayhuZXh0VmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFjayhmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgX2dldEFsbG93ZWRWYWx1ZSh2YWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBpZiAodmFsdWUgPD0gdGhpcy5vcHRpb25zLm1pbikge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5taW47XG4gICAgfSBlbHNlIGlmICh2YWx1ZSA+IHRoaXMub3B0aW9ucy5tYXgpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMubWF4O1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBfZ2V0TmV4dFZhbHVlKHByZXZpb3VzPzogYm9vbGVhbiwgc3RlcExlbmd0aD86IG51bWJlcik6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHRoaXMuX3NsaWRlcikge1xuICAgICAgY29uc3QgdmFsID0gdGhpcy5fc2xpZGVyLmdldCgpO1xuICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSBwYXJzZUludCh2YWwsIDEwKTtcbiAgICAgICAgY29uc3Qgc3RlcCA9IHN0ZXBMZW5ndGggPyBzdGVwTGVuZ3RoIDogdGhpcy5vcHRpb25zLmFuaW1hdGlvblN0ZXA7XG4gICAgICAgIGNvbnN0IG5leHQgPSBwcmV2aW91cyA/IGN1cnJlbnQgLSBzdGVwIDogY3VycmVudCArIHN0ZXA7XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRBbGxvd2VkVmFsdWUobmV4dCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX3N0b3BBbmltYXRpb24oKTogdm9pZCB7XG4gICAgLy8gY2xlYXJUaW1lb3V0KHRoaXMuX25leHRTdGVwVGltZW91dElkKTtcbiAgICB0aGlzLl9lbmFibGVDb250cm9sQnRuKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Rpc2FibGVDb250cm9sQnRuKCk6IHZvaWQge1xuICAgIFt0aGlzLl9wbGF5ZXJDb250cm9sTmV4dEJ0biwgdGhpcy5fcGxheWVyQ29udHJvbFByZXZCdG5dLmZvckVhY2goKHgpID0+IHtcbiAgICAgIGlmICh4KSB7XG4gICAgICAgIHguY2xhc3NMaXN0LmFkZCgnZGlzYWJsZXMnKTtcbiAgICAgICAgeC5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ3RydWUnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZW5hYmxlQ29udHJvbEJ0bigpOiB2b2lkIHtcbiAgICBbdGhpcy5fcGxheWVyQ29udHJvbE5leHRCdG4sIHRoaXMuX3BsYXllckNvbnRyb2xQcmV2QnRuXS5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICBpZiAoeCkge1xuICAgICAgICB4LmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVzJyk7XG4gICAgICAgIHgucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCJpbXBvcnQgeyBBcHAgfSBmcm9tICcuLi9BcHAnO1xuaW1wb3J0IHsgUGFuZWwgfSBmcm9tICcuLi9jb21wb25lbnRzL1BhbmVscy9QYW5lbENvbnRyb2wnO1xuaW1wb3J0IHtcbiAgZ2V0U29jaWFsTGlua3NQYW5lbCxcbiAgZ2V0U3dpdGNoZXJQYW5lbENvbnRyb2wsXG4gIGdldEhvbWVCdG5Db250cm9sLFxufSBmcm9tICcuLi9jb21wb25lbnRzL0xpbmtzL0xpbmtzJztcbmltcG9ydCB7IENvbnRyb2xQb3NpdGlvbnMgfSBmcm9tICdAbmV4dGdpcy93ZWJtYXAnO1xuaW1wb3J0IHsgTGVnZW5kUGFuZWxDb250cm9sIH0gZnJvbSAnLi4vY29tcG9uZW50cy9QYW5lbHMvTGVnZW5kUGFuZWxDb250cm9sJztcbmltcG9ydCB7IFBlcmlvZFBhbmVsQ29udHJvbCB9IGZyb20gJy4uL2NvbXBvbmVudHMvUGFuZWxzL1BlcmlvZFBhbmVsQ29udHJvbCc7XG5pbXBvcnQgeyBZZWFyc1N0YXRQYW5lbENvbnRyb2wgfSBmcm9tICcuLi9jb21wb25lbnRzL1BhbmVscy9ZZWFyc1N0YXRQYW5lbENvbnRyb2wnO1xuaW1wb3J0IHsgSUNvbnRyb2wgfSBmcm9tICdtYXBib3gtZ2wnO1xuXG5pbXBvcnQgJy4vQ29udHJvbHMuY3NzJztcbmltcG9ydCB7IFRpbWVNYXBMb2FkaW5nQ29udHJvbCB9IGZyb20gJy4uL1RpbWVNYXAvVGltZU1hcExvYWRpbmdDb250cm9sJztcblxuaW50ZXJmYWNlIFNjcmVlblNpemUge1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgd2lkdGg6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIENvbnRyb2xzIHtcbiAgcGVyaW9kc1BhbmVsQ29udHJvbD86IFBlcmlvZFBhbmVsQ29udHJvbDtcbiAgeWVhcnNTdGF0UGFuZWxDb250cm9sPzogWWVhcnNTdGF0UGFuZWxDb250cm9sO1xuICBsZWdlbmRQYW5lbD86IExlZ2VuZFBhbmVsQ29udHJvbDtcblxuICBwcml2YXRlIGlzTW9iaWxlID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBfc29jaWFsTGlua3NQYW5lbD86IFBhbmVsO1xuICBwcml2YXRlIF9zd2l0Y2hlcnNQYW5lbD86IFBhbmVsO1xuICBwcml2YXRlIF9ob21lQnRuUGFuZWw6IGFueSB8IFByb21pc2U8YW55PjtcbiAgcHJpdmF0ZSBfem9vbUNvbnRyb2w/OiBJQ29udHJvbDtcbiAgcHJpdmF0ZSBfbG9hZGluZ0NvbnRyb2w/OiBUaW1lTWFwTG9hZGluZ0NvbnRyb2w7XG5cbiAgcHJpdmF0ZSBfYXR0cmlidXRpb25zPzogSUNvbnRyb2w7XG5cbiAgcHJpdmF0ZSBfaW5zdGFsbGVkQ29udHJvbHM6IGFueVtdID0gW107XG5cbiAgcHJpdmF0ZSBfbW9iaWxlVG9nZ2xlUGFuZWxzOiBQYW5lbFtdID0gW107XG4gIHByaXZhdGUgX29wZW5QYW5lbHM6IFBhbmVsW10gPSBbXTtcbiAgcHJpdmF0ZSBfZXZlbnRCaW5kaW5nczogeyBbbmFtZTogc3RyaW5nXTogKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkIH0gPSB7XG4gICAgb25NYXBDbGljazogKCkgPT4gbnVsbCxcbiAgfTtcblxuICBwcml2YXRlIF9tb2JTaXplQ29uc3Q6IFNjcmVlblNpemUgPSB7XG4gICAgaGVpZ2h0OiA3MDAsXG4gICAgd2lkdGg6IDY1MCxcbiAgfTtcblxuICBwcml2YXRlIF90b2dnbGVyRXZlbnRzOiBBcnJheTxbUGFuZWwsICgpID0+IHZvaWRdPiA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBhcHA6IEFwcCkge1xuICAgIHRoaXMuX2V2ZW50QmluZGluZ3Mub25NYXBDbGljayA9ICgpID0+IHRoaXMuX29uTWFwQ2xpY2soKTtcblxuICAgIHRoaXMuY2hlY2tNb2JpbGUoKTtcbiAgICB0aGlzLmluaXRDb250cm9scygpO1xuICAgIHRoaXMuX3VwZGF0ZVRpbWVTbGlkZXIoKTtcbiAgICB0aGlzLl91cGRhdGVNYXBFdmVudHMoKTtcbiAgICB0aGlzLl9hZGRFdmVudHNMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIHVwZGF0ZUNvbnRyb2xzKCk6IHZvaWQge1xuICAgIHRoaXMucmVtb3ZlQ29udHJvbHMoKTtcblxuICAgIGNvbnN0IG1hcENvbnRhaW5lciA9IHRoaXMuYXBwLndlYk1hcC5nZXRDb250YWluZXIoKTtcbiAgICBpZiAobWFwQ29udGFpbmVyKSB7XG4gICAgICBpZiAodGhpcy5pc01vYmlsZSkge1xuICAgICAgICB0aGlzLl9oaWRlQWxsUGFuZWxzKCk7XG4gICAgICAgIG1hcENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdtb2JpbGUnKTtcbiAgICAgICAgdGhpcy5fYWRkTW9iaWxlQ29udHJvbHMoKTtcbiAgICAgICAgdGhpcy5fYWRkUGFuZWxUb2dnbGVMaXN0ZW5lcnMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX21vYmlsZVRvZ2dsZVBhbmVscy5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuX29wZW5QYW5lbHMuaW5kZXhPZih4KSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHguc2hvdygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3JlbW92ZVBhbmVsVG9nZ2xlTGlzdGVuZXIoKTtcbiAgICAgICAgbWFwQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ21vYmlsZScpO1xuICAgICAgICB0aGlzLl9hZGRGdWxsU2l6ZUNvbnRyb2xzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlQ29udHJvbHMoKTogdm9pZCB7XG4gICAgdGhpcy5faW5zdGFsbGVkQ29udHJvbHMuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgdGhpcy5hcHAud2ViTWFwLnJlbW92ZUNvbnRyb2woeCk7XG4gICAgfSk7XG4gICAgdGhpcy5faW5zdGFsbGVkQ29udHJvbHMgPSBbXTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaW5pdENvbnRyb2xzKCkge1xuICAgIHRoaXMucGVyaW9kc1BhbmVsQ29udHJvbCA9IG5ldyBQZXJpb2RQYW5lbENvbnRyb2woe1xuICAgICAgd2ViTWFwOiB0aGlzLmFwcC53ZWJNYXAsXG4gICAgfSk7XG4gICAgdGhpcy55ZWFyc1N0YXRQYW5lbENvbnRyb2wgPSBuZXcgWWVhcnNTdGF0UGFuZWxDb250cm9sKHtcbiAgICAgIHdlYk1hcDogdGhpcy5hcHAud2ViTWFwLFxuICAgIH0pO1xuXG4gICAgdGhpcy5sZWdlbmRQYW5lbCA9IG5ldyBMZWdlbmRQYW5lbENvbnRyb2woe1xuICAgICAgLy8gY29sb3JzOiB0aGlzLm9wdGlvbnMubGluZUNvbG9yLFxuICAgICAgY29sb3JzOiB0aGlzLmFwcC5vcHRpb25zLmxpbmVDb2xvckxlZ2VuZCxcbiAgICB9KTtcblxuICAgIHRoaXMuX3NvY2lhbExpbmtzUGFuZWwgPSBnZXRTb2NpYWxMaW5rc1BhbmVsKCk7XG4gICAgdGhpcy5fc3dpdGNoZXJzUGFuZWwgPSBnZXRTd2l0Y2hlclBhbmVsQ29udHJvbCh0aGlzKTtcbiAgICB0aGlzLl9ob21lQnRuUGFuZWwgPSBnZXRIb21lQnRuQ29udHJvbCh0aGlzKTtcbiAgICB0aGlzLl96b29tQ29udHJvbCA9IHRoaXMuYXBwLndlYk1hcC5nZXRDb250cm9sKCdaT09NJywge1xuICAgICAgem9vbUluVGl0bGU6ICfQn9GA0LjQsdC70LjQt9C40YLRjCcsXG4gICAgICB6b29tT3V0VGl0bGU6ICfQntGC0LTQsNC70LjRgtGMJyxcbiAgICB9KTtcbiAgICB0aGlzLl9hdHRyaWJ1dGlvbnMgPSB0aGlzLmFwcC53ZWJNYXAuZ2V0Q29udHJvbCgnQVRUUklCVVRJT04nKTtcblxuICAgIHRoaXMuX21vYmlsZVRvZ2dsZVBhbmVscyA9IFtcbiAgICAgIHRoaXMucGVyaW9kc1BhbmVsQ29udHJvbCxcbiAgICAgIHRoaXMueWVhcnNTdGF0UGFuZWxDb250cm9sLFxuICAgIF07XG4gICAgaWYgKHRoaXMubGVnZW5kUGFuZWwpIHtcbiAgICAgIHRoaXMuX21vYmlsZVRvZ2dsZVBhbmVscy5wdXNoKHRoaXMubGVnZW5kUGFuZWwpO1xuICAgICAgdGhpcy5sZWdlbmRQYW5lbC5lbWl0dGVyLm9uKCdjaGFuZ2UnLCAoY29sb3JzKSA9PlxuICAgICAgICB0aGlzLmFwcC51cGRhdGVMYXllcnNDb2xvcigpXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuX21vYmlsZVRvZ2dsZVBhbmVscy5mb3JFYWNoKCh4KSA9PiB4LnNob3coKSk7XG4gICAgdGhpcy5fbG9hZGluZ0NvbnRyb2wgPSBuZXcgVGltZU1hcExvYWRpbmdDb250cm9sKHRoaXMuYXBwLnRpbWVNYXApO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBfYWRkQ29udHJvbChcbiAgICBjb250cm9sOiBhbnksXG4gICAgcG9zaXRpb246IENvbnRyb2xQb3NpdGlvbnMsXG4gICAgb3B0aW9ucz86IGFueVxuICApIHtcbiAgICBjb25zdCBhZGRlZENvbnRyb2wgPSBhd2FpdCB0aGlzLmFwcC53ZWJNYXAuYWRkQ29udHJvbChcbiAgICAgIGNvbnRyb2wsXG4gICAgICBwb3NpdGlvbixcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICAgIGlmIChhZGRlZENvbnRyb2wpIHtcbiAgICAgIHRoaXMuX2luc3RhbGxlZENvbnRyb2xzLnB1c2goYWRkZWRDb250cm9sKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9hZGRGdWxsU2l6ZUNvbnRyb2xzKCkge1xuICAgIGF3YWl0IHRoaXMuX2FkZENvbnRyb2wodGhpcy5sZWdlbmRQYW5lbCwgJ3RvcC1sZWZ0Jyk7XG5cbiAgICBhd2FpdCB0aGlzLl9hZGRDb250cm9sKHRoaXMuX3N3aXRjaGVyc1BhbmVsLCAndG9wLXJpZ2h0Jyk7XG5cbiAgICBhd2FpdCB0aGlzLl9hZGRDb250cm9sKHRoaXMucGVyaW9kc1BhbmVsQ29udHJvbCwgJ3RvcC1yaWdodCcpO1xuICAgIGF3YWl0IHRoaXMuX2FkZENvbnRyb2wodGhpcy55ZWFyc1N0YXRQYW5lbENvbnRyb2wsICd0b3AtcmlnaHQnKTtcblxuICAgIGF3YWl0IHRoaXMuX2FkZENvbnRyb2wodGhpcy5fYXR0cmlidXRpb25zLCAnYm90dG9tLWxlZnQnKTtcbiAgICBhd2FpdCB0aGlzLl9hZGRDb250cm9sKHRoaXMuX3NvY2lhbExpbmtzUGFuZWwsICdib3R0b20tbGVmdCcpO1xuICAgIGF3YWl0IHRoaXMuX2FkZENvbnRyb2wodGhpcy5faG9tZUJ0blBhbmVsLCAnYm90dG9tLWxlZnQnKTtcbiAgICBhd2FpdCB0aGlzLl9hZGRDb250cm9sKHRoaXMuX3pvb21Db250cm9sLCAnYm90dG9tLWxlZnQnKTtcblxuICAgIGF3YWl0IHRoaXMuX2FkZENvbnRyb2wodGhpcy5fbG9hZGluZ0NvbnRyb2wsICdib3R0b20tcmlnaHQnKTtcblxuICAgIHRoaXMuX21hbnVhbENvbnRyb2xNb3ZlKCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9hZGRNb2JpbGVDb250cm9scygpIHtcbiAgICBhd2FpdCB0aGlzLl9hZGRDb250cm9sKHRoaXMuX3N3aXRjaGVyc1BhbmVsLCAndG9wLWxlZnQnKTtcblxuICAgIGF3YWl0IHRoaXMuX2FkZENvbnRyb2wodGhpcy5sZWdlbmRQYW5lbCwgJ2JvdHRvbS1yaWdodCcpO1xuICAgIGF3YWl0IHRoaXMuX2FkZENvbnRyb2wodGhpcy55ZWFyc1N0YXRQYW5lbENvbnRyb2wsICdib3R0b20tcmlnaHQnKTtcbiAgICBhd2FpdCB0aGlzLl9hZGRDb250cm9sKHRoaXMucGVyaW9kc1BhbmVsQ29udHJvbCwgJ2JvdHRvbS1yaWdodCcpO1xuXG4gICAgYXdhaXQgdGhpcy5fYWRkQ29udHJvbCh0aGlzLl96b29tQ29udHJvbCwgJ3RvcC1sZWZ0Jyk7XG4gICAgYXdhaXQgdGhpcy5fYWRkQ29udHJvbCh0aGlzLl9ob21lQnRuUGFuZWwsICd0b3AtbGVmdCcpO1xuXG4gICAgYXdhaXQgdGhpcy5fYWRkQ29udHJvbCh0aGlzLl9hdHRyaWJ1dGlvbnMsICdib3R0b20tbGVmdCcpO1xuICAgIGF3YWl0IHRoaXMuX2FkZENvbnRyb2wodGhpcy5fc29jaWFsTGlua3NQYW5lbCwgJ2JvdHRvbS1sZWZ0Jyk7XG5cbiAgICB0aGlzLl9tYW51YWxDb250cm9sTW92ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfbWFudWFsQ29udHJvbE1vdmUoKSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5hcHAud2ViTWFwLmdldENvbnRhaW5lcigpO1xuICAgIGlmIChjb250YWluZXIpIHtcbiAgICAgIGNvbnN0IGF0dHJDb250YWluZXIgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICAgICAgJy5tYXBib3hnbC1jdHJsLm1hcGJveGdsLWN0cmwtYXR0cmliJ1xuICAgICAgKTtcbiAgICAgIGlmIChhdHRyQ29udGFpbmVyICYmIGF0dHJDb250YWluZXIucGFyZW50Tm9kZSkge1xuICAgICAgICBhdHRyQ29udGFpbmVyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYXR0ckNvbnRhaW5lcik7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChhdHRyQ29udGFpbmVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNoZWNrTW9iaWxlKCkge1xuICAgIHRoaXMuaXNNb2JpbGUgPVxuICAgICAgd2luZG93LmlubmVyV2lkdGggPD0gdGhpcy5fbW9iU2l6ZUNvbnN0LndpZHRoIHx8XG4gICAgICB3aW5kb3cuaW5uZXJIZWlnaHQgPD0gdGhpcy5fbW9iU2l6ZUNvbnN0LmhlaWdodDtcbiAgICByZXR1cm4gdGhpcy5pc01vYmlsZTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZU1hcEV2ZW50cygpIHtcbiAgICBpZiAodGhpcy5pc01vYmlsZSkge1xuICAgICAgdGhpcy5fYWRkTWFwQ2xpY2tFdmVudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yZW1vdmVNYXBDbGlja0V2ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlVGltZVNsaWRlcigpIHtcbiAgICAvLyByZW1vdmUgaW50ZXJtZWRpYXRlIHBpcHMgZnJvbSBzbGlkZXIgb24gbW9iaWxlXG4gICAgY29uc3QgcGlwc05vZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXG4gICAgICAnLm5vVWktbWFya2VyLm5vVWktbWFya2VyLWhvcml6b250YWwubm9VaS1tYXJrZXItbm9ybWFsJ1xuICAgICk7XG4gICAgbGV0IGhpZGVFbGVtZW50czogSFRNTEVsZW1lbnRbXSA9IEFycmF5LmZyb20ocGlwc05vZGVzKTtcblxuICAgIGNvbnN0IGxhYmVsTm9kZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcbiAgICAgICcubm9VaS12YWx1ZS5ub1VpLXZhbHVlLWhvcml6b250YWwubm9VaS12YWx1ZS1sYXJnZSdcbiAgICApO1xuICAgIC8vIGxlYXZlIGxhYmVscyBmb3IgbWluaW11bSBhbmQgbWF4aW11bVxuICAgIC8vIG5vIGNoZWNrIGZvciBzZWNvbmQgYW5kIHNlY29uZCBsYXN0IHNpZ25hdHVyZSwgYWRtaXQgdGhhdCB0aGV5IGFyZSBhbHdheXNcbiAgICBoaWRlRWxlbWVudHMgPSBoaWRlRWxlbWVudHMuY29uY2F0KFtcbiAgICAgIGxhYmVsTm9kZXNbMCArIDFdLFxuICAgICAgbGFiZWxOb2Rlc1tsYWJlbE5vZGVzLmxlbmd0aCAtIDJdLFxuICAgIF0pO1xuXG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDw9IHRoaXMuX21vYlNpemVDb25zdC53aWR0aCkge1xuICAgICAgaGlkZUVsZW1lbnRzLmZvckVhY2goKHgpID0+IHtcbiAgICAgICAgeC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGlkZUVsZW1lbnRzLmZvckVhY2goKHgpID0+IHtcbiAgICAgICAgeC5zdHlsZS52aXNpYmlsaXR5ID0gJyc7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9vblBhbmVsVG9nZ2xlKHBhbmVsOiBQYW5lbCkge1xuICAgIHRoaXMuX3JlbW92ZVBhbmVsVG9nZ2xlTGlzdGVuZXIoKTtcbiAgICBjb25zdCBpc0hpZGUgPSBwYW5lbC5pc0hpZGU7XG4gICAgdGhpcy5faGlkZUFsbFBhbmVscygpO1xuICAgIGlmICghaXNIaWRlKSB7XG4gICAgICBwYW5lbC5zaG93KCk7XG4gICAgfVxuICAgIHRoaXMuX2FkZFBhbmVsVG9nZ2xlTGlzdGVuZXJzKCk7XG4gIH1cblxuICBwcml2YXRlIF9hZGRQYW5lbFRvZ2dsZUxpc3RlbmVycygpIHtcbiAgICB0aGlzLl9yZW1vdmVQYW5lbFRvZ2dsZUxpc3RlbmVyKCk7XG4gICAgdGhpcy5fdG9nZ2xlckV2ZW50cyA9IFtdO1xuICAgIHRoaXMuX21vYmlsZVRvZ2dsZVBhbmVscy5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICBjb25zdCB0b2dnbGVyID0gKCkgPT4gdGhpcy5fb25QYW5lbFRvZ2dsZSh4KTtcbiAgICAgIHRoaXMuX3RvZ2dsZXJFdmVudHMucHVzaChbeCwgdG9nZ2xlcl0pO1xuICAgICAgeC5lbWl0dGVyLm9uKCd0b2dnbGUnLCB0b2dnbGVyKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3JlbW92ZVBhbmVsVG9nZ2xlTGlzdGVuZXIoKSB7XG4gICAgdGhpcy5fbW9iaWxlVG9nZ2xlUGFuZWxzLmZvckVhY2goKHgpID0+IHtcbiAgICAgIGNvbnN0IG1lbSA9IHRoaXMuX3RvZ2dsZXJFdmVudHMuZmluZCgoeSkgPT4geVswXSA9PT0geCk7XG4gICAgICBpZiAobWVtKSB7XG4gICAgICAgIHguZW1pdHRlci5yZW1vdmVMaXN0ZW5lcigndG9nZ2xlJywgbWVtWzFdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX29uTWFwQ2xpY2soKSB7XG4gICAgaWYgKHRoaXMuaXNNb2JpbGUpIHtcbiAgICAgIHRoaXMuX2hpZGVBbGxQYW5lbHMoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9vbldpbmRvd1Jlc2l6ZSgpIHtcbiAgICBjb25zdCBpc01vYmlsZSA9IHRoaXMuaXNNb2JpbGU7XG4gICAgdGhpcy5jaGVja01vYmlsZSgpO1xuICAgIGlmIChpc01vYmlsZSAhPT0gdGhpcy5pc01vYmlsZSkge1xuICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xuICAgIH1cbiAgICB0aGlzLl91cGRhdGVUaW1lU2xpZGVyKCk7XG4gICAgdGhpcy5fdXBkYXRlTWFwRXZlbnRzKCk7XG4gIH1cblxuICBwcml2YXRlIF9hZGRFdmVudHNMaXN0ZW5lcnMoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHRoaXMuX29uV2luZG93UmVzaXplKCksIGZhbHNlKTtcbiAgfVxuXG4gIHByaXZhdGUgX2hpZGVBbGxQYW5lbHMoKSB7XG4gICAgdGhpcy5fb3BlblBhbmVscyA9IFtdO1xuICAgIHRoaXMuX21vYmlsZVRvZ2dsZVBhbmVscy5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICBpZiAoIXguaXNIaWRlKSB7XG4gICAgICAgIHRoaXMuX29wZW5QYW5lbHMucHVzaCh4KTtcbiAgICAgIH1cbiAgICAgIHguaGlkZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfYWRkTWFwQ2xpY2tFdmVudCgpIHtcbiAgICB0aGlzLmFwcC53ZWJNYXAuZW1pdHRlci5vbignY2xpY2snLCB0aGlzLl9ldmVudEJpbmRpbmdzLm9uTWFwQ2xpY2spO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmVtb3ZlTWFwQ2xpY2tFdmVudCgpIHtcbiAgICB0aGlzLmFwcC53ZWJNYXAuZW1pdHRlci5yZW1vdmVMaXN0ZW5lcihcbiAgICAgICdjbGljaycsXG4gICAgICB0aGlzLl9ldmVudEJpbmRpbmdzLm9uTWFwQ2xpY2tcbiAgICApO1xuICB9XG59XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iXSwic291cmNlUm9vdCI6IiJ9