declare module 'cldrjs' {
	import Cldr = require('cldr');
	export = Cldr;
}

declare module 'cldr' {
	import CldrEvent = require('cldr/event');

	class Cldr {
		/**
		 * @requires cldr/unresolved
		 */
		protected static _raw: Object;

		static localeSep: string;

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

		/**
		 * @requires 'cldr/event'
		 */
		protected static _eventInit(): void;

		static load(...cldrData: Object[]): void;

		/**
		 * @requires 'cldr/event'
		 */
		static off(event: string | RegExp, listener: Function): void;

		/**
		 * @requires 'cldr/event'
		 */
		static on(event: string | RegExp, listener: Function): void;

		/**
		 * @requires 'cldr/event'
		 */
		static once(event: string | RegExp, listener: Function): void;

		protected _availableBundleMap: Object;
		// TODO: verify always string
		protected _availableBundleMapQueue: string[];
		protected _resolved: Object;

		/**
		 * @requires 'cldr/event'
		 */
		ee: CldrEvent.EventEmitter;

		locale: string;

		constructor(locale: string);
		// TODO: does this always resolve to a string, or maybe an object?
		get(path: string | string[]): string;
		init(locale: string): void;
		main(path: string | string[]): string;
	}

	export = Cldr;
}

declare module 'cldr/event' {
	import Cldr = require('cldrjs');

	module Cldr {
		// from 'cldrjs/cldr/event'
		export interface EventEmitter {
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
	}

	export = Cldr;
}

declare module 'cldr/supplemental' {
	import Cldr = require('cldrjs');
	export = Cldr;
}

declare module 'cldr/unresolved' {
	import Cldr = require('cldrjs');
	export = Cldr;
}
