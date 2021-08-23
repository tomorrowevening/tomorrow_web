import { BufferGeometry } from 'three';
export default class TextGeometry extends BufferGeometry {
    layout: any;
    glyphs: any;
    texWidth: number;
    texHeight: number;
    constructor();
    update(options: any): void;
    updateCopy(): void;
    computeBoundingSphere(): void;
}
//# sourceMappingURL=TextGeometry.d.ts.map