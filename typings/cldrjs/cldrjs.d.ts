declare module 'cldrjs' {
	import Cldr = require('cldr');
	export = Cldr;
}

declare module 'cldr' {
	import CldrEvent = require('cldr/event');
	import EventEmitter = require('EventEmitter');

	class Cldr {
		protected static _availableBundleMap: Object;
		protected static _availableBundleMapQueue: string[];
		/**
		 * @requires cldr/unresolved
		 */
		protected static _raw: Object;
		protected static _resolved: Object;

		static localeSep: string;

		protected static _alwaysArray<T>(arg: T | T[]): T[];
		protected static _coreLoad(Cldr: Cldr, source: Object, cldrData: Object): Object;
		protected static _createError(code: string, attributes: Object): Error;
		/**
		 * @requires 'cldr/event'
		 */
		protected static _eventInit(): void;
		protected static _itemGetResolved(Cldr: Cldr, path: string | string[], attributes: Object): Object;
		protected static _jsonMerge(...objects: Object[]): Object;
		protected static _pathNormalize(path: string | string[], attributes: Object): string[];
		protected static _resourceGet(data: Object, path: string): string | Object;
		protected static _validatePresence(value: any, name: string): void;
		protected static _validateType(value: any, name: string, check: Boolean, expected: string): void;
		protected static _validateTypePath(value: any, name: string): void;
		protected static _validateTypePlainObject(value: any, name: string): void;

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

		/**
		 * @requires 'cldr/event'
		 */
		ee: EventEmitter;

		locale: string;

		constructor(locale: string);
		get(path: string | string[]): string;
		init(locale: string): void;
		main(path: string | string[]): string;
	}

	export = Cldr;
}

declare module 'cldr/event' {
	import Cldr = require('cldrjs');
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
