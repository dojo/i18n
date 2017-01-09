import * as Globalize from 'globalize';
import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import loadCldrData from '../../../src/cldr/load';
import { switchLocale, systemLocale } from '../../../src/i18n';
import getGlobalize, { resolveFormatterArguments } from '../../../src/util/globalize';

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

	resolveFormatterArguments() {
		assert.deepEqual(resolveFormatterArguments('en'), { locale: 'en' });
		assert.deepEqual(resolveFormatterArguments({ time: 'full' }, 'en'), {
			locale: 'en',
			options: { time: 'full' }
		});
		assert.deepEqual(resolveFormatterArguments({ time: 'full' }), {
			options: { time: 'full' }
		});
		assert.deepEqual(resolveFormatterArguments(), {});
	}
});
