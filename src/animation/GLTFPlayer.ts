import {
  AnimationClip,
  AnimationMixer,
  Camera,
  Group,
  LoopOnce,
  LoopRepeat,
  PerspectiveCamera,
  AnimationAction
} from 'three';
import {
  GLTF,
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * Wrapper class for GLTF Loading / Animation
 * @author Colin Duffy
 */
export default class GLTFPlayer {
  public actions: Object = {};

  public cameras: Array<Camera> = [];

  public scene: Group;

  public timeScale: number = 1;

  public loaded: Boolean = false;

  public animations: Object = {};

  private currentAction: AnimationAction;

  private currentClip: AnimationClip;

  public mixer: AnimationMixer;

  public currentAnimation: String = '';

  constructor(
    url: string = '',
    onLoad: Function = () => { },
    onProgress: Function = (percent: number) => { },
    onError: Function = (error: Error) => { }
  ) {
    if (url.length > 0) {
      GLTFPlayer.loadGLTF(url, (progress: number) => {
        onProgress(progress);
      }).then((gltf: GLTF) => {
        this.setGLTF(gltf);
        onLoad();
      }).catch((reason: any) => {
        onError(reason);
      });
    }
  }

  /**
   * Sets the GLTF object
   * @param gltf An object with animations (Array<AnimationClip>), asset (Object),
   * scene (Group), scenes (Array<Group>), and cameras (Array<Camera>)
   */
  setGLTF(gltf: any) {
    // Assign
    this.scene = gltf.scene;
    this.cameras = gltf.cameras;

    // Setup mixer
    this.mixer = new AnimationMixer(this.scene);

    // Add animations to mixer
    // @ts-ignore
    gltf.animations.forEach((animation) => {
      // Retrieve actions by name :)
      const action = this.mixer.clipAction(animation);
      this.actions[animation.name] = action;
      this.animations[animation.name] = animation;
    });

    this.loaded = true;
  }

  /**
   * Updates the Animation Mixer
   * @param delta Time since last update
   */
  update(delta: number) {
    if (this.loaded) {
      this.mixer.timeScale = this.timeScale;
      this.mixer.update(delta);
    }
  }

  /**
   * Plays an animation
   * @param animation The name of the animation
   */
  play(animation: String) {
    const action = this.getAction(animation);
    if (action !== undefined) {
      action.clampWhenFinished = true;
      action.setLoop(LoopOnce);

      this.currentAction = action;
      this.currentClip = this.getAnimation(animation);
      this.currentAnimation = animation;
      action.play();
    }
  }

  /**
   * Stops the animation
   * @param animation
   */
  stop(animation: String = '') {
    const ani = animation.length > 0 ? animation : this.currentAnimation;
    if (ani.length < 1) return;
    const action = this.getAction(ani);
    if (action !== undefined) {
      this.currentAnimation = '';
      this.currentAction = undefined;
      this.currentClip = undefined;
      action.stop();
    }
  }

  pause() {
    if (this.currentAction !== undefined) {
      this.currentAction.paused = true;
    }
  }

  togglePause() {
    if (this.currentAction !== undefined) {
      this.currentAction.paused = !this.currentAction.paused;
    }
  }

  loopOnce() {
    if (this.currentAnimation.length > 0) {
      this.currentAction.setLoop(LoopOnce, 0);
    }
  }

  loopRepeat(repetitions: number = Infinity) {
    if (this.currentAnimation.length > 0) {
      this.currentAction.setLoop(LoopRepeat, repetitions);
    }
  }

  /**
   * Gets the AnimationAction
   * @param animation The name of the animation
   * @returns AnimationAction
   */
  getAction(animation: String) {
    // @ts-ignore
    return this.actions[animation];
  }

  /**
   * Gets the AnimationClip
   * @param animation
   * @returns AnimationClip
   */
  getAnimation(animation: String): AnimationClip {
    // @ts-ignore
    return this.animations[animation];
  }

  /**
   * Resizes the camera viewports
   * @param aspect
   */
  resizeCameras(aspect: number) {
    this.cameras.forEach((camera) => {
      if (camera instanceof PerspectiveCamera) {
        const perspective = camera as PerspectiveCamera;
        perspective.aspect = aspect;
        perspective.updateProjectionMatrix();
      }
    });
  }

  static loadGLTF(path: string, onProgress?: (percent: number) => void) {
    return new Promise<GLTF>((resolve, reject) => {
      const modelLoader = new GLTFLoader();
      modelLoader.load(
        path,
        (gltf: GLTF) => {
          resolve(gltf);
        },
        (event: ProgressEvent) => {
          if (onProgress) onProgress(event.loaded / event.total);
        },
        () => {
          reject();
        }
      );
    });
  }

  // Getters

  get duration(): number {
    if (this.currentClip !== undefined) {
      return this.currentClip.duration;
    }
    return -1;
  }

  get time(): number {
    if (this.currentAction !== undefined) {
      return this.currentAction.time;
    }
    return -1;
  }

  get percent(): number {
    return this.time / this.duration;
  }

  get isPaused(): Boolean {
    return this.currentAction.paused;
  }

  // Setters

  set percent(value: number) {
    if (this.currentAction !== undefined) {
      this.currentAction.time = value * this.duration;
    }
  }

  set time(value: number) {
    if (this.currentAction !== undefined) {
      this.currentAction.time = value;
    }
  }
}