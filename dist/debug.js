"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugUtil = void 0;
var Stats = require("stats-js");
var dat = require("dat.gui");
var DebugUtil = (function () {
    function DebugUtil() {
        this.enabled = document.location.href.search('debug') > -1;
        this.folders = {};
        if (!this.enabled)
            return;
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);
        this.gui = new dat.GUI();
        this.gui.domElement.parentElement.style.zIndex = '10000';
    }
    DebugUtil.prototype.begin = function () {
        if (!this.enabled)
            return;
        this.stats.begin();
    };
    DebugUtil.prototype.end = function () {
        if (!this.enabled)
            return;
        this.stats.end();
    };
    DebugUtil.prototype.folder = function (name, expanded) {
        if (expanded === void 0) { expanded = false; }
        if (this.folders[name]) {
            return this.folders[name];
        }
        var folder = this.gui.addFolder(name);
        if (!expanded) {
            folder.close();
        }
        else {
            folder.open();
        }
        this.folders[name] = folder;
        return this.folders[name];
    };
    DebugUtil.prototype.addButton = function (folder, label, callback) {
        var props = { click: callback };
        var usedGUI = folder !== undefined ? folder : this.gui;
        return usedGUI.add(props, 'click').name(label);
    };
    DebugUtil.prototype.addOptions = function (folder, label, options, callback) {
        var usedGUI = folder !== undefined ? folder : this.gui;
        var params = {
            value: options[0]
        };
        return usedGUI.add(params, 'value', options).onChange(function (value) {
            var index = options.indexOf(value);
            callback(value, index);
        }).name(label);
    };
    DebugUtil.prototype.addInput = function (folder, obj, value, props) {
        var usedGUI = folder !== undefined ? folder : this.gui;
        var added = usedGUI;
        if (props !== undefined) {
            if (props.min !== undefined) {
                if (props.step !== undefined) {
                    added = usedGUI.add(obj, value, props.min, props.max, props.step);
                }
                else {
                    added = usedGUI.add(obj, value, props.min, props.max);
                }
            }
        }
        else {
            added = usedGUI.add(obj, value);
        }
        if (added !== undefined) {
            if (props !== undefined) {
                if (props.label !== undefined)
                    added.name(props.label);
                if (props.onChange !== undefined) {
                    added.onChange(function () {
                        props.onChange();
                    });
                }
            }
        }
        return added;
    };
    return DebugUtil;
}());
exports.DebugUtil = DebugUtil;
exports.default = new DebugUtil();
//# sourceMappingURL=debug.js.map