declare module 'cldrjs' {
	import Cldr = require('cldr');
	export = Cldr;
}

declare module 'cldr' {
	import CldrEvent = require('cldr/event');
	import EventEmitter = require('EventEmitter');

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
		protected _resourceGet(data: Object, path: string): string | Object;
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
		protected _availableBundleMapQueue: string[];
		protected _resolved: Object;

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
