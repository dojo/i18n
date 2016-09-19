# dojo-i18n

An internationalization library that provides locale-specific message loading, and support for locale-specific message, date, and number formatting.

## Features

The examples below are provided in TypeScript syntax. The package does work under JavaScript, but for clarity, the examples will only include one syntax.

### Message bundle loading

`dojo-i18n` provides a means for loading locale-specific messages, and updating those messages when the locale changes. Messages are loaded via the `load` method. For example, suppose the module located at `nls/common.ts` contains the following contents:

```typescript
const messages = {
	hello: 'Hello',
	goodbye: 'Goodbye'
};
export default messages;
```

The above messages would be loaded by passing the path to `i18n.load`. Unfortunately, since the ES2016 module format does not support plugins or conditional loading, the bundle paths must be absolute (non-relative).

```typescript
import i18n, { Dictionary } from 'dojo-i18n/main';

i18n.load('nls/common').then(function (messages: Dictionary) {
	console.log(messages.hello); // "Hello"
	console.log(messages.goodbye); // "Goodbye"
});
```

To load messages for a specific locale, two updates are required. First, the default module above needs a list of supported locales:

```typescript
const messages = {
	hello: 'Hello',
	goodbye: 'Goodbye'
};
export default messages;

export locales = [ 'fr' ];
```

The `locales` array indicates that the listed locales have corresponding directories underneath the parent directory. In the above example, the fact that "fr" (French) is supported indicates that the parent directory of `nls/common.ts` also contains a `fr/common.ts` module (which would be represented by the module ID `nls/fr/common.ts`). Alternatively, if the default message were housed in the module ID `arbitrary/path/numbers.ts`, the corresponding "fr" messages would be expected at `arbitrary/path/fr/numbers.ts`. This path format is required by the default loader, but can be overridden for custom implementations (see below).

Second, `i18n.load` needs to be passed the locale string:

```typescript
import i18n, { Dictionary } from 'dojo-i18n/main';

i18n.load('nls/common', 'fr').then(function (messages: Dictionary) {
	console.log(messages.hello); // "Bonjour"
	console.log(messages.goodbye); // "Au revoir"
});
```

If an unsupported locale is passed to `i18n.load`, then the default messages are returned. As such, the default bundle should contain _all_ message keys used by any of the locale-specific bundles.

### Support for `Stateful` instances

[`Stateful`](https://github.com/dojo/compose/blob/master/src/mixins/createStateful.ts) objects can be registered with `i18n`, which will call `setState` on those objects once their required message bundles have been loaded. This is accomplished by calling `i18n.registerStateful`, which accepts two arguments: the `Stateful` object, and a configuration object containing the bundle data, the required keys, and an optional locale.

```typescript
import createStateful from 'dojo-compose/mixins/createStateful';
import { Handle } from 'dojo-core/interfaces';
import i18n from 'dojo-i18n/main';

const createGlobalizedStateful = createStateful
	.mixin({
		initialize(instance) {
			instance.own(instance.on('statechange', () => {
				console.log(this.state.greeting); // 'Bonjour'
				console.log(this.state.farewell); // 'Au revoir'
			}));
		}
	});

const stateful = createGlobalizedStateful();
i18n.registerStateful(stateful, {
	locale: 'fr',
	path: 'nls/common',
	keys: {
		hello: 'greeting',
		goodbye: 'farewell'
	}
}).then(function (handle: Handle) {
	stateful.own(handle);
}, function (error: Error) {
	// For some reason the bundle could not be loaded.
});
```

The `path` and `keys` values MUST be supplied to the configuration object. If the locale is left out of the configuration object, then the default locale will be used.

In the above example, the configuration object's `keys` property is a map of bundle keys to stateful properties. So when the message bundle loads, the bundle's `hello` key is mapped to the stateful's `greeting` state property, and the bundle's `goodbye` key is mapped to the stateful's `farewell` state property. Alternatively, had an array of keys been supplied (e.g., `keys: [ 'hello', 'goodbye' ]`), then `stateful.setState` would have been called with a single `messages` map of keys to messages (e.g., `{ hello: 'Bonjour', goodbye: 'Au revoir' }`).

### Changing the current locale

`i18n.switchLocale` changes the root locale and text direction, and updates the state on all registered statefuls that do not have a locale specified. For example, in the following example, only the second stateful will be updated when the locale is switched since it does not have its own locale explicitly set.

```typescript
import createStateful from 'dojo-compose/mixins/createStateful';
import i18n from 'dojo-i18n/main';

const first = createStateful();
const second = createStateful();

const path = 'nls/common';
const keys = [ 'hello', 'goodbye' ];
i18n.registerLocale(first, { locale: 'fr', path, keys });
i18n.registerLocale(second, { path, keys });

i18n.switchLocale({ locale: 'ar', direction: 'rtl' });

// After `setState` has been called...
// The first stateful is not updated since it has its own specific locale.
console.log(first.state.messages.hello); // "Hello"
console.log(first.state.messages.goodbye); // "Goodbye"

// The second stateful is updated to reflect the new locale.
console.log(second.state.messages.hello); // "مرحبا"
console.log(second.state.messages.goodbye); // "مع السلامة"
```

### Overriding default behavior

The main package export is the `i18n` singleton, but this is actually an instance created by the `dojo-i18n/createI18n` [`compose`](https://github.com/dojo/compose) factory, which can be extended as needed.

```typescript
import createI18n, { Bundle, Loader } from 'dojo-i18n/createI18n';

const loader = function (paths: string[]): Bundle[] {
	// custom loader implementation...
}

const createAppI18n = createI18n
	.mixin({
		resolveLocalePaths(path: string, locale: string, supported?: string[]): string[] {
			// Instead of using the format "{bundle}/{locale}/{module}",
			// use the format "{bundle}/module?locale={locale}".
			return locale ? `${path}?locale=${locale}` : path;
		},

		validatePath(path: string): void {
			// Override the default loader's requirement that all paths must specify
			// both the bundle and module names. noop instead of throwing an error.
		}
	})
	.extend({
		loader
	});

const i18n = createAppI18n();
```

### Custom message formatting (e.g., pluralization)

This is currently not provided, but will be added in the near future.

### Date and number formatting.

This is currently not provided, but will be added in the near future.

## How do I use this package?

TODO: Add appropriate usage and instruction guidelines

## How do I contribute?

We appreciate your interest!  Please see the [Guidelines Repository](https://github.com/dojo/guidelines#readme) for the
Contributing Guidelines and Style Guide.

## Testing

Test cases MUST be written using Intern using the Object test interface and Assert assertion interface.

90% branch coverage MUST be provided for all code submitted to this repository, as reported by istanbul’s combined coverage results for all supported platforms.

## Licensing information

* [Third-party lib one](https//github.com/foo/bar) ([New BSD](http://opensource.org/licenses/BSD-3-Clause))

© 2004–2015 Dojo Foundation & contributors. [New BSD](http://opensource.org/licenses/BSD-3-Clause) license.

