import createStateful from 'dojo-compose/mixins/createStateful';
import has from 'dojo-core/has';
import { Handle } from 'dojo-core/interfaces';
import global from 'dojo-core/global';
import Promise from 'dojo-shim/Promise';
import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import createI18n, {
	Bundle,
	Dictionary,
	Intl,
	Loader,
	systemLocale
} from 'src/createI18n';

// TODO: The default loader attempts to use the native Node.js `require` when running on Node. However, the Intern
// suite uses the dojo-loader, in which case the context for requires is the location of the loader module; or in
// this case, `node_modules/dojo-loader/dist/umd/loader.js'. Is there a better, less hacky way to handle this?
const basePath = has('host-node') ? '../../../../_build/' : '';
const loader: Loader = function (paths: string[]): Promise<Bundle[]> {
	const en = {
		name: 'Name',
		dob: 'Date of Birth',
		address: 'Address'
	};
	const fr = {
		name: 'Nom',
		dob: 'Date de Naissance',
		address: 'Adresse'
	};
	const messages = paths[0].indexOf('/fr') > -1 ? fr : en;
	const locales = [ 'fr' ];

	return Promise.resolve([ { messages, locales } ]);
};

function loadBundle(i18n: Intl, locale?: string) {
	return i18n.load(`${basePath}tests/support/mocks/common/main`, locale);
}

registerSuite({
	name: 'main',

	systemLocale() {
		let expected = 'en';

		if (has('host-browser')) {
			expected = global.navigator.language;
		}
		else if (has('host-node')) {
			expected = global.process.env.LANG;
		}

		assert.strictEqual(systemLocale, expected);
	},

	createI18n: {
		'basic'() {
			assert(createI18n);
			const i18n = createI18n();
			assert(i18n);
		},

		direction() {
			const i18n = createI18n();
			assert.strictEqual(i18n.direction, 'ltr', 'Direction defaults to "ltr".');
			i18n.direction = 'rtl';
			assert.strictEqual(i18n.direction, 'rtl', 'Direction updated.');
		},

		locale() {
			const i18n = createI18n();
			assert.strictEqual(i18n.locale, systemLocale, 'Direction defaults to the system locale.');
			i18n.locale = 'ar-JO';
			assert.strictEqual(i18n.locale, 'ar-JO', 'Locale updated.');
		},

		loader: {
			'basic'() {
				const i18n = createI18n({ loader });
				assert.strictEqual(i18n.loader, loader);
			},

			'assert default loader'() {
				const i18n = createI18n();
				const path = `${basePath}tests/support/mocks/common/main`;

				return i18n.load(path).then(function (dictionary: Dictionary) {
					assert.deepEqual(dictionary, {
						hello: 'Hello',
						helloReply: 'Hello',
						goodbye: 'Goodbye'
					}, 'The paths are mapped to their dictionaries.');
				});
			},

			'assert bad url'(this: any) {
				if (has('host-node')) {
					this.skip('Cannot recover from node module errors.');
				}

				const i18n = createI18n();
				return i18n.load('bogus/path/').then(function () {
					throw new Error('load promise should not resolve.');
				}, function (error) {
					assert(error, 'load promise rejects.');
				});
			},

			'assert used over default'() {
				let callCount = 0;
				const i18n = createI18n({
					loader: function (paths: string[]): Promise<Bundle[]> {
						callCount += 1;
						return loader(paths);
					}
				});

				return i18n.load('nls/common').then(function () {
					assert.strictEqual(callCount, 1, 'Custom loader used.');
				});
			}
		},

		'.load()': {
			'assert invalid path'() {
				const i18n = createI18n({ loader });

				return i18n.load('path').then(function () {
					throw new Error('Load promise should not resolve.');
				}, function (error: Error) {
					const expected = 'Invalid i18n bundle path. Bundle maps must adhere to the format ' +
						'"{basePath}{separator}{bundleName}" so that locale bundles can be resolved.';
					assert.strictEqual(error.message, expected);
				});
			},

			'without a locale'() {
				const i18n = createI18n({ loader });

				return i18n.load('nls/common').then(function (dictionary: Dictionary) {
					assert.deepEqual(dictionary, {
						name: 'Name',
						dob: 'Date of Birth',
						address: 'Address'
					}, 'The path is mapped to its dictionary.');
				});
			},

			'with locale': {
				'assert unsupported locale': function () {
					const i18n = createI18n();
					return loadBundle(i18n).then(function (fallback: Dictionary) {
						return loadBundle(i18n, 'gibberish-Gibberland')
							.then(function (dictionary: Dictionary) {
								assert.deepEqual(dictionary, fallback, 'The fallback locale is used.');
							});
					});
				},

				'assert with supported locale': function () {
					const i18n = createI18n();
					return loadBundle(i18n, 'ar')
						.then(function (dictionary: Dictionary) {
							assert.deepEqual(dictionary, {
								hello: 'السلام عليكم',
								helloReply: 'و عليكم السام',
								goodbye: 'مع السلامة'
							}, 'Locale dictionary is used.');
						});
				},

				'assert with nested locale': function () {
					const i18n = createI18n();
					return loadBundle(i18n, 'ar-JO')
						.then(function (dictionary: Dictionary) {
							// ar-JO is missing "goodbye" key
							assert.deepEqual(dictionary, {
								hello: 'مرحبا',
								helloReply: 'مرحبتين',
								goodbye: 'مع السلامة'
							}, 'Most specific dictionary is used with fallbacks provided.');
						});
				}
			},

			'caching': {
				'assert default bundle'() {
					let callCount = 0;
					const i18n = createI18n({
						loader: function (paths: string[]): Promise<Bundle[]> {
							callCount += 1;
							return loader(paths);
						}
					});

					return i18n.load('nls/common').then(function () {
						return i18n.load('nls/common');
					}).then(function () {
						assert.strictEqual(callCount, 1, 'The same bundle is loaded once.');
					});
				},

				'assert locale bundle'() {
					const i18n = createI18n();
					const locale = 'ar-JO';

					return loadBundle(i18n, locale).then(function (dictionary: Dictionary) {
						return loadBundle(i18n, locale).then(function (cached: Dictionary) {
							assert.strictEqual(cached, dictionary, 'Locale dictionaries are cached.');
						});
					});
				}
			}
		},

		'.registerStateful()': {
			'assert with invalid path'() {
				const i18n = createI18n({ loader });
				const stateful = createStateful();

				assert.throws(function () {
					i18n.registerStateful(stateful, {
						path: 'invalid',
						keys: [ 'name', 'address' ]
					});
				});
			},

			'assert with array of keys'() {
				const i18n = createI18n({ loader });
				const stateful = createStateful();

				return i18n.registerStateful(stateful, {
					path: 'nls/common',
					keys: [ 'name', 'address' ]
				}).then(function () {
					const state: any = stateful.state;
					assert.deepEqual(state.messages, {
						name: 'Name',
						address: 'Address'
					});
				});
			},

			'assert with key aliasing'() {
				const i18n = createI18n({ loader });
				const stateful = createStateful();

				return i18n.registerStateful(stateful, {
					path: 'nls/common',
					keys: {
						name: 'userFullName',
						address: 'userAddress'
					}
				}).then(function () {
					const state: any = stateful.state;

					assert.strictEqual(state.userFullName, 'Name');
					assert.strictEqual(state.userAddress, 'Address');
				});
			},

			'assert with a locale'() {
				const i18n = createI18n({ loader });
				const stateful = createStateful();

				return i18n.registerStateful(stateful, {
					locale: 'fr',
					path: 'nls/common',
					keys: [ 'name', 'dob', 'address' ]
				}).then(function () {
					const state: any = stateful.state;

					assert.deepEqual(state.messages, {
						name: 'Nom',
						dob: 'Date de Naissance',
						address: 'Adresse'
					}, 'Locale-specific messages are used.');
				});
			},

			'assert registered with twice with different options'() {
				const i18n = createI18n({ loader });
				const stateful = createStateful();

				return i18n.registerStateful(stateful, {
					path: 'nls/common',
					keys: [ 'name', 'address' ]
				}).then(function () {
					return i18n.registerStateful(stateful, {
						path: 'nls/common',
						keys: {
							name: 'userFullName',
							address: 'userAddress'
						}
					});
				}).then(function () {
					const state: any = stateful.state;

					assert.strictEqual(state.userFullName, 'Name');
					assert.strictEqual(state.userAddress, 'Address');
				});
			},

			'assert handle'() {
				const i18n = createI18n({ loader });
				const stateful = createStateful();

				return i18n.registerStateful(stateful, {
					path: 'nls/common',
					keys: {
						name: 'userFullName',
						address: 'userAddress'
					}
				}).then(function (handle: Handle) {
					handle.destroy();

					return i18n.switchLocale({ locale: 'fr' });
				}).then(function () {
					const state: any = stateful.state;
					const { userFullName, userAddress } = state;
					assert.deepEqual({ userFullName, userAddress }, {
						userFullName: 'Name',
						userAddress: 'Address'
					}, 'State does not change.');
				});
			}
		},

		'.resolveLocalePaths()': {
			'assert invalid path'() {
				const i18n = createI18n();
				const expected = 'Invalid i18n bundle path. Bundle maps must adhere to the format ' +
					'"{basePath}{separator}{bundleName}" so that locale bundles can be resolved.';

				assert.throws(function () {
					i18n.resolveLocalePaths('path', 'fr', [ 'fr' ]);
				}, Error, expected);
			},

			'assert supported simple locale'() {
				const i18n = createI18n();
				const paths = i18n.resolveLocalePaths('nls/common', 'fr', [ 'fr' ]);
				assert.sameMembers(paths, [ 'nls/fr/common' ]);
			},

			'assert unsupported simple locale'() {
				const i18n = createI18n();
				const paths = i18n.resolveLocalePaths('nls/common', 'fr');
				assert.sameMembers(paths, []);
			},

			'assert supported complex locale'() {
				const i18n = createI18n();
				const paths = i18n.resolveLocalePaths('nls/common', 'ar-JO-NM', [ 'ar', 'ar-JO', 'ar-JO-NM' ]);
				assert.sameMembers(paths, [
					'nls/ar/common',
					'nls/ar-JO/common',
					'nls/ar-JO-NM/common'
				]);
			},

			'assert unsupported complex locale'() {
				const i18n = createI18n();
				const paths = i18n.resolveLocalePaths('nls/common', 'ar-JO-NM', [ 'ar', 'ar-JO' ]);
				assert.sameMembers(paths, [
					'nls/ar/common',
					'nls/ar-JO/common'
				]);
			}
		},

		'.switchLocale()': {
			'assert basic'() {
				const i18n = createI18n();
				i18n.switchLocale({
					direction: 'rtl',
					locale: 'ar-JO'
				});

				assert.strictEqual(i18n.direction, 'rtl');
				assert.strictEqual(i18n.locale, 'ar-JO');
			},

			'assert statefuls without locales'() {
				const i18n = createI18n({ loader });
				const first = createStateful();
				const second = createStateful();

				return Promise.all([
					i18n.registerStateful(first, {
						path: 'nls/common',
						keys: [ 'name', 'address' ]
					}),
					i18n.registerStateful(second, {
						path: 'nls/common',
						keys: { name: 'name', address: 'address' }
					})
				]).then(function () {
					return i18n.switchLocale({ locale: 'fr' });
				}).then(function () {
					const firstState: any = first.state;
					const secondState: any = second.state;

					assert.deepEqual(firstState.messages, {
						name: 'Nom',
						address: 'Adresse'
					});
					assert.strictEqual(secondState.name, 'Nom');
					assert.strictEqual(secondState.address, 'Adresse');
				});
			},

			'assert statefuls with locales'() {
				const i18n = createI18n({ loader });
				const first = createStateful();
				const second = createStateful();

				return Promise.all([
					i18n.registerStateful(first, {
						locale: 'en',
						path: 'nls/common',
						keys: [ 'name', 'address' ]
					}),
					i18n.registerStateful(second, {
						locale: 'en',
						path: 'nls/common',
						keys: { name: 'name', address: 'address' }
					})
				]).then(function () {
					return i18n.switchLocale({ locale: 'fr' });
				}).then(function () {
					const firstState: any = first.state;
					const secondState: any = second.state;

					assert.deepEqual(firstState.messages, {
						name: 'Name',
						address: 'Address'
					});
					assert.strictEqual(secondState.name, 'Name');
					assert.strictEqual(secondState.address, 'Address');
				});
			}
		},

		'.validateBundlePath()': {
			'assert invalid path'() {
				const i18n = createI18n();

				assert.throws(function () {
					i18n.validateBundlePath('path');
				});
			},

			'assert valid path'() {
				const i18n = createI18n();

				assert.doesNotThrow(function () {
					i18n.validateBundlePath('nls/common');
				});
				assert.doesNotThrow(function () {
					i18n.validateBundlePath('arbitrary/nested/path/super/long/main');
				});
			}
		}
	}
});
