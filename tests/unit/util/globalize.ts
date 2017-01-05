import * as Globalize from 'globalize';
import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import loadCldrData from '../../../src/cldr/load';
import { switchLocale, systemLocale } from '../../../src/i18n';
import getGlobalize, { normalizeOptions } from '../../../src/util/globalize';

registerSuite({
	name: 'util/globalize',

	setup() {
		// Load the CLDR data for the locales used in the tests ('en' and 'fr');
		return switchLocale('en').then(() => {
			return loadCldrData('fr');
		});
	},

	teardown() {
		return switchLocale(systemLocale);
	},

	getGlobalize() {
		assert.strictEqual(getGlobalize(), Globalize, 'The main globalize object is returned.');
		assert.instanceOf(getGlobalize('fr'), Globalize, 'A Globalize instance is returned.');
		assert.notEqual(getGlobalize('fr'), Globalize, 'The main globalize object is not returned.');
	},

	normalizeOptions() {
		assert.isUndefined(normalizeOptions());
		assert.isUndefined(normalizeOptions(null));
		assert.strictEqual(normalizeOptions(12), 12);
		assert.strictEqual(normalizeOptions('full'), 'full');

		const options = { value: new Date() };
		assert.strictEqual(normalizeOptions(options), options);
	}
});
