"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var three_1 = require("three");
var layout_bmfont_text_1 = require("layout-bmfont-text");
var quad_indices_1 = require("quad-indices");
var itemSize = 2;
var box = {
    min: [0, 0],
    max: [0, 0]
};
function bounds(positions) {
    var count = positions.length / itemSize;
    box.min[0] = positions[0];
    box.min[1] = positions[1];
    box.max[0] = positions[0];
    box.max[1] = positions[1];
    for (var i = 0; i < count; i++) {
        var x = positions[i * itemSize + 0];
        var y = positions[i * itemSize + 1];
        box.min[0] = Math.min(x, box.min[0]);
        box.min[1] = Math.min(y, box.min[1]);
        box.max[0] = Math.max(x, box.max[0]);
        box.max[1] = Math.max(y, box.max[1]);
    }
}
function computeSphere(positions, output) {
    bounds(positions);
    var minX = box.min[0];
    var minY = box.min[1];
    var maxX = box.max[0];
    var maxY = box.max[1];
    var width = maxX - minX;
    var height = maxY - minY;
    var length = Math.sqrt(width * width + height * height);
    output.center.set(minX + width / 2, minY + height / 2, 0);
    output.radius = length / 2;
}
function generatePages(glyphs) {
    var pages = new Float32Array(glyphs.length * 4 * 1);
    var i = 0;
    glyphs.forEach(function (glyph) {
        var id = glyph.data.page || 0;
        pages[i++] = id;
        pages[i++] = id;
        pages[i++] = id;
        pages[i++] = id;
    });
    return pages;
}
function generatePositions(glyphs) {
    var positions = new Float32Array(glyphs.length * 4 * 2);
    var i = 0;
    glyphs.forEach(function (glyph) {
        var bitmap = glyph.data;
        var x = glyph.position[0] + bitmap.xoffset;
        var y = glyph.position[1] + bitmap.yoffset;
        var w = bitmap.width;
        var h = bitmap.height;
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
function generateUVs(glyphs, texWidth, texHeight, flipY) {
    if (flipY === void 0) { flipY = true; }
    var uvs = new Float32Array(glyphs.length * 4 * 2);
    var i = 0;
    glyphs.forEach(function (glyph) {
        var bitmap = glyph.data;
        var bw = (bitmap.x + bitmap.width);
        var bh = (bitmap.y + bitmap.height);
        var u0 = bitmap.x / texWidth;
        var v1 = bitmap.y / texHeight;
        var u1 = bw / texWidth;
        var v0 = bh / texHeight;
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
var TextGeometry = (function (_super) {
    __extends(TextGeometry, _super);
    function TextGeometry() {
        var _this = _super.call(this) || this;
        _this.layout = undefined;
        _this.glyphs = undefined;
        _this.texWidth = 0;
        _this.texHeight = 0;
        _this.setAttribute('position', new three_1.BufferAttribute(new Float32Array([]), 2));
        return _this;
    }
    TextGeometry.prototype.update = function (options) {
        this.layout = layout_bmfont_text_1.default(options);
        this.glyphs = this.layout.glyphs.filter(function (glyph) {
            var bitmap = glyph.data;
            return bitmap.width * bitmap.height > 0;
        });
        this.texWidth = options.font.common.scaleW;
        this.texHeight = options.font.common.scaleH;
        var positions = generatePositions(this.glyphs);
        var uvs = generateUVs(this.glyphs, this.texWidth, this.texHeight, options.flipY);
        var indices = quad_indices_1.default([], {
            clockwise: true,
            type: 'uint16',
            count: this.glyphs.length
        });
        this.setIndex(indices);
        this.setAttribute('position', new three_1.BufferAttribute(positions, 2));
        this.setAttribute('uv', new three_1.BufferAttribute(uvs, 2));
        if (options.multipage) {
            var pages = generatePages(this.glyphs);
            this.setAttribute('page', new three_1.BufferAttribute(pages, 1));
        }
    };
    TextGeometry.prototype.updateCopy = function () {
    };
    TextGeometry.prototype.computeBoundingSphere = function () {
        if (this.boundingSphere === null) {
            this.boundingSphere = new three_1.Sphere();
        }
        var positions = this.attributes.position.array;
        var posSize = this.attributes.position.itemSize;
        if (!positions || !posSize || positions.length < 2) {
            this.boundingSphere.radius = 0;
            this.boundingSphere.center.set(0, 0, 0);
            return;
        }
        computeSphere(positions, this.boundingSphere);
        if (Number.isNaN(this.boundingSphere.radius)) {
            console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN');
        }
    };
    return TextGeometry;
}(three_1.BufferGeometry));
exports.default = TextGeometry;
