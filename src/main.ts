import createI18n, {
	Bundle,
	BundleMap,
	Dictionary,
	Intl,
	IntlFactory,
	IntlOptions,
	Loader,
	Locale,
	MessageKeys,
	StatefulOptions,
	systemLocale
} from './createI18n';

const i18n = createI18n();
export default i18n;

export {
	Bundle,
	BundleMap,
	createI18n,
	Dictionary,
	Intl,
	IntlFactory,
	IntlOptions,
	Loader,
	Locale,
	MessageKeys,
	StatefulOptions,
	systemLocale
};
