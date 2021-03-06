(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.EventTargetPortable = {}));
}(this, (function (exports) { 'use strict';

    var Event = /** @class */ (function () {
        function Event(name) {
            this.name = name;
            this.shouldStopImmediatePropagation = false;
        }
        Event.prototype.stopImmediatePropagation = function () {
            this.shouldStopImmediatePropagation = true;
        };
        Object.defineProperty(Event.prototype, "immediatePropagationStopped", {
            get: function () {
                return this.shouldStopImmediatePropagation;
            },
            enumerable: false,
            configurable: true
        });
        return Event;
    }());

    var EventTarget = /** @class */ (function () {
        function EventTarget() {
            this.listeners = {};
        }
        EventTarget.prototype.hasEvent = function (name) {
            return Object.prototype.hasOwnProperty.call(this.listeners, name);
        };
        EventTarget.prototype.addEventListener = function (name, handler, options) {
            if (options === void 0) { options = {}; }
            var stack = this.hasEvent(name)
                ? this.listeners[name]
                : (this.listeners[name] = []);
            stack.push({ handler: handler, options: options });
            return {
                remove: this.removeEventListener.bind(this, name, handler)
            };
        };
        EventTarget.prototype.removeEventListener = function (name, handler) {
            var removed = false;
            if (this.hasEvent(name)) {
                var stack = this.listeners[name];
                for (var i = 0; i < stack.length; i++) {
                    var listener = stack[i];
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
        };
        EventTarget.prototype.dispatchEvent = function (event) {
            var broke = false;
            if (this.hasEvent(event.name)) {
                var stack = this.listeners[event.name];
                for (var i = stack.length; i--;) {
                    if (event.immediatePropagationStopped) {
                        broke = true;
                        break;
                    }
                    var listener = stack[i];
                    listener.handler.call(this, event);
                    if (listener.options.once) {
                        this.removeEventListener(event.name, listener.handler);
                    }
                }
            }
            return !broke;
        };
        return EventTarget;
    }());

    exports.Event = Event;
    exports.EventTarget = EventTarget;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
