import { BufferAttribute, BufferGeometry, Sphere } from 'three';
import createLayout from 'layout-bmfont-text';
import createIndices from 'quad-indices';
const itemSize = 2;
const box = {
    min: [0, 0],
    max: [0, 0]
};
function bounds(positions) {
    const count = positions.length / itemSize;
    box.min[0] = positions[0];
    box.min[1] = positions[1];
    box.max[0] = positions[0];
    box.max[1] = positions[1];
    for (let i = 0; i < count; i++) {
        const x = positions[i * itemSize + 0];
        const y = positions[i * itemSize + 1];
        box.min[0] = Math.min(x, box.min[0]);
        box.min[1] = Math.min(y, box.min[1]);
        box.max[0] = Math.max(x, box.max[0]);
        box.max[1] = Math.max(y, box.max[1]);
    }
}
function computeSphere(positions, output) {
    bounds(positions);
    const minX = box.min[0];
    const minY = box.min[1];
    const maxX = box.max[0];
    const maxY = box.max[1];
    const width = maxX - minX;
    const height = maxY - minY;
    const length = Math.sqrt(width * width + height * height);
    output.center.set(minX + width / 2, minY + height / 2, 0);
    output.radius = length / 2;
}
function generatePages(glyphs) {
    const pages = new Float32Array(glyphs.length * 4 * 1);
    let i = 0;
    glyphs.forEach((glyph) => {
        const id = glyph.data.page || 0;
        pages[i++] = id;
        pages[i++] = id;
        pages[i++] = id;
        pages[i++] = id;
    });
    return pages;
}
function generatePositions(glyphs) {
    const positions = new Float32Array(glyphs.length * 4 * 2);
    let i = 0;
    glyphs.forEach((glyph) => {
        const bitmap = glyph.data;
        const x = glyph.position[0] + bitmap.xoffset;
        const y = glyph.position[1] + bitmap.yoffset;
        const w = bitmap.width;
        const h = bitmap.height;
        positions[i++] = x;
        positions[i++] = y;
        positions[i++] = x;
        positions[i++] = y + h;
        positions[i++] = x + w;
        positions[i++] = y + h;
        positions[i++] = x + w;
        positions[i++] = y;
    });
    return positions;
}
function generateUVs(glyphs, texWidth, texHeight, flipY = true) {
    const uvs = new Float32Array(glyphs.length * 4 * 2);
    let i = 0;
    glyphs.forEach((glyph) => {
        const bitmap = glyph.data;
        const bw = (bitmap.x + bitmap.width);
        const bh = (bitmap.y + bitmap.height);
        const u0 = bitmap.x / texWidth;
        let v1 = bitmap.y / texHeight;
        const u1 = bw / texWidth;
        let v0 = bh / texHeight;
        if (flipY) {
            v1 = (texHeight - bitmap.y) / texHeight;
            v0 = (texHeight - bh) / texHeight;
        }
        uvs[i++] = u0;
        uvs[i++] = v1;
        uvs[i++] = u0;
        uvs[i++] = v0;
        uvs[i++] = u1;
        uvs[i++] = v0;
        uvs[i++] = u1;
        uvs[i++] = v1;
    });
    return uvs;
}
export default class TextGeometry extends BufferGeometry {
    constructor() {
        super();
        this.layout = undefined;
        this.glyphs = undefined;
        this.texWidth = 0;
        this.texHeight = 0;
        this.setAttribute('position', new BufferAttribute(new Float32Array([]), 2));
    }
    update(options) {
        this.layout = createLayout(options);
        this.glyphs = this.layout.glyphs.filter((glyph) => {
            const bitmap = glyph.data;
            return bitmap.width * bitmap.height > 0;
        });
        this.texWidth = options.font.common.scaleW;
        this.texHeight = options.font.common.scaleH;
        const positions = generatePositions(this.glyphs);
        const uvs = generateUVs(this.glyphs, this.texWidth, this.texHeight, options.flipY);
        const indices = createIndices([], {
            clockwise: true,
            type: 'uint16',
            count: this.glyphs.length
        });
        this.setIndex(indices);
        this.setAttribute('position', new BufferAttribute(positions, 2));
        this.setAttribute('uv', new BufferAttribute(uvs, 2));
        if (options.multipage) {
            const pages = generatePages(this.glyphs);
            this.setAttribute('page', new BufferAttribute(pages, 1));
        }
    }
    updateCopy() {
    }
    computeBoundingSphere() {
        if (this.boundingSphere === null) {
            this.boundingSphere = new Sphere();
        }
        const positions = this.attributes.position.array;
        const posSize = this.attributes.position.itemSize;
        if (!positions || !posSize || positions.length < 2) {
            this.boundingSphere.radius = 0;
            this.boundingSphere.center.set(0, 0, 0);
            return;
        }
        computeSphere(positions, this.boundingSphere);
        if (Number.isNaN(this.boundingSphere.radius)) {
            console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN');
        }
    }
}
