import {
  DoubleSide,
  RawShaderMaterial,
  ShaderMaterialParameters,
  Texture,
  Vector3
} from 'three';
import {
  TextVertex,
  TextFragment
} from '../glsl/font';
import { RawShader } from '../../utils/three';

export default class TextMaterial extends RawShaderMaterial {
  constructor(texture: Texture | null, parameters?: ShaderMaterialParameters) {
    super(RawShader({
      name: 'Text',
      uniforms: {
        opacity: {
          // @ts-ignore
          type: 'f',
          value: 1
        },
        color: {
          // @ts-ignore
          type: 'v3',
          value: new Vector3(1, 1, 1)
        },
        map: {
          // @ts-ignore
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
    if (parameters !== undefined) {
      this.setValues(parameters);
    }
  }

  get color(): Vector3 {
    return this.uniforms.color.value;
  }

  get map(): Texture | null {
    return this.uniforms.map.value;
  }

  set color(value: Vector3) {
    this.uniforms.color.value = value;
  }

  set map(value: Texture | null) {
    this.uniforms.map.value = value;
  }
}