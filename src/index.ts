// Animation
import ease from './animation/timeline/Ease';
import Keyframe from './animation/timeline/Keyframe';
import Marker from './animation/timeline/Marker';
import PlayMode from './animation/timeline/PlayMode';
import Timeline from './animation/timeline/Timeline';
import GLTFPlayer from './animation/GLTFPlayer';
import smoothing, { Smooth, SmoothController } from './animation/Smooth';
// Three
import TextGeometry from './three/geometry/TextGeometry';
import { TextVertex, TextFragment } from './three/glsl/font';
import TextMaterial from './three/materials/TextMaterial';
import TextMesh from './three/mesh/TextMesh';
// Utils
import debug from './utils/debug';
import {
  isiPad,
  isiPhone,
  isiOS,
  isChrome,
  isSafari,
  isFirefox,
  isOpera,
  isMobile,
  hasUserMedia,
  supportsWebp,
  delay,
  fileName,
  guid
} from './utils/dom';
import loader from './utils/loader';
import {
  DEGREES,
  RADIANS,
  TWO_PI,
  HALF_PI,
  between,
  clamp,
  normalize,
  mix,
  map,
  roundTo,
  distance,
  distance2,
  distance3,
  random,
  getAngle,
  toDeg,
  toRad,
  cosRange,
  precisionComplete,
  cubicBezier,
  mixArrays
} from './utils/math';
import raf from './utils/raf';
import {
  orthoCamera,
  plane,
  triangle,
  dispose,
  findObjectsWithName,
  anchorGeometry,
  anchorGeometryTL,
  setBlendNormal,
  setBlendAdd,
  setBlendMultiply,
  setBlendScreen,
  FBO,
  DoubleFBO,
  Pass,
  updateTextureData,
  compileShader,
  RawShader,
  updateCameraPerspective,
  updateCameraOrtho
} from './utils/three';

export default {
  ease,
  Keyframe,
  Marker,
  PlayMode,
  Timeline,
  GLTFPlayer,
  Smooth,
  SmoothController,
  smoothing,
  // Three
  TextGeometry,
  TextVertex,
  TextFragment,
  TextMaterial,
  TextMesh,
  // Utils
  debug,
  isiPad,
  isiPhone,
  isiOS,
  isChrome,
  isSafari,
  isFirefox,
  isOpera,
  isMobile,
  hasUserMedia,
  supportsWebp,
  delay,
  fileName,
  guid,
  loader,
  DEGREES,
  RADIANS,
  TWO_PI,
  HALF_PI,
  between,
  clamp,
  normalize,
  mix,
  map,
  roundTo,
  distance,
  distance2,
  distance3,
  random,
  getAngle,
  toDeg,
  toRad,
  cosRange,
  precisionComplete,
  cubicBezier,
  mixArrays,
  raf,
  orthoCamera,
  plane,
  triangle,
  dispose,
  findObjectsWithName,
  anchorGeometry,
  anchorGeometryTL,
  setBlendNormal,
  setBlendAdd,
  setBlendMultiply,
  setBlendScreen,
  FBO,
  DoubleFBO,
  Pass,
  updateTextureData,
  compileShader,
  RawShader,
  updateCameraPerspective,
  updateCameraOrtho
};
