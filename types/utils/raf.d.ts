declare class Raf {
    playing: boolean;
    clock: {
        elapsed: number;
        delta: number;
        start: number;
        last: number;
        now: () => number;
        seconds: () => number;
        restart: () => void;
        update: () => void;
    };
    private callbacks;
    private onRAF;
    private onUpdate;
    constructor();
    add(name: string, callback: () => void): void;
    remove(name: string): void;
    play(): void;
    pause(): void;
    update(): void;
}
declare const raf: Raf;
export default raf;
