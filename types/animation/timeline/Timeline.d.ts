import Keyframe from './Keyframe';
import Marker from './Marker';
import PlayMode from './PlayMode';
export default class Timeline {
    duration: number;
    keyframes: Array<Keyframe>;
    markers: Array<Marker>;
    mode: PlayMode;
    playing: boolean;
    speed: number;
    time: {
        seconds: number;
        prevSeconds: number;
        lastUpdate: number;
    };
    constructor(opts?: any);
    dispose(): void;
    addKeyframe(obj: any, opts: any): void;
    addMarker(name?: string, time?: number): void;
    pushKeyframe(keyframe: Keyframe): void;
    getMarker(name: string): Marker | undefined;
    goToMarker(name: string): void;
    play(): void;
    pause(): void;
    update(time?: number): void;
    updateKeyframes(): void;
    updateMarkers(): void;
    updateTime(): void;
    resetTime(): void;
    get now(): number;
    get seconds(): number;
    set seconds(value: number);
}
