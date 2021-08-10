import { BufferGeometry, Material, Mesh, Object3D, OrthographicCamera, PerspectiveCamera, PlaneBufferGeometry, Scene, Texture, WebGLRenderTarget } from 'three';
export declare const orthoCamera: OrthographicCamera;
export declare const plane: PlaneBufferGeometry;
export declare const triangle: BufferGeometry;
export declare function dispose(object: Object3D | Mesh): void;
export declare function updateCameraPerspective(camera: PerspectiveCamera, width: number, height: number): void;
export declare function updateCameraOrtho(camera: OrthographicCamera, width: number, height: number): void;
export declare function findObjectsWithName(object: Object3D, value: string): Array<Object3D>;
export declare function compileShader(source: string, fragment?: boolean): string;
export declare function parseShader(shader: string, defines: Array<string>, options: Array<string>): string;
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
//# sourceMappingURL=three.d.ts.map