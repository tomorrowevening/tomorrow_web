"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var math_1 = require("../../utils/math");
var Keyframe_1 = require("./Keyframe");
var Marker_1 = require("./Marker");
var PlayMode_1 = require("./PlayMode");
var Timeline = (function () {
    function Timeline(opts) {
        this.duration = 0;
        this.keyframes = [];
        this.markers = [];
        this.mode = PlayMode_1.default.Loop;
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
    Timeline.prototype.dispose = function () {
        this.keyframes = [];
        this.markers = [];
    };
    Timeline.prototype.addKeyframe = function (obj, opts) {
        this.keyframes.push(new Keyframe_1.default(obj, opts));
    };
    Timeline.prototype.addMarker = function (name, time) {
        if (name === void 0) { name = ''; }
        if (time === void 0) { time = 0; }
        this.markers.push(new Marker_1.default(name, time));
    };
    Timeline.prototype.pushKeyframe = function (keyframe) {
        this.keyframes.push(keyframe);
    };
    Timeline.prototype.getMarker = function (name) {
        var total = this.markers.length;
        for (var i = 0; i < total; ++i) {
            var marker = this.markers[i];
            if (marker.name === name) {
                return marker;
            }
        }
        return undefined;
    };
    Timeline.prototype.goToMarker = function (name) {
        var marker = this.getMarker(name);
        if (marker !== undefined) {
            this.seconds = marker.time;
            if (marker.callback !== undefined) {
                marker.callback();
            }
        }
    };
    Timeline.prototype.play = function () {
        this.playing = true;
        this.resetTime();
    };
    Timeline.prototype.pause = function () {
        this.playing = false;
    };
    Timeline.prototype.update = function (time) {
        if (!this.playing)
            return;
        if (time !== undefined)
            this.time.seconds = time;
        this.updateKeyframes();
        this.updateTime();
        this.updateMarkers();
    };
    Timeline.prototype.updateKeyframes = function () {
        var _this = this;
        this.keyframes.forEach(function (keyframe) {
            if (keyframe.isActive(_this.seconds)) {
                keyframe.update(_this.seconds);
            }
        });
    };
    Timeline.prototype.updateMarkers = function () {
        var total = this.markers.length;
        for (var i = 0; i < total; ++i) {
            var marker = this.markers[i];
            var isActive = math_1.between(this.time.prevSeconds, this.time.seconds, marker.time);
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
    };
    Timeline.prototype.updateTime = function () {
        var now = this.now;
        var delta = (now - this.time.lastUpdate) / 1000;
        var nextTime = this.time.seconds + (delta * this.speed);
        this.time.lastUpdate = now;
        this.time.prevSeconds = this.time.seconds;
        this.time.seconds = nextTime;
        if (this.duration > 0 && this.time.seconds >= this.duration) {
            switch (this.mode) {
                default:
                case PlayMode_1.default.Loop:
                    this.time.seconds = 0;
                    break;
                case PlayMode_1.default.Once:
                    this.time.seconds = this.duration;
                    this.playing = false;
                    break;
                case PlayMode_1.default.PingPong:
                    this.time.seconds = this.duration - delta;
                    this.speed = -Math.abs(this.speed);
                    break;
            }
        }
        if (this.time.seconds < 0 && this.mode === PlayMode_1.default.PingPong) {
            this.time.seconds = 0;
            this.speed = Math.abs(this.speed);
        }
    };
    Timeline.prototype.resetTime = function () {
        this.time.lastUpdate = this.now;
    };
    Object.defineProperty(Timeline.prototype, "now", {
        get: function () {
            return (performance || Date).now();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Timeline.prototype, "seconds", {
        get: function () {
            return this.time.seconds;
        },
        set: function (value) {
            this.time.seconds = value;
        },
        enumerable: false,
        configurable: true
    });
    return Timeline;
}());
exports.default = Timeline;
