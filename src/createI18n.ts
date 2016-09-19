import compose, { ComposeFactory } from 'dojo-compose/compose';
import { State, Stateful } from 'dojo-compose/mixins/createStateful';
import global from 'dojo-core/global';
import has from 'dojo-core/has';
import { Handle } from 'dojo-core/interfaces';
import { assign } from 'dojo-core/lang';
import Promise from 'dojo-shim/Promise';
import WeakMap from 'dojo-shim/WeakMap';

interface BundleModule {
	default?: Dictionary;
	locales?: string[];
	messages?: Dictionary;
}

const defaultLoader: Loader = (function () {
	function mapBundles(bundleModules: BundleModule[]): Bundle[] {
		return bundleModules.map(function (bundleModule: BundleModule) {
			const locales = bundleModule.locales;
			const messages = bundleModule.default;
			return { locales, messages } as Bundle;
		});
	}

	if (has('host-node')) {
		return function (paths: string[]): Promise<Bundle[]> {
			const bundleModules: BundleModule[] = paths.map(function (path: string) {
				return global.require(path) as BundleModule;
			});
			return Promise.resolve(mapBundles(bundleModules));
		};
	}

	return function (paths: string[]): Promise<Bundle[]> {
		return new Promise<Bundle[]>(function (resolve, reject) {
			const require = global.require;
			require.on('error', function (error: Error) {
				reject(error);
			});
			require(paths, function (...bundleModules: BundleModule[]) {
				resolve(mapBundles(bundleModules));
			});
		});
	};
})();

function filterKeys(keys: MessageKeys, dictionary: Dictionary): Dictionary {
	const subset = {} as Dictionary;

	if (Array.isArray(keys)) {
		return keys.reduce(function (subset: Dictionary, key: string) {
			subset[key] = dictionary[key];
			return subset;
		}, subset);
	}

	return Object.keys(keys).reduce(function (subset: Dictionary, key: string) {
		const alias = keys[key];
		subset[alias] = dictionary[key];
		return subset;
	}, subset);
}

const normalizeLocale = (function () {
	if (has('host-node')) {
		return function (locale: string): string {
			if (locale.indexOf('.') === -1) {
				return locale;
			}

			return locale.split('.').slice(0, -1).map(function (part: string): string {
				return part.replace(/_/g, '-');
			}).join('-');
		};
	}

	return function (locale: string): string {
		return locale;
	};
})();

function getSupportedLocales(locale: string, supported: string[] = []): string[] {
	const normalized = normalizeLocale(locale);
	const parts = normalized.split('-');
	const result: string[] = [];

	let current = parts[0];

	if (supported.indexOf(current) > -1) {
		result.push(current);
	}

	for (let i = 0; i < parts.length - 1; i += 1) {
		const next = parts[i + 1];

		if (next) {
			current += '-' + next;

			if (supported.indexOf(current) > -1) {
				result.push(current);
			}
		}
	}

	return result;
}

interface StatefulData {
	options: StatefulOptions;
	stateful: Stateful<State>;
}

const dictionaryRegistry = new WeakMap<Intl, BundleMap>();
const instanceMap = new WeakMap<Intl, { [key: string]: any }>();
const statefulMap = new WeakMap<Intl, { [key: string]: StatefulData[] }>();

export interface Bundle {
	locales?: string[];
	messages: Dictionary;
}

export interface BundleMap {
	[path: string]: Bundle;
}

const PATH_SEPARATOR: string = has('host-node') ? global.require('path').sep : '/';
const VALID_PATH_PATTERN = new RegExp(PATH_SEPARATOR + '[^' + PATH_SEPARATOR + ']+$');

const createI18n: IntlFactory = compose({
	get direction(this: Intl) {
		return instanceMap.get(this)['direction'] || 'ltr';
	},
	set direction(this: Intl, direction: Direction) {
		instanceMap.get(this)['direction'] = direction;
	},

	get locale(this: Intl): string {
		return instanceMap.get(this)['locale'] || systemLocale;
	},
	set locale(this: Intl, locale: string) {
		instanceMap.get(this)['locale'] = locale;
	},

	load(this: Intl, path: string, locale: string = this.locale as string): Promise<Dictionary> {
		path = path.replace(/\/$/, '');

		try {
			this.validateBundlePath(path);
		}
		catch (error) {
			return Promise.reject(error);
		}

		const registry = dictionaryRegistry.get(this);
		const defaultBundle = registry[path];
		const loader: Loader = this.loader || defaultLoader;
		const defaultBundlePromise = defaultBundle ? Promise.resolve(defaultBundle) :
			loader([ path ]).then(function (bundles: Bundle[]) {
				const defaultBundle = bundles[0];
				registry[path] = defaultBundle;
				return defaultBundle;
			});

		return defaultBundlePromise
			.then(function (this: Intl, defaultBundle: Bundle): Dictionary | Promise<Dictionary> {
				const localePaths = this.resolveLocalePaths(path, locale, defaultBundle.locales as string[]);

				if (!localePaths.length) {
					return defaultBundle.messages;
				}

				const localeDictionary = registry[localePaths[localePaths.length - 1]];

				if (localeDictionary) {
					return localeDictionary.messages;
				}

				return loader(localePaths).then(function (bundles: Bundle[]): Dictionary {
					return bundles.reduce(function (previous: Dictionary, partial: Bundle, i: number): Dictionary {
						const bundle = {
							messages: assign({}, previous, partial.messages)
						};
						const localePath = localePaths[i];
						registry[localePath] = bundle;
						return bundle.messages;
					}, defaultBundle.messages);
				});
			}.bind(this));
	},

	registerStateful: (function () {
		function getIndex(stateful: Stateful<State>, statefuls: StatefulData[]): number {
			let i = statefuls.length - 1;
			let index: number = -1;

			while (i >= 0) {
				if (statefuls[i].stateful === stateful) {
					index = i;
					break;
				}
				i -= 1;
			}

			return index;
		}

		return function (this: Intl, stateful: Stateful<State>, options: StatefulOptions): Promise<Handle> {
			const { keys, locale, path } = options;
			this.validateBundlePath(path);

			const statefulPathData = statefulMap.get(this);
			let statefuls = statefulPathData[path];

			if (!statefuls) {
				statefuls = statefulPathData[path] = [];
			}

			let index = getIndex(stateful, statefuls);

			if (index > -1) {
				statefuls[index].options = options;
			}
			else {
				statefuls.push({ stateful, options });
			}

			return this.load(path, locale).then(function (dictionary: Dictionary) {
				const filtered: Dictionary = filterKeys(keys, dictionary);
				const messages = Array.isArray(keys) ? { messages: filtered } : filtered;
				stateful.setState(messages);

				return {
					destroy(this: Handle) {
						this.destroy = () => {};
						statefuls.splice(getIndex(stateful, statefuls), 1);
					}
				};
			});
		};
	})(),

	resolveLocalePaths(this: Intl, path: string, locale: string, supported?: string[]): string[] {
		this.validateBundlePath(path);

		let filename: string;
		const parentDirectory = path.replace(VALID_PATH_PATTERN, function (matched: string): string {
			filename = matched;
			return PATH_SEPARATOR;
		});
		const locales = getSupportedLocales(locale, supported);
		return locales.map(function (locale: string): string {
			return `${parentDirectory}${locale}${filename}`;
		});
	},

	switchLocale(this: Intl, data: Locale): Promise<void[]> {
		const { direction, locale } = data;
		this.direction = direction as Direction;
		this.locale = locale;

		const statefulPathData = statefulMap.get(this);
		return Promise.all(
			Object.keys(statefulPathData).map((path: string) => {
				return this.load(path).then(function (dictionary: Dictionary) {
					statefulPathData[path].forEach(function (entry: StatefulData) {
						const { options, stateful } = entry;
						const { keys, locale } = options;

						if (!options.locale) {
							const filtered: Dictionary = filterKeys(keys, dictionary);
							const messages = Array.isArray(keys) ? { messages: filtered } : filtered;
							stateful.setState(messages);
						}
					});
				});
			})
		);
	},

	validateBundlePath(path: string): void {
		if (!VALID_PATH_PATTERN.test(path)) {
			const message = 'Invalid i18n bundle path. Bundle maps must adhere to the format' +
				' "{basePath}{separator}{bundleName}" so that locale bundles can be resolved.';
			throw new Error(message);
		}
	}
}, function (instance: Intl, options?: IntlOptions) {
	const bundleMap = {};
	dictionaryRegistry.set(instance, bundleMap as BundleMap);
	instanceMap.set(instance, {});
	statefulMap.set(instance, {});

	if (options) {
		instance.direction = options.direction as Direction;
		instance.loader = options.loader;
		instance.locale = options.locale as string;
	}
});

export default createI18n;

/**
 * The basic dictionary interface.
 */
export interface Dictionary {
	[key: string]: string;
}

export type Direction = 'ltr' | 'rtl';

export interface Intl {
	/**
	 * The root text direction.
	 */
	direction: Direction;

	/**
	 * An optional loader function that will be used to load message bundles.
	 */
	loader?: Loader;

	/**
	 * The root locale.
	 */
	locale: string;

	/**
	 * Load the messages located at the specified path for the optionally-specified locale.
	 *
	 * If a locale is not specified, the loader will return the default messages.
	 *
	 * @param path The module path.
	 * @param locale The optional locale.
	 * @return A promise to the requested messages dictionary.
	 */
	load(path: string, locale?: string): Promise<Dictionary>;

	/**
	 * Register a stateful object with bundle and locale data so that its state is
	 * updated when the appropriate messages bundle successfully loads.
	 *
	 * @param stateful A stateful object.
	 * @param options A configuration object containing the bundle path, keys, and
	 * optionally a locale.
	 * @return A promise to a handle for unregistering the stateful.
	 */
	registerStateful(stateful: Stateful<State>, options: StatefulOptions): Promise<Handle>;

	/**
	 * Converts a bundle's default path to its locale-specific forms. Locales are expected to
	 * be separated by hyphens ("-"). Each cumulative segment will be converted to its own path.
	 * For example, if the locale "ar-IR-NM" is provided for the bundle "nls/common", then
	 * the return value will be `[ 'nls/ar/common', 'nls/ar-IR/common', 'nls/ar-IR-NM/common' ]`.
	 *
	 * @param path The bundle path.
	 * @param locale The locale to load.
	 * @param supported A list of locales that are supported by the bundle.
	 * @return An array of locale-specific bundle paths.
	 */
	resolveLocalePaths(path: string, locale: string, supported?: string[]): string[];

	/**
	 * Update the current state to the specified locale and text direction, load the
	 * locale-specific bundles for all registered statefuls, and update the state of
	 * all registered statefuls that do not have their own locale explicitly set.
	 */
	switchLocale(locale: Locale): Promise<void[]>;

	/**
	 * Validates that bundle's default path matches the format required by the loader.
	 * The default loader requires bundles' default paths to be in the format
	 * "{bundle}{pathSeparator}{module}". For example, if the bundle is located at
	 * "messages/main.ts", then "messages/main" is a valid path, whereas "messages/"
	 * is not.
	 *
	 * @param path The bundle's default path.
	 */
	validateBundlePath(path: string): void;
}

export interface IntlFactory extends ComposeFactory<Intl, IntlOptions> {}

export interface IntlOptions {
	/**
	 * The root text direction.
	 */
	direction?: Direction;

	/**
	 * An optional loader function that will be used to load message bundles.
	 */
	loader?: Loader;

	/**
	 * The root locale.
	 */
	locale?: string;
}

export interface Loader {
	/**
	 * The loader used to load message bundles.
	 *
	 * If not specified, then the default loader will be used, which requires an
	 * absolute (non-relative) module path, as well as that message bundles adhere
	 * to the following directory structure:
	 *
	 * - bundleDir
	 *   - bundleName.ts
	 *   - localeDir
	 *     - bundleName.ts
	 *
	 * @paths - An array of paths representing i18n bundles that should be loaded.
	 * @return A promise to an array of `Bundle` objects.
	 */
	(paths: string[]): Promise<Bundle[]>;
}

export interface Locale {
	/**
	 * The text direction.
	 */
	direction?: Direction;

	/**
	 * The locale string.
	 */
	locale: string;
}

/**
 * An array of message keys, or an object of key aliases used to narrow the
 * values passed to registered statefuls to a subset of the loaded bundle.
 */
export type MessageKeys = string[] | Dictionary;

export interface StatefulOptions {
	/**
	 * An array of message keys, or an object of key aliases used to narrow the
	 * values passed to a stateful to a subset of the loaded bundle.
	 */
	keys: MessageKeys;

	/**
	 * The stateful's locale.
	 */
	locale?: string;

	/**
	 * The path to the bundle from which the stateful should receive its messages.
	 */
	path: string;
}

/**
 * The default environment locale.
 *
 * It should be noted that while the system locale will be normalized to a single
 * format when loading message bundles, this value represents the unaltered
 * locale returned directly by the environment.
 */
export const systemLocale: string = (function () {
	let systemLocale = 'en';
	if (has('host-browser')) {
		systemLocale = navigator.language;
	}
	else if (has('host-node')) {
		systemLocale = global.process.env.LANG;
	}
	return systemLocale;
})();
