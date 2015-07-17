/// <reference path="../cldrjs/cldrjs.d.ts" />

declare module 'globalize' {
	import Cldr = require('cldr');

	module Globalize {
		export interface CurrencyFormatter {
			(value: number): string;
		}

		export interface CurrencyOptions extends NumberOptions {
			style?: string;
		}

		export interface DateFormatter {
			(value: Date): string;
		}

		export interface DateParser {
			(value: string): Date;
		}

		export interface DateOptions {
			date?: string;
			datetime?: string;
			raw?: string;
			skeleton?: string;
			time?: string;
		}

		export interface MessageFormatter {
			(variables: string | string[] | Object): string;
			(...variables: string[]): string;
		}

		export interface NumberFormatter {
			(value: number): string;
		}

		export interface NumberOptions {
			maximumFractionDigits?: number;
			maximumSignificantDigits?: number;
			minimumFractionDigits?: number;
			minimumIntegerDigits?: number;
			minimumSignificantDigits?: number;
			round?: string;
			style?: string;
			useGrouping?: Boolean;
		}

		export interface NumberParser {
			(value: string): number;
		}

		export interface NumberParserOptions {
			style?: string;
		}

		export interface Pluralizer {
			(value: number): string;
		}

		export interface PluralOptions {
			type: string;
		}

		export interface TimeFormatter {
			(value: number): string;
		}

		export interface TimeOptions {
			form: string;
		}
	}

	class Globalize {
		/**
		 * @requires globalize/currency
		 * @param currencyCode ISO 4217 (e.g. 'USD')
		 */
		static currencyFormatter(currencyCode: string, options?: Globalize.CurrencyOptions): Globalize.CurrencyFormatter;

		/**
		 * @requires globalize/date
		 */
		static dateFormatter(options: Globalize.DateOptions): Globalize.DateFormatter;

		/**
		 * @requires globalize/date
		 */
		static dateParser(value: string): Date;

		/**
		 * @requires globalize/currency
		 */
		static formatCurrency(value: number, currencyCode: string, options?: Globalize.CurrencyOptions): string;

		/**
		 * @requires globalize/date
		 */
		static formatDate(value: Date, options?: Globalize.DateOptions): string;

		/**
		 * @requires globalize/date
		 */
		static formatMessage(path: string | string[], variables?: string | string[] | Object): string;
		static formatMessage(path: string | string[], ...variables: string[]): string;

		/**
		 * @requires globalize/number
		 */
		static formatNumber(value: number, options?: Globalize.NumberOptions): string;

		/**
		 * @requires globalize/relative-time
		 */
		static formatRelativeTime(value: number, unit: string, options?: Globalize.TimeOptions): string;

		static load(...cldrData: Object[]): void;

		/**
		 * @requires globalize/message
		 */
		static loadMessages(cldrData: Object): void;

		static locale(locale?: string | Cldr): Cldr;

		/**
		 * @requires globalize/message
		 */
		static messageFormatter(path: string | string[]): Globalize.MessageFormatter;

		/**
		 * @requires globalize/number
		 */
		static numberFormatter(options: Globalize.NumberOptions): Globalize.NumberFormatter;

		/**
		 * @requires globalize/number
		 */
		static numberParser(options: Globalize.NumberParserOptions): Globalize.NumberParser;

		/**
		 * @requires globalize/plural
		 */
		static pluralGenerator(options: Globalize.PluralOptions): Globalize.Pluralizer;

		/**
		 * @requires globalize/relative-time
		 */
		static relativeTimeFormatter(unit: string, options?: Globalize.TimeOptions): Globalize.TimeFormatter;

		constructor(locale: string | Cldr);

		/**
		 * @requires globalize/currency
		 * @param currencyCode ISO 4217 (e.g. 'USD')
		 */
		currencyFormatter(currencyCode: string, options?: Globalize.CurrencyOptions): Globalize.CurrencyFormatter;

		/**
		 * @requires globalize/date
		 */
		dateFormatter(options: Globalize.DateOptions): Globalize.DateFormatter;

		/**
		 * @requires globalize/date
		 */
		dateParser(options: Globalize.DateOptions): Globalize.DateParser;

		/**
		 * @requires globalize/currency
		 */
		formatCurrency(value: number, currencyCode: string, options?: Globalize.CurrencyOptions): string;

		/**
		 * @requires globalize/date
		 */
		formatDate(value: Date, options?: Globalize.DateOptions): string;

		/**
		 * @requires globalize/date
		 */
		formatMessage(path: string | string[], variables?: string | string[] | Object): string;
		formatMessage(path: string | string[], ...variables: string[]): string;

		/**
		 * @requires globalize/number
		 */
		formatNumber(value: number, options?: Globalize.NumberOptions): string;

		/**
		 * @requires globalize/relative-time
		 */
		formatRelativeTime(value: number, unit: string, options?: Globalize.TimeOptions): string;

		/**
		 * @requires globalize/message
		 */
		messageFormatter(path: string | string[]): Globalize.MessageFormatter;

		/**
		 * @requires globalize/number
		 */
		numberFormatter(options: Globalize.NumberOptions): Globalize.NumberFormatter;

		/**
		 * @requires globalize/number
		 */
		numberParser(options: Globalize.NumberParserOptions): Globalize.NumberParser;

		/**
		 * @requires globalize/date
		 */
		parseDate(value: string, options?: Globalize.DateOptions): Date;

		/**
		 * @requires globalize/number
		 */
		parseNumber(value: string, options?: Globalize.NumberParserOptions): number;

		/**
		 * @requires globalize/plural
		 */
		plural(value: number, options?: Globalize.PluralOptions): string;

		/**
		 * @requires globalize/plural
		 */
		pluralGenerator(options: Globalize.PluralOptions): Globalize.Pluralizer;

		/**
		 * @requires globalize/relative-time
		 */
		relativeTimeFormatter(unit: string, options?: Globalize.TimeOptions): Globalize.TimeFormatter;
	}

	export = Globalize;
}
