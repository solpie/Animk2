/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var AppInfo_1 = __webpack_require__(1);
	__webpack_require__(25);
	__webpack_require__(28);
	var const_1 = __webpack_require__(5);
	var Animk_1 = __webpack_require__(30);
	var main = function () {
	    var renderer = PIXI.autoDetectRenderer(const_1.ViewConst.STAGE_WIDTH, const_1.ViewConst.STAGE_HEIGHT, { antialias: false, transparent: true, resolution: 1 });
	    document.body.insertBefore(renderer.view, document.getElementById("paintCanvas"));
	    renderer.stage = new PIXI.Container();
	    renderer.backgroundColor = 0x00000000;
	    renderer.renderStage = function (time) {
	        requestAnimationFrame(renderer.renderStage);
	        TWEEN.update(time);
	        renderer.render(renderer.stage);
	    };
	    renderer.renderStage();
	    return renderer.stage;
	};
	Animk_1.animk.init(main(), AppInfo_1.appInfo);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var TheMachine_1 = __webpack_require__(2);
	var SettingInfo_1 = __webpack_require__(17);
	var JsFunc_1 = __webpack_require__(4);
	var ProjectInfo_1 = __webpack_require__(18);
	var EventDispatcher_1 = __webpack_require__(7);
	var AppData = (function () {
	    function AppData() {
	        this.winWidth = 1660;
	        this.winHeight = 1024;
	    }
	    return AppData;
	}());
	var AppInfo = (function (_super) {
	    __extends(AppInfo, _super);
	    function AppInfo() {
	        var _this = _super.call(this) || this;
	        _this.appData = new AppData();
	        _this.tm = new TheMachine_1.TheMachine();
	        _this.settingInfo = new SettingInfo_1.SettingInfo();
	        return _this;
	    }
	    AppInfo.prototype.width = function (v) {
	        return JsFunc_1.prop(this.appData, "winWidth", v);
	    };
	    AppInfo.prototype.height = function (v) {
	        return JsFunc_1.prop(this.appData, "winHeight", v);
	    };
	    AppInfo.prototype.newProject = function () {
	        this.projectInfo = new ProjectInfo_1.ProjectInfo();
	        this.emit(ProjectInfo_1.ProjectInfoEvent.NEW_PROJ);
	        this.projectInfo.newComp(1280, 720, 24);
	        this.projectInfo.curComp.setCursor(1);
	        return this.projectInfo;
	    };
	    AppInfo.prototype.openProject = function (path) {
	        this.projectInfo = new ProjectInfo_1.ProjectInfo();
	        this.emit(ProjectInfo_1.ProjectInfoEvent.NEW_PROJ);
	        this.projectInfo.open(path);
	    };
	    AppInfo.prototype.frameWidth = function () {
	        return this.projectInfo.curComp.frameWidth;
	    };
	    AppInfo.prototype.curComp = function () {
	        return this.projectInfo.curComp;
	    };
	    return AppInfo;
	}(EventDispatcher_1.EventDispatcher));
	exports.AppInfo = AppInfo;
	exports.appInfo = new AppInfo();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var AppInfo_1 = __webpack_require__(1);
	var TrackInfo_1 = __webpack_require__(3);
	var const_1 = __webpack_require__(5);
	var EventDispatcher_1 = __webpack_require__(7);
	var ImageLayerInfo_1 = __webpack_require__(8);
	var POI_1 = __webpack_require__(14);
	var exec = __webpack_require__(15).exec;
	var TheMachine = (function (_super) {
	    __extends(TheMachine, _super);
	    function TheMachine() {
	        var _this = _super.call(this) || this;
	        _this._updateCount = 0;
	        _this.watchPOIArr = [];
	        _this._onWatchArr = {};
	        return _this;
	    }
	    TheMachine.prototype.updateWatchArr = function () {
	        this._updateCount++;
	        for (var i = 0; i < this.watchPOIArr.length; i++) {
	            var poi = this.watchPOIArr[i];
	            poi.psd2png();
	        }
	        AppInfo_1.appInfo.emit(const_1.TheMachineEvent.UPDATE_IMG);
	    };
	    TheMachine.prototype._buildLayerArr = function () {
	        var trackInfoArr = AppInfo_1.appInfo.curComp().getCompTrackInfoArr();
	        var watchArr = [];
	        for (var i = trackInfoArr.length - 1; i > -1; i--) {
	            var trackInfo = trackInfoArr[i];
	            if (trackInfo.actType() != TrackInfo_1.ImageTrackActType.NOEDIT) {
	            }
	        }
	        return watchArr;
	    };
	    TheMachine.prototype.watchTrack = function (trackInfo) {
	        var _this = this;
	        trackInfo.on(const_1.TrackInfoEvent.SET_TRACK_START, function (trackInfo) {
	            _this._rebuild();
	        });
	        trackInfo.on(const_1.TrackInfoEvent.SET_ACT_TYPE, function (trackInfo) {
	            _this._rebuild();
	        });
	        trackInfo.on(const_1.TrackInfoEvent.SET_ENABLE, function (trackInfo) {
	            _this._rebuild();
	        });
	    };
	    TheMachine.prototype._rebuild = function () {
	        for (var i = 0; i < this.watchPOIArr.length; i++) {
	            var poi = this.watchPOIArr[i];
	            console.log(this, "_rebuild", poi.filename);
	            poi.isBeingWatched = false;
	        }
	        this.watchPOIArr.length = 0;
	    };
	    TheMachine.prototype._isExistPOI = function () {
	        var basename = this._getCurFrameBaseName();
	        for (var i = 0; i < this.watchPOIArr.length; i++) {
	            var poi = this.watchPOIArr[i];
	            if (poi.basename == basename) {
	                return poi;
	            }
	        }
	        return null;
	    };
	    TheMachine.prototype._getCurFrameBaseName = function () {
	        return AppInfo_1.appInfo.curComp().name() + "frame" + AppInfo_1.appInfo.curComp().getCursor() + ".psd";
	    };
	    TheMachine.prototype.watchCurFrame = function () {
	        var _this = this;
	        var existPOI = this._isExistPOI();
	        if (existPOI) {
	            console.log(this, "cur frame exist");
	            this.open(existPOI.filename);
	            return;
	        }
	        var arrayImageLayerInfo = this._buildLayerArr();
	        if (arrayImageLayerInfo.length) {
	            var path1 = __webpack_require__(16);
	            var poi = new POI_1.POI();
	            var basename = this._getCurFrameBaseName();
	            poi.basename = basename;
	            poi.filename = path1.join(AppInfo_1.appInfo.settingInfo.tmpPath(), basename);
	            this.watchPOIArr.push(poi);
	            var parsingCount = 0;
	            var onParsed = function () {
	                parsingCount++;
	                if (parsingCount < arrayImageLayerInfo.length)
	                    arrayImageLayerInfo[parsingCount].load(onParsed);
	                else {
	                    console.log(_this, "new poi");
	                    ImageLayerInfo_1.ImageLayerInfo.png2psd(arrayImageLayerInfo, AppInfo_1.appInfo.projectInfo.curComp.width, AppInfo_1.appInfo.projectInfo.curComp.height, "rgba", poi.filename, function (p) {
	                        _this.open(p);
	                        _this.watchPOI(poi);
	                    });
	                }
	            };
	            poi.imageLayerInfoArr = arrayImageLayerInfo;
	            arrayImageLayerInfo[0].load(onParsed);
	        }
	    };
	    TheMachine.prototype.onPOIchange = function (path) {
	        for (var i = 0; i < this.watchPOIArr.length; i++) {
	            var poi = this.watchPOIArr[i];
	            if (poi.isBeingWatched && poi.basename == path) {
	                this._updateCount++;
	                poi.psd2png();
	            }
	        }
	        console.log(this, "onPOIchange", path);
	    };
	    TheMachine.prototype.watchPOI = function (poi) {
	        var _this = this;
	        var path = poi.filename;
	        poi.isBeingWatched = true;
	        console.log(this, "watchPOI", path);
	        if (!this._onWatchArr[path]) {
	            fs.watch(path, function (event, filename) {
	                console.log('event is: ' + event);
	                if (filename) {
	                    console.log('filename provided: ' + filename);
	                    if (event == "change") {
	                        _this.onPOIchange(filename);
	                    }
	                }
	                else {
	                    console.log('filename not provided');
	                }
	            });
	            this._onWatchArr[path] = true;
	        }
	    };
	    TheMachine.prototype.open = function (path) {
	    };
	    return TheMachine;
	}(EventDispatcher_1.EventDispatcher));
	exports.TheMachine = TheMachine;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var JsFunc_1 = __webpack_require__(4);
	var const_1 = __webpack_require__(5);
	var FrameInfo_1 = __webpack_require__(6);
	var EventDispatcher_1 = __webpack_require__(7);
	var TrackLoopType;
	(function (TrackLoopType) {
	    TrackLoopType[TrackLoopType["NONE"] = 0] = "NONE";
	    TrackLoopType[TrackLoopType["HOLD"] = 1] = "HOLD";
	    TrackLoopType[TrackLoopType["REPEAT"] = 2] = "REPEAT";
	})(TrackLoopType = exports.TrackLoopType || (exports.TrackLoopType = {}));
	var TrackType;
	(function (TrackType) {
	    TrackType[TrackType["IMAGE"] = 1] = "IMAGE";
	    TrackType[TrackType["COMP"] = 2] = "COMP";
	    TrackType[TrackType["AUDIO"] = 3] = "AUDIO";
	})(TrackType = exports.TrackType || (exports.TrackType = {}));
	var ImageTrackActType;
	(function (ImageTrackActType) {
	    ImageTrackActType[ImageTrackActType["NORMAL"] = 1] = "NORMAL";
	    ImageTrackActType[ImageTrackActType["REF"] = 2] = "REF";
	    ImageTrackActType[ImageTrackActType["NOEDIT"] = 3] = "NOEDIT";
	})(ImageTrackActType = exports.ImageTrackActType || (exports.ImageTrackActType = {}));
	var TrackData = (function () {
	    function TrackData() {
	        this.opacity = 1;
	        this.enable = true;
	        this.type = TrackType.IMAGE;
	        this.start = 1;
	        this.act = ImageTrackActType.NORMAL;
	        this.loopType = TrackLoopType.HOLD;
	        this.end = 1;
	    }
	    TrackData.clone = function (val) {
	        var td = new TrackData();
	        for (var p in val) {
	            if (p != "frames")
	                td[p] = val[p];
	            else {
	            }
	        }
	        td.frames = [];
	        for (var i = 0; i < val.frames.length; i++) {
	            td.frames.push(FrameInfo_1.FrameData.clone(val.frames[i]));
	        }
	        return td;
	    };
	    return TrackData;
	}());
	exports.TrackData = TrackData;
	var TrackInfo = (function (_super) {
	    __extends(TrackInfo, _super);
	    function TrackInfo(trackData) {
	        var _this = _super.call(this) || this;
	        _this._hold = 1;
	        _this._isSel = false;
	        trackData ? _this._trackData = trackData : _this._trackData = new TrackData;
	        _this.frameInfoArr = [];
	        _this.removedFrameArr = [];
	        return _this;
	    }
	    TrackInfo.prototype.idx2 = function (v) {
	        return JsFunc_1.prop(this, '_idx', v);
	    };
	    TrackInfo.prototype.layerIdx = function (v) {
	        return JsFunc_1.prop(this, "_layerIdx", v);
	    };
	    TrackInfo.prototype.name = function (v) {
	        if (v != undefined)
	            this._trackData.name = v;
	        return this._trackData.name;
	    };
	    TrackInfo.prototype.pushFrame = function (filename) {
	        var frameInfo = new FrameInfo_1.FrameInfo(filename);
	        this.frameInfoArr.push(frameInfo);
	        frameInfo.setIdx(this.frameInfoArr.length);
	        frameInfo.setStart(this.frameInfoArr.length);
	        this.emit(const_1.TrackInfoEvent.PUSH_FRAME, frameInfo);
	    };
	    TrackInfo.prototype.onImgLoaded = function () {
	        this._loadCount--;
	        if (this._loadCount > 0) {
	        }
	        else {
	            this.emit(const_1.TrackInfoEvent.LOADED);
	        }
	    };
	    TrackInfo.prototype.newImage = function (frameDataArr) {
	        var _this = this;
	        var newFrame;
	        var frameData;
	        this._loadCount = frameDataArr.length;
	        var holdCount = frameDataArr.length;
	        for (var i = 0; i < frameDataArr.length; i++) {
	            frameData = frameDataArr[i];
	            newFrame = new FrameInfo_1.FrameInfo(frameData.filename);
	            newFrame.imageInfo.img.addEventListener("load", function () {
	                _this.onImgLoaded();
	            });
	            if (frameData.start) {
	                newFrame.setStart(frameData.start);
	                newFrame.setHold(frameData.hold);
	                holdCount += (frameData.hold - 1);
	            }
	            else {
	                newFrame.setStart(i + 1);
	                newFrame.setHold(1);
	            }
	            newFrame.setIdx(this.frameInfoArr.length);
	            this.frameInfoArr.push(newFrame);
	        }
	        this._hold = holdCount;
	    };
	    TrackInfo.prototype.loopType = function (v) {
	        if (v != undefined)
	            this._trackData.loopType = v;
	        return this._trackData.loopType;
	    };
	    TrackInfo.prototype.actType = function (v) {
	        if (v != undefined) {
	            this._trackData.act = v;
	            this.emit(const_1.TrackInfoEvent.SET_ACT_TYPE, v);
	        }
	        return this._trackData.act;
	    };
	    TrackInfo.prototype.opacity = function (v) {
	        if (v != undefined) {
	            this._trackData.opacity = v;
	            this.emit(const_1.TrackInfoEvent.SET_OPACITY, v);
	        }
	        return this._trackData.opacity;
	    };
	    TrackInfo.prototype.start = function (v) {
	        if (v != undefined) {
	            this._trackData.start = v;
	            this.emit(const_1.TrackInfoEvent.SET_TRACK_START, v);
	        }
	        return this._trackData.start;
	    };
	    TrackInfo.prototype.enable = function (v) {
	        if (v != undefined) {
	            this._trackData.enable = v;
	            this.emit(const_1.TrackInfoEvent.SET_ENABLE, v);
	        }
	        return this._trackData.enable;
	    };
	    TrackInfo.prototype.getFrameByCursor = function (frameIdx) {
	        frameIdx -= this.start() - 1;
	        for (var i = 0; i < this.frameInfoArr.length; i++) {
	            var frameInfo = this.frameInfoArr[i];
	            if (frameInfo.getStart() <= frameIdx && frameInfo.getEnd() >= frameIdx) {
	                return frameInfo.filename;
	            }
	        }
	        if (frameIdx > frameInfo.getEnd() && this.loopType() == TrackLoopType.HOLD) {
	            return frameInfo.filename;
	        }
	        return null;
	    };
	    TrackInfo.prototype.trackData = function () {
	        return this._trackData;
	    };
	    TrackInfo.prototype.getCurImg = function (frameIdx) {
	        return this.getFrameByCursor(frameIdx);
	    };
	    return TrackInfo;
	}(EventDispatcher_1.EventDispatcher));
	exports.TrackInfo = TrackInfo;


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	function ascendingProp(prop) {
	    return function (a, b) {
	        return a[prop] - b[prop];
	    };
	}
	exports.ascendingProp = ascendingProp;
	function descendingProp(prop) {
	    return function (a, b) {
	        return b[prop] - a[prop];
	    };
	}
	exports.descendingProp = descendingProp;
	function mapToSortArray(map, prop, sortFunc) {
	    var arr = [];
	    for (var k in map) {
	        arr.push(map[k]);
	    }
	    arr.sort(sortFunc(prop));
	    return arr;
	}
	exports.mapToSortArray = mapToSortArray;
	function mapToArr(map, clone) {
	    var a = [];
	    for (var k in map) {
	        a.push(map[k]);
	    }
	    if (clone)
	        a = JSON.parse(JSON.stringify(a));
	    return a;
	}
	exports.mapToArr = mapToArr;
	function arrCountSame(arrA, arrB) {
	    var n = 0;
	    for (var i = 0; i < arrB.length; i++) {
	        var obj = arrB[i];
	        if (arrA.indexOf(obj) > -1) {
	            n++;
	        }
	    }
	    return n;
	}
	exports.arrCountSame = arrCountSame;
	function arrUniqueFilter(el, i, a) {
	    return i == a.indexOf(el);
	}
	exports.arrUniqueFilter = arrUniqueFilter;
	function loadImg(path1, callback) {
	    var img = new Image();
	    img.onload = function () {
	        callback(img);
	    };
	    img.src = path1;
	}
	exports.loadImg = loadImg;
	function loadImgArr(pathArr, callback) {
	    var count = pathArr.length;
	    var imgCollection;
	    var isArr;
	    function onLoadImg() {
	        count--;
	        if (count === 0) {
	            count = -1;
	            callback(imgCollection);
	        }
	    }
	    if (count && pathArr[0].hasOwnProperty('name') && pathArr[0].hasOwnProperty('url')) {
	        isArr = false;
	        imgCollection = {};
	    }
	    else {
	        isArr = true;
	        imgCollection = [];
	    }
	    var img;
	    var url;
	    for (var i = 0; i < pathArr.length; i++) {
	        var p = pathArr[i];
	        img = new Image();
	        if (isArr) {
	            imgCollection.push(img);
	            url = p;
	        }
	        else {
	            imgCollection[p.name] = img;
	            url = p.url;
	        }
	        img.onload = onLoadImg;
	        img.src = url;
	    }
	}
	exports.loadImgArr = loadImgArr;
	function combineArr(arr, num) {
	    var r = [];
	    (function f(t, a, n) {
	        if (n == 0) {
	            return r.push(t);
	        }
	        for (var i = 0, l = a.length; i <= l - n; i++) {
	            f(t.concat(a[i]), a.slice(i + 1), n - 1);
	        }
	    })([], arr, num);
	    return r;
	}
	exports.combineArr = combineArr;
	function formatSecond(sec, minStr, secStr) {
	    if (minStr === void 0) { minStr = ":"; }
	    if (secStr === void 0) { secStr = ""; }
	    var min = Math.floor(sec / 60);
	    var s = sec % 60;
	    var strMin = min + "";
	    var strSec = s + "";
	    if (min < 10)
	        strMin = "0" + strMin;
	    if (s < 10)
	        strSec = "0" + strSec;
	    return strMin + minStr + strSec + secStr;
	}
	exports.formatSecond = formatSecond;
	function getLength(str) {
	    var realLength = 0, len = str.length, charCode = -1;
	    for (var i = 0; i < len; i++) {
	        charCode = str.charCodeAt(i);
	        if (charCode >= 0 && charCode <= 128)
	            realLength += 1;
	        else
	            realLength += 2;
	    }
	    return realLength;
	}
	exports.getLength = getLength;
	function cnWrap(str, len, limit) {
	    if (limit === void 0) { limit = 0; }
	    var str_line_length = 0;
	    var str_len = str.length;
	    var str_cut = new String();
	    var str_out = '';
	    var total_len = 0;
	    for (var i = 0; i < str_len; i++) {
	        if (limit != 0 && total_len > limit)
	            break;
	        var a = str.charAt(i);
	        str_line_length++;
	        total_len++;
	        if (escape(a).length > 4) {
	            str_line_length++;
	            total_len++;
	        }
	        str_cut = str_cut.concat(a);
	        if (str_line_length >= len) {
	            str_out += str_cut.concat('\n');
	            str_cut = new String();
	            str_line_length = 0;
	        }
	    }
	    str_out += str_cut;
	    return str_out;
	}
	exports.cnWrap = cnWrap;
	exports.getUrlFilename = function (url) {
	    var a = url.split('/');
	    var filename = a[a.length - 1];
	    return filename;
	};
	exports.DateFormat = function (date, fmt) {
	    var o = {
	        "M+": date.getMonth() + 1,
	        "d+": date.getDate(),
	        "h+": date.getHours(),
	        "m+": date.getMinutes(),
	        "s+": date.getSeconds(),
	        "q+": Math.floor((date.getMonth() + 3) / 3),
	        "S": date.getMilliseconds()
	    };
	    if (/(y+)/.test(fmt))
	        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	        if (new RegExp("(" + k + ")").test(fmt))
	            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	};
	exports.prop = function (obj, paramName, v, callback) {
	    if (v != undefined) {
	        obj[paramName] = v;
	        if (callback)
	            callback();
	    }
	    else
	        return obj[paramName];
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	exports.FontName = {
	    MicrosoftYahei: "Microsoft Yahei"
	};
	exports.ViewConst = {
	    COMP_WIDTH: 1280,
	    COMP_HEIGHT: 720,
	    STAGE_WIDTH: 1920,
	    STAGE_HEIGHT: 1080
	};
	exports.BaseEvent = {
	    CHANGED: 'changed'
	};
	exports.COLOR = {
	    PLAYER_EDIT: 'edit player',
	};
	exports.CompInfoEvent = {
	    NEW_COMP: "new comp",
	    NEW_TRACK: "new track",
	    READ_DIR: "read dir",
	    DEL_TRACK: "delete track",
	    SWAP_TRACK: "swap track",
	    UPDATE_CURSOR: "UPDATE_Cursor",
	    FRAME_WIDTH_CHANGE: "frame width change"
	};
	exports.TrackInfoEvent = {
	    LOADED: "load all imgs",
	    SEL_TRACK: "select track",
	    PUSH_FRAME: "push frame",
	    SEL_FRAME: "select frame",
	    DEL_FRAME: "delete frame",
	    SET_ACT_TYPE: "set act type",
	    SET_OPACITY: "set track opacity",
	    SET_ENABLE: "set track enable",
	    SET_NAME: "set track name",
	    SET_TRACK_START: "SET_TRACK_START",
	};
	exports.FrameTimerEvent = {
	    TICK: "TICK"
	};
	var TheMachineEvent = (function () {
	    function TheMachineEvent() {
	    }
	    return TheMachineEvent;
	}());
	TheMachineEvent.UPDATE_IMG = "UPDATE_IMG";
	TheMachineEvent.ADD_IMG = "ADD_IMG";
	exports.TheMachineEvent = TheMachineEvent;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var EventDispatcher_1 = __webpack_require__(7);
	var PressFlag;
	(function (PressFlag) {
	    PressFlag[PressFlag["L"] = 1] = "L";
	    PressFlag[PressFlag["R"] = 2] = "R";
	})(PressFlag || (PressFlag = {}));
	var FrameData = (function () {
	    function FrameData() {
	    }
	    FrameData.clone = function (val) {
	        var fd = new FrameData();
	        for (var p in val) {
	            fd[p] = val[p];
	        }
	        return fd;
	    };
	    return FrameData;
	}());
	exports.FrameData = FrameData;
	var FrameInfo = (function (_super) {
	    __extends(FrameInfo, _super);
	    function FrameInfo(filename) {
	        var _this = _super.call(this) || this;
	        _this._idx = -1;
	        _this._start = 1;
	        _this._end = 1;
	        _this._hold = 1;
	        _this.pressFlag = 0;
	        _this.filename = filename;
	        return _this;
	    }
	    FrameInfo.prototype.getIdx = function () {
	        return this._idx;
	    };
	    FrameInfo.prototype.idx = function (v) {
	        if (v != undefined)
	            this._idx = v;
	        return this._idx;
	    };
	    FrameInfo.prototype.dtIdx = function (deltaVal) {
	        this.setIdx(this._idx + deltaVal);
	    };
	    FrameInfo.prototype.setIdx = function (v) {
	        this._idx = v;
	    };
	    FrameInfo.prototype.getStart = function () {
	        return this._start;
	    };
	    FrameInfo.prototype.dtStart = function (deltaVal) {
	        this.setStart(this._start + deltaVal);
	    };
	    FrameInfo.prototype.setStart = function (v) {
	        this._start = v;
	        this._end = v + this._hold - 1;
	    };
	    FrameInfo.prototype.getHold = function () {
	        return this._hold;
	    };
	    FrameInfo.prototype.dtHold = function (deltaVal) {
	        this.setHold(this._hold + deltaVal);
	    };
	    FrameInfo.prototype.setHold = function (v) {
	        this._hold = v;
	        this._end = this._start + this._hold - 1;
	    };
	    FrameInfo.prototype.getEnd = function () {
	        return this._end;
	    };
	    return FrameInfo;
	}(EventDispatcher_1.EventDispatcher));
	exports.FrameInfo = FrameInfo;


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	var EventDispatcher = (function () {
	    function EventDispatcher() {
	        this._func = {};
	        this._funcId = 0;
	    }
	    EventDispatcher.prototype.on = function (type, func) {
	        if (!this._func[type])
	            this._func[type] = [];
	        this._funcId++;
	        this._func[type].push({ func: func, id: this._funcId });
	        return this._funcId;
	    };
	    EventDispatcher.prototype.emit = function (type, param) {
	        if (this._func[type])
	            for (var i = 0; i < this._func[type].length; ++i) {
	                var f = this._func[type][i];
	                if (f)
	                    f.func(param);
	            }
	    };
	    EventDispatcher.prototype.del = function (type, funcId) {
	        if (funcId === void 0) { funcId = -1; }
	        if (this._func[type])
	            if (funcId < 0) {
	                this._func[type] = [];
	            }
	            else {
	                for (var i = 0; i < this._func[type].length; ++i) {
	                    var f = this._func[type][i];
	                    if (f) {
	                        if (f.id == funcId) {
	                            delete this._func[type][i];
	                            console.log('del event', type, funcId);
	                            break;
	                        }
	                    }
	                }
	            }
	    };
	    EventDispatcher.prototype.removeAll = function () {
	        this._func = {};
	    };
	    return EventDispatcher;
	}());
	exports.EventDispatcher = EventDispatcher;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var PsdImage_1 = __webpack_require__(9);
	var Layer_1 = __webpack_require__(11);
	var PsdFile_1 = __webpack_require__(12);
	var PNG = __webpack_require__(13).PNG;
	var ImageLayerInfo = (function () {
	    function ImageLayerInfo() {
	    }
	    ImageLayerInfo.prototype.load = function (callback) {
	        var self = this;
	        if (this.filename)
	            fs.createReadStream(this.filename)
	                .pipe(new PNG({
	                filterType: 4
	            }))
	                .on('parsed', function (data) {
	                self.pixels = this.data;
	                self.width = this.width;
	                self.height = this.height;
	                callback();
	            });
	    };
	    ImageLayerInfo.png2psd = function (pngArr, w, h, colorSpace, path, pathCallback) {
	        var psd = new PsdFile_1.PsdFile(w, h, colorSpace);
	        var pngLayer;
	        for (var i = 0; i < pngArr.length; i++) {
	            pngLayer = pngArr[i];
	            var image = new PsdImage_1.PsdImage(pngLayer.width, pngLayer.height, colorSpace, pngLayer.pixels);
	            var layer = new Layer_1.Layer();
	            layer.drawImage(image);
	            layer.opacity = pngLayer.opacity;
	            psd.appendLayer(layer);
	        }
	        var b = new Buffer(4);
	        psd.imageData = new PsdImage_1.PsdImage(1, 1, colorSpace, b);
	        fs.writeFile(path, psd.toBinary(), function (err) {
	            if (err)
	                throw err;
	            pathCallback(path);
	        });
	    };
	    return ImageLayerInfo;
	}());
	exports.ImageLayerInfo = ImageLayerInfo;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ChImageData_1 = __webpack_require__(10);
	var PsdImage = (function () {
	    function PsdImage(width, height, colorSpace, pixels) {
	        this.width = (typeof width === 'number') ? width : 0;
	        this.height = (typeof height === 'number') ? height : 0;
	        this.colorSpace = colorSpace.match(/^(gray|rgb)a?$/) ? colorSpace : 'rgba';
	        this.colorMode = this.colorSpace.match(/^graya?$/) ? 'gray' : 'rgb';
	        this.hasAlpha = (this.colorSpace === this.colorMode + 'a');
	        this.pixels = pixels;
	        this.numChannel = (this.colorMode === 'rgb') ? 3 : 1;
	        this.numChannel += this.hasAlpha ? 1 : 0;
	        this.numPixels = this.numChannel * this.width * this.height;
	        this.channels = [];
	        if (this.pixels.length !== this.numPixels) {
	            throw new Error('mismatch number of pixels.' + this.pixels.length);
	        }
	        var self = this;
	        var channels = [];
	        for (var i = 0; i < this.numChannel; i++) {
	            channels.push([]);
	        }
	        for (i = 0; i < this.numPixels; i += this.numChannel) {
	            for (var index = 0; index < this.numChannel; index++) {
	                channels[index].push(this.pixels[i + index]);
	            }
	        }
	        this.channels = channels.map(function (channel) {
	            return new ChImageData_1.ChImageData(self.width, self.height, channel);
	        });
	    }
	    PsdImage.prototype.toBinary = function () {
	        var compType = new Buffer(2);
	        compType.writeUInt16BE(1, 0);
	        var byteCounts = [];
	        var compressedImages = [];
	        this.channels.forEach(function (channel) {
	            var comp = channel.compressRLE();
	            byteCounts.push(comp.byteCounts);
	            compressedImages.push(comp.image);
	        });
	        return Buffer.concat([
	            compType,
	            Buffer.concat(byteCounts),
	            Buffer.concat(compressedImages)
	        ]);
	    };
	    return PsdImage;
	}());
	exports.PsdImage = PsdImage;


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	var ChImageData = (function () {
	    function ChImageData(width, height, pixels) {
	        this.width = width;
	        this.height = height;
	        this.pixels = pixels;
	    }
	    ChImageData.prototype.compressRLE = function () {
	        var width = this.width;
	        var height = this.height;
	        var compressedLines = [];
	        var byteCounts = new Buffer(this.height * 2);
	        byteCounts.fill(0);
	        var ofs = 0;
	        for (var i = 0; i < height; i++) {
	            var start = i * width;
	            var end = start + width;
	            var compressedLine = this.encodeRLE(this.pixels.slice(start, end));
	            compressedLines.push(compressedLine);
	            byteCounts.writeUInt16BE(compressedLine.length, ofs);
	            ofs += 2;
	        }
	        return {
	            byteCounts: byteCounts,
	            image: Buffer.concat(compressedLines)
	        };
	    };
	    ChImageData.prototype.encodeRLE = function (data) {
	        var result = [];
	        if (data.length === 0) {
	            throw new Error('buffer length is 0');
	        }
	        if (data.length === 1) {
	            result.push(0x00);
	            result.push(data[0]);
	            return new Buffer(result);
	        }
	        var buf = [];
	        var pos = 0;
	        var repeatCount = 0;
	        var MAX_LENGTH = 127;
	        var state = 'RAW';
	        function finishRAW() {
	            if (buf.length === 0) {
	                return;
	            }
	            result.push(buf.length - 1);
	            result = result.concat(buf);
	            buf = [];
	        }
	        function finishRLE() {
	            result.push(256 - (repeatCount - 1));
	            result.push(data[pos]);
	        }
	        while (pos < data.length - 1) {
	            var currentByte = data[pos];
	            if (data[pos] === data[pos + 1]) {
	                if (state === 'RAW') {
	                    finishRAW();
	                    state = 'RLE';
	                    repeatCount = 1;
	                }
	                else if (state === 'RLE') {
	                    if (repeatCount === MAX_LENGTH) {
	                        finishRLE();
	                        repeatCount = 0;
	                    }
	                    repeatCount += 1;
	                }
	            }
	            else {
	                if (state === 'RLE') {
	                    repeatCount += 1;
	                    finishRLE();
	                    state = 'RAW';
	                    repeatCount = 0;
	                }
	                else if (state === 'RAW') {
	                    if (buf.length === MAX_LENGTH) {
	                        finishRAW();
	                    }
	                    buf.push(currentByte);
	                }
	            }
	            pos += 1;
	        }
	        if (state === 'RAW') {
	            buf.push(data[pos]);
	            finishRAW();
	        }
	        else if (state === 'RLE') {
	            repeatCount += 1;
	            finishRLE();
	        }
	        return new Buffer(result);
	    };
	    ChImageData.prototype.toBinary = function () {
	        var compType = new Buffer(2);
	        compType.writeUInt16BE(1, 0);
	        var compressedData = this.compressRLE();
	        return Buffer.concat([
	            compType,
	            compressedData.byteCounts,
	            compressedData.image
	        ]);
	    };
	    return ChImageData;
	}());
	exports.ChImageData = ChImageData;


/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
	var Layer = (function () {
	    function Layer() {
	        this.top = 0;
	        this.left = 0;
	        this.width = 0;
	        this.height = 0;
	        this.blendMode = 'norm';
	        this.opacity = 1;
	        this.name = '';
	        this.hasAlpha = true;
	        this.channels = [];
	        this.name = "png";
	    }
	    Layer.prototype.drawImage = function (image) {
	        this.width = image.width;
	        this.height = image.height;
	        this.hasAlpha = image.hasAlpha;
	        this.channels = image.channels;
	    };
	    Layer.prototype.getChannelImageBinary = function () {
	        var channelImageData = Buffer.concat(this.channels.map(function (channel) {
	            return channel.toBinary();
	        }));
	        return channelImageData;
	    };
	    Layer.prototype.toBinary = function () {
	        var that = this;
	        var layerNameDataLen;
	        if (!this.name)
	            this.name = "png";
	        layerNameDataLen = Math.ceil((this.name.length + 1) / 4) * 4;
	        var numChannel = this.channels.length;
	        var layerRecordSize = 34 + 4 + 4 + layerNameDataLen + (6 * numChannel);
	        var layerRecord = new Buffer(layerRecordSize);
	        layerRecord.writeUInt32BE(this.top, 0);
	        layerRecord.writeUInt32BE(this.left, 4);
	        layerRecord.writeUInt32BE(this.top + this.height, 8);
	        layerRecord.writeUInt32BE(this.left + this.width, 12);
	        layerRecord.writeUInt16BE(numChannel, 16);
	        var ofs = 16 + 2;
	        this.channels.forEach(function (channel, index) {
	            var id = (that.hasAlpha && index === numChannel - 1) ? -1 : index;
	            layerRecord.writeInt16BE(id, ofs);
	            ofs += 2;
	            var channelByteLength = channel.toBinary().length;
	            layerRecord.writeUInt32BE(channelByteLength, ofs);
	            ofs += 4;
	        });
	        layerRecord.write('8BIM', ofs);
	        ofs += 4;
	        layerRecord.write(this.blendMode, ofs);
	        ofs += 4;
	        layerRecord.writeUInt8(Math.round(this.opacity * 255), ofs);
	        ofs += 1;
	        layerRecord.writeUInt8(0, ofs);
	        ofs += 1;
	        layerRecord.writeUInt8(parseInt('00001000', 2), ofs);
	        ofs += 1;
	        layerRecord.writeUInt8(0, ofs);
	        ofs += 1;
	        layerRecord.writeUInt32BE(4 + 4 + layerNameDataLen, ofs);
	        ofs += 4;
	        layerRecord.writeUInt32BE(0, ofs);
	        ofs += 4;
	        layerRecord.writeUInt32BE(0, ofs);
	        ofs += 4;
	        if (this.name) {
	            layerRecord.writeUInt8(layerNameDataLen - 1, ofs);
	            ofs += 1;
	            for (var i = 0; i < this.name.length; i++) {
	                var char = this.name[i];
	                layerRecord.writeUInt8(char.charCodeAt(0), ofs);
	                ofs += 1;
	            }
	        }
	        else {
	        }
	        return layerRecord;
	    };
	    return Layer;
	}());
	exports.Layer = Layer;


/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	var PsdFile = (function () {
	    function PsdFile(width, height, colorSpace) {
	        this.COLOR_MODE = { gray: 1, rgb: 3 };
	        this.width = (typeof width === 'number') ? width : 0;
	        this.height = (typeof height === 'number') ? height : 0;
	        this.colorSpace = colorSpace.match(/^(gray|rgb)a?$/) ? colorSpace : 'rgba';
	        this.colorMode = this.colorSpace.match(/^graya?$/) ? 'gray' : 'rgb';
	        this.hasAlpha = (this.colorSpace === this.colorMode + 'a');
	        this.numChannel = (this.colorMode === 'rgb') ? 3 : 1;
	        this.numChannel += this.hasAlpha ? 1 : 0;
	        this.imageData = null;
	        this.layers = [];
	    }
	    PsdFile.prototype.appendLayer = function (layer) {
	        this.layers.push(layer);
	        return this;
	    };
	    PsdFile.prototype.toBinary = function () {
	        var header = this._getHeaderBinary(this);
	        var colorModeData = new Buffer(4);
	        colorModeData.writeUInt32BE(0, 0);
	        var imageResources = new Buffer(4);
	        imageResources.writeUInt32BE(0, 0);
	        var layerData = this._createLayerBlockBuffer(this);
	        var data = Buffer.concat([
	            header,
	            colorModeData,
	            imageResources,
	            layerData,
	        ]);
	        return data;
	    };
	    PsdFile.prototype._getHeaderBinary = function (psd) {
	        var header = new Buffer(26);
	        header.fill(0);
	        header.write('8BPS');
	        header.writeUInt16BE(1, 4);
	        header.writeUInt16BE(3, 12);
	        header.writeUInt32BE(psd.height, 14);
	        header.writeUInt32BE(psd.width, 18);
	        header.writeUInt16BE(8, 22);
	        header.writeUInt16BE(psd.COLOR_MODE[psd.colorMode], 24);
	        return header;
	    };
	    PsdFile.prototype._createLayerBlockBuffer = function (psd) {
	        if (psd.layers.length === 0) {
	            var nullLayer = new Buffer(4);
	            nullLayer.writeUInt32BE(0, 0);
	            return nullLayer;
	        }
	        var layerRecords = Buffer.concat(psd.layers.map(function (layer) {
	            return layer.toBinary();
	        }));
	        var layerChannelImageData = Buffer.concat(psd.layers.map(function (layer) {
	            return layer.getChannelImageBinary();
	        }));
	        var layerInfoLength = 4 + 2 + layerRecords.length +
	            layerChannelImageData.length;
	        var layerInfoPadding = new Buffer(layerInfoLength % 2);
	        layerInfoPadding.fill(0);
	        layerInfoLength += layerInfoPadding.length;
	        var layerInfoHeader = new Buffer(4 + 2);
	        layerInfoHeader.writeUInt32BE(layerInfoLength - 4, 0);
	        var layerCount = psd.layers.length;
	        layerInfoHeader.writeInt16BE(layerCount, 4);
	        var layerInfo = Buffer.concat([
	            layerInfoHeader,
	            layerRecords,
	            layerChannelImageData,
	            layerInfoPadding
	        ]);
	        var globalLayerMaskInfoSize = 4 + 2 + 8 + 2 + 1 + 1;
	        var globalLayerMaskInfo = new Buffer(globalLayerMaskInfoSize);
	        globalLayerMaskInfo.writeUInt32BE(globalLayerMaskInfoSize - 4, 0);
	        var layerHeader = new Buffer(4);
	        var layerLength = layerInfo.length + globalLayerMaskInfoSize;
	        layerHeader.writeUInt32BE(layerLength, 0);
	        return Buffer.concat([
	            layerHeader,
	            layerInfo,
	            globalLayerMaskInfo
	        ]);
	    };
	    return PsdFile;
	}());
	exports.PsdFile = PsdFile;


/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("pngjs");

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	var POI = (function () {
	    function POI() {
	        this.imageLayerInfoArr = [];
	        this.isBeingWatched = false;
	    }
	    POI.prototype.psd2png = function () {
	        var _this = this;
	        if (this.filename) {
	            var psdParser = new PsdParser();
	            var psd = psdParser.parse(this.filename);
	            for (var i = 0; i < this.imageLayerInfoArr.length; i++) {
	                var imageLayerInfo = this.imageLayerInfoArr[i];
	                if (!imageLayerInfo.isRef) {
	                    psd.getDescendants()[this.imageLayerInfoArr.length - 1 - i].saveAsPng(imageLayerInfo.filename, function () {
	                        console.log(_this, "psd2png", imageLayerInfo.filename);
	                        imageLayerInfo.imageInfo.updateImg();
	                    });
	                }
	            }
	        }
	        else {
	            throw new Error("no psd filename");
	        }
	    };
	    return POI;
	}());
	exports.POI = POI;


/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("child_process");

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var JsFunc_1 = __webpack_require__(4);
	var EventDispatcher_1 = __webpack_require__(7);
	var SettingData = (function () {
	    function SettingData() {
	        this.tmpPath = "c:/tmp";
	        this.drawApp1Path = "C:\\Program Files\\CELSYS\\CLIP STUDIO 1.5\\CLIP STUDIO PAINT\\CLIPStudioPaint.exe";
	        this.drawApp2Path = "";
	    }
	    return SettingData;
	}());
	var SettingInfoEvent = (function () {
	    function SettingInfoEvent() {
	    }
	    return SettingInfoEvent;
	}());
	SettingInfoEvent.SET_TMP_PATH = "SET_TMP_PATH";
	SettingInfoEvent.SET_DRAW_APP1 = "SET_DRAW_APP1";
	SettingInfoEvent.SET_DRAW_APP2 = "SET_DRAW_APP2";
	exports.SettingInfoEvent = SettingInfoEvent;
	var SettingInfo = (function (_super) {
	    __extends(SettingInfo, _super);
	    function SettingInfo() {
	        var _this = _super.call(this) || this;
	        _this.settingData = new SettingData();
	        return _this;
	    }
	    SettingInfo.prototype.tmpPath = function (v) {
	        var _this = this;
	        return JsFunc_1.prop(this.settingData, "tmpPath", v, function () {
	            _this.emit(SettingInfoEvent.SET_TMP_PATH);
	        });
	    };
	    SettingInfo.prototype.drawApp1Path = function (v) {
	        var _this = this;
	        return JsFunc_1.prop(this.settingData, "drawApp1Path", v, function () {
	            _this.emit(SettingInfoEvent.SET_DRAW_APP1);
	        });
	    };
	    return SettingInfo;
	}(EventDispatcher_1.EventDispatcher));
	exports.SettingInfo = SettingInfo;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var JSONFile_1 = __webpack_require__(19);
	var TrackInfo_1 = __webpack_require__(3);
	var const_1 = __webpack_require__(5);
	var CompInfo_1 = __webpack_require__(21);
	var EventDispatcher_1 = __webpack_require__(7);
	var M_path = __webpack_require__(16);
	var ProjectInfoEvent = (function () {
	    function ProjectInfoEvent() {
	    }
	    return ProjectInfoEvent;
	}());
	ProjectInfoEvent.NEW_PROJ = "NEW_PROJ";
	exports.ProjectInfoEvent = ProjectInfoEvent;
	var ProjectInfo = (function (_super) {
	    __extends(ProjectInfo, _super);
	    function ProjectInfo() {
	        var _this = _super.call(this) || this;
	        _this.comps = [];
	        _this.version = '0.1.0';
	        _this.newComp(1280, 720, 30);
	        return _this;
	    }
	    ProjectInfo.prototype.open = function (path) {
	        var _this = this;
	        console.log(this, "open project", path);
	        JSONFile_1.jsonfile.readFile(path, null, function (err, projData) {
	            console.log(_this, "open project ver:", projData.linAnil.version);
	            _this.version = projData.linAnil.version;
	            for (var i = 0; i < projData.linAnil.composition.length; i++) {
	                var compData = projData.linAnil.composition[i];
	                var compInfo = _this.newComp(compData.width, compData.height, compData.framerate);
	                for (var j = 0; j < compData.tracks.length; j++) {
	                    var trackData = compData.tracks[j];
	                    var path = trackData.path;
	                    for (var k = 0; k < trackData.frames.length; k++) {
	                        var frameData = trackData.frames[k];
	                        frameData.filename = M_path.join(path, frameData.filename);
	                    }
	                    compInfo.newTrackByTrackData(trackData);
	                }
	            }
	        });
	    };
	    ProjectInfo.prototype.save = function (path) {
	        this.saveFilename = path;
	        var projData = {
	            linAnil: {
	                version: this.version,
	                setting: {
	                    tmp: "c:/tmp",
	                },
	                composition: []
	            }
	        };
	        for (var i = 0; i < this.comps.length; i++) {
	            var compInfo = this.comps[i];
	            if (!compInfo)
	                continue;
	            var compData = {
	                name: compInfo.name(),
	                framerate: compInfo.framerate,
	                framewidth: compInfo.frameWidth,
	                height: compInfo.height,
	                width: compInfo.width,
	                tracks: []
	            };
	            projData.linAnil.composition.push(compData);
	            for (var j = 0; j < compInfo.trackInfoArr.length; j++) {
	                var trackInfo = compInfo.trackInfoArr[j];
	                if (!trackInfo)
	                    continue;
	                console.log(this, "get TrackData", j, trackInfo.trackData());
	                var trackData = TrackInfo_1.TrackData.clone(trackInfo.trackData());
	                compData.tracks.push(trackData);
	                for (var k = 0; k < trackData.frames.length; k++) {
	                    var frameData = trackData.frames[k];
	                    if (!frameData)
	                        continue;
	                    frameData.filename = M_path.basename(frameData.filename);
	                }
	            }
	        }
	        JSONFile_1.jsonfile.writeFile(path, projData, null, function (err) {
	        });
	    };
	    ProjectInfo.prototype.frameWidth = function () {
	        return this.curComp.frameWidth;
	    };
	    ProjectInfo.prototype.newComp = function (width, height, framerate) {
	        var compInfo = new CompInfo_1.CompInfo(width, height, framerate);
	        this.curComp = compInfo;
	        this.comps.push(compInfo);
	        compInfo.name("Comp" + this.comps.length);
	        console.log(this, "new CompInfo");
	        this.emit(const_1.CompInfoEvent.NEW_COMP, compInfo);
	        return compInfo;
	    };
	    return ProjectInfo;
	}(EventDispatcher_1.EventDispatcher));
	exports.ProjectInfo = ProjectInfo;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var fs = __webpack_require__(20);
	function readFile(file, options, callback) {
	    if (callback == null) {
	        callback = options;
	        options = {};
	    }
	    fs.readFile(file, options, function (err, data) {
	        if (err)
	            return callback(err);
	        var obj;
	        try {
	            obj = JSON.parse(data, options ? options.reviver : null);
	        }
	        catch (err2) {
	            return callback(err2);
	        }
	        callback(null, obj);
	    });
	}
	function readFileSync(file, options) {
	    options = options || {};
	    if (typeof options === 'string') {
	        options = { encoding: options };
	    }
	    var shouldThrow = 'throws' in options ? options.throw : true;
	    if (shouldThrow) {
	        return JSON.parse(fs.readFileSync(file, options), options.reviver);
	    }
	    else {
	        try {
	            return JSON.parse(fs.readFileSync(file, options), options.reviver);
	        }
	        catch (err) {
	            return null;
	        }
	    }
	}
	function writeFile(file, obj, options, callback) {
	    if (callback == null) {
	        callback = options;
	        options = {};
	    }
	    var spaces = typeof options === 'object' && options !== null
	        ? 'spaces' in options
	            ? options.spaces : this.spaces
	        : this.spaces;
	    var str = '';
	    try {
	        str = JSON.stringify(obj, options ? options.replacer : null, spaces) + '\n';
	    }
	    catch (err) {
	        if (callback)
	            return callback(err, null);
	    }
	    fs.writeFile(file, str, options, callback);
	}
	function writeFileSync(file, obj, options) {
	    options = options || {};
	    var spaces = typeof options === 'object' && options !== null
	        ? 'spaces' in options
	            ? options.spaces : this.spaces
	        : this.spaces;
	    var str = JSON.stringify(obj, options.replacer, spaces) + '\n';
	    return fs.writeFileSync(file, str, options);
	}
	exports.jsonfile = {
	    spaces: null,
	    readFile: readFile,
	    readFileSync: readFileSync,
	    writeFile: writeFile,
	    writeFileSync: writeFileSync
	};


/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var JsFunc_1 = __webpack_require__(4);
	var NodeFunc_1 = __webpack_require__(22);
	var Command_1 = __webpack_require__(23);
	var const_1 = __webpack_require__(5);
	var FrameTimer_1 = __webpack_require__(24);
	var TrackInfo_1 = __webpack_require__(3);
	var EventDispatcher_1 = __webpack_require__(7);
	var CompositionData = (function () {
	    function CompositionData() {
	    }
	    CompositionData.clone = function (val) {
	    };
	    return CompositionData;
	}());
	exports.CompositionData = CompositionData;
	var CompInfo = (function (_super) {
	    __extends(CompInfo, _super);
	    function CompInfo(width, height, framerate) {
	        var _this = _super.call(this) || this;
	        _this.framerate = 24;
	        _this.frameWidth = 40;
	        _this._cursorPos = 1;
	        _this._maxPos = 0;
	        _this._compData = new CompositionData;
	        _this.width = width;
	        _this.height = height;
	        _this.framerate = framerate;
	        _this.trackInfoArr = [];
	        _this._frameTimer = new FrameTimer_1.FrameTimer(framerate);
	        _this._frameTimer.on(const_1.FrameTimerEvent.TICK, function () {
	            _this.onFrameTimerTick();
	        });
	        return _this;
	    }
	    CompInfo.prototype.onFrameTimerTick = function () {
	        this.forward();
	    };
	    CompInfo.prototype.forward = function () {
	        if (this._cursorPos >= this._maxPos)
	            this.setCursor(1);
	        else
	            this.setCursor(this._cursorPos + 1);
	    };
	    CompInfo.prototype.backward = function () {
	        if (this._cursorPos > 1) {
	            this.setCursor(this._cursorPos - 1);
	        }
	    };
	    CompInfo.prototype.setCursor = function (framePos) {
	        this._cursorPos = framePos;
	        this.emit(const_1.CompInfoEvent.UPDATE_CURSOR, this._cursorPos);
	    };
	    CompInfo.prototype.getCursor = function () {
	        return this._cursorPos;
	    };
	    CompInfo.prototype.name = function (v) {
	        return JsFunc_1.prop(this._compData, 'name', v);
	    };
	    CompInfo.prototype.newTrack = function (filename, callback) {
	        var _this = this;
	        var tInfo = new TrackInfo_1.TrackInfo();
	        this.trackInfoArr.push(tInfo);
	        tInfo.on(const_1.TrackInfoEvent.SET_TRACK_START, function () {
	            _this.emit(const_1.CompInfoEvent.UPDATE_CURSOR, _this.getCursor());
	        });
	        tInfo.on(const_1.TrackInfoEvent.SET_ENABLE, function () {
	            _this.emit(const_1.CompInfoEvent.UPDATE_CURSOR, _this.getCursor());
	        });
	        tInfo.name('track#' + this.trackInfoArr.length);
	        Command_1.cmd.emit(const_1.CompInfoEvent.NEW_TRACK, tInfo);
	        var path = __webpack_require__(16);
	        var basename = path.basename(filename);
	        var dir = path.dirname(filename);
	        console.log('basename', basename);
	        var a = basename.split('.');
	        var fs = __webpack_require__(20);
	        var fileArr = [];
	        var fileCount = 0;
	        var fa = NodeFunc_1.walkDir(dir, function (f) {
	            fileArr.push(f);
	            tInfo.pushFrame(f);
	            fileCount++;
	            _this.updateMaxPos(fileCount);
	        });
	        Command_1.cmd.emit(const_1.CompInfoEvent.READ_DIR);
	    };
	    CompInfo.prototype.updateMaxPos = function (v) {
	        if (v > this._maxPos)
	            this._maxPos = v;
	        console.log('maxPos', this._maxPos);
	    };
	    CompInfo.prototype.newTrackByTrackData = function (trackData) {
	        var trackInfo = new TrackInfo_1.TrackInfo(trackData);
	        if (trackData.type == TrackInfo_1.TrackType.AUDIO) {
	        }
	        else {
	            trackInfo.newImage(trackData.frames);
	        }
	        trackInfo.idx2(this.trackInfoArr.length);
	        trackInfo.layerIdx(this.trackInfoArr.length);
	        this.appendTrackInfo(trackInfo);
	        this.emit(const_1.CompInfoEvent.NEW_TRACK, trackInfo);
	    };
	    CompInfo.prototype.appendTrackInfo = function (trackInfo) {
	        this.trackInfoArr.push(trackInfo);
	        this._updateCompTrackArr();
	    };
	    CompInfo.prototype._updateCompTrackArr = function () {
	        var compare = function (prop) {
	            return function (obj1, obj2) {
	                var val1 = obj1[prop];
	                var val2 = obj2[prop];
	                if (val1 < val2) {
	                    return -1;
	                }
	                else if (val1 > val2) {
	                    return 1;
	                }
	                else {
	                    return 0;
	                }
	            };
	        };
	        var a = [];
	        this.trackInfoArr.map(function (tInfo) {
	            if (tInfo)
	                a.push(tInfo);
	        });
	        a.sort(compare("_layerIdx"));
	        this._compTrackInfoArr = a;
	    };
	    CompInfo.prototype.getCompTrackInfoArr = function () {
	        if (!this._compTrackInfoArr)
	            this._updateCompTrackArr();
	        return this._compTrackInfoArr;
	    };
	    return CompInfo;
	}(EventDispatcher_1.EventDispatcher));
	exports.CompInfo = CompInfo;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	exports.walkDir = function (dirPath, callback) {
	    var fs = __webpack_require__(20);
	    var path = __webpack_require__(16);
	    var fileArr = [];
	    var dirArr = fs.readdirSync(dirPath);
	    dirArr.forEach(function (item) {
	        if (fs.statSync(dirPath + '/' + item).isDirectory()) {
	        }
	        else {
	            var filename = path.join(dirPath, item);
	            fileArr.push(filename);
	            if (callback)
	                callback(filename);
	        }
	    });
	    return fileArr;
	};


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var EventDispatcher_1 = __webpack_require__(7);
	var CommandId;
	(function (CommandId) {
	    CommandId[CommandId["ShowConsoleWin"] = 100000] = "ShowConsoleWin";
	    CommandId[CommandId["testSwapTrack"] = 100001] = "testSwapTrack";
	    CommandId[CommandId["testNewProject"] = 100002] = "testNewProject";
	    CommandId[CommandId["testSaveProject"] = 100003] = "testSaveProject";
	    CommandId[CommandId["testProject"] = 100004] = "testProject";
	    CommandId[CommandId["testRender"] = 100005] = "testRender";
	    CommandId[CommandId["testDialog"] = 100006] = "testDialog";
	    CommandId[CommandId["NewTrack"] = 100007] = "NewTrack";
	    CommandId[CommandId["HideConsoleWin"] = 100008] = "HideConsoleWin";
	    CommandId[CommandId["ShowSettingWin"] = 100009] = "ShowSettingWin";
	    CommandId[CommandId["ToggleFileMenu"] = 100010] = "ToggleFileMenu";
	    CommandId[CommandId["FileMenuOpen"] = 100011] = "FileMenuOpen";
	    CommandId[CommandId["FileMenuSave"] = 100012] = "FileMenuSave";
	    CommandId[CommandId["ShowOnHoldWin"] = 100013] = "ShowOnHoldWin";
	    CommandId[CommandId["ShowTrackMenu"] = 100014] = "ShowTrackMenu";
	    CommandId[CommandId["HideTrackMenu"] = 100015] = "HideTrackMenu";
	    CommandId[CommandId["ShowDialogOK"] = 100016] = "ShowDialogOK";
	    CommandId[CommandId["HideDialogOK"] = 100017] = "HideDialogOK";
	    CommandId[CommandId["ShowNewPngWin"] = 100018] = "ShowNewPngWin";
	    CommandId[CommandId["HideNewPngWin"] = 100019] = "HideNewPngWin";
	    CommandId[CommandId["InsertFrame"] = 100020] = "InsertFrame";
	    CommandId[CommandId["DeleteFrame"] = 100021] = "DeleteFrame";
	    CommandId[CommandId["ZoomOutMax"] = 100022] = "ZoomOutMax";
	    CommandId[CommandId["ZoomInMax"] = 100023] = "ZoomInMax";
	    CommandId[CommandId["ImportAudio"] = 100024] = "ImportAudio";
	})(CommandId = exports.CommandId || (exports.CommandId = {}));
	var CommandItem = (function () {
	    function CommandItem(id) {
	        this.id = id;
	    }
	    return CommandItem;
	}());
	var Command = (function (_super) {
	    __extends(Command, _super);
	    function Command() {
	        var _this = _super.call(this) || this;
	        _this.cmdArr = [];
	        _this.newCmd(CommandId.ShowSettingWin, "open Option");
	        _this.newCmd(CommandId.FileMenuOpen, "open Project");
	        _this.newCmd(CommandId.FileMenuSave, "save Project");
	        _this.newCmd(CommandId.ShowOnHoldWin, "open on hold win");
	        _this.newCmd(CommandId.ShowTrackMenu, "show track menu");
	        _this.newCmd(CommandId.HideTrackMenu, "hide track menu");
	        _this.newCmd(CommandId.InsertFrame, "insert frame");
	        _this.newCmd(CommandId.DeleteFrame, "delete frame");
	        _this.newCmd(CommandId.ZoomOutMax, "zoom out max");
	        _this.newCmd(CommandId.ImportAudio, "import audio");
	        _this.newCmd(CommandId.testSwapTrack, "test swap track");
	        _this.newCmd(CommandId.testNewProject, "test new project");
	        _this.newCmd(CommandId.testSaveProject, "test save project");
	        _this.newCmd(CommandId.testProject, "test project");
	        _this.newCmd(CommandId.testRender, "test render");
	        _this.newCmd(CommandId.testDialog, "test dialog");
	        return _this;
	    }
	    Command.prototype.newCmd = function (id, name, desc) {
	        var ci = new CommandItem(id);
	        ci.name = name;
	        ci.desc = desc;
	        this.cmdArr.push(ci);
	    };
	    return Command;
	}(EventDispatcher_1.EventDispatcher));
	exports.cmd = new Command();


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var const_1 = __webpack_require__(5);
	var EventDispatcher_1 = __webpack_require__(7);
	var FrameTimer = (function (_super) {
	    __extends(FrameTimer, _super);
	    function FrameTimer(framerate) {
	        var _this = _super.call(this) || this;
	        _this._isBusy = false;
	        _this._timerId = null;
	        _this.setFramerate(framerate);
	        return _this;
	    }
	    FrameTimer.prototype.start = function () {
	        if (!this._isBusy)
	            this.newTimer();
	        this._isBusy = true;
	    };
	    FrameTimer.prototype.stop = function () {
	        this._isBusy = false;
	        this.clearTimer();
	    };
	    FrameTimer.prototype.isBusy = function () {
	        return this._isBusy;
	    };
	    FrameTimer.prototype.setFramerate = function (framerate) {
	        if (this._framerate != framerate) {
	            this._framerate = framerate;
	            this.clearTimer();
	            this.newTimer();
	        }
	    };
	    FrameTimer.prototype.clearTimer = function () {
	        if (this._timerId) {
	            clearInterval(this._timerId);
	        }
	        this._timerId = null;
	    };
	    FrameTimer.prototype.newTimer = function () {
	        var _this = this;
	        this._timerId = setInterval(function () {
	            _this.onTick();
	        }, 1000 / this._framerate);
	    };
	    FrameTimer.prototype.onTick = function () {
	        if (this._isBusy) {
	            this.emit(const_1.FrameTimerEvent.TICK);
	        }
	        else {
	            this.clearTimer();
	        }
	    };
	    return FrameTimer;
	}(EventDispatcher_1.EventDispatcher));
	exports.FrameTimer = FrameTimer;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(26)(__webpack_require__(27))

/***/ },
/* 26 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function(src) {
		if (typeof execScript !== "undefined")
			execScript(src);
		else
			eval.call(null, src);
	}


/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = "/*!\r\n * pixi.js - v4.2.3\r\n * Compiled Wed, 30 Nov 2016 19:08:52 UTC\r\n *\r\n * pixi.js is licensed under the MIT License.\r\n * http://www.opensource.org/licenses/mit-license\r\n */\r\n!function(t){if(\"object\"==typeof exports&&\"undefined\"!=typeof module)module.exports=t();else if(\"function\"==typeof define&&define.amd)define([],t);else{var e;e=\"undefined\"!=typeof window?window:\"undefined\"!=typeof global?global:\"undefined\"!=typeof self?self:this,e.PIXI=t()}}(function(){var t;return function t(e,r,n){function i(s,a){if(!r[s]){if(!e[s]){var u=\"function\"==typeof require&&require;if(!a&&u)return u(s,!0);if(o)return o(s,!0);var h=new Error(\"Cannot find module '\"+s+\"'\");throw h.code=\"MODULE_NOT_FOUND\",h}var l=r[s]={exports:{}};e[s][0].call(l.exports,function(t){var r=e[s][1][t];return i(r?r:t)},l,l.exports,t,e,r,n)}return r[s].exports}for(var o=\"function\"==typeof require&&require,s=0;s<n.length;s++)i(n[s]);return i}({1:[function(t,e,r){\"use strict\";\"use restrict\";function n(t){var e=32;return t&=-t,t&&e--,65535&t&&(e-=16),16711935&t&&(e-=8),252645135&t&&(e-=4),858993459&t&&(e-=2),1431655765&t&&(e-=1),e}var i=32;r.INT_BITS=i,r.INT_MAX=2147483647,r.INT_MIN=-1<<i-1,r.sign=function(t){return(t>0)-(t<0)},r.abs=function(t){var e=t>>i-1;return(t^e)-e},r.min=function(t,e){return e^(t^e)&-(t<e)},r.max=function(t,e){return t^(t^e)&-(t<e)},r.isPow2=function(t){return!(t&t-1||!t)},r.log2=function(t){var e,r;return e=(t>65535)<<4,t>>>=e,r=(t>255)<<3,t>>>=r,e|=r,r=(t>15)<<2,t>>>=r,e|=r,r=(t>3)<<1,t>>>=r,e|=r,e|t>>1},r.log10=function(t){return t>=1e9?9:t>=1e8?8:t>=1e7?7:t>=1e6?6:t>=1e5?5:t>=1e4?4:t>=1e3?3:t>=100?2:t>=10?1:0},r.popCount=function(t){return t-=t>>>1&1431655765,t=(858993459&t)+(t>>>2&858993459),16843009*(t+(t>>>4)&252645135)>>>24},r.countTrailingZeros=n,r.nextPow2=function(t){return t+=0===t,--t,t|=t>>>1,t|=t>>>2,t|=t>>>4,t|=t>>>8,t|=t>>>16,t+1},r.prevPow2=function(t){return t|=t>>>1,t|=t>>>2,t|=t>>>4,t|=t>>>8,t|=t>>>16,t-(t>>>1)},r.parity=function(t){return t^=t>>>16,t^=t>>>8,t^=t>>>4,t&=15,27030>>>t&1};var o=new Array(256);!function(t){for(var e=0;e<256;++e){var r=e,n=e,i=7;for(r>>>=1;r;r>>>=1)n<<=1,n|=1&r,--i;t[e]=n<<i&255}}(o),r.reverse=function(t){return o[255&t]<<24|o[t>>>8&255]<<16|o[t>>>16&255]<<8|o[t>>>24&255]},r.interleave2=function(t,e){return t&=65535,t=16711935&(t|t<<8),t=252645135&(t|t<<4),t=858993459&(t|t<<2),t=1431655765&(t|t<<1),e&=65535,e=16711935&(e|e<<8),e=252645135&(e|e<<4),e=858993459&(e|e<<2),e=1431655765&(e|e<<1),t|e<<1},r.deinterleave2=function(t,e){return t=t>>>e&1431655765,t=858993459&(t|t>>>1),t=252645135&(t|t>>>2),t=16711935&(t|t>>>4),t=65535&(t|t>>>16),t<<16>>16},r.interleave3=function(t,e,r){return t&=1023,t=4278190335&(t|t<<16),t=251719695&(t|t<<8),t=3272356035&(t|t<<4),t=1227133513&(t|t<<2),e&=1023,e=4278190335&(e|e<<16),e=251719695&(e|e<<8),e=3272356035&(e|e<<4),e=1227133513&(e|e<<2),t|=e<<1,r&=1023,r=4278190335&(r|r<<16),r=251719695&(r|r<<8),r=3272356035&(r|r<<4),r=1227133513&(r|r<<2),t|r<<2},r.deinterleave3=function(t,e){return t=t>>>e&1227133513,t=3272356035&(t|t>>>2),t=251719695&(t|t>>>4),t=4278190335&(t|t>>>8),t=1023&(t|t>>>16),t<<22>>22},r.nextCombination=function(t){var e=t|t-1;return e+1|(~e&-~e)-1>>>n(t)+1}},{}],2:[function(t,e,r){\"use strict\";function n(t,e,r){r=r||2;var n=e&&e.length,o=n?e[0]*r:t.length,a=i(t,0,o,r,!0),u=[];if(!a)return u;var h,l,d,f,p,v,y;if(n&&(a=c(t,e,a,r)),t.length>80*r){h=d=t[0],l=f=t[1];for(var g=r;g<o;g+=r)p=t[g],v=t[g+1],p<h&&(h=p),v<l&&(l=v),p>d&&(d=p),v>f&&(f=v);y=Math.max(d-h,f-l)}return s(a,u,r,h,l,y),u}function i(t,e,r,n,i){var o,s;if(i===A(t,e,r,n)>0)for(o=e;o<r;o+=n)s=P(o,t[o],t[o+1],s);else for(o=r-n;o>=e;o-=n)s=P(o,t[o],t[o+1],s);return s&&T(s,s.next)&&(C(s),s=s.next),s}function o(t,e){if(!t)return t;e||(e=t);var r,n=t;do if(r=!1,n.steiner||!T(n,n.next)&&0!==x(n.prev,n,n.next))n=n.next;else{if(C(n),n=e=n.prev,n===n.next)return null;r=!0}while(r||n!==e);return e}function s(t,e,r,n,i,c,d){if(t){!d&&c&&v(t,n,i,c);for(var f,p,y=t;t.prev!==t.next;)if(f=t.prev,p=t.next,c?u(t,n,i,c):a(t))e.push(f.i/r),e.push(t.i/r),e.push(p.i/r),C(t),t=p.next,y=p.next;else if(t=p,t===y){d?1===d?(t=h(t,e,r),s(t,e,r,n,i,c,2)):2===d&&l(t,e,r,n,i,c):s(o(t),e,r,n,i,c,1);break}}}function a(t){var e=t.prev,r=t,n=t.next;if(x(e,r,n)>=0)return!1;for(var i=t.next.next;i!==t.prev;){if(_(e.x,e.y,r.x,r.y,n.x,n.y,i.x,i.y)&&x(i.prev,i,i.next)>=0)return!1;i=i.next}return!0}function u(t,e,r,n){var i=t.prev,o=t,s=t.next;if(x(i,o,s)>=0)return!1;for(var a=i.x<o.x?i.x<s.x?i.x:s.x:o.x<s.x?o.x:s.x,u=i.y<o.y?i.y<s.y?i.y:s.y:o.y<s.y?o.y:s.y,h=i.x>o.x?i.x>s.x?i.x:s.x:o.x>s.x?o.x:s.x,l=i.y>o.y?i.y>s.y?i.y:s.y:o.y>s.y?o.y:s.y,c=g(a,u,e,r,n),d=g(h,l,e,r,n),f=t.nextZ;f&&f.z<=d;){if(f!==t.prev&&f!==t.next&&_(i.x,i.y,o.x,o.y,s.x,s.y,f.x,f.y)&&x(f.prev,f,f.next)>=0)return!1;f=f.nextZ}for(f=t.prevZ;f&&f.z>=c;){if(f!==t.prev&&f!==t.next&&_(i.x,i.y,o.x,o.y,s.x,s.y,f.x,f.y)&&x(f.prev,f,f.next)>=0)return!1;f=f.prevZ}return!0}function h(t,e,r){var n=t;do{var i=n.prev,o=n.next.next;!T(i,o)&&w(i,n,n.next,o)&&O(i,o)&&O(o,i)&&(e.push(i.i/r),e.push(n.i/r),e.push(o.i/r),C(n),C(n.next),n=t=o),n=n.next}while(n!==t);return n}function l(t,e,r,n,i,a){var u=t;do{for(var h=u.next.next;h!==u.prev;){if(u.i!==h.i&&b(u,h)){var l=M(u,h);return u=o(u,u.next),l=o(l,l.next),s(u,e,r,n,i,a),void s(l,e,r,n,i,a)}h=h.next}u=u.next}while(u!==t)}function c(t,e,r,n){var s,a,u,h,l,c=[];for(s=0,a=e.length;s<a;s++)u=e[s]*n,h=s<a-1?e[s+1]*n:t.length,l=i(t,u,h,n,!1),l===l.next&&(l.steiner=!0),c.push(m(l));for(c.sort(d),s=0;s<c.length;s++)f(c[s],r),r=o(r,r.next);return r}function d(t,e){return t.x-e.x}function f(t,e){if(e=p(t,e)){var r=M(e,t);o(r,r.next)}}function p(t,e){var r,n=e,i=t.x,o=t.y,s=-(1/0);do{if(o<=n.y&&o>=n.next.y){var a=n.x+(o-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(a<=i&&a>s){if(s=a,a===i){if(o===n.y)return n;if(o===n.next.y)return n.next}r=n.x<n.next.x?n:n.next}}n=n.next}while(n!==e);if(!r)return null;if(i===s)return r.prev;var u,h=r,l=r.x,c=r.y,d=1/0;for(n=r.next;n!==h;)i>=n.x&&n.x>=l&&_(o<c?i:s,o,l,c,o<c?s:i,o,n.x,n.y)&&(u=Math.abs(o-n.y)/(i-n.x),(u<d||u===d&&n.x>r.x)&&O(n,t)&&(r=n,d=u)),n=n.next;return r}function v(t,e,r,n){var i=t;do null===i.z&&(i.z=g(i.x,i.y,e,r,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==t);i.prevZ.nextZ=null,i.prevZ=null,y(i)}function y(t){var e,r,n,i,o,s,a,u,h=1;do{for(r=t,t=null,o=null,s=0;r;){for(s++,n=r,a=0,e=0;e<h&&(a++,n=n.nextZ,n);e++);for(u=h;a>0||u>0&&n;)0===a?(i=n,n=n.nextZ,u--):0!==u&&n?r.z<=n.z?(i=r,r=r.nextZ,a--):(i=n,n=n.nextZ,u--):(i=r,r=r.nextZ,a--),o?o.nextZ=i:t=i,i.prevZ=o,o=i;r=n}o.nextZ=null,h*=2}while(s>1);return t}function g(t,e,r,n,i){return t=32767*(t-r)/i,e=32767*(e-n)/i,t=16711935&(t|t<<8),t=252645135&(t|t<<4),t=858993459&(t|t<<2),t=1431655765&(t|t<<1),e=16711935&(e|e<<8),e=252645135&(e|e<<4),e=858993459&(e|e<<2),e=1431655765&(e|e<<1),t|e<<1}function m(t){var e=t,r=t;do e.x<r.x&&(r=e),e=e.next;while(e!==t);return r}function _(t,e,r,n,i,o,s,a){return(i-s)*(e-a)-(t-s)*(o-a)>=0&&(t-s)*(n-a)-(r-s)*(e-a)>=0&&(r-s)*(o-a)-(i-s)*(n-a)>=0}function b(t,e){return t.next.i!==e.i&&t.prev.i!==e.i&&!E(t,e)&&O(t,e)&&O(e,t)&&S(t,e)}function x(t,e,r){return(e.y-t.y)*(r.x-e.x)-(e.x-t.x)*(r.y-e.y)}function T(t,e){return t.x===e.x&&t.y===e.y}function w(t,e,r,n){return!!(T(t,e)&&T(r,n)||T(t,n)&&T(r,e))||x(t,e,r)>0!=x(t,e,n)>0&&x(r,n,t)>0!=x(r,n,e)>0}function E(t,e){var r=t;do{if(r.i!==t.i&&r.next.i!==t.i&&r.i!==e.i&&r.next.i!==e.i&&w(r,r.next,t,e))return!0;r=r.next}while(r!==t);return!1}function O(t,e){return x(t.prev,t,t.next)<0?x(t,e,t.next)>=0&&x(t,t.prev,e)>=0:x(t,e,t.prev)<0||x(t,t.next,e)<0}function S(t,e){var r=t,n=!1,i=(t.x+e.x)/2,o=(t.y+e.y)/2;do r.y>o!=r.next.y>o&&i<(r.next.x-r.x)*(o-r.y)/(r.next.y-r.y)+r.x&&(n=!n),r=r.next;while(r!==t);return n}function M(t,e){var r=new R(t.i,t.x,t.y),n=new R(e.i,e.x,e.y),i=t.next,o=e.prev;return t.next=e,e.prev=t,r.next=i,i.prev=r,n.next=r,r.prev=n,o.next=n,n.prev=o,n}function P(t,e,r,n){var i=new R(t,e,r);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function C(t){t.next.prev=t.prev,t.prev.next=t.next,t.prevZ&&(t.prevZ.nextZ=t.nextZ),t.nextZ&&(t.nextZ.prevZ=t.prevZ)}function R(t,e,r){this.i=t,this.x=e,this.y=r,this.prev=null,this.next=null,this.z=null,this.prevZ=null,this.nextZ=null,this.steiner=!1}function A(t,e,r,n){for(var i=0,o=e,s=r-n;o<r;o+=n)i+=(t[s]-t[o])*(t[o+1]+t[s+1]),s=o;return i}e.exports=n,n.deviation=function(t,e,r,n){var i=e&&e.length,o=i?e[0]*r:t.length,s=Math.abs(A(t,0,o,r));if(i)for(var a=0,u=e.length;a<u;a++){var h=e[a]*r,l=a<u-1?e[a+1]*r:t.length;s-=Math.abs(A(t,h,l,r))}var c=0;for(a=0;a<n.length;a+=3){var d=n[a]*r,f=n[a+1]*r,p=n[a+2]*r;c+=Math.abs((t[d]-t[p])*(t[f+1]-t[d+1])-(t[d]-t[f])*(t[p+1]-t[d+1]))}return 0===s&&0===c?0:Math.abs((c-s)/s)},n.flatten=function(t){for(var e=t[0][0].length,r={vertices:[],holes:[],dimensions:e},n=0,i=0;i<t.length;i++){for(var o=0;o<t[i].length;o++)for(var s=0;s<e;s++)r.vertices.push(t[i][o][s]);i>0&&(n+=t[i-1].length,r.holes.push(n))}return r}},{}],3:[function(t,e,r){\"use strict\";function n(){}function i(t,e,r){this.fn=t,this.context=e,this.once=r||!1}function o(){this._events=new n,this._eventsCount=0}var s=Object.prototype.hasOwnProperty,a=\"~\";Object.create&&(n.prototype=Object.create(null),(new n).__proto__||(a=!1)),o.prototype.eventNames=function(){var t,e,r=[];if(0===this._eventsCount)return r;for(e in t=this._events)s.call(t,e)&&r.push(a?e.slice(1):e);return Object.getOwnPropertySymbols?r.concat(Object.getOwnPropertySymbols(t)):r},o.prototype.listeners=function(t,e){var r=a?a+t:t,n=this._events[r];if(e)return!!n;if(!n)return[];if(n.fn)return[n.fn];for(var i=0,o=n.length,s=new Array(o);i<o;i++)s[i]=n[i].fn;return s},o.prototype.emit=function(t,e,r,n,i,o){var s=a?a+t:t;if(!this._events[s])return!1;var u,h,l=this._events[s],c=arguments.length;if(l.fn){switch(l.once&&this.removeListener(t,l.fn,void 0,!0),c){case 1:return l.fn.call(l.context),!0;case 2:return l.fn.call(l.context,e),!0;case 3:return l.fn.call(l.context,e,r),!0;case 4:return l.fn.call(l.context,e,r,n),!0;case 5:return l.fn.call(l.context,e,r,n,i),!0;case 6:return l.fn.call(l.context,e,r,n,i,o),!0}for(h=1,u=new Array(c-1);h<c;h++)u[h-1]=arguments[h];l.fn.apply(l.context,u)}else{var d,f=l.length;for(h=0;h<f;h++)switch(l[h].once&&this.removeListener(t,l[h].fn,void 0,!0),c){case 1:l[h].fn.call(l[h].context);break;case 2:l[h].fn.call(l[h].context,e);break;case 3:l[h].fn.call(l[h].context,e,r);break;case 4:l[h].fn.call(l[h].context,e,r,n);break;default:if(!u)for(d=1,u=new Array(c-1);d<c;d++)u[d-1]=arguments[d];l[h].fn.apply(l[h].context,u)}}return!0},o.prototype.on=function(t,e,r){var n=new i(e,r||this),o=a?a+t:t;return this._events[o]?this._events[o].fn?this._events[o]=[this._events[o],n]:this._events[o].push(n):(this._events[o]=n,this._eventsCount++),this},o.prototype.once=function(t,e,r){var n=new i(e,r||this,(!0)),o=a?a+t:t;return this._events[o]?this._events[o].fn?this._events[o]=[this._events[o],n]:this._events[o].push(n):(this._events[o]=n,this._eventsCount++),this},o.prototype.removeListener=function(t,e,r,i){var o=a?a+t:t;if(!this._events[o])return this;if(!e)return 0===--this._eventsCount?this._events=new n:delete this._events[o],this;var s=this._events[o];if(s.fn)s.fn!==e||i&&!s.once||r&&s.context!==r||(0===--this._eventsCount?this._events=new n:delete this._events[o]);else{for(var u=0,h=[],l=s.length;u<l;u++)(s[u].fn!==e||i&&!s[u].once||r&&s[u].context!==r)&&h.push(s[u]);h.length?this._events[o]=1===h.length?h[0]:h:0===--this._eventsCount?this._events=new n:delete this._events[o]}return this},o.prototype.removeAllListeners=function(t){var e;return t?(e=a?a+t:t,this._events[e]&&(0===--this._eventsCount?this._events=new n:delete this._events[e])):(this._events=new n,this._eventsCount=0),this},o.prototype.off=o.prototype.removeListener,o.prototype.addListener=o.prototype.on,o.prototype.setMaxListeners=function(){return this},o.prefixed=a,o.EventEmitter=o,\"undefined\"!=typeof e&&(e.exports=o)},{}],4:[function(e,r,n){!function(e){var n=/iPhone/i,i=/iPod/i,o=/iPad/i,s=/(?=.*\\bAndroid\\b)(?=.*\\bMobile\\b)/i,a=/Android/i,u=/(?=.*\\bAndroid\\b)(?=.*\\bSD4930UR\\b)/i,h=/(?=.*\\bAndroid\\b)(?=.*\\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\\b)/i,l=/IEMobile/i,c=/(?=.*\\bWindows\\b)(?=.*\\bARM\\b)/i,d=/BlackBerry/i,f=/BB10/i,p=/Opera Mini/i,v=/(CriOS|Chrome)(?=.*\\bMobile\\b)/i,y=/(?=.*\\bFirefox\\b)(?=.*\\bMobile\\b)/i,g=new RegExp(\"(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)\",\"i\"),m=function(t,e){return t.test(e)},_=function(t){var e=t||navigator.userAgent,r=e.split(\"[FBAN\");if(\"undefined\"!=typeof r[1]&&(e=r[0]),r=e.split(\"Twitter\"),\"undefined\"!=typeof r[1]&&(e=r[0]),this.apple={phone:m(n,e),ipod:m(i,e),tablet:!m(n,e)&&m(o,e),device:m(n,e)||m(i,e)||m(o,e)},this.amazon={phone:m(u,e),tablet:!m(u,e)&&m(h,e),device:m(u,e)||m(h,e)},this.android={phone:m(u,e)||m(s,e),tablet:!m(u,e)&&!m(s,e)&&(m(h,e)||m(a,e)),device:m(u,e)||m(h,e)||m(s,e)||m(a,e)},this.windows={phone:m(l,e),tablet:m(c,e),device:m(l,e)||m(c,e)},this.other={blackberry:m(d,e),blackberry10:m(f,e),opera:m(p,e),firefox:m(y,e),chrome:m(v,e),device:m(d,e)||m(f,e)||m(p,e)||m(y,e)||m(v,e)},this.seven_inch=m(g,e),this.any=this.apple.device||this.android.device||this.windows.device||this.other.device||this.seven_inch,this.phone=this.apple.phone||this.android.phone||this.windows.phone,this.tablet=this.apple.tablet||this.android.tablet||this.windows.tablet,\"undefined\"==typeof window)return this},b=function(){var t=new _;return t.Class=_,t};\"undefined\"!=typeof r&&r.exports&&\"undefined\"==typeof window?r.exports=_:\"undefined\"!=typeof r&&r.exports&&\"undefined\"!=typeof window?r.exports=b():\"function\"==typeof t&&t.amd?t(\"isMobile\",[],e.isMobile=b()):e.isMobile=b()}(this)},{}],5:[function(t,e,r){\"use strict\";function n(t){if(null===t||void 0===t)throw new TypeError(\"Object.assign cannot be called with null or undefined\");return Object(t)}function i(){try{if(!Object.assign)return!1;var t=new String(\"abc\");if(t[5]=\"de\",\"5\"===Object.getOwnPropertyNames(t)[0])return!1;for(var e={},r=0;r<10;r++)e[\"_\"+String.fromCharCode(r)]=r;var n=Object.getOwnPropertyNames(e).map(function(t){return e[t]});if(\"0123456789\"!==n.join(\"\"))return!1;var i={};return\"abcdefghijklmnopqrst\".split(\"\").forEach(function(t){i[t]=t}),\"abcdefghijklmnopqrst\"===Object.keys(Object.assign({},i)).join(\"\")}catch(t){return!1}}var o=Object.prototype.hasOwnProperty,s=Object.prototype.propertyIsEnumerable;e.exports=i()?Object.assign:function(t,e){for(var r,i,a=n(t),u=1;u<arguments.length;u++){r=Object(arguments[u]);for(var h in r)o.call(r,h)&&(a[h]=r[h]);if(Object.getOwnPropertySymbols){i=Object.getOwnPropertySymbols(r);for(var l=0;l<i.length;l++)s.call(r,i[l])&&(a[i[l]]=r[i[l]])}}return a}},{}],6:[function(t,e,r){var n=new ArrayBuffer(0),i=function(t,e,r,i){this.gl=t,this.buffer=t.createBuffer(),this.type=e||t.ARRAY_BUFFER,this.drawType=i||t.STATIC_DRAW,this.data=n,r&&this.upload(r)};i.prototype.upload=function(t,e,r){r||this.bind();var n=this.gl;t=t||this.data,e=e||0,this.data.byteLength>=t.byteLength?n.bufferSubData(this.type,e,t):n.bufferData(this.type,t,this.drawType),this.data=t},i.prototype.bind=function(){var t=this.gl;t.bindBuffer(this.type,this.buffer)},i.createVertexBuffer=function(t,e,r){return new i(t,t.ARRAY_BUFFER,e,r)},i.createIndexBuffer=function(t,e,r){return new i(t,t.ELEMENT_ARRAY_BUFFER,e,r)},i.create=function(t,e,r,n){return new i(t,e,r,n)},i.prototype.destroy=function(){this.gl.deleteBuffer(this.buffer)},e.exports=i},{}],7:[function(t,e,r){var n=t(\"./GLTexture\"),i=function(t,e,r){this.gl=t,this.framebuffer=t.createFramebuffer(),this.stencil=null,this.texture=null,this.width=e||100,this.height=r||100};i.prototype.enableTexture=function(t){var e=this.gl;this.texture=t||new n(e),this.texture.bind(),this.bind(),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,this.texture.texture,0)},i.prototype.enableStencil=function(){if(!this.stencil){var t=this.gl;this.stencil=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,this.stencil),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.RENDERBUFFER,this.stencil),t.renderbufferStorage(t.RENDERBUFFER,t.DEPTH_STENCIL,this.width,this.height)}},i.prototype.clear=function(t,e,r,n){this.bind();var i=this.gl;i.clearColor(t,e,r,n),i.clear(i.COLOR_BUFFER_BIT)},i.prototype.bind=function(){var t=this.gl;t.bindFramebuffer(t.FRAMEBUFFER,this.framebuffer)},i.prototype.unbind=function(){var t=this.gl;t.bindFramebuffer(t.FRAMEBUFFER,null)},i.prototype.resize=function(t,e){var r=this.gl;this.width=t,this.height=e,this.texture&&this.texture.uploadData(null,t,e),this.stencil&&(r.bindRenderbuffer(r.RENDERBUFFER,this.stencil),r.renderbufferStorage(r.RENDERBUFFER,r.DEPTH_STENCIL,t,e))},i.prototype.destroy=function(){var t=this.gl;this.texture&&this.texture.destroy(),t.deleteFramebuffer(this.framebuffer),this.gl=null,this.stencil=null,this.texture=null},i.createRGBA=function(t,e,r,o){var s=n.fromData(t,null,e,r);s.enableNearestScaling(),s.enableWrapClamp();var a=new i(t,e,r);return a.enableTexture(s),a.unbind(),a},i.createFloat32=function(t,e,r,o){var s=new n.fromData(t,o,e,r);s.enableNearestScaling(),s.enableWrapClamp();var a=new i(t,e,r);return a.enableTexture(s),a.unbind(),a},e.exports=i},{\"./GLTexture\":9}],8:[function(t,e,r){var n=t(\"./shader/compileProgram\"),i=t(\"./shader/extractAttributes\"),o=t(\"./shader/extractUniforms\"),s=t(\"./shader/generateUniformAccessObject\"),a=function(t,e,r){this.gl=t,this.program=n(t,e,r),this.attributes=i(t,this.program);var a=o(t,this.program);this.uniforms=s(t,a)};a.prototype.bind=function(){this.gl.useProgram(this.program)},a.prototype.destroy=function(){},e.exports=a},{\"./shader/compileProgram\":14,\"./shader/extractAttributes\":16,\"./shader/extractUniforms\":17,\"./shader/generateUniformAccessObject\":18}],9:[function(t,e,r){var n=function(t,e,r,n,i){this.gl=t,this.texture=t.createTexture(),this.mipmap=!1,this.premultiplyAlpha=!1,this.width=e||-1,this.height=r||-1,this.format=n||t.RGBA,this.type=i||t.UNSIGNED_BYTE};n.prototype.upload=function(t){this.bind();var e=this.gl;e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,this.premultiplyAlpha);var r=t.videoWidth||t.width,n=t.videoHeight||t.height;n!==this.height||r!==this.width?e.texImage2D(e.TEXTURE_2D,0,this.format,this.format,this.type,t):e.texSubImage2D(e.TEXTURE_2D,0,0,0,this.format,this.type,t),this.width=r,this.height=n};var i=!1;n.prototype.uploadData=function(t,e,r){this.bind();var n=this.gl;if(t instanceof Float32Array){if(!i){var o=n.getExtension(\"OES_texture_float\");if(!o)throw new Error(\"floating point textures not available\");i=!0}this.type=n.FLOAT}else this.type=n.UNSIGNED_BYTE;n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,this.premultiplyAlpha),e!==this.width||r!==this.height?n.texImage2D(n.TEXTURE_2D,0,this.format,e,r,0,this.format,this.type,t||null):n.texSubImage2D(n.TEXTURE_2D,0,0,0,e,r,this.format,this.type,t||null),this.width=e,this.height=r},n.prototype.bind=function(t){var e=this.gl;void 0!==t&&e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,this.texture)},n.prototype.unbind=function(){var t=this.gl;t.bindTexture(t.TEXTURE_2D,null)},n.prototype.minFilter=function(t){var e=this.gl;this.bind(),this.mipmap?e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,t?e.LINEAR_MIPMAP_LINEAR:e.NEAREST_MIPMAP_NEAREST):e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,t?e.LINEAR:e.NEAREST)},n.prototype.magFilter=function(t){var e=this.gl;this.bind(),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,t?e.LINEAR:e.NEAREST)},n.prototype.enableMipmap=function(){var t=this.gl;this.bind(),this.mipmap=!0,t.generateMipmap(t.TEXTURE_2D)},n.prototype.enableLinearScaling=function(){this.minFilter(!0),this.magFilter(!0)},n.prototype.enableNearestScaling=function(){this.minFilter(!1),this.magFilter(!1)},n.prototype.enableWrapClamp=function(){var t=this.gl;this.bind(),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)},n.prototype.enableWrapRepeat=function(){var t=this.gl;this.bind(),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.REPEAT),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.REPEAT)},n.prototype.enableWrapMirrorRepeat=function(){var t=this.gl;this.bind(),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.MIRRORED_REPEAT),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.MIRRORED_REPEAT)},n.prototype.destroy=function(){var t=this.gl;t.deleteTexture(this.texture)},n.fromSource=function(t,e,r){var i=new n(t);return i.premultiplyAlpha=r||!1,i.upload(e),i},n.fromData=function(t,e,r,i){var o=new n(t);return o.uploadData(e,r,i),o},e.exports=n},{}],10:[function(t,e,r){function n(t,e){if(this.nativeVaoExtension=null,n.FORCE_NATIVE||(this.nativeVaoExtension=t.getExtension(\"OES_vertex_array_object\")||t.getExtension(\"MOZ_OES_vertex_array_object\")||t.getExtension(\"WEBKIT_OES_vertex_array_object\")),this.nativeState=e,this.nativeVaoExtension){this.nativeVao=this.nativeVaoExtension.createVertexArrayOES();var r=t.getParameter(t.MAX_VERTEX_ATTRIBS);this.nativeState={tempAttribState:new Array(r),attribState:new Array(r)}}this.gl=t,this.attributes=[],this.indexBuffer=null,this.dirty=!1}var i=t(\"./setVertexAttribArrays\");n.prototype.constructor=n,e.exports=n,n.FORCE_NATIVE=!1,n.prototype.bind=function(){return this.nativeVao?(this.nativeVaoExtension.bindVertexArrayOES(this.nativeVao),this.dirty&&(this.dirty=!1,this.activate())):this.activate(),this},n.prototype.unbind=function(){return this.nativeVao&&this.nativeVaoExtension.bindVertexArrayOES(null),this},n.prototype.activate=function(){for(var t=this.gl,e=null,r=0;r<this.attributes.length;r++){var n=this.attributes[r];e!==n.buffer&&(n.buffer.bind(),e=n.buffer),t.vertexAttribPointer(n.attribute.location,n.attribute.size,n.type||t.FLOAT,n.normalized||!1,n.stride||0,n.start||0)}return i(t,this.attributes,this.nativeState),this.indexBuffer.bind(),this},n.prototype.addAttribute=function(t,e,r,n,i,o){return this.attributes.push({buffer:t,attribute:e,location:e.location,type:r||this.gl.FLOAT,normalized:n||!1,stride:i||0,start:o||0}),this.dirty=!0,this},n.prototype.addIndex=function(t){return this.indexBuffer=t,this.dirty=!0,this},n.prototype.clear=function(){return this.nativeVao&&this.nativeVaoExtension.bindVertexArrayOES(this.nativeVao),this.attributes.length=0,this.indexBuffer=null,this},n.prototype.draw=function(t,e,r){var n=this.gl;return n.drawElements(t,e,n.UNSIGNED_SHORT,r||0),this},n.prototype.destroy=function(){this.gl=null,this.indexBuffer=null,this.attributes=null,this.nativeState=null,this.nativeVao&&this.nativeVaoExtension.deleteVertexArrayOES(this.nativeVao),this.nativeVaoExtension=null,this.nativeVao=null}},{\"./setVertexAttribArrays\":13}],11:[function(t,e,r){var n=function(t,e){var r=t.getContext(\"webgl\",e)||t.getContext(\"experimental-webgl\",e);if(!r)throw new Error(\"This browser does not support webGL. Try using the canvas renderer\");return r};e.exports=n},{}],12:[function(t,e,r){var n={createContext:t(\"./createContext\"),setVertexAttribArrays:t(\"./setVertexAttribArrays\"),GLBuffer:t(\"./GLBuffer\"),GLFramebuffer:t(\"./GLFramebuffer\"),GLShader:t(\"./GLShader\"),GLTexture:t(\"./GLTexture\"),VertexArrayObject:t(\"./VertexArrayObject\"),shader:t(\"./shader\")};\"undefined\"!=typeof e&&e.exports&&(e.exports=n),\"undefined\"!=typeof window&&(window.PIXI=window.PIXI||{},window.PIXI.glCore=n)},{\"./GLBuffer\":6,\"./GLFramebuffer\":7,\"./GLShader\":8,\"./GLTexture\":9,\"./VertexArrayObject\":10,\"./createContext\":11,\"./setVertexAttribArrays\":13,\"./shader\":19}],13:[function(t,e,r){var n=function(t,e,r){var n;if(r){var i=r.tempAttribState,o=r.attribState;for(n=0;n<i.length;n++)i[n]=!1;for(n=0;n<e.length;n++)i[e[n].attribute.location]=!0;for(n=0;n<o.length;n++)o[n]!==i[n]&&(o[n]=i[n],r.attribState[n]?t.enableVertexAttribArray(n):t.disableVertexAttribArray(n))}else for(n=0;n<e.length;n++){var s=e[n];t.enableVertexAttribArray(s.attribute.location)}};e.exports=n},{}],14:[function(t,e,r){var n=function(t,e,r){var n=i(t,t.VERTEX_SHADER,e),o=i(t,t.FRAGMENT_SHADER,r),s=t.createProgram();return t.attachShader(s,n),t.attachShader(s,o),t.linkProgram(s),t.getProgramParameter(s,t.LINK_STATUS)||(console.error(\"Pixi.js Error: Could not initialize shader.\"),console.error(\"gl.VALIDATE_STATUS\",t.getProgramParameter(s,t.VALIDATE_STATUS)),console.error(\"gl.getError()\",t.getError()),\"\"!==t.getProgramInfoLog(s)&&console.warn(\"Pixi.js Warning: gl.getProgramInfoLog()\",t.getProgramInfoLog(s)),t.deleteProgram(s),s=null),t.deleteShader(n),t.deleteShader(o),s},i=function(t,e,r){var n=t.createShader(e);return t.shaderSource(n,r),t.compileShader(n),t.getShaderParameter(n,t.COMPILE_STATUS)?n:(console.log(t.getShaderInfoLog(n)),null)};e.exports=n},{}],15:[function(t,e,r){var n=function(t,e){switch(t){case\"float\":return 0;case\"vec2\":return new Float32Array(2*e);case\"vec3\":return new Float32Array(3*e);case\"vec4\":return new Float32Array(4*e);case\"int\":case\"sampler2D\":return 0;case\"ivec2\":return new Int32Array(2*e);case\"ivec3\":return new Int32Array(3*e);case\"ivec4\":return new Int32Array(4*e);case\"bool\":return!1;case\"bvec2\":return i(2*e);case\"bvec3\":return i(3*e);case\"bvec4\":return i(4*e);case\"mat2\":return new Float32Array([1,0,0,1]);case\"mat3\":return new Float32Array([1,0,0,0,1,0,0,0,1]);case\"mat4\":return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}},i=function(t){for(var e=new Array(t),r=0;r<e.length;r++)e[r]=!1;return e};e.exports=n},{}],16:[function(t,e,r){var n=t(\"./mapType\"),i=t(\"./mapSize\"),o=function(t,e){for(var r={},o=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES),a=0;a<o;a++){var u=t.getActiveAttrib(e,a),h=n(t,u.type);r[u.name]={type:h,size:i(h),location:t.getAttribLocation(e,u.name),pointer:s}}return r},s=function(t,e,r,n){gl.vertexAttribPointer(this.location,this.size,t||gl.FLOAT,e||!1,r||0,n||0)};e.exports=o},{\"./mapSize\":20,\"./mapType\":21}],17:[function(t,e,r){var n=t(\"./mapType\"),i=t(\"./defaultValue\"),o=function(t,e){for(var r={},o=t.getProgramParameter(e,t.ACTIVE_UNIFORMS),s=0;s<o;s++){var a=t.getActiveUniform(e,s),u=a.name.replace(/\\[.*?\\]/,\"\"),h=n(t,a.type);r[u]={type:h,size:a.size,location:t.getUniformLocation(e,u),value:i(h,a.size)}}return r};e.exports=o},{\"./defaultValue\":15,\"./mapType\":21}],18:[function(t,e,r){var n=function(t,e){var r={data:{}};r.gl=t;for(var n=Object.keys(e),a=0;a<n.length;a++){var u=n[a],h=u.split(\".\"),l=h[h.length-1],c=s(h,r),d=e[u];c.data[l]=d,c.gl=t,Object.defineProperty(c,l,{get:i(l),set:o(l,d)})}return r},i=function(t){var e=a.replace(\"%%\",t);return new Function(e)},o=function(t,e){var r,n=u.replace(/%%/g,t);return r=1===e.size?h[e.type]:l[e.type],r&&(n+=\"\\nthis.gl.\"+r+\";\"),new Function(\"value\",n)},s=function(t,e){for(var r=e,n=0;n<t.length-1;n++){var i=r[t[n]]||{data:{}};r[t[n]]=i,r=i}return r},a=[\"return this.data.%%.value;\"].join(\"\\n\"),u=[\"this.data.%%.value = value;\",\"var location = this.data.%%.location;\"].join(\"\\n\"),h={float:\"uniform1f(location, value)\",vec2:\"uniform2f(location, value[0], value[1])\",vec3:\"uniform3f(location, value[0], value[1], value[2])\",vec4:\"uniform4f(location, value[0], value[1], value[2], value[3])\",int:\"uniform1i(location, value)\",ivec2:\"uniform2i(location, value[0], value[1])\",ivec3:\"uniform3i(location, value[0], value[1], value[2])\",ivec4:\"uniform4i(location, value[0], value[1], value[2], value[3])\",bool:\"uniform1i(location, value)\",bvec2:\"uniform2i(location, value[0], value[1])\",bvec3:\"uniform3i(location, value[0], value[1], value[2])\",bvec4:\"uniform4i(location, value[0], value[1], value[2], value[3])\",mat2:\"uniformMatrix2fv(location, false, value)\",mat3:\"uniformMatrix3fv(location, false, value)\",mat4:\"uniformMatrix4fv(location, false, value)\",sampler2D:\"uniform1i(location, value)\"},l={float:\"uniform1fv(location, value)\",vec2:\"uniform2fv(location, value)\",vec3:\"uniform3fv(location, value)\",vec4:\"uniform4fv(location, value)\",int:\"uniform1iv(location, value)\",ivec2:\"uniform2iv(location, value)\",ivec3:\"uniform3iv(location, value)\",ivec4:\"uniform4iv(location, value)\",bool:\"uniform1iv(location, value)\",bvec2:\"uniform2iv(location, value)\",bvec3:\"uniform3iv(location, value)\",bvec4:\"uniform4iv(location, value)\",sampler2D:\"uniform1iv(location, value)\"};e.exports=n},{}],19:[function(t,e,r){e.exports={compileProgram:t(\"./compileProgram\"),defaultValue:t(\"./defaultValue\"),extractAttributes:t(\"./extractAttributes\"),extractUniforms:t(\"./extractUniforms\"),generateUniformAccessObject:t(\"./generateUniformAccessObject\"),mapSize:t(\"./mapSize\"),mapType:t(\"./mapType\")}},{\"./compileProgram\":14,\"./defaultValue\":15,\"./extractAttributes\":16,\"./extractUniforms\":17,\"./generateUniformAccessObject\":18,\"./mapSize\":20,\"./mapType\":21}],20:[function(t,e,r){var n=function(t){return i[t]},i={float:1,vec2:2,vec3:3,vec4:4,int:1,ivec2:2,ivec3:3,ivec4:4,bool:1,bvec2:2,bvec3:3,bvec4:4,mat2:4,mat3:9,mat4:16,sampler2D:1};e.exports=n},{}],21:[function(t,e,r){var n=function(t,e){if(!i){var r=Object.keys(o);i={};for(var n=0;n<r.length;++n){var s=r[n];i[t[s]]=o[s]}}return i[e]},i=null,o={FLOAT:\"float\",FLOAT_VEC2:\"vec2\",FLOAT_VEC3:\"vec3\",FLOAT_VEC4:\"vec4\",INT:\"int\",INT_VEC2:\"ivec2\",INT_VEC3:\"ivec3\",INT_VEC4:\"ivec4\",BOOL:\"bool\",BOOL_VEC2:\"bvec2\",BOOL_VEC3:\"bvec3\",BOOL_VEC4:\"bvec4\",FLOAT_MAT2:\"mat2\",FLOAT_MAT3:\"mat3\",FLOAT_MAT4:\"mat4\",SAMPLER_2D:\"sampler2D\"};e.exports=n},{}],22:[function(t,e,r){(function(t){function e(t,e){for(var r=0,n=t.length-1;n>=0;n--){var i=t[n];\".\"===i?t.splice(n,1):\"..\"===i?(t.splice(n,1),r++):r&&(t.splice(n,1),r--)}if(e)for(;r--;r)t.unshift(\"..\");return t}function n(t,e){if(t.filter)return t.filter(e);for(var r=[],n=0;n<t.length;n++)e(t[n],n,t)&&r.push(t[n]);return r}var i=/^(\\/?|)([\\s\\S]*?)((?:\\.{1,2}|[^\\/]+?|)(\\.[^.\\/]*|))(?:[\\/]*)$/,o=function(t){return i.exec(t).slice(1)};r.resolve=function(){for(var r=\"\",i=!1,o=arguments.length-1;o>=-1&&!i;o--){var s=o>=0?arguments[o]:t.cwd();if(\"string\"!=typeof s)throw new TypeError(\"Arguments to path.resolve must be strings\");s&&(r=s+\"/\"+r,i=\"/\"===s.charAt(0))}return r=e(n(r.split(\"/\"),function(t){return!!t}),!i).join(\"/\"),(i?\"/\":\"\")+r||\".\"},r.normalize=function(t){var i=r.isAbsolute(t),o=\"/\"===s(t,-1);return t=e(n(t.split(\"/\"),function(t){return!!t}),!i).join(\"/\"),t||i||(t=\".\"),t&&o&&(t+=\"/\"),(i?\"/\":\"\")+t},r.isAbsolute=function(t){return\"/\"===t.charAt(0)},r.join=function(){var t=Array.prototype.slice.call(arguments,0);return r.normalize(n(t,function(t,e){if(\"string\"!=typeof t)throw new TypeError(\"Arguments to path.join must be strings\");return t}).join(\"/\"))},r.relative=function(t,e){function n(t){for(var e=0;e<t.length&&\"\"===t[e];e++);for(var r=t.length-1;r>=0&&\"\"===t[r];r--);return e>r?[]:t.slice(e,r-e+1)}t=r.resolve(t).substr(1),e=r.resolve(e).substr(1);for(var i=n(t.split(\"/\")),o=n(e.split(\"/\")),s=Math.min(i.length,o.length),a=s,u=0;u<s;u++)if(i[u]!==o[u]){a=u;break}for(var h=[],u=a;u<i.length;u++)h.push(\"..\");return h=h.concat(o.slice(a)),h.join(\"/\")},r.sep=\"/\",r.delimiter=\":\",r.dirname=function(t){var e=o(t),r=e[0],n=e[1];return r||n?(n&&(n=n.substr(0,n.length-1)),r+n):\".\"},r.basename=function(t,e){var r=o(t)[2];return e&&r.substr(-1*e.length)===e&&(r=r.substr(0,r.length-e.length)),r},r.extname=function(t){return o(t)[3]};var s=\"b\"===\"ab\".substr(-1)?function(t,e,r){return t.substr(e,r)}:function(t,e,r){return e<0&&(e=t.length+e),t.substr(e,r)}}).call(this,t(\"_process\"))},{_process:23}],23:[function(t,e,r){function n(){throw new Error(\"setTimeout has not been defined\")}function i(){throw new Error(\"clearTimeout has not been defined\")}function o(t){if(c===setTimeout)return setTimeout(t,0);if((c===n||!c)&&setTimeout)return c=setTimeout,setTimeout(t,0);try{return c(t,0)}catch(e){try{return c.call(null,t,0)}catch(e){return c.call(this,t,0)}}}function s(t){if(d===clearTimeout)return clearTimeout(t);if((d===i||!d)&&clearTimeout)return d=clearTimeout,clearTimeout(t);try{return d(t)}catch(e){try{return d.call(null,t)}catch(e){return d.call(this,t)}}}function a(){y&&p&&(y=!1,p.length?v=p.concat(v):g=-1,v.length&&u())}function u(){if(!y){var t=o(a);y=!0;for(var e=v.length;e;){for(p=v,v=[];++g<e;)p&&p[g].run();g=-1,e=v.length}p=null,y=!1,s(t)}}function h(t,e){this.fun=t,this.array=e}function l(){}var c,d,f=e.exports={};!function(){try{c=\"function\"==typeof setTimeout?setTimeout:n}catch(t){c=n}try{d=\"function\"==typeof clearTimeout?clearTimeout:i;\r\n}catch(t){d=i}}();var p,v=[],y=!1,g=-1;f.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)e[r-1]=arguments[r];v.push(new h(t,e)),1!==v.length||y||o(u)},h.prototype.run=function(){this.fun.apply(null,this.array)},f.title=\"browser\",f.browser=!0,f.env={},f.argv=[],f.version=\"\",f.versions={},f.on=l,f.addListener=l,f.once=l,f.off=l,f.removeListener=l,f.removeAllListeners=l,f.emit=l,f.binding=function(t){throw new Error(\"process.binding is not supported\")},f.cwd=function(){return\"/\"},f.chdir=function(t){throw new Error(\"process.chdir is not supported\")},f.umask=function(){return 0}},{}],24:[function(e,r,n){(function(e){!function(i){function o(t){throw new RangeError(L[t])}function s(t,e){for(var r=t.length,n=[];r--;)n[r]=e(t[r]);return n}function a(t,e){var r=t.split(\"@\"),n=\"\";r.length>1&&(n=r[0]+\"@\",t=r[1]),t=t.replace(I,\".\");var i=t.split(\".\"),o=s(i,e).join(\".\");return n+o}function u(t){for(var e,r,n=[],i=0,o=t.length;i<o;)e=t.charCodeAt(i++),e>=55296&&e<=56319&&i<o?(r=t.charCodeAt(i++),56320==(64512&r)?n.push(((1023&e)<<10)+(1023&r)+65536):(n.push(e),i--)):n.push(e);return n}function h(t){return s(t,function(t){var e=\"\";return t>65535&&(t-=65536,e+=F(t>>>10&1023|55296),t=56320|1023&t),e+=F(t)}).join(\"\")}function l(t){return t-48<10?t-22:t-65<26?t-65:t-97<26?t-97:w}function c(t,e){return t+22+75*(t<26)-((0!=e)<<5)}function d(t,e,r){var n=0;for(t=r?B(t/M):t>>1,t+=B(t/e);t>j*O>>1;n+=w)t=B(t/j);return B(n+(j+1)*t/(t+S))}function f(t){var e,r,n,i,s,a,u,c,f,p,v=[],y=t.length,g=0,m=C,_=P;for(r=t.lastIndexOf(R),r<0&&(r=0),n=0;n<r;++n)t.charCodeAt(n)>=128&&o(\"not-basic\"),v.push(t.charCodeAt(n));for(i=r>0?r+1:0;i<y;){for(s=g,a=1,u=w;i>=y&&o(\"invalid-input\"),c=l(t.charCodeAt(i++)),(c>=w||c>B((T-g)/a))&&o(\"overflow\"),g+=c*a,f=u<=_?E:u>=_+O?O:u-_,!(c<f);u+=w)p=w-f,a>B(T/p)&&o(\"overflow\"),a*=p;e=v.length+1,_=d(g-s,e,0==s),B(g/e)>T-m&&o(\"overflow\"),m+=B(g/e),g%=e,v.splice(g++,0,m)}return h(v)}function p(t){var e,r,n,i,s,a,h,l,f,p,v,y,g,m,_,b=[];for(t=u(t),y=t.length,e=C,r=0,s=P,a=0;a<y;++a)v=t[a],v<128&&b.push(F(v));for(n=i=b.length,i&&b.push(R);n<y;){for(h=T,a=0;a<y;++a)v=t[a],v>=e&&v<h&&(h=v);for(g=n+1,h-e>B((T-r)/g)&&o(\"overflow\"),r+=(h-e)*g,e=h,a=0;a<y;++a)if(v=t[a],v<e&&++r>T&&o(\"overflow\"),v==e){for(l=r,f=w;p=f<=s?E:f>=s+O?O:f-s,!(l<p);f+=w)_=l-p,m=w-p,b.push(F(c(p+_%m,0))),l=B(_/m);b.push(F(c(l,0))),s=d(r,g,n==i),r=0,++n}++r,++e}return b.join(\"\")}function v(t){return a(t,function(t){return A.test(t)?f(t.slice(4).toLowerCase()):t})}function y(t){return a(t,function(t){return D.test(t)?\"xn--\"+p(t):t})}var g=\"object\"==typeof n&&n&&!n.nodeType&&n,m=\"object\"==typeof r&&r&&!r.nodeType&&r,_=\"object\"==typeof e&&e;_.global!==_&&_.window!==_&&_.self!==_||(i=_);var b,x,T=2147483647,w=36,E=1,O=26,S=38,M=700,P=72,C=128,R=\"-\",A=/^xn--/,D=/[^\\x20-\\x7E]/,I=/[\\x2E\\u3002\\uFF0E\\uFF61]/g,L={overflow:\"Overflow: input needs wider integers to process\",\"not-basic\":\"Illegal input >= 0x80 (not a basic code point)\",\"invalid-input\":\"Invalid input\"},j=w-E,B=Math.floor,F=String.fromCharCode;if(b={version:\"1.4.1\",ucs2:{decode:u,encode:h},decode:f,encode:p,toASCII:y,toUnicode:v},\"function\"==typeof t&&\"object\"==typeof t.amd&&t.amd)t(\"punycode\",function(){return b});else if(g&&m)if(r.exports==g)m.exports=b;else for(x in b)b.hasOwnProperty(x)&&(g[x]=b[x]);else i.punycode=b}(this)}).call(this,\"undefined\"!=typeof global?global:\"undefined\"!=typeof self?self:\"undefined\"!=typeof window?window:{})},{}],25:[function(t,e,r){\"use strict\";function n(t,e){return Object.prototype.hasOwnProperty.call(t,e)}e.exports=function(t,e,r,o){e=e||\"&\",r=r||\"=\";var s={};if(\"string\"!=typeof t||0===t.length)return s;var a=/\\+/g;t=t.split(e);var u=1e3;o&&\"number\"==typeof o.maxKeys&&(u=o.maxKeys);var h=t.length;u>0&&h>u&&(h=u);for(var l=0;l<h;++l){var c,d,f,p,v=t[l].replace(a,\"%20\"),y=v.indexOf(r);y>=0?(c=v.substr(0,y),d=v.substr(y+1)):(c=v,d=\"\"),f=decodeURIComponent(c),p=decodeURIComponent(d),n(s,f)?i(s[f])?s[f].push(p):s[f]=[s[f],p]:s[f]=p}return s};var i=Array.isArray||function(t){return\"[object Array]\"===Object.prototype.toString.call(t)}},{}],26:[function(t,e,r){\"use strict\";function n(t,e){if(t.map)return t.map(e);for(var r=[],n=0;n<t.length;n++)r.push(e(t[n],n));return r}var i=function(t){switch(typeof t){case\"string\":return t;case\"boolean\":return t?\"true\":\"false\";case\"number\":return isFinite(t)?t:\"\";default:return\"\"}};e.exports=function(t,e,r,a){return e=e||\"&\",r=r||\"=\",null===t&&(t=void 0),\"object\"==typeof t?n(s(t),function(s){var a=encodeURIComponent(i(s))+r;return o(t[s])?n(t[s],function(t){return a+encodeURIComponent(i(t))}).join(e):a+encodeURIComponent(i(t[s]))}).join(e):a?encodeURIComponent(i(a))+r+encodeURIComponent(i(t)):\"\"};var o=Array.isArray||function(t){return\"[object Array]\"===Object.prototype.toString.call(t)},s=Object.keys||function(t){var e=[];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.push(r);return e}},{}],27:[function(t,e,r){\"use strict\";r.decode=r.parse=t(\"./decode\"),r.encode=r.stringify=t(\"./encode\")},{\"./decode\":25,\"./encode\":26}],28:[function(t,e,r){\"use strict\";function n(){this.protocol=null,this.slashes=null,this.auth=null,this.host=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.query=null,this.pathname=null,this.path=null,this.href=null}function i(t,e,r){if(t&&h.isObject(t)&&t instanceof n)return t;var i=new n;return i.parse(t,e,r),i}function o(t){return h.isString(t)&&(t=i(t)),t instanceof n?t.format():n.prototype.format.call(t)}function s(t,e){return i(t,!1,!0).resolve(e)}function a(t,e){return t?i(t,!1,!0).resolveObject(e):e}var u=t(\"punycode\"),h=t(\"./util\");r.parse=i,r.resolve=s,r.resolveObject=a,r.format=o,r.Url=n;var l=/^([a-z0-9.+-]+:)/i,c=/:[0-9]*$/,d=/^(\\/\\/?(?!\\/)[^\\?\\s]*)(\\?[^\\s]*)?$/,f=[\"<\",\">\",'\"',\"`\",\" \",\"\\r\",\"\\n\",\"\\t\"],p=[\"{\",\"}\",\"|\",\"\\\\\",\"^\",\"`\"].concat(f),v=[\"'\"].concat(p),y=[\"%\",\"/\",\"?\",\";\",\"#\"].concat(v),g=[\"/\",\"?\",\"#\"],m=255,_=/^[+a-z0-9A-Z_-]{0,63}$/,b=/^([+a-z0-9A-Z_-]{0,63})(.*)$/,x={javascript:!0,\"javascript:\":!0},T={javascript:!0,\"javascript:\":!0},w={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,\"http:\":!0,\"https:\":!0,\"ftp:\":!0,\"gopher:\":!0,\"file:\":!0},E=t(\"querystring\");n.prototype.parse=function(t,e,r){if(!h.isString(t))throw new TypeError(\"Parameter 'url' must be a string, not \"+typeof t);var n=t.indexOf(\"?\"),i=n!==-1&&n<t.indexOf(\"#\")?\"?\":\"#\",o=t.split(i),s=/\\\\/g;o[0]=o[0].replace(s,\"/\"),t=o.join(i);var a=t;if(a=a.trim(),!r&&1===t.split(\"#\").length){var c=d.exec(a);if(c)return this.path=a,this.href=a,this.pathname=c[1],c[2]?(this.search=c[2],e?this.query=E.parse(this.search.substr(1)):this.query=this.search.substr(1)):e&&(this.search=\"\",this.query={}),this}var f=l.exec(a);if(f){f=f[0];var p=f.toLowerCase();this.protocol=p,a=a.substr(f.length)}if(r||f||a.match(/^\\/\\/[^@\\/]+@[^@\\/]+/)){var O=\"//\"===a.substr(0,2);!O||f&&T[f]||(a=a.substr(2),this.slashes=!0)}if(!T[f]&&(O||f&&!w[f])){for(var S=-1,M=0;M<g.length;M++){var P=a.indexOf(g[M]);P!==-1&&(S===-1||P<S)&&(S=P)}var C,R;R=S===-1?a.lastIndexOf(\"@\"):a.lastIndexOf(\"@\",S),R!==-1&&(C=a.slice(0,R),a=a.slice(R+1),this.auth=decodeURIComponent(C)),S=-1;for(var M=0;M<y.length;M++){var P=a.indexOf(y[M]);P!==-1&&(S===-1||P<S)&&(S=P)}S===-1&&(S=a.length),this.host=a.slice(0,S),a=a.slice(S),this.parseHost(),this.hostname=this.hostname||\"\";var A=\"[\"===this.hostname[0]&&\"]\"===this.hostname[this.hostname.length-1];if(!A)for(var D=this.hostname.split(/\\./),M=0,I=D.length;M<I;M++){var L=D[M];if(L&&!L.match(_)){for(var j=\"\",B=0,F=L.length;B<F;B++)j+=L.charCodeAt(B)>127?\"x\":L[B];if(!j.match(_)){var N=D.slice(0,M),k=D.slice(M+1),U=L.match(b);U&&(N.push(U[1]),k.unshift(U[2])),k.length&&(a=\"/\"+k.join(\".\")+a),this.hostname=N.join(\".\");break}}}this.hostname.length>m?this.hostname=\"\":this.hostname=this.hostname.toLowerCase(),A||(this.hostname=u.toASCII(this.hostname));var X=this.port?\":\"+this.port:\"\",W=this.hostname||\"\";this.host=W+X,this.href+=this.host,A&&(this.hostname=this.hostname.substr(1,this.hostname.length-2),\"/\"!==a[0]&&(a=\"/\"+a))}if(!x[p])for(var M=0,I=v.length;M<I;M++){var G=v[M];if(a.indexOf(G)!==-1){var H=encodeURIComponent(G);H===G&&(H=escape(G)),a=a.split(G).join(H)}}var V=a.indexOf(\"#\");V!==-1&&(this.hash=a.substr(V),a=a.slice(0,V));var Y=a.indexOf(\"?\");if(Y!==-1?(this.search=a.substr(Y),this.query=a.substr(Y+1),e&&(this.query=E.parse(this.query)),a=a.slice(0,Y)):e&&(this.search=\"\",this.query={}),a&&(this.pathname=a),w[p]&&this.hostname&&!this.pathname&&(this.pathname=\"/\"),this.pathname||this.search){var X=this.pathname||\"\",z=this.search||\"\";this.path=X+z}return this.href=this.format(),this},n.prototype.format=function(){var t=this.auth||\"\";t&&(t=encodeURIComponent(t),t=t.replace(/%3A/i,\":\"),t+=\"@\");var e=this.protocol||\"\",r=this.pathname||\"\",n=this.hash||\"\",i=!1,o=\"\";this.host?i=t+this.host:this.hostname&&(i=t+(this.hostname.indexOf(\":\")===-1?this.hostname:\"[\"+this.hostname+\"]\"),this.port&&(i+=\":\"+this.port)),this.query&&h.isObject(this.query)&&Object.keys(this.query).length&&(o=E.stringify(this.query));var s=this.search||o&&\"?\"+o||\"\";return e&&\":\"!==e.substr(-1)&&(e+=\":\"),this.slashes||(!e||w[e])&&i!==!1?(i=\"//\"+(i||\"\"),r&&\"/\"!==r.charAt(0)&&(r=\"/\"+r)):i||(i=\"\"),n&&\"#\"!==n.charAt(0)&&(n=\"#\"+n),s&&\"?\"!==s.charAt(0)&&(s=\"?\"+s),r=r.replace(/[?#]/g,function(t){return encodeURIComponent(t)}),s=s.replace(\"#\",\"%23\"),e+i+r+s+n},n.prototype.resolve=function(t){return this.resolveObject(i(t,!1,!0)).format()},n.prototype.resolveObject=function(t){if(h.isString(t)){var e=new n;e.parse(t,!1,!0),t=e}for(var r=new n,i=Object.keys(this),o=0;o<i.length;o++){var s=i[o];r[s]=this[s]}if(r.hash=t.hash,\"\"===t.href)return r.href=r.format(),r;if(t.slashes&&!t.protocol){for(var a=Object.keys(t),u=0;u<a.length;u++){var l=a[u];\"protocol\"!==l&&(r[l]=t[l])}return w[r.protocol]&&r.hostname&&!r.pathname&&(r.path=r.pathname=\"/\"),r.href=r.format(),r}if(t.protocol&&t.protocol!==r.protocol){if(!w[t.protocol]){for(var c=Object.keys(t),d=0;d<c.length;d++){var f=c[d];r[f]=t[f]}return r.href=r.format(),r}if(r.protocol=t.protocol,t.host||T[t.protocol])r.pathname=t.pathname;else{for(var p=(t.pathname||\"\").split(\"/\");p.length&&!(t.host=p.shift()););t.host||(t.host=\"\"),t.hostname||(t.hostname=\"\"),\"\"!==p[0]&&p.unshift(\"\"),p.length<2&&p.unshift(\"\"),r.pathname=p.join(\"/\")}if(r.search=t.search,r.query=t.query,r.host=t.host||\"\",r.auth=t.auth,r.hostname=t.hostname||t.host,r.port=t.port,r.pathname||r.search){var v=r.pathname||\"\",y=r.search||\"\";r.path=v+y}return r.slashes=r.slashes||t.slashes,r.href=r.format(),r}var g=r.pathname&&\"/\"===r.pathname.charAt(0),m=t.host||t.pathname&&\"/\"===t.pathname.charAt(0),_=m||g||r.host&&t.pathname,b=_,x=r.pathname&&r.pathname.split(\"/\")||[],p=t.pathname&&t.pathname.split(\"/\")||[],E=r.protocol&&!w[r.protocol];if(E&&(r.hostname=\"\",r.port=null,r.host&&(\"\"===x[0]?x[0]=r.host:x.unshift(r.host)),r.host=\"\",t.protocol&&(t.hostname=null,t.port=null,t.host&&(\"\"===p[0]?p[0]=t.host:p.unshift(t.host)),t.host=null),_=_&&(\"\"===p[0]||\"\"===x[0])),m)r.host=t.host||\"\"===t.host?t.host:r.host,r.hostname=t.hostname||\"\"===t.hostname?t.hostname:r.hostname,r.search=t.search,r.query=t.query,x=p;else if(p.length)x||(x=[]),x.pop(),x=x.concat(p),r.search=t.search,r.query=t.query;else if(!h.isNullOrUndefined(t.search)){if(E){r.hostname=r.host=x.shift();var O=!!(r.host&&r.host.indexOf(\"@\")>0)&&r.host.split(\"@\");O&&(r.auth=O.shift(),r.host=r.hostname=O.shift())}return r.search=t.search,r.query=t.query,h.isNull(r.pathname)&&h.isNull(r.search)||(r.path=(r.pathname?r.pathname:\"\")+(r.search?r.search:\"\")),r.href=r.format(),r}if(!x.length)return r.pathname=null,r.search?r.path=\"/\"+r.search:r.path=null,r.href=r.format(),r;for(var S=x.slice(-1)[0],M=(r.host||t.host||x.length>1)&&(\".\"===S||\"..\"===S)||\"\"===S,P=0,C=x.length;C>=0;C--)S=x[C],\".\"===S?x.splice(C,1):\"..\"===S?(x.splice(C,1),P++):P&&(x.splice(C,1),P--);if(!_&&!b)for(;P--;P)x.unshift(\"..\");!_||\"\"===x[0]||x[0]&&\"/\"===x[0].charAt(0)||x.unshift(\"\"),M&&\"/\"!==x.join(\"/\").substr(-1)&&x.push(\"\");var R=\"\"===x[0]||x[0]&&\"/\"===x[0].charAt(0);if(E){r.hostname=r.host=R?\"\":x.length?x.shift():\"\";var O=!!(r.host&&r.host.indexOf(\"@\")>0)&&r.host.split(\"@\");O&&(r.auth=O.shift(),r.host=r.hostname=O.shift())}return _=_||r.host&&x.length,_&&!R&&x.unshift(\"\"),x.length?r.pathname=x.join(\"/\"):(r.pathname=null,r.path=null),h.isNull(r.pathname)&&h.isNull(r.search)||(r.path=(r.pathname?r.pathname:\"\")+(r.search?r.search:\"\")),r.auth=t.auth||r.auth,r.slashes=r.slashes||t.slashes,r.href=r.format(),r},n.prototype.parseHost=function(){var t=this.host,e=c.exec(t);e&&(e=e[0],\":\"!==e&&(this.port=e.substr(1)),t=t.substr(0,t.length-e.length)),t&&(this.hostname=t)}},{\"./util\":29,punycode:24,querystring:27}],29:[function(t,e,r){\"use strict\";e.exports={isString:function(t){return\"string\"==typeof t},isObject:function(t){return\"object\"==typeof t&&null!==t},isNull:function(t){return null===t},isNullOrUndefined:function(t){return null==t}}},{}],30:[function(t,e,r){\"use strict\";e.exports=function(t,e){e=e||{};for(var r={key:[\"source\",\"protocol\",\"authority\",\"userInfo\",\"user\",\"password\",\"host\",\"port\",\"relative\",\"path\",\"directory\",\"file\",\"query\",\"anchor\"],q:{name:\"queryKey\",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\\/?#]+):)?(?:\\/\\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\\/?#]*)(?::(\\d*))?))?((((?:[^?#\\/]*\\/)*)([^?#]*))(?:\\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\\/]*@)([^:\\/?#.]+):)?(?:\\/\\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\\/?#]*)(?::(\\d*))?)(((\\/(?:[^?#](?![^?#\\/]*\\.[^?#\\/.]+(?:[?#]|$)))*\\/?)?([^?#\\/]*))(?:\\?([^#]*))?(?:#(.*))?)/}},n=r.parser[e.strictMode?\"strict\":\"loose\"].exec(t),i={},o=14;o--;)i[r.key[o]]=n[o]||\"\";return i[r.q.name]={},i[r.key[12]].replace(r.q.parser,function(t,e,n){e&&(i[r.q.name][e]=n)}),i}},{}],31:[function(t,e,r){\"use strict\";function n(t,e){a.call(this),e=e||u,this.baseUrl=t||\"\",this.progress=0,this.loading=!1,this._progressChunk=0,this._beforeMiddleware=[],this._afterMiddleware=[],this._boundLoadResource=this._loadResource.bind(this),this._buffer=[],this._numToLoad=0,this._queue=o.queue(this._boundLoadResource,e),this.resources={}}var i=t(\"parse-uri\"),o=t(\"./async\"),s=t(\"./Resource\"),a=t(\"eventemitter3\"),u=10,h=100;n.prototype=Object.create(a.prototype),n.prototype.constructor=n,e.exports=n,n.prototype.add=n.prototype.enqueue=function(t,e,r,n){if(Array.isArray(t)){for(var i=0;i<t.length;++i)this.add(t[i]);return this}if(\"object\"==typeof t&&(n=e||t.callback||t.onComplete,r=t,e=t.url,t=t.name||t.key||t.url),\"string\"!=typeof e&&(n=r,r=e,e=t),\"string\"!=typeof e)throw new Error(\"No url passed to add resource to loader.\");if(\"function\"==typeof r&&(n=r,r=null),this.resources[t])throw new Error('Resource with name \"'+t+'\" already exists.');return e=this._prepareUrl(e),this.resources[t]=new s(t,e,r),\"function\"==typeof n&&this.resources[t].once(\"afterMiddleware\",n),this._numToLoad++,this._queue.started?(this._queue.push(this.resources[t]),this._progressChunk=(h-this.progress)/(this._queue.length()+this._queue.running())):(this._buffer.push(this.resources[t]),this._progressChunk=h/this._buffer.length),this},n.prototype.before=n.prototype.pre=function(t){return this._beforeMiddleware.push(t),this},n.prototype.after=n.prototype.use=function(t){return this._afterMiddleware.push(t),this},n.prototype.reset=function(){this.progress=0,this.loading=!1,this._progressChunk=0,this._buffer.length=0,this._numToLoad=0,this._queue.kill(),this._queue.started=!1;for(var t in this.resources){var e=this.resources[t];e.off(\"complete\",this._onLoad,this),e.isLoading&&e.abort()}return this.resources={},this},n.prototype.load=function(t){if(\"function\"==typeof t&&this.once(\"complete\",t),this._queue.started)return this;this.emit(\"start\",this),this.loading=!0;for(var e=0;e<this._buffer.length;++e)this._queue.push(this._buffer[e]);return this._buffer.length=0,this},n.prototype._prepareUrl=function(t){var e=i(t,{strictMode:!0});return e.protocol||!e.path||0===e.path.indexOf(\"//\")?t:this.baseUrl.length&&this.baseUrl.lastIndexOf(\"/\")!==this.baseUrl.length-1&&\"/\"!==t.charAt(0)?this.baseUrl+\"/\"+t:this.baseUrl+t},n.prototype._loadResource=function(t,e){var r=this;t._dequeue=e,o.eachSeries(this._beforeMiddleware,function(e,n){e.call(r,t,function(){n(t.isComplete?{}:null)})},function(){t.isComplete?r._onLoad(t):(t.once(\"complete\",r._onLoad,r),t.load())})},n.prototype._onComplete=function(){this.loading=!1,this.emit(\"complete\",this,this.resources)},n.prototype._onLoad=function(t){var e=this;o.eachSeries(this._afterMiddleware,function(r,n){r.call(e,t,n)},function(){t.emit(\"afterMiddleware\",t),e._numToLoad--,e.progress+=e._progressChunk,e.emit(\"progress\",e,t),t.error?e.emit(\"error\",t.error,e,t):e.emit(\"load\",e,t),0===e._numToLoad&&(e.progress=100,e._onComplete())}),t._dequeue()},n.LOAD_TYPE=s.LOAD_TYPE,n.XHR_RESPONSE_TYPE=s.XHR_RESPONSE_TYPE},{\"./Resource\":32,\"./async\":33,eventemitter3:3,\"parse-uri\":30}],32:[function(t,e,r){\"use strict\";function n(t,e,r){if(s.call(this),r=r||{},\"string\"!=typeof t||\"string\"!=typeof e)throw new Error(\"Both name and url are required for constructing a resource.\");this.name=t,this.url=e,this.isDataUrl=0===this.url.indexOf(\"data:\"),this.data=null,this.crossOrigin=r.crossOrigin===!0?\"anonymous\":r.crossOrigin,this.loadType=r.loadType||this._determineLoadType(),this.xhrType=r.xhrType,this.metadata=r.metadata||{},this.error=null,this.xhr=null,this.isJson=!1,this.isXml=!1,this.isImage=!1,this.isAudio=!1,this.isVideo=!1,this.isComplete=!1,this.isLoading=!1,this._dequeue=null,this._boundComplete=this.complete.bind(this),this._boundOnError=this._onError.bind(this),this._boundOnProgress=this._onProgress.bind(this),this._boundXhrOnError=this._xhrOnError.bind(this),this._boundXhrOnAbort=this._xhrOnAbort.bind(this),this._boundXhrOnLoad=this._xhrOnLoad.bind(this),this._boundXdrOnTimeout=this._xdrOnTimeout.bind(this)}function i(t){return t.toString().replace(\"object \",\"\")}function o(t,e,r){e&&0===e.indexOf(\".\")&&(e=e.substring(1)),e&&(t[e]=r)}var s=t(\"eventemitter3\"),a=t(\"parse-uri\"),u=!(!window.XDomainRequest||\"withCredentials\"in new XMLHttpRequest),h=null,l=0,c=200,d=204;n.prototype=Object.create(s.prototype),n.prototype.constructor=n,e.exports=n,n.prototype.complete=function(){if(this.data&&this.data.removeEventListener&&(this.data.removeEventListener(\"error\",this._boundOnError,!1),this.data.removeEventListener(\"load\",this._boundComplete,!1),this.data.removeEventListener(\"progress\",this._boundOnProgress,!1),this.data.removeEventListener(\"canplaythrough\",this._boundComplete,!1)),this.xhr&&(this.xhr.removeEventListener?(this.xhr.removeEventListener(\"error\",this._boundXhrOnError,!1),this.xhr.removeEventListener(\"abort\",this._boundXhrOnAbort,!1),this.xhr.removeEventListener(\"progress\",this._boundOnProgress,!1),this.xhr.removeEventListener(\"load\",this._boundXhrOnLoad,!1)):(this.xhr.onerror=null,this.xhr.ontimeout=null,this.xhr.onprogress=null,this.xhr.onload=null)),this.isComplete)throw new Error(\"Complete called again for an already completed resource.\");this.isComplete=!0,this.isLoading=!1,this.emit(\"complete\",this)},n.prototype.abort=function(t){if(!this.error){if(this.error=new Error(t),this.xhr)this.xhr.abort();else if(this.xdr)this.xdr.abort();else if(this.data)if(\"undefined\"!=typeof this.data.src)this.data.src=\"\";else for(;this.data.firstChild;)this.data.removeChild(this.data.firstChild);this.complete()}},n.prototype.load=function(t){if(!this.isLoading)if(this.isComplete){if(t){var e=this;setTimeout(function(){t(e)},1)}}else switch(t&&this.once(\"complete\",t),this.isLoading=!0,this.emit(\"start\",this),this.crossOrigin!==!1&&\"string\"==typeof this.crossOrigin||(this.crossOrigin=this._determineCrossOrigin(this.url)),this.loadType){case n.LOAD_TYPE.IMAGE:this._loadElement(\"image\");break;case n.LOAD_TYPE.AUDIO:this._loadSourceElement(\"audio\");break;case n.LOAD_TYPE.VIDEO:this._loadSourceElement(\"video\");break;case n.LOAD_TYPE.XHR:default:u&&this.crossOrigin?this._loadXdr():this._loadXhr()}},n.prototype._loadElement=function(t){this.metadata.loadElement?this.data=this.metadata.loadElement:\"image\"===t&&\"undefined\"!=typeof window.Image?this.data=new Image:this.data=document.createElement(t),this.crossOrigin&&(this.data.crossOrigin=this.crossOrigin),this.metadata.skipSource||(this.data.src=this.url);var e=\"is\"+t[0].toUpperCase()+t.substring(1);this[e]===!1&&(this[e]=!0),this.data.addEventListener(\"error\",this._boundOnError,!1),this.data.addEventListener(\"load\",this._boundComplete,!1),this.data.addEventListener(\"progress\",this._boundOnProgress,!1)},n.prototype._loadSourceElement=function(t){if(this.metadata.loadElement?this.data=this.metadata.loadElement:\"audio\"===t&&\"undefined\"!=typeof window.Audio?this.data=new Audio:this.data=document.createElement(t),null===this.data)return void this.abort(\"Unsupported element \"+t);if(!this.metadata.skipSource)if(navigator.isCocoonJS)this.data.src=Array.isArray(this.url)?this.url[0]:this.url;else if(Array.isArray(this.url))for(var e=0;e<this.url.length;++e)this.data.appendChild(this._createSource(t,this.url[e]));else this.data.appendChild(this._createSource(t,this.url));this[\"is\"+t[0].toUpperCase()+t.substring(1)]=!0,this.data.addEventListener(\"error\",this._boundOnError,!1),this.data.addEventListener(\"load\",this._boundComplete,!1),this.data.addEventListener(\"progress\",this._boundOnProgress,!1),this.data.addEventListener(\"canplaythrough\",this._boundComplete,!1),this.data.load()},n.prototype._loadXhr=function(){\"string\"!=typeof this.xhrType&&(this.xhrType=this._determineXhrType());var t=this.xhr=new XMLHttpRequest;t.open(\"GET\",this.url,!0),this.xhrType===n.XHR_RESPONSE_TYPE.JSON||this.xhrType===n.XHR_RESPONSE_TYPE.DOCUMENT?t.responseType=n.XHR_RESPONSE_TYPE.TEXT:t.responseType=this.xhrType,t.addEventListener(\"error\",this._boundXhrOnError,!1),t.addEventListener(\"abort\",this._boundXhrOnAbort,!1),t.addEventListener(\"progress\",this._boundOnProgress,!1),t.addEventListener(\"load\",this._boundXhrOnLoad,!1),t.send()},n.prototype._loadXdr=function(){\"string\"!=typeof this.xhrType&&(this.xhrType=this._determineXhrType());var t=this.xhr=new XDomainRequest;t.timeout=5e3,t.onerror=this._boundXhrOnError,t.ontimeout=this._boundXdrOnTimeout,t.onprogress=this._boundOnProgress,t.onload=this._boundXhrOnLoad,t.open(\"GET\",this.url,!0),setTimeout(function(){t.send()},0)},n.prototype._createSource=function(t,e,r){r||(r=t+\"/\"+e.substr(e.lastIndexOf(\".\")+1));var n=document.createElement(\"source\");return n.src=e,n.type=r,n},n.prototype._onError=function(t){this.abort(\"Failed to load element using \"+t.target.nodeName)},n.prototype._onProgress=function(t){t&&t.lengthComputable&&this.emit(\"progress\",this,t.loaded/t.total)},n.prototype._xhrOnError=function(){var t=this.xhr;this.abort(i(t)+\" Request failed. Status: \"+t.status+', text: \"'+t.statusText+'\"')},n.prototype._xhrOnAbort=function(){this.abort(i(this.xhr)+\" Request was aborted by the user.\")},n.prototype._xdrOnTimeout=function(){this.abort(i(this.xhr)+\" Request timed out.\")},n.prototype._xhrOnLoad=function(){var t=this.xhr,e=\"undefined\"==typeof t.status?t.status:c;if(!(e===c||e===d||e===l&&t.responseText.length>0))return void this.abort(\"[\"+t.status+\"]\"+t.statusText+\":\"+t.responseURL);if(this.xhrType===n.XHR_RESPONSE_TYPE.TEXT)this.data=t.responseText;else if(this.xhrType===n.XHR_RESPONSE_TYPE.JSON)try{this.data=JSON.parse(t.responseText),this.isJson=!0}catch(t){return void this.abort(\"Error trying to parse loaded json:\",t)}else if(this.xhrType===n.XHR_RESPONSE_TYPE.DOCUMENT)try{if(window.DOMParser){var r=new DOMParser;this.data=r.parseFromString(t.responseText,\"text/xml\")}else{var i=document.createElement(\"div\");i.innerHTML=t.responseText,this.data=i}this.isXml=!0}catch(t){return void this.abort(\"Error trying to parse loaded xml:\",t)}else this.data=t.response||t.responseText;this.complete()},n.prototype._determineCrossOrigin=function(t,e){if(0===t.indexOf(\"data:\"))return\"\";e=e||window.location,h||(h=document.createElement(\"a\")),h.href=t,t=a(h.href,{strictMode:!0});var r=!t.port&&\"\"===e.port||t.port===e.port,n=t.protocol?t.protocol+\":\":\"\";return t.host===e.hostname&&r&&n===e.protocol?\"\":\"anonymous\"},n.prototype._determineXhrType=function(){return n._xhrTypeMap[this._getExtension()]||n.XHR_RESPONSE_TYPE.TEXT},n.prototype._determineLoadType=function(){return n._loadTypeMap[this._getExtension()]||n.LOAD_TYPE.XHR},n.prototype._getExtension=function(){var t=this.url,e=\"\";if(this.isDataUrl){var r=t.indexOf(\"/\");e=t.substring(r+1,t.indexOf(\";\",r))}else{var n=t.indexOf(\"?\");n!==-1&&(t=t.substring(0,n)),e=t.substring(t.lastIndexOf(\".\")+1)}return e.toLowerCase()},n.prototype._getMimeFromXhrType=function(t){switch(t){case n.XHR_RESPONSE_TYPE.BUFFER:return\"application/octet-binary\";case n.XHR_RESPONSE_TYPE.BLOB:return\"application/blob\";case n.XHR_RESPONSE_TYPE.DOCUMENT:return\"application/xml\";case n.XHR_RESPONSE_TYPE.JSON:return\"application/json\";case n.XHR_RESPONSE_TYPE.DEFAULT:case n.XHR_RESPONSE_TYPE.TEXT:default:return\"text/plain\"}},n.LOAD_TYPE={XHR:1,IMAGE:2,AUDIO:3,VIDEO:4},n.XHR_RESPONSE_TYPE={DEFAULT:\"text\",BUFFER:\"arraybuffer\",BLOB:\"blob\",DOCUMENT:\"document\",JSON:\"json\",TEXT:\"text\"},n._loadTypeMap={gif:n.LOAD_TYPE.IMAGE,png:n.LOAD_TYPE.IMAGE,bmp:n.LOAD_TYPE.IMAGE,jpg:n.LOAD_TYPE.IMAGE,jpeg:n.LOAD_TYPE.IMAGE,tif:n.LOAD_TYPE.IMAGE,tiff:n.LOAD_TYPE.IMAGE,webp:n.LOAD_TYPE.IMAGE,tga:n.LOAD_TYPE.IMAGE,\"svg+xml\":n.LOAD_TYPE.IMAGE},n._xhrTypeMap={xhtml:n.XHR_RESPONSE_TYPE.DOCUMENT,html:n.XHR_RESPONSE_TYPE.DOCUMENT,htm:n.XHR_RESPONSE_TYPE.DOCUMENT,xml:n.XHR_RESPONSE_TYPE.DOCUMENT,tmx:n.XHR_RESPONSE_TYPE.DOCUMENT,tsx:n.XHR_RESPONSE_TYPE.DOCUMENT,svg:n.XHR_RESPONSE_TYPE.DOCUMENT,gif:n.XHR_RESPONSE_TYPE.BLOB,png:n.XHR_RESPONSE_TYPE.BLOB,bmp:n.XHR_RESPONSE_TYPE.BLOB,jpg:n.XHR_RESPONSE_TYPE.BLOB,jpeg:n.XHR_RESPONSE_TYPE.BLOB,tif:n.XHR_RESPONSE_TYPE.BLOB,tiff:n.XHR_RESPONSE_TYPE.BLOB,webp:n.XHR_RESPONSE_TYPE.BLOB,tga:n.XHR_RESPONSE_TYPE.BLOB,json:n.XHR_RESPONSE_TYPE.JSON,text:n.XHR_RESPONSE_TYPE.TEXT,txt:n.XHR_RESPONSE_TYPE.TEXT},n.setExtensionLoadType=function(t,e){o(n._loadTypeMap,t,e)},n.setExtensionXhrType=function(t,e){o(n._xhrTypeMap,t,e)}},{eventemitter3:3,\"parse-uri\":30}],33:[function(t,e,r){\"use strict\";function n(){}function i(t,e,r){var n=0,i=t.length;!function o(s){return s||n===i?void(r&&r(s)):void e(t[n++],o)}()}function o(t){return function(){if(null===t)throw new Error(\"Callback was already called.\");var e=t;t=null,e.apply(this,arguments)}}function s(t,e){function r(t,e,r){if(null!=r&&\"function\"!=typeof r)throw new Error(\"task callback must be a function\");if(a.started=!0,null==t&&a.idle())return void setTimeout(function(){a.drain()},1);var i={data:t,callback:\"function\"==typeof r?r:n};e?a._tasks.unshift(i):a._tasks.push(i),setTimeout(function(){a.process()},1)}function i(t){return function(){s-=1,t.callback.apply(t,arguments),null!=arguments[0]&&a.error(arguments[0],t.data),s<=a.concurrency-a.buffer&&a.unsaturated(),a.idle()&&a.drain(),a.process()}}if(null==e)e=1;else if(0===e)throw new Error(\"Concurrency must not be zero\");var s=0,a={_tasks:[],concurrency:e,saturated:n,unsaturated:n,buffer:e/4,empty:n,drain:n,error:n,started:!1,paused:!1,push:function(t,e){r(t,!1,e)},kill:function(){a.drain=n,a._tasks=[]},unshift:function(t,e){r(t,!0,e)},process:function(){for(;!a.paused&&s<a.concurrency&&a._tasks.length;){var e=a._tasks.shift();0===a._tasks.length&&a.empty(),s+=1,s===a.concurrency&&a.saturated(),t(e.data,o(i(e)))}},length:function(){return a._tasks.length},running:function(){return s},idle:function(){return a._tasks.length+s===0},pause:function(){a.paused!==!0&&(a.paused=!0)},resume:function(){if(a.paused!==!1){a.paused=!1;for(var t=1;t<=a.concurrency;t++)a.process()}}};return a}e.exports={eachSeries:i,queue:s}},{}],34:[function(t,e,r){\"use strict\";e.exports={_keyStr:\"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\",encodeBinary:function(t){for(var e,r=\"\",n=new Array(4),i=0,o=0,s=0;i<t.length;){for(e=new Array(3),o=0;o<e.length;o++)i<t.length?e[o]=255&t.charCodeAt(i++):e[o]=0;switch(n[0]=e[0]>>2,n[1]=(3&e[0])<<4|e[1]>>4,n[2]=(15&e[1])<<2|e[2]>>6,n[3]=63&e[2],s=i-(t.length-1)){case 2:n[3]=64,n[2]=64;break;case 1:n[3]=64}for(o=0;o<n.length;o++)r+=this._keyStr.charAt(n[o])}return r}}},{}],35:[function(t,e,r){\"use strict\";e.exports=t(\"./Loader\"),e.exports.Resource=t(\"./Resource\"),e.exports.middleware={caching:{memory:t(\"./middlewares/caching/memory\")},parsing:{blob:t(\"./middlewares/parsing/blob\")}},e.exports.async=t(\"./async\")},{\"./Loader\":31,\"./Resource\":32,\"./async\":33,\"./middlewares/caching/memory\":36,\"./middlewares/parsing/blob\":37}],36:[function(t,e,r){\"use strict\";var n={};e.exports=function(){return function(t,e){n[t.url]?(t.data=n[t.url],t.complete()):t.once(\"complete\",function(){n[this.url]=this.data}),e()}}},{}],37:[function(t,e,r){\"use strict\";var n=t(\"../../Resource\"),i=t(\"../../b64\"),o=window.URL||window.webkitURL;e.exports=function(){return function(t,e){if(!t.data)return void e();if(t.xhr&&t.xhrType===n.XHR_RESPONSE_TYPE.BLOB)if(window.Blob&&\"string\"!=typeof t.data){if(0===t.data.type.indexOf(\"image\")){var r=o.createObjectURL(t.data);return t.blob=t.data,t.data=new Image,t.data.src=r,t.isImage=!0,void(t.data.onload=function(){o.revokeObjectURL(r),t.data.onload=null,e()})}}else{var s=t.xhr.getResponseHeader(\"content-type\");if(s&&0===s.indexOf(\"image\"))return t.data=new Image,t.data.src=\"data:\"+s+\";base64,\"+i.encodeBinary(t.xhr.responseText),t.isImage=!0,void(t.data.onload=function(){t.data.onload=null,e()})}e()}}},{\"../../Resource\":32,\"../../b64\":34}],38:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function o(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var s=t(\"../core\"),a=i(s),u=t(\"ismobilejs\"),h=n(u),l=t(\"./accessibleTarget\"),c=n(l);Object.assign(a.DisplayObject.prototype,c.default);var d=9,f=100,p=0,v=0,y=2,g=1,m=-1e3,_=-1e3,b=2,x=function(){function t(e){o(this,t),!h.default.tablet&&!h.default.phone||navigator.isCocoonJS||this.createTouchHook();var r=document.createElement(\"div\");r.style.width=f+\"px\",r.style.height=f+\"px\",r.style.position=\"absolute\",r.style.top=p+\"px\",r.style.left=v+\"px\",r.style.zIndex=y,this.div=r,this.pool=[],this.renderId=0,this.debug=!1,this.renderer=e,this.children=[],this._onKeyDown=this._onKeyDown.bind(this),this._onMouseMove=this._onMouseMove.bind(this),this.isActive=!1,this.isMobileAccessabillity=!1,window.addEventListener(\"keydown\",this._onKeyDown,!1)}return t.prototype.createTouchHook=function(){var t=this,e=document.createElement(\"button\");e.style.width=g+\"px\",e.style.height=g+\"px\",e.style.position=\"absolute\",e.style.top=m+\"px\",e.style.left=_+\"px\",e.style.zIndex=b,e.style.backgroundColor=\"#FF0000\",e.title=\"HOOK DIV\",e.addEventListener(\"focus\",function(){t.isMobileAccessabillity=!0,t.activate(),document.body.removeChild(e)}),document.body.appendChild(e)},t.prototype.activate=function(){this.isActive||(this.isActive=!0,window.document.addEventListener(\"mousemove\",this._onMouseMove,!0),window.removeEventListener(\"keydown\",this._onKeyDown,!1),this.renderer.on(\"postrender\",this.update,this),this.renderer.view.parentNode&&this.renderer.view.parentNode.appendChild(this.div))},t.prototype.deactivate=function(){this.isActive&&!this.isMobileAccessabillity&&(this.isActive=!1,window.document.removeEventListener(\"mousemove\",this._onMouseMove),window.addEventListener(\"keydown\",this._onKeyDown,!1),this.renderer.off(\"postrender\",this.update),this.div.parentNode&&this.div.parentNode.removeChild(this.div))},t.prototype.updateAccessibleObjects=function(t){if(t.visible){t.accessible&&t.interactive&&(t._accessibleActive||this.addChild(t),t.renderId=this.renderId);for(var e=t.children,r=e.length-1;r>=0;r--)this.updateAccessibleObjects(e[r])}},t.prototype.update=function(){if(this.renderer.renderingToScreen){this.updateAccessibleObjects(this.renderer._lastObjectRendered);var t=this.renderer.view.getBoundingClientRect(),e=t.width/this.renderer.width,r=t.height/this.renderer.height,n=this.div;\r\nn.style.left=t.left+\"px\",n.style.top=t.top+\"px\",n.style.width=this.renderer.width+\"px\",n.style.height=this.renderer.height+\"px\";for(var i=0;i<this.children.length;i++){var o=this.children[i];if(o.renderId!==this.renderId)o._accessibleActive=!1,a.utils.removeItems(this.children,i,1),this.div.removeChild(o._accessibleDiv),this.pool.push(o._accessibleDiv),o._accessibleDiv=null,i--,0===this.children.length&&this.deactivate();else{n=o._accessibleDiv;var s=o.hitArea,u=o.worldTransform;o.hitArea?(n.style.left=(u.tx+s.x*u.a)*e+\"px\",n.style.top=(u.ty+s.y*u.d)*r+\"px\",n.style.width=s.width*u.a*e+\"px\",n.style.height=s.height*u.d*r+\"px\"):(s=o.getBounds(),this.capHitArea(s),n.style.left=s.x*e+\"px\",n.style.top=s.y*r+\"px\",n.style.width=s.width*e+\"px\",n.style.height=s.height*r+\"px\")}}this.renderId++}},t.prototype.capHitArea=function(t){t.x<0&&(t.width+=t.x,t.x=0),t.y<0&&(t.height+=t.y,t.y=0),t.x+t.width>this.renderer.width&&(t.width=this.renderer.width-t.x),t.y+t.height>this.renderer.height&&(t.height=this.renderer.height-t.y)},t.prototype.addChild=function(t){var e=this.pool.pop();e||(e=document.createElement(\"button\"),e.style.width=f+\"px\",e.style.height=f+\"px\",e.style.backgroundColor=this.debug?\"rgba(255,0,0,0.5)\":\"transparent\",e.style.position=\"absolute\",e.style.zIndex=y,e.style.borderStyle=\"none\",e.addEventListener(\"click\",this._onClick.bind(this)),e.addEventListener(\"focus\",this._onFocus.bind(this)),e.addEventListener(\"focusout\",this._onFocusOut.bind(this))),t.accessibleTitle?e.title=t.accessibleTitle:t.accessibleTitle||t.accessibleHint||(e.title=\"displayObject \"+this.tabIndex),t.accessibleHint&&e.setAttribute(\"aria-label\",t.accessibleHint),t._accessibleActive=!0,t._accessibleDiv=e,e.displayObject=t,this.children.push(t),this.div.appendChild(t._accessibleDiv),t._accessibleDiv.tabIndex=t.tabIndex},t.prototype._onClick=function(t){var e=this.renderer.plugins.interaction;e.dispatchEvent(t.target.displayObject,\"click\",e.eventData)},t.prototype._onFocus=function(t){var e=this.renderer.plugins.interaction;e.dispatchEvent(t.target.displayObject,\"mouseover\",e.eventData)},t.prototype._onFocusOut=function(t){var e=this.renderer.plugins.interaction;e.dispatchEvent(t.target.displayObject,\"mouseout\",e.eventData)},t.prototype._onKeyDown=function(t){t.keyCode===d&&this.activate()},t.prototype._onMouseMove=function(){this.deactivate()},t.prototype.destroy=function(){this.div=null;for(var t=0;t<this.children.length;t++)this.children[t].div=null;window.document.removeEventListener(\"mousemove\",this._onMouseMove),window.removeEventListener(\"keydown\",this._onKeyDown),this.pool=null,this.children=null,this.renderer=null},t}();r.default=x,a.WebGLRenderer.registerPlugin(\"accessibility\",x),a.CanvasRenderer.registerPlugin(\"accessibility\",x)},{\"../core\":61,\"./accessibleTarget\":39,ismobilejs:4}],39:[function(t,e,r){\"use strict\";r.__esModule=!0,r.default={accessible:!1,accessibleTitle:null,accessibleHint:null,tabIndex:0,_accessibleActive:!1,_accessibleDiv:!1}},{}],40:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}r.__esModule=!0;var i=t(\"./accessibleTarget\");Object.defineProperty(r,\"accessibleTarget\",{enumerable:!0,get:function(){return n(i).default}});var o=t(\"./AccessibilityManager\");Object.defineProperty(r,\"AccessibilityManager\",{enumerable:!0,get:function(){return n(o).default}})},{\"./AccessibilityManager\":38,\"./accessibleTarget\":39}],41:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function a(t){if(t instanceof Array){if(\"precision\"!==t[0].substring(0,9)){var e=t.slice(0);return e.unshift(\"precision \"+c+\" float;\"),e}}else if(\"precision\"!==t.substring(0,9))return\"precision \"+c+\" float;\\n\"+t;return t}r.__esModule=!0;var u=t(\"pixi-gl-core\"),h=t(\"./settings\"),l=n(h),c=l.default.PRECISION,d=function(t){function e(r,n,s){return i(this,e),o(this,t.call(this,r,a(n),a(s)))}return s(e,t),e}(u.GLShader);r.default=d},{\"./settings\":97,\"pixi-gl-core\":12}],42:[function(t,e,r){\"use strict\";r.__esModule=!0;r.VERSION=\"4.2.3\",r.PI_2=2*Math.PI,r.RAD_TO_DEG=180/Math.PI,r.DEG_TO_RAD=Math.PI/180,r.RENDERER_TYPE={UNKNOWN:0,WEBGL:1,CANVAS:2},r.BLEND_MODES={NORMAL:0,ADD:1,MULTIPLY:2,SCREEN:3,OVERLAY:4,DARKEN:5,LIGHTEN:6,COLOR_DODGE:7,COLOR_BURN:8,HARD_LIGHT:9,SOFT_LIGHT:10,DIFFERENCE:11,EXCLUSION:12,HUE:13,SATURATION:14,COLOR:15,LUMINOSITY:16},r.DRAW_MODES={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},r.SCALE_MODES={LINEAR:0,NEAREST:1},r.WRAP_MODES={CLAMP:0,REPEAT:1,MIRRORED_REPEAT:2},r.GC_MODES={AUTO:0,MANUAL:1},r.URL_FILE_EXTENSION=/\\.(\\w{3,4})(?:$|\\?|#)/i,r.DATA_URI=/^\\s*data:(?:([\\w-]+)\\/([\\w+.-]+))?(?:;(charset=[\\w-]+|base64))?,(.*)/i,r.SVG_SIZE=/<svg[^>]*(?:\\s(width|height)=('|\")(\\d*(?:\\.\\d+)?)(?:px)?('|\"))[^>]*(?:\\s(width|height)=('|\")(\\d*(?:\\.\\d+)?)(?:px)?('|\"))[^>]*>/i,r.SHAPES={POLY:0,RECT:1,CIRC:2,ELIP:3,RREC:4},r.PRECISION={LOW:\"lowp\",MEDIUM:\"mediump\",HIGH:\"highp\"},r.TRANSFORM_MODE={STATIC:0,DYNAMIC:1},r.TEXT_GRADIENT={LINEAR_VERTICAL:0,LINEAR_HORIZONTAL:1}},{}],43:[function(t,e,r){\"use strict\";function n(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var i=t(\"../math\"),o=function(){function t(){n(this,t),this.minX=1/0,this.minY=1/0,this.maxX=-(1/0),this.maxY=-(1/0),this.rect=null}return t.prototype.isEmpty=function(){return this.minX>this.maxX||this.minY>this.maxY},t.prototype.clear=function(){this.updateID++,this.minX=1/0,this.minY=1/0,this.maxX=-(1/0),this.maxY=-(1/0)},t.prototype.getRectangle=function(t){return this.minX>this.maxX||this.minY>this.maxY?i.Rectangle.EMPTY:(t=t||new i.Rectangle(0,0,1,1),t.x=this.minX,t.y=this.minY,t.width=this.maxX-this.minX,t.height=this.maxY-this.minY,t)},t.prototype.addPoint=function(t){this.minX=Math.min(this.minX,t.x),this.maxX=Math.max(this.maxX,t.x),this.minY=Math.min(this.minY,t.y),this.maxY=Math.max(this.maxY,t.y)},t.prototype.addQuad=function(t){var e=this.minX,r=this.minY,n=this.maxX,i=this.maxY,o=t[0],s=t[1];e=o<e?o:e,r=s<r?s:r,n=o>n?o:n,i=s>i?s:i,o=t[2],s=t[3],e=o<e?o:e,r=s<r?s:r,n=o>n?o:n,i=s>i?s:i,o=t[4],s=t[5],e=o<e?o:e,r=s<r?s:r,n=o>n?o:n,i=s>i?s:i,o=t[6],s=t[7],e=o<e?o:e,r=s<r?s:r,n=o>n?o:n,i=s>i?s:i,this.minX=e,this.minY=r,this.maxX=n,this.maxY=i},t.prototype.addFrame=function(t,e,r,n,i){var o=t.worldTransform,s=o.a,a=o.b,u=o.c,h=o.d,l=o.tx,c=o.ty,d=this.minX,f=this.minY,p=this.maxX,v=this.maxY,y=s*e+u*r+l,g=a*e+h*r+c;d=y<d?y:d,f=g<f?g:f,p=y>p?y:p,v=g>v?g:v,y=s*n+u*r+l,g=a*n+h*r+c,d=y<d?y:d,f=g<f?g:f,p=y>p?y:p,v=g>v?g:v,y=s*e+u*i+l,g=a*e+h*i+c,d=y<d?y:d,f=g<f?g:f,p=y>p?y:p,v=g>v?g:v,y=s*n+u*i+l,g=a*n+h*i+c,d=y<d?y:d,f=g<f?g:f,p=y>p?y:p,v=g>v?g:v,this.minX=d,this.minY=f,this.maxX=p,this.maxY=v},t.prototype.addVertices=function(t,e,r,n){for(var i=t.worldTransform,o=i.a,s=i.b,a=i.c,u=i.d,h=i.tx,l=i.ty,c=this.minX,d=this.minY,f=this.maxX,p=this.maxY,v=r;v<n;v+=2){var y=e[v],g=e[v+1],m=o*y+a*g+h,_=u*g+s*y+l;c=m<c?m:c,d=_<d?_:d,f=m>f?m:f,p=_>p?_:p}this.minX=c,this.minY=d,this.maxX=f,this.maxY=p},t.prototype.addBounds=function(t){var e=this.minX,r=this.minY,n=this.maxX,i=this.maxY;this.minX=t.minX<e?t.minX:e,this.minY=t.minY<r?t.minY:r,this.maxX=t.maxX>n?t.maxX:n,this.maxY=t.maxY>i?t.maxY:i},t.prototype.addBoundsMask=function(t,e){var r=t.minX>e.minX?t.minX:e.minX,n=t.minY>e.minY?t.minY:e.minY,i=t.maxX<e.maxX?t.maxX:e.maxX,o=t.maxY<e.maxY?t.maxY:e.maxY;if(r<=i&&n<=o){var s=this.minX,a=this.minY,u=this.maxX,h=this.maxY;this.minX=r<s?r:s,this.minY=n<a?n:a,this.maxX=i>u?i:u,this.maxY=o>h?o:h}},t.prototype.addBoundsArea=function(t,e){var r=t.minX>e.x?t.minX:e.x,n=t.minY>e.y?t.minY:e.y,i=t.maxX<e.x+e.width?t.maxX:e.x+e.width,o=t.maxY<e.y+e.height?t.maxY:e.y+e.height;if(r<=i&&n<=o){var s=this.minX,a=this.minY,u=this.maxX,h=this.maxY;this.minX=r<s?r:s,this.minY=n<a?n:a,this.maxX=i>u?i:u,this.maxY=o>h?o:h}},t}();r.default=o},{\"../math\":66}],44:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),u=t(\"../utils\"),h=t(\"./DisplayObject\"),l=n(h),c=function(t){function e(){i(this,e);var r=o(this,t.call(this));return r.children=[],r}return s(e,t),e.prototype.onChildrenChange=function(){},e.prototype.addChild=function(t){var e=arguments.length;if(e>1)for(var r=0;r<e;r++)this.addChild(arguments[r]);else t.parent&&t.parent.removeChild(t),t.parent=this,this.transform._parentID=-1,this._boundsID++,this.children.push(t),this.onChildrenChange(this.children.length-1),t.emit(\"added\",this);return t},e.prototype.addChildAt=function(t,e){if(e<0||e>this.children.length)throw new Error(t+\"addChildAt: The index \"+e+\" supplied is out of bounds \"+this.children.length);return t.parent&&t.parent.removeChild(t),t.parent=this,this.children.splice(e,0,t),this.onChildrenChange(e),t.emit(\"added\",this),t},e.prototype.swapChildren=function(t,e){if(t!==e){var r=this.getChildIndex(t),n=this.getChildIndex(e);this.children[r]=e,this.children[n]=t,this.onChildrenChange(r<n?r:n)}},e.prototype.getChildIndex=function(t){var e=this.children.indexOf(t);if(e===-1)throw new Error(\"The supplied DisplayObject must be a child of the caller\");return e},e.prototype.setChildIndex=function(t,e){if(e<0||e>=this.children.length)throw new Error(\"The supplied index is out of bounds\");var r=this.getChildIndex(t);(0,u.removeItems)(this.children,r,1),this.children.splice(e,0,t),this.onChildrenChange(e)},e.prototype.getChildAt=function(t){if(t<0||t>=this.children.length)throw new Error(\"getChildAt: Index (\"+t+\") does not exist.\");return this.children[t]},e.prototype.removeChild=function(t){var e=arguments.length;if(e>1)for(var r=0;r<e;r++)this.removeChild(arguments[r]);else{var n=this.children.indexOf(t);if(n===-1)return null;t.parent=null,(0,u.removeItems)(this.children,n,1),this.transform._parentID=-1,this._boundsID++,this.onChildrenChange(n),t.emit(\"removed\",this)}return t},e.prototype.removeChildAt=function(t){var e=this.getChildAt(t);return e.parent=null,(0,u.removeItems)(this.children,t,1),this.onChildrenChange(t),e.emit(\"removed\",this),e},e.prototype.removeChildren=function(){var t=arguments.length<=0||void 0===arguments[0]?0:arguments[0],e=arguments[1],r=t,n=\"number\"==typeof e?e:this.children.length,i=n-r,o=void 0;if(i>0&&i<=n){o=this.children.splice(r,i);for(var s=0;s<o.length;++s)o[s].parent=null;this.onChildrenChange(t);for(var a=0;a<o.length;++a)o[a].emit(\"removed\",this);return o}if(0===i&&0===this.children.length)return[];throw new RangeError(\"removeChildren: numeric values are outside the acceptable range.\")},e.prototype.updateTransform=function(){this._boundsID++,this.transform.updateTransform(this.parent.transform),this.worldAlpha=this.alpha*this.parent.worldAlpha;for(var t=0,e=this.children.length;t<e;++t){var r=this.children[t];r.visible&&r.updateTransform()}},e.prototype.calculateBounds=function(){this._bounds.clear(),this._calculateBounds();for(var t=0;t<this.children.length;t++){var e=this.children[t];e.visible&&e.renderable&&(e.calculateBounds(),e._mask?(e._mask.calculateBounds(),this._bounds.addBoundsMask(e._bounds,e._mask._bounds)):e.filterArea?this._bounds.addBoundsArea(e._bounds,e.filterArea):this._bounds.addBounds(e._bounds))}this._lastBoundsID=this._boundsID},e.prototype._calculateBounds=function(){},e.prototype.renderWebGL=function(t){if(this.visible&&!(this.worldAlpha<=0)&&this.renderable)if(this._mask||this._filters)this.renderAdvancedWebGL(t);else{this._renderWebGL(t);for(var e=0,r=this.children.length;e<r;++e)this.children[e].renderWebGL(t)}},e.prototype.renderAdvancedWebGL=function(t){t.flush();var e=this._filters,r=this._mask;if(e){this._enabledFilters||(this._enabledFilters=[]),this._enabledFilters.length=0;for(var n=0;n<e.length;n++)e[n].enabled&&this._enabledFilters.push(e[n]);this._enabledFilters.length&&t.filterManager.pushFilter(this,this._enabledFilters)}r&&t.maskManager.pushMask(this,this._mask),this._renderWebGL(t);for(var i=0,o=this.children.length;i<o;i++)this.children[i].renderWebGL(t);t.flush(),r&&t.maskManager.popMask(this,this._mask),e&&this._enabledFilters&&this._enabledFilters.length&&t.filterManager.popFilter()},e.prototype._renderWebGL=function(t){},e.prototype._renderCanvas=function(t){},e.prototype.renderCanvas=function(t){if(this.visible&&!(this.worldAlpha<=0)&&this.renderable){this._mask&&t.maskManager.pushMask(this._mask),this._renderCanvas(t);for(var e=0,r=this.children.length;e<r;++e)this.children[e].renderCanvas(t);this._mask&&t.maskManager.popMask(t)}},e.prototype.destroy=function(e){t.prototype.destroy.call(this);var r=\"boolean\"==typeof e?e:e&&e.children,n=this.removeChildren(0,this.children.length);if(r)for(var i=0;i<n.length;++i)n[i].destroy(e)},a(e,[{key:\"width\",get:function(){return this.scale.x*this.getLocalBounds().width},set:function(t){var e=this.getLocalBounds().width;0!==e?this.scale.x=t/e:this.scale.x=1,this._width=t}},{key:\"height\",get:function(){return this.scale.y*this.getLocalBounds().height},set:function(t){var e=this.getLocalBounds().height;0!==e?this.scale.y=t/e:this.scale.y=1,this._height=t}}]),e}(l.default);r.default=c,c.prototype.containerUpdateTransform=c.prototype.updateTransform},{\"../utils\":117,\"./DisplayObject\":45}],45:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),u=t(\"eventemitter3\"),h=n(u),l=t(\"../const\"),c=t(\"../settings\"),d=n(c),f=t(\"./TransformStatic\"),p=n(f),v=t(\"./Transform\"),y=n(v),g=t(\"./Bounds\"),m=n(g),_=t(\"../math\"),b=function(t){function e(){i(this,e);var r=o(this,t.call(this)),n=d.default.TRANSFORM_MODE===l.TRANSFORM_MODE.STATIC?p.default:y.default;return r.tempDisplayObjectParent=null,r.transform=new n,r.alpha=1,r.visible=!0,r.renderable=!0,r.parent=null,r.worldAlpha=1,r.filterArea=null,r._filters=null,r._enabledFilters=null,r._bounds=new m.default,r._boundsID=0,r._lastBoundsID=-1,r._boundsRect=null,r._localBoundsRect=null,r._mask=null,r}return s(e,t),e.prototype.updateTransform=function(){this.transform.updateTransform(this.parent.transform),this.worldAlpha=this.alpha*this.parent.worldAlpha,this._bounds.updateID++},e.prototype._recursivePostUpdateTransform=function(){this.parent?(this.parent._recursivePostUpdateTransform(),this.transform.updateTransform(this.parent.transform)):this.transform.updateTransform(this._tempDisplayObjectParent.transform)},e.prototype.getBounds=function(t,e){return t||(this.parent?(this._recursivePostUpdateTransform(),this.updateTransform()):(this.parent=this._tempDisplayObjectParent,this.updateTransform(),this.parent=null)),this._boundsID!==this._lastBoundsID&&this.calculateBounds(),e||(this._boundsRect||(this._boundsRect=new _.Rectangle),e=this._boundsRect),this._bounds.getRectangle(e)},e.prototype.getLocalBounds=function(t){var e=this.transform,r=this.parent;this.parent=null,this.transform=this._tempDisplayObjectParent.transform,t||(this._localBoundsRect||(this._localBoundsRect=new _.Rectangle),t=this._localBoundsRect);var n=this.getBounds(!1,t);return this.parent=r,this.transform=e,n},e.prototype.toGlobal=function(t,e){var r=!(arguments.length<=2||void 0===arguments[2])&&arguments[2];return r||(this._recursivePostUpdateTransform(),this.parent?this.displayObjectUpdateTransform():(this.parent=this._tempDisplayObjectParent,this.displayObjectUpdateTransform(),this.parent=null)),this.worldTransform.apply(t,e)},e.prototype.toLocal=function(t,e,r,n){return e&&(t=e.toGlobal(t,r,n)),n||(this._recursivePostUpdateTransform(),this.parent?this.displayObjectUpdateTransform():(this.parent=this._tempDisplayObjectParent,this.displayObjectUpdateTransform(),this.parent=null)),this.worldTransform.applyInverse(t,r)},e.prototype.renderWebGL=function(t){},e.prototype.renderCanvas=function(t){},e.prototype.setParent=function(t){if(!t||!t.addChild)throw new Error(\"setParent: Argument must be a Container\");return t.addChild(this),t},e.prototype.setTransform=function(){var t=arguments.length<=0||void 0===arguments[0]?0:arguments[0],e=arguments.length<=1||void 0===arguments[1]?0:arguments[1],r=arguments.length<=2||void 0===arguments[2]?1:arguments[2],n=arguments.length<=3||void 0===arguments[3]?1:arguments[3],i=arguments.length<=4||void 0===arguments[4]?0:arguments[4],o=arguments.length<=5||void 0===arguments[5]?0:arguments[5],s=arguments.length<=6||void 0===arguments[6]?0:arguments[6],a=arguments.length<=7||void 0===arguments[7]?0:arguments[7],u=arguments.length<=8||void 0===arguments[8]?0:arguments[8];return this.position.x=t,this.position.y=e,this.scale.x=r?r:1,this.scale.y=n?n:1,this.rotation=i,this.skew.x=o,this.skew.y=s,this.pivot.x=a,this.pivot.y=u,this},e.prototype.destroy=function(){this.removeAllListeners(),this.parent&&this.parent.removeChild(this),this.transform=null,this.parent=null,this._bounds=null,this._currentBounds=null,this._mask=null,this.filterArea=null,this.interactive=!1,this.interactiveChildren=!1},a(e,[{key:\"_tempDisplayObjectParent\",get:function(){return null===this.tempDisplayObjectParent&&(this.tempDisplayObjectParent=new e),this.tempDisplayObjectParent}},{key:\"x\",get:function(){return this.position.x},set:function(t){this.transform.position.x=t}},{key:\"y\",get:function(){return this.position.y},set:function(t){this.transform.position.y=t}},{key:\"worldTransform\",get:function(){return this.transform.worldTransform}},{key:\"localTransform\",get:function(){return this.transform.localTransform}},{key:\"position\",get:function(){return this.transform.position},set:function(t){this.transform.position.copy(t)}},{key:\"scale\",get:function(){return this.transform.scale},set:function(t){this.transform.scale.copy(t)}},{key:\"pivot\",get:function(){return this.transform.pivot},set:function(t){this.transform.pivot.copy(t)}},{key:\"skew\",get:function(){return this.transform.skew},set:function(t){this.transform.skew.copy(t)}},{key:\"rotation\",get:function(){return this.transform.rotation},set:function(t){this.transform.rotation=t}},{key:\"worldVisible\",get:function(){var t=this;do{if(!t.visible)return!1;t=t.parent}while(t);return!0}},{key:\"mask\",get:function(){return this._mask},set:function(t){this._mask&&(this._mask.renderable=!0),this._mask=t,this._mask&&(this._mask.renderable=!1)}},{key:\"filters\",get:function(){return this._filters&&this._filters.slice()},set:function(t){this._filters=t&&t.slice()}}]),e}(h.default);r.default=b,b.prototype.displayObjectUpdateTransform=b.prototype.updateTransform},{\"../const\":42,\"../math\":66,\"../settings\":97,\"./Bounds\":43,\"./Transform\":46,\"./TransformStatic\":48,eventemitter3:3}],46:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),u=t(\"../math\"),h=t(\"./TransformBase\"),l=n(h),c=function(t){function e(){i(this,e);var r=o(this,t.call(this));return r.position=new u.Point(0,0),r.scale=new u.Point(1,1),r.skew=new u.ObservablePoint(r.updateSkew,r,0,0),r.pivot=new u.Point(0,0),r._rotation=0,r._sr=Math.sin(0),r._cr=Math.cos(0),r._cy=Math.cos(0),r._sy=Math.sin(0),r._nsx=Math.sin(0),r._cx=Math.cos(0),r}return s(e,t),e.prototype.updateSkew=function(){this._cy=Math.cos(this.skew.y),this._sy=Math.sin(this.skew.y),this._nsx=Math.sin(this.skew.x),this._cx=Math.cos(this.skew.x)},e.prototype.updateLocalTransform=function(){var t=this.localTransform,e=this._cr*this.scale.x,r=this._sr*this.scale.x,n=-this._sr*this.scale.y,i=this._cr*this.scale.y;t.a=this._cy*e+this._sy*n,t.b=this._cy*r+this._sy*i,t.c=this._nsx*e+this._cx*n,t.d=this._nsx*r+this._cx*i},e.prototype.updateTransform=function(t){var e=t.worldTransform,r=this.worldTransform,n=this.localTransform,i=this._cr*this.scale.x,o=this._sr*this.scale.x,s=-this._sr*this.scale.y,a=this._cr*this.scale.y;n.a=this._cy*i+this._sy*s,n.b=this._cy*o+this._sy*a,n.c=this._nsx*i+this._cx*s,n.d=this._nsx*o+this._cx*a,n.tx=this.position.x-(this.pivot.x*n.a+this.pivot.y*n.c),n.ty=this.position.y-(this.pivot.x*n.b+this.pivot.y*n.d),r.a=n.a*e.a+n.b*e.c,r.b=n.a*e.b+n.b*e.d,r.c=n.c*e.a+n.d*e.c,r.d=n.c*e.b+n.d*e.d,r.tx=n.tx*e.a+n.ty*e.c+e.tx,r.ty=n.tx*e.b+n.ty*e.d+e.ty,this._worldID++},e.prototype.setFromMatrix=function(t){t.decompose(this)},a(e,[{key:\"rotation\",get:function(){return this._rotation},set:function(t){this._rotation=t,this._sr=Math.sin(t),this._cr=Math.cos(t)}}]),e}(l.default);r.default=c},{\"../math\":66,\"./TransformBase\":47}],47:[function(t,e,r){\"use strict\";function n(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var i=t(\"../math\"),o=function(){function t(){n(this,t),this.worldTransform=new i.Matrix,this.localTransform=new i.Matrix,this._worldID=0,this._parentID=0}return t.prototype.updateLocalTransform=function(){},t.prototype.updateTransform=function(t){var e=t.worldTransform,r=this.worldTransform,n=this.localTransform;r.a=n.a*e.a+n.b*e.c,r.b=n.a*e.b+n.b*e.d,r.c=n.c*e.a+n.d*e.c,r.d=n.c*e.b+n.d*e.d,r.tx=n.tx*e.a+n.ty*e.c+e.tx,r.ty=n.tx*e.b+n.ty*e.d+e.ty,this._worldID++},t}();r.default=o,o.prototype.updateWorldTransform=o.prototype.updateTransform,o.IDENTITY=new o},{\"../math\":66}],48:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),u=t(\"../math\"),h=t(\"./TransformBase\"),l=n(h),c=function(t){function e(){i(this,e);var r=o(this,t.call(this));return r.position=new u.ObservablePoint(r.onChange,r,0,0),r.scale=new u.ObservablePoint(r.onChange,r,1,1),r.pivot=new u.ObservablePoint(r.onChange,r,0,0),r.skew=new u.ObservablePoint(r.updateSkew,r,0,0),r._rotation=0,r._sr=Math.sin(0),r._cr=Math.cos(0),r._cy=Math.cos(0),r._sy=Math.sin(0),r._nsx=Math.sin(0),r._cx=Math.cos(0),r._localID=0,r._currentLocalID=0,r}return s(e,t),e.prototype.onChange=function(){this._localID++},e.prototype.updateSkew=function(){this._cy=Math.cos(this.skew._y),this._sy=Math.sin(this.skew._y),this._nsx=Math.sin(this.skew._x),this._cx=Math.cos(this.skew._x),this._localID++},e.prototype.updateLocalTransform=function(){var t=this.localTransform;if(this._localID!==this._currentLocalID){var e=this._cr*this.scale._x,r=this._sr*this.scale._x,n=-this._sr*this.scale._y,i=this._cr*this.scale._y;t.a=this._cy*e+this._sy*n,t.b=this._cy*r+this._sy*i,t.c=this._nsx*e+this._cx*n,t.d=this._nsx*r+this._cx*i,t.tx=this.position._x-(this.pivot._x*t.a+this.pivot._y*t.c),t.ty=this.position._y-(this.pivot._x*t.b+this.pivot._y*t.d),this._currentLocalID=this._localID,this._parentID=-1}},e.prototype.updateTransform=function(t){var e=t.worldTransform,r=this.worldTransform,n=this.localTransform;if(this._localID!==this._currentLocalID){var i=this._cr*this.scale._x,o=this._sr*this.scale._x,s=-this._sr*this.scale._y,a=this._cr*this.scale._y;n.a=this._cy*i+this._sy*s,n.b=this._cy*o+this._sy*a,n.c=this._nsx*i+this._cx*s,n.d=this._nsx*o+this._cx*a,n.tx=this.position._x-(this.pivot._x*n.a+this.pivot._y*n.c),n.ty=this.position._y-(this.pivot._x*n.b+this.pivot._y*n.d),this._currentLocalID=this._localID,this._parentID=-1}this._parentID!==t._worldID&&(r.a=n.a*e.a+n.b*e.c,r.b=n.a*e.b+n.b*e.d,r.c=n.c*e.a+n.d*e.c,r.d=n.c*e.b+n.d*e.d,r.tx=n.tx*e.a+n.ty*e.c+e.tx,r.ty=n.tx*e.b+n.ty*e.d+e.ty,this._parentID=t._worldID,this._worldID++)},e.prototype.setFromMatrix=function(t){t.decompose(this),this._localID++},a(e,[{key:\"rotation\",get:function(){return this._rotation},set:function(t){this._rotation=t,this._sr=Math.sin(t),this._cr=Math.cos(t),this._localID++}}]),e}(l.default);r.default=c},{\"../math\":66,\"./TransformBase\":47}],49:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=t(\"../display/Container\"),u=n(a),h=t(\"../textures/RenderTexture\"),l=n(h),c=t(\"../textures/Texture\"),d=n(c),f=t(\"./GraphicsData\"),p=n(f),v=t(\"../sprites/Sprite\"),y=n(v),g=t(\"../math\"),m=t(\"../utils\"),_=t(\"../const\"),b=t(\"../display/Bounds\"),x=n(b),T=t(\"./utils/bezierCurveTo\"),w=n(T),E=t(\"../renderers/canvas/CanvasRenderer\"),O=n(E),S=void 0,M=new g.Matrix,P=new g.Point,C=new Float32Array(4),R=new Float32Array(4),A=function(t){function e(){i(this,e);var r=o(this,t.call(this));return r.fillAlpha=1,r.lineWidth=0,r.lineColor=0,r.graphicsData=[],r.tint=16777215,r._prevTint=16777215,r.blendMode=_.BLEND_MODES.NORMAL,r.currentPath=null,r._webGL={},r.isMask=!1,r.boundsPadding=0,r._localBounds=new x.default,r.dirty=0,r.fastRectDirty=-1,r.clearDirty=0,r.boundsDirty=-1,r.cachedSpriteDirty=!1,r._spriteRect=null,r._fastRect=!1,r}return s(e,t),e.prototype.clone=function t(){var t=new e;t.renderable=this.renderable,t.fillAlpha=this.fillAlpha,t.lineWidth=this.lineWidth,t.lineColor=this.lineColor,t.tint=this.tint,t.blendMode=this.blendMode,t.isMask=this.isMask,t.boundsPadding=this.boundsPadding,t.dirty=0,t.cachedSpriteDirty=this.cachedSpriteDirty;for(var r=0;r<this.graphicsData.length;++r)t.graphicsData.push(this.graphicsData[r].clone());return t.currentPath=t.graphicsData[t.graphicsData.length-1],t.updateLocalBounds(),t},e.prototype.lineStyle=function(){var t=arguments.length<=0||void 0===arguments[0]?0:arguments[0],e=arguments.length<=1||void 0===arguments[1]?0:arguments[1],r=arguments.length<=2||void 0===arguments[2]?1:arguments[2];if(this.lineWidth=t,this.lineColor=e,this.lineAlpha=r,this.currentPath)if(this.currentPath.shape.points.length){var n=new g.Polygon(this.currentPath.shape.points.slice(-2));n.closed=!1,this.drawShape(n)}else this.currentPath.lineWidth=this.lineWidth,this.currentPath.lineColor=this.lineColor,this.currentPath.lineAlpha=this.lineAlpha;return this},e.prototype.moveTo=function(t,e){var r=new g.Polygon([t,e]);return r.closed=!1,this.drawShape(r),this},e.prototype.lineTo=function(t,e){return this.currentPath.shape.points.push(t,e),this.dirty++,this},e.prototype.quadraticCurveTo=function(t,e,r,n){this.currentPath?0===this.currentPath.shape.points.length&&(this.currentPath.shape.points=[0,0]):this.moveTo(0,0);var i=20,o=this.currentPath.shape.points,s=0,a=0;0===o.length&&this.moveTo(0,0);for(var u=o[o.length-2],h=o[o.length-1],l=1;l<=i;++l){var c=l/i;s=u+(t-u)*c,a=h+(e-h)*c,o.push(s+(t+(r-t)*c-s)*c,a+(e+(n-e)*c-a)*c)}return this.dirty++,this},e.prototype.bezierCurveTo=function(t,e,r,n,i,o){this.currentPath?0===this.currentPath.shape.points.length&&(this.currentPath.shape.points=[0,0]):this.moveTo(0,0);var s=this.currentPath.shape.points,a=s[s.length-2],u=s[s.length-1];return s.length-=2,(0,w.default)(a,u,t,e,r,n,i,o,s),this.dirty++,this},e.prototype.arcTo=function(t,e,r,n,i){this.currentPath?0===this.currentPath.shape.points.length&&this.currentPath.shape.points.push(t,e):this.moveTo(t,e);var o=this.currentPath.shape.points,s=o[o.length-2],a=o[o.length-1],u=a-e,h=s-t,l=n-e,c=r-t,d=Math.abs(u*c-h*l);if(d<1e-8||0===i)o[o.length-2]===t&&o[o.length-1]===e||o.push(t,e);else{var f=u*u+h*h,p=l*l+c*c,v=u*l+h*c,y=i*Math.sqrt(f)/d,g=i*Math.sqrt(p)/d,m=y*v/f,_=g*v/p,b=y*c+g*h,x=y*l+g*u,T=h*(g+m),w=u*(g+m),E=c*(y+_),O=l*(y+_),S=Math.atan2(w-x,T-b),M=Math.atan2(O-x,E-b);this.arc(b+t,x+e,i,S,M,h*l>c*u)}return this.dirty++,this},e.prototype.arc=function(t,e,r,n,i){var o=!(arguments.length<=5||void 0===arguments[5])&&arguments[5];if(n===i)return this;!o&&i<=n?i+=2*Math.PI:o&&n<=i&&(n+=2*Math.PI);var s=i-n,a=40*Math.ceil(Math.abs(s)/(2*Math.PI));if(0===s)return this;var u=t+Math.cos(n)*r,h=e+Math.sin(n)*r,l=this.currentPath.shape.points;this.currentPath?l[l.length-2]===u&&l[l.length-1]===h||l.push(u,h):this.moveTo(u,h);for(var c=s/(2*a),d=2*c,f=Math.cos(c),p=Math.sin(c),v=a-1,y=v%1/v,g=0;g<=v;++g){var m=g+y*g,_=c+n+d*m,b=Math.cos(_),x=-Math.sin(_);l.push((f*b+p*x)*r+t,(f*-x+p*b)*r+e)}return this.dirty++,this},e.prototype.beginFill=function(){var t=arguments.length<=0||void 0===arguments[0]?0:arguments[0],e=arguments.length<=1||void 0===arguments[1]?1:arguments[1];return this.filling=!0,this.fillColor=t,this.fillAlpha=e,this.currentPath&&this.currentPath.shape.points.length<=2&&(this.currentPath.fill=this.filling,this.currentPath.fillColor=this.fillColor,\r\nthis.currentPath.fillAlpha=this.fillAlpha),this},e.prototype.endFill=function(){return this.filling=!1,this.fillColor=null,this.fillAlpha=1,this},e.prototype.drawRect=function(t,e,r,n){return this.drawShape(new g.Rectangle(t,e,r,n)),this},e.prototype.drawRoundedRect=function(t,e,r,n,i){return this.drawShape(new g.RoundedRectangle(t,e,r,n,i)),this},e.prototype.drawCircle=function(t,e,r){return this.drawShape(new g.Circle(t,e,r)),this},e.prototype.drawEllipse=function(t,e,r,n){return this.drawShape(new g.Ellipse(t,e,r,n)),this},e.prototype.drawPolygon=function(t){var e=t,r=!0;if(e instanceof g.Polygon&&(r=e.closed,e=e.points),!Array.isArray(e)){e=new Array(arguments.length);for(var n=0;n<e.length;++n)e[n]=arguments[n]}var i=new g.Polygon(e);return i.closed=r,this.drawShape(i),this},e.prototype.clear=function(){return(this.lineWidth||this.filling||this.graphicsData.length>0)&&(this.lineWidth=0,this.filling=!1,this.dirty++,this.clearDirty++,this.graphicsData.length=0),this},e.prototype.isFastRect=function(){return 1===this.graphicsData.length&&this.graphicsData[0].shape.type===_.SHAPES.RECT&&!this.graphicsData[0].lineWidth},e.prototype._renderWebGL=function(t){this.dirty!==this.fastRectDirty&&(this.fastRectDirty=this.dirty,this._fastRect=this.isFastRect()),this._fastRect?this._renderSpriteRect(t):(t.setObjectRenderer(t.plugins.graphics),t.plugins.graphics.render(this))},e.prototype._renderSpriteRect=function(t){var r=this.graphicsData[0].shape;if(!this._spriteRect){if(!e._SPRITE_TEXTURE){e._SPRITE_TEXTURE=l.default.create(10,10);var n=document.createElement(\"canvas\");n.width=10,n.height=10;var i=n.getContext(\"2d\");i.fillStyle=\"white\",i.fillRect(0,0,10,10),e._SPRITE_TEXTURE=d.default.fromCanvas(n)}this._spriteRect=new y.default(e._SPRITE_TEXTURE)}if(16777215===this.tint)this._spriteRect.tint=this.graphicsData[0].fillColor;else{var o=C,s=R;(0,m.hex2rgb)(this.graphicsData[0].fillColor,o),(0,m.hex2rgb)(this.tint,s),o[0]*=s[0],o[1]*=s[1],o[2]*=s[2],this._spriteRect.tint=(0,m.rgb2hex)(o)}this._spriteRect.alpha=this.graphicsData[0].fillAlpha,this._spriteRect.worldAlpha=this.worldAlpha*this._spriteRect.alpha,e._SPRITE_TEXTURE._frame.width=r.width,e._SPRITE_TEXTURE._frame.height=r.height,this._spriteRect.transform.worldTransform=this.transform.worldTransform,this._spriteRect.anchor.set(-r.x/r.width,-r.y/r.height),this._spriteRect._onAnchorUpdate(),this._spriteRect._renderWebGL(t)},e.prototype._renderCanvas=function(t){this.isMask!==!0&&t.plugins.graphics.render(this)},e.prototype._calculateBounds=function(){this.boundsDirty!==this.dirty&&(this.boundsDirty=this.dirty,this.updateLocalBounds(),this.dirty++,this.cachedSpriteDirty=!0);var t=this._localBounds;this._bounds.addFrame(this.transform,t.minX,t.minY,t.maxX,t.maxY)},e.prototype.containsPoint=function(t){this.worldTransform.applyInverse(t,P);for(var e=this.graphicsData,r=0;r<e.length;++r){var n=e[r];if(n.fill&&n.shape&&n.shape.contains(P.x,P.y))return!0}return!1},e.prototype.updateLocalBounds=function(){var t=1/0,e=-(1/0),r=1/0,n=-(1/0);if(this.graphicsData.length)for(var i=0,o=0,s=0,a=0,u=0,h=0;h<this.graphicsData.length;h++){var l=this.graphicsData[h],c=l.type,d=l.lineWidth;if(i=l.shape,c===_.SHAPES.RECT||c===_.SHAPES.RREC)o=i.x-d/2,s=i.y-d/2,a=i.width+d,u=i.height+d,t=o<t?o:t,e=o+a>e?o+a:e,r=s<r?s:r,n=s+u>n?s+u:n;else if(c===_.SHAPES.CIRC)o=i.x,s=i.y,a=i.radius+d/2,u=i.radius+d/2,t=o-a<t?o-a:t,e=o+a>e?o+a:e,r=s-u<r?s-u:r,n=s+u>n?s+u:n;else if(c===_.SHAPES.ELIP)o=i.x,s=i.y,a=i.width+d/2,u=i.height+d/2,t=o-a<t?o-a:t,e=o+a>e?o+a:e,r=s-u<r?s-u:r,n=s+u>n?s+u:n;else for(var f=i.points,p=0,v=0,y=0,g=0,m=0,b=0,x=0,T=0,w=0;w+2<f.length;w+=2)o=f[w],s=f[w+1],p=f[w+2],v=f[w+3],y=Math.abs(p-o),g=Math.abs(v-s),u=d,a=Math.sqrt(y*y+g*g),a<1e-9||(m=(u/a*g+y)/2,b=(u/a*y+g)/2,x=(p+o)/2,T=(v+s)/2,t=x-m<t?x-m:t,e=x+m>e?x+m:e,r=T-b<r?T-b:r,n=T+b>n?T+b:n)}else t=0,e=0,r=0,n=0;var E=this.boundsPadding;this._localBounds.minX=t-E,this._localBounds.maxX=e+2*E,this._localBounds.minY=r-E,this._localBounds.maxY=n+2*E},e.prototype.drawShape=function(t){this.currentPath&&this.currentPath.shape.points.length<=2&&this.graphicsData.pop(),this.currentPath=null;var e=new p.default(this.lineWidth,this.lineColor,this.lineAlpha,this.fillColor,this.fillAlpha,this.filling,t);return this.graphicsData.push(e),e.type===_.SHAPES.POLY&&(e.shape.closed=e.shape.closed||this.filling,this.currentPath=e),this.dirty++,e},e.prototype.generateCanvasTexture=function(t){var e=arguments.length<=1||void 0===arguments[1]?1:arguments[1],r=this.getLocalBounds(),n=l.default.create(r.width,r.height,t,e);S||(S=new O.default),M.tx=-r.x,M.ty=-r.y,S.render(this,n,!1,M);var i=d.default.fromCanvas(n.baseTexture._canvasRenderTarget.canvas,t);return i.baseTexture.resolution=e,i.baseTexture.update(),i},e.prototype.closePath=function(){var t=this.currentPath;return t&&t.shape&&t.shape.close(),this},e.prototype.addHole=function(){var t=this.graphicsData.pop();return this.currentPath=this.graphicsData[this.graphicsData.length-1],this.currentPath.addHole(t.shape),this.currentPath=null,this},e.prototype.destroy=function(e){t.prototype.destroy.call(this,e);for(var r=0;r<this.graphicsData.length;++r)this.graphicsData[r].destroy();for(var n in this._webgl)for(var i=0;i<this._webgl[n].data.length;++i)this._webgl[n].data[i].destroy();this._spriteRect&&this._spriteRect.destroy(),this.graphicsData=null,this.currentPath=null,this._webgl=null,this._localBounds=null},e}(u.default);r.default=A,A._SPRITE_TEXTURE=null},{\"../const\":42,\"../display/Bounds\":43,\"../display/Container\":44,\"../math\":66,\"../renderers/canvas/CanvasRenderer\":73,\"../sprites/Sprite\":98,\"../textures/RenderTexture\":108,\"../textures/Texture\":109,\"../utils\":117,\"./GraphicsData\":50,\"./utils/bezierCurveTo\":52}],50:[function(t,e,r){\"use strict\";function n(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var i=function(){function t(e,r,i,o,s,a,u){n(this,t),this.lineWidth=e,this.lineColor=r,this.lineAlpha=i,this._lineTint=r,this.fillColor=o,this.fillAlpha=s,this._fillTint=o,this.fill=a,this.holes=[],this.shape=u,this.type=u.type}return t.prototype.clone=function(){return new t(this.lineWidth,this.lineColor,this.lineAlpha,this.fillColor,this.fillAlpha,this.fill,this.shape)},t.prototype.addHole=function(t){this.holes.push(t)},t.prototype.destroy=function(){this.shape=null,this.holes=null},t}();r.default=i},{}],51:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var o=t(\"../../renderers/canvas/CanvasRenderer\"),s=n(o),a=t(\"../../const\"),u=function(){function t(e){i(this,t),this.renderer=e}return t.prototype.render=function(t){var e=this.renderer,r=e.context,n=t.worldAlpha,i=t.transform.worldTransform,o=e.resolution;this._prevTint!==this.tint&&(this.dirty=!0),r.setTransform(i.a*o,i.b*o,i.c*o,i.d*o,i.tx*o,i.ty*o),t.dirty&&(this.updateGraphicsTint(t),t.dirty=!1),e.setBlendMode(t.blendMode);for(var s=0;s<t.graphicsData.length;s++){var u=t.graphicsData[s],h=u.shape,l=u._fillTint,c=u._lineTint;if(r.lineWidth=u.lineWidth,u.type===a.SHAPES.POLY){r.beginPath(),this.renderPolygon(h.points,h.closed,r);for(var d=0;d<u.holes.length;d++)this.renderPolygon(u.holes[d].points,!0,r);u.fill&&(r.globalAlpha=u.fillAlpha*n,r.fillStyle=\"#\"+(\"00000\"+(0|l).toString(16)).substr(-6),r.fill()),u.lineWidth&&(r.globalAlpha=u.lineAlpha*n,r.strokeStyle=\"#\"+(\"00000\"+(0|c).toString(16)).substr(-6),r.stroke())}else if(u.type===a.SHAPES.RECT)(u.fillColor||0===u.fillColor)&&(r.globalAlpha=u.fillAlpha*n,r.fillStyle=\"#\"+(\"00000\"+(0|l).toString(16)).substr(-6),r.fillRect(h.x,h.y,h.width,h.height)),u.lineWidth&&(r.globalAlpha=u.lineAlpha*n,r.strokeStyle=\"#\"+(\"00000\"+(0|c).toString(16)).substr(-6),r.strokeRect(h.x,h.y,h.width,h.height));else if(u.type===a.SHAPES.CIRC)r.beginPath(),r.arc(h.x,h.y,h.radius,0,2*Math.PI),r.closePath(),u.fill&&(r.globalAlpha=u.fillAlpha*n,r.fillStyle=\"#\"+(\"00000\"+(0|l).toString(16)).substr(-6),r.fill()),u.lineWidth&&(r.globalAlpha=u.lineAlpha*n,r.strokeStyle=\"#\"+(\"00000\"+(0|c).toString(16)).substr(-6),r.stroke());else if(u.type===a.SHAPES.ELIP){var f=2*h.width,p=2*h.height,v=h.x-f/2,y=h.y-p/2;r.beginPath();var g=.5522848,m=f/2*g,_=p/2*g,b=v+f,x=y+p,T=v+f/2,w=y+p/2;r.moveTo(v,w),r.bezierCurveTo(v,w-_,T-m,y,T,y),r.bezierCurveTo(T+m,y,b,w-_,b,w),r.bezierCurveTo(b,w+_,T+m,x,T,x),r.bezierCurveTo(T-m,x,v,w+_,v,w),r.closePath(),u.fill&&(r.globalAlpha=u.fillAlpha*n,r.fillStyle=\"#\"+(\"00000\"+(0|l).toString(16)).substr(-6),r.fill()),u.lineWidth&&(r.globalAlpha=u.lineAlpha*n,r.strokeStyle=\"#\"+(\"00000\"+(0|c).toString(16)).substr(-6),r.stroke())}else if(u.type===a.SHAPES.RREC){var E=h.x,O=h.y,S=h.width,M=h.height,P=h.radius,C=Math.min(S,M)/2|0;P=P>C?C:P,r.beginPath(),r.moveTo(E,O+P),r.lineTo(E,O+M-P),r.quadraticCurveTo(E,O+M,E+P,O+M),r.lineTo(E+S-P,O+M),r.quadraticCurveTo(E+S,O+M,E+S,O+M-P),r.lineTo(E+S,O+P),r.quadraticCurveTo(E+S,O,E+S-P,O),r.lineTo(E+P,O),r.quadraticCurveTo(E,O,E,O+P),r.closePath(),(u.fillColor||0===u.fillColor)&&(r.globalAlpha=u.fillAlpha*n,r.fillStyle=\"#\"+(\"00000\"+(0|l).toString(16)).substr(-6),r.fill()),u.lineWidth&&(r.globalAlpha=u.lineAlpha*n,r.strokeStyle=\"#\"+(\"00000\"+(0|c).toString(16)).substr(-6),r.stroke())}}},t.prototype.updateGraphicsTint=function(t){t._prevTint=t.tint;for(var e=(t.tint>>16&255)/255,r=(t.tint>>8&255)/255,n=(255&t.tint)/255,i=0;i<t.graphicsData.length;++i){var o=t.graphicsData[i],s=0|o.fillColor,a=0|o.lineColor;o._fillTint=((s>>16&255)/255*e*255<<16)+((s>>8&255)/255*r*255<<8)+(255&s)/255*n*255,o._lineTint=((a>>16&255)/255*e*255<<16)+((a>>8&255)/255*r*255<<8)+(255&a)/255*n*255}},t.prototype.renderPolygon=function(t,e,r){r.moveTo(t[0],t[1]);for(var n=1;n<t.length/2;++n)r.lineTo(t[2*n],t[2*n+1]);e&&r.closePath()},t.prototype.destroy=function(){this.renderer=null},t}();r.default=u,s.default.registerPlugin(\"graphics\",u)},{\"../../const\":42,\"../../renderers/canvas/CanvasRenderer\":73}],52:[function(t,e,r){\"use strict\";function n(t,e,r,n,i,o,s,a){var u=arguments.length<=8||void 0===arguments[8]?[]:arguments[8],h=20,l=0,c=0,d=0,f=0,p=0;u.push(t,e);for(var v=1,y=0;v<=h;++v)y=v/h,l=1-y,c=l*l,d=c*l,f=y*y,p=f*y,u.push(d*t+3*c*y*r+3*l*f*i+p*s,d*e+3*c*y*n+3*l*f*o+p*a);return u}r.__esModule=!0,r.default=n},{}],53:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=t(\"../../utils\"),u=t(\"../../const\"),h=t(\"../../renderers/webgl/utils/ObjectRenderer\"),l=n(h),c=t(\"../../renderers/webgl/WebGLRenderer\"),d=n(c),f=t(\"./WebGLGraphicsData\"),p=n(f),v=t(\"./shaders/PrimitiveShader\"),y=n(v),g=t(\"./utils/buildPoly\"),m=n(g),_=t(\"./utils/buildRectangle\"),b=n(_),x=t(\"./utils/buildRoundedRectangle\"),T=n(x),w=t(\"./utils/buildCircle\"),E=n(w),O=function(t){function e(r){i(this,e);var n=o(this,t.call(this,r));return n.graphicsDataPool=[],n.primitiveShader=null,n.gl=r.gl,n.CONTEXT_UID=0,n}return s(e,t),e.prototype.onContextChange=function(){this.gl=this.renderer.gl,this.CONTEXT_UID=this.renderer.CONTEXT_UID,this.primitiveShader=new y.default(this.gl)},e.prototype.destroy=function(){l.default.prototype.destroy.call(this);for(var t=0;t<this.graphicsDataPool.length;++t)this.graphicsDataPool[t].destroy();this.graphicsDataPool=null},e.prototype.render=function(t){var e=this.renderer,r=e.gl,n=void 0,i=t._webGL[this.CONTEXT_UID];i&&t.dirty===i.dirty||(this.updateGraphics(t),i=t._webGL[this.CONTEXT_UID]);var o=this.primitiveShader;e.bindShader(o),e.state.setBlendMode(t.blendMode);for(var s=0,u=i.data.length;s<u;s++){n=i.data[s];var h=n.shader;e.bindShader(h),h.uniforms.translationMatrix=t.transform.worldTransform.toArray(!0),h.uniforms.tint=(0,a.hex2rgb)(t.tint),h.uniforms.alpha=t.worldAlpha,e.bindVao(n.vao),n.vao.draw(r.TRIANGLE_STRIP,n.indices.length)}},e.prototype.updateGraphics=function(t){var e=this.renderer.gl,r=t._webGL[this.CONTEXT_UID];if(r||(r=t._webGL[this.CONTEXT_UID]={lastIndex:0,data:[],gl:e,clearDirty:-1,dirty:-1}),r.dirty=t.dirty,t.clearDirty!==r.clearDirty){r.clearDirty=t.clearDirty;for(var n=0;n<r.data.length;n++)this.graphicsDataPool.push(r.data[n]);r.data.length=0,r.lastIndex=0}for(var i=void 0,o=r.lastIndex;o<t.graphicsData.length;o++){var s=t.graphicsData[o];i=this.getWebGLData(r,0),s.type===u.SHAPES.POLY&&(0,m.default)(s,i),s.type===u.SHAPES.RECT?(0,b.default)(s,i):s.type===u.SHAPES.CIRC||s.type===u.SHAPES.ELIP?(0,E.default)(s,i):s.type===u.SHAPES.RREC&&(0,T.default)(s,i),r.lastIndex++}this.renderer.bindVao(null);for(var a=0;a<r.data.length;a++)i=r.data[a],i.dirty&&i.upload()},e.prototype.getWebGLData=function(t,e){var r=t.data[t.data.length-1];return(!r||r.points.length>32e4)&&(r=this.graphicsDataPool.pop()||new p.default(this.renderer.gl,this.primitiveShader,this.renderer.state.attribsState),r.reset(e),t.data.push(r)),r.dirty=!0,r},e}(l.default);r.default=O,d.default.registerPlugin(\"graphics\",O)},{\"../../const\":42,\"../../renderers/webgl/WebGLRenderer\":80,\"../../renderers/webgl/utils/ObjectRenderer\":90,\"../../utils\":117,\"./WebGLGraphicsData\":54,\"./shaders/PrimitiveShader\":55,\"./utils/buildCircle\":56,\"./utils/buildPoly\":58,\"./utils/buildRectangle\":59,\"./utils/buildRoundedRectangle\":60}],54:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var o=t(\"pixi-gl-core\"),s=n(o),a=function(){function t(e,r,n){i(this,t),this.gl=e,this.color=[0,0,0],this.points=[],this.indices=[],this.buffer=s.default.GLBuffer.createVertexBuffer(e),this.indexBuffer=s.default.GLBuffer.createIndexBuffer(e),this.dirty=!0,this.glPoints=null,this.glIndices=null,this.shader=r,this.vao=new s.default.VertexArrayObject(e,n).addIndex(this.indexBuffer).addAttribute(this.buffer,r.attributes.aVertexPosition,e.FLOAT,!1,24,0).addAttribute(this.buffer,r.attributes.aColor,e.FLOAT,!1,24,8)}return t.prototype.reset=function(){this.points.length=0,this.indices.length=0},t.prototype.upload=function(){this.glPoints=new Float32Array(this.points),this.buffer.upload(this.glPoints),this.glIndices=new Uint16Array(this.indices),this.indexBuffer.upload(this.glIndices),this.dirty=!1},t.prototype.destroy=function(){this.color=null,this.points=null,this.indices=null,this.vao.destroy(),this.buffer.destroy(),this.indexBuffer.destroy(),this.gl=null,this.buffer=null,this.indexBuffer=null,this.glPoints=null,this.glIndices=null},t}();r.default=a},{\"pixi-gl-core\":12}],55:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=t(\"../../../Shader\"),u=n(a),h=function(t){function e(r){return i(this,e),o(this,t.call(this,r,[\"attribute vec2 aVertexPosition;\",\"attribute vec4 aColor;\",\"uniform mat3 translationMatrix;\",\"uniform mat3 projectionMatrix;\",\"uniform float alpha;\",\"uniform vec3 tint;\",\"varying vec4 vColor;\",\"void main(void){\",\"   gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\",\"   vColor = aColor * vec4(tint * alpha, alpha);\",\"}\"].join(\"\\n\"),[\"varying vec4 vColor;\",\"void main(void){\",\"   gl_FragColor = vColor;\",\"}\"].join(\"\\n\")))}return s(e,t),e}(u.default);r.default=h},{\"../../../Shader\":41}],56:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){var r=t.shape,n=r.x,i=r.y,o=void 0,h=void 0;t.type===a.SHAPES.CIRC?(o=r.radius,h=r.radius):(o=r.width,h=r.height);var l=Math.floor(30*Math.sqrt(r.radius))||Math.floor(15*Math.sqrt(r.width+r.height)),c=2*Math.PI/l;if(t.fill){var d=(0,u.hex2rgb)(t.fillColor),f=t.fillAlpha,p=d[0]*f,v=d[1]*f,y=d[2]*f,g=e.points,m=e.indices,_=g.length/6;m.push(_);for(var b=0;b<l+1;b++)g.push(n,i,p,v,y,f),g.push(n+Math.sin(c*b)*o,i+Math.cos(c*b)*h,p,v,y,f),m.push(_++,_++);m.push(_-1)}if(t.lineWidth){var x=t.points;t.points=[];for(var T=0;T<l+1;T++)t.points.push(n+Math.sin(c*T)*o,i+Math.cos(c*T)*h);(0,s.default)(t,e),t.points=x}}r.__esModule=!0,r.default=i;var o=t(\"./buildLine\"),s=n(o),a=t(\"../../../const\"),u=t(\"../../../utils\")},{\"../../../const\":42,\"../../../utils\":117,\"./buildLine\":57}],57:[function(t,e,r){\"use strict\";function n(t,e){var r=t.points;if(0!==r.length){var n=new i.Point(r[0],r[1]),s=new i.Point(r[r.length-2],r[r.length-1]);if(n.x===s.x&&n.y===s.y){r=r.slice(),r.pop(),r.pop(),s=new i.Point(r[r.length-2],r[r.length-1]);var a=s.x+.5*(n.x-s.x),u=s.y+.5*(n.y-s.y);r.unshift(a,u),r.push(a,u)}var h=e.points,l=e.indices,c=r.length/2,d=r.length,f=h.length/6,p=t.lineWidth/2,v=(0,o.hex2rgb)(t.lineColor),y=t.lineAlpha,g=v[0]*y,m=v[1]*y,_=v[2]*y,b=r[0],x=r[1],T=r[2],w=r[3],E=0,O=0,S=-(x-w),M=b-T,P=0,C=0,R=0,A=0,D=Math.sqrt(S*S+M*M);S/=D,M/=D,S*=p,M*=p,h.push(b-S,x-M,g,m,_,y),h.push(b+S,x+M,g,m,_,y);for(var I=1;I<c-1;++I){b=r[2*(I-1)],x=r[2*(I-1)+1],T=r[2*I],w=r[2*I+1],E=r[2*(I+1)],O=r[2*(I+1)+1],S=-(x-w),M=b-T,D=Math.sqrt(S*S+M*M),S/=D,M/=D,S*=p,M*=p,P=-(w-O),C=T-E,D=Math.sqrt(P*P+C*C),P/=D,C/=D,P*=p,C*=p;var L=-M+x-(-M+w),j=-S+T-(-S+b),B=(-S+b)*(-M+w)-(-S+T)*(-M+x),F=-C+O-(-C+w),N=-P+T-(-P+E),k=(-P+E)*(-C+w)-(-P+T)*(-C+O),U=L*N-F*j;if(Math.abs(U)<.1)U+=10.1,h.push(T-S,w-M,g,m,_,y),h.push(T+S,w+M,g,m,_,y);else{var X=(j*k-N*B)/U,W=(F*B-L*k)/U,G=(X-T)*(X-T)+(W-w)*(W-w);G>196*p*p?(R=S-P,A=M-C,D=Math.sqrt(R*R+A*A),R/=D,A/=D,R*=p,A*=p,h.push(T-R,w-A),h.push(g,m,_,y),h.push(T+R,w+A),h.push(g,m,_,y),h.push(T-R,w-A),h.push(g,m,_,y),d++):(h.push(X,W),h.push(g,m,_,y),h.push(T-(X-T),w-(W-w)),h.push(g,m,_,y))}}b=r[2*(c-2)],x=r[2*(c-2)+1],T=r[2*(c-1)],w=r[2*(c-1)+1],S=-(x-w),M=b-T,D=Math.sqrt(S*S+M*M),S/=D,M/=D,S*=p,M*=p,h.push(T-S,w-M),h.push(g,m,_,y),h.push(T+S,w+M),h.push(g,m,_,y),l.push(f);for(var H=0;H<d;++H)l.push(f++);l.push(f-1)}}r.__esModule=!0,r.default=n;var i=t(\"../../../math\"),o=t(\"../../../utils\")},{\"../../../math\":66,\"../../../utils\":117}],58:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){t.points=t.shape.points.slice();var r=t.points;if(t.fill&&r.length>=6){for(var n=[],i=t.holes,o=0;o<i.length;o++){var u=i[o];n.push(r.length/2),r=r.concat(u.points)}var l=e.points,c=e.indices,d=r.length/2,f=(0,a.hex2rgb)(t.fillColor),p=t.fillAlpha,v=f[0]*p,y=f[1]*p,g=f[2]*p,m=(0,h.default)(r,n,2);if(!m)return;for(var _=l.length/6,b=0;b<m.length;b+=3)c.push(m[b]+_),c.push(m[b]+_),c.push(m[b+1]+_),c.push(m[b+2]+_),c.push(m[b+2]+_);for(var x=0;x<d;x++)l.push(r[2*x],r[2*x+1],v,y,g,p)}t.lineWidth>0&&(0,s.default)(t,e)}r.__esModule=!0,r.default=i;var o=t(\"./buildLine\"),s=n(o),a=t(\"../../../utils\"),u=t(\"earcut\"),h=n(u)},{\"../../../utils\":117,\"./buildLine\":57,earcut:2}],59:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){var r=t.shape,n=r.x,i=r.y,o=r.width,u=r.height;if(t.fill){var h=(0,a.hex2rgb)(t.fillColor),l=t.fillAlpha,c=h[0]*l,d=h[1]*l,f=h[2]*l,p=e.points,v=e.indices,y=p.length/6;p.push(n,i),p.push(c,d,f,l),p.push(n+o,i),p.push(c,d,f,l),p.push(n,i+u),p.push(c,d,f,l),p.push(n+o,i+u),p.push(c,d,f,l),v.push(y,y,y+1,y+2,y+3,y+3)}if(t.lineWidth){var g=t.points;t.points=[n,i,n+o,i,n+o,i+u,n,i+u,n,i],(0,s.default)(t,e),t.points=g}}r.__esModule=!0,r.default=i;var o=t(\"./buildLine\"),s=n(o),a=t(\"../../../utils\")},{\"../../../utils\":117,\"./buildLine\":57}],60:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){var r=t.shape,n=r.x,i=r.y,s=r.width,u=r.height,c=r.radius,d=[];if(d.push(n,i+c),o(n,i+u-c,n,i+u,n+c,i+u,d),o(n+s-c,i+u,n+s,i+u,n+s,i+u-c,d),o(n+s,i+c,n+s,i,n+s-c,i,d),o(n+c,i,n,i,n,i+c+1e-10,d),t.fill){for(var f=(0,l.hex2rgb)(t.fillColor),p=t.fillAlpha,v=f[0]*p,y=f[1]*p,g=f[2]*p,m=e.points,_=e.indices,b=m.length/6,x=(0,a.default)(d,null,2),T=0,w=x.length;T<w;T+=3)_.push(x[T]+b),_.push(x[T]+b),_.push(x[T+1]+b),_.push(x[T+2]+b),_.push(x[T+2]+b);for(var E=0,O=d.length;E<O;E++)m.push(d[E],d[++E],v,y,g,p)}if(t.lineWidth){var S=t.points;t.points=d,(0,h.default)(t,e),t.points=S}}function o(t,e,r,n,i,o){function s(t,e,r){var n=e-t;return t+n*r}for(var a=arguments.length<=6||void 0===arguments[6]?[]:arguments[6],u=20,h=a,l=0,c=0,d=0,f=0,p=0,v=0,y=0,g=0;y<=u;++y)g=y/u,l=s(t,r,g),c=s(e,n,g),d=s(r,i,g),f=s(n,o,g),p=s(l,d,g),v=s(c,f,g),h.push(p,v);return h}r.__esModule=!0,r.default=i;var s=t(\"earcut\"),a=n(s),u=t(\"./buildLine\"),h=n(u),l=t(\"../../../utils\")},{\"../../../utils\":117,\"./buildLine\":57,earcut:2}],61:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function i(t){return t&&t.__esModule?t:{default:t}}function o(){var t=arguments.length<=0||void 0===arguments[0]?800:arguments[0],e=arguments.length<=1||void 0===arguments[1]?600:arguments[1],r=arguments[2],n=arguments[3];return!n&&U.isWebGLSupported()?new q.default(t,e,r):new Y.default(t,e,r)}r.__esModule=!0,r.Filter=r.SpriteMaskFilter=r.Quad=r.RenderTarget=r.ObjectRenderer=r.WebGLManager=r.Shader=r.CanvasRenderTarget=r.TextureUvs=r.VideoBaseTexture=r.BaseRenderTexture=r.RenderTexture=r.BaseTexture=r.Texture=r.CanvasGraphicsRenderer=r.GraphicsRenderer=r.GraphicsData=r.Graphics=r.TextStyle=r.Text=r.SpriteRenderer=r.CanvasTinter=r.CanvasSpriteRenderer=r.Sprite=r.TransformBase=r.TransformStatic=r.Transform=r.Container=r.DisplayObject=r.Bounds=r.glCore=r.WebGLRenderer=r.CanvasRenderer=r.ticker=r.utils=r.settings=void 0;var s=t(\"./const\");Object.keys(s).forEach(function(t){\"default\"!==t&&\"__esModule\"!==t&&Object.defineProperty(r,t,{enumerable:!0,get:function(){return s[t]}})});var a=t(\"./math\");Object.keys(a).forEach(function(t){\"default\"!==t&&\"__esModule\"!==t&&Object.defineProperty(r,t,{enumerable:!0,get:function(){return a[t]}})});var u=t(\"pixi-gl-core\");Object.defineProperty(r,\"glCore\",{enumerable:!0,get:function(){return i(u).default}});var h=t(\"./display/Bounds\");Object.defineProperty(r,\"Bounds\",{enumerable:!0,get:function(){return i(h).default}});var l=t(\"./display/DisplayObject\");Object.defineProperty(r,\"DisplayObject\",{enumerable:!0,get:function(){return i(l).default}});var c=t(\"./display/Container\");Object.defineProperty(r,\"Container\",{enumerable:!0,get:function(){return i(c).default}});var d=t(\"./display/Transform\");Object.defineProperty(r,\"Transform\",{enumerable:!0,get:function(){return i(d).default}});var f=t(\"./display/TransformStatic\");Object.defineProperty(r,\"TransformStatic\",{enumerable:!0,get:function(){return i(f).default}});var p=t(\"./display/TransformBase\");Object.defineProperty(r,\"TransformBase\",{enumerable:!0,get:function(){return i(p).default}});var v=t(\"./sprites/Sprite\");Object.defineProperty(r,\"Sprite\",{enumerable:!0,get:function(){return i(v).default}});var y=t(\"./sprites/canvas/CanvasSpriteRenderer\");Object.defineProperty(r,\"CanvasSpriteRenderer\",{enumerable:!0,get:function(){return i(y).default}});var g=t(\"./sprites/canvas/CanvasTinter\");Object.defineProperty(r,\"CanvasTinter\",{enumerable:!0,get:function(){return i(g).default}});var m=t(\"./sprites/webgl/SpriteRenderer\");Object.defineProperty(r,\"SpriteRenderer\",{enumerable:!0,get:function(){return i(m).default}});var _=t(\"./text/Text\");Object.defineProperty(r,\"Text\",{enumerable:!0,get:function(){return i(_).default}});var b=t(\"./text/TextStyle\");Object.defineProperty(r,\"TextStyle\",{enumerable:!0,get:function(){return i(b).default}});var x=t(\"./graphics/Graphics\");Object.defineProperty(r,\"Graphics\",{enumerable:!0,get:function(){return i(x).default}});var T=t(\"./graphics/GraphicsData\");Object.defineProperty(r,\"GraphicsData\",{enumerable:!0,get:function(){return i(T).default}});var w=t(\"./graphics/webgl/GraphicsRenderer\");Object.defineProperty(r,\"GraphicsRenderer\",{enumerable:!0,get:function(){return i(w).default}});var E=t(\"./graphics/canvas/CanvasGraphicsRenderer\");Object.defineProperty(r,\"CanvasGraphicsRenderer\",{enumerable:!0,get:function(){return i(E).default}});var O=t(\"./textures/Texture\");Object.defineProperty(r,\"Texture\",{enumerable:!0,get:function(){return i(O).default}});var S=t(\"./textures/BaseTexture\");Object.defineProperty(r,\"BaseTexture\",{enumerable:!0,get:function(){return i(S).default}});var M=t(\"./textures/RenderTexture\");Object.defineProperty(r,\"RenderTexture\",{enumerable:!0,get:function(){return i(M).default}});var P=t(\"./textures/BaseRenderTexture\");Object.defineProperty(r,\"BaseRenderTexture\",{enumerable:!0,get:function(){return i(P).default}});var C=t(\"./textures/VideoBaseTexture\");Object.defineProperty(r,\"VideoBaseTexture\",{enumerable:!0,get:function(){return i(C).default}});var R=t(\"./textures/TextureUvs\");Object.defineProperty(r,\"TextureUvs\",{enumerable:!0,get:function(){return i(R).default}});var A=t(\"./renderers/canvas/utils/CanvasRenderTarget\");Object.defineProperty(r,\"CanvasRenderTarget\",{enumerable:!0,get:function(){return i(A).default}});var D=t(\"./Shader\");Object.defineProperty(r,\"Shader\",{enumerable:!0,get:function(){return i(D).default}});var I=t(\"./renderers/webgl/managers/WebGLManager\");Object.defineProperty(r,\"WebGLManager\",{enumerable:!0,get:function(){return i(I).default}});var L=t(\"./renderers/webgl/utils/ObjectRenderer\");Object.defineProperty(r,\"ObjectRenderer\",{enumerable:!0,get:function(){return i(L).default}});var j=t(\"./renderers/webgl/utils/RenderTarget\");Object.defineProperty(r,\"RenderTarget\",{enumerable:!0,get:function(){return i(j).default}});var B=t(\"./renderers/webgl/utils/Quad\");Object.defineProperty(r,\"Quad\",{enumerable:!0,get:function(){return i(B).default}});var F=t(\"./renderers/webgl/filters/spriteMask/SpriteMaskFilter\");Object.defineProperty(r,\"SpriteMaskFilter\",{enumerable:!0,get:function(){return i(F).default}});var N=t(\"./renderers/webgl/filters/Filter\");Object.defineProperty(r,\"Filter\",{enumerable:!0,get:function(){return i(N).default}}),r.autoDetectRenderer=o;var k=t(\"./utils\"),U=n(k),X=t(\"./ticker\"),W=n(X),G=t(\"./settings\"),H=i(G),V=t(\"./renderers/canvas/CanvasRenderer\"),Y=i(V),z=t(\"./renderers/webgl/WebGLRenderer\"),q=i(z);r.settings=H.default,r.utils=U,r.ticker=W,r.CanvasRenderer=Y.default,r.WebGLRenderer=q.default},{\"./Shader\":41,\"./const\":42,\"./display/Bounds\":43,\"./display/Container\":44,\"./display/DisplayObject\":45,\"./display/Transform\":46,\"./display/TransformBase\":47,\"./display/TransformStatic\":48,\"./graphics/Graphics\":49,\"./graphics/GraphicsData\":50,\"./graphics/canvas/CanvasGraphicsRenderer\":51,\"./graphics/webgl/GraphicsRenderer\":53,\"./math\":66,\"./renderers/canvas/CanvasRenderer\":73,\"./renderers/canvas/utils/CanvasRenderTarget\":75,\"./renderers/webgl/WebGLRenderer\":80,\"./renderers/webgl/filters/Filter\":82,\"./renderers/webgl/filters/spriteMask/SpriteMaskFilter\":85,\"./renderers/webgl/managers/WebGLManager\":89,\"./renderers/webgl/utils/ObjectRenderer\":90,\"./renderers/webgl/utils/Quad\":91,\"./renderers/webgl/utils/RenderTarget\":92,\"./settings\":97,\"./sprites/Sprite\":98,\"./sprites/canvas/CanvasSpriteRenderer\":99,\"./sprites/canvas/CanvasTinter\":100,\"./sprites/webgl/SpriteRenderer\":102,\"./text/Text\":104,\"./text/TextStyle\":105,\"./textures/BaseRenderTexture\":106,\"./textures/BaseTexture\":107,\"./textures/RenderTexture\":108,\"./textures/Texture\":109,\"./textures/TextureUvs\":110,\"./textures/VideoBaseTexture\":111,\"./ticker\":113,\"./utils\":117,\"pixi-gl-core\":12}],62:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t){return t<0?-1:t>0?1:0}function o(){for(var t=0;t<16;t++){var e=[];f.push(e);for(var r=0;r<16;r++)for(var n=i(u[t]*u[r]+l[t]*h[r]),o=i(h[t]*u[r]+c[t]*h[r]),s=i(u[t]*l[r]+l[t]*c[r]),p=i(h[t]*l[r]+c[t]*c[r]),v=0;v<16;v++)if(u[v]===n&&h[v]===o&&l[v]===s&&c[v]===p){e.push(v);break}}for(var y=0;y<16;y++){var g=new a.default;g.set(u[y],h[y],l[y],c[y],0,0),d.push(g)}}r.__esModule=!0;var s=t(\"./Matrix\"),a=n(s),u=[1,1,0,-1,-1,-1,0,1,1,1,0,-1,-1,-1,0,1],h=[0,1,1,1,0,-1,-1,-1,0,1,1,1,0,-1,-1,-1],l=[0,-1,-1,-1,0,1,1,1,0,1,1,1,0,-1,-1,-1],c=[1,1,0,-1,-1,-1,0,1,-1,-1,0,1,1,1,0,-1],d=[],f=[];o();var p={E:0,SE:1,S:2,SW:3,W:4,NW:5,N:6,NE:7,MIRROR_VERTICAL:8,MIRROR_HORIZONTAL:12,uX:function(t){return u[t]},uY:function(t){return h[t]},vX:function(t){return l[t]},vY:function(t){return c[t]},inv:function(t){return 8&t?15&t:7&-t},add:function(t,e){return f[t][e]},sub:function(t,e){return f[t][p.inv(e)]},rotate180:function(t){return 4^t},isSwapWidthHeight:function(t){return 2===(3&t)},byDirection:function(t,e){return 2*Math.abs(t)<=Math.abs(e)?e>=0?p.S:p.N:2*Math.abs(e)<=Math.abs(t)?t>0?p.E:p.W:e>0?t>0?p.SE:p.SW:t>0?p.NE:p.NW},matrixAppendRotationInv:function(t,e){var r=arguments.length<=2||void 0===arguments[2]?0:arguments[2],n=arguments.length<=3||void 0===arguments[3]?0:arguments[3],i=d[p.inv(e)];i.tx=r,i.ty=n,t.append(i)}};r.default=p},{\"./Matrix\":63}],63:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var o=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),s=t(\"./Point\"),a=n(s),u=function(){function t(){i(this,t),this.a=1,this.b=0,this.c=0,this.d=1,this.tx=0,this.ty=0,this.array=null}return t.prototype.fromArray=function(t){this.a=t[0],this.b=t[1],this.c=t[3],this.d=t[4],this.tx=t[2],this.ty=t[5]},t.prototype.set=function(t,e,r,n,i,o){return this.a=t,this.b=e,this.c=r,this.d=n,this.tx=i,this.ty=o,this},t.prototype.toArray=function(t,e){this.array||(this.array=new Float32Array(9));var r=e||this.array;return t?(r[0]=this.a,r[1]=this.b,r[2]=0,r[3]=this.c,r[4]=this.d,r[5]=0,r[6]=this.tx,r[7]=this.ty,r[8]=1):(r[0]=this.a,r[1]=this.c,r[2]=this.tx,r[3]=this.b,r[4]=this.d,r[5]=this.ty,r[6]=0,r[7]=0,r[8]=1),r},t.prototype.apply=function(t,e){e=e||new a.default;var r=t.x,n=t.y;return e.x=this.a*r+this.c*n+this.tx,e.y=this.b*r+this.d*n+this.ty,e},t.prototype.applyInverse=function(t,e){e=e||new a.default;var r=1/(this.a*this.d+this.c*-this.b),n=t.x,i=t.y;return e.x=this.d*r*n+-this.c*r*i+(this.ty*this.c-this.tx*this.d)*r,e.y=this.a*r*i+-this.b*r*n+(-this.ty*this.a+this.tx*this.b)*r,e},t.prototype.translate=function(t,e){return this.tx+=t,this.ty+=e,this},t.prototype.scale=function(t,e){return this.a*=t,this.d*=e,this.c*=t,this.b*=e,this.tx*=t,this.ty*=e,this},t.prototype.rotate=function(t){var e=Math.cos(t),r=Math.sin(t),n=this.a,i=this.c,o=this.tx;return this.a=n*e-this.b*r,this.b=n*r+this.b*e,this.c=i*e-this.d*r,this.d=i*r+this.d*e,this.tx=o*e-this.ty*r,this.ty=o*r+this.ty*e,this},t.prototype.append=function(t){var e=this.a,r=this.b,n=this.c,i=this.d;return this.a=t.a*e+t.b*n,this.b=t.a*r+t.b*i,this.c=t.c*e+t.d*n,this.d=t.c*r+t.d*i,this.tx=t.tx*e+t.ty*n+this.tx,this.ty=t.tx*r+t.ty*i+this.ty,this},t.prototype.setTransform=function(t,e,r,n,i,o,s,a,u){var h=Math.sin(s),l=Math.cos(s),c=Math.cos(u),d=Math.sin(u),f=-Math.sin(a),p=Math.cos(a),v=l*i,y=h*i,g=-h*o,m=l*o;return this.a=c*v+d*g,this.b=c*y+d*m,this.c=f*v+p*g,this.d=f*y+p*m,\r\nthis.tx=t+(r*v+n*g),this.ty=e+(r*y+n*m),this},t.prototype.prepend=function(t){var e=this.tx;if(1!==t.a||0!==t.b||0!==t.c||1!==t.d){var r=this.a,n=this.c;this.a=r*t.a+this.b*t.c,this.b=r*t.b+this.b*t.d,this.c=n*t.a+this.d*t.c,this.d=n*t.b+this.d*t.d}return this.tx=e*t.a+this.ty*t.c+t.tx,this.ty=e*t.b+this.ty*t.d+t.ty,this},t.prototype.decompose=function(t){var e=this.a,r=this.b,n=this.c,i=this.d,o=Math.atan2(-n,i),s=Math.atan2(r,e),a=Math.abs(1-o/s);return a<1e-5?(t.rotation=s,e<0&&i>=0&&(t.rotation+=t.rotation<=0?Math.PI:-Math.PI),t.skew.x=t.skew.y=0):(t.skew.x=o,t.skew.y=s),t.scale.x=Math.sqrt(e*e+r*r),t.scale.y=Math.sqrt(n*n+i*i),t.position.x=this.tx,t.position.y=this.ty,t},t.prototype.invert=function(){var t=this.a,e=this.b,r=this.c,n=this.d,i=this.tx,o=t*n-e*r;return this.a=n/o,this.b=-e/o,this.c=-r/o,this.d=t/o,this.tx=(r*this.ty-n*i)/o,this.ty=-(t*this.ty-e*i)/o,this},t.prototype.identity=function(){return this.a=1,this.b=0,this.c=0,this.d=1,this.tx=0,this.ty=0,this},t.prototype.clone=function(){var e=new t;return e.a=this.a,e.b=this.b,e.c=this.c,e.d=this.d,e.tx=this.tx,e.ty=this.ty,e},t.prototype.copy=function(t){return t.a=this.a,t.b=this.b,t.c=this.c,t.d=this.d,t.tx=this.tx,t.ty=this.ty,t},o(t,null,[{key:\"IDENTITY\",get:function(){return new t}},{key:\"TEMP_MATRIX\",get:function(){return new t}}]),t}();r.default=u},{\"./Point\":65}],64:[function(t,e,r){\"use strict\";function n(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var i=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),o=function(){function t(e,r){var i=arguments.length<=2||void 0===arguments[2]?0:arguments[2],o=arguments.length<=3||void 0===arguments[3]?0:arguments[3];n(this,t),this._x=i,this._y=o,this.cb=e,this.scope=r}return t.prototype.set=function(t,e){var r=t||0,n=e||(0!==e?r:0);this._x===r&&this._y===n||(this._x=r,this._y=n,this.cb.call(this.scope))},t.prototype.copy=function(t){this._x===t.x&&this._y===t.y||(this._x=t.x,this._y=t.y,this.cb.call(this.scope))},i(t,[{key:\"x\",get:function(){return this._x},set:function(t){this._x!==t&&(this._x=t,this.cb.call(this.scope))}},{key:\"y\",get:function(){return this._y},set:function(t){this._y!==t&&(this._y=t,this.cb.call(this.scope))}}]),t}();r.default=o},{}],65:[function(t,e,r){\"use strict\";function n(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var i=function(){function t(){var e=arguments.length<=0||void 0===arguments[0]?0:arguments[0],r=arguments.length<=1||void 0===arguments[1]?0:arguments[1];n(this,t),this.x=e,this.y=r}return t.prototype.clone=function(){return new t(this.x,this.y)},t.prototype.copy=function(t){this.set(t.x,t.y)},t.prototype.equals=function(t){return t.x===this.x&&t.y===this.y},t.prototype.set=function(t,e){this.x=t||0,this.y=e||(0!==e?this.x:0)},t}();r.default=i},{}],66:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}r.__esModule=!0;var i=t(\"./Point\");Object.defineProperty(r,\"Point\",{enumerable:!0,get:function(){return n(i).default}});var o=t(\"./ObservablePoint\");Object.defineProperty(r,\"ObservablePoint\",{enumerable:!0,get:function(){return n(o).default}});var s=t(\"./Matrix\");Object.defineProperty(r,\"Matrix\",{enumerable:!0,get:function(){return n(s).default}});var a=t(\"./GroupD8\");Object.defineProperty(r,\"GroupD8\",{enumerable:!0,get:function(){return n(a).default}});var u=t(\"./shapes/Circle\");Object.defineProperty(r,\"Circle\",{enumerable:!0,get:function(){return n(u).default}});var h=t(\"./shapes/Ellipse\");Object.defineProperty(r,\"Ellipse\",{enumerable:!0,get:function(){return n(h).default}});var l=t(\"./shapes/Polygon\");Object.defineProperty(r,\"Polygon\",{enumerable:!0,get:function(){return n(l).default}});var c=t(\"./shapes/Rectangle\");Object.defineProperty(r,\"Rectangle\",{enumerable:!0,get:function(){return n(c).default}});var d=t(\"./shapes/RoundedRectangle\");Object.defineProperty(r,\"RoundedRectangle\",{enumerable:!0,get:function(){return n(d).default}})},{\"./GroupD8\":62,\"./Matrix\":63,\"./ObservablePoint\":64,\"./Point\":65,\"./shapes/Circle\":67,\"./shapes/Ellipse\":68,\"./shapes/Polygon\":69,\"./shapes/Rectangle\":70,\"./shapes/RoundedRectangle\":71}],67:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var o=t(\"./Rectangle\"),s=n(o),a=t(\"../../const\"),u=function(){function t(){var e=arguments.length<=0||void 0===arguments[0]?0:arguments[0],r=arguments.length<=1||void 0===arguments[1]?0:arguments[1],n=arguments.length<=2||void 0===arguments[2]?0:arguments[2];i(this,t),this.x=e,this.y=r,this.radius=n,this.type=a.SHAPES.CIRC}return t.prototype.clone=function(){return new t(this.x,this.y,this.radius)},t.prototype.contains=function(t,e){if(this.radius<=0)return!1;var r=this.radius*this.radius,n=this.x-t,i=this.y-e;return n*=n,i*=i,n+i<=r},t.prototype.getBounds=function(){return new s.default(this.x-this.radius,this.y-this.radius,2*this.radius,2*this.radius)},t}();r.default=u},{\"../../const\":42,\"./Rectangle\":70}],68:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var o=t(\"./Rectangle\"),s=n(o),a=t(\"../../const\"),u=function(){function t(){var e=arguments.length<=0||void 0===arguments[0]?0:arguments[0],r=arguments.length<=1||void 0===arguments[1]?0:arguments[1],n=arguments.length<=2||void 0===arguments[2]?0:arguments[2],o=arguments.length<=3||void 0===arguments[3]?0:arguments[3];i(this,t),this.x=e,this.y=r,this.width=n,this.height=o,this.type=a.SHAPES.ELIP}return t.prototype.clone=function(){return new t(this.x,this.y,this.width,this.height)},t.prototype.contains=function(t,e){if(this.width<=0||this.height<=0)return!1;var r=(t-this.x)/this.width,n=(e-this.y)/this.height;return r*=r,n*=n,r+n<=1},t.prototype.getBounds=function(){return new s.default(this.x-this.width,this.y-this.height,this.width,this.height)},t}();r.default=u},{\"../../const\":42,\"./Rectangle\":70}],69:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var o=t(\"../Point\"),s=n(o),a=t(\"../../const\"),u=function(){function t(){for(var e=arguments.length,r=Array(e),n=0;n<e;n++)r[n]=arguments[n];if(i(this,t),Array.isArray(r[0])&&(r=r[0]),r[0]instanceof s.default){for(var o=[],u=0,h=r.length;u<h;u++)o.push(r[u].x,r[u].y);r=o}this.closed=!0,this.points=r,this.type=a.SHAPES.POLY}return t.prototype.clone=function(){return new t(this.points.slice())},t.prototype.close=function(){var t=this.points;t[0]===t[t.length-2]&&t[1]===t[t.length-1]||t.push(t[0],t[1])},t.prototype.contains=function(t,e){for(var r=!1,n=this.points.length/2,i=0,o=n-1;i<n;o=i++){var s=this.points[2*i],a=this.points[2*i+1],u=this.points[2*o],h=this.points[2*o+1],l=a>e!=h>e&&t<(u-s)*((e-a)/(h-a))+s;l&&(r=!r)}return r},t}();r.default=u},{\"../../const\":42,\"../Point\":65}],70:[function(t,e,r){\"use strict\";function n(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var i=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),o=t(\"../../const\"),s=function(){function t(){var e=arguments.length<=0||void 0===arguments[0]?0:arguments[0],r=arguments.length<=1||void 0===arguments[1]?0:arguments[1],i=arguments.length<=2||void 0===arguments[2]?0:arguments[2],s=arguments.length<=3||void 0===arguments[3]?0:arguments[3];n(this,t),this.x=e,this.y=r,this.width=i,this.height=s,this.type=o.SHAPES.RECT}return t.prototype.clone=function(){return new t(this.x,this.y,this.width,this.height)},t.prototype.copy=function(t){return this.x=t.x,this.y=t.y,this.width=t.width,this.height=t.height,this},t.prototype.contains=function(t,e){return!(this.width<=0||this.height<=0)&&(t>=this.x&&t<this.x+this.width&&e>=this.y&&e<this.y+this.height)},t.prototype.pad=function(t,e){t=t||0,e=e||(0!==e?t:0),this.x-=t,this.y-=e,this.width+=2*t,this.height+=2*e},t.prototype.fit=function(t){this.x<t.x&&(this.width+=this.x,this.width<0&&(this.width=0),this.x=t.x),this.y<t.y&&(this.height+=this.y,this.height<0&&(this.height=0),this.y=t.y),this.x+this.width>t.x+t.width&&(this.width=t.width-this.x,this.width<0&&(this.width=0)),this.y+this.height>t.y+t.height&&(this.height=t.height-this.y,this.height<0&&(this.height=0))},t.prototype.enlarge=function(e){if(e!==t.EMPTY){var r=Math.min(this.x,e.x),n=Math.max(this.x+this.width,e.x+e.width),i=Math.min(this.y,e.y),o=Math.max(this.y+this.height,e.y+e.height);this.x=r,this.width=n-r,this.y=i,this.height=o-i}},i(t,[{key:\"left\",get:function(){return this.x}},{key:\"right\",get:function(){return this.x+this.width}},{key:\"top\",get:function(){return this.y}},{key:\"bottom\",get:function(){return this.y+this.height}}],[{key:\"EMPTY\",get:function(){return new t(0,0,0,0)}}]),t}();r.default=s},{\"../../const\":42}],71:[function(t,e,r){\"use strict\";function n(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var i=t(\"../../const\"),o=function(){function t(){var e=arguments.length<=0||void 0===arguments[0]?0:arguments[0],r=arguments.length<=1||void 0===arguments[1]?0:arguments[1],o=arguments.length<=2||void 0===arguments[2]?0:arguments[2],s=arguments.length<=3||void 0===arguments[3]?0:arguments[3],a=arguments.length<=4||void 0===arguments[4]?20:arguments[4];n(this,t),this.x=e,this.y=r,this.width=o,this.height=s,this.radius=a,this.type=i.SHAPES.RREC}return t.prototype.clone=function(){return new t(this.x,this.y,this.width,this.height,this.radius)},t.prototype.contains=function(t,e){if(this.width<=0||this.height<=0)return!1;if(t>=this.x&&t<=this.x+this.width&&e>=this.y&&e<=this.y+this.height){if(e>=this.y+this.radius&&e<=this.y+this.height-this.radius||t>=this.x+this.radius&&t<=this.x+this.width-this.radius)return!0;var r=t-(this.x+this.radius),n=e-(this.y+this.radius),i=this.radius*this.radius;if(r*r+n*n<=i)return!0;if(r=t-(this.x+this.width-this.radius),r*r+n*n<=i)return!0;if(n=e-(this.y+this.height-this.radius),r*r+n*n<=i)return!0;if(r=t-(this.x+this.radius),r*r+n*n<=i)return!0}return!1},t}();r.default=o},{\"../../const\":42}],72:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),u=t(\"../utils\"),h=t(\"../math\"),l=t(\"../const\"),c=t(\"../settings\"),d=n(c),f=t(\"../display/Container\"),p=n(f),v=t(\"../textures/RenderTexture\"),y=n(v),g=t(\"eventemitter3\"),m=n(g),_=new h.Matrix,b=function(t){function e(r,n,s,a){i(this,e);var h=o(this,t.call(this));if((0,u.sayHello)(r),a)for(var c in d.default.RENDER_OPTIONS)\"undefined\"==typeof a[c]&&(a[c]=d.default.RENDER_OPTIONS[c]);else a=d.default.RENDER_OPTIONS;return h.type=l.RENDERER_TYPE.UNKNOWN,h.width=n||800,h.height=s||600,h.view=a.view||document.createElement(\"canvas\"),h.resolution=a.resolution||d.default.RESOLUTION,h.transparent=a.transparent,h.autoResize=a.autoResize||!1,h.blendModes=null,h.preserveDrawingBuffer=a.preserveDrawingBuffer,h.clearBeforeRender=a.clearBeforeRender,h.roundPixels=a.roundPixels,h._backgroundColor=0,h._backgroundColorRgba=[0,0,0,0],h._backgroundColorString=\"#000000\",h.backgroundColor=a.backgroundColor||h._backgroundColor,h._tempDisplayObjectParent=new p.default,h._lastObjectRendered=h._tempDisplayObjectParent,h}return s(e,t),e.prototype.resize=function(t,e){this.width=t*this.resolution,this.height=e*this.resolution,this.view.width=this.width,this.view.height=this.height,this.autoResize&&(this.view.style.width=this.width/this.resolution+\"px\",this.view.style.height=this.height/this.resolution+\"px\")},e.prototype.generateTexture=function(t,e,r){var n=t.getLocalBounds(),i=y.default.create(0|n.width,0|n.height,e,r);return _.tx=-n.x,_.ty=-n.y,this.render(t,i,!1,_,!0),i},e.prototype.destroy=function(t){t&&this.view.parentNode&&this.view.parentNode.removeChild(this.view),this.type=l.RENDERER_TYPE.UNKNOWN,this.width=0,this.height=0,this.view=null,this.resolution=0,this.transparent=!1,this.autoResize=!1,this.blendModes=null,this.preserveDrawingBuffer=!1,this.clearBeforeRender=!1,this.roundPixels=!1,this._backgroundColor=0,this._backgroundColorRgba=null,this._backgroundColorString=null,this.backgroundColor=0,this._tempDisplayObjectParent=null,this._lastObjectRendered=null},a(e,[{key:\"backgroundColor\",get:function(){return this._backgroundColor},set:function(t){this._backgroundColor=t,this._backgroundColorString=(0,u.hex2string)(t),(0,u.hex2rgb)(t,this._backgroundColorRgba)}}]),e}(m.default);r.default=b},{\"../const\":42,\"../display/Container\":44,\"../math\":66,\"../settings\":97,\"../textures/RenderTexture\":108,\"../utils\":117,eventemitter3:3}],73:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=t(\"../SystemRenderer\"),u=n(a),h=t(\"./utils/CanvasMaskManager\"),l=n(h),c=t(\"./utils/CanvasRenderTarget\"),d=n(c),f=t(\"./utils/mapCanvasBlendModesToPixi\"),p=n(f),v=t(\"../../utils\"),y=t(\"../../const\"),g=t(\"../../settings\"),m=n(g),_=function(t){function e(r,n){var s=arguments.length<=2||void 0===arguments[2]?{}:arguments[2];i(this,e);var a=o(this,t.call(this,\"Canvas\",r,n,s));return a.type=y.RENDERER_TYPE.CANVAS,a.rootContext=a.view.getContext(\"2d\",{alpha:a.transparent}),a.refresh=!0,a.maskManager=new l.default(a),a.smoothProperty=\"imageSmoothingEnabled\",a.rootContext.imageSmoothingEnabled||(a.rootContext.webkitImageSmoothingEnabled?a.smoothProperty=\"webkitImageSmoothingEnabled\":a.rootContext.mozImageSmoothingEnabled?a.smoothProperty=\"mozImageSmoothingEnabled\":a.rootContext.oImageSmoothingEnabled?a.smoothProperty=\"oImageSmoothingEnabled\":a.rootContext.msImageSmoothingEnabled&&(a.smoothProperty=\"msImageSmoothingEnabled\")),a.initPlugins(),a.blendModes=(0,p.default)(),a._activeBlendMode=null,a.context=null,a.renderingToScreen=!1,a.resize(r,n),a}return s(e,t),e.prototype.render=function(t,e,r,n,i){if(this.view){this.renderingToScreen=!e,this.emit(\"prerender\"),e?(e=e.baseTexture||e,e._canvasRenderTarget||(e._canvasRenderTarget=new d.default(e.width,e.height,e.resolution),e.source=e._canvasRenderTarget.canvas,e.valid=!0),this.context=e._canvasRenderTarget.context,this.resolution=e._canvasRenderTarget.resolution):this.context=this.rootContext;var o=this.context;if(e||(this._lastObjectRendered=t),!i){var s=t.parent,a=this._tempDisplayObjectParent.transform.worldTransform;n?n.copy(a):a.identity(),t.parent=this._tempDisplayObjectParent,t.updateTransform(),t.parent=s}o.setTransform(1,0,0,1,0,0),o.globalAlpha=1,o.globalCompositeOperation=this.blendModes[y.BLEND_MODES.NORMAL],navigator.isCocoonJS&&this.view.screencanvas&&(o.fillStyle=\"black\",o.clear()),(void 0!==r?r:this.clearBeforeRender)&&this.renderingToScreen&&(this.transparent?o.clearRect(0,0,this.width,this.height):(o.fillStyle=this._backgroundColorString,o.fillRect(0,0,this.width,this.height)));var u=this.context;this.context=o,t.renderCanvas(this),this.context=u,this.emit(\"postrender\")}},e.prototype.setBlendMode=function(t){this._activeBlendMode!==t&&(this._activeBlendMode=t,this.context.globalCompositeOperation=this.blendModes[t])},e.prototype.destroy=function(e){this.destroyPlugins(),t.prototype.destroy.call(this,e),this.context=null,this.refresh=!0,this.maskManager.destroy(),this.maskManager=null,this.smoothProperty=null},e.prototype.resize=function(e,r){t.prototype.resize.call(this,e,r),this.smoothProperty&&(this.rootContext[this.smoothProperty]=m.default.SCALE_MODE===y.SCALE_MODES.LINEAR)},e}(u.default);r.default=_,v.pluginTarget.mixin(_)},{\"../../const\":42,\"../../settings\":97,\"../../utils\":117,\"../SystemRenderer\":72,\"./utils/CanvasMaskManager\":74,\"./utils/CanvasRenderTarget\":75,\"./utils/mapCanvasBlendModesToPixi\":77}],74:[function(t,e,r){\"use strict\";function n(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var i=t(\"../../../const\"),o=function(){function t(e){n(this,t),this.renderer=e}return t.prototype.pushMask=function(t){var e=this.renderer;e.context.save();var r=t.alpha,n=t.transform.worldTransform,i=e.resolution;e.context.setTransform(n.a*i,n.b*i,n.c*i,n.d*i,n.tx*i,n.ty*i),t._texture||(this.renderGraphicsShape(t),e.context.clip()),t.worldAlpha=r},t.prototype.renderGraphicsShape=function(t){var e=this.renderer.context,r=t.graphicsData.length;if(0!==r){e.beginPath();for(var n=0;n<r;n++){var o=t.graphicsData[n],s=o.shape;if(o.type===i.SHAPES.POLY){var a=s.points;e.moveTo(a[0],a[1]);for(var u=1;u<a.length/2;u++)e.lineTo(a[2*u],a[2*u+1]);a[0]===a[a.length-2]&&a[1]===a[a.length-1]&&e.closePath()}else if(o.type===i.SHAPES.RECT)e.rect(s.x,s.y,s.width,s.height),e.closePath();else if(o.type===i.SHAPES.CIRC)e.arc(s.x,s.y,s.radius,0,2*Math.PI),e.closePath();else if(o.type===i.SHAPES.ELIP){var h=2*s.width,l=2*s.height,c=s.x-h/2,d=s.y-l/2,f=.5522848,p=h/2*f,v=l/2*f,y=c+h,g=d+l,m=c+h/2,_=d+l/2;e.moveTo(c,_),e.bezierCurveTo(c,_-v,m-p,d,m,d),e.bezierCurveTo(m+p,d,y,_-v,y,_),e.bezierCurveTo(y,_+v,m+p,g,m,g),e.bezierCurveTo(m-p,g,c,_+v,c,_),e.closePath()}else if(o.type===i.SHAPES.RREC){var b=s.x,x=s.y,T=s.width,w=s.height,E=s.radius,O=Math.min(T,w)/2|0;E=E>O?O:E,e.moveTo(b,x+E),e.lineTo(b,x+w-E),e.quadraticCurveTo(b,x+w,b+E,x+w),e.lineTo(b+T-E,x+w),e.quadraticCurveTo(b+T,x+w,b+T,x+w-E),e.lineTo(b+T,x+E),e.quadraticCurveTo(b+T,x,b+T-E,x),e.lineTo(b+E,x),e.quadraticCurveTo(b,x,b,x+E),e.closePath()}}}},t.prototype.popMask=function(t){t.context.restore()},t.prototype.destroy=function(){},t}();r.default=o},{\"../../../const\":42}],75:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var o=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),s=t(\"../../../settings\"),a=n(s),u=a.default.RESOLUTION,h=function(){function t(e,r,n){i(this,t),this.canvas=document.createElement(\"canvas\"),this.context=this.canvas.getContext(\"2d\"),this.resolution=n||u,this.resize(e,r)}return t.prototype.clear=function(){this.context.setTransform(1,0,0,1,0,0),this.context.clearRect(0,0,this.canvas.width,this.canvas.height)},t.prototype.resize=function(t,e){this.canvas.width=t*this.resolution,this.canvas.height=e*this.resolution},t.prototype.destroy=function(){this.context=null,this.canvas=null},o(t,[{key:\"width\",get:function(){return this.canvas.width},set:function(t){this.canvas.width=t}},{key:\"height\",get:function(){return this.canvas.height},set:function(t){this.canvas.height=t}}]),t}();r.default=h},{\"../../../settings\":97}],76:[function(t,e,r){\"use strict\";function n(t){var e=document.createElement(\"canvas\");e.width=6,e.height=1;var r=e.getContext(\"2d\");return r.fillStyle=t,r.fillRect(0,0,6,1),e}function i(){if(\"undefined\"==typeof document)return!1;var t=n(\"#ff00ff\"),e=n(\"#ffff00\"),r=document.createElement(\"canvas\");r.width=6,r.height=1;var i=r.getContext(\"2d\");i.globalCompositeOperation=\"multiply\",i.drawImage(t,0,0),i.drawImage(e,2,0);var o=i.getImageData(2,0,1,1);if(!o)return!1;var s=o.data;return 255===s[0]&&0===s[1]&&0===s[2]}r.__esModule=!0,r.default=i},{}],77:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(){var t=arguments.length<=0||void 0===arguments[0]?[]:arguments[0];return(0,a.default)()?(t[o.BLEND_MODES.NORMAL]=\"source-over\",t[o.BLEND_MODES.ADD]=\"lighter\",t[o.BLEND_MODES.MULTIPLY]=\"multiply\",t[o.BLEND_MODES.SCREEN]=\"screen\",t[o.BLEND_MODES.OVERLAY]=\"overlay\",t[o.BLEND_MODES.DARKEN]=\"darken\",t[o.BLEND_MODES.LIGHTEN]=\"lighten\",t[o.BLEND_MODES.COLOR_DODGE]=\"color-dodge\",t[o.BLEND_MODES.COLOR_BURN]=\"color-burn\",t[o.BLEND_MODES.HARD_LIGHT]=\"hard-light\",t[o.BLEND_MODES.SOFT_LIGHT]=\"soft-light\",t[o.BLEND_MODES.DIFFERENCE]=\"difference\",t[o.BLEND_MODES.EXCLUSION]=\"exclusion\",t[o.BLEND_MODES.HUE]=\"hue\",t[o.BLEND_MODES.SATURATION]=\"saturate\",t[o.BLEND_MODES.COLOR]=\"color\",t[o.BLEND_MODES.LUMINOSITY]=\"luminosity\"):(t[o.BLEND_MODES.NORMAL]=\"source-over\",t[o.BLEND_MODES.ADD]=\"lighter\",t[o.BLEND_MODES.MULTIPLY]=\"source-over\",t[o.BLEND_MODES.SCREEN]=\"source-over\",t[o.BLEND_MODES.OVERLAY]=\"source-over\",t[o.BLEND_MODES.DARKEN]=\"source-over\",t[o.BLEND_MODES.LIGHTEN]=\"source-over\",t[o.BLEND_MODES.COLOR_DODGE]=\"source-over\",t[o.BLEND_MODES.COLOR_BURN]=\"source-over\",t[o.BLEND_MODES.HARD_LIGHT]=\"source-over\",t[o.BLEND_MODES.SOFT_LIGHT]=\"source-over\",t[o.BLEND_MODES.DIFFERENCE]=\"source-over\",t[o.BLEND_MODES.EXCLUSION]=\"source-over\",t[o.BLEND_MODES.HUE]=\"source-over\",t[o.BLEND_MODES.SATURATION]=\"source-over\",t[o.BLEND_MODES.COLOR]=\"source-over\",t[o.BLEND_MODES.LUMINOSITY]=\"source-over\"),t}r.__esModule=!0,r.default=i;var o=t(\"../../../const\"),s=t(\"./canUseNewCanvasBlendModes\"),a=n(s)},{\"../../../const\":42,\"./canUseNewCanvasBlendModes\":76}],78:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var o=t(\"../../const\"),s=t(\"../../settings\"),a=n(s),u=function(){function t(e){i(this,t),this.renderer=e,this.count=0,this.checkCount=0,this.maxIdle=a.default.GC_MAX_IDLE,this.checkCountMax=a.default.GC_MAX_CHECK_COUNT,this.mode=a.default.GC_MODE}return t.prototype.update=function(){this.count++,this.mode!==o.GC_MODES.MANUAL&&(this.checkCount++,this.checkCount>this.checkCountMax&&(this.checkCount=0,this.run()))},t.prototype.run=function(){for(var t=this.renderer.textureManager,e=t._managedTextures,r=!1,n=0;n<e.length;n++){var i=e[n];!i._glRenderTargets&&this.count-i.touched>this.maxIdle&&(t.destroyTexture(i,!0),e[n]=null,r=!0)}if(r){for(var o=0,s=0;s<e.length;s++)null!==e[s]&&(e[o++]=e[s]);e.length=o}},t.prototype.unload=function(t){var e=this.renderer.textureManager;t._texture&&e.destroyTexture(t._texture,!0);for(var r=t.children.length-1;r>=0;r--)this.unload(t.children[r])},t}();r.default=u},{\"../../const\":42,\"../../settings\":97}],79:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var o=t(\"pixi-gl-core\"),s=t(\"../../const\"),a=t(\"./utils/RenderTarget\"),u=n(a),h=t(\"../../utils\"),l=function(){function t(e){i(this,t),this.renderer=e,this.gl=e.gl,this._managedTextures=[]}return t.prototype.bindTexture=function(){},t.prototype.getTexture=function(){},t.prototype.updateTexture=function(t,e){e=e||0;var r=this.gl,n=!!t._glRenderTargets;if(!t.hasLoaded)return null;r.activeTexture(r.TEXTURE0+e);var i=t._glTextures[this.renderer.CONTEXT_UID];if(i)n?t._glRenderTargets[this.renderer.CONTEXT_UID].resize(t.width,t.height):i.upload(t.source);else{if(n){var a=new u.default(this.gl,t.width,t.height,t.scaleMode,t.resolution);a.resize(t.width,t.height),t._glRenderTargets[this.renderer.CONTEXT_UID]=a,i=a.texture}else i=new o.GLTexture(this.gl,null,null,null,null),i.bind(e),i.premultiplyAlpha=!0,i.upload(t.source);t._glTextures[this.renderer.CONTEXT_UID]=i,t.on(\"update\",this.updateTexture,this),t.on(\"dispose\",this.destroyTexture,this),this._managedTextures.push(t),t.isPowerOfTwo?(t.mipmap&&i.enableMipmap(),t.wrapMode===s.WRAP_MODES.CLAMP?i.enableWrapClamp():t.wrapMode===s.WRAP_MODES.REPEAT?i.enableWrapRepeat():i.enableWrapMirrorRepeat()):i.enableWrapClamp(),t.scaleMode===s.SCALE_MODES.NEAREST?i.enableNearestScaling():i.enableLinearScaling()}return this.renderer.boundTextures[e]=t,i},t.prototype.destroyTexture=function(t,e){if(t=t.baseTexture||t,t.hasLoaded&&t._glTextures[this.renderer.CONTEXT_UID]&&(this.renderer.unbindTexture(t),t._glTextures[this.renderer.CONTEXT_UID].destroy(),t.off(\"update\",this.updateTexture,this),t.off(\"dispose\",this.destroyTexture,this),delete t._glTextures[this.renderer.CONTEXT_UID],!e)){var r=this._managedTextures.indexOf(t);r!==-1&&(0,h.removeItems)(this._managedTextures,r,1)}},t.prototype.removeAll=function(){for(var t=0;t<this._managedTextures.length;++t){var e=this._managedTextures[t];e._glTextures[this.renderer.CONTEXT_UID]&&delete e._glTextures[this.renderer.CONTEXT_UID]}},t.prototype.destroy=function(){for(var t=0;t<this._managedTextures.length;++t){var e=this._managedTextures[t];this.destroyTexture(e,!0),e.off(\"update\",this.updateTexture,this),e.off(\"dispose\",this.destroyTexture,this)}this._managedTextures=null},t}();r.default=l},{\"../../const\":42,\"../../utils\":117,\"./utils/RenderTarget\":92,\"pixi-gl-core\":12}],80:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=t(\"../SystemRenderer\"),u=n(a),h=t(\"./managers/MaskManager\"),l=n(h),c=t(\"./managers/StencilManager\"),d=n(c),f=t(\"./managers/FilterManager\"),p=n(f),v=t(\"./utils/RenderTarget\"),y=n(v),g=t(\"./utils/ObjectRenderer\"),m=n(g),_=t(\"./TextureManager\"),b=n(_),x=t(\"../../textures/BaseTexture\"),T=n(x),w=t(\"./TextureGarbageCollector\"),E=n(w),O=t(\"./WebGLState\"),S=n(O),M=t(\"./utils/mapWebGLDrawModesToPixi\"),P=n(M),C=t(\"./utils/validateContext\"),R=n(C),A=t(\"../../utils\"),D=t(\"pixi-gl-core\"),I=n(D),L=t(\"../../const\"),j=0,B=function(t){function e(r,n){var s=arguments.length<=2||void 0===arguments[2]?{}:arguments[2];i(this,e);var a=o(this,t.call(this,\"WebGL\",r,n,s));return a.type=L.RENDERER_TYPE.WEBGL,a.handleContextLost=a.handleContextLost.bind(a),a.handleContextRestored=a.handleContextRestored.bind(a),a.view.addEventListener(\"webglcontextlost\",a.handleContextLost,!1),a.view.addEventListener(\"webglcontextrestored\",a.handleContextRestored,!1),a._contextOptions={alpha:a.transparent,antialias:s.antialias,premultipliedAlpha:a.transparent&&\"notMultiplied\"!==a.transparent,stencil:!0,preserveDrawingBuffer:s.preserveDrawingBuffer},a._backgroundColorRgba[3]=a.transparent?0:1,a.maskManager=new l.default(a),a.stencilManager=new d.default(a),a.emptyRenderer=new m.default(a),a.currentRenderer=a.emptyRenderer,a.initPlugins(),s.context&&(0,R.default)(s.context),a.gl=s.context||I.default.createContext(a.view,a._contextOptions),a.CONTEXT_UID=j++,a.state=new S.default(a.gl),a.renderingToScreen=!0,a.boundTextures=null,a._initContext(),a.filterManager=new p.default(a),a.drawModes=(0,P.default)(a.gl),a._activeShader=null,a._activeVao=null,a._activeRenderTarget=null,a._nextTextureLocation=0,a.setBlendMode(0),a}return s(e,t),e.prototype._initContext=function(){var t=this.gl;t.isContextLost()&&t.getExtension(\"WEBGL_lose_context\")&&t.getExtension(\"WEBGL_lose_context\").restoreContext();var e=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS);this.boundTextures=new Array(e),this.emptyTextures=new Array(e),this.textureManager=new b.default(this),this.textureGC=new E.default(this),this.state.resetToDefault(),this.rootRenderTarget=new y.default(t,this.width,this.height,null,this.resolution,(!0)),this.rootRenderTarget.clearColor=this._backgroundColorRgba,this.bindRenderTarget(this.rootRenderTarget);var r=new I.default.GLTexture.fromData(t,null,1,1),n={_glTextures:{}};n._glTextures[this.CONTEXT_UID]={};for(var i=0;i<e;i++){var o=new T.default;o._glTextures[this.CONTEXT_UID]=r,this.boundTextures[i]=n,this.emptyTextures[i]=o,this.bindTexture(null,i)}this.emit(\"context\",t),this.resize(this.width,this.height)},e.prototype.render=function(t,e,r,n,i){if(this.renderingToScreen=!e,this.emit(\"prerender\"),this.gl&&!this.gl.isContextLost()){if(this._nextTextureLocation=0,e||(this._lastObjectRendered=t),!i){var o=t.parent;t.parent=this._tempDisplayObjectParent,t.updateTransform(),t.parent=o}this.bindRenderTexture(e,n),this.currentRenderer.start(),(void 0!==r?r:this.clearBeforeRender)&&this._activeRenderTarget.clear(),t.renderWebGL(this),this.currentRenderer.flush(),this.textureGC.update(),this.emit(\"postrender\")}},e.prototype.setObjectRenderer=function(t){this.currentRenderer!==t&&(this.currentRenderer.stop(),this.currentRenderer=t,this.currentRenderer.start())},e.prototype.flush=function(){this.setObjectRenderer(this.emptyRenderer)},e.prototype.resize=function(t,e){u.default.prototype.resize.call(this,t,e),this.rootRenderTarget.resize(t,e),this._activeRenderTarget===this.rootRenderTarget&&(this.rootRenderTarget.activate(),this._activeShader&&(this._activeShader.uniforms.projectionMatrix=this.rootRenderTarget.projectionMatrix.toArray(!0)))},e.prototype.setBlendMode=function(t){this.state.setBlendMode(t)},e.prototype.clear=function(t){this._activeRenderTarget.clear(t)},e.prototype.setTransform=function(t){this._activeRenderTarget.transform=t},e.prototype.bindRenderTexture=function(t,e){var r=void 0;if(t){var n=t.baseTexture;n._glRenderTargets[this.CONTEXT_UID]||this.textureManager.updateTexture(n,0),this.unbindTexture(n),r=n._glRenderTargets[this.CONTEXT_UID],r.setFrame(t.frame)}else r=this.rootRenderTarget;return r.transform=e,this.bindRenderTarget(r),this},e.prototype.bindRenderTarget=function(t){return t!==this._activeRenderTarget&&(this._activeRenderTarget=t,t.activate(),this._activeShader&&(this._activeShader.uniforms.projectionMatrix=t.projectionMatrix.toArray(!0)),this.stencilManager.setMaskStack(t.stencilMaskStack)),this},e.prototype.bindShader=function(t){return this._activeShader!==t&&(this._activeShader=t,t.bind(),t.uniforms.projectionMatrix=this._activeRenderTarget.projectionMatrix.toArray(!0)),this},e.prototype.bindTexture=function(t,e,r){if(t=t||this.emptyTextures[e],t=t.baseTexture||t,t.touched=this.textureGC.count,r)e=e||0;else{for(var n=0;n<this.boundTextures.length;n++)if(this.boundTextures[n]===t)return n;void 0===e&&(this._nextTextureLocation++,this._nextTextureLocation%=this.boundTextures.length,e=this.boundTextures.length-this._nextTextureLocation-1)}var i=this.gl,o=t._glTextures[this.CONTEXT_UID];\r\nreturn o?(this.boundTextures[e]=t,i.activeTexture(i.TEXTURE0+e),i.bindTexture(i.TEXTURE_2D,o.texture)):this.textureManager.updateTexture(t,e),e},e.prototype.unbindTexture=function(t){var e=this.gl;t=t.baseTexture||t;for(var r=0;r<this.boundTextures.length;r++)this.boundTextures[r]===t&&(this.boundTextures[r]=this.emptyTextures[r],e.activeTexture(e.TEXTURE0+r),e.bindTexture(e.TEXTURE_2D,this.emptyTextures[r]._glTextures[this.CONTEXT_UID].texture));return this},e.prototype.createVao=function(){return new I.default.VertexArrayObject(this.gl,this.state.attribState)},e.prototype.bindVao=function(t){return this._activeVao===t?this:(t?t.bind():this._activeVao&&this._activeVao.unbind(),this._activeVao=t,this)},e.prototype.reset=function(){return this.setObjectRenderer(this.emptyRenderer),this._activeShader=null,this._activeRenderTarget=this.rootRenderTarget,this.rootRenderTarget.activate(),this.state.resetToDefault(),this},e.prototype.handleContextLost=function(t){t.preventDefault()},e.prototype.handleContextRestored=function(){this._initContext(),this.textureManager.removeAll()},e.prototype.destroy=function(e){this.destroyPlugins(),this.view.removeEventListener(\"webglcontextlost\",this.handleContextLost),this.view.removeEventListener(\"webglcontextrestored\",this.handleContextRestored),this.textureManager.destroy(),t.prototype.destroy.call(this,e),this.uid=0,this.maskManager.destroy(),this.stencilManager.destroy(),this.filterManager.destroy(),this.maskManager=null,this.filterManager=null,this.textureManager=null,this.currentRenderer=null,this.handleContextLost=null,this.handleContextRestored=null,this._contextOptions=null,this.gl.useProgram(null),this.gl.getExtension(\"WEBGL_lose_context\")&&this.gl.getExtension(\"WEBGL_lose_context\").loseContext(),this.gl=null},e}(u.default);r.default=B,A.pluginTarget.mixin(B)},{\"../../const\":42,\"../../textures/BaseTexture\":107,\"../../utils\":117,\"../SystemRenderer\":72,\"./TextureGarbageCollector\":78,\"./TextureManager\":79,\"./WebGLState\":81,\"./managers/FilterManager\":86,\"./managers/MaskManager\":87,\"./managers/StencilManager\":88,\"./utils/ObjectRenderer\":90,\"./utils/RenderTarget\":92,\"./utils/mapWebGLDrawModesToPixi\":95,\"./utils/validateContext\":96,\"pixi-gl-core\":12}],81:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var o=t(\"./utils/mapWebGLBlendModesToPixi\"),s=n(o),a=0,u=1,h=2,l=3,c=4,d=function(){function t(e){i(this,t),this.activeState=new Uint8Array(16),this.defaultState=new Uint8Array(16),this.defaultState[0]=1,this.stackIndex=0,this.stack=[],this.gl=e,this.maxAttribs=e.getParameter(e.MAX_VERTEX_ATTRIBS),this.attribState={tempAttribState:new Array(this.maxAttribs),attribState:new Array(this.maxAttribs)},this.blendModes=(0,s.default)(e),this.nativeVaoExtension=e.getExtension(\"OES_vertex_array_object\")||e.getExtension(\"MOZ_OES_vertex_array_object\")||e.getExtension(\"WEBKIT_OES_vertex_array_object\")}return t.prototype.push=function(){var t=this.stack[++this.stackIndex];t||(t=this.stack[this.stackIndex]=new Uint8Array(16));for(var e=0;e<this.activeState.length;e++)this.activeState[e]=t[e]},t.prototype.pop=function(){var t=this.stack[--this.stackIndex];this.setState(t)},t.prototype.setState=function(t){this.setBlend(t[a]),this.setDepthTest(t[u]),this.setFrontFace(t[h]),this.setCullFace(t[l]),this.setBlendMode(t[c])},t.prototype.setBlend=function(t){t=t?1:0,this.activeState[a]!==t&&(this.activeState[a]=t,this.gl[t?\"enable\":\"disable\"](this.gl.BLEND))},t.prototype.setBlendMode=function(t){t!==this.activeState[c]&&(this.activeState[c]=t,this.gl.blendFunc(this.blendModes[t][0],this.blendModes[t][1]))},t.prototype.setDepthTest=function(t){t=t?1:0,this.activeState[u]!==t&&(this.activeState[u]=t,this.gl[t?\"enable\":\"disable\"](this.gl.DEPTH_TEST))},t.prototype.setCullFace=function(t){t=t?1:0,this.activeState[l]!==t&&(this.activeState[l]=t,this.gl[t?\"enable\":\"disable\"](this.gl.CULL_FACE))},t.prototype.setFrontFace=function(t){t=t?1:0,this.activeState[h]!==t&&(this.activeState[h]=t,this.gl.frontFace(this.gl[t?\"CW\":\"CCW\"]))},t.prototype.resetAttributes=function(){for(var t=0;t<this.attribState.tempAttribState.length;t++)this.attribState.tempAttribState[t]=0;for(var e=0;e<this.attribState.attribState.length;e++)this.attribState.attribState[e]=0;for(var r=1;r<this.maxAttribs;r++)this.gl.disableVertexAttribArray(r)},t.prototype.resetToDefault=function(){this.nativeVaoExtension&&this.nativeVaoExtension.bindVertexArrayOES(null),this.resetAttributes();for(var t=0;t<this.activeState.length;++t)this.activeState[t]=32;this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL,!1),this.setState(this.defaultState)},t}();r.default=d},{\"./utils/mapWebGLBlendModesToPixi\":94}],82:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var o=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),s=t(\"./extractUniformsFromSrc\"),a=n(s),u=t(\"../../../utils\"),h=t(\"../../../const\"),l={},c=function(){function t(e,r,n){i(this,t),this.vertexSrc=e||t.defaultVertexSrc,this.fragmentSrc=r||t.defaultFragmentSrc,this.blendMode=h.BLEND_MODES.NORMAL,this.uniformData=n||(0,a.default)(this.vertexSrc,this.fragmentSrc,\"projectionMatrix|uSampler\"),this.uniforms={};for(var o in this.uniformData)this.uniforms[o]=this.uniformData[o].value;this.glShaders={},l[this.vertexSrc+this.fragmentSrc]||(l[this.vertexSrc+this.fragmentSrc]=(0,u.uid)()),this.glShaderKey=l[this.vertexSrc+this.fragmentSrc],this.padding=4,this.resolution=1,this.enabled=!0}return t.prototype.apply=function(t,e,r,n){t.applyFilter(this,e,r,n)},o(t,null,[{key:\"defaultVertexSrc\",get:function(){return[\"attribute vec2 aVertexPosition;\",\"attribute vec2 aTextureCoord;\",\"uniform mat3 projectionMatrix;\",\"uniform mat3 filterMatrix;\",\"varying vec2 vTextureCoord;\",\"varying vec2 vFilterCoord;\",\"void main(void){\",\"   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\",\"   vFilterCoord = ( filterMatrix * vec3( aTextureCoord, 1.0)  ).xy;\",\"   vTextureCoord = aTextureCoord ;\",\"}\"].join(\"\\n\")}},{key:\"defaultFragmentSrc\",get:function(){return[\"varying vec2 vTextureCoord;\",\"varying vec2 vFilterCoord;\",\"uniform sampler2D uSampler;\",\"uniform sampler2D filterSampler;\",\"void main(void){\",\"   vec4 masky = texture2D(filterSampler, vFilterCoord);\",\"   vec4 sample = texture2D(uSampler, vTextureCoord);\",\"   vec4 color;\",\"   if(mod(vFilterCoord.x, 1.0) > 0.5)\",\"   {\",\"     color = vec4(1.0, 0.0, 0.0, 1.0);\",\"   }\",\"   else\",\"   {\",\"     color = vec4(0.0, 1.0, 0.0, 1.0);\",\"   }\",\"   gl_FragColor = mix(sample, masky, 0.5);\",\"   gl_FragColor *= sample.a;\",\"}\"].join(\"\\n\")}}]),t}();r.default=c},{\"../../../const\":42,\"../../../utils\":117,\"./extractUniformsFromSrc\":83}],83:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e,r){var n=o(t,r),i=o(e,r);return Object.assign(n,i)}function o(t){for(var e=new RegExp(\"^(projectionMatrix|uSampler|filterArea)$\"),r={},n=void 0,i=t.replace(/\\s+/g,\" \").split(/\\s*;\\s*/),o=0;o<i.length;o++){var s=i[o].trim();if(s.indexOf(\"uniform\")>-1){var a=s.split(\" \"),h=a[1],l=a[2],c=1;l.indexOf(\"[\")>-1&&(n=l.split(/\\[|]/),l=n[0],c*=Number(n[1])),l.match(e)||(r[l]={value:u(h,c),name:l,type:h})}}return r}r.__esModule=!0,r.default=i;var s=t(\"pixi-gl-core\"),a=n(s),u=a.default.shader.defaultValue},{\"pixi-gl-core\":12}],84:[function(t,e,r){\"use strict\";function n(t,e,r){var n=t.identity();return n.translate(e.x/r.width,e.y/r.height),n.scale(r.width,r.height),n}function i(t,e,r){var n=t.identity();n.translate(e.x/r.width,e.y/r.height);var i=r.width/e.width,o=r.height/e.height;return n.scale(i,o),n}function o(t,e,r,n){var i=n.worldTransform.copy(s.Matrix.TEMP_MATRIX),o=n._texture.baseTexture,a=t.identity(),u=r.height/r.width;a.translate(e.x/r.width,e.y/r.height),a.scale(1,u);var h=r.width/o.width,l=r.height/o.height;return i.tx/=o.width*h,i.ty/=o.width*h,i.invert(),a.prepend(i),a.scale(1,1/u),a.scale(h,l),a.translate(n.anchor.x,n.anchor.y),a}r.__esModule=!0,r.calculateScreenSpaceMatrix=n,r.calculateNormalizedScreenSpaceMatrix=i,r.calculateSpriteMatrix=o;var s=t(\"../../../math\")},{\"../../../math\":66}],85:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=t(\"../Filter\"),u=n(a),h=t(\"../../../../math\"),l=(t(\"path\"),function(t){function e(r){i(this,e);var n=new h.Matrix,s=o(this,t.call(this,\"attribute vec2 aVertexPosition;\\nattribute vec2 aTextureCoord;\\n\\nuniform mat3 projectionMatrix;\\nuniform mat3 otherMatrix;\\n\\nvarying vec2 vMaskCoord;\\nvarying vec2 vTextureCoord;\\n\\nvoid main(void)\\n{\\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\\n\\n    vTextureCoord = aTextureCoord;\\n    vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;\\n}\\n\",\"varying vec2 vMaskCoord;\\nvarying vec2 vTextureCoord;\\n\\nuniform sampler2D uSampler;\\nuniform float alpha;\\nuniform sampler2D mask;\\n\\nvoid main(void)\\n{\\n    // check clip! this will stop the mask bleeding out from the edges\\n    vec2 text = abs( vMaskCoord - 0.5 );\\n    text = step(0.5, text);\\n\\n    float clip = 1.0 - max(text.y, text.x);\\n    vec4 original = texture2D(uSampler, vTextureCoord);\\n    vec4 masky = texture2D(mask, vMaskCoord);\\n\\n    original *= (masky.r * masky.a * alpha * clip);\\n\\n    gl_FragColor = original;\\n}\\n\"));return r.renderable=!1,s.maskSprite=r,s.maskMatrix=n,s}return s(e,t),e.prototype.apply=function(t,e,r){var n=this.maskSprite;this.uniforms.mask=n._texture,this.uniforms.otherMatrix=t.calculateSpriteMatrix(this.maskMatrix,n),this.uniforms.alpha=n.worldAlpha,t.applyFilter(this,e,r)},e}(u.default));r.default=l},{\"../../../../math\":66,\"../Filter\":82,path:22}],86:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function i(t){return t&&t.__esModule?t:{default:t}}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function a(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var u=t(\"./WebGLManager\"),h=i(u),l=t(\"../utils/RenderTarget\"),c=i(l),d=t(\"../utils/Quad\"),f=i(d),p=t(\"../../../math\"),v=t(\"../../../Shader\"),y=i(v),g=t(\"../filters/filterTransforms\"),m=n(g),_=t(\"bit-twiddle\"),b=i(_),x=function t(){a(this,t),this.renderTarget=null,this.sourceFrame=new p.Rectangle,this.destinationFrame=new p.Rectangle,this.filters=[],this.target=null,this.resolution=1},T=function(t){function e(r){a(this,e);var n=o(this,t.call(this,r));return n.gl=n.renderer.gl,n.quad=new f.default(n.gl,r.state.attribState),n.shaderCache={},n.pool={},n.filterData=null,n}return s(e,t),e.prototype.pushFilter=function(t,e){var r=this.renderer,n=this.filterData;if(!n){n=this.renderer._activeRenderTarget.filterStack;var i=new x;i.sourceFrame=i.destinationFrame=this.renderer._activeRenderTarget.size,i.renderTarget=r._activeRenderTarget,this.renderer._activeRenderTarget.filterData=n={index:0,stack:[i]},this.filterData=n}var o=n.stack[++n.index];o||(o=n.stack[n.index]=new x);var s=e[0].resolution,a=0|e[0].padding,u=t.filterArea||t.getBounds(!0),h=o.sourceFrame,l=o.destinationFrame;h.x=(u.x*s|0)/s,h.y=(u.y*s|0)/s,h.width=(u.width*s|0)/s,h.height=(u.height*s|0)/s,n.stack[0].renderTarget.transform||h.fit(n.stack[0].destinationFrame),h.pad(a),l.width=h.width,l.height=h.height;var c=this.getPotRenderTarget(r.gl,h.width,h.height,s);o.target=t,o.filters=e,o.resolution=s,o.renderTarget=c,c.setFrame(l,h),r.bindRenderTarget(c),r.clear()},e.prototype.popFilter=function(){var t=this.filterData,e=t.stack[t.index-1],r=t.stack[t.index];this.quad.map(r.renderTarget.size,r.sourceFrame).upload();var n=r.filters;if(1===n.length)n[0].apply(this,r.renderTarget,e.renderTarget,!1),this.freePotRenderTarget(r.renderTarget);else{var i=r.renderTarget,o=this.getPotRenderTarget(this.renderer.gl,r.sourceFrame.width,r.sourceFrame.height,r.resolution);o.setFrame(r.destinationFrame,r.sourceFrame);var s=0;for(s=0;s<n.length-1;++s){n[s].apply(this,i,o,!0);var a=i;i=o,o=a}n[s].apply(this,i,e.renderTarget,!1),this.freePotRenderTarget(i),this.freePotRenderTarget(o)}t.index--,0===t.index&&(this.filterData=null)},e.prototype.applyFilter=function(t,e,r,n){var i=this.renderer,o=i.gl,s=t.glShaders[i.CONTEXT_UID];s||(t.glShaderKey?(s=this.shaderCache[t.glShaderKey],s||(s=new y.default(this.gl,t.vertexSrc,t.fragmentSrc),t.glShaders[i.CONTEXT_UID]=this.shaderCache[t.glShaderKey]=s)):s=t.glShaders[i.CONTEXT_UID]=new y.default(this.gl,t.vertexSrc,t.fragmentSrc),i.bindVao(null),this.quad.initVao(s)),i.bindVao(this.quad.vao),i.bindRenderTarget(r),n&&(o.disable(o.SCISSOR_TEST),i.clear(),o.enable(o.SCISSOR_TEST)),r===i.maskManager.scissorRenderTarget&&i.maskManager.pushScissorMask(null,i.maskManager.scissorData),i.bindShader(s),this.syncUniforms(s,t),i.state.setBlendMode(t.blendMode);var a=this.renderer.boundTextures[0];o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,e.texture.texture),this.quad.vao.draw(this.renderer.gl.TRIANGLES,6,0),o.bindTexture(o.TEXTURE_2D,a._glTextures[this.renderer.CONTEXT_UID].texture)},e.prototype.syncUniforms=function(t,e){var r=e.uniformData,n=e.uniforms,i=1,o=void 0;if(t.uniforms.data.filterArea){o=this.filterData.stack[this.filterData.index];var s=t.uniforms.filterArea;s[0]=o.renderTarget.size.width,s[1]=o.renderTarget.size.height,s[2]=o.sourceFrame.x,s[3]=o.sourceFrame.y,t.uniforms.filterArea=s}if(t.uniforms.data.filterClamp){o=this.filterData.stack[this.filterData.index];var a=t.uniforms.filterClamp;a[0]=0,a[1]=0,a[2]=(o.sourceFrame.width-1)/o.renderTarget.size.width,a[3]=(o.sourceFrame.height-1)/o.renderTarget.size.height,t.uniforms.filterClamp=a}for(var u in r)if(\"sampler2D\"===r[u].type&&0!==n[u]){if(n[u].baseTexture)t.uniforms[u]=this.renderer.bindTexture(n[u].baseTexture,i);else{t.uniforms[u]=i;var h=this.renderer.gl;h.activeTexture(h.TEXTURE0+i),n[u].texture.bind()}i++}else if(\"mat3\"===r[u].type)void 0!==n[u].a?t.uniforms[u]=n[u].toArray(!0):t.uniforms[u]=n[u];else if(\"vec2\"===r[u].type)if(void 0!==n[u].x){var l=t.uniforms[u]||new Float32Array(2);l[0]=n[u].x,l[1]=n[u].y,t.uniforms[u]=l}else t.uniforms[u]=n[u];else\"float\"===r[u].type?t.uniforms.data[u].value!==r[u]&&(t.uniforms[u]=n[u]):t.uniforms[u]=n[u]},e.prototype.getRenderTarget=function(t,e){var r=this.filterData.stack[this.filterData.index],n=this.getPotRenderTarget(this.renderer.gl,r.sourceFrame.width,r.sourceFrame.height,e||r.resolution);return n.setFrame(r.destinationFrame,r.sourceFrame),n},e.prototype.returnRenderTarget=function(t){this.freePotRenderTarget(t)},e.prototype.calculateScreenSpaceMatrix=function(t){var e=this.filterData.stack[this.filterData.index];return m.calculateScreenSpaceMatrix(t,e.sourceFrame,e.renderTarget.size)},e.prototype.calculateNormalizedScreenSpaceMatrix=function(t){var e=this.filterData.stack[this.filterData.index];return m.calculateNormalizedScreenSpaceMatrix(t,e.sourceFrame,e.renderTarget.size,e.destinationFrame)},e.prototype.calculateSpriteMatrix=function(t,e){var r=this.filterData.stack[this.filterData.index];return m.calculateSpriteMatrix(t,r.sourceFrame,r.renderTarget.size,e)},e.prototype.destroy=function(){this.shaderCache=[],this.emptyPool()},e.prototype.getPotRenderTarget=function(t,e,r,n){e=b.default.nextPow2(e*n),r=b.default.nextPow2(r*n);var i=(65535&e)<<16|65535&r;this.pool[i]||(this.pool[i]=[]);var o=this.pool[i].pop();if(!o){var s=this.renderer.boundTextures[0];t.activeTexture(t.TEXTURE0),o=new c.default(t,e,r,null,1),t.bindTexture(t.TEXTURE_2D,s._glTextures[this.renderer.CONTEXT_UID].texture)}return o.resolution=n,o.defaultFrame.width=o.size.width=e/n,o.defaultFrame.height=o.size.height=r/n,o},e.prototype.emptyPool=function(){for(var t in this.pool){var e=this.pool[t];if(e)for(var r=0;r<e.length;r++)e[r].destroy(!0)}this.pool={}},e.prototype.freePotRenderTarget=function(t){var e=t.size.width*t.resolution,r=t.size.height*t.resolution,n=(65535&e)<<16|65535&r;this.pool[n].push(t)},e}(h.default);r.default=T},{\"../../../Shader\":41,\"../../../math\":66,\"../filters/filterTransforms\":84,\"../utils/Quad\":91,\"../utils/RenderTarget\":92,\"./WebGLManager\":89,\"bit-twiddle\":1}],87:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=t(\"./WebGLManager\"),u=n(a),h=t(\"../filters/spriteMask/SpriteMaskFilter\"),l=n(h),c=function(t){function e(r){i(this,e);var n=o(this,t.call(this,r));return n.scissor=!1,n.scissorData=null,n.scissorRenderTarget=null,n.enableScissor=!0,n.alphaMaskPool=[],n.alphaMaskIndex=0,n}return s(e,t),e.prototype.pushMask=function(t,e){if(e.texture)this.pushSpriteMask(t,e);else if(this.enableScissor&&!this.scissor&&!this.renderer.stencilManager.stencilMaskStack.length&&e.isFastRect()){var r=e.worldTransform,n=Math.atan2(r.b,r.a);n=Math.round(n*(180/Math.PI)),n%90?this.pushStencilMask(e):this.pushScissorMask(t,e)}else this.pushStencilMask(e)},e.prototype.popMask=function(t,e){e.texture?this.popSpriteMask(t,e):this.enableScissor&&!this.renderer.stencilManager.stencilMaskStack.length?this.popScissorMask(t,e):this.popStencilMask(t,e)},e.prototype.pushSpriteMask=function(t,e){var r=this.alphaMaskPool[this.alphaMaskIndex];r||(r=this.alphaMaskPool[this.alphaMaskIndex]=[new l.default(e)]),r[0].resolution=this.renderer.resolution,r[0].maskSprite=e,t.filterArea=e.getBounds(!0),this.renderer.filterManager.pushFilter(t,r),this.alphaMaskIndex++},e.prototype.popSpriteMask=function(){this.renderer.filterManager.popFilter(),this.alphaMaskIndex--},e.prototype.pushStencilMask=function(t){this.renderer.currentRenderer.stop(),this.renderer.stencilManager.pushStencil(t)},e.prototype.popStencilMask=function(){this.renderer.currentRenderer.stop(),this.renderer.stencilManager.popStencil()},e.prototype.pushScissorMask=function(t,e){e.renderable=!0;var r=this.renderer._activeRenderTarget,n=e.getBounds();n.fit(r.size),e.renderable=!1,this.renderer.gl.enable(this.renderer.gl.SCISSOR_TEST);var i=this.renderer.resolution;this.renderer.gl.scissor(n.x*i,(r.root?r.size.height-n.y-n.height:n.y)*i,n.width*i,n.height*i),this.scissorRenderTarget=r,this.scissorData=e,this.scissor=!0},e.prototype.popScissorMask=function(){this.scissorRenderTarget=null,this.scissorData=null,this.scissor=!1;var t=this.renderer.gl;t.disable(t.SCISSOR_TEST)},e}(u.default);r.default=c},{\"../filters/spriteMask/SpriteMaskFilter\":85,\"./WebGLManager\":89}],88:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=t(\"./WebGLManager\"),u=n(a),h=function(t){function e(r){i(this,e);var n=o(this,t.call(this,r));return n.stencilMaskStack=null,n}return s(e,t),e.prototype.setMaskStack=function(t){this.stencilMaskStack=t;var e=this.renderer.gl;0===t.length?e.disable(e.STENCIL_TEST):e.enable(e.STENCIL_TEST)},e.prototype.pushStencil=function(t){this.renderer.setObjectRenderer(this.renderer.plugins.graphics),this.renderer._activeRenderTarget.attachStencilBuffer();var e=this.renderer.gl,r=this.stencilMaskStack;0===r.length&&(e.enable(e.STENCIL_TEST),e.clear(e.STENCIL_BUFFER_BIT),e.stencilFunc(e.ALWAYS,1,1)),r.push(t),e.colorMask(!1,!1,!1,!1),e.stencilOp(e.KEEP,e.KEEP,e.INCR),this.renderer.plugins.graphics.render(t),e.colorMask(!0,!0,!0,!0),e.stencilFunc(e.NOTEQUAL,0,r.length),e.stencilOp(e.KEEP,e.KEEP,e.KEEP)},e.prototype.popStencil=function(){this.renderer.setObjectRenderer(this.renderer.plugins.graphics);var t=this.renderer.gl,e=this.stencilMaskStack,r=e.pop();0===e.length?t.disable(t.STENCIL_TEST):(t.colorMask(!1,!1,!1,!1),t.stencilOp(t.KEEP,t.KEEP,t.DECR),this.renderer.plugins.graphics.render(r),t.colorMask(!0,!0,!0,!0),t.stencilFunc(t.NOTEQUAL,0,e.length),t.stencilOp(t.KEEP,t.KEEP,t.KEEP))},e.prototype.destroy=function(){u.default.prototype.destroy.call(this),this.stencilMaskStack.stencilStack=null},e}(u.default);r.default=h},{\"./WebGLManager\":89}],89:[function(t,e,r){\"use strict\";function n(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var i=function(){function t(e){n(this,t),this.renderer=e,this.renderer.on(\"context\",this.onContextChange,this)}return t.prototype.onContextChange=function(){},t.prototype.destroy=function(){this.renderer.off(\"context\",this.onContextChange,this),this.renderer=null},t}();r.default=i},{}],90:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=t(\"../managers/WebGLManager\"),u=n(a),h=function(t){function e(){return i(this,e),o(this,t.apply(this,arguments))}return s(e,t),e.prototype.start=function(){},e.prototype.stop=function(){this.flush()},e.prototype.flush=function(){},e.prototype.render=function(t){},e}(u.default);r.default=h},{\"../managers/WebGLManager\":89}],91:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var o=t(\"pixi-gl-core\"),s=n(o),a=t(\"../../../utils/createIndicesForQuads\"),u=n(a),h=function(){function t(e,r){i(this,t),this.gl=e,this.vertices=new Float32Array([-1,-1,1,-1,1,1,-1,1]),this.uvs=new Float32Array([0,0,1,0,1,1,0,1]),this.interleaved=new Float32Array(16);for(var n=0;n<4;n++)this.interleaved[4*n]=this.vertices[2*n],this.interleaved[4*n+1]=this.vertices[2*n+1],this.interleaved[4*n+2]=this.uvs[2*n],this.interleaved[4*n+3]=this.uvs[2*n+1];this.indices=(0,u.default)(1),this.vertexBuffer=s.default.GLBuffer.createVertexBuffer(e,this.interleaved,e.STATIC_DRAW),this.indexBuffer=s.default.GLBuffer.createIndexBuffer(e,this.indices,e.STATIC_DRAW),this.vao=new s.default.VertexArrayObject(e,r)}return t.prototype.initVao=function(t){this.vao.clear().addIndex(this.indexBuffer).addAttribute(this.vertexBuffer,t.attributes.aVertexPosition,this.gl.FLOAT,!1,16,0).addAttribute(this.vertexBuffer,t.attributes.aTextureCoord,this.gl.FLOAT,!1,16,8)},t.prototype.map=function(t,e){var r=0,n=0;return this.uvs[0]=r,this.uvs[1]=n,this.uvs[2]=r+e.width/t.width,this.uvs[3]=n,this.uvs[4]=r+e.width/t.width,this.uvs[5]=n+e.height/t.height,this.uvs[6]=r,this.uvs[7]=n+e.height/t.height,r=e.x,n=e.y,this.vertices[0]=r,this.vertices[1]=n,this.vertices[2]=r+e.width,this.vertices[3]=n,this.vertices[4]=r+e.width,this.vertices[5]=n+e.height,this.vertices[6]=r,this.vertices[7]=n+e.height,this},t.prototype.upload=function(){for(var t=0;t<4;t++)this.interleaved[4*t]=this.vertices[2*t],this.interleaved[4*t+1]=this.vertices[2*t+1],this.interleaved[4*t+2]=this.uvs[2*t],this.interleaved[4*t+3]=this.uvs[2*t+1];return this.vertexBuffer.upload(this.interleaved),this},t.prototype.destroy=function(){var t=this.gl;t.deleteBuffer(this.vertexBuffer),t.deleteBuffer(this.indexBuffer)},t}();r.default=h},{\"../../../utils/createIndicesForQuads\":115,\"pixi-gl-core\":12}],92:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var o=t(\"../../../math\"),s=t(\"../../../const\"),a=t(\"../../../settings\"),u=n(a),h=t(\"pixi-gl-core\"),l=function(){function t(e,r,n,a,l,c){i(this,t),this.gl=e,this.frameBuffer=null,this.texture=null,this.clearColor=[0,0,0,0],this.size=new o.Rectangle(0,0,1,1),this.resolution=l||u.default.RESOLUTION,this.projectionMatrix=new o.Matrix,this.transform=null,this.frame=null,this.defaultFrame=new o.Rectangle,this.destinationFrame=null,this.sourceFrame=null,this.stencilBuffer=null,this.stencilMaskStack=[],this.filterData=null,this.scaleMode=a||u.default.SCALE_MODE,this.root=c,this.root?(this.frameBuffer=new h.GLFramebuffer(e,100,100),this.frameBuffer.framebuffer=null):(this.frameBuffer=h.GLFramebuffer.createRGBA(e,100,100),this.scaleMode===s.SCALE_MODES.NEAREST?this.frameBuffer.texture.enableNearestScaling():this.frameBuffer.texture.enableLinearScaling(),this.texture=this.frameBuffer.texture),this.setFrame(),this.resize(r,n)}return t.prototype.clear=function(t){var e=t||this.clearColor;this.frameBuffer.clear(e[0],e[1],e[2],e[3])},t.prototype.attachStencilBuffer=function(){this.root||this.frameBuffer.enableStencil()},t.prototype.setFrame=function(t,e){this.destinationFrame=t||this.destinationFrame||this.defaultFrame,this.sourceFrame=e||this.sourceFrame||t},t.prototype.activate=function(){var t=this.gl;this.frameBuffer.bind(),this.calculateProjection(this.destinationFrame,this.sourceFrame),this.transform&&this.projectionMatrix.append(this.transform),this.destinationFrame!==this.sourceFrame?(t.enable(t.SCISSOR_TEST),t.scissor(0|this.destinationFrame.x,0|this.destinationFrame.y,this.destinationFrame.width*this.resolution|0,this.destinationFrame.height*this.resolution|0)):t.disable(t.SCISSOR_TEST),t.viewport(0|this.destinationFrame.x,0|this.destinationFrame.y,this.destinationFrame.width*this.resolution|0,this.destinationFrame.height*this.resolution|0)},t.prototype.calculateProjection=function(t,e){var r=this.projectionMatrix;e=e||t,r.identity(),this.root?(r.a=1/t.width*2,r.d=-1/t.height*2,r.tx=-1-e.x*r.a,r.ty=1-e.y*r.d):(r.a=1/t.width*2,r.d=1/t.height*2,r.tx=-1-e.x*r.a,r.ty=-1-e.y*r.d)},t.prototype.resize=function(t,e){if(t=0|t,e=0|e,this.size.width!==t||this.size.height!==e){this.size.width=t,this.size.height=e,this.defaultFrame.width=t,this.defaultFrame.height=e,this.frameBuffer.resize(t*this.resolution,e*this.resolution);var r=this.frame||this.size;this.calculateProjection(r)}},t.prototype.destroy=function(){this.frameBuffer.destroy(),this.frameBuffer=null,this.texture=null},t}();r.default=l},{\"../../../const\":42,\"../../../math\":66,\"../../../settings\":97,\"pixi-gl-core\":12}],93:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){var r=!e;if(r){var n=document.createElement(\"canvas\");n.width=1,n.height=1,e=a.default.createContext(n)}for(var i=e.createShader(e.FRAGMENT_SHADER);;){var s=u.replace(/%forloop%/gi,o(t));if(e.shaderSource(i,s),e.compileShader(i),e.getShaderParameter(i,e.COMPILE_STATUS))break;t=t/2|0}return r&&e.getExtension(\"WEBGL_lose_context\")&&e.getExtension(\"WEBGL_lose_context\").loseContext(),t}function o(t){for(var e=\"\",r=0;r<t;++r)r>0&&(e+=\"\\nelse \"),r<t-1&&(e+=\"if(test == \"+r+\".0){}\");return e}r.__esModule=!0,r.default=i;var s=t(\"pixi-gl-core\"),a=n(s),u=[\"precision mediump float;\",\"void main(void){\",\"float test = 0.1;\",\"%forloop%\",\"gl_FragColor = vec4(0.0);\",\"}\"].join(\"\\n\")},{\"pixi-gl-core\":12}],94:[function(t,e,r){\"use strict\";function n(t){var e=arguments.length<=1||void 0===arguments[1]?[]:arguments[1];return e[i.BLEND_MODES.NORMAL]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],e[i.BLEND_MODES.ADD]=[t.ONE,t.DST_ALPHA],e[i.BLEND_MODES.MULTIPLY]=[t.DST_COLOR,t.ONE_MINUS_SRC_ALPHA],e[i.BLEND_MODES.SCREEN]=[t.ONE,t.ONE_MINUS_SRC_COLOR],e[i.BLEND_MODES.OVERLAY]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],e[i.BLEND_MODES.DARKEN]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],e[i.BLEND_MODES.LIGHTEN]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],e[i.BLEND_MODES.COLOR_DODGE]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],e[i.BLEND_MODES.COLOR_BURN]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],e[i.BLEND_MODES.HARD_LIGHT]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],e[i.BLEND_MODES.SOFT_LIGHT]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],e[i.BLEND_MODES.DIFFERENCE]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],e[i.BLEND_MODES.EXCLUSION]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],e[i.BLEND_MODES.HUE]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],e[i.BLEND_MODES.SATURATION]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],e[i.BLEND_MODES.COLOR]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],e[i.BLEND_MODES.LUMINOSITY]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],e}r.__esModule=!0,r.default=n;var i=t(\"../../../const\")},{\"../../../const\":42}],95:[function(t,e,r){\"use strict\";function n(t){var e=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];return e[i.DRAW_MODES.POINTS]=t.POINTS,e[i.DRAW_MODES.LINES]=t.LINES,e[i.DRAW_MODES.LINE_LOOP]=t.LINE_LOOP,e[i.DRAW_MODES.LINE_STRIP]=t.LINE_STRIP,e[i.DRAW_MODES.TRIANGLES]=t.TRIANGLES,e[i.DRAW_MODES.TRIANGLE_STRIP]=t.TRIANGLE_STRIP,e[i.DRAW_MODES.TRIANGLE_FAN]=t.TRIANGLE_FAN,e}r.__esModule=!0,r.default=n;var i=t(\"../../../const\")},{\"../../../const\":42}],96:[function(t,e,r){\"use strict\";function n(t){var e=t.getContextAttributes();e.stencil||console.warn(\"Provided WebGL context does not have a stencil buffer, masks may not render correctly\")}r.__esModule=!0,r.default=n},{}],97:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}r.__esModule=!0;var i=t(\"./utils/maxRecommendedTextures\"),o=n(i),s=t(\"./utils/canUploadSameBuffer\"),a=n(s);r.default={TARGET_FPMS:.06,MIPMAP_TEXTURES:!0,RESOLUTION:1,FILTER_RESOLUTION:1,SPRITE_MAX_TEXTURES:(0,o.default)(32),SPRITE_BATCH_SIZE:4096,RETINA_PREFIX:/@(.+)x/,RENDER_OPTIONS:{view:null,antialias:!1,forceFXAA:!1,autoResize:!1,transparent:!1,backgroundColor:0,clearBeforeRender:!0,preserveDrawingBuffer:!1,roundPixels:!1},TRANSFORM_MODE:0,GC_MODE:0,GC_MAX_IDLE:3600,GC_MAX_CHECK_COUNT:600,WRAP_MODE:0,SCALE_MODE:0,PRECISION:\"mediump\",CAN_UPLOAD_SAME_BUFFER:(0,a.default)()}},{\"./utils/canUploadSameBuffer\":114,\"./utils/maxRecommendedTextures\":118}],98:[function(t,e,r){\"use strict\";function n(t){\r\nreturn t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),u=t(\"../math\"),h=t(\"../utils\"),l=t(\"../const\"),c=t(\"../textures/Texture\"),d=n(c),f=t(\"../display/Container\"),p=n(f),v=new u.Point,y=function(t){function e(r){i(this,e);var n=o(this,t.call(this));return n._anchor=new u.ObservablePoint(n._onAnchorUpdate,n),n._texture=null,n._width=0,n._height=0,n._tint=null,n._tintRGB=null,n.tint=16777215,n.blendMode=l.BLEND_MODES.NORMAL,n.shader=null,n.cachedTint=16777215,n.texture=r||d.default.EMPTY,n.vertexData=new Float32Array(8),n.vertexTrimmedData=null,n._transformID=-1,n._textureID=-1,n}return s(e,t),e.prototype._onTextureUpdate=function(){this._textureID=-1,this._width&&(this.scale.x=(0,h.sign)(this.scale.x)*this._width/this.texture.orig.width),this._height&&(this.scale.y=(0,h.sign)(this.scale.y)*this._height/this.texture.orig.height)},e.prototype._onAnchorUpdate=function(){this._transformID=-1},e.prototype.calculateVertices=function(){if(this._transformID!==this.transform._worldID||this._textureID!==this._texture._updateID){this._transformID=this.transform._worldID,this._textureID=this._texture._updateID;var t=this._texture,e=this.transform.worldTransform,r=e.a,n=e.b,i=e.c,o=e.d,s=e.tx,a=e.ty,u=this.vertexData,h=t.trim,l=t.orig,c=this._anchor,d=0,f=0,p=0,v=0;h?(f=h.x-c._x*l.width,d=f+h.width,v=h.y-c._y*l.height,p=v+h.height):(d=l.width*(1-c._x),f=l.width*-c._x,p=l.height*(1-c._y),v=l.height*-c._y),u[0]=r*f+i*v+s,u[1]=o*v+n*f+a,u[2]=r*d+i*v+s,u[3]=o*v+n*d+a,u[4]=r*d+i*p+s,u[5]=o*p+n*d+a,u[6]=r*f+i*p+s,u[7]=o*p+n*f+a}},e.prototype.calculateTrimmedVertices=function(){this.vertexTrimmedData||(this.vertexTrimmedData=new Float32Array(8));var t=this._texture,e=this.vertexTrimmedData,r=t.orig,n=this._anchor,i=this.transform.worldTransform,o=i.a,s=i.b,a=i.c,u=i.d,h=i.tx,l=i.ty,c=r.width*(1-n._x),d=r.width*-n._x,f=r.height*(1-n._y),p=r.height*-n._y;e[0]=o*d+a*p+h,e[1]=u*p+s*d+l,e[2]=o*c+a*p+h,e[3]=u*p+s*c+l,e[4]=o*c+a*f+h,e[5]=u*f+s*c+l,e[6]=o*d+a*f+h,e[7]=u*f+s*d+l},e.prototype._renderWebGL=function(t){this.calculateVertices(),t.setObjectRenderer(t.plugins.sprite),t.plugins.sprite.render(this)},e.prototype._renderCanvas=function(t){t.plugins.sprite.render(this)},e.prototype._calculateBounds=function(){var t=this._texture.trim,e=this._texture.orig;!t||t.width===e.width&&t.height===e.height?(this.calculateVertices(),this._bounds.addQuad(this.vertexData)):(this.calculateTrimmedVertices(),this._bounds.addQuad(this.vertexTrimmedData))},e.prototype.getLocalBounds=function(e){return 0===this.children.length?(this._bounds.minX=this._texture.orig.width*-this._anchor._x,this._bounds.minY=this._texture.orig.height*-this._anchor._y,this._bounds.maxX=this._texture.orig.width*(1-this._anchor._x),this._bounds.maxY=this._texture.orig.height*(1-this._anchor._x),e||(this._localBoundsRect||(this._localBoundsRect=new u.Rectangle),e=this._localBoundsRect),this._bounds.getRectangle(e)):t.prototype.getLocalBounds.call(this,e)},e.prototype.containsPoint=function(t){this.worldTransform.applyInverse(t,v);var e=this._texture.orig.width,r=this._texture.orig.height,n=-e*this.anchor.x,i=0;return v.x>n&&v.x<n+e&&(i=-r*this.anchor.y,v.y>i&&v.y<i+r)},e.prototype.destroy=function(e){t.prototype.destroy.call(this,e),this._anchor=null;var r=\"boolean\"==typeof e?e:e&&e.texture;if(r){var n=\"boolean\"==typeof e?e:e&&e.baseTexture;this._texture.destroy(!!n)}this._texture=null,this.shader=null},e.from=function(t){return new e(d.default.from(t))},e.fromFrame=function(t){var r=h.TextureCache[t];if(!r)throw new Error('The frameId \"'+t+'\" does not exist in the texture cache');return new e(r)},e.fromImage=function(t,r,n){return new e(d.default.fromImage(t,r,n))},a(e,[{key:\"width\",get:function(){return Math.abs(this.scale.x)*this.texture.orig.width},set:function(t){var e=(0,h.sign)(this.scale.x)||1;this.scale.x=e*t/this.texture.orig.width,this._width=t}},{key:\"height\",get:function(){return Math.abs(this.scale.y)*this.texture.orig.height},set:function(t){var e=(0,h.sign)(this.scale.y)||1;this.scale.y=e*t/this.texture.orig.height,this._height=t}},{key:\"anchor\",get:function(){return this._anchor},set:function(t){this._anchor.copy(t)}},{key:\"tint\",get:function(){return this._tint},set:function(t){this._tint=t,this._tintRGB=(t>>16)+(65280&t)+((255&t)<<16)}},{key:\"texture\",get:function(){return this._texture},set:function(t){this._texture!==t&&(this._texture=t,this.cachedTint=16777215,this._textureID=-1,t&&(t.baseTexture.hasLoaded?this._onTextureUpdate():t.once(\"update\",this._onTextureUpdate,this)))}}]),e}(p.default);r.default=y},{\"../const\":42,\"../display/Container\":44,\"../math\":66,\"../textures/Texture\":109,\"../utils\":117}],99:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var o=t(\"../../renderers/canvas/CanvasRenderer\"),s=n(o),a=t(\"../../const\"),u=t(\"../../math\"),h=t(\"./CanvasTinter\"),l=n(h),c=new u.Matrix,d=function(){function t(e){i(this,t),this.renderer=e}return t.prototype.render=function(t){var e=t._texture,r=this.renderer,n=e._frame.width,i=e._frame.height,o=t.transform.worldTransform,s=0,h=0;if(!(e.orig.width<=0||e.orig.height<=0)&&e.baseTexture.source&&(r.setBlendMode(t.blendMode),e.valid)){r.context.globalAlpha=t.worldAlpha;var d=e.baseTexture.scaleMode===a.SCALE_MODES.LINEAR;r.smoothProperty&&r.context[r.smoothProperty]!==d&&(r.context[r.smoothProperty]=d),e.trim?(s=e.trim.width/2+e.trim.x-t.anchor.x*e.orig.width,h=e.trim.height/2+e.trim.y-t.anchor.y*e.orig.height):(s=(.5-t.anchor.x)*e.orig.width,h=(.5-t.anchor.y)*e.orig.height),e.rotate&&(o.copy(c),o=c,u.GroupD8.matrixAppendRotationInv(o,e.rotate,s,h),s=0,h=0),s-=n/2,h-=i/2,r.roundPixels?(r.context.setTransform(o.a,o.b,o.c,o.d,o.tx*r.resolution|0,o.ty*r.resolution|0),s=0|s,h=0|h):r.context.setTransform(o.a,o.b,o.c,o.d,o.tx*r.resolution,o.ty*r.resolution);var f=e.baseTexture.resolution;16777215!==t.tint?(t.cachedTint!==t.tint&&(t.cachedTint=t.tint,t.tintedTexture=l.default.getTintedTexture(t,t.tint)),r.context.drawImage(t.tintedTexture,0,0,n*f,i*f,s*r.resolution,h*r.resolution,n*r.resolution,i*r.resolution)):r.context.drawImage(e.baseTexture.source,e._frame.x*f,e._frame.y*f,n*f,i*f,s*r.resolution,h*r.resolution,n*r.resolution,i*r.resolution)}},t.prototype.destroy=function(){this.renderer=null},t}();r.default=d,s.default.registerPlugin(\"sprite\",d)},{\"../../const\":42,\"../../math\":66,\"../../renderers/canvas/CanvasRenderer\":73,\"./CanvasTinter\":100}],100:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}r.__esModule=!0;var i=t(\"../../utils\"),o=t(\"../../renderers/canvas/utils/canUseNewCanvasBlendModes\"),s=n(o),a={getTintedTexture:function(t,e){var r=t.texture;e=a.roundColor(e);var n=\"#\"+(\"00000\"+(0|e).toString(16)).substr(-6);if(r.tintCache=r.tintCache||{},r.tintCache[n])return r.tintCache[n];var i=a.canvas||document.createElement(\"canvas\");if(a.tintMethod(r,e,i),a.convertTintToImage){var o=new Image;o.src=i.toDataURL(),r.tintCache[n]=o}else r.tintCache[n]=i,a.canvas=null;return i},tintWithMultiply:function(t,e,r){var n=r.getContext(\"2d\"),i=t._frame.clone(),o=t.baseTexture.resolution;i.x*=o,i.y*=o,i.width*=o,i.height*=o,r.width=i.width,r.height=i.height,n.fillStyle=\"#\"+(\"00000\"+(0|e).toString(16)).substr(-6),n.fillRect(0,0,i.width,i.height),n.globalCompositeOperation=\"multiply\",n.drawImage(t.baseTexture.source,i.x,i.y,i.width,i.height,0,0,i.width,i.height),n.globalCompositeOperation=\"destination-atop\",n.drawImage(t.baseTexture.source,i.x,i.y,i.width,i.height,0,0,i.width,i.height)},tintWithOverlay:function(t,e,r){var n=r.getContext(\"2d\"),i=t._frame.clone(),o=t.baseTexture.resolution;i.x*=o,i.y*=o,i.width*=o,i.height*=o,r.width=i.width,r.height=i.height,n.globalCompositeOperation=\"copy\",n.fillStyle=\"#\"+(\"00000\"+(0|e).toString(16)).substr(-6),n.fillRect(0,0,i.width,i.height),n.globalCompositeOperation=\"destination-atop\",n.drawImage(t.baseTexture.source,i.x,i.y,i.width,i.height,0,0,i.width,i.height)},tintWithPerPixel:function(t,e,r){var n=r.getContext(\"2d\"),o=t._frame.clone(),s=t.baseTexture.resolution;o.x*=s,o.y*=s,o.width*=s,o.height*=s,r.width=o.width,r.height=o.height,n.globalCompositeOperation=\"copy\",n.drawImage(t.baseTexture.source,o.x,o.y,o.width,o.height,0,0,o.width,o.height);for(var a=(0,i.hex2rgb)(e),u=a[0],h=a[1],l=a[2],c=n.getImageData(0,0,o.width,o.height),d=c.data,f=0;f<d.length;f+=4)d[f+0]*=u,d[f+1]*=h,d[f+2]*=l;n.putImageData(c,0,0)},roundColor:function(t){var e=a.cacheStepsPerColorChannel,r=(0,i.hex2rgb)(t);return r[0]=Math.min(255,r[0]/e*e),r[1]=Math.min(255,r[1]/e*e),r[2]=Math.min(255,r[2]/e*e),(0,i.rgb2hex)(r)},cacheStepsPerColorChannel:8,convertTintToImage:!1,canUseMultiply:(0,s.default)(),tintMethod:0};a.tintMethod=a.canUseMultiply?a.tintWithMultiply:a.tintWithPerPixel,r.default=a},{\"../../renderers/canvas/utils/canUseNewCanvasBlendModes\":76,\"../../utils\":117}],101:[function(t,e,r){\"use strict\";function n(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var i=function(){function t(e){n(this,t),this.vertices=new ArrayBuffer(e),this.float32View=new Float32Array(this.vertices),this.uint32View=new Uint32Array(this.vertices)}return t.prototype.destroy=function(){this.vertices=null,this.positions=null,this.uvs=null,this.colors=null},t}();r.default=i},{}],102:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=t(\"../../renderers/webgl/utils/ObjectRenderer\"),u=n(a),h=t(\"../../renderers/webgl/WebGLRenderer\"),l=n(h),c=t(\"../../utils/createIndicesForQuads\"),d=n(c),f=t(\"./generateMultiTextureShader\"),p=n(f),v=t(\"../../renderers/webgl/utils/checkMaxIfStatmentsInShader\"),y=n(v),g=t(\"./BatchBuffer\"),m=n(g),_=t(\"../../settings\"),b=n(_),x=t(\"pixi-gl-core\"),T=n(x),w=t(\"bit-twiddle\"),E=n(w),O=0,S=0,M=function(t){function e(r){i(this,e);var n=o(this,t.call(this,r));n.vertSize=5,n.vertByteSize=4*n.vertSize,n.size=b.default.SPRITE_BATCH_SIZE,n.buffers=[];for(var s=1;s<=E.default.nextPow2(n.size);s*=2)n.buffers.push(new m.default(4*s*n.vertByteSize));n.indices=(0,d.default)(n.size),n.shader=null,n.currentIndex=0,O=0,n.groups=[];for(var a=0;a<n.size;a++)n.groups[a]={textures:[],textureCount:0,ids:[],size:0,start:0,blend:0};return n.sprites=[],n.vertexBuffers=[],n.vaos=[],n.vaoMax=2,n.vertexCount=0,n.renderer.on(\"prerender\",n.onPrerender,n),n}return s(e,t),e.prototype.onContextChange=function(){var t=this.renderer.gl;this.MAX_TEXTURES=Math.min(t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),b.default.SPRITE_MAX_TEXTURES),this.MAX_TEXTURES=(0,y.default)(this.MAX_TEXTURES,t);var e=this.shader=(0,p.default)(t,this.MAX_TEXTURES);this.indexBuffer=T.default.GLBuffer.createIndexBuffer(t,this.indices,t.STATIC_DRAW),this.renderer.bindVao(null);for(var r=0;r<this.vaoMax;r++)this.vertexBuffers[r]=T.default.GLBuffer.createVertexBuffer(t,null,t.STREAM_DRAW),this.vaos[r]=this.renderer.createVao().addIndex(this.indexBuffer).addAttribute(this.vertexBuffers[r],e.attributes.aVertexPosition,t.FLOAT,!1,this.vertByteSize,0).addAttribute(this.vertexBuffers[r],e.attributes.aTextureCoord,t.UNSIGNED_SHORT,!0,this.vertByteSize,8).addAttribute(this.vertexBuffers[r],e.attributes.aColor,t.UNSIGNED_BYTE,!0,this.vertByteSize,12).addAttribute(this.vertexBuffers[r],e.attributes.aTextureId,t.FLOAT,!1,this.vertByteSize,16);this.vao=this.vaos[0],this.currentBlendMode=99999,this.boundTextures=new Array(this.MAX_TEXTURES)},e.prototype.onPrerender=function(){this.vertexCount=0},e.prototype.render=function(t){this.currentIndex>=this.size&&this.flush(),t.texture._uvs&&(this.sprites[this.currentIndex++]=t)},e.prototype.flush=function(){if(0!==this.currentIndex){var t=this.renderer.gl,e=this.MAX_TEXTURES,r=E.default.nextPow2(this.currentIndex),n=E.default.log2(r),i=this.buffers[n],o=this.sprites,s=this.groups,a=i.float32View,u=i.uint32View,h=this.boundTextures,l=this.renderer.boundTextures,c=this.renderer.textureGC.count,d=0,f=void 0,p=void 0,v=1,y=0,g=s[0],m=void 0,_=void 0,x=o[0].blendMode;g.textureCount=0,g.start=0,g.blend=x,O++;var w=void 0;for(w=0;w<e;++w)h[w]=l[w],h[w]._virtalBoundId=w;for(w=0;w<this.currentIndex;++w){var M=o[w];if(f=M._texture.baseTexture,x!==M.blendMode&&(x=M.blendMode,p=null,y=e,O++),p!==f&&(p=f,f._enabled!==O)){if(y===e&&(O++,g.size=w-g.start,y=0,g=s[v++],g.blend=x,g.textureCount=0,g.start=w),f.touched=c,f._virtalBoundId===-1)for(var P=0;P<e;++P){var C=(P+S)%e,R=h[C];if(R._enabled!==O){S++,R._virtalBoundId=-1,f._virtalBoundId=C,h[C]=f;break}}f._enabled=O,g.textureCount++,g.ids[y]=f._virtalBoundId,g.textures[y++]=f}if(m=M.vertexData,_=M._texture._uvs.uvsUint32,this.renderer.roundPixels){var A=this.renderer.resolution;a[d]=(m[0]*A|0)/A,a[d+1]=(m[1]*A|0)/A,a[d+5]=(m[2]*A|0)/A,a[d+6]=(m[3]*A|0)/A,a[d+10]=(m[4]*A|0)/A,a[d+11]=(m[5]*A|0)/A,a[d+15]=(m[6]*A|0)/A,a[d+16]=(m[7]*A|0)/A}else a[d]=m[0],a[d+1]=m[1],a[d+5]=m[2],a[d+6]=m[3],a[d+10]=m[4],a[d+11]=m[5],a[d+15]=m[6],a[d+16]=m[7];u[d+2]=_[0],u[d+7]=_[1],u[d+12]=_[2],u[d+17]=_[3],u[d+3]=u[d+8]=u[d+13]=u[d+18]=M._tintRGB+(255*M.worldAlpha<<24),a[d+4]=a[d+9]=a[d+14]=a[d+19]=f._virtalBoundId,d+=20}for(g.size=w-g.start,b.default.CAN_UPLOAD_SAME_BUFFER?this.vertexBuffers[this.vertexCount].upload(i.vertices,0,!0):(this.vaoMax<=this.vertexCount&&(this.vaoMax++,this.vertexBuffers[this.vertexCount]=T.default.GLBuffer.createVertexBuffer(t,null,t.STREAM_DRAW),this.vaos[this.vertexCount]=this.renderer.createVao().addIndex(this.indexBuffer).addAttribute(this.vertexBuffers[this.vertexCount],this.shader.attributes.aVertexPosition,t.FLOAT,!1,this.vertByteSize,0).addAttribute(this.vertexBuffers[this.vertexCount],this.shader.attributes.aTextureCoord,t.UNSIGNED_SHORT,!0,this.vertByteSize,8).addAttribute(this.vertexBuffers[this.vertexCount],this.shader.attributes.aColor,t.UNSIGNED_BYTE,!0,this.vertByteSize,12).addAttribute(this.vertexBuffers[this.vertexCount],this.shader.attributes.aTextureId,t.FLOAT,!1,this.vertByteSize,16)),this.renderer.bindVao(this.vaos[this.vertexCount]),this.vertexBuffers[this.vertexCount].upload(i.vertices,0,!1),this.vertexCount++),w=0;w<e;++w)l[w]._virtalBoundId=-1;for(w=0;w<v;++w){for(var D=s[w],I=D.textureCount,L=0;L<I;L++)p=D.textures[L],l[D.ids[L]]!==p&&this.renderer.bindTexture(p,D.ids[L],!0),p._virtalBoundId=-1;this.renderer.state.setBlendMode(D.blend),t.drawElements(t.TRIANGLES,6*D.size,t.UNSIGNED_SHORT,6*D.start*2)}this.currentIndex=0}},e.prototype.start=function(){this.renderer.bindShader(this.shader),b.default.CAN_UPLOAD_SAME_BUFFER&&(this.renderer.bindVao(this.vaos[this.vertexCount]),this.vertexBuffers[this.vertexCount].bind())},e.prototype.stop=function(){this.flush()},e.prototype.destroy=function(){for(var e=0;e<this.vaoMax;e++)this.vertexBuffers[e]&&this.vertexBuffers[e].destroy(),this.vaos[e]&&this.vaos[e].destroy();this.indexBuffer&&this.indexBuffer.destroy(),this.renderer.off(\"prerender\",this.onPrerender,this),t.prototype.destroy.call(this),this.shader&&(this.shader.destroy(),this.shader=null),this.vertexBuffers=null,this.vaos=null,this.indexBuffer=null,this.indices=null,this.sprites=null;for(var r=0;r<this.buffers.length;++r)this.buffers[r].destroy()},e}(u.default);r.default=M,l.default.registerPlugin(\"sprite\",M)},{\"../../renderers/webgl/WebGLRenderer\":80,\"../../renderers/webgl/utils/ObjectRenderer\":90,\"../../renderers/webgl/utils/checkMaxIfStatmentsInShader\":93,\"../../settings\":97,\"../../utils/createIndicesForQuads\":115,\"./BatchBuffer\":101,\"./generateMultiTextureShader\":103,\"bit-twiddle\":1,\"pixi-gl-core\":12}],103:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){var r=\"attribute vec2 aVertexPosition;\\nattribute vec2 aTextureCoord;\\nattribute vec4 aColor;\\nattribute float aTextureId;\\n\\nuniform mat3 projectionMatrix;\\n\\nvarying vec2 vTextureCoord;\\nvarying vec4 vColor;\\nvarying float vTextureId;\\n\\nvoid main(void){\\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\\n\\n    vTextureCoord = aTextureCoord;\\n    vTextureId = aTextureId;\\n    vColor = vec4(aColor.rgb * aColor.a, aColor.a);\\n}\\n\",n=u;n=n.replace(/%count%/gi,e),n=n.replace(/%forloop%/gi,o(e));for(var i=new a.default(t,r,n),s=[],h=0;h<e;h++)s[h]=h;return i.bind(),i.uniforms.uSamplers=s,i}function o(t){var e=\"\";e+=\"\\n\",e+=\"\\n\";for(var r=0;r<t;r++)r>0&&(e+=\"\\nelse \"),r<t-1&&(e+=\"if(textureId == \"+r+\".0)\"),e+=\"\\n{\",e+=\"\\n\\tcolor = texture2D(uSamplers[\"+r+\"], vTextureCoord);\",e+=\"\\n}\";return e+=\"\\n\",e+=\"\\n\"}r.__esModule=!0,r.default=i;var s=t(\"../../Shader\"),a=n(s),u=(t(\"path\"),[\"varying vec2 vTextureCoord;\",\"varying vec4 vColor;\",\"varying float vTextureId;\",\"uniform sampler2D uSamplers[%count%];\",\"void main(void){\",\"vec4 color;\",\"float textureId = floor(vTextureId+0.5);\",\"%forloop%\",\"gl_FragColor = color * vColor;\",\"}\"].join(\"\\n\"))},{\"../../Shader\":41,path:22}],104:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),u=t(\"../sprites/Sprite\"),h=n(u),l=t(\"../textures/Texture\"),c=n(l),d=t(\"../math\"),f=t(\"../utils\"),p=t(\"../const\"),v=t(\"../settings\"),y=n(v),g=t(\"./TextStyle\"),m=n(g),_={texture:!0,children:!1,baseTexture:!0},b=function(t){function e(r,n){i(this,e);var s=document.createElement(\"canvas\");s.width=3,s.height=3;var a=c.default.fromCanvas(s);a.orig=new d.Rectangle,a.trim=new d.Rectangle;var u=o(this,t.call(this,a));return u.canvas=s,u.context=u.canvas.getContext(\"2d\"),u.resolution=y.default.RESOLUTION,u._text=null,u._style=null,u._styleListener=null,u._font=\"\",u.text=r,u.style=n,u.localStyleID=-1,u}return s(e,t),e.prototype.updateText=function(t){var r=this._style;if(this.localStyleID!==r.styleID&&(this.dirty=!0,this.localStyleID=r.styleID),this.dirty||!t){this._font=e.getFontStyle(r),this.context.font=this._font;for(var n=r.wordWrap?this.wordWrap(this._text):this._text,i=n.split(/(?:\\r\\n|\\r|\\n)/),o=new Array(i.length),s=0,a=e.calculateFontProperties(this._font),u=0;u<i.length;u++){var h=this.context.measureText(i[u]).width+(i[u].length-1)*r.letterSpacing;o[u]=h,s=Math.max(s,h)}var l=s+r.strokeThickness;r.dropShadow&&(l+=r.dropShadowDistance),l+=2*r.padding,this.canvas.width=Math.ceil((l+this.context.lineWidth)*this.resolution);var c=this.style.lineHeight||a.fontSize+r.strokeThickness,d=Math.max(c,a.fontSize+r.strokeThickness)+(i.length-1)*c;r.dropShadow&&(d+=r.dropShadowDistance),this.canvas.height=Math.ceil((d+2*this._style.padding)*this.resolution),this.context.scale(this.resolution,this.resolution),this.context.clearRect(0,0,this.canvas.width,this.canvas.height),this.context.font=this._font,this.context.strokeStyle=r.stroke,this.context.lineWidth=r.strokeThickness,this.context.textBaseline=r.textBaseline,this.context.lineJoin=r.lineJoin,this.context.miterLimit=r.miterLimit;var f=void 0,p=void 0;if(r.dropShadow){r.dropShadowBlur>0?(this.context.shadowColor=r.dropShadowColor,this.context.shadowBlur=r.dropShadowBlur):this.context.fillStyle=r.dropShadowColor;for(var v=Math.cos(r.dropShadowAngle)*r.dropShadowDistance,y=Math.sin(r.dropShadowAngle)*r.dropShadowDistance,g=0;g<i.length;g++)f=r.strokeThickness/2,p=r.strokeThickness/2+g*c+a.ascent,\"right\"===r.align?f+=s-o[g]:\"center\"===r.align&&(f+=(s-o[g])/2),r.fill&&(this.drawLetterSpacing(i[g],f+v+r.padding,p+y+r.padding),r.stroke&&r.strokeThickness&&(this.context.strokeStyle=r.dropShadowColor,this.drawLetterSpacing(i[g],f+v+r.padding,p+y+r.padding,!0),this.context.strokeStyle=r.stroke))}this.context.fillStyle=this._generateFillStyle(r,i);for(var m=0;m<i.length;m++)f=r.strokeThickness/2,p=r.strokeThickness/2+m*c+a.ascent,\"right\"===r.align?f+=s-o[m]:\"center\"===r.align&&(f+=(s-o[m])/2),r.stroke&&r.strokeThickness&&this.drawLetterSpacing(i[m],f+r.padding,p+r.padding,!0),r.fill&&this.drawLetterSpacing(i[m],f+r.padding,p+r.padding);this.updateTexture()}},e.prototype.drawLetterSpacing=function(t,e,r){var n=!(arguments.length<=3||void 0===arguments[3])&&arguments[3],i=this._style,o=i.letterSpacing;if(0===o)return void(n?this.context.strokeText(t,e,r):this.context.fillText(t,e,r));for(var s=String.prototype.split.call(t,\"\"),a=e,u=0,h=\"\";u<t.length;)h=s[u++],n?this.context.strokeText(h,a,r):this.context.fillText(h,a,r),a+=this.context.measureText(h).width+o},e.prototype.updateTexture=function(){var t=this._texture,e=this._style;t.baseTexture.hasLoaded=!0,t.baseTexture.resolution=this.resolution,t.baseTexture.realWidth=this.canvas.width,t.baseTexture.realHeight=this.canvas.height,t.baseTexture.width=this.canvas.width/this.resolution,t.baseTexture.height=this.canvas.height/this.resolution,t.trim.width=t._frame.width=this.canvas.width/this.resolution,t.trim.height=t._frame.height=this.canvas.height/this.resolution,t.trim.x=-e.padding,t.trim.y=-e.padding,t.orig.width=t._frame.width-2*e.padding,t.orig.height=t._frame.height-2*e.padding,this._onTextureUpdate(),t.baseTexture.emit(\"update\",t.baseTexture),this.dirty=!1},e.prototype.renderWebGL=function(e){this.resolution!==e.resolution&&(this.resolution=e.resolution,this.dirty=!0),this.updateText(!0),t.prototype.renderWebGL.call(this,e)},e.prototype._renderCanvas=function(e){this.resolution!==e.resolution&&(this.resolution=e.resolution,this.dirty=!0),this.updateText(!0),t.prototype._renderCanvas.call(this,e)},e.prototype.wordWrap=function(t){for(var e=\"\",r=t.split(\"\\n\"),n=this._style.wordWrapWidth,i=0;i<r.length;i++){for(var o=n,s=r[i].split(\" \"),a=0;a<s.length;a++){var u=this.context.measureText(s[a]).width;if(this._style.breakWords&&u>n)for(var h=s[a].split(\"\"),l=0;l<h.length;l++){var c=this.context.measureText(h[l]).width;c>o?(e+=\"\\n\"+h[l],o=n-c):(0===l&&(e+=\" \"),e+=h[l],o-=c)}else{var d=u+this.context.measureText(\" \").width;0===a||d>o?(a>0&&(e+=\"\\n\"),e+=s[a],o=n-u):(o-=d,e+=\" \"+s[a])}}i<r.length-1&&(e+=\"\\n\")}return e},e.prototype._calculateBounds=function(){this.updateText(!0),this.calculateVertices(),this._bounds.addQuad(this.vertexData)},e.prototype._onStyleChange=function(){this.dirty=!0},e.prototype._generateFillStyle=function(t,e){if(!Array.isArray(t.fill))return t.fill;if(navigator.isCocoonJS)return t.fill[0];var r=void 0,n=void 0,i=void 0,o=void 0,s=this.canvas.width/this.resolution,a=this.canvas.height/this.resolution;if(t.fillGradientType===p.TEXT_GRADIENT.LINEAR_VERTICAL){r=this.context.createLinearGradient(s/2,0,s/2,a),n=(t.fill.length+1)*e.length,i=0;for(var u=0;u<e.length;u++){i+=1;for(var h=0;h<t.fill.length;h++)o=i/n,r.addColorStop(o,t.fill[h]),i++}}else{r=this.context.createLinearGradient(0,a/2,s,a/2),n=t.fill.length+1,i=1;for(var l=0;l<t.fill.length;l++)o=i/n,r.addColorStop(o,t.fill[l]),i++}return r},e.prototype.destroy=function(e){\"boolean\"==typeof e&&(e={children:e}),e=Object.assign({},_,e),t.prototype.destroy.call(this,e),this.context=null,this.canvas=null,this._style=null},e.getFontStyle=function(t){t=t||{},t instanceof m.default||(t=new m.default(t));var e=\"number\"==typeof t.fontSize?t.fontSize+\"px\":t.fontSize;return t.fontStyle+\" \"+t.fontVariant+\" \"+t.fontWeight+\" \"+e+' \"'+t.fontFamily+'\"'},e.calculateFontProperties=function(t){if(e.fontPropertiesCache[t])return e.fontPropertiesCache[t];var r={},n=e.fontPropertiesCanvas,i=e.fontPropertiesContext;i.font=t;var o=Math.ceil(i.measureText(\"|MÉq\").width),s=Math.ceil(i.measureText(\"M\").width),a=2*s;s=1.4*s|0,n.width=o,n.height=a,i.fillStyle=\"#f00\",i.fillRect(0,0,o,a),i.font=t,i.textBaseline=\"alphabetic\",i.fillStyle=\"#000\",i.fillText(\"|MÉq\",0,s);var u=i.getImageData(0,0,o,a).data,h=u.length,l=4*o,c=0,d=0,f=!1;for(c=0;c<s;++c){for(var p=0;p<l;p+=4)if(255!==u[d+p]){f=!0;break}if(f)break;d+=l}for(r.ascent=s-c,d=h-l,f=!1,c=a;c>s;--c){for(var v=0;v<l;v+=4)if(255!==u[d+v]){f=!0;break}if(f)break;d-=l}return r.descent=c-s,r.fontSize=r.ascent+r.descent,e.fontPropertiesCache[t]=r,r},a(e,[{key:\"width\",get:function(){return this.updateText(!0),Math.abs(this.scale.x)*this.texture.orig.width},set:function(t){this.updateText(!0);var e=(0,f.sign)(this.scale.x)||1;this.scale.x=e*t/this.texture.orig.width,this._width=t}},{key:\"height\",get:function(){return this.updateText(!0),Math.abs(this.scale.y)*this._texture.orig.height},set:function(t){this.updateText(!0);var e=(0,f.sign)(this.scale.y)||1;this.scale.y=e*t/this.texture.orig.height,this._height=t}},{key:\"style\",get:function(){return this._style},set:function(t){t=t||{},t instanceof m.default?this._style=t:this._style=new m.default(t),this.localStyleID=-1,this.dirty=!0}},{key:\"text\",get:function(){return this._text},set:function(t){t=t||\" \",t=t.toString(),this._text!==t&&(this._text=t,this.dirty=!0)}}]),e}(h.default);r.default=b,b.fontPropertiesCache={},b.fontPropertiesCanvas=document.createElement(\"canvas\"),b.fontPropertiesContext=b.fontPropertiesCanvas.getContext(\"2d\")},{\"../const\":42,\"../math\":66,\"../settings\":97,\"../sprites/Sprite\":98,\"../textures/Texture\":109,\"../utils\":117,\"./TextStyle\":105}],105:[function(t,e,r){\"use strict\";function n(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function i(t){if(\"number\"==typeof t)return(0,a.hex2string)(t);if(Array.isArray(t))for(var e=0;e<t.length;++e)\"number\"==typeof t[e]&&(t[e]=(0,a.hex2string)(t[e]));return t}r.__esModule=!0;var o=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),s=t(\"../const\"),a=t(\"../utils\"),u={align:\"left\",breakWords:!1,dropShadow:!1,dropShadowAngle:Math.PI/6,dropShadowBlur:0,dropShadowColor:\"#000000\",dropShadowDistance:5,fill:\"black\",fillGradientType:s.TEXT_GRADIENT.LINEAR_VERTICAL,fontFamily:\"Arial\",fontSize:26,fontStyle:\"normal\",fontVariant:\"normal\",fontWeight:\"normal\",letterSpacing:0,lineHeight:0,lineJoin:\"miter\",miterLimit:10,padding:0,stroke:\"black\",strokeThickness:0,textBaseline:\"alphabetic\",wordWrap:!1,wordWrapWidth:100},h=function(){function t(e){n(this,t),this.styleID=0,Object.assign(this,u,e)}return t.prototype.clone=function(){var e={};for(var r in this._defaults)e[r]=this[r];return new t(e)},t.prototype.reset=function(){Object.assign(this,this._defaults)},o(t,[{key:\"align\",get:function(){return this._align},set:function(t){this._align!==t&&(this._align=t,this.styleID++)}},{key:\"breakWords\",get:function(){return this._breakWords},set:function(t){this._breakWords!==t&&(this._breakWords=t,this.styleID++)}},{key:\"dropShadow\",get:function(){return this._dropShadow},set:function(t){this._dropShadow!==t&&(this._dropShadow=t,this.styleID++)}},{key:\"dropShadowAngle\",get:function(){return this._dropShadowAngle},set:function(t){this._dropShadowAngle!==t&&(this._dropShadowAngle=t,this.styleID++)}},{key:\"dropShadowBlur\",get:function(){return this._dropShadowBlur},set:function(t){this._dropShadowBlur!==t&&(this._dropShadowBlur=t,this.styleID++)}},{key:\"dropShadowColor\",get:function(){return this._dropShadowColor},set:function(t){var e=i(t);this._dropShadowColor!==e&&(this._dropShadowColor=e,this.styleID++)}},{key:\"dropShadowDistance\",get:function(){return this._dropShadowDistance},set:function(t){this._dropShadowDistance!==t&&(this._dropShadowDistance=t,this.styleID++)}},{key:\"fill\",get:function(){return this._fill},set:function(t){var e=i(t);this._fill!==e&&(this._fill=e,this.styleID++)}},{key:\"fillGradientType\",get:function(){return this._fillGradientType},set:function(t){this._fillGradientType!==t&&(this._fillGradientType=t,this.styleID++)}},{key:\"fontFamily\",get:function(){return this._fontFamily},set:function(t){this.fontFamily!==t&&(this._fontFamily=t,this.styleID++)}},{key:\"fontSize\",get:function(){return this._fontSize},set:function(t){this._fontSize!==t&&(this._fontSize=t,this.styleID++)}},{key:\"fontStyle\",get:function(){return this._fontStyle},set:function(t){this._fontStyle!==t&&(this._fontStyle=t,this.styleID++)}},{key:\"fontVariant\",get:function(){return this._fontVariant},set:function(t){this._fontVariant!==t&&(this._fontVariant=t,this.styleID++)}},{key:\"fontWeight\",get:function(){return this._fontWeight},set:function(t){this._fontWeight!==t&&(this._fontWeight=t,this.styleID++)}},{key:\"letterSpacing\",get:function(){return this._letterSpacing},set:function(t){this._letterSpacing!==t&&(this._letterSpacing=t,this.styleID++)}},{key:\"lineHeight\",get:function(){return this._lineHeight},set:function(t){this._lineHeight!==t&&(this._lineHeight=t,this.styleID++)}},{key:\"lineJoin\",get:function(){return this._lineJoin},set:function(t){this._lineJoin!==t&&(this._lineJoin=t,this.styleID++)}},{key:\"miterLimit\",get:function(){return this._miterLimit},set:function(t){this._miterLimit!==t&&(this._miterLimit=t,this.styleID++)}},{key:\"padding\",get:function(){return this._padding},set:function(t){this._padding!==t&&(this._padding=t,this.styleID++)}},{key:\"stroke\",get:function(){return this._stroke},set:function(t){var e=i(t);this._stroke!==e&&(this._stroke=e,this.styleID++)}},{key:\"strokeThickness\",get:function(){return this._strokeThickness},set:function(t){this._strokeThickness!==t&&(this._strokeThickness=t,this.styleID++)}},{key:\"textBaseline\",get:function(){return this._textBaseline},set:function(t){this._textBaseline!==t&&(this._textBaseline=t,this.styleID++)}},{key:\"wordWrap\",get:function(){return this._wordWrap},set:function(t){this._wordWrap!==t&&(this._wordWrap=t,this.styleID++)}},{key:\"wordWrapWidth\",get:function(){return this._wordWrapWidth},set:function(t){this._wordWrapWidth!==t&&(this._wordWrapWidth=t,this.styleID++)}}]),t}();r.default=h},{\"../const\":42,\"../utils\":117}],106:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);\r\nt.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=t(\"./BaseTexture\"),u=n(a),h=t(\"../settings\"),l=n(h),c=l.default.RESOLUTION,d=l.default.SCALE_MODE,f=function(t){function e(){var r=arguments.length<=0||void 0===arguments[0]?100:arguments[0],n=arguments.length<=1||void 0===arguments[1]?100:arguments[1],s=arguments[2],a=arguments[3];i(this,e);var u=o(this,t.call(this,null,s));return u.resolution=a||c,u.width=r,u.height=n,u.realWidth=u.width*u.resolution,u.realHeight=u.height*u.resolution,u.scaleMode=s||d,u.hasLoaded=!0,u._glRenderTargets={},u._canvasRenderTarget=null,u.valid=!1,u}return s(e,t),e.prototype.resize=function(t,e){t===this.width&&e===this.height||(this.valid=t>0&&e>0,this.width=t,this.height=e,this.realWidth=this.width*this.resolution,this.realHeight=this.height*this.resolution,this.valid&&this.emit(\"update\",this))},e.prototype.destroy=function(){t.prototype.destroy.call(this,!0),this.renderer=null},e}(u.default);r.default=f},{\"../settings\":97,\"./BaseTexture\":107}],107:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=\"function\"==typeof Symbol&&\"symbol\"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&\"function\"==typeof Symbol&&t.constructor===Symbol?\"symbol\":typeof t},u=t(\"../utils\"),h=t(\"../settings\"),l=n(h),c=t(\"eventemitter3\"),d=n(c),f=t(\"../utils/determineCrossOrigin\"),p=n(f),v=t(\"bit-twiddle\"),y=n(v),g=function(t){function e(r,n,s){i(this,e);var a=o(this,t.call(this));return a.uid=(0,u.uid)(),a.touched=0,a.resolution=s||l.default.RESOLUTION,a.width=100,a.height=100,a.realWidth=100,a.realHeight=100,a.scaleMode=n||l.default.SCALE_MODE,a.hasLoaded=!1,a.isLoading=!1,a.source=null,a.origSource=null,a.imageType=null,a.sourceScale=1,a.premultipliedAlpha=!0,a.imageUrl=null,a.isPowerOfTwo=!1,a.mipmap=l.default.MIPMAP_TEXTURES,a.wrapMode=l.default.WRAP_MODE,a._glTextures={},a._enabled=0,a._virtalBoundId=-1,r&&a.loadSource(r),a}return s(e,t),e.prototype.update=function(){\"svg\"!==this.imageType&&(this.realWidth=this.source.naturalWidth||this.source.videoWidth||this.source.width,this.realHeight=this.source.naturalHeight||this.source.videoHeight||this.source.height,this.width=this.realWidth/this.resolution,this.height=this.realHeight/this.resolution,this.isPowerOfTwo=y.default.isPow2(this.realWidth)&&y.default.isPow2(this.realHeight)),this.emit(\"update\",this)},e.prototype.loadSource=function(t){var e=this,r=this.isLoading;this.hasLoaded=!1,this.isLoading=!1,r&&this.source&&(this.source.onload=null,this.source.onerror=null);var n=!this.source;if(this.source=t,(t.src&&t.complete||t.getContext)&&t.width&&t.height)this._updateImageType(),\"svg\"===this.imageType?this._loadSvgSource():this._sourceLoaded(),n&&this.emit(\"loaded\",this);else if(!t.getContext){var i=function(){e.isLoading=!0;var n=e;if(t.onload=function(){if(n._updateImageType(),t.onload=null,t.onerror=null,n.isLoading)return n.isLoading=!1,n._sourceLoaded(),\"svg\"===n.imageType?void n._loadSvgSource():void n.emit(\"loaded\",n)},t.onerror=function(){t.onload=null,t.onerror=null,n.isLoading&&(n.isLoading=!1,n.emit(\"error\",n))},t.complete&&t.src){if(t.onload=null,t.onerror=null,\"svg\"===n.imageType)return n._loadSvgSource(),{v:void 0};e.isLoading=!1,t.width&&t.height?(e._sourceLoaded(),r&&e.emit(\"loaded\",e)):r&&e.emit(\"error\",e)}}();if(\"object\"===(\"undefined\"==typeof i?\"undefined\":a(i)))return i.v}},e.prototype._updateImageType=function(){if(this.imageUrl){var t=(0,u.decomposeDataUri)(this.imageUrl),e=void 0;if(t&&\"image\"===t.mediaType){var r=t.subType.split(\"+\")[0];if(e=(0,u.getUrlFileExtension)(\".\"+r),!e)throw new Error(\"Invalid image type in data URI.\")}else e=(0,u.getUrlFileExtension)(this.imageUrl),e||(e=\"png\");this.imageType=e}},e.prototype._loadSvgSource=function(){if(\"svg\"===this.imageType){var t=(0,u.decomposeDataUri)(this.imageUrl);t?this._loadSvgSourceUsingDataUri(t):this._loadSvgSourceUsingXhr()}},e.prototype._loadSvgSourceUsingDataUri=function(t){var e=void 0;if(\"base64\"===t.encoding){if(!atob)throw new Error(\"Your browser doesn't support base64 conversions.\");e=atob(t.data)}else e=t.data;this._loadSvgSourceUsingString(e)},e.prototype._loadSvgSourceUsingXhr=function(){var t=this,e=new XMLHttpRequest;e.onload=function(){if(e.readyState!==e.DONE||200!==e.status)throw new Error(\"Failed to load SVG using XHR.\");t._loadSvgSourceUsingString(e.response)},e.onerror=function(){return t.emit(\"error\",t)},e.open(\"GET\",this.imageUrl,!0),e.send()},e.prototype._loadSvgSourceUsingString=function(t){var e=(0,u.getSvgSize)(t),r=e.width,n=e.height;if(!r||!n)throw new Error(\"The SVG image must have width and height defined (in pixels), canvas API needs them.\");this.realWidth=Math.round(r*this.sourceScale),this.realHeight=Math.round(n*this.sourceScale),this.width=this.realWidth/this.resolution,this.height=this.realHeight/this.resolution,this.isPowerOfTwo=y.default.isPow2(this.realWidth)&&y.default.isPow2(this.realHeight);var i=document.createElement(\"canvas\");i.width=this.realWidth,i.height=this.realHeight,i._pixiId=\"canvas_\"+(0,u.uid)(),i.getContext(\"2d\").drawImage(this.source,0,0,r,n,0,0,this.realWidth,this.realHeight),this.origSource=this.source,this.source=i,u.BaseTextureCache[i._pixiId]=this,this.isLoading=!1,this._sourceLoaded(),this.emit(\"loaded\",this)},e.prototype._sourceLoaded=function(){this.hasLoaded=!0,this.update()},e.prototype.destroy=function(){this.imageUrl&&(delete u.BaseTextureCache[this.imageUrl],delete u.TextureCache[this.imageUrl],this.imageUrl=null,navigator.isCocoonJS||(this.source.src=\"\")),this.source&&this.source._pixiId&&delete u.BaseTextureCache[this.source._pixiId],this.source=null,this.dispose()},e.prototype.dispose=function(){this.emit(\"dispose\",this)},e.prototype.updateSourceImage=function(t){this.source.src=t,this.loadSource(this.source)},e.fromImage=function(t,r,n,i){var o=u.BaseTextureCache[t];if(!o){var s=new Image;void 0===r&&0!==t.indexOf(\"data:\")&&(s.crossOrigin=(0,p.default)(t)),o=new e(s,n),o.imageUrl=t,i&&(o.sourceScale=i),o.resolution=(0,u.getResolutionOfUrl)(t),s.src=t,u.BaseTextureCache[t]=o}return o},e.fromCanvas=function(t,r){t._pixiId||(t._pixiId=\"canvas_\"+(0,u.uid)());var n=u.BaseTextureCache[t._pixiId];return n||(n=new e(t,r),u.BaseTextureCache[t._pixiId]=n),n},e}(d.default);r.default=g},{\"../settings\":97,\"../utils\":117,\"../utils/determineCrossOrigin\":116,\"bit-twiddle\":1,eventemitter3:3}],108:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=t(\"./BaseRenderTexture\"),u=n(a),h=t(\"./Texture\"),l=n(h),c=function(t){function e(r,n){i(this,e);var s=null;if(!(r instanceof u.default)){var a=arguments[1],h=arguments[2],l=arguments[3]||0,c=arguments[4]||1;console.warn(\"Please use RenderTexture.create(\"+a+\", \"+h+\") instead of the ctor directly.\"),s=arguments[0],n=null,r=new u.default(a,h,l,c)}var d=o(this,t.call(this,r,n));return d.legacyRenderer=s,d.valid=!0,d._updateUvs(),d}return s(e,t),e.prototype.resize=function(t,e,r){this.valid=t>0&&e>0,this._frame.width=this.orig.width=t,this._frame.height=this.orig.height=e,r||this.baseTexture.resize(t,e),this._updateUvs()},e.create=function(t,r,n,i){return new e(new u.default(t,r,n,i))},e}(l.default);r.default=c},{\"./BaseRenderTexture\":106,\"./Texture\":109}],109:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),u=t(\"./BaseTexture\"),h=n(u),l=t(\"./VideoBaseTexture\"),c=n(l),d=t(\"./TextureUvs\"),f=n(d),p=t(\"eventemitter3\"),v=n(p),y=t(\"../math\"),g=t(\"../utils\"),m=function(t){function e(r,n,s,a,u){i(this,e);var h=o(this,t.call(this));if(h.noFrame=!1,n||(h.noFrame=!0,n=new y.Rectangle(0,0,1,1)),r instanceof e&&(r=r.baseTexture),h.baseTexture=r,h._frame=n,h.trim=a,h.valid=!1,h.requiresUpdate=!1,h._uvs=null,h.orig=s||n,h._rotate=Number(u||0),u===!0)h._rotate=2;else if(h._rotate%2!==0)throw new Error(\"attempt to use diamond-shaped UVs. If you are sure, set rotation manually\");return r.hasLoaded?(h.noFrame&&(n=new y.Rectangle(0,0,r.width,r.height),r.on(\"update\",h.onBaseTextureUpdated,h)),h.frame=n):r.once(\"loaded\",h.onBaseTextureLoaded,h),h._updateID=0,h.transform=null,h}return s(e,t),e.prototype.update=function(){this.baseTexture.update()},e.prototype.onBaseTextureLoaded=function(t){this._updateID++,this.noFrame?this.frame=new y.Rectangle(0,0,t.width,t.height):this.frame=this._frame,this.baseTexture.on(\"update\",this.onBaseTextureUpdated,this),this.emit(\"update\",this)},e.prototype.onBaseTextureUpdated=function(t){this._updateID++,this._frame.width=t.width,this._frame.height=t.height,this.emit(\"update\",this)},e.prototype.destroy=function(t){this.baseTexture&&(t&&(g.TextureCache[this.baseTexture.imageUrl]&&delete g.TextureCache[this.baseTexture.imageUrl],this.baseTexture.destroy()),this.baseTexture.off(\"update\",this.onBaseTextureUpdated,this),this.baseTexture.off(\"loaded\",this.onBaseTextureLoaded,this),this.baseTexture=null),this._frame=null,this._uvs=null,this.trim=null,this.orig=null,this.valid=!1,this.off(\"dispose\",this.dispose,this),this.off(\"update\",this.update,this)},e.prototype.clone=function(){return new e(this.baseTexture,this.frame,this.orig,this.trim,this.rotate)},e.prototype._updateUvs=function(){this._uvs||(this._uvs=new f.default),this._uvs.set(this._frame,this.baseTexture,this.rotate),this._updateID++},e.fromImage=function(t,r,n,i){var o=g.TextureCache[t];return o||(o=new e(h.default.fromImage(t,r,n,i)),g.TextureCache[t]=o),o},e.fromFrame=function(t){var e=g.TextureCache[t];if(!e)throw new Error('The frameId \"'+t+'\" does not exist in the texture cache');return e},e.fromCanvas=function(t,r){return new e(h.default.fromCanvas(t,r))},e.fromVideo=function(t,r){return\"string\"==typeof t?e.fromVideoUrl(t,r):new e(c.default.fromVideo(t,r))},e.fromVideoUrl=function(t,r){return new e(c.default.fromUrl(t,r))},e.from=function(t){if(\"string\"==typeof t){var r=g.TextureCache[t];if(!r){var n=null!==t.match(/\\.(mp4|webm|ogg|h264|avi|mov)$/);return n?e.fromVideoUrl(t):e.fromImage(t)}return r}return t instanceof HTMLImageElement?new e(new h.default(t)):t instanceof HTMLCanvasElement?e.fromCanvas(t):t instanceof HTMLVideoElement?e.fromVideo(t):t instanceof h.default?new e(t):t},e.addTextureToCache=function(t,e){g.TextureCache[e]=t},e.removeTextureFromCache=function(t){var e=g.TextureCache[t];return delete g.TextureCache[t],delete g.BaseTextureCache[t],e},a(e,[{key:\"frame\",get:function(){return this._frame},set:function(t){if(this._frame=t,this.noFrame=!1,t.x+t.width>this.baseTexture.width||t.y+t.height>this.baseTexture.height)throw new Error(\"Texture Error: frame does not fit inside the base Texture dimensions \"+this);this.valid=t&&t.width&&t.height&&this.baseTexture.hasLoaded,this.trim||this.rotate||(this.orig=t),this.valid&&this._updateUvs()}},{key:\"rotate\",get:function(){return this._rotate},set:function(t){this._rotate=t,this.valid&&this._updateUvs()}},{key:\"width\",get:function(){return this.orig?this.orig.width:0}},{key:\"height\",get:function(){return this.orig?this.orig.height:0}}]),e}(v.default);r.default=m,m.EMPTY=new m(new h.default),m.EMPTY.destroy=function(){},m.EMPTY.on=function(){},m.EMPTY.once=function(){},m.EMPTY.emit=function(){}},{\"../math\":66,\"../utils\":117,\"./BaseTexture\":107,\"./TextureUvs\":110,\"./VideoBaseTexture\":111,eventemitter3:3}],110:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var o=t(\"../math/GroupD8\"),s=n(o),a=function(){function t(){i(this,t),this.x0=0,this.y0=0,this.x1=1,this.y1=0,this.x2=1,this.y2=1,this.x3=0,this.y3=1,this.uvsUint32=new Uint32Array(4)}return t.prototype.set=function(t,e,r){var n=e.width,i=e.height;if(r){var o=t.width/2/n,a=t.height/2/i,u=t.x/n+o,h=t.y/i+a;r=s.default.add(r,s.default.NW),this.x0=u+o*s.default.uX(r),this.y0=h+a*s.default.uY(r),r=s.default.add(r,2),this.x1=u+o*s.default.uX(r),this.y1=h+a*s.default.uY(r),r=s.default.add(r,2),this.x2=u+o*s.default.uX(r),this.y2=h+a*s.default.uY(r),r=s.default.add(r,2),this.x3=u+o*s.default.uX(r),this.y3=h+a*s.default.uY(r)}else this.x0=t.x/n,this.y0=t.y/i,this.x1=(t.x+t.width)/n,this.y1=t.y/i,this.x2=(t.x+t.width)/n,this.y2=(t.y+t.height)/i,this.x3=t.x/n,this.y3=(t.y+t.height)/i;this.uvsUint32[0]=(65535*this.y0&65535)<<16|65535*this.x0&65535,this.uvsUint32[1]=(65535*this.y1&65535)<<16|65535*this.x1&65535,this.uvsUint32[2]=(65535*this.y2&65535)<<16|65535*this.x2&65535,this.uvsUint32[3]=(65535*this.y3&65535)<<16|65535*this.x3&65535},t}();r.default=a},{\"../math/GroupD8\":62}],111:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function i(t){return t&&t.__esModule?t:{default:t}}function o(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function s(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function a(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function u(t,e){e||(e=\"video/\"+t.substr(t.lastIndexOf(\".\")+1));var r=document.createElement(\"source\");return r.src=t,r.type=e,r}r.__esModule=!0;var h=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),l=t(\"./BaseTexture\"),c=i(l),d=t(\"../utils\"),f=t(\"../ticker\"),p=n(f),v=function(t){function e(r,n){if(o(this,e),!r)throw new Error(\"No video source element specified.\");(r.readyState===r.HAVE_ENOUGH_DATA||r.readyState===r.HAVE_FUTURE_DATA)&&r.width&&r.height&&(r.complete=!0);var i=s(this,t.call(this,r,n));return i.width=r.videoWidth,i.height=r.videoHeight,i._autoUpdate=!0,i._isAutoUpdating=!1,i.autoPlay=!0,i.update=i.update.bind(i),i._onCanPlay=i._onCanPlay.bind(i),r.addEventListener(\"play\",i._onPlayStart.bind(i)),r.addEventListener(\"pause\",i._onPlayStop.bind(i)),i.hasLoaded=!1,i.__loaded=!1,i._isSourceReady()?i._onCanPlay():(r.addEventListener(\"canplay\",i._onCanPlay),r.addEventListener(\"canplaythrough\",i._onCanPlay)),i}return a(e,t),e.prototype._isSourcePlaying=function(){var t=this.source;return t.currentTime>0&&t.paused===!1&&t.ended===!1&&t.readyState>2},e.prototype._isSourceReady=function(){return 3===this.source.readyState||4===this.source.readyState},e.prototype._onPlayStart=function(){this.hasLoaded||this._onCanPlay(),!this._isAutoUpdating&&this.autoUpdate&&(p.shared.add(this.update,this),this._isAutoUpdating=!0)},e.prototype._onPlayStop=function(){this._isAutoUpdating&&(p.shared.remove(this.update,this),this._isAutoUpdating=!1)},e.prototype._onCanPlay=function(){this.hasLoaded=!0,this.source&&(this.source.removeEventListener(\"canplay\",this._onCanPlay),this.source.removeEventListener(\"canplaythrough\",this._onCanPlay),this.width=this.source.videoWidth,this.height=this.source.videoHeight,this.__loaded||(this.__loaded=!0,this.emit(\"loaded\",this)),this._isSourcePlaying()?this._onPlayStart():this.autoPlay&&this.source.play())},e.prototype.destroy=function(){this._isAutoUpdating&&p.shared.remove(this.update,this),this.source&&this.source._pixiId&&(delete d.BaseTextureCache[this.source._pixiId],delete this.source._pixiId),t.prototype.destroy.call(this)},e.fromVideo=function(t,r){t._pixiId||(t._pixiId=\"video_\"+(0,d.uid)());var n=d.BaseTextureCache[t._pixiId];return n||(n=new e(t,r),d.BaseTextureCache[t._pixiId]=n),n},e.fromUrl=function(t,r){var n=document.createElement(\"video\");if(n.setAttribute(\"webkit-playsinline\",\"\"),n.setAttribute(\"playsinline\",\"\"),Array.isArray(t))for(var i=0;i<t.length;++i)n.appendChild(u(t[i].src||t[i],t[i].mime));else n.appendChild(u(t.src||t,t.mime));return n.load(),e.fromVideo(n,r)},h(e,[{key:\"autoUpdate\",get:function(){return this._autoUpdate},set:function(t){t!==this._autoUpdate&&(this._autoUpdate=t,!this._autoUpdate&&this._isAutoUpdating?(p.shared.remove(this.update,this),this._isAutoUpdating=!1):this._autoUpdate&&!this._isAutoUpdating&&(p.shared.add(this.update,this),this._isAutoUpdating=!0))}}]),e}(c.default);r.default=v,v.fromUrls=v.fromUrl},{\"../ticker\":113,\"../utils\":117,\"./BaseTexture\":107}],112:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var o=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),s=t(\"../settings\"),a=n(s),u=t(\"eventemitter3\"),h=n(u),l=\"tick\",c=function(){function t(){var e=this;i(this,t),this._emitter=new h.default,this._requestId=null,this._maxElapsedMS=100,this.autoStart=!1,this.deltaTime=1,this.elapsedMS=1/a.default.TARGET_FPMS,this.lastTime=0,this.speed=1,this.started=!1,this._tick=function(t){e._requestId=null,e.started&&(e.update(t),e.started&&null===e._requestId&&e._emitter.listeners(l,!0)&&(e._requestId=requestAnimationFrame(e._tick)))}}return t.prototype._requestIfNeeded=function(){null===this._requestId&&this._emitter.listeners(l,!0)&&(this.lastTime=performance.now(),this._requestId=requestAnimationFrame(this._tick))},t.prototype._cancelIfNeeded=function(){null!==this._requestId&&(cancelAnimationFrame(this._requestId),this._requestId=null)},t.prototype._startIfPossible=function(){this.started?this._requestIfNeeded():this.autoStart&&this.start()},t.prototype.add=function(t,e){return this._emitter.on(l,t,e),this._startIfPossible(),this},t.prototype.addOnce=function(t,e){return this._emitter.once(l,t,e),this._startIfPossible(),this},t.prototype.remove=function(t,e){return this._emitter.off(l,t,e),this._emitter.listeners(l,!0)||this._cancelIfNeeded(),this},t.prototype.start=function(){this.started||(this.started=!0,this._requestIfNeeded())},t.prototype.stop=function(){this.started&&(this.started=!1,this._cancelIfNeeded())},t.prototype.update=function(){var t=arguments.length<=0||void 0===arguments[0]?performance.now():arguments[0],e=void 0;t>this.lastTime?(e=this.elapsedMS=t-this.lastTime,e>this._maxElapsedMS&&(e=this._maxElapsedMS),this.deltaTime=e*a.default.TARGET_FPMS*this.speed,this._emitter.emit(l,this.deltaTime)):this.deltaTime=this.elapsedMS=0,this.lastTime=t},o(t,[{key:\"FPS\",get:function(){return 1e3/this.elapsedMS}},{key:\"minFPS\",get:function(){return 1e3/this._maxElapsedMS},set:function(t){var e=Math.min(Math.max(0,t)/1e3,a.default.TARGET_FPMS);this._maxElapsedMS=1/e}}]),t}();r.default=c},{\"../settings\":97,eventemitter3:3}],113:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}r.__esModule=!0,r.Ticker=r.shared=void 0;var i=t(\"./Ticker\"),o=n(i),s=new o.default;s.autoStart=!0,r.shared=s,r.Ticker=o.default},{\"./Ticker\":112}],114:[function(t,e,r){\"use strict\";function n(){var t=!!navigator.platform&&/iPad|iPhone|iPod/.test(navigator.platform);return!t}r.__esModule=!0,r.default=n},{}],115:[function(t,e,r){\"use strict\";function n(t){for(var e=6*t,r=new Uint16Array(e),n=0,i=0;n<e;n+=6,i+=4)r[n+0]=i+0,r[n+1]=i+1,r[n+2]=i+2,r[n+3]=i+0,r[n+4]=i+2,r[n+5]=i+3;return r}r.__esModule=!0,r.default=n},{}],116:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t){var e=arguments.length<=1||void 0===arguments[1]?window.location:arguments[1];if(0===t.indexOf(\"data:\"))return\"\";e=e||window.location,a||(a=document.createElement(\"a\")),a.href=t,t=s.default.parse(a.href);var r=!t.port&&\"\"===e.port||t.port===e.port;return t.hostname===e.hostname&&r&&t.protocol===e.protocol?\"\":\"anonymous\"}r.__esModule=!0,r.default=i;var o=t(\"url\"),s=n(o),a=void 0},{url:28}],117:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function i(t){return t&&t.__esModule?t:{default:t}}function o(){return++M}function s(t,e){return e=e||[],e[0]=(t>>16&255)/255,e[1]=(t>>8&255)/255,e[2]=(255&t)/255,e}function a(t){return t=t.toString(16),t=\"000000\".substr(0,6-t.length)+t,\"#\"+t}function u(t){return(255*t[0]<<16)+(255*t[1]<<8)+255*t[2]}function h(t){var e=b.default.RETINA_PREFIX.exec(t);return e?parseFloat(e[1]):1}function l(t){var e=m.DATA_URI.exec(t);if(e)return{mediaType:e[1]?e[1].toLowerCase():void 0,subType:e[2]?e[2].toLowerCase():void 0,encoding:e[3]?e[3].toLowerCase():void 0,data:e[4]}}function c(t){var e=m.URL_FILE_EXTENSION.exec(t);if(e)return e[1].toLowerCase()}function d(t){var e=m.SVG_SIZE.exec(t),r={};return e&&(r[e[1]]=Math.round(parseFloat(e[3])),r[e[5]]=Math.round(parseFloat(e[7]))),r}function f(){P=!0}function p(t){if(!P){if(navigator.userAgent.toLowerCase().indexOf(\"chrome\")>-1){var e=[\"\\n %c %c %c Pixi.js \"+m.VERSION+\" - ✰ \"+t+\" ✰  %c  %c  http://www.pixijs.com/  %c %c ♥%c♥%c♥ \\n\\n\",\"background: #ff66a5; padding:5px 0;\",\"background: #ff66a5; padding:5px 0;\",\"color: #ff66a5; background: #030307; padding:5px 0;\",\"background: #ff66a5; padding:5px 0;\",\"background: #ffc3dc; padding:5px 0;\",\"background: #ff66a5; padding:5px 0;\",\"color: #ff2424; background: #fff; padding:5px 0;\",\"color: #ff2424; background: #fff; padding:5px 0;\",\"color: #ff2424; background: #fff; padding:5px 0;\"];window.console.log.apply(console,e)}else window.console&&window.console.log(\"Pixi.js \"+m.VERSION+\" - \"+t+\" - http://www.pixijs.com/\");P=!0}}function v(){var t={stencil:!0,failIfMajorPerformanceCaveat:!0};try{if(!window.WebGLRenderingContext)return!1;var e=document.createElement(\"canvas\"),r=e.getContext(\"webgl\",t)||e.getContext(\"experimental-webgl\",t),n=!(!r||!r.getContextAttributes().stencil);if(r){var i=r.getExtension(\"WEBGL_lose_context\");i&&i.loseContext()}return r=null,n}catch(t){return!1}}function y(t){return 0===t?0:t<0?-1:1}function g(t,e,r){var n=t.length;if(!(e>=n||0===r)){r=e+r>n?n-e:r;for(var i=n-r,o=e;o<i;++o)t[o]=t[o+r];t.length=i}}r.__esModule=!0,r.BaseTextureCache=r.TextureCache=r.pluginTarget=r.EventEmitter=r.isMobile=void 0,r.uid=o,r.hex2rgb=s,r.hex2string=a,r.rgb2hex=u,r.getResolutionOfUrl=h,r.decomposeDataUri=l,r.getUrlFileExtension=c,r.getSvgSize=d,r.skipHello=f,r.sayHello=p,r.isWebGLSupported=v,r.sign=y,r.removeItems=g;var m=t(\"../const\"),_=t(\"../settings\"),b=i(_),x=t(\"eventemitter3\"),T=i(x),w=t(\"./pluginTarget\"),E=i(w),O=t(\"ismobilejs\"),S=n(O),M=0,P=!1;r.isMobile=S,r.EventEmitter=T.default,r.pluginTarget=E.default;r.TextureCache={},r.BaseTextureCache={}},{\"../const\":42,\"../settings\":97,\"./pluginTarget\":119,eventemitter3:3,ismobilejs:4}],118:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t){return s.default.tablet||s.default.phone?4:t}r.__esModule=!0,r.default=i;var o=t(\"ismobilejs\"),s=n(o)},{ismobilejs:4}],119:[function(t,e,r){\"use strict\";function n(t){t.__plugins={},t.registerPlugin=function(e,r){t.__plugins[e]=r},t.prototype.initPlugins=function(){this.plugins=this.plugins||{};for(var e in t.__plugins)this.plugins[e]=new t.__plugins[e](this)},t.prototype.destroyPlugins=function(){for(var t in this.plugins)this.plugins[t].destroy(),this.plugins[t]=null;this.plugins=null}}r.__esModule=!0,r.default={mixin:function(t){n(t)}}},{}],120:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function i(t){}var o=t(\"./core\"),s=n(o),a=t(\"./mesh\"),u=n(a),h=t(\"./particles\"),l=n(h),c=t(\"./extras\"),d=n(c),f=t(\"./filters\"),p=n(f),v=t(\"./prepare\"),y=n(v);s.SpriteBatch=function(){throw new ReferenceError(\"SpriteBatch does not exist any more, please use the new ParticleContainer instead.\")},s.AssetLoader=function(){throw new ReferenceError(\"The loader system was overhauled in pixi v3, please see the new PIXI.loaders.Loader class.\")},Object.defineProperties(s,{Stage:{enumerable:!0,get:function(){return i(\"You do not need to use a PIXI Stage any more, you can simply render any container.\"),s.Container}},DisplayObjectContainer:{enumerable:!0,get:function(){return i(\"DisplayObjectContainer has been shortened to Container, please use Container from now on.\"),s.Container}},Strip:{enumerable:!0,get:function(){return i(\"The Strip class has been renamed to Mesh and moved to mesh.Mesh, please use mesh.Mesh from now on.\"),u.Mesh}},Rope:{enumerable:!0,get:function(){return i(\"The Rope class has been moved to mesh.Rope, please use mesh.Rope from now on.\"),u.Rope}},ParticleContainer:{enumerable:!0,get:function(){return i(\"The ParticleContainer class has been moved to particles.ParticleContainer, please use particles.ParticleContainer from now on.\"),l.ParticleContainer}},MovieClip:{enumerable:!0,get:function(){return i(\"The MovieClip class has been moved to extras.AnimatedSprite, please use extras.AnimatedSprite.\"),d.AnimatedSprite}},TilingSprite:{enumerable:!0,get:function(){return i(\"The TilingSprite class has been moved to extras.TilingSprite, please use extras.TilingSprite from now on.\"),d.TilingSprite}},BitmapText:{enumerable:!0,get:function(){return i(\"The BitmapText class has been moved to extras.BitmapText, please use extras.BitmapText from now on.\"),d.BitmapText}},blendModes:{enumerable:!0,get:function(){return i(\"The blendModes has been moved to BLEND_MODES, please use BLEND_MODES from now on.\"),s.BLEND_MODES}},scaleModes:{enumerable:!0,get:function(){return i(\"The scaleModes has been moved to SCALE_MODES, please use SCALE_MODES from now on.\"),s.SCALE_MODES}},BaseTextureCache:{enumerable:!0,get:function(){return i(\"The BaseTextureCache class has been moved to utils.BaseTextureCache, please use utils.BaseTextureCache from now on.\"),s.utils.BaseTextureCache}},TextureCache:{enumerable:!0,get:function(){return i(\"The TextureCache class has been moved to utils.TextureCache, please use utils.TextureCache from now on.\"),s.utils.TextureCache}},math:{enumerable:!0,get:function(){return i(\"The math namespace is deprecated, please access members already accessible on PIXI.\"),s}},AbstractFilter:{enumerable:!0,get:function(){return i(\"AstractFilter has been renamed to Filter, please use PIXI.Filter\"),s.Filter}},TransformManual:{enumerable:!0,get:function(){return i(\"TransformManual has been renamed to TransformBase, please update your pixi-spine\"),s.TransformBase}},TARGET_FPMS:{enumerable:!0,get:function(){return i(\"PIXI.TARGET_FPMS has been deprecated, please use PIXI.settings.TARGET_FPMS\"),s.settings.TARGET_FPMS},set:function(t){i(\"PIXI.TARGET_FPMS has been deprecated, please use PIXI.settings.TARGET_FPMS\"),s.settings.TARGET_FPMS=t}},FILTER_RESOLUTION:{enumerable:!0,get:function(){return i(\"PIXI.FILTER_RESOLUTION has been deprecated, please use PIXI.settings.FILTER_RESOLUTION\"),s.settings.FILTER_RESOLUTION},set:function(t){i(\"PIXI.FILTER_RESOLUTION has been deprecated, please use PIXI.settings.FILTER_RESOLUTION\"),s.settings.FILTER_RESOLUTION=t}},RESOLUTION:{enumerable:!0,get:function(){return i(\"PIXI.RESOLUTION has been deprecated, please use PIXI.settings.RESOLUTION\"),s.settings.RESOLUTION},set:function(t){i(\"PIXI.RESOLUTION has been deprecated, please use PIXI.settings.RESOLUTION\"),s.settings.RESOLUTION=t}},MIPMAP_TEXTURES:{enumerable:!0,get:function(){return i(\"PIXI.MIPMAP_TEXTURES has been deprecated, please use PIXI.settings.MIPMAP_TEXTURES\"),s.settings.MIPMAP_TEXTURES},set:function(t){i(\"PIXI.MIPMAP_TEXTURES has been deprecated, please use PIXI.settings.MIPMAP_TEXTURES\"),s.settings.MIPMAP_TEXTURES=t}},SPRITE_BATCH_SIZE:{enumerable:!0,get:function(){return i(\"PIXI.SPRITE_BATCH_SIZE has been deprecated, please use PIXI.settings.SPRITE_BATCH_SIZE\"),s.settings.SPRITE_BATCH_SIZE},set:function(t){i(\"PIXI.SPRITE_BATCH_SIZE has been deprecated, please use PIXI.settings.SPRITE_BATCH_SIZE\"),s.settings.SPRITE_BATCH_SIZE=t}},SPRITE_MAX_TEXTURES:{enumerable:!0,get:function(){return i(\"PIXI.SPRITE_MAX_TEXTURES has been deprecated, please use PIXI.settings.SPRITE_MAX_TEXTURES\"),s.settings.SPRITE_MAX_TEXTURES},set:function(t){i(\"PIXI.SPRITE_MAX_TEXTURES has been deprecated, please use PIXI.settings.SPRITE_MAX_TEXTURES\"),s.settings.SPRITE_MAX_TEXTURES=t}},RETINA_PREFIX:{enumerable:!0,get:function(){return i(\"PIXI.RETINA_PREFIX has been deprecated, please use PIXI.settings.RETINA_PREFIX\"),s.settings.RETINA_PREFIX},set:function(t){i(\"PIXI.RETINA_PREFIX has been deprecated, please use PIXI.settings.RETINA_PREFIX\"),s.settings.RETINA_PREFIX=t}},DEFAULT_RENDER_OPTIONS:{enumerable:!0,get:function(){return i(\"PIXI.DEFAULT_RENDER_OPTIONS has been deprecated, please use PIXI.settings.DEFAULT_RENDER_OPTIONS\"),s.settings.RENDER_OPTIONS}}});for(var g=[{parent:\"TRANSFORM_MODE\",target:\"TRANSFORM_MODE\"},{parent:\"GC_MODES\",target:\"GC_MODE\"},{parent:\"WRAP_MODES\",target:\"WRAP_MODE\"},{parent:\"SCALE_MODES\",target:\"SCALE_MODE\"},{parent:\"PRECISION\",target:\"PRECISION\"}],m=function(t){var e=g[t];Object.defineProperty(s[e.parent],\"DEFAULT\",{enumerable:!0,get:function(){return i(\"PIXI.\"+e.parent+\".DEFAULT has been deprecated, please use PIXI.settings.\"+e.target),s.settings[e.target]},set:function(t){i(\"PIXI.\"+e.parent+\".DEFAULT has been deprecated, please use PIXI.settings.\"+e.target),s.settings[e.target]=t}})},_=0;_<g.length;_++)m(_);Object.defineProperties(d,{MovieClip:{enumerable:!0,get:function(){return i(\"The MovieClip class has been renamed to AnimatedSprite, please use AnimatedSprite from now on.\"),d.AnimatedSprite}}}),s.DisplayObject.prototype.generateTexture=function(t,e,r){return i(\"generateTexture has moved to the renderer, please use renderer.generateTexture(displayObject)\"),t.generateTexture(this,e,r);\r\n},s.Graphics.prototype.generateTexture=function(t,e){return i(\"graphics generate texture has moved to the renderer. Or to render a graphics to a texture using canvas please use generateCanvasTexture\"),this.generateCanvasTexture(t,e)},s.RenderTexture.prototype.render=function(t,e,r,n){this.legacyRenderer.render(t,this,r,e,!n),i(\"RenderTexture.render is now deprecated, please use renderer.render(displayObject, renderTexture)\")},s.RenderTexture.prototype.getImage=function(t){return i(\"RenderTexture.getImage is now deprecated, please use renderer.extract.image(target)\"),this.legacyRenderer.extract.image(t)},s.RenderTexture.prototype.getBase64=function(t){return i(\"RenderTexture.getBase64 is now deprecated, please use renderer.extract.base64(target)\"),this.legacyRenderer.extract.base64(t)},s.RenderTexture.prototype.getCanvas=function(t){return i(\"RenderTexture.getCanvas is now deprecated, please use renderer.extract.canvas(target)\"),this.legacyRenderer.extract.canvas(t)},s.RenderTexture.prototype.getPixels=function(t){return i(\"RenderTexture.getPixels is now deprecated, please use renderer.extract.pixels(target)\"),this.legacyRenderer.pixels(t)},s.Sprite.prototype.setTexture=function(t){this.texture=t,i(\"setTexture is now deprecated, please use the texture property, e.g : sprite.texture = texture;\")},d.BitmapText.prototype.setText=function(t){this.text=t,i(\"setText is now deprecated, please use the text property, e.g : myBitmapText.text = 'my text';\")},s.Text.prototype.setText=function(t){this.text=t,i(\"setText is now deprecated, please use the text property, e.g : myText.text = 'my text';\")},s.Text.prototype.setStyle=function(t){this.style=t,i(\"setStyle is now deprecated, please use the style property, e.g : myText.style = style;\")},s.Text.prototype.determineFontProperties=function(t){return i(\"determineFontProperties is now deprecated, please use the static calculateFontProperties method, e.g : Text.calculateFontProperties(fontStyle);\"),Text.calculateFontProperties(t)},Object.defineProperties(s.TextStyle.prototype,{font:{get:function(){i(\"text style property 'font' is now deprecated, please use the 'fontFamily', 'fontSize', 'fontStyle', 'fontVariant' and 'fontWeight' properties from now on\");var t=\"number\"==typeof this._fontSize?this._fontSize+\"px\":this._fontSize;return this._fontStyle+\" \"+this._fontVariant+\" \"+this._fontWeight+\" \"+t+\" \"+this._fontFamily},set:function(t){i(\"text style property 'font' is now deprecated, please use the 'fontFamily','fontSize',fontStyle','fontVariant' and 'fontWeight' properties from now on\"),t.indexOf(\"italic\")>1?this._fontStyle=\"italic\":t.indexOf(\"oblique\")>-1?this._fontStyle=\"oblique\":this._fontStyle=\"normal\",t.indexOf(\"small-caps\")>-1?this._fontVariant=\"small-caps\":this._fontVariant=\"normal\";var e=t.split(\" \"),r=-1;this._fontSize=26;for(var n=0;n<e.length;++n)if(e[n].match(/(px|pt|em|%)/)){r=n,this._fontSize=e[n];break}this._fontWeight=\"normal\";for(var o=0;o<r;++o)if(e[o].match(/(bold|bolder|lighter|100|200|300|400|500|600|700|800|900)/)){this._fontWeight=e[o];break}if(r>-1&&r<e.length-1){this._fontFamily=\"\";for(var s=r+1;s<e.length;++s)this._fontFamily+=e[s]+\" \";this._fontFamily=this._fontFamily.slice(0,-1)}else this._fontFamily=\"Arial\";this.styleID++}}}),s.Texture.prototype.setFrame=function(t){this.frame=t,i(\"setFrame is now deprecated, please use the frame property, e.g: myTexture.frame = frame;\")},Object.defineProperties(p,{AbstractFilter:{get:function(){return i(\"AstractFilter has been renamed to Filter, please use PIXI.Filter\"),s.AbstractFilter}},SpriteMaskFilter:{get:function(){return i(\"filters.SpriteMaskFilter is an undocumented alias, please use SpriteMaskFilter from now on.\"),s.SpriteMaskFilter}}}),s.utils.uuid=function(){return i(\"utils.uuid() is deprecated, please use utils.uid() from now on.\"),s.utils.uid()},s.utils.canUseNewCanvasBlendModes=function(){return i(\"utils.canUseNewCanvasBlendModes() is deprecated, please use CanvasTinter.canUseMultiply from now on\"),s.CanvasTinter.canUseMultiply};var b=!0;Object.defineProperty(s.utils,\"_saidHello\",{set:function(t){t&&(i(\"PIXI.utils._saidHello is deprecated, please use PIXI.utils.skipHello()\"),this.skipHello()),b=t},get:function(){return b}}),Object.defineProperty(y.canvas,\"UPLOADS_PER_FRAME\",{set:function(){i(\"PIXI.CanvasPrepare.UPLOADS_PER_FRAME has been removed. Please set renderer.plugins.prepare.limiter.maxItemsPerFrame on your renderer\")},get:function(){return i(\"PIXI.CanvasPrepare.UPLOADS_PER_FRAME has been removed. Please use renderer.plugins.prepare.limiter\"),NaN}}),Object.defineProperty(y.webgl,\"UPLOADS_PER_FRAME\",{set:function(){i(\"PIXI.WebGLPrepare.UPLOADS_PER_FRAME has been removed. Please set renderer.plugins.prepare.limiter.maxItemsPerFrame on your renderer\")},get:function(){return i(\"PIXI.WebGLPrepare.UPLOADS_PER_FRAME has been removed. Please use renderer.plugins.prepare.limiter\"),NaN}})},{\"./core\":61,\"./extras\":131,\"./filters\":142,\"./mesh\":160,\"./particles\":163,\"./prepare\":173}],121:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var o=t(\"../../core\"),s=n(o),a=new s.Rectangle,u=function(){function t(e){i(this,t),this.renderer=e,e.extract=this}return t.prototype.image=function t(e){var t=new Image;return t.src=this.base64(e),t},t.prototype.base64=function(t){return this.canvas(t).toDataURL()},t.prototype.canvas=function(t){var e=this.renderer,r=void 0,n=void 0,i=void 0,o=void 0;t&&(o=t instanceof s.RenderTexture?t:e.generateTexture(t)),o?(r=o.baseTexture._canvasRenderTarget.context,n=o.baseTexture._canvasRenderTarget.resolution,i=o.frame):(r=e.rootContext,i=a,i.width=this.renderer.width,i.height=this.renderer.height);var u=i.width*n,h=i.height*n,l=new s.CanvasRenderTarget(u,h),c=r.getImageData(i.x*n,i.y*n,u,h);return l.context.putImageData(c,0,0),l.canvas},t.prototype.pixels=function(t){var e=this.renderer,r=void 0,n=void 0,i=void 0,o=void 0;return t&&(o=t instanceof s.RenderTexture?t:e.generateTexture(t)),o?(r=o.baseTexture._canvasRenderTarget.context,n=o.baseTexture._canvasRenderTarget.resolution,i=o.frame):(r=e.rootContext,i=a,i.width=e.width,i.height=e.height),r.getImageData(0,0,i.width*n,i.height*n).data},t.prototype.destroy=function(){this.renderer.extract=null,this.renderer=null},t}();r.default=u,s.CanvasRenderer.registerPlugin(\"extract\",u)},{\"../../core\":61}],122:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}r.__esModule=!0;var i=t(\"./webgl/WebGLExtract\");Object.defineProperty(r,\"webgl\",{enumerable:!0,get:function(){return n(i).default}});var o=t(\"./canvas/CanvasExtract\");Object.defineProperty(r,\"canvas\",{enumerable:!0,get:function(){return n(o).default}})},{\"./canvas/CanvasExtract\":121,\"./webgl/WebGLExtract\":123}],123:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var o=t(\"../../core\"),s=n(o),a=new s.Rectangle,u=4,h=function(){function t(e){i(this,t),this.renderer=e,e.extract=this}return t.prototype.image=function t(e){var t=new Image;return t.src=this.base64(e),t},t.prototype.base64=function(t){return this.canvas(t).toDataURL()},t.prototype.canvas=function(t){var e=this.renderer,r=void 0,n=void 0,i=void 0,o=!1,h=void 0;t&&(h=t instanceof s.RenderTexture?t:this.renderer.generateTexture(t)),h?(r=h.baseTexture._glRenderTargets[this.renderer.CONTEXT_UID],n=r.resolution,i=h.frame,o=!1):(r=this.renderer.rootRenderTarget,n=r.resolution,o=!0,i=a,i.width=r.size.width,i.height=r.size.height);var l=i.width*n,c=i.height*n,d=new s.CanvasRenderTarget(l,c);if(r){e.bindRenderTarget(r);var f=new Uint8Array(u*l*c),p=e.gl;p.readPixels(i.x*n,i.y*n,l,c,p.RGBA,p.UNSIGNED_BYTE,f);var v=d.context.getImageData(0,0,l,c);v.data.set(f),d.context.putImageData(v,0,0),o&&(d.context.scale(1,-1),d.context.drawImage(d.canvas,0,-c))}return d.canvas},t.prototype.pixels=function(t){var e=this.renderer,r=void 0,n=void 0,i=void 0,o=void 0;t&&(o=t instanceof s.RenderTexture?t:this.renderer.generateTexture(t)),o?(r=o.baseTexture._glRenderTargets[this.renderer.CONTEXT_UID],n=r.resolution,i=o.frame):(r=this.renderer.rootRenderTarget,n=r.resolution,i=a,i.width=r.size.width,i.height=r.size.height);var h=i.width*n,l=i.height*n,c=new Uint8Array(u*h*l);if(r){e.bindRenderTarget(r);var d=e.gl;d.readPixels(i.x*n,i.y*n,h,l,d.RGBA,d.UNSIGNED_BYTE,c)}return c},t.prototype.destroy=function(){this.renderer.extract=null,this.renderer=null},t}();r.default=h,s.WebGLRenderer.registerPlugin(\"extract\",h)},{\"../../core\":61}],124:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),u=t(\"../core\"),h=n(u),l=function(t){function e(r){i(this,e);var n=o(this,t.call(this,r[0]instanceof h.Texture?r[0]:r[0].texture));return n._textures=null,n._durations=null,n.textures=r,n.animationSpeed=1,n.loop=!0,n.onComplete=null,n.onFrameChange=null,n._currentTime=0,n.playing=!1,n}return s(e,t),e.prototype.stop=function(){this.playing&&(this.playing=!1,h.ticker.shared.remove(this.update,this))},e.prototype.play=function(){this.playing||(this.playing=!0,h.ticker.shared.add(this.update,this))},e.prototype.gotoAndStop=function(t){this.stop();var e=this.currentFrame;this._currentTime=t,e!==this.currentFrame&&this.updateTexture()},e.prototype.gotoAndPlay=function(t){var e=this.currentFrame;this._currentTime=t,e!==this.currentFrame&&this.updateTexture(),this.play()},e.prototype.update=function(t){var e=this.animationSpeed*t,r=this.currentFrame;if(null!==this._durations){var n=this._currentTime%1*this._durations[this.currentFrame];for(n+=e/60*1e3;n<0;)this._currentTime--,n+=this._durations[this.currentFrame];var i=Math.sign(this.animationSpeed*t);for(this._currentTime=Math.floor(this._currentTime);n>=this._durations[this.currentFrame];)n-=this._durations[this.currentFrame]*i,this._currentTime+=i;this._currentTime+=n/this._durations[this.currentFrame]}else this._currentTime+=e;this._currentTime<0&&!this.loop?(this.gotoAndStop(0),this.onComplete&&this.onComplete()):this._currentTime>=this._textures.length&&!this.loop?(this.gotoAndStop(this._textures.length-1),this.onComplete&&this.onComplete()):r!==this.currentFrame&&this.updateTexture()},e.prototype.updateTexture=function(){this._texture=this._textures[this.currentFrame],this._textureID=-1,this.onFrameChange&&this.onFrameChange(this.currentFrame)},e.prototype.destroy=function(){this.stop(),t.prototype.destroy.call(this)},e.fromFrames=function(t){for(var r=[],n=0;n<t.length;++n)r.push(h.Texture.fromFrame(t[n]));return new e(r)},e.fromImages=function(t){for(var r=[],n=0;n<t.length;++n)r.push(h.Texture.fromImage(t[n]));return new e(r)},a(e,[{key:\"totalFrames\",get:function(){return this._textures.length}},{key:\"textures\",get:function(){return this._textures},set:function(t){if(t[0]instanceof h.Texture)this._textures=t,this._durations=null;else{this._textures=[],this._durations=[];for(var e=0;e<t.length;e++)this._textures.push(t[e].texture),this._durations.push(t[e].time)}}},{key:\"currentFrame\",get:function(){var t=Math.floor(this._currentTime)%this._textures.length;return t<0&&(t+=this._textures.length),t}}]),e}(h.Sprite);r.default=l},{\"../core\":61}],125:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function o(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function s(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function a(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var u=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),h=t(\"../core\"),l=i(h),c=t(\"../core/math/ObservablePoint\"),d=n(c),f=function(t){function e(r){var n=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];o(this,e);var i=s(this,t.call(this));return i.textWidth=0,i.textHeight=0,i._glyphs=[],i._font={tint:void 0!==n.tint?n.tint:16777215,align:n.align||\"left\",name:null,size:0},i.font=n.font,i._text=r,i.maxWidth=0,i.maxLineHeight=0,i._anchor=new d.default(function(){i.dirty=!0},i,0,0),i.dirty=!1,i.updateText(),i}return a(e,t),e.prototype.updateText=function(){for(var t=e.fonts[this._font.name],r=this._font.size/t.size,n=new l.Point,i=[],o=[],s=null,a=0,u=0,h=0,c=-1,d=0,f=0,p=0;p<this.text.length;p++){var v=this.text.charCodeAt(p);if(/(\\s)/.test(this.text.charAt(p))&&(c=p,d=a),/(?:\\r\\n|\\r|\\n)/.test(this.text.charAt(p)))o.push(a),u=Math.max(u,a),h++,n.x=0,n.y+=t.lineHeight,s=null;else if(c!==-1&&this.maxWidth>0&&n.x*r>this.maxWidth)l.utils.removeItems(i,c,p-c),p=c,c=-1,o.push(d),u=Math.max(u,d),h++,n.x=0,n.y+=t.lineHeight,s=null;else{var y=t.chars[v];y&&(s&&y.kerning[s]&&(n.x+=y.kerning[s]),i.push({texture:y.texture,line:h,charCode:v,position:new l.Point(n.x+y.xOffset,n.y+y.yOffset)}),a=n.x+(y.texture.width+y.xOffset),n.x+=y.xAdvance,f=Math.max(f,y.yOffset+y.texture.height),s=v)}}o.push(a),u=Math.max(u,a);for(var g=[],m=0;m<=h;m++){var _=0;\"right\"===this._font.align?_=u-o[m]:\"center\"===this._font.align&&(_=(u-o[m])/2),g.push(_)}for(var b=i.length,x=this.tint,T=0;T<b;T++){var w=this._glyphs[T];w?w.texture=i[T].texture:(w=new l.Sprite(i[T].texture),this._glyphs.push(w)),w.position.x=(i[T].position.x+g[i[T].line])*r,w.position.y=i[T].position.y*r,w.scale.x=w.scale.y=r,w.tint=x,w.parent||this.addChild(w)}for(var E=b;E<this._glyphs.length;++E)this.removeChild(this._glyphs[E]);if(this.textWidth=u*r,this.textHeight=(n.y+t.lineHeight)*r,0!==this.anchor.x||0!==this.anchor.y)for(var O=0;O<b;O++)this._glyphs[O].x-=this.textWidth*this.anchor.x,this._glyphs[O].y-=this.textHeight*this.anchor.y;this.maxLineHeight=f*r},e.prototype.updateTransform=function(){this.validate(),this.containerUpdateTransform()},e.prototype.getLocalBounds=function(){return this.validate(),t.prototype.getLocalBounds.call(this)},e.prototype.validate=function(){this.dirty&&(this.updateText(),this.dirty=!1)},u(e,[{key:\"tint\",get:function(){return this._font.tint},set:function(t){this._font.tint=\"number\"==typeof t&&t>=0?t:16777215,this.dirty=!0}},{key:\"align\",get:function(){return this._font.align},set:function(t){this._font.align=t||\"left\",this.dirty=!0}},{key:\"anchor\",get:function(){return this._anchor},set:function(t){\"number\"==typeof t?this._anchor.set(t):this._anchor.copy(t)}},{key:\"font\",get:function(){return this._font},set:function(t){t&&(\"string\"==typeof t?(t=t.split(\" \"),this._font.name=1===t.length?t[0]:t.slice(1).join(\" \"),this._font.size=t.length>=2?parseInt(t[0],10):e.fonts[this._font.name].size):(this._font.name=t.name,this._font.size=\"number\"==typeof t.size?t.size:parseInt(t.size,10)),this.dirty=!0)}},{key:\"text\",get:function(){return this._text},set:function(t){t=t.toString()||\" \",this._text!==t&&(this._text=t,this.dirty=!0)}}]),e}(l.Container);r.default=f,f.fonts={}},{\"../core\":61,\"../core/math/ObservablePoint\":64}],126:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var o=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),s=t(\"../core/math/Matrix\"),a=n(s),u=new a.default,h=function(){function t(e,r){i(this,t),this._texture=e,this.mapCoord=new a.default,this.uClampFrame=new Float32Array(4),this.uClampOffset=new Float32Array(2),this._lastTextureID=-1,this.clampOffset=0,this.clampMargin=\"undefined\"==typeof r?.5:r}return t.prototype.update=function(t){var e=this.texture;if(e&&e.valid&&(t||this._lastTextureID!==this.texture._updateID)){this._lastTextureID=this.texture._updateID;var r=this.texture._uvs;this.mapCoord.set(r.x1-r.x0,r.y1-r.y0,r.x3-r.x0,r.y3-r.y0,r.x0,r.y0);var n=e.orig,i=e.trim;i&&(u.set(n.width/i.width,0,0,n.height/i.height,-i.x/i.width,-i.y/i.height),this.mapCoord.append(u));var o=e.baseTexture,s=this.uClampFrame,a=this.clampMargin/o.resolution,h=this.clampOffset;s[0]=(e._frame.x+a+h)/o.width,s[1]=(e._frame.y+a+h)/o.height,s[2]=(e._frame.x+e._frame.width-a+h)/o.width,s[3]=(e._frame.y+e._frame.height-a+h)/o.height,this.uClampOffset[0]=h/o.realWidth,this.uClampOffset[1]=h/o.realHeight}},o(t,[{key:\"texture\",get:function(){return this._texture},set:function(t){this._texture=t,this._lastTextureID=-1}}]),t}();r.default=h},{\"../core/math/Matrix\":63}],127:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function o(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function s(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function a(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var u=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),h=t(\"../core\"),l=i(h),c=t(\"../core/sprites/canvas/CanvasTinter\"),d=n(c),f=t(\"./TextureTransform\"),p=n(f),v=new l.Point,y=function(t){function e(r){var n=arguments.length<=1||void 0===arguments[1]?100:arguments[1],i=arguments.length<=2||void 0===arguments[2]?100:arguments[2];o(this,e);var a=s(this,t.call(this,r));return a.tileTransform=new l.TransformStatic,a._width=n,a._height=i,a._canvasPattern=null,a.uvTransform=r.transform||new p.default(r),a}return a(e,t),e.prototype._onTextureUpdate=function(){this.uvTransform&&(this.uvTransform.texture=this._texture)},e.prototype._renderWebGL=function(t){var e=this._texture;e&&e.valid&&(this.tileTransform.updateLocalTransform(),this.uvTransform.update(),t.setObjectRenderer(t.plugins.tilingSprite),t.plugins.tilingSprite.render(this))},e.prototype._renderCanvas=function(t){var e=this._texture;if(e.baseTexture.hasLoaded){var r=t.context,n=this.worldTransform,i=t.resolution,o=e.baseTexture,s=e.baseTexture.resolution,a=this.tilePosition.x/this.tileScale.x%e._frame.width,u=this.tilePosition.y/this.tileScale.y%e._frame.height;if(!this._canvasPattern){var h=new l.CanvasRenderTarget(e._frame.width,e._frame.height,s);16777215!==this.tint?(this.cachedTint!==this.tint&&(this.cachedTint=this.tint,this.tintedTexture=d.default.getTintedTexture(this,this.tint)),h.context.drawImage(this.tintedTexture,0,0)):h.context.drawImage(o.source,-e._frame.x,-e._frame.y),this._canvasPattern=h.context.createPattern(h.canvas,\"repeat\")}r.globalAlpha=this.worldAlpha,r.setTransform(n.a*i,n.b*i,n.c*i,n.d*i,n.tx*i,n.ty*i),r.scale(this.tileScale.x/s,this.tileScale.y/s),r.translate(a+this.anchor.x*-this._width,u+this.anchor.y*-this._height),t.setBlendMode(this.blendMode),r.fillStyle=this._canvasPattern,r.fillRect(-a,-u,this._width/this.tileScale.x*s,this._height/this.tileScale.y*s)}},e.prototype._calculateBounds=function(){var t=this._width*-this._anchor._x,e=this._height*-this._anchor._y,r=this._width*(1-this._anchor._x),n=this._height*(1-this._anchor._y);this._bounds.addFrame(this.transform,t,e,r,n)},e.prototype.getLocalBounds=function(e){return 0===this.children.length?(this._bounds.minX=this._width*-this._anchor._x,this._bounds.minY=this._height*-this._anchor._y,this._bounds.maxX=this._width*(1-this._anchor._x),this._bounds.maxY=this._height*(1-this._anchor._x),e||(this._localBoundsRect||(this._localBoundsRect=new l.Rectangle),e=this._localBoundsRect),this._bounds.getRectangle(e)):t.prototype.getLocalBounds.call(this,e)},e.prototype.containsPoint=function(t){this.worldTransform.applyInverse(t,v);var e=this._width,r=this._height,n=-e*this.anchor._x;if(v.x>n&&v.x<n+e){var i=-r*this.anchor._y;if(v.y>i&&v.y<i+r)return!0}return!1},e.prototype.destroy=function(){t.prototype.destroy.call(this),this.tileTransform=null,this.uvTransform=null},e.from=function(t,r,n){return new e(l.Texture.from(t),r,n)},e.fromFrame=function(t,r,n){var i=l.utils.TextureCache[t];if(!i)throw new Error('The frameId \"'+t+'\" does not exist in the texture cache '+this);return new e(i,r,n)},e.fromImage=function(t,r,n,i,o){return new e(l.Texture.fromImage(t,i,o),r,n)},u(e,[{key:\"clampMargin\",get:function(){return this.uvTransform.clampMargin},set:function(t){this.uvTransform.clampMargin=t,this.uvTransform.update(!0)}},{key:\"tileScale\",get:function(){return this.tileTransform.scale},set:function(t){this.tileTransform.scale.copy(t)}},{key:\"tilePosition\",get:function(){return this.tileTransform.position},set:function(t){this.tileTransform.position.copy(t)}},{key:\"width\",get:function(){return this._width},set:function(t){this._width=t}},{key:\"height\",get:function(){return this._height},set:function(t){this._height=t}}]),e}(l.Sprite);r.default=y},{\"../core\":61,\"../core/sprites/canvas/CanvasTinter\":100,\"./TextureTransform\":126}],128:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}var o=t(\"../core\"),s=n(o),a=s.DisplayObject,u=new s.Matrix;a.prototype._cacheAsBitmap=!1,a.prototype._cacheData=!1;var h=function t(){i(this,t),this.originalRenderWebGL=null,this.originalRenderCanvas=null,this.originalCalculateBounds=null,this.originalGetLocalBounds=null,this.originalUpdateTransform=null,this.originalHitTest=null,this.originalDestroy=null,this.originalMask=null,this.originalFilterArea=null,this.sprite=null};Object.defineProperties(a.prototype,{cacheAsBitmap:{get:function(){return this._cacheAsBitmap},set:function(t){if(this._cacheAsBitmap!==t){this._cacheAsBitmap=t;var e=void 0;t?(this._cacheData||(this._cacheData=new h),e=this._cacheData,e.originalRenderWebGL=this.renderWebGL,e.originalRenderCanvas=this.renderCanvas,e.originalUpdateTransform=this.updateTransform,e.originalCalculateBounds=this._calculateBounds,e.originalGetLocalBounds=this.getLocalBounds,e.originalDestroy=this.destroy,e.originalContainsPoint=this.containsPoint,e.originalMask=this._mask,e.originalFilterArea=this.filterArea,this.renderWebGL=this._renderCachedWebGL,this.renderCanvas=this._renderCachedCanvas,this.destroy=this._cacheAsBitmapDestroy):(e=this._cacheData,e.sprite&&this._destroyCachedDisplayObject(),this.renderWebGL=e.originalRenderWebGL,this.renderCanvas=e.originalRenderCanvas,this._calculateBounds=e.originalCalculateBounds,this.getLocalBounds=e.originalGetLocalBounds,this.destroy=e.originalDestroy,this.updateTransform=e.originalUpdateTransform,this.containsPoint=e.originalContainsPoint,this._mask=e.originalMask,this.filterArea=e.originalFilterArea)}}}}),a.prototype._renderCachedWebGL=function(t){!this.visible||this.worldAlpha<=0||!this.renderable||(this._initCachedDisplayObject(t),this._cacheData.sprite._transformID=-1,this._cacheData.sprite.worldAlpha=this.worldAlpha,this._cacheData.sprite._renderWebGL(t))},a.prototype._initCachedDisplayObject=function(t){if(!this._cacheData||!this._cacheData.sprite){var e=this.alpha;this.alpha=1,t.currentRenderer.flush();var r=this.getLocalBounds().clone();if(this._filters){var n=this._filters[0].padding;r.pad(n)}var i=t._activeRenderTarget,o=t.filterManager.filterStack,a=s.RenderTexture.create(0|r.width,0|r.height),h=u;h.tx=-r.x,h.ty=-r.y,this.transform.worldTransform.identity(),this.renderWebGL=this._cacheData.originalRenderWebGL,t.render(this,a,!0,h,!0),t.bindRenderTarget(i),t.filterManager.filterStack=o,this.renderWebGL=this._renderCachedWebGL,this.updateTransform=this.displayObjectUpdateTransform,this._mask=null,this.filterArea=null;var l=new s.Sprite(a);l.transform.worldTransform=this.transform.worldTransform,l.anchor.x=-(r.x/r.width),l.anchor.y=-(r.y/r.height),l.alpha=e,l._bounds=this._bounds,this._calculateBounds=this._calculateCachedBounds,this.getLocalBounds=this._getCachedLocalBounds,this._cacheData.sprite=l,this.transform._parentID=-1,this.updateTransform(),this.containsPoint=l.containsPoint.bind(l)}},a.prototype._renderCachedCanvas=function(t){!this.visible||this.worldAlpha<=0||!this.renderable||(this._initCachedDisplayObjectCanvas(t),this._cacheData.sprite.worldAlpha=this.worldAlpha,this._cacheData.sprite.renderCanvas(t))},a.prototype._initCachedDisplayObjectCanvas=function(t){if(!this._cacheData||!this._cacheData.sprite){var e=this.getLocalBounds(),r=this.alpha;this.alpha=1;var n=t.context,i=s.RenderTexture.create(0|e.width,0|e.height),o=u;this.transform.worldTransform.copy(o),o.invert(),o.tx-=e.x,o.ty-=e.y,this.renderCanvas=this._cacheData.originalRenderCanvas,t.render(this,i,!0,o,!1),t.context=n,this.renderCanvas=this._renderCachedCanvas,this._calculateBounds=this._calculateCachedBounds,this._mask=null,this.filterArea=null;var a=new s.Sprite(i);a.transform.worldTransform=this.transform.worldTransform,a.anchor.x=-(e.x/e.width),a.anchor.y=-(e.y/e.height),a._bounds=this._bounds,a.alpha=r,this.updateTransform(),this.updateTransform=this.displayObjectUpdateTransform,this._cacheData.sprite=a,this.containsPoint=a.containsPoint.bind(a)}},a.prototype._calculateCachedBounds=function(){this._cacheData.sprite._calculateBounds()},a.prototype._getCachedLocalBounds=function(){return this._cacheData.sprite.getLocalBounds()},a.prototype._destroyCachedDisplayObject=function(){this._cacheData.sprite._texture.destroy(!0),this._cacheData.sprite=null},a.prototype._cacheAsBitmapDestroy=function(){this.cacheAsBitmap=!1,this.destroy()}},{\"../core\":61}],129:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}var i=t(\"../core\"),o=n(i);o.DisplayObject.prototype.name=null,o.Container.prototype.getChildByName=function(t){for(var e=0;e<this.children.length;e++)if(this.children[e].name===t)return this.children[e];return null}},{\"../core\":61}],130:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}var i=t(\"../core\"),o=n(i);o.DisplayObject.prototype.getGlobalPosition=function(){var t=arguments.length<=0||void 0===arguments[0]?new o.Point:arguments[0],e=!(arguments.length<=1||void 0===arguments[1])&&arguments[1];return this.parent?this.parent.toGlobal(this.position,t,e):(t.x=this.position.x,t.y=this.position.y),t}},{\"../core\":61}],131:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}r.__esModule=!0,r.BitmapText=r.TilingSpriteRenderer=r.TilingSprite=r.AnimatedSprite=r.TextureTransform=void 0;var i=t(\"./TextureTransform\");Object.defineProperty(r,\"TextureTransform\",{enumerable:!0,get:function(){return n(i).default}});var o=t(\"./AnimatedSprite\");Object.defineProperty(r,\"AnimatedSprite\",{enumerable:!0,get:function(){return n(o).default}});var s=t(\"./TilingSprite\");Object.defineProperty(r,\"TilingSprite\",{enumerable:!0,get:function(){return n(s).default}});var a=t(\"./webgl/TilingSpriteRenderer\");Object.defineProperty(r,\"TilingSpriteRenderer\",{enumerable:!0,get:function(){return n(a).default}});var u=t(\"./BitmapText\");Object.defineProperty(r,\"BitmapText\",{enumerable:!0,get:function(){return n(u).default}}),t(\"./cacheAsBitmap\"),t(\"./getChildByName\"),t(\"./getGlobalPosition\")},{\"./AnimatedSprite\":124,\"./BitmapText\":125,\"./TextureTransform\":126,\"./TilingSprite\":127,\"./cacheAsBitmap\":128,\"./getChildByName\":129,\"./getGlobalPosition\":130,\"./webgl/TilingSpriteRenderer\":132}],132:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=t(\"../../core\"),u=n(a),h=t(\"../../core/const\"),l=(t(\"path\"),new u.Matrix),c=new Float32Array(4),d=function(t){function e(r){i(this,e);var n=o(this,t.call(this,r));return n.shader=null,n.simpleShader=null,n.quad=null,n}return s(e,t),e.prototype.onContextChange=function(){var t=this.renderer.gl;this.shader=new u.Shader(t,\"attribute vec2 aVertexPosition;\\nattribute vec2 aTextureCoord;\\n\\nuniform mat3 projectionMatrix;\\nuniform mat3 translationMatrix;\\nuniform mat3 uTransform;\\n\\nvarying vec2 vTextureCoord;\\n\\nvoid main(void)\\n{\\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\\n\\n    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;\\n}\\n\",\"varying vec2 vTextureCoord;\\n\\nuniform sampler2D uSampler;\\nuniform vec4 uColor;\\nuniform mat3 uMapCoord;\\nuniform vec4 uClampFrame;\\nuniform vec2 uClampOffset;\\n\\nvoid main(void)\\n{\\n    vec2 coord = mod(vTextureCoord - uClampOffset, vec2(1.0, 1.0)) + uClampOffset;\\n    coord = (uMapCoord * vec3(coord, 1.0)).xy;\\n    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);\\n\\n    vec4 sample = texture2D(uSampler, coord);\\n    vec4 color = vec4(uColor.rgb * uColor.a, uColor.a);\\n\\n    gl_FragColor = sample * color ;\\n}\\n\"),this.simpleShader=new u.Shader(t,\"attribute vec2 aVertexPosition;\\nattribute vec2 aTextureCoord;\\n\\nuniform mat3 projectionMatrix;\\nuniform mat3 translationMatrix;\\nuniform mat3 uTransform;\\n\\nvarying vec2 vTextureCoord;\\n\\nvoid main(void)\\n{\\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\\n\\n    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;\\n}\\n\",\"varying vec2 vTextureCoord;\\n\\nuniform sampler2D uSampler;\\nuniform vec4 uColor;\\n\\nvoid main(void)\\n{\\n    vec4 sample = texture2D(uSampler, vTextureCoord);\\n    vec4 color = vec4(uColor.rgb * uColor.a, uColor.a);\\n    gl_FragColor = sample * color;\\n}\\n\"),\r\nthis.renderer.bindVao(null),this.quad=new u.Quad(t,this.renderer.state.attribState),this.quad.initVao(this.shader)},e.prototype.render=function(t){var e=this.renderer,r=this.quad;e.bindVao(r.vao);var n=r.vertices;n[0]=n[6]=t._width*-t.anchor.x,n[1]=n[3]=t._height*-t.anchor.y,n[2]=n[4]=t._width*(1-t.anchor.x),n[5]=n[7]=t._height*(1-t.anchor.y),n=r.uvs,n[0]=n[6]=-t.anchor.x,n[1]=n[3]=-t.anchor.y,n[2]=n[4]=1-t.anchor.x,n[5]=n[7]=1-t.anchor.y,r.upload();var i=t._texture,o=i.baseTexture,s=t.tileTransform.localTransform,a=t.uvTransform,d=o.isPowerOfTwo&&i.frame.width===o.width&&i.frame.height===o.height;d&&(o._glTextures[e.CONTEXT_UID]?d=o.wrapMode!==h.WRAP_MODES.CLAMP:o.wrapMode===h.WRAP_MODES.CLAMP&&(o.wrapMode=h.WRAP_MODES.REPEAT));var f=d?this.simpleShader:this.shader;e.bindShader(f);var p=i.width,v=i.height,y=t._width,g=t._height;l.set(s.a*p/y,s.b*p/g,s.c*v/y,s.d*v/g,s.tx/y,s.ty/g),l.invert(),d?l.append(a.mapCoord):(f.uniforms.uMapCoord=a.mapCoord.toArray(!0),f.uniforms.uClampFrame=a.uClampFrame,f.uniforms.uClampOffset=a.uClampOffset),f.uniforms.uTransform=l.toArray(!0);var m=c;u.utils.hex2rgb(t.tint,m),m[3]=t.worldAlpha,f.uniforms.uColor=m,f.uniforms.translationMatrix=t.transform.worldTransform.toArray(!0),f.uniforms.uSampler=e.bindTexture(i),e.setBlendMode(t.blendMode),r.vao.draw(this.renderer.gl.TRIANGLES,6,0)},e}(u.ObjectRenderer);r.default=d,u.WebGLRenderer.registerPlugin(\"tilingSprite\",d)},{\"../../core\":61,\"../../core/const\":42,path:22}],133:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function o(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function s(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function a(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var u=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),h=t(\"../../core\"),l=i(h),c=t(\"./BlurXFilter\"),d=n(c),f=t(\"./BlurYFilter\"),p=n(f),v=function(t){function e(r,n,i){o(this,e);var a=s(this,t.call(this));return a.blurXFilter=new d.default,a.blurYFilter=new p.default,a.resolution=1,a.padding=0,a.resolution=i||1,a.quality=n||4,a.blur=r||8,a}return a(e,t),e.prototype.apply=function(t,e,r){var n=t.getRenderTarget(!0);this.blurXFilter.apply(t,e,n,!0),this.blurYFilter.apply(t,n,r,!1),t.returnRenderTarget(n)},u(e,[{key:\"blur\",get:function(){return this.blurXFilter.blur},set:function(t){this.blurXFilter.blur=this.blurYFilter.blur=t,this.padding=2*Math.max(Math.abs(this.blurXFilter.strength),Math.abs(this.blurYFilter.strength))}},{key:\"quality\",get:function(){return this.blurXFilter.quality},set:function(t){this.blurXFilter.quality=this.blurYFilter.quality=t}},{key:\"blurX\",get:function(){return this.blurXFilter.blur},set:function(t){this.blurXFilter.blur=t,this.padding=2*Math.max(Math.abs(this.blurXFilter.strength),Math.abs(this.blurYFilter.strength))}},{key:\"blurY\",get:function(){return this.blurYFilter.blur},set:function(t){this.blurYFilter.blur=t,this.padding=2*Math.max(Math.abs(this.blurXFilter.strength),Math.abs(this.blurYFilter.strength))}}]),e}(l.Filter);r.default=v},{\"../../core\":61,\"./BlurXFilter\":134,\"./BlurYFilter\":135}],134:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function o(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function s(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function a(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var u=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),h=t(\"../../core\"),l=i(h),c=t(\"./generateBlurVertSource\"),d=n(c),f=t(\"./generateBlurFragSource\"),p=n(f),v=t(\"./getMaxBlurKernelSize\"),y=n(v),g=function(t){function e(r,n,i){o(this,e);var a=(0,d.default)(5,!0),u=(0,p.default)(5),h=s(this,t.call(this,a,u));return h.resolution=i||1,h._quality=0,h.quality=n||4,h.strength=r||8,h.firstRun=!0,h}return a(e,t),e.prototype.apply=function(t,e,r,n){if(this.firstRun){var i=t.renderer.gl,o=(0,y.default)(i);this.vertexSrc=(0,d.default)(o,!0),this.fragmentSrc=(0,p.default)(o),this.firstRun=!1}if(this.uniforms.strength=1/r.size.width*(r.size.width/e.size.width),this.uniforms.strength*=this.strength,this.uniforms.strength/=this.passes,1===this.passes)t.applyFilter(this,e,r,n);else{for(var s=t.getRenderTarget(!0),a=e,u=s,h=0;h<this.passes-1;h++){t.applyFilter(this,a,u,!0);var l=u;u=a,a=l}t.applyFilter(this,a,r,n),t.returnRenderTarget(s)}},u(e,[{key:\"blur\",get:function(){return this.strength},set:function(t){this.padding=2*Math.abs(t),this.strength=t}},{key:\"quality\",get:function(){return this._quality},set:function(t){this._quality=t,this.passes=t}}]),e}(l.Filter);r.default=g},{\"../../core\":61,\"./generateBlurFragSource\":136,\"./generateBlurVertSource\":137,\"./getMaxBlurKernelSize\":138}],135:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function o(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function s(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function a(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var u=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),h=t(\"../../core\"),l=i(h),c=t(\"./generateBlurVertSource\"),d=n(c),f=t(\"./generateBlurFragSource\"),p=n(f),v=t(\"./getMaxBlurKernelSize\"),y=n(v),g=function(t){function e(r,n,i){o(this,e);var a=(0,d.default)(5,!1),u=(0,p.default)(5),h=s(this,t.call(this,a,u));return h.resolution=i||1,h._quality=0,h.quality=n||4,h.strength=r||8,h.firstRun=!0,h}return a(e,t),e.prototype.apply=function(t,e,r,n){if(this.firstRun){var i=t.renderer.gl,o=(0,y.default)(i);this.vertexSrc=(0,d.default)(o,!1),this.fragmentSrc=(0,p.default)(o),this.firstRun=!1}if(this.uniforms.strength=1/r.size.height*(r.size.height/e.size.height),this.uniforms.strength*=this.strength,this.uniforms.strength/=this.passes,1===this.passes)t.applyFilter(this,e,r,n);else{for(var s=t.getRenderTarget(!0),a=e,u=s,h=0;h<this.passes-1;h++){t.applyFilter(this,a,u,!0);var l=u;u=a,a=l}t.applyFilter(this,a,r,n),t.returnRenderTarget(s)}},u(e,[{key:\"blur\",get:function(){return this.strength},set:function(t){this.padding=2*Math.abs(t),this.strength=t}},{key:\"quality\",get:function(){return this._quality},set:function(t){this._quality=t,this.passes=t}}]),e}(l.Filter);r.default=g},{\"../../core\":61,\"./generateBlurFragSource\":136,\"./generateBlurVertSource\":137,\"./getMaxBlurKernelSize\":138}],136:[function(t,e,r){\"use strict\";function n(t){for(var e=i[t],r=e.length,n=o,s=\"\",a=\"gl_FragColor += texture2D(uSampler, vBlurTexCoords[%index%]) * %value%;\",u=void 0,h=0;h<t;h++){var l=a.replace(\"%index%\",h);u=h,h>=r&&(u=t-h-1),l=l.replace(\"%value%\",e[u]),s+=l,s+=\"\\n\"}return n=n.replace(\"%blur%\",s),n=n.replace(\"%size%\",t)}r.__esModule=!0,r.default=n;var i={5:[.153388,.221461,.250301],7:[.071303,.131514,.189879,.214607],9:[.028532,.067234,.124009,.179044,.20236],11:[.0093,.028002,.065984,.121703,.175713,.198596],13:[.002406,.009255,.027867,.065666,.121117,.174868,.197641],15:[489e-6,.002403,.009246,.02784,.065602,.120999,.174697,.197448]},o=[\"varying vec2 vBlurTexCoords[%size%];\",\"uniform sampler2D uSampler;\",\"void main(void)\",\"{\",\"    gl_FragColor = vec4(0.0);\",\"    %blur%\",\"}\"].join(\"\\n\")},{}],137:[function(t,e,r){\"use strict\";function n(t,e){var r=Math.ceil(t/2),n=i,o=\"\",s=void 0;s=e?\"vBlurTexCoords[%index%] = aTextureCoord + vec2(%sampleIndex% * strength, 0.0);\":\"vBlurTexCoords[%index%] = aTextureCoord + vec2(0.0, %sampleIndex% * strength);\";for(var a=0;a<t;a++){var u=s.replace(\"%index%\",a);u=u.replace(\"%sampleIndex%\",a-(r-1)+\".0\"),o+=u,o+=\"\\n\"}return n=n.replace(\"%blur%\",o),n=n.replace(\"%size%\",t)}r.__esModule=!0,r.default=n;var i=[\"attribute vec2 aVertexPosition;\",\"attribute vec2 aTextureCoord;\",\"uniform float strength;\",\"uniform mat3 projectionMatrix;\",\"varying vec2 vBlurTexCoords[%size%];\",\"void main(void)\",\"{\",\"gl_Position = vec4((projectionMatrix * vec3((aVertexPosition), 1.0)).xy, 0.0, 1.0);\",\"%blur%\",\"}\"].join(\"\\n\")},{}],138:[function(t,e,r){\"use strict\";function n(t){for(var e=t.getParameter(t.MAX_VARYING_VECTORS),r=15;r>e;)r-=2;return r}r.__esModule=!0,r.default=n},{}],139:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),u=t(\"../../core\"),h=n(u),l=(t(\"path\"),function(t){function e(){i(this,e);var r=o(this,t.call(this,\"attribute vec2 aVertexPosition;\\nattribute vec2 aTextureCoord;\\n\\nuniform mat3 projectionMatrix;\\n\\nvarying vec2 vTextureCoord;\\n\\nvoid main(void)\\n{\\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\\n    vTextureCoord = aTextureCoord;\\n}\",\"varying vec2 vTextureCoord;\\nuniform sampler2D uSampler;\\nuniform float m[20];\\n\\nvoid main(void)\\n{\\n\\n    vec4 c = texture2D(uSampler, vTextureCoord);\\n\\n    gl_FragColor.r = (m[0] * c.r);\\n        gl_FragColor.r += (m[1] * c.g);\\n        gl_FragColor.r += (m[2] * c.b);\\n        gl_FragColor.r += (m[3] * c.a);\\n        gl_FragColor.r += m[4] * c.a;\\n\\n    gl_FragColor.g = (m[5] * c.r);\\n        gl_FragColor.g += (m[6] * c.g);\\n        gl_FragColor.g += (m[7] * c.b);\\n        gl_FragColor.g += (m[8] * c.a);\\n        gl_FragColor.g += m[9] * c.a;\\n\\n     gl_FragColor.b = (m[10] * c.r);\\n        gl_FragColor.b += (m[11] * c.g);\\n        gl_FragColor.b += (m[12] * c.b);\\n        gl_FragColor.b += (m[13] * c.a);\\n        gl_FragColor.b += m[14] * c.a;\\n\\n     gl_FragColor.a = (m[15] * c.r);\\n        gl_FragColor.a += (m[16] * c.g);\\n        gl_FragColor.a += (m[17] * c.b);\\n        gl_FragColor.a += (m[18] * c.a);\\n        gl_FragColor.a += m[19] * c.a;\\n\\n//    gl_FragColor = vec4(m[0]);\\n}\\n\"));return r.uniforms.m=[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0],r}return s(e,t),e.prototype._loadMatrix=function(t){var e=!(arguments.length<=1||void 0===arguments[1])&&arguments[1],r=t;e&&(this._multiply(r,this.uniforms.m,t),r=this._colorMatrix(r)),this.uniforms.m=r},e.prototype._multiply=function(t,e,r){return t[0]=e[0]*r[0]+e[1]*r[5]+e[2]*r[10]+e[3]*r[15],t[1]=e[0]*r[1]+e[1]*r[6]+e[2]*r[11]+e[3]*r[16],t[2]=e[0]*r[2]+e[1]*r[7]+e[2]*r[12]+e[3]*r[17],t[3]=e[0]*r[3]+e[1]*r[8]+e[2]*r[13]+e[3]*r[18],t[4]=e[0]*r[4]+e[1]*r[9]+e[2]*r[14]+e[3]*r[19],t[5]=e[5]*r[0]+e[6]*r[5]+e[7]*r[10]+e[8]*r[15],t[6]=e[5]*r[1]+e[6]*r[6]+e[7]*r[11]+e[8]*r[16],t[7]=e[5]*r[2]+e[6]*r[7]+e[7]*r[12]+e[8]*r[17],t[8]=e[5]*r[3]+e[6]*r[8]+e[7]*r[13]+e[8]*r[18],t[9]=e[5]*r[4]+e[6]*r[9]+e[7]*r[14]+e[8]*r[19],t[10]=e[10]*r[0]+e[11]*r[5]+e[12]*r[10]+e[13]*r[15],t[11]=e[10]*r[1]+e[11]*r[6]+e[12]*r[11]+e[13]*r[16],t[12]=e[10]*r[2]+e[11]*r[7]+e[12]*r[12]+e[13]*r[17],t[13]=e[10]*r[3]+e[11]*r[8]+e[12]*r[13]+e[13]*r[18],t[14]=e[10]*r[4]+e[11]*r[9]+e[12]*r[14]+e[13]*r[19],t[15]=e[15]*r[0]+e[16]*r[5]+e[17]*r[10]+e[18]*r[15],t[16]=e[15]*r[1]+e[16]*r[6]+e[17]*r[11]+e[18]*r[16],t[17]=e[15]*r[2]+e[16]*r[7]+e[17]*r[12]+e[18]*r[17],t[18]=e[15]*r[3]+e[16]*r[8]+e[17]*r[13]+e[18]*r[18],t[19]=e[15]*r[4]+e[16]*r[9]+e[17]*r[14]+e[18]*r[19],t},e.prototype._colorMatrix=function(t){var e=new Float32Array(t);return e[4]/=255,e[9]/=255,e[14]/=255,e[19]/=255,e},e.prototype.brightness=function(t,e){var r=[t,0,0,0,0,0,t,0,0,0,0,0,t,0,0,0,0,0,1,0];this._loadMatrix(r,e)},e.prototype.greyscale=function(t,e){var r=[t,t,t,0,0,t,t,t,0,0,t,t,t,0,0,0,0,0,1,0];this._loadMatrix(r,e)},e.prototype.blackAndWhite=function(t){var e=[.3,.6,.1,0,0,.3,.6,.1,0,0,.3,.6,.1,0,0,0,0,0,1,0];this._loadMatrix(e,t)},e.prototype.hue=function(t,e){t=(t||0)/180*Math.PI;var r=Math.cos(t),n=Math.sin(t),i=Math.sqrt,o=1/3,s=i(o),a=r+(1-r)*o,u=o*(1-r)-s*n,h=o*(1-r)+s*n,l=o*(1-r)+s*n,c=r+o*(1-r),d=o*(1-r)-s*n,f=o*(1-r)-s*n,p=o*(1-r)+s*n,v=r+o*(1-r),y=[a,u,h,0,0,l,c,d,0,0,f,p,v,0,0,0,0,0,1,0];this._loadMatrix(y,e)},e.prototype.contrast=function(t,e){var r=(t||0)+1,n=-128*(r-1),i=[r,0,0,0,n,0,r,0,0,n,0,0,r,0,n,0,0,0,1,0];this._loadMatrix(i,e)},e.prototype.saturate=function(){var t=arguments.length<=0||void 0===arguments[0]?0:arguments[0],e=arguments[1],r=2*t/3+1,n=(r-1)*-.5,i=[r,n,n,0,0,n,r,n,0,0,n,n,r,0,0,0,0,0,1,0];this._loadMatrix(i,e)},e.prototype.desaturate=function(){this.saturate(-1)},e.prototype.negative=function(t){var e=[0,1,1,0,0,1,0,1,0,0,1,1,0,0,0,0,0,0,1,0];this._loadMatrix(e,t)},e.prototype.sepia=function(t){var e=[.393,.7689999,.18899999,0,0,.349,.6859999,.16799999,0,0,.272,.5339999,.13099999,0,0,0,0,0,1,0];this._loadMatrix(e,t)},e.prototype.technicolor=function(t){var e=[1.9125277891456083,-.8545344976951645,-.09155508482755585,0,11.793603434377337,-.3087833385928097,1.7658908555458428,-.10601743074722245,0,-70.35205161461398,-.231103377548616,-.7501899197440212,1.847597816108189,0,30.950940869491138,0,0,0,1,0];this._loadMatrix(e,t)},e.prototype.polaroid=function(t){var e=[1.438,-.062,-.062,0,0,-.122,1.378,-.122,0,0,-.016,-.016,1.483,0,0,0,0,0,1,0];this._loadMatrix(e,t)},e.prototype.toBGR=function(t){var e=[0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0];this._loadMatrix(e,t)},e.prototype.kodachrome=function(t){var e=[1.1285582396593525,-.3967382283601348,-.03992559172921793,0,63.72958762196502,-.16404339962244616,1.0835251566291304,-.05498805115633132,0,24.732407896706203,-.16786010706155763,-.5603416277695248,1.6014850761964943,0,35.62982807460946,0,0,0,1,0];this._loadMatrix(e,t)},e.prototype.browni=function(t){var e=[.5997023498159715,.34553243048391263,-.2708298674538042,0,47.43192855600873,-.037703249837783157,.8609577587992641,.15059552388459913,0,-36.96841498319127,.24113635128153335,-.07441037908422492,.44972182064877153,0,-7.562075277591283,0,0,0,1,0];this._loadMatrix(e,t)},e.prototype.vintage=function(t){var e=[.6279345635605994,.3202183420819367,-.03965408211312453,0,9.651285835294123,.02578397704808868,.6441188644374771,.03259127616149294,0,7.462829176470591,.0466055556782719,-.0851232987247891,.5241648018700465,0,5.159190588235296,0,0,0,1,0];this._loadMatrix(e,t)},e.prototype.colorTone=function(t,e,r,n,i){t=t||.2,e=e||.15,r=r||16770432,n=n||3375104;var o=(r>>16&255)/255,s=(r>>8&255)/255,a=(255&r)/255,u=(n>>16&255)/255,h=(n>>8&255)/255,l=(255&n)/255,c=[.3,.59,.11,0,0,o,s,a,t,0,u,h,l,e,0,o-u,s-h,a-l,0,0];this._loadMatrix(c,i)},e.prototype.night=function(t,e){t=t||.1;var r=[t*-2,-t,0,0,0,-t,0,t,0,0,0,t,2*t,0,0,0,0,0,1,0];this._loadMatrix(r,e)},e.prototype.predator=function(t,e){var r=[11.224130630493164*t,-4.794486999511719*t,-2.8746118545532227*t,0*t,.40342438220977783*t,-3.6330697536468506*t,9.193157196044922*t,-2.951810836791992*t,0*t,-1.316135048866272*t,-3.2184197902679443*t,-4.2375030517578125*t,7.476448059082031*t,0*t,.8044459223747253*t,0,0,0,1,0];this._loadMatrix(r,e)},e.prototype.lsd=function(t){var e=[2,-.4,.5,0,0,-.5,2,-.4,0,0,-.4,-.5,3,0,0,0,0,0,1,0];this._loadMatrix(e,t)},e.prototype.reset=function(){var t=[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0];this._loadMatrix(t,!1)},a(e,[{key:\"matrix\",get:function(){return this.uniforms.m},set:function(t){this.uniforms.m=t}}]),e}(h.Filter));r.default=l,l.prototype.grayscale=l.prototype.greyscale},{\"../../core\":61,path:22}],140:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),u=t(\"../../core\"),h=n(u),l=(t(\"path\"),function(t){function e(r,n){i(this,e);var s=new h.Matrix;r.renderable=!1;var a=o(this,t.call(this,\"attribute vec2 aVertexPosition;\\nattribute vec2 aTextureCoord;\\n\\nuniform mat3 projectionMatrix;\\nuniform mat3 filterMatrix;\\n\\nvarying vec2 vTextureCoord;\\nvarying vec2 vFilterCoord;\\n\\nvoid main(void)\\n{\\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\\n   vFilterCoord = ( filterMatrix * vec3( aTextureCoord, 1.0)  ).xy;\\n   vTextureCoord = aTextureCoord;\\n}\",\"varying vec2 vFilterCoord;\\nvarying vec2 vTextureCoord;\\n\\nuniform vec2 scale;\\n\\nuniform sampler2D uSampler;\\nuniform sampler2D mapSampler;\\n\\nuniform vec4 filterClamp;\\n\\nvoid main(void)\\n{\\n   vec4 map =  texture2D(mapSampler, vFilterCoord);\\n\\n   map -= 0.5;\\n   map.xy *= scale;\\n\\n   gl_FragColor = texture2D(uSampler, clamp(vec2(vTextureCoord.x + map.x, vTextureCoord.y + map.y), filterClamp.xy, filterClamp.zw));\\n}\\n\"));return a.maskSprite=r,a.maskMatrix=s,a.uniforms.mapSampler=r.texture,a.uniforms.filterMatrix=s.toArray(!0),a.uniforms.scale={x:1,y:1},null!==n&&void 0!==n||(n=20),a.scale=new h.Point(n,n),a}return s(e,t),e.prototype.apply=function(t,e,r){var n=1/r.destinationFrame.width*(r.size.width/e.size.width);this.uniforms.filterMatrix=t.calculateSpriteMatrix(this.maskMatrix,this.maskSprite),this.uniforms.scale.x=this.scale.x*n,this.uniforms.scale.y=this.scale.y*n,t.applyFilter(this,e,r)},a(e,[{key:\"map\",get:function(){return this.uniforms.mapSampler},set:function(t){this.uniforms.mapSampler=t}}]),e}(h.Filter));r.default=l},{\"../../core\":61,path:22}],141:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=t(\"../../core\"),u=n(a),h=(t(\"path\"),function(t){function e(){return i(this,e),o(this,t.call(this,\"\\nattribute vec2 aVertexPosition;\\nattribute vec2 aTextureCoord;\\n\\nuniform mat3 projectionMatrix;\\n\\nvarying vec2 v_rgbNW;\\nvarying vec2 v_rgbNE;\\nvarying vec2 v_rgbSW;\\nvarying vec2 v_rgbSE;\\nvarying vec2 v_rgbM;\\n\\nuniform vec4 filterArea;\\n\\nvarying vec2 vTextureCoord;\\n\\nvec2 mapCoord( vec2 coord )\\n{\\n    coord *= filterArea.xy;\\n    coord += filterArea.zw;\\n\\n    return coord;\\n}\\n\\nvec2 unmapCoord( vec2 coord )\\n{\\n    coord -= filterArea.zw;\\n    coord /= filterArea.xy;\\n\\n    return coord;\\n}\\n\\nvoid texcoords(vec2 fragCoord, vec2 resolution,\\n               out vec2 v_rgbNW, out vec2 v_rgbNE,\\n               out vec2 v_rgbSW, out vec2 v_rgbSE,\\n               out vec2 v_rgbM) {\\n    vec2 inverseVP = 1.0 / resolution.xy;\\n    v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;\\n    v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;\\n    v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;\\n    v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;\\n    v_rgbM = vec2(fragCoord * inverseVP);\\n}\\n\\nvoid main(void) {\\n\\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\\n\\n   vTextureCoord = aTextureCoord;\\n\\n   vec2 fragCoord = vTextureCoord * filterArea.xy;\\n\\n   texcoords(fragCoord, filterArea.xy, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\\n}\",'varying vec2 v_rgbNW;\\nvarying vec2 v_rgbNE;\\nvarying vec2 v_rgbSW;\\nvarying vec2 v_rgbSE;\\nvarying vec2 v_rgbM;\\n\\nvarying vec2 vTextureCoord;\\nuniform sampler2D uSampler;\\nuniform vec4 filterArea;\\n\\n/**\\n Basic FXAA implementation based on the code on geeks3d.com with the\\n modification that the texture2DLod stuff was removed since it\\'s\\n unsupported by WebGL.\\n \\n --\\n \\n From:\\n https://github.com/mitsuhiko/webgl-meincraft\\n \\n Copyright (c) 2011 by Armin Ronacher.\\n \\n Some rights reserved.\\n \\n Redistribution and use in source and binary forms, with or without\\n modification, are permitted provided that the following conditions are\\n met:\\n \\n * Redistributions of source code must retain the above copyright\\n notice, this list of conditions and the following disclaimer.\\n \\n * Redistributions in binary form must reproduce the above\\n copyright notice, this list of conditions and the following\\n disclaimer in the documentation and/or other materials provided\\n with the distribution.\\n \\n * The names of the contributors may not be used to endorse or\\n promote products derived from this software without specific\\n prior written permission.\\n \\n THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS\\n \"AS IS\" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT\\n LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR\\n A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT\\n OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,\\n SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\\n LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,\\n DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY\\n THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\\n (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\\n OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\\n */\\n\\n#ifndef FXAA_REDUCE_MIN\\n#define FXAA_REDUCE_MIN   (1.0/ 128.0)\\n#endif\\n#ifndef FXAA_REDUCE_MUL\\n#define FXAA_REDUCE_MUL   (1.0 / 8.0)\\n#endif\\n#ifndef FXAA_SPAN_MAX\\n#define FXAA_SPAN_MAX     8.0\\n#endif\\n\\n//optimized version for mobile, where dependent\\n//texture reads can be a bottleneck\\nvec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 resolution,\\n          vec2 v_rgbNW, vec2 v_rgbNE,\\n          vec2 v_rgbSW, vec2 v_rgbSE,\\n          vec2 v_rgbM) {\\n    vec4 color;\\n    mediump vec2 inverseVP = vec2(1.0 / resolution.x, 1.0 / resolution.y);\\n    vec3 rgbNW = texture2D(tex, v_rgbNW).xyz;\\n    vec3 rgbNE = texture2D(tex, v_rgbNE).xyz;\\n    vec3 rgbSW = texture2D(tex, v_rgbSW).xyz;\\n    vec3 rgbSE = texture2D(tex, v_rgbSE).xyz;\\n    vec4 texColor = texture2D(tex, v_rgbM);\\n    vec3 rgbM  = texColor.xyz;\\n    vec3 luma = vec3(0.299, 0.587, 0.114);\\n    float lumaNW = dot(rgbNW, luma);\\n    float lumaNE = dot(rgbNE, luma);\\n    float lumaSW = dot(rgbSW, luma);\\n    float lumaSE = dot(rgbSE, luma);\\n    float lumaM  = dot(rgbM,  luma);\\n    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\\n    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\\n    \\n    mediump vec2 dir;\\n    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\\n    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\\n    \\n    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *\\n                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\\n    \\n    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\\n    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),\\n              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\\n                  dir * rcpDirMin)) * inverseVP;\\n    \\n    vec3 rgbA = 0.5 * (\\n                       texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +\\n                       texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);\\n    vec3 rgbB = rgbA * 0.5 + 0.25 * (\\n                                     texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +\\n                                     texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);\\n    \\n    float lumaB = dot(rgbB, luma);\\n    if ((lumaB < lumaMin) || (lumaB > lumaMax))\\n        color = vec4(rgbA, texColor.a);\\n    else\\n        color = vec4(rgbB, texColor.a);\\n    return color;\\n}\\n\\nvoid main() {\\n\\n      vec2 fragCoord = vTextureCoord * filterArea.xy;\\n\\n      vec4 color;\\n\\n    color = fxaa(uSampler, fragCoord, filterArea.xy, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\\n\\n      gl_FragColor = color;\\n}\\n'))}return s(e,t),e}(u.Filter));r.default=h},{\"../../core\":61,path:22}],142:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}r.__esModule=!0;var i=t(\"./fxaa/FXAAFilter\");Object.defineProperty(r,\"FXAAFilter\",{enumerable:!0,get:function(){return n(i).default}});var o=t(\"./noise/NoiseFilter\");Object.defineProperty(r,\"NoiseFilter\",{enumerable:!0,get:function(){return n(o).default}});var s=t(\"./displacement/DisplacementFilter\");Object.defineProperty(r,\"DisplacementFilter\",{enumerable:!0,get:function(){return n(s).default}});var a=t(\"./blur/BlurFilter\");Object.defineProperty(r,\"BlurFilter\",{enumerable:!0,get:function(){return n(a).default}});var u=t(\"./blur/BlurXFilter\");Object.defineProperty(r,\"BlurXFilter\",{enumerable:!0,get:function(){return n(u).default}});var h=t(\"./blur/BlurYFilter\");Object.defineProperty(r,\"BlurYFilter\",{enumerable:!0,get:function(){return n(h).default}});var l=t(\"./colormatrix/ColorMatrixFilter\");Object.defineProperty(r,\"ColorMatrixFilter\",{enumerable:!0,get:function(){return n(l).default}});var c=t(\"./void/VoidFilter\");Object.defineProperty(r,\"VoidFilter\",{enumerable:!0,get:function(){return n(c).default}})},{\"./blur/BlurFilter\":133,\"./blur/BlurXFilter\":134,\"./blur/BlurYFilter\":135,\"./colormatrix/ColorMatrixFilter\":139,\"./displacement/DisplacementFilter\":140,\"./fxaa/FXAAFilter\":141,\"./noise/NoiseFilter\":143,\"./void/VoidFilter\":144}],143:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),u=t(\"../../core\"),h=n(u),l=(t(\"path\"),function(t){function e(){i(this,e);var r=o(this,t.call(this,\"attribute vec2 aVertexPosition;\\nattribute vec2 aTextureCoord;\\n\\nuniform mat3 projectionMatrix;\\n\\nvarying vec2 vTextureCoord;\\n\\nvoid main(void)\\n{\\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\\n    vTextureCoord = aTextureCoord;\\n}\",\"precision highp float;\\n\\nvarying vec2 vTextureCoord;\\nvarying vec4 vColor;\\n\\nuniform float noise;\\nuniform sampler2D uSampler;\\n\\nfloat rand(vec2 co)\\n{\\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\\n}\\n\\nvoid main()\\n{\\n    vec4 color = texture2D(uSampler, vTextureCoord);\\n\\n    float diff = (rand(gl_FragCoord.xy) - 0.5) * noise;\\n\\n    color.r += diff;\\n    color.g += diff;\\n    color.b += diff;\\n\\n    gl_FragColor = color;\\n}\\n\"));return r.noise=.5,r}return s(e,t),a(e,[{key:\"noise\",get:function(){return this.uniforms.noise},set:function(t){this.uniforms.noise=t}}]),e}(h.Filter));r.default=l},{\"../../core\":61,path:22}],144:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=t(\"../../core\"),u=n(a),h=(t(\"path\"),function(t){function e(){i(this,e);var r=o(this,t.call(this,\"attribute vec2 aVertexPosition;\\nattribute vec2 aTextureCoord;\\n\\nuniform mat3 projectionMatrix;\\n\\nvarying vec2 vTextureCoord;\\n\\nvoid main(void)\\n{\\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\\n    vTextureCoord = aTextureCoord;\\n}\",\"varying vec2 vTextureCoord;\\n\\nuniform sampler2D uSampler;\\n\\nvoid main(void)\\n{\\n   gl_FragColor = texture2D(uSampler, vTextureCoord);\\n}\\n\"));\r\nreturn r.glShaderKey=\"void\",r}return s(e,t),e}(u.Filter));r.default=h},{\"../../core\":61,path:22}],145:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var o=t(\"../core\"),s=n(o),a=function(){function t(){i(this,t),this.global=new s.Point,this.target=null,this.originalEvent=null}return t.prototype.getLocalPosition=function(t,e,r){return t.worldTransform.applyInverse(r||this.global,e)},t}();r.default=a},{\"../core\":61}],146:[function(t,e,r){\"use strict\";function n(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var i=function(){function t(){n(this,t),this.stopped=!1,this.target=null,this.currentTarget=null,this.type=null,this.data=null}return t.prototype.stopPropagation=function(){this.stopped=!0},t.prototype._reset=function(){this.stopped=!1,this.currentTarget=null,this.target=null},t}();r.default=i},{}],147:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function o(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function s(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function a(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var u=t(\"../core\"),h=i(u),l=t(\"./InteractionData\"),c=n(l),d=t(\"./InteractionEvent\"),f=n(d),p=t(\"eventemitter3\"),v=n(p),y=t(\"./interactiveTarget\"),g=n(y),m=t(\"ismobilejs\"),_=n(m);Object.assign(h.DisplayObject.prototype,g.default);var b=function(t){function e(r,n){o(this,e);var i=s(this,t.call(this));return n=n||{},i.renderer=r,i.autoPreventDefault=void 0===n.autoPreventDefault||n.autoPreventDefault,i.interactionFrequency=n.interactionFrequency||10,i.mouse=new c.default,i.mouse.global.set(-999999),i.pointer=new c.default,i.pointer.global.set(-999999),i.eventData=new f.default,i.interactiveDataPool=[],i.interactionDOMElement=null,i.moveWhenInside=!1,i.eventsAdded=!1,i.mouseOverRenderer=!1,i.supportsTouchEvents=\"ontouchstart\"in window,i.supportsPointerEvents=!!window.PointerEvent,i.normalizeTouchEvents=!i.supportsPointerEvents&&i.supportsTouchEvents,i.normalizeMouseEvents=!i.supportsPointerEvents&&!_.default.any,i.onMouseUp=i.onMouseUp.bind(i),i.processMouseUp=i.processMouseUp.bind(i),i.onMouseDown=i.onMouseDown.bind(i),i.processMouseDown=i.processMouseDown.bind(i),i.onMouseMove=i.onMouseMove.bind(i),i.processMouseMove=i.processMouseMove.bind(i),i.onMouseOut=i.onMouseOut.bind(i),i.processMouseOverOut=i.processMouseOverOut.bind(i),i.onMouseOver=i.onMouseOver.bind(i),i.onPointerUp=i.onPointerUp.bind(i),i.processPointerUp=i.processPointerUp.bind(i),i.onPointerDown=i.onPointerDown.bind(i),i.processPointerDown=i.processPointerDown.bind(i),i.onPointerMove=i.onPointerMove.bind(i),i.processPointerMove=i.processPointerMove.bind(i),i.onPointerOut=i.onPointerOut.bind(i),i.processPointerOverOut=i.processPointerOverOut.bind(i),i.onPointerOver=i.onPointerOver.bind(i),i.onTouchStart=i.onTouchStart.bind(i),i.processTouchStart=i.processTouchStart.bind(i),i.onTouchEnd=i.onTouchEnd.bind(i),i.processTouchEnd=i.processTouchEnd.bind(i),i.onTouchMove=i.onTouchMove.bind(i),i.processTouchMove=i.processTouchMove.bind(i),i.defaultCursorStyle=\"inherit\",i.currentCursorStyle=\"inherit\",i._tempPoint=new h.Point,i.resolution=1,i.setTargetElement(i.renderer.view,i.renderer.resolution),i}return a(e,t),e.prototype.setTargetElement=function(t){var e=arguments.length<=1||void 0===arguments[1]?1:arguments[1];this.removeEvents(),this.interactionDOMElement=t,this.resolution=e,this.addEvents()},e.prototype.addEvents=function(){this.interactionDOMElement&&(h.ticker.shared.add(this.update,this),window.navigator.msPointerEnabled?(this.interactionDOMElement.style[\"-ms-content-zooming\"]=\"none\",this.interactionDOMElement.style[\"-ms-touch-action\"]=\"none\"):this.supportsPointerEvents&&(this.interactionDOMElement.style[\"touch-action\"]=\"none\"),this.supportsPointerEvents?(window.document.addEventListener(\"pointermove\",this.onPointerMove,!0),this.interactionDOMElement.addEventListener(\"pointerdown\",this.onPointerDown,!0),this.interactionDOMElement.addEventListener(\"pointerout\",this.onPointerOut,!0),this.interactionDOMElement.addEventListener(\"pointerover\",this.onPointerOver,!0),window.addEventListener(\"pointerup\",this.onPointerUp,!0)):(this.normalizeTouchEvents&&(this.interactionDOMElement.addEventListener(\"touchstart\",this.onPointerDown,!0),this.interactionDOMElement.addEventListener(\"touchend\",this.onPointerUp,!0),this.interactionDOMElement.addEventListener(\"touchmove\",this.onPointerMove,!0)),this.normalizeMouseEvents&&(window.document.addEventListener(\"mousemove\",this.onPointerMove,!0),this.interactionDOMElement.addEventListener(\"mousedown\",this.onPointerDown,!0),this.interactionDOMElement.addEventListener(\"mouseout\",this.onPointerOut,!0),this.interactionDOMElement.addEventListener(\"mouseover\",this.onPointerOver,!0),window.addEventListener(\"mouseup\",this.onPointerUp,!0))),window.document.addEventListener(\"mousemove\",this.onMouseMove,!0),this.interactionDOMElement.addEventListener(\"mousedown\",this.onMouseDown,!0),this.interactionDOMElement.addEventListener(\"mouseout\",this.onMouseOut,!0),this.interactionDOMElement.addEventListener(\"mouseover\",this.onMouseOver,!0),window.addEventListener(\"mouseup\",this.onMouseUp,!0),this.supportsTouchEvents&&(this.interactionDOMElement.addEventListener(\"touchstart\",this.onTouchStart,!0),this.interactionDOMElement.addEventListener(\"touchend\",this.onTouchEnd,!0),this.interactionDOMElement.addEventListener(\"touchmove\",this.onTouchMove,!0)),this.eventsAdded=!0)},e.prototype.removeEvents=function(){this.interactionDOMElement&&(h.ticker.shared.remove(this.update,this),window.navigator.msPointerEnabled?(this.interactionDOMElement.style[\"-ms-content-zooming\"]=\"\",this.interactionDOMElement.style[\"-ms-touch-action\"]=\"\"):this.supportsPointerEvents&&(this.interactionDOMElement.style[\"touch-action\"]=\"\"),this.supportsPointerEvents?(window.document.removeEventListener(\"pointermove\",this.onPointerMove,!0),this.interactionDOMElement.removeEventListener(\"pointerdown\",this.onPointerDown,!0),this.interactionDOMElement.removeEventListener(\"pointerout\",this.onPointerOut,!0),this.interactionDOMElement.removeEventListener(\"pointerover\",this.onPointerOver,!0),window.removeEventListener(\"pointerup\",this.onPointerUp,!0)):(this.normalizeTouchEvents&&(this.interactionDOMElement.removeEventListener(\"touchstart\",this.onPointerDown,!0),this.interactionDOMElement.removeEventListener(\"touchend\",this.onPointerUp,!0),this.interactionDOMElement.removeEventListener(\"touchmove\",this.onPointerMove,!0)),this.normalizeMouseEvents&&(window.document.removeEventListener(\"mousemove\",this.onPointerMove,!0),this.interactionDOMElement.removeEventListener(\"mousedown\",this.onPointerDown,!0),this.interactionDOMElement.removeEventListener(\"mouseout\",this.onPointerOut,!0),this.interactionDOMElement.removeEventListener(\"mouseover\",this.onPointerOver,!0),window.removeEventListener(\"mouseup\",this.onPointerUp,!0))),window.document.removeEventListener(\"mousemove\",this.onMouseMove,!0),this.interactionDOMElement.removeEventListener(\"mousedown\",this.onMouseDown,!0),this.interactionDOMElement.removeEventListener(\"mouseout\",this.onMouseOut,!0),this.interactionDOMElement.removeEventListener(\"mouseover\",this.onMouseOver,!0),window.removeEventListener(\"mouseup\",this.onMouseUp,!0),this.supportsTouchEvents&&(this.interactionDOMElement.removeEventListener(\"touchstart\",this.onTouchStart,!0),this.interactionDOMElement.removeEventListener(\"touchend\",this.onTouchEnd,!0),this.interactionDOMElement.removeEventListener(\"touchmove\",this.onTouchMove,!0)),this.interactionDOMElement=null,this.eventsAdded=!1)},e.prototype.update=function(t){if(this._deltaTime+=t,!(this._deltaTime<this.interactionFrequency)&&(this._deltaTime=0,this.interactionDOMElement)){if(this.didMove)return void(this.didMove=!1);this.cursor=this.defaultCursorStyle,this.eventData._reset(),this.processInteractive(this.mouse.global,this.renderer._lastObjectRendered,this.processMouseOverOut,!0),this.currentCursorStyle!==this.cursor&&(this.currentCursorStyle=this.cursor,this.interactionDOMElement.style.cursor=this.cursor)}},e.prototype.dispatchEvent=function(t,e,r){r.stopped||(r.currentTarget=t,r.type=e,t.emit(e,r),t[e]&&t[e](r))},e.prototype.mapPositionToPoint=function(t,e,r){var n=void 0;n=this.interactionDOMElement.parentElement?this.interactionDOMElement.getBoundingClientRect():{x:0,y:0,width:0,height:0},t.x=(e-n.left)*(this.interactionDOMElement.width/n.width)/this.resolution,t.y=(r-n.top)*(this.interactionDOMElement.height/n.height)/this.resolution},e.prototype.processInteractive=function(t,e,r,n,i){if(!e||!e.visible)return!1;i=e.interactive||i;var o=!1,s=i;if(e.hitArea&&(s=!1),n&&e._mask&&(e._mask.containsPoint(t)||(n=!1)),n&&e.filterArea&&(e.filterArea.contains(t.x,t.y)||(n=!1)),e.interactiveChildren&&e.children)for(var a=e.children,u=a.length-1;u>=0;u--){var h=a[u];if(this.processInteractive(t,h,r,n,s)){if(!h.parent)continue;o=!0,s=!1,n=!1}}return i&&(n&&!o&&(e.hitArea?(e.worldTransform.applyInverse(t,this._tempPoint),o=e.hitArea.contains(this._tempPoint.x,this._tempPoint.y)):e.containsPoint&&(o=e.containsPoint(t))),e.interactive&&(o&&!this.eventData.target&&(this.eventData.target=e,this.mouse.target=e,this.pointer.target=e),r(e,o))),o},e.prototype.onMouseDown=function(t){this.mouse.originalEvent=t,this.eventData.data=this.mouse,this.eventData._reset(),this.mapPositionToPoint(this.mouse.global,t.clientX,t.clientY),this.autoPreventDefault&&this.mouse.originalEvent.preventDefault(),this.processInteractive(this.mouse.global,this.renderer._lastObjectRendered,this.processMouseDown,!0);var e=2===t.button||3===t.which;this.emit(e?\"rightdown\":\"mousedown\",this.eventData)},e.prototype.processMouseDown=function(t,e){var r=this.mouse.originalEvent,n=2===r.button||3===r.which;e&&(t[n?\"_isRightDown\":\"_isLeftDown\"]=!0,this.dispatchEvent(t,n?\"rightdown\":\"mousedown\",this.eventData))},e.prototype.onMouseUp=function(t){this.mouse.originalEvent=t,this.eventData.data=this.mouse,this.eventData._reset(),this.mapPositionToPoint(this.mouse.global,t.clientX,t.clientY),this.processInteractive(this.mouse.global,this.renderer._lastObjectRendered,this.processMouseUp,!0);var e=2===t.button||3===t.which;this.emit(e?\"rightup\":\"mouseup\",this.eventData)},e.prototype.processMouseUp=function(t,e){var r=this.mouse.originalEvent,n=2===r.button||3===r.which,i=n?\"_isRightDown\":\"_isLeftDown\";e?(this.dispatchEvent(t,n?\"rightup\":\"mouseup\",this.eventData),t[i]&&(t[i]=!1,this.dispatchEvent(t,n?\"rightclick\":\"click\",this.eventData))):t[i]&&(t[i]=!1,this.dispatchEvent(t,n?\"rightupoutside\":\"mouseupoutside\",this.eventData))},e.prototype.onMouseMove=function(t){this.mouse.originalEvent=t,this.eventData.data=this.mouse,this.eventData._reset(),this.mapPositionToPoint(this.mouse.global,t.clientX,t.clientY),this.didMove=!0,this.cursor=this.defaultCursorStyle,this.processInteractive(this.mouse.global,this.renderer._lastObjectRendered,this.processMouseMove,!0),this.emit(\"mousemove\",this.eventData),this.currentCursorStyle!==this.cursor&&(this.currentCursorStyle=this.cursor,this.interactionDOMElement.style.cursor=this.cursor)},e.prototype.processMouseMove=function(t,e){this.processMouseOverOut(t,e),this.moveWhenInside&&!e||this.dispatchEvent(t,\"mousemove\",this.eventData)},e.prototype.onMouseOut=function(t){this.mouseOverRenderer=!1,this.mouse.originalEvent=t,this.eventData.data=this.mouse,this.eventData._reset(),this.mapPositionToPoint(this.mouse.global,t.clientX,t.clientY),this.interactionDOMElement.style.cursor=this.defaultCursorStyle,this.mapPositionToPoint(this.mouse.global,t.clientX,t.clientY),this.processInteractive(this.mouse.global,this.renderer._lastObjectRendered,this.processMouseOverOut,!1),this.emit(\"mouseout\",this.eventData)},e.prototype.processMouseOverOut=function(t,e){e&&this.mouseOverRenderer?(t._mouseOver||(t._mouseOver=!0,this.dispatchEvent(t,\"mouseover\",this.eventData)),t.buttonMode&&(this.cursor=t.defaultCursor)):t._mouseOver&&(t._mouseOver=!1,this.dispatchEvent(t,\"mouseout\",this.eventData))},e.prototype.onMouseOver=function(t){this.mouseOverRenderer=!0,this.mouse.originalEvent=t,this.eventData.data=this.mouse,this.eventData._reset(),this.emit(\"mouseover\",this.eventData)},e.prototype.onPointerDown=function(t){this.normalizeToPointerData(t),this.pointer.originalEvent=t,this.eventData.data=this.pointer,this.eventData._reset(),this.mapPositionToPoint(this.pointer.global,t.clientX,t.clientY),this.autoPreventDefault&&(this.normalizeMouseEvents||this.normalizeTouchEvents)&&this.pointer.originalEvent.preventDefault(),this.processInteractive(this.pointer.global,this.renderer._lastObjectRendered,this.processPointerDown,!0),this.emit(\"pointerdown\",this.eventData)},e.prototype.processPointerDown=function(t,e){e&&(t._pointerDown=!0,this.dispatchEvent(t,\"pointerdown\",this.eventData))},e.prototype.onPointerUp=function(t){this.normalizeToPointerData(t),this.pointer.originalEvent=t,this.eventData.data=this.pointer,this.eventData._reset(),this.mapPositionToPoint(this.pointer.global,t.clientX,t.clientY),this.processInteractive(this.pointer.global,this.renderer._lastObjectRendered,this.processPointerUp,!0),this.emit(\"pointerup\",this.eventData)},e.prototype.processPointerUp=function(t,e){e?(this.dispatchEvent(t,\"pointerup\",this.eventData),t._pointerDown&&(t._pointerDown=!1,this.dispatchEvent(t,\"pointertap\",this.eventData))):t._pointerDown&&(t._pointerDown=!1,this.dispatchEvent(t,\"pointerupoutside\",this.eventData))},e.prototype.onPointerMove=function(t){this.normalizeToPointerData(t),this.pointer.originalEvent=t,this.eventData.data=this.pointer,this.eventData._reset(),this.mapPositionToPoint(this.pointer.global,t.clientX,t.clientY),this.processInteractive(this.pointer.global,this.renderer._lastObjectRendered,this.processPointerMove,!0),this.emit(\"pointermove\",this.eventData)},e.prototype.processPointerMove=function(t,e){this.pointer.originalEvent.changedTouches||this.processPointerOverOut(t,e),this.moveWhenInside&&!e||this.dispatchEvent(t,\"pointermove\",this.eventData)},e.prototype.onPointerOut=function(t){this.normalizeToPointerData(t),this.pointer.originalEvent=t,this.eventData.data=this.pointer,this.eventData._reset(),this.mapPositionToPoint(this.pointer.global,t.clientX,t.clientY),this.processInteractive(this.pointer.global,this.renderer._lastObjectRendered,this.processPointerOverOut,!1),this.emit(\"pointerout\",this.eventData)},e.prototype.processPointerOverOut=function(t,e){e&&this.mouseOverRenderer?t._pointerOver||(t._pointerOver=!0,this.dispatchEvent(t,\"pointerover\",this.eventData)):t._pointerOver&&(t._pointerOver=!1,this.dispatchEvent(t,\"pointerout\",this.eventData))},e.prototype.onPointerOver=function(t){this.pointer.originalEvent=t,this.eventData.data=this.pointer,this.eventData._reset(),this.emit(\"pointerover\",this.eventData)},e.prototype.onTouchStart=function(t){this.autoPreventDefault&&t.preventDefault();for(var e=t.changedTouches,r=e.length,n=0;n<r;n++){var i=e[n],o=this.getTouchData(i);o.originalEvent=t,this.eventData.data=o,this.eventData._reset(),this.processInteractive(o.global,this.renderer._lastObjectRendered,this.processTouchStart,!0),this.emit(\"touchstart\",this.eventData),this.returnTouchData(o)}},e.prototype.processTouchStart=function(t,e){e&&(t._touchDown=!0,this.dispatchEvent(t,\"touchstart\",this.eventData))},e.prototype.onTouchEnd=function(t){this.autoPreventDefault&&t.preventDefault();for(var e=t.changedTouches,r=e.length,n=0;n<r;n++){var i=e[n],o=this.getTouchData(i);o.originalEvent=t,this.eventData.data=o,this.eventData._reset(),this.processInteractive(o.global,this.renderer._lastObjectRendered,this.processTouchEnd,!0),this.emit(\"touchend\",this.eventData),this.returnTouchData(o)}},e.prototype.processTouchEnd=function(t,e){e?(this.dispatchEvent(t,\"touchend\",this.eventData),t._touchDown&&(t._touchDown=!1,this.dispatchEvent(t,\"tap\",this.eventData))):t._touchDown&&(t._touchDown=!1,this.dispatchEvent(t,\"touchendoutside\",this.eventData))},e.prototype.onTouchMove=function(t){this.autoPreventDefault&&t.preventDefault();for(var e=t.changedTouches,r=e.length,n=0;n<r;n++){var i=e[n],o=this.getTouchData(i);o.originalEvent=t,this.eventData.data=o,this.eventData._reset(),this.processInteractive(o.global,this.renderer._lastObjectRendered,this.processTouchMove,this.moveWhenInside),this.emit(\"touchmove\",this.eventData),this.returnTouchData(o)}},e.prototype.processTouchMove=function(t,e){this.moveWhenInside&&!e||this.dispatchEvent(t,\"touchmove\",this.eventData)},e.prototype.getTouchData=function(t){var e=this.interactiveDataPool.pop()||new c.default;return e.identifier=t.identifier,this.mapPositionToPoint(e.global,t.clientX,t.clientY),navigator.isCocoonJS&&(e.global.x=e.global.x/this.resolution,e.global.y=e.global.y/this.resolution),t.globalX=e.global.x,t.globalY=e.global.y,e},e.prototype.returnTouchData=function(t){this.interactiveDataPool.push(t)},e.prototype.normalizeToPointerData=function(t){this.normalizeTouchEvents&&t.changedTouches?(\"undefined\"==typeof t.button&&(t.button=t.touches.length?1:0),\"undefined\"==typeof t.buttons&&(t.buttons=t.touches.length?1:0),\"undefined\"==typeof t.isPrimary&&(t.isPrimary=1===t.touches.length),\"undefined\"==typeof t.width&&(t.width=t.changedTouches[0].radiusX||1),\"undefined\"==typeof t.height&&(t.height=t.changedTouches[0].radiusY||1),\"undefined\"==typeof t.tiltX&&(t.tiltX=0),\"undefined\"==typeof t.tiltY&&(t.tiltY=0),\"undefined\"==typeof t.pointerType&&(t.pointerType=\"touch\"),\"undefined\"==typeof t.pointerId&&(t.pointerId=t.changedTouches[0].identifier||0),\"undefined\"==typeof t.pressure&&(t.pressure=t.changedTouches[0].force||.5),\"undefined\"==typeof t.rotation&&(t.rotation=t.changedTouches[0].rotationAngle||0),\"undefined\"==typeof t.clientX&&(t.clientX=t.changedTouches[0].clientX),\"undefined\"==typeof t.clientY&&(t.clientY=t.changedTouches[0].clientY),\"undefined\"==typeof t.pageX&&(t.pageX=t.changedTouches[0].pageX),\"undefined\"==typeof t.pageY&&(t.pageY=t.changedTouches[0].pageY),\"undefined\"==typeof t.screenX&&(t.screenX=t.changedTouches[0].screenX),\"undefined\"==typeof t.screenY&&(t.screenY=t.changedTouches[0].screenY),\"undefined\"==typeof t.layerX&&(t.layerX=t.offsetX=t.clientX),\"undefined\"==typeof t.layerY&&(t.layerY=t.offsetY=t.clientY)):this.normalizeMouseEvents&&(\"undefined\"==typeof t.isPrimary&&(t.isPrimary=!0),\"undefined\"==typeof t.width&&(t.width=1),\"undefined\"==typeof t.height&&(t.height=1),\"undefined\"==typeof t.tiltX&&(t.tiltX=0),\"undefined\"==typeof t.tiltY&&(t.tiltY=0),\"undefined\"==typeof t.pointerType&&(t.pointerType=\"mouse\"),\"undefined\"==typeof t.pointerId&&(t.pointerId=1),\"undefined\"==typeof t.pressure&&(t.pressure=.5),\"undefined\"==typeof t.rotation&&(t.rotation=0))},e.prototype.destroy=function(){this.removeEvents(),this.removeAllListeners(),this.renderer=null,this.mouse=null,this.eventData=null,this.interactiveDataPool=null,this.interactionDOMElement=null,this.onMouseDown=null,this.processMouseDown=null,this.onMouseUp=null,this.processMouseUp=null,this.onMouseMove=null,this.processMouseMove=null,this.onMouseOut=null,this.processMouseOverOut=null,this.onMouseOver=null,this.onPointerDown=null,this.processPointerDown=null,this.onPointerUp=null,this.processPointerUp=null,this.onPointerMove=null,this.processPointerMove=null,this.onPointerOut=null,this.processPointerOverOut=null,this.onPointerOver=null,this.onTouchStart=null,this.processTouchStart=null,this.onTouchEnd=null,this.processTouchEnd=null,this.onTouchMove=null,this.processTouchMove=null,this._tempPoint=null},e}(v.default);r.default=b,h.WebGLRenderer.registerPlugin(\"interaction\",b),h.CanvasRenderer.registerPlugin(\"interaction\",b)},{\"../core\":61,\"./InteractionData\":145,\"./InteractionEvent\":146,\"./interactiveTarget\":149,eventemitter3:3,ismobilejs:4}],148:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}r.__esModule=!0;var i=t(\"./InteractionData\");Object.defineProperty(r,\"InteractionData\",{enumerable:!0,get:function(){return n(i).default}});var o=t(\"./InteractionManager\");Object.defineProperty(r,\"InteractionManager\",{enumerable:!0,get:function(){return n(o).default}});var s=t(\"./interactiveTarget\");Object.defineProperty(r,\"interactiveTarget\",{enumerable:!0,get:function(){return n(s).default}})},{\"./InteractionData\":145,\"./InteractionManager\":147,\"./interactiveTarget\":149}],149:[function(t,e,r){\"use strict\";r.__esModule=!0,r.default={interactive:!1,interactiveChildren:!0,hitArea:null,buttonMode:!1,defaultCursor:\"pointer\",_over:!1,_isLeftDown:!1,_isRightDown:!1,_pointerOver:!1,_pointerDown:!1,_touchDown:!1}},{}],150:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function i(t,e){var r={},n=t.data.getElementsByTagName(\"info\")[0],i=t.data.getElementsByTagName(\"common\")[0];r.font=n.getAttribute(\"face\"),r.size=parseInt(n.getAttribute(\"size\"),10),r.lineHeight=parseInt(i.getAttribute(\"lineHeight\"),10),r.chars={};for(var o=t.data.getElementsByTagName(\"char\"),s=0;s<o.length;s++){var u=parseInt(o[s].getAttribute(\"id\"),10),l=new a.Rectangle(parseInt(o[s].getAttribute(\"x\"),10)+e.frame.x,parseInt(o[s].getAttribute(\"y\"),10)+e.frame.y,parseInt(o[s].getAttribute(\"width\"),10),parseInt(o[s].getAttribute(\"height\"),10));r.chars[u]={xOffset:parseInt(o[s].getAttribute(\"xoffset\"),10),yOffset:parseInt(o[s].getAttribute(\"yoffset\"),10),xAdvance:parseInt(o[s].getAttribute(\"xadvance\"),10),kerning:{},texture:new a.Texture(e.baseTexture,l)}}for(var c=t.data.getElementsByTagName(\"kerning\"),d=0;d<c.length;d++){var f=parseInt(c[d].getAttribute(\"first\"),10),p=parseInt(c[d].getAttribute(\"second\"),10),v=parseInt(c[d].getAttribute(\"amount\"),10);r.chars[p]&&(r.chars[p].kerning[f]=v)}t.bitmapFont=r,h.BitmapText.fonts[r.font]=r}r.__esModule=!0,r.parse=i,r.default=function(){return function(t,e){if(!t.data||!t.isXml)return void e();if(0===t.data.getElementsByTagName(\"page\").length||0===t.data.getElementsByTagName(\"info\").length||null===t.data.getElementsByTagName(\"info\")[0].getAttribute(\"face\"))return void e();var r=t.isDataUrl?\"\":s.dirname(t.url);t.isDataUrl&&(\".\"===r&&(r=\"\"),this.baseUrl&&r&&(\"/\"===this.baseUrl.charAt(this.baseUrl.length-1)&&(r+=\"/\"),r=r.replace(this.baseUrl,\"\"))),r&&\"/\"!==r.charAt(r.length-1)&&(r+=\"/\");var n=r+t.data.getElementsByTagName(\"page\")[0].getAttribute(\"file\");if(a.utils.TextureCache[n])i(t,a.utils.TextureCache[n]),e();else{var o={crossOrigin:t.crossOrigin,loadType:u.Resource.LOAD_TYPE.IMAGE,metadata:t.metadata.imageMetadata};this.add(t.name+\"_image\",n,o,function(r){i(t,r.texture),e()})}}};var o=t(\"path\"),s=n(o),a=t(\"../core\"),u=t(\"resource-loader\"),h=t(\"../extras\")},{\"../core\":61,\"../extras\":131,path:22,\"resource-loader\":35}],151:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}r.__esModule=!0;var i=t(\"./loader\");Object.defineProperty(r,\"Loader\",{enumerable:!0,get:function(){return n(i).default}});var o=t(\"./bitmapFontParser\");Object.defineProperty(r,\"bitmapFontParser\",{enumerable:!0,get:function(){return n(o).default}}),Object.defineProperty(r,\"parseBitmapFontData\",{enumerable:!0,get:function(){return o.parse}});var s=t(\"./spritesheetParser\");Object.defineProperty(r,\"spritesheetParser\",{enumerable:!0,get:function(){return n(s).default}});var a=t(\"./textureParser\");Object.defineProperty(r,\"textureParser\",{enumerable:!0,get:function(){return n(a).default}});var u=t(\"resource-loader\");Object.defineProperty(r,\"Resource\",{enumerable:!0,get:function(){return u.Resource}})},{\"./bitmapFontParser\":150,\"./loader\":152,\"./spritesheetParser\":153,\"./textureParser\":154,\"resource-loader\":35}],152:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=t(\"resource-loader\"),u=n(a),h=t(\"./textureParser\"),l=n(h),c=t(\"./spritesheetParser\"),d=n(c),f=t(\"./bitmapFontParser\"),p=n(f),v=function(t){function e(r,n){i(this,e);for(var s=o(this,t.call(this,r,n)),a=0;a<e._pixiMiddleware.length;++a)s.use(e._pixiMiddleware[a]());return s}return s(e,t),e.addPixiMiddleware=function(t){e._pixiMiddleware.push(t)},e}(u.default);r.default=v,v._pixiMiddleware=[u.default.middleware.parsing.blob,l.default,d.default,p.default];var y=u.default.Resource;y.setExtensionXhrType(\"fnt\",y.XHR_RESPONSE_TYPE.DOCUMENT)},{\"./bitmapFontParser\":150,\"./spritesheetParser\":153,\"./textureParser\":154,\"resource-loader\":35}],153:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function i(t){return t&&t.__esModule?t:{default:t}}r.__esModule=!0,r.default=function(){return function(t,e){var r=void 0,n=t.name+\"_image\";if(!t.data||!t.isJson||!t.data.frames||this.resources[n])return void e();var i={crossOrigin:t.crossOrigin,loadType:o.Resource.LOAD_TYPE.IMAGE,metadata:t.metadata.imageMetadata};r=t.isDataUrl?t.data.meta.image:a.default.dirname(t.url.replace(this.baseUrl,\"\"))+\"/\"+t.data.meta.image,this.add(n,r,i,function(r){function n(e,r){for(var n=e;n-e<r&&n<u.length;){var i=u[n],o=a[i].frame;if(o){var s=null,l=null,f=new h.Rectangle(0,0,a[i].sourceSize.w/d,a[i].sourceSize.h/d);s=a[i].rotated?new h.Rectangle(o.x/d,o.y/d,o.h/d,o.w/d):new h.Rectangle(o.x/d,o.y/d,o.w/d,o.h/d),a[i].trimmed&&(l=new h.Rectangle(a[i].spriteSourceSize.x/d,a[i].spriteSourceSize.y/d,o.w/d,o.h/d)),t.textures[i]=new h.Texture(c,s,f,l,a[i].rotated?2:0),h.utils.TextureCache[i]=t.textures[i]}n++}}function i(){return p*l<u.length}function o(t){n(p*l,l),p++,setTimeout(t,0)}function s(){o(function(){i()?s():e()})}t.textures={};var a=t.data.frames,u=Object.keys(a),c=r.texture.baseTexture,d=h.utils.getResolutionOfUrl(t.url),f=t.data.meta.scale;1===d&&void 0!==f&&1!==f&&(c.resolution=d=f,c.update());var p=0;u.length<=l?(n(0,l),e()):s()})}};var o=t(\"resource-loader\"),s=t(\"path\"),a=i(s),u=t(\"../core\"),h=n(u),l=1e3},{\"../core\":61,path:22,\"resource-loader\":35}],154:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}r.__esModule=!0,r.default=function(){return function(t,e){if(t.data&&t.isImage){var r=new o.BaseTexture(t.data,null,o.utils.getResolutionOfUrl(t.url));r.imageUrl=t.url,t.texture=new o.Texture(r),o.utils.BaseTextureCache[t.name]=r,o.utils.TextureCache[t.name]=t.texture,t.name!==t.url&&(o.utils.BaseTextureCache[t.url]=r,o.utils.TextureCache[t.url]=t.texture)}e()}};var i=t(\"../core\"),o=n(i)},{\"../core\":61}],155:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),u=t(\"../core\"),h=n(u),l=new h.Point,c=new h.Polygon,d=function(t){function e(r,n,s,a,u){i(this,e);var l=o(this,t.call(this));return l._texture=null,l.uvs=s||new Float32Array([0,0,1,0,1,1,0,1]),l.vertices=n||new Float32Array([0,0,100,0,100,100,0,100]),l.indices=a||new Uint16Array([0,1,3,2]),l.dirty=0,l.indexDirty=0,l.blendMode=h.BLEND_MODES.NORMAL,l.canvasPadding=0,l.drawMode=u||e.DRAW_MODES.TRIANGLE_MESH,l.texture=r,l.shader=null,l.tintRgb=new Float32Array([1,1,1]),l._glDatas={},l}return s(e,t),e.prototype._renderWebGL=function(t){t.setObjectRenderer(t.plugins.mesh),t.plugins.mesh.render(this)},e.prototype._renderCanvas=function(t){t.plugins.mesh.render(this)},e.prototype._onTextureUpdate=function(){},e.prototype._calculateBounds=function(){this._bounds.addVertices(this.transform,this.vertices,0,this.vertices.length)},e.prototype.containsPoint=function(t){if(!this.getBounds().contains(t.x,t.y))return!1;this.worldTransform.applyInverse(t,l);for(var r=this.vertices,n=c.points,i=this.indices,o=this.indices.length,s=this.drawMode===e.DRAW_MODES.TRIANGLES?3:1,a=0;a+2<o;a+=s){var u=2*i[a],h=2*i[a+1],d=2*i[a+2];if(n[0]=r[u],n[1]=r[u+1],n[2]=r[h],n[3]=r[h+1],n[4]=r[d],n[5]=r[d+1],c.contains(l.x,l.y))return!0}return!1},a(e,[{key:\"texture\",get:function(){return this._texture},set:function(t){this._texture!==t&&(this._texture=t,t&&(t.baseTexture.hasLoaded?this._onTextureUpdate():t.once(\"update\",this._onTextureUpdate,this)))}},{key:\"tint\",get:function(){return h.utils.rgb2hex(this.tintRgb)},set:function(t){this.tintRgb=h.utils.hex2rgb(t,this.tintRgb)}}]),e}(h.Container);r.default=d,d.DRAW_MODES={TRIANGLE_MESH:0,TRIANGLES:1}},{\"../core\":61}],156:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),u=t(\"./Plane\"),h=n(u),l=10,c=function(t){function e(r,n,s,a,u){i(this,e);var h=o(this,t.call(this,r,4,4)),c=h.uvs;return c[6]=c[14]=c[22]=c[30]=1,c[25]=c[27]=c[29]=c[31]=1,h._origWidth=r.width,h._origHeight=r.height,h._uvw=1/h._origWidth,h._uvh=1/h._origHeight,h.width=r.width,h.height=r.height,c[2]=c[10]=c[18]=c[26]=h._uvw*n,c[4]=c[12]=c[20]=c[28]=1-h._uvw*a,c[9]=c[11]=c[13]=c[15]=h._uvh*s,c[17]=c[19]=c[21]=c[23]=1-h._uvh*u,h.leftWidth=\"undefined\"!=typeof n?n:l,h.rightWidth=\"undefined\"!=typeof a?a:l,h.topHeight=\"undefined\"!=typeof s?s:l,h.bottomHeight=\"undefined\"!=typeof u?u:l,h}return s(e,t),\r\ne.prototype.updateHorizontalVertices=function(){var t=this.vertices;t[9]=t[11]=t[13]=t[15]=this._topHeight,t[17]=t[19]=t[21]=t[23]=this._height-this._bottomHeight,t[25]=t[27]=t[29]=t[31]=this._height},e.prototype.updateVerticalVertices=function(){var t=this.vertices;t[2]=t[10]=t[18]=t[26]=this._leftWidth,t[4]=t[12]=t[20]=t[28]=this._width-this._rightWidth,t[6]=t[14]=t[22]=t[30]=this._width},e.prototype._renderCanvas=function(t){var e=t.context;e.globalAlpha=this.worldAlpha;var r=this.worldTransform,n=t.resolution;t.roundPixels?e.setTransform(r.a*n,r.b*n,r.c*n,r.d*n,r.tx*n|0,r.ty*n|0):e.setTransform(r.a*n,r.b*n,r.c*n,r.d*n,r.tx*n,r.ty*n);var i=this._texture.baseTexture,o=i.source,s=i.width,a=i.height;this.drawSegment(e,o,s,a,0,1,10,11),this.drawSegment(e,o,s,a,2,3,12,13),this.drawSegment(e,o,s,a,4,5,14,15),this.drawSegment(e,o,s,a,8,9,18,19),this.drawSegment(e,o,s,a,10,11,20,21),this.drawSegment(e,o,s,a,12,13,22,23),this.drawSegment(e,o,s,a,16,17,26,27),this.drawSegment(e,o,s,a,18,19,28,29),this.drawSegment(e,o,s,a,20,21,30,31)},e.prototype.drawSegment=function(t,e,r,n,i,o,s,a){var u=this.uvs,h=this.vertices,l=(u[s]-u[i])*r,c=(u[a]-u[o])*n,d=h[s]-h[i],f=h[a]-h[o];l<1&&(l=1),c<1&&(c=1),d<1&&(d=1),f<1&&(f=1),t.drawImage(e,u[i]*r,u[o]*n,l,c,h[i],h[o],d,f)},a(e,[{key:\"width\",get:function(){return this._width},set:function(t){this._width=t,this.updateVerticalVertices()}},{key:\"height\",get:function(){return this._height},set:function(t){this._height=t,this.updateHorizontalVertices()}},{key:\"leftWidth\",get:function(){return this._leftWidth},set:function(t){this._leftWidth=t;var e=this.uvs,r=this.vertices;e[2]=e[10]=e[18]=e[26]=this._uvw*t,r[2]=r[10]=r[18]=r[26]=t,this.dirty=!0}},{key:\"rightWidth\",get:function(){return this._rightWidth},set:function(t){this._rightWidth=t;var e=this.uvs,r=this.vertices;e[4]=e[12]=e[20]=e[28]=1-this._uvw*t,r[4]=r[12]=r[20]=r[28]=this._width-t,this.dirty=!0}},{key:\"topHeight\",get:function(){return this._topHeight},set:function(t){this._topHeight=t;var e=this.uvs,r=this.vertices;e[9]=e[11]=e[13]=e[15]=this._uvh*t,r[9]=r[11]=r[13]=r[15]=t,this.dirty=!0}},{key:\"bottomHeight\",get:function(){return this._bottomHeight},set:function(t){this._bottomHeight=t;var e=this.uvs,r=this.vertices;e[17]=e[19]=e[21]=e[23]=1-this._uvh*t,r[17]=r[19]=r[21]=r[23]=this._height-t,this.dirty=!0}}]),e}(h.default);r.default=c},{\"./Plane\":157}],157:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=t(\"./Mesh\"),u=n(a),h=function(t){function e(r,n,s){i(this,e);var a=o(this,t.call(this,r));return a._ready=!0,a.verticesX=n||10,a.verticesY=s||10,a.drawMode=u.default.DRAW_MODES.TRIANGLES,a.refresh(),a}return s(e,t),e.prototype.refresh=function(){for(var t=this.verticesX*this.verticesY,e=[],r=[],n=[],i=[],o=this.texture,s=this.verticesX-1,a=this.verticesY-1,u=o.width/s,h=o.height/a,l=0;l<t;l++)if(o._uvs){var c=l%this.verticesX,d=l/this.verticesX|0;e.push(c*u,d*h),n.push(o._uvs.x0+(o._uvs.x1-o._uvs.x0)*(c/(this.verticesX-1)),o._uvs.y0+(o._uvs.y3-o._uvs.y0)*(d/(this.verticesY-1)))}else n.push(0);for(var f=s*a,p=0;p<f;p++){var v=p%s,y=p/s|0,g=y*this.verticesX+v,m=y*this.verticesX+v+1,_=(y+1)*this.verticesX+v,b=(y+1)*this.verticesX+v+1;i.push(g,m,_),i.push(m,b,_)}this.vertices=new Float32Array(e),this.uvs=new Float32Array(n),this.colors=new Float32Array(r),this.indices=new Uint16Array(i),this.indexDirty=!0},e.prototype._onTextureUpdate=function(){u.default.prototype._onTextureUpdate.call(this),this._ready&&this.refresh()},e}(u.default);r.default=h},{\"./Mesh\":155}],158:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function i(t){return t&&t.__esModule?t:{default:t}}function o(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function s(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function a(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var u=t(\"./Mesh\"),h=i(u),l=t(\"../core\"),c=n(l),d=function(t){function e(r,n){o(this,e);var i=s(this,t.call(this,r));return i.points=n,i.vertices=new Float32Array(4*n.length),i.uvs=new Float32Array(4*n.length),i.colors=new Float32Array(2*n.length),i.indices=new Uint16Array(2*n.length),i._ready=!0,i.refresh(),i}return a(e,t),e.prototype.refresh=function(){var t=this.points;if(!(t.length<1)&&this._texture._uvs){this.vertices.length/4!==t.length&&(this.vertices=new Float32Array(4*t.length),this.uvs=new Float32Array(4*t.length),this.colors=new Float32Array(2*t.length),this.indices=new Uint16Array(2*t.length));var e=this.uvs,r=this.indices,n=this.colors,i=this._texture._uvs,o=new c.Point(i.x0,i.y0),s=new c.Point(i.x2-i.x0,i.y2-i.y0);e[0]=0+o.x,e[1]=0+o.y,e[2]=0+o.x,e[3]=Number(s.y)+o.y,n[0]=1,n[1]=1,r[0]=0,r[1]=1;for(var a=t.length,u=1;u<a;u++){var h=4*u,l=u/(a-1);e[h]=l*s.x+o.x,e[h+1]=0+o.y,e[h+2]=l*s.x+o.x,e[h+3]=Number(s.y)+o.y,h=2*u,n[h]=1,n[h+1]=1,h=2*u,r[h]=h,r[h+1]=h+1}this.dirty++,this.indexDirty++}},e.prototype._onTextureUpdate=function(){t.prototype._onTextureUpdate.call(this),this._ready&&this.refresh()},e.prototype.updateTransform=function(){var t=this.points;if(!(t.length<1)){for(var e=t[0],r=void 0,n=0,i=0,o=this.vertices,s=t.length,a=0;a<s;a++){var u=t[a],h=4*a;r=a<t.length-1?t[a+1]:u,i=-(r.x-e.x),n=r.y-e.y;var l=10*(1-a/(s-1));l>1&&(l=1);var c=Math.sqrt(n*n+i*i),d=this._texture.height/2;n/=c,i/=c,n*=d,i*=d,o[h]=u.x+n,o[h+1]=u.y+i,o[h+2]=u.x-n,o[h+3]=u.y-i,e=u}this.containerUpdateTransform()}},e}(h.default);r.default=d},{\"../core\":61,\"./Mesh\":155}],159:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function o(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var s=t(\"../../core\"),a=i(s),u=t(\"../Mesh\"),h=n(u),l=function(){function t(e){o(this,t),this.renderer=e}return t.prototype.render=function(t){var e=this.renderer,r=e.context,n=t.worldTransform,i=e.resolution;e.roundPixels?r.setTransform(n.a*i,n.b*i,n.c*i,n.d*i,n.tx*i|0,n.ty*i|0):r.setTransform(n.a*i,n.b*i,n.c*i,n.d*i,n.tx*i,n.ty*i),e.setBlendMode(t.blendMode),t.drawMode===h.default.DRAW_MODES.TRIANGLE_MESH?this._renderTriangleMesh(t):this._renderTriangles(t)},t.prototype._renderTriangleMesh=function(t){for(var e=t.vertices.length/2,r=0;r<e-2;r++){var n=2*r;this._renderDrawTriangle(t,n,n+2,n+4)}},t.prototype._renderTriangles=function(t){for(var e=t.indices,r=e.length,n=0;n<r;n+=3){var i=2*e[n],o=2*e[n+1],s=2*e[n+2];this._renderDrawTriangle(t,i,o,s)}},t.prototype._renderDrawTriangle=function(t,e,r,n){var i=this.renderer.context,o=t.uvs,s=t.vertices,a=t._texture;if(a.valid){var u=a.baseTexture,h=u.source,l=u.width,c=u.height,d=o[e]*u.width,f=o[r]*u.width,p=o[n]*u.width,v=o[e+1]*u.height,y=o[r+1]*u.height,g=o[n+1]*u.height,m=s[e],_=s[r],b=s[n],x=s[e+1],T=s[r+1],w=s[n+1];if(t.canvasPadding>0){var E=t.canvasPadding/t.worldTransform.a,O=t.canvasPadding/t.worldTransform.d,S=(m+_+b)/3,M=(x+T+w)/3,P=m-S,C=x-M,R=Math.sqrt(P*P+C*C);m=S+P/R*(R+E),x=M+C/R*(R+O),P=_-S,C=T-M,R=Math.sqrt(P*P+C*C),_=S+P/R*(R+E),T=M+C/R*(R+O),P=b-S,C=w-M,R=Math.sqrt(P*P+C*C),b=S+P/R*(R+E),w=M+C/R*(R+O)}i.save(),i.beginPath(),i.moveTo(m,x),i.lineTo(_,T),i.lineTo(b,w),i.closePath(),i.clip();var A=d*y+v*p+f*g-y*p-v*f-d*g,D=m*y+v*b+_*g-y*b-v*_-m*g,I=d*_+m*p+f*b-_*p-m*f-d*b,L=d*y*b+v*_*p+m*f*g-m*y*p-v*f*b-d*_*g,j=x*y+v*w+T*g-y*w-v*T-x*g,B=d*T+x*p+f*w-T*p-x*f-d*w,F=d*y*w+v*T*p+x*f*g-x*y*p-v*f*w-d*T*g;i.transform(D/A,j/A,I/A,B/A,L/A,F/A),i.drawImage(h,0,0,l*u.resolution,c*u.resolution,0,0,l,c),i.restore()}},t.prototype.renderMeshFlat=function(t){var e=this.renderer.context,r=t.vertices,n=r.length/2;e.beginPath();for(var i=1;i<n-2;++i){var o=2*i,s=r[o],a=r[o+1],u=r[o+2],h=r[o+3],l=r[o+4],c=r[o+5];e.moveTo(s,a),e.lineTo(u,h),e.lineTo(l,c)}e.fillStyle=\"#FF0000\",e.fill(),e.closePath()},t.prototype.destroy=function(){this.renderer=null},t}();r.default=l,a.CanvasRenderer.registerPlugin(\"mesh\",l)},{\"../../core\":61,\"../Mesh\":155}],160:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}r.__esModule=!0;var i=t(\"./Mesh\");Object.defineProperty(r,\"Mesh\",{enumerable:!0,get:function(){return n(i).default}});var o=t(\"./webgl/MeshRenderer\");Object.defineProperty(r,\"MeshRenderer\",{enumerable:!0,get:function(){return n(o).default}});var s=t(\"./canvas/CanvasMeshRenderer\");Object.defineProperty(r,\"CanvasMeshRenderer\",{enumerable:!0,get:function(){return n(s).default}});var a=t(\"./Plane\");Object.defineProperty(r,\"Plane\",{enumerable:!0,get:function(){return n(a).default}});var u=t(\"./NineSlicePlane\");Object.defineProperty(r,\"NineSlicePlane\",{enumerable:!0,get:function(){return n(u).default}});var h=t(\"./Rope\");Object.defineProperty(r,\"Rope\",{enumerable:!0,get:function(){return n(h).default}})},{\"./Mesh\":155,\"./NineSlicePlane\":156,\"./Plane\":157,\"./Rope\":158,\"./canvas/CanvasMeshRenderer\":159,\"./webgl/MeshRenderer\":161}],161:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function o(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function s(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function a(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var u=t(\"../../core\"),h=i(u),l=t(\"pixi-gl-core\"),c=n(l),d=t(\"../Mesh\"),f=n(d),p=(t(\"path\"),function(t){function e(r){o(this,e);var n=s(this,t.call(this,r));return n.shader=null,n}return a(e,t),e.prototype.onContextChange=function(){var t=this.renderer.gl;this.shader=new h.Shader(t,\"attribute vec2 aVertexPosition;\\nattribute vec2 aTextureCoord;\\n\\nuniform mat3 translationMatrix;\\nuniform mat3 projectionMatrix;\\n\\nvarying vec2 vTextureCoord;\\n\\nvoid main(void)\\n{\\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\\n\\n    vTextureCoord = aTextureCoord;\\n}\\n\",\"varying vec2 vTextureCoord;\\nuniform float alpha;\\nuniform vec3 tint;\\n\\nuniform sampler2D uSampler;\\n\\nvoid main(void)\\n{\\n    gl_FragColor = texture2D(uSampler, vTextureCoord) * vec4(tint * alpha, alpha);\\n}\\n\")},e.prototype.render=function(t){var e=this.renderer,r=e.gl,n=t._texture;if(n.valid){var i=t._glDatas[e.CONTEXT_UID];i||(e.bindVao(null),i={shader:this.shader,vertexBuffer:c.default.GLBuffer.createVertexBuffer(r,t.vertices,r.STREAM_DRAW),uvBuffer:c.default.GLBuffer.createVertexBuffer(r,t.uvs,r.STREAM_DRAW),indexBuffer:c.default.GLBuffer.createIndexBuffer(r,t.indices,r.STATIC_DRAW),vao:null,dirty:t.dirty,indexDirty:t.indexDirty},i.vao=new c.default.VertexArrayObject(r).addIndex(i.indexBuffer).addAttribute(i.vertexBuffer,i.shader.attributes.aVertexPosition,r.FLOAT,!1,8,0).addAttribute(i.uvBuffer,i.shader.attributes.aTextureCoord,r.FLOAT,!1,8,0),t._glDatas[e.CONTEXT_UID]=i),t.dirty!==i.dirty&&(i.dirty=t.dirty,i.uvBuffer.upload(t.uvs)),t.indexDirty!==i.indexDirty&&(i.indexDirty=t.indexDirty,i.indexBuffer.upload(t.indices)),i.vertexBuffer.upload(t.vertices),e.bindShader(i.shader),i.shader.uniforms.uSampler=e.bindTexture(n),e.state.setBlendMode(t.blendMode),i.shader.uniforms.translationMatrix=t.worldTransform.toArray(!0),i.shader.uniforms.alpha=t.worldAlpha,i.shader.uniforms.tint=t.tintRgb;var o=t.drawMode===f.default.DRAW_MODES.TRIANGLE_MESH?r.TRIANGLE_STRIP:r.TRIANGLES;e.bindVao(i.vao),i.vao.draw(o,t.indices.length,0)}},e}(h.ObjectRenderer));r.default=p,h.WebGLRenderer.registerPlugin(\"mesh\",p)},{\"../../core\":61,\"../Mesh\":155,path:22,\"pixi-gl-core\":12}],162:[function(t,e,r){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=t(\"../core\"),u=n(a),h=function(t){function e(){var r=arguments.length<=0||void 0===arguments[0]?1500:arguments[0],n=arguments[1],s=arguments.length<=2||void 0===arguments[2]?16384:arguments[2];i(this,e);var a=o(this,t.call(this)),h=16384;return s>h&&(s=h),s>r&&(s=r),a._properties=[!1,!0,!1,!1,!1],a._maxSize=r,a._batchSize=s,a._glBuffers={},a._bufferToUpdate=0,a.interactiveChildren=!1,a.blendMode=u.BLEND_MODES.NORMAL,a.roundPixels=!0,a.baseTexture=null,a.setProperties(n),a}return s(e,t),e.prototype.setProperties=function(t){t&&(this._properties[0]=\"scale\"in t?!!t.scale:this._properties[0],this._properties[1]=\"position\"in t?!!t.position:this._properties[1],this._properties[2]=\"rotation\"in t?!!t.rotation:this._properties[2],this._properties[3]=\"uvs\"in t?!!t.uvs:this._properties[3],this._properties[4]=\"alpha\"in t?!!t.alpha:this._properties[4])},e.prototype.updateTransform=function(){this.displayObjectUpdateTransform()},e.prototype.renderWebGL=function(t){var e=this;this.visible&&!(this.worldAlpha<=0)&&this.children.length&&this.renderable&&(this.baseTexture||(this.baseTexture=this.children[0]._texture.baseTexture,this.baseTexture.hasLoaded||this.baseTexture.once(\"update\",function(){return e.onChildrenChange(0)})),t.setObjectRenderer(t.plugins.particle),t.plugins.particle.render(this))},e.prototype.onChildrenChange=function(t){var e=Math.floor(t/this._batchSize);e<this._bufferToUpdate&&(this._bufferToUpdate=e)},e.prototype.renderCanvas=function(t){if(this.visible&&!(this.worldAlpha<=0)&&this.children.length&&this.renderable){var e=t.context,r=this.worldTransform,n=!0,i=0,o=0,s=0,a=0,u=t.blendModes[this.blendMode];u!==e.globalCompositeOperation&&(e.globalCompositeOperation=u),e.globalAlpha=this.worldAlpha,this.displayObjectUpdateTransform();for(var h=0;h<this.children.length;++h){var l=this.children[h];if(l.visible){var c=l.texture.frame;if(e.globalAlpha=this.worldAlpha*l.alpha,l.rotation%(2*Math.PI)===0)n&&(e.setTransform(r.a,r.b,r.c,r.d,r.tx*t.resolution,r.ty*t.resolution),n=!1),i=l.anchor.x*(-c.width*l.scale.x)+l.position.x+.5,o=l.anchor.y*(-c.height*l.scale.y)+l.position.y+.5,s=c.width*l.scale.x,a=c.height*l.scale.y;else{n||(n=!0),l.displayObjectUpdateTransform();var d=l.worldTransform;t.roundPixels?e.setTransform(d.a,d.b,d.c,d.d,d.tx*t.resolution|0,d.ty*t.resolution|0):e.setTransform(d.a,d.b,d.c,d.d,d.tx*t.resolution,d.ty*t.resolution),i=l.anchor.x*-c.width+.5,o=l.anchor.y*-c.height+.5,s=c.width,a=c.height}var f=l.texture.baseTexture.resolution;e.drawImage(l.texture.baseTexture.source,c.x*f,c.y*f,c.width*f,c.height*f,i*f,o*f,s*f,a*f)}}}},e.prototype.destroy=function(e){if(t.prototype.destroy.call(this,e),this._buffers)for(var r=0;r<this._buffers.length;++r)this._buffers[r].destroy();this._properties=null,this._buffers=null},e}(u.Container);r.default=h},{\"../core\":61}],163:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}r.__esModule=!0;var i=t(\"./ParticleContainer\");Object.defineProperty(r,\"ParticleContainer\",{enumerable:!0,get:function(){return n(i).default}});var o=t(\"./webgl/ParticleRenderer\");Object.defineProperty(r,\"ParticleRenderer\",{enumerable:!0,get:function(){return n(o).default}})},{\"./ParticleContainer\":162,\"./webgl/ParticleRenderer\":165}],164:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var o=t(\"pixi-gl-core\"),s=n(o),a=t(\"../../core/utils/createIndicesForQuads\"),u=n(a),h=function(){function t(e,r,n,o){i(this,t),this.gl=e,this.vertSize=2,this.vertByteSize=4*this.vertSize,this.size=o,this.dynamicProperties=[],this.staticProperties=[];for(var s=0;s<r.length;++s){var a=r[s];a={attribute:a.attribute,size:a.size,uploadFunction:a.uploadFunction,offset:a.offset},n[s]?this.dynamicProperties.push(a):this.staticProperties.push(a)}this.staticStride=0,this.staticBuffer=null,this.staticData=null,this.dynamicStride=0,this.dynamicBuffer=null,this.dynamicData=null,this.initBuffers()}return t.prototype.initBuffers=function(){var t=this.gl,e=0;this.indices=(0,u.default)(this.size),this.indexBuffer=s.default.GLBuffer.createIndexBuffer(t,this.indices,t.STATIC_DRAW),this.dynamicStride=0;for(var r=0;r<this.dynamicProperties.length;++r){var n=this.dynamicProperties[r];n.offset=e,e+=n.size,this.dynamicStride+=n.size}this.dynamicData=new Float32Array(this.size*this.dynamicStride*4),this.dynamicBuffer=s.default.GLBuffer.createVertexBuffer(t,this.dynamicData,t.STREAM_DRAW);var i=0;this.staticStride=0;for(var o=0;o<this.staticProperties.length;++o){var a=this.staticProperties[o];a.offset=i,i+=a.size,this.staticStride+=a.size}this.staticData=new Float32Array(this.size*this.staticStride*4),this.staticBuffer=s.default.GLBuffer.createVertexBuffer(t,this.staticData,t.STATIC_DRAW),this.vao=new s.default.VertexArrayObject(t).addIndex(this.indexBuffer);for(var h=0;h<this.dynamicProperties.length;++h){var l=this.dynamicProperties[h];this.vao.addAttribute(this.dynamicBuffer,l.attribute,t.FLOAT,!1,4*this.dynamicStride,4*l.offset)}for(var c=0;c<this.staticProperties.length;++c){var d=this.staticProperties[c];this.vao.addAttribute(this.staticBuffer,d.attribute,t.FLOAT,!1,4*this.staticStride,4*d.offset)}},t.prototype.uploadDynamic=function(t,e,r){for(var n=0;n<this.dynamicProperties.length;n++){var i=this.dynamicProperties[n];i.uploadFunction(t,e,r,this.dynamicData,this.dynamicStride,i.offset)}this.dynamicBuffer.upload()},t.prototype.uploadStatic=function(t,e,r){for(var n=0;n<this.staticProperties.length;n++){var i=this.staticProperties[n];i.uploadFunction(t,e,r,this.staticData,this.staticStride,i.offset)}this.staticBuffer.upload()},t.prototype.destroy=function(){this.dynamicProperties=null,this.dynamicData=null,this.dynamicBuffer.destroy(),this.staticProperties=null,this.staticData=null,this.staticBuffer.destroy()},t}();r.default=h},{\"../../core/utils/createIndicesForQuads\":115,\"pixi-gl-core\":12}],165:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function o(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function s(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function a(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var u=t(\"../../core\"),h=i(u),l=t(\"./ParticleShader\"),c=n(l),d=t(\"./ParticleBuffer\"),f=n(d),p=function(t){function e(r){o(this,e);var n=s(this,t.call(this,r));return n.shader=null,n.indexBuffer=null,n.properties=null,n.tempMatrix=new h.Matrix,n.CONTEXT_UID=0,n}return a(e,t),e.prototype.onContextChange=function(){var t=this.renderer.gl;this.CONTEXT_UID=this.renderer.CONTEXT_UID,this.shader=new c.default(t),this.properties=[{attribute:this.shader.attributes.aVertexPosition,size:2,uploadFunction:this.uploadVertices,offset:0},{attribute:this.shader.attributes.aPositionCoord,size:2,uploadFunction:this.uploadPosition,offset:0},{attribute:this.shader.attributes.aRotation,size:1,uploadFunction:this.uploadRotation,offset:0},{attribute:this.shader.attributes.aTextureCoord,size:2,uploadFunction:this.uploadUvs,offset:0},{attribute:this.shader.attributes.aColor,size:1,uploadFunction:this.uploadAlpha,offset:0}]},e.prototype.start=function(){this.renderer.bindShader(this.shader)},e.prototype.render=function(t){var e=t.children,r=t._maxSize,n=t._batchSize,i=this.renderer,o=e.length;if(0!==o){o>r&&(o=r);var s=t._glBuffers[i.CONTEXT_UID];s||(s=t._glBuffers[i.CONTEXT_UID]=this.generateBuffers(t)),this.renderer.setBlendMode(t.blendMode);var a=i.gl,u=t.worldTransform.copy(this.tempMatrix);u.prepend(i._activeRenderTarget.projectionMatrix),this.shader.uniforms.projectionMatrix=u.toArray(!0),this.shader.uniforms.uAlpha=t.worldAlpha;var h=e[0]._texture.baseTexture;this.shader.uniforms.uSampler=i.bindTexture(h);for(var l=0,c=0;l<o;l+=n,c+=1){var d=o-l;d>n&&(d=n);var f=s[c];f.uploadDynamic(e,l,d),t._bufferToUpdate===c&&(f.uploadStatic(e,l,d),t._bufferToUpdate=c+1),i.bindVao(f.vao),f.vao.draw(a.TRIANGLES,6*d)}}},e.prototype.generateBuffers=function(t){for(var e=this.renderer.gl,r=[],n=t._maxSize,i=t._batchSize,o=t._properties,s=0;s<n;s+=i)r.push(new f.default(e,this.properties,o,i));return r},e.prototype.uploadVertices=function(t,e,r,n,i,o){for(var s=0,a=0,u=0,h=0,l=0;l<r;++l){var c=t[e+l],d=c._texture,f=c.scale.x,p=c.scale.y,v=d.trim,y=d.orig;v?(a=v.x-c.anchor.x*y.width,s=a+v.width,h=v.y-c.anchor.y*y.height,u=h+v.height):(s=y.width*(1-c.anchor.x),a=y.width*-c.anchor.x,u=y.height*(1-c.anchor.y),h=y.height*-c.anchor.y),n[o]=a*f,n[o+1]=h*p,n[o+i]=s*f,n[o+i+1]=h*p,n[o+2*i]=s*f,n[o+2*i+1]=u*p,n[o+3*i]=a*f,n[o+3*i+1]=u*p,o+=4*i}},e.prototype.uploadPosition=function(t,e,r,n,i,o){for(var s=0;s<r;s++){var a=t[e+s].position;n[o]=a.x,n[o+1]=a.y,n[o+i]=a.x,n[o+i+1]=a.y,n[o+2*i]=a.x,n[o+2*i+1]=a.y,n[o+3*i]=a.x,n[o+3*i+1]=a.y,o+=4*i}},e.prototype.uploadRotation=function(t,e,r,n,i,o){for(var s=0;s<r;s++){var a=t[e+s].rotation;n[o]=a,n[o+i]=a,n[o+2*i]=a,n[o+3*i]=a,o+=4*i}},e.prototype.uploadUvs=function(t,e,r,n,i,o){for(var s=0;s<r;++s){var a=t[e+s]._texture._uvs;a?(n[o]=a.x0,n[o+1]=a.y0,n[o+i]=a.x1,n[o+i+1]=a.y1,n[o+2*i]=a.x2,n[o+2*i+1]=a.y2,n[o+3*i]=a.x3,n[o+3*i+1]=a.y3,o+=4*i):(n[o]=0,n[o+1]=0,n[o+i]=0,n[o+i+1]=0,n[o+2*i]=0,n[o+2*i+1]=0,n[o+3*i]=0,n[o+3*i+1]=0,o+=4*i)}},e.prototype.uploadAlpha=function(t,e,r,n,i,o){for(var s=0;s<r;s++){var a=t[e+s].alpha;n[o]=a,n[o+i]=a,n[o+2*i]=a,n[o+3*i]=a,o+=4*i}},e.prototype.destroy=function(){this.renderer.gl&&this.renderer.gl.deleteBuffer(this.indexBuffer),t.prototype.destroy.call(this),this.shader.destroy(),this.indices=null,this.tempMatrix=null},e}(h.ObjectRenderer);r.default=p,h.WebGLRenderer.registerPlugin(\"particle\",p)},{\"../../core\":61,\"./ParticleBuffer\":164,\"./ParticleShader\":166}],166:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function o(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function s(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}r.__esModule=!0;var a=t(\"../../core/Shader\"),u=n(a),h=function(t){function e(r){return i(this,e),o(this,t.call(this,r,[\"attribute vec2 aVertexPosition;\",\"attribute vec2 aTextureCoord;\",\"attribute float aColor;\",\"attribute vec2 aPositionCoord;\",\"attribute vec2 aScale;\",\"attribute float aRotation;\",\"uniform mat3 projectionMatrix;\",\"varying vec2 vTextureCoord;\",\"varying float vColor;\",\"void main(void){\",\"   vec2 v = aVertexPosition;\",\"   v.x = (aVertexPosition.x) * cos(aRotation) - (aVertexPosition.y) * sin(aRotation);\",\"   v.y = (aVertexPosition.x) * sin(aRotation) + (aVertexPosition.y) * cos(aRotation);\",\"   v = v + aPositionCoord;\",\"   gl_Position = vec4((projectionMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);\",\"   vTextureCoord = aTextureCoord;\",\"   vColor = aColor;\",\"}\"].join(\"\\n\"),[\"varying vec2 vTextureCoord;\",\"varying float vColor;\",\"uniform sampler2D uSampler;\",\"uniform float uAlpha;\",\"void main(void){\",\"  vec4 color = texture2D(uSampler, vTextureCoord) * vColor * uAlpha;\",\"  if (color.a == 0.0) discard;\",\"  gl_FragColor = color;\",\"}\"].join(\"\\n\")))}return s(e,t),e}(u.default);r.default=h},{\"../../core/Shader\":41}],167:[function(t,e,r){\"use strict\";Math.sign||(Math.sign=function(t){return t=Number(t),0===t||isNaN(t)?t:t>0?1:-1})},{}],168:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}var i=t(\"object-assign\"),o=n(i);Object.assign||(Object.assign=o.default)},{\"object-assign\":5}],169:[function(t,e,r){\"use strict\";t(\"./Object.assign\"),t(\"./requestAnimationFrame\"),t(\"./Math.sign\"),window.ArrayBuffer||(window.ArrayBuffer=Array),window.Float32Array||(window.Float32Array=Array),window.Uint32Array||(window.Uint32Array=Array),window.Uint16Array||(window.Uint16Array=Array)},{\"./Math.sign\":167,\"./Object.assign\":168,\"./requestAnimationFrame\":170}],170:[function(t,e,r){(function(t){\"use strict\";var e=16;Date.now&&Date.prototype.getTime||(Date.now=function(){return(new Date).getTime()}),t.performance&&t.performance.now||!function(){var e=Date.now();t.performance||(t.performance={}),t.performance.now=function(){return Date.now()-e}}();for(var r=Date.now(),n=[\"ms\",\"moz\",\"webkit\",\"o\"],i=0;i<n.length&&!t.requestAnimationFrame;++i){var o=n[i];t.requestAnimationFrame=t[o+\"RequestAnimationFrame\"],t.cancelAnimationFrame=t[o+\"CancelAnimationFrame\"]||t[o+\"CancelRequestAnimationFrame\"]}t.requestAnimationFrame||(t.requestAnimationFrame=function(t){if(\"function\"!=typeof t)throw new TypeError(t+\"is not a function\");var n=Date.now(),i=e+r-n;return i<0&&(i=0),r=n,setTimeout(function(){r=Date.now(),t(performance.now())},i)}),t.cancelAnimationFrame||(t.cancelAnimationFrame=function(t){return clearTimeout(t)})}).call(this,\"undefined\"!=typeof global?global:\"undefined\"!=typeof self?self:\"undefined\"!=typeof window?window:{})},{}],171:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function o(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function s(t,e){return e instanceof c.Text&&(e.updateText(!0),!0)}function a(t,e){if(e instanceof c.TextStyle){var r=c.Text.getFontStyle(e);return c.Text.fontPropertiesCache[r]||c.Text.calculateFontProperties(r),!0}return!1}function u(t,e){if(t instanceof c.Text){e.indexOf(t.style)===-1&&e.push(t.style),e.indexOf(t)===-1&&e.push(t);var r=t._texture.baseTexture;return e.indexOf(r)===-1&&e.push(r),!0}return!1}function h(t,e){return t instanceof c.TextStyle&&(e.indexOf(t)===-1&&e.push(t),!0)}r.__esModule=!0;var l=t(\"../core\"),c=i(l),d=t(\"./limiters/CountLimiter\"),f=n(d),p=c.ticker.shared;c.settings.UPLOADS_PER_FRAME=4;var v=function(){function t(e){var r=this;o(this,t),this.limiter=new f.default(c.settings.UPLOADS_PER_FRAME),this.renderer=e,this.uploadHookHelper=null,this.queue=[],this.addHooks=[],this.uploadHooks=[],this.completes=[],this.ticking=!1,this.delayedTick=function(){r.queue&&r.prepareItems()},this.register(u,s),this.register(h,a)}return t.prototype.upload=function(t,e){\"function\"==typeof t&&(e=t,t=null),t&&this.add(t),this.queue.length?(e&&this.completes.push(e),this.ticking||(this.ticking=!0,p.addOnce(this.tick,this))):e&&e()},t.prototype.tick=function(){setTimeout(this.delayedTick,0)},t.prototype.prepareItems=function(){for(this.limiter.beginFrame();this.queue.length&&this.limiter.allowedToUpload();){for(var t=this.queue[0],e=!1,r=0,n=this.uploadHooks.length;r<n;r++)if(this.uploadHooks[r](this.uploadHookHelper,t)){this.queue.shift(),e=!0;break}e||this.queue.shift()}if(this.queue.length)p.addOnce(this.tick,this);else{this.ticking=!1;var i=this.completes.slice(0);this.completes.length=0;for(var o=0,s=i.length;o<s;o++)i[o]()}},t.prototype.register=function(t,e){return t&&this.addHooks.push(t),e&&this.uploadHooks.push(e),this},t.prototype.add=function(t){for(var e=0,r=this.addHooks.length;e<r&&!this.addHooks[e](t,this.queue);e++);if(t instanceof c.Container)for(var n=t.children.length-1;n>=0;n--)this.add(t.children[n]);return this},t.prototype.destroy=function(){this.ticking&&p.remove(this.tick,this),this.ticking=!1,this.addHooks=null,this.uploadHooks=null,this.renderer=null,this.completes=null,this.queue=null,this.limiter=null,this.uploadHookHelper=null},t}();r.default=v},{\"../core\":61,\"./limiters/CountLimiter\":174}],172:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function o(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function s(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function a(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function u(t,e){if(e instanceof c.BaseTexture){var r=e.source,n=0===r.width?t.canvas.width:Math.min(t.canvas.width,r.width),i=0===r.height?t.canvas.height:Math.min(t.canvas.height,r.height);return t.ctx.drawImage(r,0,0,n,i,0,0,t.canvas.width,t.canvas.height),!0}return!1}function h(t,e){if(t instanceof c.BaseTexture)return e.indexOf(t)===-1&&e.push(t),!0;if(t._texture&&t._texture instanceof c.Texture){var r=t._texture.baseTexture;return e.indexOf(r)===-1&&e.push(r),!0}return!1}r.__esModule=!0;var l=t(\"../../core\"),c=i(l),d=t(\"../BasePrepare\"),f=n(d),p=16,v=function(t){function e(r){o(this,e);var n=s(this,t.call(this,r));return n.uploadHookHelper=n,n.canvas=document.createElement(\"canvas\"),n.canvas.width=p,n.canvas.height=p,n.ctx=n.canvas.getContext(\"2d\"),n.register(h,u),n}return a(e,t),e.prototype.destroy=function(){t.prototype.destroy.call(this),this.ctx=null,this.canvas=null},e}(f.default);r.default=v,c.CanvasRenderer.registerPlugin(\"prepare\",v)},{\"../../core\":61,\"../BasePrepare\":171}],173:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}r.__esModule=!0;\r\nvar i=t(\"./webgl/WebGLPrepare\");Object.defineProperty(r,\"webgl\",{enumerable:!0,get:function(){return n(i).default}});var o=t(\"./canvas/CanvasPrepare\");Object.defineProperty(r,\"canvas\",{enumerable:!0,get:function(){return n(o).default}});var s=t(\"./BasePrepare\");Object.defineProperty(r,\"BasePrepare\",{enumerable:!0,get:function(){return n(s).default}});var a=t(\"./limiters/CountLimiter\");Object.defineProperty(r,\"CountLimiter\",{enumerable:!0,get:function(){return n(a).default}});var u=t(\"./limiters/TimeLimiter\");Object.defineProperty(r,\"TimeLimiter\",{enumerable:!0,get:function(){return n(u).default}})},{\"./BasePrepare\":171,\"./canvas/CanvasPrepare\":172,\"./limiters/CountLimiter\":174,\"./limiters/TimeLimiter\":175,\"./webgl/WebGLPrepare\":176}],174:[function(t,e,r){\"use strict\";function n(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var i=function(){function t(e){n(this,t),this.maxItemsPerFrame=e,this.itemsLeft=0}return t.prototype.beginFrame=function(){this.itemsLeft=this.maxItemsPerFrame},t.prototype.allowedToUpload=function(){return this.itemsLeft-- >0},t}();r.default=i},{}],175:[function(t,e,r){\"use strict\";function n(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}r.__esModule=!0;var i=function(){function t(e){n(this,t),this.maxMilliseconds=e,this.frameStart=0}return t.prototype.beginFrame=function(){this.frameStart=Date.now()},t.prototype.allowedToUpload=function(){return Date.now()-this.frameStart<this.maxMilliseconds},t}();r.default=i},{}],176:[function(t,e,r){\"use strict\";function n(t){return t&&t.__esModule?t:{default:t}}function i(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function o(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function s(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function a(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function u(t,e){return e instanceof f.BaseTexture&&(e._glTextures[t.CONTEXT_UID]||t.textureManager.updateTexture(e),!0)}function h(t,e){return e instanceof f.Graphics&&((e.dirty||e.clearDirty||!e._webGL[t.plugins.graphics.CONTEXT_UID])&&t.plugins.graphics.updateGraphics(e),!0)}function l(t,e){if(t instanceof f.BaseTexture)return e.indexOf(t)===-1&&e.push(t),!0;if(t._texture&&t._texture instanceof f.Texture){var r=t._texture.baseTexture;return e.indexOf(r)===-1&&e.push(r),!0}return!1}function c(t,e){return t instanceof f.Graphics&&(e.push(t),!0)}r.__esModule=!0;var d=t(\"../../core\"),f=i(d),p=t(\"../BasePrepare\"),v=n(p),y=function(t){function e(r){o(this,e);var n=s(this,t.call(this,r));return n.uploadHookHelper=n.renderer,n.register(l,u).register(c,h),n}return a(e,t),e}(v.default);r.default=y,f.WebGLRenderer.registerPlugin(\"prepare\",y)},{\"../../core\":61,\"../BasePrepare\":171}],177:[function(t,e,r){(function(e){\"use strict\";function n(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}r.__esModule=!0,r.loader=r.prepare=r.particles=r.mesh=r.loaders=r.interaction=r.filters=r.extras=r.extract=r.accessibility=void 0;var i=t(\"./deprecation\");Object.keys(i).forEach(function(t){\"default\"!==t&&\"__esModule\"!==t&&Object.defineProperty(r,t,{enumerable:!0,get:function(){return i[t]}})});var o=t(\"./core\");Object.keys(o).forEach(function(t){\"default\"!==t&&\"__esModule\"!==t&&Object.defineProperty(r,t,{enumerable:!0,get:function(){return o[t]}})}),t(\"./polyfill\");var s=t(\"./accessibility\"),a=n(s),u=t(\"./extract\"),h=n(u),l=t(\"./extras\"),c=n(l),d=t(\"./filters\"),f=n(d),p=t(\"./interaction\"),v=n(p),y=t(\"./loaders\"),g=n(y),m=t(\"./mesh\"),_=n(m),b=t(\"./particles\"),x=n(b),T=t(\"./prepare\"),w=n(T);r.accessibility=a,r.extract=h,r.extras=c,r.filters=f,r.interaction=v,r.loaders=g,r.mesh=_,r.particles=x,r.prepare=w;var E=g&&g.Loader?new g.Loader:null;r.loader=E,e.PIXI=r}).call(this,\"undefined\"!=typeof global?global:\"undefined\"!=typeof self?self:\"undefined\"!=typeof window?window:{})},{\"./accessibility\":40,\"./core\":61,\"./deprecation\":120,\"./extract\":122,\"./extras\":131,\"./filters\":142,\"./interaction\":148,\"./loaders\":151,\"./mesh\":160,\"./particles\":163,\"./polyfill\":169,\"./prepare\":173}]},{},[177])(177)});\r\n//# sourceMappingURL=pixi.min.js.map\r\n"

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(26)(__webpack_require__(29))

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = "var TWEEN=TWEEN||function(){var n=[];return{getAll:function(){return n},removeAll:function(){n=[]},add:function(t){n.push(t)},remove:function(t){var r=n.indexOf(t);-1!==r&&n.splice(r,1)},update:function(t,r){if(0===n.length)return!1;var i=0;for(t=void 0!==t?t:TWEEN.now();i<n.length;)n[i].update(t)||r?i++:n.splice(i,1);return!0}}}();!function(){void 0===this.window&&void 0!==this.process?TWEEN.now=function(){var n=process.hrtime();return 1e3*n[0]+n[1]/1e3}:void 0!==this.window&&void 0!==window.performance&&void 0!==window.performance.now?TWEEN.now=window.performance.now.bind(window.performance):void 0!==Date.now?TWEEN.now=Date.now:TWEEN.now=function(){return(new Date).getTime()}}(),TWEEN.Tween=function(n){var t=n,r={},i={},o={},u=1e3,e=0,a=!1,f=!1,c=!1,s=0,h=null,l=TWEEN.Easing.Linear.None,E=TWEEN.Interpolation.Linear,p=[],d=null,v=!1,w=null,I=null,M=null;for(var T in n)r[T]=parseFloat(n[T],10);this.to=function(n,t){return void 0!==t&&(u=t),i=n,this},this.start=function(n){TWEEN.add(this),f=!0,v=!1,h=void 0!==n?n:TWEEN.now(),h+=s;for(var u in i){if(i[u]instanceof Array){if(0===i[u].length)continue;i[u]=[t[u]].concat(i[u])}void 0!==r[u]&&(r[u]=t[u],r[u]instanceof Array==!1&&(r[u]*=1),o[u]=r[u]||0)}return this},this.stop=function(){return f?(TWEEN.remove(this),f=!1,null!==M&&M.call(t),this.stopChainedTweens(),this):this},this.stopChainedTweens=function(){for(var n=0,t=p.length;t>n;n++)p[n].stop()},this.delay=function(n){return s=n,this},this.repeat=function(n){return e=n,this},this.yoyo=function(n){return a=n,this},this.easing=function(n){return l=n,this},this.interpolation=function(n){return E=n,this},this.chain=function(){return p=arguments,this},this.onStart=function(n){return d=n,this},this.onUpdate=function(n){return w=n,this},this.onComplete=function(n){return I=n,this},this.onStop=function(n){return M=n,this},this.update=function(n){var f,M,T;if(h>n)return!0;v===!1&&(null!==d&&d.call(t),v=!0),M=(n-h)/u,M=M>1?1:M,T=l(M);for(f in i)if(void 0!==r[f]){var N=r[f]||0,W=i[f];W instanceof Array?t[f]=E(W,T):(\"string\"==typeof W&&(W=\"+\"===W.charAt(0)||\"-\"===W.charAt(0)?N+parseFloat(W,10):parseFloat(W,10)),\"number\"==typeof W&&(t[f]=N+(W-N)*T))}if(null!==w&&w.call(t,T),1===M){if(e>0){isFinite(e)&&e--;for(f in o){if(\"string\"==typeof i[f]&&(o[f]=o[f]+parseFloat(i[f],10)),a){var O=o[f];o[f]=i[f],i[f]=O}r[f]=o[f]}return a&&(c=!c),h=n+s,!0}null!==I&&I.call(t);for(var m=0,g=p.length;g>m;m++)p[m].start(h+u);return!1}return!0}},TWEEN.Easing={Linear:{None:function(n){return n}},Quadratic:{In:function(n){return n*n},Out:function(n){return n*(2-n)},InOut:function(n){return(n*=2)<1?.5*n*n:-.5*(--n*(n-2)-1)}},Cubic:{In:function(n){return n*n*n},Out:function(n){return--n*n*n+1},InOut:function(n){return(n*=2)<1?.5*n*n*n:.5*((n-=2)*n*n+2)}},Quartic:{In:function(n){return n*n*n*n},Out:function(n){return 1- --n*n*n*n},InOut:function(n){return(n*=2)<1?.5*n*n*n*n:-.5*((n-=2)*n*n*n-2)}},Quintic:{In:function(n){return n*n*n*n*n},Out:function(n){return--n*n*n*n*n+1},InOut:function(n){return(n*=2)<1?.5*n*n*n*n*n:.5*((n-=2)*n*n*n*n+2)}},Sinusoidal:{In:function(n){return 1-Math.cos(n*Math.PI/2)},Out:function(n){return Math.sin(n*Math.PI/2)},InOut:function(n){return.5*(1-Math.cos(Math.PI*n))}},Exponential:{In:function(n){return 0===n?0:Math.pow(1024,n-1)},Out:function(n){return 1===n?1:1-Math.pow(2,-10*n)},InOut:function(n){return 0===n?0:1===n?1:(n*=2)<1?.5*Math.pow(1024,n-1):.5*(-Math.pow(2,-10*(n-1))+2)}},Circular:{In:function(n){return 1-Math.sqrt(1-n*n)},Out:function(n){return Math.sqrt(1- --n*n)},InOut:function(n){return(n*=2)<1?-.5*(Math.sqrt(1-n*n)-1):.5*(Math.sqrt(1-(n-=2)*n)+1)}},Elastic:{In:function(n){return 0===n?0:1===n?1:-Math.pow(2,10*(n-1))*Math.sin(5*(n-1.1)*Math.PI)},Out:function(n){return 0===n?0:1===n?1:Math.pow(2,-10*n)*Math.sin(5*(n-.1)*Math.PI)+1},InOut:function(n){return 0===n?0:1===n?1:(n*=2,1>n?-.5*Math.pow(2,10*(n-1))*Math.sin(5*(n-1.1)*Math.PI):.5*Math.pow(2,-10*(n-1))*Math.sin(5*(n-1.1)*Math.PI)+1)}},Back:{In:function(n){var t=1.70158;return n*n*((t+1)*n-t)},Out:function(n){var t=1.70158;return--n*n*((t+1)*n+t)+1},InOut:function(n){var t=2.5949095;return(n*=2)<1?.5*(n*n*((t+1)*n-t)):.5*((n-=2)*n*((t+1)*n+t)+2)}},Bounce:{In:function(n){return 1-TWEEN.Easing.Bounce.Out(1-n)},Out:function(n){return 1/2.75>n?7.5625*n*n:2/2.75>n?7.5625*(n-=1.5/2.75)*n+.75:2.5/2.75>n?7.5625*(n-=2.25/2.75)*n+.9375:7.5625*(n-=2.625/2.75)*n+.984375},InOut:function(n){return.5>n?.5*TWEEN.Easing.Bounce.In(2*n):.5*TWEEN.Easing.Bounce.Out(2*n-1)+.5}}},TWEEN.Interpolation={Linear:function(n,t){var r=n.length-1,i=r*t,o=Math.floor(i),u=TWEEN.Interpolation.Utils.Linear;return 0>t?u(n[0],n[1],i):t>1?u(n[r],n[r-1],r-i):u(n[o],n[o+1>r?r:o+1],i-o)},Bezier:function(n,t){for(var r=0,i=n.length-1,o=Math.pow,u=TWEEN.Interpolation.Utils.Bernstein,e=0;i>=e;e++)r+=o(1-t,i-e)*o(t,e)*n[e]*u(i,e);return r},CatmullRom:function(n,t){var r=n.length-1,i=r*t,o=Math.floor(i),u=TWEEN.Interpolation.Utils.CatmullRom;return n[0]===n[r]?(0>t&&(o=Math.floor(i=r*(1+t))),u(n[(o-1+r)%r],n[o],n[(o+1)%r],n[(o+2)%r],i-o)):0>t?n[0]-(u(n[0],n[0],n[1],n[1],-i)-n[0]):t>1?n[r]-(u(n[r],n[r],n[r-1],n[r-1],i-r)-n[r]):u(n[o?o-1:0],n[o],n[o+1>r?r:o+1],n[o+2>r?r:o+2],i-o)},Utils:{Linear:function(n,t,r){return(t-n)*r+n},Bernstein:function(n,t){var r=TWEEN.Interpolation.Utils.Factorial;return r(n)/r(t)/r(n-t)},Factorial:function(){var n=[1];return function(t){var r=1;if(n[t])return n[t];for(var i=t;i>1;i--)r*=i;return n[t]=r,r}}(),CatmullRom:function(n,t,r,i,o){var u=.5*(r-n),e=.5*(i-t),a=o*o,f=o*a;return(2*t-2*r+u+e)*f+(-3*t+3*r-2*u-e)*a+u*o+t}}},function(n){\"function\"==typeof define&&define.amd?define([],function(){return TWEEN}):\"undefined\"!=typeof module&&\"object\"==typeof exports?module.exports=TWEEN:void 0!==n&&(n.TWEEN=TWEEN)}(this);\r\n//# sourceMappingURL=Tween.min.js.map"

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var PaintCanvas_1 = __webpack_require__(53);
	var PngMaker_1 = __webpack_require__(32);
	var Splitter_1 = __webpack_require__(36);
	var Viewport_1 = __webpack_require__(39);
	var const_1 = __webpack_require__(5);
	var LayerTracker_1 = __webpack_require__(41);
	var Input_1 = __webpack_require__(31);
	var Animk = (function (_super) {
	    __extends(Animk, _super);
	    function Animk() {
	        var _this = _super.call(this) || this;
	        _this.paintCanvas = new PaintCanvas_1.PaintCanvas();
	        return _this;
	    }
	    Animk.prototype.initUI = function () {
	        var _this = this;
	        var vs = new Splitter_1.Splitter('v', 1600, 1000);
	        this.vSplitter = vs;
	        this.addChild(vs);
	        var vp = new Viewport_1.Viewport();
	        vs.setChild(vp);
	        var tk = new LayerTracker_1.LayerTracker();
	        this.tracker = tk;
	        vs.setChild(tk);
	        vs.setBarY(720);
	        vs.bar.addChild(tk.timestampBar);
	        this.vSplitter.on(const_1.BaseEvent.CHANGED, function (vs) {
	            _this.tracker.resize(vs.width, vs.child2Space);
	        });
	    };
	    Animk.prototype.init = function (stage, appInfo) {
	        this.projInfo = appInfo.newProject();
	        this.initUI();
	        stage.addChild(this);
	        this.initEvent();
	        this.onload();
	        this.test();
	    };
	    Animk.prototype.onload = function () {
	        this.projInfo.curComp.setCursor(1);
	    };
	    Animk.prototype.initEvent = function () {
	        var _this = this;
	        Input_1.input.on(Input_1.InputEvent.KEY_DOWN, function (e) {
	            var k = e.key;
	            var isCtrl = e.ctrlKey;
	            if (k == 'f') {
	                _this.projInfo.curComp.forward();
	            }
	            else if (k == 'd')
	                _this.projInfo.curComp.backward();
	        });
	    };
	    Animk.prototype.test = function () {
	        var p = new PngMaker_1.PngMaker();
	        var wintab = __webpack_require__(50);
	        this.tracker.vScroller.setMax(350);
	        this.tracker.vScroller.evt.on(const_1.BaseEvent.CHANGED, function (v) {
	            console.log('scroll changed', v);
	        });
	    };
	    return Animk;
	}(PIXI.Container));
	exports.Animk = Animk;
	exports.animk = new Animk();


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var EventDispatcher_1 = __webpack_require__(7);
	exports.InputEvent = {
	    MOUSE_DOWN: 'onmousedown',
	    MOUSE_MOVE: 'onmousemove',
	    MOUSE_UP: 'onmouseup',
	    KEY_UP: 'onkeyup',
	    KEY_DOWN: 'onkeydown',
	};
	exports.input = new EventDispatcher_1.EventDispatcher();
	window.onmousedown = function (e) {
	    e['mx'] = e.clientX;
	    e['my'] = e.clientY;
	    exports.input.emit(exports.InputEvent.MOUSE_DOWN, e);
	};
	window.onmousemove = function (e) {
	    e['mx'] = e.clientX;
	    e['my'] = e.clientY;
	    exports.input.emit(exports.InputEvent.MOUSE_MOVE, e);
	};
	window.onmouseup = function (e) {
	    e['mx'] = e.clientX;
	    e['my'] = e.clientY;
	    exports.input.emit(exports.InputEvent.MOUSE_UP, e);
	};
	window.onkeyup = function (e) {
	    exports.input.emit(exports.InputEvent.KEY_UP, e);
	};
	window.onkeydown = function (e) {
	    exports.input.emit(exports.InputEvent.KEY_DOWN, e);
	};


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Packer_1 = __webpack_require__(33);
	var PngMaker = (function () {
	    function PngMaker() {
	    }
	    PngMaker.prototype.createPng = function (w, h, path, callback) {
	        var packer = new Packer_1.Packer({
	            width: w,
	            depthInBytes: 1,
	            filterType: 0,
	            height: h
	        });
	        var pixelData = new Buffer(w * h * 4);
	        pixelData.fill(0);
	        packer.pack(pixelData, w, h, 1, path, callback);
	    };
	    PngMaker.prototype.transPng = function (w, h, path, callback) {
	        var packer = new Packer_1.Packer({
	            width: w,
	            depthInBytes: 1,
	            filterType: 0,
	            height: h
	        });
	        var pixelData = new Buffer(w * h * 4);
	        pixelData.fill(0);
	        var left = 20;
	        var top = 30;
	        var WhiteData = new Buffer(30 * 20 * 4);
	        WhiteData.fill(255);
	        for (var y = 0; y < h; y++) {
	            for (var x = 0; x < w; x++) {
	                if (x >= left && y >= top) {
	                    var idx = (w * y + x) << 2;
	                    var idxW = (30 * (y - top) + (x - left)) << 2;
	                    if (idxW > -1) {
	                        if (idxW == 0)
	                            console.log(this, "x", x, "y", y);
	                        pixelData[idx] = WhiteData[idxW];
	                        pixelData[idx + 1] = WhiteData[idxW + 1];
	                        pixelData[idx + 2] = WhiteData[idxW + 2];
	                        pixelData[idx + 3] = WhiteData[idxW + 3];
	                    }
	                }
	            }
	        }
	        packer.pack(pixelData, w, h, 1, path, callback);
	    };
	    PngMaker.transPixels = function (pixW, pixH, pix, left, top) {
	        var w = pixW + left;
	        var h = pixH + top;
	        var transPixels = new Buffer((w) * (h) * 4);
	        transPixels.fill(0);
	        for (var y = 0; y < h; y++) {
	            for (var x = 0; x < w; x++) {
	                if (x >= left && y >= top) {
	                    var idx = (w * y + x) << 2;
	                    var idxW = (pixW * (y - top) + (x - left)) << 2;
	                    if (idxW > -1) {
	                        transPixels[idx] = pix[idxW];
	                        transPixels[idx + 1] = pix[idxW + 1];
	                        transPixels[idx + 2] = pix[idxW + 2];
	                        transPixels[idx + 3] = pix[idxW + 3];
	                    }
	                }
	            }
	        }
	        return transPixels;
	    };
	    return PngMaker;
	}());
	exports.PngMaker = PngMaker;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var zlib = __webpack_require__(34);
	var Filter_1 = __webpack_require__(35);
	var writeBuffer = function (path, buffer, callback) {
	    var fs = __webpack_require__(20);
	    fs.open(path, 'w', null, function (err, fd) {
	        if (err) {
	            throw err;
	        }
	        fs.write(fd, buffer, 0, buffer.length, null, function (err) {
	            if (err) {
	                throw err;
	            }
	            fs.close(fd, function () {
	                callback();
	            });
	        });
	    });
	};
	var Packer = (function () {
	    function Packer(options) {
	        this.PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
	        this.TYPE_IHDR = 0x49484452;
	        this.TYPE_IDAT = 0x49444154;
	        this.TYPE_IEND = 0x49454e44;
	        this._options = options;
	        options.deflateChunkSize = options.deflateChunkSize || 32 * 1024;
	        options.deflateLevel = options.deflateLevel || 9;
	        options.deflateStrategy = options.deflateStrategy || 3;
	        this.initCrc();
	    }
	    Packer.prototype.initCrc = function () {
	        this.crcTable = [];
	        for (var i = 0; i < 256; i++) {
	            var c = i;
	            for (var j = 0; j < 8; j++) {
	                if (c & 1) {
	                    c = 0xedb88320 ^ (c >>> 1);
	                }
	                else {
	                    c = c >>> 1;
	                }
	            }
	            this.crcTable[i] = c;
	        }
	    };
	    Packer.prototype.pack = function (pixelData, width, height, depthInBytes, path, callback) {
	        var _this = this;
	        var bufs = [];
	        bufs.push(new Buffer(this.PNG_SIGNATURE));
	        bufs.push(this._packIHDR(width, height, depthInBytes));
	        var filter = new Filter_1.Filter(width, height, depthInBytes, 4, pixelData, this._options);
	        var dataFilter = filter.filter();
	        var deflate = zlib.createDeflate({
	            chunkSize: this._options.deflateChunkSize,
	            level: this._options.deflateLevel,
	            strategy: this._options.deflateStrategy
	        });
	        deflate.on('data', function (data) {
	            bufs.push(_this._packIDAT(data));
	        });
	        deflate.on('end', function () {
	            bufs.push(_this._packIEND());
	            var buffer = Buffer.concat(bufs);
	            writeBuffer(path, buffer, callback);
	        });
	        deflate.end(dataFilter);
	    };
	    Packer.prototype.write = function (path) {
	    };
	    Packer.prototype._packIHDR = function (width, height, depthInBytes) {
	        var buf = new Buffer(13);
	        buf.writeUInt32BE(width, 0);
	        buf.writeUInt32BE(height, 4);
	        buf[8] = depthInBytes * 8;
	        buf[9] = 6;
	        buf[10] = 0;
	        buf[11] = 0;
	        buf[12] = 0;
	        return this._packChunk(this.TYPE_IHDR, buf);
	    };
	    Packer.prototype._packIDAT = function (data) {
	        return this._packChunk(this.TYPE_IDAT, data);
	    };
	    Packer.prototype._packIEND = function () {
	        return this._packChunk(this.TYPE_IEND, null);
	    };
	    Packer.prototype._packChunk = function (type, data) {
	        var len = (data ? data.length : 0), buf = new Buffer(len + 12);
	        buf.writeUInt32BE(len, 0);
	        buf.writeUInt32BE(type, 4);
	        if (data)
	            data.copy(buf, 8);
	        buf.writeInt32BE(this.crc32(buf.slice(4, buf.length - 4)), buf.length - 4);
	        return buf;
	    };
	    Packer.prototype.crc32 = function (buf) {
	        var crc = -1;
	        for (var i = 0; i < buf.length; i++) {
	            crc = this.crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
	        }
	        return crc ^ -1;
	    };
	    return Packer;
	}());
	exports.Packer = Packer;


/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = require("zlib");

/***/ },
/* 35 */
/***/ function(module, exports) {

	"use strict";
	var Filter = (function () {
	    function Filter(width, height, depthInBytes, Bpp, data, options) {
	        this._width = width;
	        this._height = height;
	        this._depthInBytes = depthInBytes;
	        this._data = data;
	        this._options = options;
	        this._line = 0;
	        if (!('filterType' in options) || options.filterType == -1) {
	            options.filterType = [0, 1, 2, 3, 4];
	        }
	        else if (typeof options.filterType == 'number') {
	            options.filterType = [options.filterType];
	        }
	        this._filters = {
	            0: this._filterNone.bind(this),
	        };
	    }
	    Filter.prototype.filter = function () {
	        var pxData = this._data, rawData = new Buffer(((this._width << (2 + this._depthInBytes - 1)) + 1) * this._height);
	        for (var y = 0; y < this._height; y++) {
	            var filterTypes = this._options.filterType, min = Infinity, sel = 0;
	            for (var i = 0; i < filterTypes.length; i++) {
	                var sum = this._filters[filterTypes[i]](pxData, y, null);
	                if (sum < min) {
	                    sel = filterTypes[i];
	                    min = sum;
	                }
	            }
	            this._filters[sel](pxData, y, rawData);
	        }
	        return rawData;
	    };
	    Filter.prototype._filterNone = function (pxData, y, rawData) {
	        var pxRowLength = this._width << (2 + this._depthInBytes - 1), rawRowLength = pxRowLength + 1, sum = 0;
	        if (!rawData) {
	            for (var x = 0; x < pxRowLength; x++)
	                sum += Math.abs(pxData[y * pxRowLength + x]);
	        }
	        else {
	            rawData[y * rawRowLength] = 0;
	            pxData.copy(rawData, rawRowLength * y + 1, pxRowLength * y, pxRowLength * (y + 1));
	        }
	        return sum;
	    };
	    return Filter;
	}());
	exports.Filter = Filter;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Input_1 = __webpack_require__(31);
	var PixiEx_1 = __webpack_require__(37);
	var TweenEx_1 = __webpack_require__(38);
	var const_1 = __webpack_require__(5);
	var Splitter = (function (_super) {
	    __extends(Splitter, _super);
	    function Splitter(dir, width, height) {
	        var _this = _super.call(this) || this;
	        _this.barSpace = 40;
	        _this.colBg = 0x232323;
	        _this._w = width;
	        _this._h = height;
	        _this.dir = dir;
	        _this.bar = new PIXI.Sprite();
	        var lastMousePosX = -1, lastMousePosY = -1, isPress;
	        PixiEx_1.setupDrag(_this.bar, function (e) {
	            isPress = true;
	            TweenEx_1.TweenEx.delayedCall(200, function () {
	                console.log('mouse');
	                if (isPress) {
	                    lastMousePosY = e.my;
	                    lastMousePosX = e.mx;
	                    _this.bar.getChildAt(0).alpha = .6;
	                }
	            });
	        }, function (e) {
	            if (_this.dir == 'v') {
	                if (lastMousePosY > -1) {
	                    _this.setBarY(_this.bar.y + e.my - lastMousePosY);
	                    lastMousePosY = e.my;
	                    if (_this.child2) {
	                        _this.emit(const_1.BaseEvent.CHANGED, _this);
	                    }
	                }
	            }
	            else if (_this.dir == 'h') {
	                if (lastMousePosX > -1) {
	                    _this.bar.x += e.my - lastMousePosX;
	                    lastMousePosX = e.mx;
	                }
	            }
	        }, function (e) {
	            onUp(e);
	        });
	        var onUp = function (e) {
	            isPress = false;
	            lastMousePosX = -1;
	            lastMousePosY = -1;
	            _this.bar.getChildAt(0).alpha = 1;
	        };
	        Input_1.input.on(Input_1.InputEvent.MOUSE_UP, function (e) {
	            onUp(e);
	        });
	        _this.addChild(_this.bar);
	        _this.mask1 = new PIXI.Graphics().drawRect(0, 0, 1100, 1000);
	        _this.mask2 = PixiEx_1.PIXI_RECT(0x1c1c1c, 0, 0, 1000, 1000);
	        _this.addChild(_this.mask2);
	        _this.resize(width, height);
	        return _this;
	    }
	    Object.defineProperty(Splitter.prototype, "width", {
	        get: function () { return this._w; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Splitter.prototype, "height", {
	        get: function () { return this._h; },
	        enumerable: true,
	        configurable: true
	    });
	    Splitter.prototype.setBarY = function (by) {
	        this.bar.y = by;
	        this.child1Space = by;
	        this.child2Space = this.height - by - this.barSpace;
	        this.mask1.height = by;
	        if (this.child2) {
	            this.child2.y = by + this.barSpace;
	        }
	        this.mask2.y = this.bar.y + this.barSpace;
	        this.mask2.height = this.child2Space;
	    };
	    Splitter.prototype._setBarX = function (bx) {
	        this.bar.x = bx;
	        this.child1Space = bx;
	        this.child2Space = this.width - bx - this.barSpace;
	    };
	    Splitter.prototype.setChild = function (child) {
	        if (!this.child1) {
	            this.child1 = child;
	            this.addChildAt(child, 0);
	        }
	        else if (!this.child2) {
	            this.child2 = child;
	            this.addChild(child);
	            if (this.dir == 'v') {
	                child.y = this.child1Space + this.barSpace;
	            }
	            else if (this.dir == 'h') {
	                child.x = this.child1Space + this.barSpace;
	            }
	        }
	        this.addChild(this.bar);
	    };
	    Splitter.prototype.resize = function (width, height) {
	        if (this.dir == 'v') {
	            this.setBarY(height / 2);
	            if (!this.bar.children.length)
	                this.bar.addChild(new PIXI.Graphics()
	                    .beginFill(this.colBg)
	                    .drawRect(0, 0, width, this.barSpace));
	            this.mask1.width = width;
	            this.mask2.width = width;
	        }
	        else if (this.dir == 'h') {
	            this._setBarX(width / 2);
	            this.mask1.height = height;
	            this.mask2.height = height;
	            if (!this.bar.children.length)
	                this.bar.addChild(new PIXI.Graphics()
	                    .beginFill(this.colBg)
	                    .drawRect(0, 0, this.barSpace, height));
	        }
	    };
	    return Splitter;
	}(PIXI.Container));
	exports.Splitter = Splitter;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var JsFunc_1 = __webpack_require__(4);
	function imgToTex(img) {
	    return new PIXI.Texture(new PIXI.BaseTexture(img));
	}
	exports.imgToTex = imgToTex;
	function makeSprite(parameters) {
	    var url = parameters.url;
	    var isCrossOrigin = parameters.isCrossOrigin;
	    var callback = parameters.callback;
	    var s = new PIXI.Sprite();
	    loadRes(url, function (img) {
	        s.texture = imgToTex(img);
	        if (callback)
	            callback(s);
	    }, isCrossOrigin);
	    return s;
	}
	function loadRes(url, callback, isCrossOrigin) {
	    if (isCrossOrigin) {
	        var req_1 = new XMLHttpRequest();
	        req_1.open('GET', url, true);
	        req_1.onload = function (res) {
	            JsFunc_1.loadImg(req_1.responseText, callback);
	        };
	        req_1.send();
	    }
	    else {
	        JsFunc_1.loadImg(url, callback);
	    }
	}
	exports.loadRes = loadRes;
	var _nullTex = imgToTex(null);
	function makeTilingSprite(options) {
	    var width = options.width;
	    var height = options.height;
	    var url = options.url;
	    var callback = options.callback;
	    var isCrossOrigin = options.isCrossOrigin;
	    loadRes(url, function (img) {
	        t.texture = imgToTex(img);
	        if (callback)
	            callback(t);
	    }, isCrossOrigin);
	    var t = new PIXI.extras.TilingSprite(_nullTex, width, height);
	    return t;
	}
	function newBitmap(options) {
	    var isTiling = options.isTiling;
	    var s;
	    if (isTiling) {
	        s = makeTilingSprite(options);
	    }
	    else {
	        s = makeSprite(options);
	    }
	    s.x = options.x ? options.x : 0;
	    s.y = options.y ? options.y : 0;
	    return s;
	}
	exports.newBitmap = newBitmap;
	var BitmapText = (function (_super) {
	    __extends(BitmapText, _super);
	    function BitmapText(options) {
	        var _this = _super.call(this) || this;
	        _this.mapSprite = {};
	        var text = options.text;
	        _this.animations = options.animations;
	        _this.frames = options.frames;
	        _this.digis = {};
	        _this._digiCtn = new PIXI.Container;
	        _this.addChild(_this._digiCtn);
	        _this.text = text;
	        if (options.texture) {
	            _this._tex = options.texture;
	            _this.updateTex();
	        }
	        else if (options.img) {
	            loadRes(options.img, function (img) {
	                _this._tex = imgToTex(img);
	                _this.updateTex();
	            });
	        }
	        return _this;
	    }
	    BitmapText.prototype.updateTex = function () {
	        for (var k in this.digis) {
	            var digi = this.digis[k];
	            digi['sp'].texture = this._tex;
	        }
	    };
	    Object.defineProperty(BitmapText.prototype, "text", {
	        set: function (v) {
	            var digiIdx = 0;
	            var num = v.charAt(digiIdx);
	            while (num != '') {
	                var idx = this.animations[num];
	                if (idx > -1) {
	                    var frame = this.frames[idx];
	                    var ofsX = frame[0];
	                    var ofsY = frame[1];
	                    if (!this._frameWidth)
	                        this._frameWidth = frame[2];
	                    if (!this._frameHeight)
	                        this._frameHeight = frame[3];
	                    if (!this.digis[digiIdx]) {
	                        this.digis[digiIdx] = this._makeFrame(this._frameWidth, this._frameHeight);
	                    }
	                    var digiFrame = this.digis[digiIdx];
	                    digiFrame.x = digiIdx * this._frameWidth;
	                    digiFrame['idx'] = digiIdx;
	                    digiFrame['sp'].x = -ofsX;
	                    digiFrame['sp'].y = -ofsY;
	                    digiIdx += 1;
	                    num = v.charAt(digiIdx);
	                }
	            }
	            this._digiWidth = (digiIdx - 1) * this._frameWidth;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(BitmapText.prototype, "align", {
	        set: function (align) {
	            console.log('align right', this._digiWidth);
	            if (align == 'left') {
	                this._digiCtn.x = 0;
	            }
	            else if (align == 'center') {
	                this._digiCtn.x = -this._digiWidth * .5;
	            }
	            else if (align == 'right') {
	                this._digiCtn.x = -this._digiWidth;
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    BitmapText.prototype._makeFrame = function (width, height) {
	        var ctn = new PIXI.Container;
	        this._digiCtn.addChild(ctn);
	        var msk = new PIXI.Graphics;
	        msk.beginFill(0xff0000)
	            .drawRect(0, 0, width, height)
	            .endFill();
	        ctn.addChild(msk);
	        var s = new PIXI.Sprite(this._tex);
	        ctn.addChild(s);
	        s.mask = msk;
	        ctn['sp'] = s;
	        return ctn;
	    };
	    return BitmapText;
	}(PIXI.Container));
	exports.BitmapText = BitmapText;
	exports.newWhiteMask = function (url) {
	    var sp = newBitmap({
	        url: url, callback: function () {
	            var filter = new PIXI.filters.ColorMatrixFilter();
	            filter.brightness(100);
	            sp.filters = [filter];
	            sp.cacheAsBitmap = true;
	        }
	    });
	    return sp;
	};
	exports.makeColorRatio = function (colorArr, ratioArr) {
	    var a = [];
	    for (var i = 0; i < colorArr.length; i++) {
	        var col = colorArr[i];
	        for (var j = 0; j < ratioArr[i]; j++) {
	            a.push(col);
	        }
	    }
	    return a;
	};
	var TextEx = (function (_super) {
	    __extends(TextEx, _super);
	    function TextEx() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    Object.defineProperty(TextEx.prototype, "text", {
	        set: function (t) {
	            this._text = t;
	            if (this.align == 'center') {
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return TextEx;
	}(PIXI.Text));
	exports.setPivot = function (obj, x, y) {
	    obj.pivot = new PIXI.Point(x, y);
	    obj.x += x;
	    obj.y += y;
	};
	exports.PIXI_MOUSE_EVENT = {
	    down: 'mousedown',
	    wheel: 'mousewheel',
	    move: 'mousemove',
	    up: 'mouseup',
	    click: 'click',
	};
	exports.setupDrag = function (obj, onDown, onMove, onUp) {
	    obj.interactive = true;
	    obj.on(exports.PIXI_MOUSE_EVENT.down, function (e) {
	        e.mx = e.data.originalEvent.clientX;
	        e.my = e.data.originalEvent.clientY;
	        onDown(e);
	    });
	    obj.on(exports.PIXI_MOUSE_EVENT.move, function (e) {
	        e.mx = e.data.originalEvent.clientX;
	        e.my = e.data.originalEvent.clientY;
	        onMove(e);
	    });
	    obj.on(exports.PIXI_MOUSE_EVENT.up, function (e) {
	        e.mx = e.data.originalEvent.clientX;
	        e.my = e.data.originalEvent.clientY;
	        onUp(e);
	    });
	};
	exports.PIXI_RECT = function (col, x, y, w, h) {
	    return new PIXI.Graphics().beginFill(col).drawRect(x, y, w, h);
	};
	exports.isIn = function (pos, obj) {
	    var x, y;
	    if (pos['mx'] != undefined && pos['my'] != undefined) {
	        x = pos['mx'];
	        y = pos['my'];
	    }
	    else if (pos['x'] != undefined && pos['y'] != undefined) {
	        x = pos['x'];
	        y = pos['y'];
	    }
	    var objPos = obj.toGlobal(new PIXI.Point(0, 0));
	    return x > objPos.x && x < objPos.x + obj['width'] && y > objPos.y && y < objPos.y + obj['height'];
	};
	exports.MakeMatrixGraphics = function (alphaM, color, g, ofsX, ofsY) {
	    if (ofsX === void 0) { ofsX = 0; }
	    if (ofsY === void 0) { ofsY = 0; }
	    for (var i = 0; i < alphaM.length; i++) {
	        var s = alphaM[i];
	        for (var j = 0; j < s.length; j++) {
	            var c = s.charAt(j);
	            if (c !== ' ') {
	                var a;
	                c == '.' ? a = 1 : a = Number(c) / 10;
	                g.beginFill(color, a);
	                g.drawRect(ofsX + j, ofsY + i, 1, 1);
	            }
	        }
	    }
	    g.endFill();
	};


/***/ },
/* 38 */
/***/ function(module, exports) {

	"use strict";
	var TweenEx = (function () {
	    function TweenEx(target) {
	        this.target = target;
	        this.eventArr = [];
	    }
	    TweenEx.prototype.to = function (vars, duration) {
	        this.eventArr.push({ event: 'to', data: { vars: vars, duration: duration } });
	        return this;
	    };
	    TweenEx.prototype.delay = function (duration) {
	        this.eventArr.push({ event: 'delay', data: { duration: duration } });
	        return this;
	    };
	    TweenEx.prototype.update = function (callback) {
	        this.updateFunc = callback;
	        return this;
	    };
	    TweenEx.prototype.start = function () {
	        var _this = this;
	        var run = function () {
	            var e = _this.eventArr.shift();
	            if (e) {
	                if (e.event == 'to') {
	                    var fromVars_1 = {};
	                    for (var k in e.data.vars) {
	                        fromVars_1[k] = _this.target[k];
	                    }
	                    new TWEEN.Tween(fromVars_1)
	                        .to(e.data.vars, e.data.duration)
	                        .onUpdate(function () {
	                        for (var k in e.data.vars) {
	                            _this.target[k] = fromVars_1[k];
	                        }
	                        if (_this.updateFunc)
	                            _this.updateFunc(_this.target);
	                    })
	                        .onComplete(function () {
	                        run();
	                    })
	                        .start();
	                }
	                else if (e.event == 'delay') {
	                    new TWEEN.Tween({ _: 0 })
	                        .to({ _: 0 }, e.data.duration)
	                        .onComplete(function () {
	                        run();
	                    })
	                        .start();
	                }
	                else if (e.event == 'call') {
	                    e.data.callback(_this);
	                    run();
	                }
	            }
	            else {
	                _this.target = null;
	                _this.eventArr = null;
	                _this.vars = null;
	            }
	        };
	        run();
	        return this;
	    };
	    TweenEx.prototype.call = function (callback) {
	        if (callback)
	            this.eventArr.push({ event: 'call', data: { callback: callback } });
	        return this;
	    };
	    TweenEx.to = function (target, duration, vars, callback) {
	        return new TweenEx(target)
	            .to(vars, duration)
	            .call(callback)
	            .start();
	    };
	    TweenEx.delayedCall = function (duration, callback) {
	        new TweenEx({ _: 0 })
	            .delay(duration)
	            .call(callback)
	            .start();
	    };
	    return TweenEx;
	}());
	exports.TweenEx = TweenEx;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var PixiEx_1 = __webpack_require__(37);
	var const_1 = __webpack_require__(5);
	var CompView_1 = __webpack_require__(40);
	var Viewport = (function (_super) {
	    __extends(Viewport, _super);
	    function Viewport() {
	        var _this = _super.call(this) || this;
	        _this.compView = new CompView_1.CompView(const_1.ViewConst.COMP_WIDTH, const_1.ViewConst.COMP_HEIGHT);
	        _this.compView.x = 20;
	        _this.compView.y = 20;
	        _this.addChild(_this.compView);
	        _this.on(PixiEx_1.PIXI_MOUSE_EVENT.wheel, function (e) {
	        });
	        return _this;
	    }
	    return Viewport;
	}(PIXI.Container));
	exports.Viewport = Viewport;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var JsFunc_1 = __webpack_require__(4);
	var PixiEx_1 = __webpack_require__(37);
	var Animk_1 = __webpack_require__(30);
	var const_1 = __webpack_require__(5);
	var CompView = (function (_super) {
	    __extends(CompView, _super);
	    function CompView(width, height) {
	        var _this = _super.call(this) || this;
	        _this._imgMap = {};
	        _this._spArr = [];
	        _this._bg = PixiEx_1.PIXI_RECT(0, 0, 0, const_1.ViewConst.COMP_WIDTH, const_1.ViewConst.COMP_HEIGHT);
	        _this.addChild(_this._bg);
	        _this._spCtn = new PIXI.Container();
	        _this.addChild(_this._spCtn);
	        _this.initEvent();
	        return _this;
	    }
	    CompView.prototype._newSp = function () {
	        var sp = new PIXI.Sprite();
	        this.addChild(sp);
	        this._spArr.push(sp);
	    };
	    CompView.prototype.initEvent = function () {
	        var _this = this;
	        Animk_1.animk.projInfo.curComp.on(const_1.CompInfoEvent.UPDATE_CURSOR, function (frame) {
	            var trackInfoArr = Animk_1.animk.projInfo.curComp.trackInfoArr;
	            while (_this._spArr.length < trackInfoArr.length)
	                _this._newSp();
	            var renderTrack = function (i) {
	                var tInfo = trackInfoArr[i];
	                if (tInfo) {
	                    var filename = tInfo.getFrameByCursor(frame);
	                    if (filename) {
	                        _this._spArr[i].visible = true && tInfo.enable();
	                        console.log('udpate comp view', frame, filename, trackInfoArr.length);
	                        if (!_this._imgMap[filename]) {
	                            JsFunc_1.loadImg(filename, function (img) {
	                                _this._imgMap[filename] = PixiEx_1.imgToTex(img);
	                                _this._spArr[i].texture = _this._imgMap[filename];
	                                renderTrack(i + 1);
	                            });
	                        }
	                        else {
	                            _this._spArr[i].texture = _this._imgMap[filename];
	                            renderTrack(i + 1);
	                        }
	                    }
	                    else {
	                        _this._spArr[i].visible = false;
	                        renderTrack(i + 1);
	                    }
	                }
	            };
	            renderTrack(0);
	        });
	    };
	    return CompView;
	}(PIXI.Container));
	exports.CompView = CompView;


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Scroller_1 = __webpack_require__(46);
	var const_1 = __webpack_require__(5);
	var Command_1 = __webpack_require__(23);
	var Stacker_1 = __webpack_require__(47);
	var TimestampBar_1 = __webpack_require__(42);
	var LayerTracker = (function (_super) {
	    __extends(LayerTracker, _super);
	    function LayerTracker() {
	        var _this = _super.call(this) || this;
	        _this.timestampBar = new TimestampBar_1.TimestampBar();
	        _this.timestampBar.x = 200 + 15;
	        var hs = new Scroller_1.Scroller('h', 600, 0, 100);
	        hs.x = 200 + 15;
	        _this.addChild(hs);
	        _this.hScroller = hs;
	        _this.hScroller.evt.on(const_1.BaseEvent.CHANGED, function (v) {
	            console.log('scroll', v);
	            for (var i = 0; i < _this.stackerArr.length; i++) {
	                var s = _this.stackerArr[i];
	                s.scroll(v);
	            }
	            _this.timestampBar.scroll(v);
	        });
	        _this.stackerCtn = new PIXI.Container();
	        _this.stackerCtn.y = _this.hScroller.height;
	        _this.addChild(_this.stackerCtn);
	        _this.stackerArr = [];
	        _this.vScroller = new Scroller_1.Scroller('v', 300, 0, 100);
	        _this.vScroller.x = 200;
	        _this.vScroller.y = _this.hScroller.height;
	        _this.vScroller.evt.on(const_1.BaseEvent.CHANGED, function (v) {
	        });
	        _this.addChild(_this.vScroller);
	        _this.addChild(_this.timestampBar);
	        _this.initCmd();
	        return _this;
	    }
	    LayerTracker.prototype.initCmd = function () {
	        var _this = this;
	        Command_1.cmd.on(const_1.CompInfoEvent.NEW_TRACK, function (tInfo) {
	            var s = _this.newStacker(tInfo);
	        });
	    };
	    LayerTracker.prototype.newStacker = function (trackInfo) {
	        var s = new Stacker_1.Stacker(trackInfo);
	        this.stackerCtn.addChild(s);
	        this.stackerArr.push(s);
	        this._updateVPos();
	        return s;
	    };
	    LayerTracker.prototype._updateVPos = function () {
	        var s;
	        for (var i = 0; i < this.stackerArr.length; i++) {
	            s = this.stackerArr[this.stackerArr.length - 1 - i];
	            s.y = (s.height + 1) * i;
	        }
	    };
	    LayerTracker.prototype.resize = function (width, height) {
	        this.vScroller.setMax(height - this.hScroller.height);
	        this.hScroller.setMax(width - 200 - 15);
	        this.timestampBar.resize(width - 200 - 15, height);
	    };
	    return LayerTracker;
	}(PIXI.Container));
	exports.LayerTracker = LayerTracker;


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Input_1 = __webpack_require__(31);
	var PixiEx_1 = __webpack_require__(37);
	var Animk_1 = __webpack_require__(30);
	var Button_1 = __webpack_require__(43);
	var const_1 = __webpack_require__(5);
	var Color_1 = __webpack_require__(44);
	var TimestampBar = (function (_super) {
	    __extends(TimestampBar, _super);
	    function TimestampBar() {
	        var _this = _super.call(this) || this;
	        _this.cursorPos = 0;
	        _this.textCtn = new PIXI.Container();
	        _this.addChild(_this.textCtn);
	        _this.gTick = new PIXI.Graphics();
	        _this.addChild(_this.gTick);
	        _this.gMask = new PIXI.Graphics().drawRect(0, 0, 1600, _this.height);
	        _this.addChild(_this.gMask);
	        _this.gTick.mask = _this.gMask;
	        var m2 = [
	            '7.........7',
	            '...........',
	            '...........',
	            '...........',
	            '...........',
	            '...........',
	            '9...   ...9',
	            '5.... ....5',
	            ' 4... ...4 ',
	            ' 18.. ..81 ',
	            '  3.. ..3  ',
	            '   6. .6   ',
	            '   19 91   ',
	        ];
	        _this.gCursor = new PIXI.Graphics();
	        PixiEx_1.MakeMatrixGraphics(m2, Color_1.Col.cursor, _this.gCursor, -6, 0);
	        _this.gCursor
	            .lineStyle(1, Color_1.Col.cursor)
	            .moveTo(0, 15)
	            .lineTo(0, 500);
	        _this.gCursor.cacheAsBitmap = true;
	        _this.gCursor.y = 25;
	        _this.addChild(_this.gCursor);
	        Input_1.input.on(Input_1.InputEvent.MOUSE_UP, function (e) {
	            var a = e.mx - _this.x - _this.gTick.x;
	            var thisPos = _this.toGlobal(new PIXI.Point(_this.x, _this.y));
	            var fw = Animk_1.animk.projInfo.frameWidth();
	            if (e.my > thisPos.y && e.my < thisPos.y + _this.height) {
	                if (a > 0) {
	                    Animk_1.animk.projInfo.curComp.setCursor(Math.floor((a) / fw));
	                }
	            }
	        });
	        _this.gBg = new PIXI.Graphics()
	            .beginFill(Color_1.Col.panelBg)
	            .drawRect(0, 0, 215, 40);
	        _this.gBg.x = -215;
	        _this.addChild(_this.gBg);
	        var newTrackBtn = new Button_1.Button({ text: "new" });
	        newTrackBtn.x = -100;
	        newTrackBtn.on(PixiEx_1.PIXI_MOUSE_EVENT.up, function () {
	            var dialog = __webpack_require__(45).remote.dialog;
	            var ret = dialog.showOpenDialog({
	                properties: ['openFile'], filters: [
	                    { name: 'Images(png)', extensions: ['png'] },
	                    { name: 'All Files', extensions: ['*'] }
	                ]
	            });
	            if (ret && ret.length == 1)
	                Animk_1.animk.projInfo.curComp.newTrack(ret[0]);
	        });
	        _this.addChild(newTrackBtn);
	        _this.initEvent();
	        _this.resize(1600, _this.height);
	        return _this;
	    }
	    TimestampBar.prototype.initEvent = function () {
	        var _this = this;
	        Animk_1.animk.projInfo.curComp.on(const_1.CompInfoEvent.UPDATE_CURSOR, function (frame) {
	            var fw = Animk_1.animk.projInfo.frameWidth();
	            _this.cursorPos = frame * fw;
	            _this.gCursor.x = _this.gTick.x + _this.cursorPos;
	        });
	    };
	    TimestampBar.prototype.resize = function (width, height) {
	        this.textCtn.removeChildren();
	        this.gMask.clear();
	        this.gMask.drawRect(0, 0, width, height);
	        this.gTick.clear();
	        this.gTick.lineStyle(1, Color_1.Col.tick);
	        var ts = { fill: Color_1.Col.tickText, fontSize: '12px' };
	        var fw = Animk_1.animk.projInfo.frameWidth();
	        var frame = 0;
	        for (var i = 0; i < width; i += fw) {
	            this.gTick.moveTo(i, 35);
	            this.gTick.lineTo(i, fw);
	            var textTick = new PIXI.Text(frame + '', ts);
	            textTick.x = i - textTick.width * .5;
	            textTick.y = 13;
	            this.textCtn.addChild(textTick);
	            frame++;
	        }
	    };
	    TimestampBar.prototype.scroll = function (v) {
	        this.gTick.x = -v;
	        this.gCursor.x = this.gTick.x + this.cursorPos;
	        this.textCtn.x = -v;
	    };
	    Object.defineProperty(TimestampBar.prototype, "height", {
	        get: function () {
	            return 40;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return TimestampBar;
	}(PIXI.Sprite));
	exports.TimestampBar = TimestampBar;


/***/ },
/* 43 */
/***/ function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Button = (function (_super) {
	    __extends(Button, _super);
	    function Button(option) {
	        var _this = _super.call(this) || this;
	        var t = option.text || 'button';
	        var w = option.width || 70;
	        var h = option.height || 30;
	        _this.interactive = true;
	        _this.buttonMode = true;
	        _this._bg = new PIXI.Graphics().beginFill(0x333333).drawRect(0, 0, w, h);
	        _this.addChild(_this._bg);
	        var ts = {
	            fontSize: '12px',
	            fontStyle: 'normal',
	            fontWeight: 'bold',
	            fill: 0xaaaaaa
	        };
	        _this._label = new PIXI.Text(t, ts);
	        _this.addChild(_this._label);
	        _this.resize(w, h);
	        return _this;
	    }
	    Button.prototype.resize = function (width, height) {
	        this._label.x = (width - this._label.width) * .5;
	        this._label.y = (height - this._label.height) * .5;
	    };
	    return Button;
	}(PIXI.Container));
	exports.Button = Button;


/***/ },
/* 44 */
/***/ function(module, exports) {

	"use strict";
	var Col;
	(function (Col) {
	    Col[Col["panelBg"] = 2302755] = "panelBg";
	    Col[Col["cursor"] = 2985195] = "cursor";
	    Col[Col["tick"] = 9539985] = "tick";
	    Col[Col["tickText"] = 9539985] = "tickText";
	    Col[Col["trackText"] = 10921638] = "trackText";
	})(Col = exports.Col || (exports.Col = {}));
	exports.newStyle = function () {
	    return {
	        fontFamily: "Microsoft Yahei",
	        fontSize: '12px',
	        fill: null
	    };
	};


/***/ },
/* 45 */
/***/ function(module, exports) {

	module.exports = require("electron");

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Input_1 = __webpack_require__(31);
	var const_1 = __webpack_require__(5);
	var EventDispatcher_1 = __webpack_require__(7);
	var PixiEx_1 = __webpack_require__(37);
	var Scroller = (function (_super) {
	    __extends(Scroller, _super);
	    function Scroller(dir, max, minValue, maxValue) {
	        var _this = _super.call(this) || this;
	        _this.lastMousePosX = -1;
	        _this.lastMousePosY = -1;
	        _this.dir = dir;
	        _this.max = max;
	        _this.minValue = minValue;
	        _this.maxValue = maxValue;
	        _this.evt = new EventDispatcher_1.EventDispatcher();
	        var w, h;
	        var tw, th;
	        if (dir == 'v') {
	            h = max;
	            w = Scroller.ScrollerHeight;
	            th = 100;
	            tw = Scroller.ScrollerHeight - 2;
	        }
	        else if (dir == 'h') {
	            w = max;
	            h = Scroller.ScrollerHeight;
	            tw = 100;
	            th = Scroller.ScrollerHeight - 2;
	        }
	        _this.bg = new PIXI.Graphics().beginFill(0x2e2e2e).drawRect(0, 0, w, h);
	        _this.addChild(_this.bg);
	        _this.thumb = new PIXI.Graphics().beginFill(0x505050).drawRect(0, 0, tw, th);
	        _this.addChild(_this.thumb);
	        PixiEx_1.setupDrag(_this.thumb, function (e) {
	            _this.lastMousePosY = e.data.originalEvent.clientY;
	            _this.lastMousePosX = e.data.originalEvent.clientX;
	            _this.thumb.alpha = .8;
	        }, function (e) {
	            if (_this.dir == 'v') {
	                if (_this.lastMousePosY > -1) {
	                    _this.thumb.y += e.my - _this.lastMousePosY;
	                    if (_this.thumb.y < 0)
	                        _this.thumb.y = 0;
	                    else if (_this.thumb.y + _this.thumb.height > _this.max)
	                        _this.thumb.y = _this.max - _this.thumb.height;
	                    else {
	                        _this.lastMousePosY = e.my;
	                        _this.evt.emit(const_1.BaseEvent.CHANGED, _this.value);
	                    }
	                }
	            }
	            else if (_this.dir == 'h') {
	                if (_this.lastMousePosX > -1) {
	                    _this.thumb.x += e.mx - _this.lastMousePosX;
	                    if (_this.thumb.x < 0)
	                        _this.thumb.x = 0;
	                    else if (_this.thumb.x + _this.thumb.width > _this.max)
	                        _this.thumb.x = _this.max - _this.thumb.width;
	                    else {
	                        _this.lastMousePosX = e.mx;
	                        _this.evt.emit(const_1.BaseEvent.CHANGED, _this.value);
	                    }
	                }
	            }
	        }, function (e) {
	            _this.lastMousePosX = -1;
	            _this.lastMousePosY = -1;
	            _this.thumb.alpha = 1;
	        });
	        Input_1.input.on(Input_1.InputEvent.MOUSE_UP, function () {
	            _this.lastMousePosX = -1;
	            _this.lastMousePosY = -1;
	            _this.thumb.alpha = 1;
	        });
	        return _this;
	    }
	    Object.defineProperty(Scroller.prototype, "value", {
	        get: function () {
	            if (this.dir == 'v')
	                return this.thumb.y / (this.max - this.thumb.height) * (this.maxValue - this.minValue);
	            if (this.dir == 'h')
	                return this.thumb.x / (this.max - this.thumb.width) * (this.maxValue - this.minValue);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Scroller.prototype.setMax = function (v) {
	        this.max = v;
	        if (this.dir == 'v') {
	            this.bg.height = v;
	        }
	        else if (this.dir == 'h') {
	            this.bg.width = v;
	        }
	    };
	    Scroller.prototype.setThumb = function (v) {
	        if (this.dir == 'v') {
	            this.thumb.height = v;
	        }
	        else if (this.dir == 'h') {
	            this.thumb.width = v;
	        }
	    };
	    Scroller.prototype.setRange = function (minValue, maxValue) {
	        this.minValue = minValue;
	        this.maxValue = maxValue;
	    };
	    return Scroller;
	}(PIXI.Container));
	Scroller.ScrollerHeight = 15;
	exports.Scroller = Scroller;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Slider_1 = __webpack_require__(51);
	var CheckBox_1 = __webpack_require__(48);
	var PixiEx_1 = __webpack_require__(37);
	var Color_1 = __webpack_require__(44);
	var Animk_1 = __webpack_require__(30);
	var const_1 = __webpack_require__(5);
	var Clip_1 = __webpack_require__(49);
	var Stacker = (function (_super) {
	    __extends(Stacker, _super);
	    function Stacker(trackInfo) {
	        var _this = _super.call(this) || this;
	        _this.scrollX = 0;
	        _this.clipStart = 1;
	        _this.trackInfo = trackInfo;
	        _this.bg = new PIXI.Graphics().beginFill(0x343434).drawRect(0, 0, 500, 60);
	        _this.addChild(_this.bg);
	        _this.clipCtn = new PIXI.Container();
	        _this.clipCtn.x = 215;
	        _this.addChild(_this.clipCtn);
	        var clip = new Clip_1.Clip(trackInfo);
	        _this.clip = clip;
	        _this.clipCtn.addChild(clip);
	        _this.addChild(PixiEx_1.PIXI_RECT(0x343434, 0, 0, 200, 60));
	        var nts = { fill: Color_1.Col.trackText, fontSize: '15px' };
	        var nt = new PIXI.Text(trackInfo.name(), nts);
	        nt.y = 5;
	        nt.x = 10;
	        _this.nameText = nt;
	        _this.addChild(_this.nameText);
	        var cb = new CheckBox_1.CheckBox();
	        cb.x = 150;
	        cb.y = 5;
	        cb.checked = true;
	        cb.on(const_1.BaseEvent.CHANGED, function (v) {
	            _this.trackInfo.enable(v);
	        });
	        _this.addChild(cb);
	        var vs = new Slider_1.Slider(0, 100, 100);
	        vs.x = 50;
	        vs.y = 40;
	        _this.addChild(vs);
	        _this.initEvent();
	        _this.scroll(0);
	        return _this;
	    }
	    Stacker.prototype.initEvent = function () {
	        var _this = this;
	        this.trackInfo.on(const_1.TrackInfoEvent.PUSH_FRAME, function (frameInfo) {
	            var fw = Animk_1.animk.projInfo.curComp.frameWidth;
	            var s = PixiEx_1.newBitmap({ url: frameInfo.filename, x: (frameInfo.idx() - 1) * fw, y: 16 });
	            s.width = fw - 1;
	            s.height = fw - 1;
	            var bg = PixiEx_1.PIXI_RECT(0xffffff, 0, 0, s.width, s.height);
	            bg.x = s.x;
	            bg.y = s.y;
	            _this.clip.addChild(bg);
	            _this.clip.addChild(s);
	            _this.clip.resize();
	        });
	    };
	    Stacker.prototype.scroll = function (v) {
	        console.log('scroll', v);
	        this.scrollX = v;
	        var fw = Animk_1.animk.projInfo.curComp.frameWidth;
	        this.clip.x = -this.scrollX + (this.trackInfo.start()) * fw;
	    };
	    return Stacker;
	}(PIXI.Container));
	exports.Stacker = Stacker;


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var PixiEx_1 = __webpack_require__(37);
	var const_1 = __webpack_require__(5);
	var Color_1 = __webpack_require__(44);
	var CheckBox = (function (_super) {
	    __extends(CheckBox, _super);
	    function CheckBox() {
	        var _this = _super.call(this) || this;
	        var r = 3;
	        var bg = new PIXI.Graphics().beginFill(Color_1.Col.panelBg)
	            .lineStyle(2, 0x8a8a8a)
	            .drawRoundedRect(r, r, 20 - r * 2, 20 - r * 2, r);
	        _this.addChild(bg);
	        _this.gCheck = PixiEx_1.PIXI_RECT(0x8a8a8a, 7, 7, 6, 6);
	        _this.addChild(_this.gCheck);
	        _this.checked = false;
	        _this.interactive = true;
	        _this.on(PixiEx_1.PIXI_MOUSE_EVENT.up, function (e) {
	            if (PixiEx_1.isIn(e, _this))
	                _this.checked = !_this.checked;
	        });
	        return _this;
	    }
	    Object.defineProperty(CheckBox.prototype, "width", {
	        get: function () {
	            return 20;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(CheckBox.prototype, "height", {
	        get: function () {
	            return 20;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(CheckBox.prototype, "checked", {
	        get: function () {
	            return this.gCheck.visible;
	        },
	        set: function (v) {
	            this.gCheck.visible = v;
	            this.emit(const_1.BaseEvent.CHANGED, v);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return CheckBox;
	}(PIXI.Container));
	exports.CheckBox = CheckBox;


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Input_1 = __webpack_require__(31);
	var PixiEx_1 = __webpack_require__(37);
	var Animk_1 = __webpack_require__(30);
	var const_1 = __webpack_require__(5);
	var Clip = (function (_super) {
	    __extends(Clip, _super);
	    function Clip(trackInfo) {
	        var _this = _super.call(this) || this;
	        _this.trackInfo = trackInfo;
	        _this.bg = PixiEx_1.PIXI_RECT(0, 0, 0, 1, 55);
	        _this.addChild(_this.bg);
	        _this.header = new PIXI.Graphics()
	            .beginFill(0x2f2f2f).drawRect(0, 0, 1, 15)
	            .beginFill(0x343434).drawRect(0, 0, 1, 1)
	            .beginFill(0x383838).drawRect(0, 0, 1, 2);
	        _this.addChild(_this.header);
	        _this.header.interactive = true;
	        _this.header.buttonMode = true;
	        var lastX = null, dtX, flag = 1;
	        PixiEx_1.setupDrag(_this.header, function (e) {
	            lastX = e.mx;
	        }, function (e) {
	            if (lastX != null) {
	                dtX = e.mx - lastX;
	                dtX > 0 ? flag = 1 : flag = -1;
	                dtX = Math.abs(dtX);
	                var fw = Animk_1.animk.projInfo.frameWidth();
	                var cx;
	                if (dtX > fw) {
	                    trackInfo.start(trackInfo.start() + flag * Math.floor(dtX / fw));
	                    lastX = e.mx;
	                }
	            }
	        }, function () {
	            lastX = null;
	        });
	        Input_1.input.on(Input_1.InputEvent.MOUSE_UP, function () {
	            lastX = null;
	        });
	        trackInfo.on(const_1.TrackInfoEvent.SET_TRACK_START, function (start) {
	            var fw = Animk_1.animk.projInfo.frameWidth();
	            _this.x = start * fw;
	        });
	        return _this;
	    }
	    Clip.prototype.resize = function () {
	        this.bg.width = this.width;
	        this.header.width = this.width;
	    };
	    return Clip;
	}(PIXI.Container));
	exports.Clip = Clip;


/***/ },
/* 50 */
/***/ function(module, exports) {

	module.exports = require("addon/node-wintab");

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Input_1 = __webpack_require__(31);
	var const_1 = __webpack_require__(5);
	var Color_1 = __webpack_require__(44);
	var PixiEx_1 = __webpack_require__(37);
	var Slider = (function (_super) {
	    __extends(Slider, _super);
	    function Slider(min, max, value) {
	        var _this = _super.call(this) || this;
	        _this._min = min;
	        _this._max = max;
	        _this.addChild(PixiEx_1.PIXI_RECT(Color_1.Col.panelBg, 0, 0, _this.width, 20));
	        var t = PixiEx_1.PIXI_RECT(0xa6a6a6, 0, 0, _this.width, _this.height);
	        _this.addChild(t);
	        _this.thumb = t;
	        var ls = Color_1.newStyle();
	        ls.fill = 0x666666;
	        var l = new PIXI.Text("", ls);
	        _this.addChild(l);
	        l.y = 3;
	        l.x = 5;
	        _this.label = l;
	        _this.value = value;
	        var lastX = null, isMove = false;
	        PixiEx_1.setupDrag(_this, function (e) {
	            lastX = e.mx;
	            isMove = false;
	        }, function (e) {
	            if (lastX != null) {
	                var dt = e.mx - lastX;
	                lastX = e.mx;
	                var dtW = _this.thumb.width + dt;
	                if ((dt != 0))
	                    isMove = true;
	                _this.value = (dtW / _this.width) * (_this._max - _this._min);
	            }
	        }, function (e) {
	            if (!isMove) {
	                var p = _this.thumb.toGlobal(new PIXI.Point(0, 0));
	                var dt = e.mx - p.x;
	                _this.value = (dt / _this.width) * (_this._max - _this._min);
	            }
	            lastX = null;
	        });
	        Input_1.input.on(Input_1.InputEvent.MOUSE_UP, function (e) {
	            lastX = null;
	        });
	        return _this;
	    }
	    Object.defineProperty(Slider.prototype, "width", {
	        get: function () { return 80; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Slider.prototype, "value", {
	        get: function () {
	            return this._value;
	        },
	        set: function (v) {
	            if (v != undefined) {
	                if (v > this._max)
	                    v = this._max;
	                if (v < this._min)
	                    v = this._min;
	                this._value = v;
	                var p = this._value / (this._max - this._min);
	                this.label.text = (p * 100).toFixed(0) + '%';
	                this.thumb.width = p * this.width;
	                this.emit(const_1.BaseEvent.CHANGED, v);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Slider;
	}(PIXI.Container));
	exports.Slider = Slider;


/***/ },
/* 52 */,
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Input_1 = __webpack_require__(31);
	exports.PaintEvent = {
	    undo: 'undo',
	    redo: 'redo'
	};
	var PaintCanvas = (function () {
	    function PaintCanvas() {
	        var _this = this;
	        this.preDrawAry = [];
	        this.nextDrawAry = [];
	        this.middleAry = [];
	        this.confing = {
	            lineWidth: 1,
	            lineColor: "blue",
	            shadowBlur: 0
	        };
	        this.canvas = document.getElementById('paintCanvas');
	        this.context = this.canvas.getContext('2d');
	        this.canvas.width = 1280;
	        this.canvas.height = 720;
	        this.context.lineJoin = 'round';
	        this.context.lineCap = 'round';
	        this._initDraw();
	        this._draw(this.canvas, this.context);
	        Input_1.input.on(Input_1.InputEvent.KEY_DOWN, function (e) {
	            console.log(e);
	            var k = e.key.toLowerCase();
	            var isCtrl = e.ctrlKey;
	            var isShift = e.shiftKey;
	            if (k == 'z') {
	                if (isCtrl) {
	                    if (isShift)
	                        _this._redo();
	                    else
	                        _this._undo();
	                }
	            }
	        });
	    }
	    PaintCanvas.prototype._initDraw = function () {
	        var preData = this.context.getImageData(0, 0, 1280, 720);
	        this.middleAry.push(preData);
	    };
	    PaintCanvas.prototype._draw = function (oCanvas, context) {
	        var _this1 = this;
	        oCanvas.onmousedown = function (e) {
	            var x = e.clientX, y = e.clientY, left = this.parentNode.offsetLeft, top = this.parentNode.offsetTop, canvasX = x, canvasY = y;
	            console.log('down', x, y);
	            _this1._setCanvasStyle();
	            _this1.context.beginPath();
	            _this1.context.moveTo(canvasX, canvasY);
	            var preData = _this1.context.getImageData(0, 0, 1280, 720);
	            _this1.preDrawAry.push(preData);
	            oCanvas.onmousemove = function (e) {
	                var x2 = e.clientX, y2 = e.clientY, t = e.target, canvasX2 = x2, canvasY2 = y2;
	                if (t == oCanvas) {
	                    _this1.context.lineTo(canvasX2, canvasY2);
	                    _this1.context.stroke();
	                }
	                else {
	                    _this1.context.beginPath();
	                }
	            };
	            oCanvas.onmouseup = function (e) {
	                var t = e.target;
	                if (t == oCanvas) {
	                    var preData = _this1.context.getImageData(0, 0, 1280, 720);
	                    if (_this1.nextDrawAry.length == 0) {
	                        _this1.middleAry.push(preData);
	                    }
	                    else {
	                        _this1.middleAry = [];
	                        _this1.middleAry = _this1.middleAry.concat(_this1.preDrawAry);
	                        _this1.middleAry.push(preData);
	                        _this1.nextDrawAry = [];
	                    }
	                }
	                this.onmousemove = null;
	            };
	        };
	    };
	    PaintCanvas.prototype._redo = function () {
	        console.log('redo');
	        if (this.nextDrawAry.length) {
	            var popData = this.nextDrawAry.pop();
	            var midData = this.middleAry[this.middleAry.length - this.nextDrawAry.length - 2];
	            this.preDrawAry.push(midData);
	            this.context.putImageData(popData, 0, 0);
	        }
	    };
	    PaintCanvas.prototype._undo = function () {
	        if (this.preDrawAry.length > 0) {
	            var popData = this.preDrawAry.pop();
	            var midData = this.middleAry[this.preDrawAry.length + 1];
	            this.nextDrawAry.push(midData);
	            this.context.putImageData(popData, 0, 0);
	        }
	    };
	    PaintCanvas.prototype._clear = function () {
	        var data = this.middleAry[0];
	        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
	        this.preDrawAry = [];
	        this.nextDrawAry = [];
	        this.middleAry = [this.middleAry[0]];
	    };
	    PaintCanvas.prototype._setCanvasStyle = function () {
	        this.context.lineWidth = this.confing.lineWidth;
	        this.context.shadowBlur = this.confing.shadowBlur;
	        this.context.shadowColor = this.confing.lineColor;
	        this.context.strokeStyle = this.confing.lineColor;
	    };
	    return PaintCanvas;
	}());
	exports.PaintCanvas = PaintCanvas;


/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map