import * as Globalize from 'globalize';
import i18n from '../i18n';

/**
 * Return a Globalize.js object for the specified locale. If no locale is provided, then the root
 * locale is assumed.
 *
 * @param string
 * An optional locale for the Globalize.js object.
 *
 * @return
 * The localized Globalize.js object.
 */
export default function getGlobalize(locale?: string) {
	return locale && locale !== i18n.locale ? new Globalize(locale) : Globalize;
}

/**
 * Resolves an array of formatter options and/or a locale to an object containing the locale and formatter options.
 * This is a helper method intended for internal use by the various formatter modules.
 *
 * @param args
 * An array containing formatter options and/or a locale. If the array has two values, the first should be the formatter
 * options and the second, a locale. If the array has one value, then it can be either a locale or formatter options.
 *
 * @return
 * An object containing an optional `locale` and an optional `options` object. If neither a locale nor an options
 * object is provided, then an empty object is returned.
 */
export function resolveFormatterArguments<T>(options?: T | string, locale?: string): { locale?: string; options?: T; } {
	const result = Object.create(null);
	locale = typeof options === 'string' ? options : locale;

	if (locale) {
		result.locale = locale;
	}

	if (options && typeof options === 'object') {
		result.options = options;
	}

	return result;
}
