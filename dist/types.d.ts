// debug
import * as dat from 'dat.gui';
export declare class DebugUtil {
  enabled: boolean;
  gui: dat.GUI;
  private stats;
  private folders;
  constructor();
  begin(): void;
  end(): void;
  folder(name: string, expanded?: boolean): any;
  addButton(folder: dat.gui.GUI | undefined, label: string, callback: () => void): dat.gui.GUI;
  addOptions(folder: dat.gui.GUI | undefined, label: string, options: Array<any>, callback: (value: any, index: number) => void): dat.gui.GUI;
  addInput(folder: dat.gui.GUI | undefined, obj: any, value: string, props?: any): dat.gui.GUI;
}
declare const debug: DebugUtil;
// dom
export declare const isiPad: boolean;
export declare const isiPhone: boolean;
export declare const isiOS: boolean;
export declare const isChrome: boolean;
export declare const isSafari: boolean;
export declare const isFirefox: boolean;
export declare const isOpera: boolean;
export declare const isMobile: boolean;
export declare const hasUserMedia: boolean;
export declare const supportsWebp: boolean;
export declare function delay(seconds: number): Promise<void>;
export declare function fileName(path: string): string;
export declare function guid(): string;
// loader
export declare class Loader {
  supportsBlob: boolean;
  constructor();
  loadXHR(path: string, responseType: XMLHttpRequestResponseType, onProgress: (progress: number) => void): Promise<XMLHttpRequest>;
  loadImageBlob(path: string, onProgress: (progress: number) => void): Promise<HTMLImageElement>;
  loadImageElement(path: string): Promise<HTMLImageElement>;
  loadImages(baseURL: string, images: Array<string>, onProgress: (progress: number) => void): Promise<HTMLImageElement[]>;
  loadJSON(path: string, onProgress: (progress: number) => void): Promise<any>;
  loadAudioElement(path: string): Promise<HTMLAudioElement>;
  loadVideoElement(path: string): Promise<HTMLVideoElement>;
  loadAssets(items: Array<any>, onProgress: (progress: number) => void): Promise<any>;
}
declare const loader: Loader;
// math
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
export declare function cubicBezier(percent: number, x0: number, y0: number, x1: number, y1: number): number;
export declare function mixArrays(start: Array<number>, end: Array<number>, value: number): Array<number>;
// raf
export declare class Raf {
  playing: boolean;
  clock: {
    elapsed: number;
    delta: number;
    start: number;
    last: number;
    now: () => number;
    seconds: () => number;
    restart: () => void;
    update: () => void;
  };
  private callbacks;
  private onRAF;
  private onUpdate;
  constructor();
  add(name: string, callback: () => void): void;
  remove(name: string): void;
  play(): void;
  pause(): void;
  update(): void;
}
declare const raf: Raf;
// three
import { BufferGeometry, Material, Mesh, Object3D, OrthographicCamera, Scene, Texture, WebGLRenderTarget } from 'three';
export declare const orthoCamera: any;
export declare const plane: any;
export declare function dispose(object: Object3D | Mesh): void;
export declare function parseShader(shader: string, defines: Array<string>, options: Array<string>): string;
export declare function anchorGeometry(geometry: BufferGeometry, x: number, y: number, z: number): void;
export declare function anchorGeometryTL(geometry: BufferGeometry): void;
export declare function setBlendNormal(material: Material): void;
export declare function setBlendAdd(material: Material): void;
export declare function setBlendMultiply(material: Material): void;
export declare function setBlendScreen(material: Material): void;
export declare class FBO {
  rt1: WebGLRenderTarget;
  target: WebGLRenderTarget;
  constructor(width: number, height: number, params: any);
  resize(width: number, height: number): void;
  get texture(): Texture;
}
export declare class DoubleFBO extends FBO {
  rt2: WebGLRenderTarget;
  flip: Boolean;
  constructor(width: number, height: number, params: any);
  resize(width: number, height: number): void;
  swap(): void;
}
export declare class Pass {
  camera: OrthographicCamera;
  scene: Scene;
  material: Material;
  mesh: Mesh;
  constructor(material: Material);
  draw(): void;
}
export declare function updateTextureData(svgElement: SVGElement, imgWid: number, imgHei: number): Promise<Texture>;