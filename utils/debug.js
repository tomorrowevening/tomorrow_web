"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debugger = void 0;
var tweakpane_1 = require("tweakpane");
var EssentialsPlugin = require("@tweakpane/plugin-essentials");
var Debugger = (function () {
    function Debugger() {
        this.enabled = document.location.href.search('debug') > -1;
        this.folders = {};
    }
    Debugger.prototype.init = function () {
        var _this = this;
        if (!this.enabled)
            return;
        this.gui = new tweakpane_1.Pane();
        this.gui.element.style.zIndex = '10000';
        this.gui.registerPlugin(EssentialsPlugin);
        this.stats = this.gui.addBlade({
            view: 'fpsgraph'
        });
        this.addButton(undefined, 'Export', function () {
            console.log(_this.gui.exportPreset());
        });
    };
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
        var folder = this.gui.addFolder({
            title: name,
            expanded: expanded
        });
        this.folders[name] = folder;
        return this.folders[name];
    };
    Debugger.prototype.addButton = function (folder, label, callback) {
        var gui = folder !== undefined ? folder : this.gui;
        var btn = gui.addButton({
            title: label
        });
        btn.on('click', callback);
        return btn;
    };
    Debugger.prototype.addColor = function (folder, obj, value, props) {
        var usedGUI = folder !== undefined ? folder : this.gui;
        var added = usedGUI.addInput(obj, value, {
            label: props.label !== undefined ? props.label : value
        });
        if (props !== undefined) {
            if (props.onChange !== undefined) {
                added.on('change', function (evt) {
                    props.onChange(evt.value);
                });
            }
        }
        return added;
    };
    Debugger.prototype.addOptions = function (folder, label, options, callback) {
        var usedGUI = folder !== undefined ? folder : this.gui;
        var added = usedGUI.addBlade({
            view: 'list',
            label: label,
            options: options,
            value: options[0].value,
        });
        added.on('change', function (evt) {
            callback(evt.value);
        });
        return added;
    };
    Debugger.prototype.addInput = function (folder, obj, value, props) {
        var usedGUI = folder !== undefined ? folder : this.gui;
        var properties = {};
        if (props !== undefined) {
            if (props.label !== undefined)
                properties['label'] = props.label;
            if (props.min !== undefined) {
                properties['min'] = props.min;
                properties['max'] = props.max;
                if (props.step !== undefined)
                    properties['step'] = props.step;
            }
        }
        var added = usedGUI.addInput(obj, value, properties);
        if (props !== undefined && props.onChange !== undefined) {
            added.on('change', function (evt) {
                props.onChange(evt.value);
            });
        }
        return added;
    };
    Debugger.prototype.addMonitor = function (folder, obj, value, props) {
        var usedGUI = folder !== undefined ? folder : this.gui;
        return usedGUI.addMonitor(obj, value, props);
    };
    Debugger.prototype.removeFolder = function (name) {
        var folder = this.folders[name];
        if (!folder)
            return;
        this.gui.remove(folder);
        delete this.folders[name];
    };
    return Debugger;
}());
exports.Debugger = Debugger;
var debug = new Debugger();
exports.default = debug;
