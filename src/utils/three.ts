import {
  AddEquation,
  Blending,
  BufferGeometry,
  ClampToEdgeWrapping,
  CustomBlending,
  DstColorFactor,
  Float32BufferAttribute,
  FloatType,
  GLSL3,
  HalfFloatType,
  IUniform,
  LinearFilter,
  Material,
  Matrix4,
  Mesh,
  NormalBlending,
  Object3D,
  OneFactor,
  OneMinusDstColorFactor,
  OneMinusSrcAlphaFactor,
  OrthographicCamera,
  PerspectiveCamera,
  Plane,
  PlaneBufferGeometry,
  PositionalAudio,
  RawShaderMaterial,
  RGBAFormat,
  Scene,
  ShaderMaterialParameters,
  SrcAlphaFactor,
  Texture,
  WebGLRenderTarget,
} from 'three';
import { WEBGL } from 'three/examples/jsm/WebGL';
import { isiOS } from './dom';

/**
 * A pre-created Camera for off-screen rendering shaders
 */
export const orthoCamera = new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);
/**
 * A pre-created plane for off-screen rendering shaders
 */
export const plane = new PlaneBufferGeometry(1, 1);

/**
 * Cheaper Geometry for shader rendering
 */
export const triangle = new BufferGeometry();
triangle.setAttribute('position', new Float32BufferAttribute([
  -0.5, -0.5, 0,
  1.5, -0.5, 0,
  -0.5, 1.5, 0
], 3));
triangle.setAttribute('normal', new Float32BufferAttribute([
  0, 0, 1,
  0, 0, 1
], 3));
triangle.setAttribute('uv', new Float32BufferAttribute([
  0, 0, 2,
  0, 0, 2
], 2));

// Dispose texture
export const disposeTexture = (texture?: Texture): void => {
  texture?.dispose()
}

// Dispose material
export const disposeMaterial = (material?: Material | Material[]): void => {
  if (!material) return

  if (Array.isArray(material)) {
    material.forEach((mat: Material) => mat.dispose())
  } else {
    material.dispose()
  }
}

// Dispose object
export const dispose = (object: Object3D): void => {
  if (!object) return

  // Dispose children
  while (object.children.length > 0) {
    const child = object.children[0]
    if (child instanceof PositionalAudio) {
      child.pause()
      if (child.parent) {
        child.parent.remove(child)
      }
    } else {
      dispose(child)
    }
  }

  // Dispose object
  if (object.parent) object.parent.remove(object)
  // @ts-ignore
  if (object.isMesh) {
    const mesh = object as Mesh
    mesh.geometry?.dispose()
    disposeMaterial(mesh.material)
  }

  // @ts-ignore
  if (object.dispose !== undefined) object.dispose()
}

/**
 * Updates a Perspective camera's FOV to fit pixel-perfect
 * @param {THREE.PerspectiveCamera} camera
 * @param {Number} width Screen width
 * @param {Number} height Screen height
 * @param {Number} distance Distance to the object to focus on
 */
export function updateCameraPerspective(
  camera: PerspectiveCamera,
  width: number,
  height: number,
  distance: number
) {
  const aspect = width / height;
  const fov = 2 * Math.atan(width / aspect / (2 * distance)) * (180 / Math.PI);
  camera.fov = fov;
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
}

/**
 * Updates an Orthographic camera's view to fit pixel-perfect in view
 * @param {THREE.OrthographicCamera} camera
 * @param {Number} width Screen width
 * @param {Number} height Screen height
 * @param {Number} aspect Screen aspect ratio
 */
export function updateCameraOrtho(
  camera: OrthographicCamera,
  width: number,
  height: number
) {
  camera.left = width / -2;
  camera.right = width / 2;
  camera.top = height / 2;
  camera.bottom = height / -2;
  camera.position.x = width / 2;
  camera.position.y = height / -2;
  camera.updateProjectionMatrix();
}

/**
 * Finds multiple objects with a common name
 * @param object The base object, ideally a contained object, not a scene
 * @param value The base name
 */
export function findObjectsWithName(object: Object3D, value: string): Array<Object3D> {
  let children: Array<Object3D> = [];
  object.children.forEach((child: Object3D) => {
    const result = child.name.search(value);
    if (result > -1) {
      children.push(child);
    } else {
      children = children.concat(findObjectsWithName(child, value));
    }
  });
  return children;
}

/**
 * Reference: https://webgl2fundamentals.org/webgl/lessons/webgl1-to-webgl2.html
 * @param source Original shader source
 * @param fragment If it's a fragment shader or not
 * @returns An updated shader source
 */
export function compileShader(
  source: string,
  fragment: boolean = true,
  version: string = ''
): string {
  let shader = '';
  if (WEBGL.isWebGL2Available()) {
    if (fragment) {
      const definitions: Array<string> = [
        '#define varying in',
        'out highp vec4 pc_fragColor;',
        '#define gl_FragColor pc_fragColor',
        '#define gl_FragDepthEXT gl_FragDepth',
        '#define texture2D texture',
        '#define textureCube texture',
        '#define texture2DProj textureProj',
        '#define texture2DLodEXT textureLod',
        '#define texture2DProjLodEXT textureProjLod',
        '#define textureCubeLodEXT textureLod',
        '#define texture2DGradEXT textureGrad',
        '#define texture2DProjGradEXT textureProjGrad',
        '#define textureCubeGradEXT textureGrad'
      ];
      shader = definitions.join('\n');
    } else {
      const definitions: Array<string> = [
        '#define attribute in',
        '#define varying out',
        '#define texture2D texture'
      ];
      shader = definitions.join('\n');
    }
    shader += `\n${source}`;
  } else {
    shader = source;
  }
  if (version.length > 0) {
    shader = `#version ${version}\n${shader}`;
  }
  return shader;
}

/**
 * Updates your geometry to be offset
 * @param geometry Your geometry
 * @param x X-offset
 * @param y Y-offset
 * @param z Z-offset
 */
export function anchorGeometry(
  geometry: BufferGeometry,
  x: number,
  y: number,
  z: number
) {
  geometry.applyMatrix4(new Matrix4().makeTranslation(x, -y, -z));
}

/**
 * Anchors your geometry to the top-left
 * @param geometry Your geometry
 */
export function anchorGeometryTL(geometry: BufferGeometry) {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  const x = (box.max.x - box.min.x) / 2;
  const y = (box.max.y - box.min.y) / 2;
  anchorGeometry(geometry, x, y, 0);
}

/**
 * Sets the material blend mode to normal
 * @param material Your material
 */
export function setBlendNormal(material: Material) {
  material.blending = NormalBlending;
  material.blendEquation = AddEquation;
  material.blendSrc = SrcAlphaFactor;
  material.blendDst = OneMinusSrcAlphaFactor;
  material.needsUpdate = true;
}

/**
 * Sets the material blend mode to add
 * @param material Your material
 */
export function setBlendAdd(material: Material) {
  material.blending = CustomBlending;
  material.blendEquation = AddEquation;
  material.blendSrc = SrcAlphaFactor;
  material.blendDst = OneFactor;
  material.needsUpdate = true;
}

/**
 * Sets the material blend mode to multiply
 * @param material Your material
 */
export function setBlendMultiply(material: Material) {
  material.blending = CustomBlending;
  material.blendEquation = AddEquation;
  material.blendSrc = DstColorFactor;
  material.blendDst = OneMinusSrcAlphaFactor;
  material.needsUpdate = true;
}

/**
 * Sets the material blend mode to screen
 * @param material Your material
 */
export function setBlendScreen(material: Material) {
  material.blending = CustomBlending;
  material.blendEquation = AddEquation;
  material.blendSrc = OneMinusDstColorFactor;
  material.blendDst = OneFactor;
  material.needsUpdate = true;
}

/**
 * A "Frame Buffer Object" to be used generative shaders
 */
export class FBO {
  rt1: WebGLRenderTarget;

  target: WebGLRenderTarget;

  constructor(width: number, height: number, params: any) {
    const opts = params !== undefined ? params : {};
    if (opts.wrapS === undefined) opts.wrapS = ClampToEdgeWrapping;
    if (opts.wrapT === undefined) opts.wrapT = ClampToEdgeWrapping;
    if (opts.minFilter === undefined) opts.minFilter = LinearFilter;
    if (opts.magFilter === undefined) opts.magFilter = LinearFilter;
    if (opts.format === undefined) opts.format = RGBAFormat;
    if (opts.type === undefined) opts.type = isiOS ? HalfFloatType : FloatType;
    if (opts.depthBuffer === undefined) opts.depthBuffer = false;
    if (opts.stencil === undefined) opts.stencil = false;

    this.rt1 = new WebGLRenderTarget(width, height, opts);
    this.target = this.rt1;
  }

  /**
   * Resizes the Render Target
   * @param width The width of the Render Target
   * @param height The height of the Render Target
   */
  resize(width: number, height: number) {
    this.rt1.setSize(width, height);
  }

  /**
   *
   */
  get texture(): Texture {
    return this.target.texture;
  }
}

/**
 * Meant for compute shaders (aka GPGPU shaders)
 */
export class DoubleFBO extends FBO {
  rt2: WebGLRenderTarget;

  flip: Boolean = true;

  constructor(width: number, height: number, params: any) {
    super(width, height, params);

    this.rt2 = this.rt1.clone();
  }

  /**
   * Resizes the Render Targets
   * @param width The width of the Render Targets
   * @param height The height of the Render Targets
   */
  resize(width: number, height: number) {
    this.rt1.setSize(width, height);
    this.rt2.setSize(width, height);
  }

  /**
   *
   */
  swap() {
    if (this.flip) {
      this.target = this.rt2;
    } else {
      this.target = this.rt1;
    }
    this.flip = !this.flip;
  }
}

/**
 * Renders your material off-screen
 */
export class Pass {
  camera: OrthographicCamera = orthoCamera;

  scene: Scene = new Scene();

  material: Material;

  mesh: Mesh;

  /**
   * A layer that can be used for post-processing, GPGPU, etc
   * @param  {Material} material Usually either a ShaderMaterial or RawShaderMaterial
   */
  constructor(material: Material) {
    this.material = material;
    this.mesh = new Mesh(plane, this.material);
    this.scene.add(this.mesh);
  }

  /**
   * The customized draw call for the pass, usually so params can be updated/swapped
   */
  draw() {
  }
}

/**
 * Creates a Texture from the SVG and returns the texture when ready
 * @param svgElement Your SVG element
 * @param imgWid The content width
 * @param imgHei The content height
 */
export async function updateTextureData(
  svgElement: SVGElement,
  imgWid: number,
  imgHei: number
): Promise<Texture> {
  return new Promise((resolve) => {
    // 2
    const svgData = svgElement.outerHTML;
    // @ts-ignore
    const svgBlob = new Blob([[svgData]], { type: 'image/svg+xml' });

    // 3
    let texture: Texture;
    const img = new Image();
    img.onload = () => {
      // Create Texture
      texture = new Texture(img);
      texture.minFilter = LinearFilter;
      texture.magFilter = LinearFilter;
      texture.needsUpdate = true;

      resolve(texture);
    };

    let dataBase64: any;
    const reader = new FileReader();
    reader.onload = () => {
      dataBase64 = reader.result;
      img.src = dataBase64;
      img.width = imgWid * devicePixelRatio;
      img.height = imgHei * devicePixelRatio;
    };

    dataBase64 = reader.readAsDataURL(svgBlob);
  });
}

interface ShaderParams {
  alphaTest?: number;
  alphaToCoverage?: number;
  blendDst?: number;
  blendDstAlpha?: number;
  blendEquation?: number;
  blending?: Blending;
  blendSrc?: number;
  blendSrcAlpha?: number;
  clipIntersection?: boolean;
  clipping?: boolean;
  clippingPlanes?: Array<Plane>;
  clipShadows?: boolean;
  colorWrite?: boolean;
  defines?: object;
  depthFunc?: number;
  depthTest?: boolean;
  depthWrite?: boolean;
  dithering?: boolean;
  extensions?: object;
  flatShading?: boolean;
  fog?: boolean;
  lights?: boolean;
  linewidth?: number;
  morphNormals?: boolean;
  morphTargets?: boolean;
  opacity?: number;
  polygonOffset?: boolean;
  polygonOffsetFactor?: number;
  polygonOffsetUnits?: number;
  precision?: string;
  premultipliedAlpha?: boolean;
  shadowSide?: number;
  side?: number;
  stencilWrite?: boolean;
  stencilWriteMask?: number;
  stencilFunc?: number;
  stencilRef?: number;
  stencilFuncMask?: number;
  stencilFail?: number;
  stencilZFail?: number;
  stencilZPass?: number;
  toneMapped?: boolean;
  transparent?: boolean;
  userData?: object;
  vertexColors?: boolean;
  wireframe?: boolean;
  // Core
  name: string;
  vertex: string;
  fragment: string;
  uniforms: { [uniform: string]: IUniform };
  version?: string;
  webgl2?: boolean;
}

/**
 * A smart RawShaderMaterial with WebGL2 / WebGL fallback functionality
 * @param opts Shader parameters
 * @returns Your RawShaderMaterial
 */
export function RawShader(opts: ShaderParams) {
  const precision = opts.precision !== undefined ? opts.precision : 'highp';
  const precisionInjection = `precision ${precision} float;`;
  const shaderName = `#define SHADER_NAME ${opts.name}`;
  const vertName = opts.vertex.search('SHADER_NAME') > 0 ? '' : `${shaderName}Vert`;
  const fragName = opts.fragment.search('SHADER_NAME') > 0 ? '' : `${shaderName}Frag`;
  const vertex = [
    precisionInjection,
    vertName,
    opts.vertex
  ].join('\n');
  const fragment = [
    precisionInjection,
    fragName,
    opts.fragment
  ].join('\n');

  const shader = {
    // Custom
    name: opts.name,
    uniforms: opts.uniforms,
    vertexShader: vertex,
    fragmentShader: fragment,
    glslVersion: null
  };

  for (let i in opts) {
    if (i !== 'vertex' && i !== 'fragment' && i !== 'version' && i !== 'webgl2') {
      shader[i] = opts[i];
    }
  }

  if (WEBGL.isWebGL2Available() && opts.webgl2 === true) {
    shader.vertexShader = compileShader(vertex, false, opts.version);
    shader.fragmentShader = compileShader(fragment, true, opts.version);
    shader.glslVersion = GLSL3;
  }
  return shader;
}
