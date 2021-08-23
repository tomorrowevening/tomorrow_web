import { guid } from '../utils/dom';
import { precisionComplete } from '../utils/math';
import raf from '../utils/raf';
export class Smooth {
    constructor(obj, param, opts) {
        this.id = guid();
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
            if (opts.precision !== undefined) {
                this.precision = opts.precision;
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
    update() {
        const value = this.object[this.param];
        this.velocity = ((this.target - value) * this.speed) + (this.velocity * this.bounce);
        const newValue = value + this.velocity;
        this.object[this.param] = newValue;
        if (this.onUpdate !== undefined)
            this.onUpdate();
        if (this.precision > 0) {
            if (precisionComplete(newValue, this.target, this.precision)) {
                this.complete();
            }
        }
    }
    complete() {
        this.velocity = 0;
        this.object[this.param] = this.target;
        if (this.onUpdate !== undefined)
            this.onUpdate();
    }
    killVelocity() {
        this.velocity = 0;
    }
}
export class SmoothController {
    constructor() {
        this.items = [];
    }
    to(obj, param, opts) {
        const index = this.hasItem(obj, param);
        if (index > -1) {
            const item = this.items[index];
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
        const smooth = new Smooth(obj, param, opts);
        this.items.push(smooth);
        return smooth;
    }
    remove(id) {
        const total = this.items.length;
        for (let i = 0; i < total; ++i) {
            const item = this.items[i];
            if (item.id === id) {
                this.items.splice(i, 1);
                return;
            }
        }
    }
    update() {
        this.items.forEach((item) => {
            item.update();
        });
    }
    hasItem(obj, param) {
        const total = this.items.length;
        for (let i = 0; i < total; ++i) {
            const item = this.items[i];
            if (item === obj && obj.param === param) {
                return i;
            }
        }
        return -1;
    }
}
const smoothing = new SmoothController();
raf.add('smooth', () => { smoothing.update(); });
export default smoothing;
