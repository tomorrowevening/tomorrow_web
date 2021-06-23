"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mixArrays = exports.cubicBezier = exports.precisionComplete = exports.cosRange = exports.toDeg = exports.toRad = exports.getAngle = exports.random = exports.distance3 = exports.distance2 = exports.distance = exports.roundTo = exports.map = exports.mix = exports.normalize = exports.clamp = exports.between = exports.HALF_PI = exports.TWO_PI = exports.RADIANS = exports.DEGREES = void 0;
exports.DEGREES = 180 / Math.PI;
exports.RADIANS = Math.PI / 180;
exports.TWO_PI = Math.PI * 2;
exports.HALF_PI = Math.PI / 2;
function between(min, max, value) {
    return value >= min && value <= max;
}
exports.between = between;
function clamp(min, max, value) {
    return Math.min(max, Math.max(min, value));
}
exports.clamp = clamp;
function normalize(min, max, value) {
    return (value - min) / (max - min);
}
exports.normalize = normalize;
function mix(min, max, value) {
    return min * (1 - value) + max * value;
}
exports.mix = mix;
function map(min1, max1, min2, max2, value) {
    return mix(min2, max2, normalize(min1, max1, value));
}
exports.map = map;
function roundTo(value, digits) {
    if (digits === void 0) { digits = 1; }
    return Number(value.toFixed(digits));
}
exports.roundTo = roundTo;
function distance(x, y) {
    var d = x - y;
    return Math.sqrt(d * d);
}
exports.distance = distance;
function distance2(x1, y1, x2, y2) {
    var d1 = x1 - x2;
    var d2 = y1 - y2;
    return Math.sqrt(d1 * d1 + d2 * d2);
}
exports.distance2 = distance2;
function distance3(x1, y1, z1, x2, y2, z2) {
    var d1 = x1 - x2;
    var d2 = y1 - y2;
    var d3 = z1 - z2;
    return Math.sqrt(d1 * d1 + d2 * d2 + d3 * d3);
}
exports.distance3 = distance3;
function random(min, max) {
    return mix(min, max, Math.random());
}
exports.random = random;
function getAngle(x0, y0, x1, y1) {
    return Math.atan2(y1 - y0, x1 - x0);
}
exports.getAngle = getAngle;
function toRad(degrees) {
    return degrees * exports.RADIANS;
}
exports.toRad = toRad;
function toDeg(radians) {
    return radians * exports.DEGREES;
}
exports.toDeg = toDeg;
function cosRange(degrees, range, min) {
    return (((1 + Math.cos(toRad(degrees))) * 0.5) * range) + min;
}
exports.cosRange = cosRange;
function precisionComplete(current, destination, precision) {
    return current < destination + precision && current > destination - precision;
}
exports.precisionComplete = precisionComplete;
function isLinear(x0, y0, x1, y1) {
    return x0 === y0 && x1 === y1;
}
function slopeFromT(t, A, B, C) {
    return 1.0 / (3.0 * A * t * t + 2.0 * B * t + C);
}
function xFromT(t, A, B, C, D) {
    return A * (t * t * t) + B * (t * t) + C * t + D;
}
function yFromT(t, E, F, G, H) {
    var tt = t * t;
    return E * (tt * t) + F * tt + G * t + H;
}
function cubicBezier(percent, x0, y0, x1, y1) {
    if (percent <= 0)
        return 0;
    if (percent >= 1)
        return 1;
    if (isLinear(x0, y0, x1, y1))
        return percent;
    var x0a = 0;
    var y0a = 0;
    var x1a = x0;
    var y1a = y0;
    var x2a = x1;
    var y2a = y1;
    var x3a = 1;
    var y3a = 1;
    var A = x3a - 3.0 * x2a + 3.0 * x1a - x0a;
    var B = 3.0 * x2a - 6.0 * x1a + 3.0 * x0a;
    var C = 3.0 * x1a - 3.0 * x0a;
    var D = x0a;
    var E = y3a - 3.0 * y2a + 3.0 * y1a - y0a;
    var F = 3.0 * y2a - 6.0 * y1a + 3.0 * y0a;
    var G = 3.0 * y1a - 3.0 * y0a;
    var H = y0a;
    var current = percent;
    for (var i = 0; i < 5; i++) {
        var currentx = xFromT(current, A, B, C, D);
        var currentslope = slopeFromT(current, A, B, C);
        if (currentslope === Infinity)
            currentslope = percent;
        current -= (currentx - percent) * (currentslope);
        current = Math.min(Math.max(current, 0.0), 1.0);
    }
    return yFromT(current, E, F, G, H);
}
exports.cubicBezier = cubicBezier;
function mixArrays(start, end, value) {
    var result = [];
    var total = start.length;
    for (var i = 0; i < total; ++i) {
        result.push(mix(start[i], end[i], value));
    }
    return result;
}
exports.mixArrays = mixArrays;
