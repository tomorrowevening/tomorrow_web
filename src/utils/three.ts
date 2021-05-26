import {
  AddEquation,
  BufferGeometry,
  ClampToEdgeWrapping,
  CustomBlending,
  DstColorFactor,
  Float32BufferAttribute,
  FloatType,
  HalfFloatType,
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
  PlaneBufferGeometry,
  RGBAFormat,
  Scene,
  ShaderChunk,
  SrcAlphaFactor,
  Texture,
  WebGLRenderTarget,
} from 'three';
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

/**
 * Disposes an item and it's children from memory
 * @param object The item to be removed
 */
export function dispose(object: Object3D | Mesh) {
  while (object.children.length > 0) {
    dispose(object.children[0]);
  }
  if (object.parent) object.parent.remove(object);
  if (object.geometry) object.geometry.dispose();
  if (object.material) {
    if (object.material.map) {
      object.material.map.dispose();
    }
    object.material.dispose();
  }
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
 * Replaces a large string with Three's ShaderChunk.
 * ie: #include <common> gets replaced with the actual code
 * @param shader The block of code
 * @param defines Custom array of defines to inject into your shader.
 * @param options Custom array of options to inject into your shader.
 * @returns The compiled shader
 */
export function parseShader(shader: string, defines: Array<string>, options: Array<string>) {
  let output = shader;
  const definitions = `// defines\n${defines.join('\n')}`;
  const opts = `// options\n${options.join('\n')}`;
  output = output.replace('/** DEFINES */', definitions);
  output = output.replace('/** OPTIONS */', opts);

  // example:
  // #include <common>
  const includes = output.match(/\#include\s?\<\s?(\w+)\s?\>/gm);
  if (includes) {
    const total = includes.length;
    for (let i = 0; i < total; ++i) {
      const n = includes[i];
      const o = n.substr(10, n.length - 11);
      const chunk = `// ${o}\n${ShaderChunk[o]}`;
      output = output.replace(n, chunk);
    }
  }

  return output;
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