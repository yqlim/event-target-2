export default class Event<T extends string = string> {
  readonly name: T;
  private shouldStopImmediatePropagation: boolean;

  constructor(name: T) {
    this.name = name;
    this.shouldStopImmediatePropagation = false;
  }

  stopImmediatePropagation(): void {
    this.shouldStopImmediatePropagation = true;
  }

  get immediatePropagationStopped(): boolean {
    return this.shouldStopImmediatePropagation;
  }
}
