import { Object3D, Mesh, Vector3, } from 'three';
import TextGeometry from '../geometry/TextGeometry';
import TextMaterial from '../materials/TextMaterial';
import { normalize } from '../../utils/math';
export default class TextMesh extends Object3D {
    constructor() {
        super();
        this.geometry = new TextGeometry();
        this.material = new TextMaterial(null);
        this.container = new Object3D();
        this.options = {
            align: 'left',
            flipY: true,
            font: undefined,
            fontSize: 42,
            text: '',
            letterSpacing: 0,
            width: undefined,
        };
        this.add(this.container);
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.name = 'txtSprite';
        this.mesh.rotation.x = Math.PI;
        this.container.add(this.mesh);
    }
    update(options) {
        if (options.align !== undefined)
            this.options.align = options.align;
        if (options.flipY !== undefined)
            this.options.flipY = options.flipY;
        if (options.font !== undefined)
            this.options.font = options.font;
        if (options.fontSize !== undefined)
            this.fontSize = options.fontSize;
        if (options.text !== undefined)
            this.options.text = options.text;
        if (options.letterSpacing !== undefined)
            this.options.letterSpacing = options.letterSpacing;
        if (options.width !== undefined)
            this.options.width = options.width;
        this.geometry.update(this.options);
        const { layout } = this.geometry;
        this.mesh.position.y = layout.lineHeight - layout.height - 5;
        if (this.options.align === 'center') {
            this.mesh.position.x = -layout.width / 2;
        }
        else if (this.options.align === 'right') {
            this.mesh.position.x = -layout.width;
        }
    }
    checkToUpdate() {
        if (this.options.font !== undefined) {
            this.update(this.options);
        }
    }
    get align() {
        return this.options.align;
    }
    get color() {
        return this.material.color;
    }
    get fontSize() {
        return this.options.fontSize;
    }
    get map() {
        return this.material.map;
    }
    get letterSpacing() {
        return this.options.letterSpacing;
    }
    get text() {
        return this.options.text;
    }
    get width() {
        return this.options.width;
    }
    set align(value) {
        this.options.align = value;
        this.checkToUpdate();
    }
    set color(value) {
        if (Array.isArray(value)) {
            this.material.color = new Vector3(value[0], value[1], value[2]);
        }
        else {
            this.material.color = value;
        }
    }
    set fontSize(value) {
        this.options.fontSize = value;
        const scale = normalize(0, 42, value);
        this.container.scale.setScalar(scale);
    }
    set map(value) {
        this.material.map = value;
    }
    set letterSpacing(value) {
        this.options.letterSpacing = value;
        this.checkToUpdate();
    }
    set text(value) {
        this.options.text = value;
        this.checkToUpdate();
    }
    set width(value) {
        this.options.width = value;
        this.checkToUpdate();
    }
}
