"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmoothController = exports.Smooth = void 0;
var dom_1 = require("../utils/dom");
var math_1 = require("../utils/math");
var raf_1 = require("../utils/raf");
var Smooth = (function () {
    function Smooth(obj, param, opts) {
        this.id = dom_1.guid();
        this.speed = 0.1;
        this.bounce = 0;
        this.precision = 0;
        this.target = 0;
        this.velocity = 0;
        this.object = obj;
        this.param = param;
        this.target = obj[param];
        if (opts !== undefined) {
            if (opts.id !== undefined) {
                this.id = opts.id;
            }
            if (opts.speed !== undefined) {
                this.speed = opts.speed;
            }
            if (opts.bounce !== undefined) {
                this.bounce = opts.bounce;
            }
            if (opts.target !== undefined) {
                this.target = opts.target;
            }
            if (opts.onUpdate !== undefined) {
                this.onUpdate = opts.onUpdate;
            }
        }
    }
    Smooth.prototype.update = function () {
        var value = this.object[this.param];
        this.velocity = ((this.target - value) * this.speed) + (this.velocity * this.bounce);
        var newValue = value + this.velocity;
        this.object[this.param] = newValue;
        if (this.onUpdate !== undefined)
            this.onUpdate();
        if (this.precision > 0) {
            if (math_1.precisionComplete(newValue, this.target, this.precision)) {
                this.complete();
            }
        }
    };
    Smooth.prototype.complete = function () {
        this.velocity = 0;
        this.object[this.param] = this.target;
        if (this.onUpdate !== undefined)
            this.onUpdate();
    };
    Smooth.prototype.killVelocity = function () {
        this.velocity = 0;
    };
    return Smooth;
}());
exports.Smooth = Smooth;
var SmoothController = (function () {
    function SmoothController() {
        this.items = [];
    }
    SmoothController.prototype.to = function (obj, param, opts) {
        var index = this.hasItem(obj, param);
        if (index > -1) {
            var item = this.items[index];
            if (opts) {
                if (opts.bounce)
                    item.bounce = opts.bounce;
                if (opts.speed)
                    item.speed = opts.speed;
                if (opts.target)
                    item.target = opts.target;
                if (opts.onUpdate)
                    item.onUpdate = opts.onUpdate;
            }
            return item;
        }
        var smooth = new Smooth(obj, param, opts);
        this.items.push(smooth);
        return smooth;
    };
    SmoothController.prototype.remove = function (id) {
        var total = this.items.length;
        for (var i = 0; i < total; ++i) {
            var item = this.items[i];
            if (item.id === id) {
                this.items.splice(i, 1);
                return;
            }
        }
    };
    SmoothController.prototype.update = function () {
        this.items.forEach(function (item) {
            item.update();
        });
    };
    SmoothController.prototype.hasItem = function (obj, param) {
        var total = this.items.length;
        for (var i = 0; i < total; ++i) {
            var item = this.items[i];
            if (item === obj && obj.param === param) {
                return i;
            }
        }
        return -1;
    };
    return SmoothController;
}());
exports.SmoothController = SmoothController;
var smoothing = new SmoothController();
raf_1.default.add('smooth', function () { smoothing.update(); });
exports.default = smoothing;
