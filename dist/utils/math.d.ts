export declare const DEGREES: number;
export declare const RADIANS: number;
export declare const TWO_PI: number;
export declare const HALF_PI: number;
export declare function between(min: number, max: number, value: number): boolean;
export declare function clamp(min: number, max: number, value: number): number;
export declare function normalize(min: number, max: number, value: number): number;
export declare function mix(min: number, max: number, value: number): number;
export declare function map(min1: number, max1: number, min2: number, max2: number, value: number): number;
export declare function roundTo(value: number, digits?: number): number;
export declare function distance(x: number, y: number): number;
export declare function distance2(x1: number, y1: number, x2: number, y2: number): number;
export declare function distance3(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number;
export declare function random(min: number, max: number): number;
export declare function getAngle(x0: number, y0: number, x1: number, y1: number): number;
export declare function toRad(degrees: number): number;
export declare function toDeg(radians: number): number;
export declare function cosRange(degrees: number, range: number, min: number): number;
export declare function precisionComplete(current: number, destination: number, precision: number): boolean;
export declare function cubicBezier(percent: number, x0: number, y0: number, x1: number, y1: number): number;
export declare function mixArrays(start: Array<number>, end: Array<number>, value: number): Array<number>;
//# sourceMappingURL=math.d.ts.map