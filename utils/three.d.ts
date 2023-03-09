import { Blending, BufferGeometry, IUniform, Material, Mesh, Object3D, OrthographicCamera, PerspectiveCamera, Plane, PlaneBufferGeometry, Scene, Texture, WebGLRenderTarget } from 'three';
export declare const orthoCamera: OrthographicCamera;
export declare const plane: PlaneBufferGeometry;
export declare const triangle: BufferGeometry;
export declare const disposeTexture: (texture?: Texture) => void;
export declare const disposeMaterial: (material?: Material | Material[]) => void;
export declare const dispose: (object: Object3D) => void;
export declare function updateCameraPerspective(camera: PerspectiveCamera, width: number, height: number, distance: number): void;
export declare function updateCameraOrtho(camera: OrthographicCamera, width: number, height: number): void;
export declare function findObjectsWithName(object: Object3D, value: string): Array<Object3D>;
export declare function compileShader(source: string, fragment?: boolean, version?: string): string;
export declare function anchorGeometry(geometry: BufferGeometry, x: number, y: number, z: number): void;
export declare function anchorGeometryTL(geometry: BufferGeometry): void;
export declare function setBlendNormal(material: Material): void;
export declare function setBlendAdd(material: Material): void;
export declare function setBlendMultiply(material: Material): void;
export declare function setBlendScreen(material: Material): void;
export declare class FBO {
    rt1: WebGLRenderTarget;
    target: WebGLRenderTarget;
    constructor(width: number, height: number, params: any);
    resize(width: number, height: number): void;
    get texture(): Texture;
}
export declare class DoubleFBO extends FBO {
    rt2: WebGLRenderTarget;
    flip: Boolean;
    constructor(width: number, height: number, params: any);
    resize(width: number, height: number): void;
    swap(): void;
}
export declare class Pass {
    camera: OrthographicCamera;
    scene: Scene;
    material: Material;
    mesh: Mesh;
    constructor(material: Material);
    draw(): void;
}
export declare function updateTextureData(svgElement: SVGElement, imgWid: number, imgHei: number): Promise<Texture>;
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
    name: string;
    vertex: string;
    fragment: string;
    uniforms: {
        [uniform: string]: IUniform;
    };
    version?: string;
    webgl2?: boolean;
}
export declare function RawShader(opts: ShaderParams): {
    name: string;
    uniforms: {
        [uniform: string]: IUniform<any>;
    };
    vertexShader: string;
    fragmentShader: string;
    glslVersion: any;
};
export {};
//# sourceMappingURL=three.d.ts.map