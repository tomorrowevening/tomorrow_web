"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raf = void 0;
var Raf = (function () {
    function Raf() {
        var _this = this;
        this.playing = false;
        this.clock = {
            elapsed: 0,
            delta: 0,
            start: 0,
            last: 0,
            now: function () {
                return performance.now();
            },
            seconds: function () {
                return _this.clock.elapsed / 1000;
            },
            restart: function () {
                _this.clock.delta = 0;
                _this.clock.elapsed = 0;
                var now = _this.clock.now();
                _this.clock.start = now;
                _this.clock.last = now;
            },
            update: function () {
                var now = _this.clock.now();
                _this.clock.delta = now - _this.clock.last;
                if (_this.clock.delta > 1000)
                    _this.clock.delta = 0;
                _this.clock.elapsed += _this.clock.delta;
                _this.clock.last = now;
            }
        };
        this.callbacks = new Map();
        this.onUpdate = function () {
            _this.update();
            _this.onRAF = window.requestAnimationFrame(_this.onUpdate);
        };
        document.addEventListener('visibilitychange', function () {
            _this.playing = !document.hidden;
        }, false);
    }
    Raf.prototype.add = function (name, callback) {
        if (!this.callbacks.has(name)) {
            this.callbacks.set(name, callback);
        }
    };
    Raf.prototype.remove = function (name) {
        this.callbacks.delete(name);
    };
    Raf.prototype.play = function () {
        if (this.playing)
            return;
        this.playing = true;
        this.clock.restart();
        this.onUpdate();
    };
    Raf.prototype.pause = function () {
        if (!this.playing)
            return;
        this.playing = false;
        window.cancelAnimationFrame(this.onRAF);
        this.onRAF = undefined;
    };
    Raf.prototype.update = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.callbacks.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var callback = _c.value;
                callback();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return Raf;
}());
exports.Raf = Raf;
var raf = new Raf();
exports.default = raf;
