import { BladeApi, BladeController, ButtonApi, InputBindingApi, MonitorBindingApi, View } from '@tweakpane/core';
import { FolderApi, Pane } from 'tweakpane';
export declare class Debugger {
    enabled: boolean;
    gui: Pane;
    stats: any;
    folders: Object;
    init(): void;
    begin(): void;
    end(): void;
    folder(name: string, expanded?: boolean): any;
    addButton(folder: FolderApi | undefined, label: string, callback: () => void): ButtonApi;
    addColor(folder: FolderApi | undefined, obj: any, value: string, props?: any): InputBindingApi<unknown, any>;
    addOptions(folder: FolderApi | undefined, label: string, options: Array<any>, callback: (value: any) => void): BladeApi<BladeController<View>>;
    addInput(folder: FolderApi | undefined, obj: any, value: string, props?: any): InputBindingApi<unknown, any>;
    addMonitor(folder: FolderApi | undefined, obj: any, value: string, props?: any): MonitorBindingApi<any>;
    removeFolder(name: string): void;
}
declare const debug: Debugger;
export default debug;
//# sourceMappingURL=debug.d.ts.map