/**
 * A singleton object that utilizes requestAnimationFrame and pauses/plays based
 * on the browser's 'visibilitychange' events, and also keeps time.
 */
export class Raf {
  playing: boolean = false;

	clock = {
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
			if (this.clock.delta > 1000) this.clock.delta = 0;
			this.clock.elapsed += this.clock.delta;
			this.clock.last = now;
		}
	};

	private callbacks: Map<string, () => void> = new Map();

	private onRAF: any;

	private onUpdate: any;

	constructor() {
		this.onUpdate = () => {
			this.update();
			this.onRAF = window.requestAnimationFrame(this.onUpdate);
		};
		document.addEventListener('visibilitychange', () => {
			this.playing = !document.hidden;
		}, false);
	}

	/**
	 * Add a RAF listener
	 * @param name The name of the identifer
	 * @param callback A function to be called every frame
	 */
	add(name: string, callback: () => void) {
		if (!this.callbacks.has(name)) {
			this.callbacks.set(name, callback);
		}
	}

	/**
	 * Removes a RAF listener
	 * @param callback A function to be called every frame
	 */
	remove(name: string) {
		this.callbacks.delete(name);
	}

	/**
	 * Plays the RAF singleton
	 */
	play() {
		if (this.playing) return;
		this.playing = true;
		this.clock.restart();
		this.onUpdate();
	}

	/**
	 * Pauses the RAF singleton
	 */
	pause() {
		if (!this.playing) return;
		this.playing = false;
		window.cancelAnimationFrame(this.onRAF);
		this.onRAF = undefined;
	}

	/**
	 * Calls all callback functions
	 */
	update() {
		for (let callback of this.callbacks.values()) {
			callback();
		}
	}
}

const raf = new Raf();
export default raf;