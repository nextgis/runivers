(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main~._c"],{

/***/ "./config.json":
/*!*********************!*\
  !*** ./config.json ***!
  \*********************/
/*! exports provided: baseUrl, #sourceGroups, sourceGroups, pointsGroupId, lineColorLegend, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"baseUrl\":\"https://gis.runivers.ru\",\"#sourceGroups\":[{\"name\":\"status2\",\"resourceId\":13819,\"order\":40}],\"sourceGroups\":[{\"name\":\"base\",\"resourceId\":5344,\"opacity\":0.5,\"order\":10},{\"name\":\"status1\",\"resourceId\":13818,\"order\":20},{\"name\":\"lines\",\"resourceId\":14878,\"order\":30},{\"name\":\"cities\",\"resourceId\":11486,\"order\":40}],\"pointsGroupId\":6541,\"lineColorLegend\":{\"base\":[[1,\"#33b850\",\"Основная территория государства\",[1,6]],[2,\"#527800\",\"Самостоятельные территории (княжества и т.п.)\",[8]],[3,\"#79d254\",\"Территория под протекторатом, в вассальной зависимости или в сфере влияния\",[2]],[4,\"#01d0a4\",\"Аренда, совместное владение, спорная территория\",[3,4,5]],[5,\"#a3ada3\",\"Утраченная территория\",[7]]],\"lines\":[[6,{\"width\":2.06,\"color\":\"rgba(132, 73, 58, 1.00)\",\"type\":\"line\"},\"Определенно локализуемая граница\",[1]],[7,{\"width\":2.06,\"color\":\"rgba(132, 73, 58, 0.30)\",\"type\":\"line\"},\"Граница, локализованная приблизительно\",[2]],[8,{\"width\":3.26,\"color\":\"rgba(255,255,255, 0.25)\",\"type\":\"line\"},\"Условная граница\",[3]]]}}");

/***/ }),

/***/ "./nextgis_frontend/packages/cancelable-promise/src/CancelError.ts":
/*!*************************************************************************!*\
  !*** ./nextgis_frontend/packages/cancelable-promise/src/CancelError.ts ***!
  \*************************************************************************/
/*! exports provided: CancelError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CancelError", function() { return CancelError; });
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
var CancelError = (function (_super) {
    __extends(CancelError, _super);
    function CancelError() {
        var _this = _super.call(this) || this;
        _this.name = 'CancelError';
        Object.setPrototypeOf(_this, CancelError.prototype);
        return _this;
    }
    return CancelError;
}(Error));



/***/ }),

/***/ "./nextgis_frontend/packages/cancelable-promise/src/CancelablePromise.ts":
/*!*******************************************************************************!*\
  !*** ./nextgis_frontend/packages/cancelable-promise/src/CancelablePromise.ts ***!
  \*******************************************************************************/
/*! exports provided: CancelablePromise */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CancelablePromise", function() { return CancelablePromise; });
/* harmony import */ var _CancelError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CancelError */ "./nextgis_frontend/packages/cancelable-promise/src/CancelError.ts");

var handleCallback = function (resolve, reject, callback, r) {
    try {
        resolve(callback(r));
    }
    catch (e) {
        reject(e);
    }
};
var ID = 0;
var CancelablePromise = (function () {
    function CancelablePromise(executor) {
        var _this = this;
        this.id = ID++;
        this._isCanceled = false;
        this._isPending = true;
        this._cancelHandlers = [];
        this._children = [];
        this._cancelPromise = new Promise(function (resolve_, reject_) {
            _this._setCanceledCallback = function (er) { return resolve_(er || new _CancelError__WEBPACK_IMPORTED_MODULE_0__["CancelError"]()); };
        });
        this._promise = Promise.race([
            this._cancelPromise,
            new Promise(function (resolve, reject) {
                var onResolve = function (value) {
                    if (value instanceof CancelablePromise) {
                        _this.attach(value);
                    }
                    else {
                        _this._isPending = false;
                    }
                    resolve(value);
                };
                var onReject = function (error) {
                    _this._isPending = false;
                    reject(error);
                };
                var onCancel = function (handler) {
                    if (!_this._isPending) {
                        throw new Error('The `onCancel` handler was attached after the promise settled.');
                    }
                    _this._cancelHandlers.push(handler);
                };
                return executor(onResolve, onReject, onCancel);
            }),
        ]);
    }
    CancelablePromise.resolve = function (value) {
        return new CancelablePromise(function (resolve) { return resolve(value); });
    };
    CancelablePromise.reject = function (value) {
        return new CancelablePromise(function (resolve, reject) { return reject(value); });
    };
    CancelablePromise.all = function (values) {
        return new CancelablePromise(function (resolve, reject) {
            Promise.all(values).then(resolve).catch(reject);
        });
    };
    CancelablePromise.prototype.attach = function (p) {
        if (this._isCanceled) {
            p.cancel();
        }
        else {
            this._children.push(p);
        }
    };
    CancelablePromise.prototype.then = function (onfulfilled, onrejected) {
        var _this = this;
        var p = new CancelablePromise(function (resolve, reject) {
            if (_this._promise) {
                var reject_1 = function (r) {
                    if (onrejected) {
                        handleCallback(resolve, reject, onrejected, r);
                    }
                    else {
                        reject(r);
                    }
                };
                _this._promise.then(function (r) {
                    if (_this._isCanceled) {
                        reject_1(r);
                    }
                    else {
                        if (onfulfilled) {
                            handleCallback(resolve, reject, onfulfilled, r);
                        }
                        else {
                            resolve(r);
                        }
                    }
                }, reject_1);
            }
        });
        p._parentPromise = this;
        this._children.push(p);
        return p;
    };
    CancelablePromise.prototype.catch = function (onrejected) {
        if (this._isCanceled && onrejected) {
            onrejected(new _CancelError__WEBPACK_IMPORTED_MODULE_0__["CancelError"]());
        }
        return this.then(undefined, onrejected);
    };
    CancelablePromise.prototype.finally = function (onfinally) {
        if (this._promise) {
            return this._promise.finally(onfinally);
        }
        if (this._isCanceled) {
            return Promise.reject(new _CancelError__WEBPACK_IMPORTED_MODULE_0__["CancelError"]());
        }
        return Promise.reject(onfinally);
    };
    CancelablePromise.prototype.cancel = function () {
        if (this._isCanceled) {
            return this;
        }
        this._isCanceled = true;
        var parent = this._getTopParent();
        if (parent) {
            parent.cancel();
        }
        if (this._children) {
            this._children.forEach(function (x) { return x.cancel(); });
        }
        if (this._isPending) {
            if (this._cancelHandlers.length) {
                try {
                    for (var _i = 0, _a = this._cancelHandlers; _i < _a.length; _i++) {
                        var handler = _a[_i];
                        handler();
                    }
                }
                catch (error) {
                }
            }
            if (this._setCanceledCallback) {
                this._setCanceledCallback();
            }
        }
        this._destroy();
        return this;
    };
    CancelablePromise.prototype._getTopParent = function () {
        var parent = this._parentPromise;
        var hasParent = !!parent;
        while (hasParent) {
            if (parent && parent._parentPromise) {
                parent = parent._parentPromise;
                hasParent = !!parent;
            }
            else {
                hasParent = false;
            }
        }
        return parent;
    };
    CancelablePromise.prototype._destroy = function () {
        this._setCanceledCallback = undefined;
        this._cancelPromise = undefined;
        this._promise = undefined;
    };
    return CancelablePromise;
}());

Object.setPrototypeOf(CancelablePromise.prototype, Promise.prototype);


/***/ }),

/***/ "./nextgis_frontend/packages/cancelable-promise/src/index.ts":
/*!*******************************************************************!*\
  !*** ./nextgis_frontend/packages/cancelable-promise/src/index.ts ***!
  \*******************************************************************/
/*! exports provided: CancelablePromise, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CancelablePromise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CancelablePromise */ "./nextgis_frontend/packages/cancelable-promise/src/CancelablePromise.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CancelablePromise", function() { return _CancelablePromise__WEBPACK_IMPORTED_MODULE_0__["CancelablePromise"]; });



/* harmony default export */ __webpack_exports__["default"] = (_CancelablePromise__WEBPACK_IMPORTED_MODULE_0__["CancelablePromise"]);


/***/ }),

/***/ "./nextgis_frontend/packages/dialog/src/dialog.css":
/*!*********************************************************!*\
  !*** ./nextgis_frontend/packages/dialog/src/dialog.css ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./nextgis_frontend/packages/dialog/src/dialog.ts":
/*!********************************************************!*\
  !*** ./nextgis_frontend/packages/dialog/src/dialog.ts ***!
  \********************************************************/
/*! exports provided: Dialog */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Dialog", function() { return Dialog; });
/* harmony import */ var dialog_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dialog-polyfill */ "./node_modules/dialog-polyfill/dist/dialog-polyfill.esm.js");
/* harmony import */ var dialog_polyfill_dialog_polyfill_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! dialog-polyfill/dialog-polyfill.css */ "./node_modules/dialog-polyfill/dialog-polyfill.css");
/* harmony import */ var dialog_polyfill_dialog_polyfill_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(dialog_polyfill_dialog_polyfill_css__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _dialog_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dialog.css */ "./nextgis_frontend/packages/dialog/src/dialog.css");
/* harmony import */ var _dialog_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_dialog_css__WEBPACK_IMPORTED_MODULE_2__);
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



var closeBtn = "\n  <a href=\"#\">\n    <svg height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\">\n      <path d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\">\n      </path>\n      <path d=\"M0 0h24v24H0z\" fill=\"none\"></path>\n    </svg>\n  </a>\n";
var Dialog = (function () {
    function Dialog(options) {
        this.options = {
            template: "\n      <p>This is dialog!</p>\n    ",
            closeBtn: true,
            closeBtnTemplate: closeBtn,
        };
        this._dialog = document.createElement('dialog');
        Dialog.dialogs.push(this);
        this._dialog.className = 'dialog-component';
        this.options = __assign(__assign({}, this.options), options);
        this._parent = this.options.parent || document.body;
        this._isNativeDialog = !!this._dialog.showModal;
        if (!this._isNativeDialog) {
            dialog_polyfill__WEBPACK_IMPORTED_MODULE_0__["default"].registerDialog(this._dialog);
            this._dialog.classList.add('polyfilled');
        }
        if (this.options.closeBtn) {
            this._closeBtn = this._createCloseBtn();
        }
        this._content = document.createElement('div');
        this._dialog.appendChild(this._content);
        this.updateContent();
        if (this._parent) {
            this._parent.appendChild(this._dialog);
        }
        this._addEventsListeners();
    }
    Dialog.clean = function () {
        Dialog.dialogs.forEach(function (x) { return x.destroy(); });
    };
    Dialog.prototype.getContainer = function () {
        return this._dialog;
    };
    Dialog.prototype.show = function () {
        this._dialog.showModal();
    };
    Dialog.prototype.close = function () {
        this._dialog.close();
    };
    Dialog.prototype.destroy = function () {
        this.close();
        this._dialog.remove();
    };
    Dialog.prototype.updateContent = function (content) {
        if (!content && this.options.template) {
            content = this.options.template;
        }
        if (content) {
            this._addContent(content, this._content);
        }
    };
    Dialog.prototype._createCloseBtn = function () {
        var _this = this;
        var template = this.options.closeBtnTemplate;
        if (template) {
            var btn = document.createElement('div');
            btn.className = 'dialog-component__close';
            this._dialog.appendChild(btn);
            this._addContent(template, btn);
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                _this.close();
            });
            return btn;
        }
    };
    Dialog.prototype._addContent = function (content, parent) {
        if (typeof content === 'string') {
            parent.innerHTML = content;
        }
        else if (content instanceof HTMLElement) {
            parent.innerHTML = '';
            parent.appendChild(content);
        }
    };
    Dialog.prototype._addEventsListeners = function () {
        var _this = this;
        if (this._closeBtn) {
            this._closeBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                _this.close();
            });
        }
        if (this.options.openers) {
            [].forEach.call(this.options.openers, function (opener) {
                opener.onclick = function (e) {
                    e.preventDefault();
                    _this.show();
                };
            });
        }
        this._dialog.addEventListener('close', function () {
        });
        this._dialog.addEventListener('cancel', function () {
        });
    };
    Dialog.dialogs = [];
    return Dialog;
}());



/***/ }),

/***/ "./nextgis_frontend/packages/dialog/src/index.ts":
/*!*******************************************************!*\
  !*** ./nextgis_frontend/packages/dialog/src/index.ts ***!
  \*******************************************************/
/*! exports provided: Dialog, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dialog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dialog */ "./nextgis_frontend/packages/dialog/src/dialog.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Dialog", function() { return _dialog__WEBPACK_IMPORTED_MODULE_0__["Dialog"]; });



/* harmony default export */ __webpack_exports__["default"] = (_dialog__WEBPACK_IMPORTED_MODULE_0__["Dialog"]);


/***/ }),

/***/ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/MapboxglMapAdapter.ts":
/*!**********************************************************************************!*\
  !*** ./nextgis_frontend/packages/mapboxgl-map-adapter/src/MapboxglMapAdapter.ts ***!
  \**********************************************************************************/
/*! exports provided: MapboxglMapAdapter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MapboxglMapAdapter", function() { return MapboxglMapAdapter; });
/* harmony import */ var _nextgis_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextgis/utils */ "./nextgis_frontend/packages/utils/src/index.ts");
/* harmony import */ var _layer_adapters_MvtAdapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./layer-adapters/MvtAdapter */ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/MvtAdapter.ts");
/* harmony import */ var mapbox_gl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mapbox-gl */ "./node_modules/mapbox-gl/dist/mapbox-gl.js");
/* harmony import */ var mapbox_gl__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(mapbox_gl__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _layer_adapters_OsmAdapter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./layer-adapters/OsmAdapter */ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/OsmAdapter.ts");
/* harmony import */ var _layer_adapters_TileAdapter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./layer-adapters/TileAdapter */ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/TileAdapter.ts");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _controls_ZoomControl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./controls/ZoomControl */ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/controls/ZoomControl.ts");
/* harmony import */ var _controls_CompassControl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./controls/CompassControl */ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/controls/CompassControl.ts");
/* harmony import */ var _controls_AttributionControl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./controls/AttributionControl */ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/controls/AttributionControl.ts");
/* harmony import */ var _layer_adapters_GeoJsonAdapter__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./layer-adapters/GeoJsonAdapter */ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/GeoJsonAdapter.ts");
/* harmony import */ var _controls_createControl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./controls/createControl */ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/controls/createControl.ts");
/* harmony import */ var _controls_createButtonControl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./controls/createButtonControl */ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/controls/createButtonControl.ts");
/* harmony import */ var _layer_adapters_WmsAdapter__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./layer-adapters/WmsAdapter */ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/WmsAdapter.ts");
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













var fitBoundsOptions = {};
var MapboxglMapAdapter = (function () {
    function MapboxglMapAdapter() {
        var _this = this;
        this.options = {};
        this.emitter = new events__WEBPACK_IMPORTED_MODULE_5__["EventEmitter"]();
        this.layerAdapters = MapboxglMapAdapter.layerAdapters;
        this.controlAdapters = MapboxglMapAdapter.controlAdapters;
        this.isLoaded = false;
        this._universalEvents = [
            'zoomstart',
            'zoom',
            'zoomend',
            'movestart',
            'move',
            'moveend',
        ];
        this._sourceDataLoading = {};
        this.__setLayerOrder = Object(_nextgis_utils__WEBPACK_IMPORTED_MODULE_0__["debounce"])(function (layers) { return _this._setLayerOrder(layers); });
    }
    MapboxglMapAdapter.prototype.create = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.map) {
                _this.options = options;
                if (options.accessToken) {
                    mapbox_gl__WEBPACK_IMPORTED_MODULE_2___default.a.accessToken = options.accessToken;
                }
                if (options.target) {
                    var mapOpt = {
                        container: options.target,
                        attributionControl: false,
                        bounds: options.bounds,
                        fitBoundsOptions: __assign(__assign({}, options.fitOptions), fitBoundsOptions),
                        transformRequest: function (url, resourceType) {
                            var transformed = _this._transformRequest(url, resourceType);
                            if (transformed) {
                                return transformed;
                            }
                            else {
                                return {
                                    url: url,
                                };
                            }
                        },
                    };
                    if (typeof options.style === 'string') {
                        mapOpt.style = options.style;
                    }
                    else {
                        mapOpt.style = __assign({
                            version: 8,
                            name: 'Empty style',
                            sources: {},
                            layers: [],
                        }, options.style);
                    }
                    if (options.center !== undefined) {
                        mapOpt.center = options.center;
                    }
                    if (options.zoom !== undefined) {
                        mapOpt.zoom = options.zoom - 1;
                    }
                    if (options.maxZoom) {
                        mapOpt.maxZoom = options.maxZoom - 1;
                    }
                    if (options.minZoom) {
                        mapOpt.minZoom = options.minZoom - 1;
                    }
                    _this.map = new mapbox_gl__WEBPACK_IMPORTED_MODULE_2__["Map"](mapOpt);
                    _this.map.once('load', function () {
                        _this.map._onMapClickLayers = [];
                        _this.map.transformRequests = [];
                        _this.isLoaded = true;
                        _this.emitter.emit('create', _this);
                        resolve(_this);
                    });
                    _this._addEventsListeners();
                }
            }
        });
    };
    MapboxglMapAdapter.prototype.destroy = function () {
        if (this.map) {
            this.map.remove();
        }
    };
    MapboxglMapAdapter.prototype.getContainer = function () {
        return this.map && this.map.getContainer();
    };
    MapboxglMapAdapter.prototype.setView = function (center, zoom) {
        if (this.map) {
            var options = { center: center };
            if (zoom) {
                options.zoom = zoom - 1;
            }
            this.map.jumpTo(options);
        }
    };
    MapboxglMapAdapter.prototype.setCenter = function (latLng) {
        if (this.map) {
            this.map.setCenter(latLng);
        }
    };
    MapboxglMapAdapter.prototype.getCenter = function () {
        if (this.map) {
            var center = this.map.getCenter();
            return [center.lng, center.lat];
        }
    };
    MapboxglMapAdapter.prototype.setZoom = function (zoom) {
        if (this.map) {
            this.map.setZoom(zoom - 1);
        }
    };
    MapboxglMapAdapter.prototype.getZoom = function () {
        if (this.map) {
            var zoom = this.map.getZoom();
            if (zoom < 1) {
                return undefined;
            }
            return zoom ? zoom + 1 : undefined;
        }
    };
    MapboxglMapAdapter.prototype.getBounds = function () {
        if (this.map) {
            var bounds = this.map.getBounds();
            var ar = bounds.toArray();
            return [ar[0][0], ar[0][1], ar[1][0], ar[1][1]];
        }
    };
    MapboxglMapAdapter.prototype.fitBounds = function (e, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var fitBoundOptions;
            return __generator(this, function (_a) {
                if (this.map) {
                    fitBoundOptions = __assign(__assign({ linear: true, duration: 0 }, options), fitBoundsOptions);
                    this.map.fitBounds([
                        [e[0], e[1]],
                        [e[2], e[3]],
                    ], fitBoundOptions);
                    Object(_nextgis_utils__WEBPACK_IMPORTED_MODULE_0__["sleep"])(fitBoundOptions.duration);
                }
                return [2];
            });
        });
    };
    MapboxglMapAdapter.prototype.setRotation = function (angle) {
    };
    MapboxglMapAdapter.prototype.showLayer = function (layerIds) {
        var _this = this;
        layerIds &&
            layerIds.forEach(function (layerId) {
                _this._toggleLayer(layerId, true);
            });
    };
    MapboxglMapAdapter.prototype.hideLayer = function (layerIds) {
        var _this = this;
        layerIds &&
            layerIds.forEach(function (layerId) {
                _this._toggleLayer(layerId, false);
            });
    };
    MapboxglMapAdapter.prototype.removeLayer = function (layerIds) {
        var _map = this.map;
        if (_map && layerIds && Array.isArray(layerIds)) {
            layerIds.forEach(function (layerId) {
                _map.removeLayer(layerId);
                var source = _map.getSource(layerId);
                if (source) {
                    _map.removeSource(layerId);
                }
            });
        }
    };
    MapboxglMapAdapter.prototype.setLayerOrder = function (layerIds, order, layers) {
        this.__setLayerOrder(layers);
    };
    MapboxglMapAdapter.prototype.setLayerOpacity = function (layerIds, opacity) {
        var _this = this;
        var _map = this.map;
        if (_map) {
            layerIds.forEach(function (layerId) {
                _this._onMapLoad().then(function () {
                    var layer = _map.getLayer(layerId);
                    if (layer) {
                        if (layer.type === 'symbol') {
                            _map.setPaintProperty(layerId, 'text-opacity', opacity);
                            _map.setPaintProperty(layerId, 'icon-opacity', opacity);
                        }
                        else {
                            _map.setPaintProperty(layerId, layer.type + '-opacity', opacity);
                        }
                    }
                });
            });
        }
    };
    MapboxglMapAdapter.prototype.createControl = function (control, options) {
        return Object(_controls_createControl__WEBPACK_IMPORTED_MODULE_10__["createControl"])(control, options);
    };
    MapboxglMapAdapter.prototype.createButtonControl = function (options) {
        return Object(_controls_createButtonControl__WEBPACK_IMPORTED_MODULE_11__["createButtonControl"])(options);
    };
    MapboxglMapAdapter.prototype.addControl = function (control, position) {
        if (this.map) {
            this.map.addControl(control, position);
            return control;
        }
    };
    MapboxglMapAdapter.prototype.removeControl = function (control) {
        if (this.map) {
            this.map.removeControl(control);
        }
    };
    MapboxglMapAdapter.prototype.onMapClick = function (evt) {
        var latLng = evt.lngLat;
        var _a = evt.point, x = _a.x, y = _a.y;
        this.emitter.emit('preclick', { latLng: latLng, pixel: { top: y, left: x } });
        if (this.map) {
            this.map._onMapClickLayers
                .sort(function (a, b) {
                var _a, _b;
                if (((_a = a.options) === null || _a === void 0 ? void 0 : _a.order) && ((_b = b.options) === null || _b === void 0 ? void 0 : _b.order)) {
                    return b.options.order - a.options.order;
                }
                return 1;
            })
                .find(function (x) {
                return x._onLayerClick(evt);
            });
        }
        this.emitter.emit('click', { latLng: latLng, pixel: { top: y, left: x } });
    };
    MapboxglMapAdapter.prototype._onMapLoad = function (cb) {
        var _this = this;
        return new Promise(function (resolve) {
            var _resolve = function () {
                if (cb) {
                    cb();
                }
                if (_this.map) {
                    resolve(_this.map);
                }
            };
            if (_this.isLoaded) {
                _resolve();
            }
            else if (_this.map) {
                _this.emitter.once('create', function () {
                    _resolve();
                });
            }
        });
    };
    MapboxglMapAdapter.prototype._setLayerOrder = function (layers) {
        var _map = this.map;
        if (_map) {
            var baseLayers = [];
            var orderedLayers = [];
            for (var l in layers) {
                var layer = layers[l];
                if (layer.options.baselayer) {
                    baseLayers.push(layer);
                }
                else {
                    orderedLayers.push(layer);
                }
            }
            baseLayers.forEach(function (x) {
                if (x.layer) {
                    x.layer.forEach(function (y) {
                        _map.moveLayer(y);
                    });
                }
            });
            orderedLayers = orderedLayers.sort(function (a, b) {
                return a.options.order !== undefined && b.options.order !== undefined
                    ? a.options.order - b.options.order
                    : 0;
            });
            for (var fry = 0; fry < orderedLayers.length; fry++) {
                var mem = orderedLayers[fry];
                var _layers = this._getLayerIds(mem);
                _layers.forEach(function (x) {
                    _map.moveLayer(x);
                });
            }
        }
    };
    MapboxglMapAdapter.prototype._getLayerIds = function (mem) {
        var _layers = [];
        if (mem) {
            if (Array.isArray(mem.layer)) {
                _layers = mem.layer;
            }
            else if (mem.getDependLayers) {
                var dependLayers = mem.getDependLayers();
                dependLayers.forEach(function (x) {
                    var layer = (x.layer && x.layer.layer) || x;
                    if (Array.isArray(layer)) {
                        layer.forEach(function (y) {
                            _layers.push(y);
                        });
                    }
                });
            }
        }
        return _layers;
    };
    MapboxglMapAdapter.prototype._toggleLayer = function (layerId, status) {
        this._onMapLoad().then(function (_map) {
            _map.setLayoutProperty(layerId, 'visibility', status ? 'visible' : 'none');
        });
    };
    MapboxglMapAdapter.prototype._onMapSourceData = function (data) {
        var _this = this;
        if (data.dataType === 'source') {
            var isLoaded = data.isSourceLoaded;
            var emit = function (target) {
                _this.emitter.emit('data-loaded', { target: target });
            };
            this._onDataLoad(data, isLoaded, emit);
        }
    };
    MapboxglMapAdapter.prototype._onMapError = function (data) {
        var _this = this;
        if (this._sourceDataLoading[data.sourceId]) {
            var isLoaded = data.isSourceLoaded;
            var emit = function (target) {
                _this.emitter.emit('data-error', { target: target });
            };
            this._onDataLoad(data, isLoaded, emit);
        }
    };
    MapboxglMapAdapter.prototype._onDataLoad = function (data, isLoaded, emit) {
        if (isLoaded === void 0) { isLoaded = false; }
        if (isLoaded) {
            Object.keys(this._sourceDataLoading).forEach(function (x) {
                emit(x);
            });
            this._sourceDataLoading = {};
        }
        else {
            var tiles = this._sourceDataLoading[data.sourceId];
            if (tiles && data.tile) {
                var index = tiles.indexOf(data.tile);
                if (index !== -1) {
                    this._sourceDataLoading[data.sourceId].splice(index, 1);
                }
                if (!tiles.length) {
                    emit(data.sourceId);
                    delete this._sourceDataLoading[data.sourceId];
                }
            }
        }
    };
    MapboxglMapAdapter.prototype._transformRequest = function (url, resourceType) {
        var transformRequests = this.map && this.map.transformRequests;
        if (transformRequests) {
            for (var _i = 0, transformRequests_1 = transformRequests; _i < transformRequests_1.length; _i++) {
                var r = transformRequests_1[_i];
                var params = r(url, resourceType);
                if (params) {
                    return params;
                }
            }
            return undefined;
        }
    };
    MapboxglMapAdapter.prototype._addEventsListeners = function () {
        var _this = this;
        var _map = this.map;
        if (_map) {
            _map.on('sourcedataloading', function (data) {
                _this._sourceDataLoading[data.sourceId] =
                    _this._sourceDataLoading[data.sourceId] || [];
                if (data.tile) {
                    _this._sourceDataLoading[data.sourceId].push(data.tile);
                }
            });
            _map.on('sourcedata', this._onMapSourceData.bind(this));
            _map.on('error', this._onMapError.bind(this));
            _map.on('click', function (evt) {
                _this.onMapClick(evt);
            });
            this._universalEvents.forEach(function (e) {
                _map.on(e, function () { return _this.emitter.emit(e, _this); });
            });
        }
    };
    MapboxglMapAdapter.layerAdapters = {
        TILE: _layer_adapters_TileAdapter__WEBPACK_IMPORTED_MODULE_4__["TileAdapter"],
        WMS: _layer_adapters_WmsAdapter__WEBPACK_IMPORTED_MODULE_12__["WmsAdapter"],
        MVT: _layer_adapters_MvtAdapter__WEBPACK_IMPORTED_MODULE_1__["MvtAdapter"],
        OSM: _layer_adapters_OsmAdapter__WEBPACK_IMPORTED_MODULE_3__["OsmAdapter"],
        GEOJSON: _layer_adapters_GeoJsonAdapter__WEBPACK_IMPORTED_MODULE_9__["GeoJsonAdapter"],
    };
    MapboxglMapAdapter.controlAdapters = {
        ZOOM: _controls_ZoomControl__WEBPACK_IMPORTED_MODULE_6__["ZoomControl"],
        COMPASS: _controls_CompassControl__WEBPACK_IMPORTED_MODULE_7__["CompassControl"],
        ATTRIBUTION: _controls_AttributionControl__WEBPACK_IMPORTED_MODULE_8__["AttributionControl"],
    };
    return MapboxglMapAdapter;
}());



/***/ }),

/***/ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/controls/AttributionControl.ts":
/*!*******************************************************************************************!*\
  !*** ./nextgis_frontend/packages/mapboxgl-map-adapter/src/controls/AttributionControl.ts ***!
  \*******************************************************************************************/
/*! exports provided: AttributionControl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AttributionControl", function() { return AttributionControl; });
/* harmony import */ var mapbox_gl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mapbox-gl */ "./node_modules/mapbox-gl/dist/mapbox-gl.js");
/* harmony import */ var mapbox_gl__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mapbox_gl__WEBPACK_IMPORTED_MODULE_0__);
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

var AttributionControl = (function (_super) {
    __extends(AttributionControl, _super);
    function AttributionControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AttributionControl;
}(mapbox_gl__WEBPACK_IMPORTED_MODULE_0__["AttributionControl"]));



/***/ }),

/***/ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/controls/CompassControl.ts":
/*!***************************************************************************************!*\
  !*** ./nextgis_frontend/packages/mapboxgl-map-adapter/src/controls/CompassControl.ts ***!
  \***************************************************************************************/
/*! exports provided: CompassControl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CompassControl", function() { return CompassControl; });
/* harmony import */ var mapbox_gl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mapbox-gl */ "./node_modules/mapbox-gl/dist/mapbox-gl.js");
/* harmony import */ var mapbox_gl__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mapbox_gl__WEBPACK_IMPORTED_MODULE_0__);
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

var CompassControl = (function (_super) {
    __extends(CompassControl, _super);
    function CompassControl(options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        options = Object.assign({}, options, { showZoom: false });
        _this = _super.call(this, options) || this;
        return _this;
    }
    return CompassControl;
}(mapbox_gl__WEBPACK_IMPORTED_MODULE_0__["NavigationControl"]));



/***/ }),

/***/ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/controls/ZoomControl.ts":
/*!************************************************************************************!*\
  !*** ./nextgis_frontend/packages/mapboxgl-map-adapter/src/controls/ZoomControl.ts ***!
  \************************************************************************************/
/*! exports provided: ZoomControl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ZoomControl", function() { return ZoomControl; });
/* harmony import */ var mapbox_gl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mapbox-gl */ "./node_modules/mapbox-gl/dist/mapbox-gl.js");
/* harmony import */ var mapbox_gl__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mapbox_gl__WEBPACK_IMPORTED_MODULE_0__);
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

var ZoomControl = (function (_super) {
    __extends(ZoomControl, _super);
    function ZoomControl(options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        options = __assign(__assign({}, options), { showCompass: false });
        _this = _super.call(this, options) || this;
        return _this;
    }
    ZoomControl.prototype._createButton = function (className, ariaLabel, fn) {
        var element = _super.prototype._createButton.call(this, className, ariaLabel, fn);
        var aliases = {
            'Zoom in': 'zoomInTitle',
            'Zoom out': 'zoomOutTitle',
        };
        var alias = aliases[ariaLabel];
        var label = alias && this.options[alias];
        if (label) {
            element.title = label;
            element.setAttribute('aria-label', label);
        }
        return element;
    };
    return ZoomControl;
}(mapbox_gl__WEBPACK_IMPORTED_MODULE_0__["NavigationControl"]));



/***/ }),

/***/ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/controls/createButtonControl.ts":
/*!********************************************************************************************!*\
  !*** ./nextgis_frontend/packages/mapboxgl-map-adapter/src/controls/createButtonControl.ts ***!
  \********************************************************************************************/
/*! exports provided: createButtonControl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createButtonControl", function() { return createButtonControl; });
/* harmony import */ var _createControl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createControl */ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/controls/createControl.ts");

function createButtonControl(options) {
    var link = document.createElement('button');
    link.className = 'mapboxgl-ctrl-icon';
    link.setAttribute('role', 'button');
    if (options.title) {
        link.title = options.title;
        link.setAttribute('aria-label', options.title);
    }
    if (options.html) {
        if (options.html instanceof HTMLElement) {
            link.appendChild(options.html);
        }
        else {
            link.innerHTML = options.html;
        }
        var child = link.firstElementChild;
        if (child) {
            child.style.width = '100%';
            child.style.height = '100%';
            child.style.lineHeight = (link.offsetHeight || 30) + 'px';
        }
    }
    if (options.addClass) {
        options.addClass.split(' ').forEach(function (x) { return link.classList.add(x); });
    }
    var onClick = function (e) {
        e.stopPropagation();
        options.onClick();
    };
    if (options.onClick !== undefined) {
        link.addEventListener('click', onClick);
    }
    return Object(_createControl__WEBPACK_IMPORTED_MODULE_0__["createControl"])({
        onAdd: function () {
            return link;
        },
        onRemove: function () {
            var parent = link.parentNode;
            if (parent) {
                parent.removeChild(link);
            }
            if (options.onClick !== undefined) {
                link.removeEventListener('click', onClick);
            }
        },
    }, { bar: true, addClass: 'mapboxgl-ctrl-group' });
}


/***/ }),

/***/ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/controls/createControl.ts":
/*!**************************************************************************************!*\
  !*** ./nextgis_frontend/packages/mapboxgl-map-adapter/src/controls/createControl.ts ***!
  \**************************************************************************************/
/*! exports provided: createControl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createControl", function() { return createControl; });
function createControl(control, options) {
    if (options === void 0) { options = {}; }
    var Control = (function () {
        function Control() {
        }
        Control.prototype.getDefaultPosition = function () {
            return 'top-left';
        };
        Control.prototype.onAdd = function () {
            var element = document.createElement('div');
            var content = control.onAdd();
            element.classList.add('mapboxgl-ctrl');
            if (options.bar) {
                element.classList.add('mapboxgl-bar');
            }
            if (options.addClass) {
                element.classList.add(options.addClass);
            }
            if (content) {
                element.appendChild(content);
            }
            this._container = element;
            return this._container;
        };
        Control.prototype.onRemove = function () {
            if (this._container) {
                var parent_1 = this._container.parentNode;
                if (parent_1) {
                    parent_1.removeChild(this._container);
                }
            }
            return control.onRemove();
        };
        Control.prototype.remove = function () {
            this.onRemove();
        };
        return Control;
    }());
    return new Control();
}


/***/ }),

/***/ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/index.ts":
/*!*********************************************************************!*\
  !*** ./nextgis_frontend/packages/mapboxgl-map-adapter/src/index.ts ***!
  \*********************************************************************/
/*! exports provided: MapboxglMapAdapter, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _MapboxglMapAdapter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MapboxglMapAdapter */ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/MapboxglMapAdapter.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MapboxglMapAdapter", function() { return _MapboxglMapAdapter__WEBPACK_IMPORTED_MODULE_0__["MapboxglMapAdapter"]; });



/* harmony default export */ __webpack_exports__["default"] = (_MapboxglMapAdapter__WEBPACK_IMPORTED_MODULE_0__["MapboxglMapAdapter"]);


/***/ }),

/***/ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/BaseAdapter.ts":
/*!******************************************************************************************!*\
  !*** ./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/BaseAdapter.ts ***!
  \******************************************************************************************/
/*! exports provided: BaseAdapter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseAdapter", function() { return BaseAdapter; });
var ID = 0;
var BaseAdapter = (function () {
    function BaseAdapter(map, options) {
        this.options = options;
        this.map = map;
        this._layerId = "layer-" + ID++;
    }
    BaseAdapter.prototype.beforeRemove = function () {
        Object.assign(this, { map: undefined });
    };
    return BaseAdapter;
}());



/***/ }),

/***/ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/GeoJsonAdapter.ts":
/*!*********************************************************************************************!*\
  !*** ./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/GeoJsonAdapter.ts ***!
  \*********************************************************************************************/
/*! exports provided: GeoJsonAdapter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GeoJsonAdapter", function() { return GeoJsonAdapter; });
/* harmony import */ var _nextgis_properties_filter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextgis/properties-filter */ "./nextgis_frontend/packages/properties-filter/src/index.ts");
/* harmony import */ var _VectorAdapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./VectorAdapter */ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/VectorAdapter.ts");
/* harmony import */ var _util_geomType__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/geomType */ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/util/geomType.ts");
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



var ID = 0;
var GeoJsonAdapter = (function (_super) {
    __extends(GeoJsonAdapter, _super);
    function GeoJsonAdapter(map, options) {
        var _this = _super.call(this, map, options) || this;
        _this.map = map;
        _this.options = options;
        _this.selected = false;
        _this._features = [];
        _this._sources = {};
        _this.source = _this._sourceId;
        return _this;
    }
    GeoJsonAdapter.prototype.addLayer = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var layer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, _super.prototype.addLayer.call(this, options)];
                    case 1:
                        layer = _a.sent();
                        if (this.options.data) {
                            this.addData(this.options.data);
                        }
                        return [2, layer];
                }
            });
        });
    };
    GeoJsonAdapter.prototype.beforeRemove = function () {
        if (this.map) {
            var source = this.map.getSource(this._sourceId);
            if (source) {
                this.map.removeSource(this._sourceId);
            }
        }
        _super.prototype.beforeRemove.call(this);
    };
    GeoJsonAdapter.prototype.clearLayer = function (cb) {
        var features = [];
        var source = this.map.getSource(this._sourceId);
        if (cb) {
            features = this._features = this._features.filter(function (x) { return !cb(x); });
        }
        this._features = features;
        source.setData({ type: 'FeatureCollection', features: features });
    };
    GeoJsonAdapter.prototype.addData = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var type, detectedType, features, source;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.options.type) {
                            type = this.options.type;
                        }
                        if (!type && data) {
                            detectedType = Object(_util_geomType__WEBPACK_IMPORTED_MODULE_2__["detectType"])(data);
                            type = _util_geomType__WEBPACK_IMPORTED_MODULE_2__["typeAlias"][detectedType];
                        }
                        if (!(data && type)) return [3, 2];
                        features = this.filterGeometries(data, type);
                        features.forEach(function (x) {
                            var fid = '_' + ID++;
                            x._featureFilterId = fid;
                            if (x.properties) {
                                x.properties[_this.featureIdName] = fid;
                            }
                        });
                        if (this._filterFun) {
                            this._filter(this._filterFun);
                        }
                        return [4, this._updateLayerPaint(type)];
                    case 1:
                        _a.sent();
                        source = this.map.getSource(this._sourceId);
                        source.setData({
                            type: 'FeatureCollection',
                            features: this._features,
                        });
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        });
    };
    GeoJsonAdapter.prototype.getLayers = function () {
        var _this = this;
        var filtered = this._filteredFeatureIds;
        var filterProperties = this._filterProperties;
        if (filterProperties) {
            this._updateWithNativeFilter(filterProperties);
        }
        return this._getFeatures().map(function (feature) {
            var visible = false;
            if (filterProperties && feature.properties) {
                visible = Object(_nextgis_properties_filter__WEBPACK_IMPORTED_MODULE_0__["featureFilter"])(feature, filterProperties);
            }
            else if (filtered) {
                var id = _this._getFeatureFilterId(feature);
                if (id !== undefined) {
                    visible = filtered.indexOf(id) !== -1;
                }
            }
            return {
                feature: feature,
                visible: visible,
            };
        });
    };
    GeoJsonAdapter.prototype.filter = function (fun) {
        this._filterFun = fun;
        this._filter(fun);
    };
    GeoJsonAdapter.prototype.removeFilter = function () {
        this._filterFun = undefined;
        this._filteredFeatureIds = undefined;
        this._updateFilter();
    };
    GeoJsonAdapter.prototype.getSelected = function () {
        var _this = this;
        var features = [];
        var selectedFeatureIds = this._selectedFeatureIds;
        var selectProperties = this._selectProperties;
        var allFeatures = this._getFeatures();
        if (selectedFeatureIds && selectedFeatureIds.length) {
            allFeatures.forEach(function (x) {
                var id = _this._getFeatureFilterId(x);
                if (id && selectedFeatureIds.indexOf(id) !== -1) {
                    features.push({ feature: x });
                }
            });
        }
        else if (this.source && selectProperties) {
            allFeatures
                .filter(function (x) { return Object(_nextgis_properties_filter__WEBPACK_IMPORTED_MODULE_0__["featureFilter"])(x, selectProperties); })
                .forEach(function (x) {
                features.push({ feature: x });
            });
        }
        return features;
    };
    GeoJsonAdapter.prototype.select = function (find) {
        if (find) {
            if (typeof find === 'function') {
                var features = this._getFeatures().filter(function (x) {
                    return find({ feature: x });
                });
                this._selectFeature(features);
            }
            else {
                this.selected = true;
                this._selectProperties = find;
                _super.prototype._updateFilter.call(this);
                this._fireOnLayerSelectEvent();
            }
        }
        else if (!this.selected) {
            this._selectFeature(this._getFeatures());
        }
    };
    GeoJsonAdapter.prototype.unselect = function (find) {
        this._selectProperties = undefined;
        if (find) {
            if (typeof find === 'function') {
                var features = this._getFeatures().filter(function (x) {
                    return find({ feature: x });
                });
                this._unselectFeature(features);
                this.selected = Array.isArray(this._selectedFeatureIds) ? true : false;
            }
        }
        else if (this.selected) {
            this.selected = false;
            this._unselectFeature();
        }
    };
    GeoJsonAdapter.prototype._onAddLayer = function (sourceId) {
        var _this = this;
        var source = this.map.getSource(sourceId);
        if (!source) {
            var sourceOpt_1 = {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [],
                },
            };
            var _opts = [
                'cluster',
                'clusterMaxZoom',
                'clusterRadius',
            ];
            _opts.forEach(function (x) {
                var opt = _this.options[x];
                if (opt !== undefined) {
                    sourceOpt_1[x] = opt;
                }
            });
            this.map.addSource(sourceId, sourceOpt_1);
            source = this.map.getSource(sourceId);
        }
        this._sources[sourceId] = source;
        if (this.options.type) {
            this._updateLayerPaint(this.options.type);
        }
    };
    GeoJsonAdapter.prototype._createPaintForType = function (paint, type, name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(typeof paint === 'function')) return [3, 2];
                        return [4, this._getPaintFromCallback(paint, type, name)];
                    case 1: return [2, _a.sent()];
                    case 2: return [2, _super.prototype._createPaintForType.call(this, paint, type, name)];
                }
            });
        });
    };
    GeoJsonAdapter.prototype._selectFeature = function (feature, opt) {
        var _this = this;
        if (opt === void 0) { opt = { silent: false }; }
        var selectedFeatureIds = this._selectedFeatureIds || [];
        if (this.options && !this.options.multiselect) {
            selectedFeatureIds = [];
        }
        var features = [];
        if (Array.isArray(feature)) {
            features = feature;
        }
        else {
            features = [feature];
        }
        features.forEach(function (f) {
            var id = _this._getFeatureFilterId(f);
            if (id !== undefined) {
                selectedFeatureIds.push(id);
            }
        });
        this._selectProperties = undefined;
        this._selectedFeatureIds = selectedFeatureIds;
        this._updateFilter();
        if (!opt.silent && this.options.onLayerSelect) {
            this.options.onLayerSelect({ layer: this, features: features });
        }
        return features;
    };
    GeoJsonAdapter.prototype._unselectFeature = function (feature, opt) {
        var _this = this;
        if (opt === void 0) { opt = { silent: false }; }
        if (feature) {
            var features = [];
            if (Array.isArray(feature)) {
                features = feature;
            }
            else {
                features = [feature];
            }
            if (features.length) {
                features.forEach(function (f) {
                    var id = _this._getFeatureFilterId(f);
                    var selected = _this._selectedFeatureIds;
                    if (selected && id !== undefined) {
                        var index = selected.indexOf(id);
                        if (index !== -1) {
                            selected.splice(index, 1);
                        }
                    }
                });
            }
        }
        else {
            this._selectedFeatureIds = false;
        }
        this._updateFilter();
        if (!opt.silent && this.options.onLayerSelect) {
            this.options.onLayerSelect({ layer: this, features: undefined });
        }
    };
    GeoJsonAdapter.prototype._updateFilter = function () {
        var _this = this;
        if (this._filterProperties || this._selectProperties) {
            _super.prototype._updateFilter.call(this);
            this._fireOnLayerSelectEvent();
            return;
        }
        var selected = this._selectedFeatureIds;
        var selectionArray = [];
        var filteredArray = [];
        var filtered = this._filteredFeatureIds;
        if (filtered) {
            this._getFeatures().forEach(function (x) {
                var id = _this._getFeatureFilterId(x);
                if (id !== undefined && filtered.indexOf(id) !== -1) {
                    if (selected && selected.indexOf(id) !== -1) {
                        selectionArray.push(id);
                    }
                    else {
                        filteredArray.push(id);
                    }
                }
            });
        }
        else if (selected) {
            selectionArray = selected;
        }
        this.selected = !!selected;
        var layers = this.layer;
        if (layers) {
            this._types.forEach(function (t) {
                var geomType = _util_geomType__WEBPACK_IMPORTED_MODULE_2__["typeAliasForFilter"][t];
                if (geomType) {
                    var geomFilter = ['==', '$type', geomType];
                    var layerName = _this._getLayerNameFromType(t);
                    var selLayerName = _this._getSelectionLayerNameFromType(t);
                    if (layers.indexOf(selLayerName) !== -1) {
                        if (_this._selectionName) {
                            _this.map.setFilter(selLayerName, [
                                'all',
                                geomFilter,
                                __spreadArrays(['in', _this.featureIdName], selectionArray),
                            ]);
                        }
                    }
                    if (layers.indexOf(layerName) !== -1) {
                        var filter_ = ['all', geomFilter];
                        if (filtered) {
                            filter_.push(__spreadArrays(['in', _this.featureIdName], filteredArray));
                        }
                        else {
                            filter_.push(__spreadArrays(['!in', _this.featureIdName], selectionArray));
                            _this._updateWithNativeFilter(filter_);
                        }
                        _this.map.setFilter(layerName, filter_);
                    }
                }
            });
        }
    };
    GeoJsonAdapter.prototype._getFeatures = function () {
        var _a;
        if (this.source) {
            var source = this.map.getSource(this.source);
            if (source) {
                return ((_a = source._data) === null || _a === void 0 ? void 0 : _a.features) || [];
            }
        }
        return this._features;
    };
    GeoJsonAdapter.prototype._filter = function (fun) {
        var _this = this;
        var filtered = [];
        this._getFeatures().forEach(function (feature) {
            var ok = fun({ feature: feature });
            var id = _this._getFeatureFilterId(feature);
            if (ok && id) {
                filtered.push(id);
            }
        });
        this._filteredFeatureIds = filtered;
        this._updateFilter();
    };
    GeoJsonAdapter.prototype.filterGeometries = function (data, type) {
        var newFeatures = [];
        if (data.type === 'FeatureCollection') {
            var features = data.features.filter(function (f) {
                return Object(_util_geomType__WEBPACK_IMPORTED_MODULE_2__["geometryFilter"])(f.geometry.type, type);
            });
            data.features = features;
            newFeatures = features;
        }
        else if (data.type === 'Feature') {
            var allow = Object(_util_geomType__WEBPACK_IMPORTED_MODULE_2__["geometryFilter"])(data.geometry.type, type);
            if (!allow) {
                return [];
            }
            newFeatures.push(data);
        }
        else if (data.type === 'GeometryCollection') {
            var geomCollection = data;
            geomCollection.geometries = geomCollection.geometries.filter(function (g) {
                return Object(_util_geomType__WEBPACK_IMPORTED_MODULE_2__["geometryFilter"])(g.type, type);
            });
            newFeatures = geomCollection.geometries.map(function (x) {
                var f = {
                    type: 'Feature',
                    geometry: x,
                    properties: {},
                };
                return f;
            });
        }
        else if (_util_geomType__WEBPACK_IMPORTED_MODULE_2__["typeAlias"][data.type]) {
            var obj = {
                type: 'Feature',
                geometry: data,
                properties: {},
            };
            newFeatures = [obj];
        }
        this._features = this._features.concat(newFeatures);
        return newFeatures;
    };
    GeoJsonAdapter.prototype._getPaintFromCallback = function (paint, type, name) {
        return __awaiter(this, void 0, void 0, function () {
            var style, _i, _a, feature, _paint, p, toSave, styleFromCb;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        style = {};
                        style.type = paint.type;
                        _i = 0, _a = this._features;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 5];
                        feature = _a[_i];
                        _paint = paint(feature);
                        if (!(_paint.type === 'icon')) return [3, 3];
                        return [4, this._registerImage(_paint)];
                    case 2:
                        _b.sent();
                        if (feature.properties) {
                            feature.properties['_icon-image-' + name] = _paint.html;
                        }
                        style['icon-image'] = "{_icon-image-" + name + "}";
                        return [3, 4];
                    case 3:
                        for (p in _paint) {
                            toSave = _paint[p];
                            if (feature.properties) {
                                feature.properties["_paint_" + p + "_" + name] = toSave;
                            }
                            style[p] = ['get', "_paint_" + p + "_" + name];
                        }
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3, 1];
                    case 5:
                        if ('icon-image' in style) {
                            return [2, style];
                        }
                        styleFromCb = this._createPaintForType(style, type, name);
                        return [2, styleFromCb];
                }
            });
        });
    };
    GeoJsonAdapter.prototype._fireOnLayerSelectEvent = function () {
        if (this.options.onLayerSelect) {
            var features_1 = [];
            this.getSelected().forEach(function (x) {
                if (x.feature) {
                    features_1.push(x.feature);
                }
            });
            var features = features_1.length ? features_1 : undefined;
            this.options.onLayerSelect({
                layer: this,
                features: features,
            });
        }
    };
    return GeoJsonAdapter;
}(_VectorAdapter__WEBPACK_IMPORTED_MODULE_1__["VectorAdapter"]));



/***/ }),

/***/ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/MvtAdapter.ts":
/*!*****************************************************************************************!*\
  !*** ./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/MvtAdapter.ts ***!
  \*****************************************************************************************/
/*! exports provided: MvtAdapter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MvtAdapter", function() { return MvtAdapter; });
/* harmony import */ var _VectorAdapter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VectorAdapter */ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/VectorAdapter.ts");
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

var MvtAdapter = (function (_super) {
    __extends(MvtAdapter, _super);
    function MvtAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MvtAdapter.prototype.addLayer = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var layer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, _super.prototype.addLayer.call(this, options)];
                    case 1:
                        layer = _a.sent();
                        this._updateLayerPaint(this.options.type || 'polygon');
                        return [2, layer];
                }
            });
        });
    };
    MvtAdapter.prototype._getAdditionalLayerOptions = function () {
        var exist = MvtAdapter.sources.includes(this.options.url);
        if (!exist && this.map) {
            this.map.addSource(this.options.url, {
                type: 'vector',
                tiles: [this.options.url],
            });
            this.source = this.options.url;
            MvtAdapter.sources.push(this.options.url);
        }
        var mvtLayerOptions = {
            source: this.options.url,
            'source-layer': this.options.sourceLayer,
        };
        return mvtLayerOptions;
    };
    MvtAdapter.sources = [];
    return MvtAdapter;
}(_VectorAdapter__WEBPACK_IMPORTED_MODULE_0__["VectorAdapter"]));



/***/ }),

/***/ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/OsmAdapter.ts":
/*!*****************************************************************************************!*\
  !*** ./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/OsmAdapter.ts ***!
  \*****************************************************************************************/
/*! exports provided: OsmAdapter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OsmAdapter", function() { return OsmAdapter; });
/* harmony import */ var _TileAdapter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TileAdapter */ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/TileAdapter.ts");
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
    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    subdomains: 'abc',
};
var OsmAdapter = (function (_super) {
    __extends(OsmAdapter, _super);
    function OsmAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OsmAdapter.prototype.addLayer = function (options) {
        return _super.prototype.addLayer.call(this, Object.assign({}, OPTIONS, options));
    };
    return OsmAdapter;
}(_TileAdapter__WEBPACK_IMPORTED_MODULE_0__["TileAdapter"]));



/***/ }),

/***/ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/TileAdapter.ts":
/*!******************************************************************************************!*\
  !*** ./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/TileAdapter.ts ***!
  \******************************************************************************************/
/*! exports provided: TileAdapter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TileAdapter", function() { return TileAdapter; });
/* harmony import */ var _BaseAdapter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseAdapter */ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/BaseAdapter.ts");
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

var TileAdapter = (function (_super) {
    __extends(TileAdapter, _super);
    function TileAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TileAdapter.prototype.addLayer = function (options) {
        options = __assign(__assign({}, this.options), (options || {}));
        var minZoom = options.minZoom, maxZoom = options.maxZoom;
        var tiles;
        if (options && options.subdomains) {
            tiles = options.subdomains.split('').map(function (x) {
                var subUrl = options.url.replace('{s}', x);
                return subUrl;
            });
        }
        else {
            tiles = [options.url];
        }
        if (options.headers) {
            var transformRequests = this.map.transformRequests;
            transformRequests.push(function (url, resourceType) {
                var staticUrl = url;
                staticUrl = staticUrl.replace(/(z=\d+)/, 'z={z}');
                staticUrl = staticUrl.replace(/(x=\d+)/, 'x={x}');
                staticUrl = staticUrl.replace(/(y=\d+)/, 'y={y}');
                if (staticUrl === options.url) {
                    return {
                        url: url,
                        headers: options.headers,
                    };
                }
            });
        }
        var sourceOptions = {
            type: 'raster',
            tiles: tiles,
            tileSize: 256,
        };
        if (options.attribution) {
            sourceOptions.attribution = options.attribution;
        }
        var layerOptions = {
            id: this._layerId,
            type: 'raster',
            layout: {
                visibility: 'none',
            },
            source: sourceOptions,
        };
        if (minZoom) {
            layerOptions.minzoom = minZoom - 1;
        }
        if (maxZoom) {
            layerOptions.maxzoom = maxZoom - 1;
        }
        if (this.map) {
            this.map.addLayer(layerOptions, options.before);
            var layer = (this.layer = [this._layerId]);
            return layer;
        }
    };
    return TileAdapter;
}(_BaseAdapter__WEBPACK_IMPORTED_MODULE_0__["BaseAdapter"]));



/***/ }),

/***/ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/VectorAdapter.ts":
/*!********************************************************************************************!*\
  !*** ./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/VectorAdapter.ts ***!
  \********************************************************************************************/
/*! exports provided: operationsAliases, VectorAdapter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "operationsAliases", function() { return operationsAliases; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VectorAdapter", function() { return VectorAdapter; });
/* harmony import */ var _nextgis_paint__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextgis/paint */ "./nextgis_frontend/packages/paint/src/index.ts");
/* harmony import */ var _nextgis_properties_filter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextgis/properties-filter */ "./nextgis_frontend/packages/properties-filter/src/index.ts");
/* harmony import */ var _util_imageIcons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/imageIcons */ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/util/imageIcons.ts");
/* harmony import */ var _BaseAdapter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./BaseAdapter */ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/BaseAdapter.ts");
/* harmony import */ var _util_geomType__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util/geomType */ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/util/geomType.ts");
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





var operationsAliases = {
    gt: '>',
    lt: '<',
    ge: '>=',
    le: '<=',
    eq: '==',
    ne: '!=',
    in: 'in',
    notin: '!in',
    like: '==',
    ilike: '==',
};
var reversOperations = {
    gt: operationsAliases.le,
    lt: operationsAliases.ge,
    ge: operationsAliases.lt,
    le: operationsAliases.gt,
    eq: operationsAliases.ne,
    ne: operationsAliases.eq,
    in: operationsAliases.notin,
    notin: operationsAliases.in,
    like: operationsAliases.ne,
    ilike: operationsAliases.ne,
};
var PAINT = {
    color: 'blue',
    opacity: 1,
    radius: 10,
};
var mapboxTypeAlias = {
    polygon: 'fill',
    line: 'line',
    point: 'circle',
};
var VectorAdapter = (function (_super) {
    __extends(VectorAdapter, _super);
    function VectorAdapter(map, options) {
        var _this = _super.call(this, map, options) || this;
        _this.options = options;
        _this.selected = false;
        _this.featureIdName = 'id';
        _this._types = ['polygon', 'point', 'line'];
        _this._selectedFeatureIds = [];
        _this._sourceId = _this.options.source
            ? _this.options.source
            : "source-" + _this._layerId;
        if (_this.options.featureIdName) {
            _this.featureIdName = _this.options.featureIdName;
        }
        else if (_this.options.source) {
            _this.featureIdName = '$id';
        }
        else {
            _this.featureIdName = 'fid';
        }
        _this._selectionName = _this._layerId + '-highlighted';
        _this.$onLayerMouseLeave = _this._onLayerMouseLeave.bind(_this);
        _this.$onLayerMouseMove = _this._onLayerMouseMove.bind(_this);
        if (_this.options.selectable) {
            _this.map._onMapClickLayers.push(_this);
        }
        return _this;
    }
    VectorAdapter.prototype.addLayer = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var types, _i, types_1, t, geomType, type, paintType, layer, geomFilter, selectionLayer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = this.options = __assign(__assign({}, this.options), (options || {}));
                        this.layer = [];
                        types = (this._types = options.type ? [options.type] : this._types);
                        if (!options.paint) return [3, 5];
                        this._onAddLayer(this._sourceId);
                        _i = 0, types_1 = types;
                        _a.label = 1;
                    case 1:
                        if (!(_i < types_1.length)) return [3, 5];
                        t = types_1[_i];
                        geomType = _util_geomType__WEBPACK_IMPORTED_MODULE_4__["typeAliasForFilter"][t];
                        if (!geomType) return [3, 4];
                        type = t;
                        if (t === 'point') {
                            paintType = this._detectPaintType(options.paint);
                            if (paintType === 'icon') {
                                type = 'point';
                            }
                        }
                        layer = this._getLayerNameFromType(t);
                        geomFilter = types.length > 1 ? ['==', '$type', geomType] : undefined;
                        return [4, this._addLayer(layer, type, [
                                geomFilter,
                                this._getNativeFilter(),
                            ])];
                    case 2:
                        _a.sent();
                        this.layer.push(layer);
                        if (!options.selectedPaint) return [3, 4];
                        selectionLayer = this._getSelectionLayerNameFromType(t);
                        return [4, this._addLayer(selectionLayer, type, [geomFilter, ['in', this.featureIdName, '']], this.options.selectedLayout)];
                    case 3:
                        _a.sent();
                        this.layer.push(selectionLayer);
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3, 1];
                    case 5:
                        this._addEventsListeners();
                        return [2, this.layer];
                }
            });
        });
    };
    VectorAdapter.prototype.propertiesFilter = function (filters, options) {
        this._filterProperties = filters;
        this._updatePropertiesFilter();
    };
    VectorAdapter.prototype.removeFilter = function () {
        this._filterProperties = undefined;
        this._updateFilter();
    };
    VectorAdapter.prototype.select = function (properties) {
        if (typeof properties !== 'function') {
            this._selectProperties = properties;
            this._updateFilter();
        }
        this.selected = true;
        if (this.options.onLayerSelect) {
            this.options.onLayerSelect({ layer: this, features: [] });
        }
    };
    VectorAdapter.prototype.unselect = function () {
        this._selectProperties = undefined;
        this._updateFilter();
        this.selected = false;
        if (this.options.onLayerSelect) {
            this.options.onLayerSelect({ layer: this, features: undefined });
        }
    };
    VectorAdapter.prototype.beforeRemove = function () {
        var map = this.map;
        if (map) {
            if (this.layer) {
                this.layer.forEach(function (layerId) {
                    map.removeLayer(layerId);
                });
            }
            var index = map._onMapClickLayers.indexOf(this);
            if (index !== -1) {
                this.map._onMapClickLayers.splice(index, 1);
            }
        }
        this._removeEventListeners();
        this.$onLayerMouseLeave = undefined;
        this.$onLayerMouseMove = undefined;
        _super.prototype.beforeRemove.call(this);
    };
    VectorAdapter.prototype._onLayerClick = function (e) {
        e.preventDefault();
        var feature;
        var map = this.map;
        if (!map) {
            return;
        }
        if (this.layer) {
            this.layer.find(function (a) {
                var features_ = map.queryRenderedFeatures(e.point, {
                    layers: [a],
                });
                if (features_.length) {
                    feature = features_[0];
                    return true;
                }
                return false;
            });
            if (feature) {
                var features = undefined;
                var isSelected = this.isFeatureSelected(feature);
                if (isSelected) {
                    if (this.options && this.options.unselectOnSecondClick) {
                        this._unselectFeature(feature, { silent: true });
                    }
                }
                else {
                    features = this._selectFeature(feature, { silent: true });
                }
                isSelected = this.isFeatureSelected(feature);
                if (this.options.onLayerClick) {
                    this.options.onLayerClick({
                        layer: this,
                        feature: feature,
                        selected: isSelected,
                    });
                }
                if (this.options.onLayerSelect) {
                    this.options.onLayerSelect({ layer: this, features: features });
                }
            }
        }
        return feature;
    };
    VectorAdapter.prototype._updateWithNativeFilter = function (filter) {
        var nativeFilter = this._getNativeFilter();
        if (nativeFilter.length) {
            filter.push(nativeFilter);
        }
        return filter;
    };
    VectorAdapter.prototype._getNativeFilter = function () {
        return (this.options.nativeFilter
            ? this.options.nativeFilter
            : []);
    };
    VectorAdapter.prototype._addLayer = function (name, type, filter, layout) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, minZoom, maxZoom, mType, layerOpt, map, filters;
            return __generator(this, function (_b) {
                _a = this.options, minZoom = _a.minZoom, maxZoom = _a.maxZoom;
                if (this.options.paint) {
                    if ('type' in this.options.paint && this.options.paint.type === 'icon') {
                        mType = 'symbol';
                    }
                }
                if (mType === undefined) {
                    mType = mapboxTypeAlias[type];
                }
                layout = (layout || this.options.layout || {});
                layerOpt = __assign({ id: name, type: mType, source: this._sourceId, layout: __assign({ visibility: 'none' }, layout) }, this._getAdditionalLayerOptions());
                if (this.options.nativeOptions) {
                    Object.assign(layerOpt, this.options.nativeOptions);
                }
                if (minZoom) {
                    layerOpt.minzoom = minZoom - 1;
                }
                if (maxZoom) {
                    layerOpt.maxzoom = maxZoom - 1;
                }
                map = this.map;
                if (map) {
                    map.addLayer(layerOpt);
                    filters = __spreadArrays(['all'], (filter || [])).filter(function (x) { return x; });
                    if (filters.length > 1) {
                        map.setFilter(layerOpt.id, filters);
                    }
                }
                return [2];
            });
        });
    };
    VectorAdapter.prototype._onAddLayer = function (sourceId, options) {
    };
    VectorAdapter.prototype._updateLayerPaint = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var layerName, layers, selName, _i, layers_1, _a, name_1, paint, _paint, p, p;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        layerName = this._getLayerNameFromType(type);
                        if (!this.options.paint) return [3, 6];
                        layers = [[layerName, this.options.paint]];
                        if (this.options.selectedPaint) {
                            selName = this._getSelectionLayerNameFromType(type);
                            layers.push([selName, this.options.selectedPaint]);
                        }
                        _i = 0, layers_1 = layers;
                        _b.label = 1;
                    case 1:
                        if (!(_i < layers_1.length)) return [3, 6];
                        _a = layers_1[_i], name_1 = _a[0], paint = _a[1];
                        _paint = void 0;
                        if (!this.options.nativePaint) return [3, 2];
                        _paint =
                            typeof this.options.nativePaint === 'boolean'
                                ? paint
                                : this.options.nativePaint;
                        return [3, 4];
                    case 2: return [4, this._createPaintForType(paint, type, name_1)];
                    case 3:
                        _paint = _b.sent();
                        _b.label = 4;
                    case 4:
                        if (this.map) {
                            if ('icon-image' in _paint) {
                                _paint['icon-allow-overlap'] = true;
                                for (p in _paint) {
                                    this.map.setLayoutProperty(name_1, p, _paint[p]);
                                }
                            }
                            else {
                                for (p in _paint) {
                                    this.map.setPaintProperty(name_1, p, _paint[p]);
                                }
                            }
                        }
                        _b.label = 5;
                    case 5:
                        _i++;
                        return [3, 1];
                    case 6: return [2];
                }
            });
        });
    };
    VectorAdapter.prototype._getLayerNameFromType = function (type) {
        return type + '-' + this._layerId;
    };
    VectorAdapter.prototype._getSelectionLayerNameFromType = function (type) {
        return type + '-' + this._selectionName;
    };
    VectorAdapter.prototype._createPaintForType = function (paint, type, name) {
        return __awaiter(this, void 0, void 0, function () {
            var mapboxPaint, _paint, mapboxType, _loop_1, p;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!Object(_nextgis_paint__WEBPACK_IMPORTED_MODULE_0__["isPaint"])(paint)) return [3, 3];
                        mapboxPaint = {};
                        _paint = __assign(__assign({}, PAINT), (paint || {}));
                        if (!(paint.type === 'icon' && paint.html)) return [3, 2];
                        return [4, this._registerImage(paint)];
                    case 1:
                        _a.sent();
                        return [2, {
                                'icon-image': paint.html,
                            }];
                    case 2:
                        mapboxType = mapboxTypeAlias[type];
                        _loop_1 = function (p) {
                            var allowed = _util_geomType__WEBPACK_IMPORTED_MODULE_4__["allowedByType"][type];
                            if (allowed) {
                                var allowedType = allowed.find(function (x) {
                                    if (typeof x === 'string') {
                                        return x === p;
                                    }
                                    else if (Array.isArray(x)) {
                                        return x[0] === p;
                                    }
                                    return false;
                                });
                                if (allowedType) {
                                    var paramName = Array.isArray(allowedType)
                                        ? allowedType[1]
                                        : allowedType;
                                    mapboxPaint[mapboxType + '-' + paramName] = _paint[p];
                                }
                            }
                        };
                        for (p in _paint) {
                            _loop_1(p);
                        }
                        mapboxPaint[mapboxType + '-opacity-transition'] = {
                            duration: 0,
                        };
                        return [2, mapboxPaint];
                    case 3: return [2];
                }
            });
        });
    };
    VectorAdapter.prototype._getFeatureFilterId = function (feature) {
        var id = feature._featureFilterId;
        if (id !== undefined) {
            return id;
        }
        else if (feature.properties &&
            feature.properties[this.featureIdName] !== undefined) {
            return feature.properties[this.featureIdName];
        }
        return feature.id;
    };
    VectorAdapter.prototype._registerImage = function (paint) {
        return __awaiter(this, void 0, void 0, function () {
            var imageExist, width, height, image;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(Object(_nextgis_paint__WEBPACK_IMPORTED_MODULE_0__["isIcon"])(paint) && paint.html && this.map)) return [3, 2];
                        imageExist = this.map.hasImage(paint.html);
                        if (!!imageExist) return [3, 2];
                        width = 12;
                        height = 12;
                        if (paint.iconSize) {
                            width = paint.iconSize[0];
                            height = paint.iconSize[1];
                        }
                        return [4, Object(_util_imageIcons__WEBPACK_IMPORTED_MODULE_2__["getImage"])(paint.html, {
                                width: width,
                                height: height,
                            })];
                    case 1:
                        image = _a.sent();
                        if (this.map) {
                            this.map.addImage(paint.html, image);
                        }
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        });
    };
    VectorAdapter.prototype._selectFeature = function (feature, opt) {
        var _this = this;
        var features = Array.isArray(feature) ? feature : [feature];
        this.select([
            [
                this.featureIdName,
                'in',
                features.map(function (x) { return (x.properties && x.properties[_this.featureIdName]) || x.id; }),
            ],
        ]);
        return [];
    };
    VectorAdapter.prototype._unselectFeature = function (feature, opt) {
    };
    VectorAdapter.prototype._getAdditionalLayerOptions = function () {
        return {};
    };
    VectorAdapter.prototype._updateFilter = function () {
        this._updatePropertiesFilter();
    };
    VectorAdapter.prototype._updatePropertiesFilter = function () {
        var _this = this;
        var layers = this.layer;
        if (layers) {
            this._types.forEach(function (t) {
                var geomType = _util_geomType__WEBPACK_IMPORTED_MODULE_4__["typeAliasForFilter"][t];
                if (geomType) {
                    var geomFilter = ['==', '$type', geomType];
                    var layerName = _this._getLayerNameFromType(t);
                    var selLayerName = _this._getSelectionLayerNameFromType(t);
                    var selectProperties = _this._selectProperties;
                    var filterProperties = _this._filterProperties;
                    var propertyFilters = filterProperties && _this._convertToMapboxFilter(filterProperties);
                    if (_this.map && layers.indexOf(selLayerName) !== -1) {
                        if (_this._selectionName) {
                            var filters_1 = [];
                            if (selectProperties || _this._selectedFeatureIds) {
                                if (selectProperties) {
                                    filters_1 = _this._convertToMapboxFilter(selectProperties) || [];
                                }
                                else if (_this._selectedFeatureIds) {
                                    filters_1 = [
                                        __spreadArrays(['in', _this.featureIdName], _this._selectedFeatureIds),
                                    ];
                                }
                                if (propertyFilters) {
                                    propertyFilters.forEach(function (x) { return filters_1.push(x); });
                                }
                                _this.map.setFilter(selLayerName, __spreadArrays([
                                    'all',
                                    geomFilter
                                ], filters_1));
                            }
                            else {
                                filters_1 = ['in', '$id', ''];
                                _this.map.setFilter(selLayerName, filters_1);
                            }
                        }
                    }
                    if (_this.map && layers.indexOf(layerName) !== -1) {
                        var filters_2 = ['all', geomFilter];
                        _this._updateWithNativeFilter(filters_2);
                        if (selectProperties) {
                            var selectFilters = _this._convertToMapboxFilter(selectProperties, true);
                            selectFilters.forEach(function (x) { return filters_2.push(x); });
                        }
                        else if (_this._selectedFeatureIds) {
                            filters_2.push(__spreadArrays([
                                '!in',
                                _this.featureIdName
                            ], _this._selectedFeatureIds));
                        }
                        if (propertyFilters) {
                            propertyFilters.forEach(function (x) { return filters_2.push(x); });
                        }
                        _this.map.setFilter(layerName, filters_2);
                    }
                }
            });
        }
    };
    VectorAdapter.prototype._convertToMapboxFilter = function (filters, reverse) {
        if (reverse === void 0) { reverse = false; }
        var _operationsAliases = reverse ? reversOperations : operationsAliases;
        var filter = filters.map(function (x) {
            if (typeof x === 'string') {
                return x;
            }
            else if (Object(_nextgis_properties_filter__WEBPACK_IMPORTED_MODULE_1__["checkIfPropertyFilter"])(x)) {
                var field = x[0], operation = x[1], value = x[2];
                var operationAlias = _operationsAliases[operation];
                if (operation === 'in' || operation === 'notin') {
                    return __spreadArrays([operationAlias, field], value);
                }
                return [operationAlias, field, value];
            }
        });
        return filter;
    };
    VectorAdapter.prototype.isFeatureSelected = function (feature) {
        if (this._selectedFeatureIds) {
            var filterId = this._getFeatureFilterId(feature);
            if (filterId) {
                return this._selectedFeatureIds.indexOf(filterId) !== -1;
            }
        }
        return false;
    };
    VectorAdapter.prototype._onLayerMouseMove = function () {
        if (this.map) {
            this.map.getCanvas().style.cursor = 'pointer';
        }
    };
    VectorAdapter.prototype._onLayerMouseLeave = function () {
        if (this.map) {
            this.map.getCanvas().style.cursor = '';
        }
    };
    VectorAdapter.prototype._detectPaintType = function (paint) {
        if ('type' in paint) {
            return paint.type;
        }
        else if (typeof paint === 'function') {
            try {
                var falsePaint = paint({
                    type: 'Feature',
                    properties: {},
                    geometry: {},
                });
                return this._detectPaintType(falsePaint);
            }
            catch (er) {
            }
        }
    };
    VectorAdapter.prototype._addEventsListeners = function () {
        var _this = this;
        if (this.layer && this.options && this.options.selectable) {
            this.layer.forEach(function (x) {
                if (_this.$onLayerMouseMove && _this.map) {
                    _this.map.on('mousemove', x, _this.$onLayerMouseMove);
                }
                if (_this.$onLayerMouseLeave && _this.map) {
                    _this.map.on('mouseleave', x, _this.$onLayerMouseLeave);
                }
            });
        }
    };
    VectorAdapter.prototype._removeEventListeners = function () {
        if (this.$onLayerMouseMove && this.map) {
            this.map.off('mousemove', this.$onLayerMouseMove);
        }
        if (this.$onLayerMouseLeave && this.map) {
            this.map.off('mouseleave', this.$onLayerMouseLeave);
        }
    };
    return VectorAdapter;
}(_BaseAdapter__WEBPACK_IMPORTED_MODULE_3__["BaseAdapter"]));



/***/ }),

/***/ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/WmsAdapter.ts":
/*!*****************************************************************************************!*\
  !*** ./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/WmsAdapter.ts ***!
  \*****************************************************************************************/
/*! exports provided: WmsAdapter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WmsAdapter", function() { return WmsAdapter; });
/* harmony import */ var _TileAdapter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TileAdapter */ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/layer-adapters/TileAdapter.ts");
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

var WmsAdapter = (function (_super) {
    __extends(WmsAdapter, _super);
    function WmsAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WmsAdapter.prototype.addLayer = function (options) {
        var params = {
            bbox: '{bbox-epsg-3857}',
            format: options.format || 'image/png',
            service: 'WMS',
            version: '1.1.1',
            request: 'GetMap',
            srs: 'EPSG:3857',
            transparent: 'true',
            width: options.tileSize || '256',
            height: options.tileSize || '256',
            layers: options.layers || '',
        };
        var paramsStr = Object.keys(params)
            .map(function (x) { return x + "=" + params[x]; })
            .join('&');
        options.url = options.url + '?' + paramsStr;
        return _super.prototype.addLayer.call(this, options);
    };
    return WmsAdapter;
}(_TileAdapter__WEBPACK_IMPORTED_MODULE_0__["TileAdapter"]));



/***/ }),

/***/ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/util/geomType.ts":
/*!*****************************************************************************!*\
  !*** ./nextgis_frontend/packages/mapboxgl-map-adapter/src/util/geomType.ts ***!
  \*****************************************************************************/
/*! exports provided: allowedParams, allowedByType, typeAlias, typeAliasForFilter, backAliases, findMostFrequentGeomType, detectType, geometryFilter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "allowedParams", function() { return allowedParams; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "allowedByType", function() { return allowedByType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "typeAlias", function() { return typeAlias; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "typeAliasForFilter", function() { return typeAliasForFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "backAliases", function() { return backAliases; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findMostFrequentGeomType", function() { return findMostFrequentGeomType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "detectType", function() { return detectType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "geometryFilter", function() { return geometryFilter; });
var allowedParams = [
    'color',
    'opacity',
];
var allowedByType = {
    point: [
        ['fillColor', 'color'],
        ['fillOpacity', 'opacity'],
        ['strokeColor', 'stroke-color'],
        ['strokeOpacity', 'stroke-opacity'],
        ['weight', 'stroke-width'],
        'radius',
    ],
    line: [
        ['strokeColor', 'color'],
        ['strokeOpacity', 'opacity'],
        ['weight', 'width'],
    ],
    polygon: [
        ['fillColor', 'color'],
        ['fillOpacity', 'opacity'],
    ],
};
var typeAlias = {
    Point: 'point',
    LineString: 'line',
    MultiPoint: 'point',
    Polygon: 'polygon',
    MultiLineString: 'line',
    MultiPolygon: 'polygon',
    GeometryCollection: 'polygon',
};
var typeAliasForFilter = {
    point: 'Point',
    line: 'LineString',
    polygon: 'Polygon',
};
var backAliases = {};
for (var a in typeAlias) {
    var layerType = typeAlias[a];
    var backAlias = backAliases[layerType] || [];
    backAlias.push(a);
    backAliases[layerType] = backAlias;
}
function findMostFrequentGeomType(arr) {
    var counts = {};
    for (var fry = 0; fry < arr.length; fry++) {
        counts[arr[fry]] = 1 + (counts[arr[fry]] || 0);
    }
    var maxName = '';
    for (var c in counts) {
        var maxCount = maxName ? counts[maxName] : 0;
        if (counts[c] > maxCount) {
            maxName = c;
        }
    }
    return maxName;
}
function detectType(geojson) {
    var geometry;
    if (geojson.type === 'FeatureCollection') {
        var featuresTypes = geojson.features.map(function (f) { return f.geometry.type; });
        geometry = findMostFrequentGeomType(featuresTypes);
    }
    else if (geojson.type === 'GeometryCollection') {
        var geometryTypes = geojson.geometries.map(function (g) { return g.type; });
        geometry = findMostFrequentGeomType(geometryTypes);
    }
    else if (geojson.type === 'Feature') {
        geometry = geojson.geometry.type;
    }
    else {
        geometry = geojson.type;
    }
    return geometry;
}
function geometryFilter(geometry, type) {
    var backType = backAliases[type];
    if (backType) {
        return backType.indexOf(geometry) !== -1;
    }
    return false;
}


/***/ }),

/***/ "./nextgis_frontend/packages/mapboxgl-map-adapter/src/util/imageIcons.ts":
/*!*******************************************************************************!*\
  !*** ./nextgis_frontend/packages/mapboxgl-map-adapter/src/util/imageIcons.ts ***!
  \*******************************************************************************/
/*! exports provided: getImageData, getImage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getImageData", function() { return getImageData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getImage", function() { return getImage; });
var canvg;
try {
    canvg = __webpack_require__(/*! canvg */ "./node_modules/canvg/lib/index.es.js");
}
catch (er) {
}
function getImageData(img, opt) {
    var canvas = window.document.createElement('canvas');
    var context = canvas.getContext('2d');
    if (!context) {
        throw new Error('failed to create canvas 2d context');
    }
    canvas.setAttribute('width', String(opt.width));
    canvas.setAttribute('height', String(opt.height));
    if (!canvg && img instanceof HTMLImageElement) {
        context.drawImage(img, 0, 0, opt.width, opt.height);
    }
    else if (typeof img === 'string') {
        if (canvg.Canvg) {
            var v = canvg.Canvg.fromString(context, img);
            v.start();
        }
        else {
            canvg(canvas, img);
        }
    }
    return context.getImageData(0, 0, opt.width, opt.height);
}
function getImage(svgStr, opt) {
    return new Promise(function (resolve) {
        if (canvg) {
            resolve(getImageData(svgStr, opt));
        }
        else {
            var svgImage_1 = new Image();
            svgImage_1.crossOrigin = 'Anonymous';
            svgImage_1.src = 'data:image/svg+xml;base64,' + btoa(svgStr);
            svgImage_1.onload = function () {
                var imageData = getImageData(svgImage_1, opt);
                resolve(imageData);
            };
        }
    });
}


/***/ }),

/***/ "./nextgis_frontend/packages/ngw-connector/src/NgwConnector.ts":
/*!*********************************************************************!*\
  !*** ./nextgis_frontend/packages/ngw-connector/src/NgwConnector.ts ***!
  \*********************************************************************/
/*! exports provided: NgwConnector */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(Buffer) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NgwConnector", function() { return NgwConnector; });
/* harmony import */ var _nextgis_cancelable_promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextgis/cancelable-promise */ "./nextgis_frontend/packages/cancelable-promise/src/index.ts");
/* harmony import */ var _nextgis_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextgis/utils */ "./nextgis_frontend/packages/utils/src/index.ts");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_loadData__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/loadData */ "./nextgis_frontend/packages/ngw-connector/src/utils/loadData.ts");
/* harmony import */ var _utils_template__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/template */ "./nextgis_frontend/packages/ngw-connector/src/utils/template.ts");
/* harmony import */ var _utils_resourceToQuery__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/resourceToQuery */ "./nextgis_frontend/packages/ngw-connector/src/utils/resourceToQuery.ts");
/* harmony import */ var _utils_resourceCompare__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/resourceCompare */ "./nextgis_frontend/packages/ngw-connector/src/utils/resourceCompare.ts");
/* harmony import */ var _errors_ResourceNotFoundError__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./errors/ResourceNotFoundError */ "./nextgis_frontend/packages/ngw-connector/src/errors/ResourceNotFoundError.ts");
/* harmony import */ var _errors_NgwError__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./errors/NgwError */ "./nextgis_frontend/packages/ngw-connector/src/errors/NgwError.ts");
/* harmony import */ var _utils_isObject__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./utils/isObject */ "./nextgis_frontend/packages/ngw-connector/src/utils/isObject.ts");
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
var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};










var isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
var NgwConnector = (function () {
    function NgwConnector(options) {
        this.options = options;
        this.emitter = new events__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
        this.routeStr = '/api/component/pyramid/route';
        this._loadingQueue = {};
        this._loadingStatus = {};
        this._queriesCache = {};
        this._resourcesCache = {};
        if (this.options.route) {
            this.routeStr = this.options.route;
        }
    }
    NgwConnector.prototype.setNgw = function (url) {
        this.logout();
        this.options.baseUrl = url;
    };
    NgwConnector.prototype.setNextGisWeb = function (url) {
        this.setNgw(url);
    };
    NgwConnector.prototype.connect = function () {
        var _this = this;
        return new _nextgis_cancelable_promise__WEBPACK_IMPORTED_MODULE_0__["default"](function (resolve, reject) {
            var makeQuery = function () {
                return _this.makeQuery(_this.routeStr, {}, {})
                    .then(function (route) {
                    _this.route = route;
                    resolve(route);
                })
                    .catch(reject);
            };
            if (_this.route) {
                return resolve(_this.route);
            }
            else {
                if (_this.options.auth) {
                    var _a = _this.options.auth, login = _a.login, password = _a.password;
                    if (login && password) {
                        return _this.getUserInfo({ login: login, password: password }).then(function () {
                            return makeQuery();
                        });
                    }
                }
                makeQuery();
            }
        });
    };
    NgwConnector.prototype.login = function (credentials) {
        this.logout();
        return this.getUserInfo(credentials);
    };
    NgwConnector.prototype.logout = function () {
        this._rejectLoadingQueue();
        this._loadingStatus = {};
        this.options.auth = undefined;
        this.route = undefined;
        this.user = undefined;
        this.emitter.emit('logout');
    };
    NgwConnector.prototype.getUserInfo = function (credentials) {
        var _this = this;
        if (this.user && this.user.id) {
            return _nextgis_cancelable_promise__WEBPACK_IMPORTED_MODULE_0__["default"].resolve(this.user);
        }
        if (credentials) {
            this.options.auth = credentials;
        }
        var options = {
            headers: this.getAuthorizationHeaders(credentials),
        };
        return this.makeQuery('/api/component/auth/current_user', {}, options)
            .then(function (data) {
            _this.user = data;
            _this.emitter.emit('login', data);
            return data;
        })
            .catch(function (er) {
            _this.emitter.emit('login:error', er);
            throw er;
        });
    };
    NgwConnector.prototype.getAuthorizationHeaders = function (credentials) {
        var client = this.makeClientId(credentials);
        if (client) {
            return {
                Authorization: 'Basic ' + client,
            };
        }
    };
    NgwConnector.prototype.makeClientId = function (credentials) {
        credentials = credentials || this.options.auth;
        if (credentials) {
            var login = credentials.login, password = credentials.password;
            var str = unescape(encodeURIComponent(login + ":" + password));
            return isBrowser ? window.btoa(str) : Buffer.from(str).toString('base64');
        }
    };
    NgwConnector.prototype.apiRequest = function (name, params, options) {
        var _this = this;
        if (params === void 0) { params = {}; }
        return new _nextgis_cancelable_promise__WEBPACK_IMPORTED_MODULE_0__["default"](function (resolve, reject) {
            _this.connect().then(function (apiItems) {
                var apiItem = apiItems && apiItems[name];
                if (apiItem) {
                    apiItem = __spreadArrays(apiItem);
                    var url = apiItem.shift();
                    if (apiItem.length) {
                        var replaceParams = {};
                        for (var fry = 0; fry < apiItem.length; fry++) {
                            var arg = apiItem[fry];
                            replaceParams[fry] = '{' + arg + '}';
                            if (params[arg] === undefined) {
                                throw new Error('`' + arg + '`' + ' url api argument is not specified');
                            }
                        }
                        if (url) {
                            url = Object(_utils_template__WEBPACK_IMPORTED_MODULE_4__["template"])(url, replaceParams);
                        }
                    }
                    if (params) {
                        var paramArray_1 = [];
                        var paramList = params.paramList;
                        if (Array.isArray(paramList)) {
                            delete params.paramList;
                            paramList.forEach(function (x) {
                                paramArray_1.push(x[0] + "=" + x[1]);
                            });
                        }
                        for (var p in params) {
                            if (apiItem.indexOf(p) === -1) {
                                paramArray_1.push(p + "=" + params[p]);
                            }
                        }
                        if (paramArray_1.length) {
                            url = url + '?' + paramArray_1.join('&');
                        }
                    }
                    if (url) {
                        return _this.makeQuery(url, params, options)
                            .then(function (resp) {
                            resolve(resp);
                        })
                            .catch(reject);
                    }
                    else {
                        reject(new Error('request url is not set'));
                    }
                }
                else {
                    resolve({});
                }
            });
        });
    };
    NgwConnector.prototype.post = function (name, options, params) {
        options = options || {};
        options.method = 'POST';
        options.nocache = true;
        return this.apiRequest(name, params, options);
    };
    NgwConnector.prototype.get = function (name, options, params) {
        options = options || {};
        options.method = 'GET';
        options.nocache = true;
        return this.apiRequest(name, params, options);
    };
    NgwConnector.prototype.patch = function (name, options, params) {
        options = options || {};
        options.method = 'PATCH';
        options.nocache = true;
        return this.apiRequest(name, params, options);
    };
    NgwConnector.prototype.put = function (name, options, params) {
        options = options || {};
        options.method = 'PUT';
        options.nocache = true;
        return this.apiRequest(name, params, options);
    };
    NgwConnector.prototype.delete = function (name, options, params) {
        options = options || {};
        options.method = 'DELETE';
        options.nocache = true;
        return this.apiRequest(name, params, options);
    };
    NgwConnector.prototype.makeQuery = function (url, params, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        url = (this.options.baseUrl ? this.options.baseUrl : '') + url;
        if (url) {
            if (params) {
                url = Object(_utils_template__WEBPACK_IMPORTED_MODULE_4__["template"])(url, params);
            }
            url = url.replace(/([^:]\/)\/+/g, '$1');
            if (options.cache && this._queriesCache[url]) {
                return this._queriesCache[url];
            }
            if (!this._loadingStatus[url] || options.nocache) {
                this._loadingStatus[url] = true;
                return this._loadData(url, options)
                    .then(function (data) {
                    _this._loadingStatus[url] = false;
                    if (options.cache) {
                        _this._queriesCache[url] = data;
                    }
                    _this._executeLoadingQueue(url, data);
                    return data;
                })
                    .catch(function (er) {
                    _this._loadingStatus[url] = false;
                    _this._executeLoadingQueue(url, er, true);
                    _this.emitter.emit('error', er);
                    throw er;
                });
            }
            else {
                this._loadingStatus[url] = false;
                return new _nextgis_cancelable_promise__WEBPACK_IMPORTED_MODULE_0__["default"](function (resolve, reject) {
                    _this._setLoadingQueue(url, resolve, reject);
                });
            }
        }
        else {
            throw new Error('No `url` parameter set for option ' + name);
        }
    };
    NgwConnector.prototype.getResource = function (resource) {
        if (typeof resource === 'string') {
            return this.getResourceByKeyname(resource);
        }
        else if (typeof resource === 'number') {
            return this.getResourceById(resource);
        }
        else if (Object(_utils_isObject__WEBPACK_IMPORTED_MODULE_9__["isObject"])(resource)) {
            return this.getResourceBy(resource);
        }
        return _nextgis_cancelable_promise__WEBPACK_IMPORTED_MODULE_0__["default"].resolve(undefined);
    };
    NgwConnector.prototype.getResourceId = function (resource) {
        if (typeof resource === 'number') {
            return _nextgis_cancelable_promise__WEBPACK_IMPORTED_MODULE_0__["default"].resolve(resource);
        }
        else if (typeof resource === 'string') {
            return this.getResourceByKeyname(resource).then(function (res) {
                if (res) {
                    return res.resource.id;
                }
            });
        }
        return _nextgis_cancelable_promise__WEBPACK_IMPORTED_MODULE_0__["default"].resolve(undefined);
    };
    NgwConnector.prototype.getResourcesBy = function (resource) {
        var _this = this;
        var items = [];
        if (resource.id) {
            var existId = this._resourcesCache[resource.id];
            if (existId) {
                items.push(existId);
            }
        }
        else {
            items = this._resourceCacheFilter(resource);
        }
        if (!items.length) {
            var query = {};
            if (resource.keyname) {
                query.keyname = resource.keyname;
            }
            else {
                Object.assign(query, Object(_utils_resourceToQuery__WEBPACK_IMPORTED_MODULE_5__["resourceToQuery"])(resource));
            }
            return this.get('resource.search', null, __assign({ serialization: 'full' }, query))
                .then(function (resources) {
                if (resources) {
                    resources.forEach(function (x) {
                        _this._resourcesCache[x.resource.id] = x;
                    });
                }
                return resources;
            })
                .catch(function () { return []; });
        }
        return _nextgis_cancelable_promise__WEBPACK_IMPORTED_MODULE_0__["default"].resolve(items);
    };
    NgwConnector.prototype.getResourceBy = function (resource) {
        return this.getResourcesBy(resource).then(function (resources) {
            return resources[0];
        });
    };
    NgwConnector.prototype.getResourceByKeyname = function (keyname) {
        return this.getResourceBy({ keyname: keyname });
    };
    NgwConnector.prototype.getResourceById = function (id) {
        var _this = this;
        var item = this._resourcesCache[id];
        if (!item) {
            return this.get('resource.item', null, { id: id })
                .then(function (item) {
                if (item) {
                    _this._resourcesCache[id] = item;
                }
                return item;
            })
                .catch(function (er) {
                if (!(er instanceof _errors_ResourceNotFoundError__WEBPACK_IMPORTED_MODULE_7__["ResourceNotFoundError"])) {
                    throw er;
                }
                return undefined;
            });
        }
        return _nextgis_cancelable_promise__WEBPACK_IMPORTED_MODULE_0__["default"].resolve(item);
    };
    NgwConnector.prototype.getResourceChildren = function (optOrResource) {
        var _this = this;
        var opt = {};
        if (typeof optOrResource === 'string') {
            opt.keyname = optOrResource;
        }
        else if (typeof optOrResource === 'number') {
            opt.resourceId = optOrResource;
        }
        else {
            opt = optOrResource;
        }
        var parent = opt.resourceId;
        var keyname = opt.keyname;
        if (!opt.keyname && !opt.resourceId && !opt.resource) {
            throw new Error('No keyname or resourceId is set');
        }
        if (opt.resource) {
            if (typeof opt.resource === 'string') {
                keyname = opt.resource;
            }
            else if (typeof opt.resource === 'number') {
                parent = opt.resource;
            }
        }
        var collection = function () {
            return _this.get('resource.collection', null, {
                parent: parent,
            });
        };
        if (keyname) {
            return this.getResourceByKeyname(keyname).then(function (item) {
                if (item) {
                    parent = item.resource.id;
                }
                return collection();
            });
        }
        return collection();
    };
    NgwConnector.prototype.deleteResource = function (resource) {
        var _this = this;
        return this.getResourceId(resource).then(function (id) {
            if (id !== undefined) {
                return _this.delete('resource.item', null, { id: id }).then(function () {
                    delete _this._resourcesCache[id];
                    return undefined;
                });
            }
        });
    };
    NgwConnector.prototype._setLoadingQueue = function (name, resolve, reject) {
        this._loadingQueue[name] = this._loadingQueue[name] || {
            name: name,
            waiting: [],
        };
        this._loadingQueue[name].waiting.push({
            resolve: resolve,
            reject: reject,
            timestamp: new Date(),
        });
    };
    NgwConnector.prototype._rejectLoadingQueue = function () {
        for (var q in this._loadingQueue) {
            var queue = this._loadingQueue[q];
            queue.waiting.forEach(function (x) {
                x.reject();
            });
            delete this._loadingQueue[q];
        }
    };
    NgwConnector.prototype._executeLoadingQueue = function (name, data, isError) {
        var queue = this._loadingQueue[name];
        if (queue) {
            for (var fry = 0; fry < queue.waiting.length; fry++) {
                var wait = queue.waiting[fry];
                if (isError) {
                    if (wait.reject) {
                        wait.reject();
                    }
                }
                else {
                    wait.resolve(data);
                }
            }
            queue.waiting = [];
        }
    };
    NgwConnector.prototype._loadData = function (url, options) {
        var _this = this;
        options.responseType = options.responseType || 'json';
        return new _nextgis_cancelable_promise__WEBPACK_IMPORTED_MODULE_0__["default"](function (resolve, reject, onCancel) {
            if (_this.user) {
                options = options || {};
                options.headers = __assign(__assign({}, _this.getAuthorizationHeaders()), options.headers);
            }
            Object(_utils_loadData__WEBPACK_IMPORTED_MODULE_3__["loadData"])(url, resolve, options, reject, onCancel);
        }).catch(function (httpError) {
            var er = _this._handleHttpError(httpError);
            if (er) {
                throw er;
            }
        });
    };
    NgwConnector.prototype._handleHttpError = function (er) {
        if (er) {
            if (er instanceof _errors_NgwError__WEBPACK_IMPORTED_MODULE_8__["NgwError"]) {
                if (er.exception === 'nextgisweb.resource.exception.ResourceNotFound') {
                    throw new _errors_ResourceNotFoundError__WEBPACK_IMPORTED_MODULE_7__["ResourceNotFoundError"](er);
                }
            }
        }
        return er;
    };
    NgwConnector.prototype._resourceCacheFilter = function (resource) {
        var items = Object.values(this._resourcesCache).filter(function (x) {
            if (resource.keyname && x.resource.keyname) {
                return resource.keyname === x.resource.keyname;
            }
            if (Object(_nextgis_utils__WEBPACK_IMPORTED_MODULE_1__["defined"])(resource.id) && Object(_nextgis_utils__WEBPACK_IMPORTED_MODULE_1__["defined"])(x.resource.id)) {
                return resource.id === x.resource.id;
            }
            return Object(_utils_resourceCompare__WEBPACK_IMPORTED_MODULE_6__["resourceCompare"])(resource, x.resource);
        });
        return items;
    };
    NgwConnector.errors = {
        NgwError: _errors_NgwError__WEBPACK_IMPORTED_MODULE_8__["NgwError"],
        ResourceNotFoundError: _errors_ResourceNotFoundError__WEBPACK_IMPORTED_MODULE_7__["ResourceNotFoundError"],
    };
    return NgwConnector;
}());


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../node_modules/node-libs-browser/node_modules/buffer/index.js */ "./node_modules/node-libs-browser/node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./nextgis_frontend/packages/ngw-connector/src/errors/NetworkError.ts":
/*!****************************************************************************!*\
  !*** ./nextgis_frontend/packages/ngw-connector/src/errors/NetworkError.ts ***!
  \****************************************************************************/
/*! exports provided: NetworkError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NetworkError", function() { return NetworkError; });
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
var NetworkError = (function (_super) {
    __extends(NetworkError, _super);
    function NetworkError(url) {
        var _this = _super.call(this) || this;
        _this.name = 'NetworkError';
        Object.setPrototypeOf(_this, NetworkError.prototype);
        _this.message = "Unable to request " + url + ".\n    Possibly invalid NGW URL entered or CORS not configured to get request from " + location.origin;
        return _this;
    }
    return NetworkError;
}(Error));



/***/ }),

/***/ "./nextgis_frontend/packages/ngw-connector/src/errors/NgwError.ts":
/*!************************************************************************!*\
  !*** ./nextgis_frontend/packages/ngw-connector/src/errors/NgwError.ts ***!
  \************************************************************************/
/*! exports provided: NgwError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NgwError", function() { return NgwError; });
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
var NgwError = (function (_super) {
    __extends(NgwError, _super);
    function NgwError(er) {
        var _this = _super.call(this) || this;
        _this.name = 'NgwError';
        Object.assign(_this, er);
        Object.setPrototypeOf(_this, NgwError.prototype);
        return _this;
    }
    return NgwError;
}(Error));



/***/ }),

/***/ "./nextgis_frontend/packages/ngw-connector/src/errors/ResourceNotFoundError.ts":
/*!*************************************************************************************!*\
  !*** ./nextgis_frontend/packages/ngw-connector/src/errors/ResourceNotFoundError.ts ***!
  \*************************************************************************************/
/*! exports provided: ResourceNotFoundError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ResourceNotFoundError", function() { return ResourceNotFoundError; });
/* harmony import */ var _NgwError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NgwError */ "./nextgis_frontend/packages/ngw-connector/src/errors/NgwError.ts");
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

var ResourceNotFoundError = (function (_super) {
    __extends(ResourceNotFoundError, _super);
    function ResourceNotFoundError(obj) {
        var _this = _super.call(this, obj) || this;
        _this.name = 'ResourceNotFoundError';
        _this.exception = 'nextgisweb.resource.exception.ResourceNotFound';
        Object.setPrototypeOf(_this, ResourceNotFoundError.prototype);
        return _this;
    }
    return ResourceNotFoundError;
}(_NgwError__WEBPACK_IMPORTED_MODULE_0__["NgwError"]));



/***/ }),

/***/ "./nextgis_frontend/packages/ngw-connector/src/index.ts":
/*!**************************************************************!*\
  !*** ./nextgis_frontend/packages/ngw-connector/src/index.ts ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _NgwConnector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NgwConnector */ "./nextgis_frontend/packages/ngw-connector/src/NgwConnector.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NgwConnector", function() { return _NgwConnector__WEBPACK_IMPORTED_MODULE_0__["NgwConnector"]; });

/* harmony import */ var _interfaces__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./interfaces */ "./nextgis_frontend/packages/ngw-connector/src/interfaces.ts");
/* harmony import */ var _interfaces__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_interfaces__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _interfaces__WEBPACK_IMPORTED_MODULE_1__) if(["CancelablePromise","NgwConnector","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _interfaces__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _types_ResourceItem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./types/ResourceItem */ "./nextgis_frontend/packages/ngw-connector/src/types/ResourceItem.ts");
/* harmony import */ var _types_ResourceItem__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_types_ResourceItem__WEBPACK_IMPORTED_MODULE_2__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _types_ResourceItem__WEBPACK_IMPORTED_MODULE_2__) if(["CancelablePromise","NgwConnector","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _types_ResourceItem__WEBPACK_IMPORTED_MODULE_2__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _types_FeatureLayer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./types/FeatureLayer */ "./nextgis_frontend/packages/ngw-connector/src/types/FeatureLayer.ts");
/* harmony import */ var _types_FeatureLayer__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_types_FeatureLayer__WEBPACK_IMPORTED_MODULE_3__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _types_FeatureLayer__WEBPACK_IMPORTED_MODULE_3__) if(["CancelablePromise","NgwConnector","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _types_FeatureLayer__WEBPACK_IMPORTED_MODULE_3__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _types_RequestItemsParamsMap__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./types/RequestItemsParamsMap */ "./nextgis_frontend/packages/ngw-connector/src/types/RequestItemsParamsMap.ts");
/* harmony import */ var _types_RequestItemsParamsMap__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_types_RequestItemsParamsMap__WEBPACK_IMPORTED_MODULE_4__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _types_RequestItemsParamsMap__WEBPACK_IMPORTED_MODULE_4__) if(["CancelablePromise","NgwConnector","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _types_RequestItemsParamsMap__WEBPACK_IMPORTED_MODULE_4__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _types_ResourceStore__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./types/ResourceStore */ "./nextgis_frontend/packages/ngw-connector/src/types/ResourceStore.ts");
/* harmony import */ var _types_ResourceStore__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_types_ResourceStore__WEBPACK_IMPORTED_MODULE_5__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _types_ResourceStore__WEBPACK_IMPORTED_MODULE_5__) if(["CancelablePromise","NgwConnector","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _types_ResourceStore__WEBPACK_IMPORTED_MODULE_5__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _nextgis_cancelable_promise__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @nextgis/cancelable-promise */ "./nextgis_frontend/packages/cancelable-promise/src/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CancelablePromise", function() { return _nextgis_cancelable_promise__WEBPACK_IMPORTED_MODULE_6__["default"]; });










/* harmony default export */ __webpack_exports__["default"] = (_NgwConnector__WEBPACK_IMPORTED_MODULE_0__["NgwConnector"]);


/***/ }),

/***/ "./nextgis_frontend/packages/ngw-connector/src/interfaces.ts":
/*!*******************************************************************!*\
  !*** ./nextgis_frontend/packages/ngw-connector/src/interfaces.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./nextgis_frontend/packages/ngw-connector/src/types/FeatureLayer.ts":
/*!***************************************************************************!*\
  !*** ./nextgis_frontend/packages/ngw-connector/src/types/FeatureLayer.ts ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./nextgis_frontend/packages/ngw-connector/src/types/RequestItemsParamsMap.ts":
/*!************************************************************************************!*\
  !*** ./nextgis_frontend/packages/ngw-connector/src/types/RequestItemsParamsMap.ts ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./nextgis_frontend/packages/ngw-connector/src/types/ResourceItem.ts":
/*!***************************************************************************!*\
  !*** ./nextgis_frontend/packages/ngw-connector/src/types/ResourceItem.ts ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./nextgis_frontend/packages/ngw-connector/src/types/ResourceStore.ts":
/*!****************************************************************************!*\
  !*** ./nextgis_frontend/packages/ngw-connector/src/types/ResourceStore.ts ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./nextgis_frontend/packages/ngw-connector/src/utils/isObject.ts":
/*!***********************************************************************!*\
  !*** ./nextgis_frontend/packages/ngw-connector/src/utils/isObject.ts ***!
  \***********************************************************************/
/*! exports provided: isObject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isObject", function() { return isObject; });
function isObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
}


/***/ }),

/***/ "./nextgis_frontend/packages/ngw-connector/src/utils/loadData.ts":
/*!***********************************************************************!*\
  !*** ./nextgis_frontend/packages/ngw-connector/src/utils/loadData.ts ***!
  \***********************************************************************/
/*! exports provided: loadData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadData", function() { return loadData; });
var loadData;
var isBrowser = new Function('try {return this===window;}catch(e){ return false;}')();
if (isBrowser) {
    loadData = __webpack_require__(/*! ./loadDataBrowser */ "./nextgis_frontend/packages/ngw-connector/src/utils/loadDataBrowser.ts").default;
}
else {
    loadData = __webpack_require__(/*! ./loadDataNode */ "./nextgis_frontend/packages/ngw-connector/src/utils/loadDataNode.ts").default;
}



/***/ }),

/***/ "./nextgis_frontend/packages/ngw-connector/src/utils/loadDataBrowser.ts":
/*!******************************************************************************!*\
  !*** ./nextgis_frontend/packages/ngw-connector/src/utils/loadDataBrowser.ts ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return loadDataBrowser; });
/* harmony import */ var _errors_NgwError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../errors/NgwError */ "./nextgis_frontend/packages/ngw-connector/src/errors/NgwError.ts");
/* harmony import */ var _errors_NetworkError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../errors/NetworkError */ "./nextgis_frontend/packages/ngw-connector/src/errors/NetworkError.ts");


function loadDataBrowser(url, callback, options, error, onCancel) {
    if (options === void 0) { options = {}; }
    options.method = options.method || 'GET';
    var xhr = new XMLHttpRequest();
    xhr.open(options.method || 'GET', url, true);
    if (options.responseType === 'blob') {
        xhr.responseType = options.responseType;
    }
    var getResponseText = function () {
        try {
            return JSON.parse(xhr.responseText);
        }
        catch (er) {
            return xhr.responseText;
        }
    };
    var processingResponse = function (forError) {
        if (forError === void 0) { forError = false; }
        var cb = forError ? error : callback;
        if (options.responseType === 'blob') {
            cb(xhr.response);
        }
        else {
            if (xhr.responseText) {
                cb(getResponseText());
            }
            else {
                error({ message: '' });
            }
        }
    };
    xhr.onload = function () {
        if ([404, 500].indexOf(xhr.status) !== -1) {
            error(new _errors_NgwError__WEBPACK_IMPORTED_MODULE_0__["NgwError"](getResponseText()));
        }
        processingResponse();
    };
    xhr.onerror = function (er) {
        if (xhr.status === 0) {
            error(new _errors_NetworkError__WEBPACK_IMPORTED_MODULE_1__["NetworkError"](url));
        }
        else {
            error(er);
        }
    };
    xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
            var percentComplete = (e.loaded / e.total) * 100;
            if (options.onProgress) {
                options.onProgress(percentComplete, e);
            }
        }
    };
    var headers = options.headers;
    if (headers) {
        for (var h in headers) {
            var header = headers[h];
            if (typeof header === 'string') {
                xhr.setRequestHeader(h, header);
            }
        }
    }
    if (options.withCredentials !== undefined) {
        xhr.withCredentials = options.withCredentials;
    }
    var data;
    if (options.file) {
        data = new FormData();
        data.append('file', options.file);
        if (options.data) {
            for (var d in data) {
                data.append(d, data[d]);
            }
        }
    }
    else {
        data = options.data
            ? typeof options.data === 'string'
                ? options.data
                : JSON.stringify(options.data)
            : null;
    }
    if (onCancel) {
        onCancel(function () {
            xhr.abort();
        });
    }
    xhr.send(data);
}


/***/ }),

/***/ "./nextgis_frontend/packages/ngw-connector/src/utils/loadDataNode.ts":
/*!***************************************************************************!*\
  !*** ./nextgis_frontend/packages/ngw-connector/src/utils/loadDataNode.ts ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return loadDataNode; });
var url = eval('require("url")');
var http = eval('require("http")');
var https = eval('require("https")');
var adapterFor = function (inputUrl) {
    var adapters = {
        'http:': http,
        'https:': https,
    };
    var protocol = url.parse(inputUrl).protocol || 'https:';
    return adapters[protocol];
};
function loadDataNode(url, callback, options, error, onCancel) {
    if (options === void 0) { options = {}; }
    var request = new Promise(function (resolve, reject) {
        var adapter = adapterFor(url);
        if (adapter) {
            var requestOpt = {
                headers: options.headers || {},
                method: options.method,
            };
            var body = typeof options.data === 'string'
                ? options.data
                : JSON.stringify(options.data);
            var req_1 = adapter.request(url, requestOpt, function (resp) {
                var data = '';
                resp.on('data', function (chunk) {
                    data += chunk;
                });
                resp.on('end', function () {
                    if (data) {
                        var json = void 0;
                        try {
                            json = JSON.parse(data);
                            if (json && json.status_code && json.status_code) {
                                throw new Error(json.message);
                            }
                        }
                        catch (er) {
                            reject(er);
                        }
                        if (json !== undefined) {
                            resolve(json);
                        }
                    }
                    reject('no data');
                });
            });
            req_1.on('error', function (err) {
                reject(err);
            });
            if (body) {
                req_1.write(body);
            }
            onCancel(function () {
                req_1.abort();
            });
            req_1.end();
        }
        else {
            throw new Error("Given URL '" + url + "' is not correct");
        }
    });
    return request
        .then(function (data) {
        if (callback) {
            callback(data);
        }
        return data;
    })
        .catch(function (er) {
        if (error) {
            error(er);
        }
        else {
            throw new Error(er);
        }
    });
}


/***/ }),

/***/ "./nextgis_frontend/packages/ngw-connector/src/utils/resourceCompare.ts":
/*!******************************************************************************!*\
  !*** ./nextgis_frontend/packages/ngw-connector/src/utils/resourceCompare.ts ***!
  \******************************************************************************/
/*! exports provided: resourceCompare */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resourceCompare", function() { return resourceCompare; });
function resourceCompare(res1, res2) {
    return objectCompare(res1, res2);
}
function isObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
}
function objectCompare(obj1, obj2) {
    return Object.entries(obj1).every(function (_a) {
        var key = _a[0], value = _a[1];
        var value2 = obj2[key];
        if (isObject(value)) {
            if (isObject(value2)) {
                return objectCompare(value, value2);
            }
            return false;
        }
        else if (value2 !== undefined) {
            return value === value2;
        }
        return true;
    });
}


/***/ }),

/***/ "./nextgis_frontend/packages/ngw-connector/src/utils/resourceToQuery.ts":
/*!******************************************************************************!*\
  !*** ./nextgis_frontend/packages/ngw-connector/src/utils/resourceToQuery.ts ***!
  \******************************************************************************/
/*! exports provided: resourceToQuery */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resourceToQuery", function() { return resourceToQuery; });
/* harmony import */ var _nextgis_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextgis/utils */ "./nextgis_frontend/packages/utils/src/index.ts");
/* harmony import */ var _isObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isObject */ "./nextgis_frontend/packages/ngw-connector/src/utils/isObject.ts");


function resourceToQuery(resource, prefix) {
    if (prefix === void 0) { prefix = ''; }
    prefix = prefix ? prefix + '__' : '';
    var query = {};
    Object.entries(resource).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        if (Object(_isObject__WEBPACK_IMPORTED_MODULE_1__["isObject"])(value)) {
            var children = resourceToQuery(value, key);
            Object.assign(query, children);
        }
        else if (Object(_nextgis_utils__WEBPACK_IMPORTED_MODULE_0__["defined"])(value)) {
            query[prefix + key] = value;
        }
    });
    return query;
}


/***/ }),

/***/ "./nextgis_frontend/packages/ngw-connector/src/utils/template.ts":
/*!***********************************************************************!*\
  !*** ./nextgis_frontend/packages/ngw-connector/src/utils/template.ts ***!
  \***********************************************************************/
/*! exports provided: template */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "template", function() { return template; });
var templateRe = /\{ *([\w_-]+) *\}/g;
function template(str, data) {
    return str.replace(templateRe, function (s, key) {
        var value = data[key];
        if (value === undefined) {
            throw new Error('No value provided for letiable ' + s);
        }
        else if (typeof value === 'function') {
            value = value(data);
        }
        return value;
    });
}


/***/ }),

/***/ "./nextgis_frontend/packages/paint/src/fromPaintExpression.ts":
/*!********************************************************************!*\
  !*** ./nextgis_frontend/packages/paint/src/fromPaintExpression.ts ***!
  \********************************************************************/
/*! exports provided: createExpressionCallback */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createExpressionCallback", function() { return createExpressionCallback; });
/* harmony import */ var _typeHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeHelpers */ "./nextgis_frontend/packages/paint/src/typeHelpers.ts");
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

function get(feature, args) {
    var field = args[0];
    return feature.properties && feature.properties[field];
}
function match(feature, args) {
    var lookup = args[0], cases = args.slice(1);
    var property = lookup;
    if (Array.isArray(lookup)) {
        property = featureExpression(feature, lookup);
    }
    var defValue = cases.splice(-1, cases.length % 2)[0];
    for (var fry = 0; fry < cases.length - 1; fry += 2) {
        var key = cases[fry];
        if (key === property) {
            return cases[fry + 1];
        }
    }
    return defValue;
}
var expressions = {
    get: get,
    match: match,
};
function featureExpression(feature, expression) {
    var name = expression[0], args = expression.slice(1);
    var expressionFun = expressions[name];
    if (expressionFun) {
        return expressionFun(feature, args);
    }
    return undefined;
}
function createPropertyExpressionCb(expression) {
    return function (feature) {
        return featureExpression(feature, expression);
    };
}
var excludeExpressionList = ['iconSize', 'iconAnchor'];
function createExpressionCallback(paint) {
    var withExpression = false;
    var expressions = {};
    for (var p in paint) {
        if (excludeExpressionList.indexOf(p) === -1) {
            var p_ = p;
            var val = paint[p_];
            if (Object(_typeHelpers__WEBPACK_IMPORTED_MODULE_0__["isExpression"])(val)) {
                withExpression = true;
                expressions[p_] = createPropertyExpressionCb(val);
            }
        }
    }
    if (withExpression) {
        return function (feature) {
            var fromCb = {};
            for (var p in expressions) {
                fromCb[p] = expressions[p](feature);
            }
            return __assign(__assign({}, paint), fromCb);
        };
    }
    return;
}


/***/ }),

/***/ "./nextgis_frontend/packages/paint/src/index.ts":
/*!******************************************************!*\
  !*** ./nextgis_frontend/packages/paint/src/index.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _interfaces__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./interfaces */ "./nextgis_frontend/packages/paint/src/interfaces.ts");
/* harmony import */ var _interfaces__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_interfaces__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _interfaces__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _interfaces__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _typeHelpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./typeHelpers */ "./nextgis_frontend/packages/paint/src/typeHelpers.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isExpression", function() { return _typeHelpers__WEBPACK_IMPORTED_MODULE_1__["isExpression"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isPropertiesPaint", function() { return _typeHelpers__WEBPACK_IMPORTED_MODULE_1__["isPropertiesPaint"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isPaint", function() { return _typeHelpers__WEBPACK_IMPORTED_MODULE_1__["isPaint"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isBasePaint", function() { return _typeHelpers__WEBPACK_IMPORTED_MODULE_1__["isBasePaint"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isPaintCallback", function() { return _typeHelpers__WEBPACK_IMPORTED_MODULE_1__["isPaintCallback"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isIcon", function() { return _typeHelpers__WEBPACK_IMPORTED_MODULE_1__["isIcon"]; });

/* harmony import */ var _fromPaintExpression__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fromPaintExpression */ "./nextgis_frontend/packages/paint/src/fromPaintExpression.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createExpressionCallback", function() { return _fromPaintExpression__WEBPACK_IMPORTED_MODULE_2__["createExpressionCallback"]; });

/* harmony import */ var _preparePaint__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./preparePaint */ "./nextgis_frontend/packages/paint/src/preparePaint.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "preparePaint", function() { return _preparePaint__WEBPACK_IMPORTED_MODULE_3__["preparePaint"]; });







/***/ }),

/***/ "./nextgis_frontend/packages/paint/src/interfaces.ts":
/*!***********************************************************!*\
  !*** ./nextgis_frontend/packages/paint/src/interfaces.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./nextgis_frontend/packages/paint/src/preparePaint.ts":
/*!*************************************************************!*\
  !*** ./nextgis_frontend/packages/paint/src/preparePaint.ts ***!
  \*************************************************************/
/*! exports provided: preparePaint */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "preparePaint", function() { return preparePaint; });
/* harmony import */ var _nextgis_properties_filter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextgis/properties-filter */ "./nextgis_frontend/packages/properties-filter/src/index.ts");
/* harmony import */ var _typeHelpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./typeHelpers */ "./nextgis_frontend/packages/paint/src/typeHelpers.ts");
/* harmony import */ var _fromPaintExpression__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fromPaintExpression */ "./nextgis_frontend/packages/paint/src/fromPaintExpression.ts");
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



function updatePaintOptionFromCallback(paint, getPaintFunctions) {
    if (typeof paint.from === 'function') {
        return paint.from(paint.options);
    }
    else if (typeof paint.from === 'string' && getPaintFunctions) {
        var from = getPaintFunctions[paint.from];
        if (from) {
            return from(paint.options);
        }
    }
}
function createPropertiesPaint(propertiesPaint) {
    var mask = {};
    var paintsFilters = [];
    propertiesPaint.forEach(function (x) {
        if (x) {
            if (Array.isArray(x)) {
                paintsFilters.push(x);
            }
            else {
                mask = x;
            }
        }
    });
    return function (feature) {
        var paint = paintsFilters.find(function (x) { return Object(_nextgis_properties_filter__WEBPACK_IMPORTED_MODULE_0__["featureFilter"])(feature, x[0]); });
        if (paint) {
            return __assign(__assign({}, mask), paint[1]);
        }
        return mask;
    };
}
function preparePaint(paint, defaultPaint, getPaintFunctions) {
    var newPaint;
    if (Object(_typeHelpers__WEBPACK_IMPORTED_MODULE_1__["isPaintCallback"])(paint)) {
        var getPaintFunction = function (feature) {
            var getPaint = preparePaint(paint(feature), defaultPaint, getPaintFunctions);
            getPaint.type = paint.type;
            return getPaint;
        };
        getPaintFunction.type = paint.type;
        return getPaintFunction;
    }
    else if (Object(_typeHelpers__WEBPACK_IMPORTED_MODULE_1__["isPropertiesPaint"])(paint)) {
        return function (feature) {
            return preparePaint(createPropertiesPaint(paint)(feature), defaultPaint, getPaintFunctions);
        };
    }
    else if (paint.type === 'get-paint') {
        var getPaint = updatePaintOptionFromCallback(paint, getPaintFunctions);
        if (getPaint) {
            newPaint = preparePaint(getPaint, defaultPaint, getPaintFunctions);
        }
    }
    else if (paint.type === 'icon') {
        return paint;
    }
    else {
        var expressionCallback_1 = Object(_fromPaintExpression__WEBPACK_IMPORTED_MODULE_2__["createExpressionCallback"])(paint);
        if (expressionCallback_1) {
            return function (feature) {
                return preparePaint(expressionCallback_1(feature), defaultPaint, getPaintFunctions);
            };
        }
        newPaint = __assign({}, paint);
        newPaint.fill = newPaint.fill !== undefined ? newPaint.fill : true;
        newPaint.stroke =
            newPaint.stroke !== undefined
                ? newPaint.stroke
                : !newPaint.fill || !!(newPaint.strokeColor || newPaint.strokeOpacity);
    }
    if (newPaint) {
        if (Object(_typeHelpers__WEBPACK_IMPORTED_MODULE_1__["isPaintCallback"])(newPaint)) {
            return newPaint;
        }
        else if (Object(_typeHelpers__WEBPACK_IMPORTED_MODULE_1__["isPaint"])(newPaint)) {
            newPaint = __assign(__assign({}, defaultPaint), newPaint);
        }
    }
    else {
        newPaint = __assign({}, defaultPaint);
    }
    if ('color' in newPaint) {
        if (!newPaint.strokeColor) {
            newPaint.strokeColor = newPaint.color;
        }
        if (!newPaint.fillColor) {
            newPaint.fillColor = newPaint.color;
        }
    }
    if ('opacity' in newPaint) {
        if (newPaint.strokeOpacity === undefined) {
            newPaint.strokeOpacity = newPaint.opacity;
        }
        if (newPaint.fillOpacity === undefined) {
            newPaint.fillOpacity = newPaint.opacity;
        }
    }
    return newPaint;
}


/***/ }),

/***/ "./nextgis_frontend/packages/paint/src/typeHelpers.ts":
/*!************************************************************!*\
  !*** ./nextgis_frontend/packages/paint/src/typeHelpers.ts ***!
  \************************************************************/
/*! exports provided: isExpression, isPropertiesPaint, isPaint, isBasePaint, isPaintCallback, isIcon */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isExpression", function() { return isExpression; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPropertiesPaint", function() { return isPropertiesPaint; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPaint", function() { return isPaint; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isBasePaint", function() { return isBasePaint; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPaintCallback", function() { return isPaintCallback; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isIcon", function() { return isIcon; });
function isExpression(value) {
    if (Array.isArray(value)) {
        return true;
    }
    return false;
}
function isPropertiesPaint(paint) {
    if (Array.isArray(paint)) {
        return true;
    }
    return false;
}
function isPaint(paint) {
    if (Object.prototype.toString.call(paint) === '[object Object]') {
        return true;
    }
    return false;
}
function isBasePaint(paint) {
    if (isPaint(paint)) {
        if (paint.type === 'get-paint' || paint.type === 'icon') {
            return false;
        }
        return true;
    }
    return false;
}
function isPaintCallback(paint) {
    if (typeof paint === 'function') {
        return true;
    }
    return false;
}
function isIcon(paint) {
    return paint.type === 'icon' || 'html' in paint;
}


/***/ }),

/***/ "./nextgis_frontend/packages/properties-filter/src/index.ts":
/*!******************************************************************!*\
  !*** ./nextgis_frontend/packages/properties-filter/src/index.ts ***!
  \******************************************************************/
/*! exports provided: operationsAliases, checkIfPropertyFilter, featureFilter, propertiesFilter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _propertiesFilter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./propertiesFilter */ "./nextgis_frontend/packages/properties-filter/src/propertiesFilter.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "operationsAliases", function() { return _propertiesFilter__WEBPACK_IMPORTED_MODULE_0__["operationsAliases"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "checkIfPropertyFilter", function() { return _propertiesFilter__WEBPACK_IMPORTED_MODULE_0__["checkIfPropertyFilter"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "featureFilter", function() { return _propertiesFilter__WEBPACK_IMPORTED_MODULE_0__["featureFilter"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "propertiesFilter", function() { return _propertiesFilter__WEBPACK_IMPORTED_MODULE_0__["propertiesFilter"]; });




/***/ }),

/***/ "./nextgis_frontend/packages/properties-filter/src/propertiesFilter.ts":
/*!*****************************************************************************!*\
  !*** ./nextgis_frontend/packages/properties-filter/src/propertiesFilter.ts ***!
  \*****************************************************************************/
/*! exports provided: operationsAliases, checkIfPropertyFilter, featureFilter, propertiesFilter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "operationsAliases", function() { return operationsAliases; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkIfPropertyFilter", function() { return checkIfPropertyFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "featureFilter", function() { return featureFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "propertiesFilter", function() { return propertiesFilter; });
/* harmony import */ var _nextgis_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextgis/utils */ "./nextgis_frontend/packages/utils/src/index.ts");
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

function like(b, a, iLike) {
    a = String(a);
    b = String(b);
    if (a === b)
        return true;
    if (iLike && a.toUpperCase() === b.toUpperCase())
        return true;
    var re = ("^" + Object(_nextgis_utils__WEBPACK_IMPORTED_MODULE_0__["reEscape"])(a) + "$").replace(/%/g, '.*').replace('_', '.');
    return new RegExp(re, iLike ? 'i' : '').exec(b) !== null;
}
var operationsAliases = {
    gt: function (a, b) { return a > b; },
    lt: function (a, b) { return a < b; },
    ge: function (a, b) { return a >= b; },
    le: function (a, b) { return a <= b; },
    eq: function (a, b) { return a === b; },
    ne: function (a, b) { return a !== b; },
    in: function (a, b) { return b.indexOf(a) !== -1; },
    notin: function (a, b) { return b.indexOf(a) === -1; },
    like: function (a, b) {
        return like(a, b);
    },
    ilike: function (a, b) {
        return like(a, b, true);
    },
};
function checkIfPropertyFilter(filter) {
    var pf = filter;
    if (pf.length === 3 &&
        typeof pf[0] === 'string' &&
        typeof pf[1] === 'string') {
        return true;
    }
    return false;
}
function featureFilter(feature, filters) {
    var properties = __assign({}, feature.properties);
    if (properties) {
        properties.$id = feature.id;
        return propertiesFilter(properties, filters);
    }
    return false;
}
function propertiesFilter(properties, filters) {
    var logic = typeof filters[0] === 'string' ? filters[0] : 'all';
    var filterFunction = function (p) {
        if (checkIfPropertyFilter(p)) {
            var field_1 = p[0], operation = p[1], value_1 = p[2];
            var operationExec = operationsAliases[operation];
            if (operationExec) {
                if (operation === 'like' || operation === 'ilike') {
                    var prop_1 = '';
                    var value_ = field_1.replace(/^%?(\w+)%?$/, function (match, cleanField) {
                        prop_1 = properties[cleanField];
                        return field_1.replace(cleanField, value_1);
                    });
                    return operationExec(prop_1, value_);
                }
                return operationExec(properties[field_1], value_1);
            }
            return false;
        }
        else {
            return propertiesFilter(properties, p);
        }
    };
    var filters_ = filters.filter(function (x) { return Array.isArray(x); });
    return logic === 'any'
        ? filters_.some(filterFunction)
        : filters_.every(filterFunction);
}


/***/ }),

/***/ "./nextgis_frontend/packages/qms-kit/src/QmsKit.ts":
/*!*********************************************************!*\
  !*** ./nextgis_frontend/packages/qms-kit/src/QmsKit.ts ***!
  \*********************************************************/
/*! exports provided: QmsKit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QmsKit", function() { return QmsKit; });
/* harmony import */ var _utils_createQmsAdapter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/createQmsAdapter */ "./nextgis_frontend/packages/qms-kit/src/utils/createQmsAdapter.ts");
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

var QmsKit = (function () {
    function QmsKit(options) {
        this.options = {
            url: 'https://qms.nextgis.com',
        };
        this.options = __assign(__assign({}, this.options), options);
        this.url = this.options.url;
    }
    QmsKit.prototype.getLayerAdapters = function () {
        var _this = this;
        return Promise.resolve([
            {
                name: 'QMS',
                createAdapter: function (webmap) {
                    return Promise.resolve(_this._createAdapter(webmap));
                },
            },
        ]);
    };
    QmsKit.prototype._createAdapter = function (webMap) {
        return Object(_utils_createQmsAdapter__WEBPACK_IMPORTED_MODULE_0__["createQmsAdapter"])(webMap, this.url);
    };
    QmsKit.utils = {
        createQmsAdapter: _utils_createQmsAdapter__WEBPACK_IMPORTED_MODULE_0__["createQmsAdapter"],
    };
    return QmsKit;
}());



/***/ }),

/***/ "./nextgis_frontend/packages/qms-kit/src/index.ts":
/*!********************************************************!*\
  !*** ./nextgis_frontend/packages/qms-kit/src/index.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _QmsKit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./QmsKit */ "./nextgis_frontend/packages/qms-kit/src/QmsKit.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "QmsKit", function() { return _QmsKit__WEBPACK_IMPORTED_MODULE_0__["QmsKit"]; });

/* harmony import */ var _interfaces__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./interfaces */ "./nextgis_frontend/packages/qms-kit/src/interfaces.ts");
/* harmony import */ var _interfaces__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_interfaces__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _interfaces__WEBPACK_IMPORTED_MODULE_1__) if(["QmsKit","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _interfaces__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));



/* harmony default export */ __webpack_exports__["default"] = (_QmsKit__WEBPACK_IMPORTED_MODULE_0__["QmsKit"]);


/***/ }),

/***/ "./nextgis_frontend/packages/qms-kit/src/interfaces.ts":
/*!*************************************************************!*\
  !*** ./nextgis_frontend/packages/qms-kit/src/interfaces.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./nextgis_frontend/packages/qms-kit/src/utils/createQmsAdapter.ts":
/*!*************************************************************************!*\
  !*** ./nextgis_frontend/packages/qms-kit/src/utils/createQmsAdapter.ts ***!
  \*************************************************************************/
/*! exports provided: createQmsAdapter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createQmsAdapter", function() { return createQmsAdapter; });
/* harmony import */ var _nextgis_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextgis/utils */ "./nextgis_frontend/packages/utils/src/index.ts");
/* harmony import */ var _updateQmsOptions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./updateQmsOptions */ "./nextgis_frontend/packages/qms-kit/src/utils/updateQmsOptions.ts");
/* harmony import */ var _loadJson__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./loadJson */ "./nextgis_frontend/packages/qms-kit/src/utils/loadJson.ts");
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



function createQmsAdapter(webMap, url) {
    if (url === void 0) { url = 'https://qms.nextgis.com'; }
    var QmsAdapter = (function () {
        function QmsAdapter(map, options) {
            this.map = map;
            this.options = options;
            this.options.baselayer = true;
        }
        QmsAdapter.prototype.addLayer = function (options) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, er_1, qms, type, webMapAdapter, adapter;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(!this.qms && options.qmsId)) return [3, 4];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            _a = this;
                            return [4, Object(_loadJson__WEBPACK_IMPORTED_MODULE_2__["loadJson"])(url + '/api/v1/geoservices/' + options.qmsId)];
                        case 2:
                            _a.qms = _b.sent();
                            return [3, 4];
                        case 3:
                            er_1 = _b.sent();
                            console.error(er_1);
                            return [3, 4];
                        case 4:
                            qms = this.qms;
                            if (qms) {
                                type = _updateQmsOptions__WEBPACK_IMPORTED_MODULE_1__["alias"][qms.type || 'tms'];
                                webMapAdapter = webMap.mapAdapter.layerAdapters[type];
                                if (webMapAdapter) {
                                    Object(_nextgis_utils__WEBPACK_IMPORTED_MODULE_0__["mixinProperties"])(QmsAdapter, webMapAdapter, [
                                        'showLayer',
                                        'hideLayer',
                                    ]);
                                    if (type === 'TILE') {
                                        options = __assign(__assign({ order: 0, maxZoom: webMap.options.maxZoom, minZoom: webMap.options.minZoom }, this.options), Object(_updateQmsOptions__WEBPACK_IMPORTED_MODULE_1__["updateQmsOptions"])(qms));
                                        this.options = options;
                                        adapter = new webMapAdapter(this.map, options);
                                        return [2, adapter.addLayer(options)];
                                    }
                                }
                            }
                            return [2];
                    }
                });
            });
        };
        return QmsAdapter;
    }());
    return QmsAdapter;
}


/***/ }),

/***/ "./nextgis_frontend/packages/qms-kit/src/utils/loadJson.ts":
/*!*****************************************************************!*\
  !*** ./nextgis_frontend/packages/qms-kit/src/utils/loadJson.ts ***!
  \*****************************************************************/
/*! exports provided: loadJson */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadJson", function() { return loadJson; });
/* harmony import */ var _nextgis_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextgis/utils */ "./nextgis_frontend/packages/utils/src/index.ts");

function loadJson(url) {
    return new Promise(function (resolve, reject) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                if (xmlHttp.responseText) {
                    try {
                        resolve(JSON.parse(xmlHttp.responseText));
                    }
                    catch (er) {
                        reject(er);
                    }
                }
            }
        };
        xmlHttp.open('GET', Object(_nextgis_utils__WEBPACK_IMPORTED_MODULE_0__["fixUrlStr"])(url), true);
        xmlHttp.send();
    });
}


/***/ }),

/***/ "./nextgis_frontend/packages/qms-kit/src/utils/updateQmsOptions.ts":
/*!*************************************************************************!*\
  !*** ./nextgis_frontend/packages/qms-kit/src/utils/updateQmsOptions.ts ***!
  \*************************************************************************/
/*! exports provided: alias, updateQmsOptions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "alias", function() { return alias; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateQmsOptions", function() { return updateQmsOptions; });
var alias = {
    tms: 'TILE',
};
function updateQmsOptions(qms) {
    var protocol = (location.protocol === 'https:' ? 'https' : 'http') + '://';
    var serviceUrl = qms.url.replace(/^(https?|ftp):\/\//, protocol);
    if (!qms.y_origin_top) {
        serviceUrl = serviceUrl.replace('{y}', '{-y}');
    }
    return {
        url: serviceUrl,
        name: qms.name,
        attribution: qms.copyright_text,
        maxZoom: qms.z_max,
        minZoom: qms.z_min,
    };
}


/***/ }),

/***/ "./nextgis_frontend/packages/url-runtime-params/src/UrlRuntimeParams.ts":
/*!******************************************************************************!*\
  !*** ./nextgis_frontend/packages/url-runtime-params/src/UrlRuntimeParams.ts ***!
  \******************************************************************************/
/*! exports provided: UrlRuntimeParams */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UrlRuntimeParams", function() { return UrlRuntimeParams; });
var UrlRuntimeParams = (function () {
    function UrlRuntimeParams() {
        this._params = {};
    }
    UrlRuntimeParams.prototype.get = function (name) {
        return this.params()[name];
    };
    UrlRuntimeParams.prototype.params = function () {
        var params = {};
        window.location.href.replace(/[?&]+(\w+)([^&]*)/gi, function (m, key) {
            params[key] = true;
            return '';
        });
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            params[key] = decodeURIComponent(value);
            return '';
        });
        this._params = params;
        return params;
    };
    UrlRuntimeParams.prototype.set = function (name, value) {
        if (value) {
            var search = void 0;
            var urlComponent = encodeURIComponent(value);
            var existUrlParam = this.get(name);
            if (existUrlParam) {
                search = location.search.replace(new RegExp('([?|&]' + name + '=)' + '(.+?)(&|$)'), '$1' + urlComponent + '$3');
            }
            else if (location.search.length) {
                search = location.search + '&' + name + '=' + urlComponent;
            }
            else {
                search = '?' + name + '=' + urlComponent;
            }
            var params = {};
            params[name] = value;
            this._params[name] = value;
            var data = { state: { url: search, params: params }, url: search };
            this._pushState(data);
            return data;
        }
        else {
            return this.remove(name);
        }
    };
    UrlRuntimeParams.prototype.remove = function (name) {
        var sourceUrl = location.search;
        var rtn = sourceUrl.split('?')[0];
        var param;
        var paramsArr;
        var queryString = sourceUrl.indexOf('?') !== -1 ? sourceUrl.split('?')[1] : '';
        if (queryString !== '') {
            paramsArr = queryString.split('&');
            for (var i = paramsArr.length - 1; i >= 0; i -= 1) {
                param = paramsArr[i].split('=')[0];
                if (param === name) {
                    paramsArr.splice(i, 1);
                }
            }
            rtn = rtn + '?' + paramsArr.join('&');
        }
        delete this._params[name];
        var data = { state: { url: rtn, type: 'remove' }, url: rtn };
        this._pushState(data);
        return data;
    };
    UrlRuntimeParams.prototype._pushState = function (data) {
        if (history) {
            history.replaceState(data.state, document.title, data.url);
        }
    };
    return UrlRuntimeParams;
}());



/***/ }),

/***/ "./nextgis_frontend/packages/url-runtime-params/src/index.ts":
/*!*******************************************************************!*\
  !*** ./nextgis_frontend/packages/url-runtime-params/src/index.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _UrlRuntimeParams__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UrlRuntimeParams */ "./nextgis_frontend/packages/url-runtime-params/src/UrlRuntimeParams.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UrlRuntimeParams", function() { return _UrlRuntimeParams__WEBPACK_IMPORTED_MODULE_0__["UrlRuntimeParams"]; });

/* harmony import */ var _interfaces__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./interfaces */ "./nextgis_frontend/packages/url-runtime-params/src/interfaces.ts");
/* harmony import */ var _interfaces__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_interfaces__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _interfaces__WEBPACK_IMPORTED_MODULE_1__) if(["UrlRuntimeParams","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _interfaces__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));



/* harmony default export */ __webpack_exports__["default"] = (_UrlRuntimeParams__WEBPACK_IMPORTED_MODULE_0__["UrlRuntimeParams"]);


/***/ }),

/***/ "./nextgis_frontend/packages/url-runtime-params/src/interfaces.ts":
/*!************************************************************************!*\
  !*** ./nextgis_frontend/packages/url-runtime-params/src/interfaces.ts ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./nextgis_frontend/packages/utils/src/Clipboard.ts":
/*!**********************************************************!*\
  !*** ./nextgis_frontend/packages/utils/src/Clipboard.ts ***!
  \**********************************************************/
/*! exports provided: Clipboard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Clipboard", function() { return Clipboard; });
var Clipboard = (function () {
    function Clipboard(text) {
        if (text) {
            this.copy(text);
        }
    }
    Clipboard.copy = function (text) {
        return new Clipboard(text);
    };
    Clipboard.prototype.copy = function (text) {
        try {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text);
            }
            else if (window.clipboardData) {
                window.clipboardData.setData('text', text);
            }
            else {
                this.copyToClipboard(text);
            }
            console.log('Copied to Clipboard');
        }
        catch (e) {
            console.log('Please copy coupon manually');
        }
    };
    Clipboard.prototype.copyToClipboard = function (text) {
        var input = document.createElement('input');
        input.value = text;
        try {
            document.body.appendChild(input);
            this.copyNodeContentsToClipboard(input);
        }
        finally {
            document.body.removeChild(input);
        }
    };
    Clipboard.prototype.copyNodeContentsToClipboard = function (input) {
        input.select();
        input.setSelectionRange(0, 99999);
        document.execCommand('copy');
    };
    return Clipboard;
}());



/***/ }),

/***/ "./nextgis_frontend/packages/utils/src/applyMixins.ts":
/*!************************************************************!*\
  !*** ./nextgis_frontend/packages/utils/src/applyMixins.ts ***!
  \************************************************************/
/*! exports provided: applyMixins, mixinProperties */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "applyMixins", function() { return applyMixins; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mixinProperties", function() { return mixinProperties; });
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            var descriptor = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
            if (descriptor) {
                Object.defineProperty(derivedCtor.prototype, name, descriptor);
            }
        });
    });
}
function mixinProperties(derivedCtor, baseCtor, properties) {
    properties.forEach(function (name) {
        var descriptor = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
        if (descriptor) {
            Object.defineProperty(derivedCtor.prototype, name, descriptor);
        }
    });
}


/***/ }),

/***/ "./nextgis_frontend/packages/utils/src/array/arrayCompare.ts":
/*!*******************************************************************!*\
  !*** ./nextgis_frontend/packages/utils/src/array/arrayCompare.ts ***!
  \*******************************************************************/
/*! exports provided: arrayCompare */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "arrayCompare", function() { return arrayCompare; });
function arrayCompare(array1, array2) {
    array1 = Array.from(array1);
    array2 = Array.from(array2);
    return (array1.length === array2.length &&
        array1.sort().every(function (value, index) {
            return value === array2.sort()[index];
        }));
}


/***/ }),

/***/ "./nextgis_frontend/packages/utils/src/array/arrayUnique.ts":
/*!******************************************************************!*\
  !*** ./nextgis_frontend/packages/utils/src/array/arrayUnique.ts ***!
  \******************************************************************/
/*! exports provided: arrayUnique */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "arrayUnique", function() { return arrayUnique; });
function arrayUnique(arr) {
    return arr.filter(function (elem, pos, arr) {
        return arr.indexOf(elem) == pos;
    });
}


/***/ }),

/***/ "./nextgis_frontend/packages/utils/src/array/index.ts":
/*!************************************************************!*\
  !*** ./nextgis_frontend/packages/utils/src/array/index.ts ***!
  \************************************************************/
/*! exports provided: arrayCompare, arrayUnique */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arrayCompare__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayCompare */ "./nextgis_frontend/packages/utils/src/array/arrayCompare.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "arrayCompare", function() { return _arrayCompare__WEBPACK_IMPORTED_MODULE_0__["arrayCompare"]; });

/* harmony import */ var _arrayUnique__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./arrayUnique */ "./nextgis_frontend/packages/utils/src/array/arrayUnique.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "arrayUnique", function() { return _arrayUnique__WEBPACK_IMPORTED_MODULE_1__["arrayUnique"]; });





/***/ }),

/***/ "./nextgis_frontend/packages/utils/src/debounce.ts":
/*!*********************************************************!*\
  !*** ./nextgis_frontend/packages/utils/src/debounce.ts ***!
  \*********************************************************/
/*! exports provided: debounce */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "debounce", function() { return debounce; });
function debounce(cb, wait) {
    if (wait === void 0) { wait = 10; }
    var h = 0;
    var callable = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        clearTimeout(h);
        h = window.setTimeout(function () { return cb.apply(void 0, args); }, wait);
    };
    return callable;
}


/***/ }),

/***/ "./nextgis_frontend/packages/utils/src/deepmerge.ts":
/*!**********************************************************!*\
  !*** ./nextgis_frontend/packages/utils/src/deepmerge.ts ***!
  \**********************************************************/
/*! exports provided: deepmerge */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deepmerge", function() { return deepmerge; });
function deepmerge(target, src, mergeArray) {
    if (mergeArray === void 0) { mergeArray = false; }
    var target_ = target;
    var src_ = src;
    var array = Array.isArray(src_);
    var dst = (array && []) || {};
    if (array && Array.isArray(src_)) {
        if (mergeArray) {
            target_ = target_ || [];
            dst = dst.concat(target_);
            src_.forEach(function (e, i) {
                if (typeof dst[i] === 'undefined') {
                    dst[i] = e;
                }
                else if (typeof e === 'object') {
                    dst[i] = deepmerge(target_[i], e, mergeArray);
                }
                else {
                    if (target_.indexOf(e) === -1) {
                        dst.push(e);
                    }
                }
            });
        }
        else {
            dst = src_;
        }
    }
    else {
        if (target_ && typeof target_ === 'object') {
            Object.keys(target_).forEach(function (key) {
                dst[key] = target_[key];
            });
        }
        Object.keys(src_).forEach(function (key) {
            if (typeof src_[key] !== 'object' || !src_[key]) {
                dst[key] = src_[key];
            }
            else {
                if (typeof target_[key] === 'object' && typeof src_[key] === 'object') {
                    dst[key] = deepmerge(target_[key], src_[key], mergeArray);
                }
                else {
                    dst[key] = src_[key];
                }
            }
        });
    }
    return dst;
}


/***/ }),

/***/ "./nextgis_frontend/packages/utils/src/defined.ts":
/*!********************************************************!*\
  !*** ./nextgis_frontend/packages/utils/src/defined.ts ***!
  \********************************************************/
/*! exports provided: defined */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defined", function() { return defined; });
function defined(value) {
    return value !== undefined && value !== null;
}


/***/ }),

/***/ "./nextgis_frontend/packages/utils/src/events.ts":
/*!*******************************************************!*\
  !*** ./nextgis_frontend/packages/utils/src/events.ts ***!
  \*******************************************************/
/*! exports provided: Events */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Events", function() { return Events; });
var Events = (function () {
    function Events(emitter) {
        this.emitter = emitter;
        this._eventsStatus = {};
    }
    Events.prototype.setEventStatus = function (event, status) {
        this._eventsStatus[event] = status;
    };
    Events.prototype.onLoad = function (event) {
        var _this = this;
        var events = Array.isArray(event) ? event : [event];
        var promises = events.map(function (x) {
            return new Promise(function (res) {
                if (_this.getEventStatus(x)) {
                    res(_this);
                }
                else {
                    var e = x;
                    _this.emitter.once(e, function () {
                        _this.setEventStatus(x, true);
                        res(_this);
                    });
                }
            });
        });
        return Promise.all(promises).then(function () { return _this; });
    };
    Events.prototype.getEventStatus = function (event) {
        var _eventName = event;
        var status = this._eventsStatus[_eventName];
        return status !== undefined ? !!status : false;
    };
    return Events;
}());



/***/ }),

/***/ "./nextgis_frontend/packages/utils/src/index.ts":
/*!******************************************************!*\
  !*** ./nextgis_frontend/packages/utils/src/index.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bindAll", function() { return bindAll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isObject", function() { return isObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isArray", function() { return isArray; });
/* harmony import */ var _platform__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./platform */ "./nextgis_frontend/packages/utils/src/platform.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isBrowser", function() { return _platform__WEBPACK_IMPORTED_MODULE_0__["isBrowser"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "type", function() { return _platform__WEBPACK_IMPORTED_MODULE_0__["type"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getGlobalVariable", function() { return _platform__WEBPACK_IMPORTED_MODULE_0__["getGlobalVariable"]; });

/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./events */ "./nextgis_frontend/packages/utils/src/events.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Events", function() { return _events__WEBPACK_IMPORTED_MODULE_1__["Events"]; });

/* harmony import */ var _array__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./array */ "./nextgis_frontend/packages/utils/src/array/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "arrayCompare", function() { return _array__WEBPACK_IMPORTED_MODULE_2__["arrayCompare"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "arrayUnique", function() { return _array__WEBPACK_IMPORTED_MODULE_2__["arrayUnique"]; });

/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./object */ "./nextgis_frontend/packages/utils/src/object/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "objectAssign", function() { return _object__WEBPACK_IMPORTED_MODULE_3__["objectAssign"]; });

/* harmony import */ var _string__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./string */ "./nextgis_frontend/packages/utils/src/string/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "capitalize", function() { return _string__WEBPACK_IMPORTED_MODULE_4__["capitalize"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "numberWithSpaces", function() { return _string__WEBPACK_IMPORTED_MODULE_4__["numberWithSpaces"]; });

/* harmony import */ var _re__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./re */ "./nextgis_frontend/packages/utils/src/re/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "reEscape", function() { return _re__WEBPACK_IMPORTED_MODULE_5__["reEscape"]; });

/* harmony import */ var _url__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./url */ "./nextgis_frontend/packages/utils/src/url.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "fixUrlStr", function() { return _url__WEBPACK_IMPORTED_MODULE_6__["fixUrlStr"]; });

/* harmony import */ var _sleep__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./sleep */ "./nextgis_frontend/packages/utils/src/sleep.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "sleep", function() { return _sleep__WEBPACK_IMPORTED_MODULE_7__["sleep"]; });

/* harmony import */ var _defined__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./defined */ "./nextgis_frontend/packages/utils/src/defined.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "defined", function() { return _defined__WEBPACK_IMPORTED_MODULE_8__["defined"]; });

/* harmony import */ var _typeHelpers__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./typeHelpers */ "./nextgis_frontend/packages/utils/src/typeHelpers/index.ts");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _typeHelpers__WEBPACK_IMPORTED_MODULE_9__) if(["bindAll","isObject","isArray","isBrowser","type","getGlobalVariable","Events","arrayCompare","arrayUnique","objectAssign","capitalize","numberWithSpaces","reEscape","fixUrlStr","sleep","defined","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _typeHelpers__WEBPACK_IMPORTED_MODULE_9__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _applyMixins__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./applyMixins */ "./nextgis_frontend/packages/utils/src/applyMixins.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "applyMixins", function() { return _applyMixins__WEBPACK_IMPORTED_MODULE_10__["applyMixins"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "mixinProperties", function() { return _applyMixins__WEBPACK_IMPORTED_MODULE_10__["mixinProperties"]; });

/* harmony import */ var _deepmerge__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./deepmerge */ "./nextgis_frontend/packages/utils/src/deepmerge.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "deepmerge", function() { return _deepmerge__WEBPACK_IMPORTED_MODULE_11__["deepmerge"]; });

/* harmony import */ var _debounce__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./debounce */ "./nextgis_frontend/packages/utils/src/debounce.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "debounce", function() { return _debounce__WEBPACK_IMPORTED_MODULE_12__["debounce"]; });

/* harmony import */ var _Clipboard__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./Clipboard */ "./nextgis_frontend/packages/utils/src/Clipboard.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Clipboard", function() { return _Clipboard__WEBPACK_IMPORTED_MODULE_13__["Clipboard"]; });















function bindAll(fns, context) {
    fns.forEach(function (fn) {
        if (!context[fn]) {
            return;
        }
        context[fn] = context[fn].bind(context);
    });
}
function isObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
}
function isArray(val) {
    return Object.prototype.toString.call(val) === '[object Array]';
}


/***/ }),

/***/ "./nextgis_frontend/packages/utils/src/object/assign.ts":
/*!**************************************************************!*\
  !*** ./nextgis_frontend/packages/utils/src/object/assign.ts ***!
  \**************************************************************/
/*! exports provided: assign */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "assign", function() { return assign; });
function assign(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    for (var _a = 0, sources_1 = sources; _a < sources_1.length; _a++) {
        var source = sources_1[_a];
        for (var _b = 0, _c = Object.getOwnPropertyNames(source); _b < _c.length; _b++) {
            var prop = _c[_b];
            target[prop] = source[prop];
        }
    }
}


/***/ }),

/***/ "./nextgis_frontend/packages/utils/src/object/index.ts":
/*!*************************************************************!*\
  !*** ./nextgis_frontend/packages/utils/src/object/index.ts ***!
  \*************************************************************/
/*! exports provided: objectAssign */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assign__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assign */ "./nextgis_frontend/packages/utils/src/object/assign.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "objectAssign", function() { return _assign__WEBPACK_IMPORTED_MODULE_0__["assign"]; });





/***/ }),

/***/ "./nextgis_frontend/packages/utils/src/platform.ts":
/*!*********************************************************!*\
  !*** ./nextgis_frontend/packages/utils/src/platform.ts ***!
  \*********************************************************/
/*! exports provided: isBrowser, type, getGlobalVariable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isBrowser", function() { return isBrowser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "type", function() { return type; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getGlobalVariable", function() { return getGlobalVariable; });
var isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
var type = isBrowser ? 'browser' : 'node';
function getGlobalVariable() {
    if (isBrowser) {
        return window;
    }
    else {
        return global;
    }
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./nextgis_frontend/packages/utils/src/re/index.ts":
/*!*********************************************************!*\
  !*** ./nextgis_frontend/packages/utils/src/re/index.ts ***!
  \*********************************************************/
/*! exports provided: reEscape */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _reEscape__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reEscape */ "./nextgis_frontend/packages/utils/src/re/reEscape.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "reEscape", function() { return _reEscape__WEBPACK_IMPORTED_MODULE_0__["reEscape"]; });




/***/ }),

/***/ "./nextgis_frontend/packages/utils/src/re/reEscape.ts":
/*!************************************************************!*\
  !*** ./nextgis_frontend/packages/utils/src/re/reEscape.ts ***!
  \************************************************************/
/*! exports provided: reEscape */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reEscape", function() { return reEscape; });
function reEscape(s) {
    return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}


/***/ }),

/***/ "./nextgis_frontend/packages/utils/src/sleep.ts":
/*!******************************************************!*\
  !*** ./nextgis_frontend/packages/utils/src/sleep.ts ***!
  \******************************************************/
/*! exports provided: sleep */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sleep", function() { return sleep; });
function sleep(delay) {
    if (delay === void 0) { delay = 0; }
    return new Promise(function (resolve) { return setTimeout(resolve, delay); });
}


/***/ }),

/***/ "./nextgis_frontend/packages/utils/src/string/capitalize.ts":
/*!******************************************************************!*\
  !*** ./nextgis_frontend/packages/utils/src/string/capitalize.ts ***!
  \******************************************************************/
/*! exports provided: capitalize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "capitalize", function() { return capitalize; });
function capitalize(str) {
    str = String(str).toLowerCase();
    return str[0].toUpperCase() + str.slice(1);
}


/***/ }),

/***/ "./nextgis_frontend/packages/utils/src/string/index.ts":
/*!*************************************************************!*\
  !*** ./nextgis_frontend/packages/utils/src/string/index.ts ***!
  \*************************************************************/
/*! exports provided: capitalize, numberWithSpaces */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _capitalize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./capitalize */ "./nextgis_frontend/packages/utils/src/string/capitalize.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "capitalize", function() { return _capitalize__WEBPACK_IMPORTED_MODULE_0__["capitalize"]; });

/* harmony import */ var _numberWithSpaces__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./numberWithSpaces */ "./nextgis_frontend/packages/utils/src/string/numberWithSpaces.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "numberWithSpaces", function() { return _numberWithSpaces__WEBPACK_IMPORTED_MODULE_1__["numberWithSpaces"]; });





/***/ }),

/***/ "./nextgis_frontend/packages/utils/src/string/numberWithSpaces.ts":
/*!************************************************************************!*\
  !*** ./nextgis_frontend/packages/utils/src/string/numberWithSpaces.ts ***!
  \************************************************************************/
/*! exports provided: numberWithSpaces */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "numberWithSpaces", function() { return numberWithSpaces; });
function numberWithSpaces(x) {
    var parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join('.');
}


/***/ }),

/***/ "./nextgis_frontend/packages/utils/src/typeHelpers/DeepPartial.ts":
/*!************************************************************************!*\
  !*** ./nextgis_frontend/packages/utils/src/typeHelpers/DeepPartial.ts ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./nextgis_frontend/packages/utils/src/typeHelpers/Type.ts":
/*!*****************************************************************!*\
  !*** ./nextgis_frontend/packages/utils/src/typeHelpers/Type.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./nextgis_frontend/packages/utils/src/typeHelpers/index.ts":
/*!******************************************************************!*\
  !*** ./nextgis_frontend/packages/utils/src/typeHelpers/index.ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DeepPartial__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DeepPartial */ "./nextgis_frontend/packages/utils/src/typeHelpers/DeepPartial.ts");
/* harmony import */ var _DeepPartial__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_DeepPartial__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _DeepPartial__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _DeepPartial__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _Type__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Type */ "./nextgis_frontend/packages/utils/src/typeHelpers/Type.ts");
/* harmony import */ var _Type__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_Type__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Type__WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Type__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));




/***/ }),

/***/ "./nextgis_frontend/packages/utils/src/url.ts":
/*!****************************************************!*\
  !*** ./nextgis_frontend/packages/utils/src/url.ts ***!
  \****************************************************/
/*! exports provided: fixUrlStr */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fixUrlStr", function() { return fixUrlStr; });
function fixUrlStr(url) {
    return url.replace(/([^:]\/)\/+/g, '$1');
}


/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/WebMap.ts":
/*!********************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/WebMap.ts ***!
  \********************************************************/
/*! exports provided: WebMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebMap", function() { return WebMap; });
/* harmony import */ var _WebMapControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./WebMapControls */ "./nextgis_frontend/packages/webmap/src/WebMapControls.ts");
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
var __asyncValues = (undefined && undefined.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};

var WebMap = (function (_super) {
    __extends(WebMap, _super);
    function WebMap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebMap.prototype._addLayerProviders = function () {
        var e_1, _a, e_2, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _c, _d, kit, adapters, adapters_1, adapters_1_1, adapter, newAdapter, e_2_1, e_1_1, er_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 26, , 27]);
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 19, 20, 25]);
                        _c = __asyncValues(this._starterKits);
                        _e.label = 2;
                    case 2: return [4, _c.next()];
                    case 3:
                        if (!(_d = _e.sent(), !_d.done)) return [3, 18];
                        kit = _d.value;
                        if (!kit.getLayerAdapters) return [3, 17];
                        return [4, kit.getLayerAdapters.call(kit)];
                    case 4:
                        adapters = _e.sent();
                        if (!adapters) return [3, 17];
                        _e.label = 5;
                    case 5:
                        _e.trys.push([5, 11, 12, 17]);
                        adapters_1 = (e_2 = void 0, __asyncValues(adapters));
                        _e.label = 6;
                    case 6: return [4, adapters_1.next()];
                    case 7:
                        if (!(adapters_1_1 = _e.sent(), !adapters_1_1.done)) return [3, 10];
                        adapter = adapters_1_1.value;
                        return [4, adapter.createAdapter(this)];
                    case 8:
                        newAdapter = _e.sent();
                        if (newAdapter) {
                            this.mapAdapter.layerAdapters[adapter.name] = newAdapter;
                        }
                        _e.label = 9;
                    case 9: return [3, 6];
                    case 10: return [3, 17];
                    case 11:
                        e_2_1 = _e.sent();
                        e_2 = { error: e_2_1 };
                        return [3, 17];
                    case 12:
                        _e.trys.push([12, , 15, 16]);
                        if (!(adapters_1_1 && !adapters_1_1.done && (_b = adapters_1.return))) return [3, 14];
                        return [4, _b.call(adapters_1)];
                    case 13:
                        _e.sent();
                        _e.label = 14;
                    case 14: return [3, 16];
                    case 15:
                        if (e_2) throw e_2.error;
                        return [7];
                    case 16: return [7];
                    case 17: return [3, 2];
                    case 18: return [3, 25];
                    case 19:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3, 25];
                    case 20:
                        _e.trys.push([20, , 23, 24]);
                        if (!(_d && !_d.done && (_a = _c.return))) return [3, 22];
                        return [4, _a.call(_c)];
                    case 21:
                        _e.sent();
                        _e.label = 22;
                    case 22: return [3, 24];
                    case 23:
                        if (e_1) throw e_1.error;
                        return [7];
                    case 24: return [7];
                    case 25: return [3, 27];
                    case 26:
                        er_1 = _e.sent();
                        throw new Error(er_1);
                    case 27: return [2];
                }
            });
        });
    };
    WebMap.prototype._onLoadSync = function () {
        var e_3, _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, _c, kit, er_2, e_3_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 8, 9, 14]);
                        _b = __asyncValues(this._starterKits);
                        _d.label = 1;
                    case 1: return [4, _b.next()];
                    case 2:
                        if (!(_c = _d.sent(), !_c.done)) return [3, 7];
                        kit = _c.value;
                        if (!kit.onLoadSync) return [3, 6];
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 5, , 6]);
                        return [4, kit.onLoadSync.call(kit, this)];
                    case 4:
                        _d.sent();
                        return [3, 6];
                    case 5:
                        er_2 = _d.sent();
                        console.error(er_2);
                        return [3, 6];
                    case 6: return [3, 1];
                    case 7: return [3, 14];
                    case 8:
                        e_3_1 = _d.sent();
                        e_3 = { error: e_3_1 };
                        return [3, 14];
                    case 9:
                        _d.trys.push([9, , 12, 13]);
                        if (!(_c && !_c.done && (_a = _b.return))) return [3, 11];
                        return [4, _a.call(_b)];
                    case 10:
                        _d.sent();
                        _d.label = 11;
                    case 11: return [3, 13];
                    case 12:
                        if (e_3) throw e_3.error;
                        return [7];
                    case 13: return [7];
                    case 14: return [2];
                }
            });
        });
    };
    return WebMap;
}(_WebMapControls__WEBPACK_IMPORTED_MODULE_0__["WebMapControls"]));



/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/WebMapControls.ts":
/*!****************************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/WebMapControls.ts ***!
  \****************************************************************/
/*! exports provided: WebMapControls */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebMapControls", function() { return WebMapControls; });
/* harmony import */ var _WebMapLayers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./WebMapLayers */ "./nextgis_frontend/packages/webmap/src/WebMapLayers.ts");
/* harmony import */ var _components_controls_createToggleControl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/controls/createToggleControl */ "./nextgis_frontend/packages/webmap/src/components/controls/createToggleControl.ts");
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


var WebMapControls = (function (_super) {
    __extends(WebMapControls, _super);
    function WebMapControls() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._loadControlQueue = {
            'top-right': [],
            'bottom-right': [],
            'top-left': [],
            'bottom-left': [],
        };
        _this._isControlLoading = {
            'top-right': false,
            'bottom-right': false,
            'top-left': false,
            'bottom-left': false,
        };
        return _this;
    }
    WebMapControls.prototype.addControl = function (controlDef, position, options) {
        return __awaiter(this, void 0, void 0, function () {
            var control;
            var _this = this;
            return __generator(this, function (_a) {
                position = position !== null && position !== void 0 ? position : 'top-left';
                if (typeof controlDef === 'string') {
                    control = this.getControl(controlDef, options);
                }
                else {
                    control = controlDef;
                }
                if (control) {
                    return [2, new Promise(function (resolve) {
                            var promise = function () { return __awaiter(_this, void 0, void 0, function () {
                                var _control, c;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, control];
                                        case 1:
                                            _control = _a.sent();
                                            c = this.mapAdapter.addControl(_control, position);
                                            resolve(c);
                                            return [2];
                                    }
                                });
                            }); };
                            _this._setControlQueue(position, promise);
                        })];
                }
                return [2];
            });
        });
    };
    WebMapControls.prototype.createControl = function (control, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.onLoad('build-map')];
                    case 1:
                        _a.sent();
                        if (this.mapAdapter.createControl) {
                            return [2, this.mapAdapter.createControl(control, options)];
                        }
                        return [2];
                }
            });
        });
    };
    WebMapControls.prototype.createButtonControl = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.onLoad('build-map')];
                    case 1:
                        _a.sent();
                        if (this.mapAdapter.createButtonControl) {
                            return [2, this.mapAdapter.createButtonControl(options)];
                        }
                        return [2];
                }
            });
        });
    };
    WebMapControls.prototype.createToggleControl = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.onLoad('build-map')];
                    case 1:
                        _a.sent();
                        if (this.mapAdapter.createToggleControl) {
                            return [2, this.mapAdapter.createToggleControl(options)];
                        }
                        else {
                            if (this.mapAdapter.createButtonControl) {
                                return [2, Object(_components_controls_createToggleControl__WEBPACK_IMPORTED_MODULE_1__["createToggleControl"])(this.mapAdapter.createButtonControl, options)];
                            }
                        }
                        return [2];
                }
            });
        });
    };
    WebMapControls.prototype.removeControl = function (control) {
        if ('remove' in control) {
            control.remove();
        }
        else if (this.mapAdapter.removeControl) {
            this.mapAdapter.removeControl(control);
        }
    };
    WebMapControls.prototype.getControl = function (control, options) {
        var engine = this.mapAdapter.controlAdapters[control];
        if (engine) {
            return new engine(options);
        }
        else {
            var createFun = WebMapControls.controls[control];
            if (createFun) {
                return createFun(this, options);
            }
        }
    };
    WebMapControls.prototype._setControlQueue = function (position, cb) {
        this._loadControlQueue[position].push(cb);
        if (!this._isControlLoading[position]) {
            this._applyControls(position);
        }
    };
    WebMapControls.prototype._applyControls = function (position) {
        return __awaiter(this, void 0, void 0, function () {
            var controlCb;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._loadControlQueue[position].length) return [3, 2];
                        this._isControlLoading[position] = true;
                        controlCb = this._loadControlQueue[position][0];
                        return [4, controlCb()];
                    case 1:
                        _a.sent();
                        this._loadControlQueue[position].splice(0, 1);
                        this._applyControls(position);
                        return [3, 3];
                    case 2:
                        this._isControlLoading[position] = false;
                        _a.label = 3;
                    case 3: return [2];
                }
            });
        });
    };
    WebMapControls.controls = {
        CONTROL: function (webMap, options) {
            return webMap.createControl(options.control, options.options);
        },
        BUTTON: function (webMap, options) {
            return webMap.createButtonControl(options);
        },
        TOGGLE: function (webMap, options) {
            return webMap.createToggleControl(options);
        },
    };
    return WebMapControls;
}(_WebMapLayers__WEBPACK_IMPORTED_MODULE_0__["WebMapLayers"]));



/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/WebMapLayers.ts":
/*!**************************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/WebMapLayers.ts ***!
  \**************************************************************/
/*! exports provided: WebMapLayers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebMapLayers", function() { return WebMapLayers; });
/* harmony import */ var _nextgis_paint__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextgis/paint */ "./nextgis_frontend/packages/paint/src/index.ts");
/* harmony import */ var _utils_updateGeoJsonAdapterOptions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/updateGeoJsonAdapterOptions */ "./nextgis_frontend/packages/webmap/src/utils/updateGeoJsonAdapterOptions.ts");
/* harmony import */ var _utils_propertiesFilter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/propertiesFilter */ "./nextgis_frontend/packages/webmap/src/utils/propertiesFilter.ts");
/* harmony import */ var _WebMapMain__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./WebMapMain */ "./nextgis_frontend/packages/webmap/src/WebMapMain.ts");
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




var WebMapLayers = (function (_super) {
    __extends(WebMapLayers, _super);
    function WebMapLayers() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._layersIdCounter = 1;
        _this._layersOrderCounter = 1;
        _this._baselayers = [];
        _this._layers = {};
        _this._selectedLayers = [];
        return _this;
    }
    WebMapLayers.prototype.fitLayer = function (layerDef, options) {
        return __awaiter(this, void 0, void 0, function () {
            var layer, extent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        layer = this.getLayer(layerDef);
                        if (!(layer && layer.getExtent)) return [3, 2];
                        return [4, layer.getExtent()];
                    case 1:
                        extent = _a.sent();
                        if (extent) {
                            this.fitBounds(extent, options);
                        }
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        });
    };
    WebMapLayers.prototype.isBaseLayer = function (layerDef) {
        var layer = this.getLayer(layerDef);
        if (layer && layer.id) {
            return this._baselayers.indexOf(layer.id) !== -1;
        }
        return undefined;
    };
    WebMapLayers.prototype.getBaseLayers = function () {
        var _this = this;
        var baselayers = [];
        this._baselayers.forEach(function (x) {
            var baselayer = _this._layers[x];
            if (baselayer) {
                baselayers.push(baselayer);
            }
        });
        return baselayers;
    };
    WebMapLayers.prototype.getBaseLayersIds = function () {
        return this._baselayers;
    };
    WebMapLayers.prototype.getLayer = function (layerDef) {
        if (typeof layerDef === 'string') {
            return this._layers[layerDef];
        }
        return layerDef;
    };
    WebMapLayers.prototype.getLayerId = function (layerDef) {
        var layer = this.getLayer(layerDef);
        if (layer && layer.options) {
            return layer.options.id;
        }
        else {
            throw new Error('No id for layer');
        }
    };
    WebMapLayers.prototype.getLayers = function () {
        return Object.keys(this._layers);
    };
    WebMapLayers.prototype.allLayers = function () {
        return this._layers;
    };
    WebMapLayers.prototype.findLayer = function (filter) {
        for (var l in this._layers) {
            var layerAdapter = this._layers[l];
            var isFit = filter(layerAdapter);
            if (isFit) {
                return layerAdapter;
            }
        }
    };
    WebMapLayers.prototype.isLayerVisible = function (layerDef) {
        var layer = this.getLayer(layerDef);
        return layer && layer.options.visibility !== undefined
            ? layer.options.visibility
            : false;
    };
    WebMapLayers.prototype.addBaseLayer = function (adapter, options) {
        return __awaiter(this, void 0, void 0, function () {
            var layer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.addLayer(adapter, __assign(__assign({}, options), { baselayer: true }))];
                    case 1:
                        layer = _a.sent();
                        return [2, layer];
                }
            });
        });
    };
    WebMapLayers.prototype.addLayer = function (adapter, options, order) {
        var _a, _b, _c;
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var id, _order, adapterEngine, geoJsonOptions, _d, maxZoom, minZoom, visibility, modified, _adapter, layerId, layer, opacity, extent;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        options.baselayer = (_a = options.baselayer) !== null && _a !== void 0 ? _a : options.baseLayer;
                        id = this._layersIdCounter++;
                        _order = order !== undefined
                            ? order
                            : options.order !== undefined
                                ? options.order
                                : this.reserveOrder();
                        if (!(typeof adapter === 'string')) return [3, 1];
                        adapterEngine = this.getLayerAdapter(adapter);
                        return [3, 4];
                    case 1:
                        if (!(typeof adapter === 'function')) return [3, 2];
                        adapterEngine = adapter;
                        return [3, 4];
                    case 2:
                        if (!('then' in adapter)) return [3, 4];
                        return [4, adapter];
                    case 3:
                        adapterEngine = (_e.sent());
                        _e.label = 4;
                    case 4:
                        geoJsonOptions = options;
                        this._updateGeoJsonOptions(geoJsonOptions);
                        _d = this.options, maxZoom = _d.maxZoom, minZoom = _d.minZoom;
                        options = __assign({ id: String(id), order: _order, maxZoom: maxZoom,
                            minZoom: minZoom }, options);
                        visibility = (_b = options.visibility) !== null && _b !== void 0 ? _b : true;
                        options.visibility = false;
                        if (options.baselayer) {
                            options.order = 0;
                        }
                        if (this.options.onBeforeAddLayer) {
                            modified = this.options.onBeforeAddLayer({
                                options: options,
                                adapter: adapterEngine,
                            });
                            if (modified) {
                                if (modified.options) {
                                    options = modified.options;
                                }
                                if (modified.adapter) {
                                    adapterEngine = modified.adapter;
                                }
                            }
                        }
                        if (!(adapterEngine !== undefined)) return [3, 12];
                        _adapter = new adapterEngine(this.mapAdapter.map, options);
                        _adapter.options = __assign(__assign({}, options), _adapter.options);
                        if (_adapter.options.baselayer) {
                            options.baselayer = true;
                            options.order = 0;
                            _adapter.options.order = 0;
                        }
                        layerId = void 0;
                        if (_adapter.options.id) {
                            layerId = String(_adapter.options.id);
                            this._layers[layerId] = _adapter;
                        }
                        this.emitter.emit('layer:preadd', _adapter);
                        return [4, this.onMapLoad()];
                    case 5:
                        _e.sent();
                        return [4, _adapter.addLayer(_adapter.options)];
                    case 6:
                        layer = _e.sent();
                        _adapter.layer = layer;
                        _adapter.id = _adapter.options.id || String(id);
                        _adapter.options.id = _adapter.id;
                        if (options.baselayer) {
                            _adapter.options.order = 0;
                        }
                        _adapter.order = (_c = _adapter.options.order) !== null && _c !== void 0 ? _c : _order;
                        if (layerId) {
                            delete this._layers[layerId];
                        }
                        layerId = String(_adapter.id);
                        if (this._layers[layerId]) {
                            throw Error("layer with id '" + layerId + "' already exist");
                        }
                        if (!layerId) return [3, 8];
                        this._layers[layerId] = _adapter;
                        if (geoJsonOptions.filter) {
                            this.filterLayer(_adapter, geoJsonOptions.filter);
                        }
                        if (options.baselayer) {
                            this._baselayers.push(layerId);
                        }
                        if (!visibility) return [3, 8];
                        return [4, this.showLayer(layerId)];
                    case 7:
                        _e.sent();
                        _e.label = 8;
                    case 8:
                        opacity = options.opacity;
                        if (opacity !== undefined && opacity <= 1) {
                            this.setLayerOpacity(_adapter, opacity);
                        }
                        if (!(options.fit && _adapter.getExtent)) return [3, 11];
                        return [4, _adapter.getExtent()];
                    case 9:
                        extent = _e.sent();
                        if (!extent) return [3, 11];
                        return [4, this.fitBounds(extent)];
                    case 10:
                        _e.sent();
                        _e.label = 11;
                    case 11:
                        this.emitter.emit('layer:add', _adapter);
                        return [2, _adapter];
                    case 12: return [2, Promise.reject('No adapter')];
                }
            });
        });
    };
    WebMapLayers.prototype.addLayerFromAsyncAdapter = function (adapter, options, order) {
        return __awaiter(this, void 0, void 0, function () {
            var _order, adapterConstructor, adapterConstructorPromise, adapterEngine;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _order = order || options.order !== undefined
                            ? options.order
                            :  false || this.reserveOrder();
                        adapterConstructor = adapter;
                        adapterConstructorPromise = adapterConstructor();
                        return [4, adapterConstructorPromise];
                    case 1:
                        adapterEngine = _a.sent();
                        if (adapterEngine) {
                            return [2, this.addLayer(adapterEngine, options, _order)];
                        }
                        return [2, Promise.reject('No adapter')];
                }
            });
        });
    };
    WebMapLayers.prototype.removeLayers = function (allowCb) {
        for (var l in this._layers) {
            var allow = true;
            if (allowCb) {
                allow = allowCb(l, this._layers[l]);
            }
            if (allow) {
                this.removeLayer(l);
                delete this._layers[l];
            }
        }
    };
    WebMapLayers.prototype.reserveOrder = function () {
        return this._layersOrderCounter++;
    };
    WebMapLayers.prototype.removeOverlays = function () {
        this.removeLayers(function (layerId, layer) {
            if (layer && layer.options && layer.options.baselayer) {
                return false;
            }
            return true;
        });
    };
    WebMapLayers.prototype.removeLayer = function (layerDef) {
        var layer = this.getLayer(layerDef);
        var layerId = layer && this.getLayerId(layer);
        if (layer && layerId) {
            this.emitter.emit('layer:preremove', layer);
            if (layer.beforeRemove) {
                layer.beforeRemove();
            }
            if (layer.removeLayer) {
                layer.removeLayer();
            }
            else {
                this.mapAdapter.removeLayer(layer.layer);
            }
            if (layer.options && layer.options.baselayer) {
                var index = this._baselayers.indexOf(layerId);
                if (index) {
                    this._baselayers.splice(index, 1);
                }
            }
            delete this._layers[layerId];
            this.emitter.emit('layer:remove', layer);
        }
    };
    WebMapLayers.prototype.addGeoJsonLayer = function (opt, adapter) {
        return __awaiter(this, void 0, void 0, function () {
            var layer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        opt = opt || {};
                        opt.multiselect = opt.multiselect !== undefined ? opt.multiselect : false;
                        opt.unselectOnSecondClick =
                            opt.unselectOnSecondClick !== undefined
                                ? opt.unselectOnSecondClick
                                : true;
                        if (!adapter) {
                            opt = Object(_utils_updateGeoJsonAdapterOptions__WEBPACK_IMPORTED_MODULE_1__["updateGeoJsonAdapterOptions"])(opt);
                        }
                        opt.paint = opt.paint || {};
                        return [4, this.addLayer(adapter || 'GEOJSON', opt)];
                    case 1:
                        layer = _a.sent();
                        this.showLayer(layer);
                        return [2, layer];
                }
            });
        });
    };
    WebMapLayers.prototype.showLayer = function (layerDef, options) {
        if (options === void 0) { options = {}; }
        return this.toggleLayer(layerDef, true, options);
    };
    WebMapLayers.prototype.hideLayer = function (layerDef, options) {
        if (options === void 0) { options = {}; }
        return this.toggleLayer(layerDef, false, options);
    };
    WebMapLayers.prototype.toggleLayer = function (layerDef, status, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var layer = this.getLayer(layerDef);
        var onMap = layer && layer.options.visibility;
        var toStatus = status !== undefined ? status : !onMap;
        var silent = options.silent !== undefined ? options.silent : false;
        var action = function (source, l) {
            var preEventName = toStatus ? 'layer:preshow' : 'layer:prehide';
            var eventName = toStatus ? 'layer:show' : 'layer:hide';
            if (!silent) {
                _this.emitter.emit(preEventName, l);
            }
            if (toStatus && source) {
                var order = l.options.baselayer ? 0 : l.options.order;
                if (l.options.baselayer && _this._baselayers.length) {
                    var anotherVisibleLayerBaseLayer = _this._baselayers.find(function (x) {
                        return x !== l.id && _this.isLayerVisible(x);
                    });
                    if (anotherVisibleLayerBaseLayer) {
                        _this.hideLayer(anotherVisibleLayerBaseLayer);
                    }
                }
                if (l.showLayer) {
                    l.showLayer.call(l, l.layer);
                }
                else if (l.layer !== undefined) {
                    _this.mapAdapter.showLayer(l.layer);
                }
                if (order !== undefined) {
                    _this.mapAdapter.setLayerOrder(l.layer, order, _this._layers);
                }
            }
            else {
                if (l.hideLayer) {
                    l.hideLayer.call(l, l.layer);
                }
                else if (l.layer !== undefined) {
                    _this.mapAdapter.hideLayer(l.layer);
                }
            }
            if (!silent) {
                _this.emitter.emit(eventName, l);
            }
            l.options.visibility = toStatus;
        };
        if (layer && layer.options.visibility !== toStatus) {
            return this.onMapLoad().then(function () { return action(_this.mapAdapter, layer); });
        }
        return Promise.resolve();
    };
    WebMapLayers.prototype.updateLayer = function (layerDef) {
        var layer = this.getLayer(layerDef);
        if (layer) {
            if (layer.updateLayer) {
                layer.updateLayer();
            }
            else if (this.isLayerVisible(layer)) {
                this.hideLayer(layer, { silent: true });
                this.showLayer(layer, { silent: true });
            }
        }
    };
    WebMapLayers.prototype.setLayerOpacity = function (layerDef, value) {
        var layer = this.getLayer(layerDef);
        if (layer) {
            if (this.mapAdapter.setLayerOpacity) {
                if (layer) {
                    this.mapAdapter.setLayerOpacity(layer.layer, value);
                }
            }
        }
    };
    WebMapLayers.prototype.selectLayer = function (layerDef, findFeatureFun) {
        var layer = this.getLayer(layerDef);
        if (layer) {
            var adapter = layer;
            if (adapter && adapter.select) {
                adapter.select(findFeatureFun);
            }
            var layerId = this.getLayerId(layer);
            if (layerId) {
                this._selectedLayers.push(layerId);
            }
        }
    };
    WebMapLayers.prototype.unSelectLayer = function (layerDef, findFeatureFun) {
        var layer = this.getLayer(layerDef);
        if (layer) {
            var adapter = layer && layer;
            if (adapter.unselect) {
                adapter.unselect(findFeatureFun);
            }
            var layerId = this.getLayerId(layer);
            if (layerId) {
                var index = this._selectedLayers.indexOf(layerId);
                if (index !== -1) {
                    this._selectedLayers.splice(index, 1);
                }
            }
        }
    };
    WebMapLayers.prototype.filterLayer = function (layerDef, filter) {
        var layer = this.getLayer(layerDef);
        var adapter = layer;
        if (adapter.filter) {
            return adapter.filter(filter);
        }
        return [];
    };
    WebMapLayers.prototype.propertiesFilter = function (layerDef, filters, options) {
        var layer = this.getLayer(layerDef);
        var adapter = layer;
        if (adapter.propertiesFilter) {
            adapter.propertiesFilter(filters, options);
        }
        else if (adapter.filter) {
            this.filterLayer(adapter, function (e) {
                if (e.feature && e.feature.properties) {
                    return Object(_utils_propertiesFilter__WEBPACK_IMPORTED_MODULE_2__["propertiesFilter"])(e.feature.properties, filters);
                }
                return true;
            });
        }
    };
    WebMapLayers.prototype.removeLayerFilter = function (layerDef) {
        var layer = this.getLayer(layerDef);
        var adapter = layer;
        if (adapter.removeFilter) {
            adapter.removeFilter();
        }
        else if (adapter.filter) {
            adapter.filter(function () {
                return true;
            });
        }
    };
    WebMapLayers.prototype.setLayerData = function (layerDef, data) {
        var vectorAdapter = this.getLayer(layerDef);
        var adapter = vectorAdapter;
        if (adapter) {
            if (adapter.setData) {
                adapter.setData(data);
            }
            else if (adapter.clearLayer && adapter.addData) {
                adapter.clearLayer();
                adapter.addData(data);
            }
        }
    };
    WebMapLayers.prototype.addLayerData = function (layerDef, data) {
        var layerMem = this.getLayer(layerDef);
        var adapter = layerMem;
        if (adapter.addData) {
            adapter.addData(data);
        }
    };
    WebMapLayers.prototype.clearLayerData = function (layerDef, cb) {
        var layerMem = this.getLayer(layerDef);
        var adapter = layerMem;
        if (adapter && adapter.clearLayer) {
            adapter.clearLayer(cb);
        }
    };
    WebMapLayers.prototype.getAttributions = function (options) {
        var attributions = [];
        for (var l in this._layers) {
            var layerCache = this._layers[l];
            var onlyVisible = options.onlyVisible !== undefined ? options.onlyVisible : true;
            var useLayerAttr = onlyVisible ? layerCache.options.visibility : true;
            if (useLayerAttr && options.onlyBaselayer) {
                useLayerAttr = this._baselayers.includes(l);
            }
            if (useLayerAttr) {
                var attr = layerCache.options && layerCache.options.attribution;
                if (attr) {
                    attributions.push(attr);
                }
            }
        }
        return attributions;
    };
    WebMapLayers.prototype.getActiveBaseLayer = function () {
        var _this = this;
        var visibleLayerBaseLayer = this.getBaseLayers().find(function (x) {
            return _this.isLayerVisible(x);
        });
        if (visibleLayerBaseLayer) {
            return this.getLayer(visibleLayerBaseLayer);
        }
    };
    WebMapLayers.prototype._onLayerClick = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.emitter.emit('layer:click', options);
                return [2, Promise.resolve(options)];
            });
        });
    };
    WebMapLayers.prototype._onLayerSelect = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.emitter.emit('layer:select', options);
                return [2, Promise.resolve(options)];
            });
        });
    };
    WebMapLayers.prototype._updateGeoJsonOptions = function (options) {
        var _this = this;
        var onLayerClickFromOpt = options.onLayerClick;
        options.onLayerClick = function (e) {
            if (onLayerClickFromOpt) {
                onLayerClickFromOpt(e);
            }
            return _this._onLayerClick(e);
        };
        var onLayerSelectFromOpt = options.onLayerSelect;
        options.onLayerSelect = function (e) {
            if (onLayerSelectFromOpt) {
                onLayerSelectFromOpt(e);
            }
            return _this._onLayerSelect(e);
        };
        if (!options.nativePaint) {
            if (this.options.paint) {
                options.paint = Object(_nextgis_paint__WEBPACK_IMPORTED_MODULE_0__["preparePaint"])(options.paint || {}, this.options.paint, this.getPaintFunctions);
            }
            if (options.selectedPaint && this.options.selectedPaint) {
                options.selectedPaint = Object(_nextgis_paint__WEBPACK_IMPORTED_MODULE_0__["preparePaint"])(options.selectedPaint, this.options.selectedPaint, this.getPaintFunctions);
            }
        }
    };
    return WebMapLayers;
}(_WebMapMain__WEBPACK_IMPORTED_MODULE_3__["WebMapMain"]));



/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/WebMapMain.ts":
/*!************************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/WebMapMain.ts ***!
  \************************************************************/
/*! exports provided: WebMapMain */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebMapMain", function() { return WebMapMain; });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nextgis_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextgis/utils */ "./nextgis_frontend/packages/utils/src/index.ts");
/* harmony import */ var _components_keys_Keys__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/keys/Keys */ "./nextgis_frontend/packages/webmap/src/components/keys/Keys.ts");
/* harmony import */ var _components_mapStates_CenterState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/mapStates/CenterState */ "./nextgis_frontend/packages/webmap/src/components/mapStates/CenterState.ts");
/* harmony import */ var _components_mapStates_ZoomState__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/mapStates/ZoomState */ "./nextgis_frontend/packages/webmap/src/components/mapStates/ZoomState.ts");
/* harmony import */ var _components_controls_createToggleControl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/controls/createToggleControl */ "./nextgis_frontend/packages/webmap/src/components/controls/createToggleControl.ts");
/* harmony import */ var _utils_geometryTypes__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/geometryTypes */ "./nextgis_frontend/packages/webmap/src/utils/geometryTypes.ts");
/* harmony import */ var _utils_decorators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/decorators */ "./nextgis_frontend/packages/webmap/src/utils/decorators.ts");
/* harmony import */ var _utils_clearObject__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils/clearObject */ "./nextgis_frontend/packages/webmap/src/utils/clearObject.ts");
/* harmony import */ var _utils_propertiesFilter__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./utils/propertiesFilter */ "./nextgis_frontend/packages/webmap/src/utils/propertiesFilter.ts");
/* harmony import */ var _utils_getBoundsPolygon__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./utils/getBoundsPolygon */ "./nextgis_frontend/packages/webmap/src/utils/getBoundsPolygon.ts");
/* harmony import */ var _utils_updateGeoJsonAdapterOptions__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./utils/updateGeoJsonAdapterOptions */ "./nextgis_frontend/packages/webmap/src/utils/updateGeoJsonAdapterOptions.ts");
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












var ID = 0;
var WEB_MAP_CONTAINER = {};
var OPTIONS = {
    minZoom: 0,
    maxZoom: 21,
    paint: {
        color: 'blue',
        opacity: 1,
        radius: 8,
        weight: 1,
    },
    selectedPaint: {
        color: 'darkblue',
        opacity: 1,
        radius: 12,
        weight: 1,
    },
};
var WebMapMain = (function () {
    function WebMapMain(appOptions) {
        this.options = OPTIONS;
        this.emitter = new events__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.keys = WebMapMain.keys;
        this.runtimeParams = [];
        this.getPaintFunctions = WebMapMain.getPaintFunctions;
        this.mapState = [_components_mapStates_CenterState__WEBPACK_IMPORTED_MODULE_3__["CenterState"], _components_mapStates_ZoomState__WEBPACK_IMPORTED_MODULE_4__["ZoomState"]];
        this.id = ID++;
        this._initMapState = {};
        this._mapState = [];
        this._eventsStatus = {};
        this._mapEvents = {};
        WEB_MAP_CONTAINER[this.id] = this;
        this.mapAdapter = appOptions.mapAdapter;
        this._starterKits = appOptions.starterKits || [];
        if (appOptions.mapOptions) {
            this.options = Object(_nextgis_utils__WEBPACK_IMPORTED_MODULE_1__["deepmerge"])(OPTIONS || {}, appOptions.mapOptions);
        }
        if (appOptions.runtimeParams) {
            this.runtimeParams = appOptions.runtimeParams;
        }
        this._addEventsListeners();
        if (appOptions.create) {
            this.create(this.options);
        }
    }
    WebMapMain.get = function (id) {
        return WEB_MAP_CONTAINER[id];
    };
    WebMapMain.prototype.getId = function () {
        return this.id;
    };
    WebMapMain.prototype.create = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.getEventStatus('create')) return [3, 3];
                        this.options = Object(_nextgis_utils__WEBPACK_IMPORTED_MODULE_1__["deepmerge"])(OPTIONS || {}, options || {});
                        return [4, this._setInitMapState(this.mapState)];
                    case 1:
                        _a.sent();
                        return [4, this._setupMap()];
                    case 2:
                        _a.sent();
                        this._emitStatusEvent('create', this);
                        _a.label = 3;
                    case 3: return [2, this];
                }
            });
        });
    };
    WebMapMain.prototype.setRuntimeParams = function (params) {
        this.runtimeParams.push(params);
    };
    WebMapMain.prototype.destroy = function () {
        this._removeEventListeners();
        Object(_utils_clearObject__WEBPACK_IMPORTED_MODULE_8__["clearObject"])(this._emitStatusEvent);
        if (this.mapAdapter.destroy) {
            this.mapAdapter.destroy();
        }
    };
    WebMapMain.prototype.getState = function () {
        var state = {};
        this._mapState.forEach(function (x) {
            state[x.name] = x.getValue();
        });
        return state;
    };
    WebMapMain.prototype.getRuntimeParams = function () {
        var _this = this;
        var state = {};
        this._mapState.forEach(function (x) {
            for (var _i = 0, _a = _this.runtimeParams; _i < _a.length; _i++) {
                var r = _a[_i];
                var val = r.get(x.name);
                if (val !== undefined) {
                    state[x.name] = x.parse(val);
                    break;
                }
            }
        });
        return state;
    };
    WebMapMain.prototype.getContainer = function () {
        if (this.mapAdapter.getContainer) {
            return this.mapAdapter.getContainer();
        }
        else if (this.options.target) {
            if (this.options.target instanceof HTMLElement) {
                return this.options.target;
            }
            else if (typeof this.options.target === 'string') {
                var element = document.getElementById(this.options.target);
                if (element) {
                    return element;
                }
            }
        }
    };
    WebMapMain.prototype.setCursor = function (cursor) {
        if (this.mapAdapter.setCursor) {
            this.mapAdapter.setCursor(cursor);
        }
    };
    WebMapMain.prototype.setCenter = function (lngLat) {
        this.mapAdapter.setCenter(lngLat);
        return this;
    };
    WebMapMain.prototype.getCenter = function () {
        return this.mapAdapter.getCenter();
    };
    WebMapMain.prototype.getBounds = function () {
        if (this.mapAdapter.getBounds) {
            return this.mapAdapter.getBounds();
        }
    };
    WebMapMain.prototype.getBoundsPolygon = function () {
        var bounds = this.getBounds();
        if (bounds) {
            var feature = Object(_utils_getBoundsPolygon__WEBPACK_IMPORTED_MODULE_10__["getBoundsPolygon"])(bounds);
            return feature;
        }
    };
    WebMapMain.prototype.setZoom = function (zoom) {
        this.mapAdapter.setZoom(zoom);
        return this;
    };
    WebMapMain.prototype.getZoom = function () {
        return this.mapAdapter.getZoom();
    };
    WebMapMain.prototype.zoomIn = function () {
        if (this.mapAdapter.zoomIn) {
            this.mapAdapter.zoomIn();
        }
        else {
            var zoom = this.getZoom();
            if (zoom) {
                var toZoom = zoom + 1;
                this.setZoom(toZoom);
            }
        }
    };
    WebMapMain.prototype.zoomOut = function () {
        if (this.mapAdapter.zoomOut) {
            this.mapAdapter.zoomOut();
        }
        else {
            var zoom = this.getZoom();
            if (zoom) {
                var toZoom = zoom - 1;
                this.setZoom(toZoom);
            }
        }
    };
    WebMapMain.prototype.setView = function (lngLat, zoom) {
        if (this.mapAdapter.setView && lngLat && zoom) {
            this.mapAdapter.setView(lngLat, zoom);
        }
        else {
            if (lngLat) {
                this.mapAdapter.setCenter(lngLat);
            }
            if (zoom) {
                this.mapAdapter.setZoom(zoom);
            }
        }
    };
    WebMapMain.prototype.fitBounds = function (bounds, options) {
        if (bounds.every(function (x) { return Object(_nextgis_utils__WEBPACK_IMPORTED_MODULE_1__["defined"])(x); })) {
            if (bounds[1] < -85.06) {
                bounds[1] = -85.06;
            }
            if (bounds[3] > 85.06) {
                bounds[3] = 85.06;
            }
            this.mapAdapter.fitBounds(bounds, options);
        }
        return this;
    };
    WebMapMain.prototype.getEventStatus = function (event) {
        var _eventName = event;
        var status = this._eventsStatus[_eventName];
        return status !== null && status !== void 0 ? status : false;
    };
    WebMapMain.prototype.onLoad = function (event) {
        var _this = this;
        if (event === void 0) { event = 'create'; }
        return new Promise(function (res) {
            if (_this.getEventStatus(event)) {
                res(_this);
            }
            else {
                _this.emitter.once(event, function () {
                    res(_this);
                });
            }
        });
    };
    WebMapMain.prototype.onMapLoad = function (cb) {
        var _this = this;
        return new Promise(function (res) {
            var _a;
            var _resolve = function () {
                var mapAdapter = _this.mapAdapter;
                if (cb) {
                    cb(mapAdapter);
                }
                if (mapAdapter) {
                    res(mapAdapter);
                }
            };
            var isLoaded = (_a = _this.mapAdapter.isLoaded) !== null && _a !== void 0 ? _a : true;
            if (_this.mapAdapter.map && isLoaded) {
                _resolve();
            }
            else {
                _this.mapAdapter.emitter.once('create', function () {
                    _resolve();
                });
            }
        });
    };
    WebMapMain.prototype.getLayerAdapters = function () {
        return this.mapAdapter.layerAdapters;
    };
    WebMapMain.prototype.getLayerAdapter = function (name) {
        var adapter = this.mapAdapter.layerAdapters[name];
        return adapter;
    };
    WebMapMain.prototype.locate = function (opt, events) {
        if (this.mapAdapter && this.mapAdapter.locate) {
            return this.mapAdapter.locate(opt, events);
        }
        var stop = function () { return ({}); };
        return { stop: stop };
    };
    WebMapMain.prototype._emitStatusEvent = function (eventName, data) {
        var _eventName = eventName;
        this._eventsStatus[_eventName] = true;
        this.emitter.emit(_eventName, data);
    };
    WebMapMain.prototype._addLayerProviders = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2];
            });
        });
    };
    WebMapMain.prototype._onLoadSync = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2];
            });
        });
    };
    WebMapMain.prototype._setupMap = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.mapAdapter.create(this.options)];
                    case 1:
                        _a.sent();
                        this._zoomToInitialExtent();
                        return [4, this._addLayerProviders()];
                    case 2:
                        _a.sent();
                        return [4, this._onLoadSync()];
                    case 3:
                        _a.sent();
                        this._emitStatusEvent('build-map', this.mapAdapter);
                        return [2, this];
                }
            });
        });
    };
    WebMapMain.prototype._zoomToInitialExtent = function () {
        var _a = this.options, center = _a.center, zoom = _a.zoom, bounds = _a.bounds;
        if (this._extent) {
            this.fitBounds(this._extent);
        }
        else if (center && zoom) {
            this.setView(center, zoom);
        }
        else if (bounds) {
            this.fitBounds(bounds);
        }
    };
    WebMapMain.prototype._setInitMapState = function (states) {
        for (var _i = 0, states_1 = states; _i < states_1.length; _i++) {
            var X = states_1[_i];
            var state = new X(this);
            this._mapState.push(state);
            for (var _a = 0, _b = this.runtimeParams; _a < _b.length; _a++) {
                var r = _b[_a];
                var str = r.get(state.name);
                if (str !== undefined) {
                    var val = state.parse(str);
                    this._initMapState[state.name] = val;
                    this.options[state.name] = val;
                    break;
                }
            }
        }
    };
    WebMapMain.prototype._addEventsListeners = function () {
        var _this = this;
        var events = [
            'preclick',
            'click',
            'zoomstart',
            'zoom',
            'zoomend',
            'movestart',
            'move',
            'moveend',
        ];
        events.forEach(function (x) {
            _this._mapEvents[x] = function (data) {
                if (_this.runtimeParams.length) {
                    var mapStatusEvent_1 = _this._mapState.find(function (y) { return y.event === x; });
                    if (mapStatusEvent_1) {
                        var value_1 = mapStatusEvent_1.toString(mapStatusEvent_1.getValue());
                        _this.runtimeParams.forEach(function (r) {
                            r.set(mapStatusEvent_1.name, value_1);
                        });
                    }
                }
                if (_this._eventsStatus) {
                    _this.emitter.emit(x, data);
                }
            };
            _this.mapAdapter.emitter.on(x, _this._mapEvents[x]);
        });
    };
    WebMapMain.prototype._removeEventListeners = function () {
        var _this = this;
        Object.entries(this._mapEvents).forEach(function (_a) {
            var x = _a[0], event = _a[1];
            _this.mapAdapter.emitter.off(x, event);
        });
    };
    WebMapMain.keys = new _components_keys_Keys__WEBPACK_IMPORTED_MODULE_2__["Keys"]();
    WebMapMain.utils = {
        detectGeometryType: _utils_geometryTypes__WEBPACK_IMPORTED_MODULE_6__["detectGeometryType"],
        findMostFrequentGeomType: _utils_geometryTypes__WEBPACK_IMPORTED_MODULE_6__["findMostFrequentGeomType"],
        updateGeoJsonAdapterOptions: _utils_updateGeoJsonAdapterOptions__WEBPACK_IMPORTED_MODULE_11__["updateGeoJsonAdapterOptions"],
        propertiesFilter: _utils_propertiesFilter__WEBPACK_IMPORTED_MODULE_9__["propertiesFilter"],
        createToggleControl: _components_controls_createToggleControl__WEBPACK_IMPORTED_MODULE_5__["createToggleControl"],
        getBoundsPolygon: _utils_getBoundsPolygon__WEBPACK_IMPORTED_MODULE_10__["getBoundsPolygon"],
    };
    WebMapMain.decorators = { onLoad: _utils_decorators__WEBPACK_IMPORTED_MODULE_7__["onLoad"] };
    return WebMapMain;
}());



/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/components/controls/createToggleControl.ts":
/*!*****************************************************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/components/controls/createToggleControl.ts ***!
  \*****************************************************************************************/
/*! exports provided: createToggleControl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createToggleControl", function() { return createToggleControl; });
function createToggleControl(createButtonControl, options) {
    var link = document.createElement('div');
    var status = false;
    if (options.getStatus) {
        status = options.getStatus();
    }
    else if (options.status) {
        status = options.status;
    }
    var title = options.title || '';
    var html = options.html;
    function setTitle() {
        if (title) {
            if (typeof title === 'string') {
                link.title = title;
            }
            else {
                link.title = status ? title.on : title.off;
            }
            link.setAttribute('aria-label', link.title);
        }
    }
    setTitle();
    function _setHtml(htmlDef) {
        if (htmlDef instanceof HTMLElement) {
            link.innerHTML = '';
            link.appendChild(htmlDef);
        }
        else if (typeof htmlDef === 'string') {
            link.innerHTML = htmlDef;
        }
    }
    function setHtml() {
        if (html) {
            if (typeof html === 'string' || html instanceof HTMLElement) {
                _setHtml(html);
            }
            else {
                _setHtml(status ? html.on : html.off);
            }
            link.setAttribute('aria-label', link.title);
        }
    }
    setHtml();
    function _setClass(addClass, impact) {
        addClass.split(' ').forEach(function (x) {
            if (impact) {
                link.classList.add(x);
            }
            else {
                link.classList.remove(x);
            }
        });
    }
    function setClass() {
        if (options.addClassOn) {
            _setClass(options.addClassOn, status);
        }
        if (options.addClassOff) {
            _setClass(options.addClassOff, !status);
        }
    }
    if (options.addClass) {
        _setClass(options.addClass, true);
    }
    setClass();
    var changeStatus = function (status_) {
        if (status_ !== undefined) {
            status = status_;
        }
        setHtml();
        setTitle();
        setClass();
    };
    var onClick = function (status_) {
        status = status_ !== undefined ? status_ : !status;
        if (options.onClick) {
            var afterClick = options.onClick(status);
            Promise.resolve(afterClick)
                .then(function () { return changeStatus(); })
                .catch(function () { return (status = !status); });
        }
        else {
            changeStatus();
        }
    };
    var buttonControl = createButtonControl({
        html: link,
        onClick: onClick,
    });
    buttonControl.onClick = onClick;
    buttonControl.changeStatus = changeStatus;
    return buttonControl;
}


/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/components/keys/Keys.ts":
/*!**********************************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/components/keys/Keys.ts ***!
  \**********************************************************************/
/*! exports provided: Keys */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Keys", function() { return Keys; });
/* harmony import */ var _KeysCodes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./KeysCodes */ "./nextgis_frontend/packages/webmap/src/components/keys/KeysCodes.ts");

var Keys = (function () {
    function Keys() {
        this.keyCodeAlias = new _KeysCodes__WEBPACK_IMPORTED_MODULE_0__["KeyCodes"]();
        this.keys = {};
        this._windowOnFocus = this.windowOnFocus.bind(this);
        this._keysPressed = this.keysPressed.bind(this);
        this._keysReleased = this.keysReleased.bind(this);
        this.addKeyboardEventsListener();
    }
    Keys.prototype.pressed = function (keyName) {
        var code = this.keyCodeAlias[keyName];
        return !!code && this.keys[code];
    };
    Keys.prototype.addKeyboardEventsListener = function () {
        if (typeof window !== 'undefined') {
            window.addEventListener('focus', this._windowOnFocus, false);
            window.addEventListener('keydown', this._keysPressed, false);
            window.addEventListener('keyup', this._keysReleased, false);
        }
    };
    Keys.prototype.removeKeyboardEventsListener = function () {
        if (typeof window !== 'undefined') {
            window.removeEventListener('focus', this._windowOnFocus, false);
            window.removeEventListener('keydown', this._keysPressed, false);
            window.removeEventListener('keyup', this._keysReleased, false);
        }
    };
    Keys.prototype.keysPressed = function (e) {
        e.stopPropagation();
        if (!this.keys[e.keyCode]) {
            this.keys[e.keyCode] = true;
        }
    };
    Keys.prototype.keysReleased = function (e) {
        e.stopPropagation();
        this.keys[e.keyCode] = false;
    };
    Keys.prototype.windowOnFocus = function () {
        this.keys = {};
    };
    return Keys;
}());



/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/components/keys/KeysCodes.ts":
/*!***************************************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/components/keys/KeysCodes.ts ***!
  \***************************************************************************/
/*! exports provided: KeyCodes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KeyCodes", function() { return KeyCodes; });
var KeyCodes = (function () {
    function KeyCodes() {
        this['backspace'] = 8;
        this['tab'] = 9;
        this['enter'] = 13;
        this['shift'] = 16;
        this['ctrl'] = 17;
        this['alt'] = 18;
        this['pause/break'] = 19;
        this['caps_lock'] = 20;
        this['escape'] = 27;
        this['page_up'] = 33;
        this['page_down'] = 34;
        this['end'] = 35;
        this['home'] = 36;
        this['left_arrow'] = 37;
        this['up_arrow'] = 38;
        this['right_arrow'] = 39;
        this['down_arrow'] = 40;
        this['insert'] = 45;
        this['delete'] = 46;
        this['left_window_key'] = 91;
        this['right_window_key'] = 92;
        this['select_key'] = 93;
        this['numpad_0'] = 96;
        this['numpad_1'] = 97;
        this['numpad_2'] = 98;
        this['numpad_3'] = 99;
        this['numpad_4'] = 100;
        this['numpad_5'] = 101;
        this['numpad_6'] = 102;
        this['numpad_7'] = 103;
        this['numpad_8'] = 104;
        this['numpad_9'] = 105;
        this['multiply'] = 106;
        this['add'] = 107;
        this['subtract'] = 109;
        this['decimal_point'] = 110;
        this['divide'] = 111;
        this['f1'] = 112;
        this['f2'] = 113;
        this['f3'] = 114;
        this['f4'] = 115;
        this['f5'] = 116;
        this['f6'] = 117;
        this['f7'] = 118;
        this['f8'] = 119;
        this['f9'] = 120;
        this['f10'] = 121;
        this['f11'] = 122;
        this['f12'] = 123;
        this['num_lock'] = 144;
        this['scroll_lock'] = 145;
        this['semi-colon'] = 186;
        this['equal_sign'] = 187;
        this[','] = 188;
        this['-'] = 189;
        this['.'] = 190;
        this['/'] = 191;
        this['`'] = 192;
        this['['] = 219;
        this['\\'] = 220;
        this[']'] = 221;
        this["'"] = 222;
    }
    return KeyCodes;
}());



/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/components/mapStates/CenterState.ts":
/*!**********************************************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/components/mapStates/CenterState.ts ***!
  \**********************************************************************************/
/*! exports provided: CenterState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CenterState", function() { return CenterState; });
/* harmony import */ var _StateItem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StateItem */ "./nextgis_frontend/packages/webmap/src/components/mapStates/StateItem.ts");
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

var CenterState = (function (_super) {
    __extends(CenterState, _super);
    function CenterState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'center';
        _this.event = 'moveend';
        return _this;
    }
    CenterState.prototype.getValue = function () {
        return this.webMap.getCenter();
    };
    CenterState.prototype.setValue = function (val) {
        this.webMap.setCenter(val);
    };
    CenterState.prototype.toString = function (data) {
        var d = data.map(function (x) { return x.toFixed(5); });
        return d[0] + '_' + d[1];
    };
    CenterState.prototype.parse = function (str) {
        var lngLat = str.split('_').map(Number);
        return lngLat;
    };
    return CenterState;
}(_StateItem__WEBPACK_IMPORTED_MODULE_0__["StateItem"]));



/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/components/mapStates/StateItem.ts":
/*!********************************************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/components/mapStates/StateItem.ts ***!
  \********************************************************************************/
/*! exports provided: StateItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StateItem", function() { return StateItem; });
var StateItem = (function () {
    function StateItem(webMap, opt) {
        this.webMap = webMap;
        if (opt) {
            if (opt.value) {
                this.setValue(opt.value);
            }
            if (opt.name) {
                this.name = opt.name;
            }
            if (opt.event) {
                this.event = opt.event;
            }
        }
    }
    StateItem.prototype.getValue = function () {
        return this.value;
    };
    StateItem.prototype.setValue = function (val) {
        this.value = val;
    };
    return StateItem;
}());



/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/components/mapStates/ZoomState.ts":
/*!********************************************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/components/mapStates/ZoomState.ts ***!
  \********************************************************************************/
/*! exports provided: ZoomState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ZoomState", function() { return ZoomState; });
/* harmony import */ var _StateItem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StateItem */ "./nextgis_frontend/packages/webmap/src/components/mapStates/StateItem.ts");
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

var ZoomState = (function (_super) {
    __extends(ZoomState, _super);
    function ZoomState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'zoom';
        _this.event = 'zoomend';
        return _this;
    }
    ZoomState.prototype.getValue = function () {
        var zoom = this.webMap.getZoom();
        return zoom !== undefined ? Math.round(zoom) : undefined;
    };
    ZoomState.prototype.setValue = function (val) {
        this.webMap.setZoom(val);
    };
    ZoomState.prototype.toString = function (val) {
        return String(val);
    };
    ZoomState.prototype.parse = function (str) {
        return Number(str);
    };
    return ZoomState;
}(_StateItem__WEBPACK_IMPORTED_MODULE_0__["StateItem"]));



/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/index.ts":
/*!*******************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/index.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _WebMap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./WebMap */ "./nextgis_frontend/packages/webmap/src/WebMap.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebMap", function() { return _WebMap__WEBPACK_IMPORTED_MODULE_0__["WebMap"]; });

/* empty/unused harmony star reexport *//* harmony import */ var _WebMapLayers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WebMapLayers */ "./nextgis_frontend/packages/webmap/src/WebMapLayers.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebMapLayers", function() { return _WebMapLayers__WEBPACK_IMPORTED_MODULE_1__["WebMapLayers"]; });

/* harmony import */ var _WebMapControls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WebMapControls */ "./nextgis_frontend/packages/webmap/src/WebMapControls.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebMapControls", function() { return _WebMapControls__WEBPACK_IMPORTED_MODULE_2__["WebMapControls"]; });

/* harmony import */ var _WebMapMain__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./WebMapMain */ "./nextgis_frontend/packages/webmap/src/WebMapMain.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebMapMain", function() { return _WebMapMain__WEBPACK_IMPORTED_MODULE_3__["WebMapMain"]; });

/* harmony import */ var _interfaces_Events__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./interfaces/Events */ "./nextgis_frontend/packages/webmap/src/interfaces/Events.ts");
/* harmony import */ var _interfaces_Events__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_interfaces_Events__WEBPACK_IMPORTED_MODULE_4__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _interfaces_Events__WEBPACK_IMPORTED_MODULE_4__) if(["WebMap","WebMapLayers","WebMapControls","WebMapMain","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _interfaces_Events__WEBPACK_IMPORTED_MODULE_4__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _interfaces_BaseTypes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./interfaces/BaseTypes */ "./nextgis_frontend/packages/webmap/src/interfaces/BaseTypes.ts");
/* harmony import */ var _interfaces_BaseTypes__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_interfaces_BaseTypes__WEBPACK_IMPORTED_MODULE_5__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _interfaces_BaseTypes__WEBPACK_IMPORTED_MODULE_5__) if(["WebMap","WebMapLayers","WebMapControls","WebMapMain","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _interfaces_BaseTypes__WEBPACK_IMPORTED_MODULE_5__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _interfaces_WebMapApp__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./interfaces/WebMapApp */ "./nextgis_frontend/packages/webmap/src/interfaces/WebMapApp.ts");
/* harmony import */ var _interfaces_WebMapApp__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_interfaces_WebMapApp__WEBPACK_IMPORTED_MODULE_6__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _interfaces_WebMapApp__WEBPACK_IMPORTED_MODULE_6__) if(["WebMap","WebMapLayers","WebMapControls","WebMapMain","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _interfaces_WebMapApp__WEBPACK_IMPORTED_MODULE_6__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _interfaces_MapAdapter__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./interfaces/MapAdapter */ "./nextgis_frontend/packages/webmap/src/interfaces/MapAdapter.ts");
/* harmony import */ var _interfaces_MapAdapter__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_interfaces_MapAdapter__WEBPACK_IMPORTED_MODULE_7__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _interfaces_MapAdapter__WEBPACK_IMPORTED_MODULE_7__) if(["WebMap","WebMapLayers","WebMapControls","WebMapMain","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _interfaces_MapAdapter__WEBPACK_IMPORTED_MODULE_7__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _interfaces_MapControl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./interfaces/MapControl */ "./nextgis_frontend/packages/webmap/src/interfaces/MapControl.ts");
/* harmony import */ var _interfaces_MapControl__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_interfaces_MapControl__WEBPACK_IMPORTED_MODULE_8__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _interfaces_MapControl__WEBPACK_IMPORTED_MODULE_8__) if(["WebMap","WebMapLayers","WebMapControls","WebMapMain","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _interfaces_MapControl__WEBPACK_IMPORTED_MODULE_8__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _interfaces_StarterKit__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./interfaces/StarterKit */ "./nextgis_frontend/packages/webmap/src/interfaces/StarterKit.ts");
/* harmony import */ var _interfaces_StarterKit__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_interfaces_StarterKit__WEBPACK_IMPORTED_MODULE_9__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _interfaces_StarterKit__WEBPACK_IMPORTED_MODULE_9__) if(["WebMap","WebMapLayers","WebMapControls","WebMapMain","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _interfaces_StarterKit__WEBPACK_IMPORTED_MODULE_9__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _interfaces_LayerAdapter__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./interfaces/LayerAdapter */ "./nextgis_frontend/packages/webmap/src/interfaces/LayerAdapter.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "checkIfPropertyFilter", function() { return _interfaces_LayerAdapter__WEBPACK_IMPORTED_MODULE_10__["checkIfPropertyFilter"]; });

/* harmony import */ var _interfaces_RuntimeParams__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./interfaces/RuntimeParams */ "./nextgis_frontend/packages/webmap/src/interfaces/RuntimeParams.ts");
/* harmony import */ var _interfaces_RuntimeParams__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_interfaces_RuntimeParams__WEBPACK_IMPORTED_MODULE_11__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _interfaces_RuntimeParams__WEBPACK_IMPORTED_MODULE_11__) if(["WebMap","WebMapLayers","WebMapControls","WebMapMain","checkIfPropertyFilter","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _interfaces_RuntimeParams__WEBPACK_IMPORTED_MODULE_11__[key]; }) }(__WEBPACK_IMPORT_KEY__));














/* harmony default export */ __webpack_exports__["default"] = (_WebMap__WEBPACK_IMPORTED_MODULE_0__["WebMap"]);


/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/interfaces/BaseTypes.ts":
/*!**********************************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/interfaces/BaseTypes.ts ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/interfaces/Events.ts":
/*!*******************************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/interfaces/Events.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/interfaces/LayerAdapter.ts":
/*!*************************************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/interfaces/LayerAdapter.ts ***!
  \*************************************************************************/
/*! exports provided: checkIfPropertyFilter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _nextgis_properties_filter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextgis/properties-filter */ "./nextgis_frontend/packages/properties-filter/src/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "checkIfPropertyFilter", function() { return _nextgis_properties_filter__WEBPACK_IMPORTED_MODULE_0__["checkIfPropertyFilter"]; });





/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/interfaces/MapAdapter.ts":
/*!***********************************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/interfaces/MapAdapter.ts ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/interfaces/MapControl.ts":
/*!***********************************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/interfaces/MapControl.ts ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/interfaces/RuntimeParams.ts":
/*!**************************************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/interfaces/RuntimeParams.ts ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/interfaces/StarterKit.ts":
/*!***********************************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/interfaces/StarterKit.ts ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/interfaces/WebMapApp.ts":
/*!**********************************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/interfaces/WebMapApp.ts ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/utils/clearObject.ts":
/*!*******************************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/utils/clearObject.ts ***!
  \*******************************************************************/
/*! exports provided: clearObject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clearObject", function() { return clearObject; });
function clearObject(obj) {
    for (var member in obj) {
        delete obj[member];
    }
}


/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/utils/decorators.ts":
/*!******************************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/utils/decorators.ts ***!
  \******************************************************************/
/*! exports provided: onLoad */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onLoad", function() { return onLoad; });
function onLoad(event) {
    return function (_target, _propertyKey, descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return new Promise(function (resolve, reject) {
                var _resolve = function () {
                    var origin = originalMethod.apply(_this, args);
                    origin && origin.then
                        ? origin.then(resolve).catch(reject)
                        : resolve(origin);
                };
                var isLoaded = _this.getEventStatus(event);
                if (isLoaded) {
                    _resolve();
                }
                else {
                    _this.emitter.once(event, function () {
                        _resolve();
                    });
                }
            });
        };
        return descriptor;
    };
}


/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/utils/geometryTypes.ts":
/*!*********************************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/utils/geometryTypes.ts ***!
  \*********************************************************************/
/*! exports provided: findMostFrequentGeomType, detectGeometryType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findMostFrequentGeomType", function() { return findMostFrequentGeomType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "detectGeometryType", function() { return detectGeometryType; });
function findMostFrequentGeomType(arr) {
    var counts = {};
    for (var fry = 0; fry < arr.length; fry++) {
        counts[arr[fry]] = 1 + (counts[arr[fry]] || 0);
    }
    var maxName;
    for (var c in counts) {
        var count = maxName !== undefined ? counts[maxName] : 0;
        if (counts[c] > (count || 0)) {
            maxName = c;
        }
    }
    return maxName;
}
function detectGeometryType(geojson) {
    var geometry;
    if (geojson.type === 'FeatureCollection') {
        var featuresTypes = geojson.features.map(function (f) { return f.geometry.type; });
        geometry = findMostFrequentGeomType(featuresTypes);
    }
    else if (geojson.type === 'GeometryCollection') {
        var geometryTypes = geojson.geometries.map(function (g) { return g.type; });
        geometry = findMostFrequentGeomType(geometryTypes);
    }
    else if (geojson.type === 'Feature') {
        geometry = geojson.geometry.type;
    }
    else {
        geometry = geojson.type;
    }
    return geometry;
}


/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/utils/getBoundsPolygon.ts":
/*!************************************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/utils/getBoundsPolygon.ts ***!
  \************************************************************************/
/*! exports provided: getBoundsPolygon */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getBoundsPolygon", function() { return getBoundsPolygon; });
function getBoundsPolygon(b) {
    var westNorth = [b[0], b[1]];
    var eastNorth = [b[2], b[1]];
    var eastSouth = [b[2], b[3]];
    var westSouth = [b[0], b[3]];
    var feature = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Polygon',
            coordinates: [[westNorth, eastNorth, eastSouth, westSouth, westNorth]],
        },
    };
    return feature;
}


/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/utils/propertiesFilter.ts":
/*!************************************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/utils/propertiesFilter.ts ***!
  \************************************************************************/
/*! exports provided: operationsAliases, propertiesFilter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _nextgis_properties_filter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextgis/properties-filter */ "./nextgis_frontend/packages/properties-filter/src/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "operationsAliases", function() { return _nextgis_properties_filter__WEBPACK_IMPORTED_MODULE_0__["operationsAliases"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "propertiesFilter", function() { return _nextgis_properties_filter__WEBPACK_IMPORTED_MODULE_0__["propertiesFilter"]; });




/***/ }),

/***/ "./nextgis_frontend/packages/webmap/src/utils/updateGeoJsonAdapterOptions.ts":
/*!***********************************************************************************!*\
  !*** ./nextgis_frontend/packages/webmap/src/utils/updateGeoJsonAdapterOptions.ts ***!
  \***********************************************************************************/
/*! exports provided: paintTypeAlias, typeAlias, updateGeoJsonAdapterOptions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "paintTypeAlias", function() { return paintTypeAlias; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "typeAlias", function() { return typeAlias; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateGeoJsonAdapterOptions", function() { return updateGeoJsonAdapterOptions; });
/* harmony import */ var _nextgis_paint__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextgis/paint */ "./nextgis_frontend/packages/paint/src/index.ts");
/* harmony import */ var _geometryTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./geometryTypes */ "./nextgis_frontend/packages/webmap/src/utils/geometryTypes.ts");


var paintTypeAlias = {
    polygon: 'path',
    line: 'path',
    point: 'circle',
};
var typeAlias = {
    Point: 'point',
    LineString: 'line',
    MultiPoint: 'point',
    Polygon: 'polygon',
    MultiLineString: 'line',
    MultiPolygon: 'polygon',
};
function updateGeoJsonAdapterOptions(opt) {
    if (opt.data) {
        var geomType = typeAlias[Object(_geometryTypes__WEBPACK_IMPORTED_MODULE_1__["detectGeometryType"])(opt.data)];
        var p = opt.paint;
        if (p && Object(_nextgis_paint__WEBPACK_IMPORTED_MODULE_0__["isPaint"])(p)) {
            p.type = p.type
                ? p.type
                : geomType === 'polygon' || geomType === 'line'
                    ? 'path'
                    : 'html' in p || 'className' in p
                        ? 'icon'
                        : paintTypeAlias[geomType];
        }
        opt.type = opt.type || geomType;
    }
    return opt;
}


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/main.ts */"./src/main.ts");


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL2NhbmNlbGFibGUtcHJvbWlzZS9zcmMvQ2FuY2VsRXJyb3IudHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy9jYW5jZWxhYmxlLXByb21pc2Uvc3JjL0NhbmNlbGFibGVQcm9taXNlLnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvY2FuY2VsYWJsZS1wcm9taXNlL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL2RpYWxvZy9zcmMvZGlhbG9nLmNzcyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL2RpYWxvZy9zcmMvZGlhbG9nLnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvZGlhbG9nL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL21hcGJveGdsLW1hcC1hZGFwdGVyL3NyYy9NYXBib3hnbE1hcEFkYXB0ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy9tYXBib3hnbC1tYXAtYWRhcHRlci9zcmMvY29udHJvbHMvQXR0cmlidXRpb25Db250cm9sLnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvbWFwYm94Z2wtbWFwLWFkYXB0ZXIvc3JjL2NvbnRyb2xzL0NvbXBhc3NDb250cm9sLnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvbWFwYm94Z2wtbWFwLWFkYXB0ZXIvc3JjL2NvbnRyb2xzL1pvb21Db250cm9sLnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvbWFwYm94Z2wtbWFwLWFkYXB0ZXIvc3JjL2NvbnRyb2xzL2NyZWF0ZUJ1dHRvbkNvbnRyb2wudHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy9tYXBib3hnbC1tYXAtYWRhcHRlci9zcmMvY29udHJvbHMvY3JlYXRlQ29udHJvbC50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL21hcGJveGdsLW1hcC1hZGFwdGVyL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL21hcGJveGdsLW1hcC1hZGFwdGVyL3NyYy9sYXllci1hZGFwdGVycy9CYXNlQWRhcHRlci50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL21hcGJveGdsLW1hcC1hZGFwdGVyL3NyYy9sYXllci1hZGFwdGVycy9HZW9Kc29uQWRhcHRlci50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL21hcGJveGdsLW1hcC1hZGFwdGVyL3NyYy9sYXllci1hZGFwdGVycy9NdnRBZGFwdGVyLnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvbWFwYm94Z2wtbWFwLWFkYXB0ZXIvc3JjL2xheWVyLWFkYXB0ZXJzL09zbUFkYXB0ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy9tYXBib3hnbC1tYXAtYWRhcHRlci9zcmMvbGF5ZXItYWRhcHRlcnMvVGlsZUFkYXB0ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy9tYXBib3hnbC1tYXAtYWRhcHRlci9zcmMvbGF5ZXItYWRhcHRlcnMvVmVjdG9yQWRhcHRlci50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL21hcGJveGdsLW1hcC1hZGFwdGVyL3NyYy9sYXllci1hZGFwdGVycy9XbXNBZGFwdGVyLnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvbWFwYm94Z2wtbWFwLWFkYXB0ZXIvc3JjL3V0aWwvZ2VvbVR5cGUudHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy9tYXBib3hnbC1tYXAtYWRhcHRlci9zcmMvdXRpbC9pbWFnZUljb25zLnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvbmd3LWNvbm5lY3Rvci9zcmMvTmd3Q29ubmVjdG9yLnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvbmd3LWNvbm5lY3Rvci9zcmMvZXJyb3JzL05ldHdvcmtFcnJvci50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL25ndy1jb25uZWN0b3Ivc3JjL2Vycm9ycy9OZ3dFcnJvci50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL25ndy1jb25uZWN0b3Ivc3JjL2Vycm9ycy9SZXNvdXJjZU5vdEZvdW5kRXJyb3IudHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy9uZ3ctY29ubmVjdG9yL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL25ndy1jb25uZWN0b3Ivc3JjL3V0aWxzL2lzT2JqZWN0LnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvbmd3LWNvbm5lY3Rvci9zcmMvdXRpbHMvbG9hZERhdGEudHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy9uZ3ctY29ubmVjdG9yL3NyYy91dGlscy9sb2FkRGF0YUJyb3dzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy9uZ3ctY29ubmVjdG9yL3NyYy91dGlscy9sb2FkRGF0YU5vZGUudHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy9uZ3ctY29ubmVjdG9yL3NyYy91dGlscy9yZXNvdXJjZUNvbXBhcmUudHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy9uZ3ctY29ubmVjdG9yL3NyYy91dGlscy9yZXNvdXJjZVRvUXVlcnkudHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy9uZ3ctY29ubmVjdG9yL3NyYy91dGlscy90ZW1wbGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL3BhaW50L3NyYy9mcm9tUGFpbnRFeHByZXNzaW9uLnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvcGFpbnQvc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvcGFpbnQvc3JjL3ByZXBhcmVQYWludC50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL3BhaW50L3NyYy90eXBlSGVscGVycy50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL3Byb3BlcnRpZXMtZmlsdGVyL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL3Byb3BlcnRpZXMtZmlsdGVyL3NyYy9wcm9wZXJ0aWVzRmlsdGVyLnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvcW1zLWtpdC9zcmMvUW1zS2l0LnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvcW1zLWtpdC9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy9xbXMta2l0L3NyYy91dGlscy9jcmVhdGVRbXNBZGFwdGVyLnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvcW1zLWtpdC9zcmMvdXRpbHMvbG9hZEpzb24udHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy9xbXMta2l0L3NyYy91dGlscy91cGRhdGVRbXNPcHRpb25zLnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvdXJsLXJ1bnRpbWUtcGFyYW1zL3NyYy9VcmxSdW50aW1lUGFyYW1zLnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvdXJsLXJ1bnRpbWUtcGFyYW1zL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL3V0aWxzL3NyYy9DbGlwYm9hcmQudHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy91dGlscy9zcmMvYXBwbHlNaXhpbnMudHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy91dGlscy9zcmMvYXJyYXkvYXJyYXlDb21wYXJlLnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvdXRpbHMvc3JjL2FycmF5L2FycmF5VW5pcXVlLnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvdXRpbHMvc3JjL2FycmF5L2luZGV4LnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvdXRpbHMvc3JjL2RlYm91bmNlLnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvdXRpbHMvc3JjL2RlZXBtZXJnZS50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL3V0aWxzL3NyYy9kZWZpbmVkLnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvdXRpbHMvc3JjL2V2ZW50cy50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL3V0aWxzL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL3V0aWxzL3NyYy9vYmplY3QvYXNzaWduLnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvdXRpbHMvc3JjL29iamVjdC9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL3V0aWxzL3NyYy9wbGF0Zm9ybS50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL3V0aWxzL3NyYy9yZS9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL3V0aWxzL3NyYy9yZS9yZUVzY2FwZS50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL3V0aWxzL3NyYy9zbGVlcC50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL3V0aWxzL3NyYy9zdHJpbmcvY2FwaXRhbGl6ZS50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL3V0aWxzL3NyYy9zdHJpbmcvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy91dGlscy9zcmMvc3RyaW5nL251bWJlcldpdGhTcGFjZXMudHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy91dGlscy9zcmMvdHlwZUhlbHBlcnMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy91dGlscy9zcmMvdXJsLnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvd2VibWFwL3NyYy9XZWJNYXAudHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy93ZWJtYXAvc3JjL1dlYk1hcENvbnRyb2xzLnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvd2VibWFwL3NyYy9XZWJNYXBMYXllcnMudHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy93ZWJtYXAvc3JjL1dlYk1hcE1haW4udHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy93ZWJtYXAvc3JjL2NvbXBvbmVudHMvY29udHJvbHMvY3JlYXRlVG9nZ2xlQ29udHJvbC50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL3dlYm1hcC9zcmMvY29tcG9uZW50cy9rZXlzL0tleXMudHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy93ZWJtYXAvc3JjL2NvbXBvbmVudHMva2V5cy9LZXlzQ29kZXMudHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy93ZWJtYXAvc3JjL2NvbXBvbmVudHMvbWFwU3RhdGVzL0NlbnRlclN0YXRlLnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvd2VibWFwL3NyYy9jb21wb25lbnRzL21hcFN0YXRlcy9TdGF0ZUl0ZW0udHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy93ZWJtYXAvc3JjL2NvbXBvbmVudHMvbWFwU3RhdGVzL1pvb21TdGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL3dlYm1hcC9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vbmV4dGdpc19mcm9udGVuZC9wYWNrYWdlcy93ZWJtYXAvc3JjL2ludGVyZmFjZXMvTGF5ZXJBZGFwdGVyLnRzIiwid2VicGFjazovLy8uL25leHRnaXNfZnJvbnRlbmQvcGFja2FnZXMvd2VibWFwL3NyYy91dGlscy9jbGVhck9iamVjdC50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL3dlYm1hcC9zcmMvdXRpbHMvZGVjb3JhdG9ycy50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL3dlYm1hcC9zcmMvdXRpbHMvZ2VvbWV0cnlUeXBlcy50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL3dlYm1hcC9zcmMvdXRpbHMvZ2V0Qm91bmRzUG9seWdvbi50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL3dlYm1hcC9zcmMvdXRpbHMvcHJvcGVydGllc0ZpbHRlci50cyIsIndlYnBhY2s6Ly8vLi9uZXh0Z2lzX2Zyb250ZW5kL3BhY2thZ2VzL3dlYm1hcC9zcmMvdXRpbHMvdXBkYXRlR2VvSnNvbkFkYXB0ZXJPcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdBO0lBQWlDLCtCQUFLO0lBR3BDO1FBQUEsWUFDRSxpQkFBTyxTQUVSO1FBTEQsVUFBSSxHQUFHLGFBQWEsQ0FBQztRQUluQixNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUksRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7O0lBQ3JELENBQUM7SUFDSCxrQkFBQztBQUFELENBQUMsQ0FQZ0MsS0FBSyxHQU9yQzs7Ozs7Ozs7Ozs7Ozs7QUNWRDtBQUFBO0FBQUE7QUFBNEM7QUFNNUMsSUFBTSxjQUFjLEdBQUcsVUFDckIsT0FBZ0IsRUFDaEIsTUFBYyxFQUNkLFFBQWlCLEVBQ2pCLENBQUk7SUFFSixJQUFJO1FBQ0YsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3RCO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDWDtBQUNILENBQUMsQ0FBQztBQUVGLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQXNCWDtJQVlFLDJCQUNFLFFBSVM7UUFMWCxpQkF3Q0M7UUFsRFEsT0FBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO1FBQ1gsZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFDcEIsZUFBVSxHQUFHLElBQUksQ0FBQztR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QUFDLENBQUMsQ0FBQztRQUN6RCxJQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxJQUFJLDhEQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFFbkIsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSTtnQkFDYixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7Z0JBQ1IsQ0FBQyxDQUFDLFFBQVEsS0FBSyxTQUFTLElBQUksUUFBUSxLQUFLLE1BQU07b0JBQy9DLENBQUMsQ0FBQyxNQUFNO29CQUNSLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLFdBQVcsSUFBSSxDQUFDO3dCQUNqQyxDQUFDLENBQUMsTUFBTTt3QkFDUixDQUFDLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzlCO1FBQ0QsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQztLQUNqQztJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyIsImZpbGUiOiJtYWlufi5fYzRhNTEzMjAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRocm93biB3aGVuIGNvbnN1bWVyIHRyaWVzIHRvIGNvbm5lY3Qgd2hlbiBoZSBhbHJlYWR5IGNvbm5lY3RlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIENhbmNlbEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBuYW1lID0gJ0NhbmNlbEVycm9yJztcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLCBDYW5jZWxFcnJvci5wcm90b3R5cGUpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDYW5jZWxFcnJvciB9IGZyb20gJy4vQ2FuY2VsRXJyb3InO1xuXG50eXBlIFJlamVjdCA9IChyZWFzb24/OiBhbnkpID0+IHZvaWQ7XG50eXBlIFJlc29sdmUgPSAodmFsdWU/OiBhbnkpID0+IHZvaWQ7XG5leHBvcnQgdHlwZSBPbkNhbmNlbEZ1bmN0aW9uID0gKGNhbmNlbEhhbmRsZXI6ICgpID0+IHZvaWQpID0+IHZvaWQ7XG5cbmNvbnN0IGhhbmRsZUNhbGxiYWNrID0gPFQgPSBuZXZlcj4oXG4gIHJlc29sdmU6IFJlc29sdmUsXG4gIHJlamVjdDogUmVqZWN0LFxuICBjYWxsYmFjazogUmVzb2x2ZSxcbiAgcjogVFxuKSA9PiB7XG4gIHRyeSB7XG4gICAgcmVzb2x2ZShjYWxsYmFjayhyKSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZWplY3QoZSk7XG4gIH1cbn07XG5cbmxldCBJRCA9IDA7XG5cbi8qKlxuICogUHJvbWlzZSB0aGF0IGNhbiBiZSBjYW5jZWxlZFxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBcbiAqIGltcG9ydCBDYW5jZWxhYmxlUHJvbWlzZSBmcm9tIFwiQG5leHRnaXMvY2FuY2VsYWJsZS1wcm9taXNlXCI7XG4gKlxuICogY29uc3QgcHJvbWlzZSA9IG5ldyBDYW5jZWxhYmxlUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gKiAgc2V0VGltZW91dCgoKSA9PiByZXNvbHZlKCksIDEwMCk7XG4gKiB9KS5jYXRjaCgoZXIpID0+IHtcbiAqICBpZiAoZXIubmFtZSA9PT0gXCJDYW5jZWxFcnJvclwiKSB7XG4gKiAgICAvLyBoYW5kbGUgY2FuY2VsIGVycm9yXG4gKiAgfVxuICogIHRocm93IGVyO1xuICogfSk7XG4gKlxuICogcHJvbWlzZS5jYW5jZWwoKTtcbiAqIGBgYFxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgQ2FuY2VsYWJsZVByb21pc2U8VCA9IGFueT4gaW1wbGVtZW50cyBQcm9taXNlPFQ+IHtcbiAgcmVhZG9ubHkgW1N5bWJvbC50b1N0cmluZ1RhZ106IHN0cmluZztcbiAgcmVhZG9ubHkgaWQgPSBJRCsrO1xuICBwcml2YXRlIF9pc0NhbmNlbGVkID0gZmFsc2U7XG4gIHByaXZhdGUgX2lzUGVuZGluZyA9IHRydWU7XG4gIHByaXZhdGUgX3Byb21pc2U/OiBQcm9taXNlPFQ+O1xuICBwcml2YXRlIF9jYW5jZWxQcm9taXNlPzogUHJvbWlzZTxUPjtcbiAgcHJpdmF0ZSBfY2FuY2VsSGFuZGxlcnM6ICgoKSA9PiB2b2lkKVtdID0gW107XG4gIHByaXZhdGUgX3NldENhbmNlbGVkQ2FsbGJhY2s/OiAoZXI/OiBhbnkpID0+IHZvaWQ7XG4gIHByaXZhdGUgX3BhcmVudFByb21pc2U/OiBDYW5jZWxhYmxlUHJvbWlzZTtcbiAgcHJpdmF0ZSBfY2hpbGRyZW46IENhbmNlbGFibGVQcm9taXNlW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBleGVjdXRvcjogKFxuICAgICAgcmVzb2x2ZTogKHZhbHVlPzogVCB8IFByb21pc2VMaWtlPFQ+KSA9PiB2b2lkLFxuICAgICAgcmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkLFxuICAgICAgb25DYW5jZWw6IE9uQ2FuY2VsRnVuY3Rpb25cbiAgICApID0+IHZvaWRcbiAgKSB7XG4gICAgdGhpcy5fY2FuY2VsUHJvbWlzZSA9IG5ldyBQcm9taXNlPGFueT4oKHJlc29sdmVfLCByZWplY3RfKSA9PiB7XG4gICAgICB0aGlzLl9zZXRDYW5jZWxlZENhbGxiYWNrID0gKGVyKSA9PiByZXNvbHZlXyhlciB8fCBuZXcgQ2FuY2VsRXJyb3IoKSk7XG4gICAgfSk7XG4gICAgdGhpcy5fcHJvbWlzZSA9IFByb21pc2UucmFjZShbXG4gICAgICB0aGlzLl9jYW5jZWxQcm9taXNlLFxuICAgICAgbmV3IFByb21pc2U8VD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCBvblJlc29sdmUgPSAodmFsdWU/OiBUIHwgUHJvbWlzZUxpa2U8VD4pID0+IHtcbiAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBDYW5jZWxhYmxlUHJvbWlzZSkge1xuICAgICAgICAgICAgdGhpcy5hdHRhY2godmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9pc1BlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25SZWplY3QgPSAoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICAgIHRoaXMuX2lzUGVuZGluZyA9IGZhbHNlO1xuICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25DYW5jZWw6IE9uQ2FuY2VsRnVuY3Rpb24gPSAoaGFuZGxlcikgPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5faXNQZW5kaW5nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICdUaGUgYG9uQ2FuY2VsYCBoYW5kbGVyIHdhcyBhdHRhY2hlZCBhZnRlciB0aGUgcHJvbWlzZSBzZXR0bGVkLidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fY2FuY2VsSGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gZXhlY3V0b3Iob25SZXNvbHZlLCBvblJlamVjdCwgb25DYW5jZWwpO1xuICAgICAgfSksXG4gICAgXSk7XG4gIH1cblxuICBzdGF0aWMgcmVzb2x2ZTxUPih2YWx1ZTogVCB8IFByb21pc2VMaWtlPFQ+KTogQ2FuY2VsYWJsZVByb21pc2U8VD4ge1xuICAgIHJldHVybiBuZXcgQ2FuY2VsYWJsZVByb21pc2UoKHJlc29sdmUpID0+IHJlc29sdmUodmFsdWUpKTtcbiAgfVxuXG4gIHN0YXRpYyByZWplY3Q8VD4odmFsdWU6IFQgfCBQcm9taXNlTGlrZTxUPik6IENhbmNlbGFibGVQcm9taXNlPFQ+IHtcbiAgICByZXR1cm4gbmV3IENhbmNlbGFibGVQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHJlamVjdCh2YWx1ZSkpO1xuICB9XG5cbiAgc3RhdGljIGFsbDxUPih2YWx1ZXM6IChUIHwgUHJvbWlzZUxpa2U8VD4pW10pOiBDYW5jZWxhYmxlUHJvbWlzZTxUW10+IHtcbiAgICByZXR1cm4gbmV3IENhbmNlbGFibGVQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIFByb21pc2UuYWxsKHZhbHVlcykudGhlbihyZXNvbHZlKS5jYXRjaChyZWplY3QpO1xuICAgIH0pO1xuICB9XG5cbiAgYXR0YWNoKHA6IENhbmNlbGFibGVQcm9taXNlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2lzQ2FuY2VsZWQpIHtcbiAgICAgIHAuY2FuY2VsKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NoaWxkcmVuLnB1c2gocCk7XG4gICAgfVxuICB9XG5cbiAgdGhlbjxUUmVzdWx0MSA9IFQsIFRSZXN1bHQyID0gbmV2ZXI+KFxuICAgIG9uZnVsZmlsbGVkPzpcbiAgICAgIHwgKCh2YWx1ZTogVCkgPT4gVFJlc3VsdDEgfCBQcm9taXNlTGlrZTxUUmVzdWx0MT4pXG4gICAgICB8IHVuZGVmaW5lZFxuICAgICAgfCBudWxsLFxuICAgIG9ucmVqZWN0ZWQ/OlxuICAgICAgfCAoKHJlYXNvbjogYW55KSA9PiBUUmVzdWx0MiB8IFByb21pc2VMaWtlPFRSZXN1bHQyPilcbiAgICAgIHwgdW5kZWZpbmVkXG4gICAgICB8IG51bGxcbiAgKTogQ2FuY2VsYWJsZVByb21pc2U8VFJlc3VsdDEgfCBUUmVzdWx0Mj4ge1xuICAgIGNvbnN0IHAgPSBuZXcgQ2FuY2VsYWJsZVByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKHRoaXMuX3Byb21pc2UpIHtcbiAgICAgICAgY29uc3QgcmVqZWN0XyA9IChyOiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAob25yZWplY3RlZCkge1xuICAgICAgICAgICAgaGFuZGxlQ2FsbGJhY2socmVzb2x2ZSwgcmVqZWN0LCBvbnJlamVjdGVkLCByKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVqZWN0KHIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fcHJvbWlzZS50aGVuKChyKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuX2lzQ2FuY2VsZWQpIHtcbiAgICAgICAgICAgIHJlamVjdF8ocik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChvbmZ1bGZpbGxlZCkge1xuICAgICAgICAgICAgICBoYW5kbGVDYWxsYmFjayhyZXNvbHZlLCByZWplY3QsIG9uZnVsZmlsbGVkLCByKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc29sdmUocik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LCByZWplY3RfKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwLl9wYXJlbnRQcm9taXNlID0gdGhpcztcbiAgICB0aGlzLl9jaGlsZHJlbi5wdXNoKHApO1xuICAgIHJldHVybiBwIGFzIENhbmNlbGFibGVQcm9taXNlPFRSZXN1bHQxIHwgVFJlc3VsdDI+O1xuICB9XG5cbiAgY2F0Y2g8VFJlc3VsdCA9IG5ldmVyPihcbiAgICBvbnJlamVjdGVkPzpcbiAgICAgIHwgKChyZWFzb246IEVycm9yKSA9PiBUUmVzdWx0IHwgUHJvbWlzZUxpa2U8VFJlc3VsdD4pXG4gICAgICB8IHVuZGVmaW5lZFxuICAgICAgfCBudWxsXG4gICk6IENhbmNlbGFibGVQcm9taXNlPFQgfCBUUmVzdWx0PiB7XG4gICAgaWYgKHRoaXMuX2lzQ2FuY2VsZWQgJiYgb25yZWplY3RlZCkge1xuICAgICAgb25yZWplY3RlZChuZXcgQ2FuY2VsRXJyb3IoKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvbnJlamVjdGVkKTtcbiAgfVxuXG4gIGZpbmFsbHkob25maW5hbGx5PzogKCgpID0+IHZvaWQpIHwgdW5kZWZpbmVkIHwgbnVsbCk6IFByb21pc2U8VD4ge1xuICAgIGlmICh0aGlzLl9wcm9taXNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcHJvbWlzZS5maW5hbGx5KG9uZmluYWxseSk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9pc0NhbmNlbGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IENhbmNlbEVycm9yKCkpO1xuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3Q8VD4ob25maW5hbGx5KTtcbiAgfVxuXG4gIGNhbmNlbCgpOiB0aGlzIHtcbiAgICBpZiAodGhpcy5faXNDYW5jZWxlZCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHRoaXMuX2lzQ2FuY2VsZWQgPSB0cnVlO1xuICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX2dldFRvcFBhcmVudCgpO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIHBhcmVudC5jYW5jZWwoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fY2hpbGRyZW4pIHtcbiAgICAgIHRoaXMuX2NoaWxkcmVuLmZvckVhY2goKHgpID0+IHguY2FuY2VsKCkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9pc1BlbmRpbmcpIHtcbiAgICAgIGlmICh0aGlzLl9jYW5jZWxIYW5kbGVycy5sZW5ndGgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmb3IgKGNvbnN0IGhhbmRsZXIgb2YgdGhpcy5fY2FuY2VsSGFuZGxlcnMpIHtcbiAgICAgICAgICAgIGhhbmRsZXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgLy8gdGhpcy5fc2V0Q2FuY2VsZWRDYWxsYmFjayhlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9zZXRDYW5jZWxlZENhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX3NldENhbmNlbGVkQ2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5fZGVzdHJveSgpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwcml2YXRlIF9nZXRUb3BQYXJlbnQoKSB7XG4gICAgbGV0IHBhcmVudCA9IHRoaXMuX3BhcmVudFByb21pc2U7XG4gICAgbGV0IGhhc1BhcmVudCA9ICEhcGFyZW50O1xuICAgIHdoaWxlIChoYXNQYXJlbnQpIHtcbiAgICAgIGlmIChwYXJlbnQgJiYgcGFyZW50Ll9wYXJlbnRQcm9taXNlKSB7XG4gICAgICAgIHBhcmVudCA9IHBhcmVudC5fcGFyZW50UHJvbWlzZTtcbiAgICAgICAgaGFzUGFyZW50ID0gISFwYXJlbnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoYXNQYXJlbnQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhcmVudDtcbiAgfVxuXG4gIHByaXZhdGUgX2Rlc3Ryb3koKSB7XG4gICAgdGhpcy5fc2V0Q2FuY2VsZWRDYWxsYmFjayA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9jYW5jZWxQcm9taXNlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX3Byb21pc2UgPSB1bmRlZmluZWQ7XG4gIH1cbn1cblxuT2JqZWN0LnNldFByb3RvdHlwZU9mKENhbmNlbGFibGVQcm9taXNlLnByb3RvdHlwZSwgUHJvbWlzZS5wcm90b3R5cGUpO1xuIiwiaW1wb3J0IHsgQ2FuY2VsYWJsZVByb21pc2UgfSBmcm9tICcuL0NhbmNlbGFibGVQcm9taXNlJztcblxuZXhwb3J0IHsgQ2FuY2VsYWJsZVByb21pc2UgfTtcblxuZXhwb3J0IGRlZmF1bHQgQ2FuY2VsYWJsZVByb21pc2U7XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCJpbXBvcnQgZGlhbG9nUG9seWZpbGwgZnJvbSAnZGlhbG9nLXBvbHlmaWxsJztcbmltcG9ydCAnZGlhbG9nLXBvbHlmaWxsL2RpYWxvZy1wb2x5ZmlsbC5jc3MnO1xuaW1wb3J0IHsgRGlhbG9nQWRhcHRlciwgRGlhbG9nQWRhcHRlck9wdGlvbnMgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG5pbXBvcnQgJy4vZGlhbG9nLmNzcyc7XG5cbmNvbnN0IGNsb3NlQnRuID0gYFxuICA8YSBocmVmPVwiI1wiPlxuICAgIDxzdmcgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgd2lkdGg9XCIyNFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgIDxwYXRoIGQ9XCJNMTkgNi40MUwxNy41OSA1IDEyIDEwLjU5IDYuNDEgNSA1IDYuNDEgMTAuNTkgMTIgNSAxNy41OSA2LjQxIDE5IDEyIDEzLjQxIDE3LjU5IDE5IDE5IDE3LjU5IDEzLjQxIDEyelwiPlxuICAgICAgPC9wYXRoPlxuICAgICAgPHBhdGggZD1cIk0wIDBoMjR2MjRIMHpcIiBmaWxsPVwibm9uZVwiPjwvcGF0aD5cbiAgICA8L3N2Zz5cbiAgPC9hPlxuYDtcblxuLyoqXG4gKiBAYWxwaGFcbiAqL1xuZXhwb3J0IGNsYXNzIERpYWxvZyBpbXBsZW1lbnRzIERpYWxvZ0FkYXB0ZXIge1xuICBzdGF0aWMgZGlhbG9nczogRGlhbG9nW10gPSBbXTtcbiAgb3B0aW9uczogRGlhbG9nQWRhcHRlck9wdGlvbnMgPSB7XG4gICAgdGVtcGxhdGU6IGBcbiAgICAgIDxwPlRoaXMgaXMgZGlhbG9nITwvcD5cbiAgICBgLFxuICAgIGNsb3NlQnRuOiB0cnVlLFxuICAgIGNsb3NlQnRuVGVtcGxhdGU6IGNsb3NlQnRuLFxuICB9O1xuXG4gIHByaXZhdGUgX2RpYWxvZzogSFRNTERpYWxvZ0VsZW1lbnQ7XG4gIHByaXZhdGUgX2lzTmF0aXZlRGlhbG9nOiBib29sZWFuO1xuICBwcml2YXRlIF9jb250ZW50OiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBfcGFyZW50OiBOb2RlO1xuICBwcml2YXRlIF9jbG9zZUJ0bj86IEhUTUxFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBEaWFsb2dBZGFwdGVyT3B0aW9ucykge1xuICAgIHRoaXMuX2RpYWxvZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpYWxvZycpIGFzIEhUTUxEaWFsb2dFbGVtZW50O1xuXG4gICAgRGlhbG9nLmRpYWxvZ3MucHVzaCh0aGlzKTtcblxuICAgIHRoaXMuX2RpYWxvZy5jbGFzc05hbWUgPSAnZGlhbG9nLWNvbXBvbmVudCc7XG4gICAgdGhpcy5vcHRpb25zID0geyAuLi50aGlzLm9wdGlvbnMsIC4uLm9wdGlvbnMgfTtcbiAgICB0aGlzLl9wYXJlbnQgPSB0aGlzLm9wdGlvbnMucGFyZW50IHx8IGRvY3VtZW50LmJvZHk7XG5cbiAgICB0aGlzLl9pc05hdGl2ZURpYWxvZyA9ICEhdGhpcy5fZGlhbG9nLnNob3dNb2RhbDtcblxuICAgIGlmICghdGhpcy5faXNOYXRpdmVEaWFsb2cpIHtcbiAgICAgIGRpYWxvZ1BvbHlmaWxsLnJlZ2lzdGVyRGlhbG9nKHRoaXMuX2RpYWxvZyk7XG4gICAgICB0aGlzLl9kaWFsb2cuY2xhc3NMaXN0LmFkZCgncG9seWZpbGxlZCcpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMuY2xvc2VCdG4pIHtcbiAgICAgIHRoaXMuX2Nsb3NlQnRuID0gdGhpcy5fY3JlYXRlQ2xvc2VCdG4oKTtcbiAgICB9XG5cbiAgICB0aGlzLl9jb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5fZGlhbG9nLmFwcGVuZENoaWxkKHRoaXMuX2NvbnRlbnQpO1xuXG4gICAgdGhpcy51cGRhdGVDb250ZW50KCk7XG5cbiAgICBpZiAodGhpcy5fcGFyZW50KSB7XG4gICAgICB0aGlzLl9wYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5fZGlhbG9nKTtcbiAgICB9XG5cbiAgICB0aGlzLl9hZGRFdmVudHNMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIHN0YXRpYyBjbGVhbigpOiB2b2lkIHtcbiAgICBEaWFsb2cuZGlhbG9ncy5mb3JFYWNoKCh4KSA9PiB4LmRlc3Ryb3koKSk7XG4gIH1cblxuICBnZXRDb250YWluZXIoKTogSFRNTERpYWxvZ0VsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLl9kaWFsb2c7XG4gIH1cblxuICBzaG93KCk6IHZvaWQge1xuICAgIHRoaXMuX2RpYWxvZy5zaG93TW9kYWwoKTtcbiAgfVxuXG4gIGNsb3NlKCk6IHZvaWQge1xuICAgIHRoaXMuX2RpYWxvZy5jbG9zZSgpO1xuICB9XG5cbiAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmNsb3NlKCk7XG4gICAgdGhpcy5fZGlhbG9nLnJlbW92ZSgpO1xuICB9XG5cbiAgdXBkYXRlQ29udGVudChjb250ZW50Pzogc3RyaW5nIHwgTm9kZSk6IHZvaWQge1xuICAgIGlmICghY29udGVudCAmJiB0aGlzLm9wdGlvbnMudGVtcGxhdGUpIHtcbiAgICAgIGNvbnRlbnQgPSB0aGlzLm9wdGlvbnMudGVtcGxhdGU7XG4gICAgfVxuICAgIGlmIChjb250ZW50KSB7XG4gICAgICB0aGlzLl9hZGRDb250ZW50KGNvbnRlbnQsIHRoaXMuX2NvbnRlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZUNsb3NlQnRuKCkge1xuICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy5vcHRpb25zLmNsb3NlQnRuVGVtcGxhdGU7XG4gICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGJ0bi5jbGFzc05hbWUgPSAnZGlhbG9nLWNvbXBvbmVudF9fY2xvc2UnO1xuICAgICAgdGhpcy5fZGlhbG9nLmFwcGVuZENoaWxkKGJ0bik7XG4gICAgICB0aGlzLl9hZGRDb250ZW50KHRlbXBsYXRlLCBidG4pO1xuXG4gICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBidG47XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYWRkQ29udGVudChjb250ZW50OiBzdHJpbmcgfCBOb2RlLCBwYXJlbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgcGFyZW50LmlubmVySFRNTCA9IGNvbnRlbnQ7XG4gICAgfSBlbHNlIGlmIChjb250ZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgIHBhcmVudC5pbm5lckhUTUwgPSAnJztcbiAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjb250ZW50KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9hZGRFdmVudHNMaXN0ZW5lcnMoKSB7XG4gICAgaWYgKHRoaXMuX2Nsb3NlQnRuKSB7XG4gICAgICB0aGlzLl9jbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdGlvbnMub3BlbmVycykge1xuICAgICAgW10uZm9yRWFjaC5jYWxsKHRoaXMub3B0aW9ucy5vcGVuZXJzLCAob3BlbmVyOiBIVE1MRWxlbWVudCkgPT4ge1xuICAgICAgICBvcGVuZXIub25jbGljayA9IChlKSA9PiB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5fZGlhbG9nLmFkZEV2ZW50TGlzdGVuZXIoJ2Nsb3NlJywgKCkgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coJ2RpYWxvZyBjbG9zZWQnKTtcbiAgICB9KTtcbiAgICB0aGlzLl9kaWFsb2cuYWRkRXZlbnRMaXN0ZW5lcignY2FuY2VsJywgKCkgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coJ2RpYWxvZyBjYW5jZWxlZCcpO1xuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgeyBEaWFsb2cgfSBmcm9tICcuL2RpYWxvZyc7XG5pbXBvcnQgeyBEaWFsb2dBZGFwdGVyT3B0aW9ucyB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCB7IERpYWxvZ0FkYXB0ZXJPcHRpb25zIH07XG5leHBvcnQgeyBEaWFsb2cgfTtcbmV4cG9ydCBkZWZhdWx0IERpYWxvZztcbiIsImltcG9ydCB7XG4gIE1hcEFkYXB0ZXIsXG4gIEZpdE9wdGlvbnMsXG4gIE1hcENvbnRyb2wsXG4gIENvbnRyb2xQb3NpdGlvbnMsXG4gIEJ1dHRvbkNvbnRyb2xPcHRpb25zLFxuICBMbmdMYXRBcnJheSxcbiAgTWFwT3B0aW9ucyxcbiAgTGF5ZXJBZGFwdGVyLFxuICBMbmdMYXRCb3VuZHNBcnJheSxcbiAgV2ViTWFwRXZlbnRzLFxuICBDcmVhdGVDb250cm9sT3B0aW9ucyxcbn0gZnJvbSAnQG5leHRnaXMvd2VibWFwJztcbmltcG9ydCB7IHNsZWVwLCBkZWJvdW5jZSB9IGZyb20gJ0BuZXh0Z2lzL3V0aWxzJztcbmltcG9ydCB7IE12dEFkYXB0ZXIgfSBmcm9tICcuL2xheWVyLWFkYXB0ZXJzL012dEFkYXB0ZXInO1xuaW1wb3J0IG1hcGJveGdsLCB7XG4gIE1hcCxcbiAgSUNvbnRyb2wsXG4gIE1hcEV2ZW50VHlwZSxcbiAgRXZlbnREYXRhLFxuICBNYXBib3hPcHRpb25zLFxuICBSZXF1ZXN0UGFyYW1ldGVycyxcbiAgUmVzb3VyY2VUeXBlLFxuICBGaXRCb3VuZHNPcHRpb25zLFxufSBmcm9tICdtYXBib3gtZ2wnO1xuaW1wb3J0IHsgT3NtQWRhcHRlciB9IGZyb20gJy4vbGF5ZXItYWRhcHRlcnMvT3NtQWRhcHRlcic7XG5pbXBvcnQgeyBUaWxlQWRhcHRlciB9IGZyb20gJy4vbGF5ZXItYWRhcHRlcnMvVGlsZUFkYXB0ZXInO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcbmltcG9ydCB7IFpvb21Db250cm9sIH0gZnJvbSAnLi9jb250cm9scy9ab29tQ29udHJvbCc7XG5pbXBvcnQgeyBDb21wYXNzQ29udHJvbCB9IGZyb20gJy4vY29udHJvbHMvQ29tcGFzc0NvbnRyb2wnO1xuaW1wb3J0IHsgQXR0cmlidXRpb25Db250cm9sIH0gZnJvbSAnLi9jb250cm9scy9BdHRyaWJ1dGlvbkNvbnRyb2wnO1xuaW1wb3J0IHsgR2VvSnNvbkFkYXB0ZXIgfSBmcm9tICcuL2xheWVyLWFkYXB0ZXJzL0dlb0pzb25BZGFwdGVyJztcbmltcG9ydCB7IGNyZWF0ZUNvbnRyb2wgfSBmcm9tICcuL2NvbnRyb2xzL2NyZWF0ZUNvbnRyb2wnO1xuaW1wb3J0IHsgY3JlYXRlQnV0dG9uQ29udHJvbCB9IGZyb20gJy4vY29udHJvbHMvY3JlYXRlQnV0dG9uQ29udHJvbCc7XG5pbXBvcnQgeyBXbXNBZGFwdGVyIH0gZnJvbSAnLi9sYXllci1hZGFwdGVycy9XbXNBZGFwdGVyJztcblxuZXhwb3J0IHR5cGUgVExheWVyID0gc3RyaW5nW107XG50eXBlIFRMYXllckFkYXB0ZXIgPSBMYXllckFkYXB0ZXI8TWFwLCBUTGF5ZXI+O1xuXG5jb25zdCBmaXRCb3VuZHNPcHRpb25zOiBGaXRPcHRpb25zID0ge1xuICAvLyBwYWRkaW5nOiAxMDBcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFwYm94Z2xNYXBBZGFwdGVyT3B0aW9ucyBleHRlbmRzIE1hcE9wdGlvbnMge1xuICBzdHlsZT86IFBhcnRpYWw8bWFwYm94Z2wuU3R5bGU+IHwgc3RyaW5nO1xuICBhY2Nlc3NUb2tlbj86IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIE1hcGJveGdsTWFwQWRhcHRlciBpbXBsZW1lbnRzIE1hcEFkYXB0ZXI8TWFwLCBUTGF5ZXIsIElDb250cm9sPiB7XG4gIHN0YXRpYyBsYXllckFkYXB0ZXJzID0ge1xuICAgIFRJTEU6IFRpbGVBZGFwdGVyLFxuICAgIFdNUzogV21zQWRhcHRlcixcbiAgICAvLyBJTUFHRTogVGlsZUFkYXB0ZXIsXG4gICAgTVZUOiBNdnRBZGFwdGVyLFxuICAgIE9TTTogT3NtQWRhcHRlcixcbiAgICBHRU9KU09OOiBHZW9Kc29uQWRhcHRlcixcbiAgfTtcblxuICBzdGF0aWMgY29udHJvbEFkYXB0ZXJzOiB7IFtuYW1lOiBzdHJpbmddOiBhbnkgfSA9IHtcbiAgICBaT09NOiBab29tQ29udHJvbCxcbiAgICBDT01QQVNTOiBDb21wYXNzQ29udHJvbCxcbiAgICBBVFRSSUJVVElPTjogQXR0cmlidXRpb25Db250cm9sLFxuICB9O1xuXG4gIG9wdGlvbnM6IE1hcGJveGdsTWFwQWRhcHRlck9wdGlvbnMgPSB7fTtcbiAgbWFwITogTWFwO1xuXG4gIGVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgbGF5ZXJBZGFwdGVycyA9IE1hcGJveGdsTWFwQWRhcHRlci5sYXllckFkYXB0ZXJzO1xuICBjb250cm9sQWRhcHRlcnMgPSBNYXBib3hnbE1hcEFkYXB0ZXIuY29udHJvbEFkYXB0ZXJzO1xuICBpc0xvYWRlZCA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX3VuaXZlcnNhbEV2ZW50czogKGtleW9mIFdlYk1hcEV2ZW50cylbXSA9IFtcbiAgICAnem9vbXN0YXJ0JyxcbiAgICAnem9vbScsXG4gICAgJ3pvb21lbmQnLFxuICAgICdtb3Zlc3RhcnQnLFxuICAgICdtb3ZlJyxcbiAgICAnbW92ZWVuZCcsXG4gIF07XG5cbiAgcHJpdmF0ZSBfc291cmNlRGF0YUxvYWRpbmc6IHsgW25hbWU6IHN0cmluZ106IGFueVtdIH0gPSB7fTtcbiAgcHJpdmF0ZSBfc29ydFRpbWVySWQ/OiBudW1iZXI7XG4gIHByaXZhdGUgX19zZXRMYXllck9yZGVyOiAobGF5ZXJzOiB7IFt4OiBzdHJpbmddOiBUTGF5ZXJBZGFwdGVyIH0pID0+IHZvaWQ7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fX3NldExheWVyT3JkZXIgPSBkZWJvdW5jZSgobGF5ZXJzKSA9PiB0aGlzLl9zZXRMYXllck9yZGVyKGxheWVycykpO1xuICB9XG5cbiAgLy8gY3JlYXRlKG9wdGlvbnM6IE1hcE9wdGlvbnMgPSB7dGFyZ2V0OiAnbWFwJ30pIHtcbiAgY3JlYXRlKG9wdGlvbnM6IE1hcGJveGdsTWFwQWRhcHRlck9wdGlvbnMpOiBQcm9taXNlPHVua25vd24+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLm1hcCkge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICBpZiAob3B0aW9ucy5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgIG1hcGJveGdsLmFjY2Vzc1Rva2VuID0gb3B0aW9ucy5hY2Nlc3NUb2tlbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy50YXJnZXQpIHtcbiAgICAgICAgICBjb25zdCBtYXBPcHQ6IE1hcGJveE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBjb250YWluZXI6IG9wdGlvbnMudGFyZ2V0LFxuICAgICAgICAgICAgYXR0cmlidXRpb25Db250cm9sOiBmYWxzZSxcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGJvdW5kczogb3B0aW9ucy5ib3VuZHMsXG4gICAgICAgICAgICBmaXRCb3VuZHNPcHRpb25zOiB7XG4gICAgICAgICAgICAgIC4uLm9wdGlvbnMuZml0T3B0aW9ucyxcbiAgICAgICAgICAgICAgLi4uZml0Qm91bmRzT3B0aW9ucyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0cmFuc2Zvcm1SZXF1ZXN0OiAodXJsOiBzdHJpbmcsIHJlc291cmNlVHlwZTogUmVzb3VyY2VUeXBlKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybWVkID0gdGhpcy5fdHJhbnNmb3JtUmVxdWVzdCh1cmwsIHJlc291cmNlVHlwZSk7XG4gICAgICAgICAgICAgIGlmICh0cmFuc2Zvcm1lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cmFuc2Zvcm1lZDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuc3R5bGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBtYXBPcHQuc3R5bGUgPSBvcHRpb25zLnN0eWxlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtYXBPcHQuc3R5bGUgPSB7XG4gICAgICAgICAgICAgIC4uLntcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiA4LFxuICAgICAgICAgICAgICAgIG5hbWU6ICdFbXB0eSBzdHlsZScsXG4gICAgICAgICAgICAgICAgc291cmNlczoge30sXG4gICAgICAgICAgICAgICAgbGF5ZXJzOiBbXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgLi4ub3B0aW9ucy5zdHlsZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChvcHRpb25zLmNlbnRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBtYXBPcHQuY2VudGVyID0gb3B0aW9ucy5jZW50ZXI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChvcHRpb25zLnpvb20gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbWFwT3B0Lnpvb20gPSBvcHRpb25zLnpvb20gLSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAob3B0aW9ucy5tYXhab29tKSB7XG4gICAgICAgICAgICBtYXBPcHQubWF4Wm9vbSA9IG9wdGlvbnMubWF4Wm9vbSAtIDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChvcHRpb25zLm1pblpvb20pIHtcbiAgICAgICAgICAgIG1hcE9wdC5taW5ab29tID0gb3B0aW9ucy5taW5ab29tIC0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5tYXAgPSBuZXcgTWFwKG1hcE9wdCk7XG4gICAgICAgICAgdGhpcy5tYXAub25jZSgnbG9hZCcsICgpID0+IHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIHRoaXMubWFwLl9vbk1hcENsaWNrTGF5ZXJzID0gW107XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICB0aGlzLm1hcC50cmFuc2Zvcm1SZXF1ZXN0cyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5pc0xvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnY3JlYXRlJywgdGhpcyk7XG4gICAgICAgICAgICByZXNvbHZlKHRoaXMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuX2FkZEV2ZW50c0xpc3RlbmVycygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBkZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm1hcCkge1xuICAgICAgdGhpcy5tYXAucmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0Q29udGFpbmVyKCk6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5tYXAgJiYgdGhpcy5tYXAuZ2V0Q29udGFpbmVyKCk7XG4gIH1cblxuICBzZXRWaWV3KGNlbnRlcjogTG5nTGF0QXJyYXksIHpvb20/OiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5tYXApIHtcbiAgICAgIGNvbnN0IG9wdGlvbnM6IG1hcGJveGdsLkNhbWVyYU9wdGlvbnMgPSB7IGNlbnRlciB9O1xuICAgICAgaWYgKHpvb20pIHtcbiAgICAgICAgb3B0aW9ucy56b29tID0gem9vbSAtIDE7XG4gICAgICB9XG4gICAgICB0aGlzLm1hcC5qdW1wVG8ob3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgc2V0Q2VudGVyKGxhdExuZzogTG5nTGF0QXJyYXkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5tYXApIHtcbiAgICAgIHRoaXMubWFwLnNldENlbnRlcihsYXRMbmcpO1xuICAgIH1cbiAgfVxuXG4gIGdldENlbnRlcigpOiBMbmdMYXRBcnJheSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHRoaXMubWFwKSB7XG4gICAgICBjb25zdCBjZW50ZXIgPSB0aGlzLm1hcC5nZXRDZW50ZXIoKTtcbiAgICAgIHJldHVybiBbY2VudGVyLmxuZywgY2VudGVyLmxhdF07XG4gICAgfVxuICB9XG5cbiAgc2V0Wm9vbSh6b29tOiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5tYXApIHtcbiAgICAgIHRoaXMubWFwLnNldFpvb20oem9vbSAtIDEpO1xuICAgIH1cbiAgfVxuXG4gIGdldFpvb20oKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAodGhpcy5tYXApIHtcbiAgICAgIGNvbnN0IHpvb20gPSB0aGlzLm1hcC5nZXRab29tKCk7XG4gICAgICBpZiAoem9vbSA8IDEpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB6b29tID8gem9vbSArIDEgOiB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgZ2V0Qm91bmRzKCk6IExuZ0xhdEJvdW5kc0FycmF5IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAodGhpcy5tYXApIHtcbiAgICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMubWFwLmdldEJvdW5kcygpO1xuICAgICAgY29uc3QgYXIgPSBib3VuZHMudG9BcnJheSgpO1xuICAgICAgcmV0dXJuIFthclswXVswXSwgYXJbMF1bMV0sIGFyWzFdWzBdLCBhclsxXVsxXV07XG4gICAgfVxuICB9XG5cbiAgLy8gW2V4dGVudF9sZWZ0LCBleHRlbnRfYm90dG9tLCBleHRlbnRfcmlnaHQsIGV4dGVudF90b3BdO1xuICBhc3luYyBmaXRCb3VuZHMoXG4gICAgZTogTG5nTGF0Qm91bmRzQXJyYXksXG4gICAgb3B0aW9uczogRml0T3B0aW9ucyA9IHt9XG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLm1hcCkge1xuICAgICAgY29uc3QgZml0Qm91bmRPcHRpb25zOiBGaXRCb3VuZHNPcHRpb25zID0ge1xuICAgICAgICBsaW5lYXI6IHRydWUsXG4gICAgICAgIGR1cmF0aW9uOiAwLFxuICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAuLi5maXRCb3VuZHNPcHRpb25zLFxuICAgICAgfTtcbiAgICAgIHRoaXMubWFwLmZpdEJvdW5kcyhcbiAgICAgICAgW1xuICAgICAgICAgIFtlWzBdLCBlWzFdXSxcbiAgICAgICAgICBbZVsyXSwgZVszXV0sXG4gICAgICAgIF0sXG4gICAgICAgIGZpdEJvdW5kT3B0aW9uc1xuICAgICAgKTtcbiAgICAgIHNsZWVwKGZpdEJvdW5kT3B0aW9ucy5kdXJhdGlvbik7XG4gICAgfVxuICB9XG5cbiAgc2V0Um90YXRpb24oYW5nbGU6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIGlnbm9yZVxuICB9XG5cbiAgc2hvd0xheWVyKGxheWVySWRzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIGxheWVySWRzICYmXG4gICAgICBsYXllcklkcy5mb3JFYWNoKChsYXllcklkKSA9PiB7XG4gICAgICAgIHRoaXMuX3RvZ2dsZUxheWVyKGxheWVySWQsIHRydWUpO1xuICAgICAgfSk7XG4gIH1cblxuICBoaWRlTGF5ZXIobGF5ZXJJZHM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgbGF5ZXJJZHMgJiZcbiAgICAgIGxheWVySWRzLmZvckVhY2goKGxheWVySWQpID0+IHtcbiAgICAgICAgdGhpcy5fdG9nZ2xlTGF5ZXIobGF5ZXJJZCwgZmFsc2UpO1xuICAgICAgfSk7XG4gIH1cblxuICByZW1vdmVMYXllcihsYXllcklkczogc3RyaW5nW10pOiB2b2lkIHtcbiAgICBjb25zdCBfbWFwID0gdGhpcy5tYXA7XG4gICAgaWYgKF9tYXAgJiYgbGF5ZXJJZHMgJiYgQXJyYXkuaXNBcnJheShsYXllcklkcykpIHtcbiAgICAgIGxheWVySWRzLmZvckVhY2goKGxheWVySWQpID0+IHtcbiAgICAgICAgX21hcC5yZW1vdmVMYXllcihsYXllcklkKTtcbiAgICAgICAgY29uc3Qgc291cmNlID0gX21hcC5nZXRTb3VyY2UobGF5ZXJJZCk7XG4gICAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgICBfbWFwLnJlbW92ZVNvdXJjZShsYXllcklkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc2V0TGF5ZXJPcmRlcihcbiAgICBsYXllcklkczogc3RyaW5nW10sXG4gICAgb3JkZXI6IG51bWJlcixcbiAgICBsYXllcnM6IHsgW3g6IHN0cmluZ106IFRMYXllckFkYXB0ZXIgfVxuICApOiB2b2lkIHtcbiAgICB0aGlzLl9fc2V0TGF5ZXJPcmRlcihsYXllcnMpO1xuICB9XG5cbiAgc2V0TGF5ZXJPcGFjaXR5KGxheWVySWRzOiBzdHJpbmdbXSwgb3BhY2l0eTogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgX21hcCA9IHRoaXMubWFwO1xuICAgIGlmIChfbWFwKSB7XG4gICAgICBsYXllcklkcy5mb3JFYWNoKChsYXllcklkKSA9PiB7XG4gICAgICAgIHRoaXMuX29uTWFwTG9hZCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGxheWVyID0gX21hcC5nZXRMYXllcihsYXllcklkKTtcbiAgICAgICAgICBpZiAobGF5ZXIpIHtcbiAgICAgICAgICAgIGlmIChsYXllci50eXBlID09PSAnc3ltYm9sJykge1xuICAgICAgICAgICAgICBfbWFwLnNldFBhaW50UHJvcGVydHkobGF5ZXJJZCwgJ3RleHQtb3BhY2l0eScsIG9wYWNpdHkpO1xuICAgICAgICAgICAgICBfbWFwLnNldFBhaW50UHJvcGVydHkobGF5ZXJJZCwgJ2ljb24tb3BhY2l0eScsIG9wYWNpdHkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX21hcC5zZXRQYWludFByb3BlcnR5KGxheWVySWQsIGxheWVyLnR5cGUgKyAnLW9wYWNpdHknLCBvcGFjaXR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlQ29udHJvbChjb250cm9sOiBNYXBDb250cm9sLCBvcHRpb25zPzogQ3JlYXRlQ29udHJvbE9wdGlvbnMpOiBJQ29udHJvbCB7XG4gICAgcmV0dXJuIGNyZWF0ZUNvbnRyb2woY29udHJvbCwgb3B0aW9ucyk7XG4gIH1cblxuICBjcmVhdGVCdXR0b25Db250cm9sKG9wdGlvbnM6IEJ1dHRvbkNvbnRyb2xPcHRpb25zKTogSUNvbnRyb2wge1xuICAgIHJldHVybiBjcmVhdGVCdXR0b25Db250cm9sKG9wdGlvbnMpO1xuICB9XG5cbiAgYWRkQ29udHJvbChcbiAgICBjb250cm9sOiBJQ29udHJvbCxcbiAgICBwb3NpdGlvbjogQ29udHJvbFBvc2l0aW9uc1xuICApOiBJQ29udHJvbCB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHRoaXMubWFwKSB7XG4gICAgICB0aGlzLm1hcC5hZGRDb250cm9sKGNvbnRyb2wsIHBvc2l0aW9uKTtcbiAgICAgIHJldHVybiBjb250cm9sO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUNvbnRyb2woY29udHJvbDogSUNvbnRyb2wpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5tYXApIHtcbiAgICAgIHRoaXMubWFwLnJlbW92ZUNvbnRyb2woY29udHJvbCk7XG4gICAgfVxuICB9XG5cbiAgb25NYXBDbGljayhldnQ6IE1hcEV2ZW50VHlwZVsnY2xpY2snXSAmIEV2ZW50RGF0YSk6IHZvaWQge1xuICAgIGNvbnN0IGxhdExuZyA9IGV2dC5sbmdMYXQ7XG4gICAgY29uc3QgeyB4LCB5IH0gPSBldnQucG9pbnQ7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3ByZWNsaWNrJywgeyBsYXRMbmcsIHBpeGVsOiB7IHRvcDogeSwgbGVmdDogeCB9IH0pO1xuICAgIGlmICh0aGlzLm1hcCkge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGhpcy5tYXAuX29uTWFwQ2xpY2tMYXllcnNcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgIGlmIChhLm9wdGlvbnM/Lm9yZGVyICYmIGIub3B0aW9ucz8ub3JkZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBiLm9wdGlvbnMub3JkZXIgLSBhLm9wdGlvbnMub3JkZXI7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9KVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIC5maW5kKCh4KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHguX29uTGF5ZXJDbGljayhldnQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnY2xpY2snLCB7IGxhdExuZywgcGl4ZWw6IHsgdG9wOiB5LCBsZWZ0OiB4IH0gfSk7XG4gIH1cblxuICBwcml2YXRlIF9vbk1hcExvYWQoY2I/OiAoKSA9PiBhbnkpOiBQcm9taXNlPE1hcD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxNYXA+KChyZXNvbHZlKSA9PiB7XG4gICAgICBjb25zdCBfcmVzb2x2ZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgY2IoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5tYXApIHtcbiAgICAgICAgICByZXNvbHZlKHRoaXMubWFwKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGlmICh0aGlzLmlzTG9hZGVkKSB7XG4gICAgICAgIC8vIG1hcC5sb2FkZWQoKVxuICAgICAgICBfcmVzb2x2ZSgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm1hcCkge1xuICAgICAgICB0aGlzLmVtaXR0ZXIub25jZSgnY3JlYXRlJywgKCkgPT4ge1xuICAgICAgICAgIF9yZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0TGF5ZXJPcmRlcihsYXllcnM6IHsgW3g6IHN0cmluZ106IFRMYXllckFkYXB0ZXIgfSk6IHZvaWQge1xuICAgIGNvbnN0IF9tYXAgPSB0aGlzLm1hcDtcbiAgICBpZiAoX21hcCkge1xuICAgICAgY29uc3QgYmFzZUxheWVyczogVExheWVyQWRhcHRlcltdID0gW107XG4gICAgICBsZXQgb3JkZXJlZExheWVyczogVExheWVyQWRhcHRlcltdID0gW107XG4gICAgICBmb3IgKGNvbnN0IGwgaW4gbGF5ZXJzKSB7XG4gICAgICAgIGNvbnN0IGxheWVyID0gbGF5ZXJzW2xdO1xuICAgICAgICBpZiAobGF5ZXIub3B0aW9ucy5iYXNlbGF5ZXIpIHtcbiAgICAgICAgICBiYXNlTGF5ZXJzLnB1c2gobGF5ZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9yZGVyZWRMYXllcnMucHVzaChsYXllcik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gbm9ybWFsaXplIGxheWVyIG9yZGVyaW5nXG4gICAgICBiYXNlTGF5ZXJzLmZvckVhY2goKHgpID0+IHtcbiAgICAgICAgaWYgKHgubGF5ZXIpIHtcbiAgICAgICAgICB4LmxheWVyLmZvckVhY2goKHkpID0+IHtcbiAgICAgICAgICAgIF9tYXAubW92ZUxheWVyKHkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgb3JkZXJlZExheWVycyA9IG9yZGVyZWRMYXllcnMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICByZXR1cm4gYS5vcHRpb25zLm9yZGVyICE9PSB1bmRlZmluZWQgJiYgYi5vcHRpb25zLm9yZGVyICE9PSB1bmRlZmluZWRcbiAgICAgICAgICA/IGEub3B0aW9ucy5vcmRlciAtIGIub3B0aW9ucy5vcmRlclxuICAgICAgICAgIDogMDtcbiAgICAgIH0pO1xuXG4gICAgICBmb3IgKGxldCBmcnkgPSAwOyBmcnkgPCBvcmRlcmVkTGF5ZXJzLmxlbmd0aDsgZnJ5KyspIHtcbiAgICAgICAgY29uc3QgbWVtID0gb3JkZXJlZExheWVyc1tmcnldO1xuICAgICAgICBjb25zdCBfbGF5ZXJzID0gdGhpcy5fZ2V0TGF5ZXJJZHMobWVtKTtcbiAgICAgICAgX2xheWVycy5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICAgICAgX21hcC5tb3ZlTGF5ZXIoeCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2dldExheWVySWRzKG1lbTogVExheWVyQWRhcHRlcik6IHN0cmluZ1tdIHtcbiAgICBsZXQgX2xheWVyczogVExheWVyID0gW107XG4gICAgaWYgKG1lbSkge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkobWVtLmxheWVyKSkge1xuICAgICAgICBfbGF5ZXJzID0gbWVtLmxheWVyO1xuICAgICAgfSBlbHNlIGlmIChtZW0uZ2V0RGVwZW5kTGF5ZXJzKSB7XG4gICAgICAgIGNvbnN0IGRlcGVuZExheWVycyA9IG1lbS5nZXREZXBlbmRMYXllcnMoKTtcbiAgICAgICAgZGVwZW5kTGF5ZXJzLmZvckVhY2goKHgpID0+IHtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlIFVwZGF0ZSB4IGludGVyZmFjZVxuICAgICAgICAgIGNvbnN0IGxheWVyOiBUTGF5ZXIgPSAoeC5sYXllciAmJiB4LmxheWVyLmxheWVyKSB8fCB4O1xuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGxheWVyKSkge1xuICAgICAgICAgICAgbGF5ZXIuZm9yRWFjaCgoeSkgPT4ge1xuICAgICAgICAgICAgICBfbGF5ZXJzLnB1c2goeSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gX2xheWVycztcbiAgfVxuXG4gIHByaXZhdGUgX3RvZ2dsZUxheWVyKGxheWVySWQ6IHN0cmluZywgc3RhdHVzOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5fb25NYXBMb2FkKCkudGhlbigoX21hcCkgPT4ge1xuICAgICAgX21hcC5zZXRMYXlvdXRQcm9wZXJ0eShcbiAgICAgICAgbGF5ZXJJZCxcbiAgICAgICAgJ3Zpc2liaWxpdHknLFxuICAgICAgICBzdGF0dXMgPyAndmlzaWJsZScgOiAnbm9uZSdcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9vbk1hcFNvdXJjZURhdGEoZGF0YTogbWFwYm94Z2wuTWFwU291cmNlRGF0YUV2ZW50ICYgRXZlbnREYXRhKSB7XG4gICAgaWYgKGRhdGEuZGF0YVR5cGUgPT09ICdzb3VyY2UnKSB7XG4gICAgICBjb25zdCBpc0xvYWRlZCA9IGRhdGEuaXNTb3VyY2VMb2FkZWQ7XG4gICAgICBjb25zdCBlbWl0ID0gKHRhcmdldDogc3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkYXRhLWxvYWRlZCcsIHsgdGFyZ2V0IH0pO1xuICAgICAgfTtcbiAgICAgIHRoaXMuX29uRGF0YUxvYWQoZGF0YSwgaXNMb2FkZWQsIGVtaXQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX29uTWFwRXJyb3IoXG4gICAgZGF0YTogbWFwYm94Z2wuRXJyb3JFdmVudCAmIG1hcGJveGdsLk1hcFNvdXJjZURhdGFFdmVudCAmIEV2ZW50RGF0YVxuICApIHtcbiAgICBpZiAodGhpcy5fc291cmNlRGF0YUxvYWRpbmdbZGF0YS5zb3VyY2VJZF0pIHtcbiAgICAgIGNvbnN0IGlzTG9hZGVkID0gZGF0YS5pc1NvdXJjZUxvYWRlZDtcbiAgICAgIGNvbnN0IGVtaXQgPSAodGFyZ2V0OiBzdHJpbmcpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RhdGEtZXJyb3InLCB7IHRhcmdldCB9KTtcbiAgICAgIH07XG4gICAgICB0aGlzLl9vbkRhdGFMb2FkKGRhdGEsIGlzTG9hZGVkLCBlbWl0KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9vbkRhdGFMb2FkKFxuICAgIGRhdGE6IHsgc291cmNlSWQ6IHN0cmluZzsgdGlsZTogYW55IH0sXG4gICAgaXNMb2FkZWQgPSBmYWxzZSxcbiAgICBlbWl0OiAoc291cmNlSWQ6IHN0cmluZykgPT4gdm9pZFxuICApIHtcbiAgICAvLyBpZiBhbGwgc291cmNlcyBpcyBsb2FkZWQgZW1taXQgZXZlbnQgZm9yIGFsbCBhbmQgY2xlYW4gbWVtXG4gICAgaWYgKGlzTG9hZGVkKSB7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9zb3VyY2VEYXRhTG9hZGluZykuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgICBlbWl0KHgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9zb3VyY2VEYXRhTG9hZGluZyA9IHt9O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjaGVjayBpZiBhbGwgdGlsZXMgaW4gbGF5ZXIgaXMgbG9hZGVkXG4gICAgICBjb25zdCB0aWxlcyA9IHRoaXMuX3NvdXJjZURhdGFMb2FkaW5nW2RhdGEuc291cmNlSWRdO1xuICAgICAgaWYgKHRpbGVzICYmIGRhdGEudGlsZSkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRpbGVzLmluZGV4T2YoZGF0YS50aWxlKTtcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgIHRoaXMuX3NvdXJjZURhdGFMb2FkaW5nW2RhdGEuc291cmNlSWRdLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgbm8gbW9yZSBsb2FkZWQgdGlsZXMgaW4gbGF5ZXIgZW1pdCBldmVudCBhbmQgY2xlYW4gbWVtIG9ubHkgZm9yIHRoaXMgbGF5ZXJcbiAgICAgICAgaWYgKCF0aWxlcy5sZW5ndGgpIHtcbiAgICAgICAgICBlbWl0KGRhdGEuc291cmNlSWQpO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9zb3VyY2VEYXRhTG9hZGluZ1tkYXRhLnNvdXJjZUlkXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3RyYW5zZm9ybVJlcXVlc3QoXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgcmVzb3VyY2VUeXBlOiBSZXNvdXJjZVR5cGVcbiAgKTogUmVxdWVzdFBhcmFtZXRlcnMgfCB1bmRlZmluZWQge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCB0cmFuc2Zvcm1SZXF1ZXN0cyA9IHRoaXMubWFwICYmIHRoaXMubWFwLnRyYW5zZm9ybVJlcXVlc3RzO1xuICAgIGlmICh0cmFuc2Zvcm1SZXF1ZXN0cykge1xuICAgICAgZm9yIChjb25zdCByIG9mIHRyYW5zZm9ybVJlcXVlc3RzKSB7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHIodXJsLCByZXNvdXJjZVR5cGUpIGFzIFJlcXVlc3RQYXJhbWV0ZXJzO1xuICAgICAgICBpZiAocGFyYW1zKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcmFtcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9hZGRFdmVudHNMaXN0ZW5lcnMoKTogdm9pZCB7XG4gICAgY29uc3QgX21hcCA9IHRoaXMubWFwO1xuICAgIGlmIChfbWFwKSB7XG4gICAgICAvLyB3cml0ZSBtZW0gZm9yIHN0YXJ0IGxvYWRlZCBsYXllcnNcbiAgICAgIF9tYXAub24oJ3NvdXJjZWRhdGFsb2FkaW5nJywgKGRhdGEpID0+IHtcbiAgICAgICAgdGhpcy5fc291cmNlRGF0YUxvYWRpbmdbZGF0YS5zb3VyY2VJZF0gPVxuICAgICAgICAgIHRoaXMuX3NvdXJjZURhdGFMb2FkaW5nW2RhdGEuc291cmNlSWRdIHx8IFtdO1xuICAgICAgICBpZiAoZGF0YS50aWxlKSB7XG4gICAgICAgICAgdGhpcy5fc291cmNlRGF0YUxvYWRpbmdbZGF0YS5zb3VyY2VJZF0ucHVzaChkYXRhLnRpbGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8vIGVtbWl0IGRhdGEtbG9hZGVkIGZvciBlYWNoIGxheWVyIG9yIGFsbCBzb3VyY2VzIGlzIGxvYWRlZFxuICAgICAgX21hcC5vbignc291cmNlZGF0YScsIHRoaXMuX29uTWFwU291cmNlRGF0YS5iaW5kKHRoaXMpKTtcbiAgICAgIF9tYXAub24oJ2Vycm9yJywgdGhpcy5fb25NYXBFcnJvci5iaW5kKHRoaXMpKTtcbiAgICAgIF9tYXAub24oJ2NsaWNrJywgKGV2dCkgPT4ge1xuICAgICAgICB0aGlzLm9uTWFwQ2xpY2soZXZ0KTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl91bml2ZXJzYWxFdmVudHMuZm9yRWFjaCgoZSkgPT4ge1xuICAgICAgICBfbWFwLm9uKGUsICgpID0+IHRoaXMuZW1pdHRlci5lbWl0KGUsIHRoaXMpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIiwiLy8gaW1wb3J0IHsgTWFwQ29udHJvbCB9IGZyb20gJ0BuZXh0Z2lzL3dlYm1hcCc7XG5pbXBvcnQgeyBBdHRyaWJ1dGlvbkNvbnRyb2wgYXMgQUMgfSBmcm9tICdtYXBib3gtZ2wnO1xuXG5leHBvcnQgY2xhc3MgQXR0cmlidXRpb25Db250cm9sIGV4dGVuZHMgQUMge31cbiIsImltcG9ydCB7IE5hdmlnYXRpb25Db250cm9sIH0gZnJvbSAnbWFwYm94LWdsJztcblxuZXhwb3J0IGNsYXNzIENvbXBhc3NDb250cm9sIGV4dGVuZHMgTmF2aWdhdGlvbkNvbnRyb2wge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywgeyBzaG93Wm9vbTogZmFsc2UgfSk7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gIH1cbn1cbiIsImltcG9ydCB7IE5hdmlnYXRpb25Db250cm9sIH0gZnJvbSAnbWFwYm94LWdsJztcbmltcG9ydCB7IFpvb21Db250cm9sT3B0aW9ucyB9IGZyb20gJ0BuZXh0Z2lzL3dlYm1hcCc7XG5cbmV4cG9ydCBjbGFzcyBab29tQ29udHJvbCBleHRlbmRzIE5hdmlnYXRpb25Db250cm9sIHtcbiAgb3B0aW9uczogWm9vbUNvbnRyb2xPcHRpb25zICYgYW55O1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFpvb21Db250cm9sT3B0aW9ucyAmIGFueSA9IHt9KSB7XG4gICAgb3B0aW9ucyA9IHsgLi4ub3B0aW9ucywgc2hvd0NvbXBhc3M6IGZhbHNlIH07XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gIH1cblxuICBfY3JlYXRlQnV0dG9uKFxuICAgIGNsYXNzTmFtZTogc3RyaW5nLFxuICAgIGFyaWFMYWJlbDogc3RyaW5nLFxuICAgIGZuOiAoKSA9PiBhbnlcbiAgKTogSFRNTEVsZW1lbnQge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBlbGVtZW50ID0gc3VwZXIuX2NyZWF0ZUJ1dHRvbihcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIGFyaWFMYWJlbCxcbiAgICAgIGZuXG4gICAgKSBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCBhbGlhc2VzOiBhbnkgPSB7XG4gICAgICAnWm9vbSBpbic6ICd6b29tSW5UaXRsZScsXG4gICAgICAnWm9vbSBvdXQnOiAnem9vbU91dFRpdGxlJyxcbiAgICB9O1xuICAgIGNvbnN0IGFsaWFzID0gYWxpYXNlc1thcmlhTGFiZWxdO1xuICAgIGNvbnN0IGxhYmVsID0gYWxpYXMgJiYgdGhpcy5vcHRpb25zW2FsaWFzXTtcbiAgICBpZiAobGFiZWwpIHtcbiAgICAgIGVsZW1lbnQudGl0bGUgPSBsYWJlbDtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgbGFiZWwpO1xuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG59XG4iLCJpbXBvcnQgeyBJQ29udHJvbCB9IGZyb20gJ21hcGJveC1nbCc7XG5pbXBvcnQgeyBCdXR0b25Db250cm9sT3B0aW9ucyB9IGZyb20gJ0BuZXh0Z2lzL3dlYm1hcCc7XG5pbXBvcnQgeyBjcmVhdGVDb250cm9sIH0gZnJvbSAnLi9jcmVhdGVDb250cm9sJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUJ1dHRvbkNvbnRyb2wob3B0aW9uczogQnV0dG9uQ29udHJvbE9wdGlvbnMpOiBJQ29udHJvbCB7XG4gIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgbGluay5jbGFzc05hbWUgPSAnbWFwYm94Z2wtY3RybC1pY29uJztcblxuICBsaW5rLnNldEF0dHJpYnV0ZSgncm9sZScsICdidXR0b24nKTtcbiAgaWYgKG9wdGlvbnMudGl0bGUpIHtcbiAgICBsaW5rLnRpdGxlID0gb3B0aW9ucy50aXRsZTtcbiAgICBsaW5rLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIG9wdGlvbnMudGl0bGUpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuaHRtbCkge1xuICAgIGlmIChvcHRpb25zLmh0bWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgbGluay5hcHBlbmRDaGlsZChvcHRpb25zLmh0bWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaW5rLmlubmVySFRNTCA9IG9wdGlvbnMuaHRtbDtcbiAgICB9XG4gICAgY29uc3QgY2hpbGQgPSBsaW5rLmZpcnN0RWxlbWVudENoaWxkIGFzIEhUTUxFbGVtZW50O1xuICAgIGlmIChjaGlsZCkge1xuICAgICAgY2hpbGQuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICBjaGlsZC5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG4gICAgICBjaGlsZC5zdHlsZS5saW5lSGVpZ2h0ID0gKGxpbmsub2Zmc2V0SGVpZ2h0IHx8IDMwKSArICdweCc7XG4gICAgfVxuICB9XG4gIGlmIChvcHRpb25zLmFkZENsYXNzKSB7XG4gICAgb3B0aW9ucy5hZGRDbGFzcy5zcGxpdCgnICcpLmZvckVhY2goKHgpID0+IGxpbmsuY2xhc3NMaXN0LmFkZCh4KSk7XG4gIH1cblxuICBjb25zdCBvbkNsaWNrID0gKGU6IEV2ZW50KSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBvcHRpb25zLm9uQ2xpY2soKTtcbiAgfTtcbiAgaWYgKG9wdGlvbnMub25DbGljayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2spO1xuICB9XG5cbiAgcmV0dXJuIGNyZWF0ZUNvbnRyb2woXG4gICAge1xuICAgICAgb25BZGQoKSB7XG4gICAgICAgIHJldHVybiBsaW5rO1xuICAgICAgfSxcbiAgICAgIG9uUmVtb3ZlKCkge1xuICAgICAgICBjb25zdCBwYXJlbnQgPSBsaW5rLnBhcmVudE5vZGU7XG4gICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobGluayk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMub25DbGljayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgbGluay5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2spO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0sXG4gICAgeyBiYXI6IHRydWUsIGFkZENsYXNzOiAnbWFwYm94Z2wtY3RybC1ncm91cCcgfVxuICApO1xufVxuIiwiaW1wb3J0IHsgTWFwQ29udHJvbCwgQ3JlYXRlQ29udHJvbE9wdGlvbnMgfSBmcm9tICdAbmV4dGdpcy93ZWJtYXAnO1xuaW1wb3J0IHsgSUNvbnRyb2wgfSBmcm9tICdtYXBib3gtZ2wnO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29udHJvbChcbiAgY29udHJvbDogTWFwQ29udHJvbCxcbiAgb3B0aW9uczogQ3JlYXRlQ29udHJvbE9wdGlvbnMgPSB7fVxuKTogSUNvbnRyb2wge1xuICBjbGFzcyBDb250cm9sIGltcGxlbWVudHMgSUNvbnRyb2wge1xuICAgIHByaXZhdGUgX2NvbnRhaW5lcj86IEhUTUxFbGVtZW50O1xuXG4gICAgZ2V0RGVmYXVsdFBvc2l0aW9uKCkge1xuICAgICAgcmV0dXJuICd0b3AtbGVmdCc7XG4gICAgfVxuXG4gICAgb25BZGQoKSB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBjb25zdCBjb250ZW50ID0gY29udHJvbC5vbkFkZCgpO1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXBib3hnbC1jdHJsJyk7XG4gICAgICBpZiAob3B0aW9ucy5iYXIpIHtcbiAgICAgICAgLy8gYWRkIGN1c3RvbSBjc3MgZm9yIGJvYXJkZXIgc3R5bGVcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXBib3hnbC1iYXInKTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zLmFkZENsYXNzKSB7XG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChvcHRpb25zLmFkZENsYXNzKTtcbiAgICAgIH1cbiAgICAgIGlmIChjb250ZW50KSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY29udGVudCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9jb250YWluZXIgPSBlbGVtZW50O1xuICAgICAgcmV0dXJuIHRoaXMuX2NvbnRhaW5lcjtcbiAgICB9XG5cbiAgICBvblJlbW92ZSgpIHtcbiAgICAgIGlmICh0aGlzLl9jb250YWluZXIpIHtcbiAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5fY29udGFpbmVyLnBhcmVudE5vZGU7XG4gICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQodGhpcy5fY29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRyb2wub25SZW1vdmUoKTtcbiAgICB9XG5cbiAgICByZW1vdmUoKSB7XG4gICAgICB0aGlzLm9uUmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBDb250cm9sKCk7XG4gIC8vIHJldHVybiBjb250cm9sO1xufVxuIiwiaW1wb3J0IHsgTWFwYm94Z2xNYXBBZGFwdGVyIH0gZnJvbSAnLi9NYXBib3hnbE1hcEFkYXB0ZXInO1xuZXhwb3J0ICogZnJvbSAnLi9NYXBib3hnbE1hcEFkYXB0ZXInO1xuZXhwb3J0IGRlZmF1bHQgTWFwYm94Z2xNYXBBZGFwdGVyO1xuIiwiaW1wb3J0IHsgTWFwIH0gZnJvbSAnbWFwYm94LWdsJztcbmltcG9ydCB7IE1haW5MYXllckFkYXB0ZXIsIEFkYXB0ZXJPcHRpb25zIH0gZnJvbSAnQG5leHRnaXMvd2VibWFwJztcbmltcG9ydCB7IFRMYXllciB9IGZyb20gJy4uL01hcGJveGdsTWFwQWRhcHRlcic7XG5cbmxldCBJRCA9IDA7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlQWRhcHRlcjxPIGV4dGVuZHMgQWRhcHRlck9wdGlvbnMgPSBBZGFwdGVyT3B0aW9ucz5cbiAgaW1wbGVtZW50cyBNYWluTGF5ZXJBZGFwdGVyPE1hcCwgVExheWVyLCBPPiB7XG4gIGxheWVyPzogVExheWVyO1xuICBtYXA/OiBNYXA7XG4gIHByb3RlY3RlZCByZWFkb25seSBfbGF5ZXJJZDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKG1hcDogTWFwLCBwdWJsaWMgb3B0aW9uczogTykge1xuICAgIHRoaXMubWFwID0gbWFwO1xuICAgIHRoaXMuX2xheWVySWQgPSBgbGF5ZXItJHtJRCsrfWA7XG4gIH1cblxuICBiZWZvcmVSZW1vdmUoKTogdm9pZCB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7IG1hcDogdW5kZWZpbmVkIH0pO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuICBhYnN0cmFjdCBhZGRMYXllcihvcHRpb25zOiBPKTogVExheWVyIHwgUHJvbWlzZTxUTGF5ZXI+IHwgdW5kZWZpbmVkO1xufVxuIiwiaW1wb3J0IHsgTWFwLCBHZW9KU09OU291cmNlLCBHZW9KU09OU291cmNlUmF3IH0gZnJvbSAnbWFwYm94LWdsJztcbmltcG9ydCB7XG4gIEdlb0pzb25BZGFwdGVyT3B0aW9ucyxcbiAgVmVjdG9yQWRhcHRlckxheWVyVHlwZSxcbiAgRGF0YUxheWVyRmlsdGVyLFxuICBMYXllckRlZmluaXRpb24sXG4gIFByb3BlcnRpZXNGaWx0ZXIsXG59IGZyb20gJ0BuZXh0Z2lzL3dlYm1hcCc7XG5pbXBvcnQgeyBWZWN0b3JBZGFwdGVyTGF5ZXJQYWludCwgR2V0UGFpbnRDYWxsYmFjayB9IGZyb20gJ0BuZXh0Z2lzL3BhaW50JztcbmltcG9ydCB7IGZlYXR1cmVGaWx0ZXIgfSBmcm9tICdAbmV4dGdpcy9wcm9wZXJ0aWVzLWZpbHRlcic7XG5pbXBvcnQge1xuICBHZW9Kc29uT2JqZWN0LFxuICBGZWF0dXJlQ29sbGVjdGlvbixcbiAgR2VvbWV0cnlDb2xsZWN0aW9uLFxuICBHZW9tZXRyeU9iamVjdCxcbiAgR2VvbWV0cnksXG4gIEdlb0pzb25Qcm9wZXJ0aWVzLFxufSBmcm9tICdnZW9qc29uJztcbmltcG9ydCB7IFRMYXllciB9IGZyb20gJy4uL01hcGJveGdsTWFwQWRhcHRlcic7XG5pbXBvcnQgeyBWZWN0b3JBZGFwdGVyLCBGZWF0dXJlIH0gZnJvbSAnLi9WZWN0b3JBZGFwdGVyJztcbmltcG9ydCB7XG4gIGRldGVjdFR5cGUsXG4gIHR5cGVBbGlhcyxcbiAgdHlwZUFsaWFzRm9yRmlsdGVyLFxuICBnZW9tZXRyeUZpbHRlcixcbn0gZnJvbSAnLi4vdXRpbC9nZW9tVHlwZSc7XG5cbmxldCBJRCA9IDA7XG5cbnR5cGUgTGF5ZXJzID0gTGF5ZXJEZWZpbml0aW9uPEZlYXR1cmU8R2VvbWV0cnksIEdlb0pzb25Qcm9wZXJ0aWVzPiwgVExheWVyPltdO1xuXG5leHBvcnQgY2xhc3MgR2VvSnNvbkFkYXB0ZXIgZXh0ZW5kcyBWZWN0b3JBZGFwdGVyPEdlb0pzb25BZGFwdGVyT3B0aW9ucz4ge1xuICBzZWxlY3RlZCA9IGZhbHNlO1xuICBzb3VyY2U/OiBzdHJpbmc7XG4gIHByaXZhdGUgX2ZlYXR1cmVzOiBGZWF0dXJlW10gPSBbXTtcbiAgcHJpdmF0ZSBfZmlsdGVyZWRGZWF0dXJlSWRzPzogKHN0cmluZyB8IG51bWJlcilbXSB8IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBfZmlsdGVyRnVuPzogRGF0YUxheWVyRmlsdGVyPEZlYXR1cmU+O1xuICBwcml2YXRlIF9zb3VyY2VzOiBSZWNvcmQ8c3RyaW5nLCBHZW9KU09OU291cmNlPiA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBtYXA6IE1hcCwgcHVibGljIG9wdGlvbnM6IEdlb0pzb25BZGFwdGVyT3B0aW9ucykge1xuICAgIHN1cGVyKG1hcCwgb3B0aW9ucyk7XG4gICAgdGhpcy5zb3VyY2UgPSB0aGlzLl9zb3VyY2VJZDtcbiAgfVxuXG4gIGFzeW5jIGFkZExheWVyKG9wdGlvbnM6IEdlb0pzb25BZGFwdGVyT3B0aW9ucyk6IFByb21pc2U8VExheWVyPiB7XG4gICAgY29uc3QgbGF5ZXIgPSBhd2FpdCBzdXBlci5hZGRMYXllcihvcHRpb25zKTtcbiAgICBpZiAodGhpcy5vcHRpb25zLmRhdGEpIHtcbiAgICAgIHRoaXMuYWRkRGF0YSh0aGlzLm9wdGlvbnMuZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBsYXllcjtcbiAgfVxuXG4gIGJlZm9yZVJlbW92ZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5tYXApIHtcbiAgICAgIGNvbnN0IHNvdXJjZSA9IHRoaXMubWFwLmdldFNvdXJjZSh0aGlzLl9zb3VyY2VJZCk7XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIHRoaXMubWFwLnJlbW92ZVNvdXJjZSh0aGlzLl9zb3VyY2VJZCk7XG4gICAgICB9XG4gICAgfVxuICAgIHN1cGVyLmJlZm9yZVJlbW92ZSgpO1xuICB9XG5cbiAgY2xlYXJMYXllcihjYj86IChmZWF0dXJlOiBGZWF0dXJlKSA9PiBib29sZWFuKTogdm9pZCB7XG4gICAgbGV0IGZlYXR1cmVzOiBGZWF0dXJlW10gPSBbXTtcbiAgICBjb25zdCBzb3VyY2UgPSB0aGlzLm1hcC5nZXRTb3VyY2UodGhpcy5fc291cmNlSWQpIGFzIEdlb0pTT05Tb3VyY2U7XG4gICAgaWYgKGNiKSB7XG4gICAgICBmZWF0dXJlcyA9IHRoaXMuX2ZlYXR1cmVzID0gdGhpcy5fZmVhdHVyZXMuZmlsdGVyKCh4KSA9PiAhY2IoeCkpO1xuICAgIH1cbiAgICB0aGlzLl9mZWF0dXJlcyA9IGZlYXR1cmVzO1xuICAgIHNvdXJjZS5zZXREYXRhKHsgdHlwZTogJ0ZlYXR1cmVDb2xsZWN0aW9uJywgZmVhdHVyZXMgfSk7XG4gIH1cblxuICBhc3luYyBhZGREYXRhKGRhdGE6IEdlb0pzb25PYmplY3QpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsZXQgdHlwZTogVmVjdG9yQWRhcHRlckxheWVyVHlwZSB8IHVuZGVmaW5lZDtcbiAgICBpZiAodGhpcy5vcHRpb25zLnR5cGUpIHtcbiAgICAgIHR5cGUgPSB0aGlzLm9wdGlvbnMudHlwZTtcbiAgICB9XG4gICAgaWYgKCF0eXBlICYmIGRhdGEpIHtcbiAgICAgIGNvbnN0IGRldGVjdGVkVHlwZSA9IGRldGVjdFR5cGUoZGF0YSk7XG4gICAgICB0eXBlID0gdHlwZUFsaWFzW2RldGVjdGVkVHlwZV07XG4gICAgfVxuICAgIGlmIChkYXRhICYmIHR5cGUpIHtcbiAgICAgIGNvbnN0IGZlYXR1cmVzID0gdGhpcy5maWx0ZXJHZW9tZXRyaWVzKGRhdGEsIHR5cGUpO1xuICAgICAgZmVhdHVyZXMuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgICAvLyB0byBhdm9pZCBpZCA9IDAgaXMgZmFsc2VcbiAgICAgICAgY29uc3QgZmlkID0gJ18nICsgSUQrKztcbiAgICAgICAgeC5fZmVhdHVyZUZpbHRlcklkID0gZmlkO1xuICAgICAgICBpZiAoeC5wcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgeC5wcm9wZXJ0aWVzW3RoaXMuZmVhdHVyZUlkTmFtZV0gPSBmaWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKHRoaXMuX2ZpbHRlckZ1bikge1xuICAgICAgICB0aGlzLl9maWx0ZXIodGhpcy5fZmlsdGVyRnVuKTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IHRoaXMuX3VwZGF0ZUxheWVyUGFpbnQodHlwZSk7XG4gICAgICBjb25zdCBzb3VyY2UgPSB0aGlzLm1hcC5nZXRTb3VyY2UodGhpcy5fc291cmNlSWQpIGFzIEdlb0pTT05Tb3VyY2U7XG4gICAgICBzb3VyY2Uuc2V0RGF0YSh7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgICAgIGZlYXR1cmVzOiB0aGlzLl9mZWF0dXJlcyxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldExheWVycygpOiBMYXllcnMge1xuICAgIGNvbnN0IGZpbHRlcmVkID0gdGhpcy5fZmlsdGVyZWRGZWF0dXJlSWRzO1xuICAgIGNvbnN0IGZpbHRlclByb3BlcnRpZXMgPSB0aGlzLl9maWx0ZXJQcm9wZXJ0aWVzO1xuICAgIGlmIChmaWx0ZXJQcm9wZXJ0aWVzKSB7XG4gICAgICB0aGlzLl91cGRhdGVXaXRoTmF0aXZlRmlsdGVyKGZpbHRlclByb3BlcnRpZXMpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fZ2V0RmVhdHVyZXMoKS5tYXAoKGZlYXR1cmUpID0+IHtcbiAgICAgIGxldCB2aXNpYmxlID0gZmFsc2U7XG4gICAgICBpZiAoZmlsdGVyUHJvcGVydGllcyAmJiBmZWF0dXJlLnByb3BlcnRpZXMpIHtcbiAgICAgICAgdmlzaWJsZSA9IGZlYXR1cmVGaWx0ZXIoZmVhdHVyZSwgZmlsdGVyUHJvcGVydGllcyk7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlcmVkKSB7XG4gICAgICAgIGNvbnN0IGlkID0gdGhpcy5fZ2V0RmVhdHVyZUZpbHRlcklkKGZlYXR1cmUpO1xuICAgICAgICBpZiAoaWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZpc2libGUgPSBmaWx0ZXJlZC5pbmRleE9mKGlkKSAhPT0gLTE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGZlYXR1cmUsXG4gICAgICAgIHZpc2libGUsXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZmlsdGVyKGZ1bjogRGF0YUxheWVyRmlsdGVyPEZlYXR1cmUsIFRMYXllcj4pOiB2b2lkIHtcbiAgICB0aGlzLl9maWx0ZXJGdW4gPSBmdW47XG4gICAgdGhpcy5fZmlsdGVyKGZ1bik7XG4gIH1cblxuICByZW1vdmVGaWx0ZXIoKTogdm9pZCB7XG4gICAgdGhpcy5fZmlsdGVyRnVuID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2ZpbHRlcmVkRmVhdHVyZUlkcyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl91cGRhdGVGaWx0ZXIoKTtcbiAgfVxuXG4gIGdldFNlbGVjdGVkKCk6IExheWVycyB7XG4gICAgY29uc3QgZmVhdHVyZXM6IExheWVyRGVmaW5pdGlvbjxGZWF0dXJlLCBUTGF5ZXI+W10gPSBbXTtcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVJZHMgPSB0aGlzLl9zZWxlY3RlZEZlYXR1cmVJZHM7XG4gICAgY29uc3Qgc2VsZWN0UHJvcGVydGllcyA9IHRoaXMuX3NlbGVjdFByb3BlcnRpZXM7XG4gICAgY29uc3QgYWxsRmVhdHVyZXMgPSB0aGlzLl9nZXRGZWF0dXJlcygpO1xuICAgIGlmIChzZWxlY3RlZEZlYXR1cmVJZHMgJiYgc2VsZWN0ZWRGZWF0dXJlSWRzLmxlbmd0aCkge1xuICAgICAgYWxsRmVhdHVyZXMuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMuX2dldEZlYXR1cmVGaWx0ZXJJZCh4KTtcbiAgICAgICAgaWYgKGlkICYmIHNlbGVjdGVkRmVhdHVyZUlkcy5pbmRleE9mKGlkKSAhPT0gLTEpIHtcbiAgICAgICAgICBmZWF0dXJlcy5wdXNoKHsgZmVhdHVyZTogeCB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnNvdXJjZSAmJiBzZWxlY3RQcm9wZXJ0aWVzKSB7XG4gICAgICBhbGxGZWF0dXJlc1xuICAgICAgICAuZmlsdGVyKCh4KSA9PiBmZWF0dXJlRmlsdGVyKHgsIHNlbGVjdFByb3BlcnRpZXMpKVxuICAgICAgICAuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgICAgIGZlYXR1cmVzLnB1c2goeyBmZWF0dXJlOiB4IH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGZlYXR1cmVzO1xuICB9XG5cbiAgc2VsZWN0KGZpbmQ/OiBEYXRhTGF5ZXJGaWx0ZXI8RmVhdHVyZSwgVExheWVyPiB8IFByb3BlcnRpZXNGaWx0ZXIpOiB2b2lkIHtcbiAgICBpZiAoZmluZCkge1xuICAgICAgaWYgKHR5cGVvZiBmaW5kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbnN0IGZlYXR1cmVzID0gdGhpcy5fZ2V0RmVhdHVyZXMoKS5maWx0ZXIoKHgpID0+XG4gICAgICAgICAgZmluZCh7IGZlYXR1cmU6IHggfSlcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5fc2VsZWN0RmVhdHVyZShmZWF0dXJlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fc2VsZWN0UHJvcGVydGllcyA9IGZpbmQ7XG4gICAgICAgIHN1cGVyLl91cGRhdGVGaWx0ZXIoKTtcbiAgICAgICAgdGhpcy5fZmlyZU9uTGF5ZXJTZWxlY3RFdmVudCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIXRoaXMuc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX3NlbGVjdEZlYXR1cmUodGhpcy5fZ2V0RmVhdHVyZXMoKSk7XG4gICAgfVxuICB9XG5cbiAgdW5zZWxlY3QoZmluZD86IERhdGFMYXllckZpbHRlcjxGZWF0dXJlLCBUTGF5ZXI+IHwgUHJvcGVydGllc0ZpbHRlcik6IHZvaWQge1xuICAgIHRoaXMuX3NlbGVjdFByb3BlcnRpZXMgPSB1bmRlZmluZWQ7XG4gICAgaWYgKGZpbmQpIHtcbiAgICAgIGlmICh0eXBlb2YgZmluZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjb25zdCBmZWF0dXJlcyA9IHRoaXMuX2dldEZlYXR1cmVzKCkuZmlsdGVyKCh4KSA9PlxuICAgICAgICAgIGZpbmQoeyBmZWF0dXJlOiB4IH0pXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuX3Vuc2VsZWN0RmVhdHVyZShmZWF0dXJlcyk7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBBcnJheS5pc0FycmF5KHRoaXMuX3NlbGVjdGVkRmVhdHVyZUlkcykgPyB0cnVlIDogZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLnNlbGVjdGVkKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICB0aGlzLl91bnNlbGVjdEZlYXR1cmUoKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX29uQWRkTGF5ZXIoc291cmNlSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGxldCBzb3VyY2UgPSB0aGlzLm1hcC5nZXRTb3VyY2Uoc291cmNlSWQpIGFzIEdlb0pTT05Tb3VyY2U7XG4gICAgaWYgKCFzb3VyY2UpIHtcbiAgICAgIGNvbnN0IHNvdXJjZU9wdDogR2VvSlNPTlNvdXJjZVJhdyA9IHtcbiAgICAgICAgdHlwZTogJ2dlb2pzb24nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdHlwZTogJ0ZlYXR1cmVDb2xsZWN0aW9uJyxcbiAgICAgICAgICBmZWF0dXJlczogW10sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgY29uc3QgX29wdHM6IChrZXlvZiBHZW9Kc29uQWRhcHRlck9wdGlvbnMpW10gPSBbXG4gICAgICAgICdjbHVzdGVyJyxcbiAgICAgICAgJ2NsdXN0ZXJNYXhab29tJyxcbiAgICAgICAgJ2NsdXN0ZXJSYWRpdXMnLFxuICAgICAgXTtcbiAgICAgIF9vcHRzLmZvckVhY2goKHgpID0+IHtcbiAgICAgICAgY29uc3Qgb3B0ID0gdGhpcy5vcHRpb25zW3hdIGFzIEdlb0pzb25BZGFwdGVyT3B0aW9ucztcbiAgICAgICAgaWYgKG9wdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgc291cmNlT3B0W3hdID0gb3B0O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMubWFwLmFkZFNvdXJjZShzb3VyY2VJZCwgc291cmNlT3B0KTtcbiAgICAgIHNvdXJjZSA9IHRoaXMubWFwLmdldFNvdXJjZShzb3VyY2VJZCkgYXMgR2VvSlNPTlNvdXJjZTtcbiAgICB9XG4gICAgdGhpcy5fc291cmNlc1tzb3VyY2VJZF0gPSBzb3VyY2U7XG4gICAgaWYgKHRoaXMub3B0aW9ucy50eXBlKSB7XG4gICAgICB0aGlzLl91cGRhdGVMYXllclBhaW50KHRoaXMub3B0aW9ucy50eXBlKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgX2NyZWF0ZVBhaW50Rm9yVHlwZShcbiAgICBwYWludDogVmVjdG9yQWRhcHRlckxheWVyUGFpbnQgfCBHZXRQYWludENhbGxiYWNrLFxuICAgIHR5cGU6IFZlY3RvckFkYXB0ZXJMYXllclR5cGUsXG4gICAgbmFtZTogc3RyaW5nXG4gICk6IFByb21pc2U8YW55PiB7XG4gICAgaWYgKHR5cGVvZiBwYWludCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX2dldFBhaW50RnJvbUNhbGxiYWNrKHBhaW50LCB0eXBlLCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN1cGVyLl9jcmVhdGVQYWludEZvclR5cGUocGFpbnQsIHR5cGUsIG5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfc2VsZWN0RmVhdHVyZShcbiAgICBmZWF0dXJlOiBGZWF0dXJlIHwgRmVhdHVyZVtdLFxuICAgIG9wdDogeyBzaWxlbnQ6IGJvb2xlYW4gfSA9IHsgc2lsZW50OiBmYWxzZSB9XG4gICk6IEZlYXR1cmVbXSB7XG4gICAgbGV0IHNlbGVjdGVkRmVhdHVyZUlkcyA9IHRoaXMuX3NlbGVjdGVkRmVhdHVyZUlkcyB8fCBbXTtcbiAgICBpZiAodGhpcy5vcHRpb25zICYmICF0aGlzLm9wdGlvbnMubXVsdGlzZWxlY3QpIHtcbiAgICAgIHNlbGVjdGVkRmVhdHVyZUlkcyA9IFtdO1xuICAgIH1cbiAgICBsZXQgZmVhdHVyZXM6IEZlYXR1cmVbXSA9IFtdO1xuICAgIGlmIChBcnJheS5pc0FycmF5KGZlYXR1cmUpKSB7XG4gICAgICBmZWF0dXJlcyA9IGZlYXR1cmU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZlYXR1cmVzID0gW2ZlYXR1cmVdO1xuICAgIH1cbiAgICBmZWF0dXJlcy5mb3JFYWNoKChmKSA9PiB7XG4gICAgICBjb25zdCBpZCA9IHRoaXMuX2dldEZlYXR1cmVGaWx0ZXJJZChmKTtcbiAgICAgIGlmIChpZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHNlbGVjdGVkRmVhdHVyZUlkcy5wdXNoKGlkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLl9zZWxlY3RQcm9wZXJ0aWVzID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX3NlbGVjdGVkRmVhdHVyZUlkcyA9IHNlbGVjdGVkRmVhdHVyZUlkcztcbiAgICB0aGlzLl91cGRhdGVGaWx0ZXIoKTtcbiAgICBpZiAoIW9wdC5zaWxlbnQgJiYgdGhpcy5vcHRpb25zLm9uTGF5ZXJTZWxlY3QpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5vbkxheWVyU2VsZWN0KHsgbGF5ZXI6IHRoaXMsIGZlYXR1cmVzIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZmVhdHVyZXM7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3Vuc2VsZWN0RmVhdHVyZShcbiAgICBmZWF0dXJlPzogRmVhdHVyZSB8IEZlYXR1cmVbXSxcbiAgICBvcHQ6IHsgc2lsZW50OiBib29sZWFuIH0gPSB7IHNpbGVudDogZmFsc2UgfVxuICApOiB2b2lkIHtcbiAgICBpZiAoZmVhdHVyZSkge1xuICAgICAgbGV0IGZlYXR1cmVzOiBGZWF0dXJlW10gPSBbXTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGZlYXR1cmUpKSB7XG4gICAgICAgIGZlYXR1cmVzID0gZmVhdHVyZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZlYXR1cmVzID0gW2ZlYXR1cmVdO1xuICAgICAgfVxuICAgICAgaWYgKGZlYXR1cmVzLmxlbmd0aCkge1xuICAgICAgICBmZWF0dXJlcy5mb3JFYWNoKChmKSA9PiB7XG4gICAgICAgICAgY29uc3QgaWQgPSB0aGlzLl9nZXRGZWF0dXJlRmlsdGVySWQoZik7XG4gICAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLl9zZWxlY3RlZEZlYXR1cmVJZHM7XG4gICAgICAgICAgaWYgKHNlbGVjdGVkICYmIGlkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gc2VsZWN0ZWQuaW5kZXhPZihpZCk7XG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgIHNlbGVjdGVkLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2VsZWN0ZWRGZWF0dXJlSWRzID0gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuX3VwZGF0ZUZpbHRlcigpO1xuICAgIGlmICghb3B0LnNpbGVudCAmJiB0aGlzLm9wdGlvbnMub25MYXllclNlbGVjdCkge1xuICAgICAgdGhpcy5vcHRpb25zLm9uTGF5ZXJTZWxlY3QoeyBsYXllcjogdGhpcywgZmVhdHVyZXM6IHVuZGVmaW5lZCB9KTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX3VwZGF0ZUZpbHRlcigpOiB2b2lkIHtcbiAgICAvLyBpdCBpcyBub3QgeWV0IHBvc3NpYmxlIHRvIHVzZSBjYWxsYmFja3MgYW5kIHByb3BlcnRpZXMgZmlsdGVycyB0b2dldGhlclxuICAgIGlmICh0aGlzLl9maWx0ZXJQcm9wZXJ0aWVzIHx8IHRoaXMuX3NlbGVjdFByb3BlcnRpZXMpIHtcbiAgICAgIHN1cGVyLl91cGRhdGVGaWx0ZXIoKTtcbiAgICAgIHRoaXMuX2ZpcmVPbkxheWVyU2VsZWN0RXZlbnQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLl9zZWxlY3RlZEZlYXR1cmVJZHM7XG4gICAgbGV0IHNlbGVjdGlvbkFycmF5OiAoc3RyaW5nIHwgbnVtYmVyKVtdID0gW107XG4gICAgY29uc3QgZmlsdGVyZWRBcnJheTogKHN0cmluZyB8IG51bWJlcilbXSA9IFtdO1xuICAgIGNvbnN0IGZpbHRlcmVkID0gdGhpcy5fZmlsdGVyZWRGZWF0dXJlSWRzO1xuICAgIGlmIChmaWx0ZXJlZCkge1xuICAgICAgdGhpcy5fZ2V0RmVhdHVyZXMoKS5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICAgIGNvbnN0IGlkID0gdGhpcy5fZ2V0RmVhdHVyZUZpbHRlcklkKHgpO1xuICAgICAgICBpZiAoaWQgIT09IHVuZGVmaW5lZCAmJiBmaWx0ZXJlZC5pbmRleE9mKGlkKSAhPT0gLTEpIHtcbiAgICAgICAgICBpZiAoc2VsZWN0ZWQgJiYgc2VsZWN0ZWQuaW5kZXhPZihpZCkgIT09IC0xKSB7XG4gICAgICAgICAgICBzZWxlY3Rpb25BcnJheS5wdXNoKGlkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmlsdGVyZWRBcnJheS5wdXNoKGlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgIHNlbGVjdGlvbkFycmF5ID0gc2VsZWN0ZWQ7XG4gICAgfVxuICAgIHRoaXMuc2VsZWN0ZWQgPSAhIXNlbGVjdGVkO1xuICAgIGNvbnN0IGxheWVycyA9IHRoaXMubGF5ZXI7XG4gICAgaWYgKGxheWVycykge1xuICAgICAgdGhpcy5fdHlwZXMuZm9yRWFjaCgodCkgPT4ge1xuICAgICAgICBjb25zdCBnZW9tVHlwZSA9IHR5cGVBbGlhc0ZvckZpbHRlclt0XTtcbiAgICAgICAgaWYgKGdlb21UeXBlKSB7XG4gICAgICAgICAgY29uc3QgZ2VvbUZpbHRlciA9IFsnPT0nLCAnJHR5cGUnLCBnZW9tVHlwZV07XG4gICAgICAgICAgY29uc3QgbGF5ZXJOYW1lID0gdGhpcy5fZ2V0TGF5ZXJOYW1lRnJvbVR5cGUodCk7XG4gICAgICAgICAgY29uc3Qgc2VsTGF5ZXJOYW1lID0gdGhpcy5fZ2V0U2VsZWN0aW9uTGF5ZXJOYW1lRnJvbVR5cGUodCk7XG4gICAgICAgICAgaWYgKGxheWVycy5pbmRleE9mKHNlbExheWVyTmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fc2VsZWN0aW9uTmFtZSkge1xuICAgICAgICAgICAgICB0aGlzLm1hcC5zZXRGaWx0ZXIoc2VsTGF5ZXJOYW1lLCBbXG4gICAgICAgICAgICAgICAgJ2FsbCcsXG4gICAgICAgICAgICAgICAgZ2VvbUZpbHRlcixcbiAgICAgICAgICAgICAgICBbJ2luJywgdGhpcy5mZWF0dXJlSWROYW1lLCAuLi5zZWxlY3Rpb25BcnJheV0sXG4gICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobGF5ZXJzLmluZGV4T2YobGF5ZXJOYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbHRlcl86IGFueVtdID0gWydhbGwnLCBnZW9tRmlsdGVyXTtcbiAgICAgICAgICAgIGlmIChmaWx0ZXJlZCkge1xuICAgICAgICAgICAgICBmaWx0ZXJfLnB1c2goWydpbicsIHRoaXMuZmVhdHVyZUlkTmFtZSwgLi4uZmlsdGVyZWRBcnJheV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZmlsdGVyXy5wdXNoKFsnIWluJywgdGhpcy5mZWF0dXJlSWROYW1lLCAuLi5zZWxlY3Rpb25BcnJheV0pO1xuICAgICAgICAgICAgICB0aGlzLl91cGRhdGVXaXRoTmF0aXZlRmlsdGVyKGZpbHRlcl8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5tYXAuc2V0RmlsdGVyKGxheWVyTmFtZSwgZmlsdGVyXyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9nZXRGZWF0dXJlcygpOiBGZWF0dXJlW10ge1xuICAgIGlmICh0aGlzLnNvdXJjZSkge1xuICAgICAgLy8gY29uc3QgZmVhdHVyZXMgPSB0aGlzLm1hcC5xdWVyeVNvdXJjZUZlYXR1cmVzKHRoaXMuc291cmNlKTtcbiAgICAgIC8vIHJldHVybiBmZWF0dXJlcztcblxuICAgICAgY29uc3Qgc291cmNlID0gdGhpcy5tYXAuZ2V0U291cmNlKHRoaXMuc291cmNlKTtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gc291cmNlLl9kYXRhPy5mZWF0dXJlcyB8fCBbXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2ZlYXR1cmVzO1xuICB9XG5cbiAgcHJpdmF0ZSBfZmlsdGVyKGZ1bjogRGF0YUxheWVyRmlsdGVyPEZlYXR1cmUsIFRMYXllcj4pIHtcbiAgICBjb25zdCBmaWx0ZXJlZDogKHN0cmluZyB8IG51bWJlcilbXSA9IFtdO1xuICAgIHRoaXMuX2dldEZlYXR1cmVzKCkuZm9yRWFjaCgoZmVhdHVyZSkgPT4ge1xuICAgICAgY29uc3Qgb2sgPSBmdW4oeyBmZWF0dXJlIH0pO1xuICAgICAgY29uc3QgaWQgPSB0aGlzLl9nZXRGZWF0dXJlRmlsdGVySWQoZmVhdHVyZSk7XG4gICAgICBpZiAob2sgJiYgaWQpIHtcbiAgICAgICAgZmlsdGVyZWQucHVzaChpZCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5fZmlsdGVyZWRGZWF0dXJlSWRzID0gZmlsdGVyZWQ7XG4gICAgdGhpcy5fdXBkYXRlRmlsdGVyKCk7XG4gIH1cblxuICBwcml2YXRlIGZpbHRlckdlb21ldHJpZXMoXG4gICAgZGF0YTogR2VvSnNvbk9iamVjdCxcbiAgICB0eXBlOiBWZWN0b3JBZGFwdGVyTGF5ZXJUeXBlXG4gICk6IEZlYXR1cmVbXSB7XG4gICAgbGV0IG5ld0ZlYXR1cmVzOiBGZWF0dXJlW10gPSBbXTtcbiAgICBpZiAoZGF0YS50eXBlID09PSAnRmVhdHVyZUNvbGxlY3Rpb24nKSB7XG4gICAgICBjb25zdCBmZWF0dXJlcyA9IChkYXRhIGFzIEZlYXR1cmVDb2xsZWN0aW9uKS5mZWF0dXJlcy5maWx0ZXIoKGYpID0+XG4gICAgICAgIGdlb21ldHJ5RmlsdGVyKGYuZ2VvbWV0cnkudHlwZSwgdHlwZSlcbiAgICAgICkgYXMgRmVhdHVyZVtdO1xuICAgICAgKGRhdGEgYXMgRmVhdHVyZUNvbGxlY3Rpb24pLmZlYXR1cmVzID0gZmVhdHVyZXM7XG4gICAgICBuZXdGZWF0dXJlcyA9IGZlYXR1cmVzO1xuICAgIH0gZWxzZSBpZiAoZGF0YS50eXBlID09PSAnRmVhdHVyZScpIHtcbiAgICAgIGNvbnN0IGFsbG93ID0gZ2VvbWV0cnlGaWx0ZXIoKGRhdGEgYXMgRmVhdHVyZSkuZ2VvbWV0cnkudHlwZSwgdHlwZSk7XG4gICAgICBpZiAoIWFsbG93KSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICAgIG5ld0ZlYXR1cmVzLnB1c2goZGF0YSBhcyBGZWF0dXJlKTtcbiAgICB9IGVsc2UgaWYgKGRhdGEudHlwZSA9PT0gJ0dlb21ldHJ5Q29sbGVjdGlvbicpIHtcbiAgICAgIGNvbnN0IGdlb21Db2xsZWN0aW9uID0gZGF0YSBhcyBHZW9tZXRyeUNvbGxlY3Rpb247XG4gICAgICBnZW9tQ29sbGVjdGlvbi5nZW9tZXRyaWVzID0gZ2VvbUNvbGxlY3Rpb24uZ2VvbWV0cmllcy5maWx0ZXIoKGcpID0+XG4gICAgICAgIGdlb21ldHJ5RmlsdGVyKGcudHlwZSwgdHlwZSlcbiAgICAgICk7XG4gICAgICBuZXdGZWF0dXJlcyA9IGdlb21Db2xsZWN0aW9uLmdlb21ldHJpZXMubWFwKCh4KSA9PiB7XG4gICAgICAgIGNvbnN0IGY6IEZlYXR1cmUgPSB7XG4gICAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICAgIGdlb21ldHJ5OiB4IGFzIEdlb21ldHJ5T2JqZWN0LFxuICAgICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZjtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZUFsaWFzW2RhdGEudHlwZV0pIHtcbiAgICAgIGNvbnN0IG9iajogRmVhdHVyZSA9IHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBnZW9tZXRyeTogZGF0YSBhcyBHZW9tZXRyeU9iamVjdCxcbiAgICAgICAgcHJvcGVydGllczoge30sXG4gICAgICB9O1xuICAgICAgbmV3RmVhdHVyZXMgPSBbb2JqXTtcbiAgICB9XG4gICAgdGhpcy5fZmVhdHVyZXMgPSB0aGlzLl9mZWF0dXJlcy5jb25jYXQobmV3RmVhdHVyZXMpO1xuICAgIHJldHVybiBuZXdGZWF0dXJlcztcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgX2dldFBhaW50RnJvbUNhbGxiYWNrKFxuICAgIHBhaW50OiBHZXRQYWludENhbGxiYWNrLFxuICAgIHR5cGU6IFZlY3RvckFkYXB0ZXJMYXllclR5cGUsXG4gICAgbmFtZTogc3RyaW5nXG4gICkge1xuICAgIGNvbnN0IHN0eWxlOiBhbnkgPSB7fTtcbiAgICBzdHlsZS50eXBlID0gcGFpbnQudHlwZTtcbiAgICBmb3IgKGNvbnN0IGZlYXR1cmUgb2YgdGhpcy5fZmVhdHVyZXMpIHtcbiAgICAgIGNvbnN0IF9wYWludCA9IHBhaW50KGZlYXR1cmUpO1xuICAgICAgaWYgKF9wYWludC50eXBlID09PSAnaWNvbicpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5fcmVnaXN0ZXJJbWFnZShfcGFpbnQpO1xuICAgICAgICBpZiAoZmVhdHVyZS5wcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzWydfaWNvbi1pbWFnZS0nICsgbmFtZV0gPSBfcGFpbnQuaHRtbDtcbiAgICAgICAgfVxuICAgICAgICBzdHlsZVsnaWNvbi1pbWFnZSddID0gYHtfaWNvbi1pbWFnZS0ke25hbWV9fWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGNvbnN0IHAgaW4gX3BhaW50KSB7XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIGNvbnN0IHRvU2F2ZSA9IF9wYWludFtwXTtcbiAgICAgICAgICBpZiAoZmVhdHVyZS5wcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICBmZWF0dXJlLnByb3BlcnRpZXNbYF9wYWludF8ke3B9XyR7bmFtZX1gXSA9IHRvU2F2ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3R5bGVbcF0gPSBbJ2dldCcsIGBfcGFpbnRfJHtwfV8ke25hbWV9YF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCdpY29uLWltYWdlJyBpbiBzdHlsZSkge1xuICAgICAgcmV0dXJuIHN0eWxlO1xuICAgIH1cbiAgICBjb25zdCBzdHlsZUZyb21DYiA9IHRoaXMuX2NyZWF0ZVBhaW50Rm9yVHlwZShzdHlsZSwgdHlwZSwgbmFtZSk7XG4gICAgcmV0dXJuIHN0eWxlRnJvbUNiO1xuICB9XG5cbiAgcHJpdmF0ZSBfZmlyZU9uTGF5ZXJTZWxlY3RFdmVudCgpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLm9uTGF5ZXJTZWxlY3QpIHtcbiAgICAgIGNvbnN0IGZlYXR1cmVzXzogRmVhdHVyZVtdID0gW107XG4gICAgICB0aGlzLmdldFNlbGVjdGVkKCkuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgICBpZiAoeC5mZWF0dXJlKSB7XG4gICAgICAgICAgZmVhdHVyZXNfLnB1c2goeC5mZWF0dXJlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBmZWF0dXJlcyA9IGZlYXR1cmVzXy5sZW5ndGggPyBmZWF0dXJlc18gOiB1bmRlZmluZWQ7XG4gICAgICB0aGlzLm9wdGlvbnMub25MYXllclNlbGVjdCh7XG4gICAgICAgIGxheWVyOiB0aGlzLFxuICAgICAgICBmZWF0dXJlcyxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgTXZ0QWRhcHRlck9wdGlvbnMgfSBmcm9tICdAbmV4dGdpcy93ZWJtYXAnO1xuaW1wb3J0IHsgTGF5ZXIgfSBmcm9tICdtYXBib3gtZ2wnO1xuaW1wb3J0IHsgVmVjdG9yQWRhcHRlciB9IGZyb20gJy4vVmVjdG9yQWRhcHRlcic7XG5pbXBvcnQgeyBUTGF5ZXIgfSBmcm9tICcuLi9NYXBib3hnbE1hcEFkYXB0ZXInO1xuXG5leHBvcnQgY2xhc3MgTXZ0QWRhcHRlciBleHRlbmRzIFZlY3RvckFkYXB0ZXI8TXZ0QWRhcHRlck9wdGlvbnM+IHtcbiAgc3RhdGljIHNvdXJjZXM6IHN0cmluZ1tdID0gW107XG5cbiAgc291cmNlPzogc3RyaW5nO1xuXG4gIGFzeW5jIGFkZExheWVyKG9wdGlvbnM6IE12dEFkYXB0ZXJPcHRpb25zKTogUHJvbWlzZTxUTGF5ZXI+IHtcbiAgICBjb25zdCBsYXllciA9IGF3YWl0IHN1cGVyLmFkZExheWVyKG9wdGlvbnMpO1xuICAgIHRoaXMuX3VwZGF0ZUxheWVyUGFpbnQodGhpcy5vcHRpb25zLnR5cGUgfHwgJ3BvbHlnb24nKTtcblxuICAgIHJldHVybiBsYXllcjtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZ2V0QWRkaXRpb25hbExheWVyT3B0aW9ucygpOiBQYXJ0aWFsPExheWVyPiB7XG4gICAgY29uc3QgZXhpc3QgPSBNdnRBZGFwdGVyLnNvdXJjZXMuaW5jbHVkZXModGhpcy5vcHRpb25zLnVybCk7XG4gICAgaWYgKCFleGlzdCAmJiB0aGlzLm1hcCkge1xuICAgICAgdGhpcy5tYXAuYWRkU291cmNlKHRoaXMub3B0aW9ucy51cmwsIHtcbiAgICAgICAgdHlwZTogJ3ZlY3RvcicsXG4gICAgICAgIHRpbGVzOiBbdGhpcy5vcHRpb25zLnVybF0sXG4gICAgICB9KTtcbiAgICAgIHRoaXMuc291cmNlID0gdGhpcy5vcHRpb25zLnVybDtcbiAgICAgIE12dEFkYXB0ZXIuc291cmNlcy5wdXNoKHRoaXMub3B0aW9ucy51cmwpO1xuICAgIH1cbiAgICBjb25zdCBtdnRMYXllck9wdGlvbnM6IFBhcnRpYWw8TGF5ZXI+ID0ge1xuICAgICAgc291cmNlOiB0aGlzLm9wdGlvbnMudXJsLFxuICAgICAgJ3NvdXJjZS1sYXllcic6IHRoaXMub3B0aW9ucy5zb3VyY2VMYXllcixcbiAgICB9O1xuICAgIHJldHVybiBtdnRMYXllck9wdGlvbnM7XG4gIH1cbn1cbiIsImltcG9ydCB7IE1haW5MYXllckFkYXB0ZXIsIFRpbGVBZGFwdGVyT3B0aW9ucyB9IGZyb20gJ0BuZXh0Z2lzL3dlYm1hcCc7XG5pbXBvcnQgeyBUaWxlQWRhcHRlciB9IGZyb20gJy4vVGlsZUFkYXB0ZXInO1xuXG5jb25zdCBPUFRJT05TID0ge1xuICB1cmw6ICdodHRwOi8ve3N9LnRpbGUub3BlbnN0cmVldG1hcC5vcmcve3p9L3t4fS97eX0ucG5nJyxcbiAgYXR0cmlidXRpb246XG4gICAgJyZjb3B5OyA8YSBocmVmPVwiaHR0cDovL29zbS5vcmcvY29weXJpZ2h0XCIgdGFyZ2V0PVwiX2JsYW5rXCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzJyxcbiAgc3ViZG9tYWluczogJ2FiYycsXG59O1xuXG5leHBvcnQgY2xhc3MgT3NtQWRhcHRlciBleHRlbmRzIFRpbGVBZGFwdGVyIGltcGxlbWVudHMgTWFpbkxheWVyQWRhcHRlciB7XG4gIGFkZExheWVyKG9wdGlvbnM6IFRpbGVBZGFwdGVyT3B0aW9ucyk6IHN0cmluZ1tdIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gc3VwZXIuYWRkTGF5ZXIoT2JqZWN0LmFzc2lnbih7fSwgT1BUSU9OUywgb3B0aW9ucykpO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBNYWluTGF5ZXJBZGFwdGVyLFxuICBUaWxlQWRhcHRlck9wdGlvbnMsXG4gIFJhc3RlckFkYXB0ZXJPcHRpb25zLFxufSBmcm9tICdAbmV4dGdpcy93ZWJtYXAnO1xuaW1wb3J0IHsgQmFzZUFkYXB0ZXIgfSBmcm9tICcuL0Jhc2VBZGFwdGVyJztcbmltcG9ydCB7IFJhc3RlclNvdXJjZSwgUmVzb3VyY2VUeXBlLCBMYXllciB9IGZyb20gJ21hcGJveC1nbCc7XG5cbmV4cG9ydCBjbGFzcyBUaWxlQWRhcHRlcjxPIGV4dGVuZHMgUmFzdGVyQWRhcHRlck9wdGlvbnMgPSBUaWxlQWRhcHRlck9wdGlvbnM+XG4gIGV4dGVuZHMgQmFzZUFkYXB0ZXI8Tz5cbiAgaW1wbGVtZW50cyBNYWluTGF5ZXJBZGFwdGVyIHtcbiAgYWRkTGF5ZXIob3B0aW9uczogTyk6IHN0cmluZ1tdIHwgdW5kZWZpbmVkIHtcbiAgICBvcHRpb25zID0geyAuLi50aGlzLm9wdGlvbnMsIC4uLihvcHRpb25zIHx8IHt9KSB9O1xuICAgIGNvbnN0IHsgbWluWm9vbSwgbWF4Wm9vbSB9ID0gb3B0aW9ucztcbiAgICBsZXQgdGlsZXM6IHN0cmluZ1tdO1xuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuc3ViZG9tYWlucykge1xuICAgICAgdGlsZXMgPSBvcHRpb25zLnN1YmRvbWFpbnMuc3BsaXQoJycpLm1hcCgoeCkgPT4ge1xuICAgICAgICBjb25zdCBzdWJVcmwgPSBvcHRpb25zLnVybC5yZXBsYWNlKCd7c30nLCB4KTtcbiAgICAgICAgcmV0dXJuIHN1YlVybDtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aWxlcyA9IFtvcHRpb25zLnVybF07XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmhlYWRlcnMpIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGNvbnN0IHRyYW5zZm9ybVJlcXVlc3RzID0gdGhpcy5tYXAudHJhbnNmb3JtUmVxdWVzdHM7XG4gICAgICB0cmFuc2Zvcm1SZXF1ZXN0cy5wdXNoKCh1cmw6IHN0cmluZywgcmVzb3VyY2VUeXBlOiBSZXNvdXJjZVR5cGUpID0+IHtcbiAgICAgICAgbGV0IHN0YXRpY1VybCA9IHVybDtcbiAgICAgICAgc3RhdGljVXJsID0gc3RhdGljVXJsLnJlcGxhY2UoLyh6PVxcZCspLywgJ3o9e3p9Jyk7XG4gICAgICAgIHN0YXRpY1VybCA9IHN0YXRpY1VybC5yZXBsYWNlKC8oeD1cXGQrKS8sICd4PXt4fScpO1xuICAgICAgICBzdGF0aWNVcmwgPSBzdGF0aWNVcmwucmVwbGFjZSgvKHk9XFxkKykvLCAneT17eX0nKTtcbiAgICAgICAgaWYgKHN0YXRpY1VybCA9PT0gb3B0aW9ucy51cmwpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAgaGVhZGVyczogb3B0aW9ucy5oZWFkZXJzLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHNvdXJjZU9wdGlvbnM6IFJhc3RlclNvdXJjZSA9IHtcbiAgICAgIHR5cGU6ICdyYXN0ZXInLFxuICAgICAgLy8gcG9pbnQgdG8gb3VyIHRoaXJkLXBhcnR5IHRpbGVzLiBOb3RlIHRoYXQgc29tZSBleGFtcGxlc1xuICAgICAgLy8gc2hvdyBhIFwidXJsXCIgcHJvcGVydHkuIFRoaXMgb25seSBhcHBsaWVzIHRvIHRpbGVzZXRzIHdpdGhcbiAgICAgIC8vIGNvcnJlc3BvbmRpbmcgVGlsZUpTT04gKHN1Y2ggYXMgbWFwYm94IHRpbGVzKS5cbiAgICAgIHRpbGVzLFxuICAgICAgdGlsZVNpemU6IDI1NiwgLy8gb3B0ICYmIG9wdC50aWxlU2l6ZSB8fFxuICAgIH07XG4gICAgaWYgKG9wdGlvbnMuYXR0cmlidXRpb24pIHtcbiAgICAgIHNvdXJjZU9wdGlvbnMuYXR0cmlidXRpb24gPSBvcHRpb25zLmF0dHJpYnV0aW9uO1xuICAgIH1cbiAgICBjb25zdCBsYXllck9wdGlvbnM6IExheWVyID0ge1xuICAgICAgaWQ6IHRoaXMuX2xheWVySWQsXG4gICAgICB0eXBlOiAncmFzdGVyJyxcbiAgICAgIGxheW91dDoge1xuICAgICAgICB2aXNpYmlsaXR5OiAnbm9uZScsXG4gICAgICB9LFxuICAgICAgc291cmNlOiBzb3VyY2VPcHRpb25zLFxuICAgICAgLy8gVE9ETzogY2xlYW4gcmVtb3ZlIGJlZm9yZSBvcHRpb25zIGZyb20gYWxsIGV4aXN0aW5nIGFwcHNcbiAgICB9O1xuXG4gICAgaWYgKG1pblpvb20pIHtcbiAgICAgIGxheWVyT3B0aW9ucy5taW56b29tID0gbWluWm9vbSAtIDE7XG4gICAgfVxuICAgIGlmIChtYXhab29tKSB7XG4gICAgICBsYXllck9wdGlvbnMubWF4em9vbSA9IG1heFpvb20gLSAxO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXApIHtcbiAgICAgIHRoaXMubWFwLmFkZExheWVyKFxuICAgICAgICBsYXllck9wdGlvbnMsXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgb3B0aW9ucy5iZWZvcmVcbiAgICAgICk7XG4gICAgICBjb25zdCBsYXllciA9ICh0aGlzLmxheWVyID0gW3RoaXMuX2xheWVySWRdKTtcbiAgICAgIHJldHVybiBsYXllcjtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIFZlY3RvckFkYXB0ZXJMYXllclR5cGUsXG4gIFZlY3RvckxheWVyQWRhcHRlcixcbiAgVmVjdG9yQWRhcHRlck9wdGlvbnMsXG4gIFByb3BlcnRpZXNGaWx0ZXIsXG4gIE9wZXJhdGlvbnMsXG4gIERhdGFMYXllckZpbHRlcixcbiAgUHJvcGVydHlGaWx0ZXIsXG4gIEZpbHRlck9wdGlvbnMsXG59IGZyb20gJ0BuZXh0Z2lzL3dlYm1hcCc7XG5cbmltcG9ydCB7IFBhaW50LCBJY29uT3B0aW9ucywgaXNQYWludCwgaXNJY29uIH0gZnJvbSAnQG5leHRnaXMvcGFpbnQnO1xuXG5pbXBvcnQgeyBjaGVja0lmUHJvcGVydHlGaWx0ZXIgfSBmcm9tICdAbmV4dGdpcy9wcm9wZXJ0aWVzLWZpbHRlcic7XG5pbXBvcnQge1xuICBGZWF0dXJlIGFzIEYsXG4gIEdlb21ldHJ5T2JqZWN0LFxuICBHZW9tZXRyeSxcbiAgR2VvSnNvblByb3BlcnRpZXMsXG59IGZyb20gJ2dlb2pzb24nO1xuaW1wb3J0IHtcbiAgTWFwLFxuICBNYXBMYXllck1vdXNlRXZlbnQsXG4gIEFueVNvdXJjZURhdGEsXG4gIEFueUxheW91dCxcbiAgTGF5ZXIsXG59IGZyb20gJ21hcGJveC1nbCc7XG5cbmltcG9ydCB7IGdldEltYWdlIH0gZnJvbSAnLi4vdXRpbC9pbWFnZUljb25zJztcbmltcG9ydCB7IFRMYXllciB9IGZyb20gJy4uL01hcGJveGdsTWFwQWRhcHRlcic7XG5pbXBvcnQgeyBCYXNlQWRhcHRlciB9IGZyb20gJy4vQmFzZUFkYXB0ZXInO1xuaW1wb3J0IHsgdHlwZUFsaWFzRm9yRmlsdGVyLCBhbGxvd2VkQnlUeXBlIH0gZnJvbSAnLi4vdXRpbC9nZW9tVHlwZSc7XG5cbmV4cG9ydCBjb25zdCBvcGVyYXRpb25zQWxpYXNlczogeyBba2V5IGluIE9wZXJhdGlvbnNdOiBzdHJpbmcgfSA9IHtcbiAgZ3Q6ICc+JyxcbiAgbHQ6ICc8JyxcbiAgZ2U6ICc+PScsXG4gIGxlOiAnPD0nLFxuICBlcTogJz09JyxcbiAgbmU6ICchPScsXG4gIGluOiAnaW4nLFxuICBub3RpbjogJyFpbicsXG4gIC8vIE5PVCBTVVBQT1JURURcbiAgbGlrZTogJz09JyxcbiAgLy8gTk9UIFNVUFBPUlRFRFxuICBpbGlrZTogJz09Jyxcbn07XG5cbmNvbnN0IHJldmVyc09wZXJhdGlvbnM6IHsgW2tleSBpbiBPcGVyYXRpb25zXTogc3RyaW5nIH0gPSB7XG4gIGd0OiBvcGVyYXRpb25zQWxpYXNlcy5sZSxcbiAgbHQ6IG9wZXJhdGlvbnNBbGlhc2VzLmdlLFxuICBnZTogb3BlcmF0aW9uc0FsaWFzZXMubHQsXG4gIGxlOiBvcGVyYXRpb25zQWxpYXNlcy5ndCxcbiAgZXE6IG9wZXJhdGlvbnNBbGlhc2VzLm5lLFxuICBuZTogb3BlcmF0aW9uc0FsaWFzZXMuZXEsXG4gIGluOiBvcGVyYXRpb25zQWxpYXNlcy5ub3RpbixcbiAgbm90aW46IG9wZXJhdGlvbnNBbGlhc2VzLmluLFxuICBsaWtlOiBvcGVyYXRpb25zQWxpYXNlcy5uZSxcbiAgaWxpa2U6IG9wZXJhdGlvbnNBbGlhc2VzLm5lLFxufTtcblxuZXhwb3J0IGludGVyZmFjZSBGZWF0dXJlPFxuICBHIGV4dGVuZHMgR2VvbWV0cnlPYmplY3QgfCBudWxsID0gR2VvbWV0cnksXG4gIFAgPSBHZW9Kc29uUHJvcGVydGllc1xuPiBleHRlbmRzIEY8RywgUD4ge1xuICBfZmVhdHVyZUZpbHRlcklkPzogc3RyaW5nO1xufVxuXG5jb25zdCBQQUlOVCA9IHtcbiAgY29sb3I6ICdibHVlJyxcbiAgb3BhY2l0eTogMSxcbiAgcmFkaXVzOiAxMCxcbn07XG5cbnR5cGUgTWFwYm94TGF5ZXJUeXBlID0gJ2ZpbGwnIHwgJ2xpbmUnIHwgJ3N5bWJvbCcgfCAnY2lyY2xlJztcblxuY29uc3QgbWFwYm94VHlwZUFsaWFzOiBSZWNvcmQ8VmVjdG9yQWRhcHRlckxheWVyVHlwZSwgTWFwYm94TGF5ZXJUeXBlPiA9IHtcbiAgcG9seWdvbjogJ2ZpbGwnLFxuICBsaW5lOiAnbGluZScsXG4gIHBvaW50OiAnY2lyY2xlJyxcbn07XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWZWN0b3JBZGFwdGVyPFxuICBPIGV4dGVuZHMgVmVjdG9yQWRhcHRlck9wdGlvbnMgPSBWZWN0b3JBZGFwdGVyT3B0aW9uc1xuPiBleHRlbmRzIEJhc2VBZGFwdGVyPE8+XG4gIGltcGxlbWVudHMgVmVjdG9yTGF5ZXJBZGFwdGVyPE1hcCwgVExheWVyLCBPLCBGZWF0dXJlPiB7XG4gIHNlbGVjdGVkID0gZmFsc2U7XG4gIG1hcD86IE1hcDtcbiAgcHJvdGVjdGVkIGZlYXR1cmVJZE5hbWUgPSAnaWQnO1xuICBwcm90ZWN0ZWQgX3R5cGVzOiBWZWN0b3JBZGFwdGVyTGF5ZXJUeXBlW10gPSBbJ3BvbHlnb24nLCAncG9pbnQnLCAnbGluZSddO1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgX3NvdXJjZUlkOiBzdHJpbmc7XG4gIHByb3RlY3RlZCByZWFkb25seSBfc2VsZWN0aW9uTmFtZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgX3NlbGVjdGVkRmVhdHVyZUlkczogKG51bWJlciB8IHN0cmluZylbXSB8IGZhbHNlID0gW107XG5cbiAgcHJvdGVjdGVkIF9zZWxlY3RQcm9wZXJ0aWVzPzogUHJvcGVydGllc0ZpbHRlcjtcbiAgcHJvdGVjdGVkIF9maWx0ZXJQcm9wZXJ0aWVzPzogUHJvcGVydGllc0ZpbHRlcjtcblxuICBwcml2YXRlICRvbkxheWVyTW91c2VNb3ZlPzogKGU6IE1hcExheWVyTW91c2VFdmVudCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSAkb25MYXllck1vdXNlTGVhdmU/OiAoZTogTWFwTGF5ZXJNb3VzZUV2ZW50KSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKG1hcDogTWFwLCBwdWJsaWMgb3B0aW9uczogTykge1xuICAgIHN1cGVyKG1hcCwgb3B0aW9ucyk7XG4gICAgdGhpcy5fc291cmNlSWQgPSB0aGlzLm9wdGlvbnMuc291cmNlXG4gICAgICA/ICh0aGlzLm9wdGlvbnMuc291cmNlIGFzIHN0cmluZylcbiAgICAgIDogYHNvdXJjZS0ke3RoaXMuX2xheWVySWR9YDtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZmVhdHVyZUlkTmFtZSkge1xuICAgICAgdGhpcy5mZWF0dXJlSWROYW1lID0gdGhpcy5vcHRpb25zLmZlYXR1cmVJZE5hbWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuc291cmNlKSB7XG4gICAgICB0aGlzLmZlYXR1cmVJZE5hbWUgPSAnJGlkJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mZWF0dXJlSWROYW1lID0gJ2ZpZCc7XG4gICAgfVxuXG4gICAgdGhpcy5fc2VsZWN0aW9uTmFtZSA9IHRoaXMuX2xheWVySWQgKyAnLWhpZ2hsaWdodGVkJztcbiAgICB0aGlzLiRvbkxheWVyTW91c2VMZWF2ZSA9IHRoaXMuX29uTGF5ZXJNb3VzZUxlYXZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy4kb25MYXllck1vdXNlTW92ZSA9IHRoaXMuX29uTGF5ZXJNb3VzZU1vdmUuYmluZCh0aGlzKTtcbiAgICBpZiAodGhpcy5vcHRpb25zLnNlbGVjdGFibGUpIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXMubWFwLl9vbk1hcENsaWNrTGF5ZXJzLnB1c2godGhpcyk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgYWRkTGF5ZXIob3B0aW9uczogTyk6IFByb21pc2U8VExheWVyPiB7XG4gICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyA9IHsgLi4udGhpcy5vcHRpb25zLCAuLi4ob3B0aW9ucyB8fCB7fSkgfTtcblxuICAgIHRoaXMubGF5ZXIgPSBbXTtcbiAgICBjb25zdCB0eXBlcyA9ICh0aGlzLl90eXBlcyA9IG9wdGlvbnMudHlwZSA/IFtvcHRpb25zLnR5cGVdIDogdGhpcy5fdHlwZXMpO1xuICAgIGlmIChvcHRpb25zLnBhaW50KSB7XG4gICAgICB0aGlzLl9vbkFkZExheWVyKHRoaXMuX3NvdXJjZUlkKTtcbiAgICAgIC8vIGNvbnN0IHR5cGVzID0gdGhpcy5fdHlwZXM7XG4gICAgICBmb3IgKGNvbnN0IHQgb2YgdHlwZXMpIHtcbiAgICAgICAgY29uc3QgZ2VvbVR5cGUgPSB0eXBlQWxpYXNGb3JGaWx0ZXJbdF07XG4gICAgICAgIGlmIChnZW9tVHlwZSkge1xuICAgICAgICAgIGxldCB0eXBlID0gdDtcbiAgICAgICAgICBpZiAodCA9PT0gJ3BvaW50Jykge1xuICAgICAgICAgICAgY29uc3QgcGFpbnRUeXBlID0gdGhpcy5fZGV0ZWN0UGFpbnRUeXBlKG9wdGlvbnMucGFpbnQpO1xuICAgICAgICAgICAgaWYgKHBhaW50VHlwZSA9PT0gJ2ljb24nKSB7XG4gICAgICAgICAgICAgIHR5cGUgPSAncG9pbnQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBsYXllciA9IHRoaXMuX2dldExheWVyTmFtZUZyb21UeXBlKHQpO1xuICAgICAgICAgIGNvbnN0IGdlb21GaWx0ZXIgPVxuICAgICAgICAgICAgdHlwZXMubGVuZ3RoID4gMSA/IFsnPT0nLCAnJHR5cGUnLCBnZW9tVHlwZV0gOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICBhd2FpdCB0aGlzLl9hZGRMYXllcihsYXllciwgdHlwZSwgW1xuICAgICAgICAgICAgZ2VvbUZpbHRlcixcbiAgICAgICAgICAgIHRoaXMuX2dldE5hdGl2ZUZpbHRlcigpLFxuICAgICAgICAgIF0pO1xuICAgICAgICAgIHRoaXMubGF5ZXIucHVzaChsYXllcik7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuc2VsZWN0ZWRQYWludCkge1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0aW9uTGF5ZXIgPSB0aGlzLl9nZXRTZWxlY3Rpb25MYXllck5hbWVGcm9tVHlwZSh0KTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX2FkZExheWVyKFxuICAgICAgICAgICAgICBzZWxlY3Rpb25MYXllcixcbiAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgW2dlb21GaWx0ZXIsIFsnaW4nLCB0aGlzLmZlYXR1cmVJZE5hbWUsICcnXV0sXG4gICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zZWxlY3RlZExheW91dFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMubGF5ZXIucHVzaChzZWxlY3Rpb25MYXllcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fYWRkRXZlbnRzTGlzdGVuZXJzKCk7XG5cbiAgICByZXR1cm4gdGhpcy5sYXllcjtcbiAgfVxuXG4gIHByb3BlcnRpZXNGaWx0ZXIoZmlsdGVyczogUHJvcGVydGllc0ZpbHRlciwgb3B0aW9ucz86IEZpbHRlck9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLl9maWx0ZXJQcm9wZXJ0aWVzID0gZmlsdGVycztcbiAgICB0aGlzLl91cGRhdGVQcm9wZXJ0aWVzRmlsdGVyKCk7XG4gIH1cblxuICByZW1vdmVGaWx0ZXIoKTogdm9pZCB7XG4gICAgdGhpcy5fZmlsdGVyUHJvcGVydGllcyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl91cGRhdGVGaWx0ZXIoKTtcbiAgfVxuXG4gIHNlbGVjdChwcm9wZXJ0aWVzPzogRGF0YUxheWVyRmlsdGVyPEYsIFRMYXllcj4gfCBQcm9wZXJ0aWVzRmlsdGVyKTogdm9pZCB7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLl9zZWxlY3RQcm9wZXJ0aWVzID0gcHJvcGVydGllcztcbiAgICAgIHRoaXMuX3VwZGF0ZUZpbHRlcigpO1xuICAgIH1cbiAgICB0aGlzLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5vcHRpb25zLm9uTGF5ZXJTZWxlY3QpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5vbkxheWVyU2VsZWN0KHsgbGF5ZXI6IHRoaXMsIGZlYXR1cmVzOiBbXSB9KTtcbiAgICB9XG4gIH1cblxuICB1bnNlbGVjdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9zZWxlY3RQcm9wZXJ0aWVzID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX3VwZGF0ZUZpbHRlcigpO1xuICAgIHRoaXMuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5vcHRpb25zLm9uTGF5ZXJTZWxlY3QpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5vbkxheWVyU2VsZWN0KHsgbGF5ZXI6IHRoaXMsIGZlYXR1cmVzOiB1bmRlZmluZWQgfSk7XG4gICAgfVxuICB9XG5cbiAgYmVmb3JlUmVtb3ZlKCk6IHZvaWQge1xuICAgIGNvbnN0IG1hcCA9IHRoaXMubWFwO1xuICAgIGlmIChtYXApIHtcbiAgICAgIGlmICh0aGlzLmxheWVyKSB7XG4gICAgICAgIHRoaXMubGF5ZXIuZm9yRWFjaCgobGF5ZXJJZCkgPT4ge1xuICAgICAgICAgIG1hcC5yZW1vdmVMYXllcihsYXllcklkKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBjb25zdCBpbmRleCA9IG1hcC5fb25NYXBDbGlja0xheWVycy5pbmRleE9mKHRoaXMpO1xuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHRoaXMubWFwLl9vbk1hcENsaWNrTGF5ZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX3JlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XG4gICAgdGhpcy4kb25MYXllck1vdXNlTGVhdmUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy4kb25MYXllck1vdXNlTW92ZSA9IHVuZGVmaW5lZDtcbiAgICBzdXBlci5iZWZvcmVSZW1vdmUoKTtcbiAgfVxuXG4gIF9vbkxheWVyQ2xpY2soXG4gICAgZTogTWFwTGF5ZXJNb3VzZUV2ZW50XG4gICk6IEZlYXR1cmU8R2VvbWV0cnksIEdlb0pzb25Qcm9wZXJ0aWVzPiB8IHVuZGVmaW5lZCB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIC8vIG5vdCB3b3JrIGNvcnJlY3RcbiAgICAvLyBjb25zdCBmZWF0dXJlcyA9IHRoaXMubWFwLnF1ZXJ5UmVuZGVyZWRGZWF0dXJlcyhlLnBvaW50LCB7XG4gICAgLy8gICBsYXllcnM6IHRoaXMubGF5ZXJcbiAgICAvLyB9KTtcbiAgICBsZXQgZmVhdHVyZTogRmVhdHVyZSB8IHVuZGVmaW5lZDtcbiAgICBjb25zdCBtYXAgPSB0aGlzLm1hcDtcbiAgICBpZiAoIW1hcCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5sYXllcikge1xuICAgICAgdGhpcy5sYXllci5maW5kKChhKSA9PiB7XG4gICAgICAgIGNvbnN0IGZlYXR1cmVzXyA9IG1hcC5xdWVyeVJlbmRlcmVkRmVhdHVyZXMoZS5wb2ludCwge1xuICAgICAgICAgIGxheWVyczogW2FdLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGZlYXR1cmVzXy5sZW5ndGgpIHtcbiAgICAgICAgICBmZWF0dXJlID0gZmVhdHVyZXNfWzBdIGFzIEZlYXR1cmU7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSk7XG4gICAgICBpZiAoZmVhdHVyZSkge1xuICAgICAgICBsZXQgZmVhdHVyZXM6IEZlYXR1cmVbXSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IGlzU2VsZWN0ZWQgPSB0aGlzLmlzRmVhdHVyZVNlbGVjdGVkKGZlYXR1cmUpO1xuICAgICAgICBpZiAoaXNTZWxlY3RlZCkge1xuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLnVuc2VsZWN0T25TZWNvbmRDbGljaykge1xuICAgICAgICAgICAgdGhpcy5fdW5zZWxlY3RGZWF0dXJlKGZlYXR1cmUsIHsgc2lsZW50OiB0cnVlIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmZWF0dXJlcyA9IHRoaXMuX3NlbGVjdEZlYXR1cmUoZmVhdHVyZSwgeyBzaWxlbnQ6IHRydWUgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaXNTZWxlY3RlZCA9IHRoaXMuaXNGZWF0dXJlU2VsZWN0ZWQoZmVhdHVyZSk7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMub25MYXllckNsaWNrKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLm9uTGF5ZXJDbGljayh7XG4gICAgICAgICAgICBsYXllcjogdGhpcyxcbiAgICAgICAgICAgIGZlYXR1cmUsXG4gICAgICAgICAgICBzZWxlY3RlZDogaXNTZWxlY3RlZCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm9uTGF5ZXJTZWxlY3QpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMub25MYXllclNlbGVjdCh7IGxheWVyOiB0aGlzLCBmZWF0dXJlcyB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmVhdHVyZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfdXBkYXRlV2l0aE5hdGl2ZUZpbHRlcihmaWx0ZXI6IGFueVtdKTogYW55W10ge1xuICAgIGNvbnN0IG5hdGl2ZUZpbHRlciA9IHRoaXMuX2dldE5hdGl2ZUZpbHRlcigpO1xuICAgIGlmIChuYXRpdmVGaWx0ZXIubGVuZ3RoKSB7XG4gICAgICBmaWx0ZXIucHVzaChuYXRpdmVGaWx0ZXIpO1xuICAgIH1cbiAgICByZXR1cm4gZmlsdGVyO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9nZXROYXRpdmVGaWx0ZXIoKTogUHJvcGVydHlGaWx0ZXI8R2VvSnNvblByb3BlcnRpZXM+IHtcbiAgICByZXR1cm4gKHRoaXMub3B0aW9ucy5uYXRpdmVGaWx0ZXJcbiAgICAgID8gdGhpcy5vcHRpb25zLm5hdGl2ZUZpbHRlclxuICAgICAgOiBbXSkgYXMgUHJvcGVydHlGaWx0ZXI7XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgX2FkZExheWVyKFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICB0eXBlOiBWZWN0b3JBZGFwdGVyTGF5ZXJUeXBlLFxuICAgIGZpbHRlcj86IGFueVtdLFxuICAgIGxheW91dD86IEFueUxheW91dFxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IG1pblpvb20sIG1heFpvb20gfSA9IHRoaXMub3B0aW9ucztcbiAgICBsZXQgbVR5cGU6IE1hcGJveExheWVyVHlwZSB8IHVuZGVmaW5lZDtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMucGFpbnQpIHtcbiAgICAgIGlmICgndHlwZScgaW4gdGhpcy5vcHRpb25zLnBhaW50ICYmIHRoaXMub3B0aW9ucy5wYWludC50eXBlID09PSAnaWNvbicpIHtcbiAgICAgICAgbVR5cGUgPSAnc3ltYm9sJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobVR5cGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgbVR5cGUgPSBtYXBib3hUeXBlQWxpYXNbdHlwZV07XG4gICAgfVxuICAgIGxheW91dCA9IChsYXlvdXQgfHwgdGhpcy5vcHRpb25zLmxheW91dCB8fCB7fSkgYXMgQW55TGF5b3V0O1xuICAgIGNvbnN0IGxheWVyT3B0OiBMYXllciA9IHtcbiAgICAgIGlkOiBuYW1lLFxuICAgICAgdHlwZTogbVR5cGUsXG4gICAgICBzb3VyY2U6IHRoaXMuX3NvdXJjZUlkLFxuICAgICAgbGF5b3V0OiB7XG4gICAgICAgIHZpc2liaWxpdHk6ICdub25lJyxcbiAgICAgICAgLi4ubGF5b3V0LFxuICAgICAgfSxcbiAgICAgIC4uLnRoaXMuX2dldEFkZGl0aW9uYWxMYXllck9wdGlvbnMoKSxcbiAgICB9O1xuICAgIGlmICh0aGlzLm9wdGlvbnMubmF0aXZlT3B0aW9ucykge1xuICAgICAgT2JqZWN0LmFzc2lnbihsYXllck9wdCwgdGhpcy5vcHRpb25zLm5hdGl2ZU9wdGlvbnMpO1xuICAgIH1cbiAgICBpZiAobWluWm9vbSkge1xuICAgICAgbGF5ZXJPcHQubWluem9vbSA9IG1pblpvb20gLSAxO1xuICAgIH1cbiAgICBpZiAobWF4Wm9vbSkge1xuICAgICAgbGF5ZXJPcHQubWF4em9vbSA9IG1heFpvb20gLSAxO1xuICAgIH1cbiAgICBjb25zdCBtYXAgPSB0aGlzLm1hcDtcbiAgICBpZiAobWFwKSB7XG4gICAgICBtYXAuYWRkTGF5ZXIobGF5ZXJPcHQpO1xuXG4gICAgICBjb25zdCBmaWx0ZXJzID0gWydhbGwnLCAuLi4oZmlsdGVyIHx8IFtdKV0uZmlsdGVyKCh4KSA9PiB4KTtcbiAgICAgIGlmIChmaWx0ZXJzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgbWFwLnNldEZpbHRlcihsYXllck9wdC5pZCwgZmlsdGVycyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9vbkFkZExheWVyKHNvdXJjZUlkOiBzdHJpbmcsIG9wdGlvbnM/OiBBbnlTb3VyY2VEYXRhKTogdm9pZCB7XG4gICAgLy8gaWdub3JlXG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgX3VwZGF0ZUxheWVyUGFpbnQoXG4gICAgdHlwZTogVmVjdG9yQWRhcHRlckxheWVyVHlwZVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBsYXllck5hbWUgPSB0aGlzLl9nZXRMYXllck5hbWVGcm9tVHlwZSh0eXBlKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMucGFpbnQpIHtcbiAgICAgIGNvbnN0IGxheWVyczogW3N0cmluZywgUGFpbnRdW10gPSBbW2xheWVyTmFtZSwgdGhpcy5vcHRpb25zLnBhaW50XV07XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNlbGVjdGVkUGFpbnQpIHtcbiAgICAgICAgY29uc3Qgc2VsTmFtZSA9IHRoaXMuX2dldFNlbGVjdGlvbkxheWVyTmFtZUZyb21UeXBlKHR5cGUpO1xuICAgICAgICBsYXllcnMucHVzaChbc2VsTmFtZSwgdGhpcy5vcHRpb25zLnNlbGVjdGVkUGFpbnRdKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChjb25zdCBbbmFtZSwgcGFpbnRdIG9mIGxheWVycykge1xuICAgICAgICBsZXQgX3BhaW50OiBhbnk7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubmF0aXZlUGFpbnQpIHtcbiAgICAgICAgICBfcGFpbnQgPVxuICAgICAgICAgICAgdHlwZW9mIHRoaXMub3B0aW9ucy5uYXRpdmVQYWludCA9PT0gJ2Jvb2xlYW4nXG4gICAgICAgICAgICAgID8gcGFpbnRcbiAgICAgICAgICAgICAgOiB0aGlzLm9wdGlvbnMubmF0aXZlUGFpbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3BhaW50ID0gYXdhaXQgdGhpcy5fY3JlYXRlUGFpbnRGb3JUeXBlKHBhaW50LCB0eXBlLCBuYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5tYXApIHtcbiAgICAgICAgICBpZiAoJ2ljb24taW1hZ2UnIGluIF9wYWludCkge1xuICAgICAgICAgICAgLy8gSWYgdHJ1ZSwgdGhlIGljb24gd2lsbCBiZSB2aXNpYmxlIGV2ZW4gaWYgaXQgY29sbGlkZXMgd2l0aCBvdGhlciBwcmV2aW91c2x5IGRyYXduIHN5bWJvbHMuXG4gICAgICAgICAgICBfcGFpbnRbJ2ljb24tYWxsb3ctb3ZlcmxhcCddID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcCBpbiBfcGFpbnQpIHtcbiAgICAgICAgICAgICAgdGhpcy5tYXAuc2V0TGF5b3V0UHJvcGVydHkobmFtZSwgcCwgX3BhaW50W3BdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChjb25zdCBwIGluIF9wYWludCkge1xuICAgICAgICAgICAgICB0aGlzLm1hcC5zZXRQYWludFByb3BlcnR5KG5hbWUsIHAsIF9wYWludFtwXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9nZXRMYXllck5hbWVGcm9tVHlwZSh0eXBlOiBWZWN0b3JBZGFwdGVyTGF5ZXJUeXBlKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdHlwZSArICctJyArIHRoaXMuX2xheWVySWQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2dldFNlbGVjdGlvbkxheWVyTmFtZUZyb21UeXBlKFxuICAgIHR5cGU6IFZlY3RvckFkYXB0ZXJMYXllclR5cGVcbiAgKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdHlwZSArICctJyArIHRoaXMuX3NlbGVjdGlvbk5hbWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgX2NyZWF0ZVBhaW50Rm9yVHlwZShcbiAgICBwYWludDogUGFpbnQsXG4gICAgdHlwZTogVmVjdG9yQWRhcHRlckxheWVyVHlwZSxcbiAgICBuYW1lPzogc3RyaW5nXG4gICk6IFByb21pc2U8YW55PiB7XG4gICAgaWYgKGlzUGFpbnQocGFpbnQpKSB7XG4gICAgICBjb25zdCBtYXBib3hQYWludDogYW55ID0ge307XG4gICAgICBjb25zdCBfcGFpbnQgPSB7IC4uLlBBSU5ULCAuLi4ocGFpbnQgfHwge30pIH07XG4gICAgICBpZiAocGFpbnQudHlwZSA9PT0gJ2ljb24nICYmIHBhaW50Lmh0bWwpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5fcmVnaXN0ZXJJbWFnZShwYWludCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2ljb24taW1hZ2UnOiBwYWludC5odG1sLFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbWFwYm94VHlwZSA9IG1hcGJveFR5cGVBbGlhc1t0eXBlXTtcbiAgICAgICAgZm9yIChjb25zdCBwIGluIF9wYWludCkge1xuICAgICAgICAgIGNvbnN0IGFsbG93ZWQgPSBhbGxvd2VkQnlUeXBlW3R5cGVdO1xuICAgICAgICAgIGlmIChhbGxvd2VkKSB7XG4gICAgICAgICAgICBjb25zdCBhbGxvd2VkVHlwZSA9IGFsbG93ZWQuZmluZCgoeCkgPT4ge1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIHggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHggPT09IHA7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh4KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4WzBdID09PSBwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGFsbG93ZWRUeXBlKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHBhcmFtTmFtZSA9IEFycmF5LmlzQXJyYXkoYWxsb3dlZFR5cGUpXG4gICAgICAgICAgICAgICAgPyBhbGxvd2VkVHlwZVsxXVxuICAgICAgICAgICAgICAgIDogYWxsb3dlZFR5cGU7XG4gICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgbWFwYm94UGFpbnRbbWFwYm94VHlwZSArICctJyArIHBhcmFtTmFtZV0gPSBfcGFpbnRbcF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG1hcGJveFBhaW50W21hcGJveFR5cGUgKyAnLW9wYWNpdHktdHJhbnNpdGlvbiddID0ge1xuICAgICAgICAgIGR1cmF0aW9uOiAwLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gbWFwYm94UGFpbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9nZXRGZWF0dXJlRmlsdGVySWQoZmVhdHVyZTogRmVhdHVyZSk6IHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGlkID0gZmVhdHVyZS5fZmVhdHVyZUZpbHRlcklkO1xuICAgIGlmIChpZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gaWQ7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGZlYXR1cmUucHJvcGVydGllcyAmJlxuICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzW3RoaXMuZmVhdHVyZUlkTmFtZV0gIT09IHVuZGVmaW5lZFxuICAgICkge1xuICAgICAgcmV0dXJuIGZlYXR1cmUucHJvcGVydGllc1t0aGlzLmZlYXR1cmVJZE5hbWVdO1xuICAgIH1cbiAgICByZXR1cm4gZmVhdHVyZS5pZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBfcmVnaXN0ZXJJbWFnZShwYWludDogSWNvbk9wdGlvbnMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoaXNJY29uKHBhaW50KSAmJiBwYWludC5odG1sICYmIHRoaXMubWFwKSB7XG4gICAgICBjb25zdCBpbWFnZUV4aXN0ID0gdGhpcy5tYXAuaGFzSW1hZ2UocGFpbnQuaHRtbCk7XG4gICAgICBpZiAoIWltYWdlRXhpc3QpIHtcbiAgICAgICAgbGV0IHdpZHRoID0gMTI7XG4gICAgICAgIGxldCBoZWlnaHQgPSAxMjtcbiAgICAgICAgaWYgKHBhaW50Lmljb25TaXplKSB7XG4gICAgICAgICAgd2lkdGggPSBwYWludC5pY29uU2l6ZVswXTtcbiAgICAgICAgICBoZWlnaHQgPSBwYWludC5pY29uU2l6ZVsxXTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpbWFnZSA9IGF3YWl0IGdldEltYWdlKHBhaW50Lmh0bWwsIHtcbiAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodGhpcy5tYXApIHtcbiAgICAgICAgICB0aGlzLm1hcC5hZGRJbWFnZShwYWludC5odG1sLCBpbWFnZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX3NlbGVjdEZlYXR1cmUoXG4gICAgZmVhdHVyZTogRmVhdHVyZSB8IEZlYXR1cmVbXSxcbiAgICBvcHQ/OiB7IHNpbGVudDogYm9vbGVhbiB9XG4gICk6IEZlYXR1cmVbXSB7XG4gICAgY29uc3QgZmVhdHVyZXMgPSBBcnJheS5pc0FycmF5KGZlYXR1cmUpID8gZmVhdHVyZSA6IFtmZWF0dXJlXTtcbiAgICB0aGlzLnNlbGVjdChbXG4gICAgICBbXG4gICAgICAgIHRoaXMuZmVhdHVyZUlkTmFtZSxcbiAgICAgICAgJ2luJyxcbiAgICAgICAgZmVhdHVyZXMubWFwKFxuICAgICAgICAgICh4KSA9PiAoeC5wcm9wZXJ0aWVzICYmIHgucHJvcGVydGllc1t0aGlzLmZlYXR1cmVJZE5hbWVdKSB8fCB4LmlkXG4gICAgICAgICksXG4gICAgICBdLFxuICAgIF0pO1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfdW5zZWxlY3RGZWF0dXJlKFxuICAgIGZlYXR1cmU6IEZlYXR1cmUgfCBGZWF0dXJlW10sXG4gICAgb3B0PzogeyBzaWxlbnQ6IGJvb2xlYW4gfVxuICApOiB2b2lkIHtcbiAgICAvLyBpZ25vcmVcbiAgfVxuXG4gIHByb3RlY3RlZCBfZ2V0QWRkaXRpb25hbExheWVyT3B0aW9ucygpOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcHJvdGVjdGVkIF91cGRhdGVGaWx0ZXIoKTogdm9pZCB7XG4gICAgdGhpcy5fdXBkYXRlUHJvcGVydGllc0ZpbHRlcigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF91cGRhdGVQcm9wZXJ0aWVzRmlsdGVyKCk6IHZvaWQge1xuICAgIGNvbnN0IGxheWVycyA9IHRoaXMubGF5ZXI7XG4gICAgaWYgKGxheWVycykge1xuICAgICAgdGhpcy5fdHlwZXMuZm9yRWFjaCgodCkgPT4ge1xuICAgICAgICBjb25zdCBnZW9tVHlwZSA9IHR5cGVBbGlhc0ZvckZpbHRlclt0XTtcbiAgICAgICAgaWYgKGdlb21UeXBlKSB7XG4gICAgICAgICAgY29uc3QgZ2VvbUZpbHRlciA9IFsnPT0nLCAnJHR5cGUnLCBnZW9tVHlwZV07XG4gICAgICAgICAgY29uc3QgbGF5ZXJOYW1lID0gdGhpcy5fZ2V0TGF5ZXJOYW1lRnJvbVR5cGUodCk7XG4gICAgICAgICAgY29uc3Qgc2VsTGF5ZXJOYW1lID0gdGhpcy5fZ2V0U2VsZWN0aW9uTGF5ZXJOYW1lRnJvbVR5cGUodCk7XG4gICAgICAgICAgY29uc3Qgc2VsZWN0UHJvcGVydGllcyA9IHRoaXMuX3NlbGVjdFByb3BlcnRpZXM7XG4gICAgICAgICAgY29uc3QgZmlsdGVyUHJvcGVydGllcyA9IHRoaXMuX2ZpbHRlclByb3BlcnRpZXM7XG4gICAgICAgICAgY29uc3QgcHJvcGVydHlGaWx0ZXJzID1cbiAgICAgICAgICAgIGZpbHRlclByb3BlcnRpZXMgJiYgdGhpcy5fY29udmVydFRvTWFwYm94RmlsdGVyKGZpbHRlclByb3BlcnRpZXMpO1xuICAgICAgICAgIGlmICh0aGlzLm1hcCAmJiBsYXllcnMuaW5kZXhPZihzZWxMYXllck5hbWUpICE9PSAtMSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGlvbk5hbWUpIHtcbiAgICAgICAgICAgICAgbGV0IGZpbHRlcnM6IGFueVtdID0gW107XG4gICAgICAgICAgICAgIGlmIChzZWxlY3RQcm9wZXJ0aWVzIHx8IHRoaXMuX3NlbGVjdGVkRmVhdHVyZUlkcykge1xuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RQcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgICBmaWx0ZXJzID0gdGhpcy5fY29udmVydFRvTWFwYm94RmlsdGVyKHNlbGVjdFByb3BlcnRpZXMpIHx8IFtdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fc2VsZWN0ZWRGZWF0dXJlSWRzKSB7XG4gICAgICAgICAgICAgICAgICBmaWx0ZXJzID0gW1xuICAgICAgICAgICAgICAgICAgICBbJ2luJywgdGhpcy5mZWF0dXJlSWROYW1lLCAuLi50aGlzLl9zZWxlY3RlZEZlYXR1cmVJZHNdLFxuICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5RmlsdGVycykge1xuICAgICAgICAgICAgICAgICAgcHJvcGVydHlGaWx0ZXJzLmZvckVhY2goKHgpID0+IGZpbHRlcnMucHVzaCh4KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMubWFwLnNldEZpbHRlcihzZWxMYXllck5hbWUsIFtcbiAgICAgICAgICAgICAgICAgICdhbGwnLFxuICAgICAgICAgICAgICAgICAgZ2VvbUZpbHRlcixcbiAgICAgICAgICAgICAgICAgIC4uLmZpbHRlcnMsXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmlsdGVycyA9IFsnaW4nLCAnJGlkJywgJyddO1xuICAgICAgICAgICAgICAgIHRoaXMubWFwLnNldEZpbHRlcihzZWxMYXllck5hbWUsIGZpbHRlcnMpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLm1hcCAmJiBsYXllcnMuaW5kZXhPZihsYXllck5hbWUpICE9PSAtMSkge1xuICAgICAgICAgICAgY29uc3QgZmlsdGVyc186IGFueVtdID0gWydhbGwnLCBnZW9tRmlsdGVyXTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVdpdGhOYXRpdmVGaWx0ZXIoZmlsdGVyc18pO1xuICAgICAgICAgICAgaWYgKHNlbGVjdFByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0RmlsdGVycyA9IHRoaXMuX2NvbnZlcnRUb01hcGJveEZpbHRlcihcbiAgICAgICAgICAgICAgICBzZWxlY3RQcm9wZXJ0aWVzLFxuICAgICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgc2VsZWN0RmlsdGVycy5mb3JFYWNoKCh4KSA9PiBmaWx0ZXJzXy5wdXNoKHgpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fc2VsZWN0ZWRGZWF0dXJlSWRzKSB7XG4gICAgICAgICAgICAgIGZpbHRlcnNfLnB1c2goW1xuICAgICAgICAgICAgICAgICchaW4nLFxuICAgICAgICAgICAgICAgIHRoaXMuZmVhdHVyZUlkTmFtZSxcbiAgICAgICAgICAgICAgICAuLi50aGlzLl9zZWxlY3RlZEZlYXR1cmVJZHMsXG4gICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByb3BlcnR5RmlsdGVycykge1xuICAgICAgICAgICAgICBwcm9wZXJ0eUZpbHRlcnMuZm9yRWFjaCgoeCkgPT4gZmlsdGVyc18ucHVzaCh4KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm1hcC5zZXRGaWx0ZXIobGF5ZXJOYW1lLCBmaWx0ZXJzXyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbnZlcnRUb01hcGJveEZpbHRlcihcbiAgICBmaWx0ZXJzOiBQcm9wZXJ0aWVzRmlsdGVyLFxuICAgIHJldmVyc2UgPSBmYWxzZVxuICApOiAoYW55W10gfCAnYWxsJyB8ICdhbnknIHwgdW5kZWZpbmVkKVtdIHtcbiAgICBjb25zdCBfb3BlcmF0aW9uc0FsaWFzZXMgPSByZXZlcnNlID8gcmV2ZXJzT3BlcmF0aW9ucyA6IG9wZXJhdGlvbnNBbGlhc2VzO1xuICAgIGNvbnN0IGZpbHRlciA9IGZpbHRlcnMubWFwKCh4KSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiB4O1xuICAgICAgfSBlbHNlIGlmIChjaGVja0lmUHJvcGVydHlGaWx0ZXIoeCkpIHtcbiAgICAgICAgY29uc3QgW2ZpZWxkLCBvcGVyYXRpb24sIHZhbHVlXSA9IHg7XG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbkFsaWFzID0gX29wZXJhdGlvbnNBbGlhc2VzW29wZXJhdGlvbl07XG4gICAgICAgIGlmIChvcGVyYXRpb24gPT09ICdpbicgfHwgb3BlcmF0aW9uID09PSAnbm90aW4nKSB7XG4gICAgICAgICAgcmV0dXJuIFtvcGVyYXRpb25BbGlhcywgZmllbGQsIC4uLnZhbHVlXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW29wZXJhdGlvbkFsaWFzLCBmaWVsZCwgdmFsdWVdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBmaWx0ZXI7XG4gIH1cblxuICBwcm90ZWN0ZWQgaXNGZWF0dXJlU2VsZWN0ZWQoZmVhdHVyZTogRmVhdHVyZSk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLl9zZWxlY3RlZEZlYXR1cmVJZHMpIHtcbiAgICAgIGNvbnN0IGZpbHRlcklkID0gdGhpcy5fZ2V0RmVhdHVyZUZpbHRlcklkKGZlYXR1cmUpO1xuICAgICAgaWYgKGZpbHRlcklkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZEZlYXR1cmVJZHMuaW5kZXhPZihmaWx0ZXJJZCkgIT09IC0xO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIF9vbkxheWVyTW91c2VNb3ZlKCkge1xuICAgIGlmICh0aGlzLm1hcCkge1xuICAgICAgdGhpcy5tYXAuZ2V0Q2FudmFzKCkuc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX29uTGF5ZXJNb3VzZUxlYXZlKCkge1xuICAgIGlmICh0aGlzLm1hcCkge1xuICAgICAgdGhpcy5tYXAuZ2V0Q2FudmFzKCkuc3R5bGUuY3Vyc29yID0gJyc7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZGV0ZWN0UGFpbnRUeXBlKHBhaW50OiBQYWludCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCd0eXBlJyBpbiBwYWludCkge1xuICAgICAgcmV0dXJuIHBhaW50LnR5cGU7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcGFpbnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGZhbHNlUGFpbnQgPSBwYWludCh7XG4gICAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICAgIGdlb21ldHJ5OiB7fSBhcyBHZW9tZXRyeSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZXRlY3RQYWludFR5cGUoZmFsc2VQYWludCk7XG4gICAgICB9IGNhdGNoIChlcikge1xuICAgICAgICAvL1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2FkZEV2ZW50c0xpc3RlbmVycygpIHtcbiAgICBpZiAodGhpcy5sYXllciAmJiB0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLnNlbGVjdGFibGUpIHtcbiAgICAgIHRoaXMubGF5ZXIuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgICAvLyBpZiAodGhpcy4kb25MYXllckNsaWNrKSB7XG4gICAgICAgIC8vICAgdGhpcy5tYXAub24oJ2NsaWNrJywgeCwgdGhpcy4kb25MYXllckNsaWNrKTtcbiAgICAgICAgLy8gfVxuICAgICAgICBpZiAodGhpcy4kb25MYXllck1vdXNlTW92ZSAmJiB0aGlzLm1hcCkge1xuICAgICAgICAgIHRoaXMubWFwLm9uKCdtb3VzZW1vdmUnLCB4LCB0aGlzLiRvbkxheWVyTW91c2VNb3ZlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy4kb25MYXllck1vdXNlTGVhdmUgJiYgdGhpcy5tYXApIHtcbiAgICAgICAgICB0aGlzLm1hcC5vbignbW91c2VsZWF2ZScsIHgsIHRoaXMuJG9uTGF5ZXJNb3VzZUxlYXZlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgaWYgKHRoaXMuJG9uTGF5ZXJNb3VzZU1vdmUgJiYgdGhpcy5tYXApIHtcbiAgICAgIHRoaXMubWFwLm9mZignbW91c2Vtb3ZlJywgdGhpcy4kb25MYXllck1vdXNlTW92ZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLiRvbkxheWVyTW91c2VMZWF2ZSAmJiB0aGlzLm1hcCkge1xuICAgICAgdGhpcy5tYXAub2ZmKCdtb3VzZWxlYXZlJywgdGhpcy4kb25MYXllck1vdXNlTGVhdmUpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgTWFpbkxheWVyQWRhcHRlciwgV21zQWRhcHRlck9wdGlvbnMgfSBmcm9tICdAbmV4dGdpcy93ZWJtYXAnO1xuXG5pbXBvcnQgeyBUaWxlQWRhcHRlciB9IGZyb20gJy4vVGlsZUFkYXB0ZXInO1xuXG5leHBvcnQgY2xhc3MgV21zQWRhcHRlciBleHRlbmRzIFRpbGVBZGFwdGVyPFdtc0FkYXB0ZXJPcHRpb25zPlxuICBpbXBsZW1lbnRzIE1haW5MYXllckFkYXB0ZXIge1xuICBhZGRMYXllcihvcHRpb25zOiBXbXNBZGFwdGVyT3B0aW9ucyk6IHN0cmluZ1tdIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IG51bWJlcj4gPSB7XG4gICAgICBiYm94OiAne2Jib3gtZXBzZy0zODU3fScsXG4gICAgICBmb3JtYXQ6IG9wdGlvbnMuZm9ybWF0IHx8ICdpbWFnZS9wbmcnLFxuICAgICAgc2VydmljZTogJ1dNUycsXG4gICAgICB2ZXJzaW9uOiAnMS4xLjEnLFxuICAgICAgcmVxdWVzdDogJ0dldE1hcCcsXG4gICAgICBzcnM6ICdFUFNHOjM4NTcnLFxuICAgICAgdHJhbnNwYXJlbnQ6ICd0cnVlJyxcbiAgICAgIHdpZHRoOiBvcHRpb25zLnRpbGVTaXplIHx8ICcyNTYnLFxuICAgICAgaGVpZ2h0OiBvcHRpb25zLnRpbGVTaXplIHx8ICcyNTYnLFxuICAgICAgbGF5ZXJzOiBvcHRpb25zLmxheWVycyB8fCAnJyxcbiAgICB9O1xuICAgIGNvbnN0IHBhcmFtc1N0ciA9IE9iamVjdC5rZXlzKHBhcmFtcylcbiAgICAgIC5tYXAoKHgpID0+IGAke3h9PSR7cGFyYW1zW3hdfWApXG4gICAgICAuam9pbignJicpO1xuICAgIG9wdGlvbnMudXJsID0gb3B0aW9ucy51cmwgKyAnPycgKyBwYXJhbXNTdHI7XG4gICAgcmV0dXJuIHN1cGVyLmFkZExheWVyKG9wdGlvbnMpO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBHZW9Kc29uR2VvbWV0cnlUeXBlcyxcbiAgR2VvSnNvbk9iamVjdCxcbiAgRmVhdHVyZUNvbGxlY3Rpb24sXG4gIEZlYXR1cmUsXG4gIEdlb21ldHJ5Q29sbGVjdGlvbixcbn0gZnJvbSAnZ2VvanNvbic7XG5pbXBvcnQgeyBWZWN0b3JBZGFwdGVyTGF5ZXJUeXBlIH0gZnJvbSAnQG5leHRnaXMvd2VibWFwJztcblxuZXhwb3J0IGNvbnN0IGFsbG93ZWRQYXJhbXM6IChbc3RyaW5nLCBzdHJpbmddIHwgc3RyaW5nKVtdID0gW1xuICAnY29sb3InLFxuICAnb3BhY2l0eScsXG5dO1xuZXhwb3J0IGNvbnN0IGFsbG93ZWRCeVR5cGU6IHtcbiAgW2tleSBpbiBWZWN0b3JBZGFwdGVyTGF5ZXJUeXBlXTogKFtzdHJpbmcsIHN0cmluZ10gfCBzdHJpbmcpW107XG59ID0ge1xuICBwb2ludDogW1xuICAgIFsnZmlsbENvbG9yJywgJ2NvbG9yJ10sXG4gICAgWydmaWxsT3BhY2l0eScsICdvcGFjaXR5J10sXG4gICAgWydzdHJva2VDb2xvcicsICdzdHJva2UtY29sb3InXSxcbiAgICBbJ3N0cm9rZU9wYWNpdHknLCAnc3Ryb2tlLW9wYWNpdHknXSxcbiAgICBbJ3dlaWdodCcsICdzdHJva2Utd2lkdGgnXSxcbiAgICAncmFkaXVzJyxcbiAgXSxcbiAgbGluZTogW1xuICAgIFsnc3Ryb2tlQ29sb3InLCAnY29sb3InXSxcbiAgICBbJ3N0cm9rZU9wYWNpdHknLCAnb3BhY2l0eSddLFxuICAgIFsnd2VpZ2h0JywgJ3dpZHRoJ10sXG4gIF0sXG4gIHBvbHlnb246IFtcbiAgICBbJ2ZpbGxDb2xvcicsICdjb2xvciddLFxuICAgIFsnZmlsbE9wYWNpdHknLCAnb3BhY2l0eSddLFxuICBdLFxufTtcblxuZXhwb3J0IGNvbnN0IHR5cGVBbGlhczoge1xuICBba2V5IGluIEdlb0pzb25HZW9tZXRyeVR5cGVzXTogVmVjdG9yQWRhcHRlckxheWVyVHlwZTtcbn0gPSB7XG4gIFBvaW50OiAncG9pbnQnLFxuICBMaW5lU3RyaW5nOiAnbGluZScsXG4gIE11bHRpUG9pbnQ6ICdwb2ludCcsXG4gIFBvbHlnb246ICdwb2x5Z29uJyxcbiAgTXVsdGlMaW5lU3RyaW5nOiAnbGluZScsXG4gIE11bHRpUG9seWdvbjogJ3BvbHlnb24nLFxuICBHZW9tZXRyeUNvbGxlY3Rpb246ICdwb2x5Z29uJyxcbn07XG5cbmV4cG9ydCBjb25zdCB0eXBlQWxpYXNGb3JGaWx0ZXI6IHtcbiAgW2tleSBpbiBWZWN0b3JBZGFwdGVyTGF5ZXJUeXBlXTogR2VvSnNvbkdlb21ldHJ5VHlwZXM7XG59ID0ge1xuICBwb2ludDogJ1BvaW50JyxcbiAgbGluZTogJ0xpbmVTdHJpbmcnLFxuICBwb2x5Z29uOiAnUG9seWdvbicsXG59O1xuXG5leHBvcnQgY29uc3QgYmFja0FsaWFzZXM6IHtcbiAgW2tleSBpbiBWZWN0b3JBZGFwdGVyTGF5ZXJUeXBlXT86IEdlb0pzb25HZW9tZXRyeVR5cGVzW107XG59ID0ge307XG5cbmZvciAoY29uc3QgYSBpbiB0eXBlQWxpYXMpIHtcbiAgY29uc3QgbGF5ZXJUeXBlID0gdHlwZUFsaWFzW2EgYXMgR2VvSnNvbkdlb21ldHJ5VHlwZXNdO1xuICBjb25zdCBiYWNrQWxpYXMgPSBiYWNrQWxpYXNlc1tsYXllclR5cGVdIHx8IFtdO1xuICBiYWNrQWxpYXMucHVzaChhIGFzIEdlb0pzb25HZW9tZXRyeVR5cGVzKTtcbiAgYmFja0FsaWFzZXNbbGF5ZXJUeXBlXSA9IGJhY2tBbGlhcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRNb3N0RnJlcXVlbnRHZW9tVHlwZShcbiAgYXJyOiBHZW9Kc29uR2VvbWV0cnlUeXBlc1tdXG4pOiBHZW9Kc29uR2VvbWV0cnlUeXBlcyB7XG4gIGNvbnN0IGNvdW50czogeyBbeDogc3RyaW5nXTogbnVtYmVyIH0gPSB7fTtcbiAgZm9yIChsZXQgZnJ5ID0gMDsgZnJ5IDwgYXJyLmxlbmd0aDsgZnJ5KyspIHtcbiAgICBjb3VudHNbYXJyW2ZyeV1dID0gMSArIChjb3VudHNbYXJyW2ZyeV1dIHx8IDApO1xuICB9XG4gIGxldCBtYXhOYW1lID0gJyc7XG4gIGZvciAoY29uc3QgYyBpbiBjb3VudHMpIHtcbiAgICBjb25zdCBtYXhDb3VudCA9IG1heE5hbWUgPyBjb3VudHNbbWF4TmFtZV0gOiAwO1xuICAgIGlmIChjb3VudHNbY10gPiBtYXhDb3VudCkge1xuICAgICAgbWF4TmFtZSA9IGM7XG4gICAgfVxuICB9XG4gIHJldHVybiBtYXhOYW1lIGFzIEdlb0pzb25HZW9tZXRyeVR5cGVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGV0ZWN0VHlwZShnZW9qc29uOiBHZW9Kc29uT2JqZWN0KTogR2VvSnNvbkdlb21ldHJ5VHlwZXMge1xuICBsZXQgZ2VvbWV0cnk6IEdlb0pzb25HZW9tZXRyeVR5cGVzO1xuICBpZiAoZ2VvanNvbi50eXBlID09PSAnRmVhdHVyZUNvbGxlY3Rpb24nKSB7XG4gICAgY29uc3QgZmVhdHVyZXNUeXBlcyA9IChnZW9qc29uIGFzIEZlYXR1cmVDb2xsZWN0aW9uKS5mZWF0dXJlcy5tYXAoXG4gICAgICAoZikgPT4gZi5nZW9tZXRyeS50eXBlXG4gICAgKTtcbiAgICBnZW9tZXRyeSA9IGZpbmRNb3N0RnJlcXVlbnRHZW9tVHlwZShmZWF0dXJlc1R5cGVzKTtcbiAgfSBlbHNlIGlmIChnZW9qc29uLnR5cGUgPT09ICdHZW9tZXRyeUNvbGxlY3Rpb24nKSB7XG4gICAgY29uc3QgZ2VvbWV0cnlUeXBlcyA9IChnZW9qc29uIGFzIEdlb21ldHJ5Q29sbGVjdGlvbikuZ2VvbWV0cmllcy5tYXAoXG4gICAgICAoZykgPT4gZy50eXBlXG4gICAgKTtcbiAgICBnZW9tZXRyeSA9IGZpbmRNb3N0RnJlcXVlbnRHZW9tVHlwZShnZW9tZXRyeVR5cGVzKTtcbiAgfSBlbHNlIGlmIChnZW9qc29uLnR5cGUgPT09ICdGZWF0dXJlJykge1xuICAgIGdlb21ldHJ5ID0gKGdlb2pzb24gYXMgRmVhdHVyZSkuZ2VvbWV0cnkudHlwZTtcbiAgfSBlbHNlIHtcbiAgICBnZW9tZXRyeSA9IGdlb2pzb24udHlwZTtcbiAgfVxuICByZXR1cm4gZ2VvbWV0cnk7XG59XG5cbi8vIFN0YXRpYyBmdW5jdGlvbnNcbmV4cG9ydCBmdW5jdGlvbiBnZW9tZXRyeUZpbHRlcihcbiAgZ2VvbWV0cnk6IEdlb0pzb25HZW9tZXRyeVR5cGVzLFxuICB0eXBlOiBWZWN0b3JBZGFwdGVyTGF5ZXJUeXBlXG4pOiBib29sZWFuIHtcbiAgY29uc3QgYmFja1R5cGUgPSBiYWNrQWxpYXNlc1t0eXBlXTtcbiAgaWYgKGJhY2tUeXBlKSB7XG4gICAgcmV0dXJuIGJhY2tUeXBlLmluZGV4T2YoZ2VvbWV0cnkpICE9PSAtMTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG4iLCJsZXQgY2Fudmc6IGFueTtcbnRyeSB7XG4gIGNhbnZnID0gcmVxdWlyZSgnY2FudmcnKTtcbn0gY2F0Y2ggKGVyKSB7XG4gIC8vIGlnbm9yZVxufVxuaW50ZXJmYWNlIEdldEltZ09wdCB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICB4PzogbnVtYmVyO1xuICB5PzogbnVtYmVyO1xuICBzZGY/OiBzdHJpbmc7XG4gIHBpeGVsUmF0aW8/OiBudW1iZXI7XG59XG5cbi8vIGNvbnN0IGRlZkFkZEltZ09wdCA9IHtcbi8vICAgd2lkdGg6IDEyLFxuLy8gICBoZWlnaHQ6IDEyLFxuLy8gICB4OiAwLFxuLy8gICB5OiAwLFxuLy8gICBzZGY6IHVuZGVmaW5lZCxcbi8vICAgcGl4ZWxSYXRpbzogMlxuLy8gfTtcblxuLy8gLy8gZnJvbSAvbWFwYm94LWdsL3NyYy91dGlsL2Jyb3dzZXIuanNcbmV4cG9ydCBmdW5jdGlvbiBnZXRJbWFnZURhdGEoXG4gIGltZzogc3RyaW5nIHwgSFRNTEltYWdlRWxlbWVudCxcbiAgb3B0OiBHZXRJbWdPcHRcbik6IEltYWdlRGF0YSB7XG4gIGNvbnN0IGNhbnZhcyA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgY29uc3QgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICBpZiAoIWNvbnRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZhaWxlZCB0byBjcmVhdGUgY2FudmFzIDJkIGNvbnRleHQnKTtcbiAgfVxuICBjYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIFN0cmluZyhvcHQud2lkdGgpKTtcbiAgY2FudmFzLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgU3RyaW5nKG9wdC5oZWlnaHQpKTtcbiAgaWYgKCFjYW52ZyAmJiBpbWcgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50KSB7XG4gICAgY29udGV4dC5kcmF3SW1hZ2UoaW1nLCAwLCAwLCBvcHQud2lkdGgsIG9wdC5oZWlnaHQpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBpbWcgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKGNhbnZnLkNhbnZnKSB7XG4gICAgICAvLyBmb3IgY2Fudmcgdi4zLngueFxuICAgICAgY29uc3QgdiA9IGNhbnZnLkNhbnZnLmZyb21TdHJpbmcoY29udGV4dCwgaW1nKTtcbiAgICAgIHYuc3RhcnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZm9yIGNhbnZnIHYuMi54LnhcbiAgICAgIGNhbnZnKGNhbnZhcywgaW1nKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsIDAsIG9wdC53aWR0aCwgb3B0LmhlaWdodCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbWFnZShzdmdTdHI6IHN0cmluZywgb3B0OiBHZXRJbWdPcHQpOiBQcm9taXNlPEltYWdlRGF0YT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBpZiAoY2FudmcpIHtcbiAgICAgIHJlc29sdmUoZ2V0SW1hZ2VEYXRhKHN2Z1N0ciwgb3B0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHN2Z0ltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICBzdmdJbWFnZS5jcm9zc09yaWdpbiA9ICdBbm9ueW1vdXMnO1xuICAgICAgc3ZnSW1hZ2Uuc3JjID0gJ2RhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsJyArIGJ0b2Eoc3ZnU3RyKTtcblxuICAgICAgc3ZnSW1hZ2Uub25sb2FkID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBpbWFnZURhdGEgPSBnZXRJbWFnZURhdGEoc3ZnSW1hZ2UsIG9wdCk7XG4gICAgICAgIHJlc29sdmUoaW1hZ2VEYXRhKTtcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbn1cbiIsImltcG9ydCBDYW5jZWxhYmxlUHJvbWlzZSBmcm9tICdAbmV4dGdpcy9jYW5jZWxhYmxlLXByb21pc2UnO1xuaW1wb3J0IHsgRGVlcFBhcnRpYWwsIGRlZmluZWQgfSBmcm9tICdAbmV4dGdpcy91dGlscyc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG5pbXBvcnQgeyBSZXF1ZXN0SXRlbXNQYXJhbXNNYXAgfSBmcm9tICcuL3R5cGVzL1JlcXVlc3RJdGVtc1BhcmFtc01hcCc7XG5pbXBvcnQgeyBSZXNvdXJjZUl0ZW0sIFJlc291cmNlIH0gZnJvbSAnLi90eXBlcy9SZXNvdXJjZUl0ZW0nO1xuaW1wb3J0IHtcbiAgTmd3Q29ubmVjdG9yT3B0aW9ucyxcbiAgR2V0UmVxdWVzdEl0ZW1zUmVzcG9uc2VNYXAsXG4gIFJlcXVlc3RPcHRpb25zLFxuICBQYXJhbXMsXG4gIExvYWRpbmdRdWV1ZSxcbiAgVXNlckluZm8sXG4gIENyZWRlbnRpYWxzLFxuICBQeXJhbWlkUm91dGUsXG4gIFJlcXVlc3RIZWFkZXJzLFxuICBQb3N0UmVxdWVzdEl0ZW1zUmVzcG9uc2VNYXAsXG4gIFBhdGNoUmVxdWVzdEl0ZW1zUmVzcG9uc2VNYXAsXG4gIFJlcXVlc3RJdGVtS2V5cyxcbiAgRGVsZXRlUmVxdWVzdEl0ZW1zUmVzcG9uc2VNYXAsXG4gIFB1dFJlcXVlc3RJdGVtc1Jlc3BvbnNlTWFwLFxuICBSZXF1ZXN0SXRlbXNQYXJhbXMsXG4gIFJlc291cmNlRGVmaW5pdGlvbixcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IGxvYWREYXRhIH0gZnJvbSAnLi91dGlscy9sb2FkRGF0YSc7XG5pbXBvcnQgeyB0ZW1wbGF0ZSB9IGZyb20gJy4vdXRpbHMvdGVtcGxhdGUnO1xuaW1wb3J0IHsgcmVzb3VyY2VUb1F1ZXJ5IH0gZnJvbSAnLi91dGlscy9yZXNvdXJjZVRvUXVlcnknO1xuaW1wb3J0IHsgcmVzb3VyY2VDb21wYXJlIH0gZnJvbSAnLi91dGlscy9yZXNvdXJjZUNvbXBhcmUnO1xuaW1wb3J0IHsgUmVzb3VyY2VOb3RGb3VuZEVycm9yIH0gZnJvbSAnLi9lcnJvcnMvUmVzb3VyY2VOb3RGb3VuZEVycm9yJztcbmltcG9ydCB7IE5nd0Vycm9yIH0gZnJvbSAnLi9lcnJvcnMvTmd3RXJyb3InO1xuaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tICcuL3V0aWxzL2lzT2JqZWN0JztcblxuY29uc3QgaXNCcm93c2VyID1cbiAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvdy5kb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCc7XG5cbmV4cG9ydCBjbGFzcyBOZ3dDb25uZWN0b3Ige1xuICBzdGF0aWMgZXJyb3JzID0ge1xuICAgIE5nd0Vycm9yLFxuICAgIFJlc291cmNlTm90Rm91bmRFcnJvcixcbiAgfTtcblxuICBlbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICB1c2VyPzogVXNlckluZm87XG4gIHByaXZhdGUgcm91dGVTdHIgPSAnL2FwaS9jb21wb25lbnQvcHlyYW1pZC9yb3V0ZSc7XG4gIHByaXZhdGUgcm91dGU/OiBQeXJhbWlkUm91dGU7XG4gIHByaXZhdGUgX2xvYWRpbmdRdWV1ZTogeyBbbmFtZTogc3RyaW5nXTogTG9hZGluZ1F1ZXVlIH0gPSB7fTtcbiAgcHJpdmF0ZSBfbG9hZGluZ1N0YXR1czogeyBbdXJsOiBzdHJpbmddOiBib29sZWFuIH0gPSB7fTtcbiAgcHJpdmF0ZSBfcXVlcmllc0NhY2hlOiB7IFt1cmw6IHN0cmluZ106IGFueSB9ID0ge307XG4gIHByaXZhdGUgX3Jlc291cmNlc0NhY2hlOiBSZWNvcmQ8bnVtYmVyLCBSZXNvdXJjZUl0ZW0+ID0ge307XG5cbiAgY29uc3RydWN0b3IocHVibGljIG9wdGlvbnM6IE5nd0Nvbm5lY3Rvck9wdGlvbnMpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLnJvdXRlKSB7XG4gICAgICB0aGlzLnJvdXRlU3RyID0gdGhpcy5vcHRpb25zLnJvdXRlO1xuICAgIH1cbiAgfVxuXG4gIHNldE5ndyh1cmw6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMubG9nb3V0KCk7XG4gICAgdGhpcy5vcHRpb25zLmJhc2VVcmwgPSB1cmw7XG4gIH1cblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgdXNlIHNldE5ndyBpbnN0ZWFkXG4gICAqL1xuICBzZXROZXh0R2lzV2ViKHVybDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zZXROZ3codXJsKTtcbiAgfVxuXG4gIGNvbm5lY3QoKTogQ2FuY2VsYWJsZVByb21pc2U8UHlyYW1pZFJvdXRlPiB7XG4gICAgcmV0dXJuIG5ldyBDYW5jZWxhYmxlUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBtYWtlUXVlcnkgPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLm1ha2VRdWVyeSh0aGlzLnJvdXRlU3RyLCB7fSwge30pXG4gICAgICAgICAgLnRoZW4oKHJvdXRlOiBQeXJhbWlkUm91dGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucm91dGUgPSByb3V0ZTtcbiAgICAgICAgICAgIHJlc29sdmUocm91dGUpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKHJlamVjdCk7XG4gICAgICB9O1xuICAgICAgaWYgKHRoaXMucm91dGUpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUodGhpcy5yb3V0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmF1dGgpIHtcbiAgICAgICAgICBjb25zdCB7IGxvZ2luLCBwYXNzd29yZCB9ID0gdGhpcy5vcHRpb25zLmF1dGg7XG4gICAgICAgICAgaWYgKGxvZ2luICYmIHBhc3N3b3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRVc2VySW5mbyh7IGxvZ2luLCBwYXNzd29yZCB9KS50aGVuKCgpID0+XG4gICAgICAgICAgICAgIG1ha2VRdWVyeSgpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBtYWtlUXVlcnkoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGxvZ2luKGNyZWRlbnRpYWxzOiBDcmVkZW50aWFscyk6IENhbmNlbGFibGVQcm9taXNlPFVzZXJJbmZvPiB7XG4gICAgdGhpcy5sb2dvdXQoKTtcbiAgICByZXR1cm4gdGhpcy5nZXRVc2VySW5mbyhjcmVkZW50aWFscyk7XG4gIH1cblxuICBsb2dvdXQoKTogdm9pZCB7XG4gICAgdGhpcy5fcmVqZWN0TG9hZGluZ1F1ZXVlKCk7XG4gICAgdGhpcy5fbG9hZGluZ1N0YXR1cyA9IHt9O1xuICAgIHRoaXMub3B0aW9ucy5hdXRoID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucm91dGUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy51c2VyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdsb2dvdXQnKTtcbiAgfVxuXG4gIGdldFVzZXJJbmZvKGNyZWRlbnRpYWxzPzogQ3JlZGVudGlhbHMpOiBDYW5jZWxhYmxlUHJvbWlzZTxVc2VySW5mbz4ge1xuICAgIGlmICh0aGlzLnVzZXIgJiYgdGhpcy51c2VyLmlkKSB7XG4gICAgICByZXR1cm4gQ2FuY2VsYWJsZVByb21pc2UucmVzb2x2ZSh0aGlzLnVzZXIpO1xuICAgIH1cbiAgICBpZiAoY3JlZGVudGlhbHMpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5hdXRoID0gY3JlZGVudGlhbHM7XG4gICAgfVxuICAgIGNvbnN0IG9wdGlvbnM6IFJlcXVlc3RPcHRpb25zID0ge1xuICAgICAgaGVhZGVyczogdGhpcy5nZXRBdXRob3JpemF0aW9uSGVhZGVycyhjcmVkZW50aWFscyksXG4gICAgICAvLyB3aXRoQ3JlZGVudGlhbHM6IHRydWVcbiAgICB9O1xuXG4gICAgLy8gRG8gbm90IHVzZSByZXF1ZXN0KCdhdXRoLmN1cnJlbnRfdXNlcicpIHRvIGF2b2lkIGNpcmN1bGFyLXJlZmVyZW5jZXNcbiAgICByZXR1cm4gdGhpcy5tYWtlUXVlcnkoJy9hcGkvY29tcG9uZW50L2F1dGgvY3VycmVudF91c2VyJywge30sIG9wdGlvbnMpXG4gICAgICAudGhlbigoZGF0YTogVXNlckluZm8pID0+IHtcbiAgICAgICAgdGhpcy51c2VyID0gZGF0YTtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2xvZ2luJywgZGF0YSk7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXIpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2xvZ2luOmVycm9yJywgZXIpO1xuICAgICAgICB0aHJvdyBlcjtcbiAgICAgIH0pO1xuICB9XG5cbiAgZ2V0QXV0aG9yaXphdGlvbkhlYWRlcnMoXG4gICAgY3JlZGVudGlhbHM/OiBDcmVkZW50aWFsc1xuICApOiBSZXF1ZXN0SGVhZGVycyB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgY2xpZW50ID0gdGhpcy5tYWtlQ2xpZW50SWQoY3JlZGVudGlhbHMpO1xuICAgIGlmIChjbGllbnQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246ICdCYXNpYyAnICsgY2xpZW50LFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBtYWtlQ2xpZW50SWQoY3JlZGVudGlhbHM/OiBDcmVkZW50aWFscyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgY3JlZGVudGlhbHMgPSBjcmVkZW50aWFscyB8fCB0aGlzLm9wdGlvbnMuYXV0aDtcbiAgICBpZiAoY3JlZGVudGlhbHMpIHtcbiAgICAgIGNvbnN0IHsgbG9naW4sIHBhc3N3b3JkIH0gPSBjcmVkZW50aWFscztcbiAgICAgIGNvbnN0IHN0ciA9IHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChgJHtsb2dpbn06JHtwYXNzd29yZH1gKSk7XG4gICAgICByZXR1cm4gaXNCcm93c2VyID8gd2luZG93LmJ0b2Eoc3RyKSA6IEJ1ZmZlci5mcm9tKHN0cikudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgIH1cbiAgfVxuXG4gIGFwaVJlcXVlc3Q8XG4gICAgSyBleHRlbmRzIGtleW9mIFJlcXVlc3RJdGVtc1BhcmFtc01hcCxcbiAgICBQIGV4dGVuZHMgUmVxdWVzdEl0ZW1LZXlzID0gUmVxdWVzdEl0ZW1LZXlzXG4gID4oXG4gICAgbmFtZTogSyxcbiAgICBwYXJhbXM6IFJlcXVlc3RJdGVtc1BhcmFtczxLPiA9IHt9LFxuICAgIG9wdGlvbnM/OiBSZXF1ZXN0T3B0aW9uc1xuICApOiBDYW5jZWxhYmxlUHJvbWlzZTxQW0tdPiB7XG4gICAgcmV0dXJuIG5ldyBDYW5jZWxhYmxlUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmNvbm5lY3QoKS50aGVuKChhcGlJdGVtcykgPT4ge1xuICAgICAgICAvLyBjb25zdCBhcGlJdGVtcyA9IHRoaXMucm91dGU7XG4gICAgICAgIGxldCBhcGlJdGVtID0gYXBpSXRlbXMgJiYgYXBpSXRlbXNbbmFtZV07XG4gICAgICAgIGlmIChhcGlJdGVtKSB7XG4gICAgICAgICAgYXBpSXRlbSA9IFsuLi5hcGlJdGVtXTtcbiAgICAgICAgICBsZXQgdXJsID0gYXBpSXRlbS5zaGlmdCgpO1xuICAgICAgICAgIGlmIChhcGlJdGVtLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgcmVwbGFjZVBhcmFtczoge1xuICAgICAgICAgICAgICBbbnVtOiBudW1iZXJdOiBzdHJpbmc7XG4gICAgICAgICAgICB9ID0ge307XG4gICAgICAgICAgICBmb3IgKGxldCBmcnkgPSAwOyBmcnkgPCBhcGlJdGVtLmxlbmd0aDsgZnJ5KyspIHtcbiAgICAgICAgICAgICAgY29uc3QgYXJnID0gYXBpSXRlbVtmcnldO1xuICAgICAgICAgICAgICByZXBsYWNlUGFyYW1zW2ZyeV0gPSAneycgKyBhcmcgKyAnfSc7XG4gICAgICAgICAgICAgIGlmIChwYXJhbXNbYXJnXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgJ2AnICsgYXJnICsgJ2AnICsgJyB1cmwgYXBpIGFyZ3VtZW50IGlzIG5vdCBzcGVjaWZpZWQnXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgICAgICB1cmwgPSB0ZW1wbGF0ZSh1cmwsIHJlcGxhY2VQYXJhbXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBUcmFuc2ZlciBwYXJ0IG9mIHRoZSBwYXJhbWV0ZXJzIGZyb20gYHBhcmFtc2AgdG8gdGhlIFVSTCBzdHJpbmdcbiAgICAgICAgICBpZiAocGFyYW1zKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJhbUFycmF5ID0gW107XG4gICAgICAgICAgICBjb25zdCBwYXJhbUxpc3QgPSBwYXJhbXMucGFyYW1MaXN0O1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1MaXN0KSkge1xuICAgICAgICAgICAgICBkZWxldGUgcGFyYW1zLnBhcmFtTGlzdDtcbiAgICAgICAgICAgICAgcGFyYW1MaXN0LmZvckVhY2goKHgpID0+IHtcbiAgICAgICAgICAgICAgICBwYXJhbUFycmF5LnB1c2goYCR7eFswXX09JHt4WzFdfWApO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgcCBpbiBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgaWYgKGFwaUl0ZW0uaW5kZXhPZihwKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBwYXJhbUFycmF5LnB1c2goYCR7cH09JHtwYXJhbXNbcF19YCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJhbUFycmF5Lmxlbmd0aCkge1xuICAgICAgICAgICAgICB1cmwgPSB1cmwgKyAnPycgKyBwYXJhbUFycmF5LmpvaW4oJyYnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFrZVF1ZXJ5KHVybCwgcGFyYW1zLCBvcHRpb25zKVxuICAgICAgICAgICAgICAudGhlbigocmVzcCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcCk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdyZXF1ZXN0IHVybCBpcyBub3Qgc2V0JykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHt9IGFzIFBbS10pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHBvc3Q8SyBleHRlbmRzIGtleW9mIFJlcXVlc3RJdGVtc1BhcmFtc01hcD4oXG4gICAgbmFtZTogSyxcbiAgICBvcHRpb25zPzogUmVxdWVzdE9wdGlvbnM8J1BPU1QnPixcbiAgICBwYXJhbXM/OiBSZXF1ZXN0SXRlbXNQYXJhbXM8Sz5cbiAgKTogQ2FuY2VsYWJsZVByb21pc2U8UG9zdFJlcXVlc3RJdGVtc1Jlc3BvbnNlTWFwW0tdPiB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgb3B0aW9ucy5tZXRob2QgPSAnUE9TVCc7XG4gICAgb3B0aW9ucy5ub2NhY2hlID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcy5hcGlSZXF1ZXN0PEssIFBvc3RSZXF1ZXN0SXRlbXNSZXNwb25zZU1hcD4oXG4gICAgICBuYW1lLFxuICAgICAgcGFyYW1zLFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gIH1cblxuICBnZXQ8SyBleHRlbmRzIGtleW9mIFJlcXVlc3RJdGVtc1BhcmFtc01hcD4oXG4gICAgbmFtZTogSyxcbiAgICBvcHRpb25zPzogUmVxdWVzdE9wdGlvbnMgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgIHBhcmFtcz86IFJlcXVlc3RJdGVtc1BhcmFtczxLPlxuICApOiBDYW5jZWxhYmxlUHJvbWlzZTxHZXRSZXF1ZXN0SXRlbXNSZXNwb25zZU1hcFtLXT4ge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIG9wdGlvbnMubWV0aG9kID0gJ0dFVCc7XG4gICAgb3B0aW9ucy5ub2NhY2hlID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcy5hcGlSZXF1ZXN0PEssIEdldFJlcXVlc3RJdGVtc1Jlc3BvbnNlTWFwPihcbiAgICAgIG5hbWUsXG4gICAgICBwYXJhbXMsXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgfVxuXG4gIHBhdGNoPEsgZXh0ZW5kcyBrZXlvZiBSZXF1ZXN0SXRlbXNQYXJhbXNNYXA+KFxuICAgIG5hbWU6IEssXG4gICAgb3B0aW9ucz86IFJlcXVlc3RPcHRpb25zLFxuICAgIHBhcmFtcz86IFJlcXVlc3RJdGVtc1BhcmFtczxLPlxuICApOiBDYW5jZWxhYmxlUHJvbWlzZTxQYXRjaFJlcXVlc3RJdGVtc1Jlc3BvbnNlTWFwW0tdPiB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgb3B0aW9ucy5tZXRob2QgPSAnUEFUQ0gnO1xuICAgIG9wdGlvbnMubm9jYWNoZSA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXMuYXBpUmVxdWVzdDxLLCBQYXRjaFJlcXVlc3RJdGVtc1Jlc3BvbnNlTWFwPihcbiAgICAgIG5hbWUsXG4gICAgICBwYXJhbXMsXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgfVxuXG4gIHB1dDxLIGV4dGVuZHMga2V5b2YgUmVxdWVzdEl0ZW1zUGFyYW1zTWFwPihcbiAgICBuYW1lOiBLLFxuICAgIG9wdGlvbnM/OiBSZXF1ZXN0T3B0aW9ucyxcbiAgICBwYXJhbXM/OiBSZXF1ZXN0SXRlbXNQYXJhbXM8Sz5cbiAgKTogQ2FuY2VsYWJsZVByb21pc2U8UHV0UmVxdWVzdEl0ZW1zUmVzcG9uc2VNYXBbS10+IHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBvcHRpb25zLm1ldGhvZCA9ICdQVVQnO1xuICAgIG9wdGlvbnMubm9jYWNoZSA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXMuYXBpUmVxdWVzdDxLLCBQdXRSZXF1ZXN0SXRlbXNSZXNwb25zZU1hcD4oXG4gICAgICBuYW1lLFxuICAgICAgcGFyYW1zLFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gIH1cblxuICBkZWxldGU8SyBleHRlbmRzIGtleW9mIFJlcXVlc3RJdGVtc1BhcmFtc01hcD4oXG4gICAgbmFtZTogSyxcbiAgICBvcHRpb25zPzogUmVxdWVzdE9wdGlvbnMgfCB1bmRlZmluZWQgfCBudWxsLFxuICAgIHBhcmFtcz86IFJlcXVlc3RJdGVtc1BhcmFtczxLPlxuICApOiBDYW5jZWxhYmxlUHJvbWlzZTxEZWxldGVSZXF1ZXN0SXRlbXNSZXNwb25zZU1hcFtLXT4ge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIG9wdGlvbnMubWV0aG9kID0gJ0RFTEVURSc7XG4gICAgb3B0aW9ucy5ub2NhY2hlID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcy5hcGlSZXF1ZXN0PEssIERlbGV0ZVJlcXVlc3RJdGVtc1Jlc3BvbnNlTWFwPihcbiAgICAgIG5hbWUsXG4gICAgICBwYXJhbXMsXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgfVxuXG4gIG1ha2VRdWVyeShcbiAgICB1cmw6IHN0cmluZyxcbiAgICBwYXJhbXM/OiBQYXJhbXMsXG4gICAgb3B0aW9uczogUmVxdWVzdE9wdGlvbnMgPSB7fVxuICApOiBDYW5jZWxhYmxlUHJvbWlzZTxhbnk+IHtcbiAgICB1cmwgPSAodGhpcy5vcHRpb25zLmJhc2VVcmwgPyB0aGlzLm9wdGlvbnMuYmFzZVVybCA6ICcnKSArIHVybDtcbiAgICBpZiAodXJsKSB7XG4gICAgICBpZiAocGFyYW1zKSB7XG4gICAgICAgIHVybCA9IHRlbXBsYXRlKHVybCwgcGFyYW1zKTtcbiAgICAgIH1cbiAgICAgIC8vIHJlbW92ZSBkb3VibGUgc2xhc2hcbiAgICAgIHVybCA9IHVybC5yZXBsYWNlKC8oW146XVxcLylcXC8rL2csICckMScpO1xuICAgICAgaWYgKG9wdGlvbnMuY2FjaGUgJiYgdGhpcy5fcXVlcmllc0NhY2hlW3VybF0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3F1ZXJpZXNDYWNoZVt1cmxdO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLl9sb2FkaW5nU3RhdHVzW3VybF0gfHwgb3B0aW9ucy5ub2NhY2hlKSB7XG4gICAgICAgIHRoaXMuX2xvYWRpbmdTdGF0dXNbdXJsXSA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2FkRGF0YSh1cmwsIG9wdGlvbnMpXG4gICAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2xvYWRpbmdTdGF0dXNbdXJsXSA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuY2FjaGUpIHtcbiAgICAgICAgICAgICAgdGhpcy5fcXVlcmllc0NhY2hlW3VybF0gPSBkYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fZXhlY3V0ZUxvYWRpbmdRdWV1ZSh1cmwsIGRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goKGVyKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9sb2FkaW5nU3RhdHVzW3VybF0gPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX2V4ZWN1dGVMb2FkaW5nUXVldWUodXJsLCBlciwgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZXJyb3InLCBlcik7XG4gICAgICAgICAgICB0aHJvdyBlcjtcbiAgICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2xvYWRpbmdTdGF0dXNbdXJsXSA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gbmV3IENhbmNlbGFibGVQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICB0aGlzLl9zZXRMb2FkaW5nUXVldWUodXJsLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBgdXJsYCBwYXJhbWV0ZXIgc2V0IGZvciBvcHRpb24gJyArIG5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVzb3VyY2UgTWV0aG9kc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgZ2V0UmVzb3VyY2UoXG4gICAgcmVzb3VyY2U6IFJlc291cmNlRGVmaW5pdGlvbiB8IERlZXBQYXJ0aWFsPFJlc291cmNlPlxuICApOiBDYW5jZWxhYmxlUHJvbWlzZTxSZXNvdXJjZUl0ZW0gfCB1bmRlZmluZWQ+IHtcbiAgICBpZiAodHlwZW9mIHJlc291cmNlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2VCeUtleW5hbWUocmVzb3VyY2UpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlc291cmNlID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2VCeUlkKHJlc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KHJlc291cmNlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2VCeShyZXNvdXJjZSk7XG4gICAgfVxuICAgIHJldHVybiBDYW5jZWxhYmxlUHJvbWlzZS5yZXNvbHZlKHVuZGVmaW5lZCk7XG4gIH1cblxuICBnZXRSZXNvdXJjZUlkKFxuICAgIHJlc291cmNlOiBSZXNvdXJjZURlZmluaXRpb25cbiAgKTogQ2FuY2VsYWJsZVByb21pc2U8bnVtYmVyIHwgdW5kZWZpbmVkPiB7XG4gICAgaWYgKHR5cGVvZiByZXNvdXJjZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBDYW5jZWxhYmxlUHJvbWlzZS5yZXNvbHZlKHJlc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiByZXNvdXJjZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlQnlLZXluYW1lKHJlc291cmNlKS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgIHJldHVybiByZXMucmVzb3VyY2UuaWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gQ2FuY2VsYWJsZVByb21pc2UucmVzb2x2ZSh1bmRlZmluZWQpO1xuICB9XG5cbiAgZ2V0UmVzb3VyY2VzQnkoXG4gICAgcmVzb3VyY2U6IERlZXBQYXJ0aWFsPFJlc291cmNlPlxuICApOiBDYW5jZWxhYmxlUHJvbWlzZTxSZXNvdXJjZUl0ZW1bXT4ge1xuICAgIGxldCBpdGVtczogUmVzb3VyY2VJdGVtW10gPSBbXTtcbiAgICBpZiAocmVzb3VyY2UuaWQpIHtcbiAgICAgIGNvbnN0IGV4aXN0SWQgPSB0aGlzLl9yZXNvdXJjZXNDYWNoZVtyZXNvdXJjZS5pZF07XG4gICAgICBpZiAoZXhpc3RJZCkge1xuICAgICAgICBpdGVtcy5wdXNoKGV4aXN0SWQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpdGVtcyA9IHRoaXMuX3Jlc291cmNlQ2FjaGVGaWx0ZXIocmVzb3VyY2UpO1xuICAgIH1cbiAgICBpZiAoIWl0ZW1zLmxlbmd0aCkge1xuICAgICAgY29uc3QgcXVlcnk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG4gICAgICBpZiAocmVzb3VyY2Uua2V5bmFtZSkge1xuICAgICAgICBxdWVyeS5rZXluYW1lID0gcmVzb3VyY2Uua2V5bmFtZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24ocXVlcnksIHJlc291cmNlVG9RdWVyeShyZXNvdXJjZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZ2V0KCdyZXNvdXJjZS5zZWFyY2gnLCBudWxsLCB7XG4gICAgICAgIHNlcmlhbGl6YXRpb246ICdmdWxsJyxcbiAgICAgICAgLi4ucXVlcnksXG4gICAgICB9KVxuICAgICAgICAudGhlbigocmVzb3VyY2VzKSA9PiB7XG4gICAgICAgICAgaWYgKHJlc291cmNlcykge1xuICAgICAgICAgICAgcmVzb3VyY2VzLmZvckVhY2goKHgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fcmVzb3VyY2VzQ2FjaGVbeC5yZXNvdXJjZS5pZF0gPSB4O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXNvdXJjZXM7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoKSA9PiBbXSk7XG4gICAgfVxuICAgIHJldHVybiBDYW5jZWxhYmxlUHJvbWlzZS5yZXNvbHZlKGl0ZW1zKTtcbiAgfVxuXG4gIGdldFJlc291cmNlQnkoXG4gICAgcmVzb3VyY2U6IERlZXBQYXJ0aWFsPFJlc291cmNlPlxuICApOiBDYW5jZWxhYmxlUHJvbWlzZTxSZXNvdXJjZUl0ZW0gfCB1bmRlZmluZWQ+IHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZXNCeShyZXNvdXJjZSkudGhlbigocmVzb3VyY2VzKSA9PiB7XG4gICAgICByZXR1cm4gcmVzb3VyY2VzWzBdO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0UmVzb3VyY2VCeUtleW5hbWUoXG4gICAga2V5bmFtZTogc3RyaW5nXG4gICk6IENhbmNlbGFibGVQcm9taXNlPFJlc291cmNlSXRlbSB8IHVuZGVmaW5lZD4ge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlQnkoeyBrZXluYW1lIH0pO1xuICB9XG5cbiAgZ2V0UmVzb3VyY2VCeUlkKGlkOiBudW1iZXIpOiBDYW5jZWxhYmxlUHJvbWlzZTxSZXNvdXJjZUl0ZW0gfCB1bmRlZmluZWQ+IHtcbiAgICBjb25zdCBpdGVtOiBSZXNvdXJjZUl0ZW0gPSB0aGlzLl9yZXNvdXJjZXNDYWNoZVtpZF07XG4gICAgaWYgKCFpdGVtKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXQoJ3Jlc291cmNlLml0ZW0nLCBudWxsLCB7IGlkIH0pXG4gICAgICAgIC50aGVuKChpdGVtKSA9PiB7XG4gICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuX3Jlc291cmNlc0NhY2hlW2lkXSA9IGl0ZW07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGVyKSA9PiB7XG4gICAgICAgICAgaWYgKCEoZXIgaW5zdGFuY2VvZiBSZXNvdXJjZU5vdEZvdW5kRXJyb3IpKSB7XG4gICAgICAgICAgICB0aHJvdyBlcjtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBDYW5jZWxhYmxlUHJvbWlzZS5yZXNvbHZlKGl0ZW0pO1xuICB9XG5cbiAgZ2V0UmVzb3VyY2VDaGlsZHJlbihcbiAgICBvcHRPclJlc291cmNlOlxuICAgICAgfCBzdHJpbmdcbiAgICAgIHwgbnVtYmVyXG4gICAgICB8IHtcbiAgICAgICAgICBrZXluYW1lPzogc3RyaW5nO1xuICAgICAgICAgIHJlc291cmNlSWQ/OiBudW1iZXI7XG4gICAgICAgICAgcmVzb3VyY2U/OiBzdHJpbmcgfCBudW1iZXI7XG4gICAgICAgIH1cbiAgKTogQ2FuY2VsYWJsZVByb21pc2U8UmVzb3VyY2VJdGVtW10+IHtcbiAgICBsZXQgb3B0OiB7XG4gICAgICBrZXluYW1lPzogc3RyaW5nO1xuICAgICAgcmVzb3VyY2VJZD86IG51bWJlcjtcbiAgICAgIHJlc291cmNlPzogc3RyaW5nIHwgbnVtYmVyO1xuICAgIH0gPSB7fTtcbiAgICBpZiAodHlwZW9mIG9wdE9yUmVzb3VyY2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICBvcHQua2V5bmFtZSA9IG9wdE9yUmVzb3VyY2U7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0T3JSZXNvdXJjZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIG9wdC5yZXNvdXJjZUlkID0gb3B0T3JSZXNvdXJjZTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0ID0gb3B0T3JSZXNvdXJjZTtcbiAgICB9XG4gICAgbGV0IHBhcmVudCA9IG9wdC5yZXNvdXJjZUlkO1xuICAgIGxldCBrZXluYW1lID0gb3B0LmtleW5hbWU7XG4gICAgaWYgKCFvcHQua2V5bmFtZSAmJiAhb3B0LnJlc291cmNlSWQgJiYgIW9wdC5yZXNvdXJjZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBrZXluYW1lIG9yIHJlc291cmNlSWQgaXMgc2V0Jyk7XG4gICAgfVxuICAgIGlmIChvcHQucmVzb3VyY2UpIHtcbiAgICAgIGlmICh0eXBlb2Ygb3B0LnJlc291cmNlID09PSAnc3RyaW5nJykge1xuICAgICAgICBrZXluYW1lID0gb3B0LnJlc291cmNlO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0LnJlc291cmNlID09PSAnbnVtYmVyJykge1xuICAgICAgICBwYXJlbnQgPSBvcHQucmVzb3VyY2U7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGNvbGxlY3Rpb24gPSAoKSA9PlxuICAgICAgdGhpcy5nZXQoJ3Jlc291cmNlLmNvbGxlY3Rpb24nLCBudWxsLCB7XG4gICAgICAgIHBhcmVudCxcbiAgICAgIH0pO1xuICAgIGlmIChrZXluYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZUJ5S2V5bmFtZShrZXluYW1lKS50aGVuKChpdGVtKSA9PiB7XG4gICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgcGFyZW50ID0gaXRlbS5yZXNvdXJjZS5pZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29sbGVjdGlvbigpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBjb2xsZWN0aW9uKCk7XG4gIH1cblxuICBkZWxldGVSZXNvdXJjZShyZXNvdXJjZTogUmVzb3VyY2VEZWZpbml0aW9uKTogQ2FuY2VsYWJsZVByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlSWQocmVzb3VyY2UpLnRoZW4oKGlkKSA9PiB7XG4gICAgICBpZiAoaWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWxldGUoJ3Jlc291cmNlLml0ZW0nLCBudWxsLCB7IGlkIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9yZXNvdXJjZXNDYWNoZVtpZF07XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3NldExvYWRpbmdRdWV1ZShcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgcmVzb2x2ZTogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnksXG4gICAgcmVqZWN0OiAoLi4uYXJnczogYW55W10pID0+IGFueVxuICApOiB2b2lkIHtcbiAgICB0aGlzLl9sb2FkaW5nUXVldWVbbmFtZV0gPSB0aGlzLl9sb2FkaW5nUXVldWVbbmFtZV0gfHwge1xuICAgICAgbmFtZSxcbiAgICAgIHdhaXRpbmc6IFtdLFxuICAgIH07XG4gICAgdGhpcy5fbG9hZGluZ1F1ZXVlW25hbWVdLndhaXRpbmcucHVzaCh7XG4gICAgICByZXNvbHZlLFxuICAgICAgcmVqZWN0LFxuICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLFxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9yZWplY3RMb2FkaW5nUXVldWUoKTogdm9pZCB7XG4gICAgZm9yIChjb25zdCBxIGluIHRoaXMuX2xvYWRpbmdRdWV1ZSkge1xuICAgICAgY29uc3QgcXVldWUgPSB0aGlzLl9sb2FkaW5nUXVldWVbcV07XG4gICAgICBxdWV1ZS53YWl0aW5nLmZvckVhY2goKHgpID0+IHtcbiAgICAgICAgeC5yZWplY3QoKTtcbiAgICAgIH0pO1xuICAgICAgZGVsZXRlIHRoaXMuX2xvYWRpbmdRdWV1ZVtxXTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2V4ZWN1dGVMb2FkaW5nUXVldWUoXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGRhdGE6IHVua25vd24sXG4gICAgaXNFcnJvcj86IGJvb2xlYW5cbiAgKTogdm9pZCB7XG4gICAgY29uc3QgcXVldWUgPSB0aGlzLl9sb2FkaW5nUXVldWVbbmFtZV07XG4gICAgaWYgKHF1ZXVlKSB7XG4gICAgICBmb3IgKGxldCBmcnkgPSAwOyBmcnkgPCBxdWV1ZS53YWl0aW5nLmxlbmd0aDsgZnJ5KyspIHtcbiAgICAgICAgY29uc3Qgd2FpdCA9IHF1ZXVlLndhaXRpbmdbZnJ5XTtcbiAgICAgICAgaWYgKGlzRXJyb3IpIHtcbiAgICAgICAgICBpZiAod2FpdC5yZWplY3QpIHtcbiAgICAgICAgICAgIHdhaXQucmVqZWN0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdhaXQucmVzb2x2ZShkYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcXVldWUud2FpdGluZyA9IFtdO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfbG9hZERhdGEoXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgb3B0aW9uczogUmVxdWVzdE9wdGlvbnNcbiAgKTogQ2FuY2VsYWJsZVByb21pc2U8YW55PiB7XG4gICAgb3B0aW9ucy5yZXNwb25zZVR5cGUgPSBvcHRpb25zLnJlc3BvbnNlVHlwZSB8fCAnanNvbic7XG4gICAgcmV0dXJuIG5ldyBDYW5jZWxhYmxlUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0LCBvbkNhbmNlbCkgPT4ge1xuICAgICAgaWYgKHRoaXMudXNlcikge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgLy8gb3B0aW9ucy53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgICAgICBvcHRpb25zLmhlYWRlcnMgPSB7XG4gICAgICAgICAgLi4udGhpcy5nZXRBdXRob3JpemF0aW9uSGVhZGVycygpLFxuICAgICAgICAgIC4uLm9wdGlvbnMuaGVhZGVycyxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGxvYWREYXRhKHVybCwgcmVzb2x2ZSwgb3B0aW9ucywgcmVqZWN0LCBvbkNhbmNlbCk7XG4gICAgfSkuY2F0Y2goKGh0dHBFcnJvcikgPT4ge1xuICAgICAgY29uc3QgZXIgPSB0aGlzLl9oYW5kbGVIdHRwRXJyb3IoaHR0cEVycm9yKTtcbiAgICAgIGlmIChlcikge1xuICAgICAgICB0aHJvdyBlcjtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2hhbmRsZUh0dHBFcnJvcihlcjogRXJyb3IpIHtcbiAgICBpZiAoZXIpIHtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIE5nd0Vycm9yKSB7XG4gICAgICAgIGlmIChlci5leGNlcHRpb24gPT09ICduZXh0Z2lzd2ViLnJlc291cmNlLmV4Y2VwdGlvbi5SZXNvdXJjZU5vdEZvdW5kJykge1xuICAgICAgICAgIHRocm93IG5ldyBSZXNvdXJjZU5vdEZvdW5kRXJyb3IoZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlcjtcbiAgfVxuXG4gIHByaXZhdGUgX3Jlc291cmNlQ2FjaGVGaWx0ZXIoXG4gICAgcmVzb3VyY2U6IERlZXBQYXJ0aWFsPFJlc291cmNlPlxuICApOiBSZXNvdXJjZUl0ZW1bXSB7XG4gICAgY29uc3QgaXRlbXM6IFJlc291cmNlSXRlbVtdID0gT2JqZWN0LnZhbHVlcyh0aGlzLl9yZXNvdXJjZXNDYWNoZSkuZmlsdGVyKFxuICAgICAgKHgpID0+IHtcbiAgICAgICAgLy8gaWRlbnRpY2FsIGJ5IHVuaXEgcHJvcHNcbiAgICAgICAgaWYgKHJlc291cmNlLmtleW5hbWUgJiYgeC5yZXNvdXJjZS5rZXluYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc291cmNlLmtleW5hbWUgPT09IHgucmVzb3VyY2Uua2V5bmFtZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGVmaW5lZChyZXNvdXJjZS5pZCkgJiYgZGVmaW5lZCh4LnJlc291cmNlLmlkKSkge1xuICAgICAgICAgIHJldHVybiByZXNvdXJjZS5pZCA9PT0geC5yZXNvdXJjZS5pZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzb3VyY2VDb21wYXJlKHJlc291cmNlLCB4LnJlc291cmNlKTtcbiAgICAgIH1cbiAgICApO1xuICAgIHJldHVybiBpdGVtcztcbiAgfVxufVxuIiwiLyoqXG4gKiBUaHJvd24gd2hlbi4uLlxuICovXG5leHBvcnQgY2xhc3MgTmV0d29ya0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBuYW1lID0gJ05ldHdvcmtFcnJvcic7XG5cbiAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLCBOZXR3b3JrRXJyb3IucHJvdG90eXBlKTtcbiAgICB0aGlzLm1lc3NhZ2UgPSBgVW5hYmxlIHRvIHJlcXVlc3QgJHt1cmx9LlxuICAgIFBvc3NpYmx5IGludmFsaWQgTkdXIFVSTCBlbnRlcmVkIG9yIENPUlMgbm90IGNvbmZpZ3VyZWQgdG8gZ2V0IHJlcXVlc3QgZnJvbSAke2xvY2F0aW9uLm9yaWdpbn1gOyAvLyAvY29udHJvbC1wYW5lbC9jb3JzXG4gIH1cbn1cbiIsImltcG9ydCB7IE5nd0V4Y2VwdGlvbnMgfSBmcm9tICcuLi9pbnRlcmZhY2VzJztcblxuLyoqXG4gKiBUaHJvd24gd2hlbi4uLlxuICovXG5leHBvcnQgY2xhc3MgTmd3RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIG5hbWUgPSAnTmd3RXJyb3InO1xuXG4gIHRpdGxlITogc3RyaW5nO1xuICBtZXNzYWdlITogc3RyaW5nO1xuICBkZXRhaWwhOiBzdHJpbmc7XG4gIGV4Y2VwdGlvbiE6IE5nd0V4Y2VwdGlvbnM7XG4gIHN0YXR1c19jb2RlITogbnVtYmVyIHwgNDA0IHwgNTAwO1xuICBkYXRhPzogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgZ3VydV9tZWRpdGF0aW9uITogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGVyOiBOZ3dFcnJvcikge1xuICAgIHN1cGVyKCk7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBlcik7XG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsIE5nd0Vycm9yLnByb3RvdHlwZSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IE5nd0Vycm9yIH0gZnJvbSAnLi9OZ3dFcnJvcic7XG5pbXBvcnQgeyBOZ3dFeGNlcHRpb25zIH0gZnJvbSAnLi4vaW50ZXJmYWNlcyc7XG5cbi8qKlxuICogVGhyb3duIHdoZW4gLi4uXG4gKi9cbmV4cG9ydCBjbGFzcyBSZXNvdXJjZU5vdEZvdW5kRXJyb3IgZXh0ZW5kcyBOZ3dFcnJvciB7XG4gIG5hbWUgPSAnUmVzb3VyY2VOb3RGb3VuZEVycm9yJztcbiAgZXhjZXB0aW9uOiBOZ3dFeGNlcHRpb25zID0gJ25leHRnaXN3ZWIucmVzb3VyY2UuZXhjZXB0aW9uLlJlc291cmNlTm90Rm91bmQnO1xuXG4gIGNvbnN0cnVjdG9yKG9iajogUmVzb3VyY2VOb3RGb3VuZEVycm9yKSB7XG4gICAgc3VwZXIob2JqKTtcbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YodGhpcywgUmVzb3VyY2VOb3RGb3VuZEVycm9yLnByb3RvdHlwZSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IE5nd0Nvbm5lY3RvciB9IGZyb20gJy4vTmd3Q29ubmVjdG9yJztcblxuZXhwb3J0ICogZnJvbSAnLi9pbnRlcmZhY2VzJztcbmV4cG9ydCAqIGZyb20gJy4vdHlwZXMvUmVzb3VyY2VJdGVtJztcbmV4cG9ydCAqIGZyb20gJy4vdHlwZXMvRmVhdHVyZUxheWVyJztcbmV4cG9ydCAqIGZyb20gJy4vdHlwZXMvUmVxdWVzdEl0ZW1zUGFyYW1zTWFwJztcbmV4cG9ydCAqIGZyb20gJy4vdHlwZXMvUmVzb3VyY2VTdG9yZSc7XG5cbi8vIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4vLyBUT0RPOiBzYWZlIHJlbW92ZSBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG5pbXBvcnQgQ2FuY2VsYWJsZVByb21pc2UgZnJvbSAnQG5leHRnaXMvY2FuY2VsYWJsZS1wcm9taXNlJztcbmV4cG9ydCB7IENhbmNlbGFibGVQcm9taXNlIH07XG5cbmV4cG9ydCB7IE5nd0Nvbm5lY3RvciB9O1xuZXhwb3J0IGRlZmF1bHQgTmd3Q29ubmVjdG9yO1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KHZhbDogdW5rbm93bik6IHZhbCBpcyBSZWNvcmQ8c3RyaW5nIHwgbnVtYmVyLCBhbnk+IHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBPYmplY3RdJztcbn1cbiIsIi8vIHJlYWR5U3RhdGVcbi8vIEhvbGRzIHRoZSBzdGF0dXMgb2YgdGhlIFhNTEh0dHBSZXF1ZXN0LlxuLy8gMDogcmVxdWVzdCBub3QgaW5pdGlhbGl6ZWRcbi8vIDE6IHNlcnZlciBjb25uZWN0aW9uIGVzdGFibGlzaGVkXG4vLyAyOiByZXF1ZXN0IHJlY2VpdmVkXG4vLyAzOiBwcm9jZXNzaW5nIHJlcXVlc3Rcbi8vIDQ6IHJlcXVlc3QgZmluaXNoZWQgYW5kIHJlc3BvbnNlIGlzIHJlYWR5XG5cbi8vIHN0YXR1c1xuLy8gMjAwOiBcIk9LXCJcbi8vIDIwMSBcIkNyZWF0ZWRcIlx0VGhlIHJlcXVlc3QgaGFzIGJlZW4gZnVsZmlsbGVkLCBhbmQgYSBuZXcgcmVzb3VyY2UgaXMgY3JlYXRlZFxuLy8gNDAzOiBcIkZvcmJpZGRlblwiXG4vLyA0MDQ6IFwiUGFnZSBub3QgZm91bmRcIlxuLy8gNTAwOiBcIkludGVybmFsIFNlcnZlciBFcnJvclwiXG4vLyBGb3IgYSBjb21wbGV0ZSBsaXN0IGdvIHRvIHRoZSBIdHRwIE1lc3NhZ2VzIFJlZmVyZW5jZVxuXG5pbXBvcnQgeyBSZXF1ZXN0T3B0aW9ucywgUmVxdWVzdE1ldGhvZHMgfSBmcm9tICcuLi9pbnRlcmZhY2VzJztcblxudHlwZSBMb2FkRGF0YSA9IChcbiAgdXJsOiBzdHJpbmcsXG4gIGNhbGxiYWNrOiAoLi4uYXJnczogYW55W10pID0+IGFueSxcbiAgb3B0aW9uczogUmVxdWVzdE9wdGlvbnM8UmVxdWVzdE1ldGhvZHM+IHwgdW5kZWZpbmVkLFxuICBlcnJvcjogKHJlYXNvbj86IGFueSkgPT4gdm9pZCxcbiAgb25DYW5jZWw6IChjYW5jZWxIYW5kbGVyOiAoKSA9PiB2b2lkKSA9PiB2b2lkXG4pID0+IHZvaWQ7XG5cbmxldCBsb2FkRGF0YTogTG9hZERhdGE7XG5cbmNvbnN0IGlzQnJvd3NlciA9IG5ldyBGdW5jdGlvbihcbiAgJ3RyeSB7cmV0dXJuIHRoaXM9PT13aW5kb3c7fWNhdGNoKGUpeyByZXR1cm4gZmFsc2U7fSdcbikoKTtcbmlmIChpc0Jyb3dzZXIpIHtcbiAgbG9hZERhdGEgPSByZXF1aXJlKCcuL2xvYWREYXRhQnJvd3NlcicpLmRlZmF1bHQ7XG59IGVsc2Uge1xuICBsb2FkRGF0YSA9IHJlcXVpcmUoJy4vbG9hZERhdGFOb2RlJykuZGVmYXVsdDtcbn1cbmV4cG9ydCB7IGxvYWREYXRhIH07XG4iLCJpbXBvcnQgeyBSZXF1ZXN0T3B0aW9ucyB9IGZyb20gJy4uL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgTmd3RXJyb3IgfSBmcm9tICcuLi9lcnJvcnMvTmd3RXJyb3InO1xuaW1wb3J0IHsgTmV0d29ya0Vycm9yIH0gZnJvbSAnLi4vZXJyb3JzL05ldHdvcmtFcnJvcic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWREYXRhQnJvd3NlcihcbiAgdXJsOiBzdHJpbmcsXG4gIGNhbGxiYWNrOiAoLi4uYXJnczogYW55W10pID0+IGFueSxcbiAgb3B0aW9uczogUmVxdWVzdE9wdGlvbnMgPSB7fSxcbiAgZXJyb3I6IChyZWFzb24/OiBhbnkpID0+IHZvaWQsXG4gIG9uQ2FuY2VsOiAoY2FuY2VsSGFuZGxlcjogKCkgPT4gdm9pZCkgPT4gdm9pZFxuKTogdm9pZCB7XG4gIG9wdGlvbnMubWV0aG9kID0gb3B0aW9ucy5tZXRob2QgfHwgJ0dFVCc7XG5cbiAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIHhoci5vcGVuKG9wdGlvbnMubWV0aG9kIHx8ICdHRVQnLCB1cmwsIHRydWUpOyAvLyB0cnVlIGZvciBhc3luY2hyb25vdXNcblxuICBpZiAob3B0aW9ucy5yZXNwb25zZVR5cGUgPT09ICdibG9iJykge1xuICAgIHhoci5yZXNwb25zZVR5cGUgPSBvcHRpb25zLnJlc3BvbnNlVHlwZTtcbiAgfVxuICBjb25zdCBnZXRSZXNwb25zZVRleHQgPSAoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgIH0gY2F0Y2ggKGVyKSB7XG4gICAgICByZXR1cm4geGhyLnJlc3BvbnNlVGV4dDtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHByb2Nlc3NpbmdSZXNwb25zZSA9IChmb3JFcnJvciA9IGZhbHNlKSA9PiB7XG4gICAgY29uc3QgY2IgPSBmb3JFcnJvciA/IGVycm9yIDogY2FsbGJhY2s7XG4gICAgaWYgKG9wdGlvbnMucmVzcG9uc2VUeXBlID09PSAnYmxvYicpIHtcbiAgICAgIGNiKHhoci5yZXNwb25zZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh4aHIucmVzcG9uc2VUZXh0KSB7XG4gICAgICAgIGNiKGdldFJlc3BvbnNlVGV4dCgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVycm9yKHsgbWVzc2FnZTogJycgfSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICB4aHIub25sb2FkID0gKCkgPT4ge1xuICAgIGlmIChbNDA0LCA1MDBdLmluZGV4T2YoeGhyLnN0YXR1cykgIT09IC0xKSB7XG4gICAgICBlcnJvcihuZXcgTmd3RXJyb3IoZ2V0UmVzcG9uc2VUZXh0KCkpKTtcbiAgICB9XG4gICAgcHJvY2Vzc2luZ1Jlc3BvbnNlKCk7XG4gIH07XG5cbiAgLy8geGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgLy8gICBpZiAoXG4gIC8vICAgICAoeGhyLnJlYWR5U3RhdGUgPT09IDQgJiYgeGhyLnN0YXR1cyA9PT0gMjAwKSB8fFxuICAvLyAgICAgKHhoci5yZWFkeVN0YXRlID09PSAzICYmIHhoci5zdGF0dXMgPT09IDIwMSlcbiAgLy8gICApIHtcbiAgLy8gICAgIHByb2Nlc3NpbmdSZXNwb25zZSgpO1xuICAvLyAgIH0gZWxzZSBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDMgJiYgeGhyLnN0YXR1cyA9PT0gNDAwKSB7XG4gIC8vICAgICBwcm9jZXNzaW5nUmVzcG9uc2UoKTtcbiAgLy8gICB9IGVsc2UgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0ICYmIHhoci5zdGF0dXMgPT09IDUwMCkge1xuICAvLyAgICAgcHJvY2Vzc2luZ1Jlc3BvbnNlKCk7XG4gIC8vICAgfSBlbHNlIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCAmJiB4aHIuc3RhdHVzID09PSA0MDEpIHtcbiAgLy8gICAgIGVycm9yKHhoci5zdGF0dXNUZXh0KTtcbiAgLy8gICB9IGVsc2UgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gIC8vICAgICBlcnJvcigncmVxdWVzdCBlcnJvcicpO1xuICAvLyAgIH1cbiAgLy8gfTtcblxuICB4aHIub25lcnJvciA9IChlcikgPT4ge1xuICAgIGlmICh4aHIuc3RhdHVzID09PSAwKSB7XG4gICAgICBlcnJvcihuZXcgTmV0d29ya0Vycm9yKHVybCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlcnJvcihlcik7XG4gICAgfVxuICB9O1xuXG4gIHhoci51cGxvYWQub25wcm9ncmVzcyA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKGUubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgY29uc3QgcGVyY2VudENvbXBsZXRlID0gKGUubG9hZGVkIC8gZS50b3RhbCkgKiAxMDA7XG4gICAgICBpZiAob3B0aW9ucy5vblByb2dyZXNzKSB7XG4gICAgICAgIG9wdGlvbnMub25Qcm9ncmVzcyhwZXJjZW50Q29tcGxldGUsIGUpO1xuICAgICAgfVxuICAgICAgLy8gY29uc29sZS5sb2cocGVyY2VudENvbXBsZXRlICsgJyUgdXBsb2FkZWQnKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgaGVhZGVycyA9IG9wdGlvbnMuaGVhZGVycztcbiAgaWYgKGhlYWRlcnMpIHtcbiAgICBmb3IgKGNvbnN0IGggaW4gaGVhZGVycykge1xuICAgICAgY29uc3QgaGVhZGVyID0gaGVhZGVyc1toXTtcbiAgICAgIGlmICh0eXBlb2YgaGVhZGVyID09PSAnc3RyaW5nJykge1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoLCBoZWFkZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAob3B0aW9ucy53aXRoQ3JlZGVudGlhbHMgIT09IHVuZGVmaW5lZCkge1xuICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBvcHRpb25zLndpdGhDcmVkZW50aWFscztcbiAgfVxuXG4gIGxldCBkYXRhOiBGb3JtRGF0YSB8IGFueTtcbiAgaWYgKG9wdGlvbnMuZmlsZSkge1xuICAgIGRhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICBkYXRhLmFwcGVuZCgnZmlsZScsIG9wdGlvbnMuZmlsZSk7XG4gICAgaWYgKG9wdGlvbnMuZGF0YSkge1xuICAgICAgZm9yIChjb25zdCBkIGluIGRhdGEpIHtcbiAgICAgICAgZGF0YS5hcHBlbmQoZCwgZGF0YVtkXSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGRhdGEgPSBvcHRpb25zLmRhdGFcbiAgICAgID8gdHlwZW9mIG9wdGlvbnMuZGF0YSA9PT0gJ3N0cmluZydcbiAgICAgICAgPyBvcHRpb25zLmRhdGFcbiAgICAgICAgOiBKU09OLnN0cmluZ2lmeShvcHRpb25zLmRhdGEpXG4gICAgICA6IG51bGw7XG4gIH1cbiAgaWYgKG9uQ2FuY2VsKSB7XG4gICAgb25DYW5jZWwoKCkgPT4ge1xuICAgICAgeGhyLmFib3J0KCk7XG4gICAgfSk7XG4gIH1cbiAgeGhyLnNlbmQoZGF0YSk7XG59XG4iLCJpbXBvcnQge1xuICBSZXF1ZXN0T3B0aW9ucyBhcyBOZ3dSZXF1ZXN0T3B0aW9ucyxcbiAgUmVxdWVzdE1ldGhvZHMsXG59IGZyb20gJy4uL2ludGVyZmFjZXMnO1xuXG4vLyB0aGUgJ2V2YWwnIGlzIHVzZWQgdG8gZXhjbHVkZSBwYWNrYWdlcyBmcm9tIHRoZSB3ZWJwYWNrIGJ1bmRsZSBmb3IgYnJvd3NlclxuY29uc3QgdXJsID0gZXZhbCgncmVxdWlyZShcInVybFwiKScpO1xuY29uc3QgaHR0cCA9IGV2YWwoJ3JlcXVpcmUoXCJodHRwXCIpJyk7XG5jb25zdCBodHRwcyA9IGV2YWwoJ3JlcXVpcmUoXCJodHRwc1wiKScpO1xuXG5jb25zdCBhZGFwdGVyRm9yID0gKGlucHV0VXJsOiBzdHJpbmcpID0+IHtcbiAgY29uc3QgYWRhcHRlcnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgJ2h0dHA6JzogaHR0cCxcbiAgICAnaHR0cHM6JzogaHR0cHMsXG4gIH07XG4gIGNvbnN0IHByb3RvY29sID0gdXJsLnBhcnNlKGlucHV0VXJsKS5wcm90b2NvbCB8fCAnaHR0cHM6JztcbiAgcmV0dXJuIGFkYXB0ZXJzW3Byb3RvY29sXTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWREYXRhTm9kZShcbiAgdXJsOiBzdHJpbmcsXG4gIGNhbGxiYWNrOiAoLi4uYXJnczogYW55W10pID0+IGFueSxcbiAgb3B0aW9uczogTmd3UmVxdWVzdE9wdGlvbnM8UmVxdWVzdE1ldGhvZHM+ID0ge30sXG4gIGVycm9yOiAocmVhc29uPzogYW55KSA9PiB2b2lkLFxuICBvbkNhbmNlbDogKGNhbmNlbEhhbmRsZXI6ICgpID0+IHZvaWQpID0+IHZvaWRcbik6IFByb21pc2U8dW5rbm93bj4ge1xuICBjb25zdCByZXF1ZXN0ID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGFkYXB0ZXIgPSBhZGFwdGVyRm9yKHVybCk7XG4gICAgaWYgKGFkYXB0ZXIpIHtcbiAgICAgIGNvbnN0IHJlcXVlc3RPcHQgPSB7XG4gICAgICAgIGhlYWRlcnM6IG9wdGlvbnMuaGVhZGVycyB8fCB7fSxcbiAgICAgICAgbWV0aG9kOiBvcHRpb25zLm1ldGhvZCxcbiAgICAgIH07XG4gICAgICBjb25zdCBib2R5ID1cbiAgICAgICAgdHlwZW9mIG9wdGlvbnMuZGF0YSA9PT0gJ3N0cmluZydcbiAgICAgICAgICA/IG9wdGlvbnMuZGF0YVxuICAgICAgICAgIDogSlNPTi5zdHJpbmdpZnkob3B0aW9ucy5kYXRhKTtcbiAgICAgIGNvbnN0IHJlcSA9IGFkYXB0ZXIucmVxdWVzdCh1cmwsIHJlcXVlc3RPcHQsIChyZXNwOiBhbnkpID0+IHtcbiAgICAgICAgbGV0IGRhdGEgPSAnJztcbiAgICAgICAgcmVzcC5vbignZGF0YScsIChjaHVuazogYW55KSA9PiB7XG4gICAgICAgICAgZGF0YSArPSBjaHVuaztcbiAgICAgICAgfSk7XG4gICAgICAgIHJlc3Aub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgbGV0IGpzb246IFJlY29yZDxzdHJpbmcsIGFueT4gfCB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBqc29uID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICAgICAgaWYgKGpzb24gJiYganNvbi5zdGF0dXNfY29kZSAmJiBqc29uLnN0YXR1c19jb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGpzb24ubWVzc2FnZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVyKSB7XG4gICAgICAgICAgICAgIHJlamVjdChlcik7XG4gICAgICAgICAgICAgIC8vIHRocm93IG5ldyBFcnJvcihlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoanNvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHJlc29sdmUoanNvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlamVjdCgnbm8gZGF0YScpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgcmVxLm9uKCdlcnJvcicsIChlcnI6IGFueSkgPT4ge1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKGJvZHkpIHtcbiAgICAgICAgcmVxLndyaXRlKGJvZHkpO1xuICAgICAgfVxuICAgICAgb25DYW5jZWwoKCkgPT4ge1xuICAgICAgICByZXEuYWJvcnQoKTtcbiAgICAgIH0pO1xuICAgICAgcmVxLmVuZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEdpdmVuIFVSTCAnJHt1cmx9JyBpcyBub3QgY29ycmVjdGApO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXF1ZXN0XG4gICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayhkYXRhKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0pXG4gICAgLmNhdGNoKChlcikgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGVycm9yKGVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcik7XG4gICAgICB9XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgeyBEZWVwUGFydGlhbCB9IGZyb20gJ0BuZXh0Z2lzL3V0aWxzJztcbmltcG9ydCB7IFJlc291cmNlIH0gZnJvbSAnLi4vdHlwZXMvUmVzb3VyY2VJdGVtJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlc291cmNlQ29tcGFyZShcbiAgcmVzMTogRGVlcFBhcnRpYWw8UmVzb3VyY2U+LFxuICByZXMyOiBEZWVwUGFydGlhbDxSZXNvdXJjZT5cbik6IGJvb2xlYW4ge1xuICByZXR1cm4gb2JqZWN0Q29tcGFyZShyZXMxLCByZXMyKTtcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QodmFsOiB1bmtub3duKTogdmFsIGlzIFJlY29yZDxzdHJpbmcgfCBudW1iZXIsIGFueT4ge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xufVxuZnVuY3Rpb24gb2JqZWN0Q29tcGFyZTxUID0gUmVjb3JkPHN0cmluZyB8IG51bWJlciwgYW55Pj4oXG4gIG9iajE6IFQsXG4gIG9iajI6IFRcbik6IGJvb2xlYW4ge1xuICByZXR1cm4gT2JqZWN0LmVudHJpZXMob2JqMSkuZXZlcnkoKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgIGNvbnN0IHZhbHVlMiA9IG9iajJba2V5IGFzIGtleW9mIFRdO1xuICAgIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgIGlmIChpc09iamVjdCh2YWx1ZTIpKSB7XG4gICAgICAgIHJldHVybiBvYmplY3RDb21wYXJlKHZhbHVlLCB2YWx1ZTIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAodmFsdWUyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUyO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBEZWVwUGFydGlhbCwgZGVmaW5lZCB9IGZyb20gJ0BuZXh0Z2lzL3V0aWxzJztcbmltcG9ydCB7IFJlc291cmNlIH0gZnJvbSAnLi4vdHlwZXMvUmVzb3VyY2VJdGVtJztcbmltcG9ydCB7IGlzT2JqZWN0IH0gZnJvbSAnLi9pc09iamVjdCc7XG5cbi8qKlxuICogeyBrZXluYW1lLCBwYXJlbnQ6IHsgaWQgfX0gPiB7IGtleW5hbWUsIHBhcmVudF9faWQgfVxuICogQHBhcmFtIHJlc291cmNlIGFueSBwcm9wZXJ0eSBmcm9tIE5HVyByZXNvdXJjZSBpdGVtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNvdXJjZVRvUXVlcnkoXG4gIHJlc291cmNlOiBEZWVwUGFydGlhbDxSZXNvdXJjZT4sXG4gIHByZWZpeCA9ICcnXG4pOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XG4gIHByZWZpeCA9IHByZWZpeCA/IHByZWZpeCArICdfXycgOiAnJztcbiAgY29uc3QgcXVlcnk6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgT2JqZWN0LmVudHJpZXMocmVzb3VyY2UpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gcmVzb3VyY2VUb1F1ZXJ5KHZhbHVlIGFzIERlZXBQYXJ0aWFsPFJlc291cmNlPiwga2V5KTtcbiAgICAgIE9iamVjdC5hc3NpZ24ocXVlcnksIGNoaWxkcmVuKTtcbiAgICB9IGVsc2UgaWYgKGRlZmluZWQodmFsdWUpKSB7XG4gICAgICBxdWVyeVtwcmVmaXggKyBrZXldID0gdmFsdWU7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHF1ZXJ5O1xufVxuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0xlYWZsZXQvTGVhZmxldC9ibG9iL2I1MDdlMjFjNTEwYjUzY2Q3MDRmYjhkM2Y4OWJiNDZlYTkyNWM4ZWIvc3JjL2NvcmUvVXRpbC5qcyNMMTY1XG5jb25zdCB0ZW1wbGF0ZVJlID0gL1xceyAqKFtcXHdfLV0rKSAqXFx9L2c7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZW1wbGF0ZShzdHI6IHN0cmluZywgZGF0YTogeyBbcGFyYW06IHN0cmluZ106IGFueSB9KTogc3RyaW5nIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKHRlbXBsYXRlUmUsIChzLCBrZXkpID0+IHtcbiAgICBsZXQgdmFsdWUgPSBkYXRhW2tleV07XG5cbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyB2YWx1ZSBwcm92aWRlZCBmb3IgbGV0aWFibGUgJyArIHMpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlKGRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgRmVhdHVyZSB9IGZyb20gJ2dlb2pzb24nO1xuaW1wb3J0IHtcbiAgVmVjdG9yQWRhcHRlckxheWVyUGFpbnQsXG4gIEdldFBhaW50Q2FsbGJhY2ssXG4gIEV4cHJlc3Npb24sXG4gIEV4cHJlc3Npb25OYW1lLFxufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgaXNFeHByZXNzaW9uIH0gZnJvbSAnLi90eXBlSGVscGVycyc7XG5cbnR5cGUgRXhwcmVzc2lvbkZ1biA9IChmZWF0dXJlOiBGZWF0dXJlLCBhcmdzOiBhbnlbXSkgPT4gU2ltcGxlVHlwZTtcblxuZnVuY3Rpb24gZ2V0KGZlYXR1cmU6IEZlYXR1cmUsIGFyZ3M6IGFueVtdKSB7XG4gIGNvbnN0IGZpZWxkID0gYXJnc1swXTtcbiAgcmV0dXJuIGZlYXR1cmUucHJvcGVydGllcyAmJiBmZWF0dXJlLnByb3BlcnRpZXNbZmllbGRdO1xufVxuXG5mdW5jdGlvbiBtYXRjaChmZWF0dXJlOiBGZWF0dXJlLCBhcmdzOiBhbnlbXSkge1xuICBjb25zdCBbbG9va3VwLCAuLi5jYXNlc10gPSBhcmdzO1xuICBsZXQgcHJvcGVydHkgPSBsb29rdXA7XG4gIGlmIChBcnJheS5pc0FycmF5KGxvb2t1cCkpIHtcbiAgICBwcm9wZXJ0eSA9IGZlYXR1cmVFeHByZXNzaW9uKGZlYXR1cmUsIGxvb2t1cCBhcyBFeHByZXNzaW9uKTtcbiAgfVxuICAvLyByZW1vdmUgbGFzdCBvZGQgaXRlbSBmcm9tIGNhc2VzIGFycmF5XG4gIGNvbnN0IGRlZlZhbHVlID0gY2FzZXMuc3BsaWNlKC0xLCBjYXNlcy5sZW5ndGggJSAyKVswXTtcbiAgZm9yIChsZXQgZnJ5ID0gMDsgZnJ5IDwgY2FzZXMubGVuZ3RoIC0gMTsgZnJ5ICs9IDIpIHtcbiAgICBjb25zdCBrZXkgPSBjYXNlc1tmcnldO1xuICAgIGlmIChrZXkgPT09IHByb3BlcnR5KSB7XG4gICAgICByZXR1cm4gY2FzZXNbZnJ5ICsgMV07XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWZWYWx1ZTtcbn1cblxuY29uc3QgZXhwcmVzc2lvbnM6IHsgW2tleSBpbiBFeHByZXNzaW9uTmFtZV06IEV4cHJlc3Npb25GdW4gfSA9IHtcbiAgZ2V0LFxuICBtYXRjaCxcbn07XG5cbnR5cGUgU2ltcGxlVHlwZSA9IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbnR5cGUgUHJvcGVydHlFeHByZXNzaW9uQ2IgPSAoZmVhdHVyZTogRmVhdHVyZSkgPT4gU2ltcGxlVHlwZTtcblxuZnVuY3Rpb24gZmVhdHVyZUV4cHJlc3Npb24oZmVhdHVyZTogRmVhdHVyZSwgZXhwcmVzc2lvbjogRXhwcmVzc2lvbikge1xuICBjb25zdCBbbmFtZSwgLi4uYXJnc10gPSBleHByZXNzaW9uO1xuICBjb25zdCBleHByZXNzaW9uRnVuID0gZXhwcmVzc2lvbnNbbmFtZV07XG4gIGlmIChleHByZXNzaW9uRnVuKSB7XG4gICAgcmV0dXJuIGV4cHJlc3Npb25GdW4oZmVhdHVyZSwgYXJncyk7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUHJvcGVydHlFeHByZXNzaW9uQ2IoXG4gIGV4cHJlc3Npb246IEV4cHJlc3Npb25cbik6IFByb3BlcnR5RXhwcmVzc2lvbkNiIHtcbiAgcmV0dXJuIChmZWF0dXJlOiBGZWF0dXJlKSA9PiB7XG4gICAgcmV0dXJuIGZlYXR1cmVFeHByZXNzaW9uKGZlYXR1cmUsIGV4cHJlc3Npb24pO1xuICB9O1xufVxuXG5jb25zdCBleGNsdWRlRXhwcmVzc2lvbkxpc3QgPSBbJ2ljb25TaXplJywgJ2ljb25BbmNob3InXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUV4cHJlc3Npb25DYWxsYmFjayhcbiAgcGFpbnQ6IFZlY3RvckFkYXB0ZXJMYXllclBhaW50XG4pOiBHZXRQYWludENhbGxiYWNrIHwgdW5kZWZpbmVkIHtcbiAgbGV0IHdpdGhFeHByZXNzaW9uID0gZmFsc2U7XG4gIGNvbnN0IGV4cHJlc3Npb25zOiB7XG4gICAgW2tleTogc3RyaW5nXTogUHJvcGVydHlFeHByZXNzaW9uQ2I7XG4gIH0gPSB7fTtcbiAgZm9yIChjb25zdCBwIGluIHBhaW50KSB7XG4gICAgaWYgKGV4Y2x1ZGVFeHByZXNzaW9uTGlzdC5pbmRleE9mKHApID09PSAtMSkge1xuICAgICAgY29uc3QgcF8gPSBwIGFzIGtleW9mIFZlY3RvckFkYXB0ZXJMYXllclBhaW50O1xuICAgICAgY29uc3QgdmFsID0gcGFpbnRbcF9dO1xuICAgICAgaWYgKGlzRXhwcmVzc2lvbih2YWwpKSB7XG4gICAgICAgIHdpdGhFeHByZXNzaW9uID0gdHJ1ZTtcbiAgICAgICAgZXhwcmVzc2lvbnNbcF9dID0gY3JlYXRlUHJvcGVydHlFeHByZXNzaW9uQ2IodmFsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKHdpdGhFeHByZXNzaW9uKSB7XG4gICAgcmV0dXJuIChmZWF0dXJlOiBGZWF0dXJlKSA9PiB7XG4gICAgICBjb25zdCBmcm9tQ2I6IGFueSA9IHt9O1xuICAgICAgZm9yIChjb25zdCBwIGluIGV4cHJlc3Npb25zKSB7XG4gICAgICAgIGZyb21DYltwXSA9IGV4cHJlc3Npb25zW3BdKGZlYXR1cmUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHsgLi4ucGFpbnQsIC4uLmZyb21DYiB9O1xuICAgIH07XG4gIH1cbiAgcmV0dXJuO1xufVxuIiwiZXhwb3J0ICogZnJvbSAnLi9pbnRlcmZhY2VzJztcbmV4cG9ydCAqIGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuZXhwb3J0ICogZnJvbSAnLi9mcm9tUGFpbnRFeHByZXNzaW9uJztcbmV4cG9ydCAqIGZyb20gJy4vcHJlcGFyZVBhaW50JztcbiIsImltcG9ydCB7IGZlYXR1cmVGaWx0ZXIgfSBmcm9tICdAbmV4dGdpcy9wcm9wZXJ0aWVzLWZpbHRlcic7XG5pbXBvcnQgeyBGZWF0dXJlIH0gZnJvbSAnZ2VvanNvbic7XG5pbXBvcnQge1xuICBQYWludCxcbiAgVmVjdG9yQWRhcHRlckxheWVyUGFpbnQsXG4gIEdlb21ldHJ5UGFpbnQsXG4gIEdldFBhaW50RnVuY3Rpb24sXG4gIEdldEN1c3RvbVBhaW50T3B0aW9ucyxcbiAgUHJvcGVydGllc1BhaW50LFxuICBQcm9wZXJ0eVBhaW50LFxuICBHZXRQYWludENhbGxiYWNrLFxufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgaXNQYWludENhbGxiYWNrLCBpc1Byb3BlcnRpZXNQYWludCwgaXNQYWludCB9IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHsgY3JlYXRlRXhwcmVzc2lvbkNhbGxiYWNrIH0gZnJvbSAnLi9mcm9tUGFpbnRFeHByZXNzaW9uJztcblxuZnVuY3Rpb24gdXBkYXRlUGFpbnRPcHRpb25Gcm9tQ2FsbGJhY2soXG4gIHBhaW50OiBHZXRDdXN0b21QYWludE9wdGlvbnMsXG4gIGdldFBhaW50RnVuY3Rpb25zPzogeyBbbmFtZTogc3RyaW5nXTogR2V0UGFpbnRGdW5jdGlvbiB9XG4pOiBWZWN0b3JBZGFwdGVyTGF5ZXJQYWludCB8IHVuZGVmaW5lZCB7XG4gIGlmICh0eXBlb2YgcGFpbnQuZnJvbSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBwYWludC5mcm9tKHBhaW50Lm9wdGlvbnMpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwYWludC5mcm9tID09PSAnc3RyaW5nJyAmJiBnZXRQYWludEZ1bmN0aW9ucykge1xuICAgIGNvbnN0IGZyb20gPSBnZXRQYWludEZ1bmN0aW9uc1twYWludC5mcm9tXTtcbiAgICBpZiAoZnJvbSkge1xuICAgICAgcmV0dXJuIGZyb20ocGFpbnQub3B0aW9ucyk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVByb3BlcnRpZXNQYWludChcbiAgcHJvcGVydGllc1BhaW50OiBQcm9wZXJ0aWVzUGFpbnRcbik6IEdldFBhaW50RnVuY3Rpb24ge1xuICBsZXQgbWFzazogVmVjdG9yQWRhcHRlckxheWVyUGFpbnQgPSB7fTtcbiAgY29uc3QgcGFpbnRzRmlsdGVyczogUHJvcGVydHlQYWludFtdID0gW107XG4gIHByb3BlcnRpZXNQYWludC5mb3JFYWNoKCh4KSA9PiB7XG4gICAgaWYgKHgpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHgpKSB7XG4gICAgICAgIHBhaW50c0ZpbHRlcnMucHVzaCh4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1hc2sgPSB4IGFzIFZlY3RvckFkYXB0ZXJMYXllclBhaW50O1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIChmZWF0dXJlOiBGZWF0dXJlKSA9PiB7XG4gICAgY29uc3QgcGFpbnQgPSBwYWludHNGaWx0ZXJzLmZpbmQoKHgpID0+IGZlYXR1cmVGaWx0ZXIoZmVhdHVyZSwgeFswXSkpO1xuICAgIGlmIChwYWludCkge1xuICAgICAgcmV0dXJuIHsgLi4ubWFzaywgLi4ucGFpbnRbMV0gfTtcbiAgICB9XG4gICAgcmV0dXJuIG1hc2s7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmVwYXJlUGFpbnQoXG4gIHBhaW50OiBQYWludCxcbiAgZGVmYXVsdFBhaW50PzogR2VvbWV0cnlQYWludCxcbiAgZ2V0UGFpbnRGdW5jdGlvbnM/OiB7IFtuYW1lOiBzdHJpbmddOiBHZXRQYWludEZ1bmN0aW9uIH1cbik6IFBhaW50IHtcbiAgbGV0IG5ld1BhaW50OiBQYWludCB8IHVuZGVmaW5lZDtcbiAgaWYgKGlzUGFpbnRDYWxsYmFjayhwYWludCkpIHtcbiAgICBjb25zdCBnZXRQYWludEZ1bmN0aW9uOiBHZXRQYWludENhbGxiYWNrID0gKGZlYXR1cmU6IEZlYXR1cmUpID0+IHtcbiAgICAgIGNvbnN0IGdldFBhaW50ID0gcHJlcGFyZVBhaW50KFxuICAgICAgICBwYWludChmZWF0dXJlKSxcbiAgICAgICAgZGVmYXVsdFBhaW50LFxuICAgICAgICBnZXRQYWludEZ1bmN0aW9uc1xuICAgICAgKSBhcyBWZWN0b3JBZGFwdGVyTGF5ZXJQYWludDtcbiAgICAgIGdldFBhaW50LnR5cGUgPSBwYWludC50eXBlO1xuICAgICAgcmV0dXJuIGdldFBhaW50O1xuICAgIH07XG4gICAgZ2V0UGFpbnRGdW5jdGlvbi50eXBlID0gcGFpbnQudHlwZTtcbiAgICByZXR1cm4gZ2V0UGFpbnRGdW5jdGlvbjtcbiAgfSBlbHNlIGlmIChpc1Byb3BlcnRpZXNQYWludChwYWludCkpIHtcbiAgICByZXR1cm4gKGZlYXR1cmU6IEZlYXR1cmUpID0+IHtcbiAgICAgIHJldHVybiBwcmVwYXJlUGFpbnQoXG4gICAgICAgIGNyZWF0ZVByb3BlcnRpZXNQYWludChwYWludCkoZmVhdHVyZSksXG4gICAgICAgIGRlZmF1bHRQYWludCxcbiAgICAgICAgZ2V0UGFpbnRGdW5jdGlvbnNcbiAgICAgICkgYXMgVmVjdG9yQWRhcHRlckxheWVyUGFpbnQ7XG4gICAgfTtcbiAgfSBlbHNlIGlmIChwYWludC50eXBlID09PSAnZ2V0LXBhaW50Jykge1xuICAgIGNvbnN0IGdldFBhaW50ID0gdXBkYXRlUGFpbnRPcHRpb25Gcm9tQ2FsbGJhY2socGFpbnQsIGdldFBhaW50RnVuY3Rpb25zKTtcbiAgICBpZiAoZ2V0UGFpbnQpIHtcbiAgICAgIG5ld1BhaW50ID0gcHJlcGFyZVBhaW50KGdldFBhaW50LCBkZWZhdWx0UGFpbnQsIGdldFBhaW50RnVuY3Rpb25zKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAocGFpbnQudHlwZSA9PT0gJ2ljb24nKSB7XG4gICAgcmV0dXJuIHBhaW50O1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGV4cHJlc3Npb25DYWxsYmFjayA9IGNyZWF0ZUV4cHJlc3Npb25DYWxsYmFjayhwYWludCk7XG4gICAgaWYgKGV4cHJlc3Npb25DYWxsYmFjaykge1xuICAgICAgcmV0dXJuIChmZWF0dXJlOiBGZWF0dXJlKSA9PiB7XG4gICAgICAgIHJldHVybiBwcmVwYXJlUGFpbnQoXG4gICAgICAgICAgZXhwcmVzc2lvbkNhbGxiYWNrKGZlYXR1cmUpLFxuICAgICAgICAgIGRlZmF1bHRQYWludCxcbiAgICAgICAgICBnZXRQYWludEZ1bmN0aW9uc1xuICAgICAgICApIGFzIFZlY3RvckFkYXB0ZXJMYXllclBhaW50O1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBuZXdQYWludCA9IHsgLi4ucGFpbnQgfTtcbiAgICBuZXdQYWludC5maWxsID0gbmV3UGFpbnQuZmlsbCAhPT0gdW5kZWZpbmVkID8gbmV3UGFpbnQuZmlsbCA6IHRydWU7XG4gICAgbmV3UGFpbnQuc3Ryb2tlID1cbiAgICAgIG5ld1BhaW50LnN0cm9rZSAhPT0gdW5kZWZpbmVkXG4gICAgICAgID8gbmV3UGFpbnQuc3Ryb2tlXG4gICAgICAgIDogIW5ld1BhaW50LmZpbGwgfHwgISEobmV3UGFpbnQuc3Ryb2tlQ29sb3IgfHwgbmV3UGFpbnQuc3Ryb2tlT3BhY2l0eSk7XG4gIH1cbiAgaWYgKG5ld1BhaW50KSB7XG4gICAgaWYgKGlzUGFpbnRDYWxsYmFjayhuZXdQYWludCkpIHtcbiAgICAgIHJldHVybiBuZXdQYWludDtcbiAgICB9IGVsc2UgaWYgKGlzUGFpbnQobmV3UGFpbnQpKSB7XG4gICAgICBuZXdQYWludCA9IHsgLi4uZGVmYXVsdFBhaW50LCAuLi5uZXdQYWludCB9O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBuZXdQYWludCA9IHsgLi4uZGVmYXVsdFBhaW50IH07XG4gIH1cblxuICBpZiAoJ2NvbG9yJyBpbiBuZXdQYWludCkge1xuICAgIGlmICghbmV3UGFpbnQuc3Ryb2tlQ29sb3IpIHtcbiAgICAgIG5ld1BhaW50LnN0cm9rZUNvbG9yID0gbmV3UGFpbnQuY29sb3I7XG4gICAgfVxuICAgIGlmICghbmV3UGFpbnQuZmlsbENvbG9yKSB7XG4gICAgICBuZXdQYWludC5maWxsQ29sb3IgPSBuZXdQYWludC5jb2xvcjtcbiAgICB9XG4gIH1cbiAgaWYgKCdvcGFjaXR5JyBpbiBuZXdQYWludCkge1xuICAgIGlmIChuZXdQYWludC5zdHJva2VPcGFjaXR5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5ld1BhaW50LnN0cm9rZU9wYWNpdHkgPSBuZXdQYWludC5vcGFjaXR5O1xuICAgIH1cbiAgICBpZiAobmV3UGFpbnQuZmlsbE9wYWNpdHkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgbmV3UGFpbnQuZmlsbE9wYWNpdHkgPSBuZXdQYWludC5vcGFjaXR5O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXdQYWludDtcbn1cbiIsImltcG9ydCB7XG4gIEV4cHJlc3Npb24sXG4gIFBhaW50LFxuICBQcm9wZXJ0aWVzUGFpbnQsXG4gIFZlY3RvckFkYXB0ZXJMYXllclBhaW50LFxuICBHZW9tZXRyeVBhaW50LFxuICBHZXRQYWludENhbGxiYWNrLFxuICBJY29uT3B0aW9ucyxcbiAgSWNvblBhaW50LFxufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNFeHByZXNzaW9uKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgRXhwcmVzc2lvbiB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUHJvcGVydGllc1BhaW50KHBhaW50OiBQYWludCk6IHBhaW50IGlzIFByb3BlcnRpZXNQYWludCB7XG4gIGlmIChBcnJheS5pc0FycmF5KHBhaW50KSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUGFpbnQocGFpbnQ6IFBhaW50KTogcGFpbnQgaXMgVmVjdG9yQWRhcHRlckxheWVyUGFpbnQge1xuICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHBhaW50KSA9PT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Jhc2VQYWludChwYWludDogUGFpbnQpOiBwYWludCBpcyBHZW9tZXRyeVBhaW50IHtcbiAgaWYgKGlzUGFpbnQocGFpbnQpKSB7XG4gICAgaWYgKHBhaW50LnR5cGUgPT09ICdnZXQtcGFpbnQnIHx8IHBhaW50LnR5cGUgPT09ICdpY29uJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BhaW50Q2FsbGJhY2socGFpbnQ6IFBhaW50KTogcGFpbnQgaXMgR2V0UGFpbnRDYWxsYmFjayB7XG4gIGlmICh0eXBlb2YgcGFpbnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ljb24ocGFpbnQ6IEljb25PcHRpb25zKTogcGFpbnQgaXMgSWNvblBhaW50IHtcbiAgcmV0dXJuIHBhaW50LnR5cGUgPT09ICdpY29uJyB8fCAnaHRtbCcgaW4gcGFpbnQ7XG59XG4iLCJleHBvcnQgKiBmcm9tICcuL3Byb3BlcnRpZXNGaWx0ZXInO1xuIiwiaW1wb3J0IHsgRmVhdHVyZSwgR2VvSnNvblByb3BlcnRpZXMgfSBmcm9tICdnZW9qc29uJztcbmltcG9ydCB7IHJlRXNjYXBlIH0gZnJvbSAnQG5leHRnaXMvdXRpbHMnO1xuXG4vKipcbiAqIGd0IC0gZ3JlYXRlciAoPilcbiAqIGx0IC0gbG93ZXIgKDwpXG4gKiBnZSAtIGdyZWF0ZXIgb3IgZXF1YWwgKD49KVxuICogbGUgLSBsb3dlciBvciBlcXVhbCAoPD0pXG4gKiBlcSAtIGVxdWFsICg9KVxuICogbmUgLSBub3QgZXF1YWwgKCE9KVxuICogbGlrZSAtIExJS0UgU1FMIHN0YXRlbWVudCAoZm9yIHN0cmluZ3MgY29tcGFyZSlcbiAqIGlsaWtlIC0gSUxJS0UgU1FMIHN0YXRlbWVudCAoZm9yIHN0cmluZ3MgY29tcGFyZSlcbiAqL1xuZXhwb3J0IHR5cGUgT3BlcmF0aW9ucyA9XG4gIHwgJ2d0J1xuICB8ICdsdCdcbiAgfCAnZ2UnXG4gIHwgJ2xlJ1xuICB8ICdlcSdcbiAgfCAnbmUnXG4gIHwgJ2luJ1xuICB8ICdub3RpbidcbiAgfCAnbGlrZSdcbiAgfCAnaWxpa2UnO1xuXG50eXBlIFByb3BlcnRpZXMgPSBHZW9Kc29uUHJvcGVydGllcztcblxuLyoqXG4gKiBmaWVsZCwgb3BlcmF0aW9uLCB2YWx1ZVxuICogWydmb28nLCAnZXEnLCAnYmFyJ11cbiAqIFsnY291bnQnLCAnZ2UnLCAyMF1cbiAqL1xuZXhwb3J0IHR5cGUgUHJvcGVydHlGaWx0ZXI8VCBleHRlbmRzIFByb3BlcnRpZXMgPSBQcm9wZXJ0aWVzPiA9IFtcbiAga2V5b2YgVCB8IHN0cmluZyxcbiAgT3BlcmF0aW9ucyxcbiAgYW55XG5dO1xuXG5leHBvcnQgdHlwZSBQcm9wZXJ0aWVzRmlsdGVyPFQgZXh0ZW5kcyBQcm9wZXJ0aWVzID0gUHJvcGVydGllcz4gPSAoXG4gIHwgJ2FsbCdcbiAgfCAnYW55J1xuICB8IFByb3BlcnR5RmlsdGVyPFQ+XG4gIHwgUHJvcGVydGllc0ZpbHRlcjxUPlxuKVtdO1xuXG5mdW5jdGlvbiBsaWtlKGI6IHN0cmluZywgYTogc3RyaW5nLCBpTGlrZT86IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgYSA9IFN0cmluZyhhKTtcbiAgYiA9IFN0cmluZyhiKTtcbiAgaWYgKGEgPT09IGIpIHJldHVybiB0cnVlO1xuICBpZiAoaUxpa2UgJiYgYS50b1VwcGVyQ2FzZSgpID09PSBiLnRvVXBwZXJDYXNlKCkpIHJldHVybiB0cnVlO1xuICBjb25zdCByZSA9IGBeJHtyZUVzY2FwZShhKX0kYC5yZXBsYWNlKC8lL2csICcuKicpLnJlcGxhY2UoJ18nLCAnLicpO1xuICByZXR1cm4gbmV3IFJlZ0V4cChyZSwgaUxpa2UgPyAnaScgOiAnJykuZXhlYyhiKSAhPT0gbnVsbDtcbn1cblxuZXhwb3J0IGNvbnN0IG9wZXJhdGlvbnNBbGlhc2VzOiB7XG4gIFtrZXkgaW4gT3BlcmF0aW9uc106IChhOiBhbnksIGI6IGFueSkgPT4gYm9vbGVhbjtcbn0gPSB7XG4gIC8vIGdyZWF0ZXIoPilcbiAgZ3Q6IChhOiBhbnksIGI6IGFueSkgPT4gYSA+IGIsXG4gIC8vIGxvd2VyKDwpXG4gIGx0OiAoYTogYW55LCBiOiBhbnkpID0+IGEgPCBiLFxuICAvLyBncmVhdGVyIG9yIGVxdWFsKD49KVxuICBnZTogKGE6IGFueSwgYjogYW55KSA9PiBhID49IGIsXG4gIC8vIGxvd2VyIG9yIGVxdWFsKDw9KVxuICBsZTogKGE6IGFueSwgYjogYW55KSA9PiBhIDw9IGIsXG4gIC8vIGVxdWFsKD0pXG4gIGVxOiAoYTogYW55LCBiOiBhbnkpID0+IGEgPT09IGIsXG4gIC8vICBub3QgZXF1YWwoIT0pXG4gIG5lOiAoYTogYW55LCBiOiBhbnkpID0+IGEgIT09IGIsXG5cbiAgaW46IChhOiBhbnksIGI6IGFueVtdKSA9PiBiLmluZGV4T2YoYSkgIT09IC0xLFxuICBub3RpbjogKGE6IGFueSwgYjogYW55W10pID0+IGIuaW5kZXhPZihhKSA9PT0gLTEsXG4gIC8vIExJS0UgU1FMIHN0YXRlbWVudChmb3Igc3RyaW5ncyBjb21wYXJlKVxuICBsaWtlOiAoYTogc3RyaW5nLCBiOiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gbGlrZShhLCBiKTtcbiAgfSxcbiAgLy8gSUxJS0UgU1FMIHN0YXRlbWVudChmb3Igc3RyaW5ncyBjb21wYXJlKVxuICBpbGlrZTogKGE6IHN0cmluZywgYjogc3RyaW5nKSA9PiB7XG4gICAgcmV0dXJuIGxpa2UoYSwgYiwgdHJ1ZSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tJZlByb3BlcnR5RmlsdGVyKFxuICBmaWx0ZXI6IFByb3BlcnR5RmlsdGVyIHwgUHJvcGVydGllc0ZpbHRlciB8IHN0cmluZ1xuKTogZmlsdGVyIGlzIFByb3BlcnR5RmlsdGVyIHtcbiAgY29uc3QgcGYgPSBmaWx0ZXIgYXMgUHJvcGVydHlGaWx0ZXI7XG4gIGlmIChcbiAgICBwZi5sZW5ndGggPT09IDMgJiZcbiAgICB0eXBlb2YgcGZbMF0gPT09ICdzdHJpbmcnICYmXG4gICAgdHlwZW9mIHBmWzFdID09PSAnc3RyaW5nJ1xuICApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZWF0dXJlRmlsdGVyKFxuICBmZWF0dXJlOiBGZWF0dXJlLFxuICBmaWx0ZXJzOiBQcm9wZXJ0aWVzRmlsdGVyXG4pOiBib29sZWFuIHtcbiAgY29uc3QgcHJvcGVydGllczogR2VvSnNvblByb3BlcnRpZXMgPSB7IC4uLmZlYXR1cmUucHJvcGVydGllcyB9O1xuICBpZiAocHJvcGVydGllcykge1xuICAgIC8vIHdvcmthcm91bmQgdG8gZmlsdGVyIGJ5IGZlYXR1cmUgaWRcbiAgICBwcm9wZXJ0aWVzLiRpZCA9IGZlYXR1cmUuaWQ7XG4gICAgcmV0dXJuIHByb3BlcnRpZXNGaWx0ZXIocHJvcGVydGllcywgZmlsdGVycyk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvcGVydGllc0ZpbHRlcihcbiAgcHJvcGVydGllczogeyBbZmllbGQ6IHN0cmluZ106IGFueSB9LFxuICBmaWx0ZXJzOiBQcm9wZXJ0aWVzRmlsdGVyXG4pOiBib29sZWFuIHtcbiAgY29uc3QgbG9naWMgPSB0eXBlb2YgZmlsdGVyc1swXSA9PT0gJ3N0cmluZycgPyBmaWx0ZXJzWzBdIDogJ2FsbCc7XG4gIGNvbnN0IGZpbHRlckZ1bmN0aW9uID0gKHA6IFByb3BlcnR5RmlsdGVyIHwgUHJvcGVydGllc0ZpbHRlcikgPT4ge1xuICAgIGlmIChjaGVja0lmUHJvcGVydHlGaWx0ZXIocCkpIHtcbiAgICAgIGNvbnN0IFtmaWVsZCwgb3BlcmF0aW9uLCB2YWx1ZV0gPSBwO1xuICAgICAgY29uc3Qgb3BlcmF0aW9uRXhlYyA9IG9wZXJhdGlvbnNBbGlhc2VzW29wZXJhdGlvbl07XG4gICAgICBpZiAob3BlcmF0aW9uRXhlYykge1xuICAgICAgICBpZiAob3BlcmF0aW9uID09PSAnbGlrZScgfHwgb3BlcmF0aW9uID09PSAnaWxpa2UnKSB7XG4gICAgICAgICAgbGV0IHByb3AgPSAnJztcbiAgICAgICAgICBjb25zdCB2YWx1ZV8gPSBmaWVsZC5yZXBsYWNlKC9eJT8oXFx3KyklPyQvLCAobWF0Y2gsIGNsZWFuRmllbGQpID0+IHtcbiAgICAgICAgICAgIHByb3AgPSBwcm9wZXJ0aWVzW2NsZWFuRmllbGRdO1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkLnJlcGxhY2UoY2xlYW5GaWVsZCwgdmFsdWUpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBvcGVyYXRpb25FeGVjKHByb3AsIHZhbHVlXyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9wZXJhdGlvbkV4ZWMocHJvcGVydGllc1tmaWVsZF0sIHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHByb3BlcnRpZXNGaWx0ZXIocHJvcGVydGllcywgcCk7XG4gICAgfVxuICB9O1xuICBjb25zdCBmaWx0ZXJzXyA9IGZpbHRlcnMuZmlsdGVyKCh4KSA9PiBBcnJheS5pc0FycmF5KHgpKSBhcyAoXG4gICAgfCBQcm9wZXJ0eUZpbHRlclxuICAgIHwgUHJvcGVydGllc0ZpbHRlclxuICApW107XG4gIHJldHVybiBsb2dpYyA9PT0gJ2FueSdcbiAgICA/IGZpbHRlcnNfLnNvbWUoZmlsdGVyRnVuY3Rpb24pXG4gICAgOiBmaWx0ZXJzXy5ldmVyeShmaWx0ZXJGdW5jdGlvbik7XG59XG4iLCJpbXBvcnQgV2ViTWFwLCB7XG4gIFN0YXJ0ZXJLaXQsXG4gIFR5cGUsXG4gIE1haW5MYXllckFkYXB0ZXIsXG4gIExheWVyQWRhcHRlckNyZWF0b3JzLFxufSBmcm9tICdAbmV4dGdpcy93ZWJtYXAnO1xuaW1wb3J0IHsgUW1zT3B0aW9ucyB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBjcmVhdGVRbXNBZGFwdGVyIH0gZnJvbSAnLi91dGlscy9jcmVhdGVRbXNBZGFwdGVyJztcblxuZXhwb3J0IGNsYXNzIFFtc0tpdCBpbXBsZW1lbnRzIFN0YXJ0ZXJLaXQge1xuICBzdGF0aWMgdXRpbHMgPSB7XG4gICAgY3JlYXRlUW1zQWRhcHRlcixcbiAgfTtcblxuICBvcHRpb25zOiBRbXNPcHRpb25zID0ge1xuICAgIHVybDogJ2h0dHBzOi8vcW1zLm5leHRnaXMuY29tJyxcbiAgfTtcblxuICB1cmw6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zPzogUW1zT3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IHsgLi4udGhpcy5vcHRpb25zLCAuLi5vcHRpb25zIH07XG4gICAgdGhpcy51cmwgPSB0aGlzLm9wdGlvbnMudXJsO1xuICB9XG5cbiAgZ2V0TGF5ZXJBZGFwdGVycygpOiBQcm9taXNlPExheWVyQWRhcHRlckNyZWF0b3JzW10+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ1FNUycsXG4gICAgICAgIGNyZWF0ZUFkYXB0ZXI6ICh3ZWJtYXA6IFdlYk1hcCkgPT5cbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUodGhpcy5fY3JlYXRlQWRhcHRlcih3ZWJtYXApKSxcbiAgICAgIH0sXG4gICAgXSk7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVBZGFwdGVyKHdlYk1hcDogV2ViTWFwKTogVHlwZTxNYWluTGF5ZXJBZGFwdGVyPiB7XG4gICAgcmV0dXJuIGNyZWF0ZVFtc0FkYXB0ZXIod2ViTWFwLCB0aGlzLnVybCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFFtc0tpdCB9IGZyb20gJy4vUW1zS2l0JztcblxuZXhwb3J0ICogZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuZXhwb3J0IHsgUW1zS2l0IH07XG5leHBvcnQgZGVmYXVsdCBRbXNLaXQ7XG4iLCJpbXBvcnQgeyBXZWJNYXAsIE1haW5MYXllckFkYXB0ZXIgfSBmcm9tICdAbmV4dGdpcy93ZWJtYXAnO1xuaW1wb3J0IHsgVHlwZSwgbWl4aW5Qcm9wZXJ0aWVzIH0gZnJvbSAnQG5leHRnaXMvdXRpbHMnO1xuaW1wb3J0IHsgUW1zQWRhcHRlck9wdGlvbnMsIFFtc0Jhc2VtYXAsIFFtc0FkYXB0ZXIgYXMgUUEgfSBmcm9tICcuLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IGFsaWFzLCB1cGRhdGVRbXNPcHRpb25zIH0gZnJvbSAnLi91cGRhdGVRbXNPcHRpb25zJztcbmltcG9ydCB7IGxvYWRKc29uIH0gZnJvbSAnLi9sb2FkSnNvbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVRbXNBZGFwdGVyKFxuICB3ZWJNYXA6IFdlYk1hcCxcbiAgdXJsID0gJ2h0dHBzOi8vcW1zLm5leHRnaXMuY29tJ1xuKTogVHlwZTxNYWluTGF5ZXJBZGFwdGVyPiB7XG4gIGNsYXNzIFFtc0FkYXB0ZXI8TSA9IGFueT4gaW1wbGVtZW50cyBNYWluTGF5ZXJBZGFwdGVyPE0+LCBRQSB7XG4gICAgcW1zPzogUW1zQmFzZW1hcDtcblxuICAgIG9wdGlvbnM6IFFtc0FkYXB0ZXJPcHRpb25zO1xuICAgIG1hcDogTTtcblxuICAgIGNvbnN0cnVjdG9yKG1hcDogTSwgb3B0aW9uczogUW1zQWRhcHRlck9wdGlvbnMpIHtcbiAgICAgIHRoaXMubWFwID0gbWFwO1xuICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgIHRoaXMub3B0aW9ucy5iYXNlbGF5ZXIgPSB0cnVlO1xuICAgIH1cblxuICAgIGFzeW5jIGFkZExheWVyKG9wdGlvbnM6IFFtc0FkYXB0ZXJPcHRpb25zKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgIC8vIHFtc0lkIGZvciByZXF1ZXN0LCBpZCBmb3Igc3RvcmVcbiAgICAgIGlmICghdGhpcy5xbXMgJiYgb3B0aW9ucy5xbXNJZCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoaXMucW1zID0gYXdhaXQgbG9hZEpzb248UW1zQmFzZW1hcD4oXG4gICAgICAgICAgICB1cmwgKyAnL2FwaS92MS9nZW9zZXJ2aWNlcy8nICsgb3B0aW9ucy5xbXNJZFxuICAgICAgICAgICk7XG4gICAgICAgIH0gY2F0Y2ggKGVyKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHFtcyA9IHRoaXMucW1zO1xuICAgICAgaWYgKHFtcykge1xuICAgICAgICBjb25zdCB0eXBlID0gYWxpYXNbcW1zLnR5cGUgfHwgJ3RtcyddO1xuICAgICAgICBjb25zdCB3ZWJNYXBBZGFwdGVyID0gd2ViTWFwLm1hcEFkYXB0ZXIubGF5ZXJBZGFwdGVyc1t0eXBlXTtcbiAgICAgICAgaWYgKHdlYk1hcEFkYXB0ZXIpIHtcbiAgICAgICAgICBtaXhpblByb3BlcnRpZXMoUW1zQWRhcHRlciwgd2ViTWFwQWRhcHRlciwgW1xuICAgICAgICAgICAgJ3Nob3dMYXllcicsXG4gICAgICAgICAgICAnaGlkZUxheWVyJyxcbiAgICAgICAgICBdKTtcbiAgICAgICAgICBpZiAodHlwZSA9PT0gJ1RJTEUnKSB7XG4gICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICBvcmRlcjogMCxcbiAgICAgICAgICAgICAgbWF4Wm9vbTogd2ViTWFwLm9wdGlvbnMubWF4Wm9vbSxcbiAgICAgICAgICAgICAgbWluWm9vbTogd2ViTWFwLm9wdGlvbnMubWluWm9vbSxcbiAgICAgICAgICAgICAgLi4udGhpcy5vcHRpb25zLFxuICAgICAgICAgICAgICAuLi51cGRhdGVRbXNPcHRpb25zKHFtcyksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgICAgIGNvbnN0IGFkYXB0ZXIgPSBuZXcgd2ViTWFwQWRhcHRlcih0aGlzLm1hcCwgb3B0aW9ucyk7XG4gICAgICAgICAgICByZXR1cm4gYWRhcHRlci5hZGRMYXllcihvcHRpb25zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIFFtc0FkYXB0ZXI7XG59XG4iLCJpbXBvcnQgeyBmaXhVcmxTdHIgfSBmcm9tICdAbmV4dGdpcy91dGlscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkSnNvbjxUID0gYW55Pih1cmw6IHN0cmluZyk6IFByb21pc2U8VD4ge1xuICByZXR1cm4gbmV3IFByb21pc2U8VD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHhtbEh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB4bWxIdHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGlmICh4bWxIdHRwLnJlYWR5U3RhdGUgPT09IDQgJiYgeG1sSHR0cC5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICBpZiAoeG1sSHR0cC5yZXNwb25zZVRleHQpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHhtbEh0dHAucmVzcG9uc2VUZXh0KSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXIpIHtcbiAgICAgICAgICAgIHJlamVjdChlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICB4bWxIdHRwLm9wZW4oJ0dFVCcsIGZpeFVybFN0cih1cmwpLCB0cnVlKTsgLy8gdHJ1ZSBmb3IgYXN5bmNocm9ub3VzXG4gICAgeG1sSHR0cC5zZW5kKCk7XG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgTGF5ZXJBZGFwdGVyc09wdGlvbnMsIEFkYXB0ZXJPcHRpb25zIH0gZnJvbSAnQG5leHRnaXMvd2VibWFwJztcblxuaW1wb3J0IHsgUW1zQmFzZW1hcCwgUW1zTGF5ZXJUeXBlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCBjb25zdCBhbGlhczogeyBba2V5IGluIFFtc0xheWVyVHlwZV06IGtleW9mIExheWVyQWRhcHRlcnNPcHRpb25zIH0gPSB7XG4gIHRtczogJ1RJTEUnLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVFtc09wdGlvbnMoXG4gIHFtczogUW1zQmFzZW1hcFxuKTogQWRhcHRlck9wdGlvbnMgJiB7IHVybDogc3RyaW5nIH0ge1xuICBjb25zdCBwcm90b2NvbCA9IChsb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHBzOicgPyAnaHR0cHMnIDogJ2h0dHAnKSArICc6Ly8nO1xuICBsZXQgc2VydmljZVVybCA9IHFtcy51cmwucmVwbGFjZSgvXihodHRwcz98ZnRwKTpcXC9cXC8vLCBwcm90b2NvbCk7XG4gIGlmICghcW1zLnlfb3JpZ2luX3RvcCkge1xuICAgIHNlcnZpY2VVcmwgPSBzZXJ2aWNlVXJsLnJlcGxhY2UoJ3t5fScsICd7LXl9Jyk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB1cmw6IHNlcnZpY2VVcmwsXG4gICAgbmFtZTogcW1zLm5hbWUsXG4gICAgYXR0cmlidXRpb246IHFtcy5jb3B5cmlnaHRfdGV4dCxcbiAgICBtYXhab29tOiBxbXMuel9tYXgsXG4gICAgbWluWm9vbTogcW1zLnpfbWluLFxuICB9O1xufVxuIiwiaW1wb3J0IHsgUnVudGltZVBhcmFtcyB9IGZyb20gJ0BuZXh0Z2lzL3dlYm1hcCc7XG5pbXBvcnQgeyBQYXJhbXMsIFN0YXRlRGF0YSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCBjbGFzcyBVcmxSdW50aW1lUGFyYW1zIGltcGxlbWVudHMgUnVudGltZVBhcmFtcyB7XG4gIHByaXZhdGUgX3BhcmFtczogUGFyYW1zID0ge307XG5cbiAgZ2V0KG5hbWU6IHN0cmluZyk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zKClbbmFtZV07XG4gIH1cblxuICBwYXJhbXMoKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB7XG4gICAgLy8gaWYgKHRoaXMuX3BhcmFtcykge1xuICAgIC8vICAgcmV0dXJuIHRoaXMuX3BhcmFtcztcbiAgICAvLyB9XG4gICAgY29uc3QgcGFyYW1zOiBQYXJhbXMgPSB7fTtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZi5yZXBsYWNlKC9bPyZdKyhcXHcrKShbXiZdKikvZ2ksIGZ1bmN0aW9uIChtLCBrZXkpIHtcbiAgICAgIHBhcmFtc1trZXldID0gdHJ1ZTtcbiAgICAgIHJldHVybiAnJzsgLy8gZG9lcyBub3QgbWF0dGVyXG4gICAgfSk7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZSgvWz8mXSsoW149Jl0rKT0oW14mXSopL2dpLCBmdW5jdGlvbiAoXG4gICAgICBtLFxuICAgICAga2V5LFxuICAgICAgdmFsdWVcbiAgICApIHtcbiAgICAgIHBhcmFtc1trZXldID0gZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcbiAgICAgIHJldHVybiAnJzsgLy8gZG9lcyBub3QgbWF0dGVyXG4gICAgfSk7XG4gICAgdGhpcy5fcGFyYW1zID0gcGFyYW1zO1xuICAgIHJldHVybiBwYXJhbXM7XG4gIH1cblxuICBzZXQobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogU3RhdGVEYXRhIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIGxldCBzZWFyY2g6IHN0cmluZztcbiAgICAgIGNvbnN0IHVybENvbXBvbmVudCA9IGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSk7XG4gICAgICBjb25zdCBleGlzdFVybFBhcmFtID0gdGhpcy5nZXQobmFtZSk7XG4gICAgICBpZiAoZXhpc3RVcmxQYXJhbSkge1xuICAgICAgICBzZWFyY2ggPSBsb2NhdGlvbi5zZWFyY2gucmVwbGFjZShcbiAgICAgICAgICBuZXcgUmVnRXhwKCcoWz98Jl0nICsgbmFtZSArICc9KScgKyAnKC4rPykoJnwkKScpLFxuICAgICAgICAgICckMScgKyB1cmxDb21wb25lbnQgKyAnJDMnXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKGxvY2F0aW9uLnNlYXJjaC5sZW5ndGgpIHtcbiAgICAgICAgc2VhcmNoID0gbG9jYXRpb24uc2VhcmNoICsgJyYnICsgbmFtZSArICc9JyArIHVybENvbXBvbmVudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlYXJjaCA9ICc/JyArIG5hbWUgKyAnPScgKyB1cmxDb21wb25lbnQ7XG4gICAgICB9XG4gICAgICBjb25zdCBwYXJhbXM6IFBhcmFtcyA9IHt9O1xuICAgICAgcGFyYW1zW25hbWVdID0gdmFsdWU7XG4gICAgICB0aGlzLl9wYXJhbXNbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIGNvbnN0IGRhdGE6IFN0YXRlRGF0YSA9IHsgc3RhdGU6IHsgdXJsOiBzZWFyY2gsIHBhcmFtcyB9LCB1cmw6IHNlYXJjaCB9O1xuICAgICAgdGhpcy5fcHVzaFN0YXRlKGRhdGEpO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbW92ZShuYW1lKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmUobmFtZTogc3RyaW5nKTogU3RhdGVEYXRhIHtcbiAgICBjb25zdCBzb3VyY2VVcmwgPSBsb2NhdGlvbi5zZWFyY2g7XG4gICAgbGV0IHJ0biA9IHNvdXJjZVVybC5zcGxpdCgnPycpWzBdO1xuICAgIGxldCBwYXJhbTogc3RyaW5nO1xuICAgIGxldCBwYXJhbXNBcnI6IHN0cmluZ1tdO1xuICAgIGNvbnN0IHF1ZXJ5U3RyaW5nID1cbiAgICAgIHNvdXJjZVVybC5pbmRleE9mKCc/JykgIT09IC0xID8gc291cmNlVXJsLnNwbGl0KCc/JylbMV0gOiAnJztcbiAgICBpZiAocXVlcnlTdHJpbmcgIT09ICcnKSB7XG4gICAgICBwYXJhbXNBcnIgPSBxdWVyeVN0cmluZy5zcGxpdCgnJicpO1xuICAgICAgZm9yIChsZXQgaSA9IHBhcmFtc0Fyci5sZW5ndGggLSAxOyBpID49IDA7IGkgLT0gMSkge1xuICAgICAgICBwYXJhbSA9IHBhcmFtc0FycltpXS5zcGxpdCgnPScpWzBdO1xuICAgICAgICBpZiAocGFyYW0gPT09IG5hbWUpIHtcbiAgICAgICAgICBwYXJhbXNBcnIuc3BsaWNlKGksIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBydG4gPSBydG4gKyAnPycgKyBwYXJhbXNBcnIuam9pbignJicpO1xuICAgIH1cblxuICAgIGRlbGV0ZSB0aGlzLl9wYXJhbXNbbmFtZV07XG5cbiAgICBjb25zdCBkYXRhOiBTdGF0ZURhdGEgPSB7IHN0YXRlOiB7IHVybDogcnRuLCB0eXBlOiAncmVtb3ZlJyB9LCB1cmw6IHJ0biB9O1xuICAgIHRoaXMuX3B1c2hTdGF0ZShkYXRhKTtcblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgcHJpdmF0ZSBfcHVzaFN0YXRlKGRhdGE6IGFueSk6IHZvaWQge1xuICAgIGlmIChoaXN0b3J5KSB7XG4gICAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZShkYXRhLnN0YXRlLCBkb2N1bWVudC50aXRsZSwgZGF0YS51cmwpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgVXJsUnVudGltZVBhcmFtcyB9IGZyb20gJy4vVXJsUnVudGltZVBhcmFtcyc7XG5cbmV4cG9ydCAqIGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCB7IFVybFJ1bnRpbWVQYXJhbXMgfTtcbmV4cG9ydCBkZWZhdWx0IFVybFJ1bnRpbWVQYXJhbXM7XG4iLCJleHBvcnQgY2xhc3MgQ2xpcGJvYXJkIHtcbiAgY29uc3RydWN0b3IodGV4dDogc3RyaW5nKSB7XG4gICAgaWYgKHRleHQpIHtcbiAgICAgIHRoaXMuY29weSh0ZXh0KTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgY29weSh0ZXh0OiBzdHJpbmcpOiBDbGlwYm9hcmQge1xuICAgIHJldHVybiBuZXcgQ2xpcGJvYXJkKHRleHQpO1xuICB9XG5cbiAgY29weSh0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0cnkge1xuICAgICAgaWYgKChuYXZpZ2F0b3IgYXMgYW55KS5jbGlwYm9hcmQpIHtcbiAgICAgICAgKG5hdmlnYXRvciBhcyBhbnkpLmNsaXBib2FyZC53cml0ZVRleHQodGV4dCk7XG4gICAgICB9IGVsc2UgaWYgKCh3aW5kb3cgYXMgYW55KS5jbGlwYm9hcmREYXRhKSB7XG4gICAgICAgICh3aW5kb3cgYXMgYW55KS5jbGlwYm9hcmREYXRhLnNldERhdGEoJ3RleHQnLCB0ZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29weVRvQ2xpcGJvYXJkKHRleHQpO1xuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coJ0NvcGllZCB0byBDbGlwYm9hcmQnKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZygnUGxlYXNlIGNvcHkgY291cG9uIG1hbnVhbGx5Jyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjb3B5VG9DbGlwYm9hcmQodGV4dDogc3RyaW5nKSB7XG4gICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgaW5wdXQudmFsdWUgPSB0ZXh0O1xuICAgIHRyeSB7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGlucHV0KTtcbiAgICAgIHRoaXMuY29weU5vZGVDb250ZW50c1RvQ2xpcGJvYXJkKGlucHV0KTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChpbnB1dCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjb3B5Tm9kZUNvbnRlbnRzVG9DbGlwYm9hcmQoaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQpIHtcbiAgICBpbnB1dC5zZWxlY3QoKTtcbiAgICBpbnB1dC5zZXRTZWxlY3Rpb25SYW5nZSgwLCA5OTk5OSk7IC8qRm9yIG1vYmlsZSBkZXZpY2VzKi9cbiAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xuICB9XG59XG4iLCJ0eXBlIEN0b3IgPSBhbnk7XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseU1peGlucyhkZXJpdmVkQ3RvcjogQ3RvciwgYmFzZUN0b3JzOiBDdG9yW10pOiB2b2lkIHtcbiAgYmFzZUN0b3JzLmZvckVhY2goKGJhc2VDdG9yKSA9PiB7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYmFzZUN0b3IucHJvdG90eXBlKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBjb25zdCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihcbiAgICAgICAgYmFzZUN0b3IucHJvdG90eXBlLFxuICAgICAgICBuYW1lXG4gICAgICApO1xuICAgICAgaWYgKGRlc2NyaXB0b3IpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRlcml2ZWRDdG9yLnByb3RvdHlwZSwgbmFtZSwgZGVzY3JpcHRvcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWl4aW5Qcm9wZXJ0aWVzKFxuICBkZXJpdmVkQ3RvcjogQ3RvcixcbiAgYmFzZUN0b3I6IEN0b3IsXG4gIHByb3BlcnRpZXM6IHN0cmluZ1tdXG4pOiB2b2lkIHtcbiAgcHJvcGVydGllcy5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgY29uc3QgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoXG4gICAgICBiYXNlQ3Rvci5wcm90b3R5cGUsXG4gICAgICBuYW1lXG4gICAgKTtcbiAgICBpZiAoZGVzY3JpcHRvcikge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRlcml2ZWRDdG9yLnByb3RvdHlwZSwgbmFtZSwgZGVzY3JpcHRvcik7XG4gICAgfVxuICB9KTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBhcnJheUNvbXBhcmUoYXJyYXkxOiBhbnlbXSwgYXJyYXkyOiBhbnlbXSk6IGJvb2xlYW4ge1xuICBhcnJheTEgPSBBcnJheS5mcm9tKGFycmF5MSk7XG4gIGFycmF5MiA9IEFycmF5LmZyb20oYXJyYXkyKTtcbiAgcmV0dXJuIChcbiAgICBhcnJheTEubGVuZ3RoID09PSBhcnJheTIubGVuZ3RoICYmXG4gICAgYXJyYXkxLnNvcnQoKS5ldmVyeShmdW5jdGlvbiAodmFsdWUsIGluZGV4KSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IGFycmF5Mi5zb3J0KClbaW5kZXhdO1xuICAgIH0pXG4gICk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gYXJyYXlVbmlxdWU8VCA9IGFueT4oYXJyOiBUW10pOiBUW10ge1xuICByZXR1cm4gYXJyLmZpbHRlcigoZWxlbSwgcG9zLCBhcnIpID0+IHtcbiAgICByZXR1cm4gYXJyLmluZGV4T2YoZWxlbSkgPT0gcG9zO1xuICB9KTtcbn1cbiIsImV4cG9ydCB7IGFycmF5Q29tcGFyZSB9IGZyb20gJy4vYXJyYXlDb21wYXJlJztcbmV4cG9ydCAqIGZyb20gJy4vYXJyYXlVbmlxdWUnO1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGRlYm91bmNlPFQgZXh0ZW5kcyAoLi4uYXJnczogYW55W10pID0+IHZvaWQ+KFxuICBjYjogVCxcbiAgd2FpdCA9IDEwXG4pOiBUIHtcbiAgbGV0IGggPSAwO1xuICBjb25zdCBjYWxsYWJsZSA9ICguLi5hcmdzOiBhbnkpID0+IHtcbiAgICBjbGVhclRpbWVvdXQoaCk7XG4gICAgaCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IGNiKC4uLmFyZ3MpLCB3YWl0KTtcbiAgfTtcbiAgcmV0dXJuIChjYWxsYWJsZSBhcyBhbnkpIGFzIFQ7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZGVlcG1lcmdlPFQ+KFxuICB4OiBQYXJ0aWFsPFQ+LFxuICB5OiBQYXJ0aWFsPFQ+LFxuICBtZXJnZUFycmF5PzogYm9vbGVhblxuKTogVDtcbmV4cG9ydCBmdW5jdGlvbiBkZWVwbWVyZ2U8VDEsIFQyPihcbiAgdGFyZ2V0OiBQYXJ0aWFsPFQxPixcbiAgc3JjOiBQYXJ0aWFsPFQyPixcbiAgbWVyZ2VBcnJheSA9IGZhbHNlXG4pOiBUMSAmIFQyIHtcbiAgbGV0IHRhcmdldF8gPSB0YXJnZXQgYXMgYW55O1xuICBjb25zdCBzcmNfID0gc3JjIGFzIGFueTtcbiAgY29uc3QgYXJyYXkgPSBBcnJheS5pc0FycmF5KHNyY18pO1xuICBsZXQgZHN0OiBhbnkgPSAoYXJyYXkgJiYgW10pIHx8IHt9O1xuXG4gIGlmIChhcnJheSAmJiBBcnJheS5pc0FycmF5KHNyY18pKSB7XG4gICAgaWYgKG1lcmdlQXJyYXkpIHtcbiAgICAgIHRhcmdldF8gPSB0YXJnZXRfIHx8IFtdO1xuICAgICAgZHN0ID0gZHN0LmNvbmNhdCh0YXJnZXRfKTtcbiAgICAgIHNyY18uZm9yRWFjaCgoZTogYW55LCBpOiBudW1iZXIpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBkc3RbaV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgZHN0W2ldID0gZTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBkc3RbaV0gPSBkZWVwbWVyZ2UodGFyZ2V0X1tpXSwgZSwgbWVyZ2VBcnJheSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRhcmdldF8uaW5kZXhPZihlKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIGRzdC5wdXNoKGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlcGxhY2UgYXJyYXkuIERvIG5vdCBtZXJnZSBieSBkZWZhdWx0XG4gICAgICBkc3QgPSBzcmNfO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAodGFyZ2V0XyAmJiB0eXBlb2YgdGFyZ2V0XyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIE9iamVjdC5rZXlzKHRhcmdldF8pLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBkc3Rba2V5XSA9IHRhcmdldF9ba2V5XTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBPYmplY3Qua2V5cyhzcmNfKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIGlmICh0eXBlb2Ygc3JjX1trZXldICE9PSAnb2JqZWN0JyB8fCAhc3JjX1trZXldKSB7XG4gICAgICAgIGRzdFtrZXldID0gc3JjX1trZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXRfW2tleV0gPT09ICdvYmplY3QnICYmIHR5cGVvZiBzcmNfW2tleV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgZHN0W2tleV0gPSBkZWVwbWVyZ2UodGFyZ2V0X1trZXldLCBzcmNfW2tleV0sIG1lcmdlQXJyYXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRzdFtrZXldID0gc3JjX1trZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGRzdDtcbn1cbiIsIi8qKlxuICogZnJvbSBodHRwczovL2dpdGh1Yi5jb20vQ2VzaXVtR1MvY2VzaXVtL2Jsb2IvbWFzdGVyL1NvdXJjZS9Db3JlL2RlZmluZWQuanNcbiAqXG4gKiBAZXhwb3J0cyBkZWZpbmVkXG4gKlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgb2JqZWN0LlxuICogQHJldHVybnMge0Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiB0aGUgb2JqZWN0IGlzIGRlZmluZWQsIHJldHVybnMgZmFsc2Ugb3RoZXJ3aXNlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpZiAoZGVmaW5lZChwb3NpdGlvbnMpKSB7XG4gKiAgICAgIGRvU29tZXRoaW5nKCk7XG4gKiB9IGVsc2Uge1xuICogICAgICBkb1NvbWV0aGluZ0Vsc2UoKTtcbiAqIH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZWQodmFsdWU6IHVua25vd24pOiBib29sZWFuIHtcbiAgcmV0dXJuIHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGw7XG59XG4iLCJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG5leHBvcnQgY2xhc3MgRXZlbnRzPEUgPSBhbnk+IHtcbiAgcHJpdmF0ZSByZWFkb25seSBfZXZlbnRzU3RhdHVzOiB7IFtrZXkgaW4ga2V5b2YgRV0/OiBib29sZWFuIH0gPSB7fTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVtaXR0ZXI6IEV2ZW50RW1pdHRlcikge31cblxuICBzZXRFdmVudFN0YXR1cyhldmVudDoga2V5b2YgRSwgc3RhdHVzOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5fZXZlbnRzU3RhdHVzW2V2ZW50XSA9IHN0YXR1cztcbiAgfVxuXG4gIG9uTG9hZChldmVudDoga2V5b2YgRSB8IChrZXlvZiBFKVtdKTogUHJvbWlzZTx0aGlzPiB7XG4gICAgY29uc3QgZXZlbnRzOiAoa2V5b2YgRSlbXSA9IEFycmF5LmlzQXJyYXkoZXZlbnQpID8gZXZlbnQgOiBbZXZlbnRdO1xuICAgIGNvbnN0IHByb21pc2VzID0gZXZlbnRzLm1hcChcbiAgICAgICh4KSA9PlxuICAgICAgICBuZXcgUHJvbWlzZSgocmVzKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuZ2V0RXZlbnRTdGF0dXMoeCkpIHtcbiAgICAgICAgICAgIHJlcyh0aGlzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZSA9IHggYXMgc3RyaW5nIHwgc3ltYm9sO1xuICAgICAgICAgICAgdGhpcy5lbWl0dGVyLm9uY2UoZSwgKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnNldEV2ZW50U3RhdHVzKHgsIHRydWUpO1xuICAgICAgICAgICAgICByZXModGhpcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgKTtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4gdGhpcyk7XG4gIH1cblxuICBnZXRFdmVudFN0YXR1cyhldmVudDoga2V5b2YgRSk6IGJvb2xlYW4ge1xuICAgIC8vIHVnbHkgaGFjayB0byBkaXNhYmxlIHR5cGUgY2hlY2tpbmcgZXJyb3JcbiAgICBjb25zdCBfZXZlbnROYW1lID0gZXZlbnQgYXMga2V5b2YgRTtcbiAgICBjb25zdCBzdGF0dXMgPSB0aGlzLl9ldmVudHNTdGF0dXNbX2V2ZW50TmFtZV07XG4gICAgcmV0dXJuIHN0YXR1cyAhPT0gdW5kZWZpbmVkID8gISFzdGF0dXMgOiBmYWxzZTtcbiAgfVxufVxuIiwiZXhwb3J0ICogZnJvbSAnLi9wbGF0Zm9ybSc7XG5cbmV4cG9ydCAqIGZyb20gJy4vZXZlbnRzJztcbmV4cG9ydCAqIGZyb20gJy4vYXJyYXknO1xuZXhwb3J0ICogZnJvbSAnLi9vYmplY3QnO1xuZXhwb3J0ICogZnJvbSAnLi9zdHJpbmcnO1xuZXhwb3J0ICogZnJvbSAnLi9yZSc7XG5leHBvcnQgKiBmcm9tICcuL3VybCc7XG5leHBvcnQgKiBmcm9tICcuL3NsZWVwJztcbmV4cG9ydCAqIGZyb20gJy4vZGVmaW5lZCc7XG5leHBvcnQgKiBmcm9tICcuL3R5cGVIZWxwZXJzJztcbmV4cG9ydCAqIGZyb20gJy4vYXBwbHlNaXhpbnMnO1xuZXhwb3J0ICogZnJvbSAnLi9kZWVwbWVyZ2UnO1xuZXhwb3J0ICogZnJvbSAnLi9kZWJvdW5jZSc7XG5leHBvcnQgKiBmcm9tICcuL0NsaXBib2FyZCc7XG4vKipcbiAqIEdpdmVuIGFuIGFycmF5IG9mIG1lbWJlciBmdW5jdGlvbiBuYW1lcyBhcyBzdHJpbmdzLCByZXBsYWNlIGFsbCBvZiB0aGVtXG4gKiB3aXRoIGJvdW5kIHZlcnNpb25zIHRoYXQgd2lsbCBhbHdheXMgcmVmZXIgdG8gYGNvbnRleHRgIGFzIGB0aGlzYC4gVGhpc1xuICogaXMgdXNlZnVsIGZvciBjbGFzc2VzIHdoZXJlIG90aGVyd2lzZSBldmVudCBiaW5kaW5ncyB3b3VsZCByZWFzc2lnblxuICogYHRoaXNgIHRvIHRoZSBldmVudGVkIG9iamVjdCBvciBzb21lIG90aGVyIHZhbHVlOiB0aGlzIGxldHMgeW91IGVuc3VyZVxuICogdGhlIGB0aGlzYCB2YWx1ZSBhbHdheXMuXG4gKiBUYWtlbiBmcm9tOiBodHRwczovL2dpdGh1Yi5jb20vbWFwYm94L21hcGJveC1nbC1qcy9ibG9iL3YxLjAuMC9zcmMvdXRpbC91dGlsLmpzI0wyNDNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRBbGwoXG4gIGZuczogc3RyaW5nW10sXG4gIGNvbnRleHQ6IHsgW21ldGhvZDogc3RyaW5nXTogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkgfVxuKTogdm9pZCB7XG4gIGZucy5mb3JFYWNoKChmbikgPT4ge1xuICAgIGlmICghY29udGV4dFtmbl0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29udGV4dFtmbl0gPSBjb250ZXh0W2ZuXS5iaW5kKGNvbnRleHQpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KHZhbDogdW5rbm93bik6IHZhbCBpcyBSZWNvcmQ8c3RyaW5nIHwgbnVtYmVyLCBhbnk+IHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBPYmplY3RdJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkodmFsOiB1bmtub3duKTogYm9vbGVhbiB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBhc3NpZ248VCwgVT4odGFyZ2V0OiBULCBzb3VyY2U6IFUpOiBUICYgVTtcblxuLyoqXG4gKiBDb3B5IHRoZSB2YWx1ZXMgb2YgYWxsIG9mIHRoZSBlbnVtZXJhYmxlIG93biBwcm9wZXJ0aWVzIGZyb20gb25lIG9yIG1vcmUgc291cmNlIG9iamVjdHMgdG8gYVxuICogdGFyZ2V0IG9iamVjdC4gUmV0dXJucyB0aGUgdGFyZ2V0IG9iamVjdC5cbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3QgdG8gY29weSB0by5cbiAqIEBwYXJhbSBzb3VyY2UxIFRoZSBmaXJzdCBzb3VyY2Ugb2JqZWN0IGZyb20gd2hpY2ggdG8gY29weSBwcm9wZXJ0aWVzLlxuICogQHBhcmFtIHNvdXJjZTIgVGhlIHNlY29uZCBzb3VyY2Ugb2JqZWN0IGZyb20gd2hpY2ggdG8gY29weSBwcm9wZXJ0aWVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYXNzaWduPFQsIFUsIFY+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogVik6IFQgJiBVICYgVjtcblxuLyoqXG4gKiBDb3B5IHRoZSB2YWx1ZXMgb2YgYWxsIG9mIHRoZSBlbnVtZXJhYmxlIG93biBwcm9wZXJ0aWVzIGZyb20gb25lIG9yIG1vcmUgc291cmNlIG9iamVjdHMgdG8gYVxuICogdGFyZ2V0IG9iamVjdC4gUmV0dXJucyB0aGUgdGFyZ2V0IG9iamVjdC5cbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3QgdG8gY29weSB0by5cbiAqIEBwYXJhbSBzb3VyY2UxIFRoZSBmaXJzdCBzb3VyY2Ugb2JqZWN0IGZyb20gd2hpY2ggdG8gY29weSBwcm9wZXJ0aWVzLlxuICogQHBhcmFtIHNvdXJjZTIgVGhlIHNlY29uZCBzb3VyY2Ugb2JqZWN0IGZyb20gd2hpY2ggdG8gY29weSBwcm9wZXJ0aWVzLlxuICogQHBhcmFtIHNvdXJjZTMgVGhlIHRoaXJkIHNvdXJjZSBvYmplY3QgZnJvbSB3aGljaCB0byBjb3B5IHByb3BlcnRpZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhc3NpZ248VCwgVSwgViwgVz4oXG4gIHRhcmdldDogVCxcbiAgc291cmNlMTogVSxcbiAgc291cmNlMjogVixcbiAgc291cmNlMzogV1xuKTogVCAmIFUgJiBWICYgVztcblxuLyoqXG4gKiBDb3B5IHRoZSB2YWx1ZXMgb2YgYWxsIG9mIHRoZSBlbnVtZXJhYmxlIG93biBwcm9wZXJ0aWVzIGZyb20gb25lIG9yIG1vcmUgc291cmNlIG9iamVjdHMgdG8gYVxuICogdGFyZ2V0IG9iamVjdC4gUmV0dXJucyB0aGUgdGFyZ2V0IG9iamVjdC5cbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3QgdG8gY29weSB0by5cbiAqIEBwYXJhbSBzb3VyY2VzIE9uZSBvciBtb3JlIHNvdXJjZSBvYmplY3RzIGZyb20gd2hpY2ggdG8gY29weSBwcm9wZXJ0aWVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhc3NpZ24oXG4gIHRhcmdldDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gIC4uLnNvdXJjZXM6IGFueVtdXG4pOiBhbnkge1xuICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgZm9yIChjb25zdCBwcm9wIG9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZSkpIHtcbiAgICAgICh0YXJnZXQgYXMgYW55KVtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IGFzc2lnbiBhcyBvYmplY3RBc3NpZ24gfSBmcm9tICcuL2Fzc2lnbic7XG5cbmV4cG9ydCB7IG9iamVjdEFzc2lnbiB9O1xuIiwiZXhwb3J0IGNvbnN0IGlzQnJvd3NlciA9XG4gIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnO1xuXG5leHBvcnQgY29uc3QgdHlwZTogJ2Jyb3dzZXInIHwgJ25vZGUnID0gaXNCcm93c2VyID8gJ2Jyb3dzZXInIDogJ25vZGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0R2xvYmFsVmFyaWFibGUoKTogYW55IHtcbiAgaWYgKGlzQnJvd3Nlcikge1xuICAgIHJldHVybiB3aW5kb3c7XG4gIH0gZWxzZSB7XG4gICAgLy8gTmF0aXZlU2NyaXB0IHVzZXMgZ2xvYmFsLCBub3Qgd2luZG93XG4gICAgcmV0dXJuIGdsb2JhbDtcbiAgfVxufVxuIiwiZXhwb3J0ICogZnJvbSAnLi9yZUVzY2FwZSc7XG4iLCJleHBvcnQgZnVuY3Rpb24gcmVFc2NhcGUoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHMucmVwbGFjZSgvWy0vXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHNsZWVwKGRlbGF5ID0gMCk6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgc3RyID0gU3RyaW5nKHN0cikudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIHN0clswXS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xufVxuIiwiZXhwb3J0ICogZnJvbSAnLi9jYXBpdGFsaXplJztcbmV4cG9ydCAqIGZyb20gJy4vbnVtYmVyV2l0aFNwYWNlcyc7XG4iLCJleHBvcnQgZnVuY3Rpb24gbnVtYmVyV2l0aFNwYWNlcyh4OiBudW1iZXIpOiBzdHJpbmcge1xuICBjb25zdCBwYXJ0cyA9IHgudG9TdHJpbmcoKS5zcGxpdCgnLicpO1xuICBwYXJ0c1swXSA9IHBhcnRzWzBdLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csICcgJyk7XG4gIHJldHVybiBwYXJ0cy5qb2luKCcuJyk7XG59XG4iLCJleHBvcnQgKiBmcm9tICcuL0RlZXBQYXJ0aWFsJztcbmV4cG9ydCAqIGZyb20gJy4vVHlwZSc7XG4iLCJleHBvcnQgZnVuY3Rpb24gZml4VXJsU3RyKHVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgLy8gcmVtb3ZlIGRvdWJsZSBzbGFzaFxuICByZXR1cm4gdXJsLnJlcGxhY2UoLyhbXjpdXFwvKVxcLysvZywgJyQxJyk7XG59XG4iLCIvKipcbiAqIEBwcml2YXRlUmVtYXJrc1xuICogU2luY2UgaXQgd2FzIG5vdCBwb3NzaWJsZSB0byBzcGxpdCB0aGUgY29kZSB0aHJvdWdoIG1peGlucywgaW5oZXJpdGFuY2Ugd2FzIHVzZWQuXG4gKiBUaGUgYHRzLW1peGluYCBwbHVnaW4gd29ya2VkIGZpbmUsIGJ1dCBsZWQgdG8gZXJyb3JzIGluIElFLlxuICpcbiAqIE5vdyBpbmhlcml0YW5jZSBpcyBhcyBmb2xsb3c6XG4gKiBCYXNlV2ViTWFwID4gV2ViTWFwTGF5ZXJzID4gV2ViTWFwXG4gKlxuICogV2lsbCBuZWVkIHRvIGJlIGRvbmUgdGhpcyB3YXk6XG4gKiBjbGFzcyBXZWJNYXAgZXh0ZW5kIG1peGluKFdlYk1hcExheWVycywgV2ViTWFwQ29udHJvbHMpIHt9XG4gKlxuICogVGhpcyBhcHByb2FjaCBjYW4gYWxzbyBiZSBjb25zaWRlcmVkXG4gKlxuICogY2xhc3MgV2ViTWFwIHtcbiAqICAgbGF5ZXJzOiBXZWJNYXBMYXllcnM7XG4gKiAgIGNvbnRyb2xzICBXZWJNYXBDb250cm9sc1xuICogfVxuICpcbiAqIGFuZCB0aGVuXG4gKlxuICogY29uc3Qgd2ViTWFwID0gbmV3IFdlYk1hcCguLi4pO1xuICogd2ViTWFwLmxheWVycy5hZGRMYXllciguLi4pXG4gKlxuICogbG9va3MgZ29vZCwgYnV0IHdpbGwgYWRkIGRpZmZpY3VsdHkgaW4gaW5oZXJpdGluZyBmcm9tIFdlYk1hcFxuICpcbiAqIG9sZDpcbiAqXG4gKiBjbGFzcyBOZ3dNYXAgZXh0ZW5kcyBXZWJNYXAge1xuICogICBhZGRMYXllciguLi4pIHtcbiAqICAgICAgc3VwZXIuYWRkTGF5ZXIoLi4uKVxuICogICB9XG4gKiB9XG4gKlxuICogbmV3OlxuICpcbiAqIGNsYXNzIE5nd0xheWVycyBleHRlbmRzIFdlYk1hcExheWVycyB7XG4gKiAgIGFkZExheWVyKC4uLikge1xuICogICAgIHN1cGVyLmFkZExheWVyKC4uLilcbiAqICAgfVxuICogfVxuICpcbiAqIGNsYXNzIE5nd01hcCBleHRlbmRzIFdlYk1hcCB7XG4gKiAgIGxheWVyc0NsYXNzID0gTmd3TGF5ZXJzXG4gKiB9XG4gKlxuICogLi4uYW5kIHRoZXJlIHdpbGwgYmUgY29tcGF0aWJpbGl0eSBpc3N1ZXNcbiAqL1xuXG5pbXBvcnQgeyBXZWJNYXBFdmVudHMgfSBmcm9tICcuL2ludGVyZmFjZXMvRXZlbnRzJztcblxuaW1wb3J0IHsgV2ViTWFwTGF5ZXJzIH0gZnJvbSAnLi9XZWJNYXBMYXllcnMnO1xuaW1wb3J0IHsgV2ViTWFwTWFpbiB9IGZyb20gJy4vV2ViTWFwTWFpbic7XG5pbXBvcnQgeyBXZWJNYXBDb250cm9scyB9IGZyb20gJy4vV2ViTWFwQ29udHJvbHMnO1xuXG4vKipcbiAqIFRoZSBjb3JlIGNvbXBvbmVudCBmb3IgbWFuYWdpbmcgbWFwIGFkYXB0ZXJzLlxuICogSXQgY29udGFpbnMgbWV0aG9kcyBmb3IgYWRkaW5nIGFuZCBtYW5pcHVsYXRpb24gd2l0aFxuICoge0BsaW5rIFdlYk1hcE1haW4gfCBtYXB9LCB7QGxpbmsgV2ViTWFwTGF5ZXJzIHwgbGF5ZXJzfSBhbmQge0BsaW5rIFdlYk1hcENvbnRyb2xzIHwgY29udHJvbHN9LlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBqc1xuICogaW1wb3J0IFdlYk1hcCBmcm9tICdAbmV4dGdpcy93ZWJtYXAnO1xuICogaW1wb3J0IE1hcEFkYXB0ZXIgZnJvbSAnQG5leHRnaXMvb2wtbWFwLWFkYXB0ZXInO1xuICpcbiAqIGNvbnN0IHdlYk1hcCA9IG5ldyBXZWJNYXAoe1xuICogICBtYXBBZGFwdGVyOiBuZXcgTWFwQWRhcHRlcigpLFxuICogICBtYXBPcHRpb25zOiB7IHRhcmdldDogJ21hcCcgfSxcbiAqIH0pO1xuICogYGBgXG4gKlxuICogQHR5cGVQYXJhbSBNIC0gSW50ZXJhY3RpdmUgTWFwIHVzZWQgaW4gdGhlIGFkYXB0ZXJcbiAqIEB0eXBlUGFyYW0gTCAtIExheWVyXG4gKiBAdHlwZVBhcmFtIEMgLSBDb250cm9sXG4gKiBAdHlwZVBhcmFtIEUgLSBFdmVudHNcbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjbGFzcyBXZWJNYXA8XG4gIE0gPSBhbnksXG4gIEwgPSBhbnksXG4gIEMgPSBhbnksXG4gIEUgZXh0ZW5kcyBXZWJNYXBFdmVudHMgPSBXZWJNYXBFdmVudHNcbj4gZXh0ZW5kcyBXZWJNYXBDb250cm9sczxNLCBMLCBDLCBFPlxuICBpbXBsZW1lbnRzIFdlYk1hcENvbnRyb2xzLCBXZWJNYXBMYXllcnMsIFdlYk1hcE1haW4ge1xuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcm90ZWN0ZWQgYXN5bmMgX2FkZExheWVyUHJvdmlkZXJzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRyeSB7XG4gICAgICBmb3IgYXdhaXQgKGNvbnN0IGtpdCBvZiB0aGlzLl9zdGFydGVyS2l0cykge1xuICAgICAgICBpZiAoa2l0LmdldExheWVyQWRhcHRlcnMpIHtcbiAgICAgICAgICBjb25zdCBhZGFwdGVycyA9IGF3YWl0IGtpdC5nZXRMYXllckFkYXB0ZXJzLmNhbGwoa2l0KTtcbiAgICAgICAgICBpZiAoYWRhcHRlcnMpIHtcbiAgICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgYWRhcHRlciBvZiBhZGFwdGVycykge1xuICAgICAgICAgICAgICBjb25zdCBuZXdBZGFwdGVyID0gYXdhaXQgYWRhcHRlci5jcmVhdGVBZGFwdGVyKHRoaXMpO1xuICAgICAgICAgICAgICBpZiAobmV3QWRhcHRlcikge1xuICAgICAgICAgICAgICAgIHRoaXMubWFwQWRhcHRlci5sYXllckFkYXB0ZXJzW2FkYXB0ZXIubmFtZV0gPSBuZXdBZGFwdGVyO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihlcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJvdGVjdGVkIGFzeW5jIF9vbkxvYWRTeW5jKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGZvciBhd2FpdCAoY29uc3Qga2l0IG9mIHRoaXMuX3N0YXJ0ZXJLaXRzKSB7XG4gICAgICBpZiAoa2l0Lm9uTG9hZFN5bmMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhd2FpdCBraXQub25Mb2FkU3luYy5jYWxsKGtpdCwgdGhpcyk7XG4gICAgICAgIH0gY2F0Y2ggKGVyKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IFdlYk1hcEV2ZW50cyB9IGZyb20gJy4vaW50ZXJmYWNlcy9FdmVudHMnO1xuXG5pbXBvcnQge1xuICBNYXBDb250cm9sLFxuICBDcmVhdGVDb250cm9sT3B0aW9ucyxcbiAgQnV0dG9uQ29udHJvbE9wdGlvbnMsXG4gIFRvZ2dsZUNvbnRyb2xPcHRpb25zLFxuICBUb2dnbGVDb250cm9sLFxuICBNYXBDb250cm9scyxcbn0gZnJvbSAnLi9pbnRlcmZhY2VzL01hcENvbnRyb2wnO1xuXG5pbXBvcnQgeyBDb250cm9sUG9zaXRpb24gfSBmcm9tICcuL2ludGVyZmFjZXMvTWFwQWRhcHRlcic7XG5pbXBvcnQgeyBXZWJNYXBMYXllcnMgfSBmcm9tICcuL1dlYk1hcExheWVycyc7XG5pbXBvcnQgeyBXZWJNYXBNYWluIH0gZnJvbSAnLi9XZWJNYXBNYWluJztcbmltcG9ydCB7IGNyZWF0ZVRvZ2dsZUNvbnRyb2wgfSBmcm9tICcuL2NvbXBvbmVudHMvY29udHJvbHMvY3JlYXRlVG9nZ2xlQ29udHJvbCc7XG5cbi8qKlxuICogQ29sbGVjdGlvbiBvZiBtZXRob2RzIGZvciBtYW5hZ2luZyBtYXAgY29udHJvbHNcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIFdlYk1hcENvbnRyb2xzPFxuICBNID0gYW55LFxuICBMID0gYW55LFxuICBDID0gYW55LFxuICBFIGV4dGVuZHMgV2ViTWFwRXZlbnRzID0gV2ViTWFwRXZlbnRzXG4+IGV4dGVuZHMgV2ViTWFwTGF5ZXJzPE0sIEwsIEMsIEU+IGltcGxlbWVudHMgV2ViTWFwTGF5ZXJzLCBXZWJNYXBNYWluIHtcbiAgc3RhdGljIGNvbnRyb2xzOiB7XG4gICAgW25hbWU6IHN0cmluZ106ICh3ZWJNYXA6IFdlYk1hcENvbnRyb2xzLCBvcHRpb25zPzogYW55KSA9PiBhbnk7XG4gIH0gPSB7XG4gICAgQ09OVFJPTDogKFxuICAgICAgd2ViTWFwOiBXZWJNYXBDb250cm9scyxcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgY29udHJvbDogTWFwQ29udHJvbDtcbiAgICAgICAgb3B0aW9ucz86IENyZWF0ZUNvbnRyb2xPcHRpb25zO1xuICAgICAgfVxuICAgICkgPT4ge1xuICAgICAgcmV0dXJuIHdlYk1hcC5jcmVhdGVDb250cm9sKG9wdGlvbnMuY29udHJvbCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgICB9LFxuICAgIEJVVFRPTjogKHdlYk1hcDogV2ViTWFwQ29udHJvbHMsIG9wdGlvbnM6IEJ1dHRvbkNvbnRyb2xPcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gd2ViTWFwLmNyZWF0ZUJ1dHRvbkNvbnRyb2wob3B0aW9ucyk7XG4gICAgfSxcbiAgICBUT0dHTEU6ICh3ZWJNYXA6IFdlYk1hcENvbnRyb2xzLCBvcHRpb25zOiBUb2dnbGVDb250cm9sT3B0aW9ucykgPT4ge1xuICAgICAgcmV0dXJuIHdlYk1hcC5jcmVhdGVUb2dnbGVDb250cm9sKG9wdGlvbnMpO1xuICAgIH0sXG4gIH07XG5cbiAgcHJpdmF0ZSBfbG9hZENvbnRyb2xRdWV1ZToge1xuICAgIFtrZXkgaW4gQ29udHJvbFBvc2l0aW9uXTogKCgpID0+IFByb21pc2U8YW55PilbXTtcbiAgfSA9IHtcbiAgICAndG9wLXJpZ2h0JzogW10sXG4gICAgJ2JvdHRvbS1yaWdodCc6IFtdLFxuICAgICd0b3AtbGVmdCc6IFtdLFxuICAgICdib3R0b20tbGVmdCc6IFtdLFxuICB9O1xuICBwcml2YXRlIF9pc0NvbnRyb2xMb2FkaW5nOiB7IFtrZXkgaW4gQ29udHJvbFBvc2l0aW9uXTogYm9vbGVhbiB9ID0ge1xuICAgICd0b3AtcmlnaHQnOiBmYWxzZSxcbiAgICAnYm90dG9tLXJpZ2h0JzogZmFsc2UsXG4gICAgJ3RvcC1sZWZ0JzogZmFsc2UsXG4gICAgJ2JvdHRvbS1sZWZ0JzogZmFsc2UsXG4gIH07XG5cbiAgYXN5bmMgYWRkQ29udHJvbDxLIGV4dGVuZHMga2V5b2YgTWFwQ29udHJvbHM+KFxuICAgIGNvbnRyb2xEZWY6IEsgfCBDLFxuICAgIHBvc2l0aW9uOiBDb250cm9sUG9zaXRpb24sXG4gICAgb3B0aW9ucz86IE1hcENvbnRyb2xzW0tdXG4gICk6IFByb21pc2U8YW55PiB7XG4gICAgbGV0IGNvbnRyb2w6IEMgfCB1bmRlZmluZWQ7XG4gICAgcG9zaXRpb24gPSBwb3NpdGlvbiA/PyAndG9wLWxlZnQnO1xuICAgIGlmICh0eXBlb2YgY29udHJvbERlZiA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnRyb2wgPSB0aGlzLmdldENvbnRyb2woY29udHJvbERlZiwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRyb2wgPSBjb250cm9sRGVmIGFzIEM7XG4gICAgfVxuICAgIGlmIChjb250cm9sKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2U8KCkgPT4gUHJvbWlzZTxhbnk+PigocmVzb2x2ZSkgPT4ge1xuICAgICAgICBjb25zdCBwcm9taXNlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IF9jb250cm9sID0gYXdhaXQgY29udHJvbDtcbiAgICAgICAgICBjb25zdCBjID0gdGhpcy5tYXBBZGFwdGVyLmFkZENvbnRyb2woX2NvbnRyb2wsIHBvc2l0aW9uKTtcbiAgICAgICAgICByZXNvbHZlKGMpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9zZXRDb250cm9sUXVldWUocG9zaXRpb24sIHByb21pc2UpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0aW5nIGEgdW5pdmVyc2FsIG1hcCBsYXlvdXQgY29udHJvbCBlbGVtZW50LiBDYW4gYmUgdXNlZCB3aXRoIGFueSBtYXAgYWRhcHRlci5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY29uc3QgY29udHJvbCA9IHdlYk1hcC5jcmVhdGVDb250cm9sKHtcbiAgICogICBvbkFkZCgpIHtcbiAgICogICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICogICB9XG4gICAqIH0pO1xuICAgKi9cbiAgYXN5bmMgY3JlYXRlQ29udHJvbChcbiAgICBjb250cm9sOiBNYXBDb250cm9sLFxuICAgIG9wdGlvbnM/OiBDcmVhdGVDb250cm9sT3B0aW9uc1xuICApOiBQcm9taXNlPEMgfCB1bmRlZmluZWQ+IHtcbiAgICBhd2FpdCB0aGlzLm9uTG9hZCgnYnVpbGQtbWFwJyk7XG4gICAgaWYgKHRoaXMubWFwQWRhcHRlci5jcmVhdGVDb250cm9sKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXBBZGFwdGVyLmNyZWF0ZUNvbnRyb2woY29udHJvbCwgb3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgY3JlYXRlQnV0dG9uQ29udHJvbChcbiAgICBvcHRpb25zOiBCdXR0b25Db250cm9sT3B0aW9uc1xuICApOiBQcm9taXNlPEMgfCB1bmRlZmluZWQ+IHtcbiAgICBhd2FpdCB0aGlzLm9uTG9hZCgnYnVpbGQtbWFwJyk7XG4gICAgaWYgKHRoaXMubWFwQWRhcHRlci5jcmVhdGVCdXR0b25Db250cm9sKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXBBZGFwdGVyLmNyZWF0ZUJ1dHRvbkNvbnRyb2wob3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbnkgdG9nZ2xlciBjb250cm9sIGJ1dHRvblxuICAgKiBAcGFyYW0gb3B0aW9ucyAtIE9wdGlvbnMgZm9yIGNvbnRyb2wgbGF5b3V0IGN1c3RvbWl6YXRpb24gYW5kIGFzc2lnbmluZyBhIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGBgYGpzXG4gICAqIGNvbnN0IHRvZ2dsZUNvbnRyb2wgPSBuZ3dNYXAuY3JlYXRlVG9nZ2xlQ29udHJvbCh7XG4gICAqICAgZ2V0U3RhdHVzOiAoKSA9PiB3ZWJNYXAuaXNMYXllclZpc2libGUoJ2FueS1sYXllci1pZCcpLFxuICAgKiAgIG9uQ2xpY2s6IChzdGF0dXMpID0+IG5nd01hcC50b2dnbGVMYXllcignd2VibWFwJywgc3RhdHVzKSxcbiAgICogICBodG1sOiB7XG4gICAqICAgICBvbjogJ09OJyxcbiAgICogICAgIG9mZjogJ09GRidcbiAgICogICB9LFxuICAgKiAgIHRpdGxlOiAnVG9nZ2xlIGxheWVyIHZpc2liaWxpdHknXG4gICAqIH0pO1xuICAgKiB3ZWJNYXAuYWRkQ29udHJvbCh0b2dnbGVDb250cm9sLCAndG9wLXJpZ2h0Jyk7XG4gICAqIGBgYFxuICAgKiB7QGxpbmsgaHR0cDovL2NvZGUubmV4dGdpcy5jb20vZGVtby1leGFtcGxlcy10b2dnbGVfY29udHJvbCB8IFRvZ2dsZSBidXR0b24gY29udHJvbCBleGFtcGxlfVxuICAgKiBAcHVibGljXG4gICAqL1xuICBhc3luYyBjcmVhdGVUb2dnbGVDb250cm9sKFxuICAgIG9wdGlvbnM6IFRvZ2dsZUNvbnRyb2xPcHRpb25zXG4gICk6IFByb21pc2U8KEMgJiBUb2dnbGVDb250cm9sKSB8IHVuZGVmaW5lZD4ge1xuICAgIGF3YWl0IHRoaXMub25Mb2FkKCdidWlsZC1tYXAnKTtcbiAgICBpZiAodGhpcy5tYXBBZGFwdGVyLmNyZWF0ZVRvZ2dsZUNvbnRyb2wpIHtcbiAgICAgIHJldHVybiB0aGlzLm1hcEFkYXB0ZXIuY3JlYXRlVG9nZ2xlQ29udHJvbChvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMubWFwQWRhcHRlci5jcmVhdGVCdXR0b25Db250cm9sKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVUb2dnbGVDb250cm9sPEM+KFxuICAgICAgICAgIHRoaXMubWFwQWRhcHRlci5jcmVhdGVCdXR0b25Db250cm9sLFxuICAgICAgICAgIG9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIGNvbnRyb2wgLSBJbnN0YW5jZSBvZiBXRUItR0lTIGZyYW1ld29yayBjb250cm9sLlxuICAgKiAgICAgICAgICAgICAgICAgIFdoYXQgaXMgcmV0dXJuZWQgYnkgdGhlIHtATGluayBXZWJNYXBDb250cm9scy5jcmVhdGVDb250cm9sIHwgY3JlYXRlfSBtZXRob2RcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcmVtb3ZlQ29udHJvbChjb250cm9sOiBDKTogdm9pZCB7XG4gICAgaWYgKCdyZW1vdmUnIGluIGNvbnRyb2wpIHtcbiAgICAgIC8vIEB0cy1pZ25vcmUgVE9ETzogdWdseSBjb2RlLCByZXdyaXRlXG4gICAgICBjb250cm9sLnJlbW92ZSgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tYXBBZGFwdGVyLnJlbW92ZUNvbnRyb2wpIHtcbiAgICAgIHRoaXMubWFwQWRhcHRlci5yZW1vdmVDb250cm9sKGNvbnRyb2wpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgaW5zdGFuY2Ugb2YgcmVnaXN0ZXJlZCBjb250cm9sXG4gICAqIEBwYXJhbSBjb250cm9sIC0gQW55IHJlZ2lzdGVyZWQgY29udHJvbCBzdHJpbmcgbmFtZVxuICAgKiBAcGFyYW0gb3B0aW9ucyAtIEN1c3RvbSBjb250cm9sIG9wdGlvbnNcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgZ2V0Q29udHJvbDxLIGV4dGVuZHMga2V5b2YgTWFwQ29udHJvbHM+KFxuICAgIGNvbnRyb2w6IEssXG4gICAgb3B0aW9ucz86IE1hcENvbnRyb2xzW0tdXG4gICk6IEMgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IGVuZ2luZSA9IHRoaXMubWFwQWRhcHRlci5jb250cm9sQWRhcHRlcnNbY29udHJvbF07XG4gICAgaWYgKGVuZ2luZSkge1xuICAgICAgcmV0dXJuIG5ldyBlbmdpbmUob3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNyZWF0ZUZ1biA9IFdlYk1hcENvbnRyb2xzLmNvbnRyb2xzW2NvbnRyb2xdO1xuICAgICAgaWYgKGNyZWF0ZUZ1bikge1xuICAgICAgICByZXR1cm4gY3JlYXRlRnVuKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3NldENvbnRyb2xRdWV1ZShwb3NpdGlvbjogQ29udHJvbFBvc2l0aW9uLCBjYjogKCkgPT4gUHJvbWlzZTxhbnk+KSB7XG4gICAgdGhpcy5fbG9hZENvbnRyb2xRdWV1ZVtwb3NpdGlvbl0ucHVzaChjYik7XG4gICAgaWYgKCF0aGlzLl9pc0NvbnRyb2xMb2FkaW5nW3Bvc2l0aW9uXSkge1xuICAgICAgdGhpcy5fYXBwbHlDb250cm9scyhwb3NpdGlvbik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBfYXBwbHlDb250cm9scyhwb3NpdGlvbjogQ29udHJvbFBvc2l0aW9uKSB7XG4gICAgaWYgKHRoaXMuX2xvYWRDb250cm9sUXVldWVbcG9zaXRpb25dLmxlbmd0aCkge1xuICAgICAgdGhpcy5faXNDb250cm9sTG9hZGluZ1twb3NpdGlvbl0gPSB0cnVlO1xuICAgICAgY29uc3QgY29udHJvbENiID0gdGhpcy5fbG9hZENvbnRyb2xRdWV1ZVtwb3NpdGlvbl1bMF07XG4gICAgICBhd2FpdCBjb250cm9sQ2IoKTtcbiAgICAgIHRoaXMuX2xvYWRDb250cm9sUXVldWVbcG9zaXRpb25dLnNwbGljZSgwLCAxKTtcbiAgICAgIHRoaXMuX2FwcGx5Q29udHJvbHMocG9zaXRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9pc0NvbnRyb2xMb2FkaW5nW3Bvc2l0aW9uXSA9IGZhbHNlO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgRmVhdHVyZSwgR2VvSnNvbk9iamVjdCB9IGZyb20gJ2dlb2pzb24nO1xuaW1wb3J0IHsgcHJlcGFyZVBhaW50IH0gZnJvbSAnQG5leHRnaXMvcGFpbnQnO1xuXG5pbXBvcnQge1xuICBMYXllckFkYXB0ZXIsXG4gIExheWVyQWRhcHRlcnMsXG4gIEFkYXB0ZXJDb25zdHJ1Y3RvcixcbiAgTGF5ZXJBZGFwdGVyc09wdGlvbnMsXG4gIEFkYXB0ZXJPcHRpb25zLFxuICBHZW9Kc29uQWRhcHRlck9wdGlvbnMsXG4gIFZlY3RvckxheWVyQWRhcHRlcixcbiAgRGF0YUxheWVyRmlsdGVyLFxuICBPbkxheWVyQ2xpY2tPcHRpb25zLFxuICBQcm9wZXJ0aWVzRmlsdGVyLFxuICBGaWx0ZXJPcHRpb25zLFxuICBMYXllckRlZmluaXRpb24sXG4gIExheWVyQWRhcHRlckRlZmluaXRpb24sXG4gIE9uTGF5ZXJTZWxlY3RPcHRpb25zLFxuICBNYWluTGF5ZXJBZGFwdGVyLFxufSBmcm9tICcuL2ludGVyZmFjZXMvTGF5ZXJBZGFwdGVyJztcbmltcG9ydCB7IExheWVyRGVmLCBUeXBlIH0gZnJvbSAnLi9pbnRlcmZhY2VzL0Jhc2VUeXBlcyc7XG5cbmltcG9ydCB7IHVwZGF0ZUdlb0pzb25BZGFwdGVyT3B0aW9ucyB9IGZyb20gJy4vdXRpbHMvdXBkYXRlR2VvSnNvbkFkYXB0ZXJPcHRpb25zJztcbmltcG9ydCB7IHByb3BlcnRpZXNGaWx0ZXIgfSBmcm9tICcuL3V0aWxzL3Byb3BlcnRpZXNGaWx0ZXInO1xuaW1wb3J0IHsgV2ViTWFwTWFpbiB9IGZyb20gJy4vV2ViTWFwTWFpbic7XG5cbmltcG9ydCB7XG4gIEdldEF0dHJpYnV0aW9uc09wdGlvbnMsXG4gIFRvZ2dsZUxheWVyT3B0aW9ucyxcbn0gZnJvbSAnLi9pbnRlcmZhY2VzL1dlYk1hcEFwcCc7XG5pbXBvcnQgeyBXZWJNYXBFdmVudHMgfSBmcm9tICcuL2ludGVyZmFjZXMvRXZlbnRzJztcbmltcG9ydCB7IEZpdE9wdGlvbnMgfSBmcm9tICcuL2ludGVyZmFjZXMvTWFwQWRhcHRlcic7XG5cbnR5cGUgQWRkZWRMYXllcnMgPSB7IFtpZDogc3RyaW5nXTogTGF5ZXJBZGFwdGVyIH07XG5cbi8qKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgV2ViTWFwTGF5ZXJzPFxuICBNID0gYW55LFxuICBMID0gYW55LFxuICBDID0gYW55LFxuICBFIGV4dGVuZHMgV2ViTWFwRXZlbnRzID0gV2ViTWFwRXZlbnRzXG4+IGV4dGVuZHMgV2ViTWFwTWFpbjxNLCBMLCBDLCBFPiB7XG4gIHByaXZhdGUgX2xheWVyc0lkQ291bnRlciA9IDE7XG4gIHByaXZhdGUgX2xheWVyc09yZGVyQ291bnRlciA9IDE7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2Jhc2VsYXllcnM6IHN0cmluZ1tdID0gW107XG4gIHByaXZhdGUgcmVhZG9ubHkgX2xheWVyczogQWRkZWRMYXllcnMgPSB7fTtcbiAgcHJpdmF0ZSByZWFkb25seSBfc2VsZWN0ZWRMYXllcnM6IHN0cmluZ1tdID0gW107XG5cbiAgLyoqXG4gICAqIFRyeSB0byBmaXQgbWFwIHZpZXcgYnkgZ2l2ZW4gbGF5ZXIgYm91bmRzLlxuICAgKiBCdXQgbm90IGFsbCBsYXllcnMgaGF2ZSBib3JkZXJzXG4gICAqIEBwYXJhbSBsYXllckRlZlxuICAgKi9cbiAgYXN5bmMgZml0TGF5ZXIobGF5ZXJEZWY6IExheWVyRGVmLCBvcHRpb25zPzogRml0T3B0aW9ucyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGxheWVyID0gdGhpcy5nZXRMYXllcihsYXllckRlZik7XG4gICAgaWYgKGxheWVyICYmIGxheWVyLmdldEV4dGVudCkge1xuICAgICAgY29uc3QgZXh0ZW50ID0gYXdhaXQgbGF5ZXIuZ2V0RXh0ZW50KCk7XG4gICAgICBpZiAoZXh0ZW50KSB7XG4gICAgICAgIHRoaXMuZml0Qm91bmRzKGV4dGVudCwgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGdpdmVuIGxheWVyIGlzIGJhc2VsYXllclxuICAgKiBAcGFyYW0gbGF5ZXJOYW1lIENoZWNrXG4gICAqL1xuICBpc0Jhc2VMYXllcihsYXllckRlZjogTGF5ZXJEZWYpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBsYXllciA9IHRoaXMuZ2V0TGF5ZXIobGF5ZXJEZWYpO1xuICAgIGlmIChsYXllciAmJiBsYXllci5pZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2Jhc2VsYXllcnMuaW5kZXhPZihsYXllci5pZCkgIT09IC0xO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0QmFzZUxheWVycygpOiBMYXllckFkYXB0ZXJbXSB7XG4gICAgY29uc3QgYmFzZWxheWVyczogTGF5ZXJBZGFwdGVyW10gPSBbXTtcbiAgICB0aGlzLl9iYXNlbGF5ZXJzLmZvckVhY2goKHgpID0+IHtcbiAgICAgIGNvbnN0IGJhc2VsYXllciA9IHRoaXMuX2xheWVyc1t4XTtcbiAgICAgIGlmIChiYXNlbGF5ZXIpIHtcbiAgICAgICAgYmFzZWxheWVycy5wdXNoKGJhc2VsYXllcik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGJhc2VsYXllcnM7XG4gIH1cblxuICBnZXRCYXNlTGF5ZXJzSWRzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fYmFzZWxheWVycztcbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgbWV0aG9kIHRvIHJldHVybiBhZGRlZCBsYXllciBvYmplY3QgYnkgYW55IGRlZmluaXRpb24gdHlwZS5cbiAgICovXG4gIGdldExheWVyPExBIGV4dGVuZHMgTGF5ZXJBZGFwdGVyID0gTGF5ZXJBZGFwdGVyPihcbiAgICBsYXllckRlZjogTGF5ZXJEZWZcbiAgKTogTEEgfCB1bmRlZmluZWQge1xuICAgIGlmICh0eXBlb2YgbGF5ZXJEZWYgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbGF5ZXJzW2xheWVyRGVmXSBhcyBMQTtcbiAgICB9XG4gICAgcmV0dXJuIGxheWVyRGVmIGFzIExBO1xuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciBtZXRob2QgdG8gcmV0dXJuIGFkZGVkIGxheWVyIGlkZW50aWZpY2F0b3IgYnkgYW55IGRlZmluaXRpb24gdHlwZS5cbiAgICovXG4gIGdldExheWVySWQobGF5ZXJEZWY6IExheWVyRGVmKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBsYXllciA9IHRoaXMuZ2V0TGF5ZXIobGF5ZXJEZWYpO1xuICAgIGlmIChsYXllciAmJiBsYXllci5vcHRpb25zKSB7XG4gICAgICByZXR1cm4gbGF5ZXIub3B0aW9ucy5pZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBpZCBmb3IgbGF5ZXInKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGFycmF5IG9mIGFsbCBhZGRlZCBsYXllciBpZGVudGlmaWNhdGlvbnMuXG4gICAqL1xuICBnZXRMYXllcnMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLl9sYXllcnMpO1xuICB9XG5cbiAgLy8gVE9ETzogcmVuYW1lIHRvIGdldExheWVycywgZ2V0TGF5ZXJzIHJlbmFtZSB0byBnZXRMYXllcnNJZHNcbiAgYWxsTGF5ZXJzKCk6IEFkZGVkTGF5ZXJzIHtcbiAgICByZXR1cm4gdGhpcy5fbGF5ZXJzO1xuICB9XG5cbiAgZmluZExheWVyPFQgZXh0ZW5kcyBMYXllckFkYXB0ZXIgPSBMYXllckFkYXB0ZXI+KFxuICAgIGZpbHRlcjogKGFkYXB0ZXI6IFQpID0+IGJvb2xlYW5cbiAgKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgZm9yIChjb25zdCBsIGluIHRoaXMuX2xheWVycykge1xuICAgICAgY29uc3QgbGF5ZXJBZGFwdGVyID0gdGhpcy5fbGF5ZXJzW2xdIGFzIFQ7XG4gICAgICBjb25zdCBpc0ZpdCA9IGZpbHRlcihsYXllckFkYXB0ZXIpO1xuICAgICAgaWYgKGlzRml0KSB7XG4gICAgICAgIHJldHVybiBsYXllckFkYXB0ZXI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiBsYXllciBvbiB0aGUgbWFwXG4gICAqL1xuICBpc0xheWVyVmlzaWJsZShsYXllckRlZjogTGF5ZXJEZWYpOiBib29sZWFuIHtcbiAgICBjb25zdCBsYXllciA9IHRoaXMuZ2V0TGF5ZXIobGF5ZXJEZWYpO1xuICAgIHJldHVybiBsYXllciAmJiBsYXllci5vcHRpb25zLnZpc2liaWxpdHkgIT09IHVuZGVmaW5lZFxuICAgICAgPyBsYXllci5vcHRpb25zLnZpc2liaWxpdHlcbiAgICAgIDogZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogU2hvcnRjdXQgbWV0aG9kIHRvIGNyZWF0ZSBiYXNlIGxheWVyXG4gICAqIEBwYXJhbSBhZGFwdGVyXG4gICAqIEBwYXJhbSBvcHRpb25zXG4gICAqL1xuICBhc3luYyBhZGRCYXNlTGF5ZXI8XG4gICAgSyBleHRlbmRzIGtleW9mIExheWVyQWRhcHRlcnMsXG4gICAgTyBleHRlbmRzIEFkYXB0ZXJPcHRpb25zID0gQWRhcHRlck9wdGlvbnNcbiAgPihcbiAgICBhZGFwdGVyOiBLIHwgVHlwZTxMYXllckFkYXB0ZXJzW0tdPixcbiAgICBvcHRpb25zOiBPIHwgTGF5ZXJBZGFwdGVyc09wdGlvbnNbS11cbiAgKTogUHJvbWlzZTxMYXllckFkYXB0ZXI+IHtcbiAgICBjb25zdCBsYXllciA9IGF3YWl0IHRoaXMuYWRkTGF5ZXIoYWRhcHRlciwge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIGJhc2VsYXllcjogdHJ1ZSxcbiAgICB9KTtcblxuICAgIHJldHVybiBsYXllcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RyYXRpb24gb2YgbWFwIGxheWVyLlxuICAgKlxuICAgKiBAcGFyYW0gYWRhcHRlciBUaGUgbmFtZSBvZiBsYXllciBhZGFwdGVyIGZyb20gW01hcEFkYXB0ZXIubGF5ZXJBZGFwdGVyc10od2VibWFwI01hcEFkYXB0ZXIubGF5ZXJBZGFwdGVycykuXG4gICAqICAgICAgICAgICAgICAgIE1heSBiZSBjdXN0b20gb2JqZWN0IG9yIGNsYXNzIGltcGxlbWVudGVkIGJ5IFtNYWluTGF5ZXJBZGFwdGVyXSh3ZWJtYXAjTWFpbkxheWVyQWRhcHRlcikuXG4gICAqIEBwYXJhbSBvcHRpb25zIFNwZWNpZmljIG9wdGlvbnMgZm9yIGdpdmVuIGFkYXB0ZXJcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYGBgamF2YXNjcmlwdFxuICAgKiB3ZWJNYXAuYWRkTGF5ZXIoJ1RJTEUnLCBvcHRpb25zKS50aGVuKChsYXllcikgPT4gd2ViTWFwLnNob3dMYXllcihsYXllcikpO1xuICAgKlxuICAgKiB3ZWJNYXAuYWRkTGF5ZXIoQ3VzdG9tTGF5ZXJBZGFwdGVyLCBvcHRpb25zKTtcbiAgICogYGBgXG4gICAqL1xuICBhc3luYyBhZGRMYXllcjxcbiAgICBLIGV4dGVuZHMga2V5b2YgTGF5ZXJBZGFwdGVycyxcbiAgICBPIGV4dGVuZHMgQWRhcHRlck9wdGlvbnMgPSBBZGFwdGVyT3B0aW9uc1xuICA+KFxuICAgIGFkYXB0ZXI6IExheWVyQWRhcHRlckRlZmluaXRpb248Sz4sXG4gICAgb3B0aW9uczogTyB8IExheWVyQWRhcHRlcnNPcHRpb25zW0tdID0ge30sXG4gICAgb3JkZXI/OiBudW1iZXJcbiAgKTogUHJvbWlzZTxMYXllckFkYXB0ZXI+IHtcbiAgICAvLyBUT0RPOiByZW1vdmUgYmFja3dhcmQgY29tcGF0aWJpbGl0eSBvbiB2IDEuMFxuICAgIG9wdGlvbnMuYmFzZWxheWVyID0gb3B0aW9ucy5iYXNlbGF5ZXIgPz8gb3B0aW9ucy5iYXNlTGF5ZXI7XG5cbiAgICBjb25zdCBpZCA9IHRoaXMuX2xheWVyc0lkQ291bnRlcisrO1xuICAgIGNvbnN0IF9vcmRlciA9XG4gICAgICBvcmRlciAhPT0gdW5kZWZpbmVkXG4gICAgICAgID8gb3JkZXJcbiAgICAgICAgOiBvcHRpb25zLm9yZGVyICE9PSB1bmRlZmluZWRcbiAgICAgICAgPyBvcHRpb25zLm9yZGVyXG4gICAgICAgIDogdGhpcy5yZXNlcnZlT3JkZXIoKTtcbiAgICBsZXQgYWRhcHRlckVuZ2luZTogVHlwZTxMYXllckFkYXB0ZXI+IHwgdW5kZWZpbmVkO1xuICAgIGlmICh0eXBlb2YgYWRhcHRlciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGFkYXB0ZXJFbmdpbmUgPSB0aGlzLmdldExheWVyQWRhcHRlcihhZGFwdGVyKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBhZGFwdGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhZGFwdGVyRW5naW5lID0gYWRhcHRlciBhcyBUeXBlPExheWVyQWRhcHRlcj47XG4gICAgfSBlbHNlIGlmIChcbiAgICAgICd0aGVuJyBpbiAoYWRhcHRlciBhcyBQcm9taXNlPFR5cGU8TGF5ZXJBZGFwdGVyc1tLXT4gfCB1bmRlZmluZWQ+KVxuICAgICkge1xuICAgICAgYWRhcHRlckVuZ2luZSA9IChhd2FpdCBhZGFwdGVyKSBhcyBUeXBlPExheWVyQWRhcHRlcnNbS10+O1xuICAgIH1cblxuICAgIGNvbnN0IGdlb0pzb25PcHRpb25zID0gb3B0aW9ucyBhcyBHZW9Kc29uQWRhcHRlck9wdGlvbnM7XG5cbiAgICB0aGlzLl91cGRhdGVHZW9Kc29uT3B0aW9ucyhnZW9Kc29uT3B0aW9ucyk7XG5cbiAgICBjb25zdCB7IG1heFpvb20sIG1pblpvb20gfSA9IHRoaXMub3B0aW9ucztcblxuICAgIG9wdGlvbnMgPSB7XG4gICAgICBpZDogU3RyaW5nKGlkKSxcbiAgICAgIG9yZGVyOiBfb3JkZXIsXG4gICAgICBtYXhab29tLFxuICAgICAgbWluWm9vbSxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfTtcblxuICAgIC8vIG9wdGlvbnMudmlzaWJpbGl0eSBpcyBhIGxheWVyIGdsb2JhbCBzdGF0ZVxuICAgIGNvbnN0IHZpc2liaWxpdHkgPSBvcHRpb25zLnZpc2liaWxpdHkgPz8gdHJ1ZTtcbiAgICBvcHRpb25zLnZpc2liaWxpdHkgPSBmYWxzZTtcblxuICAgIGlmIChvcHRpb25zLmJhc2VsYXllcikge1xuICAgICAgb3B0aW9ucy5vcmRlciA9IDA7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdGlvbnMub25CZWZvcmVBZGRMYXllcikge1xuICAgICAgY29uc3QgbW9kaWZpZWQgPSB0aGlzLm9wdGlvbnMub25CZWZvcmVBZGRMYXllcih7XG4gICAgICAgIG9wdGlvbnMsXG4gICAgICAgIGFkYXB0ZXI6IGFkYXB0ZXJFbmdpbmUsXG4gICAgICB9KTtcbiAgICAgIGlmIChtb2RpZmllZCkge1xuICAgICAgICBpZiAobW9kaWZpZWQub3B0aW9ucykge1xuICAgICAgICAgIG9wdGlvbnMgPSBtb2RpZmllZC5vcHRpb25zO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtb2RpZmllZC5hZGFwdGVyKSB7XG4gICAgICAgICAgYWRhcHRlckVuZ2luZSA9IG1vZGlmaWVkLmFkYXB0ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGFkYXB0ZXJFbmdpbmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgX2FkYXB0ZXIgPSBuZXcgYWRhcHRlckVuZ2luZSh0aGlzLm1hcEFkYXB0ZXIubWFwLCBvcHRpb25zKTtcbiAgICAgIF9hZGFwdGVyLm9wdGlvbnMgPSB7IC4uLm9wdGlvbnMsIC4uLl9hZGFwdGVyLm9wdGlvbnMgfTtcblxuICAgICAgaWYgKF9hZGFwdGVyLm9wdGlvbnMuYmFzZWxheWVyKSB7XG4gICAgICAgIG9wdGlvbnMuYmFzZWxheWVyID0gdHJ1ZTtcbiAgICAgICAgb3B0aW9ucy5vcmRlciA9IDA7XG4gICAgICAgIF9hZGFwdGVyLm9wdGlvbnMub3JkZXIgPSAwO1xuICAgICAgfVxuXG4gICAgICBsZXQgbGF5ZXJJZDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgICAgaWYgKF9hZGFwdGVyLm9wdGlvbnMuaWQpIHtcbiAgICAgICAgbGF5ZXJJZCA9IFN0cmluZyhfYWRhcHRlci5vcHRpb25zLmlkKTtcbiAgICAgICAgdGhpcy5fbGF5ZXJzW2xheWVySWRdID0gX2FkYXB0ZXI7XG4gICAgICB9XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnbGF5ZXI6cHJlYWRkJywgX2FkYXB0ZXIpO1xuICAgICAgYXdhaXQgdGhpcy5vbk1hcExvYWQoKTtcbiAgICAgIGNvbnN0IGxheWVyID0gYXdhaXQgX2FkYXB0ZXIuYWRkTGF5ZXIoX2FkYXB0ZXIub3B0aW9ucyk7XG4gICAgICAvLyBjaGVja2luZyB0aGF0IHRoZSBvcmlnaW5hbCBsYXllciB3YXMgaW5zZXJ0ZWQgaW50byB0aGUgYWRhcHRlciBhbnl3YXlcbiAgICAgIF9hZGFwdGVyLmxheWVyID0gbGF5ZXI7XG4gICAgICAvLyB0aGluayBhYm91dCBob3cgdG8gbW92ZSBgaWRgIHRvIHRoZSBhZGFwdGVyJ3MgY29uc3RydWN0b3IsXG4gICAgICAvLyBidXQgdGhhdCBpdCBpcyBub3QgcmVxdWlyZWQgaW4gdGhlIG9wdGlvbnNcbiAgICAgIF9hZGFwdGVyLmlkID0gX2FkYXB0ZXIub3B0aW9ucy5pZCB8fCBTdHJpbmcoaWQpO1xuICAgICAgX2FkYXB0ZXIub3B0aW9ucy5pZCA9IF9hZGFwdGVyLmlkO1xuICAgICAgaWYgKG9wdGlvbnMuYmFzZWxheWVyKSB7XG4gICAgICAgIF9hZGFwdGVyLm9wdGlvbnMub3JkZXIgPSAwO1xuICAgICAgfVxuICAgICAgX2FkYXB0ZXIub3JkZXIgPSBfYWRhcHRlci5vcHRpb25zLm9yZGVyID8/IF9vcmRlcjtcbiAgICAgIGlmIChsYXllcklkKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9sYXllcnNbbGF5ZXJJZF07XG4gICAgICB9XG4gICAgICBsYXllcklkID0gU3RyaW5nKF9hZGFwdGVyLmlkKTtcbiAgICAgIGlmICh0aGlzLl9sYXllcnNbbGF5ZXJJZF0pIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoYGxheWVyIHdpdGggaWQgJyR7bGF5ZXJJZH0nIGFscmVhZHkgZXhpc3RgKTtcbiAgICAgIH1cbiAgICAgIGlmIChsYXllcklkKSB7XG4gICAgICAgIHRoaXMuX2xheWVyc1tsYXllcklkXSA9IF9hZGFwdGVyO1xuICAgICAgICBpZiAoZ2VvSnNvbk9wdGlvbnMuZmlsdGVyKSB7XG4gICAgICAgICAgdGhpcy5maWx0ZXJMYXllcihfYWRhcHRlciwgZ2VvSnNvbk9wdGlvbnMuZmlsdGVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5iYXNlbGF5ZXIpIHtcbiAgICAgICAgICB0aGlzLl9iYXNlbGF5ZXJzLnB1c2gobGF5ZXJJZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmlzaWJpbGl0eSkge1xuICAgICAgICAgIGF3YWl0IHRoaXMuc2hvd0xheWVyKGxheWVySWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBvcGFjaXR5ID0gb3B0aW9ucy5vcGFjaXR5O1xuICAgICAgaWYgKG9wYWNpdHkgIT09IHVuZGVmaW5lZCAmJiBvcGFjaXR5IDw9IDEpIHtcbiAgICAgICAgdGhpcy5zZXRMYXllck9wYWNpdHkoX2FkYXB0ZXIsIG9wYWNpdHkpO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMuZml0ICYmIF9hZGFwdGVyLmdldEV4dGVudCkge1xuICAgICAgICBjb25zdCBleHRlbnQgPSBhd2FpdCBfYWRhcHRlci5nZXRFeHRlbnQoKTtcbiAgICAgICAgaWYgKGV4dGVudCkge1xuICAgICAgICAgIGF3YWl0IHRoaXMuZml0Qm91bmRzKGV4dGVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdsYXllcjphZGQnLCBfYWRhcHRlcik7XG4gICAgICByZXR1cm4gX2FkYXB0ZXI7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgnTm8gYWRhcHRlcicpO1xuICB9XG5cbiAgYXN5bmMgYWRkTGF5ZXJGcm9tQXN5bmNBZGFwdGVyPFxuICAgIEsgZXh0ZW5kcyBrZXlvZiBMYXllckFkYXB0ZXJzLFxuICAgIE8gZXh0ZW5kcyBBZGFwdGVyT3B0aW9ucyA9IEFkYXB0ZXJPcHRpb25zXG4gID4oXG4gICAgYWRhcHRlcjogQWRhcHRlckNvbnN0cnVjdG9yLFxuICAgIG9wdGlvbnM6IE8gfCBMYXllckFkYXB0ZXJzT3B0aW9uc1tLXSxcbiAgICBvcmRlcj86IG51bWJlclxuICApOiBQcm9taXNlPExheWVyQWRhcHRlcj4ge1xuICAgIGNvbnN0IF9vcmRlciA9XG4gICAgICBvcmRlciB8fCBvcHRpb25zLm9yZGVyICE9PSB1bmRlZmluZWRcbiAgICAgICAgPyBvcHRpb25zLm9yZGVyXG4gICAgICAgIDogMCB8fCB0aGlzLnJlc2VydmVPcmRlcigpO1xuICAgIGNvbnN0IGFkYXB0ZXJDb25zdHJ1Y3RvciA9IGFkYXB0ZXIgYXMgQWRhcHRlckNvbnN0cnVjdG9yO1xuICAgIGNvbnN0IGFkYXB0ZXJDb25zdHJ1Y3RvclByb21pc2UgPSBhZGFwdGVyQ29uc3RydWN0b3IoKTtcbiAgICBjb25zdCBhZGFwdGVyRW5naW5lID0gYXdhaXQgYWRhcHRlckNvbnN0cnVjdG9yUHJvbWlzZTtcbiAgICBpZiAoYWRhcHRlckVuZ2luZSkge1xuICAgICAgcmV0dXJuIHRoaXMuYWRkTGF5ZXIoYWRhcHRlckVuZ2luZSwgb3B0aW9ucywgX29yZGVyKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCdObyBhZGFwdGVyJyk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBsYXllciBmcm9tIG1hcCBhbmQgbWVtb3J5LlxuICAgKi9cbiAgcmVtb3ZlTGF5ZXJzKFxuICAgIGFsbG93Q2I/OiAobGF5ZXI6IHN0cmluZywgYWRhcHRlcjogTGF5ZXJBZGFwdGVyKSA9PiBib29sZWFuXG4gICk6IHZvaWQge1xuICAgIGZvciAoY29uc3QgbCBpbiB0aGlzLl9sYXllcnMpIHtcbiAgICAgIGxldCBhbGxvdyA9IHRydWU7XG4gICAgICBpZiAoYWxsb3dDYikge1xuICAgICAgICBhbGxvdyA9IGFsbG93Q2IobCwgdGhpcy5fbGF5ZXJzW2xdKTtcbiAgICAgIH1cbiAgICAgIGlmIChhbGxvdykge1xuICAgICAgICB0aGlzLnJlbW92ZUxheWVyKGwpO1xuICAgICAgICBkZWxldGUgdGhpcy5fbGF5ZXJzW2xdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlc2VydmVPcmRlcigpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9sYXllcnNPcmRlckNvdW50ZXIrKztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxsIGxheWVycyBidXQgbm90IHJlbW92ZSBiYXNlbWFwLlxuICAgKi9cbiAgcmVtb3ZlT3ZlcmxheXMoKTogdm9pZCB7XG4gICAgdGhpcy5yZW1vdmVMYXllcnMoKGxheWVySWQsIGxheWVyKSA9PiB7XG4gICAgICBpZiAobGF5ZXIgJiYgbGF5ZXIub3B0aW9ucyAmJiBsYXllci5vcHRpb25zLmJhc2VsYXllcikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgc3BlY2lmaWMgbGF5ZXIgZnJvbSBtYXAgYW5kIG1lbW9yeSBieSBpdHMgZGVmaW5pdGlvbi5cbiAgICogQHBhcmFtIGxheWVyRGVmXG4gICAqL1xuICByZW1vdmVMYXllcihsYXllckRlZjogTGF5ZXJEZWYpOiB2b2lkIHtcbiAgICBjb25zdCBsYXllciA9IHRoaXMuZ2V0TGF5ZXIobGF5ZXJEZWYpO1xuICAgIGNvbnN0IGxheWVySWQgPSBsYXllciAmJiB0aGlzLmdldExheWVySWQobGF5ZXIpO1xuICAgIGlmIChsYXllciAmJiBsYXllcklkKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnbGF5ZXI6cHJlcmVtb3ZlJywgbGF5ZXIpO1xuICAgICAgaWYgKGxheWVyLmJlZm9yZVJlbW92ZSkge1xuICAgICAgICBsYXllci5iZWZvcmVSZW1vdmUoKTtcbiAgICAgIH1cbiAgICAgIGlmIChsYXllci5yZW1vdmVMYXllcikge1xuICAgICAgICBsYXllci5yZW1vdmVMYXllcigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tYXBBZGFwdGVyLnJlbW92ZUxheWVyKGxheWVyLmxheWVyKTtcbiAgICAgIH1cbiAgICAgIGlmIChsYXllci5vcHRpb25zICYmIGxheWVyLm9wdGlvbnMuYmFzZWxheWVyKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fYmFzZWxheWVycy5pbmRleE9mKGxheWVySWQpO1xuICAgICAgICBpZiAoaW5kZXgpIHtcbiAgICAgICAgICB0aGlzLl9iYXNlbGF5ZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGRlbGV0ZSB0aGlzLl9sYXllcnNbbGF5ZXJJZF07XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnbGF5ZXI6cmVtb3ZlJywgbGF5ZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgbGF5ZXIgZnJvbSBHZW9Kc29uIGRhdGEuIFNldCBzdHlsZSBhbmQgYmVoYXZpb3IgZm9yIHNlbGVjdGlvbi5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYGBgamF2YXNjcmlwdFxuICAgKiAvLyBBZGQgc2ltcGxlIGxheWVyXG4gICAqIHdlYk1hcC5hZGRHZW9Kc29uTGF5ZXIoeyBkYXRhOiBnZW9qc29uLCBwYWludDogeyBjb2xvcjogJ3JlZCcgfSB9KTtcbiAgICpcbiAgICogLy8gQWRkIHN0eWxlZCBieSBmZWF0dXJlIHByb3BlcnR5IGxheWVyIHdpdGggc2VsZWN0aW9uIGJlaGF2aW9yXG4gICAqIHdlYk1hcC5hZGRHZW9Kc29uTGF5ZXIoe1xuICAgKiAgIGRhdGE6IGdlb2pzb24sXG4gICAqICAgcGFpbnQ6IGZ1bmN0aW9uIChmZWF0dXJlKSB7XG4gICAqICAgICByZXR1cm4geyBjb2xvcjogZmVhdHVyZS5wcm9wZXJ0aWVzLmNvbG9yLCBvcGFjaXR5OiAwLjUgfVxuICAgKiAgIH0sXG4gICAqICBzZWxlY3RlZFBhaW50OiBmdW5jdGlvbiAoZmVhdHVyZSkge1xuICAgKiAgICByZXR1cm4geyBjb2xvcjogZmVhdHVyZS5wcm9wZXJ0aWVzLnNlbGNvbG9yLCBvcGFjaXR5OiAxIH1cbiAgICogIH0sXG4gICAqICBzZWxlY3RhYmxlOiB0cnVlLFxuICAgKiAgbXVsdGlzZWxlY3Q6IHRydWVcbiAgICogfSk7XG4gICAqXG4gICAqIC8vIEFkZCBtYXJrZXIgbGF5ZXIgc3R5bGVkIHdpdGggdXNlIFtJY29uc10oaWNvbnMpXG4gICAqIHdlYk1hcC5hZGRHZW9Kc29uTGF5ZXIoeyBkYXRhOiBnZW9qc29uLCBwYWludDogd2ViTWFwLmdldEljb24oeyBjb2xvcjogJ29yYW5nZScgfSl9KTtcbiAgICpcbiAgICogLy8gd29yayB3aXRoIGFkZGVkIGxheWVyXG4gICAqIGNvbnN0IGxheWVyID0gd2ViTWFwLmFkZEdlb0pzb25MYXllcih7IGRhdGE6IGdlb2pzb24sIGlkOiAnbXlfbGF5ZXJfbmFtZSd9KTtcbiAgICogLy8gYWNjZXNzIGxheWVyIGJ5IGlkXG4gICAqIHdlYk1hcC5zaG93TGF5ZXIoJ215X2xheWVyX25hbWUnKTtcbiAgICogLy8gb3IgYWNjZXNzIGxheWVyIGJ5IGluc3RhbmNlXG4gICAqIHdlYk1hcC5zaG93TGF5ZXIobGF5ZXIpO1xuICAgKiBgYGBcbiAgICovXG4gIC8vIEBvbk1hcExvYWQoKVxuICBhc3luYyBhZGRHZW9Kc29uTGF5ZXI8SyBleHRlbmRzIGtleW9mIExheWVyQWRhcHRlcnNPcHRpb25zPihcbiAgICBvcHQ6IEdlb0pzb25BZGFwdGVyT3B0aW9ucyxcbiAgICBhZGFwdGVyPzogSyB8IFR5cGU8TGF5ZXJBZGFwdGVyPlxuICApOiBQcm9taXNlPExheWVyQWRhcHRlcjxhbnksIGFueSwgQWRhcHRlck9wdGlvbnM+PiB7XG4gICAgb3B0ID0gb3B0IHx8IHt9O1xuICAgIG9wdC5tdWx0aXNlbGVjdCA9IG9wdC5tdWx0aXNlbGVjdCAhPT0gdW5kZWZpbmVkID8gb3B0Lm11bHRpc2VsZWN0IDogZmFsc2U7XG4gICAgb3B0LnVuc2VsZWN0T25TZWNvbmRDbGljayA9XG4gICAgICBvcHQudW5zZWxlY3RPblNlY29uZENsaWNrICE9PSB1bmRlZmluZWRcbiAgICAgICAgPyBvcHQudW5zZWxlY3RPblNlY29uZENsaWNrXG4gICAgICAgIDogdHJ1ZTtcbiAgICBpZiAoIWFkYXB0ZXIpIHtcbiAgICAgIG9wdCA9IHVwZGF0ZUdlb0pzb25BZGFwdGVyT3B0aW9ucyhvcHQpO1xuICAgIH1cbiAgICBvcHQucGFpbnQgPSBvcHQucGFpbnQgfHwge307XG4gICAgY29uc3QgbGF5ZXIgPSBhd2FpdCB0aGlzLmFkZExheWVyKGFkYXB0ZXIgfHwgJ0dFT0pTT04nLCBvcHQpO1xuICAgIHRoaXMuc2hvd0xheWVyKGxheWVyKTtcbiAgICByZXR1cm4gbGF5ZXI7XG4gIH1cblxuICAvKipcbiAgICogU2hvdyBhZGRlZCBsYXllciBvbiB0aGUgbWFwIGJ5IGl0IGRlZmluaXRpb24uXG4gICAqL1xuICBzaG93TGF5ZXIoXG4gICAgbGF5ZXJEZWY6IExheWVyRGVmLFxuICAgIG9wdGlvbnM6IFRvZ2dsZUxheWVyT3B0aW9ucyA9IHt9XG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLnRvZ2dsZUxheWVyKGxheWVyRGVmLCB0cnVlLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWRlIGFkZGVkIGxheWVyIG9uIHRoZSBtYXAgYnkgaXQgZGVmaW5pdGlvbi5cbiAgICovXG4gIGhpZGVMYXllcihcbiAgICBsYXllckRlZjogTGF5ZXJEZWYsXG4gICAgb3B0aW9uczogVG9nZ2xlTGF5ZXJPcHRpb25zID0ge31cbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMudG9nZ2xlTGF5ZXIobGF5ZXJEZWYsIGZhbHNlLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGFuZ2UgYWRkZWQgbGF5ZXIgdmlzaWJpbGl0eSBvbiB0aGUgbWFwIGJ5IGdpdmVuIHN0YXR1cyBvciBpbnZlcnNlIGN1cnJlbnQgc3RhdHVzLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIHdlYk1hcC5hZGRMYXllcignVElMRScsIHtpZDogJ215X2xheWVyJywgdXJsOiAnJ30pLnRoZW4oKGxheWVyKSA9PiB7XG4gICAqICAgd2ViTWFwLnRvZ2dsZUxheWVyKGxheWVyLCB0cnVlKTtcbiAgICogICB3ZWJNYXAudG9nZ2xlTGF5ZXIoJ215X2xheWVyJywgZmFsc2UpO1xuICAgKiAgIHdlYk1hcC50b2dnbGVMYXllcignbXlfbGF5ZXInKTtcbiAgICogICB3ZWJNYXAuaXNMYXllclZpc2libGUobGF5ZXIpOyAvLyB0cnVlXG4gICAqIH0pO1xuICAgKiBgYGBcbiAgICovXG4gIHRvZ2dsZUxheWVyKFxuICAgIGxheWVyRGVmOiBMYXllckRlZixcbiAgICBzdGF0dXM/OiBib29sZWFuLFxuICAgIG9wdGlvbnM6IFRvZ2dsZUxheWVyT3B0aW9ucyA9IHt9XG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGxheWVyID0gdGhpcy5nZXRMYXllcihsYXllckRlZik7XG4gICAgY29uc3Qgb25NYXAgPSBsYXllciAmJiBsYXllci5vcHRpb25zLnZpc2liaWxpdHk7XG4gICAgY29uc3QgdG9TdGF0dXMgPSBzdGF0dXMgIT09IHVuZGVmaW5lZCA/IHN0YXR1cyA6ICFvbk1hcDtcbiAgICBjb25zdCBzaWxlbnQgPSBvcHRpb25zLnNpbGVudCAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5zaWxlbnQgOiBmYWxzZTtcbiAgICBjb25zdCBhY3Rpb24gPSAoc291cmNlOiBhbnksIGw6IExheWVyQWRhcHRlcikgPT4ge1xuICAgICAgY29uc3QgcHJlRXZlbnROYW1lID0gdG9TdGF0dXMgPyAnbGF5ZXI6cHJlc2hvdycgOiAnbGF5ZXI6cHJlaGlkZSc7XG4gICAgICBjb25zdCBldmVudE5hbWUgPSB0b1N0YXR1cyA/ICdsYXllcjpzaG93JyA6ICdsYXllcjpoaWRlJztcbiAgICAgIGlmICghc2lsZW50KSB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KHByZUV2ZW50TmFtZSwgbCk7XG4gICAgICB9XG4gICAgICBpZiAodG9TdGF0dXMgJiYgc291cmNlKSB7XG4gICAgICAgIGNvbnN0IG9yZGVyID0gbC5vcHRpb25zLmJhc2VsYXllciA/IDAgOiBsLm9wdGlvbnMub3JkZXI7XG5cbiAgICAgICAgLy8gZG8gbm90IHNob3cgYmFzZWxheWVyIGlmIGFub3RoZXIgb24gdGhlIG1hcFxuICAgICAgICBpZiAobC5vcHRpb25zLmJhc2VsYXllciAmJiB0aGlzLl9iYXNlbGF5ZXJzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGFub3RoZXJWaXNpYmxlTGF5ZXJCYXNlTGF5ZXIgPSB0aGlzLl9iYXNlbGF5ZXJzLmZpbmQoKHgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB4ICE9PSBsLmlkICYmIHRoaXMuaXNMYXllclZpc2libGUoeCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGFub3RoZXJWaXNpYmxlTGF5ZXJCYXNlTGF5ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZUxheWVyKGFub3RoZXJWaXNpYmxlTGF5ZXJCYXNlTGF5ZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsLnNob3dMYXllcikge1xuICAgICAgICAgIGwuc2hvd0xheWVyLmNhbGwobCwgbC5sYXllcik7XG4gICAgICAgIH0gZWxzZSBpZiAobC5sYXllciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhpcy5tYXBBZGFwdGVyLnNob3dMYXllcihsLmxheWVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3JkZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMubWFwQWRhcHRlci5zZXRMYXllck9yZGVyKGwubGF5ZXIsIG9yZGVyLCB0aGlzLl9sYXllcnMpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobC5oaWRlTGF5ZXIpIHtcbiAgICAgICAgICBsLmhpZGVMYXllci5jYWxsKGwsIGwubGF5ZXIpO1xuICAgICAgICB9IGVsc2UgaWYgKGwubGF5ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMubWFwQWRhcHRlci5oaWRlTGF5ZXIobC5sYXllcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghc2lsZW50KSB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KGV2ZW50TmFtZSwgbCk7XG4gICAgICB9XG4gICAgICBsLm9wdGlvbnMudmlzaWJpbGl0eSA9IHRvU3RhdHVzO1xuICAgIH07XG4gICAgaWYgKGxheWVyICYmIGxheWVyLm9wdGlvbnMudmlzaWJpbGl0eSAhPT0gdG9TdGF0dXMpIHtcbiAgICAgIHJldHVybiB0aGlzLm9uTWFwTG9hZCgpLnRoZW4oKCkgPT4gYWN0aW9uKHRoaXMubWFwQWRhcHRlciwgbGF5ZXIpKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgdXBkYXRlTGF5ZXIobGF5ZXJEZWY6IExheWVyRGVmKTogdm9pZCB7XG4gICAgY29uc3QgbGF5ZXIgPSB0aGlzLmdldExheWVyKGxheWVyRGVmKTtcbiAgICBpZiAobGF5ZXIpIHtcbiAgICAgIGlmIChsYXllci51cGRhdGVMYXllcikge1xuICAgICAgICBsYXllci51cGRhdGVMYXllcigpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzTGF5ZXJWaXNpYmxlKGxheWVyKSkge1xuICAgICAgICB0aGlzLmhpZGVMYXllcihsYXllciwgeyBzaWxlbnQ6IHRydWUgfSk7XG4gICAgICAgIHRoaXMuc2hvd0xheWVyKGxheWVyLCB7IHNpbGVudDogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRyYW5zcGFyZW5jeSBmb3IgYSBnaXZlbiBsYXllciBieSBudW1iZXIgZnJvbSAwIHRvIDFcbiAgICovXG4gIHNldExheWVyT3BhY2l0eShsYXllckRlZjogTGF5ZXJEZWYsIHZhbHVlOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBsYXllciA9IHRoaXMuZ2V0TGF5ZXIobGF5ZXJEZWYpO1xuICAgIGlmIChsYXllcikge1xuICAgICAgaWYgKHRoaXMubWFwQWRhcHRlci5zZXRMYXllck9wYWNpdHkpIHtcbiAgICAgICAgaWYgKGxheWVyKSB7XG4gICAgICAgICAgdGhpcy5tYXBBZGFwdGVyLnNldExheWVyT3BhY2l0eShsYXllci5sYXllciwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gcmVxdWVzdEdlb21TdHJpbmcocGl4ZWw6IFBpeGVsLCBwaXhlbFJhZGl1czogbnVtYmVyKSB7XG4gIC8vICAgaWYgKHRoaXMubWFwQWRhcHRlci5yZXF1ZXN0R2VvbVN0cmluZykge1xuICAvLyAgICAgcmV0dXJuIHRoaXMubWFwQWRhcHRlci5yZXF1ZXN0R2VvbVN0cmluZyhwaXhlbCwgcGl4ZWxSYWRpdXMpO1xuICAvLyAgIH1cbiAgLy8gfVxuXG4gIC8qKlxuICAgKiBNYXJrIHRoZSBsYXllciBhcyBzZWxlY3RlZC5cbiAgICogSWYgdGhlIGFkYXB0ZXIgaXMgYSB2ZWN0b3IgbGF5ZXIgYW5kIHN1cHBvcnRzIGRhdGEgc2VsZWN0aW9uLFxuICAgKiB5b3UgY2FuIHBhc3MgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBzcGVjaWZ5IHdoaWNoIGRhdGEgd2lsbCBiZSBzZWxlY3RlZC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYGBgamF2YXNjcmlwdFxuICAgKiBjb25zdCBsYXllciA9IHdlYk1hcC5hZGRMYXllcignR0VPSlNPTicsIHtkYXRhOiBnZW9qc29ufSkudGhlbigobGF5ZXIpID0+IHtcbiAgICogICB3ZWJNYXAuc2VsZWN0TGF5ZXIobGF5ZXIsICh7ZmVhdHVyZX0pID0+IGZlYXR1cmUuaWQgPT09ICc0MicpO1xuICAgKiB9KTtcbiAgICogYGBgXG4gICAqIEBwYXJhbSBsYXllckRlZlxuICAgKiBAcGFyYW0gZmluZEZlYXR1cmVGdW5cbiAgICovXG4gIHNlbGVjdExheWVyKGxheWVyRGVmOiBMYXllckRlZiwgZmluZEZlYXR1cmVGdW4/OiBEYXRhTGF5ZXJGaWx0ZXIpOiB2b2lkIHtcbiAgICBjb25zdCBsYXllciA9IHRoaXMuZ2V0TGF5ZXIobGF5ZXJEZWYpO1xuICAgIGlmIChsYXllcikge1xuICAgICAgY29uc3QgYWRhcHRlciA9IGxheWVyIGFzIFZlY3RvckxheWVyQWRhcHRlcjtcbiAgICAgIGlmIChhZGFwdGVyICYmIGFkYXB0ZXIuc2VsZWN0KSB7XG4gICAgICAgIGFkYXB0ZXIuc2VsZWN0KGZpbmRGZWF0dXJlRnVuKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGxheWVySWQgPSB0aGlzLmdldExheWVySWQobGF5ZXIpO1xuICAgICAgaWYgKGxheWVySWQpIHtcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRMYXllcnMucHVzaChsYXllcklkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVW5zZWxlY3QgdGhlIGdpdmVuIGxheWVyLlxuICAgKiBJZiB0aGUgYWRhcHRlciBpcyBhIHZlY3RvciBsYXllciBhbmQgc3VwcG9ydHMgZGF0YSBzZWxlY3Rpb24sXG4gICAqIHlvdSBjYW4gcGFzcyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIHNwZWNpZnkgd2hpY2ggZGF0YSB3aWxsIGJlIHVuc2VsZWN0ZWQuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogY29uc3QgbGF5ZXIgPSB3ZWJNYXAuYWRkTGF5ZXIoJ0dFT0pTT04nLCB7ZGF0YTogZ2VvanNvbn0pLnRoZW4oKGxheWVyKSA9PiB7XG4gICAqICAgd2ViTWFwLnVuU2VsZWN0TGF5ZXIobGF5ZXIsICh7ZmVhdHVyZX0pID0+IGZlYXR1cmUuaWQgPT09ICc0MicpO1xuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSBsYXllckRlZlxuICAgKiBAcGFyYW0gZmluZEZlYXR1cmVGdW5cbiAgICovXG4gIHVuU2VsZWN0TGF5ZXIobGF5ZXJEZWY6IExheWVyRGVmLCBmaW5kRmVhdHVyZUZ1bj86IERhdGFMYXllckZpbHRlcik6IHZvaWQge1xuICAgIGNvbnN0IGxheWVyID0gdGhpcy5nZXRMYXllcihsYXllckRlZik7XG4gICAgaWYgKGxheWVyKSB7XG4gICAgICBjb25zdCBhZGFwdGVyID0gbGF5ZXIgJiYgKGxheWVyIGFzIFZlY3RvckxheWVyQWRhcHRlcik7XG4gICAgICBpZiAoYWRhcHRlci51bnNlbGVjdCkge1xuICAgICAgICBhZGFwdGVyLnVuc2VsZWN0KGZpbmRGZWF0dXJlRnVuKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGxheWVySWQgPSB0aGlzLmdldExheWVySWQobGF5ZXIpO1xuICAgICAgaWYgKGxheWVySWQpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9zZWxlY3RlZExheWVycy5pbmRleE9mKGxheWVySWQpO1xuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgdGhpcy5fc2VsZWN0ZWRMYXllcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIaWRlIGZlYXR1cmVzIGZyb20gYSB2ZWN0b3IgbGF5ZXIgdXNpbmcgYSBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYGBgamF2YXNjcmlwdFxuICAgKiBjb25zdCBsYXllciA9IHdlYk1hcC5hZGRMYXllcignR0VPSlNPTicsIHtkYXRhOiBnZW9qc29ufSkudGhlbigobGF5ZXIpID0+IHtcbiAgICogICB3ZWJNYXAuZmlsdGVyTGF5ZXIobGF5ZXIsICh7ZmVhdHVyZX0pID0+IGZlYXR1cmUuaWQgPT09ICc0MicpO1xuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSBsYXllckRlZlxuICAgKiBAcGFyYW0gZmlsdGVyXG4gICAqL1xuICBmaWx0ZXJMYXllcihcbiAgICBsYXllckRlZjogTGF5ZXJEZWYsXG4gICAgZmlsdGVyOiBEYXRhTGF5ZXJGaWx0ZXI8RmVhdHVyZSwgTD5cbiAgKTogTGF5ZXJEZWZpbml0aW9uPEZlYXR1cmUsIEw+W10ge1xuICAgIGNvbnN0IGxheWVyID0gdGhpcy5nZXRMYXllcihsYXllckRlZik7XG4gICAgY29uc3QgYWRhcHRlciA9IGxheWVyIGFzIFZlY3RvckxheWVyQWRhcHRlcjtcbiAgICBpZiAoYWRhcHRlci5maWx0ZXIpIHtcbiAgICAgIHJldHVybiBhZGFwdGVyLmZpbHRlcihmaWx0ZXIpO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBwcm9wZXJ0aWVzRmlsdGVyKFxuICAgIGxheWVyRGVmOiBMYXllckRlZixcbiAgICBmaWx0ZXJzOiBQcm9wZXJ0aWVzRmlsdGVyLFxuICAgIG9wdGlvbnM/OiBGaWx0ZXJPcHRpb25zXG4gICk6IHZvaWQge1xuICAgIGNvbnN0IGxheWVyID0gdGhpcy5nZXRMYXllcihsYXllckRlZik7XG4gICAgY29uc3QgYWRhcHRlciA9IGxheWVyIGFzIFZlY3RvckxheWVyQWRhcHRlcjtcbiAgICBpZiAoYWRhcHRlci5wcm9wZXJ0aWVzRmlsdGVyKSB7XG4gICAgICBhZGFwdGVyLnByb3BlcnRpZXNGaWx0ZXIoZmlsdGVycywgb3B0aW9ucyk7XG4gICAgfSBlbHNlIGlmIChhZGFwdGVyLmZpbHRlcikge1xuICAgICAgdGhpcy5maWx0ZXJMYXllcihhZGFwdGVyLCAoZSkgPT4ge1xuICAgICAgICBpZiAoZS5mZWF0dXJlICYmIGUuZmVhdHVyZS5wcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgcmV0dXJuIHByb3BlcnRpZXNGaWx0ZXIoZS5mZWF0dXJlLnByb3BlcnRpZXMsIGZpbHRlcnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlTGF5ZXJGaWx0ZXIobGF5ZXJEZWY6IExheWVyRGVmKTogdm9pZCB7XG4gICAgY29uc3QgbGF5ZXIgPSB0aGlzLmdldExheWVyKGxheWVyRGVmKTtcbiAgICBjb25zdCBhZGFwdGVyID0gbGF5ZXIgYXMgVmVjdG9yTGF5ZXJBZGFwdGVyO1xuICAgIGlmIChhZGFwdGVyLnJlbW92ZUZpbHRlcikge1xuICAgICAgYWRhcHRlci5yZW1vdmVGaWx0ZXIoKTtcbiAgICB9IGVsc2UgaWYgKGFkYXB0ZXIuZmlsdGVyKSB7XG4gICAgICBhZGFwdGVyLmZpbHRlcigoKSA9PiB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIEdlb0pTT04gZGF0YSBmb3IgZ2l2ZW4gdmVjdG9yIGxheWVyLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIGNvbnN0IGxheWVyID0gd2ViTWFwLmFkZExheWVyKCdHRU9KU09OJykudGhlbigobGF5ZXIpID0+IHtcbiAgICogICB3ZWJNYXAuc2V0TGF5ZXJEYXRhKGxheWVyLCBnZW9qc29uKTtcbiAgICogfSk7XG4gICAqIGBgYFxuICAgKi9cbiAgc2V0TGF5ZXJEYXRhKGxheWVyRGVmOiBMYXllckRlZiwgZGF0YTogR2VvSnNvbk9iamVjdCk6IHZvaWQge1xuICAgIGNvbnN0IHZlY3RvckFkYXB0ZXIgPSB0aGlzLmdldExheWVyKGxheWVyRGVmKTtcbiAgICBjb25zdCBhZGFwdGVyID0gdmVjdG9yQWRhcHRlciBhcyBWZWN0b3JMYXllckFkYXB0ZXI7XG4gICAgaWYgKGFkYXB0ZXIpIHtcbiAgICAgIGlmIChhZGFwdGVyLnNldERhdGEpIHtcbiAgICAgICAgYWRhcHRlci5zZXREYXRhKGRhdGEpO1xuICAgICAgfSBlbHNlIGlmIChhZGFwdGVyLmNsZWFyTGF5ZXIgJiYgYWRhcHRlci5hZGREYXRhKSB7XG4gICAgICAgIGFkYXB0ZXIuY2xlYXJMYXllcigpO1xuICAgICAgICBhZGFwdGVyLmFkZERhdGEoZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFB1c2ggbmV3IHRoZSBHZW9KU09OIGZlYXR1cmVzIGludG8gZ2l2ZW4gdmVjdG9yIGxheWVyLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIGNvbnN0IGxheWVyID0gd2ViTWFwLmFkZExheWVyKCdHRU9KU09OJywge2RhdGE6IGdlb2pzb25fZmVhdHVyZXNfNX0pLnRoZW4oKGxheWVyKSA9PiB7XG4gICAqICAgY29uc29sZS5sb2cobGF5ZXIuZ2V0TGF5ZXJzKCkubGVuZ3RoKSAvLyA+IDU7XG4gICAqICAgd2ViTWFwLmFkZExheWVyRGF0YShsYXllciwgZ2VvanNvbl9mZWF0dXJlc18zKTtcbiAgICogICBjb25zb2xlLmxvZyhsYXllci5nZXRMYXllcnMoKS5sZW5ndGgpIC8vID4gODtcbiAgICogfSk7XG4gICAqIGBgYFxuICAgKi9cbiAgYWRkTGF5ZXJEYXRhKGxheWVyRGVmOiBMYXllckRlZiwgZGF0YTogR2VvSnNvbk9iamVjdCk6IHZvaWQge1xuICAgIGNvbnN0IGxheWVyTWVtID0gdGhpcy5nZXRMYXllcihsYXllckRlZik7XG4gICAgY29uc3QgYWRhcHRlciA9IGxheWVyTWVtIGFzIFZlY3RvckxheWVyQWRhcHRlcjtcbiAgICBpZiAoYWRhcHRlci5hZGREYXRhKSB7XG4gICAgICBhZGFwdGVyLmFkZERhdGEoZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBmcm9tIHZlY3RvciBsYXllciBhbGwgZmVhdHVyZXMuXG4gICAqIGl0IGlzIHBvc3NpYmxlIHRvIHJlbW92ZSBvbmx5IHNvbWUgb2JqZWN0cyBpZiB5b3Ugc3BlY2lmeSBhIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIGNvbnN0IGxheWVyID0gd2ViTWFwLmFkZExheWVyKCdHRU9KU09OJywge2RhdGE6IGdlb2pzb259KS50aGVuKChsYXllcikgPT4ge1xuICAgKiAgIHdlYk1hcC5jbGVhckxheWVyRGF0YShsYXllciwgKGZldHVyZSkgPT4gZmV0dXJlLmlkID09PSA0Mik7XG4gICAqICAgd2ViTWFwLmNsZWFyTGF5ZXJEYXRhKGxheWVyKTtcbiAgICogfSk7XG4gICAqIGBgYFxuICAgKi9cbiAgY2xlYXJMYXllckRhdGEobGF5ZXJEZWY6IExheWVyRGVmLCBjYj86IChmZWF0dXJlOiBGZWF0dXJlKSA9PiBib29sZWFuKTogdm9pZCB7XG4gICAgY29uc3QgbGF5ZXJNZW0gPSB0aGlzLmdldExheWVyKGxheWVyRGVmKTtcbiAgICBjb25zdCBhZGFwdGVyID0gbGF5ZXJNZW0gYXMgVmVjdG9yTGF5ZXJBZGFwdGVyO1xuICAgIGlmIChhZGFwdGVyICYmIGFkYXB0ZXIuY2xlYXJMYXllcikge1xuICAgICAgYWRhcHRlci5jbGVhckxheWVyKGNiKTtcbiAgICB9XG4gIH1cblxuICBnZXRBdHRyaWJ1dGlvbnMob3B0aW9uczogR2V0QXR0cmlidXRpb25zT3B0aW9ucyk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBhdHRyaWJ1dGlvbnM6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChjb25zdCBsIGluIHRoaXMuX2xheWVycykge1xuICAgICAgY29uc3QgbGF5ZXJDYWNoZSA9IHRoaXMuX2xheWVyc1tsXTtcbiAgICAgIGNvbnN0IG9ubHlWaXNpYmxlID1cbiAgICAgICAgb3B0aW9ucy5vbmx5VmlzaWJsZSAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5vbmx5VmlzaWJsZSA6IHRydWU7XG4gICAgICBsZXQgdXNlTGF5ZXJBdHRyID0gb25seVZpc2libGUgPyBsYXllckNhY2hlLm9wdGlvbnMudmlzaWJpbGl0eSA6IHRydWU7XG4gICAgICBpZiAodXNlTGF5ZXJBdHRyICYmIG9wdGlvbnMub25seUJhc2VsYXllcikge1xuICAgICAgICB1c2VMYXllckF0dHIgPSB0aGlzLl9iYXNlbGF5ZXJzLmluY2x1ZGVzKGwpO1xuICAgICAgfVxuICAgICAgaWYgKHVzZUxheWVyQXR0cikge1xuICAgICAgICBjb25zdCBhdHRyID0gbGF5ZXJDYWNoZS5vcHRpb25zICYmIGxheWVyQ2FjaGUub3B0aW9ucy5hdHRyaWJ1dGlvbjtcbiAgICAgICAgaWYgKGF0dHIpIHtcbiAgICAgICAgICBhdHRyaWJ1dGlvbnMucHVzaChhdHRyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhdHRyaWJ1dGlvbnM7XG4gIH1cblxuICBnZXRBY3RpdmVCYXNlTGF5ZXIoKTogTWFpbkxheWVyQWRhcHRlcjxhbnksIGFueSwgQWRhcHRlck9wdGlvbnM+IHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCB2aXNpYmxlTGF5ZXJCYXNlTGF5ZXIgPSB0aGlzLmdldEJhc2VMYXllcnMoKS5maW5kKCh4KSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5pc0xheWVyVmlzaWJsZSh4KTtcbiAgICB9KTtcbiAgICBpZiAodmlzaWJsZUxheWVyQmFzZUxheWVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRMYXllcih2aXNpYmxlTGF5ZXJCYXNlTGF5ZXIpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgX29uTGF5ZXJDbGljayhvcHRpb25zOiBPbkxheWVyQ2xpY2tPcHRpb25zKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2xheWVyOmNsaWNrJywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShvcHRpb25zKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgX29uTGF5ZXJTZWxlY3Qob3B0aW9uczogT25MYXllclNlbGVjdE9wdGlvbnMpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnbGF5ZXI6c2VsZWN0Jywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShvcHRpb25zKTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZUdlb0pzb25PcHRpb25zKG9wdGlvbnM6IEdlb0pzb25BZGFwdGVyT3B0aW9ucykge1xuICAgIGNvbnN0IG9uTGF5ZXJDbGlja0Zyb21PcHQgPSBvcHRpb25zLm9uTGF5ZXJDbGljaztcbiAgICBvcHRpb25zLm9uTGF5ZXJDbGljayA9IChlKSA9PiB7XG4gICAgICBpZiAob25MYXllckNsaWNrRnJvbU9wdCkge1xuICAgICAgICBvbkxheWVyQ2xpY2tGcm9tT3B0KGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX29uTGF5ZXJDbGljayhlKTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25MYXllclNlbGVjdEZyb21PcHQgPSBvcHRpb25zLm9uTGF5ZXJTZWxlY3Q7XG4gICAgb3B0aW9ucy5vbkxheWVyU2VsZWN0ID0gKGUpID0+IHtcbiAgICAgIGlmIChvbkxheWVyU2VsZWN0RnJvbU9wdCkge1xuICAgICAgICBvbkxheWVyU2VsZWN0RnJvbU9wdChlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl9vbkxheWVyU2VsZWN0KGUpO1xuICAgIH07XG5cbiAgICBpZiAoIW9wdGlvbnMubmF0aXZlUGFpbnQpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFpbnQpIHtcbiAgICAgICAgb3B0aW9ucy5wYWludCA9IHByZXBhcmVQYWludChcbiAgICAgICAgICBvcHRpb25zLnBhaW50IHx8IHt9LFxuICAgICAgICAgIHRoaXMub3B0aW9ucy5wYWludCxcbiAgICAgICAgICB0aGlzLmdldFBhaW50RnVuY3Rpb25zXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy5zZWxlY3RlZFBhaW50ICYmIHRoaXMub3B0aW9ucy5zZWxlY3RlZFBhaW50KSB7XG4gICAgICAgIG9wdGlvbnMuc2VsZWN0ZWRQYWludCA9IHByZXBhcmVQYWludChcbiAgICAgICAgICBvcHRpb25zLnNlbGVjdGVkUGFpbnQsXG4gICAgICAgICAgdGhpcy5vcHRpb25zLnNlbGVjdGVkUGFpbnQsXG4gICAgICAgICAgdGhpcy5nZXRQYWludEZ1bmN0aW9uc1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcbmltcG9ydCB7IEZlYXR1cmUsIFBvbHlnb24gfSBmcm9tICdnZW9qc29uJztcbmltcG9ydCBTdHJpY3RFdmVudEVtaXR0ZXIgZnJvbSAnc3RyaWN0LWV2ZW50LWVtaXR0ZXItdHlwZXMnO1xuXG5pbXBvcnQgeyBkZWVwbWVyZ2UsIGRlZmluZWQgfSBmcm9tICdAbmV4dGdpcy91dGlscyc7XG5pbXBvcnQgeyBHZXRQYWludEZ1bmN0aW9uIH0gZnJvbSAnQG5leHRnaXMvcGFpbnQnO1xuXG5pbXBvcnQge1xuICBMbmdMYXRCb3VuZHNBcnJheSxcbiAgVHlwZSxcbiAgQ3Vyc29yLFxuICBMbmdMYXRBcnJheSxcbn0gZnJvbSAnLi9pbnRlcmZhY2VzL0Jhc2VUeXBlcyc7XG5pbXBvcnQge1xuICBMb2NhdGUsXG4gIE1hcEFkYXB0ZXIsXG4gIEZpdE9wdGlvbnMsXG4gIExvY2F0ZU9wdGlvbnMsXG4gIExvY2F0aW9uRXZlbnRzLFxufSBmcm9tICcuL2ludGVyZmFjZXMvTWFwQWRhcHRlcic7XG5pbXBvcnQgeyBTdGFydGVyS2l0IH0gZnJvbSAnLi9pbnRlcmZhY2VzL1N0YXJ0ZXJLaXQnO1xuaW1wb3J0IHsgTGF5ZXJBZGFwdGVyIH0gZnJvbSAnLi9pbnRlcmZhY2VzL0xheWVyQWRhcHRlcic7XG5pbXBvcnQgeyBSdW50aW1lUGFyYW1zIH0gZnJvbSAnLi9pbnRlcmZhY2VzL1J1bnRpbWVQYXJhbXMnO1xuaW1wb3J0IHsgTWFwT3B0aW9ucywgQXBwT3B0aW9ucyB9IGZyb20gJy4vaW50ZXJmYWNlcy9XZWJNYXBBcHAnO1xuaW1wb3J0IHsgV2ViTWFwRXZlbnRzLCBCYXNlTWFwRXZlbnRzIH0gZnJvbSAnLi9pbnRlcmZhY2VzL0V2ZW50cyc7XG5cbmltcG9ydCB7IEtleXMgfSBmcm9tICcuL2NvbXBvbmVudHMva2V5cy9LZXlzJztcbmltcG9ydCB7IENlbnRlclN0YXRlIH0gZnJvbSAnLi9jb21wb25lbnRzL21hcFN0YXRlcy9DZW50ZXJTdGF0ZSc7XG5pbXBvcnQgeyBTdGF0ZUl0ZW0gfSBmcm9tICcuL2NvbXBvbmVudHMvbWFwU3RhdGVzL1N0YXRlSXRlbSc7XG5pbXBvcnQgeyBab29tU3RhdGUgfSBmcm9tICcuL2NvbXBvbmVudHMvbWFwU3RhdGVzL1pvb21TdGF0ZSc7XG5pbXBvcnQgeyBjcmVhdGVUb2dnbGVDb250cm9sIH0gZnJvbSAnLi9jb21wb25lbnRzL2NvbnRyb2xzL2NyZWF0ZVRvZ2dsZUNvbnRyb2wnO1xuXG5pbXBvcnQge1xuICBkZXRlY3RHZW9tZXRyeVR5cGUsXG4gIGZpbmRNb3N0RnJlcXVlbnRHZW9tVHlwZSxcbn0gZnJvbSAnLi91dGlscy9nZW9tZXRyeVR5cGVzJztcbmltcG9ydCB7IG9uTG9hZCB9IGZyb20gJy4vdXRpbHMvZGVjb3JhdG9ycyc7XG5pbXBvcnQgeyBjbGVhck9iamVjdCB9IGZyb20gJy4vdXRpbHMvY2xlYXJPYmplY3QnO1xuaW1wb3J0IHsgcHJvcGVydGllc0ZpbHRlciB9IGZyb20gJy4vdXRpbHMvcHJvcGVydGllc0ZpbHRlcic7XG5pbXBvcnQgeyBnZXRCb3VuZHNQb2x5Z29uIH0gZnJvbSAnLi91dGlscy9nZXRCb3VuZHNQb2x5Z29uJztcbmltcG9ydCB7IHVwZGF0ZUdlb0pzb25BZGFwdGVyT3B0aW9ucyB9IGZyb20gJy4vdXRpbHMvdXBkYXRlR2VvSnNvbkFkYXB0ZXJPcHRpb25zJztcblxudHlwZSBFbWl0U3RhdHVzRXZlbnREYXRhID0gYW55O1xuXG5sZXQgSUQgPSAwO1xuY29uc3QgV0VCX01BUF9DT05UQUlORVI6IFJlY29yZDxudW1iZXIsIGFueT4gPSB7fTtcblxuY29uc3QgT1BUSU9OUzogTWFwT3B0aW9ucyA9IHtcbiAgbWluWm9vbTogMCxcbiAgbWF4Wm9vbTogMjEsXG4gIHBhaW50OiB7XG4gICAgY29sb3I6ICdibHVlJyxcbiAgICBvcGFjaXR5OiAxLFxuICAgIHJhZGl1czogOCxcbiAgICB3ZWlnaHQ6IDEsXG4gIH0sXG4gIHNlbGVjdGVkUGFpbnQ6IHtcbiAgICBjb2xvcjogJ2RhcmtibHVlJyxcbiAgICBvcGFjaXR5OiAxLFxuICAgIHJhZGl1czogMTIsXG4gICAgd2VpZ2h0OiAxLFxuICB9LFxufTtcblxuLyoqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjbGFzcyBXZWJNYXBNYWluPFxuICBNID0gYW55LFxuICBMID0gYW55LFxuICBDID0gYW55LFxuICBFIGV4dGVuZHMgV2ViTWFwRXZlbnRzID0gV2ViTWFwRXZlbnRzXG4+IHtcbiAgc3RhdGljIGtleXM6IEtleXMgPSBuZXcgS2V5cygpO1xuICBzdGF0aWMgdXRpbHMgPSB7XG4gICAgZGV0ZWN0R2VvbWV0cnlUeXBlLFxuICAgIGZpbmRNb3N0RnJlcXVlbnRHZW9tVHlwZSxcbiAgICB1cGRhdGVHZW9Kc29uQWRhcHRlck9wdGlvbnMsXG4gICAgcHJvcGVydGllc0ZpbHRlcixcbiAgICBjcmVhdGVUb2dnbGVDb250cm9sLFxuICAgIGdldEJvdW5kc1BvbHlnb24sXG4gIH07XG4gIHN0YXRpYyBnZXRQYWludEZ1bmN0aW9uczogeyBbbmFtZTogc3RyaW5nXTogR2V0UGFpbnRGdW5jdGlvbiB9O1xuICBzdGF0aWMgZGVjb3JhdG9ycyA9IHsgb25Mb2FkIH07XG5cbiAgb3B0aW9uczogTWFwT3B0aW9ucyA9IE9QVElPTlM7XG4gIC8vIGBXZWJNYXBFdmVudHNgIG11c3QgYmUgYEVgIGJ1dCBpdHMgbm90IHdvcmsgY29ycmVjdFxuICByZWFkb25seSBlbWl0dGVyOiBTdHJpY3RFdmVudEVtaXR0ZXI8XG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIFdlYk1hcEV2ZW50c1xuICA+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICByZWFkb25seSBrZXlzID0gV2ViTWFwTWFpbi5rZXlzO1xuXG4gIHJlYWRvbmx5IG1hcEFkYXB0ZXI6IE1hcEFkYXB0ZXI8TT47XG4gIHJlYWRvbmx5IHJ1bnRpbWVQYXJhbXM6IFJ1bnRpbWVQYXJhbXNbXSA9IFtdO1xuXG4gIGdldFBhaW50RnVuY3Rpb25zID0gV2ViTWFwTWFpbi5nZXRQYWludEZ1bmN0aW9ucztcbiAgbWFwU3RhdGU6IFR5cGU8U3RhdGVJdGVtPltdID0gW0NlbnRlclN0YXRlLCBab29tU3RhdGVdO1xuICBpZCA9IElEKys7XG5cbiAgLyoqXG4gICAqIEZyb20gcnVudGltZSBwYXJhbXNcbiAgICovXG4gIHByb3RlY3RlZCBfaW5pdE1hcFN0YXRlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gIHByb3RlY3RlZCByZWFkb25seSBfc3RhcnRlcktpdHM6IFN0YXJ0ZXJLaXRbXTtcbiAgcHJpdmF0ZSBfbWFwU3RhdGU6IFN0YXRlSXRlbVtdID0gW107XG4gIHByaXZhdGUgX2V4dGVudD86IExuZ0xhdEJvdW5kc0FycmF5O1xuICBwcml2YXRlIHJlYWRvbmx5IF9ldmVudHNTdGF0dXM6IHsgW2tleSBpbiBrZXlvZiBFXT86IGJvb2xlYW4gfSA9IHt9O1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX21hcEV2ZW50czogUmVjb3JkPHN0cmluZywgKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkPiA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKGFwcE9wdGlvbnM6IEFwcE9wdGlvbnMpIHtcbiAgICBXRUJfTUFQX0NPTlRBSU5FUlt0aGlzLmlkXSA9IHRoaXM7XG4gICAgdGhpcy5tYXBBZGFwdGVyID0gYXBwT3B0aW9ucy5tYXBBZGFwdGVyO1xuICAgIHRoaXMuX3N0YXJ0ZXJLaXRzID0gYXBwT3B0aW9ucy5zdGFydGVyS2l0cyB8fCBbXTtcbiAgICBpZiAoYXBwT3B0aW9ucy5tYXBPcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBkZWVwbWVyZ2UoT1BUSU9OUyB8fCB7fSwgYXBwT3B0aW9ucy5tYXBPcHRpb25zKTtcbiAgICB9XG4gICAgaWYgKGFwcE9wdGlvbnMucnVudGltZVBhcmFtcykge1xuICAgICAgdGhpcy5ydW50aW1lUGFyYW1zID0gYXBwT3B0aW9ucy5ydW50aW1lUGFyYW1zO1xuICAgIH1cbiAgICB0aGlzLl9hZGRFdmVudHNMaXN0ZW5lcnMoKTtcbiAgICBpZiAoYXBwT3B0aW9ucy5jcmVhdGUpIHtcbiAgICAgIHRoaXMuY3JlYXRlKHRoaXMub3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldDxUIGV4dGVuZHMgV2ViTWFwTWFpbiA9IFdlYk1hcE1haW4+KGlkOiBudW1iZXIpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gV0VCX01BUF9DT05UQUlORVJbaWRdO1xuICB9XG5cbiAgZ2V0SWQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5pZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYW51YWwgd2F5IHRvIGNyZWF0ZSBhIG1hcC4gT24gZGVmYXVsdFxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIGNvbnN0IHdlYk1hcCA9IG5ldyBXZWJNYXAob3B0aW9ucyk7XG4gICAqIHdlYk1hcC5jcmVhdGUobWFwT3B0aW9ucykudGhlbigoKSA9PiBkb1NvbWV0aGluZygpKTtcbiAgICogYGBgXG4gICAqL1xuICBhc3luYyBjcmVhdGUob3B0aW9ucz86IE1hcE9wdGlvbnMpOiBQcm9taXNlPHRoaXM+IHtcbiAgICBpZiAoIXRoaXMuZ2V0RXZlbnRTdGF0dXMoJ2NyZWF0ZScpKSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBkZWVwbWVyZ2UoT1BUSU9OUyB8fCB7fSwgb3B0aW9ucyB8fCB7fSk7XG4gICAgICBhd2FpdCB0aGlzLl9zZXRJbml0TWFwU3RhdGUodGhpcy5tYXBTdGF0ZSk7XG4gICAgICBhd2FpdCB0aGlzLl9zZXR1cE1hcCgpO1xuICAgICAgdGhpcy5fZW1pdFN0YXR1c0V2ZW50KCdjcmVhdGUnLCB0aGlzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXRSdW50aW1lUGFyYW1zKHBhcmFtczogUnVudGltZVBhcmFtcyk6IHZvaWQge1xuICAgIHRoaXMucnVudGltZVBhcmFtcy5wdXNoKHBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveXMgV2ViTWFwLCBNYXBBZGFwdGVyLCBjbGVhcnMgYWxsIGxheWVycyBhbmQgdHVybiBvZmYgYWxsIGV2ZW50IGxpc3RlbmVyc1xuICAgKi9cbiAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLl9yZW1vdmVFdmVudExpc3RlbmVycygpO1xuICAgIGNsZWFyT2JqZWN0KHRoaXMuX2VtaXRTdGF0dXNFdmVudCk7XG4gICAgaWYgKHRoaXMubWFwQWRhcHRlci5kZXN0cm95KSB7XG4gICAgICB0aGlzLm1hcEFkYXB0ZXIuZGVzdHJveSgpO1xuICAgIH1cbiAgfVxuXG4gIGdldFN0YXRlKCk6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICAgIGNvbnN0IHN0YXRlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgdGhpcy5fbWFwU3RhdGUuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgc3RhdGVbeC5uYW1lXSA9IHguZ2V0VmFsdWUoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBnZXRSdW50aW1lUGFyYW1zKCk6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICAgIGNvbnN0IHN0YXRlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgdGhpcy5fbWFwU3RhdGUuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgZm9yIChjb25zdCByIG9mIHRoaXMucnVudGltZVBhcmFtcykge1xuICAgICAgICBjb25zdCB2YWwgPSByLmdldCh4Lm5hbWUpO1xuICAgICAgICBpZiAodmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBzdGF0ZVt4Lm5hbWVdID0geC5wYXJzZSh2YWwpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIEhUTUwgZWxlbWVudCB0aGF0IGNvbnRhaW5zIHRoZSBtYXAuXG4gICAqIEByZXR1cm5zIFRoZSBtYXAncyBjb250YWluZXJcbiAgICovXG4gIGdldENvbnRhaW5lcigpOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHRoaXMubWFwQWRhcHRlci5nZXRDb250YWluZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLm1hcEFkYXB0ZXIuZ2V0Q29udGFpbmVyKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMudGFyZ2V0KSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMudGFyZ2V0O1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLnRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMub3B0aW9ucy50YXJnZXQpO1xuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgY3Vyc29yIGljb24gdG8gYmUgZGlzcGxheWVkIHdoZW4gaG92ZXIgaWNvbiBvbiB0aGUgbWFwIGNvbnRhaW5lci5cbiAgICogQHBhcmFtIGN1cnNvciBhdmFpbGFibGUgY3Vyc29yIG5hbWUgZnJvbSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9ydS9kb2NzL1dlYi9DU1MvY3Vyc29yXG4gICAqL1xuICBzZXRDdXJzb3IoY3Vyc29yOiBDdXJzb3IpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5tYXBBZGFwdGVyLnNldEN1cnNvcikge1xuICAgICAgdGhpcy5tYXBBZGFwdGVyLnNldEN1cnNvcihjdXJzb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGNlbnRlciBvZiB0aGUgY3VycmVudCB2aWV3LlxuICAgKiBAcGFyYW0gbG5nTGF0IEFycmF5IG9mIHR3byBudW1iZXJzIHJlcHJlc2VudGluZyBsb25naXR1ZGUgYW5kIGxhdGl0dWRlIG9mIHRoZSBjZW50ZXIgb2YgdGhlIG1hcCB2aWV3LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIC8vIE1vdW50IEV2ZXJlc3QgMjfCsCA1OeKAsiAxN+KAsyBOLCA4NsKwIDU14oCyIDMx4oCzIEVcbiAgICogd2ViTWFwLnNldENlbnRlcihbODYuOTI1Mjc4LCAyNy45ODgwNTZdKTtcbiAgICogYGBgXG4gICAqL1xuICBzZXRDZW50ZXIobG5nTGF0OiBMbmdMYXRBcnJheSk6IHRoaXMge1xuICAgIHRoaXMubWFwQWRhcHRlci5zZXRDZW50ZXIobG5nTGF0KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtYXAncyBnZW9ncmFwaGljYWwgY2VudGVycG9pbnQuXG4gICAqIEByZXR1cm4gbG5nTGF0IEFycmF5IG9mIHR3byBudW1iZXJzIHJlcHJlc2VudGluZyBsb25naXR1ZGUgYW5kIGxhdGl0dWRlIG9mIHRoZSBjZW50ZXIgb2YgdGhlIG1hcCB2aWV3LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIC8vIE1vdW50IEV2ZXJlc3QgMjfCsCA1OeKAsiAxN+KAsyBOLCA4NsKwIDU14oCyIDMx4oCzIEVcbiAgICogd2ViTWFwLmdldENlbnRlcigpOyAvLyBbODYuOTI1Mjc4LCAyNy45ODgwNTZdXG4gICAqIGBgYFxuICAgKi9cbiAgZ2V0Q2VudGVyKCk6IExuZ0xhdEFycmF5IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5tYXBBZGFwdGVyLmdldENlbnRlcigpO1xuICB9XG5cbiAgZ2V0Qm91bmRzKCk6IExuZ0xhdEJvdW5kc0FycmF5IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAodGhpcy5tYXBBZGFwdGVyLmdldEJvdW5kcykge1xuICAgICAgcmV0dXJuIHRoaXMubWFwQWRhcHRlci5nZXRCb3VuZHMoKTtcbiAgICB9XG4gIH1cblxuICBnZXRCb3VuZHNQb2x5Z29uKCk6IEZlYXR1cmU8UG9seWdvbj4gfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuZ2V0Qm91bmRzKCk7XG4gICAgaWYgKGJvdW5kcykge1xuICAgICAgY29uc3QgZmVhdHVyZSA9IGdldEJvdW5kc1BvbHlnb24oYm91bmRzKTtcbiAgICAgIHJldHVybiBmZWF0dXJlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBab29tIHRvIGEgc3BlY2lmaWMgem9vbSBsZXZlbC5cbiAgICogQHBhcmFtIHpvb20gVGhlIHpvb20gbGV2ZWwgdG8gc2V0ICgwLTI0KS5cbiAgICovXG4gIHNldFpvb20oem9vbTogbnVtYmVyKTogdGhpcyB7XG4gICAgdGhpcy5tYXBBZGFwdGVyLnNldFpvb20oem9vbSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWFwJ3MgY3VycmVudCB6b29tIGxldmVsLlxuICAgKiBAcmV0dXJuIFRoZSBtYXAncyBjdXJyZW50IHpvb20gbGV2ZWwgKDAtMjQpLlxuICAgKi9cbiAgZ2V0Wm9vbSgpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLm1hcEFkYXB0ZXIuZ2V0Wm9vbSgpO1xuICB9XG5cbiAgem9vbUluKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm1hcEFkYXB0ZXIuem9vbUluKSB7XG4gICAgICB0aGlzLm1hcEFkYXB0ZXIuem9vbUluKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHpvb20gPSB0aGlzLmdldFpvb20oKTtcbiAgICAgIGlmICh6b29tKSB7XG4gICAgICAgIGNvbnN0IHRvWm9vbSA9IHpvb20gKyAxO1xuICAgICAgICB0aGlzLnNldFpvb20odG9ab29tKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB6b29tT3V0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm1hcEFkYXB0ZXIuem9vbU91dCkge1xuICAgICAgdGhpcy5tYXBBZGFwdGVyLnpvb21PdXQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgem9vbSA9IHRoaXMuZ2V0Wm9vbSgpO1xuICAgICAgaWYgKHpvb20pIHtcbiAgICAgICAgY29uc3QgdG9ab29tID0gem9vbSAtIDE7XG4gICAgICAgIHRoaXMuc2V0Wm9vbSh0b1pvb20pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2aWV3IG9mIHRoZSBtYXAgZ2VvZ3JhcGhpY2FsIGNlbnRlciBhbmQgem9vbVxuICAgKiBAcGFyYW0gbG5nTGF0IEFycmF5IG9mIHR3byBudW1iZXJzIHJlcHJlc2VudGluZyBsb25naXR1ZGUgYW5kIGxhdGl0dWRlIG9mIHRoZSBjZW50ZXIgb2YgdGhlIG1hcCB2aWV3LlxuICAgKiBAcGFyYW0gem9vbSBUaGUgem9vbSBsZXZlbCB0byBzZXQgKDAtMjQpLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIC8vIE1vdW50IEV2ZXJlc3QgMjfCsCA1OeKAsiAxN+KAsyBOLCA4NsKwIDU14oCyIDMx4oCzIEVcbiAgICogd2ViTWFwLnNldFZpZXcoWzg2LjkyNTI3OCwgMjcuOTg4MDU2XSwgMTIpXG4gICAqIGBgYFxuICAgKi9cbiAgc2V0VmlldyhsbmdMYXQ/OiBMbmdMYXRBcnJheSwgem9vbT86IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLm1hcEFkYXB0ZXIuc2V0VmlldyAmJiBsbmdMYXQgJiYgem9vbSkge1xuICAgICAgdGhpcy5tYXBBZGFwdGVyLnNldFZpZXcobG5nTGF0LCB6b29tKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGxuZ0xhdCkge1xuICAgICAgICB0aGlzLm1hcEFkYXB0ZXIuc2V0Q2VudGVyKGxuZ0xhdCk7XG4gICAgICB9XG4gICAgICBpZiAoem9vbSkge1xuICAgICAgICB0aGlzLm1hcEFkYXB0ZXIuc2V0Wm9vbSh6b29tKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhIG1hcCB2aWV3IHRoYXQgY29udGFpbnMgdGhlIGdpdmVuIGdlb2dyYXBoaWNhbCBib3VuZHMuXG4gICAqIEBwYXJhbSBib3VuZHMgQXJyYXkgb2YgY29vcmRpbmF0ZXMsIG1lYXN1cmVkIGluIGRlZ3JlZXMsIGluIFt3ZXN0LCBzb3V0aCwgZWFzdCwgbm9ydGhdIG9yZGVyLlxuICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIC8vIFdob2xlIHdvcmxkXG4gICAqIHdlYk1hcC5maXRCb3VuZHMoWzAsIC05MCwgMTgwLCA5MF0pO1xuICAgKiBgYGBcbiAgICovXG4gIGZpdEJvdW5kcyhib3VuZHM6IExuZ0xhdEJvdW5kc0FycmF5LCBvcHRpb25zPzogRml0T3B0aW9ucyk6IHRoaXMge1xuICAgIGlmIChib3VuZHMuZXZlcnkoKHgpID0+IGRlZmluZWQoeCkpKSB7XG4gICAgICBpZiAoYm91bmRzWzFdIDwgLTg1LjA2KSB7XG4gICAgICAgIGJvdW5kc1sxXSA9IC04NS4wNjtcbiAgICAgIH1cbiAgICAgIGlmIChib3VuZHNbM10gPiA4NS4wNikge1xuICAgICAgICBib3VuZHNbM10gPSA4NS4wNjtcbiAgICAgIH1cbiAgICAgIHRoaXMubWFwQWRhcHRlci5maXRCb3VuZHMoYm91bmRzLCBvcHRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tpbmcgdGhlIHN0YXR1cyBvZiBhbnkgYXN5bmNocm9ub3VzIG9wZXJhdGlvblxuICAgKiBAcGFyYW0gZXZlbnQgVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHdob3NlIHN0YXR1cyBpcyBjaGVja2VkXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogdmFyIHdlYk1hcCA9IG5ldyBXZWJNYXAob3B0aW9ucyk7XG4gICAqIHdlYk1hcC5nZXRFdmVudFN0YXR1cygnY3JlYXRlJyk7IC8vIGZhbHNlXG4gICAqIHdlYk1hcC5lbWl0dGVyLm9uKCdjcmVhdGUnLCBmdW5jdGlvbiAoKSB7XG4gICAqICAgd2ViTWFwLmdldEV2ZW50U3RhdHVzKCdjcmVhdGUnKTsgLy8gdHJ1ZVxuICAgKiB9KVxuICAgKiBgYGBcbiAgICovXG4gIGdldEV2ZW50U3RhdHVzKGV2ZW50OiBrZXlvZiBFKTogYm9vbGVhbiB7XG4gICAgLy8gdWdseSBoYWNrIHRvIGRpc2FibGUgdHlwZSBjaGVja2luZyBlcnJvclxuICAgIGNvbnN0IF9ldmVudE5hbWUgPSBldmVudCBhcyBrZXlvZiBXZWJNYXBFdmVudHM7XG4gICAgY29uc3Qgc3RhdHVzID0gdGhpcy5fZXZlbnRzU3RhdHVzW19ldmVudE5hbWVdO1xuICAgIHJldHVybiBzdGF0dXMgPz8gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogaGVscGVyIG1ldGhvZCB0byB3YWl0IGZvciBldmVudHMgdG8gbG9hZC4gQnkgZGVmYXVsdCwgY2FyZCBjcmVhdGlvbiBpcyB0cmFja2VkXG4gICAqIEBwYXJhbSBldmVudCBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgd2hvc2Ugc3RhdHVzIGlzIGNoZWNrZWRcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYGBgamF2YXNjcmlwdFxuICAgKiB2YXIgd2ViTWFwID0gbmV3IFdlYk1hcChvcHRpb25zKTtcbiAgICogd2ViTWFwLm9uTG9hZCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgKiAgIHdlYk1hcC5nZXRFdmVudFN0YXR1cygnY3JlYXRlJyk7IC8vIHRydWVcbiAgICogfSlcbiAgICpcbiAgICogLy8gdXNlIGFzeW5jL2F3YWl0IHN5bnRheFxuICAgKiBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAqICAgYXdhaXQgd2ViTWFwLm9uTG9hZCgpO1xuICAgKiAgIGRvU29tZXRoaW5nKCk7XG4gICAqIH1cbiAgICpcbiAgICogYGBgXG4gICAqL1xuICBvbkxvYWQoZXZlbnQ6IGtleW9mIFdlYk1hcEV2ZW50cyA9ICdjcmVhdGUnKTogUHJvbWlzZTx0aGlzPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMpID0+IHtcbiAgICAgIGlmICh0aGlzLmdldEV2ZW50U3RhdHVzKGV2ZW50KSkge1xuICAgICAgICByZXModGhpcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVtaXR0ZXIub25jZShldmVudCwgKCkgPT4ge1xuICAgICAgICAgIHJlcyh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBvbk1hcExvYWQoY2I/OiAobWFwQWRhcHRlcjogTWFwQWRhcHRlcikgPT4gdm9pZCk6IFByb21pc2U8TWFwQWRhcHRlcj4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzKSA9PiB7XG4gICAgICBjb25zdCBfcmVzb2x2ZSA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgbWFwQWRhcHRlciA9IHRoaXMubWFwQWRhcHRlcjtcbiAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgY2IobWFwQWRhcHRlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hcEFkYXB0ZXIpIHtcbiAgICAgICAgICByZXMobWFwQWRhcHRlcik7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjb25zdCBpc0xvYWRlZCA9IHRoaXMubWFwQWRhcHRlci5pc0xvYWRlZCA/PyB0cnVlO1xuICAgICAgaWYgKHRoaXMubWFwQWRhcHRlci5tYXAgJiYgaXNMb2FkZWQpIHtcbiAgICAgICAgX3Jlc29sdmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubWFwQWRhcHRlci5lbWl0dGVyLm9uY2UoJ2NyZWF0ZScsICgpID0+IHtcbiAgICAgICAgICBfcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldExheWVyQWRhcHRlcnMoKTogeyBbbmFtZTogc3RyaW5nXTogVHlwZTxMYXllckFkYXB0ZXI+IH0ge1xuICAgIHJldHVybiB0aGlzLm1hcEFkYXB0ZXIubGF5ZXJBZGFwdGVycztcbiAgfVxuXG4gIGdldExheWVyQWRhcHRlcihuYW1lOiBzdHJpbmcpOiBUeXBlPExheWVyQWRhcHRlcj4ge1xuICAgIGNvbnN0IGFkYXB0ZXIgPSB0aGlzLm1hcEFkYXB0ZXIubGF5ZXJBZGFwdGVyc1tuYW1lXTtcbiAgICByZXR1cm4gYWRhcHRlcjtcbiAgfVxuXG4gIGxvY2F0ZShvcHQ6IExvY2F0ZU9wdGlvbnMsIGV2ZW50cz86IExvY2F0aW9uRXZlbnRzKTogTG9jYXRlIHtcbiAgICBpZiAodGhpcy5tYXBBZGFwdGVyICYmIHRoaXMubWFwQWRhcHRlci5sb2NhdGUpIHtcbiAgICAgIHJldHVybiB0aGlzLm1hcEFkYXB0ZXIubG9jYXRlKG9wdCwgZXZlbnRzKTtcbiAgICB9XG4gICAgY29uc3Qgc3RvcCA9ICgpID0+ICh7fSk7XG4gICAgcmV0dXJuIHsgc3RvcCB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIF9lbWl0U3RhdHVzRXZlbnQoXG4gICAgZXZlbnROYW1lOiBrZXlvZiBFLFxuICAgIGRhdGE/OiBFbWl0U3RhdHVzRXZlbnREYXRhXG4gICk6IHZvaWQge1xuICAgIC8vIHVnbHkgaGFjayB0byBkaXNhYmxlIHR5cGUgY2hlY2tpbmcgZXJyb3JcbiAgICBjb25zdCBfZXZlbnROYW1lID0gZXZlbnROYW1lIGFzIGtleW9mIFdlYk1hcEV2ZW50cztcbiAgICB0aGlzLl9ldmVudHNTdGF0dXNbX2V2ZW50TmFtZV0gPSB0cnVlO1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KF9ldmVudE5hbWUsIGRhdGEpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIF9hZGRMYXllclByb3ZpZGVycygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAvL1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIF9vbkxvYWRTeW5jKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIC8vXG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9zZXR1cE1hcCgpIHtcbiAgICBhd2FpdCB0aGlzLm1hcEFkYXB0ZXIuY3JlYXRlKHRoaXMub3B0aW9ucyk7XG4gICAgdGhpcy5fem9vbVRvSW5pdGlhbEV4dGVudCgpO1xuXG4gICAgYXdhaXQgdGhpcy5fYWRkTGF5ZXJQcm92aWRlcnMoKTtcbiAgICBhd2FpdCB0aGlzLl9vbkxvYWRTeW5jKCk7XG5cbiAgICB0aGlzLl9lbWl0U3RhdHVzRXZlbnQoJ2J1aWxkLW1hcCcsIHRoaXMubWFwQWRhcHRlcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwcml2YXRlIF96b29tVG9Jbml0aWFsRXh0ZW50KCkge1xuICAgIGNvbnN0IHsgY2VudGVyLCB6b29tLCBib3VuZHMgfSA9IHRoaXMub3B0aW9ucztcbiAgICBpZiAodGhpcy5fZXh0ZW50KSB7XG4gICAgICB0aGlzLmZpdEJvdW5kcyh0aGlzLl9leHRlbnQpO1xuICAgIH0gZWxzZSBpZiAoY2VudGVyICYmIHpvb20pIHtcbiAgICAgIHRoaXMuc2V0VmlldyhjZW50ZXIsIHpvb20pO1xuICAgIH0gZWxzZSBpZiAoYm91bmRzKSB7XG4gICAgICB0aGlzLmZpdEJvdW5kcyhib3VuZHMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3NldEluaXRNYXBTdGF0ZShzdGF0ZXM6IFR5cGU8U3RhdGVJdGVtPltdKSB7XG4gICAgZm9yIChjb25zdCBYIG9mIHN0YXRlcykge1xuICAgICAgY29uc3Qgc3RhdGUgPSBuZXcgWCh0aGlzKTtcbiAgICAgIHRoaXMuX21hcFN0YXRlLnB1c2goc3RhdGUpO1xuICAgICAgZm9yIChjb25zdCByIG9mIHRoaXMucnVudGltZVBhcmFtcykge1xuICAgICAgICBjb25zdCBzdHIgPSByLmdldChzdGF0ZS5uYW1lKTtcbiAgICAgICAgaWYgKHN0ciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY29uc3QgdmFsID0gc3RhdGUucGFyc2Uoc3RyKTtcbiAgICAgICAgICAvLyBzdGF0ZS5zZXRWYWx1ZSh2YWwpO1xuICAgICAgICAgIHRoaXMuX2luaXRNYXBTdGF0ZVtzdGF0ZS5uYW1lXSA9IHZhbDtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgdGhpcy5vcHRpb25zW3N0YXRlLm5hbWVdID0gdmFsO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYWRkRXZlbnRzTGlzdGVuZXJzKCk6IHZvaWQge1xuICAgIGNvbnN0IGV2ZW50czogKGtleW9mIEJhc2VNYXBFdmVudHMpW10gPSBbXG4gICAgICAncHJlY2xpY2snLFxuICAgICAgJ2NsaWNrJyxcbiAgICAgICd6b29tc3RhcnQnLFxuICAgICAgJ3pvb20nLFxuICAgICAgJ3pvb21lbmQnLFxuICAgICAgJ21vdmVzdGFydCcsXG4gICAgICAnbW92ZScsXG4gICAgICAnbW92ZWVuZCcsXG4gICAgXTtcbiAgICBldmVudHMuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgdGhpcy5fbWFwRXZlbnRzW3hdID0gKGRhdGEpID0+IHtcbiAgICAgICAgaWYgKHRoaXMucnVudGltZVBhcmFtcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBtYXBTdGF0dXNFdmVudCA9IHRoaXMuX21hcFN0YXRlLmZpbmQoKHkpID0+IHkuZXZlbnQgPT09IHgpO1xuICAgICAgICAgIGlmIChtYXBTdGF0dXNFdmVudCkge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBtYXBTdGF0dXNFdmVudC50b1N0cmluZyhtYXBTdGF0dXNFdmVudC5nZXRWYWx1ZSgpKTtcbiAgICAgICAgICAgIHRoaXMucnVudGltZVBhcmFtcy5mb3JFYWNoKChyKSA9PiB7XG4gICAgICAgICAgICAgIHIuc2V0KG1hcFN0YXR1c0V2ZW50Lm5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fZXZlbnRzU3RhdHVzKSB7XG4gICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoeCwgZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB0aGlzLm1hcEFkYXB0ZXIuZW1pdHRlci5vbih4LCB0aGlzLl9tYXBFdmVudHNbeF0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTogdm9pZCB7XG4gICAgT2JqZWN0LmVudHJpZXModGhpcy5fbWFwRXZlbnRzKS5mb3JFYWNoKChbeCwgZXZlbnRdKSA9PiB7XG4gICAgICB0aGlzLm1hcEFkYXB0ZXIuZW1pdHRlci5vZmYoeCwgZXZlbnQpO1xuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBUb2dnbGVDb250cm9sT3B0aW9ucyxcbiAgVG9nZ2xlQ29udHJvbCxcbiAgQnV0dG9uQ29udHJvbE9wdGlvbnMsXG59IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvTWFwQ29udHJvbCc7XG5cbi8qKlxuICogVGhlIHRvZ2dsZSBpcyBhIGJ1dHRvbiB3aXRoIHN0YXR1cy5cbiAqIEBwYXJhbSBjcmVhdGVCdXR0b25Db250cm9sXG4gKiBAcGFyYW0gb3B0aW9uc1xuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUb2dnbGVDb250cm9sPEMgPSBhbnk+KFxuICBjcmVhdGVCdXR0b25Db250cm9sOiAob3B0aW9uczogQnV0dG9uQ29udHJvbE9wdGlvbnMpID0+IEMsXG4gIG9wdGlvbnM6IFRvZ2dsZUNvbnRyb2xPcHRpb25zXG4pOiBDICYgVG9nZ2xlQ29udHJvbCB7XG4gIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICBsZXQgc3RhdHVzID0gZmFsc2U7XG4gIGlmIChvcHRpb25zLmdldFN0YXR1cykge1xuICAgIHN0YXR1cyA9IG9wdGlvbnMuZ2V0U3RhdHVzKCk7XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5zdGF0dXMpIHtcbiAgICBzdGF0dXMgPSBvcHRpb25zLnN0YXR1cztcbiAgfVxuXG4gIGNvbnN0IHRpdGxlID0gb3B0aW9ucy50aXRsZSB8fCAnJztcbiAgY29uc3QgaHRtbCA9IG9wdGlvbnMuaHRtbDtcblxuICBmdW5jdGlvbiBzZXRUaXRsZSgpIHtcbiAgICBpZiAodGl0bGUpIHtcbiAgICAgIGlmICh0eXBlb2YgdGl0bGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGxpbmsudGl0bGUgPSB0aXRsZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpbmsudGl0bGUgPSBzdGF0dXMgPyB0aXRsZS5vbiA6IHRpdGxlLm9mZjtcbiAgICAgIH1cbiAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgbGluay50aXRsZSk7XG4gICAgfVxuICB9XG4gIHNldFRpdGxlKCk7XG5cbiAgLy8gRG9tRXZlbnQuZGlzYWJsZUNsaWNrUHJvcGFnYXRpb24obGluayk7XG4gIC8vIERvbUV2ZW50Lm9uKGxpbmssICdjbGljaycsIERvbUV2ZW50LnN0b3ApO1xuXG4gIGZ1bmN0aW9uIF9zZXRIdG1sKGh0bWxEZWY6IHN0cmluZyB8IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKGh0bWxEZWYgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgbGluay5pbm5lckhUTUwgPSAnJztcbiAgICAgIGxpbmsuYXBwZW5kQ2hpbGQoaHRtbERlZik7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgaHRtbERlZiA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGxpbmsuaW5uZXJIVE1MID0gaHRtbERlZjtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gc2V0SHRtbCgpIHtcbiAgICBpZiAoaHRtbCkge1xuICAgICAgaWYgKHR5cGVvZiBodG1sID09PSAnc3RyaW5nJyB8fCBodG1sIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgX3NldEh0bWwoaHRtbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfc2V0SHRtbChzdGF0dXMgPyBodG1sLm9uIDogaHRtbC5vZmYpO1xuICAgICAgfVxuICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBsaW5rLnRpdGxlKTtcbiAgICB9XG4gIH1cbiAgc2V0SHRtbCgpO1xuXG4gIGZ1bmN0aW9uIF9zZXRDbGFzcyhhZGRDbGFzczogc3RyaW5nLCBpbXBhY3Q6IGJvb2xlYW4pIHtcbiAgICBhZGRDbGFzcy5zcGxpdCgnICcpLmZvckVhY2goKHgpID0+IHtcbiAgICAgIGlmIChpbXBhY3QpIHtcbiAgICAgICAgbGluay5jbGFzc0xpc3QuYWRkKHgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGluay5jbGFzc0xpc3QucmVtb3ZlKHgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0Q2xhc3MoKSB7XG4gICAgaWYgKG9wdGlvbnMuYWRkQ2xhc3NPbikge1xuICAgICAgX3NldENsYXNzKG9wdGlvbnMuYWRkQ2xhc3NPbiwgc3RhdHVzKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuYWRkQ2xhc3NPZmYpIHtcbiAgICAgIF9zZXRDbGFzcyhvcHRpb25zLmFkZENsYXNzT2ZmLCAhc3RhdHVzKTtcbiAgICB9XG4gIH1cblxuICBpZiAob3B0aW9ucy5hZGRDbGFzcykge1xuICAgIF9zZXRDbGFzcyhvcHRpb25zLmFkZENsYXNzLCB0cnVlKTtcbiAgfVxuICBzZXRDbGFzcygpO1xuXG4gIGNvbnN0IGNoYW5nZVN0YXR1cyA9IChzdGF0dXNfPzogYm9vbGVhbikgPT4ge1xuICAgIGlmIChzdGF0dXNfICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHN0YXR1cyA9IHN0YXR1c187XG4gICAgfVxuICAgIHNldEh0bWwoKTtcbiAgICBzZXRUaXRsZSgpO1xuICAgIHNldENsYXNzKCk7XG4gIH07XG5cbiAgY29uc3Qgb25DbGljayA9IChzdGF0dXNfPzogYm9vbGVhbikgPT4ge1xuICAgIHN0YXR1cyA9IHN0YXR1c18gIT09IHVuZGVmaW5lZCA/IHN0YXR1c18gOiAhc3RhdHVzO1xuICAgIGlmIChvcHRpb25zLm9uQ2xpY2spIHtcbiAgICAgIGNvbnN0IGFmdGVyQ2xpY2sgPSBvcHRpb25zLm9uQ2xpY2soc3RhdHVzKTtcbiAgICAgIFByb21pc2UucmVzb2x2ZShhZnRlckNsaWNrKVxuICAgICAgICAudGhlbigoKSA9PiBjaGFuZ2VTdGF0dXMoKSlcbiAgICAgICAgLmNhdGNoKCgpID0+IChzdGF0dXMgPSAhc3RhdHVzKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNoYW5nZVN0YXR1cygpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBidXR0b25Db250cm9sID0gY3JlYXRlQnV0dG9uQ29udHJvbCh7XG4gICAgaHRtbDogbGluayxcbiAgICBvbkNsaWNrLFxuICB9KSBhcyBDICYgVG9nZ2xlQ29udHJvbDtcbiAgYnV0dG9uQ29udHJvbC5vbkNsaWNrID0gb25DbGljaztcbiAgYnV0dG9uQ29udHJvbC5jaGFuZ2VTdGF0dXMgPSBjaGFuZ2VTdGF0dXM7XG4gIHJldHVybiBidXR0b25Db250cm9sO1xufVxuIiwiaW1wb3J0IHsgS2V5Q29kZXMgfSBmcm9tICcuL0tleXNDb2Rlcyc7XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIGtleSBzeW1ib2xcbiAqIEBwYXJhbSB7c3RyaW5nfSBmdW5jIC0gYWN0aW9uIG9uIGtleSBwcmVzc1xuICogQHBhcmFtIHtudW1iZXJ9IFtrZXlDb2RlXSAtIGtleSBjb2RlIGZvciBzcGVjaWFsIGJ1dHRvbiBsaWtlIHRhYlxuICpcbiAqIEBleHBvcnRcbiAqIEBpbnRlcmZhY2UgS2V5Q29udHJvbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEtleUNvbnRyb2wge1xuICBrZXk/OiBzdHJpbmc7XG4gIGtleUNvZGU/OiBudW1iZXI7XG4gIGZ1bmM6ICgpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBLZXlzIHtcbiAga2V5Q29kZUFsaWFzID0gbmV3IEtleUNvZGVzKCk7XG5cbiAga2V5czogeyBba2V5Q29kZTogbnVtYmVyXTogYm9vbGVhbiB9ID0ge307XG5cbiAgcHJpdmF0ZSBfd2luZG93T25Gb2N1czogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBfa2V5c1ByZXNzZWQ6IChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkO1xuICBwcml2YXRlIF9rZXlzUmVsZWFzZWQ6IChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3dpbmRvd09uRm9jdXMgPSB0aGlzLndpbmRvd09uRm9jdXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9rZXlzUHJlc3NlZCA9IHRoaXMua2V5c1ByZXNzZWQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9rZXlzUmVsZWFzZWQgPSB0aGlzLmtleXNSZWxlYXNlZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYWRkS2V5Ym9hcmRFdmVudHNMaXN0ZW5lcigpO1xuICB9XG5cbiAgcHJlc3NlZChrZXlOYW1lOiBrZXlvZiBLZXlDb2Rlcyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGNvZGUgPSB0aGlzLmtleUNvZGVBbGlhc1trZXlOYW1lXTtcbiAgICByZXR1cm4gISFjb2RlICYmIHRoaXMua2V5c1tjb2RlXTtcbiAgfVxuXG4gIGFkZEtleWJvYXJkRXZlbnRzTGlzdGVuZXIoKTogdm9pZCB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl93aW5kb3dPbkZvY3VzLCBmYWxzZSk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuX2tleXNQcmVzc2VkLCBmYWxzZSk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLl9rZXlzUmVsZWFzZWQsIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVLZXlib2FyZEV2ZW50c0xpc3RlbmVyKCk6IHZvaWQge1xuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fd2luZG93T25Gb2N1cywgZmFsc2UpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLl9rZXlzUHJlc3NlZCwgZmFsc2UpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5fa2V5c1JlbGVhc2VkLCBmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBrZXlzUHJlc3NlZChlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoIXRoaXMua2V5c1tlLmtleUNvZGVdKSB7XG4gICAgICB0aGlzLmtleXNbZS5rZXlDb2RlXSA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBrZXlzUmVsZWFzZWQoZTogS2V5Ym9hcmRFdmVudCkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdGhpcy5rZXlzW2Uua2V5Q29kZV0gPSBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgd2luZG93T25Gb2N1cygpIHtcbiAgICB0aGlzLmtleXMgPSB7fTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEtleUNvZGVzIHtcbiAgJ2JhY2tzcGFjZScgPSA4O1xuICAndGFiJyA9IDk7XG4gICdlbnRlcicgPSAxMztcbiAgJ3NoaWZ0JyA9IDE2O1xuICAnY3RybCcgPSAxNztcbiAgJ2FsdCcgPSAxODtcbiAgJ3BhdXNlL2JyZWFrJyA9IDE5O1xuICAnY2Fwc19sb2NrJyA9IDIwO1xuICAnZXNjYXBlJyA9IDI3O1xuICAncGFnZV91cCcgPSAzMztcbiAgJ3BhZ2VfZG93bicgPSAzNDtcbiAgJ2VuZCcgPSAzNTtcbiAgJ2hvbWUnID0gMzY7XG4gICdsZWZ0X2Fycm93JyA9IDM3O1xuICAndXBfYXJyb3cnID0gMzg7XG4gICdyaWdodF9hcnJvdycgPSAzOTtcbiAgJ2Rvd25fYXJyb3cnID0gNDA7XG4gICdpbnNlcnQnID0gNDU7XG4gICdkZWxldGUnID0gNDY7XG4gICdsZWZ0X3dpbmRvd19rZXknID0gOTE7XG4gICdyaWdodF93aW5kb3dfa2V5JyA9IDkyO1xuICAnc2VsZWN0X2tleScgPSA5MztcbiAgJ251bXBhZF8wJyA9IDk2O1xuICAnbnVtcGFkXzEnID0gOTc7XG4gICdudW1wYWRfMicgPSA5ODtcbiAgJ251bXBhZF8zJyA9IDk5O1xuICAnbnVtcGFkXzQnID0gMTAwO1xuICAnbnVtcGFkXzUnID0gMTAxO1xuICAnbnVtcGFkXzYnID0gMTAyO1xuICAnbnVtcGFkXzcnID0gMTAzO1xuICAnbnVtcGFkXzgnID0gMTA0O1xuICAnbnVtcGFkXzknID0gMTA1O1xuICAnbXVsdGlwbHknID0gMTA2O1xuICAnYWRkJyA9IDEwNztcbiAgJ3N1YnRyYWN0JyA9IDEwOTtcbiAgJ2RlY2ltYWxfcG9pbnQnID0gMTEwO1xuICAnZGl2aWRlJyA9IDExMTtcbiAgJ2YxJyA9IDExMjtcbiAgJ2YyJyA9IDExMztcbiAgJ2YzJyA9IDExNDtcbiAgJ2Y0JyA9IDExNTtcbiAgJ2Y1JyA9IDExNjtcbiAgJ2Y2JyA9IDExNztcbiAgJ2Y3JyA9IDExODtcbiAgJ2Y4JyA9IDExOTtcbiAgJ2Y5JyA9IDEyMDtcbiAgJ2YxMCcgPSAxMjE7XG4gICdmMTEnID0gMTIyO1xuICAnZjEyJyA9IDEyMztcbiAgJ251bV9sb2NrJyA9IDE0NDtcbiAgJ3Njcm9sbF9sb2NrJyA9IDE0NTtcbiAgJ3NlbWktY29sb24nID0gMTg2O1xuICAnZXF1YWxfc2lnbicgPSAxODc7XG4gICcsJyA9IDE4ODsgLy8gXCJjb21tYVwiO1xuICAnLScgPSAxODk7IC8vIFwiZGFzaFwiO1xuICAnLicgPSAxOTA7IC8vIFwicGVyaW9kXCI7XG4gICcvJyA9IDE5MTsgLy8gXCJmb3J3YXJkIHNsYXNoXCI7XG4gICdgJyA9IDE5MjsgLy8gXCJncmF2ZSBhY2NlbnRcIjtcbiAgJ1snID0gMjE5OyAvLyBcIm9wZW4gYnJhY2tldFwiO1xuICAnXFxcXCcgPSAyMjA7IC8vIFwiYmFjayBzbGFzaFwiO1xuICAnXScgPSAyMjE7IC8vIFwiY2xvc2UgYnJha2V0XCI7XG4gIFwiJ1wiID0gMjIyOyAvLyBcInNpbmdsZSBxdW90ZVwiXG59XG4iLCJpbXBvcnQgeyBTdGF0ZUl0ZW0gfSBmcm9tICcuL1N0YXRlSXRlbSc7XG5pbXBvcnQgeyBXZWJNYXBFdmVudHMgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL0V2ZW50cyc7XG5pbXBvcnQgeyBMbmdMYXRBcnJheSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvQmFzZVR5cGVzJztcbmltcG9ydCB7IE1hcE9wdGlvbnMgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL1dlYk1hcEFwcCc7XG5cbmV4cG9ydCBjbGFzcyBDZW50ZXJTdGF0ZSBleHRlbmRzIFN0YXRlSXRlbTxMbmdMYXRBcnJheT4ge1xuICBuYW1lOiBrZXlvZiBNYXBPcHRpb25zID0gJ2NlbnRlcic7XG4gIGV2ZW50OiBrZXlvZiBXZWJNYXBFdmVudHMgPSAnbW92ZWVuZCc7XG5cbiAgZ2V0VmFsdWUoKTogTG5nTGF0QXJyYXkgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLndlYk1hcC5nZXRDZW50ZXIoKTtcbiAgfVxuICBzZXRWYWx1ZSh2YWw6IExuZ0xhdEFycmF5KTogdm9pZCB7XG4gICAgdGhpcy53ZWJNYXAuc2V0Q2VudGVyKHZhbCk7XG4gIH1cbiAgdG9TdHJpbmcoZGF0YTogTG5nTGF0QXJyYXkpOiBzdHJpbmcge1xuICAgIGNvbnN0IGQgPSBkYXRhLm1hcCgoeCkgPT4geC50b0ZpeGVkKDUpKTtcbiAgICByZXR1cm4gZFswXSArICdfJyArIGRbMV07XG4gIH1cbiAgcGFyc2Uoc3RyOiBzdHJpbmcpOiBMbmdMYXRBcnJheSB7XG4gICAgY29uc3QgbG5nTGF0ID0gc3RyLnNwbGl0KCdfJykubWFwKE51bWJlcikgYXMgTG5nTGF0QXJyYXk7XG4gICAgcmV0dXJuIGxuZ0xhdDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTWFwU3RhdGVJdGVtIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9NYXBTdGF0ZSc7XG5pbXBvcnQgeyBXZWJNYXBFdmVudHMgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL0V2ZW50cyc7XG5pbXBvcnQgeyBXZWJNYXAgfSBmcm9tICcuLi8uLi9XZWJNYXAnO1xuaW1wb3J0IHsgTWFwT3B0aW9ucyB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvV2ViTWFwQXBwJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFN0YXRlSXRlbTxWIGV4dGVuZHMgYW55IHwgdW5kZWZpbmVkID0gYW55IHwgdW5kZWZpbmVkPlxuICBpbXBsZW1lbnRzIE1hcFN0YXRlSXRlbTxWIHwgdW5kZWZpbmVkPiB7XG4gIG5hbWUhOiBrZXlvZiBNYXBPcHRpb25zO1xuICBldmVudCE6IGtleW9mIFdlYk1hcEV2ZW50cztcbiAgcHJvdGVjdGVkIHZhbHVlPzogVjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgd2ViTWFwOiBXZWJNYXAsXG4gICAgb3B0PzogeyBuYW1lPzoga2V5b2YgTWFwT3B0aW9uczsgZXZlbnQ/OiBrZXlvZiBXZWJNYXBFdmVudHM7IHZhbHVlPzogViB9XG4gICkge1xuICAgIGlmIChvcHQpIHtcbiAgICAgIGlmIChvcHQudmFsdWUpIHtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZShvcHQudmFsdWUpO1xuICAgICAgfVxuICAgICAgaWYgKG9wdC5uYW1lKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG9wdC5uYW1lO1xuICAgICAgfVxuICAgICAgaWYgKG9wdC5ldmVudCkge1xuICAgICAgICB0aGlzLmV2ZW50ID0gb3B0LmV2ZW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldFZhbHVlKCk6IFYgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICB9XG5cbiAgc2V0VmFsdWUodmFsOiBWKTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgfVxuXG4gIGFic3RyYWN0IHRvU3RyaW5nKGRhdGE6IHVua25vd24pOiBzdHJpbmc7XG4gIGFic3RyYWN0IHBhcnNlKHN0cjogc3RyaW5nKTogVjtcbn1cbiIsImltcG9ydCB7IFN0YXRlSXRlbSB9IGZyb20gJy4vU3RhdGVJdGVtJztcbmltcG9ydCB7IFdlYk1hcEV2ZW50cyB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvRXZlbnRzJztcbmltcG9ydCB7IE1hcE9wdGlvbnMgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL1dlYk1hcEFwcCc7XG5cbmV4cG9ydCBjbGFzcyBab29tU3RhdGUgZXh0ZW5kcyBTdGF0ZUl0ZW08bnVtYmVyPiB7XG4gIG5hbWU6IGtleW9mIE1hcE9wdGlvbnMgPSAnem9vbSc7XG4gIGV2ZW50OiBrZXlvZiBXZWJNYXBFdmVudHMgPSAnem9vbWVuZCc7XG4gIGdldFZhbHVlKCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3Qgem9vbSA9IHRoaXMud2ViTWFwLmdldFpvb20oKTtcbiAgICByZXR1cm4gem9vbSAhPT0gdW5kZWZpbmVkID8gTWF0aC5yb3VuZCh6b29tKSA6IHVuZGVmaW5lZDtcbiAgfVxuICBzZXRWYWx1ZSh2YWw6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMud2ViTWFwLnNldFpvb20odmFsKTtcbiAgfVxuICB0b1N0cmluZyh2YWw6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIFN0cmluZyh2YWwpO1xuICB9XG4gIHBhcnNlKHN0cjogc3RyaW5nKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTnVtYmVyKHN0cik7XG4gIH1cbn1cbiIsIi8qKlxuICogVGhlIGxpYnJhcnkgdGhhdCBhbGxvd3MgdG8gdXNlIGEgc2luZ2xlIGludGVyZmFjZSBmb3IgbWFuYWdpbmcgdmFyaW91cyBpbnRlcmFjdGl2ZSBtYXAgZnJhbWV3b3Jrcy5cbiAqXG4gKiBAcmVtYXJrc1xuICogVGhlIGZvbGxvd2luZyBhZGFwdGVycyBhcmUgYXZhaWxhYmxlOlxuICoge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9uZXh0Z2lzL25leHRnaXNfZnJvbnRlbmQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvbGVhZmxldC1tYXAtYWRhcHRlciB8IEBuZXh0Z2lzL2xlYWZsZXQtbWFwLWFkYXB0ZXJ9LFxuICoge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9uZXh0Z2lzL25leHRnaXNfZnJvbnRlbmQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvb2wtbWFwLWFkYXB0ZXIgfCBAbmV4dGdpcy9vbC1tYXAtYWRhcHRlcn0sXG4gKiB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL25leHRnaXMvbmV4dGdpc19mcm9udGVuZC90cmVlL21hc3Rlci9wYWNrYWdlcy9tYXBib3hnbC1tYXAtYWRhcHRlciB8IEBuZXh0Z2lzL21hcGJveC1tYXAtYWRhcHRlcn1cbiAqIGFuZCBleHBlcmltZW50YWwge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9uZXh0Z2lzL25leHRnaXNfZnJvbnRlbmQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvY2VzaXVtLW1hcC1hZGFwdGVyIHwgQG5leHRnaXMvY2VzaXVtLW1hcC1hZGFwdGVyfS5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBganNcbiAqIGltcG9ydCBXZWJNYXAgZnJvbSBcIkBuZXh0Z2lzL3dlYm1hcFwiO1xuICpcbiAqIGltcG9ydCBcIi4vbGVhZmxldC1zdHlsZS1vdmVycmlkZS5jc3NcIjtcbiAqIGltcG9ydCBNYXBBZGFwdGVyIGZyb20gXCJAbmV4dGdpcy9sZWFmbGV0LW1hcC1hZGFwdGVyXCI7XG4gKiAvLyBPUlxuICogLy8gaW1wb3J0ICdvbC9vbC5jc3MnO1xuICogLy8gaW1wb3J0IE1hcEFkYXB0ZXIgZnJvbSAnQG5leHRnaXMvb2wtbWFwLWFkYXB0ZXInO1xuICogLy8gT1JcbiAqIC8vIGltcG9ydCAnbWFwYm94LWdsL2Rpc3QvbWFwYm94LWdsLmNzcyc7XG4gKiAvLyBpbXBvcnQgTWFwQWRhcHRlciBmcm9tICdAbmV4dGdpcy9tYXBib3hnbC1tYXAtYWRhcHRlcic7XG4gKlxuICogY29uc3Qgd2ViTWFwID0gbmV3IFdlYk1hcCh7XG4gKiAgIG1hcEFkYXB0ZXI6IG5ldyBNYXBBZGFwdGVyKCksXG4gKiAgIG1hcE9wdGlvbnM6IHsgdGFyZ2V0OiAnbWFwJyB9XG4gKiB9KTtcbiAqXG4gKiBjb25zb2xlLmxvZyghIXdlYk1hcC5tYXBBZGFwdGVyLm1hcCk7IC8vIGZhbHNlXG4gKiB3ZWJNYXAub25Mb2FkKCkudGhlbigoKSA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKHdlYk1hcC5tYXBBZGFwdGVyLm1hcCk7IC8vIHRydWVcbiAqXG4gKiAgIHdlYk1hcC5hZGRMYXllcignR0VPSlNPTicpLnRoZW4oKGxheWVyKSA9PiB7XG4gKiAgICAgd2ViTWFwLnNldExheWVyRGF0YShsYXllciwgZ2VvanNvbilcbiAqICAgfSk7XG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxuICovXG5cbmltcG9ydCB7IFdlYk1hcCB9IGZyb20gJy4vV2ViTWFwJztcblxuZXhwb3J0ICogZnJvbSAnLi9XZWJNYXAnO1xuZXhwb3J0ICogZnJvbSAnLi9XZWJNYXBMYXllcnMnO1xuZXhwb3J0ICogZnJvbSAnLi9XZWJNYXBDb250cm9scyc7XG5leHBvcnQgKiBmcm9tICcuL1dlYk1hcE1haW4nO1xuZXhwb3J0ICogZnJvbSAnLi9pbnRlcmZhY2VzL0V2ZW50cyc7XG5leHBvcnQgKiBmcm9tICcuL2ludGVyZmFjZXMvQmFzZVR5cGVzJztcbmV4cG9ydCAqIGZyb20gJy4vaW50ZXJmYWNlcy9XZWJNYXBBcHAnO1xuZXhwb3J0ICogZnJvbSAnLi9pbnRlcmZhY2VzL01hcEFkYXB0ZXInO1xuZXhwb3J0ICogZnJvbSAnLi9pbnRlcmZhY2VzL01hcENvbnRyb2wnO1xuZXhwb3J0ICogZnJvbSAnLi9pbnRlcmZhY2VzL1N0YXJ0ZXJLaXQnO1xuZXhwb3J0ICogZnJvbSAnLi9pbnRlcmZhY2VzL0xheWVyQWRhcHRlcic7XG5leHBvcnQgKiBmcm9tICcuL2ludGVyZmFjZXMvUnVudGltZVBhcmFtcyc7XG5cbmV4cG9ydCB7IFdlYk1hcCB9O1xuZXhwb3J0IGRlZmF1bHQgV2ViTWFwO1xuIiwiaW1wb3J0IHsgR2VvSnNvbk9iamVjdCwgRmVhdHVyZSB9IGZyb20gJ2dlb2pzb24nO1xuaW1wb3J0IHtcbiAgUHJvcGVydGllc0ZpbHRlcixcbiAgT3BlcmF0aW9ucyxcbiAgUHJvcGVydHlGaWx0ZXIsXG4gIGNoZWNrSWZQcm9wZXJ0eUZpbHRlcixcbn0gZnJvbSAnQG5leHRnaXMvcHJvcGVydGllcy1maWx0ZXInO1xuaW1wb3J0IHsgUGFpbnQgfSBmcm9tICdAbmV4dGdpcy9wYWludCc7XG5pbXBvcnQgeyBMbmdMYXRCb3VuZHNBcnJheSwgVHlwZSB9IGZyb20gJy4vQmFzZVR5cGVzJztcbmltcG9ydCB7IE1hcENsaWNrRXZlbnQgfSBmcm9tICcuL01hcEFkYXB0ZXInO1xuXG4vKipcbiAqIEJhY2t3YXJkIGNvbXBhdGliaWxpdHkuXG4gKiBAZGVwcmVjYXRlZFxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCB7IFByb3BlcnRpZXNGaWx0ZXIsIE9wZXJhdGlvbnMsIFByb3BlcnR5RmlsdGVyLCBjaGVja0lmUHJvcGVydHlGaWx0ZXIgfTtcblxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IHR5cGUgQWRhcHRlckNvbnN0cnVjdG9yID0gKCkgPT4gUHJvbWlzZTxUeXBlPExheWVyQWRhcHRlcj4gfCBhbnk+O1xuXG4vKipcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IHR5cGUgTGF5ZXJBZGFwdGVyRGVmaW5pdGlvbjxLIGV4dGVuZHMga2V5b2YgTGF5ZXJBZGFwdGVycyA9IHN0cmluZz4gPVxuICB8IEtcbiAgfCBUeXBlPExheWVyQWRhcHRlcnNbS10+XG4gIHwgUHJvbWlzZTxUeXBlPExheWVyQWRhcHRlcnNbS10+IHwgdW5kZWZpbmVkPjtcblxuLyoqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgT25MYXllclNlbGVjdE9wdGlvbnMge1xuICBsYXllcjogTGF5ZXJBZGFwdGVyO1xuICBmZWF0dXJlcz86IEZlYXR1cmVbXSB8IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgT25MYXllckNsaWNrT3B0aW9ucyB7XG4gIGxheWVyOiBMYXllckFkYXB0ZXI7XG4gIHNlbGVjdGVkPzogYm9vbGVhbjtcbiAgZmVhdHVyZT86IEZlYXR1cmU7XG4gIGV2ZW50PzogTWFwQ2xpY2tFdmVudDtcbiAgc291cmNlPzogYW55O1xufVxuXG4vKipcbiAqIFBhcmFtZXRlcnMgdGhhdCBjYW4gYmUgdXNlZCB0byBjcmVhdGUgYW55IG1hcCBsYXllciBhZGFwdGVyLlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEFkYXB0ZXJPcHRpb25zIHtcbiAgLyoqXG4gICAqIFVuaXF1ZSBMYXllciBJRC5cbiAgICogSWYgbm90IHNwZWNpZmllZCwgd2lsbCBiZSBhZGRlZCBhdXRvbWF0aWNhbGx5LlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiBJZiB0aGUgbGF5ZXIgYWRhcHRlciBpcyBhc3luY2hyb25vdXMsIGl0cyBpZCB3aWxsIGJlIGFzc2lnbmVkIG9ubHkgYWZ0ZXIgdGhlIHByb21pc2UgaXMgcmVzb2x2ZWQuXG4gICAqIFdoaWxlIGFkYXB0ZXIgaXMgbG9hZGluZywgbWV0aG9kcyBmb3Igb2J0YWluaW5nIGxheWVycyB3aWxsIGlnbm9yZSB0aGUgYWRkZWQgbGF5ZXIuXG4gICAqL1xuICBpZD86IHN0cmluZztcbiAgLyoqXG4gICAqIFNob3cgbGF5ZXIgb24gdGhlIG1hcCBpbW1lZGlhdGVseSBhZnRlciBhZGRpbmcuXG4gICAqIFN1Y2ggbGF5ZXJzIGFyZSBhbHdheXMgdW5kZXIgb3RoZXJzLlxuICAgKiBPbmx5IG9uZSBiYXNlIGxheWVyIGNhbiBiZSBkaXNwbGF5ZWQgb24gdGhlIG1hcCBhdCBhIHRpbWUuXG4gICAqXG4gICAqIEBkZWZhdWx0VmFsdWUgdHJ1ZVxuICAgKi9cbiAgdmlzaWJpbGl0eT86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBJbmRpY2F0ZSBvbiBhIGNhcnRvZ3JhcGhpYyBiYXNlIGxheWVyLlxuICAgKi9cbiAgYmFzZWxheWVyPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIHVzZSBgYmFzZWxheWVyYCBpbnN0ZWFkXG4gICAqL1xuICBiYXNlTGF5ZXI/OiBib29sZWFuO1xuICAvKipcbiAgICogSW5kaWNhdGVzIHRoZSBtYXAgbGF5ZXJzIGRpc3BsYXkgc2VxdWVuY2UuXG4gICAqIEEgbGF5ZXIgd2l0aCBhIGxhcmdlciBvcmRlciB2YWx1ZSBvdmVybGFwcyBzbWFsbGVyIG9uZXMuXG4gICAqIFplcm8gdmFsdWUgdXNlZCB0byBpbmRpY2F0ZSBiYXNlbGF5ZXIuXG4gICAqIElmIHRoZSB2YWx1ZSBpcyBub3Qgc3BlY2lmaWVkIGV4cGxpY2l0bHksIGl0IHdpbGwgYmUgYXNzaWduZWQgYXV0b21hdGljYWxseSB3aXRoIGFuIGluY3JlYXNlIG9mIG9uZSBmb3IgZWFjaCBuZXcgbGF5ZXIuXG4gICAqL1xuICBvcmRlcj86IG51bWJlcjtcbiAgLyoqXG4gICAqIFN0cmluZyB0byBiZSBzaG93biBpbiB0aGUgYXR0cmlidXRpb24gY29udHJvbC5cbiAgICogSXQgZGVzY3JpYmVzIHRoZSBsYXllciBkYXRhIGFuZCBpcyBvZnRlbiBhIGxlZ2FsIG9ibGlnYXRpb24gdG93YXJkcyBjb3B5cmlnaHQgaG9sZGVycyBhbmQgdGlsZSBwcm92aWRlcnMuXG4gICAqL1xuICBhdHRyaWJ1dGlvbj86IHN0cmluZztcbiAgLyoqXG4gICAqIE1heGltdW0gem9vbSBsZXZlbCBvZiB0aGUgbWFwLlxuICAgKi9cbiAgbWF4Wm9vbT86IG51bWJlcjtcbiAgLyoqXG4gICAqIE1pbmltdW0gem9vbSBsZXZlbCBvZiB0aGUgbWFwLlxuICAgKi9cbiAgbWluWm9vbT86IG51bWJlcjtcbiAgLyoqXG4gICAqIFRPRE86IHJlcGxhY2UgYnkgbWluWm9vbVxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIG1pblNjYWxlPzogbnVtYmVyO1xuICAvKipcbiAgICogVE9ETzogcmVwbGFjZSBieSBtYXhab29tXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgbWF4U2NhbGU/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBMYXllciB0cmFuc3BhcmVuY3kuXG4gICAqIEZyb20gMC10cmFuc3BhcmVudCB0byAxLXZpc2libGVcbiAgICogQGRlZmF1bHRWYWx1ZSAxXG4gICAqL1xuICBvcGFjaXR5PzogbnVtYmVyO1xuICAvKipcbiAgICogRml0IG1hcCB0byBsYXllciBleHRlbnRcbiAgICogQGRlZmF1bHRWYWx1ZSBmYWxzZVxuICAgKi9cbiAgZml0PzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIE5vbi11bmlxdWUgbmFtZSBvZiB0aGUgbGF5ZXIuIENhbiBiZSB1c2VkIGZvciB1c2VyIGludGVyZmFjZXMuXG4gICAqL1xuICBuYW1lPzogc3RyaW5nO1xuICBhZGFwdGVyPzogc3RyaW5nO1xuICAvKipcbiAgICogV2FpdCB1bnRpbCB0aGUgbGF5ZXIgZGF0YSBpcyBmdWxseSBsb2FkZWQgYmVmb3JlIGFsbG93aW5nIGFkZGVkIHRvIHRoZSBtYXAuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqIElmIHRydWUsIGFkZExheWVyIHByb21pc2UgcmVzb2x2ZSBvbmx5IGFmdGVyIGRhdGEgbG9hZGluZy5cbiAgICogVGhpcyBpcyB1c2VmdWwgZm9yIEdlb0pzb24gdmVjdG9yIGxheWVyIGFkYXB0ZXJzIHdoZW4geW91IG5lZWQgdG8gcHJvY2VzcyBkb3dubG9hZGVkIGRhdGEgYmVmb3JlIGRpc3BsYXlpbmcuXG4gICAqL1xuICB3YWl0RnVsbExvYWQ/OiBib29sZWFuO1xuICAvKipcbiAgICogUGFyYW1ldGVyIGFkZGVkIHdoZW4gZm9ybWluZyBhIHJlcXVlc3QgZm9yIGxheWVyIGRhdGEuXG4gICAqIFRoaXMgaXMgbmVlZGVkIGlmIHlvdSB3YW50IHRvIGFjY2VzcyB0aWxlIHBpeGVsIGRhdGEuXG4gICAqIFJlZmVyIHRvIHtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9IVE1ML0F0dHJpYnV0ZXMvY3Jvc3NvcmlnaW4gfCBDT1JTIFNldHRpbmdzfSBmb3IgdmFsaWQgU3RyaW5nIHZhbHVlcy5cbiAgICovXG4gIGNyb3NzT3JpZ2luPzogJ2Fub255bW91cyc7XG59XG5cbi8qKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIE12dEFkYXB0ZXJPcHRpb25zPEYgZXh0ZW5kcyBGZWF0dXJlID0gRmVhdHVyZT5cbiAgZXh0ZW5kcyBWZWN0b3JBZGFwdGVyT3B0aW9uczxGPiB7XG4gIHVybDogc3RyaW5nO1xuICBzb3VyY2VMYXllcj86IHN0cmluZztcbn1cblxuLyoqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCB0eXBlIFZlY3RvckFkYXB0ZXJMYXllclR5cGUgPSAncG9seWdvbicgfCAncG9pbnQnIHwgJ2xpbmUnO1xuXG4vKipcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQb3B1cE9wdGlvbnMge1xuICBtaW5XaWR0aD86IG51bWJlcjtcbiAgYXV0b1Bhbj86IGJvb2xlYW47XG4gIHBvcHVwQ29udGVudD86IHN0cmluZyB8IEhUTUxFbGVtZW50O1xuICBmcm9tUHJvcGVydGllcz86IGJvb2xlYW47XG4gIGNyZWF0ZVBvcHVwQ29udGVudD86IChcbiAgICBsYXllckRlZjogTGF5ZXJEZWZpbml0aW9uXG4gICkgPT4gSFRNTEVsZW1lbnQgfCBzdHJpbmcgfCB1bmRlZmluZWQ7XG59XG5cbnR5cGUgX1ZlY3RvckFkYXB0ZXJPcHRpb25zVG9FeHRlbmQgPSBBZGFwdGVyT3B0aW9ucyAmIEZpbHRlck9wdGlvbnM7XG5cbi8qKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFZlY3RvckFkYXB0ZXJPcHRpb25zPEYgZXh0ZW5kcyBGZWF0dXJlID0gRmVhdHVyZSwgTCA9IGFueT5cbiAgZXh0ZW5kcyBfVmVjdG9yQWRhcHRlck9wdGlvbnNUb0V4dGVuZCB7XG4gIC8qKiBUeXBlIGZvciBnZW9tZXRyaWVzIHBhaW50aW5nLCBmb3IgZWFjaCBsYXllciBtYXkgYmUgb25seSBvbmUgb2Y6IGBwb2ludGAsIGBwb2x5Z29uYCBvciBgbGluZWAuICovXG4gIHR5cGU/OiBWZWN0b3JBZGFwdGVyTGF5ZXJUeXBlO1xuICAvKipcbiAgICogRGV0ZXJtaW5lIHRoZSBhcHBlYXJhbmNlIG9mIHRoZSB2ZWN0b3IgZGF0YSBnZW9tZXRyaWVzLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIGNvbnN0IGNpcmNsZVBhaW50ID0geyBwYWludDogeyBjb2xvcjogJ2dyZWVuJywgcmFkaXVzOiA2IH0gfTtcbiAgICogY29uc3QgcGFpbnRDYiA9IChmZWF0dXJlKSA9PiB7XG4gICAqICByZXR1cm4geyBjb2xvcjogJ3JlZCcsIG9wYWNpdHk6IGZlYXR1cmUucHJvcGVydGllcy5vcGFjaXR5IH1cbiAgICogfVxuICAgKiBgYGBcbiAgICogQGV4YW1wbGVcbiAgICogYGBgamF2YXNjcmlwdFxuICAgKiAvLyBVc2UgZ2xvYmFsIHBhaW50IGZ1bmN0aW9uXG4gICAqIC8vIHNldCBwYWludCBmdW5jdGlvbiBpbnNpZGUgV2ViTWFwIHN0YXRpYyBwcm9wZXJ0eVxuICAgKiBXZWJNYXAuZ2V0UGFpbnRGdW5jdGlvbnMuY3VzdG9tUGFpbnRGdW5jdGlvbiA9IGN1c3RvbUljb25QYWludEZ1bmN0aW9uXG4gICAqXG4gICAqIHdlYk1hcC5hZGRMYXllcignR0VPSlNPTicsIHtcbiAgICogICBwYWludDoge1xuICAgKiAgICAgdHlwZTogJ2dldC1wYWludCcsXG4gICAqICAgICBmcm9tOiAnY3VzdG9tUGFpbnRGdW5jdGlvbicsXG4gICAqICAgICBvcHRpb25zOiB7fVxuICAgKiAgIH1cbiAgICogfVxuICAgKiBgYGBcbiAgICovXG4gIHBhaW50PzogUGFpbnQ7XG4gIC8qKlxuICAgKiBUaGUgcGFpbnQgdGhhdCBhcHBsaWVzIHRvIHRoZSBmZWF0dXJlcyBhZnRlciBpdCBiZWNvbWVzIHNlbGVjdGVkLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIHdlYk1hcC5hZGRMYXllcignR0VPSlNPTicsIHtcbiAgICogICBwYWludDogeyBjb2xvcjogJ3JlZCcgfSxcbiAgICogICBzZWxlY3RlZFBhaW50OiB7IGNvbG9yOiAnZ3JlZW4nIH1cbiAgICogfSk7XG4gICAqIGBgYFxuICAgKi9cbiAgc2VsZWN0ZWRQYWludD86IFBhaW50O1xuICAvLyBzZWxlY3RlZFBhaW50RGlmZj86IFZlY3RvckFkYXB0ZXJMYXllclBhaW50O1xuICAvKipcbiAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIG9iamVjdHMgYXJlIHNlbGVjdGVkIGJ5IG1vdXNlIGNsaWNrLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIGNvbnN0IGxheWVyID0gd2ViTWFwLmFkZExheWVyKCdHRU9KU09OJywge1xuICAgKiAgIHBhaW50OiB7IGNvbG9yOiAncmVkJyB9LFxuICAgKiAgIHNlbGVjdGVkUGFpbnQ6IHsgY29sb3I6ICdncmVlbicgfSxcbiAgICogICBzZWxlY3RhYmxlOiBmYWxzZVxuICAgKiB9KTtcbiAgICogLy8gcHJvZ3JhbW1hdGljYWxseSBzZWxlY3Rpb24gLSBvaywgYnV0IG5vdCBvbiBtb3VzZSBjbGlja1xuICAgKiBsYXllci5zZWxlY3QoKHsgZmVhdHVyZSB9KSA9PiBmZWF0dXJlLnByb3BlcnRpZXMuaWQgPT09IElEX0ZPUl9TRUxFQ1QpO1xuICAgKiBgYGBcbiAgICovXG4gIHNlbGVjdGFibGU/OiBib29sZWFuO1xuICBpbnRlcmFjdGl2ZT86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciBzZXZlcmFsIG9iamVjdHMgY2FuIGJlIHNlbGVjdGVkIGluIG9uZSBsYXllci5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogLy8gbXVsdGlzZWxlY3Q6IGZhbHNlXG4gICAqIGxheWVyLnNlbGVjdCgoeyBmZWF0dXJlIH0pID0+IGZlYXR1cmUucHJvcGVydGllcy5jb2xvciA9PT0gJ2dyZWVuJyk7IC8vIG9uZSBmZWF0dXJlIHdpbGwgYmUgc2VsZWN0ZWRcbiAgICogLy8gbXVsdGlzZWxlY3Q6IHRydWVcbiAgICogbGF5ZXIuc2VsZWN0KCh7IGZlYXR1cmUgfSkgPT4gZmVhdHVyZS5wcm9wZXJ0aWVzLmNvbG9yID09PSAnZ3JlZW4nKTsgLy8gYWxsICdncmVlbicgZmVhdHVyZXMgd2lsbCBiZSBzZWxlY3RlZFxuICAgKi9cbiAgbXVsdGlzZWxlY3Q/OiBib29sZWFuO1xuICAvKipcbiAgICogRGVzZWxlY3RzIGxheWVyIGZlYXR1cmUgYnkgc2Vjb25kIGNsaWNrLlxuICAgKi9cbiAgdW5zZWxlY3RPblNlY29uZENsaWNrPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIE1ha2UgdGhlIGZlYXR1cmUgc2VsZWN0ZWQgd2hpbGUgbW91c2VvdmVyLlxuICAgKi9cbiAgc2VsZWN0T25Ib3Zlcj86IGJvb2xlYW47XG4gIHBvcHVwPzogYm9vbGVhbjtcbiAgcG9wdXBPblNlbGVjdD86IGJvb2xlYW47XG4gIHBvcHVwT3B0aW9ucz86IFBvcHVwT3B0aW9ucztcbiAgZmlsdGVyPzogRGF0YUxheWVyRmlsdGVyO1xuICBwcm9wZXJ0aWVzRmlsdGVyPzogUHJvcGVydGllc0ZpbHRlcjtcbiAgZmVhdHVyZUlkTmFtZT86IHN0cmluZztcbiAgY2x1c3Rlcj86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBNYXggem9vbSB0byBjbHVzdGVyIHBvaW50cyBvblxuICAgKi9cbiAgY2x1c3Rlck1heFpvb20/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBSYWRpdXMgb2YgZWFjaCBjbHVzdGVyIHdoZW4gY2x1c3RlcmluZyBwb2ludHNcbiAgICogQGRlZmF1bHRWYWx1ZSA1MFxuICAgKi9cbiAgY2x1c3RlclJhZGl1cz86IG51bWJlcjtcblxuICBsYWJlbEZpZWxkPzogc3RyaW5nO1xuICBsYWJlbD86IChlOiBMYXllckRlZmluaXRpb248RiwgTD4pID0+IHZvaWQgfCBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgc291cmNlPzogdW5rbm93bjtcblxuICBuYXRpdmVPcHRpb25zPzogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgLyoqXG4gICAqIFRPRE86IG1vdmUgdG8gbmF0aXZlT3B0aW9uc1xuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIG5hdGl2ZVBhaW50PzogYm9vbGVhbiB8IFJlY29yZDxzdHJpbmcsIGFueT47XG4gIC8qKlxuICAgKiBUT0RPOiBtb3ZlIHRvIG5hdGl2ZU9wdGlvbnNcbiAgICogQGludGVybmFsXG4gICAqL1xuICBuYXRpdmVGaWx0ZXI/OiB1bmtub3duO1xuICAvKipcbiAgICogVE9ETzogbW92ZSB0byBuYXRpdmVPcHRpb25zXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgbGF5b3V0PzogYW55O1xuICAvKipcbiAgICogVE9ETzogbW92ZSB0byBuYXRpdmVPcHRpb25zXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgc2VsZWN0ZWRMYXlvdXQ/OiBhbnk7XG5cbiAgb25MYXllckNsaWNrPyhvcHQ6IE9uTGF5ZXJDbGlja09wdGlvbnMpOiBQcm9taXNlPGFueT47XG4gIG9uTGF5ZXJTZWxlY3Q/KG9wdDogT25MYXllclNlbGVjdE9wdGlvbnMpOiBQcm9taXNlPGFueT47XG59XG5cbi8qKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEdlb0pzb25BZGFwdGVyT3B0aW9uczxGIGV4dGVuZHMgRmVhdHVyZSA9IEZlYXR1cmUsIEwgPSBhbnk+XG4gIGV4dGVuZHMgVmVjdG9yQWRhcHRlck9wdGlvbnM8RiwgTD4ge1xuICAvKiogR2VvanNvbiBkYXRhICovXG4gIGRhdGE/OiBHZW9Kc29uT2JqZWN0O1xufVxuXG4vKipcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSYXN0ZXJBZGFwdGVyT3B0aW9ucyBleHRlbmRzIEFkYXB0ZXJPcHRpb25zIHtcbiAgdXJsOiBzdHJpbmc7XG4gIHN1YmRvbWFpbnM/OiBzdHJpbmc7XG4gIGhlYWRlcnM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xufVxuXG4vKipcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUaWxlQWRhcHRlck9wdGlvbnMgZXh0ZW5kcyBSYXN0ZXJBZGFwdGVyT3B0aW9ucyB7XG4gIHRpbGVTaXplPzogbnVtYmVyO1xufVxuXG4vKipcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUaWxlc2V0M0RBZGFwdGVyT3B0aW9ucyBleHRlbmRzIFJhc3RlckFkYXB0ZXJPcHRpb25zIHtcbiAgdXNlVGVycmFpbkhlaWdodD86IGJvb2xlYW47XG4gIGhlaWdodE9mZnNldD86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTW9kZWwzRE9wdGlvbnMgZXh0ZW5kcyBSYXN0ZXJBZGFwdGVyT3B0aW9ucyB7XG4gIGxvbjogbnVtYmVyO1xuICBsYXQ6IG51bWJlcjtcbiAgaGVpZ2h0PzogbnVtYmVyO1xuICByb3RhdGU/OiBudW1iZXI7XG4gIHNjYWxlPzogbnVtYmVyO1xufVxuXG4vKipcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBXbXNBZGFwdGVyT3B0aW9ucyBleHRlbmRzIFJhc3RlckFkYXB0ZXJPcHRpb25zIHtcbiAgbGF5ZXJzPzogc3RyaW5nO1xuICBmb3JtYXQ/OiAnaW1hZ2UvcG5nJyB8ICdpbWFnZS9qcGVnJyB8IHN0cmluZztcbiAgdmVyc2lvbj86IHN0cmluZztcbiAgdGlsZVNpemU/OiBudW1iZXI7XG4gIHVwZGF0ZVdtc1BhcmFtcz86IChvYmo6IHtcbiAgICBbcGFyYW1OYW1lOiBzdHJpbmddOiBhbnk7XG4gIH0pID0+IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICB0cmFuc3BhcmVudD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEltYWdlQWRhcHRlck9wdGlvbnMgZXh0ZW5kcyBXbXNBZGFwdGVyT3B0aW9ucyB7XG4gIC8qKiBAZGVwcmVjYXRlZCB1c2UgYGxheWVyYCBvcHRpb24gaW5zdGVhZCAqL1xuICByZXNvdXJjZUlkPzogc3RyaW5nIHwgbnVtYmVyO1xufVxuXG4vKipcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMYXllckFkYXB0ZXJzIHtcbiAgW25hbWU6IHN0cmluZ106IE1haW5MYXllckFkYXB0ZXI7XG4gIE1WVDogVmVjdG9yTGF5ZXJBZGFwdGVyO1xuICBJTUFHRTogTWFpbkxheWVyQWRhcHRlcjxhbnksIGFueSwgSW1hZ2VBZGFwdGVyT3B0aW9ucz47XG4gIFdNUzogTWFpbkxheWVyQWRhcHRlcjxhbnksIGFueSwgV21zQWRhcHRlck9wdGlvbnM+O1xuICBPU006IE1haW5MYXllckFkYXB0ZXI7XG4gIFRJTEU6IE1haW5MYXllckFkYXB0ZXI8YW55LCBhbnksIFRpbGVBZGFwdGVyT3B0aW9ucz47XG4gIEdFT0pTT046IFZlY3RvckxheWVyQWRhcHRlcjxhbnksIGFueSwgR2VvSnNvbkFkYXB0ZXJPcHRpb25zPjtcbn1cblxuLyoqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGF5ZXJBZGFwdGVyc09wdGlvbnMge1xuICBbbmFtZTogc3RyaW5nXTogQWRhcHRlck9wdGlvbnM7XG4gIE1WVDogTXZ0QWRhcHRlck9wdGlvbnM7XG4gIElNQUdFOiBJbWFnZUFkYXB0ZXJPcHRpb25zO1xuICBXTVM6IFdtc0FkYXB0ZXJPcHRpb25zO1xuICBPU006IFJhc3RlckFkYXB0ZXJPcHRpb25zO1xuICBUSUxFOiBUaWxlQWRhcHRlck9wdGlvbnM7XG4gIEdFT0pTT046IEdlb0pzb25BZGFwdGVyT3B0aW9ucztcbn1cblxuLyoqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGF5ZXJEZWZpbml0aW9uPEYgZXh0ZW5kcyBGZWF0dXJlID0gRmVhdHVyZSwgTCA9IGFueT4ge1xuICBsYXllcj86IEw7XG4gIGZlYXR1cmU/OiBGO1xuICB2aXNpYmxlPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCB0eXBlIENhbGxiYWNrRmlsdGVyPEYgZXh0ZW5kcyBGZWF0dXJlID0gRmVhdHVyZSwgTCA9IGFueT4gPSAoXG4gIG9wdDogTGF5ZXJEZWZpbml0aW9uPEYsIEw+XG4pID0+IGJvb2xlYW47XG5cbi8qKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEZpbHRlck9wdGlvbnM8RW50aXR5ID0gYW55PiB7XG4gIC8qKlxuICAgKiBPZmZzZXQgKHBhZ2luYXRlZCkgd2hlcmUgZnJvbSBlbnRpdGllcyBzaG91bGQgYmUgdGFrZW4uXG4gICAqL1xuICBvZmZzZXQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIExpbWl0IChwYWdpbmF0ZWQpIC0gbWF4IG51bWJlciBvZiBlbnRpdGllcyBzaG91bGQgYmUgdGFrZW4uXG4gICAqL1xuICBsaW1pdD86IG51bWJlcjtcbiAgZmllbGRzPzogKGtleW9mIEVudGl0eSlbXTtcbiAgLyoqIFdLVCBwb2x5Z29uIGdlb21ldHJ5ICovXG4gIGludGVyc2VjdHM/OiBzdHJpbmc7XG4gIHN0cmF0ZWd5PzogJ0JCT1gnO1xuICAvKipcbiAgICogc2V0IGZpZWxkcyBmb3Igb3JkZXJcbiAgICogQGV4YW1wbGVcbiAgICogYGBganNvblxuICAgKiB7IFwib3JkZXJCeVwiOiBbXCJmaWVsZDFcIiwgXCItZmllbGQyXCIgXX1cbiAgICogYGBgXG4gICAqL1xuICBvcmRlckJ5PzogKGtleW9mIEVudGl0eSlbXSB8IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IHR5cGUgRGF0YUxheWVyRmlsdGVyPFxuICBGIGV4dGVuZHMgRmVhdHVyZSA9IEZlYXR1cmUsXG4gIEwgPSBhbnlcbj4gPSBDYWxsYmFja0ZpbHRlcjxGLCBMPjtcblxuLyoqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCB0eXBlIExheWVyQWRhcHRlcjxcbiAgTSA9IGFueSxcbiAgTCA9IGFueSxcbiAgTyBleHRlbmRzIEFkYXB0ZXJPcHRpb25zID0gQWRhcHRlck9wdGlvbnNcbj4gPSBNYWluTGF5ZXJBZGFwdGVyPE0sIEwsIE8+IHwgVmVjdG9yTGF5ZXJBZGFwdGVyPE0sIEwsIE8+O1xuXG4vKipcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYWluTGF5ZXJBZGFwdGVyPFxuICBNID0gYW55LFxuICBMID0gYW55LFxuICBPIGV4dGVuZHMgQWRhcHRlck9wdGlvbnMgPSBBZGFwdGVyT3B0aW9uc1xuPiB7XG4gIG9wdGlvbnM6IE87XG4gIGlkPzogc3RyaW5nO1xuICBvcmRlcj86IG51bWJlcjtcbiAgbmFtZT86IHN0cmluZztcbiAgbGF5ZXI/OiBMO1xuICBtYXA/OiBNO1xuXG4gIGFkZExheWVyKG9wdGlvbnM6IE8pOiBMIHwgUHJvbWlzZTxMPiB8IHVuZGVmaW5lZDtcbiAgdXBkYXRlTGF5ZXI/KCk6IHZvaWQ7XG4gIHJlbW92ZUxheWVyPygpOiB2b2lkO1xuICBiZWZvcmVSZW1vdmU/KCk6IHZvaWQ7XG5cbiAgc2hvd0xheWVyPyhsYXllcj86IEwpOiB2b2lkO1xuICBoaWRlTGF5ZXI/KGxheWVyPzogTCk6IHZvaWQ7XG5cbiAgZ2V0RXh0ZW50PygpOiBMbmdMYXRCb3VuZHNBcnJheSB8IFByb21pc2U8TG5nTGF0Qm91bmRzQXJyYXk+IHwgdW5kZWZpbmVkO1xuXG4gIC8vIHJlbW92ZSBmcm9tIHRoaXMgcGxhY2VcbiAgZ2V0RGVwZW5kTGF5ZXJzPygpOiBMW107XG59XG5cbi8qKlxuICogQWRhcHRlciBmb3IgdmVjdG9yIGRhdGEgZGlzcGxheSBjb250cm9sLlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFZlY3RvckxheWVyQWRhcHRlcjxcbiAgTSA9IGFueSxcbiAgTCA9IGFueSxcbiAgTyBleHRlbmRzIFZlY3RvckFkYXB0ZXJPcHRpb25zID0gVmVjdG9yQWRhcHRlck9wdGlvbnMsXG4gIEYgZXh0ZW5kcyBGZWF0dXJlID0gRmVhdHVyZVxuPiBleHRlbmRzIE1haW5MYXllckFkYXB0ZXI8TSwgTCwgTz4ge1xuICAvKiogVHJ1ZSBpZiB0aGVyZSBhcmUgc2VsZWN0ZWQgZmVhdHVyZXMgaW4gdGhlIGxheWVyICAqL1xuICBzZWxlY3RlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEV4cGVyaW1lbnRhbCBvcHRpb24sIG9ubHkgZm9yIE1WVC4gUG9pbnRzIHRvIGEgZGF0YSBzb3VyY2UgaW5zdGVhZCBvZiBsb2FkaW5nIGRhdGEgaW50byBhIGxheWVyLlxuICAgKiBAYWxwaGFcbiAgICovXG4gIHNvdXJjZT86IHVua25vd247XG4gIC8qKlxuICAgKiBBbGxvd3MgdG8gZ2V0IGFsbCB2ZWN0b3Igb2JqZWN0cyBvZiB0aGUgbGF5ZXIuIERvZXMgbm90IHdvcmsgZm9yIHZlY3RvciB0aWxlcy5cbiAgICovXG4gIGdldExheWVycz8oKTogTGF5ZXJEZWZpbml0aW9uPEYsIEw+W107XG4gIC8qKlxuICAgKiBNZXRob2QgZm9yIHNlbGVjdGluZyBvYmplY3RzIG9uIHRoZSBtYXAuIFRoZSBgc2VsZWN0ZWRQYWludGAgb3B0aW9uIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgc2VsZWN0ZWQgb2JqZWN0cy5cbiAgICogQHJlbWFya3NcbiAgICogSXQgaXMgc3Ryb25nbHkgcmVjb21tZW5kZWQgdG8gdXNlIGFuIGBQdHJvcGVydGllc0ZpbHRlcmAgZXhwcmVzc2lvbiB0byBzZXQgc2VsZWN0ZWQgb2JqZWN0cyxcbiAgICogc2luY2UgdGhlIHNlbGVjdGluZyBieSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gaXMgbm90IHN1cHBvcnRlZCBieSB2ZWN0b3IgdGlsZXMgYW5kIG90aGVyIGFzeW5jaHJvbm91cyBhZGFwdGVycy5cbiAgICovXG4gIHNlbGVjdD8oZmluZEZlYXR1cmVDYj86IERhdGFMYXllckZpbHRlcjxGLCBMPiB8IFByb3BlcnRpZXNGaWx0ZXIpOiB2b2lkO1xuICAvKipcbiAgICogRGVzZWxlY3QgYWxsIG9iamVjdHMgaW4gdGhlIHZlY3RvciBsYXllci5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICogVGhlIHBhcmFtZXRlciBgZmluZEZlYXR1cmVDYmAgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSBkZWxldGVkIHNvb24uXG4gICAqIEluc3RlYWQsIGl04oCZcyBiZXR0ZXIgdG8gZGVzZWxlY3QgYWxsIGFuZCBzZWxlY3QgYWdhaW4uXG4gICAqL1xuICB1bnNlbGVjdD8oZmluZEZlYXR1cmVDYj86IERhdGFMYXllckZpbHRlcjxGLCBMPiB8IFByb3BlcnRpZXNGaWx0ZXIpOiB2b2lkO1xuICAvKipcbiAgICogR2V0IHRoZSBzZWxlY3RlZCBvYmplY3RzIG9mIHRoZSB2ZWN0b3IgbGF5ZXIuXG4gICAqL1xuICBnZXRTZWxlY3RlZD8oKTogTGF5ZXJEZWZpbml0aW9uPEZlYXR1cmUsIEw+W107XG4gIC8qKlxuICAgKiBHZXQgdGhlIGZpbHRlcmVkIG9iamVjdHMgb2YgdGhlIHZlY3RvciBsYXllci5cbiAgICovXG4gIGdldEZpbHRlcmVkPygpOiBMYXllckRlZmluaXRpb248RmVhdHVyZSwgTD5bXTtcbiAgLyoqXG4gICAqIEFiaWxpdHkgdG8gZmlsdGVyIGEgbGF5ZXIgd2l0aCBhIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgKiBJdCBpcyBuZWNlc3NhcnkgZm9yIHRoZSBhZGFwdGVyIHRvIHByb3ZpZGUgYWNjZXNzIHRvIHRoZSBsYXllciBvYmplY3RzIGJlZm9yZSBvdXRwdXQgdG8gdGhlIG1hcC5cbiAgICogSXQgaXMgbm90IHBvc3NpYmxlIHRvIGFwcGx5IHN1Y2ggYSBmaWx0ZXIgdG8gdmVjdG9yIHRpbGVzIGFuZCBkYXRhIG9uIHRoZSByZW1vdGUgc2VydmVyLlxuICAgKiBTbywgd2hlcmUgcG9zc2libGUsIHVzZSB0aGUge0BsaW5rIFZlY3RvckxheWVyQWRhcHRlci5wcm9wZXJ0aWVzRmlsdGVyfS5cbiAgICogQGV4YW1wbGVcbiAgICogYGBganNcbiAgICogbGF5ZXIuZmlsdGVyKChlKSA9PiBlLmZlYXR1cmUucHJvcGVydGllcy5pZCA9PT0gMjAxMSk7XG4gICAqIC8vIGJ1dCBpbiB0aGlzIGNhc2UgaXTigJlzIGJldHRlciB0byBkbyBzbzpcbiAgICogbGF5ZXIucHJvcGVydGllc0ZpbHRlcihbWydpZCcsICdlcScsIDIwMTFdXSlcbiAgICogYGBgXG4gICAqL1xuICBmaWx0ZXI/KGNiOiBEYXRhTGF5ZXJGaWx0ZXI8RiwgTD4pOiBBcnJheTxMYXllckRlZmluaXRpb248RmVhdHVyZSwgTD4+O1xuICAvKipcbiAgICogVGhlIHdheSB0byBmaWx0ZXIgbGF5ZXIgb2JqZWN0cyB0aHJvdWdoIHNlcmlhbGl6YWJsZSBleHByZXNzaW9ucy5cbiAgICogVG8gY2xlYXIgdGhlIGZpbHRlciwgcGFzcyBgbnVsbGAgb3IgYHVuZGVmaW5lZGAgYXMgdGhlIHNlY29uZCBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSBmaWx0ZXJzIC0gRmlsdGVyLCBjb25mb3JtaW5nIHRvIHRoZSBQcm9wZXJ0aWVzRmlsdGVyIGV4cHJlc3Npb24gc3BlY2lmaWNhdGlvbidzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtIE9wdGlvbnMgb2JqZWN0LlxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGBqc1xuICAgKiBsYXllci5wcm9wZXJ0aWVzRmlsdGVyKFsnYWxsJywgWydjb2xvcicsICdlcScsICdncmVlbiddLCBbJ3llYXInLCAnZ3QnLCAyMDExXV0pO1xuICAgKiBsYXllci5wcm9wZXJ0aWVzRmlsdGVyKFtbXG4gICAqICAgJ2FueScsXG4gICAqICAgWydjb2xvcicsICdlcScsICdncmVlbiddLFxuICAgKiAgIFsnY29sb3InLCAnZXEnLCAncmVkJ11cbiAgICogXSxcbiAgICogICBbJ3llYXInLCAnZ3QnLCAyMDExXVxuICAgKiBdKTtcbiAgICogYGBgXG4gICAqL1xuICBwcm9wZXJ0aWVzRmlsdGVyPyhmaWx0ZXJzOiBQcm9wZXJ0aWVzRmlsdGVyLCBvcHRpb25zPzogRmlsdGVyT3B0aW9ucyk6IHZvaWQ7XG4gIC8qKlxuICAgKiBDYW5jZWwgdGhlIGZpbHRlciwgcmV0dXJuIGFsbCBvYmplY3RzIHRvIHRoZSBtYXAuXG4gICAqL1xuICByZW1vdmVGaWx0ZXI/KCk6IHZvaWQ7XG4gIC8qKlxuICAgKiBBZGQgR2VvSnNvbiBkYXRhIHRvIGxheWVyLlxuICAgKiBAcGFyYW0gZ2VvanNvbiBHZW9Kc29uIG9iamVjdC5cbiAgICovXG4gIGFkZERhdGE/KGdlb2pzb246IEdlb0pzb25PYmplY3QpOiB2b2lkO1xuICAvKipcbiAgICogVXBkYXRlIGxheWVyIHdpdGggbmV3IGdlb2pzb24uXG4gICAqIEBwYXJhbSBnZW9qc29uIEdlb0pzb24gb2JqZWN0LlxuICAgKi9cbiAgc2V0RGF0YT8oZ2VvanNvbjogR2VvSnNvbk9iamVjdCk6IHZvaWQ7XG4gIC8qKlxuICAgKiBSZW1vdmUgbGF5ZXIgZGF0YS5cbiAgICogQHBhcmFtIGNiIC0gRGVsZXRlIG9ubHkgdGhvc2Ugb2JqZWN0cyB0aGF0IG1hdGNoIHRoZSBmaWx0ZXIuXG4gICAqL1xuICBjbGVhckxheWVyPyhjYj86IChmZWF0dXJlOiBGZWF0dXJlKSA9PiBib29sZWFuKTogdm9pZDtcbiAgLyoqXG4gICAqIENhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbiBjbGlja2luZyBvbiBhIGxheWVyLlxuICAgKiBAcGFyYW0gZXZlbnQgLSBEYXRhIHRoYXQgaXMgdHJhbnNtaXR0ZWQgd2hlbiB5b3UgY2xpY2sgb24gYSBsYXllci5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBvbkxheWVyQ2xpY2s/KGV2ZW50OiBPbkxheWVyQ2xpY2tPcHRpb25zKTogUHJvbWlzZTxhbnk+O1xuXG4gIG9wZW5Qb3B1cD8oXG4gICAgZmluZEZlYXR1cmVDYj86IERhdGFMYXllckZpbHRlcjxGLCBMPixcbiAgICBvcHRpb25zPzogUG9wdXBPcHRpb25zXG4gICk6IHZvaWQ7XG5cbiAgY2xvc2VQb3B1cD8oZmluZEZlYXR1cmVDYj86IERhdGFMYXllckZpbHRlcjxGLCBMPik6IHZvaWQ7XG5cbiAgdXBkYXRlVG9vbHRpcD8obGF5ZXJEZWY/OiBMYXllckRlZmluaXRpb248RiwgTD4pOiB2b2lkO1xufVxuIiwiLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyT2JqZWN0KG9iajogUmVjb3JkPGFueSwgYW55Pik6IHZvaWQge1xuICBmb3IgKGNvbnN0IG1lbWJlciBpbiBvYmopIHtcbiAgICBkZWxldGUgb2JqW21lbWJlcl07XG4gIH1cbn1cbiIsImltcG9ydCB7IFdlYk1hcCB9IGZyb20gJy4uL1dlYk1hcCc7XG5pbXBvcnQgeyBXZWJNYXBFdmVudHMgfSBmcm9tICcuLi9pbnRlcmZhY2VzL0V2ZW50cyc7XG5cbi8qKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvbkxvYWQ8RSBleHRlbmRzIFdlYk1hcEV2ZW50cyA9IFdlYk1hcEV2ZW50cz4oZXZlbnQ6IGtleW9mIEUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChcbiAgICBfdGFyZ2V0OiBXZWJNYXAsXG4gICAgX3Byb3BlcnR5S2V5OiBzdHJpbmcsXG4gICAgZGVzY3JpcHRvcjogUHJvcGVydHlEZXNjcmlwdG9yXG4gICk6IFByb3BlcnR5RGVzY3JpcHRvciB7XG4gICAgY29uc3Qgb3JpZ2luYWxNZXRob2QgPSBkZXNjcmlwdG9yLnZhbHVlO1xuXG4gICAgZGVzY3JpcHRvci52YWx1ZSA9IGZ1bmN0aW9uIChcbiAgICAgIHRoaXM6IFdlYk1hcDx1bmtub3duLCB1bmtub3duLCB1bmtub3duLCBFPixcbiAgICAgIC4uLmFyZ3M6IHVua25vd25bXVxuICAgICkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgX3Jlc29sdmUgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgY29uc3Qgb3JpZ2luID0gb3JpZ2luYWxNZXRob2QuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgb3JpZ2luICYmIG9yaWdpbi50aGVuXG4gICAgICAgICAgICA/IG9yaWdpbi50aGVuKHJlc29sdmUpLmNhdGNoKHJlamVjdClcbiAgICAgICAgICAgIDogcmVzb2x2ZShvcmlnaW4pO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBpc0xvYWRlZCA9IHRoaXMuZ2V0RXZlbnRTdGF0dXMoZXZlbnQpO1xuICAgICAgICBpZiAoaXNMb2FkZWQpIHtcbiAgICAgICAgICBfcmVzb2x2ZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZW1pdHRlci5vbmNlKGV2ZW50IGFzIGtleW9mIFdlYk1hcEV2ZW50cywgKCkgPT4ge1xuICAgICAgICAgICAgX3Jlc29sdmUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gZGVzY3JpcHRvcjtcbiAgfTtcbn1cbiIsImltcG9ydCB7XG4gIEdlb0pzb25PYmplY3QsXG4gIEdlb0pzb25HZW9tZXRyeVR5cGVzLFxuICBGZWF0dXJlQ29sbGVjdGlvbixcbiAgR2VvbWV0cnlDb2xsZWN0aW9uLFxuICBGZWF0dXJlLFxufSBmcm9tICdnZW9qc29uJztcblxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRNb3N0RnJlcXVlbnRHZW9tVHlwZShcbiAgYXJyOiBHZW9Kc29uR2VvbWV0cnlUeXBlc1tdXG4pOiBHZW9Kc29uR2VvbWV0cnlUeXBlcyB7XG4gIGNvbnN0IGNvdW50czogeyBbeDogc3RyaW5nXTogbnVtYmVyIH0gPSB7fTtcbiAgZm9yIChsZXQgZnJ5ID0gMDsgZnJ5IDwgYXJyLmxlbmd0aDsgZnJ5KyspIHtcbiAgICBjb3VudHNbYXJyW2ZyeV1dID0gMSArIChjb3VudHNbYXJyW2ZyeV1dIHx8IDApO1xuICB9XG4gIGxldCBtYXhOYW1lO1xuICBmb3IgKGNvbnN0IGMgaW4gY291bnRzKSB7XG4gICAgY29uc3QgY291bnQgPSBtYXhOYW1lICE9PSB1bmRlZmluZWQgPyBjb3VudHNbbWF4TmFtZV0gOiAwO1xuICAgIGlmIChjb3VudHNbY10gPiAoY291bnQgfHwgMCkpIHtcbiAgICAgIG1heE5hbWUgPSBjO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbWF4TmFtZSBhcyBHZW9Kc29uR2VvbWV0cnlUeXBlcztcbn1cblxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRldGVjdEdlb21ldHJ5VHlwZShcbiAgZ2VvanNvbjogR2VvSnNvbk9iamVjdFxuKTogR2VvSnNvbkdlb21ldHJ5VHlwZXMge1xuICBsZXQgZ2VvbWV0cnk6IEdlb0pzb25HZW9tZXRyeVR5cGVzO1xuICBpZiAoZ2VvanNvbi50eXBlID09PSAnRmVhdHVyZUNvbGxlY3Rpb24nKSB7XG4gICAgY29uc3QgZmVhdHVyZXNUeXBlcyA9IChnZW9qc29uIGFzIEZlYXR1cmVDb2xsZWN0aW9uKS5mZWF0dXJlcy5tYXAoXG4gICAgICAoZikgPT4gZi5nZW9tZXRyeS50eXBlXG4gICAgKTtcbiAgICBnZW9tZXRyeSA9IGZpbmRNb3N0RnJlcXVlbnRHZW9tVHlwZShmZWF0dXJlc1R5cGVzKTtcbiAgfSBlbHNlIGlmIChnZW9qc29uLnR5cGUgPT09ICdHZW9tZXRyeUNvbGxlY3Rpb24nKSB7XG4gICAgY29uc3QgZ2VvbWV0cnlUeXBlcyA9IChnZW9qc29uIGFzIEdlb21ldHJ5Q29sbGVjdGlvbikuZ2VvbWV0cmllcy5tYXAoXG4gICAgICAoZykgPT4gZy50eXBlXG4gICAgKTtcbiAgICBnZW9tZXRyeSA9IGZpbmRNb3N0RnJlcXVlbnRHZW9tVHlwZShnZW9tZXRyeVR5cGVzKTtcbiAgfSBlbHNlIGlmIChnZW9qc29uLnR5cGUgPT09ICdGZWF0dXJlJykge1xuICAgIGdlb21ldHJ5ID0gKGdlb2pzb24gYXMgRmVhdHVyZSkuZ2VvbWV0cnkudHlwZTtcbiAgfSBlbHNlIHtcbiAgICBnZW9tZXRyeSA9IGdlb2pzb24udHlwZTtcbiAgfVxuICByZXR1cm4gZ2VvbWV0cnk7XG59XG4iLCJpbXBvcnQgeyBMbmdMYXRCb3VuZHNBcnJheSB9IGZyb20gJy4uL2ludGVyZmFjZXMvQmFzZVR5cGVzJztcbmltcG9ydCB7IEZlYXR1cmUsIFBvbHlnb24gfSBmcm9tICdnZW9qc29uJztcblxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEJvdW5kc1BvbHlnb24oYjogTG5nTGF0Qm91bmRzQXJyYXkpOiBGZWF0dXJlPFBvbHlnb24+IHtcbiAgY29uc3Qgd2VzdE5vcnRoID0gW2JbMF0sIGJbMV1dO1xuICBjb25zdCBlYXN0Tm9ydGggPSBbYlsyXSwgYlsxXV07XG4gIGNvbnN0IGVhc3RTb3V0aCA9IFtiWzJdLCBiWzNdXTtcbiAgY29uc3Qgd2VzdFNvdXRoID0gW2JbMF0sIGJbM11dO1xuXG4gIGNvbnN0IGZlYXR1cmU6IEZlYXR1cmU8UG9seWdvbj4gPSB7XG4gICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgIHByb3BlcnRpZXM6IHt9LFxuICAgIGdlb21ldHJ5OiB7XG4gICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICBjb29yZGluYXRlczogW1t3ZXN0Tm9ydGgsIGVhc3ROb3J0aCwgZWFzdFNvdXRoLCB3ZXN0U291dGgsIHdlc3ROb3J0aF1dLFxuICAgIH0sXG4gIH07XG4gIHJldHVybiBmZWF0dXJlO1xufVxuIiwiLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IHtcbiAgb3BlcmF0aW9uc0FsaWFzZXMsXG4gIHByb3BlcnRpZXNGaWx0ZXIsXG59IGZyb20gJ0BuZXh0Z2lzL3Byb3BlcnRpZXMtZmlsdGVyJztcbiIsImltcG9ydCB7IGlzUGFpbnQgfSBmcm9tICdAbmV4dGdpcy9wYWludCc7XG5pbXBvcnQge1xuICBHZW9Kc29uQWRhcHRlck9wdGlvbnMsXG4gIFZlY3RvckFkYXB0ZXJMYXllclR5cGUsXG59IGZyb20gJy4uL2ludGVyZmFjZXMvTGF5ZXJBZGFwdGVyJztcbmltcG9ydCB7IGRldGVjdEdlb21ldHJ5VHlwZSB9IGZyb20gJy4vZ2VvbWV0cnlUeXBlcyc7XG5cbi8qKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBjb25zdCBwYWludFR5cGVBbGlhczogUmVjb3JkPFZlY3RvckFkYXB0ZXJMYXllclR5cGUsIGFueT4gPSB7XG4gIHBvbHlnb246ICdwYXRoJyxcbiAgbGluZTogJ3BhdGgnLFxuICBwb2ludDogJ2NpcmNsZScsXG59O1xuXG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgY29uc3QgdHlwZUFsaWFzOiB7IFt4OiBzdHJpbmddOiBWZWN0b3JBZGFwdGVyTGF5ZXJUeXBlIH0gPSB7XG4gIFBvaW50OiAncG9pbnQnLFxuICBMaW5lU3RyaW5nOiAnbGluZScsXG4gIE11bHRpUG9pbnQ6ICdwb2ludCcsXG4gIFBvbHlnb246ICdwb2x5Z29uJyxcbiAgTXVsdGlMaW5lU3RyaW5nOiAnbGluZScsXG4gIE11bHRpUG9seWdvbjogJ3BvbHlnb24nLFxufTtcblxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUdlb0pzb25BZGFwdGVyT3B0aW9ucyhcbiAgb3B0OiBHZW9Kc29uQWRhcHRlck9wdGlvbnNcbik6IEdlb0pzb25BZGFwdGVyT3B0aW9ucyB7XG4gIGlmIChvcHQuZGF0YSkge1xuICAgIGNvbnN0IGdlb21UeXBlID0gdHlwZUFsaWFzW2RldGVjdEdlb21ldHJ5VHlwZShvcHQuZGF0YSldO1xuICAgIGNvbnN0IHAgPSBvcHQucGFpbnQ7XG4gICAgaWYgKHAgJiYgaXNQYWludChwKSkge1xuICAgICAgLy8gZGVmaW5lIHBhcmFtZXRlciBpZiBub3Qgc3BlY2lmaWVkXG4gICAgICBwLnR5cGUgPSBwLnR5cGVcbiAgICAgICAgPyBwLnR5cGVcbiAgICAgICAgOiBnZW9tVHlwZSA9PT0gJ3BvbHlnb24nIHx8IGdlb21UeXBlID09PSAnbGluZSdcbiAgICAgICAgPyAncGF0aCdcbiAgICAgICAgOiAnaHRtbCcgaW4gcCB8fCAnY2xhc3NOYW1lJyBpbiBwXG4gICAgICAgID8gJ2ljb24nXG4gICAgICAgIDogcGFpbnRUeXBlQWxpYXNbZ2VvbVR5cGVdO1xuICAgIH1cbiAgICBvcHQudHlwZSA9IG9wdC50eXBlIHx8IGdlb21UeXBlO1xuICB9XG4gIHJldHVybiBvcHQ7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9