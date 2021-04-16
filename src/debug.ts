import * as Stats from 'stats-js';
import * as dat from 'dat.gui';

/**
 * Single Debugging object to house dat.gui & stats
 */
export class DebugUtil {
  enabled: boolean = document.location.href.search('debug') > -1;

  gui: dat.GUI;

  private stats: any;

  private folders: Object = {};

  constructor() {
    if (!this.enabled) return;

    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);

    this.gui = new dat.GUI();
    this.gui.domElement.parentElement.style.zIndex = '10000';
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

    const folder = this.gui.addFolder(name);
    if (!expanded) {
      folder.close();
    } else {
      folder.open();
    }

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
  addButton(folder: dat.gui.GUI | undefined, label: string, callback: () => void): dat.gui.GUI {
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
  addOptions(
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
  addInput(
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
}

/**
 * The singleton Debug instance
 */
export default new DebugUtil();