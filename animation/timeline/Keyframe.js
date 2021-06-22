"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var math_1 = require("../../utils/math");
var dom_1 = require("../../utils/dom");
var Ease_1 = require("./Ease");
var Keyframe = (function () {
    function Keyframe(obj, opts) {
        var _this = this;
        this.name = dom_1.guid();
        this.time = 0;
        this.duration = 0;
        this.ease = Ease_1.default.none;
        this.easeType = Ease_1.default.BEZIER;
        this.props = [];
        this.startValues = [];
        this.endValues = [];
        this.onUpdate = undefined;
        this.object = obj;
        var originalEaseType = this.easeType;
        Object.keys(opts).forEach(function (key) {
            var value = opts[key];
            if (key === 'name') {
                _this.name = value;
            }
            else if (key === 'delay') {
                _this.time = value;
            }
            else if (key === 'duration') {
                _this.duration = value;
            }
            else if (key === 'ease') {
                _this.ease = value;
            }
            else if (key === 'type') {
                _this.easeType = value;
            }
            else if (key === 'onUpdate') {
                _this.onUpdate = value;
            }
            else if (key !== 'start') {
                var start = _this.object[key];
                if (opts.start !== undefined) {
                    start = opts.start[key];
                }
                _this.props.push(key);
                _this.startValues.push(start);
                _this.endValues.push(value);
            }
        });
        var linearEase = this.ease[0] === this.ease[1] && this.ease[2] === this.ease[3];
        var sameEaseType = originalEaseType === this.easeType;
        if (linearEase && sameEaseType) {
            this.easeType = Ease_1.default.LINEAR;
        }
    }
    Keyframe.prototype.update = function (time) {
        var _this = this;
        var startTime = this.time;
        var endTime = this.endTime;
        var percent = math_1.normalize(startTime, endTime, math_1.clamp(startTime, endTime, time));
        var progress = math_1.clamp(0, 1, this.getCurve(percent));
        this.props.forEach(function (prop, index) {
            var start = _this.startValues[index];
            var target = _this.endValues[index];
            if (Array.isArray(start)) {
                var total = start.length;
                var values = [];
                for (var i = 0; i < total; ++i) {
                    values.push(math_1.mix(start[i], target[i], progress));
                }
                _this.object[prop] = values;
            }
            else if (typeof start === 'string' || typeof start === 'boolean') {
                _this.object[prop] = progress < 1 ? start : target;
            }
            else {
                _this.object[prop] = math_1.mix(start, target, progress);
            }
        });
        if (this.onUpdate !== undefined)
            this.onUpdate(progress);
    };
    Keyframe.prototype.getCurve = function (percent) {
        if (this.easeType === Ease_1.default.BEZIER) {
            return math_1.cubicBezier(percent, this.ease[0], this.ease[1], this.ease[2], this.ease[3]);
        }
        else if (this.easeType === Ease_1.default.HOLD) {
            return percent < 1 ? 0 : 1;
        }
        return percent;
    };
    Keyframe.prototype.isActive = function (time) {
        return math_1.between(this.time, this.time + this.duration, time);
    };
    Object.defineProperty(Keyframe.prototype, "startTime", {
        get: function () {
            return this.time;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Keyframe.prototype, "endTime", {
        get: function () {
            return this.time + this.duration;
        },
        enumerable: false,
        configurable: true
    });
    return Keyframe;
}());
exports.default = Keyframe;
