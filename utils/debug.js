import { Pane } from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
export class Debugger {
    constructor() {
        this.enabled = document.location.href.search('debug') > -1;
        this.folders = {};
    }
    init() {
        if (!this.enabled)
            return;
        this.gui = new Pane();
        this.gui.element.style.zIndex = '10000';
        this.gui.registerPlugin(EssentialsPlugin);
        this.stats = this.gui.addBlade({
            view: 'fpsgraph'
        });
        this.addButton(undefined, 'Export', () => {
            console.log(this.gui.exportPreset());
        });
    }
    begin() {
        if (!this.enabled)
            return;
        this.stats.begin();
    }
    end() {
        if (!this.enabled)
            return;
        this.stats.end();
    }
    folder(name, expanded = false) {
        if (this.folders[name]) {
            return this.folders[name];
        }
        const folder = this.gui.addFolder({
            title: name,
            expanded: expanded
        });
        this.folders[name] = folder;
        return this.folders[name];
    }
    addButton(folder, label, callback) {
        const gui = folder !== undefined ? folder : this.gui;
        const btn = gui.addButton({
            title: label
        });
        btn.on('click', callback);
        return btn;
    }
    addColor(folder, obj, value, props) {
        const usedGUI = folder !== undefined ? folder : this.gui;
        const added = usedGUI.addInput(obj, value, {
            label: props.label !== undefined ? props.label : value
        });
        if (props !== undefined) {
            if (props.onChange !== undefined) {
                added.on('change', (evt) => {
                    props.onChange(evt.value);
                });
            }
        }
        return added;
    }
    addOptions(folder, label, options, callback) {
        const usedGUI = folder !== undefined ? folder : this.gui;
        const added = usedGUI.addBlade({
            view: 'list',
            label: label,
            options: options,
            value: options[0].value,
        });
        added.on('change', (evt) => {
            callback(evt.value);
        });
        return added;
    }
    addInput(folder, obj, value, props) {
        const usedGUI = folder !== undefined ? folder : this.gui;
        const properties = {};
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
        const added = usedGUI.addInput(obj, value, properties);
        if (props !== undefined && props.onChange !== undefined) {
            added.on('change', (evt) => {
                props.onChange(evt.value);
            });
        }
        return added;
    }
    addMonitor(folder, obj, value, props) {
        const usedGUI = folder !== undefined ? folder : this.gui;
        return usedGUI.addMonitor(obj, value, props);
    }
    removeFolder(name) {
        const folder = this.folders[name];
        if (!folder)
            return;
        this.gui.remove(folder);
        delete this.folders[name];
    }
}
const debug = new Debugger();
export default debug;
