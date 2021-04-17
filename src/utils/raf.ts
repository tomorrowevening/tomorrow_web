/**
 * A singleton object that utilizes requestAnimationFrame and pauses/plays based
 * on the browser's 'visibilitychange' events, and also keeps time.
 */
function RafUtil() {
  this.playing = false;

  this.clock = {
    elapsed: 0,
    delta: 0,
    start: 0,
    last: 0,
    now: function() {
      return performance.now();
    },
    seconds: function() {
      return this.elapsed / 1000;
    },
    restart: function() {
      this.delta = 0;
      this.elapsed = 0;
      const now = this.clock.now();
      this.start = now;
      this.last = now;
    },
    update: function() {
      const now = this.now();
      this.delta = now - this.last;
      if (this.delta > 1000) this.delta = 0;
      this.elapsed += this.delta;
      this.last = now;
    }
  };

  const callbacks: Map<string, () => void> = new Map();

  let onRAF: any;

  const onUpdate = () => {
    this.update();
    onRAF = window.requestAnimationFrame(onUpdate);
  };
  document.addEventListener('visibilitychange', () => {
    this.playing = !document.hidden;
  }, false);

  /**
   * Add a RAF listener
   * @param name The name of the identifer
   * @param callback A function to be called every frame
   */
  this.add = function(name: string, callback: () => void) {
    if (!callbacks.has(name)) {
      callbacks.set(name, callback);
    }
  }

  /**
   * Removes a RAF listener
   * @param callback A function to be called every frame
   */
  this.remove = function(name: string) {
    callbacks.delete(name);
  }

  /**
   * Plays the RAF singleton
   */
  this.play = function() {
    if (this.playing) return;
    this.playing = true;
    this.clock.restart();
    onUpdate();
  }

  /**
   * Pauses the RAF singleton
   */
  this.pause = function() {
    if (!this.playing) return;
    this.playing = false;
    window.cancelAnimationFrame(onRAF);
    onRAF = undefined;
  }

  /**
   * Calls all callback functions
   */
  this.update = function() {
     for (let callback of callbacks.values()) {
       callback();
     }
  }

  return this;
}

const raf = RafUtil();
export default raf;