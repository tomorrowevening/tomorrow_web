export const DEGREES = 180 / Math.PI;
export const RADIANS = Math.PI / 180;
export const TWO_PI = Math.PI * 2;
export const HALF_PI = Math.PI / 2;
export function between(min, max, value) {
    return value >= min && value <= max;
}
export function clamp(min, max, value) {
    return Math.min(max, Math.max(min, value));
}
export function normalize(min, max, value) {
    return (value - min) / (max - min);
}
export function mix(min, max, value) {
    return min * (1 - value) + max * value;
}
export function map(min1, max1, min2, max2, value) {
    return mix(min2, max2, normalize(min1, max1, value));
}
export function roundTo(value, digits = 1) {
    return Number(value.toFixed(digits));
}
export function distance(x, y) {
    const d = x - y;
    return Math.sqrt(d * d);
}
export function distance2(x1, y1, x2, y2) {
    const d1 = x1 - x2;
    const d2 = y1 - y2;
    return Math.sqrt(d1 * d1 + d2 * d2);
}
export function distance3(x1, y1, z1, x2, y2, z2) {
    const d1 = x1 - x2;
    const d2 = y1 - y2;
    const d3 = z1 - z2;
    return Math.sqrt(d1 * d1 + d2 * d2 + d3 * d3);
}
export function random(min, max) {
    return mix(min, max, Math.random());
}
export function getAngle(x0, y0, x1, y1) {
    return Math.atan2(y1 - y0, x1 - x0);
}
export function toRad(degrees) {
    return degrees * RADIANS;
}
export function toDeg(radians) {
    return radians * DEGREES;
}
export function cosRange(degrees, range, min) {
    return (((1 + Math.cos(toRad(degrees))) * 0.5) * range) + min;
}
export function precisionComplete(current, destination, precision) {
    return current < destination + precision && current > destination - precision;
}
export function damp(start, end, easing, dt) {
    return mix(start, end, 1 - Math.exp(-easing * dt));
}
export function euclideanModulo(value, mod) {
    return ((value % mod) + mod) % mod;
}
export function shortestAngleDiff(radians) {
    while (radians > Math.PI)
        radians -= TWO_PI;
    while (radians < -Math.PI)
        radians += TWO_PI;
    return radians;
}
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
    const tt = t * t;
    return E * (tt * t) + F * tt + G * t + H;
}
export function cubicBezier(percent, x0, y0, x1, y1) {
    if (percent <= 0)
        return 0;
    if (percent >= 1)
        return 1;
    if (isLinear(x0, y0, x1, y1))
        return percent;
    const x0a = 0;
    const y0a = 0;
    const x1a = x0;
    const y1a = y0;
    const x2a = x1;
    const y2a = y1;
    const x3a = 1;
    const y3a = 1;
    const A = x3a - 3.0 * x2a + 3.0 * x1a - x0a;
    const B = 3.0 * x2a - 6.0 * x1a + 3.0 * x0a;
    const C = 3.0 * x1a - 3.0 * x0a;
    const D = x0a;
    const E = y3a - 3.0 * y2a + 3.0 * y1a - y0a;
    const F = 3.0 * y2a - 6.0 * y1a + 3.0 * y0a;
    const G = 3.0 * y1a - 3.0 * y0a;
    const H = y0a;
    let current = percent;
    for (let i = 0; i < 5; i++) {
        const currentx = xFromT(current, A, B, C, D);
        let currentslope = slopeFromT(current, A, B, C);
        if (currentslope === Infinity)
            currentslope = percent;
        current -= (currentx - percent) * (currentslope);
        current = Math.min(Math.max(current, 0.0), 1.0);
    }
    return yFromT(current, E, F, G, H);
}
export function mixArrays(start, end, value) {
    const result = [];
    const total = start.length;
    for (let i = 0; i < total; ++i) {
        result.push(mix(start[i], end[i], value));
    }
    return result;
}
