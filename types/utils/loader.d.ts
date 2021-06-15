declare class Loader {
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
export default loader;
