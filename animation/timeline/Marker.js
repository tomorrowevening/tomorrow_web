"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Marker = (function () {
    function Marker(name, time) {
        if (name === void 0) { name = ''; }
        if (time === void 0) { time = 0; }
        this.name = '';
        this.time = 0;
        this.name = name;
        this.time = time;
    }
    return Marker;
}());
exports.default = Marker;
