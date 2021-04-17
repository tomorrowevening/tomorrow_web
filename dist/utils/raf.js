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
function RafUtil() {
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
            return this.elapsed / 1000;
        },
        restart: function () {
            this.delta = 0;
            this.elapsed = 0;
            var now = this.clock.now();
            this.start = now;
            this.last = now;
        },
        update: function () {
            var now = this.now();
            this.delta = now - this.last;
            if (this.delta > 1000)
                this.delta = 0;
            this.elapsed += this.delta;
            this.last = now;
        }
    };
    var callbacks = new Map();
    var onRAF;
    var onUpdate = function () {
        _this.update();
        onRAF = window.requestAnimationFrame(onUpdate);
    };
    document.addEventListener('visibilitychange', function () {
        _this.playing = !document.hidden;
    }, false);
    this.add = function (name, callback) {
        if (!callbacks.has(name)) {
            callbacks.set(name, callback);
        }
    };
    this.remove = function (name) {
        callbacks.delete(name);
    };
    this.play = function () {
        if (this.playing)
            return;
        this.playing = true;
        this.clock.restart();
        onUpdate();
    };
    this.pause = function () {
        if (!this.playing)
            return;
        this.playing = false;
        window.cancelAnimationFrame(onRAF);
        onRAF = undefined;
    };
    this.update = function () {
        var e_1, _a;
        try {
            for (var _b = __values(callbacks.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
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
    return this;
}
var raf = RafUtil();
exports.default = raf;
