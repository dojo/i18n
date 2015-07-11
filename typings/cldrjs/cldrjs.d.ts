// TODO: jsdoc?

declare module 'cldrjs/cldr' {
	// from 'cldrjs/cldr/event'
	export class EventEmitter {
		protected _onceReturnValue: any;

		protected _getEvents(): Object;
		protected _getOnceReturnValue(): any;

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

	export default class Cldr {
		// from 'cldrjs/cldr/unresolved'
		protected static _raw: Object;

		static localeSep: string;

		// TODO: should this be generic, or just use 'any'?
		protected _alwaysArray<T>(arg: T | T[]): T[];
		protected _coreLoad(Cldr: Cldr, source: Object, cldrData: Object): Object;
		protected _createError(code: string, attributes: Object): Error;
		protected _itemGetResolved(Cldr: Cldr, path: string | string[], attributes: Object): Object;
		protected _jsonMerge(...objects: Object[]): Object;
		protected _pathNormalize(path: string | string[], attributes: Object): string[];
		// TODO: does this always resolve to a string, or maybe an object?
		protected _resourceGet(data: Object, path: string): string;
		protected _validatePresence(value: any, name: string): void;
		protected _validateType(value: any, name: string, check: Boolean, expected: string): void;
		protected _validateTypePath(value: any, name: string): void;
		protected _validateTypePlainObject(value: any, name: string): void;

		// from 'cldrjs/cldr/event'
		protected static _eventInit(): void;

		static load(...cldrData: Object[]): void;
		// from 'cldrjs/cldr/event'
		static off(event: string | RegExp, listener: Function): void;
		// from 'cldrjs/cldr/event'
		static on(event: string | RegExp, listener: Function): void;
		// from 'cldrjs/cldr/event'
		static once(event: string | RegExp, listener: Function): void;

		protected _availableBundleMap: Object;
		// TODO: verify always string
		protected _availableBundleMapQueue: string[];
		protected _resolved: Object;

		// from 'cldrjs/cldr/event'
		ee: EventEmitter;
		locale: string;

		constructor(locale: string);
		// TODO: does this always resolve to a string, or maybe an object?
		get(path: string | string[]): string;
		init(locale: string): void;
		main(path: string | string[]): string;
	}
}
