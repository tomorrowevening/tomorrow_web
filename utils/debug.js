"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debugger = void 0;
var Stats = require("stats-js");
var dat = require("dat.gui");
var Debugger = (function () {
    function Debugger() {
        this.enabled = document.location.href.search('debug') > -1;
        this.folders = {};
        if (!this.enabled)
            return;
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);
        this.gui = new dat.GUI();
        this.gui.domElement.parentElement.style.zIndex = '10000';
    }
    Debugger.prototype.begin = function () {
        if (!this.enabled)
            return;
        this.stats.begin();
    };
    Debugger.prototype.end = function () {
        if (!this.enabled)
            return;
        this.stats.end();
    };
    Debugger.prototype.folder = function (name, expanded) {
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
    Debugger.prototype.addButton = function (folder, label, callback) {
        var props = { click: callback };
        var usedGUI = folder !== undefined ? folder : this.gui;
        return usedGUI.add(props, 'click').name(label);
    };
    Debugger.prototype.addColor = function (folder, obj, value, props) {
        var usedGUI = folder !== undefined ? folder : this.gui;
        var added = usedGUI.addColor(obj, value);
        if (props !== undefined) {
            if (props.label !== undefined)
                added.name(props.label);
            if (props.onChange !== undefined) {
                added.onChange(function () {
                    props.onChange();
                });
            }
        }
        return added;
    };
    Debugger.prototype.addOptions = function (folder, label, options, callback) {
        var usedGUI = folder !== undefined ? folder : this.gui;
        var params = {
            value: options[0]
        };
        return usedGUI.add(params, 'value', options).onChange(function (value) {
            var index = options.indexOf(value);
            callback(value, index);
        }).name(label);
    };
    Debugger.prototype.addInput = function (folder, obj, value, props) {
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
    Debugger.prototype.removeFolder = function (name) {
        var folder = this.gui.__folders[name];
        if (!folder)
            return;
        folder.close();
        this.gui.__ul.removeChild(folder.domElement.parentNode);
        delete this.gui.__folders[name];
        delete this.folders[name];
        this.gui.onResize();
    };
    return Debugger;
}());
exports.Debugger = Debugger;
var debug = new Debugger();
exports.default = debug;
