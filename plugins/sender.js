import chalk from 'chalk';

const { blueBright } = chalk;

export const name = 'Sender';

// Methods without body
const methodsWOBody = new Set(['HEAD', 'GET']);

/**
 * Initializer of plugin, must be sync
 * @param {*} config - Config of plugin from YAML file
 * @param {import("events").EventEmitter} ee - Events pipe
 */
export function init({ url, method = 'POST', events = [], headers = {} }, ee) {
	method = method.toUpperCase();

	for (const event of events) {
		ee.on(event, (data) => {
			const querystring = new URLSearchParams(data);
			let destinationUrl = url;
			let body;

			if (methodsWOBody.has(method)) {
				destinationUrl += '?' + querystring;
			} else {
				body = querystring;
				headers['Content-Type'] = 'application/x-www-form-urlencoded';
			}

			console.log(blueBright(`Отправлен ${event} на ${url}`));

			fetch(destinationUrl, {
				body,
				headers,
				method,
				follow: true
			});
		});
	}
}
