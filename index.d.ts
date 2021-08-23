import Keyframe from './animation/timeline/Keyframe';
import Marker from './animation/timeline/Marker';
import PlayMode from './animation/timeline/PlayMode';
import Timeline from './animation/timeline/Timeline';
import GLTFPlayer from './animation/GLTFPlayer';
import { Smooth, SmoothController } from './animation/Smooth';
import TextGeometry from './three/geometry/TextGeometry';
import TextMaterial from './three/materials/TextMaterial';
import TextMesh from './three/mesh/TextMesh';
import { delay, fileName, guid } from './utils/dom';
import { between, clamp, normalize, mix, map, roundTo, distance, distance2, distance3, random, getAngle, toDeg, toRad, cosRange, precisionComplete, cubicBezier, mixArrays } from './utils/math';
import { dispose, findObjectsWithName, anchorGeometry, anchorGeometryTL, setBlendNormal, setBlendAdd, setBlendMultiply, setBlendScreen, FBO, DoubleFBO, Pass, updateTextureData, compileShader, RawShader, updateCameraPerspective, updateCameraOrtho } from './utils/three';
declare const _default: {
    ease: {
        LINEAR: string;
        BEZIER: string;
        HOLD: string;
        none: number[];
        inQuad: number[];
        inCubic: number[];
        inQuart: number[];
        inQuint: number[];
        inSine: number[];
        inExpo: number[];
        inCirc: number[];
        inBack: number[];
        outQuad: number[];
        outCubic: number[];
        outQuart: number[];
        outQuint: number[];
        outSine: number[];
        outExpo: number[];
        outCirc: number[];
        outBack: number[];
        inOutQuad: number[];
        inOutCubic: number[];
        inOutQuart: number[];
        inOutQuint: number[];
        inOutSine: number[];
        inOutExpo: number[];
        inOutCirc: number[];
        inOutBack: number[];
    };
    Keyframe: typeof Keyframe;
    Marker: typeof Marker;
    PlayMode: typeof PlayMode;
    Timeline: typeof Timeline;
    GLTFPlayer: typeof GLTFPlayer;
    Smooth: typeof Smooth;
    SmoothController: typeof SmoothController;
    smoothing: SmoothController;
    TextGeometry: typeof TextGeometry;
    TextVertex: string;
    TextFragment: string;
    TextMaterial: typeof TextMaterial;
    TextMesh: typeof TextMesh;
    debug: import("./utils/debug").Debugger;
    isiPad: boolean;
    isiPhone: boolean;
    isiOS: boolean;
    isChrome: boolean;
    isSafari: boolean;
    isFirefox: boolean;
    isOpera: boolean;
    isMobile: boolean;
    hasUserMedia: boolean;
    supportsWebp: boolean;
    delay: typeof delay;
    fileName: typeof fileName;
    guid: typeof guid;
    loader: import("./utils/loader").Loader;
    DEGREES: number;
    RADIANS: number;
    TWO_PI: number;
    HALF_PI: number;
    between: typeof between;
    clamp: typeof clamp;
    normalize: typeof normalize;
    mix: typeof mix;
    map: typeof map;
    roundTo: typeof roundTo;
    distance: typeof distance;
    distance2: typeof distance2;
    distance3: typeof distance3;
    random: typeof random;
    getAngle: typeof getAngle;
    toDeg: typeof toDeg;
    toRad: typeof toRad;
    cosRange: typeof cosRange;
    precisionComplete: typeof precisionComplete;
    cubicBezier: typeof cubicBezier;
    mixArrays: typeof mixArrays;
    raf: import("./utils/raf").Raf;
    orthoCamera: import("three").OrthographicCamera;
    plane: import("three").PlaneGeometry;
    triangle: import("three").BufferGeometry;
    dispose: typeof dispose;
    findObjectsWithName: typeof findObjectsWithName;
    anchorGeometry: typeof anchorGeometry;
    anchorGeometryTL: typeof anchorGeometryTL;
    setBlendNormal: typeof setBlendNormal;
    setBlendAdd: typeof setBlendAdd;
    setBlendMultiply: typeof setBlendMultiply;
    setBlendScreen: typeof setBlendScreen;
    FBO: typeof FBO;
    DoubleFBO: typeof DoubleFBO;
    Pass: typeof Pass;
    updateTextureData: typeof updateTextureData;
    compileShader: typeof compileShader;
    RawShader: typeof RawShader;
    updateCameraPerspective: typeof updateCameraPerspective;
    updateCameraOrtho: typeof updateCameraOrtho;
};
export default _default;
//# sourceMappingURL=index.d.ts.map