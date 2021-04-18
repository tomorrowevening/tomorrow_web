import * as dat from 'dat.gui';
declare class Debugger {
    enabled: boolean;
    gui: dat.GUI;
    private stats;
    private folders;
    constructor();
    begin(): void;
    end(): void;
    folder(name: string, expanded?: boolean): any;
    addButton(folder: dat.gui.GUI | undefined, label: string, callback: () => void): dat.gui.GUI;
    addOptions(folder: dat.gui.GUI | undefined, label: string, options: Array<any>, callback: (value: any, index: number) => void): dat.gui.GUI;
    addInput(folder: dat.gui.GUI | undefined, obj: any, value: string, props?: any): dat.gui.GUI;
}
declare const debug: Debugger;
export default debug;
