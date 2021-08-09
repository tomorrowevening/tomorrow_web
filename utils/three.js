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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTextureData = exports.Pass = exports.DoubleFBO = exports.FBO = exports.setBlendScreen = exports.setBlendMultiply = exports.setBlendAdd = exports.setBlendNormal = exports.anchorGeometryTL = exports.anchorGeometry = exports.parseShader = exports.findObjectsWithName = exports.updateCameraOrtho = exports.updateCameraPerspective = exports.dispose = exports.triangle = exports.plane = exports.orthoCamera = void 0;
var three_1 = require("three");
var dom_1 = require("./dom");
exports.orthoCamera = new three_1.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);
exports.plane = new three_1.PlaneBufferGeometry(1, 1);
exports.triangle = new three_1.BufferGeometry();
exports.triangle.setAttribute('position', new three_1.Float32BufferAttribute([
    -0.5, -0.5, 0,
    1.5, -0.5, 0,
    -0.5, 1.5, 0
], 3));
exports.triangle.setAttribute('normal', new three_1.Float32BufferAttribute([
    0, 0, 1,
    0, 0, 1
], 3));
exports.triangle.setAttribute('uv', new three_1.Float32BufferAttribute([
    0, 0, 2,
    0, 0, 2
], 2));
function dispose(object) {
    while (object.children.length > 0) {
        dispose(object.children[0]);
    }
    if (object.parent)
        object.parent.remove(object);
    if (object instanceof three_1.Mesh) {
        if (object.geometry)
            object.geometry.dispose();
        if (object.material) {
            if (object.material.map) {
                object.material.map.dispose();
            }
            object.material.dispose();
        }
    }
}
exports.dispose = dispose;
function updateCameraPerspective(camera, width, height) {
    var aspect = width / height;
    var dist = Math.abs(camera.position.z);
    var fov = 2 * Math.atan(width / aspect / (2 * dist)) * (180 / Math.PI);
    camera.fov = fov;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
}
exports.updateCameraPerspective = updateCameraPerspective;
function updateCameraOrtho(camera, width, height) {
    camera.left = width / -2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = height / -2;
    camera.position.x = width / 2;
    camera.position.y = height / -2;
    camera.updateProjectionMatrix();
}
exports.updateCameraOrtho = updateCameraOrtho;
function findObjectsWithName(object, value) {
    var children = [];
    object.children.forEach(function (child) {
        var result = child.name.search(value);
        if (result > -1) {
            children.push(child);
        }
        else {
            children = children.concat(findObjectsWithName(child, value));
        }
    });
    return children;
}
exports.findObjectsWithName = findObjectsWithName;
function parseShader(shader, defines, options) {
    var output = shader;
    var definitions = "// defines\n" + defines.join('\n');
    var opts = "// options\n" + options.join('\n');
    output = output.replace('/** DEFINES */', definitions);
    output = output.replace('/** OPTIONS */', opts);
    var includes = output.match(/\#include\s?\<\s?(\w+)\s?\>/gm);
    if (includes) {
        var total = includes.length;
        for (var i = 0; i < total; ++i) {
            var n = includes[i];
            var o = n.substr(10, n.length - 11);
            var chunk = "// " + o + "\n" + three_1.ShaderChunk[o];
            output = output.replace(n, chunk);
        }
    }
    return output;
}
exports.parseShader = parseShader;
function anchorGeometry(geometry, x, y, z) {
    geometry.applyMatrix4(new three_1.Matrix4().makeTranslation(x, -y, -z));
}
exports.anchorGeometry = anchorGeometry;
function anchorGeometryTL(geometry) {
    geometry.computeBoundingBox();
    var box = geometry.boundingBox;
    var x = (box.max.x - box.min.x) / 2;
    var y = (box.max.y - box.min.y) / 2;
    anchorGeometry(geometry, x, y, 0);
}
exports.anchorGeometryTL = anchorGeometryTL;
function setBlendNormal(material) {
    material.blending = three_1.NormalBlending;
    material.blendEquation = three_1.AddEquation;
    material.blendSrc = three_1.SrcAlphaFactor;
    material.blendDst = three_1.OneMinusSrcAlphaFactor;
    material.needsUpdate = true;
}
exports.setBlendNormal = setBlendNormal;
function setBlendAdd(material) {
    material.blending = three_1.CustomBlending;
    material.blendEquation = three_1.AddEquation;
    material.blendSrc = three_1.SrcAlphaFactor;
    material.blendDst = three_1.OneFactor;
    material.needsUpdate = true;
}
exports.setBlendAdd = setBlendAdd;
function setBlendMultiply(material) {
    material.blending = three_1.CustomBlending;
    material.blendEquation = three_1.AddEquation;
    material.blendSrc = three_1.DstColorFactor;
    material.blendDst = three_1.OneMinusSrcAlphaFactor;
    material.needsUpdate = true;
}
exports.setBlendMultiply = setBlendMultiply;
function setBlendScreen(material) {
    material.blending = three_1.CustomBlending;
    material.blendEquation = three_1.AddEquation;
    material.blendSrc = three_1.OneMinusDstColorFactor;
    material.blendDst = three_1.OneFactor;
    material.needsUpdate = true;
}
exports.setBlendScreen = setBlendScreen;
var FBO = (function () {
    function FBO(width, height, params) {
        var opts = params !== undefined ? params : {};
        if (opts.wrapS === undefined)
            opts.wrapS = three_1.ClampToEdgeWrapping;
        if (opts.wrapT === undefined)
            opts.wrapT = three_1.ClampToEdgeWrapping;
        if (opts.minFilter === undefined)
            opts.minFilter = three_1.LinearFilter;
        if (opts.magFilter === undefined)
            opts.magFilter = three_1.LinearFilter;
        if (opts.format === undefined)
            opts.format = three_1.RGBAFormat;
        if (opts.type === undefined)
            opts.type = dom_1.isiOS ? three_1.HalfFloatType : three_1.FloatType;
        if (opts.depthBuffer === undefined)
            opts.depthBuffer = false;
        if (opts.stencil === undefined)
            opts.stencil = false;
        this.rt1 = new three_1.WebGLRenderTarget(width, height, opts);
        this.target = this.rt1;
    }
    FBO.prototype.resize = function (width, height) {
        this.rt1.setSize(width, height);
    };
    Object.defineProperty(FBO.prototype, "texture", {
        get: function () {
            return this.target.texture;
        },
        enumerable: false,
        configurable: true
    });
    return FBO;
}());
exports.FBO = FBO;
var DoubleFBO = (function (_super) {
    __extends(DoubleFBO, _super);
    function DoubleFBO(width, height, params) {
        var _this = _super.call(this, width, height, params) || this;
        _this.flip = true;
        _this.rt2 = _this.rt1.clone();
        return _this;
    }
    DoubleFBO.prototype.resize = function (width, height) {
        this.rt1.setSize(width, height);
        this.rt2.setSize(width, height);
    };
    DoubleFBO.prototype.swap = function () {
        if (this.flip) {
            this.target = this.rt2;
        }
        else {
            this.target = this.rt1;
        }
        this.flip = !this.flip;
    };
    return DoubleFBO;
}(FBO));
exports.DoubleFBO = DoubleFBO;
var Pass = (function () {
    function Pass(material) {
        this.camera = exports.orthoCamera;
        this.scene = new three_1.Scene();
        this.material = material;
        this.mesh = new three_1.Mesh(exports.plane, this.material);
        this.scene.add(this.mesh);
    }
    Pass.prototype.draw = function () {
    };
    return Pass;
}());
exports.Pass = Pass;
function updateTextureData(svgElement, imgWid, imgHei) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve) {
                    var svgData = svgElement.outerHTML;
                    var svgBlob = new Blob([[svgData]], { type: 'image/svg+xml' });
                    var texture;
                    var img = new Image();
                    img.onload = function () {
                        texture = new three_1.Texture(img);
                        texture.minFilter = three_1.LinearFilter;
                        texture.magFilter = three_1.LinearFilter;
                        texture.needsUpdate = true;
                        resolve(texture);
                    };
                    var dataBase64;
                    var reader = new FileReader();
                    reader.onload = function () {
                        dataBase64 = reader.result;
                        img.src = dataBase64;
                        img.width = imgWid * devicePixelRatio;
                        img.height = imgHei * devicePixelRatio;
                    };
                    dataBase64 = reader.readAsDataURL(svgBlob);
                })];
        });
    });
}
exports.updateTextureData = updateTextureData;
