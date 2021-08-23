import { AnimationMixer, LoopOnce, LoopRepeat, PerspectiveCamera } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
export default class GLTFPlayer {
    constructor(url = '', onLoad = () => { }, onProgress = (percent) => { }, onError = (error) => { }) {
        this.actions = {};
        this.cameras = [];
        this.timeScale = 1;
        this.loaded = false;
        this.animations = {};
        this.currentAnimation = '';
        if (url.length > 0) {
            GLTFPlayer.loadGLTF(url, (progress) => {
                onProgress(progress);
            }).then((gltf) => {
                this.setGLTF(gltf);
                onLoad();
            }).catch((reason) => {
                onError(reason);
            });
        }
    }
    setGLTF(gltf) {
        this.scene = gltf.scene;
        this.cameras = gltf.cameras;
        this.mixer = new AnimationMixer(this.scene);
        gltf.animations.forEach((animation) => {
            const action = this.mixer.clipAction(animation);
            this.actions[animation.name] = action;
            this.animations[animation.name] = animation;
        });
        this.loaded = true;
    }
    update(delta) {
        if (this.loaded) {
            this.mixer.timeScale = this.timeScale;
            this.mixer.update(delta);
        }
    }
    play(animation) {
        const action = this.getAction(animation);
        if (action !== undefined) {
            action.clampWhenFinished = true;
            action.setLoop(LoopOnce);
            this.currentAction = action;
            this.currentClip = this.getAnimation(animation);
            this.currentAnimation = animation;
            action.play();
        }
    }
    stop(animation = '') {
        const ani = animation.length > 0 ? animation : this.currentAnimation;
        if (ani.length < 1)
            return;
        const action = this.getAction(ani);
        if (action !== undefined) {
            this.currentAnimation = '';
            this.currentAction = undefined;
            this.currentClip = undefined;
            action.stop();
        }
    }
    pause() {
        if (this.currentAction !== undefined) {
            this.currentAction.paused = true;
        }
    }
    togglePause() {
        if (this.currentAction !== undefined) {
            this.currentAction.paused = !this.currentAction.paused;
        }
    }
    loopOnce() {
        if (this.currentAnimation.length > 0) {
            this.currentAction.setLoop(LoopOnce, 0);
        }
    }
    loopRepeat(repetitions = Infinity) {
        if (this.currentAnimation.length > 0) {
            this.currentAction.setLoop(LoopRepeat, repetitions);
        }
    }
    getAction(animation) {
        return this.actions[animation];
    }
    getAnimation(animation) {
        return this.animations[animation];
    }
    resizeCameras(aspect) {
        this.cameras.forEach((camera) => {
            if (camera instanceof PerspectiveCamera) {
                const perspective = camera;
                perspective.aspect = aspect;
                perspective.updateProjectionMatrix();
            }
        });
    }
    static loadGLTF(path, onProgress) {
        return new Promise((resolve, reject) => {
            const modelLoader = new GLTFLoader();
            modelLoader.load(path, (gltf) => {
                resolve(gltf);
            }, (event) => {
                if (onProgress)
                    onProgress(event.loaded / event.total);
            }, () => {
                reject();
            });
        });
    }
    get duration() {
        if (this.currentClip !== undefined) {
            return this.currentClip.duration;
        }
        return -1;
    }
    get time() {
        if (this.currentAction !== undefined) {
            return this.currentAction.time;
        }
        return -1;
    }
    get percent() {
        return this.time / this.duration;
    }
    get isPaused() {
        return this.currentAction.paused;
    }
    set percent(value) {
        if (this.currentAction !== undefined) {
            this.currentAction.time = value * this.duration;
        }
    }
    set time(value) {
        if (this.currentAction !== undefined) {
            this.currentAction.time = value;
        }
    }
}
