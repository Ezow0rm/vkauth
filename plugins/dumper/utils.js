import { promises as fs } from 'node:fs';
import { resolve as _resolve, dirname } from 'node:path';
import { createWriteStream } from 'node:fs';
import { promisify } from 'node:util';
import handlebars from 'handlebars';
import { fileURLToPath } from 'node:url';

/**
 *
 * @param {string} path
 */
export function mkdir(path) {
	return fs
		.opendir(path)
		.then((directory) => directory.close())
		.catch(() => fs.mkdir(path, { recursive: true }));
}

/**
 *
 * @param {string} path
 * @param {string} text
 */
export function writeFile(path, text) {
	return fs.writeFile(path, text, 'utf8');
}

/**
 *
 * @param {string} path
 * @param {*} data
 */
export function writeJSON(path, data) {
	return writeFile(path, JSON.stringify(data, undefined, 2) || 'null');
}

/**
 *
 * @param {string} from
 * @param {string} to
 */
export async function download(from, to) {
	const { body } = await fetch(from);
	const writer = createWriteStream(to);

	body.pipe(writer);

	await new Promise((resolve, reject) => {
		body.on('end', resolve);
		body.on('error', reject);
	});
}

/**
 * @template T
 * @param {T[]} array
 * @param {number} groupBy
 * @returns {T[][]}
 */
function chunk(array, groupBy) {
	/** @type {T[][]} */
	const result = [];

	for (let index = 0; index < array.length; index += groupBy) {
		result.push(array.slice(index, index + groupBy));
	}

	return result;
}

/**
 * @template T
 * @template X
 * @param {(arg: T) => Promise<X>} function_
 * @param {T[]} data
 * @param {number} [maxParallel=5]
 * @returns {Promise<X[]>}
 */
export async function parallel(function_, data, maxParallel = 5) {
	/** @type {X[]} */
	const result = [];

	for (const bunch of chunk(data, maxParallel)) {
		const tasks = bunch.map((value) => function_(value));

		const results = await Promise.all(tasks);

		result.push(...results);
	}

	return result;
}

export const sleep = promisify(setTimeout);

/**
 *
 * @param {string} title
 * @param {string} body
 * @param {string} style
 */
export function createHTML(title, body) {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf8" />
  <title>${title}</title>
</head>
<body>
  ${body}
</body>
</html>`;
}

/**
 * @typedef {{
 *  width: number,
 *  height: number,
 *  url: string
 * }} _size
 *
 * @param {_size[]} sizes
 * @returns {_size}
 */
export function findBiggestSize(sizes) {
	return sizes.reduce((sz1, sz2) => (sz1.width * sz1.height > sz2.width * sz2.height ? sz1 : sz2));
}

/**
 * @typedef {{
 *  width: number,
 *  height: number,
 *  url: string
 * }} _size
 *
 * @param {_size[]} sizes
 * @returns {string}
 */
export function photoSizes2Html(sizes) {
	return sizes.map((sz) => `${sz.url} ${sz.width}w`).join(',\n');
}

const TEMPLATES_PATH = _resolve(dirname(fileURLToPath(import.meta.url)), 'templates');

/**
 *
 * @param {string} name
 * @returns {Promise<(data: string) => any>}
 */
export async function getTemplate(name) {
	const text = await fs.readFile(_resolve(TEMPLATES_PATH, `${name}.hbs`), 'utf8');

	return handlebars.compile(text);
}

/**
 *
 * @param {string} name
 * @param {*} data
 * @param {boolean=} [noCache=false]
 *
 * @returns {Promise<string>}
 */
export async function renderTemplate(name, data, noCache = false) {
	const cache = new Map();

	let template = !noCache && cache.get(name);

	if (!template) {
		template = await getTemplate(name);
		cache.set(name, template);
	}

	return template(data);
}

/**
 *
 * @param {string} vkBirthDate `dd.mm.yyyy`
 * @returns {number|undefined} Approximate age of user
 */
export function getAge(vkBirthDate) {
	if (!vkBirthDate) return;
	const year = vkBirthDate.split('.')[2];

	if (!year) return;

	const currentYear = new Date().getFullYear();
	const birthYear = Number.parseInt(year);

	if (!birthYear) return;

	return currentYear - birthYear;
}
