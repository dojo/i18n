// TODO: are convenience methods (e.g. formatCurrency) also static?

/// <reference path="../cldrjs/cldrjs.d.ts" />

declare module 'globalize' {
	import Cldr = require('cldr');

	export interface CurrencyFormatter {
		(value: number): string;
	}

	export interface CurrencyOptions {
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

	export default class Globalize {
		/**
		 * @requires globalize/currency
		 * @param currencyCode ISO 4217 (e.g. 'USD')
		 */
		static currencyFormatter(currencyCode: string, options?: CurrencyOptions): CurrencyFormatter;

		/**
		 * @requires globalize/date
		 */
		static dateFormatter(options: DateOptions): DateFormatter;

		/**
		 * @requires globalize/date
		 */
		static dateParser(value: string): Date;

		static load(...cldrData: Object[]): void;

		/**
		 * @requires globalize/message
		 */
		static loadMessages(cldrData: Object): void;

		static locale(locale?: string | Cldr): Cldr;

		/**
		 * @requires globalize/message
		 */
		static messageFormatter(path: string | string[]): MessageFormatter;

		/**
		 * @requires globalize/number
		 */
		static numberFormatter(options: NumberOptions): NumberFormatter;

		/**
		 * @requires globalize/number
		 */
		static numberParser(options: NumberParserOptions): NumberParser;

		/**
		 * @requires globalize/plural
		 */
		static pluralGenerator(options: PluralOptions): Pluralizer;

		/**
		 * @requires globalize/relative-time
		 */
		static relativeTimeFormatter(unit: string, options?: TimeOptions): TimeFormatter;

		constructor(locale: string | Cldr);

		/**
		 * @requires globalize/currency
		 * @param currencyCode ISO 4217 (e.g. 'USD')
		 */
		currencyFormatter(currencyCode: string, options?: CurrencyOptions): CurrencyFormatter;

		/**
		 * @requires globalize/date
		 */
		dateFormatter(options: DateOptions): DateFormatter;

		/**
		 * @requires globalize/date
		 */
		dateParser(options: DateOptions): DateParser;

		/**
		 * @requires globalize/currency
		 */
		formatCurrency(value: number, currencyCode: string, options?: CurrencyOptions): string;

		/**
		 * @requires globalize/date
		 */
		formatDate(value: Date, options?: DateOptions): string;

		/**
		 * @requires globalize/date
		 */
		formatMessage(path: string | string[], variables?: string | string[] | Object): string;
		formatMessage(path: string | string[], ...variables: string[]): string;

		/**
		 * @requires globalize/number
		 */
		formatNumber(value: number, options?: NumberOptions): string;

		/**
		 * @requires globalize/relative-time
		 */
		formatRelativeTime(value: number, unit: string, options?: TimeOptions): string;

		/**
		 * @requires globalize/message
		 */
		messageFormatter(path: string | string[]): MessageFormatter;

		/**
		 * @requires globalize/number
		 */
		numberFormatter(options: NumberOptions): NumberFormatter;

		/**
		 * @requires globalize/number
		 */
		numberParser(options: NumberParserOptions): NumberParser;

		/**
		 * @requires globalize/date
		 */
		parseDate(value: string, options?: DateOptions): Date;

		/**
		 * @requires globalize/number
		 */
		parseNumber(value: string, options?: NumberParserOptions): number;

		/**
		 * @requires globalize/plural
		 */
		plural(value: number, options?: PluralOptions): string;

		/**
		 * @requires globalize/plural
		 */
		pluralGenerator(options: PluralOptions): Pluralizer;

		/**
		 * @requires globalize/relative-time
		 */
		relativeTimeFormatter(unit: string, options?: TimeOptions): TimeFormatter;
	}
}
