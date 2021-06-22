export default class Marker {
    name: string;
    time: number;
    callback?: () => void;
    constructor(name?: string, time?: number);
}
