export default class Keyframe {
    name: string;
    time: number;
    duration: number;
    ease: Array<number>;
    easeType: string;
    object: any;
    props: Array<string>;
    startValues: Array<any>;
    endValues: Array<any>;
    onUpdate?: (progress: number) => void;
    constructor(obj: any, opts: any);
    update(time: number): void;
    getCurve(percent: number): number;
    isActive(time: number): boolean;
    get startTime(): number;
    get endTime(): number;
}
//# sourceMappingURL=Keyframe.d.ts.map