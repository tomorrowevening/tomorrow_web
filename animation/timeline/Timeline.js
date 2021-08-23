import { between } from '../../utils/math';
import Keyframe from './Keyframe';
import Marker from './Marker';
import PlayMode from './PlayMode';
export default class Timeline {
    constructor(opts) {
        this.duration = 0;
        this.keyframes = [];
        this.markers = [];
        this.mode = PlayMode.Loop;
        this.playing = true;
        this.speed = 1;
        this.time = {
            seconds: 0,
            prevSeconds: 0,
            lastUpdate: 0
        };
        if (opts !== undefined) {
            if (opts.mode !== undefined)
                this.mode = opts.mode;
            if (opts.duration !== undefined)
                this.duration = opts.duration;
            if (opts.playing !== undefined)
                this.playing = opts.playing;
            if (opts.speed !== undefined)
                this.speed = opts.speed;
        }
    }
    dispose() {
        this.keyframes = [];
        this.markers = [];
    }
    addKeyframe(obj, opts) {
        this.keyframes.push(new Keyframe(obj, opts));
    }
    addMarker(name = '', time = 0) {
        this.markers.push(new Marker(name, time));
    }
    pushKeyframe(keyframe) {
        this.keyframes.push(keyframe);
    }
    getMarker(name) {
        const total = this.markers.length;
        for (let i = 0; i < total; ++i) {
            const marker = this.markers[i];
            if (marker.name === name) {
                return marker;
            }
        }
        return undefined;
    }
    goToMarker(name) {
        const marker = this.getMarker(name);
        if (marker !== undefined) {
            this.seconds = marker.time;
            if (marker.callback !== undefined) {
                marker.callback();
            }
        }
    }
    play() {
        this.playing = true;
        this.resetTime();
    }
    pause() {
        this.playing = false;
    }
    update(time) {
        if (!this.playing)
            return;
        if (time !== undefined)
            this.time.seconds = time;
        this.updateKeyframes();
        this.updateTime();
        this.updateMarkers();
    }
    updateKeyframes() {
        this.keyframes.forEach((keyframe) => {
            if (keyframe.isActive(this.seconds)) {
                keyframe.update(this.seconds);
            }
        });
    }
    updateMarkers() {
        const total = this.markers.length;
        for (let i = 0; i < total; ++i) {
            const marker = this.markers[i];
            const isActive = between(this.time.prevSeconds, this.time.seconds, marker.time);
            if (isActive) {
                if (marker.callback !== undefined) {
                    marker.callback();
                }
                if (marker.name.search('-stop') > 0) {
                    this.pause();
                    this.seconds = marker.time;
                }
                return;
            }
        }
    }
    updateTime() {
        const { now } = this;
        const delta = (now - this.time.lastUpdate) / 1000;
        const nextTime = this.time.seconds + (delta * this.speed);
        this.time.lastUpdate = now;
        this.time.prevSeconds = this.time.seconds;
        this.time.seconds = nextTime;
        if (this.duration > 0 && this.time.seconds >= this.duration) {
            switch (this.mode) {
                default:
                case PlayMode.Loop:
                    this.time.seconds = 0;
                    break;
                case PlayMode.Once:
                    this.time.seconds = this.duration;
                    this.playing = false;
                    break;
                case PlayMode.PingPong:
                    this.time.seconds = this.duration - delta;
                    this.speed = -Math.abs(this.speed);
                    break;
            }
        }
        if (this.time.seconds < 0 && this.mode === PlayMode.PingPong) {
            this.time.seconds = 0;
            this.speed = Math.abs(this.speed);
        }
    }
    resetTime() {
        this.time.lastUpdate = this.now;
    }
    get now() {
        return (performance || Date).now();
    }
    get seconds() {
        return this.time.seconds;
    }
    set seconds(value) {
        this.time.seconds = value;
    }
}
