export default class Event<T extends string = string> {
    readonly name: T;
    private shouldStopImmediatePropagation;
    constructor(name: T);
    stopImmediatePropagation(): void;
    get immediatePropagationStopped(): boolean;
}
