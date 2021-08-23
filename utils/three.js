var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AddEquation, BufferGeometry, ClampToEdgeWrapping, CustomBlending, DstColorFactor, Float32BufferAttribute, FloatType, GLSL3, HalfFloatType, LinearFilter, Matrix4, Mesh, NormalBlending, OneFactor, OneMinusDstColorFactor, OneMinusSrcAlphaFactor, OrthographicCamera, PlaneBufferGeometry, RGBAFormat, Scene, SrcAlphaFactor, Texture, WebGLRenderTarget, } from 'three';
import { WEBGL } from 'three/examples/jsm/WebGL';
import { isiOS } from './dom';
export const orthoCamera = new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);
export const plane = new PlaneBufferGeometry(1, 1);
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
export function dispose(object) {
    while (object.children.length > 0) {
        dispose(object.children[0]);
    }
    if (object.parent)
        object.parent.remove(object);
    if (object instanceof Mesh) {
        if (object.geometry)
            object.geometry.dispose();
        if (object.material) {
            if (object.material.map) {
                object.material.map.dispose();
            }
            object.material.dispose();
        }
    }
}
export function updateCameraPerspective(camera, width, height) {
    const aspect = width / height;
    const dist = Math.abs(camera.position.z);
    const fov = 2 * Math.atan(width / aspect / (2 * dist)) * (180 / Math.PI);
    camera.fov = fov;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
}
export function updateCameraOrtho(camera, width, height) {
    camera.left = width / -2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = height / -2;
    camera.position.x = width / 2;
    camera.position.y = height / -2;
    camera.updateProjectionMatrix();
}
export function findObjectsWithName(object, value) {
    let children = [];
    object.children.forEach((child) => {
        const result = child.name.search(value);
        if (result > -1) {
            children.push(child);
        }
        else {
            children = children.concat(findObjectsWithName(child, value));
        }
    });
    return children;
}
export function compileShader(source, fragment = true, version = '') {
    let shader = '';
    if (WEBGL.isWebGL2Available()) {
        if (fragment) {
            const definitions = [
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
        }
        else {
            const definitions = [
                '#define attribute in',
                '#define varying out',
                '#define texture2D texture'
            ];
            shader = definitions.join('\n');
        }
        shader += `\n${source}`;
    }
    else {
        shader = source;
    }
    if (version.length > 0) {
        shader = `#version ${version}\n${shader}`;
    }
    return shader;
}
export function anchorGeometry(geometry, x, y, z) {
    geometry.applyMatrix4(new Matrix4().makeTranslation(x, -y, -z));
}
export function anchorGeometryTL(geometry) {
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    const x = (box.max.x - box.min.x) / 2;
    const y = (box.max.y - box.min.y) / 2;
    anchorGeometry(geometry, x, y, 0);
}
export function setBlendNormal(material) {
    material.blending = NormalBlending;
    material.blendEquation = AddEquation;
    material.blendSrc = SrcAlphaFactor;
    material.blendDst = OneMinusSrcAlphaFactor;
    material.needsUpdate = true;
}
export function setBlendAdd(material) {
    material.blending = CustomBlending;
    material.blendEquation = AddEquation;
    material.blendSrc = SrcAlphaFactor;
    material.blendDst = OneFactor;
    material.needsUpdate = true;
}
export function setBlendMultiply(material) {
    material.blending = CustomBlending;
    material.blendEquation = AddEquation;
    material.blendSrc = DstColorFactor;
    material.blendDst = OneMinusSrcAlphaFactor;
    material.needsUpdate = true;
}
export function setBlendScreen(material) {
    material.blending = CustomBlending;
    material.blendEquation = AddEquation;
    material.blendSrc = OneMinusDstColorFactor;
    material.blendDst = OneFactor;
    material.needsUpdate = true;
}
export class FBO {
    constructor(width, height, params) {
        const opts = params !== undefined ? params : {};
        if (opts.wrapS === undefined)
            opts.wrapS = ClampToEdgeWrapping;
        if (opts.wrapT === undefined)
            opts.wrapT = ClampToEdgeWrapping;
        if (opts.minFilter === undefined)
            opts.minFilter = LinearFilter;
        if (opts.magFilter === undefined)
            opts.magFilter = LinearFilter;
        if (opts.format === undefined)
            opts.format = RGBAFormat;
        if (opts.type === undefined)
            opts.type = isiOS ? HalfFloatType : FloatType;
        if (opts.depthBuffer === undefined)
            opts.depthBuffer = false;
        if (opts.stencil === undefined)
            opts.stencil = false;
        this.rt1 = new WebGLRenderTarget(width, height, opts);
        this.target = this.rt1;
    }
    resize(width, height) {
        this.rt1.setSize(width, height);
    }
    get texture() {
        return this.target.texture;
    }
}
export class DoubleFBO extends FBO {
    constructor(width, height, params) {
        super(width, height, params);
        this.flip = true;
        this.rt2 = this.rt1.clone();
    }
    resize(width, height) {
        this.rt1.setSize(width, height);
        this.rt2.setSize(width, height);
    }
    swap() {
        if (this.flip) {
            this.target = this.rt2;
        }
        else {
            this.target = this.rt1;
        }
        this.flip = !this.flip;
    }
}
export class Pass {
    constructor(material) {
        this.camera = orthoCamera;
        this.scene = new Scene();
        this.material = material;
        this.mesh = new Mesh(plane, this.material);
        this.scene.add(this.mesh);
    }
    draw() {
    }
}
export function updateTextureData(svgElement, imgWid, imgHei) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            const svgData = svgElement.outerHTML;
            const svgBlob = new Blob([[svgData]], { type: 'image/svg+xml' });
            let texture;
            const img = new Image();
            img.onload = () => {
                texture = new Texture(img);
                texture.minFilter = LinearFilter;
                texture.magFilter = LinearFilter;
                texture.needsUpdate = true;
                resolve(texture);
            };
            let dataBase64;
            const reader = new FileReader();
            reader.onload = () => {
                dataBase64 = reader.result;
                img.src = dataBase64;
                img.width = imgWid * devicePixelRatio;
                img.height = imgHei * devicePixelRatio;
            };
            dataBase64 = reader.readAsDataURL(svgBlob);
        });
    });
}
export function RawShader(opts) {
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
