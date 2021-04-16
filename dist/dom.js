"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guid = exports.fileName = exports.delay = exports.supportsWebp = exports.hasUserMedia = exports.isMobile = exports.isOpera = exports.isFirefox = exports.isSafari = exports.isChrome = exports.isiOS = exports.isiPhone = exports.isiPad = void 0;
exports.isiPad = /iPad/i.test(navigator.userAgent);
exports.isiPhone = /iPhone/i.test(navigator.userAgent);
exports.isiOS = exports.isiPad || exports.isiPhone;
exports.isChrome = /chrome/i.test(navigator.userAgent);
exports.isSafari = /^((?!chrome).)*safari/i.test(navigator.userAgent);
exports.isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
exports.isOpera = navigator.userAgent.toLowerCase().indexOf('op') > -1;
exports.isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/) !== null;
exports.hasUserMedia = (navigator.getUserMedia) !== undefined;
exports.supportsWebp = (function () {
    var elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
})();
function delay(seconds) {
    return new Promise(function (resolve) {
        var timer = setTimeout(function () {
            clearTimeout(timer);
            timer = undefined;
            resolve();
        }, seconds * 1000);
    });
}
exports.delay = delay;
function fileName(path) {
    var slash = path.lastIndexOf('/') + 1;
    var period = path.lastIndexOf('.');
    return path.substring(slash, period);
}
exports.fileName = fileName;
function guid() {
    return (Date.now() + Math.round(Math.random() * 99999)).toString();
}
exports.guid = guid;
//# sourceMappingURL=dom.js.map