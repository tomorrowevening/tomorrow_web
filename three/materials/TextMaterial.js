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
var font_1 = require("../glsl/font");
var three_2 = require("../../utils/three");
var TextMaterial = (function (_super) {
    __extends(TextMaterial, _super);
    function TextMaterial(texture) {
        return _super.call(this, three_2.RawShader({
            name: 'Text',
            uniforms: {
                opacity: {
                    type: 'f',
                    value: 1
                },
                color: {
                    type: 'v3',
                    value: new three_1.Vector3(1, 1, 1)
                },
                map: {
                    type: 't',
                    value: texture
                }
            },
            vertex: font_1.TextVertex,
            fragment: font_1.TextFragment,
            transparent: true,
            side: three_1.DoubleSide,
            webgl2: true
        })) || this;
    }
    Object.defineProperty(TextMaterial.prototype, "color", {
        get: function () {
            return this.uniforms.color.value;
        },
        set: function (value) {
            this.uniforms.color.value = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextMaterial.prototype, "map", {
        get: function () {
            return this.uniforms.map.value;
        },
        set: function (value) {
            this.uniforms.map.value = value;
        },
        enumerable: false,
        configurable: true
    });
    return TextMaterial;
}(three_1.RawShaderMaterial));
exports.default = TextMaterial;
