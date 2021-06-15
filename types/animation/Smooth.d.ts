interface SmoothProps {
    id?: string;
    target?: number;
    speed?: number;
    bounce?: number;
    onUpdate?: () => void;
}
export declare class Smooth {
    id: string;
    object: any;
    param: string;
    speed: number;
    bounce: number;
    precision: number;
    target: number;
    velocity: number;
    onUpdate?: () => void;
    constructor(obj: any, param: string, opts?: SmoothProps);
    update(): void;
    complete(): void;
    killVelocity(): void;
}
export declare class SmoothController {
    items: Array<Smooth>;
    to(obj: any, param: string, opts?: SmoothProps): Smooth;
    remove(id: string): void;
    update(): void;
    hasItem(obj: any, param: string): number;
}
declare const smoothing: SmoothController;
export default smoothing;
