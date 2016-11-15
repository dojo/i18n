import * as Globalize from 'globalize/globalize';
import 'globalize/globalize/currency';
import 'globalize/globalize/number';
import 'globalize/globalize/plural';
import i18n from './i18n';

export interface CommonNumberFormatterOptions {
	/**
	 * Non-negative integer Number value indicating the minimum integer digits to be used. Numbers will be padded with
	 * leading zeroes if necessary.
	 */
	minimumIntegerDigits?: number;

	/**
	 * Non-negative integer Number values indicating the minimum and maximum fraction digits to be used.
	 * Numbers will be rounded or padded with trailing zeroes if necessary.
	 * Either one or both of these properties must be present.
	 * If they are, they will override minimum and maximum fraction digits derived from the CLDR patterns.
	 */
	minimumFractionDigits?: number;

	/**
	 * Non-negative integer Number values indicating the minimum and maximum fraction digits to be used.
	 * Numbers will be rounded or padded with trailing zeroes if necessary.
	 * Either one or both of these properties must be present.
	 * If they are, they will override minimum and maximum fraction digits derived from the CLDR patterns.
	 */
	maximumFractionDigits?: number;

	/**
	 * Positive integer Number values indicating the minimum and maximum fraction digits to be shown.
	 * Either none or both of these properties are present
	 * If they are, they override minimum and maximum integer and fraction digits.
	 * The formatter uses however many integer and fraction digits are required to display the specified number of
	 * significant digits.
	 */
	minimumSignificantDigits?: number;

	/**
	 * Positive integer Number values indicating the minimum and maximum fraction digits to be shown.
	 * Either none or both of these properties are present.
	 * If they are, they override minimum and maximum integer and fraction digits.
	 * The formatter uses however many integer and fraction digits are required to display the specified number of
	 * significant digits.
	 */
	maximumSignificantDigits?: number;

	/**
	 * String with rounding method ceil, floor, round (default), or truncate.
	 */
	round?: RoundNumberOption;

	/**
	 * Boolean (default is true) value indicating whether a grouping separator should be used.
	 */
	useGrouping?: boolean;
}

export type CurrencyFormatterOptions = null | CommonNumberFormatterOptions & {
	/**
	 * symbol (default), accounting, code or name.
	 */
	style?: CurrencyStyleOption;
}

export type CurrencyStyleOption = 'accounting' | 'code' | 'name' | 'symbol';

export type NumberFormatterOptions = null | CommonNumberFormatterOptions & {
	/**
	 * decimal (default), or percent
	 */
	style?: NumberStyleOption;
}

export type NumberParserOptions = null | {
	/**
	 * decimal (default), or percent.
	 */
	style?: NumberStyleOption;
}

export type NumberStyleOption = 'decimal' | 'percent';

export type PluralGeneratorOptions = null | {
	/**
	 * cardinal (default), or ordinal.
	 */
	type?: PluralTypeOption;
}

export type PluralGroup = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

export type PluralTypeOption = 'cardinal' | 'ordinal';

export type RoundNumberOption =  'ceil' | 'floor' | 'round' | 'truncate';

/**
 * @private
 * Return a Globalize.js object for the specified locale. If no locale is provided, then the root
 * locale is assumed.
 */
function getGlobalize(locale?: string) {
	return locale && locale !== i18n.locale ? new Globalize(locale) : Globalize;
}

/**
 * @private
 * Coerce the formatter options into a value consumable by the underlying Globalize.js method.
 */
function normalizeOptions(options?: any): any {
	return options === null ? undefined : options;
}

/**
 * Format a number as the specified currency, according to the specified configuration and or locale.
 *
 * @param value
 * The number to format.
 *
 * @param currency
 * The currency to which the number should be converted.
 *
 * @param options
 * An optional configuration of settings that determine how the currency string will be formatted.
 *
 * @param locale
 * An optional locale. Defaults to the root locale.
 *
 * @return
 * The formatted currency string.
 */
export function formatCurrency(value: number, currency: string, options?: CurrencyFormatterOptions, locale?: string): string {
	return getGlobalize(locale).formatCurrency(value, currency, normalizeOptions(options));
}

/**
 * Format a number according to the specified configuration and or locale.
 *
 * @param value
 * The number to format.
 *
 * @param options
 * An optional configuration of settings that determine how the number string will be formatted.
 *
 * @param locale
 * An optional locale. Defaults to the root locale.
 *
 * @return
 * The formatted number string.
 */
export function formatNumber(value: number, options?: NumberFormatterOptions, locale?: string): string {
	return getGlobalize(locale).formatNumber(value, normalizeOptions(options));
}

/**
 * Return a function that formats a number as the specified currency, according to the specified configuration
 * and or locale.
 *
 * @param currency
 * The currency to which the number should be converted.
 *
 * @param options
 * An optional configuration of settings that determine how the currency string will be formatted.
 *
 * @param locale
 * An optional locale. Defaults to the root locale.
 *
 * @return
 * A function that accepts a number and returns a formatted currency string.
 */
export function getCurrencyFormatter(currency: string, options?: CurrencyFormatterOptions, locale?: string): (value: number) => string {
	return getGlobalize(locale).currencyFormatter(currency, normalizeOptions(options));
}

/**
 * Return a function that formats a number according to the specified configuration and or locale.
 *
 * @param options
 * An optional configuration of settings that determine how the number string will be formatted.
 *
 * @param locale
 * An optional locale. Defaults to the root locale.
 *
 * @return
 * A function that accepts a number and returns a formatted string.
 */
export function getNumberFormatter(options?: NumberFormatterOptions, locale?: string): (value: number) => string {
	return getGlobalize(locale).numberFormatter(normalizeOptions(options));
}

/**
 * Parse a number from a string based on the provided configuration and or locale.
 *
 * @param options
 * An optional config that describes the format of the string.
 *
 * @param locale
 * An optional locale. Defaults to the root locale.
 *
 * @return
 * The parsed number.
 */
export function getNumberParser(options?: NumberFormatterOptions, locale?: string): (value: string) => number {
	return getGlobalize(locale).numberParser(normalizeOptions(options));
}

/**
 * Return a function that accepts a number and returns that number's plural group.
 *
 * @param options
 * An optional configuration that determines whether the numerical value should be treated as a cardinal
 * or ordinal number.
 *
 * @param locale
 * An optional locale. Defaults to the root locale.
 *
 * @return
 * A function that accepts a number and returns the corresponding plural group.
 */
export function getPluralGenerator(options?: PluralGeneratorOptions, locale?: string): (value: number) => PluralGroup {
	return getGlobalize(locale).pluralGenerator(normalizeOptions(options)) as (value: number) => PluralGroup;
}

/**
 * Return a function that parses a number from a string based on the provided configuration and or locale.
 *
 * @param value
 * The string to parse.
 *
 * @param options
 * An optional config that describes the format of the string.
 *
 * @param locale
 * An optional locale. Defaults to the root locale.
 *
 * @return
 * A function that accepts a string and returns a number.
 */
export function parseNumber(value: string, options?: NumberFormatterOptions, locale?: string): number {
	return getGlobalize(locale).parseNumber(value, normalizeOptions(options));
}

/**
 * Return the plural group from a number.
 *
 * @param value
 * The number.
 *
 * @param options
 * An optional configuration that determines whether the numerical value should be treated as a cardinal
 * or ordinal number.
 *
 * @param locale
 * An optional locale. Defaults to the root locale.
 *
 * @return
 * The plural group.
 */
export function pluralize(value: number, options?: PluralGeneratorOptions, locale?: string): PluralGroup {
	return getGlobalize(locale).plural(value, normalizeOptions(options)) as PluralGroup;
}
