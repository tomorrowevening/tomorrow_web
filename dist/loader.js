"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = require("./dom");
function LoaderUtil() {
    try {
        this.supportsBlob = !!new Blob();
    }
    catch (e) {
        this.supportsBlob = false;
    }
    this.loadXHR = function (path, responseType, onProgress) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open('GET', path, true);
            request.responseType = responseType;
            request.addEventListener('progress', function (event) {
                var progress = event.loaded / event.total;
                onProgress(progress);
            }, false);
            request.addEventListener('load', function () {
                resolve(request);
            }, false);
            request.addEventListener('error', function () {
                reject();
            }, false);
            request.send();
        });
    };
    this.loadImageBlob = function (path, onProgress) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.loadXHR(path, 'blob', onProgress)
                .then(function (request) {
                var image = new Image();
                window.URL.revokeObjectURL(request.response);
                image.src = window.URL.createObjectURL(request.response);
                resolve(image);
            })
                .catch(reject);
        });
    };
    this.loadImageElement = function (path) {
        return new Promise(function (resolve, reject) {
            var request = new Image();
            request.addEventListener('error', function () {
                reject();
            }, false);
            request.addEventListener('load', function () {
                resolve(request);
            }, false);
            request.src = path;
        });
    };
    this.loadImages = function (baseURL, images, onProgress) {
        var _this = this;
        var promises = [];
        if (this.supportsBlob) {
            var progression_1 = {};
            var onProgressUpdate_1 = function () {
                var total = 0;
                var count = 0;
                Object.keys(progression_1).forEach(function (i) {
                    count++;
                    total += progression_1[i];
                });
                var progress = total / count;
                onProgress(progress);
            };
            images.forEach(function (image) {
                progression_1[image] = 0;
                promises.push(_this.loadImageBlob(baseURL + image, function (progress) {
                    progression_1[image] = progress;
                    onProgressUpdate_1();
                }));
            });
        }
        else {
            var loaded_1 = 0;
            var total_1 = images.length;
            images.forEach(function (image) {
                promises.push(new Promise(function (resolve, reject) {
                    _this.loadImageElement(baseURL + image)
                        .then(function (imageElement) {
                        ++loaded_1;
                        var progress = loaded_1 / total_1;
                        onProgress(progress);
                        resolve(imageElement);
                    }).catch(reject);
                }));
            });
        }
        return Promise.all(promises);
    };
    this.loadJSON = function (path, onProgress) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.loadXHR(path, 'json', onProgress)
                .then(function (request) {
                var json = request.response;
                if (typeof json === 'string') {
                    json = JSON.parse(json);
                }
                resolve(json);
            })
                .catch(reject);
        });
    };
    this.loadAudioElement = function (path) {
        return new Promise(function (resolve, reject) {
            var request = document.createElement('audio');
            request.autoplay = false;
            request.src = path;
            request.addEventListener('error', function () {
                reject();
            }, false);
            request.addEventListener('canplaythrough', function () {
                resolve(request);
            }, false);
            request.load();
        });
    };
    this.loadVideoElement = function (path) {
        return new Promise(function (resolve, reject) {
            var request = document.createElement('video');
            request.autoplay = false;
            request.src = path;
            request.addEventListener('error', function () {
                reject();
            }, false);
            request.addEventListener('canplaythrough', function () {
                resolve(request);
            }, false);
            request.load();
        });
    };
    this.loadAssets = function (items, onProgress) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var loaded = 0;
            var total = items.length;
            var files = {
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
            var timer = setInterval(function () {
                var progress = loaded / (total - 1);
                onProgress(Number.isNaN(progress) ? 0 : progress);
            }, 1000 / 30);
            var killTimer = function () {
                clearInterval(timer);
                timer = undefined;
            };
            var onLoad = function () {
                ++loaded;
                if (loaded >= total) {
                    onProgress(1);
                    killTimer();
                    resolve(files);
                }
            };
            items.forEach(function (item) {
                var type = item.type;
                var file = item.file;
                switch (type) {
                    case 'audio':
                        _this.loadAudioElement(file).then(function (audio) {
                            var fileID = dom_1.fileName(file);
                            files.audio[fileID] = audio;
                            onLoad();
                        }).catch(function () {
                            killTimer();
                            reject("Error loading: " + file);
                        });
                        break;
                    case 'custom':
                        item.load(file).then(function (asset) {
                            var fileID = dom_1.fileName(file);
                            files.custom[fileID] = asset;
                            onLoad();
                        }).catch(function () {
                            killTimer();
                            reject("Error loading: " + file);
                        });
                        break;
                    default:
                    case 'image':
                        _this.loadImageElement(file).then(function (image) {
                            var fileID = dom_1.fileName(file);
                            files.images[fileID] = image;
                            onLoad();
                        }).catch(function () {
                            killTimer();
                            reject("Error loading: " + file);
                        });
                        break;
                    case 'json':
                        _this.loadJSON(file, function () { }).then(function (json) {
                            var fileID = dom_1.fileName(file);
                            files.json[fileID] = json;
                            onLoad();
                        }).catch(function () {
                            killTimer();
                            reject("Error loading: " + file);
                        });
                        break;
                    case 'video':
                        _this.loadVideoElement(file).then(function (image) {
                            var fileID = dom_1.fileName(file);
                            files.videos[fileID] = image;
                            onLoad();
                        }).catch(function () {
                            killTimer();
                            reject("Error loading: " + file);
                        });
                        break;
                }
            });
        });
    };
    return this;
}
var loader = LoaderUtil();
exports.default = loader;
//# sourceMappingURL=loader.js.map