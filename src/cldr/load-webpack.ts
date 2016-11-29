import global from 'dojo-core/global';
import Promise from 'dojo-shim/Promise';
import * as Globalize from 'globalize/dist/globalize';
import {
	CldrData,
	CldrDataResponse,
	loadLocaleData,
	loadSupplementalData,
	localeCldrPaths,
	supplementalCldrPaths
} from './load';

/**
 * @private
 * Looks for cached CLDR data on the global object, registers it if it has not already been registered,
 * and then returns the data.
 *
 * Loading the data in this manner allows `global.__cldrData__` to be populated after this module loads.
 *
 * @return
 * The cached CLDR data object.
 */
const getCachedCldrData = (function () {
	let loaded: CldrDataResponse;
	return function () {
		if (!loaded) {
			loaded = global.__cldrData__;
			Object.keys(loaded).forEach((key: string) => {
				Globalize.load(loaded[key]);
			});
		}

		return loaded;
	};
})();

/**
 * A webpack-specific function used to load CLDR data from a preset cache.
 */
export default function loadCldrData(locales: string[]): Promise<CldrDataResponse>;
export default function loadCldrData(locale: string, fallback?: string): Promise<CldrDataResponse>;
export default function loadCldrData(locales: any, fallback?: string): Promise<CldrDataResponse> {
	const loaded = getCachedCldrData();
	locales = Array.isArray(locales) ? locales : [ locales ];

	return Promise.all(locales.map((locale: string, i: number) => {
		let cached = loaded[locale];

		if (!cached && fallback && fallback !== locale) {
			cached = loaded[fallback];

			if (cached) {
				locales.splice(i, 1, fallback);
			}
		}

		return cached ? Promise.resolve(cached) : loadLocaleData(locale, fallback);
	})).then((result: Array<CldrData[]>) => {
		return locales.reduce((data: CldrDataResponse, locale: string, i: number) => {
			data[locale] = result[i];
			return data;
		}, {
			supplemental: loaded.supplemental
		});
	});
}

export {
	loadLocaleData,
	loadSupplementalData,
	localeCldrPaths,
	supplementalCldrPaths
};
