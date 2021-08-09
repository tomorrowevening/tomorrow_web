import {
  BladeApi,
  BladeController,
  ButtonApi,
  InputBindingApi,
  MonitorBindingApi,
  View
} from '@tweakpane/core'
import {
  FolderApi,
  Pane
} from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';

/**
 * Single Debugging object to house dat.gui & stats
 */
export class Debugger {
  enabled: boolean = document.location.href.search('debug') > -1;

  gui!: Pane;

  stats!: any;

  folders: Object = {};

  init() {
    if (!this.enabled) return;

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

  /**
   * To be called before updating/rendering
   */
  begin() {
    if (!this.enabled) return;
    this.stats.begin();
  }

  /**
   * To be called after updating/rendering
   */
  end() {
    if (!this.enabled) return;
    this.stats.end();
  }

  /**
   * Retrieves or creates the GUI folder
   * @param name The name of the founder
   * @param expanded If the folder should be expanded or not
   */
  folder(name: string, expanded: boolean = false) {
    // If a folder with the same name already exists, return that folder
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

  /**
   * Adds a button
   * @param folder An optional folder
   * @param label The button's label
   * @param callback The callback function
   * @returns The created GUI
   */
  addButton(folder: FolderApi | undefined, label: string, callback: () => void): ButtonApi {
    const gui = folder !== undefined ? folder : this.gui;
    const btn = gui.addButton({
      title: label
    });
    btn.on('click', callback);
    return btn;
  }

  /**
   * A color to debug
   * @param folder An optional folder
   * @param obj The object with the value
   * @param value The value you want to modify/listen to
   * @param props Optional predefined options
   * @returns The created GUI
   */
  addColor(folder: FolderApi | undefined, obj: any, value: string, props?: any): InputBindingApi<unknown, any> {
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

  /**
   * A list of items
   * @param folder An optional folder
   * @param label The option's label
   * @param options The array of options
   * @param callback The callback function
   * @returns The created GUI
   */
  addOptions(folder: FolderApi | undefined, label: string, options: Array<any>, callback: (value: any) => void): BladeApi<BladeController<View>> {
    const usedGUI = folder !== undefined ? folder : this.gui;
    const added = usedGUI.addBlade({
      view: 'list',
      label: label,
      options: options,
      value: options[0].value,
    });
    // @ts-ignore
    added.on('change', (evt: any) => {
      callback(evt.value);
    });
    return added;
  }

  /**
   * An object to debug
   * @param folder An optional folder
   * @param obj The object with the value
   * @param value The value you want to modify/listen to
   * @param props Optional predefined options
   * @returns The created GUI
   */
  addInput(folder: FolderApi | undefined, obj: any, value: string, props?: any): InputBindingApi<unknown, any> {
    const usedGUI = folder !== undefined ? folder : this.gui;
    const properties = {};
    if (props !== undefined) {
      if (props.label !== undefined) properties['label'] = props.label;
      if (props.min !== undefined) {
        properties['min'] = props.min;
        properties['max'] = props.max;
        if (props.step !== undefined) properties['step'] = props.step;
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

  /**
   * An object to debug
   * @param folder An optional folder
   * @param obj The object with the value
   * @param value The value you want to modify/listen to
   * @param props Optional predefined options
   * @returns The created monitor
   */
   addMonitor(folder: FolderApi | undefined, obj: any, value: string, props?: any): MonitorBindingApi<any> {
    const usedGUI = folder !== undefined ? folder : this.gui;
    return usedGUI.addMonitor(obj, value, props);
  }

  removeFolder(name: string) {
    const folder = this.folders[name];
    if (!folder) return;
    this.gui.remove(folder);
    delete this.folders[name];
  }
}

const debug = new Debugger();
export default debug;