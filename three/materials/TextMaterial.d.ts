import { RawShaderMaterial, ShaderMaterialParameters, Texture, Vector3 } from 'three';
export default class TextMaterial extends RawShaderMaterial {
    constructor(texture: Texture | null, parameters?: ShaderMaterialParameters);
    get color(): Vector3;
    get map(): Texture | null;
    set color(value: Vector3);
    set map(value: Texture | null);
}
//# sourceMappingURL=TextMaterial.d.ts.map