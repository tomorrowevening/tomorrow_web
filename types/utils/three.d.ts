import { BufferGeometry, Material, Mesh, Object3D, OrthographicCamera, Scene, Texture, WebGLRenderTarget } from 'three';
export declare const orthoCamera: any;
export declare const plane: any;
export declare const triangle: any;
export declare function dispose(object: Object3D | Mesh): void;
export declare function findObjectsWithName(object: Object3D, value: string): Array<Object3D>;
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
