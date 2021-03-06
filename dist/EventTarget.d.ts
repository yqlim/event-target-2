import Event from './Event';
declare type EventMapKeys<M extends EventMap> = Extract<keyof M, string>;
declare type EventRemover = {
    remove: () => boolean;
};
export declare type EventHandler<K extends string = string, T extends Event<K> = Event<K>> = (e: T, ...args: any[]) => any;
export declare type EventListenerOptions = {
    once?: true;
};
export declare type EventMap<K extends string = string, H extends EventHandler<K> = EventHandler<K>> = Record<K, H>;
export default abstract class EventTarget<M extends EventMap = Record<string, never>> {
    private readonly listeners;
    constructor();
    private hasEvent;
    addEventListener<T extends EventMapKeys<M>>(name: T, handler: M[T], options?: EventListenerOptions): EventRemover;
    removeEventListener<T extends EventMapKeys<M>>(name: T, handler: M[T]): boolean;
    dispatchEvent<T extends EventMapKeys<M>, E extends Event<T>>(event: E): boolean;
}
export {};
