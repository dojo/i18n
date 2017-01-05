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
 * Coerce the formatter options into a value consumable by the underlying Globalize.js method.
 *
 * @param options
 * An options value.
 *
 * @return
 * The options value if it is not null; otherwise, undefined.
 */
export function normalizeOptions(options?: any): any {
	return options === null ? undefined : options;
}
