import { between, clamp, cubicBezier, mix, normalize } from '../../utils/math';
import { guid } from '../../utils/dom';
import Ease from './Ease';
export default class Keyframe {
    constructor(obj, opts) {
        this.name = guid();
        this.time = 0;
        this.duration = 0;
        this.ease = Ease.none;
        this.easeType = Ease.BEZIER;
        this.props = [];
        this.startValues = [];
        this.endValues = [];
        this.onUpdate = undefined;
        this.object = obj;
        const originalEaseType = this.easeType;
        Object.keys(opts).forEach((key) => {
            const value = opts[key];
            if (key === 'name') {
                this.name = value;
            }
            else if (key === 'delay') {
                this.time = value;
            }
            else if (key === 'duration') {
                this.duration = value;
            }
            else if (key === 'ease') {
                this.ease = value;
            }
            else if (key === 'type') {
                this.easeType = value;
            }
            else if (key === 'onUpdate') {
                this.onUpdate = value;
            }
            else if (key !== 'start') {
                let start = this.object[key];
                if (opts.start !== undefined) {
                    start = opts.start[key];
                }
                this.props.push(key);
                this.startValues.push(start);
                this.endValues.push(value);
            }
        });
        const linearEase = this.ease[0] === this.ease[1] && this.ease[2] === this.ease[3];
        const sameEaseType = originalEaseType === this.easeType;
        if (linearEase && sameEaseType) {
            this.easeType = Ease.LINEAR;
        }
    }
    update(time) {
        const startTime = this.time;
        const { endTime } = this;
        const percent = normalize(startTime, endTime, clamp(startTime, endTime, time));
        const progress = clamp(0, 1, this.getCurve(percent));
        this.props.forEach((prop, index) => {
            const start = this.startValues[index];
            const target = this.endValues[index];
            if (Array.isArray(start)) {
                const total = start.length;
                const values = [];
                for (let i = 0; i < total; ++i) {
                    values.push(mix(start[i], target[i], progress));
                }
                this.object[prop] = values;
            }
            else if (typeof start === 'string' || typeof start === 'boolean') {
                this.object[prop] = progress < 1 ? start : target;
            }
            else {
                this.object[prop] = mix(start, target, progress);
            }
        });
        if (this.onUpdate !== undefined)
            this.onUpdate(progress);
    }
    getCurve(percent) {
        if (this.easeType === Ease.BEZIER) {
            return cubicBezier(percent, this.ease[0], this.ease[1], this.ease[2], this.ease[3]);
        }
        else if (this.easeType === Ease.HOLD) {
            return percent < 1 ? 0 : 1;
        }
        return percent;
    }
    isActive(time) {
        return between(this.time, this.time + this.duration, time);
    }
    get startTime() {
        return this.time;
    }
    get endTime() {
        return this.time + this.duration;
    }
}
