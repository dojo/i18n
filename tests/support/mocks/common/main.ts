import has from 'dojo-core/has';
import { Bundle, Messages } from '../../../../src/i18n';

const locales = [
	'ar',
	'ar-JO'
];

// TODO: The default loader attempts to use the native Node.js `require` when running on Node. However, the Intern
// suite uses the dojo-loader, in which case the context for requires is the location of the loader module; or in
// this case, `node_modules/dojo-loader/dist/umd/loader.js'. Is there a better, less hacky way to handle this?
const basePath = has('host-node') ? '../../../../_build/' : '';
const baseUrl = basePath + 'tests/support/mocks/common/main';

const messages = {
	hello: 'Hello',
	helloReply: 'Hello',
	goodbye: 'Goodbye'
};

const bundle = { baseUrl, locales, messages };
export default bundle as Bundle<Messages>;
