export class Raf {
    constructor() {
        this.playing = false;
        this.clock = {
            elapsed: 0,
            delta: 0,
            start: 0,
            last: 0,
            now: () => {
                return performance.now();
            },
            seconds: () => {
                return this.clock.elapsed / 1000;
            },
            restart: () => {
                this.clock.delta = 0;
                this.clock.elapsed = 0;
                const now = this.clock.now();
                this.clock.start = now;
                this.clock.last = now;
            },
            update: () => {
                const now = this.clock.now();
                this.clock.delta = now - this.clock.last;
                if (this.clock.delta > 1000)
                    this.clock.delta = 0;
                this.clock.elapsed += this.clock.delta;
                this.clock.last = now;
            }
        };
        this.callbacks = new Map();
        this.onUpdate = () => {
            this.update();
            this.onRAF = window.requestAnimationFrame(this.onUpdate);
        };
        document.addEventListener('visibilitychange', () => {
            this.playing = !document.hidden;
        }, false);
    }
    add(name, callback) {
        if (!this.callbacks.has(name)) {
            this.callbacks.set(name, callback);
        }
    }
    remove(name) {
        this.callbacks.delete(name);
    }
    play() {
        if (this.playing)
            return;
        this.playing = true;
        this.clock.restart();
        this.onUpdate();
    }
    pause() {
        if (!this.playing)
            return;
        this.playing = false;
        window.cancelAnimationFrame(this.onRAF);
        this.onRAF = undefined;
    }
    update() {
        for (let callback of this.callbacks.values()) {
            callback();
        }
    }
}
const raf = new Raf();
export default raf;
