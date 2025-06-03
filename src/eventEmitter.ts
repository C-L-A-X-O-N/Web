// eventEmitter.js
export class EventEmitter {
    listeners: { [key: string]: Function[] };

    constructor() {
        this.listeners = {};
    }

    on(event: string, callback: Function) {
        if (typeof callback !== 'function') {
            throw new Error("Callback must be a function");
        }
        if (typeof event !== 'string' || !event.trim()) {
            throw new Error("Event name must be a non-empty string");
        }
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
        return () => this.off(event, callback); // unsubscribe function
    }

    off(event: string, callback: Function) {
        if (typeof event !== 'string' || !event.trim()) {
            throw new Error("Event name must be a non-empty string");
        }
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    emit(event: string, data: any) {
        if (typeof event !== 'string' || !event.trim()) {
            throw new Error("Event name must be a non-empty string");
        }
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(callback => callback(data));
    }
}
