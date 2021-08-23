var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fileName } from './dom';
export class Loader {
    constructor() {
        this.supportsBlob = false;
        try {
            this.supportsBlob = !!new Blob();
        }
        catch (e) {
            this.supportsBlob = false;
        }
    }
    loadXHR(path, responseType, onProgress) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const request = new XMLHttpRequest();
                request.open('GET', path, true);
                request.responseType = responseType;
                request.addEventListener('progress', (event) => {
                    const progress = event.loaded / event.total;
                    onProgress(progress);
                }, false);
                request.addEventListener('load', () => {
                    resolve(request);
                }, false);
                request.addEventListener('error', () => {
                    reject();
                }, false);
                request.send();
            });
        });
    }
    loadImageBlob(path, onProgress) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.loadXHR(path, 'blob', onProgress)
                    .then((request) => {
                    const image = new Image();
                    window.URL.revokeObjectURL(request.response);
                    image.src = window.URL.createObjectURL(request.response);
                    resolve(image);
                })
                    .catch(reject);
            });
        });
    }
    loadImageElement(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const request = new Image();
                request.addEventListener('error', () => {
                    reject();
                }, false);
                request.addEventListener('load', () => {
                    resolve(request);
                }, false);
                request.src = path;
            });
        });
    }
    loadImages(baseURL, images, onProgress) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            if (this.supportsBlob) {
                const progression = {};
                const onProgressUpdate = () => {
                    let total = 0;
                    let count = 0;
                    Object.keys(progression).forEach((i) => {
                        count++;
                        total += progression[i];
                    });
                    const progress = total / count;
                    onProgress(progress);
                };
                images.forEach((image) => {
                    progression[image] = 0;
                    promises.push(this.loadImageBlob(baseURL + image, (progress) => {
                        progression[image] = progress;
                        onProgressUpdate();
                    }));
                });
            }
            else {
                let loaded = 0;
                const total = images.length;
                images.forEach((image) => {
                    promises.push(new Promise((resolve, reject) => {
                        this.loadImageElement(baseURL + image)
                            .then((imageElement) => {
                            ++loaded;
                            const progress = loaded / total;
                            onProgress(progress);
                            resolve(imageElement);
                        }).catch(reject);
                    }));
                });
            }
            return Promise.all(promises);
        });
    }
    loadJSON(path, onProgress) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.loadXHR(path, 'json', onProgress)
                    .then((request) => {
                    let json = request.response;
                    if (typeof json === 'string') {
                        json = JSON.parse(json);
                    }
                    resolve(json);
                })
                    .catch(reject);
            });
        });
    }
    loadAudioElement(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const request = document.createElement('audio');
                request.setAttribute('crossOrigin', 'anonymous');
                request.autoplay = false;
                request.src = path;
                request.addEventListener('error', () => {
                    reject();
                }, false);
                request.addEventListener('canplaythrough', () => {
                    resolve(request);
                }, false);
                request.load();
            });
        });
    }
    loadVideoElement(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const request = document.createElement('video');
                request.setAttribute('crossOrigin', 'anonymous');
                request.playsInline = true;
                request.autoplay = false;
                request.src = path;
                request.addEventListener('error', () => {
                    reject();
                }, false);
                request.addEventListener('canplaythrough', () => {
                    resolve(request);
                }, false);
                request.load();
            });
        });
    }
    loadAssets(items, onProgress) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let loaded = 0;
                const total = items.length;
                const files = {
                    audio: {},
                    custom: {},
                    images: {},
                    json: {},
                    videos: {}
                };
                if (total < 1) {
                    onProgress(1);
                    resolve(files);
                    return;
                }
                let timer = setInterval(() => {
                    const progress = loaded / (total - 1);
                    onProgress(Number.isNaN(progress) ? 0 : progress);
                }, 1000 / 30);
                const killTimer = () => {
                    clearInterval(timer);
                    timer = undefined;
                };
                const onLoad = () => {
                    ++loaded;
                    if (loaded >= total) {
                        onProgress(1);
                        killTimer();
                        resolve(files);
                    }
                };
                items.forEach((item) => {
                    const { type } = item;
                    const { file } = item;
                    switch (type) {
                        case 'audio':
                            this.loadAudioElement(file).then((audio) => {
                                const fileID = fileName(file);
                                files.audio[fileID] = audio;
                                onLoad();
                            }).catch(() => {
                                killTimer();
                                reject(`Error loading: ${file}`);
                            });
                            break;
                        case 'custom':
                            item.load(file).then((asset) => {
                                const fileID = fileName(file);
                                files.custom[fileID] = asset;
                                onLoad();
                            }).catch(() => {
                                killTimer();
                                reject(`Error loading: ${file}`);
                            });
                            break;
                        default:
                        case 'image':
                            this.loadImageElement(file).then((image) => {
                                const fileID = fileName(file);
                                files.images[fileID] = image;
                                onLoad();
                            }).catch(() => {
                                killTimer();
                                reject(`Error loading: ${file}`);
                            });
                            break;
                        case 'json':
                            this.loadJSON(file, () => { }).then((json) => {
                                const fileID = fileName(file);
                                files.json[fileID] = json;
                                onLoad();
                            }).catch(() => {
                                killTimer();
                                reject(`Error loading: ${file}`);
                            });
                            break;
                        case 'video':
                            this.loadVideoElement(file).then((image) => {
                                const fileID = fileName(file);
                                files.videos[fileID] = image;
                                onLoad();
                            }).catch(() => {
                                killTimer();
                                reject(`Error loading: ${file}`);
                            });
                            break;
                    }
                });
            });
        });
    }
}
const loader = new Loader();
export default loader;
