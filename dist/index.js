function dailyMain() {
}
function hourAgoMain() {
}/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Schedule.ts":
/*!*************************!*\
  !*** ./src/Schedule.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Schedule {
  constructor(year, month, day, hour, time, content, defaultContent) {
    this.defaultContent = defaultContent;
    this.year = +year;
    this.month = +month;
    this.day = +day;
    this.hour = +hour;
    this.time = time !== "" ? +time : 0;
    this.content = content !== "" ? content : defaultContent;
  }
  get date() {
    return new Date(`${this.year}/${this.month}/${this.day} ${this.hour}:${this.time}:00`);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Schedule);

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dailyMain: () => (/* binding */ dailyMain),
/* harmony export */   hourAgoMain: () => (/* binding */ hourAgoMain)
/* harmony export */ });
/* harmony import */ var _sheets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sheets */ "./src/sheets.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");


function sendTypetalkMessage(text, config) {
  const options = {
    method: "post",
    headers: {
      "X-TYPETALK-TOKEN": config.typetalkToken
    },
    payload: {
      message: text
    }
  };
  UrlFetchApp.fetch(config.typetalkUrl, options);
}
function dailyMain() {
  const config = (0,_sheets__WEBPACK_IMPORTED_MODULE_0__.initConfig)();
  if (config === null) {
    console.error("config is null");
    return;
  }
  const cb = (schedule, now) => {
    return schedule.year === now.getFullYear() && schedule.month === now.getMonth() + 1 && schedule.day === now.getDate();
  };
  const schedule = (0,_sheets__WEBPACK_IMPORTED_MODULE_0__.getTodaysItems)(config, cb);
  if (schedule.length === 0) {
    return;
  }
  const scheduleText = schedule.map(sche => {
    return `・ ${(0,_utils__WEBPACK_IMPORTED_MODULE_1__.pad)(sche.hour, 2)}時${(0,_utils__WEBPACK_IMPORTED_MODULE_1__.pad)(sche.time, 2)}分: ${sche.content}`;
  }).join("\n");
  const members = (0,_sheets__WEBPACK_IMPORTED_MODULE_0__.getMembers)().join(" ");
  const text = config.morningMessage.replace(/{MEMBERS}/g, members).replace(/{SCHEDULE_LEN}/g, schedule.length.toString()).replace(/{SCHEDULE}/g, scheduleText).replace(/{ZOOM_TEXT}/g, config.zoomUrl);
  sendTypetalkMessage(text, config);
}
function hourAgoMain() {
  const config = (0,_sheets__WEBPACK_IMPORTED_MODULE_0__.initConfig)();
  if (config === null) {
    console.error("config is null");
    return;
  }
  const cb = (schedule, now) => {
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    if (now <= schedule.date && schedule.date <= oneHourLater) {
      return true;
    } else {
      return false;
    }
  };
  const schedule = (0,_sheets__WEBPACK_IMPORTED_MODULE_0__.getTodaysItems)(config, cb);
  if (schedule.length === 0) {
    return;
  }
  const scheduleText = schedule.map(sche => {
    return `・ ${sche.month}/${sche.day} ${(0,_utils__WEBPACK_IMPORTED_MODULE_1__.pad)(sche.hour, 2)}:${(0,_utils__WEBPACK_IMPORTED_MODULE_1__.pad)(sche.time, 2)}: ${sche.content}`;
  }).join("\n");
  const members = (0,_sheets__WEBPACK_IMPORTED_MODULE_0__.getMembers)().join(" ");
  const text = config.justBeforeMessage.replace(/{MEMBERS}/g, members).replace(/{SCHEDULE_LEN}/g, schedule.length.toString()).replace(/{SCHEDULE}/g, scheduleText).replace(/{ZOOM_TEXT}/g, config.zoomUrl);
  sendTypetalkMessage(text, config);
}

/***/ }),

/***/ "./src/sheets.ts":
/*!***********************!*\
  !*** ./src/sheets.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getMembers: () => (/* binding */ getMembers),
/* harmony export */   getTodaysItems: () => (/* binding */ getTodaysItems),
/* harmony export */   initConfig: () => (/* binding */ initConfig)
/* harmony export */ });
/* harmony import */ var _Schedule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Schedule */ "./src/Schedule.ts");

function getMembers() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("members");
  if (sheet === null) {
    return [];
  }
  return sheet.getDataRange().getValues().map(m => `@${m}`).filter(m => m !== "");
}
function getTodaysItems(config, callback) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("schedule");
  if (sheet === null) {
    return [];
  }
  const now = new Date();
  const rows = sheet.getDataRange().getValues().slice(1);
  const todaysItems = rows.flatMap(row => {
    // TODO: validate row
    const schedule = new _Schedule__WEBPACK_IMPORTED_MODULE_0__["default"](row[0], row[1], row[2], row[3], row[4], row[5], config.defaultContent);
    if (callback(schedule, now)) {
      return [schedule];
    }
    return [];
  }).sort((sche1, sche2) => {
    if (sche1.hour === sche2.hour) {
      return sche1.time - sche2.time;
    } else {
      return sche1.hour - sche2.hour;
    }
  });
  return todaysItems;
}
function initConfig() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("config");
  if (sheet === null) {
    return null;
  }
  const values = sheet.getDataRange().getValues();
  const config = {
    defaultContent: values[0][1],
    morningMessage: values[1][1],
    justBeforeMessage: values[2][1],
    zoomUrl: values[3][1],
    typetalkUrl: values[4][1],
    typetalkToken: values[5][1]
  };
  return config;
}

/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   pad: () => (/* binding */ pad)
/* harmony export */ });
function pad(num, len) {
  return (Array(len).join("0") + num).slice(-len);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./main */ "./src/main.ts");

__webpack_require__.g.dailyMain = _main__WEBPACK_IMPORTED_MODULE_0__.dailyMain;
__webpack_require__.g.hourAgoMain = _main__WEBPACK_IMPORTED_MODULE_0__.hourAgoMain;
})();

/******/ })()
;