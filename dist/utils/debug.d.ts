import * as dat from 'dat.gui';
export declare class Debugger {
    enabled: boolean;
    gui: dat.GUI;
    stats: any;
    folders: Object;
    constructor();
    begin(): void;
    end(): void;
    folder(name: string, expanded?: boolean): any;
    addButton(folder: dat.gui.GUI | undefined, label: string, callback: () => void): dat.gui.GUI;
    addOptions(folder: dat.gui.GUI | undefined, label: string, options: Array<any>, callback: (value: any, index: number) => void): dat.gui.GUI;
    addInput(folder: dat.gui.GUI | undefined, obj: any, value: string, props?: any): dat.gui.GUI;
    removeFolder(name: string): void;
}
declare const debug: Debugger;
export default debug;
//# sourceMappingURL=debug.d.ts.map