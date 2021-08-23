import { DoubleSide, RawShaderMaterial, Vector3 } from 'three';
import { TextVertex, TextFragment } from '../glsl/font';
import { RawShader } from '../../utils/three';
export default class TextMaterial extends RawShaderMaterial {
    constructor(texture) {
        super(RawShader({
            name: 'Text',
            uniforms: {
                opacity: {
                    type: 'f',
                    value: 1
                },
                color: {
                    type: 'v3',
                    value: new Vector3(1, 1, 1)
                },
                map: {
                    type: 't',
                    value: texture
                }
            },
            vertex: TextVertex,
            fragment: TextFragment,
            transparent: true,
            side: DoubleSide,
            webgl2: true
        }));
    }
    get color() {
        return this.uniforms.color.value;
    }
    get map() {
        return this.uniforms.map.value;
    }
    set color(value) {
        this.uniforms.color.value = value;
    }
    set map(value) {
        this.uniforms.map.value = value;
    }
}
