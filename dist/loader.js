"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loader = void 0;
var dom_1 = require("./dom");
var Loader = (function () {
    function Loader() {
        this.supportsBlob = false;
        try {
            this.supportsBlob = !!new Blob();
        }
        catch (e) {
            this.supportsBlob = false;
        }
    }
    Loader.prototype.loadXHR = function (path, responseType, onProgress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
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
                    })];
            });
        });
    };
    Loader.prototype.loadImageBlob = function (path, onProgress) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        _this.loadXHR(path, 'blob', onProgress)
                            .then(function (request) {
                            var image = new Image();
                            window.URL.revokeObjectURL(request.response);
                            image.src = window.URL.createObjectURL(request.response);
                            resolve(image);
                        })
                            .catch(reject);
                    })];
            });
        });
    };
    Loader.prototype.loadImageElement = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        var request = new Image();
                        request.addEventListener('error', function () {
                            reject();
                        }, false);
                        request.addEventListener('load', function () {
                            resolve(request);
                        }, false);
                        request.src = path;
                    })];
            });
        });
    };
    Loader.prototype.loadImages = function (baseURL, images, onProgress) {
        return __awaiter(this, void 0, void 0, function () {
            var promises, progression_1, onProgressUpdate_1, loaded_1, total_1;
            var _this = this;
            return __generator(this, function (_a) {
                promises = [];
                if (this.supportsBlob) {
                    progression_1 = {};
                    onProgressUpdate_1 = function () {
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
                    loaded_1 = 0;
                    total_1 = images.length;
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
                return [2, Promise.all(promises)];
            });
        });
    };
    Loader.prototype.loadJSON = function (path, onProgress) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        _this.loadXHR(path, 'json', onProgress)
                            .then(function (request) {
                            var json = request.response;
                            if (typeof json === 'string') {
                                json = JSON.parse(json);
                            }
                            resolve(json);
                        })
                            .catch(reject);
                    })];
            });
        });
    };
    Loader.prototype.loadAudioElement = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
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
                    })];
            });
        });
    };
    Loader.prototype.loadVideoElement = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
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
                    })];
            });
        });
    };
    Loader.prototype.loadAssets = function (items, onProgress) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
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
                    })];
            });
        });
    };
    return Loader;
}());
exports.Loader = Loader;
exports.default = new Loader();
//# sourceMappingURL=loader.js.map