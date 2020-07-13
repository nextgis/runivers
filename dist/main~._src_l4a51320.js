(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main~._src_l"],{

/***/ "./src/layers/BaseLayer.ts":
/*!*********************************!*\
  !*** ./src/layers/BaseLayer.ts ***!
  \*********************************/
/*! exports provided: BaseLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseLayer", function() { return BaseLayer; });
var BaseLayer = (function () {
    function BaseLayer(app, options) {
        this.app = app;
        this.opacity = 1;
        this.simplification = 8;
        this.selectOnLayerClick = false;
        this.oldNgwMvtApi = false;
        Object.assign(this, options);
    }
    Object.defineProperty(BaseLayer.prototype, "groupLayer", {
        get: function () {
            return this.app.timeMap && this.app.timeMap.getTimeGroup(this.name);
        },
        enumerable: false,
        configurable: true
    });
    return BaseLayer;
}());



/***/ }),

/***/ "./src/layers/BoundaryLayer.ts":
/*!*************************************!*\
  !*** ./src/layers/BoundaryLayer.ts ***!
  \*************************************/
/*! exports provided: BoundaryLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BoundaryLayer", function() { return BoundaryLayer; });
/* harmony import */ var color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! color */ "./node_modules/color/index.js");
/* harmony import */ var color__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(color__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _utils_findYearInDateStr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/findYearInDateStr */ "./src/utils/findYearInDateStr.ts");
/* harmony import */ var _BaseLayer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./BaseLayer */ "./src/layers/BaseLayer.ts");
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
var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};




var BoundaryLayer = (function (_super) {
    __extends(BoundaryLayer, _super);
    function BoundaryLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.oldNgwMvtApi = true;
        _this.filterIdField = 'fid';
        return _this;
    }
    BoundaryLayer.prototype.addLayers = function (url, id) {
        return this._createTimeLayers(url, id);
    };
    BoundaryLayer.prototype.getFillColor = function (opt) {
        return this._getFillColor(opt);
    };
    BoundaryLayer.prototype.createPopupContent = function (props) {
        if (props && props.status && props.status < 6) {
            var fields = [];
            return this._createPropBlock(fields, props);
        }
    };
    BoundaryLayer.prototype._createTimeLayers = function (url, id) {
        var timeGroup = this.groupLayer;
        if (timeGroup) {
            var paint = {
                'fill-opacity': timeGroup.opacity,
                'fill-opacity-transition': {
                    duration: 0,
                },
                'fill-color': this._getFillColor(),
            };
            var selectedPaint = __assign(__assign({}, paint), { 'fill-color': this._getFillColor({ darken: 0.5 }) });
            var sourceLayer = id;
            var fillLayer = this.app.webMap.addLayer('MVT', {
                url: url,
                id: id,
                name: id,
                paint: paint,
                order: this.order,
                selectedPaint: selectedPaint,
                selectable: true,
                type: 'polygon',
                nativePaint: true,
                labelField: 'name',
                sourceLayer: sourceLayer,
            });
            return [
                fillLayer,
            ];
        }
        return [];
    };
    BoundaryLayer.prototype._getFillColor = function (opt) {
        if (opt === void 0) { opt = {}; }
        var lineColor = [];
        var lineColorLegend = this.app.options.lineColorLegend;
        var legend = lineColorLegend && lineColorLegend['base'];
        if (legend && lineColor && legend) {
            var meta = ['match', ['get', 'status']];
            legend.forEach(function (x) {
                var linksToLineColors = x[3];
                linksToLineColors.forEach(function (y) {
                    var paint = x[1];
                    var color = typeof paint === 'string' ? paint : paint.color;
                    lineColor.push([y, color]);
                });
            });
            var colors = lineColor.reduce(function (a, b) {
                var param = b[0], color = b[1];
                var c = color__WEBPACK_IMPORTED_MODULE_0___default()(color);
                if (param) {
                    a.push(param);
                }
                if (opt.darken) {
                    c = c.darken(opt.darken);
                }
                a.push(c.hex());
                return a;
            }, []);
            colors.push('#cccccc');
            return meta.concat(colors);
        }
    };
    BoundaryLayer.prototype._formatDateStr = function (str) {
        var formated = str.split('-').reverse().join('.');
        return formated;
    };
    BoundaryLayer.prototype._createPropElement = function (html, addClass) {
        if (addClass === void 0) { addClass = ''; }
        var propBlock = document.createElement('div');
        propBlock.className = 'popup__propertyblock';
        propBlock.innerHTML = "<div class=\"popup__property--value" + (addClass ? ' ' + addClass : '') + "\" >" + html + "</div >";
        return propBlock;
    };
    BoundaryLayer.prototype._findPrincipalities01 = function (fid, year) {
        var princes = this.app.options.principalities01 || [];
        var prince = princes.find(function (x) {
            var upperdat = Object(_utils_findYearInDateStr__WEBPACK_IMPORTED_MODULE_2__["default"])(x.upperdat);
            var lwdate = Object(_utils_findYearInDateStr__WEBPACK_IMPORTED_MODULE_2__["default"])(x.lwdate);
            if (upperdat && lwdate) {
                return x.fid === fid && year <= upperdat && year >= lwdate;
            }
            return false;
        });
        return prince;
    };
    BoundaryLayer.prototype._findPrincipalities02 = function (fid, year) {
        var princes = this.app.options.principalities02 || [];
        var prince = princes.find(function (x) {
            var upperdat = Object(_utils_findYearInDateStr__WEBPACK_IMPORTED_MODULE_2__["default"])(x.years_to);
            var lwdate = Object(_utils_findYearInDateStr__WEBPACK_IMPORTED_MODULE_2__["default"])(x.years_from);
            if (upperdat && lwdate) {
                return fid === x.fid && year <= upperdat && year >= lwdate;
            }
            return false;
        });
        return prince;
    };
    BoundaryLayer.prototype._createPropBlock = function (fields, props, headerField) {
        var _this = this;
        if (headerField === void 0) { headerField = 'name'; }
        var block = document.createElement('div');
        var _fields = __spreadArrays(fields);
        var _props = __assign({}, props);
        var timeStop = this.app.getTimeStop(this.app.timeMap.currentYear);
        if (timeStop === 'principalities') {
            this._addPrincipalitiesFields(_fields, _props);
        }
        if (_props[headerField]) {
            var showLink = false;
            block.appendChild(this._createPropElement("<h2>" + _props[headerField] + "\n            " + (showLink ? '<a class="feature-link">&#x1f517;</a>' : '') + "\n          </h2>", 'prop header'));
        }
        _fields.forEach(function (x) {
            var prop = _props[x.field];
            if (prop) {
                var propBlock = document.createElement('div');
                propBlock.className = 'popup__propertyblock';
                propBlock.innerHTML = '';
                if (prop) {
                    var content = x.getHtml
                        ? x.getHtml(prop, _props)
                        : _this._createPropElement(prop, '');
                    block.appendChild(content);
                }
            }
        });
        if (props.status) {
            block.innerHTML += this._createPropStatusHtml(props);
        }
        var featureLink = block.getElementsByClassName('feature-link')[0];
        if (featureLink) {
            featureLink.addEventListener('click', function () {
                var url = document.location.origin + document.location.pathname;
                url += "?year=" + _this.app.timeMap.currentYear + "&id=" + props.fid;
                _this.app.urlParams.set('id', String(props.fid));
                Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["copyText"])(url);
            });
        }
        this._addPropShowDateClickEvent(block);
        return block;
    };
    BoundaryLayer.prototype._addPrincipalitiesFields = function (fields, props) {
        var _this = this;
        var addProp = function (value, opt) {
            fields.push(__assign({ name: opt.field }, opt));
            props[opt.field] = value;
        };
        var getHtml = function (prop, props) {
            return _this._createPropElement("<a href=\"" + props.desc_link + "\" target=\"_blank\">" + prop + "</a>", '');
        };
        var getHtml2 = function (prop, props) {
            return _this._createPropElement("\u041F\u0440\u0430\u0432\u0438\u0442\u0435\u043B\u044C: <a href=\"" + props.desc_link + "\" target=\"_blank\">" + prop + "</a>", '');
        };
        var getHtmlFromTo = function (prop, props) {
            return _this._createPropElement("\u0414\u0430\u0442\u044B \u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F: " + prop + " \u0433\u0433.");
        };
        var fid = props.fid;
        if (fid) {
            var prince01 = this._findPrincipalities01(fid, this.app.timeMap.currentYear);
            var prince02 = this._findPrincipalities02(fid, this.app.timeMap.currentYear);
            if (prince01) {
                props['desc_link'] = prince01.desc_link;
                addProp(prince01.name, { field: 'name_prince', getHtml: getHtml });
            }
            if (prince02) {
                addProp(prince02.ruler, { field: 'ruler', getHtml: getHtml2 });
                addProp(prince02.years_from + " - " + prince02.years_to, {
                    field: 'board_dates',
                    getHtml: getHtmlFromTo,
                });
            }
        }
    };
    BoundaryLayer.prototype._createPropStatusHtml = function (props) {
        var str = '';
        var alias = this.app.options.statusAliases &&
            this.app.options.statusAliases[props.status];
        if (alias) {
            str += "\n              <div class=\"popup__property--value status\"><p>" + alias + "</p></div>\n            ";
        }
        var timeStop = this.app.getTimeStop(this.app.timeMap.currentYear);
        if (timeStop !== 'principalities') {
            if (props.status > 0 && props.status < 6) {
                var lwdate = this._formatDateStr(props.lwdate);
                var updtrl = this._formatDateStr(props.updtrl || props.upperdat);
                if (lwdate && updtrl) {
                    str += "\n              <div class=\"popup__property--value dates\">\n                <span>\n                  <span class=\"show-date\">" + lwdate + "</span> -\n                  <span class=\"show-date\">" + updtrl + "</span>\n                </span>\n              </div>\n            ";
                }
            }
            if (props.Area) {
                str += "\n              <div class=\"popup__property--value area\">\n                <span>\n                  " + Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["formatArea"])(props.Area / 1000000) + "\n                </span>\n              </div>\n            ";
            }
        }
        return str;
    };
    BoundaryLayer.prototype._addPropShowDateClickEvent = function (block) {
        var _this = this;
        var yearsLinks = block.querySelectorAll('.show-date');
        var _loop_1 = function (fry) {
            var link = yearsLinks[fry];
            link.addEventListener('click', function () {
                var year = Object(_utils_findYearInDateStr__WEBPACK_IMPORTED_MODULE_2__["default"])(link.innerHTML);
                if (year) {
                    _this.app.timeMap.updateByYear(year);
                    if (_this.app.slider && _this.app.slider._slider) {
                        _this.app.slider._slider.set(year);
                    }
                }
            });
        };
        for (var fry = 0; fry < yearsLinks.length; fry++) {
            _loop_1(fry);
        }
    };
    return BoundaryLayer;
}(_BaseLayer__WEBPACK_IMPORTED_MODULE_3__["BaseLayer"]));



/***/ }),

/***/ "./src/layers/CitiesLayer.ts":
/*!***********************************!*\
  !*** ./src/layers/CitiesLayer.ts ***!
  \***********************************/
/*! exports provided: CitiesLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CitiesLayer", function() { return CitiesLayer; });
/* harmony import */ var _img_city_png__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../img/city.png */ "./src/img/city.png");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _nextgis_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextgis/utils */ "./nextgis_frontend/packages/utils/src/index.ts");
/* harmony import */ var _BaseLayer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./BaseLayer */ "./src/layers/BaseLayer.ts");
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




var CitiesLayer = (function (_super) {
    __extends(CitiesLayer, _super);
    function CitiesLayer(app, options) {
        var _this = _super.call(this, app, options) || this;
        _this.app = app;
        _this.oldNgwMvtApi = true;
        _this.emitter = new events__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        _this.events = new _nextgis_utils__WEBPACK_IMPORTED_MODULE_2__["Events"](_this.emitter);
        _this.app.webMap.onLoad().then(function () { return _this._registerMapboxImages(); });
        return _this;
    }
    CitiesLayer.prototype.addLayers = function (url, id) {
        return this._createTimeLayers(url, id);
    };
    CitiesLayer.prototype._registerMapboxImages = function () {
        var _this = this;
        var map = this.app.webMap.mapAdapter.map;
        if (map) {
            map.loadImage('images/city.png', function (er, image) {
                map.addImage('city', image);
                _this.emitter.emit('load-images');
            });
        }
    };
    CitiesLayer.prototype._createTimeLayers = function (url, id) {
        var _this = this;
        var sourceLayer = id;
        var label = this.events.onLoad('load-images').then(function () {
            var layer = _this.app.webMap.addLayer('MVT', {
                url: url,
                id: id,
                order: _this.order,
                paint: {
                    'text-color': 'rgba(255, 255, 255, 1)',
                    'text-halo-color': 'rgba(49, 67, 90, .9)',
                    'text-halo-width': 1,
                },
                layout: {
                    'icon-image': 'city',
                    'icon-allow-overlap': true,
                    'icon-optional': true,
                    'text-field': ['to-string', ['get', 'toponym']],
                    'text-anchor': 'top',
                    'text-size': 10,
                    'text-font': ['Open Sans Semibold'],
                    'text-variable-anchor': ['top'],
                    'text-radial-offset': 0.95,
                    'text-line-height': 1.1,
                    'text-letter-spacing': 0.06,
                    'text-padding': 0,
                    'text-justify': 'auto',
                },
                type: 'point',
                nativeOptions: { type: 'symbol' },
                nativePaint: true,
                sourceLayer: sourceLayer,
            });
            return layer.then(function (x) {
                return x;
            });
        });
        return [
            label,
        ];
    };
    return CitiesLayer;
}(_BaseLayer__WEBPACK_IMPORTED_MODULE_3__["BaseLayer"]));



/***/ }),

/***/ "./src/layers/LinesLayer.ts":
/*!**********************************!*\
  !*** ./src/layers/LinesLayer.ts ***!
  \**********************************/
/*! exports provided: LinesLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LinesLayer", function() { return LinesLayer; });
/* harmony import */ var _BaseLayer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseLayer */ "./src/layers/BaseLayer.ts");
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

var LinesLayer = (function (_super) {
    __extends(LinesLayer, _super);
    function LinesLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.oldNgwMvtApi = true;
        return _this;
    }
    LinesLayer.prototype.addLayers = function (url, id) {
        var opacity = this.groupLayer ? this.groupLayer.opacity : 1;
        var paintLine = __assign({ 'line-opacity': opacity, 'line-opacity-transition': {
                duration: 0,
            }, 'line-width': 2 }, this._getLinePaint());
        var sourceLayer = id;
        var boundLayer = this.app.webMap.addLayer('MVT', {
            url: url,
            id: id,
            order: this.order,
            paint: paintLine,
            type: 'line',
            sourceLayer: sourceLayer,
            nativePaint: true,
            visibility: true,
        });
        return [boundLayer];
    };
    LinesLayer.prototype._getLineTypes = function () {
        var lineTypes = {};
        var lineColorLegend = this.app.options.lineColorLegend;
        var legend = lineColorLegend && lineColorLegend['lines'];
        if (legend && legend) {
            legend.forEach(function (x) {
                var linksToLineColors = x[3];
                linksToLineColors.forEach(function (y) {
                    var paint = x[1];
                    var status = x[3];
                    status.forEach(function (z) {
                        var color = typeof paint === 'string' ? paint : paint.color;
                        var width = (typeof paint !== 'string' && paint.width) || 1;
                        lineTypes[Number(z)] = { color: color, width: width };
                    });
                });
            });
        }
        return lineTypes;
    };
    LinesLayer.prototype._getLinePaint = function () {
        var color = ['match', ['get', 'linetype']];
        var lineTypes = this._getLineTypes();
        Object.entries(lineTypes).forEach(function (_a) {
            var linetype = _a[0], value = _a[1];
            color.push(Number(linetype));
            color.push(value.color);
        });
        color.push('#000000');
        return { 'line-color': color };
    };
    return LinesLayer;
}(_BaseLayer__WEBPACK_IMPORTED_MODULE_0__["BaseLayer"]));



/***/ }),

/***/ "./src/layers/MarkerLayer.ts":
/*!***********************************!*\
  !*** ./src/layers/MarkerLayer.ts ***!
  \***********************************/
/*! exports provided: MarkerLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MarkerLayer", function() { return MarkerLayer; });
/* harmony import */ var proj4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! proj4 */ "./node_modules/proj4/lib/index.js");
/* harmony import */ var mapbox_gl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mapbox-gl */ "./node_modules/mapbox-gl/dist/mapbox-gl.js");
/* harmony import */ var mapbox_gl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(mapbox_gl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _nextgis_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextgis/utils */ "./nextgis_frontend/packages/utils/src/index.ts");
/* harmony import */ var _services_GetPointsService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/GetPointsService */ "./src/services/GetPointsService.ts");




var MarkerLayer = (function () {
    function MarkerLayer(app) {
        this.app = app;
        this.opacity = 1;
        this.simplification = 8;
        this._markers = [];
        this._pointsConfig = [];
    }
    MarkerLayer.prototype.setPoints = function (points) {
        this._pointsConfig = this._processPointsMeta(points);
        var pointId = this._getPointIdByYear(this.app.timeMap.currentYear);
        if (pointId) {
            this.updatePoint(pointId);
        }
    };
    MarkerLayer.prototype.remove = function () {
        this._markers.forEach(function (x) {
            x.marker.remove();
        });
        this._markers = [];
    };
    MarkerLayer.prototype.updatePoint = function (pointId) {
        if (pointId !== this.currentPointId) {
            if (this.currentPointId) {
                this.remove();
            }
            this.currentPointId = pointId;
            if (pointId) {
                this._addPoint(pointId);
            }
        }
    };
    MarkerLayer.prototype.updateActiveMarker = function (yearsStat) {
        if (yearsStat) {
            this._markers.forEach(function (x) {
                if (x.properties.year === yearsStat.year &&
                    x.properties.numb === yearsStat.numb) {
                    x.element.classList.add('active');
                }
                else {
                    x.element.classList.remove('active');
                }
            });
        }
    };
    MarkerLayer.prototype._getPointIdByYear = function (year) {
        var point = this._getPointByYear(year);
        if (point) {
            return point && String(point.id);
        }
    };
    MarkerLayer.prototype._addPoint = function (id) {
        var _this = this;
        Object(_services_GetPointsService__WEBPACK_IMPORTED_MODULE_3__["getPointGeojson"])(id).then(function (data) {
            var _many = data.features.length > 1 &&
                Object(_nextgis_utils__WEBPACK_IMPORTED_MODULE_2__["arrayUnique"])(data.features.map(function (x) { return x.properties.numb; }));
            var many = _many && _many.length > 1;
            data.features.forEach(function (marker, i) {
                var type = marker && marker.geometry && marker.geometry.type;
                if (type === 'MultiPoint') {
                    var coordinates = marker.geometry.coordinates;
                    coordinates.forEach(function (x) {
                        _this._addMarkerToMap(x, marker.properties, many);
                    });
                }
                else if (type === 'Point') {
                    _this._addMarkerToMap(marker.geometry.coordinates, marker.properties, many);
                }
            });
        });
    };
    MarkerLayer.prototype._addMarkerToMap = function (coordinates, properties, many) {
        var _this = this;
        var map = this.app.webMap.mapAdapter.map;
        if (map) {
            var element = document.createElement('div');
            var isActive = void 0;
            if (this.app.controls.yearsStatPanelControl) {
                var yearStat = this.app.controls.yearsStatPanelControl.yearStat;
                isActive =
                    yearStat &&
                        yearStat.year === properties.year &&
                        yearStat.numb === properties.numb;
            }
            element.className = 'map-marker' + (isActive ? ' active' : '');
            var elInner = document.createElement('div');
            elInner.className = 'map-marker--inner';
            elInner.innerHTML = many
                ? "<div class=\"map-marker__label\">" + properties.numb + "</div>"
                : '';
            element.appendChild(elInner);
            var coordEPSG4326 = Object(proj4__WEBPACK_IMPORTED_MODULE_0__["default"])('EPSG:3857').inverse(coordinates);
            var marker = new mapbox_gl__WEBPACK_IMPORTED_MODULE_1__["Marker"](element);
            var markerMem_1 = { marker: marker, element: element, properties: properties };
            this._markers.push(markerMem_1);
            marker.setLngLat(coordEPSG4326);
            marker.addTo(map);
            element.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                _this._setMarkerActive(markerMem_1, properties);
            });
        }
    };
    MarkerLayer.prototype._setMarkerActive = function (markerMem, properties) {
        var yearControl = this.app.controls.yearsStatPanelControl;
        if (yearControl && yearControl.yearStats) {
            var yearStat = yearControl.yearStats.find(function (x) {
                return x.year === properties.year && x.numb === properties.numb;
            });
            if (yearStat) {
                yearControl.updateYearStat(yearStat);
                yearControl.unBlock();
                yearControl.show();
            }
        }
    };
    MarkerLayer.prototype._getPointByYear = function (year) {
        return this._pointsConfig.find(function (x) { return x.year === year; });
    };
    MarkerLayer.prototype._processPointsMeta = function (pointsMeta) {
        return pointsMeta.map(function (_a) {
            var resource = _a.resource;
            var name = resource.display_name;
            var _match = name.match('(\\d{4})*$');
            var year = _match.slice(1).map(function (x) { return Number(x); })[0];
            return { name: name, year: year, id: resource.id };
        });
    };
    return MarkerLayer;
}());



/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mapbox_gl_dist_mapbox_gl_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mapbox-gl/dist/mapbox-gl.css */ "./node_modules/mapbox-gl/dist/mapbox-gl.css");
/* harmony import */ var mapbox_gl_dist_mapbox_gl_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mapbox_gl_dist_mapbox_gl_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_stable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/stable */ "./node_modules/core-js/stable/index.js");
/* harmony import */ var core_js_stable__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_stable__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _nextgis_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextgis/utils */ "./nextgis_frontend/packages/utils/src/index.ts");
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./App */ "./src/App.ts");
/* harmony import */ var _config_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../config.json */ "./config.json");
var _config_json__WEBPACK_IMPORTED_MODULE_5___namespace = /*#__PURE__*/__webpack_require__.t(/*! ../config.json */ "./config.json", 1);
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../package.json */ "./package.json");
var _package_json__WEBPACK_IMPORTED_MODULE_6___namespace = /*#__PURE__*/__webpack_require__.t(/*! ../package.json */ "./package.json", 1);
/* harmony import */ var _data_periods_csv__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./data/periods.csv */ "./src/data/periods.csv");
/* harmony import */ var _data_periods_csv__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_data_periods_csv__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _data_years_stat_csv__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./data/years_stat.csv */ "./src/data/years_stat.csv");
/* harmony import */ var _data_years_stat_csv__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_data_years_stat_csv__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _data_area_stat_csv__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./data/area_stat.csv */ "./src/data/area_stat.csv");
/* harmony import */ var _data_area_stat_csv__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_data_area_stat_csv__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _data_principalities_01_csv__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./data/principalities_01.csv */ "./src/data/principalities_01.csv");
/* harmony import */ var _data_principalities_01_csv__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_data_principalities_01_csv__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _data_principalities_02_csv__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./data/principalities_02.csv */ "./src/data/principalities_02.csv");
/* harmony import */ var _data_principalities_02_csv__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_data_principalities_02_csv__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _css_style_css__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./css/style.css */ "./src/css/style.css");
/* harmony import */ var _css_style_css__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_css_style_css__WEBPACK_IMPORTED_MODULE_12__);













function prepareYearStat() {
    var cacheByYear = {};
    _data_years_stat_csv__WEBPACK_IMPORTED_MODULE_8___default.a.forEach(function (s) {
        cacheByYear[s.year] = cacheByYear[s.year] || [];
        cacheByYear[s.year].push(s);
    });
    for (var s in cacheByYear) {
        var stat = cacheByYear[s];
        if (stat.length > 1) {
            stat.forEach(function (x, i) {
                if (!Object(_nextgis_utils__WEBPACK_IMPORTED_MODULE_3__["defined"])(x.count)) {
                    x.numb = i + 1;
                }
            });
        }
    }
    return _data_years_stat_csv__WEBPACK_IMPORTED_MODULE_8___default.a;
}
var app = new _App__WEBPACK_IMPORTED_MODULE_4__["App"]({
    baseUrl: _config_json__WEBPACK_IMPORTED_MODULE_5__.baseUrl,
    target: 'map',
    fromYear: 850,
    timeStops: [{ toYear: 1462, name: 'principalities' }],
    currentYear: 1462,
    animationDelay: 100,
    animationStep: 1,
    bounds: [2, 27, 203, 82],
    minZoom: 3,
    periods: _data_periods_csv__WEBPACK_IMPORTED_MODULE_7___default.a,
    yearsStat: prepareYearStat(),
    areaStat: _data_area_stat_csv__WEBPACK_IMPORTED_MODULE_9___default.a,
    principalities01: _data_principalities_01_csv__WEBPACK_IMPORTED_MODULE_10___default.a,
    principalities02: _data_principalities_02_csv__WEBPACK_IMPORTED_MODULE_11___default.a,
    version: _package_json__WEBPACK_IMPORTED_MODULE_6__["version"],
    lineColor: _config_json__WEBPACK_IMPORTED_MODULE_5__.lineColor,
    lineColorLegend: _config_json__WEBPACK_IMPORTED_MODULE_5__.lineColorLegend,
});
app.emitter.on('build', function () {
    var pips = document.getElementsByClassName('noUi-marker-large');
    if (pips.length) {
        var firstLast = [pips[0], pips[pips.length - 1]];
        firstLast.forEach(function (x) {
            x.style.display = 'none';
        });
    }
});
window.app = app;
window.version = _package_json__WEBPACK_IMPORTED_MODULE_6__["version"];


/***/ }),

/***/ "./src/services/GetLayersService.ts":
/*!******************************************!*\
  !*** ./src/services/GetLayersService.ts ***!
  \******************************************/
/*! exports provided: getLayers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLayers", function() { return getLayers; });
/* harmony import */ var _data_layers_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../data/layers.json */ "./src/data/layers.json");
var _data_layers_json__WEBPACK_IMPORTED_MODULE_0___namespace = /*#__PURE__*/__webpack_require__.t(/*! ../data/layers.json */ "./src/data/layers.json", 1);

function getLayers(callback) {
    if (_data_layers_json__WEBPACK_IMPORTED_MODULE_0__) {
        setTimeout(function () {
            callback(_data_layers_json__WEBPACK_IMPORTED_MODULE_0__);
        });
    }
}


/***/ }),

/***/ "./src/services/GetPointsService.ts":
/*!******************************************!*\
  !*** ./src/services/GetPointsService.ts ***!
  \******************************************/
/*! exports provided: getPoints, getPointGeojson */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPoints", function() { return getPoints; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPointGeojson", function() { return getPointGeojson; });
/* harmony import */ var _NgwConnectorService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NgwConnectorService */ "./src/services/NgwConnectorService.ts");
/* harmony import */ var _config_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config.json */ "./config.json");
var _config_json__WEBPACK_IMPORTED_MODULE_1___namespace = /*#__PURE__*/__webpack_require__.t(/*! ../../config.json */ "./config.json", 1);


function getPoints() {
    return _NgwConnectorService__WEBPACK_IMPORTED_MODULE_0__["connector"].makeQuery('/api/resource/?parent={id}', {
        id: _config_json__WEBPACK_IMPORTED_MODULE_1__.pointsGroupId,
    }, {});
}
function getPointGeojson(id) {
    return _NgwConnectorService__WEBPACK_IMPORTED_MODULE_0__["connector"].makeQuery('/api/resource/{id}/geojson', {
        id: id,
    }, {});
}


/***/ }),

/***/ "./src/services/NgwConnectorService.ts":
/*!*********************************************!*\
  !*** ./src/services/NgwConnectorService.ts ***!
  \*********************************************/
/*! exports provided: connector */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "connector", function() { return connector; });
/* harmony import */ var _nextgis_ngw_connector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextgis/ngw-connector */ "./nextgis_frontend/packages/ngw-connector/src/index.ts");
/* harmony import */ var _config_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config.json */ "./config.json");
var _config_json__WEBPACK_IMPORTED_MODULE_1___namespace = /*#__PURE__*/__webpack_require__.t(/*! ../../config.json */ "./config.json", 1);


var ngwUrl = _config_json__WEBPACK_IMPORTED_MODULE_1__.baseUrl;
var connector = new _nextgis_ngw_connector__WEBPACK_IMPORTED_MODULE_0__["default"]({
    baseUrl: ngwUrl,
});



/***/ }),

/***/ "./src/services/UrlParams.ts":
/*!***********************************!*\
  !*** ./src/services/UrlParams.ts ***!
  \***********************************/
/*! exports provided: urlParams */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "urlParams", function() { return urlParams; });
/* harmony import */ var _nextgis_url_runtime_params__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextgis/url-runtime-params */ "./nextgis_frontend/packages/url-runtime-params/src/index.ts");

var urlParams = new _nextgis_url_runtime_params__WEBPACK_IMPORTED_MODULE_0__["default"]();


/***/ }),

/***/ "./src/utils/findYearInDateStr.ts":
/*!****************************************!*\
  !*** ./src/utils/findYearInDateStr.ts ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return findYearInDateStr; });
function findYearInDateStr(dateStr) {
    var datePattern = /(\d{4})/;
    var date = datePattern.exec(dateStr);
    if (date) {
        return Number(date[0]);
    }
}


/***/ }),

/***/ "./src/utils/utils.ts":
/*!****************************!*\
  !*** ./src/utils/utils.ts ***!
  \****************************/
/*! exports provided: formatArea, copyText */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formatArea", function() { return formatArea; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "copyText", function() { return copyText; });
/* harmony import */ var _nextgis_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextgis/utils */ "./nextgis_frontend/packages/utils/src/index.ts");

function formatArea(area) {
    return Object(_nextgis_utils__WEBPACK_IMPORTED_MODULE_0__["numberWithSpaces"])(Math.round(area)) + " \u043A\u043C\u00B2";
}
function copyText(text) {
    _nextgis_utils__WEBPACK_IMPORTED_MODULE_0__["Clipboard"].copy(text);
}


/***/ })

},[[0,"runtime","vendors~main~._node_modules_@","vendors~main~._node_modules_canvg_lib_index.es.js~0d73eb9d","vendors~main~._node_modules_core-js_e","vendors~main~._node_modules_core-js_m","vendors~main~._node_modules_d","vendors~main~._node_modules_i","vendors~main~._node_modules_mapbox-gl_dist_mapbox-gl.js~e1924c74","vendors~main~._node_modules_mgrs_mgrs.js~910ab360","vendors~main~._node_modules_n","vendors~main~._node_modules_proj4_l","vendors~main~._node_modules_r","main~._c","main~._p","main~._src_T","main~._src_d","main~._src_data_a","main~._src_data_years_stat.csv~7aea5c50"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbGF5ZXJzL0Jhc2VMYXllci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbGF5ZXJzL0JvdW5kYXJ5TGF5ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xheWVycy9DaXRpZXNMYXllci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbGF5ZXJzL0xpbmVzTGF5ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xheWVycy9NYXJrZXJMYXllci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmljZXMvR2V0TGF5ZXJzU2VydmljZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmljZXMvR2V0UG9pbnRzU2VydmljZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmljZXMvTmd3Q29ubmVjdG9yU2VydmljZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmljZXMvVXJsUGFyYW1zLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlscy9maW5kWWVhckluRGF0ZVN0ci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVFBO0FBQUE7QUFBQTtJQVdFLG1CQUFzQixHQUFRLEVBQUUsT0FBd0M7UUFBbEQsUUFBRyxHQUFILEdBQUcsQ0FBSztRQUw5QixZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ1osbUJBQWMsR0FBRyxDQUFDLENBQUM7UUFDbkIsdUJBQWtCLEdBQUcsS0FBSyxDQUFDO1FBQzNCLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBR25CLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxzQkFBSSxpQ0FBVTthQUFkO1lBQ0UsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFB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QztLQUN4QjtBQUNILENBQUM7Ozs7Ozs7Ozs7Ozs7QUNORDtBQUFBO0FBQUE7QUFBQTtBQUE2RDtBQUV0RCxTQUFTLFVBQVUsQ0FBQyxJQUFZO0lBQ3JDLE9BQVUsdUVBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyx3QkFBTSxDQUFDO0FBQ3JELENBQUM7QUFFTSxTQUFTLFFBQVEsQ0FBQyxJQUFZO0lBQ25DLHdEQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLENBQUMiLCJmaWxlIjoibWFpbn4uX3NyY19sNGE1MTMyMC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIFRpbWVMYXllcnNHcm91cE9wdGlvbnMsXG4gIFRpbWVMYXllcixcbiAgVGltZUxheWVyc0dyb3VwLFxufSBmcm9tICcuLi9UaW1lTWFwL1RpbWVHcm91cCc7XG5cbmltcG9ydCB7IEFwcCB9IGZyb20gJy4uL0FwcCc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlTGF5ZXIgaW1wbGVtZW50cyBUaW1lTGF5ZXJzR3JvdXBPcHRpb25zIHtcbiAgbmFtZSE6IHN0cmluZztcbiAgYmFzZVVybCE6IHN0cmluZztcbiAgbWFudWFsT3BhY2l0eT86IGJvb2xlYW47XG4gIGZpbHRlcklkRmllbGQ/OiBzdHJpbmc7XG4gIG9yZGVyPzogbnVtYmVyO1xuICBvcGFjaXR5ID0gMTtcbiAgc2ltcGxpZmljYXRpb24gPSA4O1xuICBzZWxlY3RPbkxheWVyQ2xpY2sgPSBmYWxzZTtcbiAgb2xkTmd3TXZ0QXBpID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGFwcDogQXBwLCBvcHRpb25zOiBQYXJ0aWFsPFRpbWVMYXllcnNHcm91cE9wdGlvbnM+KSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvcHRpb25zKTtcbiAgfVxuXG4gIGdldCBncm91cExheWVyKCk6IFRpbWVMYXllcnNHcm91cCB8IGZhbHNlIHtcbiAgICByZXR1cm4gdGhpcy5hcHAudGltZU1hcCAmJiB0aGlzLmFwcC50aW1lTWFwLmdldFRpbWVHcm91cCh0aGlzLm5hbWUpO1xuICB9XG5cbiAgYWJzdHJhY3QgYWRkTGF5ZXJzKHVybDogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTxUaW1lTGF5ZXI+W107XG59XG4iLCJpbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InO1xuXG5pbXBvcnQgeyBUaW1lTGF5ZXIgfSBmcm9tICcuLi9UaW1lTWFwL1RpbWVHcm91cCc7XG5cbmltcG9ydCB7XG4gIEdldEZpbGxDb2xvck9wdCxcbiAgSGlzdG9yeUxheWVyUHJvcGVydGllcyxcbiAgUG9wdXBDb250ZW50RmllbGQsXG59IGZyb20gJy4uL2ludGVyZmFjZXMnO1xuXG5pbXBvcnQgeyBmb3JtYXRBcmVhLCBjb3B5VGV4dCB9IGZyb20gJy4uL3V0aWxzL3V0aWxzJztcbmltcG9ydCB7IFByaW5jaXBhbGl0aWVzMDEgfSBmcm9tICcuLi9kYXRhL1ByaW5jaXBhbGl0aWVzMDEnO1xuaW1wb3J0IHsgUHJpbmNpcGFsaXRpZXMwMiB9IGZyb20gJy4uL2RhdGEvUHJpbmNpcGFsaXRpZXMwMic7XG5pbXBvcnQgZmluZFllYXJJbkRhdGVTdHIgZnJvbSAnLi4vdXRpbHMvZmluZFllYXJJbkRhdGVTdHInO1xuaW1wb3J0IHsgQmFzZUxheWVyIH0gZnJvbSAnLi9CYXNlTGF5ZXInO1xuXG5leHBvcnQgY2xhc3MgQm91bmRhcnlMYXllciBleHRlbmRzIEJhc2VMYXllciB7XG4gIG9sZE5nd012dEFwaSA9IHRydWU7XG4gIGZpbHRlcklkRmllbGQgPSAnZmlkJztcblxuICBhZGRMYXllcnModXJsOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBQcm9taXNlPFRpbWVMYXllcj5bXSB7XG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZVRpbWVMYXllcnModXJsLCBpZCk7XG4gIH1cblxuICBnZXRGaWxsQ29sb3Iob3B0OiBHZXRGaWxsQ29sb3JPcHQpOiBhbnlbXSB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX2dldEZpbGxDb2xvcihvcHQpO1xuICB9XG5cbiAgY3JlYXRlUG9wdXBDb250ZW50KHByb3BzOiBIaXN0b3J5TGF5ZXJQcm9wZXJ0aWVzKTogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQge1xuICAgIGlmIChwcm9wcyAmJiBwcm9wcy5zdGF0dXMgJiYgcHJvcHMuc3RhdHVzIDwgNikge1xuICAgICAgY29uc3QgZmllbGRzOiB7XG4gICAgICAgIG5hbWU/OiBzdHJpbmc7XG4gICAgICAgIGZpZWxkOiBrZXlvZiBIaXN0b3J5TGF5ZXJQcm9wZXJ0aWVzO1xuICAgICAgfVtdID0gW1xuICAgICAgICAvLyB7IG5hbWU6ICdGaWQnLCBmaWVsZDogJ2ZpZCcgfVxuICAgICAgICAvLyB7IGZpZWxkOiAnbmFtZScgfVxuICAgICAgICAvLyB7IG5hbWU6ICfQndCw0LjQvNC10L3QvtCy0LDQvdC40LUg0YLQtdGA0YDQuNGC0L7RgNC40LgnLCBmaWVsZDogJ25hbWUnIH0sXG4gICAgICAgIC8vIHsgbmFtZTogJ9CU0LDRgtCwINCy0L7Qt9C90LjQutC90L7QstC10L3QuNGPJywgZmllbGQ6ICdsd2RhdGUnIH0sXG4gICAgICAgIC8vIHsgbmFtZTogJ9CU0LDRgtCwINC40YHRh9C10LfQvdC+0LLQtdC90LjRjycsIGZpZWxkOiAndXBkdHJsJyB9LFxuICAgICAgICAvLyB7IG5hbWU6ICfQmtC+0LzQvNC10L3RgtCw0YDQuNC5JywgZmllbGQ6ICdsaW5lY29tbnQnIH0sXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZVByb3BCbG9jayhmaWVsZHMsIHByb3BzKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVUaW1lTGF5ZXJzKHVybDogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTxUaW1lTGF5ZXI+W10ge1xuICAgIGNvbnN0IHRpbWVHcm91cCA9IHRoaXMuZ3JvdXBMYXllcjtcbiAgICBpZiAodGltZUdyb3VwKSB7XG4gICAgICBjb25zdCBwYWludCA9IHtcbiAgICAgICAgJ2ZpbGwtb3BhY2l0eSc6IHRpbWVHcm91cC5vcGFjaXR5LFxuICAgICAgICAnZmlsbC1vcGFjaXR5LXRyYW5zaXRpb24nOiB7XG4gICAgICAgICAgZHVyYXRpb246IDAsXG4gICAgICAgIH0sXG4gICAgICAgIC8vICdmaWxsLW91dGxpbmUtY29sb3InOiAnIzhiMDAwMCcsIC8vIGRhcmtyZWRcbiAgICAgICAgLy8gJ2ZpbGwtb3V0bGluZS1jb2xvcic6ICcjOGIwMDAwJywgLy8gZGFya3JlZFxuICAgICAgICAnZmlsbC1jb2xvcic6IHRoaXMuX2dldEZpbGxDb2xvcigpLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IHNlbGVjdGVkUGFpbnQgPSB7XG4gICAgICAgIC4uLnBhaW50LFxuICAgICAgICAnZmlsbC1jb2xvcic6IHRoaXMuX2dldEZpbGxDb2xvcih7IGRhcmtlbjogMC41IH0pLFxuICAgICAgfTtcblxuICAgICAgY29uc3Qgc291cmNlTGF5ZXIgPSBpZDtcbiAgICAgIGNvbnN0IGZpbGxMYXllciA9IHRoaXMuYXBwLndlYk1hcC5hZGRMYXllcignTVZUJywge1xuICAgICAgICB1cmwsXG4gICAgICAgIGlkLFxuICAgICAgICBuYW1lOiBpZCxcbiAgICAgICAgcGFpbnQsXG4gICAgICAgIG9yZGVyOiB0aGlzLm9yZGVyLFxuICAgICAgICBzZWxlY3RlZFBhaW50LFxuICAgICAgICBzZWxlY3RhYmxlOiB0cnVlLFxuICAgICAgICB0eXBlOiAncG9seWdvbicsXG4gICAgICAgIG5hdGl2ZVBhaW50OiB0cnVlLFxuICAgICAgICBsYWJlbEZpZWxkOiAnbmFtZScsXG4gICAgICAgIHNvdXJjZUxheWVyLFxuICAgICAgfSkgYXMgUHJvbWlzZTxUaW1lTGF5ZXI+O1xuICAgICAgLy8gY29uc3QgcGFpbnRMaW5lID0ge1xuICAgICAgLy8gICAnbGluZS1vcGFjaXR5JzogdGltZUdyb3VwLm9wYWNpdHksXG4gICAgICAvLyAgICdsaW5lLW9wYWNpdHktdHJhbnNpdGlvbic6IHtcbiAgICAgIC8vICAgICBkdXJhdGlvbjogMFxuICAgICAgLy8gICB9LFxuICAgICAgLy8gICAnbGluZS13aWR0aCc6IDEsXG4gICAgICAvLyAgICdsaW5lLWNvbG9yJzogdGhpcy5fZ2V0RmlsbENvbG9yKHsgZGFya2VuOiAwLjUgfSlcbiAgICAgIC8vIH07XG4gICAgICAvLyBjb25zdCBib3VuZExheWVyID0gdGhpcy5hcHAud2ViTWFwLmFkZExheWVyKCdNVlQnLCB7XG4gICAgICAvLyAgIHVybCxcbiAgICAgIC8vICAgaWQ6IGlkICsgJy1ib3VuZCcsXG4gICAgICAvLyAgIG5hbWU6IGlkLFxuICAgICAgLy8gICBwYWludDogcGFpbnRMaW5lLFxuICAgICAgLy8gICB0eXBlOiAnbGluZScsXG4gICAgICAvLyAgIHNvdXJjZUxheWVyLFxuICAgICAgLy8gICBuYXRpdmVQYWludDogdHJ1ZVxuICAgICAgLy8gfSkgYXMgUHJvbWlzZTxUaW1lTGF5ZXI+O1xuXG4gICAgICByZXR1cm4gW1xuICAgICAgICBmaWxsTGF5ZXIsXG4gICAgICAgIC8vIGJvdW5kTGF5ZXJcbiAgICAgIF07XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldEZpbGxDb2xvcihvcHQ6IEdldEZpbGxDb2xvck9wdCA9IHt9KSB7XG4gICAgY29uc3QgbGluZUNvbG9yOiBbbnVtYmVyLCBzdHJpbmddW10gPSBbXTtcbiAgICBjb25zdCB7IGxpbmVDb2xvckxlZ2VuZCB9ID0gdGhpcy5hcHAub3B0aW9ucztcbiAgICBjb25zdCBsZWdlbmQgPSBsaW5lQ29sb3JMZWdlbmQgJiYgbGluZUNvbG9yTGVnZW5kWydiYXNlJ107XG4gICAgaWYgKGxlZ2VuZCAmJiBsaW5lQ29sb3IgJiYgbGVnZW5kKSB7XG4gICAgICBjb25zdCBtZXRhOiBhbnlbXSA9IFsnbWF0Y2gnLCBbJ2dldCcsICdzdGF0dXMnXV07XG4gICAgICBsZWdlbmQuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgICBjb25zdCBsaW5rc1RvTGluZUNvbG9ycyA9IHhbM107XG4gICAgICAgIGxpbmtzVG9MaW5lQ29sb3JzLmZvckVhY2goKHkpID0+IHtcbiAgICAgICAgICBjb25zdCBwYWludCA9IHhbMV07XG4gICAgICAgICAgY29uc3QgY29sb3IgPSB0eXBlb2YgcGFpbnQgPT09ICdzdHJpbmcnID8gcGFpbnQgOiBwYWludC5jb2xvcjtcbiAgICAgICAgICBsaW5lQ29sb3IucHVzaChbeSwgY29sb3JdKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGNvbG9ycyA9IGxpbmVDb2xvci5yZWR1Y2U8KHN0cmluZyB8IG51bWJlcilbXT4oKGEsIGIpID0+IHtcbiAgICAgICAgY29uc3QgW3BhcmFtLCBjb2xvcl0gPSBiO1xuICAgICAgICBsZXQgYyA9IENvbG9yKGNvbG9yKTtcbiAgICAgICAgaWYgKHBhcmFtKSB7XG4gICAgICAgICAgYS5wdXNoKHBhcmFtKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0LmRhcmtlbikge1xuICAgICAgICAgIGMgPSBjLmRhcmtlbihvcHQuZGFya2VuKTtcbiAgICAgICAgfVxuICAgICAgICBhLnB1c2goYy5oZXgoKSk7XG4gICAgICAgIHJldHVybiBhO1xuICAgICAgfSwgW10pO1xuICAgICAgLy8gZGVmYXVsdFxuICAgICAgY29sb3JzLnB1c2goJyNjY2NjY2MnKTtcbiAgICAgIHJldHVybiBtZXRhLmNvbmNhdChjb2xvcnMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2Zvcm1hdERhdGVTdHIoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IGZvcm1hdGVkID0gc3RyLnNwbGl0KCctJykucmV2ZXJzZSgpLmpvaW4oJy4nKTtcbiAgICByZXR1cm4gZm9ybWF0ZWQ7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVQcm9wRWxlbWVudChodG1sOiBzdHJpbmcsIGFkZENsYXNzID0gJycpIHtcbiAgICBjb25zdCBwcm9wQmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwcm9wQmxvY2suY2xhc3NOYW1lID0gJ3BvcHVwX19wcm9wZXJ0eWJsb2NrJztcbiAgICBwcm9wQmxvY2suaW5uZXJIVE1MID0gYDxkaXYgY2xhc3M9XCJwb3B1cF9fcHJvcGVydHktLXZhbHVlJHtcbiAgICAgIGFkZENsYXNzID8gJyAnICsgYWRkQ2xhc3MgOiAnJ1xuICAgIH1cIiA+JHtodG1sfTwvZGl2ID5gO1xuICAgIHJldHVybiBwcm9wQmxvY2s7XG4gIH1cblxuICBwcml2YXRlIF9maW5kUHJpbmNpcGFsaXRpZXMwMShmaWQ6IG51bWJlciwgeWVhcjogbnVtYmVyKSB7XG4gICAgY29uc3QgcHJpbmNlcyA9IHRoaXMuYXBwLm9wdGlvbnMucHJpbmNpcGFsaXRpZXMwMSB8fCBbXTtcblxuICAgIGNvbnN0IHByaW5jZSA9IHByaW5jZXMuZmluZCgoeCkgPT4ge1xuICAgICAgY29uc3QgdXBwZXJkYXQgPSBmaW5kWWVhckluRGF0ZVN0cih4LnVwcGVyZGF0KTtcbiAgICAgIGNvbnN0IGx3ZGF0ZSA9IGZpbmRZZWFySW5EYXRlU3RyKHgubHdkYXRlKTtcbiAgICAgIGlmICh1cHBlcmRhdCAmJiBsd2RhdGUpIHtcbiAgICAgICAgcmV0dXJuIHguZmlkID09PSBmaWQgJiYgeWVhciA8PSB1cHBlcmRhdCAmJiB5ZWFyID49IGx3ZGF0ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcmluY2U7XG4gIH1cblxuICBwcml2YXRlIF9maW5kUHJpbmNpcGFsaXRpZXMwMihmaWQ6IG51bWJlciwgeWVhcjogbnVtYmVyKSB7XG4gICAgY29uc3QgcHJpbmNlcyA9IHRoaXMuYXBwLm9wdGlvbnMucHJpbmNpcGFsaXRpZXMwMiB8fCBbXTtcblxuICAgIGNvbnN0IHByaW5jZSA9IHByaW5jZXMuZmluZCgoeCkgPT4ge1xuICAgICAgY29uc3QgdXBwZXJkYXQgPSBmaW5kWWVhckluRGF0ZVN0cih4LnllYXJzX3RvKTtcbiAgICAgIGNvbnN0IGx3ZGF0ZSA9IGZpbmRZZWFySW5EYXRlU3RyKHgueWVhcnNfZnJvbSk7XG4gICAgICBpZiAodXBwZXJkYXQgJiYgbHdkYXRlKSB7XG4gICAgICAgIHJldHVybiBmaWQgPT09IHguZmlkICYmIHllYXIgPD0gdXBwZXJkYXQgJiYgeWVhciA+PSBsd2RhdGU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJpbmNlO1xuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlUHJvcEJsb2NrKFxuICAgIGZpZWxkczogUG9wdXBDb250ZW50RmllbGQ8a2V5b2YgSGlzdG9yeUxheWVyUHJvcGVydGllcz5bXSxcbiAgICBwcm9wczogSGlzdG9yeUxheWVyUHJvcGVydGllcyxcbiAgICBoZWFkZXJGaWVsZCA9ICduYW1lJ1xuICApIHtcbiAgICBjb25zdCBibG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IF9maWVsZHM6IFBvcHVwQ29udGVudEZpZWxkW10gPSBbLi4uZmllbGRzXTtcbiAgICBjb25zdCBfcHJvcHM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IC4uLnByb3BzIH07XG4gICAgY29uc3QgdGltZVN0b3AgPSB0aGlzLmFwcC5nZXRUaW1lU3RvcCh0aGlzLmFwcC50aW1lTWFwLmN1cnJlbnRZZWFyKTtcbiAgICBpZiAodGltZVN0b3AgPT09ICdwcmluY2lwYWxpdGllcycpIHtcbiAgICAgIHRoaXMuX2FkZFByaW5jaXBhbGl0aWVzRmllbGRzKF9maWVsZHMsIF9wcm9wcyk7XG4gICAgfVxuXG4gICAgaWYgKF9wcm9wc1toZWFkZXJGaWVsZF0pIHtcbiAgICAgIGNvbnN0IHNob3dMaW5rID0gZmFsc2U7XG4gICAgICBibG9jay5hcHBlbmRDaGlsZChcbiAgICAgICAgdGhpcy5fY3JlYXRlUHJvcEVsZW1lbnQoXG4gICAgICAgICAgYDxoMj4ke19wcm9wc1toZWFkZXJGaWVsZF19XG4gICAgICAgICAgICAke3Nob3dMaW5rID8gJzxhIGNsYXNzPVwiZmVhdHVyZS1saW5rXCI+JiN4MWY1MTc7PC9hPicgOiAnJ31cbiAgICAgICAgICA8L2gyPmAsXG4gICAgICAgICAgJ3Byb3AgaGVhZGVyJ1xuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIF9maWVsZHMuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgY29uc3QgcHJvcCA9IF9wcm9wc1t4LmZpZWxkXTtcbiAgICAgIGlmIChwcm9wKSB7XG4gICAgICAgIGNvbnN0IHByb3BCbG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBwcm9wQmxvY2suY2xhc3NOYW1lID0gJ3BvcHVwX19wcm9wZXJ0eWJsb2NrJztcbiAgICAgICAgcHJvcEJsb2NrLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBpZiAocHJvcCkge1xuICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSB4LmdldEh0bWxcbiAgICAgICAgICAgID8geC5nZXRIdG1sKHByb3AsIF9wcm9wcylcbiAgICAgICAgICAgIDogdGhpcy5fY3JlYXRlUHJvcEVsZW1lbnQocHJvcCwgJycpO1xuICAgICAgICAgIGJsb2NrLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAocHJvcHMuc3RhdHVzKSB7XG4gICAgICBibG9jay5pbm5lckhUTUwgKz0gdGhpcy5fY3JlYXRlUHJvcFN0YXR1c0h0bWwocHJvcHMpO1xuICAgIH1cbiAgICBjb25zdCBmZWF0dXJlTGluayA9IGJsb2NrLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXG4gICAgICAnZmVhdHVyZS1saW5rJ1xuICAgIClbMF0gYXMgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKGZlYXR1cmVMaW5rKSB7XG4gICAgICBmZWF0dXJlTGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgbGV0IHVybCA9IGRvY3VtZW50LmxvY2F0aW9uLm9yaWdpbiArIGRvY3VtZW50LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgICAgICB1cmwgKz0gYD95ZWFyPSR7dGhpcy5hcHAudGltZU1hcC5jdXJyZW50WWVhcn0maWQ9JHtwcm9wcy5maWR9YDtcbiAgICAgICAgdGhpcy5hcHAudXJsUGFyYW1zLnNldCgnaWQnLCBTdHJpbmcocHJvcHMuZmlkKSk7XG4gICAgICAgIGNvcHlUZXh0KHVybCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5fYWRkUHJvcFNob3dEYXRlQ2xpY2tFdmVudChibG9jayk7XG4gICAgcmV0dXJuIGJsb2NrO1xuICB9XG5cbiAgcHJpdmF0ZSBfYWRkUHJpbmNpcGFsaXRpZXNGaWVsZHMoXG4gICAgZmllbGRzOiBQb3B1cENvbnRlbnRGaWVsZFtdLFxuICAgIHByb3BzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+XG4gICkge1xuICAgIGNvbnN0IGFkZFByb3AgPSAodmFsdWU6IGFueSwgb3B0OiBQb3B1cENvbnRlbnRGaWVsZCkgPT4ge1xuICAgICAgZmllbGRzLnB1c2goeyBuYW1lOiBvcHQuZmllbGQsIC4uLm9wdCB9KTtcbiAgICAgIHByb3BzW29wdC5maWVsZF0gPSB2YWx1ZTtcbiAgICB9O1xuICAgIGNvbnN0IGdldEh0bWwgPSAocHJvcDoga2V5b2YgUHJpbmNpcGFsaXRpZXMwMSwgcHJvcHM6IFByaW5jaXBhbGl0aWVzMDEpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVQcm9wRWxlbWVudChcbiAgICAgICAgYDxhIGhyZWY9XCIke3Byb3BzLmRlc2NfbGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3Byb3B9PC9hPmAsXG4gICAgICAgICcnXG4gICAgICApO1xuICAgIH07XG4gICAgY29uc3QgZ2V0SHRtbDIgPSAoXG4gICAgICBwcm9wOiBrZXlvZiBQcmluY2lwYWxpdGllczAyLFxuICAgICAgcHJvcHM6IFByaW5jaXBhbGl0aWVzMDJcbiAgICApID0+IHtcbiAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVQcm9wRWxlbWVudChcbiAgICAgICAgYNCf0YDQsNCy0LjRgtC10LvRjDogPGEgaHJlZj1cIiR7cHJvcHMuZGVzY19saW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7cHJvcH08L2E+YCxcbiAgICAgICAgJydcbiAgICAgICk7XG4gICAgfTtcbiAgICBjb25zdCBnZXRIdG1sRnJvbVRvID0gKHByb3A6IGFueSwgcHJvcHM6IGFueSkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZVByb3BFbGVtZW50KGDQlNCw0YLRiyDQv9GA0LDQstC70LXQvdC40Y86ICR7cHJvcH0g0LPQsy5gKTtcbiAgICB9O1xuICAgIGNvbnN0IGZpZCA9IHByb3BzLmZpZDtcbiAgICBpZiAoZmlkKSB7XG4gICAgICBjb25zdCBwcmluY2UwMSA9IHRoaXMuX2ZpbmRQcmluY2lwYWxpdGllczAxKFxuICAgICAgICBmaWQsXG4gICAgICAgIHRoaXMuYXBwLnRpbWVNYXAuY3VycmVudFllYXJcbiAgICAgICk7XG4gICAgICBjb25zdCBwcmluY2UwMiA9IHRoaXMuX2ZpbmRQcmluY2lwYWxpdGllczAyKFxuICAgICAgICBmaWQsXG4gICAgICAgIHRoaXMuYXBwLnRpbWVNYXAuY3VycmVudFllYXJcbiAgICAgICk7XG4gICAgICBpZiAocHJpbmNlMDEpIHtcbiAgICAgICAgcHJvcHNbJ2Rlc2NfbGluayddID0gcHJpbmNlMDEuZGVzY19saW5rO1xuICAgICAgICBhZGRQcm9wKHByaW5jZTAxLm5hbWUsIHsgZmllbGQ6ICduYW1lX3ByaW5jZScsIGdldEh0bWwgfSk7XG4gICAgICB9XG4gICAgICBpZiAocHJpbmNlMDIpIHtcbiAgICAgICAgYWRkUHJvcChwcmluY2UwMi5ydWxlciwgeyBmaWVsZDogJ3J1bGVyJywgZ2V0SHRtbDogZ2V0SHRtbDIgfSk7XG4gICAgICAgIGFkZFByb3AoYCR7cHJpbmNlMDIueWVhcnNfZnJvbX0gLSAke3ByaW5jZTAyLnllYXJzX3RvfWAsIHtcbiAgICAgICAgICBmaWVsZDogJ2JvYXJkX2RhdGVzJyxcbiAgICAgICAgICBnZXRIdG1sOiBnZXRIdG1sRnJvbVRvLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVQcm9wU3RhdHVzSHRtbChwcm9wczogSGlzdG9yeUxheWVyUHJvcGVydGllcykge1xuICAgIGxldCBzdHIgPSAnJztcbiAgICBjb25zdCBhbGlhcyA9XG4gICAgICB0aGlzLmFwcC5vcHRpb25zLnN0YXR1c0FsaWFzZXMgJiZcbiAgICAgIHRoaXMuYXBwLm9wdGlvbnMuc3RhdHVzQWxpYXNlc1twcm9wcy5zdGF0dXNdO1xuICAgIGlmIChhbGlhcykge1xuICAgICAgc3RyICs9IGBcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBvcHVwX19wcm9wZXJ0eS0tdmFsdWUgc3RhdHVzXCI+PHA+JHthbGlhc308L3A+PC9kaXY+XG4gICAgICAgICAgICBgO1xuICAgIH1cbiAgICBjb25zdCB0aW1lU3RvcCA9IHRoaXMuYXBwLmdldFRpbWVTdG9wKHRoaXMuYXBwLnRpbWVNYXAuY3VycmVudFllYXIpO1xuICAgIGlmICh0aW1lU3RvcCAhPT0gJ3ByaW5jaXBhbGl0aWVzJykge1xuICAgICAgaWYgKHByb3BzLnN0YXR1cyA+IDAgJiYgcHJvcHMuc3RhdHVzIDwgNikge1xuICAgICAgICBjb25zdCBsd2RhdGUgPSB0aGlzLl9mb3JtYXREYXRlU3RyKHByb3BzLmx3ZGF0ZSk7XG4gICAgICAgIGNvbnN0IHVwZHRybCA9IHRoaXMuX2Zvcm1hdERhdGVTdHIocHJvcHMudXBkdHJsIHx8IHByb3BzLnVwcGVyZGF0KTtcbiAgICAgICAgaWYgKGx3ZGF0ZSAmJiB1cGR0cmwpIHtcbiAgICAgICAgICBzdHIgKz0gYFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicG9wdXBfX3Byb3BlcnR5LS12YWx1ZSBkYXRlc1wiPlxuICAgICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzaG93LWRhdGVcIj4ke2x3ZGF0ZX08L3NwYW4+IC1cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2hvdy1kYXRlXCI+JHt1cGR0cmx9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICBgO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocHJvcHMuQXJlYSkge1xuICAgICAgICBzdHIgKz0gYFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicG9wdXBfX3Byb3BlcnR5LS12YWx1ZSBhcmVhXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICAke2Zvcm1hdEFyZWEocHJvcHMuQXJlYSAvIDEwMDAwMDApfVxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICBgO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9XG5cbiAgcHJpdmF0ZSBfYWRkUHJvcFNob3dEYXRlQ2xpY2tFdmVudChibG9jazogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCB5ZWFyc0xpbmtzID0gYmxvY2sucXVlcnlTZWxlY3RvckFsbCgnLnNob3ctZGF0ZScpO1xuICAgIGZvciAobGV0IGZyeSA9IDA7IGZyeSA8IHllYXJzTGlua3MubGVuZ3RoOyBmcnkrKykge1xuICAgICAgY29uc3QgbGluayA9IHllYXJzTGlua3NbZnJ5XTtcbiAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHllYXIgPSBmaW5kWWVhckluRGF0ZVN0cihsaW5rLmlubmVySFRNTCk7XG4gICAgICAgIGlmICh5ZWFyKSB7XG4gICAgICAgICAgdGhpcy5hcHAudGltZU1hcC51cGRhdGVCeVllYXIoeWVhcik7XG4gICAgICAgICAgaWYgKHRoaXMuYXBwLnNsaWRlciAmJiB0aGlzLmFwcC5zbGlkZXIuX3NsaWRlcikge1xuICAgICAgICAgICAgdGhpcy5hcHAuc2xpZGVyLl9zbGlkZXIuc2V0KHllYXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgJy4uL2ltZy9jaXR5LnBuZyc7XG5cbmltcG9ydCB7IE1hcCB9IGZyb20gJ21hcGJveC1nbCc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSAnQG5leHRnaXMvdXRpbHMnO1xuXG5pbXBvcnQgeyBBcHAgfSBmcm9tICcuLi9BcHAnO1xuXG5pbXBvcnQgeyBUaW1lTGF5ZXIsIFRpbWVMYXllcnNHcm91cE9wdGlvbnMgfSBmcm9tICcuLi9UaW1lTWFwL1RpbWVHcm91cCc7XG5pbXBvcnQgeyBCYXNlTGF5ZXIgfSBmcm9tICcuL0Jhc2VMYXllcic7XG5cbmV4cG9ydCBjbGFzcyBDaXRpZXNMYXllciBleHRlbmRzIEJhc2VMYXllciB7XG4gIG9sZE5nd012dEFwaSA9IHRydWU7XG4gIGVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHByaXZhdGUgZXZlbnRzOiBFdmVudHM7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGFwcDogQXBwLCBvcHRpb25zOiBQYXJ0aWFsPFRpbWVMYXllcnNHcm91cE9wdGlvbnM+KSB7XG4gICAgc3VwZXIoYXBwLCBvcHRpb25zKTtcbiAgICB0aGlzLmV2ZW50cyA9IG5ldyBFdmVudHModGhpcy5lbWl0dGVyKTtcbiAgICB0aGlzLmFwcC53ZWJNYXAub25Mb2FkKCkudGhlbigoKSA9PiB0aGlzLl9yZWdpc3Rlck1hcGJveEltYWdlcygpKTtcbiAgfVxuXG4gIGFkZExheWVycyh1cmw6IHN0cmluZywgaWQ6IHN0cmluZyk6IFByb21pc2U8VGltZUxheWVyPltdIHtcbiAgICByZXR1cm4gdGhpcy5fY3JlYXRlVGltZUxheWVycyh1cmwsIGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgX3JlZ2lzdGVyTWFwYm94SW1hZ2VzKCkge1xuICAgIGNvbnN0IG1hcDogTWFwIHwgdW5kZWZpbmVkID0gdGhpcy5hcHAud2ViTWFwLm1hcEFkYXB0ZXIubWFwO1xuICAgIGlmIChtYXApIHtcbiAgICAgIG1hcC5sb2FkSW1hZ2UoJ2ltYWdlcy9jaXR5LnBuZycsIChlcjogRXJyb3IsIGltYWdlOiBJbWFnZURhdGEpID0+IHtcbiAgICAgICAgbWFwLmFkZEltYWdlKCdjaXR5JywgaW1hZ2UpO1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnbG9hZC1pbWFnZXMnKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZVRpbWVMYXllcnModXJsOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBQcm9taXNlPFRpbWVMYXllcj5bXSB7XG4gICAgLy8gY29uc3Qgc291cmNlTGF5ZXIgPSAnbmd3OicgKyBpZDtcbiAgICBjb25zdCBzb3VyY2VMYXllciA9IGlkO1xuICAgIGNvbnN0IGxhYmVsID0gdGhpcy5ldmVudHMub25Mb2FkKCdsb2FkLWltYWdlcycpLnRoZW4oKCkgPT4ge1xuICAgICAgY29uc3QgbGF5ZXIgPSB0aGlzLmFwcC53ZWJNYXAuYWRkTGF5ZXIoJ01WVCcsIHtcbiAgICAgICAgdXJsLFxuICAgICAgICBpZCxcbiAgICAgICAgb3JkZXI6IHRoaXMub3JkZXIsXG4gICAgICAgIC8vIG5hbWU6IGlkLFxuICAgICAgICBwYWludDoge1xuICAgICAgICAgICd0ZXh0LWNvbG9yJzogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMSknLFxuICAgICAgICAgICd0ZXh0LWhhbG8tY29sb3InOiAncmdiYSg0OSwgNjcsIDkwLCAuOSknLFxuICAgICAgICAgICd0ZXh0LWhhbG8td2lkdGgnOiAxLFxuICAgICAgICB9LFxuICAgICAgICBsYXlvdXQ6IHtcbiAgICAgICAgICAnaWNvbi1pbWFnZSc6ICdjaXR5JyxcbiAgICAgICAgICAnaWNvbi1hbGxvdy1vdmVybGFwJzogdHJ1ZSxcbiAgICAgICAgICAnaWNvbi1vcHRpb25hbCc6IHRydWUsXG4gICAgICAgICAgJ3RleHQtZmllbGQnOiBbJ3RvLXN0cmluZycsIFsnZ2V0JywgJ3RvcG9ueW0nXV0sXG4gICAgICAgICAgJ3RleHQtYW5jaG9yJzogJ3RvcCcsXG4gICAgICAgICAgJ3RleHQtc2l6ZSc6IDEwLFxuICAgICAgICAgICd0ZXh0LWZvbnQnOiBbJ09wZW4gU2FucyBTZW1pYm9sZCddLFxuICAgICAgICAgICd0ZXh0LXZhcmlhYmxlLWFuY2hvcic6IFsndG9wJ10sXG4gICAgICAgICAgJ3RleHQtcmFkaWFsLW9mZnNldCc6IDAuOTUsXG4gICAgICAgICAgJ3RleHQtbGluZS1oZWlnaHQnOiAxLjEsXG4gICAgICAgICAgJ3RleHQtbGV0dGVyLXNwYWNpbmcnOiAwLjA2LFxuICAgICAgICAgICd0ZXh0LXBhZGRpbmcnOiAwLFxuICAgICAgICAgICd0ZXh0LWp1c3RpZnknOiAnYXV0bycsXG4gICAgICAgIH0sXG4gICAgICAgIHR5cGU6ICdwb2ludCcsXG4gICAgICAgIG5hdGl2ZU9wdGlvbnM6IHsgdHlwZTogJ3N5bWJvbCcgfSxcbiAgICAgICAgbmF0aXZlUGFpbnQ6IHRydWUsXG4gICAgICAgIHNvdXJjZUxheWVyLFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gbGF5ZXIudGhlbigoeCkgPT4ge1xuICAgICAgICByZXR1cm4geDtcbiAgICAgIH0pO1xuICAgIH0pIGFzIFByb21pc2U8VGltZUxheWVyPjtcblxuICAgIHJldHVybiBbXG4gICAgICAvLyBsYXllcixcbiAgICAgIGxhYmVsLFxuICAgIF07XG4gIH1cbn1cbiIsImltcG9ydCB7IExpbmVQYWludCB9IGZyb20gJ21hcGJveC1nbCc7XG5pbXBvcnQgeyBUaW1lTGF5ZXIgfSBmcm9tICcuLi9UaW1lTWFwL1RpbWVHcm91cCc7XG5pbXBvcnQgeyBCYXNlTGF5ZXIgfSBmcm9tICcuL0Jhc2VMYXllcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGluZVR5cGVQYWludCB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGNvbG9yOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBMaW5lc0xheWVyIGV4dGVuZHMgQmFzZUxheWVyIHtcbiAgb2xkTmd3TXZ0QXBpID0gdHJ1ZTtcblxuICAvLyBwcml2YXRlIF9saW5lVHlwZXM6IHsgW2xpbmV0eXBlOiBudW1iZXJdOiBMaW5lVHlwZVBhaW50IH0gPSB7XG4gIC8vICAgMTogeyB3aWR0aDogMi4wNiwgY29sb3I6ICdyZ2JhKDEzMiwgNzMsIDU4LCAxLjAwKScgfSxcbiAgLy8gICAyOiB7IHdpZHRoOiAyLjA2LCBjb2xvcjogJ3JnYmEoMTMyLCA3MywgNTgsIDAuNTApJyB9LFxuICAvLyAgIDM6IHsgd2lkdGg6IDMuMjYsIGNvbG9yOiAncmdiYSgxMzIsIDczLCA1OCwgMC4yNSknIH0sXG4gIC8vIH07XG5cbiAgYWRkTGF5ZXJzKHVybDogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTxUaW1lTGF5ZXI+W10ge1xuICAgIGNvbnN0IG9wYWNpdHkgPSB0aGlzLmdyb3VwTGF5ZXIgPyB0aGlzLmdyb3VwTGF5ZXIub3BhY2l0eSA6IDE7XG5cbiAgICBjb25zdCBwYWludExpbmU6IExpbmVQYWludCA9IHtcbiAgICAgICdsaW5lLW9wYWNpdHknOiBvcGFjaXR5LFxuICAgICAgJ2xpbmUtb3BhY2l0eS10cmFuc2l0aW9uJzoge1xuICAgICAgICBkdXJhdGlvbjogMCxcbiAgICAgIH0sXG4gICAgICAnbGluZS13aWR0aCc6IDIsXG4gICAgICAuLi50aGlzLl9nZXRMaW5lUGFpbnQoKSxcbiAgICB9O1xuICAgIC8vIGNvbnN0IHNvdXJjZUxheWVyID0gJ25ndzonICsgaWQ7XG4gICAgY29uc3Qgc291cmNlTGF5ZXIgPSBpZDtcblxuICAgIGNvbnN0IGJvdW5kTGF5ZXIgPSB0aGlzLmFwcC53ZWJNYXAuYWRkTGF5ZXIoJ01WVCcsIHtcbiAgICAgIHVybCxcbiAgICAgIGlkLFxuICAgICAgb3JkZXI6IHRoaXMub3JkZXIsXG4gICAgICBwYWludDogcGFpbnRMaW5lLFxuICAgICAgdHlwZTogJ2xpbmUnLFxuICAgICAgc291cmNlTGF5ZXIsXG4gICAgICBuYXRpdmVQYWludDogdHJ1ZSxcbiAgICAgIHZpc2liaWxpdHk6IHRydWUsXG4gICAgICAvLyBvcmRlcjogdGhpcy5uYW1lID09PSAnZWFybCcgPyAzIDogMlxuICAgIH0pIGFzIFByb21pc2U8VGltZUxheWVyPjtcbiAgICByZXR1cm4gW2JvdW5kTGF5ZXJdO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0TGluZVR5cGVzKCkge1xuICAgIGNvbnN0IGxpbmVUeXBlczogeyBbbGluZXR5cGU6IG51bWJlcl06IExpbmVUeXBlUGFpbnQgfSA9IHt9O1xuICAgIGNvbnN0IHsgbGluZUNvbG9yTGVnZW5kIH0gPSB0aGlzLmFwcC5vcHRpb25zO1xuICAgIGNvbnN0IGxlZ2VuZCA9IGxpbmVDb2xvckxlZ2VuZCAmJiBsaW5lQ29sb3JMZWdlbmRbJ2xpbmVzJ107XG4gICAgaWYgKGxlZ2VuZCAmJiBsZWdlbmQpIHtcbiAgICAgIGxlZ2VuZC5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICAgIGNvbnN0IGxpbmtzVG9MaW5lQ29sb3JzID0geFszXTtcbiAgICAgICAgbGlua3NUb0xpbmVDb2xvcnMuZm9yRWFjaCgoeSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHBhaW50ID0geFsxXTtcbiAgICAgICAgICBjb25zdCBzdGF0dXMgPSB4WzNdO1xuICAgICAgICAgIHN0YXR1cy5mb3JFYWNoKCh6KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IHR5cGVvZiBwYWludCA9PT0gJ3N0cmluZycgPyBwYWludCA6IHBhaW50LmNvbG9yO1xuICAgICAgICAgICAgY29uc3Qgd2lkdGggPSAodHlwZW9mIHBhaW50ICE9PSAnc3RyaW5nJyAmJiBwYWludC53aWR0aCkgfHwgMTtcbiAgICAgICAgICAgIGxpbmVUeXBlc1tOdW1iZXIoeildID0geyBjb2xvciwgd2lkdGggfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGxpbmVUeXBlcztcbiAgfVxuXG4gIHByaXZhdGUgX2dldExpbmVQYWludCgpOiBMaW5lUGFpbnQge1xuICAgIGNvbnN0IGNvbG9yOiBMaW5lUGFpbnRbJ2xpbmUtY29sb3InXSA9IFsnbWF0Y2gnLCBbJ2dldCcsICdsaW5ldHlwZSddXTtcbiAgICBjb25zdCBsaW5lVHlwZXMgPSB0aGlzLl9nZXRMaW5lVHlwZXMoKTtcbiAgICBPYmplY3QuZW50cmllcyhsaW5lVHlwZXMpLmZvckVhY2goKFtsaW5ldHlwZSwgdmFsdWVdKSA9PiB7XG4gICAgICBjb2xvci5wdXNoKE51bWJlcihsaW5ldHlwZSkpO1xuICAgICAgY29sb3IucHVzaCh2YWx1ZS5jb2xvcik7XG4gICAgfSk7XG4gICAgLy8gZGVmYXVsdFxuICAgIGNvbG9yLnB1c2goJyMwMDAwMDAnKTtcbiAgICByZXR1cm4geyAnbGluZS1jb2xvcic6IGNvbG9yIH07XG4gIH1cbn1cbiIsImltcG9ydCBwcm9qNCBmcm9tICdwcm9qNCc7XG5pbXBvcnQgeyBGZWF0dXJlLCBNdWx0aVBvaW50LCBQb2ludCB9IGZyb20gJ2dlb2pzb24nO1xuaW1wb3J0IHsgTWFwLCBNYXJrZXIgfSBmcm9tICdtYXBib3gtZ2wnO1xuaW1wb3J0IHsgYXJyYXlVbmlxdWUgfSBmcm9tICdAbmV4dGdpcy91dGlscyc7XG5cbmltcG9ydCB7IEFwcCB9IGZyb20gJy4uL0FwcCc7XG5pbXBvcnQge1xuICBBcHBNYXJrZXJNZW0sXG4gIFBvaW50UHJvcGVydGllcyxcbiAgUG9pbnRNZXRhLFxuICBIaXN0b3J5TGF5ZXJSZXNvdXJjZSxcbn0gZnJvbSAnLi4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBnZXRQb2ludEdlb2pzb24gfSBmcm9tICcuLi9zZXJ2aWNlcy9HZXRQb2ludHNTZXJ2aWNlJztcblxuZXhwb3J0IGNsYXNzIE1hcmtlckxheWVyIHtcbiAgbmFtZSE6IHN0cmluZztcbiAgYmFzZVVybCE6IHN0cmluZztcbiAgbWFudWFsT3BhY2l0eT86IGJvb2xlYW47XG4gIGZpbHRlcklkRmllbGQ/OiBzdHJpbmc7XG4gIG9wYWNpdHkgPSAxO1xuICBzaW1wbGlmaWNhdGlvbiA9IDg7XG5cbiAgcHJpdmF0ZSBjdXJyZW50UG9pbnRJZD86IHN0cmluZztcbiAgcHJpdmF0ZSBfbWFya2VyczogQXBwTWFya2VyTWVtW10gPSBbXTtcbiAgcHJpdmF0ZSBfcG9pbnRzQ29uZmlnOiBQb2ludE1ldGFbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhcHA6IEFwcCkge31cblxuICBzZXRQb2ludHMocG9pbnRzOiBIaXN0b3J5TGF5ZXJSZXNvdXJjZVtdKTogdm9pZCB7XG4gICAgdGhpcy5fcG9pbnRzQ29uZmlnID0gdGhpcy5fcHJvY2Vzc1BvaW50c01ldGEocG9pbnRzKTtcbiAgICBjb25zdCBwb2ludElkID0gdGhpcy5fZ2V0UG9pbnRJZEJ5WWVhcih0aGlzLmFwcC50aW1lTWFwLmN1cnJlbnRZZWFyKTtcbiAgICBpZiAocG9pbnRJZCkge1xuICAgICAgdGhpcy51cGRhdGVQb2ludChwb2ludElkKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmUoKTogdm9pZCB7XG4gICAgdGhpcy5fbWFya2Vycy5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICB4Lm1hcmtlci5yZW1vdmUoKTtcbiAgICB9KTtcbiAgICB0aGlzLl9tYXJrZXJzID0gW107XG4gIH1cblxuICB1cGRhdGVQb2ludChwb2ludElkPzogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHBvaW50SWQgIT09IHRoaXMuY3VycmVudFBvaW50SWQpIHtcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRQb2ludElkKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgICB0aGlzLmN1cnJlbnRQb2ludElkID0gcG9pbnRJZDtcbiAgICAgIGlmIChwb2ludElkKSB7XG4gICAgICAgIHRoaXMuX2FkZFBvaW50KHBvaW50SWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUFjdGl2ZU1hcmtlcih5ZWFyc1N0YXQ6IHsgeWVhcjogbnVtYmVyOyBudW1iOiBudW1iZXIgfSk6IHZvaWQge1xuICAgIGlmICh5ZWFyc1N0YXQpIHtcbiAgICAgIHRoaXMuX21hcmtlcnMuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgeC5wcm9wZXJ0aWVzLnllYXIgPT09IHllYXJzU3RhdC55ZWFyICYmXG4gICAgICAgICAgeC5wcm9wZXJ0aWVzLm51bWIgPT09IHllYXJzU3RhdC5udW1iXG4gICAgICAgICkge1xuICAgICAgICAgIHguZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB4LmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRQb2ludElkQnlZZWFyKHllYXI6IG51bWJlcik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgcG9pbnQgPSB0aGlzLl9nZXRQb2ludEJ5WWVhcih5ZWFyKTtcbiAgICBpZiAocG9pbnQpIHtcbiAgICAgIHJldHVybiBwb2ludCAmJiBTdHJpbmcocG9pbnQuaWQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2FkZFBvaW50KGlkOiBzdHJpbmcpIHtcbiAgICBnZXRQb2ludEdlb2pzb24oaWQpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgIGNvbnN0IF9tYW55ID1cbiAgICAgICAgZGF0YS5mZWF0dXJlcy5sZW5ndGggPiAxICYmXG4gICAgICAgIGFycmF5VW5pcXVlKGRhdGEuZmVhdHVyZXMubWFwKCh4KSA9PiB4LnByb3BlcnRpZXMubnVtYikpO1xuICAgICAgY29uc3QgbWFueSA9IF9tYW55ICYmIF9tYW55Lmxlbmd0aCA+IDE7XG4gICAgICBkYXRhLmZlYXR1cmVzLmZvckVhY2goXG4gICAgICAgIChtYXJrZXI6IEZlYXR1cmU8UG9pbnQgfCBNdWx0aVBvaW50LCBQb2ludFByb3BlcnRpZXM+LCBpKSA9PiB7XG4gICAgICAgICAgY29uc3QgdHlwZSA9IG1hcmtlciAmJiBtYXJrZXIuZ2VvbWV0cnkgJiYgbWFya2VyLmdlb21ldHJ5LnR5cGU7XG4gICAgICAgICAgaWYgKHR5cGUgPT09ICdNdWx0aVBvaW50Jykge1xuICAgICAgICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSBtYXJrZXIuZ2VvbWV0cnkuY29vcmRpbmF0ZXMgYXMgW1xuICAgICAgICAgICAgICBudW1iZXIsXG4gICAgICAgICAgICAgIG51bWJlclxuICAgICAgICAgICAgXVtdO1xuICAgICAgICAgICAgY29vcmRpbmF0ZXMuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9hZGRNYXJrZXJUb01hcCh4LCBtYXJrZXIucHJvcGVydGllcywgbWFueSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdQb2ludCcpIHtcbiAgICAgICAgICAgIHRoaXMuX2FkZE1hcmtlclRvTWFwKFxuICAgICAgICAgICAgICBtYXJrZXIuZ2VvbWV0cnkuY29vcmRpbmF0ZXMgYXMgW251bWJlciwgbnVtYmVyXSxcbiAgICAgICAgICAgICAgbWFya2VyLnByb3BlcnRpZXMsXG4gICAgICAgICAgICAgIG1hbnlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gVE9ETzogTWFwYm94Z2wgc3BlY2lmaWMgbWV0aG9kXG4gIHByaXZhdGUgX2FkZE1hcmtlclRvTWFwKFxuICAgIGNvb3JkaW5hdGVzOiBbbnVtYmVyLCBudW1iZXJdLFxuICAgIHByb3BlcnRpZXM6IFBvaW50UHJvcGVydGllcyxcbiAgICBtYW55OiBib29sZWFuXG4gICkge1xuICAgIGNvbnN0IG1hcDogTWFwIHwgdW5kZWZpbmVkID0gdGhpcy5hcHAud2ViTWFwLm1hcEFkYXB0ZXIubWFwO1xuICAgIGlmIChtYXApIHtcbiAgICAgIC8vIGNyZWF0ZSBhIERPTSBlbGVtZW50IGZvciB0aGUgbWFya2VyXG4gICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBsZXQgaXNBY3RpdmU7XG4gICAgICBpZiAodGhpcy5hcHAuY29udHJvbHMueWVhcnNTdGF0UGFuZWxDb250cm9sKSB7XG4gICAgICAgIGNvbnN0IHllYXJTdGF0ID0gdGhpcy5hcHAuY29udHJvbHMueWVhcnNTdGF0UGFuZWxDb250cm9sLnllYXJTdGF0O1xuICAgICAgICBpc0FjdGl2ZSA9XG4gICAgICAgICAgeWVhclN0YXQgJiZcbiAgICAgICAgICB5ZWFyU3RhdC55ZWFyID09PSBwcm9wZXJ0aWVzLnllYXIgJiZcbiAgICAgICAgICB5ZWFyU3RhdC5udW1iID09PSBwcm9wZXJ0aWVzLm51bWI7XG4gICAgICB9XG5cbiAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gJ21hcC1tYXJrZXInICsgKGlzQWN0aXZlID8gJyBhY3RpdmUnIDogJycpOyAvLyB1c2UgY2xhc3MgYGHRgXRpdmVgIGZvciBzZWxlY3RlZFxuXG4gICAgICBjb25zdCBlbElubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBlbElubmVyLmNsYXNzTmFtZSA9ICdtYXAtbWFya2VyLS1pbm5lcic7XG4gICAgICBlbElubmVyLmlubmVySFRNTCA9IG1hbnlcbiAgICAgICAgPyBgPGRpdiBjbGFzcz1cIm1hcC1tYXJrZXJfX2xhYmVsXCI+JHtwcm9wZXJ0aWVzLm51bWJ9PC9kaXY+YFxuICAgICAgICA6ICcnO1xuXG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGVsSW5uZXIpO1xuXG4gICAgICBjb25zdCBjb29yZEVQU0c0MzI2ID0gcHJvajQoJ0VQU0c6Mzg1NycpLmludmVyc2UoY29vcmRpbmF0ZXMpO1xuICAgICAgLy8gYWRkIG1hcmtlciB0byBtYXBcbiAgICAgIGNvbnN0IG1hcmtlciA9IG5ldyBNYXJrZXIoZWxlbWVudCk7XG4gICAgICBjb25zdCBtYXJrZXJNZW0gPSB7IG1hcmtlciwgZWxlbWVudCwgcHJvcGVydGllcyB9O1xuICAgICAgdGhpcy5fbWFya2Vycy5wdXNoKG1hcmtlck1lbSk7XG4gICAgICBtYXJrZXIuc2V0TG5nTGF0KGNvb3JkRVBTRzQzMjYpO1xuXG4gICAgICBtYXJrZXIuYWRkVG8obWFwKTtcblxuICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdGhpcy5fc2V0TWFya2VyQWN0aXZlKG1hcmtlck1lbSwgcHJvcGVydGllcyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9zZXRNYXJrZXJBY3RpdmUoXG4gICAgbWFya2VyTWVtOiBBcHBNYXJrZXJNZW0sXG4gICAgcHJvcGVydGllczogUG9pbnRQcm9wZXJ0aWVzXG4gICkge1xuICAgIGNvbnN0IHllYXJDb250cm9sID0gdGhpcy5hcHAuY29udHJvbHMueWVhcnNTdGF0UGFuZWxDb250cm9sO1xuICAgIGlmICh5ZWFyQ29udHJvbCAmJiB5ZWFyQ29udHJvbC55ZWFyU3RhdHMpIHtcbiAgICAgIGNvbnN0IHllYXJTdGF0ID0geWVhckNvbnRyb2wueWVhclN0YXRzLmZpbmQoKHgpID0+IHtcbiAgICAgICAgcmV0dXJuIHgueWVhciA9PT0gcHJvcGVydGllcy55ZWFyICYmIHgubnVtYiA9PT0gcHJvcGVydGllcy5udW1iO1xuICAgICAgfSk7XG4gICAgICBpZiAoeWVhclN0YXQpIHtcbiAgICAgICAgeWVhckNvbnRyb2wudXBkYXRlWWVhclN0YXQoeWVhclN0YXQpO1xuICAgICAgICB5ZWFyQ29udHJvbC51bkJsb2NrKCk7XG4gICAgICAgIHllYXJDb250cm9sLnNob3coKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9nZXRQb2ludEJ5WWVhcih5ZWFyOiBudW1iZXIpOiBQb2ludE1ldGEgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9wb2ludHNDb25maWcuZmluZCgoeCkgPT4geC55ZWFyID09PSB5ZWFyKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Byb2Nlc3NQb2ludHNNZXRhKHBvaW50c01ldGE6IEhpc3RvcnlMYXllclJlc291cmNlW10pOiBQb2ludE1ldGFbXSB7XG4gICAgcmV0dXJuIHBvaW50c01ldGEubWFwKCh7IHJlc291cmNlIH0pID0+IHtcbiAgICAgIGNvbnN0IG5hbWUgPSByZXNvdXJjZS5kaXNwbGF5X25hbWU7XG4gICAgICAvLyBjb25zdCBbeWVhciwgbW9udGgsIGRheV0gPSBuYW1lLm1hdGNoKCcoXFxcXGR7NH0pLShcXFxcZHsyfSktKFxcXFxkezJ9KSokJykuc2xpY2UoMSkubWFwKCh4KSA9PiBOdW1iZXIoeCkpO1xuICAgICAgLy8gcmV0dXJuIHsgbmFtZSwgeWVhciwgbW9udGgsIGRheSwgaWQ6IHJlc291cmNlLmlkIH07XG4gICAgICBjb25zdCBfbWF0Y2ggPSBuYW1lLm1hdGNoKCcoXFxcXGR7NH0pKiQnKSBhcyBzdHJpbmdbXTtcbiAgICAgIGNvbnN0IFt5ZWFyXSA9IF9tYXRjaC5zbGljZSgxKS5tYXAoKHgpID0+IE51bWJlcih4KSk7XG4gICAgICByZXR1cm4geyBuYW1lLCB5ZWFyOiB5ZWFyIGFzIG51bWJlciwgaWQ6IHJlc291cmNlLmlkIH07XG4gICAgfSk7XG4gIH1cbn1cbiIsIi8vIGltcG9ydCAncmVzZXQtY3NzJztcbmltcG9ydCAnbWFwYm94LWdsL2Rpc3QvbWFwYm94LWdsLmNzcyc7XG4vLyBwb2x5ZmlsbHNcbmltcG9ydCAnY29yZS1qcy9zdGFibGUnO1xuaW1wb3J0ICdyZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUnO1xuXG5pbXBvcnQgeyBkZWZpbmVkIH0gZnJvbSAnQG5leHRnaXMvdXRpbHMnO1xuaW1wb3J0IHsgQXBwIH0gZnJvbSAnLi9BcHAnO1xuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcuanNvbic7XG5pbXBvcnQgeyB2ZXJzaW9uIH0gZnJvbSAnLi4vcGFja2FnZS5qc29uJztcbi8vIEB0cy1pZ25vcmVcbmltcG9ydCBwZXJpb2RzIGZyb20gJy4vZGF0YS9wZXJpb2RzLmNzdic7XG4vLyBAdHMtaWdub3JlXG5pbXBvcnQgeWVhcnNTdGF0IGZyb20gJy4vZGF0YS95ZWFyc19zdGF0LmNzdic7XG4vLyBAdHMtaWdub3JlXG5pbXBvcnQgYXJlYVN0YXQgZnJvbSAnLi9kYXRhL2FyZWFfc3RhdC5jc3YnO1xuLy8gQHRzLWlnbm9yZVxuaW1wb3J0IHByaW5jaXBhbGl0aWVzMDEgZnJvbSAnLi9kYXRhL3ByaW5jaXBhbGl0aWVzXzAxLmNzdic7XG4vLyBAdHMtaWdub3JlXG5pbXBvcnQgcHJpbmNpcGFsaXRpZXMwMiBmcm9tICcuL2RhdGEvcHJpbmNpcGFsaXRpZXNfMDIuY3N2JztcblxuaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnO1xuaW1wb3J0IHsgWWVhclN0YXQgfSBmcm9tICcuL2NvbXBvbmVudHMvUGFuZWxzL1llYXJzU3RhdFBhbmVsQ29udHJvbCc7XG5cbmZ1bmN0aW9uIHByZXBhcmVZZWFyU3RhdCgpOiBZZWFyU3RhdFtdIHtcbiAgY29uc3QgY2FjaGVCeVllYXI6IHsgW3llYXI6IHN0cmluZ106IFllYXJTdGF0W10gfSA9IHt9O1xuICAoeWVhcnNTdGF0IGFzIFllYXJTdGF0W10pLmZvckVhY2goKHMpID0+IHtcbiAgICBjYWNoZUJ5WWVhcltzLnllYXJdID0gY2FjaGVCeVllYXJbcy55ZWFyXSB8fCBbXTtcbiAgICBjYWNoZUJ5WWVhcltzLnllYXJdLnB1c2gocyk7XG4gIH0pO1xuICBmb3IgKGNvbnN0IHMgaW4gY2FjaGVCeVllYXIpIHtcbiAgICBjb25zdCBzdGF0ID0gY2FjaGVCeVllYXJbc107XG4gICAgaWYgKHN0YXQubGVuZ3RoID4gMSkge1xuICAgICAgc3RhdC5mb3JFYWNoKCh4LCBpKSA9PiB7XG4gICAgICAgIGlmICghZGVmaW5lZCh4LmNvdW50KSkge1xuICAgICAgICAgIHgubnVtYiA9IGkgKyAxO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHllYXJzU3RhdDtcbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gIGJhc2VVcmw6IGNvbmZpZy5iYXNlVXJsLFxuICB0YXJnZXQ6ICdtYXAnLFxuICBmcm9tWWVhcjogODUwLFxuICB0aW1lU3RvcHM6IFt7IHRvWWVhcjogMTQ2MiwgbmFtZTogJ3ByaW5jaXBhbGl0aWVzJyB9XSxcbiAgY3VycmVudFllYXI6IDE0NjIsXG4gIGFuaW1hdGlvbkRlbGF5OiAxMDAsXG4gIGFuaW1hdGlvblN0ZXA6IDEsXG4gIGJvdW5kczogWzIsIDI3LCAyMDMsIDgyXSxcbiAgbWluWm9vbTogMyxcbiAgcGVyaW9kcyxcbiAgeWVhcnNTdGF0OiBwcmVwYXJlWWVhclN0YXQoKSxcbiAgYXJlYVN0YXQsXG4gIHByaW5jaXBhbGl0aWVzMDEsXG4gIHByaW5jaXBhbGl0aWVzMDIsXG4gIHZlcnNpb246IHZlcnNpb24sXG4gIC8vIEB0cy1pZ25vcmVcbiAgbGluZUNvbG9yOiBjb25maWcubGluZUNvbG9yLFxuICAvLyBAdHMtaWdub3JlXG4gIGxpbmVDb2xvckxlZ2VuZDogY29uZmlnLmxpbmVDb2xvckxlZ2VuZCxcbiAgLy8gc3RhdHVzQWxpYXNlczogY29uZmlnLnN0YXR1c0FsaWFzZXMsXG59KTtcblxuLy8gcmVtb3ZlIGZpcnN0IGFuZCBsYXN0IHNsaWRlciBwaXBzXG5hcHAuZW1pdHRlci5vbignYnVpbGQnLCAoKSA9PiB7XG4gIGNvbnN0IHBpcHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdub1VpLW1hcmtlci1sYXJnZScpO1xuICBpZiAocGlwcy5sZW5ndGgpIHtcbiAgICBjb25zdCBmaXJzdExhc3QgPSBbcGlwc1swXSwgcGlwc1twaXBzLmxlbmd0aCAtIDFdXSBhcyBIVE1MRWxlbWVudFtdO1xuICAgIGZpcnN0TGFzdC5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICB4LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfSk7XG4gIH1cbn0pO1xuXG4vLyBmb3IgdGVzdGluZyBhbmQgZGVidWdcbi8vIEB0cy1pZ25vcmVcbndpbmRvdy5hcHAgPSBhcHA7XG4vLyBAdHMtaWdub3JlXG53aW5kb3cudmVyc2lvbiA9IHZlcnNpb247XG4iLCJpbXBvcnQgbGF5ZXJzIGZyb20gJy4uL2RhdGEvbGF5ZXJzLmpzb24nO1xuaW1wb3J0IHsgTGF5ZXJzR3JvdXAgfSBmcm9tICcuLi9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldExheWVycyhjYWxsYmFjazogKGxheWVyczogTGF5ZXJzR3JvdXBbXSkgPT4gdm9pZCk6IHZvaWQge1xuICBpZiAobGF5ZXJzKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjYWxsYmFjayhsYXllcnMgYXMgTGF5ZXJzR3JvdXBbXSk7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENhbmNlbGFibGVQcm9taXNlLCBSZXNvdXJjZUl0ZW0gfSBmcm9tICdAbmV4dGdpcy9uZ3ctY29ubmVjdG9yJztcbmltcG9ydCB7IGNvbm5lY3RvciB9IGZyb20gJy4vTmd3Q29ubmVjdG9yU2VydmljZSc7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4uLy4uL2NvbmZpZy5qc29uJztcbmltcG9ydCB7IEZlYXR1cmVDb2xsZWN0aW9uLCBNdWx0aVBvaW50IH0gZnJvbSAnZ2VvanNvbic7XG5pbXBvcnQgeyBQb2ludFByb3BlcnRpZXMgfSBmcm9tICdzcmMvaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQb2ludHMoKTogQ2FuY2VsYWJsZVByb21pc2U8UmVzb3VyY2VJdGVtW10+IHtcbiAgLy8gaWYgKHBvaW50cykge1xuICAvLyBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtjYWxsYmFjayhwb2ludHMpfSk7XG4gIC8vIH0gZWxzZSB7XG4gIHJldHVybiBjb25uZWN0b3IubWFrZVF1ZXJ5KFxuICAgICcvYXBpL3Jlc291cmNlLz9wYXJlbnQ9e2lkfScsXG4gICAge1xuICAgICAgaWQ6IGNvbmZpZy5wb2ludHNHcm91cElkLFxuICAgIH0sXG4gICAge31cbiAgKTtcbiAgLy8gfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UG9pbnRHZW9qc29uKFxuICBpZDogc3RyaW5nXG4pOiBDYW5jZWxhYmxlUHJvbWlzZTxGZWF0dXJlQ29sbGVjdGlvbjxNdWx0aVBvaW50LCBQb2ludFByb3BlcnRpZXM+PiB7XG4gIHJldHVybiBjb25uZWN0b3IubWFrZVF1ZXJ5KFxuICAgICcvYXBpL3Jlc291cmNlL3tpZH0vZ2VvanNvbicsXG4gICAge1xuICAgICAgaWQsXG4gICAgfSxcbiAgICB7fVxuICApO1xufVxuIiwiaW1wb3J0IE5nd0Nvbm5lY3RvciBmcm9tICdAbmV4dGdpcy9uZ3ctY29ubmVjdG9yJztcbi8vIEB0cy1pZ25vcmVcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vLi4vY29uZmlnLmpzb24nO1xuXG5jb25zdCBuZ3dVcmwgPSBjb25maWcuYmFzZVVybDtcblxuY29uc3QgY29ubmVjdG9yID0gbmV3IE5nd0Nvbm5lY3Rvcih7XG4gIGJhc2VVcmw6IG5nd1VybCxcbn0pO1xuXG5leHBvcnQgeyBjb25uZWN0b3IgfTtcbiIsImltcG9ydCBVcmxQYXJhbXMgZnJvbSAnQG5leHRnaXMvdXJsLXJ1bnRpbWUtcGFyYW1zJztcblxuZXhwb3J0IGNvbnN0IHVybFBhcmFtcyA9IG5ldyBVcmxQYXJhbXMoKTtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZpbmRZZWFySW5EYXRlU3RyKGRhdGVTdHI6IHN0cmluZyk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IGRhdGVQYXR0ZXJuID0gLyhcXGR7NH0pLztcbiAgY29uc3QgZGF0ZSA9IGRhdGVQYXR0ZXJuLmV4ZWMoZGF0ZVN0cik7XG4gIGlmIChkYXRlKSB7XG4gICAgcmV0dXJuIE51bWJlcihkYXRlWzBdKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgbnVtYmVyV2l0aFNwYWNlcywgQ2xpcGJvYXJkIH0gZnJvbSAnQG5leHRnaXMvdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0QXJlYShhcmVhOiBudW1iZXIpOiBzdHJpbmcge1xuICByZXR1cm4gYCR7bnVtYmVyV2l0aFNwYWNlcyhNYXRoLnJvdW5kKGFyZWEpKX0g0LrQvMKyYDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvcHlUZXh0KHRleHQ6IHN0cmluZyk6IHZvaWQge1xuICBDbGlwYm9hcmQuY29weSh0ZXh0KTtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=