// Type definitions for EventEmitter v4.2.7
// Project: https://github.com/Olical/EventEmitter
// Definitions by: TODO
// Definitions: TODO

declare module 'EventEmitter' {
	class EventEmitter {
		addListener(event: string | RegExp, listener: Function): EventEmitter;
		addListeners(event: string | RegExp, listeners: Function[]): EventEmitter;
		addOnceListener(event: string | RegExp, listener: Function): EventEmitter;
		defineEvent(event: string): EventEmitter;
		defineEvents(event: string[]): EventEmitter;
		emit(event: string | RegExp, ...args: any[]): EventEmitter;
		emitEvent(event: string | RegExp, args: any[]): EventEmitter;
		flattenListeners(listeners: Object[]): Function[];
		getListeners(event: string | RegExp): Function[] | Object;
		getListenersAsObject(event: string | RegExp): Object;
		manipulateListeners(remove: Boolean, event: string | Object | RegExp, listeners: Function[]): EventEmitter;
		noConflict(): EventEmitter;
		off(event: string | RegExp, listener: Function): EventEmitter;
		on(event: string | RegExp, listener: Function): EventEmitter;
		once(event: string | RegExp, listener: Function): EventEmitter;
		removeAllListeners(event: string | RegExp): EventEmitter;
		removeEvent(event: string | RegExp): EventEmitter;
		removeListener(event: string | RegExp, listener: Function): EventEmitter;
		removeListener(event: string | Object | RegExp, listeners: Function[]): EventEmitter;
		setOnceReturnValue(value: any): EventEmitter;
		trigger(event: string | RegExp, args: any[]): EventEmitter;
	}

	export = EventEmitter;
}
