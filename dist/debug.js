"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Stats = require("stats-js");
var dat = require("dat.gui");
function DebugUtil() {
    this.enabled = document.location.href.search('debug') > -1;
    var stats;
    var folders = {};
    if (this.enabled) {
        this.gui = new dat.GUI();
        this.gui.domElement.parentElement.style.zIndex = '10000';
        stats = new Stats();
        document.body.appendChild(stats.dom);
    }
    this.begin = function () {
        if (!this.enabled)
            return;
        stats.begin();
    };
    this.end = function () {
        if (!this.enabled)
            return;
        stats.end();
    };
    this.folder = function (name, expanded) {
        if (expanded === void 0) { expanded = false; }
        if (folders[name]) {
            return folders[name];
        }
        var folder = this.gui.addFolder(name);
        if (!expanded) {
            folder.close();
        }
        else {
            folder.open();
        }
        folders[name] = folder;
        return folders[name];
    };
    this.addButton = function (folder, label, callback) {
        var props = { click: callback };
        var usedGUI = folder !== undefined ? folder : this.gui;
        return usedGUI.add(props, 'click').name(label);
    };
    this.addOptions = function (folder, label, options, callback) {
        var usedGUI = folder !== undefined ? folder : this.gui;
        var params = {
            value: options[0]
        };
        return usedGUI.add(params, 'value', options).onChange(function (value) {
            var index = options.indexOf(value);
            callback(value, index);
        }).name(label);
    };
    this.addInput = function (folder, obj, value, props) {
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
    return this;
}
var debug = DebugUtil();
exports.default = debug;
//# sourceMappingURL=debug.js.map