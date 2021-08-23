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
var TextGeometry_1 = require("../geometry/TextGeometry");
var TextMaterial_1 = require("../materials/TextMaterial");
var math_1 = require("../../utils/math");
var TextMesh = (function (_super) {
    __extends(TextMesh, _super);
    function TextMesh() {
        var _this = _super.call(this) || this;
        _this.geometry = new TextGeometry_1.default();
        _this.material = new TextMaterial_1.default(null);
        _this.container = new three_1.Object3D();
        _this.options = {
            align: 'left',
            flipY: true,
            font: undefined,
            fontSize: 42,
            text: '',
            letterSpacing: 0,
            width: undefined,
        };
        _this.add(_this.container);
        _this.mesh = new three_1.Mesh(_this.geometry, _this.material);
        _this.mesh.name = 'txtSprite';
        _this.mesh.rotation.x = Math.PI;
        _this.container.add(_this.mesh);
        return _this;
    }
    TextMesh.prototype.update = function (options) {
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
        var layout = this.geometry.layout;
        this.mesh.position.y = layout.lineHeight - layout.height - 5;
        if (this.options.align === 'center') {
            this.mesh.position.x = -layout.width / 2;
        }
        else if (this.options.align === 'right') {
            this.mesh.position.x = -layout.width;
        }
    };
    TextMesh.prototype.checkToUpdate = function () {
        if (this.options.font !== undefined) {
            this.update(this.options);
        }
    };
    Object.defineProperty(TextMesh.prototype, "align", {
        get: function () {
            return this.options.align;
        },
        set: function (value) {
            this.options.align = value;
            this.checkToUpdate();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextMesh.prototype, "color", {
        get: function () {
            return this.material.color;
        },
        set: function (value) {
            if (Array.isArray(value)) {
                this.material.color = new three_1.Vector3(value[0], value[1], value[2]);
            }
            else {
                this.material.color = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextMesh.prototype, "fontSize", {
        get: function () {
            return this.options.fontSize;
        },
        set: function (value) {
            this.options.fontSize = value;
            var scale = math_1.normalize(0, 42, value);
            this.container.scale.setScalar(scale);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextMesh.prototype, "map", {
        get: function () {
            return this.material.map;
        },
        set: function (value) {
            this.material.map = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextMesh.prototype, "letterSpacing", {
        get: function () {
            return this.options.letterSpacing;
        },
        set: function (value) {
            this.options.letterSpacing = value;
            this.checkToUpdate();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextMesh.prototype, "text", {
        get: function () {
            return this.options.text;
        },
        set: function (value) {
            this.options.text = value;
            this.checkToUpdate();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextMesh.prototype, "width", {
        get: function () {
            return this.options.width;
        },
        set: function (value) {
            this.options.width = value;
            this.checkToUpdate();
        },
        enumerable: false,
        configurable: true
    });
    return TextMesh;
}(three_1.Object3D));
exports.default = TextMesh;
