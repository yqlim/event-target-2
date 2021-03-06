import Event from './Event';

type EventListener<H extends EventHandler> = {
  handler: H;
  options: EventListenerOptions;
};

type EventListeners<M extends EventMap> = {
  [x in keyof M]: EventListener<M[x]>[];
};

type EventMapKeys<M extends EventMap> = Extract<keyof M, string>;

type EventRemover = {
  remove: () => boolean;
};

export type EventHandler<
  K extends string = string,
  T extends Event<K> = Event<K>
> = (e: T, ...args: any[]) => any;

export type EventListenerOptions = {
  once?: true;
};

export type EventMap<
  K extends string = string,
  H extends EventHandler<K> = EventHandler<K>
> = Record<K, H>;

export default abstract class EventTarget<
  M extends EventMap = Record<string, never>
> {
  private readonly listeners: EventListeners<M>;

  constructor() {
    this.listeners = {} as EventListeners<M>;
  }

  private hasEvent<T extends EventMapKeys<M>>(name: T) {
    return Object.prototype.hasOwnProperty.call(this.listeners, name);
  }

  addEventListener<T extends EventMapKeys<M>>(
    name: T,
    handler: M[T],
    options: EventListenerOptions = {}
  ): EventRemover {
    const stack = this.hasEvent(name)
      ? this.listeners[name]
      : (this.listeners[name] = []);

    stack.push({ handler, options });

    return {
      remove: this.removeEventListener.bind(this, name, handler)
    };
  }

  removeEventListener<T extends EventMapKeys<M>>(
    name: T,
    handler: M[T]
  ): boolean {
    let removed = false;

    if (this.hasEvent(name)) {
      const stack = this.listeners[name];

      for (let i = 0; i < stack.length; i++) {
        const listener = stack[i];
        if (listener.handler === handler) {
          stack.splice(i--, 1);
          removed = true;
        }
      }

      if (stack.length === 0) {
        delete this.listeners[name];
      }
    }

    return removed;
  }

  dispatchEvent<T extends EventMapKeys<M>, E extends Event<T>>(
    event: E
  ): boolean {
    let broke = false;

    if (this.hasEvent(event.name)) {
      const stack = this.listeners[event.name];

      for (let i = stack.length; i--; ) {
        if (event.immediatePropagationStopped) {
          broke = true;
          break;
        }

        const listener = stack[i];

        listener.handler.call(this, event);

        if (listener.options.once) {
          this.removeEventListener(event.name, listener.handler);
        }
      }
    }

    return !broke;
  }
}
