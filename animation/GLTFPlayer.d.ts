import { AnimationClip, AnimationMixer, Camera, Group } from 'three';
export default class GLTFPlayer {
    actions: Object;
    cameras: Array<Camera>;
    scene: Group;
    timeScale: number;
    loaded: Boolean;
    animations: Object;
    private currentAction;
    private currentClip;
    mixer: AnimationMixer;
    currentAnimation: String;
    constructor(url?: string, onLoad?: Function, onProgress?: Function, onError?: Function);
    setGLTF(gltf: any): void;
    update(delta: number): void;
    play(animation: String): void;
    stop(animation?: String): void;
    pause(): void;
    togglePause(): void;
    loopOnce(): void;
    loopRepeat(): void;
    getAction(animation: String): any;
    getAnimation(animation: String): AnimationClip;
    resizeCameras(aspect: number): void;
    static loadGLTF(path: string, onProgress?: (percent: number) => void): Promise<any>;
    get duration(): number;
    get time(): number;
    get percent(): number;
    get isPaused(): Boolean;
    set percent(value: number);
    set time(value: number);
}
//# sourceMappingURL=GLTFPlayer.d.ts.map