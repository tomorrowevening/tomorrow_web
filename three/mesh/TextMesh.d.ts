import { Object3D, Mesh, Texture, Vector3 } from 'three';
import TextGeometry from '../geometry/TextGeometry';
import TextMaterial from '../materials/TextMaterial';
export default class TextMesh extends Object3D {
    geometry: TextGeometry;
    material: TextMaterial;
    mesh: Mesh;
    container: Object3D;
    options: any;
    constructor();
    update(options: any): void;
    private checkToUpdate;
    get align(): string;
    get color(): Vector3;
    get fontSize(): number;
    get map(): Texture | null;
    get letterSpacing(): number;
    get text(): string;
    get width(): number | undefined;
    set align(value: string);
    set color(value: Vector3 | Array<number>);
    set fontSize(value: number);
    set map(value: Texture | null);
    set letterSpacing(value: number);
    set text(value: string);
    set width(value: number | undefined);
}
//# sourceMappingURL=TextMesh.d.ts.map