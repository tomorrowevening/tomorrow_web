import { guid } from '../utils/dom';
import { precisionComplete } from '../utils/math';
import raf from '../utils/raf';

/**
 * Optional properties
 */
interface SmoothProps {
  id?: string;
  target?: number;
  speed?: number;
  bounce?: number;
  precision?: number;
  onUpdate?: () => void;
}

/**
 * Smoothly interpolates an object's values using speed/bounce.
 */
export class Smooth {
  id: string = guid();

  object: any;

  param: string;

  speed: number = 0.1;

  bounce: number = 0;

  precision: number = 0;

  target: number = 0;

  velocity: number = 0;

  onUpdate?: () => void;

  constructor(obj: any, param: string, opts?: SmoothProps) {
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

  /**
   * Updates the animation.
   */
  update() {
    const value: number = this.object[this.param];
    // Update velocity
    this.velocity = ((this.target - value) * this.speed) + (this.velocity * this.bounce);
    // Update value
    const newValue = value + this.velocity;
    this.object[this.param] = newValue;
    if (this.onUpdate !== undefined) this.onUpdate();
    // Check precision
    if (this.precision > 0) {
      if (precisionComplete(newValue, this.target, this.precision)) {
        this.complete();
      }
    }
  }

  /**
   * Completes the animation so all values reach their designation.
   */
  complete() {
    this.velocity = 0;
    this.object[this.param] = this.target;
    if (this.onUpdate !== undefined) this.onUpdate();
  }

  /**
   * Kills the velocity so the acceleration resets.
   */
  killVelocity() {
    this.velocity = 0;
  }
}

// Handles groups of Smoothing objects
export class SmoothController {
  items: Array<Smooth> = [];

  to(obj: any, param: string, opts?: SmoothProps): Smooth {
    const index = this.hasItem(obj, param);
    if (index > -1) {
      const item = this.items[index] as Smooth;
      if (opts) {
        if (opts.bounce) item.bounce = opts.bounce;
        if (opts.speed) item.speed = opts.speed;
        if (opts.target) item.target = opts.target;
        if (opts.onUpdate) item.onUpdate = opts.onUpdate;
      }
      return item;
    }
    const smooth = new Smooth(obj, param, opts);
    this.items.push(smooth);
    return smooth;
  }

  remove(id: string) {
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
    this.items.forEach((item: Smooth) => {
      item.update();
    });
  }

  hasItem(obj: any, param: string): number {
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

// Global instance
const smoothing = new SmoothController();
raf.add('smooth', () => { smoothing.update(); });
export default smoothing;
