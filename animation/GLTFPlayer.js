"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var three_1 = require("three");
var GLTFLoader_1 = require("three/examples/jsm/loaders/GLTFLoader");
var GLTFPlayer = (function () {
    function GLTFPlayer(url, onLoad, onProgress, onError) {
        var _this = this;
        if (url === void 0) { url = ''; }
        if (onLoad === void 0) { onLoad = function () { }; }
        if (onProgress === void 0) { onProgress = function (percent) { }; }
        if (onError === void 0) { onError = function (error) { }; }
        this.actions = {};
        this.cameras = [];
        this.timeScale = 1;
        this.loaded = false;
        this.animations = {};
        this.currentAnimation = '';
        if (url.length > 0) {
            GLTFPlayer.loadGLTF(url, function (progress) {
                onProgress(progress);
            }).then(function (gltf) {
                _this.setGLTF(gltf);
                onLoad();
            }).catch(function (reason) {
                onError(reason);
            });
        }
    }
    GLTFPlayer.prototype.setGLTF = function (gltf) {
        var _this = this;
        this.scene = gltf.scene;
        this.cameras = gltf.cameras;
        this.mixer = new three_1.AnimationMixer(this.scene);
        gltf.animations.forEach(function (animation) {
            var action = _this.mixer.clipAction(animation);
            _this.actions[animation.name] = action;
            _this.animations[animation.name] = animation;
        });
        this.loaded = true;
    };
    GLTFPlayer.prototype.update = function (delta) {
        if (this.loaded) {
            this.mixer.timeScale = this.timeScale;
            this.mixer.update(delta);
        }
    };
    GLTFPlayer.prototype.play = function (animation) {
        var action = this.getAction(animation);
        if (action !== undefined) {
            action.clampWhenFinished = true;
            action.setLoop(three_1.LoopOnce);
            this.currentAction = action;
            this.currentClip = this.getAnimation(animation);
            this.currentAnimation = animation;
            action.play();
        }
    };
    GLTFPlayer.prototype.stop = function (animation) {
        if (animation === void 0) { animation = ''; }
        var ani = animation.length > 0 ? animation : this.currentAnimation;
        if (ani.length < 1)
            return;
        var action = this.getAction(ani);
        if (action !== undefined) {
            this.currentAnimation = '';
            this.currentAction = undefined;
            this.currentClip = undefined;
            action.stop();
        }
    };
    GLTFPlayer.prototype.pause = function () {
        if (this.currentAction !== undefined) {
            this.currentAction.paused = true;
        }
    };
    GLTFPlayer.prototype.togglePause = function () {
        if (this.currentAction !== undefined) {
            this.currentAction.paused = !this.currentAction.paused;
        }
    };
    GLTFPlayer.prototype.loopOnce = function () {
        if (this.currentAnimation.length > 0) {
            this.currentAction.setLoop(three_1.LoopOnce, 0);
        }
    };
    GLTFPlayer.prototype.loopRepeat = function (repetitions) {
        if (repetitions === void 0) { repetitions = Infinity; }
        if (this.currentAnimation.length > 0) {
            this.currentAction.setLoop(three_1.LoopRepeat, repetitions);
        }
    };
    GLTFPlayer.prototype.getAction = function (animation) {
        return this.actions[animation];
    };
    GLTFPlayer.prototype.getAnimation = function (animation) {
        return this.animations[animation];
    };
    GLTFPlayer.prototype.resizeCameras = function (aspect) {
        this.cameras.forEach(function (camera) {
            if (camera instanceof three_1.PerspectiveCamera) {
                var perspective = camera;
                perspective.aspect = aspect;
                perspective.updateProjectionMatrix();
            }
        });
    };
    GLTFPlayer.loadGLTF = function (path, onProgress) {
        return new Promise(function (resolve, reject) {
            var modelLoader = new GLTFLoader_1.GLTFLoader();
            modelLoader.load(path, function (gltf) {
                resolve(gltf);
            }, function (event) {
                if (onProgress)
                    onProgress(event.loaded / event.total);
            }, function () {
                reject();
            });
        });
    };
    Object.defineProperty(GLTFPlayer.prototype, "duration", {
        get: function () {
            if (this.currentClip !== undefined) {
                return this.currentClip.duration;
            }
            return -1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLTFPlayer.prototype, "time", {
        get: function () {
            if (this.currentAction !== undefined) {
                return this.currentAction.time;
            }
            return -1;
        },
        set: function (value) {
            if (this.currentAction !== undefined) {
                this.currentAction.time = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLTFPlayer.prototype, "percent", {
        get: function () {
            return this.time / this.duration;
        },
        set: function (value) {
            if (this.currentAction !== undefined) {
                this.currentAction.time = value * this.duration;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLTFPlayer.prototype, "isPaused", {
        get: function () {
            return this.currentAction.paused;
        },
        enumerable: false,
        configurable: true
    });
    return GLTFPlayer;
}());
exports.default = GLTFPlayer;
