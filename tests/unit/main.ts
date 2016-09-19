import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import i18n, { createI18n } from 'src/main';

registerSuite({
	name: 'dojo-i18n/main',

	'assert default export'() {
		assert.instanceOf(i18n, createI18n, 'The default export is an instance of `createI18n`.');
	}
});
