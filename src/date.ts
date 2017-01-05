import 'globalize/dist/globalize/date';
import 'globalize/dist/globalize/relative-time';
import getGlobalize, { normalizeOptions } from './util/globalize';

export type DateFormatterOptions = null | {
	/**
	 * String value indicating a skeleton, eg. { skeleton: "GyMMMd" }.
	 * Skeleton provides a more flexible formatting mechanism than the predefined list full, long, medium, or short represented by date, time, or datetime.
	 * Instead, they are an open-ended list of patterns containing only date field information, and in a canonical order.
	 */
	skeleton?: string;

	/**
	 * One of the following String values: full, long, medium, or short, eg. { date: "full" }.
	 */
	date?: DateLength;

	/**
	 * One of the following String values: full, long, medium, or short, eg. { time: "full" }.
	 */
	time?: DateLength;

	/**
	 * One of the following String values: full, long, medium, or short, eg. { datetime: "full" }
	 */
	datetime?: DateLength;
}

export type DateLength = 'short' | 'medium' | 'long' | 'full';

export type RelativeTimeFormatterOptions = null | {
	/**
	 * eg. "short" or "narrow". Or falsy for default long form
	 */
	form?: RelativeTimeLength;
}

export type RelativeTimeLength = 'short' | 'narrow';

/**
 * Format a date according to the specified options for the specified or current locale.
 *
 * @param value
 * The date to format.
 *
 * @param options
 * An optional object of formatting options.
 *
 * @param locale
 * An optional locale. Defaults to the root locale.
 *
 * @return
 * The formatted date string.
 */
export function formatDate(value: Date, options?: DateFormatterOptions, locale?: string): string {
	return getGlobalize(locale).formatDate(value, normalizeOptions(options));
}

/**
 * Format a number as a unit of relative time for the specified unit and optional locale.
 * E.g., `formatRelativeTime(1, 'week', { form: 'short' }, 'fr'` ("la semaine prochaine")
 *
 * @param value
 * The relative unit number. Positive numbers indicate future events (e.g., "in 2 days") while negative numbers
 * represent past events (e.g., "1 day ago").
 *
 * @param unit
 * E.g., "week", "day", "month", etc.
 *
 * @param options
 * An optional object of formatting options.
 *
 * @param locale
 * An optional locale. Defaults to the current locale.
 */
export function formatRelativeTime(value: number, unit: string, options?: RelativeTimeFormatterOptions, locale?: string): string {
	return getGlobalize(locale).formatRelativeTime(value, unit, normalizeOptions(options));
}

/**
 * Return a date formatter that accepts a date and formats it according to the specified options for the
 * specified or current locale.
 *
 * @param options
 * An optional object of formatting options.
 *
 * @param locale
 * The optional locale. Defaults to the root locale.
 *
 * @return
 * A function that accepts a date and returns a formatted date string.
 */
export function getDateFormatter(options?: DateFormatterOptions, locale?: string): (value: Date) => string {
	return getGlobalize(locale).dateFormatter(normalizeOptions(options));
}

/**
 * Return a function that parses a string into a date object, according any optional settings or locale.
 *
 * @param options
 * An optional config that describes the format of the string.
 *
 * @param locale
 * The optional locale. Defaults to the root locale.
 *
 * @return
 * A function that accepts a string and returns a date object.
 */
export function getDateParser(options?: DateFormatterOptions, locale?: string): (value: string) => Date {
	return getGlobalize(locale).dateParser(normalizeOptions(options));
}

/**
 * Format a number as a unit of relative time for the specified unit and optional locale.
 * E.g., `formatRelativeTime(1, 'week', { form: 'short' }, 'fr'` ("la semaine prochaine")
 *
 * @param unit
 * E.g., "week", "day", "month", etc.
 *
 * @param options
 * An optional object of formatting options.
 *
 * @param locale
 * The optional locale. Defaults to the root locale.
 *
 * @return
 * A function that accepts a relative time number and returns a formatted string. Positive numbers indicate future
 * events (e.g., "in 2 days") while negative numbers represent past events (e.g., "1 day ago").
 */
export function getRelativeTimeFormatter(unit: string, options?: RelativeTimeFormatterOptions, locale?: string): (value: number) => string {
	return getGlobalize(locale).relativeTimeFormatter(unit, normalizeOptions(options));
}

/**
 * Convert a string into a date object, according any optional settings or locale.
 *
 * @param value
 * The date string to convert.
 *
 * @param options
 * An optional config that describes the format of the string.
 *
 * @param locale
 * The optional locale. Defaults to the root locale.
 *
 * @return
 * The formatted date.
 */
export function parseDate(value: string, options?: DateFormatterOptions, locale?: string): Date {
	return getGlobalize(locale).parseDate(value, normalizeOptions(options));
}
