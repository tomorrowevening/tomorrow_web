import * as Stats from 'stats-js';
import * as dat from 'dat.gui';

/**
 * Single Debugging object to house dat.gui & stats
 */
function DebugUtil() {
  this.enabled = document.location.href.search('debug') > -1;

  let stats: any;
  const folders: Object = {};

  if (this.enabled) {
    this.gui = new dat.GUI();
    this.gui.domElement.parentElement.style.zIndex = '10000';

    stats = new Stats();
    document.body.appendChild(stats.dom);
  }

  /**
   * To be called before updating/rendering
   */
  this.begin = function () {
    if (!this.enabled) return;
    stats.begin();
  }

  /**
   * To be called after updating/rendering
   */
  this.end = function () {
    if (!this.enabled) return;
    stats.end();
  }

  /**
   * Retrieves or creates the GUI folder
   * @param name The name of the founder
   * @param expanded If the folder should be expanded or not
   */
  this.folder = function(name: string, expanded: boolean = false) {
    // If a folder with the same name already exists, return that folder
    if (folders[name]) {
      return folders[name];
    }

    const folder = this.gui.addFolder(name);
    if (!expanded) {
      folder.close();
    } else {
      folder.open();
    }

    folders[name] = folder;
    return folders[name];
  }

  /**
   * Adds a button
   * @param folder An optional folder
   * @param label The button's label
   * @param callback The callback function
   * @returns The created GUI
   */
  this.addButton = function(
    folder: dat.gui.GUI | undefined,
    label: string,
    callback: () => void
  ): dat.gui.GUI {
    const props = { click: callback };
    const usedGUI = folder !== undefined ? folder : this.gui;
    return usedGUI.add(props, 'click').name(label);
  }

  /**
   * A list of items
   * @param folder An optional folder
   * @param label The option's label
   * @param options The array of options
   * @param callback The callback function
   * @returns The created GUI
   */
  this.addOptions = function(
    folder: dat.gui.GUI | undefined,
    label: string,
    options: Array<any>,
    callback: (value: any, index: number) => void
  ): dat.gui.GUI {
    const usedGUI = folder !== undefined ? folder : this.gui;
    const params = {
      value: options[0]
    };
    return usedGUI.add(params, 'value', options).onChange((value: any) => {
      const index = options.indexOf(value);
      callback(value, index);
    }).name(label);
  }

  /**
   * An object to debug
   * @param folder An optional folder
   * @param obj The object with the value
   * @param value The value you want to modify/listen to
   * @param props Optional predefined options
   * @returns The created GUI
   */
  this.addInput = function(
    folder: dat.gui.GUI | undefined,
    obj: any,
    value: string,
    props?: any
  ): dat.gui.GUI {
    const usedGUI = folder !== undefined ? folder : this.gui;
    let added: dat.gui.GUI = usedGUI;

    if (props !== undefined) {
      if (props.min !== undefined) {
        if (props.step !== undefined) {
          added = usedGUI.add(obj, value, props.min, props.max, props.step);
        } else {
          added = usedGUI.add(obj, value, props.min, props.max);
        }
      }
    } else {
      added = usedGUI.add(obj, value);
    }

    if (added !== undefined) {
      if (props !== undefined) {
        if (props.label !== undefined) added.name(props.label);
        if (props.onChange !== undefined) {
          added.onChange(() => {
            props.onChange();
          });
        }
      }
    }

    return added;
  }

  return this;
}

const debug = DebugUtil();
export default debug;