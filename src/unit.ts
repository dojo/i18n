import * as Globalize from 'globalize';
import 'globalize/dist/globalize/unit';
import i18n from './i18n';
import { NumberFormatterOptions } from './number';

export type UnitFormatterOptions = null | {
	/**
	 * form: [String] eg. "long", "short" or "narrow".
	 */
	form?: UnitLength;

	/**
	 * numberFormatter: [Function] a number formatter function. Defaults to Globalize .numberFormatter() for the current locale using the default options.
	 */
	numberFormatter?: NumberFormatterOptions;
}

export type UnitLength = 'long' | 'narrow' | 'short';

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
 * Return a string formatted for the specified number, unit, and options/locale.
 *
 * @param value
 * The number of units.
 *
 * @param unit
 * The unit, singular (e.g., "day", "meter", "foot").
 *
 * @param options
 * An optional configuration object that determines how the number and unit are formatted.
 *
 * @param locale
 * The optional locale. Defaults to the root locale.
 *
 * @return
 * The formatted string.
 */
export function formatUnit(value: number, unit: string, options?: UnitFormatterOptions, locale?: string): string {
	return getGlobalize(locale).formatUnit(value, unit, normalizeOptions(options));
}

/**
 * Return a function that formats a number according to specified unit and options/locale.
 *
 * @param unit
 * The unit, singular (e.g., "day", "meter", "foot").
 *
 * @param options
 * An optional configuration object that determines how the number and unit are formatted.
 *
 * @param locale
 * The optional locale. Defaults to the root locale.
 *
 * @return
 * A function that accepts a number and returns a string formatted according to the specified unit and options/locale.
 */
export function getUnitFormatter(unit: string, options?: UnitFormatterOptions, locale?: string): (value: number) => string {
	return getGlobalize(locale).unitFormatter(unit, normalizeOptions(options));
}
